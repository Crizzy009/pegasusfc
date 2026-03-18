
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Facility } from "../../content/types";
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
import { Loader2, Plus, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";

export function AboutPageFacilities() {
  const { items, loading, createItem, updateItem, deleteItem, upload } = useAdminCRUD<Facility>("facility");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [formData, setFormData] = useState<Facility>({
    name: "",
    descriptionHtml: "",
    amenities: [],
    images: [],
    order: 0,
  });

  const handleOpen = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item.data);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        descriptionHtml: "",
        amenities: [],
        images: [],
        order: 0,
      });
    }
    setIsOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        const res = await upload(files[i]);
        newImages.push({ url: res.originalUrl, alt: files[i].name });
      }
      setFormData({ ...formData, images: newImages });
      toast.success("Images uploaded successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity.trim()]
    });
    setNewAmenity("");
  };

  const removeAmenity = (index: number) => {
    const newAmenities = [...formData.amenities];
    newAmenities.splice(index, 1);
    setFormData({ ...formData, amenities: newAmenities });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateItem(editingId, formData);
        toast.success("Facility updated successfully");
      } else {
        await createItem(formData, "published");
        toast.success("Facility created successfully");
      }
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      try {
        await deleteItem(id);
        toast.success("Facility deleted successfully");
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

  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const fallbackFacilities: Facility[] = [
    {
      name: "Training Pitch",
      descriptionHtml: "Quality grass pitch with proper markings and goals for authentic match experience",
      amenities: [],
      images: [
        {
          url: placeholderPhotoUrl,
          alt: "Training Pitch",
          caption: "",
        },
      ],
      order: 10,
    },
    {
      name: "Modern Equipment",
      descriptionHtml: "Professional-grade training equipment including cones, bibs, and balls",
      amenities: [],
      images: [
        {
          url: placeholderPhotoUrl,
          alt: "Training Equipment",
          caption: "",
        },
      ],
      order: 20,
    },
  ];

  const sortedItems = [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
  const previewCards = sortedItems.length > 0 ? sortedItems : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Facilities Management</CardTitle>
        <Button onClick={() => handleOpen()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Facility
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <div className="text-sm font-semibold text-secondary mb-3">Preview (same as website)</div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            {(previewCards ? previewCards.map((i) => ({ id: i.id, facility: i.data })) : fallbackFacilities.map((f, idx) => ({ id: `fallback_${idx}`, facility: f }))).map(
              ({ id, facility }, index) => (
                <Card
                  key={id}
                  className="overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => {
                    const real = previewCards?.[index];
                    if (real) handleOpen(real);
                  }}
                >
                  <img
                    src={facility.images?.[0]?.url}
                    alt={facility.images?.[0]?.alt || facility.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-secondary">{facility.name}</h3>
                    <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: facility.descriptionHtml }} />
                    {facility.amenities?.length ? (
                      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        {facility.amenities.map((a, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Card>
              )
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted">
                    {item.data.images[0] && (
                      <img src={item.data.images[0].url} alt={item.data.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.data.name}</TableCell>
                <TableCell>{item.data.amenities.length} items</TableCell>
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
                <DialogTitle>{editingId ? "Edit Facility" : "Add New Facility"}</DialogTitle>
                <DialogDescription>
                  Manage the facilities available at the academy.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Facility Images</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded border overflow-hidden group">
                        <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded border border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Facility Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (HTML supported)</Label>
                  <Textarea 
                    id="description" 
                    value={formData.descriptionHtml} 
                    onChange={(e) => setFormData({...formData, descriptionHtml: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Amenities</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={newAmenity} 
                      onChange={(e) => setNewAmenity(e.target.value)} 
                      placeholder="e.g., Changing Rooms"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    />
                    <Button type="button" onClick={addAmenity}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((a, idx) => (
                      <div key={idx} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
                        {a}
                        <button type="button" onClick={() => removeAmenity(idx)}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
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
