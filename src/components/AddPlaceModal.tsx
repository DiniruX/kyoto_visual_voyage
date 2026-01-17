import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const AddPlaceModal = ({ categories, onCreated }: { categories, onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    placeId: "",
    categoryId: "",
    name: "",
    description: "",
    address: "",
    lat: "",
    lng: "",
    images: "",
    videoUrl: "",
    avgSpendTime: "",
    buses: "" // Expects comma separated string
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In many APIs, images and buses should be arrays. 
    // If your backend strictly wants strings, we send as is.
    // Otherwise, we would .split(",") them here.

    // check placeId has spaces
    if (formData.placeId.includes(" ")) {
      toast.error("Place ID (slug) cannot contain spaces");
      return;
    }
    
    try {
      // make images and buses arrays
      const formattedData = {
        ...formData,
        images: formData.images.split(",").map(img => img.trim()),
        buses: formData.buses.split(",").map(bus => bus.trim()),
      };
      console.log("Submitting data:", formattedData);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/categories/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([formattedData]),
      });

      if (response.ok) {
        toast.success("Place added successfully!");
        onCreated();
        setOpen(false);
      }
    } catch (err) {
      toast.error("Error adding place");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Place</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader><DialogTitle>Add New Place</DialogTitle></DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(val) => setFormData({...formData, categoryId: val})}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.placeId} value={cat.placeId}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Place ID (Slug)</Label>
              <Input value={formData.placeId} onChange={(e) => setFormData({...formData, placeId: e.target.value})} placeholder="e.g., sunny-beach" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input type="text" value={formData.lat} onChange={(e) => setFormData({...formData, lat: e.target.value})} placeholder="6.9271" />
            </div>
            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input type="text" value={formData.lng} onChange={(e) => setFormData({...formData, lng: e.target.value})} placeholder="79.8612" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Average Time (min)</Label>
              <Input type="text" value={formData.avgSpendTime} onChange={(e) => setFormData({...formData, avgSpendTime: e.target.value})} placeholder="120" />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} placeholder="YouTube Link" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images (Comma separated URLs)</Label>
            <Input value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} placeholder="url1, url2, url3" />
          </div>

          <div className="space-y-2">
            <Label>Buses (Comma separated)</Label>
            <Input value={formData.buses} onChange={(e) => setFormData({...formData, buses: e.target.value})} placeholder="Bus 101, Bus 138" />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">Save Place</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlaceModal;