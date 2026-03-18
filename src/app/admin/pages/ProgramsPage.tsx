
import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Program } from "../../content/types";
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
import { Loader2, Plus, Pencil, Trash2, X, CheckCircle2 } from "lucide-react";

export function ProgramsPageAdmin({
  editId,
  createPrefill,
}: {
  editId?: string | null;
  createPrefill?: Program | null;
}) {
  const { items, loading, createItem, updateItem, deleteItem } = useAdminCRUD<Program>("program");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCurriculum, setNewCurriculum] = useState("");
  const [formData, setFormData] = useState<Program>({
    title: "",
    subtitle: "",
    ages: "",
    focus: "",
    time: "",
    days: "Friday & Saturday",
    fee: "",
    description: "",
    curriculum: [],
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
        subtitle: "",
        ages: "",
        focus: "",
        time: "",
        days: "Friday & Saturday",
        fee: "",
        description: "",
        curriculum: [],
        order: 0,
      });
    }
    setIsOpen(true);
  };

  const addCurriculum = () => {
    if (!newCurriculum.trim()) return;
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, newCurriculum.trim()]
    });
    setNewCurriculum("");
  };

  const removeCurriculum = (index: number) => {
    const newCurriculumList = [...formData.curriculum];
    newCurriculumList.splice(index, 1);
    setFormData({ ...formData, curriculum: newCurriculumList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Program updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Program created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this program?")) {
      try {
        await deleteItem(id);
        toast.success("Program deleted successfully");
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
        <CardTitle>Programs Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Program
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Ages</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.data.title}</TableCell>
                <TableCell>{item.data.ages}</TableCell>
                <TableCell>{item.data.fee}</TableCell>
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Program" : "Add New Program"}</DialogTitle>
                <DialogDescription>
                  Define the training program details, curriculum, and pricing.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Program Title</Label>
                    <Input 
                      id="title" 
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input 
                      id="subtitle" 
                      value={formData.subtitle} 
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ages">Age Range</Label>
                    <Input 
                      id="ages" 
                      value={formData.ages} 
                      onChange={(e) => setFormData({...formData, ages: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fee">Monthly Fee</Label>
                    <Input 
                      id="fee" 
                      value={formData.fee} 
                      onChange={(e) => setFormData({...formData, fee: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time Slot</Label>
                    <Input 
                      id="time" 
                      value={formData.time} 
                      onChange={(e) => setFormData({...formData, time: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="focus">Focus Area</Label>
                    <Input 
                      id="focus" 
                      value={formData.focus} 
                      onChange={(e) => setFormData({...formData, focus: e.target.value})} 
                      required 
                    />
                  </div>
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
                  <Label>Training Curriculum</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newCurriculum} 
                      onChange={(e) => setNewCurriculum(e.target.value)} 
                      placeholder="e.g., Basic ball control"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCurriculum())}
                    />
                    <Button type="button" onClick={addCurriculum}>Add</Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.curriculum.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm">{c}</span>
                        </div>
                        <button type="button" onClick={() => removeCurriculum(idx)}>
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
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
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
