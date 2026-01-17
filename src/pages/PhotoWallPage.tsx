// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Filter, X } from "lucide-react";
import { UserPhoto, Item } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PhotoWallPage = () => {
  const [allPhotos, setAllPhotos] = useState<UserPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<UserPhoto[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [placeFilter, setPlaceFilter] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState({
    image: "",
    placeId: "",
    caption: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);

  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/items`);
      const data = await response.json();

      setItems(data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  // Load photos on component mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/images`);
        const data = await response.json();

        // Sort by date (newest first)
        const loadedPhotos = data.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        // filter only approved photos
        const approvedPhotos = loadedPhotos.filter((photo: UserPhoto) => photo.status === "approved");

        setAllPhotos(approvedPhotos);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching images:", err);
        setIsLoading(false);
      }
    };

    fetchImages();
    fetchAllItems();
  }, []);

  // Apply filters when allPhotos or placeFilter changes
  useEffect(() => {
    let filtered = [...allPhotos];

    // Apply place filter if exists
    const placeId = searchParams.get("placeId");
    const currentFilter = placeId || placeFilter;

    if (currentFilter) {
      filtered = filtered.filter((photo) => photo.placeId === currentFilter);
      setPlaceFilter(currentFilter);
    }

    setFilteredPhotos(filtered);
  }, [allPhotos, placeFilter, searchParams]);

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8000000) {
      toast.error("Image must be less than 8MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setUploadData({
        ...uploadData,
        image: result,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle place selection
  const handlePlaceChange = (placeId: string) => {
    setUploadData({
      ...uploadData,
      placeId,
    });
  };

  // Handle caption change
  const handleCaptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUploadData({
      ...uploadData,
      caption: e.target.value,
    });
  };

  // Handle photo upload
  const handlePhotoUpload = () => {
    if (!uploadData.image || !uploadData.placeId) {
      toast.error("Please select an image and place");
      return;
    }

    const selectedPlace = items.find((item) => item.placeId === uploadData.placeId);

    if (!selectedPlace) {
      toast.error("Invalid place selected");
      return;
    }

    // Create new photo object
    const newPhoto: UserPhoto = {
      id: uuidv4(),
      image_data: uploadData.image,
      placeId: uploadData.placeId,
      placeName: selectedPlace.name,
      uploadedAt: new Date().toISOString(),
      caption: uploadData.caption || undefined,
      status: "pending",
    };

    const fileInput = document.querySelector("#photo") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    const formdata = new FormData();
    formdata.append("id", newPhoto.id);
    formdata.append("image", file);
    formdata.append("placeId", uploadData.placeId);
    formdata.append("placeName", selectedPlace.name);
    formdata.append("caption", uploadData.caption);

    fetch(`${BASE_URL}/images`, {
      method: "POST",
      body: formdata,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Photo uploaded successfully!");
        // Update local state with new photo
        setAllPhotos((prev) => [newPhoto, ...prev]);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
        toast.error("Error uploading photo");
      });

    // Reset form and close dialog
    setPreviewImage(null);
    setUploadData({
      image: "",
      placeId: "",
      caption: "",
    });
    setUploadDialogOpen(false);
  };

  // Filter photos by place
  const filterByPlace = (placeId: string | null) => {
    setPlaceFilter(placeId);
    if (placeId) {
      setSearchParams({ placeId });
    } else {
      setSearchParams({});
    }
    setFilterDialogOpen(false);
  };

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 data-aos="fade-up" className="text-4xl font-bold mb-2">
              Kyoto Memories
            </h1>
            <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground">
              Share and explore visitor photos from across Kyoto
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload a new photo</DialogTitle>
                  <DialogDescription>Share your Kyoto experience with other travelers</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo">Choose photo</Label>
                    <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
                    {previewImage && (
                      <div className="mt-2 relative">
                        <img src={previewImage} alt="Preview" className="w-full h-auto max-h-64 object-cover rounded-md" />
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-8 w-8" onClick={() => setPreviewImage(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="place">Location</Label>
                    <Select onValueChange={handlePlaceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((item) => (
                          <SelectItem key={item.placeId} value={item.placeId}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption">Caption (optional)</Label>
                    <Textarea id="caption" placeholder="Add a caption to your photo" value={uploadData.caption} onChange={handleCaptionChange} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePhotoUpload}>Upload</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Photos</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label className="mb-2 block">Filter by location</Label>
                  <Select value={placeFilter || "__all__"} onValueChange={(value) => filterByPlace(value === "__all__" ? null : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All locations</SelectItem>
                      {items.map((item) => (
                        <SelectItem key={item.placeId} value={item.placeId}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {placeFilter && (
          <div className="mb-6 flex items-center">
            <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 flex items-center gap-2">
              <span>Filtered by: {items.find((item) => item.placeId === placeFilter)?.name}</span>
              <Button size="icon" variant="ghost" className="h-5 w-5" onClick={() => filterByPlace(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {filteredPhotos.length === 0 ? (
          isLoading ? (
            <div className="flex justify-center items-center">
              <img src="/loader/loader.svg" alt="Loading..." className="h-24" />
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No photos yet</h2>
              <p className="text-muted-foreground mb-6">
                {placeFilter ? "No photos found for this location. Be the first to share one!" : "Be the first to share your Kyoto memories!"}
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>Upload a Photo</Button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-md" data-aos="fade-up" data-aos-delay={(Math.random() * 500).toString()}>
                <img src={photo.image_data} alt={photo.caption || photo.placeName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <p className="text-white text-sm font-medium mb-1">{photo.placeName}</p>
                  {photo.caption && <p className="text-white/90 text-sm">{photo.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoWallPage;
