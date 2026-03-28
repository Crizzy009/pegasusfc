import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAdminCRUD } from "./hooks/useAdminCRUD";
import type { Registration } from "../content/types";
import { Loader2, Trash2, Eye } from "lucide-react";

const LAST_SEEN_KEY = "registrations_last_seen";

export function RegistrationsPage() {
  const [searchParams] = useSearchParams();
  const { items, loading, error, updateItem, deleteItem } = useAdminCRUD<Registration>("registration");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<Registration | null>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.createdAt - a.createdAt),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((it) => {
      const d = it.data;
      return (
        String(d.playerName ?? "").toLowerCase().includes(q) ||
        String(d.guardianName ?? "").toLowerCase().includes(q) ||
        String(d.programTitle ?? "").toLowerCase().includes(q) ||
        String(d.phone ?? "").toLowerCase().includes(q) ||
        String(d.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [query, sorted]);

  useEffect(() => {
    if (sorted.length === 0) return;
    const latest = sorted[0]?.createdAt ?? 0;
    if (!latest) return;
    localStorage.setItem(LAST_SEEN_KEY, String(latest));
  }, [sorted]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    openDetails(item);
  }, [items, searchParams]);

  const openDetails = (item: any) => {
    setActiveId(item.id);
    setForm(item.data);
    setOpen(true);
  };

  const save = async () => {
    if (!activeId || !form) return;
    await updateItem(activeId, form);
    setOpen(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    await deleteItem(id);
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
        <CardTitle>Registrations</CardTitle>
        <div className="w-[320px] max-w-full">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, guardian, program, phone, email..."
          />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 flex items-center justify-between">
            <p className="text-sm">Error loading registrations: {error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{item.data.playerName}</TableCell>
                <TableCell>{item.data.programTitle}</TableCell>
                <TableCell>{item.data.guardianName}</TableCell>
                <TableCell className="capitalize">{item.data.status ?? "new"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => openDetails(item)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No registrations found.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {form ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Program</Label>
                  <Input value={form.programTitle} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status ?? "new"}
                    onValueChange={(v: any) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Player Name</Label>
                  <Input value={form.playerName} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Date of Birth</Label>
                  <Input value={form.dateOfBirth} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Gender</Label>
                  <Input value={form.gender} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Preferred Position</Label>
                  <Input value={form.position ?? ""} readOnly />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Address</Label>
                <Input value={form.address} readOnly />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>School</Label>
                  <Input value={form.school ?? ""} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={form.email} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Emergency Contact</Label>
                  <Input value={form.emergencyContact} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Guardian Name</Label>
                  <Input value={form.guardianName} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Medical Conditions</Label>
                  <Textarea value={form.medicalConditions ?? ""} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Experience</Label>
                  <Textarea value={form.experience ?? ""} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>Admin Notes</Label>
                  <Textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={() => void save()} disabled={!form}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
