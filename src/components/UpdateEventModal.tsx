// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Lock } from "lucide-react";
import { toast } from "sonner";

const UpdateEventModal = ({ months, onCreated, eventInfo }: { months; onCreated: () => void; eventInfo }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    monthId: "",
    name: "",
    date: "",
    description: "",
    image: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/events/${eventInfo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Event updated!");
        onCreated();
        setOpen(false);
        setFormData({ monthId: "", name: "", date: "", description: "", image: "", location: "" });
      }
    } catch (err) {
      toast.error("Error adding event");
    }
  };

  useEffect(() => {
    const mId = months.find((m) => m.monthId === eventInfo.monthId)?.monthId || "";
    setFormData({
      monthId: mId,
      name: eventInfo.name || "",
      date: eventInfo.date || "",
      description: eventInfo.description || "",
      image: eventInfo.image || "",
      location: eventInfo.location || "",
    });
  }, [eventInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>New Special Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Select Month<Lock size={12} className="inline-block ml-2 text-red-500" /></Label>
            <Input value={formData.monthId} onChange={(e) => setFormData({ ...formData, monthId: e.target.value })} placeholder="Month ID" disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Kite Festival" required />
            </div>
            <div className="space-y-2">
              <Label>Date/Duration</Label>
              <Input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="e.g. Jan 14-16" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City Center" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <Label>Event Image URL</Label>
            <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Post Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEventModal;
