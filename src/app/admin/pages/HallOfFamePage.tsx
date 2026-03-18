
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Achievement } from "../../content/types";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export function HallOfFamePageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Achievement | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Achievement>("achievement");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Achievement>({
    title: "",
    description: "",
    date: "",
    season: "",
    category: "milestone",
    image: undefined,
    highlight: false,
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
        title: "",
        description: "",
        date: "",
        season: "",
        category: "milestone",
        image: undefined,
        highlight: false,
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
      setFormData({ ...formData, image: { url: res.originalUrl, alt: formData.title } });
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Achievement = {
        ...formData,
        image: formData.image?.url ? formData.image : undefined,
      };
      if (editingId) {
        await updateItem(editingId, payload);
        toast.success("Achievement updated successfully");
      } else {
        await createItem(payload, "published");
        toast.success("Achievement created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      try {
        await deleteItem(id);
        toast.success("Achievement deleted successfully");
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
        <CardTitle>Hall of Fame Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded overflow-hidden bg-muted border">
                    {item.data.image && (
                      <img src={item.data.image.url} alt={item.data.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.title}</TableCell>
                <TableCell>{item.data.season}</TableCell>
                <TableCell className="capitalize">{item.data.category}</TableCell>
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
                <DialogTitle>{editingId ? "Edit Achievement" : "Add New Achievement"}</DialogTitle>
                <DialogDescription>
                  Record milestones, league wins, and seasonal trophies.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Achievement Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded bg-muted border flex items-center justify-center overflow-hidden">
                      {formData.image?.url ? (
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="season">Season (e.g., 2024/2025)</Label>
                    <Input 
                      id="season" 
                      value={formData.season} 
                      onChange={(e) => setFormData({...formData, season: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Specific Date (Optional)</Label>
                    <Input 
                      id="date" 
                      value={formData.date} 
                      onChange={(e) => setFormData({...formData, date: e.target.value})} 
                      placeholder="e.g., May 2025"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v: any) => setFormData({...formData, category: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trophy">Trophy</SelectItem>
                        <SelectItem value="league">League</SelectItem>
                        <SelectItem value="milestone">Milestone</SelectItem>
                      </SelectContent>
                    </Select>
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
