import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Manager } from "../../content/types";
import { toast } from "sonner";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";

export function ManagersPageAdmin() {
  const { items, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Manager>("manager");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Manager>({
    name: "",
    title: "",
    bio: "",
    photo: { url: "", alt: "" },
    order: 0,
  });

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [items]
  );

  const openDialog = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setForm(item.data);
    } else {
      setEditingId(null);
      setForm({
        name: "",
        title: "",
        bio: "",
        photo: { url: "", alt: "" },
        order: 0,
      });
    }
    setOpen(true);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await upload(file);
      setForm((p) => ({ ...p, photo: { url: res.originalUrl, alt: p.name || file.name } }));
      toast.success("Photo uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photo?.url) {
      toast.error("Please upload a manager photo");
      return;
    }
    try {
      if (editingId) {
        await updateItem(editingId, form);
        toast.success("Manager updated");
      } else {
        await createItem(form, "published");
        toast.success("Manager added");
      }
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this manager?")) return;
    try {
      await deleteItem(id);
      toast.success("Manager deleted");
    } catch (err: any) {
      toast.error(err?.message ?? "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Managers</CardTitle>
          <Button onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Manager
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="w-12 h-[56px] rounded-md overflow-hidden bg-muted border flex items-center justify-center">
                      {item.data.photo?.url ? (
                        <img src={item.data.photo.url} alt={item.data.photo.alt || item.data.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.data.name}</TableCell>
                  <TableCell>{item.data.title}</TableCell>
                  <TableCell>{item.data.order ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openDialog(item)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No managers found. Add your first manager!
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Manager" : "Add Manager"}</DialogTitle>
              <DialogDescription>Manage management staff details shown on the homepage.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="photo">Manager Photo</Label>
                <div className="flex items-center gap-3">
                  <div className="w-[120px] h-[138px] rounded-lg overflow-hidden bg-muted border flex items-center justify-center">
                    {form.photo?.url ? (
                      <img src={form.photo.url} alt={form.photo.alt || form.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <Input id="photo" type="file" accept="image/*" disabled={uploading} onChange={onFileChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={form.bio ?? ""} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={form.order ?? 0}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={uploading}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
