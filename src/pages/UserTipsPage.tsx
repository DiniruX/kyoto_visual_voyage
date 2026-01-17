// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, MessageSquare, ThumbsUp, X } from "lucide-react";
import { UserTip, Item } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserTipsPage = () => {
  const [allTips, setAllTips] = useState<UserTip[]>([]);
  const [filteredTips, setFilteredTips] = useState<UserTip[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [placeFilter, setPlaceFilter] = useState<string | null>(null);
  const [addTipDialogOpen, setAddTipDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [newTip, setNewTip] = useState({
    placeId: "",
    tip: "",
    postedBy: "",
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

  // Load tips on component mount
  const fetchTips = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tips`);
      const data = await response.json();

      // Sort by likes (most popular first)
      const loadedTips = data.data.sort((a, b) => b.likes - a.likes);

      // filter only approved tips
      const approvedTips = loadedTips.filter((tip: UserTip) => tip.status === "approved");

      setAllTips(approvedTips);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching tips:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {

    fetchTips();
    fetchAllItems();
  }, []);

  // Apply filters when allTips or placeFilter changes
  useEffect(() => {
    let filtered = [...allTips];

    // Apply place filter if exists
    const placeId = searchParams.get("placeId");
    const currentFilter = placeId || placeFilter;

    if (currentFilter) {
      filtered = filtered.filter((tip) => tip.placeId === currentFilter);
      setPlaceFilter(currentFilter);
    }

    setFilteredTips(filtered);
  }, [allTips, placeFilter, searchParams]);

  // Handle form changes
  const handleTipChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTip({
      ...newTip,
      tip: e.target.value,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTip({
      ...newTip,
      postedBy: e.target.value,
    });
  };

  const handlePlaceChange = (placeId: string) => {
    setNewTip({
      ...newTip,
      placeId,
    });
  };

  // Handle tip submission
  const handleTipSubmit = () => {
    if (!newTip.placeId || !newTip.tip || !newTip.postedBy) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedPlace = items.find((item) => item.placeId === newTip.placeId);

    if (!selectedPlace) {
      toast.error("Invalid place selected");
      return;
    }

    // Create new tip object
    const newTipObj: UserTip = {
      id: uuidv4(),
      placeId: newTip.placeId,
      placeName: selectedPlace.name,
      tip: newTip.tip,
      uploadedAt: new Date().toISOString(),
      postedBy: newTip.postedBy,
      likes: 0,
      status: "pending",
    };

    fetch(`${BASE_URL}/tips`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTipObj),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Your tip has been shared!");
        // Update local state with new tip
        setAllTips((prev) => [newTipObj, ...prev]);
      })
      .catch((error) => {
        console.error("Error saving tip:", error);
        toast.error("Error saving tip");
      });

    // Reset form and close dialog
    setNewTip({
      placeId: "",
      tip: "",
      postedBy: "",
    });
    setAddTipDialogOpen(false);
  };

  // Filter tips by place
  const filterByPlace = (placeId: string | null) => {
    setPlaceFilter(placeId);
    if (placeId) {
      setSearchParams({ placeId });
    } else {
      setSearchParams({});
    }
    setFilterDialogOpen(false);
  };

  // Handle like tip
  const handleLikeTip = (tipId: string) => {
    const updatedTips = allTips.map((tip) => {
      if (tip.id === tipId) {
        return { ...tip, likes: tip.likes + 1 };
      }
      return tip;
    });
    setAllTips(updatedTips);

    fetch(`${BASE_URL}/tips/like/${tipId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Tip liked!");
        fetchTips();
      })
      .catch((error) => {
        console.error("Error liking tip:", error);
        toast.error("Error liking tip");
      });
  };

  // Format date "2025-12-27T06:18:20.000Z" to "December 27, 2025"
  const formatDate = (dateString: string) => {
    return format(dateString, "MMMM d, yyyy");
  };

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 data-aos="fade-up" className="text-4xl font-bold mb-2">
              Kyoto Travel Tips
            </h1>
            <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground">
              Insider advice and recommendations from fellow travelers
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Dialog open={addTipDialogOpen} onOpenChange={setAddTipDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Share a Tip
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share a Travel Tip</DialogTitle>
                  <DialogDescription>Help other travelers with your insider knowledge</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="place">Which place is this tip for?</Label>
                    <Select onValueChange={handlePlaceChange} value={newTip.placeId}>
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
                    <Label htmlFor="tip">Your tip</Label>
                    <Textarea id="tip" placeholder="Share your advice or recommendation..." value={newTip.tip} onChange={handleTipChange} rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" placeholder="Name or nickname" value={newTip.postedBy} onChange={handleNameChange} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAddTipDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTipSubmit}>Share Tip</Button>
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
                  <DialogTitle>Filter Tips</DialogTitle>
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

        {filteredTips.length === 0 ? (
          isLoading ? (
            <div className="flex justify-center items-center">
              <img src="/loader/loader.svg" alt="Loading..." className="h-24" />
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No tips yet</h2>
              <p className="text-muted-foreground mb-6">
                {placeFilter ? "No tips found for this location. Be the first to share one!" : "Be the first to share your advice with fellow travelers!"}
              </p>
              <Button onClick={() => setAddTipDialogOpen(true)}>Share a Tip</Button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTips.map((tip) => (
              <Card key={tip.id} data-aos="fade-up">
                <CardHeader>
                  <CardTitle className="text-lg">{tip.placeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{tip.tip}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      <span>
                        By {tip.postedBy} • {formatDate(tip.uploadedAt)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:text-primary" onClick={() => handleLikeTip(tip.id)}>
                      <ThumbsUp className="h-4 w-4" />
                      <span>{tip.likes}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTipsPage;
