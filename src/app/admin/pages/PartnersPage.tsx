
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Partner } from "../../content/types";
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

export function PartnersPageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Partner | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Partner>("partner");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partner>({
    name: "",
    logo: { url: "", alt: "" },
    tier: "community",
    descriptionHtml: "",
    websiteUrl: "",
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
        logo: { url: "", alt: "" },
        tier: "community",
        descriptionHtml: "",
        websiteUrl: "",
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
      setFormData({ ...formData, logo: { url: res.originalUrl, alt: formData.name } });
      toast.success("Logo uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logo.url) {
      toast.error("Please upload a partner logo");
      return;
    }
    if (!formData.descriptionHtml?.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Partner updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Partner created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      try {
        await deleteItem(id);
        toast.success("Partner deleted successfully");
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
        <CardTitle>Community Partners Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted border flex items-center justify-center p-1">
                    <img src={item.data.logo.url} alt={item.data.name} className="max-w-full max-h-full object-contain" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.name}</TableCell>
                <TableCell className="capitalize">{item.data.tier}</TableCell>
                <TableCell>{item.data.order}</TableCell>
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
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                <DialogDescription>
                  Manage organizations and sponsors that support the academy.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Partner Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-muted border flex items-center justify-center overflow-hidden p-1">
                      {formData.logo.url ? (
                        <img src={formData.logo.url} alt="Preview" className="max-w-full max-h-full object-contain" />
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
                  <Label htmlFor="name">Partner Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tier">Partnership Tier</Label>
                  <Select 
                    value={formData.tier} 
                    onValueChange={(v: any) => setFormData({...formData, tier: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platinum">Platinum</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descriptionHtml">Description (HTML supported)</Label>
                  <Textarea
                    id="descriptionHtml"
                    value={formData.descriptionHtml}
                    onChange={(e) => setFormData({ ...formData, descriptionHtml: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
                  <Input 
                    id="websiteUrl" 
                    type="url"
                    value={formData.websiteUrl ?? ""} 
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})} 
                    placeholder="https://example.com"
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
