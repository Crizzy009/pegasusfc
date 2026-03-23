import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { SportGalleryPhoto, SportKey, SportPage } from "../../content/types";
import { toast } from "sonner";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useAdminAuth } from "../auth";

type SportTab = Exclude<SportKey, "football">;

const sportLabel: Record<SportTab, string> = {
  basketball: "Basketball",
  tennis: "Lawn Tennis",
  swimming: "Swimming",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

export function SportsPageAdmin() {
  const { user } = useAdminAuth();
  const role = user?.role ?? "viewer";
  const canDelete = role === "admin";
  const pagesCRUD = useAdminCRUD<SportPage>("sportPage");
  const galleryCRUD = useAdminCRUD<SportGalleryPhoto>("sportGalleryPhoto");

  const [sport, setSport] = useState<SportTab>("basketball");

  const pageItem = useMemo(() => {
    const items = pagesCRUD.items.filter((i) => i.data.sport === sport);
    const sorted = [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    return sorted[0] ?? null;
  }, [pagesCRUD.items, sport]);

  const [pageUploading, setPageUploading] = useState(false);
  const [pageForm, setPageForm] = useState<SportPage>({
    sport: "basketball",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: { url: "", alt: "", caption: "" },
    overviewHtml: "",
    trainingHtml: "",
    galleryTitle: "",
    ctaLabel: "",
    ctaHref: "",
    order: 0,
  });

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryEditingId, setGalleryEditingId] = useState<string | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryForm, setGalleryForm] = useState<SportGalleryPhoto>({
    sport: "basketball",
    title: "",
    category: "Training",
    date: todayIso(),
    image: { originalUrl: "", largeUrl: "", mediumUrl: "", thumbUrl: "" },
    caption: "",
    order: 0,
  });

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkCategory, setBulkCategory] = useState("Training");
  const [bulkDate, setBulkDate] = useState(todayIso());
  const [bulkCaption, setBulkCaption] = useState("");

  const loadPageForm = (nextSport: SportTab) => {
    setSport(nextSport);
    const it = pagesCRUD.items
      .filter((i) => i.data.sport === nextSport)
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))[0];
    if (it) {
      setPageForm(it.data);
    } else {
      setPageForm({
        sport: nextSport,
        heroTitle: "",
        heroSubtitle: "",
        heroImage: { url: "", alt: "", caption: "" },
        overviewHtml: "",
        trainingHtml: "",
        galleryTitle: "",
        ctaLabel: "",
        ctaHref: "",
        order: 0,
      });
    }
  };

  const onHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPageUploading(true);
    try {
      const res = await pagesCRUD.upload(file);
      setPageForm((p) => ({ ...p, heroImage: { url: res.originalUrl, alt: p.heroTitle || sportLabel[sport] } }));
      toast.success("Hero image uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setPageUploading(false);
    }
  };

  const savePage = async () => {
    try {
      const data: SportPage = {
        ...pageForm,
        sport,
        heroImage: pageForm.heroImage?.url ? pageForm.heroImage : undefined,
      };
      if (pageItem) {
        await pagesCRUD.updateItem(pageItem.id, data);
        toast.success("Page updated");
      } else {
        await pagesCRUD.createItem(data, "published");
        toast.success("Page created");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const galleryItems = useMemo(() => {
    return [...galleryCRUD.items]
      .filter((i) => i.data.sport === sport)
      .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
  }, [galleryCRUD.items, sport]);

  const openGalleryDialog = (item?: any) => {
    if (item) {
      setGalleryEditingId(item.id);
      setGalleryForm(item.data);
    } else {
      setGalleryEditingId(null);
      setGalleryForm({
        sport,
        title: "",
        category: bulkCategory || "Training",
        date: bulkDate || todayIso(),
        image: { originalUrl: "", largeUrl: "", mediumUrl: "", thumbUrl: "" },
        caption: "",
        order: Math.max(0, ...galleryItems.map((i) => i.data.order ?? 0)) + 10,
      });
    }
    setGalleryOpen(true);
  };

  const onGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const img = await galleryCRUD.upload(file);
      setGalleryForm((p) => ({
        ...p,
        image: { originalUrl: img.originalUrl, largeUrl: img.largeUrl, mediumUrl: img.mediumUrl, thumbUrl: img.thumbUrl },
      }));
      toast.success("Photo uploaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setGalleryUploading(false);
    }
  };

  const submitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.image.originalUrl) {
      toast.error("Please upload an image");
      return;
    }
    try {
      const data: SportGalleryPhoto = { ...galleryForm, sport };
      if (galleryEditingId) {
        await galleryCRUD.updateItem(galleryEditingId, data);
        toast.success("Photo updated");
      } else {
        await galleryCRUD.createItem(data, "published");
        toast.success("Photo added");
      }
      setGalleryOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const deleteGallery = async (id: string) => {
    if (!canDelete) {
      toast.error("forbidden");
      return;
    }
    if (!confirm("Delete this photo?")) return;
    try {
      await galleryCRUD.deleteItem(id);
      toast.success("Photo deleted");
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

  const bulkUpload = async (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    setBulkUploading(true);
    try {
      const startOrder = Math.max(0, ...galleryItems.map((i) => i.data.order ?? 0)) + 10;
      const uploaded = await runPool(list, 3, async (file) => {
        const img = await galleryCRUD.upload(file);
        return { file, img };
      });
      const rows = uploaded.map(({ file, img }, idx) => {
        const title = normalizeTitleFromFileName(file.name);
        const row: SportGalleryPhoto = {
          sport,
          title,
          category: bulkCategory || "Training",
          date: bulkDate || todayIso(),
          image: {
            originalUrl: img.originalUrl,
            largeUrl: img.largeUrl,
            mediumUrl: img.mediumUrl,
            thumbUrl: img.thumbUrl,
          },
          caption: bulkCaption || "",
          order: startOrder + idx * 10,
        };
        return { data: row, status: "published" as const };
      });
      await galleryCRUD.createMany(rows);
      toast.success(`Uploaded ${rows.length} photo${rows.length === 1 ? "" : "s"}`);
      setBulkOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Bulk upload failed");
    } finally {
      setBulkUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sports Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={sport} onValueChange={(v) => loadPageForm(v as SportTab)}>
            <TabsList className="mb-6">
              <TabsTrigger value="basketball">Basketball</TabsTrigger>
              <TabsTrigger value="tennis">Lawn Tennis</TabsTrigger>
              <TabsTrigger value="swimming">Swimming</TabsTrigger>
            </TabsList>

            {(["basketball", "tennis", "swimming"] as SportTab[]).map((key) => (
              <TabsContent key={key} value={key}>
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{sportLabel[key]} Page Content</CardTitle>
                      <Button onClick={() => void savePage()} disabled={pageUploading}>
                        Save Changes
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Hero Image (optional)</Label>
                        <div className="flex items-center gap-3">
                          <div className="w-[120px] h-[68px] rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                            {pageForm.heroImage?.url ? (
                              <img src={pageForm.heroImage.url} alt={pageForm.heroImage.alt || pageForm.heroTitle} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <Input type="file" accept="image/*" disabled={pageUploading} onChange={onHeroFileChange} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Hero Title</Label>
                        <Input value={pageForm.heroTitle} onChange={(e) => setPageForm((p) => ({ ...p, heroTitle: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Hero Subtitle</Label>
                        <Input value={pageForm.heroSubtitle ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, heroSubtitle: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Overview (HTML)</Label>
                        <Textarea value={pageForm.overviewHtml ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, overviewHtml: e.target.value }))} rows={6} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Training (HTML)</Label>
                        <Textarea value={pageForm.trainingHtml ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, trainingHtml: e.target.value }))} rows={6} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Gallery Title</Label>
                          <Input value={pageForm.galleryTitle ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, galleryTitle: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Display Order</Label>
                          <Input type="number" value={pageForm.order ?? 0} onChange={(e) => setPageForm((p) => ({ ...p, order: Number(e.target.value) }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>CTA Label</Label>
                          <Input value={pageForm.ctaLabel ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, ctaLabel: e.target.value }))} />
                        </div>
                        <div className="grid gap-2">
                          <Label>CTA Href</Label>
                          <Input value={pageForm.ctaHref ?? ""} onChange={(e) => setPageForm((p) => ({ ...p, ctaHref: e.target.value }))} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>{sportLabel[key]} Gallery</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setBulkOpen(true)}>
                          Bulk Upload
                        </Button>
                        <Button onClick={() => openGalleryDialog()}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Photo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {galleryItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="w-16 h-[42px] rounded-md overflow-hidden bg-muted border flex items-center justify-center">
                                  {item.data.image?.thumbUrl || item.data.image?.mediumUrl || item.data.image?.originalUrl ? (
                                    <img
                                      src={item.data.image.thumbUrl || item.data.image.mediumUrl || item.data.image.originalUrl}
                                      alt={item.data.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{item.data.title}</TableCell>
                              <TableCell>{item.data.category}</TableCell>
                              <TableCell>{item.data.date}</TableCell>
                              <TableCell>{item.data.order ?? 0}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" className="mr-2" onClick={() => openGalleryDialog(item)}>
                                  Edit
                                </Button>
                                {canDelete ? (
                                  <Button variant="destructive" size="sm" onClick={() => void deleteGallery(item.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                ) : null}
                              </TableCell>
                            </TableRow>
                          ))}
                          {galleryItems.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                No photos yet. Add your first photo.
                              </TableCell>
                            </TableRow>
                          ) : null}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <form onSubmit={submitGallery}>
            <DialogHeader>
              <DialogTitle>{galleryEditingId ? "Edit Photo" : "Add Photo"}</DialogTitle>
              <DialogDescription>Upload and manage photos for {sportLabel[sport]}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Image</Label>
                <div className="flex items-center gap-3">
                  <div className="w-[140px] h-[84px] rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                    {galleryForm.image?.originalUrl ? (
                      <img src={galleryForm.image.originalUrl} alt={galleryForm.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <Input type="file" accept="image/*" disabled={galleryUploading} onChange={onGalleryFileChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={galleryForm.title} onChange={(e) => setGalleryForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Input value={galleryForm.category} onChange={(e) => setGalleryForm((p) => ({ ...p, category: e.target.value }))} required />
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input value={galleryForm.date} onChange={(e) => setGalleryForm((p) => ({ ...p, date: e.target.value }))} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Caption</Label>
                <Textarea value={galleryForm.caption ?? ""} onChange={(e) => setGalleryForm((p) => ({ ...p, caption: e.target.value }))} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label>Display Order</Label>
                <Input type="number" value={galleryForm.order ?? 0} onChange={(e) => setGalleryForm((p) => ({ ...p, order: Number(e.target.value) }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGalleryOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={galleryUploading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Bulk Upload Photos</DialogTitle>
            <DialogDescription>Upload multiple photos for {sportLabel[sport]} at once.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Images</Label>
              <Input type="file" accept="image/*" multiple disabled={bulkUploading} onChange={(e) => void bulkUpload(e.target.files)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={bulkCategory} onChange={(e) => setBulkCategory(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Caption (optional)</Label>
              <Textarea value={bulkCaption} onChange={(e) => setBulkCaption(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setBulkOpen(false)} disabled={bulkUploading}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
