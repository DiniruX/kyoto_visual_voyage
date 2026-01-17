import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import { toast } from "sonner";

interface UpdateUserModalProps {
  onUserCreated: () => void;
  userInfo: {
    id: string;
    username: string;
    role: string;
  };
}

const UpdateUserModal = ({ onUserCreated, userInfo }: UpdateUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting form data:", formData);

    fetch(`${BASE_URL}/users/${userInfo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add user");
        }
        return response.json();
      })
      .then((data) => {
        toast.success("User added successfully!");
        onUserCreated();
        setOpen(false);
        setFormData({ username: "", role: "" });
      })
      .catch((error) => {
        toast.error(`Failed to add user: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setFormData({
      username: userInfo.username,
      role: userInfo.role,
    });
  }, [userInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Role</Label>
              <Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="John Doe" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Save User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
