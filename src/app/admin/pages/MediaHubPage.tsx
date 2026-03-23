
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { MediaPhoto, NewsPost } from "../../content/types";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

export function MediaHubPageAdmin() {
  const photosCRUD = useAdminCRUD<MediaPhoto>("mediaPhoto");
  const newsCRUD = useAdminCRUD<NewsPost>("newsPost");
  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoEditingId, setPhotoEditingId] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoForm, setPhotoForm] = useState<MediaPhoto>({
    title: "",
    category: "Training",
    date: "",
    image: { originalUrl: "", largeUrl: "", mediumUrl: "", thumbUrl: "" },
    caption: "",
    order: 0,
  });

  const [newsOpen, setNewsOpen] = useState(false);
  const [newsEditingId, setNewsEditingId] = useState<string | null>(null);
  const [newsUploading, setNewsUploading] = useState(false);
  const [newsForm, setNewsForm] = useState<NewsPost>({
    title: "",
    excerpt: "",
    bodyHtml: "",
    date: "",
    image: { url: "", alt: "", caption: "" },
    scheduledAt: "",
    order: 0,
  });

  const [bulkPhotosOpen, setBulkPhotosOpen] = useState(false);
  const [bulkPhotosUploading, setBulkPhotosUploading] = useState(false);
  const [bulkPhotoCategory, setBulkPhotoCategory] = useState("Training");
  const [bulkPhotoDate, setBulkPhotoDate] = useState(new Date().toISOString().slice(0, 10));
  const [bulkPhotoCaption, setBulkPhotoCaption] = useState("");

  const [bulkNewsOpen, setBulkNewsOpen] = useState(false);
  const [bulkNewsText, setBulkNewsText] = useState("");

  const sortedPhotos = useMemo(
    () => [...photosCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [photosCRUD.items]
  );
  const sortedNews = useMemo(
    () => [...newsCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [newsCRUD.items]
  );

  const openPhoto = (item?: any) => {
    if (item) {
      setPhotoEditingId(item.id);
      setPhotoForm(item.data);
    } else {
      setPhotoEditingId(null);
      setPhotoForm({
        title: "",
        category: "Training",
        date: new Date().toISOString().slice(0, 10),
        image: { originalUrl: "", largeUrl: "", mediumUrl: "", thumbUrl: "" },
        caption: "",
        order: 0,
      });
    }
    setPhotoOpen(true);
  };

  const openNews = (item?: any) => {
    if (item) {
      setNewsEditingId(item.id);
      setNewsForm(item.data);
    } else {
      setNewsEditingId(null);
      setNewsForm({
        title: "",
        excerpt: "",
        bodyHtml: "",
        date: new Date().toISOString().slice(0, 10),
        image: { url: "", alt: "", caption: "" },
        scheduledAt: "",
        order: 0,
      });
    }
    setNewsOpen(true);
  };

  const onPhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const img = await photosCRUD.upload(file);
      setPhotoForm((p) => ({
        ...p,
        image: {
          originalUrl: img.originalUrl,
          largeUrl: img.largeUrl,
          mediumUrl: img.mediumUrl,
          thumbUrl: img.thumbUrl,
        },
      }));
      toast.success("Photo uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setPhotoUploading(false);
    }
  };

  const onNewsFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewsUploading(true);
    try {
      const img = await newsCRUD.upload(file);
      setNewsForm((p) => ({
        ...p,
        image: {
          url: img.originalUrl,
          alt: p.title || file.name,
          caption: p.image?.caption || "",
        },
      }));
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setNewsUploading(false);
    }
  };

  const submitPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.image?.originalUrl) {
      toast.error("Please upload a photo");
      return;
    }
    try {
      if (photoEditingId) {
        await photosCRUD.updateItem(photoEditingId, photoForm);
        toast.success("Photo updated successfully");
      } else {
        await photosCRUD.createItem(photoForm, "published");
        toast.success("Photo created successfully");
      }
      setPhotoOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.image?.url) {
      toast.error("Please upload an image");
      return;
    }
    try {
      if (newsEditingId) {
        await newsCRUD.updateItem(newsEditingId, newsForm);
        toast.success("News post updated successfully");
      } else {
        await newsCRUD.createItem(newsForm, "published");
        toast.success("News post created successfully");
      }
      setNewsOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await photosCRUD.deleteItem(id);
      toast.success("Photo deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news post?")) return;
    try {
      await newsCRUD.deleteItem(id);
      toast.success("News post deleted successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  };

  const normalizeTitleFromFileName = (name: string) =>
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const runPool = async <T, R>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<R>) => {
    const results: R[] = new Array(items.length) as any;
    let nextIndex = 0;
    const runners = new Array(Math.max(1, concurrency)).fill(null).map(async () => {
      while (nextIndex < items.length) {
        const i = nextIndex++;
        results[i] = await worker(items[i], i);
      }
    });
    await Promise.all(runners);
    return results;
  };

  const bulkUploadPhotos = async (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    setBulkPhotosUploading(true);
    try {
      const startOrder = Math.max(0, ...photosCRUD.items.map((i) => i.data.order ?? 0)) + 10;
      const uploaded = await runPool(list, 3, async (file) => {
        const img = await photosCRUD.upload(file);
        return { file, img };
      });
      const rows = uploaded.map(({ file, img }, idx) => {
        const title = normalizeTitleFromFileName(file.name);
        const photo: MediaPhoto = {
          title,
          category: bulkPhotoCategory || "Training",
          date: bulkPhotoDate || new Date().toISOString().slice(0, 10),
          image: {
            originalUrl: img.originalUrl,
            largeUrl: img.largeUrl,
            mediumUrl: img.mediumUrl,
            thumbUrl: img.thumbUrl,
          },
          caption: bulkPhotoCaption || "",
          order: startOrder + idx * 10,
        };
        return { data: photo, status: "published" as const };
      });
      await photosCRUD.createMany(rows);
      toast.success(`Uploaded ${rows.length} photo${rows.length === 1 ? "" : "s"}`);
      setBulkPhotosOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Bulk upload failed");
    } finally {
      setBulkPhotosUploading(false);
    }
  };

  const parseBulkNews = (text: string): NewsPost[] => {
    const trimmed = text.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      return arr.map((x: any, idx: number) => ({
        title: String(x.title ?? ""),
        excerpt: String(x.excerpt ?? ""),
        bodyHtml: String(x.bodyHtml ?? x.body ?? ""),
        date: String(x.date ?? new Date().toISOString().slice(0, 10)),
        image: {
          url: String(x.imageUrl ?? x.image?.url ?? placeholderPhotoUrl),
          alt: String(x.imageAlt ?? x.image?.alt ?? String(x.title ?? "")),
          caption: String(x.imageCaption ?? x.image?.caption ?? ""),
        },
        scheduledAt: String(x.scheduledAt ?? ""),
        order: Number(x.order ?? (idx + 1) * 10),
      }));
    }
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line, idx) => {
      const cells = line.split(",").map((c) => c.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
      const title = row.title ?? "";
      return {
        title,
        excerpt: row.excerpt ?? "",
        bodyHtml: row.bodyHtml ?? row.body ?? "",
        date: row.date ?? new Date().toISOString().slice(0, 10),
        image: {
          url: row.imageUrl ?? placeholderPhotoUrl,
          alt: row.imageAlt ?? title,
          caption: row.imageCaption ?? "",
        },
        scheduledAt: row.scheduledAt ?? "",
        order: Number(row.order ?? (idx + 1) * 10),
      };
    });
  };

  const bulkImportNews = async () => {
    try {
      const rows = parseBulkNews(bulkNewsText)
        .filter((n) => n.title.trim().length > 0)
        .map((n) => ({ data: n, status: "published" as const }));
      if (rows.length === 0) {
        toast.error("No valid news rows found");
        return;
      }
      await newsCRUD.createMany(rows);
      toast.success(`Imported ${rows.length} news post${rows.length === 1 ? "" : "s"}`);
      setBulkNewsText("");
      setBulkNewsOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Bulk import failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Media Hub Management</h1>
      <Tabs defaultValue="photos">
        <TabsList className="mb-4">
          <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
          <TabsTrigger value="news">News & Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Photo Gallery</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBulkPhotosOpen(true)}>
                  Bulk Upload
                </Button>
                <Button onClick={() => openPhoto()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {photosCRUD.loading && photosCRUD.items.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPhotos.map((item) => {
                    const src =
                      item.data.image?.thumbUrl ||
                      item.data.image?.mediumUrl ||
                      item.data.image?.largeUrl ||
                      item.data.image?.originalUrl ||
                      "";
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded overflow-hidden bg-muted border flex items-center justify-center">
                            {src ? (
                              <img src={src} alt={item.data.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.data.title}</TableCell>
                        <TableCell>{item.data.category}</TableCell>
                        <TableCell>{item.data.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => openPhoto(item)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deletePhoto(item.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {sortedPhotos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No photos yet. Upload your first one.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>News Posts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBulkNewsOpen(true)}>
                  Bulk Import
                </Button>
                <Button onClick={() => openNews()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add News Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {newsCRUD.loading && newsCRUD.items.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted border flex items-center justify-center">
                          {item.data.image?.url ? (
                            <img src={item.data.image.url} alt={item.data.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.data.title}</TableCell>
                      <TableCell>{item.data.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => openNews(item)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteNews(item.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No news posts yet. Create your first one.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitPhoto}>
            <DialogHeader>
              <DialogTitle>{photoEditingId ? "Edit Photo" : "Upload Photo"}</DialogTitle>
              <DialogDescription>Add images to the public Media Hub page.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded bg-muted border flex items-center justify-center overflow-hidden">
                    {photoForm.image?.originalUrl ? (
                      <img
                        src={photoForm.image.thumbUrl || photoForm.image.mediumUrl || photoForm.image.originalUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={onPhotoFileChange} disabled={photoUploading} />
                    {photoUploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="photoTitle">Title</Label>
                  <Input
                    id="photoTitle"
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photoCategory">Category</Label>
                  <Input
                    id="photoCategory"
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="photoDate">Date</Label>
                  <Input
                    id="photoDate"
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photoOrder">Display Order</Label>
                  <Input
                    id="photoOrder"
                    type="number"
                    value={photoForm.order ?? 0}
                    onChange={(e) => setPhotoForm({ ...photoForm, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photoCaption">Caption</Label>
                <Textarea
                  id="photoCaption"
                  value={photoForm.caption ?? ""}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPhotoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={photoUploading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={newsOpen} onOpenChange={setNewsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitNews}>
            <DialogHeader>
              <DialogTitle>{newsEditingId ? "Edit News Post" : "Create News Post"}</DialogTitle>
              <DialogDescription>Add news posts to the public Media Hub page.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded bg-muted border flex items-center justify-center overflow-hidden">
                    {newsForm.image?.url ? (
                      <img src={newsForm.image.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={onNewsFileChange} disabled={newsUploading} />
                    {newsUploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newsTitle">Title</Label>
                <Input
                  id="newsTitle"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newsExcerpt">Excerpt</Label>
                <Textarea
                  id="newsExcerpt"
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newsBody">Body (HTML supported)</Label>
                <Textarea
                  id="newsBody"
                  value={newsForm.bodyHtml}
                  onChange={(e) => setNewsForm({ ...newsForm, bodyHtml: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newsDate">Date</Label>
                  <Input
                    id="newsDate"
                    value={newsForm.date}
                    onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newsOrder">Display Order</Label>
                  <Input
                    id="newsOrder"
                    type="number"
                    value={newsForm.order ?? 0}
                    onChange={(e) => setNewsForm({ ...newsForm, order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={newsUploading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkPhotosOpen} onOpenChange={setBulkPhotosOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Bulk Upload Photos</DialogTitle>
            <DialogDescription>Upload multiple images at once. Titles are generated from filenames.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="bulkPhotoFiles">Images</Label>
              <Input
                id="bulkPhotoFiles"
                type="file"
                accept="image/*"
                multiple
                disabled={bulkPhotosUploading}
                onChange={(e) => void bulkUploadPhotos(e.target.files)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bulkPhotoCategory">Category</Label>
                <Input
                  id="bulkPhotoCategory"
                  value={bulkPhotoCategory}
                  onChange={(e) => setBulkPhotoCategory(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bulkPhotoDate">Date</Label>
                <Input
                  id="bulkPhotoDate"
                  value={bulkPhotoDate}
                  onChange={(e) => setBulkPhotoDate(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bulkPhotoCaption">Caption (optional)</Label>
              <Textarea
                id="bulkPhotoCaption"
                value={bulkPhotoCaption}
                onChange={(e) => setBulkPhotoCaption(e.target.value)}
              />
            </div>
            {bulkPhotosUploading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkPhotosOpen(false)} disabled={bulkPhotosUploading}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkNewsOpen} onOpenChange={setBulkNewsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import News</DialogTitle>
            <DialogDescription>Paste JSON array or CSV with headers: title,excerpt,bodyHtml,date,imageUrl,order</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Textarea value={bulkNewsText} onChange={(e) => setBulkNewsText(e.target.value)} rows={12} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkNewsOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => void bulkImportNews()}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
