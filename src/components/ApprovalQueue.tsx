// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { toast } from "sonner";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ApprovalQueue = ({ images, tips, onCreated }: { images; tips; onCreated: () => void }) => {
  const updateStatus = async (type: "tips" | "images", id: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${type}/status/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Item status updated to '${newStatus}' successfully`);
        onCreated();
      }
    } catch (err) {
      toast.error("Action failed");
    }
  };

  //   image popup modal
  const imageModal = (imageSrc: string) => {
    const modal = document.getElementById("image-modal") as HTMLDivElement;
    const modalImg = document.getElementById("modal-image") as HTMLImageElement;
    if (modal && modalImg) {
      modal.style.display = "block";
      modalImg.src = imageSrc;
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("image-modal") as HTMLDivElement;
    if (modal) {
      modal.style.display = "none";
    }
  };

  return (
    <div className="space-y-6">
        {/* image popup modal */}
      <div id="image-modal" className="fixed z-50 inset-0 bg-black bg-opacity-75 flex items-center justify-center hidden" onClick={closeModal}>
        <img id="modal-image" className="max-w-6xl max-h-fit rounded" alt="Full Size" />
      </div>
      <Tabs defaultValue="tips" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="tips">User Tips ({tips.length})</TabsTrigger>
          <TabsTrigger value="images">User Images ({images.length})</TabsTrigger>
        </TabsList>

        {/* Tips Approval Table */}
        <TabsContent value="tips">
          <div className="bg-white rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Place</TableHead>
                    <TableHead>Current Status</TableHead>
                  <TableHead className="w-[40%]">Tip Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tips.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      No pending tips
                    </TableCell>
                  </TableRow>
                )}
                {tips.map((tip) => (
                  <TableRow key={tip.id}>
                    <TableCell>{tip.username}</TableCell>
                    <TableCell>{tip.placeName}</TableCell>
                    <TableCell>
                        {
                            tip.status === "pending" ? (
                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Pending</span>
                            ) : tip.status === "approved" ? (
                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">Approved</span>
                            ) : (
                                <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm">Rejected</span>
                            )
                        }
                    </TableCell>
                    <TableCell className="italic">"{tip.tip}"</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateStatus("tips", tip.id, "approved")}>
                        <Check size={16} className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateStatus("tips", tip.id, "rejected")}>
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Images Approval Table */}
        <TabsContent value="images">
          <div className="bg-white rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((img) => (
                  <TableRow key={img.id}>
                    <TableCell>
                      <img src={img.image_data} className="w-16 h-12 object-cover rounded border" alt="Pending" />
                    </TableCell>
                    <TableCell>{img.username}</TableCell>
                    <TableCell>{img.placeName}</TableCell>
                    <TableCell>
                        {
                            img.status === "pending" ? (
                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">Pending</span>
                            ) : img.status === "approved" ? (
                                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm">Approved</span>
                            ) : (
                                <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm">Rejected</span>
                            )
                        }
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => imageModal(img.image_data)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus("images", img.id, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus("images", img.id, "rejected")}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApprovalQueue;
