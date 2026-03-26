
import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { MediaPhoto, NewsPost, MediaVideo } from "../../content/types";
import { getVideoEmbedUrl } from "../../lib/video";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2, Pencil, Plus, Trash2, Video as VideoIcon } from "lucide-react";

export function MediaHubPageAdmin() {
  const photosCRUD = useAdminCRUD<MediaPhoto>("mediaPhoto");
  const newsCRUD = useAdminCRUD<NewsPost>("newsPost");
  const videosCRUD = useAdminCRUD<MediaVideo>("mediaVideo");
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

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoEditingId, setVideoEditingId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<MediaVideo>({
    title: "",
    category: "Training",
    date: "",
    videoUrl: "",
    platform: "youtube",
    caption: "",
    order: 0,
  });

  const defaultVideos: MediaVideo[] = [
    {
      title: "Academy Training Session",
      category: "Training",
      date: "2025",
      videoUrl: "https://youtu.be/GNJ5U_m6Cc4?si=EGKaFJ7AAtMWXhqe",
      platform: "youtube",
      order: 10,
    },
    {
      title: "Match Highlights",
      category: "Match",
      date: "2025",
      videoUrl: "https://youtu.be/RUeGKwCz27s?si=c2QlXhwWVG59sW7m",
      platform: "youtube",
      order: 20,
    },
    {
      title: "Skills & Drills",
      category: "Training",
      date: "2025",
      videoUrl: "https://youtube.com/shorts/Krr3bYqsNZw?si=e8b0IYrrNFrfV7gF",
      platform: "youtube",
      order: 30,
    },
    {
      title: "Youth League Action",
      category: "Match",
      date: "2025",
      videoUrl: "https://youtu.be/V1GH7l8tp_4?si=g5f-5ERaKAvS32XW",
      platform: "youtube",
      order: 40,
    },
    {
      title: "Academy Showcase",
      category: "Event",
      date: "2025",
      videoUrl: "https://youtu.be/aiJAIJtytAQ?si=nIQTGvNpRLVtIubK",
      platform: "youtube",
      order: 50,
    },
    {
      title: "Facebook Highlights 1",
      category: "Community",
      date: "2025",
      videoUrl: "https://www.facebook.com/share/v/1C2YyiynnA/?mibextid=WC7FNe",
      platform: "facebook",
      order: 60,
    },
  ];

  const defaultNews: NewsPost[] = [
    {
      title: "New Branch: Infinity Estate, Addo Road",
      excerpt: "Pegasus Football Academy is coming to Infinity Estate, Addo Road, Ajah! Expanding the Legacy with a new branch opening.",
      bodyHtml: "<p>Welcome to Pegasus Football Academy/Club where we nurture, breed and mould young Talented and creative minds in their respective Football Careers/Aspirations. <strong>New Branch Opening at 4th Avenue No 22, Infinity Estate, Addo Road, Ajah, Lagos.</strong> Training days: Monday (4pm-7pm) and Saturday (4pm-7:30pm). Ages 2-17 years, Male & Female welcomed.</p>",
      date: "March 2026",
      image: { url: "/pegasus archive/infifity.jpeg", alt: "Infinity Estate Branch Opening", caption: "" },
      scheduledAt: "",
      order: 2,
    },
    {
      title: "Basketball Academy Launch in Ajah",
      excerpt: "Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah! Training commences April 2026.",
      bodyHtml: "<p>Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah! Training is set to commence April 2026, offering aspiring basketball stars a chance to hone their skills and reach new heights in the sport. Join us as we embark on this incredible journey to develop the next generation of basketball talent in Nigeria!</p>",
      date: "March 2026",
      image: { url: "/basketball flyer .jpeg", alt: "Basketball Academy Launch", caption: "" },
      scheduledAt: "",
      order: 5,
    },
  ];

  const defaultPhotos: MediaPhoto[] = [
    {
      title: "Infinity Estate Branch",
      category: "Expansion",
      date: "March 2026",
      image: { originalUrl: "/pegasus archive/infifity.jpeg" },
      caption: "New Branch opening at Infinity Estate, Addo Road, Ajah.",
      order: 2,
    },
    {
      title: "Basketball Academy Launch",
      category: "Launch",
      date: "March 2026",
      image: { originalUrl: "/basketball flyer .jpeg" },
      caption: "Exciting news! Basketball Academy coming to Ajah.",
      order: 5,
    },
  ];

  const mergedVideos = useMemo(() => {
    const fromDb = videosCRUD.items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbUrls = new Set(fromDb.map((v) => v.videoUrl));
    const fallbacks = defaultVideos
      .filter((v) => !dbUrls.has(v.videoUrl))
      .map((v) => ({ ...v, id: `default-video-${v.videoUrl}`, isDefault: true }));
    return [...fromDb, ...fallbacks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [videosCRUD.items]);

  const mergedNews = useMemo(() => {
    const fromDb = newsCRUD.items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbTitles = new Set(fromDb.map((n) => n.title));
    const fallbacks = defaultNews
      .filter((n) => !dbTitles.has(n.title))
      .map((n) => ({ ...n, id: `default-news-${n.title}`, isDefault: true }));
    return [...fromDb, ...fallbacks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [newsCRUD.items]);

  const mergedPhotos = useMemo(() => {
    const fromDb = photosCRUD.items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbTitles = new Set(fromDb.map((p) => p.title));
    const fallbacks = defaultPhotos
      .filter((p) => !dbTitles.has(p.title))
      .map((p) => ({ ...p, id: `default-photo-${p.title}`, isDefault: true }));
    return [...fromDb, ...fallbacks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [photosCRUD.items]);

  const openPhoto = (item?: any) => {
    if (item) {
      if (item.isDefault) {
        setPhotoEditingId(null);
        const { id, isDefault, ...clean } = item;
        setPhotoForm(clean);
      } else {
        setPhotoEditingId(item.id);
        setPhotoForm(item.data || item);
      }
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
      if (item.isDefault) {
        setNewsEditingId(null);
        const { id, isDefault, ...clean } = item;
        setNewsForm(clean);
      } else {
        setNewsEditingId(item.id);
        setNewsForm(item.data || item);
      }
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

  const openVideo = (item?: any) => {
    if (item) {
      if (item.isDefault) {
        setVideoEditingId(null);
        const { id, isDefault, ...clean } = item;
        setVideoForm(clean);
      } else {
        setVideoEditingId(item.id);
        setVideoForm(item.data || item);
      }
    } else {
      setVideoEditingId(null);
      setVideoForm({
        title: "",
        category: "Training",
        date: new Date().toISOString().slice(0, 10),
        videoUrl: "",
        platform: "youtube",
        caption: "",
        order: 0,
      });
    }
    setVideoOpen(true);
  };

  const [bulkPhotosOpen, setBulkPhotosOpen] = useState(false);
  const [bulkPhotosUploading, setBulkPhotosUploading] = useState(false);
  const [bulkPhotoCategory, setBulkPhotoCategory] = useState("Training");
  const [bulkPhotoDate, setBulkPhotoDate] = useState(new Date().toISOString().slice(0, 10));
  const [bulkPhotoCaption, setBulkPhotoCaption] = useState("");

  const [bulkNewsOpen, setBulkNewsOpen] = useState(false);
  const [bulkNewsText, setBulkNewsText] = useState("");

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

  const submitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.videoUrl) {
      toast.error("Please enter a video URL");
      return;
    }
    try {
      const platform = videoForm.videoUrl.includes("facebook.com") ? "facebook" : "youtube";
      const finalForm = { ...videoForm, platform };
      if (videoEditingId) {
        await videosCRUD.updateItem(videoEditingId, finalForm);
        toast.success("Video updated successfully");
      } else {
        await videosCRUD.createItem(finalForm, "published");
        toast.success("Video added successfully");
      }
      setVideoOpen(false);
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

  const deleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await videosCRUD.deleteItem(id);
      toast.success("Video deleted successfully");
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
          <TabsTrigger value="videos">Video Gallery</TabsTrigger>
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
                  {mergedPhotos.map((item) => {
                    const src =
                      item.image?.thumbUrl ||
                      item.image?.mediumUrl ||
                      item.image?.largeUrl ||
                      item.image?.originalUrl ||
                      "";
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded overflow-hidden bg-muted border flex items-center justify-center">
                            {src ? (
                              <img src={src} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          {item.isDefault ? (
                            <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Default</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2" onClick={() => openPhoto(item)}>
                            Edit
                          </Button>
                          {!item.isDefault && (
                            <Button variant="destructive" size="sm" onClick={() => deletePhoto(item.id)}>
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {mergedPhotos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        No photos yet. Upload your first one.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Video Gallery</CardTitle>
              <Button onClick={() => openVideo()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video Link
              </Button>
            </CardHeader>
            <CardContent>
              {videosCRUD.loading && videosCRUD.items.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mergedVideos.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-10 rounded overflow-hidden bg-muted border flex items-center justify-center">
                          <VideoIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="capitalize">{item.platform}</TableCell>
                      <TableCell>
                        {item.isDefault ? (
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Default</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => openVideo(item)}>
                          Edit
                        </Button>
                        {!item.isDefault && (
                          <Button variant="destructive" size="sm" onClick={() => deleteVideo(item.id)}>
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
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
                  {mergedNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted border flex items-center justify-center">
                          {item.image?.url ? (
                            <img src={item.image.url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        {item.isDefault ? (
                          <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">Default</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => openNews(item)}>
                          Edit
                        </Button>
                        {!item.isDefault && (
                          <Button variant="destructive" size="sm" onClick={() => deleteNews(item.id)}>
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {mergedNews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center h-24 text-muted-foreground">
                        No news posts yet.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Dialog */}
      <Dialog open={photoOpen} onOpenChange={setPhotoOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={submitPhoto}>
            <DialogHeader>
              <DialogTitle>{photoEditingId ? "Edit Photo" : "Upload Photo"}</DialogTitle>
              <DialogDescription>Manage gallery photos and their details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Photo File</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded bg-muted border flex items-center justify-center overflow-hidden">
                    {photoForm.image?.originalUrl ? (
                      <img
                        src={photoForm.image.originalUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={onPhotoFileChange} disabled={photoUploading} />
                    {photoUploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo-title">Title</Label>
                <Input
                  id="photo-title"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="Enter photo title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo-category">Category</Label>
                  <Input
                    id="photo-category"
                    value={photoForm.category}
                    onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                    placeholder="e.g. Training"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo-date">Date</Label>
                  <Input
                    id="photo-date"
                    type="date"
                    value={photoForm.date}
                    onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo-caption">Caption</Label>
                <Textarea
                  id="photo-caption"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="Optional caption"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setPhotoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={photoUploading}>
                {photoEditingId ? "Update Photo" : "Create Photo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={submitVideo}>
            <DialogHeader>
              <DialogTitle>{videoEditingId ? "Edit Video" : "Add Video Link"}</DialogTitle>
              <DialogDescription>Add YouTube or Facebook video links to the gallery.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  placeholder="https://youtu.be/... or https://facebook.com/..."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="Enter video title"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="video-category">Category</Label>
                  <Input
                    id="video-category"
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    placeholder="e.g. Training"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="video-date">Date</Label>
                  <Input
                    id="video-date"
                    type="date"
                    value={videoForm.date}
                    onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-caption">Caption</Label>
                <Textarea
                  id="video-caption"
                  value={videoForm.caption}
                  onChange={(e) => setVideoForm({ ...videoForm, caption: e.target.value })}
                  placeholder="Optional caption"
                />
              </div>
              {videoForm.videoUrl && (
                <div className="grid gap-2">
                  <Label>Preview</Label>
                  <div className="aspect-video rounded border overflow-hidden bg-black">
                    <iframe
                      src={getVideoEmbedUrl(videoForm.videoUrl)}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setVideoOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {videoEditingId ? "Update Video" : "Add Video"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* News Dialog */}
      <Dialog open={newsOpen} onOpenChange={setNewsOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submitNews}>
            <DialogHeader>
              <DialogTitle>{newsEditingId ? "Edit News Post" : "Add News Post"}</DialogTitle>
              <DialogDescription>Create a new article for the website.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Featured Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded bg-muted border flex items-center justify-center overflow-hidden">
                    {newsForm.image?.url ? (
                      <img src={newsForm.image.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={onNewsFileChange} disabled={newsUploading} />
                    {newsUploading && <div className="text-xs text-muted-foreground mt-1">Uploading...</div>}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="news-title">Title</Label>
                <Input
                  id="news-title"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="Article title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="news-date">Publish Date</Label>
                <Input
                  id="news-date"
                  type="date"
                  value={newsForm.date}
                  onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="news-excerpt">Excerpt (Summary)</Label>
                <Textarea
                  id="news-excerpt"
                  value={newsForm.excerpt}
                  onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                  placeholder="Short summary for the card"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="news-body">Body (HTML Content)</Label>
                <Textarea
                  id="news-body"
                  value={newsForm.bodyHtml}
                  onChange={(e) => setNewsForm({ ...newsForm, bodyHtml: e.target.value })}
                  placeholder="<p>Full article content...</p>"
                  className="min-h-[200px] font-mono text-xs"
                  required
                />
              </div>
            </div>
            <DialogFooter>
               <Button type="button" variant="ghost" onClick={() => setNewsOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit" disabled={newsUploading}>
                 {newsEditingId ? "Update Post" : "Create Post"}
               </Button>
             </DialogFooter>
           </form>
         </DialogContent>
       </Dialog>

       {/* Bulk Photo Dialog */}
       <Dialog open={bulkPhotosOpen} onOpenChange={setBulkPhotosOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Bulk Upload Photos</DialogTitle>
             <DialogDescription>Select multiple photos to upload at once.</DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="grid gap-2">
               <Label>Select Photos</Label>
               <Input
                 type="file"
                 multiple
                 accept="image/*"
                 onChange={(e) => bulkUploadPhotos(e.target.files)}
                 disabled={bulkPhotosUploading}
               />
               {bulkPhotosUploading && (
                 <div className="flex items-center gap-2 text-sm text-primary mt-2">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   Uploading photos...
                 </div>
               )}
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                 <Label>Default Category</Label>
                 <Input
                   value={bulkPhotoCategory}
                   onChange={(e) => setBulkPhotoCategory(e.target.value)}
                   placeholder="Training"
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Default Date</Label>
                 <Input type="date" value={bulkPhotoDate} onChange={(e) => setBulkPhotoDate(e.target.value)} />
               </div>
             </div>
           </div>
         </DialogContent>
       </Dialog>

       {/* Bulk News Dialog */}
       <Dialog open={bulkNewsOpen} onOpenChange={setBulkNewsOpen}>
         <DialogContent className="max-w-2xl">
           <DialogHeader>
             <DialogTitle>Bulk Import News</DialogTitle>
             <DialogDescription>Paste JSON array or CSV data to import multiple news posts.</DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <div className="grid gap-2">
               <Label>Data (JSON or CSV)</Label>
               <Textarea
                 value={bulkNewsText}
                 onChange={(e) => setBulkNewsText(e.target.value)}
                 placeholder='[{"title": "News 1", ...}, ...]'
                 className="min-h-[300px] font-mono text-xs"
               />
             </div>
           </div>
           <DialogFooter>
             <Button variant="ghost" onClick={() => setBulkNewsOpen(false)}>
               Cancel
             </Button>
             <Button onClick={bulkImportNews}>Import Posts</Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
