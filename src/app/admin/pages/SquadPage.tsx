
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Player } from "../../content/types";
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
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

export function SquadPageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Player | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Player>("player");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Player>({
    name: "",
    jersey: 0,
    position: "Forward",
    age: 0,
    category: "u14-u16",
    height: "",
    goals: 0,
    photo: { url: "", alt: "" },
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
        jersey: 0,
        position: "Forward",
        age: 0,
        category: "u14-u16",
        height: "",
        goals: 0,
        photo: { url: "", alt: "" },
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
      setFormData({ ...formData, photo: { url: res.originalUrl, alt: formData.name } });
      toast.success("Photo uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.photo.url) {
      toast.error("Please upload a player photo");
      return;
    }

    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Player updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Player created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      try {
        await deleteItem(id);
        toast.success("Player deleted successfully");
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
        <CardTitle>Squad Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Jersey</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border">
                    <img src={item.data.photo.url} alt={item.data.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.name}</TableCell>
                <TableCell>#{item.data.jersey}</TableCell>
                <TableCell className="uppercase">{item.data.category}</TableCell>
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
                <DialogTitle>{editingId ? "Edit Player Profile" : "Add New Player"}</DialogTitle>
                <DialogDescription>
                  Manage player details, statistics, and photos.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Player Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-muted border flex items-center justify-center overflow-hidden">
                      {formData.photo.url ? (
                        <img src={formData.photo.url} alt="Preview" className="w-full h-full object-cover" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jersey">Jersey Number</Label>
                    <Input 
                      id="jersey" 
                      type="number"
                      value={formData.jersey} 
                      onChange={(e) => setFormData({...formData, jersey: parseInt(e.target.value)})} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Select 
                      value={formData.position} 
                      onValueChange={(v) => setFormData({...formData, position: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                        <SelectItem value="Defender">Defender</SelectItem>
                        <SelectItem value="Midfielder">Midfielder</SelectItem>
                        <SelectItem value="Forward">Forward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData({...formData, category: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="u7-u9">U7 & U9</SelectItem>
                        <SelectItem value="u10">U10</SelectItem>
                        <SelectItem value="u11-u13">U11-U13</SelectItem>
                        <SelectItem value="u14-u16">U14-U16</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number"
                      value={formData.age} 
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height</Label>
                    <Input 
                      id="height" 
                      value={formData.height} 
                      onChange={(e) => setFormData({...formData, height: e.target.value})} 
                      placeholder={`5'8"`}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goals">Goals</Label>
                    <Input 
                      id="goals" 
                      type="number"
                      value={formData.goals} 
                      onChange={(e) => setFormData({...formData, goals: parseInt(e.target.value)})} 
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
