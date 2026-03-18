
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { HomeTeam } from "../../content/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { HomePageHighlights } from "./HomePageHighlights";

export function HomePageTeams() {
  const { items, loading, createItem, createMany, updateItem, deleteItem, deleteMany } =
    useAdminCRUD<HomeTeam>("homeTeam");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HomeTeam>({
    title: "",
    subtitle: "",
    ages: "",
    focus: "",
    time: "",
    days: "Friday & Saturday",
    order: 0,
  });

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
        toast.success("Team updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Team created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteItem(id);
        toast.success("Team deleted successfully");
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

  const fallbackPrograms: Array<HomeTeam & { color: string }> = [
    {
      title: "U7 & U9",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "4:00 PM - 5:00 PM",
      days: "Friday & Saturday",
      order: 0,
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "U10",
      subtitle: "Development Squad",
      ages: "10 years",
      focus: "Skill Development",
      time: "5:00 PM - 6:00 PM",
      days: "Friday & Saturday",
      order: 1,
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "U11-U13",
      subtitle: "Junior Academy",
      ages: "11-13 years",
      focus: "Tactical Awareness",
      time: "5:00 PM - 6:30 PM",
      days: "Friday & Saturday",
      order: 2,
      color: "from-orange-600 to-orange-800",
    },
    {
      title: "U14-U16",
      subtitle: "Youth Elite",
      ages: "14-16 years",
      focus: "Elite Performance",
      time: "6:00 PM - 7:30 PM",
      days: "Friday & Saturday",
      order: 3,
      color: "from-orange-700 to-orange-900",
    },
  ];

  const colors = [
    "from-orange-400 to-orange-600",
    "from-orange-500 to-orange-700",
    "from-orange-600 to-orange-800",
    "from-orange-700 to-orange-900",
  ];

  const sortedItems = [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
  const previewCards =
    sortedItems.length > 0
      ? sortedItems.map((item, index) => ({
          id: item.id,
          ...item.data,
          color: colors[index % colors.length],
        }))
      : fallbackPrograms.map((p, index) => ({ id: `fallback_${index}`, ...p }));

  const importDefaults = async () => {
    try {
      if (items.length > 0) {
        toast.message("Teams already exist");
        return;
      }
      await createMany(
        fallbackPrograms.map((p) => ({
          data: {
            title: p.title,
            subtitle: p.subtitle,
            ages: p.ages,
            focus: p.focus,
            time: p.time,
            days: p.days,
            order: p.order,
          },
          status: "published",
        }))
      );
      toast.success("Default teams imported");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import teams");
    }
  };

  const resetToDefaults = async () => {
    const ok = confirm("Delete all teams and restore the default 4?");
    if (!ok) return;
    try {
      const ids = items.map((i) => i.id);
      if (ids.length) await deleteMany(ids);
      await createMany(
        fallbackPrograms.map((p) => ({
          data: {
            title: p.title,
            subtitle: p.subtitle,
            ages: p.ages,
            focus: p.focus,
            time: p.time,
            days: p.days,
            order: p.order,
          },
          status: "published",
        }))
      );
      toast.success("Restored default teams");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to restore default teams");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Our Teams Management</CardTitle>
          <div className="flex gap-2">
            {items.length === 0 ? (
              <Button variant="outline" onClick={importDefaults}>
                Import Default Teams
              </Button>
            ) : (
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Default 4
              </Button>
            )}
            <Button onClick={() => handleOpen()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="text-sm font-semibold text-secondary mb-3">Preview (same as website)</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {previewCards.map((program, index) => (
                <Card
                  key={program.id}
                  className={`p-6 bg-gradient-to-br ${program.color} text-white h-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer`}
                  onClick={() => {
                    const real = sortedItems[index];
                    if (real) handleOpen(real);
                  }}
                >
                  <div className="text-3xl font-bold mb-2">{program.title}</div>
                  <div className="text-lg mb-4 opacity-90">{program.subtitle}</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Ages:</strong> {program.ages}
                    </div>
                    <div>
                      <strong>Focus:</strong> {program.focus}
                    </div>
                    <div>
                      <strong>Time:</strong> {program.time}
                    </div>
                    <div className="pt-2">
                      <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs">
                        Fri - Sat
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Ages</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.data.title}</TableCell>
                  <TableCell>{item.data.subtitle}</TableCell>
                  <TableCell>{item.data.ages}</TableCell>
                  <TableCell>{item.data.order}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpen(item)}
                      className="mr-2"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No teams found. Add your first team!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Team" : "Add New Team"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the training program card.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title (e.g., U7 & U9)</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle (e.g., Foundation Program)</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ages">Ages (e.g., 6-9 years)</Label>
                    <Input
                      id="ages"
                      value={formData.ages}
                      onChange={(e) => setFormData({ ...formData, ages: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="focus">Focus (e.g., Fun & Fundamentals)</Label>
                    <Input
                      id="focus"
                      value={formData.focus}
                      onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time (e.g., 4:00 PM - 5:00 PM)</Label>
                    <Input
                      id="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <HomePageHighlights />
    </div>
  );
}
