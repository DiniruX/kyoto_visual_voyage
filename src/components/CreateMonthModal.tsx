// Balage Diniru Sandipa
// M25W0576

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const CreateMonthModal = ({ onCreated }: { onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    monthId: "",
    month: "",
    highlight: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate monthId has no spaces
    if (formData.monthId.includes(" ")) {
      toast.error("Month ID (slug) cannot contain spaces");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/event-months`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Month updated/created!");
        onCreated();
        setOpen(false);
        setFormData({ monthId: "", month: "", highlight: "", description: "" });
      }
    } catch (err) {
      toast.error("Failed to save month details");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Add Month
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Configure Month Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Month ID (Unique Slug)</Label>
            <Input value={formData.monthId} onChange={(e) => setFormData({ ...formData, monthId: e.target.value })} placeholder="january" required />
          </div>
          <div className="space-y-2">
            <Label>Month Name</Label>
            <Input value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} placeholder="January" required />
          </div>
          <div className="space-y-2">
            <Label>Seasonal Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Best time for hiking..." required />
          </div>
          <div className="space-y-2">
            <Label>Highlight</Label>
            <Input value={formData.highlight} onChange={(e) => setFormData({ ...formData, highlight: e.target.value })} placeholder="Gion Matsuri" required />
          </div>
          <DialogFooter>
            <Button type="submit">Save Month</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMonthModal;
