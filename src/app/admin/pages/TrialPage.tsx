
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Trial } from "../../content/types";
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
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export function TrialPageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Trial | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem } = useAdminCRUD<Trial>("trial");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Trial>({
    dateLabel: "",
    isoDate: "",
    time: "",
    venue: "",
    ageGroups: "",
    registrationLimit: 50,
    status: "available",
    expiresAtIso: "",
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
        dateLabel: "",
        isoDate: new Date().toISOString().slice(0, 10),
        time: "",
        venue: "",
        ageGroups: "",
        registrationLimit: 50,
        status: "available",
        expiresAtIso: "",
        order: 0,
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Trial session updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Trial session created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trial session?")) {
      try {
        await deleteItem(id);
        toast.success("Trial session deleted successfully");
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
        <CardTitle>Trial Sessions Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trial Session
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Age Groups</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.data.dateLabel}
                </TableCell>
                <TableCell>{item.data.ageGroups}</TableCell>
                <TableCell>{item.data.time}</TableCell>
                <TableCell>{item.data.registrationLimit}</TableCell>
                <TableCell className="capitalize">{item.data.status ?? "available"}</TableCell>
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
                <DialogTitle>{editingId ? "Edit Trial Session" : "Add New Trial Session"}</DialogTitle>
                <DialogDescription>
                  Schedule and manage upcoming academy trial sessions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateLabel">Date Label</Label>
                  <Input
                    id="dateLabel"
                    value={formData.dateLabel}
                    onChange={(e) => setFormData({ ...formData, dateLabel: e.target.value })}
                    placeholder="e.g., Saturday, March 2, 2026"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="isoDate">ISO Date</Label>
                    <Input
                      id="isoDate"
                      type="date"
                      value={formData.isoDate}
                      onChange={(e) => setFormData({ ...formData, isoDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input 
                      id="time" 
                      value={formData.time} 
                      onChange={(e) => setFormData({...formData, time: e.target.value})} 
                      placeholder="e.g., 9:00 AM"
                      required 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input 
                    id="venue" 
                    value={formData.venue} 
                    onChange={(e) => setFormData({...formData, venue: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ageGroups">Age Groups</Label>
                    <Input
                      id="ageGroups"
                      value={formData.ageGroups}
                      onChange={(e) => setFormData({ ...formData, ageGroups: e.target.value })}
                      placeholder="e.g., U7, U9, U10"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="limit">Registration Limit</Label>
                    <Input 
                      id="limit" 
                      type="number"
                      value={formData.registrationLimit} 
                      onChange={(e) => setFormData({...formData, registrationLimit: parseInt(e.target.value)})} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status ?? "available"}
                      onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order ?? 0}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiresAtIso">Expires At (ISO, optional)</Label>
                  <Input
                    id="expiresAtIso"
                    value={formData.expiresAtIso ?? ""}
                    onChange={(e) => setFormData({ ...formData, expiresAtIso: e.target.value })}
                    placeholder="e.g., 2026-03-17T00:00:00.000Z"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
