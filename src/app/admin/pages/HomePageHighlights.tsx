
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { HomeHighlight } from "../../content/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export function HomePageHighlights() {
  const { items, loading, createItem, updateItem, deleteItem, upload, createMany, deleteMany } = useAdminCRUD<HomeHighlight>("homeHighlight");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<HomeHighlight>({
    title: "",
    description: "",
    image: { url: "", alt: "", caption: "" },
    order: 0,
  });

  const handleSyncDefaults = async () => {
    if (confirm("This will replace all highlights in the database with the default 2026 highlights. Are you sure you want to proceed?")) {
      const loadingToast = toast.loading("Syncing default 2026 highlights...");
      try {
        if (items.length > 0) {
          const ids = items.map((it) => it.id);
          await deleteMany(ids);
        }
        
        const defaults: HomeHighlight[] = [
          {
            title: "Pedro Carrena 100 Goals Milestone",
            description: "Pedro Carrena scored his historic 100th goal, establishing an unmatched record.",
            image: {
              url: "/pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM.jpeg",
              alt: "Pedro Carrena 100 Goals Milestone",
              caption: "Pedro Carrena 100 Goals Milestone",
            },
            order: 1,
          },
          {
            title: "Wolverhampton & Brentford Scouting",
            description: "Hosted professional English Premier League scouts at our academy fields.",
            image: {
              url: "/pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.43.58 PM.jpeg",
              alt: "Wolverhampton & Brentford Scouting",
              caption: "Wolverhampton & Brentford Scouting",
            },
            order: 2,
          },
          {
            title: "Basketball Academy Grand Launch",
            description: "Celebrated the official team launch and photoshoot on June 5, 2026.",
            image: {
              url: "/pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg",
              alt: "Basketball Academy Grand Launch",
              caption: "Basketball Academy Grand Launch",
            },
            order: 3,
          },
        ];

        await createMany(defaults.map((d) => ({ data: d, status: "published" })));
        toast.dismiss(loadingToast);
        toast.success("Successfully synced database with the default 2026 highlights!");
      } catch (err: any) {
        toast.dismiss(loadingToast);
        toast.error("Failed to sync highlights: " + err.message);
      }
    }
  };

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item.data);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        image: { url: "", alt: "", caption: "" },
        order: 0,
      });
    }
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await upload(file);
      setFormData({
        ...formData,
        image: {
          ...formData.image,
          url: res.originalUrl,
        }
      });
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.url) {
      toast.error("Please upload an image");
      return;
    }

    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Highlight updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Highlight created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this highlight?")) {
      try {
        await deleteItem(id);
        toast.success("Highlight deleted successfully");
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Highlights Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSyncDefaults}>
            Sync to Default 2026 Highlights
          </Button>
          <Button onClick={() => handleOpen()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Highlight
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                    <img src={item.data.image.url} alt={item.data.title} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.title}</TableCell>
                <TableCell className="max-w-[300px] truncate">{item.data.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpen(item)} className="mr-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No highlights found. Add your first highlight!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Highlight" : "Add New Highlight"}</DialogTitle>
                <DialogDescription>
                  Share recent success stories and milestones.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Highlight Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-lg bg-muted border flex items-center justify-center overflow-hidden">
                      {formData.image.url ? (
                        <img src={formData.image.url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        disabled={uploading}
                      />
                      {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input 
                    id="order" 
                    type="number" 
                    value={formData.order} 
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={uploading}>Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
