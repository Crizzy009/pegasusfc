
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Star } from "../../content/types";
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

export function StarsPageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Star | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Star>("star");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Star>({
    name: "",
    achievement: "",
    quote: "",
    image: { url: "", alt: "" },
    visitDate: "",
    order: 0,
  });

  const itemById = useMemo(() => {
    const map = new Map<string, any>();
    for (const it of items) map.set(it.id, it);
    return map;
  }, [items]);

  useEffect(() => {
    if (!editId) return;
    const it = itemById.get(editId);
    if (!it) return;
    setEditingId(it.id);
    setFormData(it.data);
    setIsOpen(true);
  }, [editId, itemById]);

  useEffect(() => {
    if (!createPrefill) return;
    setEditingId(null);
    setFormData(createPrefill);
    setIsOpen(true);
  }, [createPrefill]);

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item.data);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        achievement: "",
        quote: "",
        image: { url: "", alt: "" },
        visitDate: "",
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
      setFormData({ ...formData, image: { url: res.originalUrl, alt: formData.name } });
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
        toast.success("Star visit updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Star visit created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteItem(id);
        toast.success("Record deleted successfully");
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
        <CardTitle>Football Stars Visits Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Star Visit
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Achievement</TableHead>
              <TableHead>Visit Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted border">
                    <img src={item.data.image.url} alt={item.data.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.name}</TableCell>
                <TableCell>{item.data.achievement}</TableCell>
                <TableCell>{item.data.visitDate}</TableCell>
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
          </TableBody>
        </Table>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Star Visit" : "Add New Star Visit"}</DialogTitle>
                <DialogDescription>
                  Manage professional players who have visited the academy.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-muted border flex items-center justify-center overflow-hidden">
                      {formData.image.url ? (
                        <img src={formData.image.url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                      {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Star's Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="achievement">Achievement/Title</Label>
                  <Input 
                    id="achievement" 
                    value={formData.achievement} 
                    onChange={(e) => setFormData({...formData, achievement: e.target.value})} 
                    placeholder="e.g., Nigerian Football Legend"
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quote">Inspirational Quote</Label>
                  <Textarea 
                    id="quote" 
                    value={formData.quote} 
                    onChange={(e) => setFormData({...formData, quote: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="visitDate">Visit Date</Label>
                    <Input 
                      id="visitDate" 
                      value={formData.visitDate} 
                      onChange={(e) => setFormData({...formData, visitDate: e.target.value})} 
                      placeholder="e.g., Feb 2024"
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
