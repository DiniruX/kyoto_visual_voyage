
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Item, Category, Itinerary, ItineraryItem, ChecklistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Plus, X, Download, Route, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from 'uuid';
import PackingChecklist from "@/components/PackingChecklist";
import { set } from "date-fns";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const JourneyPlannerPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary>({
    id: uuidv4(),
    name: "My Kyoto Journey",
    items: [],
    dates: [],
    checklist: []
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"itinerary" | "packing">("itinerary");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  // Form
  const form = useForm({
    defaultValues: {
      name: "My Kyoto Journey",
      startDate: "",
      endDate: "",
    },
  });

  const fetchAllItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories/items`);
        const data = await response.json();
  
        setItems(data.data);
        setFilteredItems(data.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
  
    const fetchCategoryDetails = async (categoryId: string) => {
      try {
        const response = await fetch(`${BASE_URL}/categories`);
        const data = await response.json();

        setCategories(data.data);
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };

    useEffect(() => {
      const loadData = async () => {
        await fetchAllItems();
        await fetchCategoryDetails("");
      };
      loadData();
    }, []);

  useEffect(() => {    
    // Set default date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setAvailableDates([formattedDate]);
    
    // Update itinerary with default date
    setItinerary(prev => ({
      ...prev,
      dates: [formattedDate]
    }));
  }, [items, categories]);

  useEffect(() => {
    // change filtered items when category changes
    const places = selectedCategory
      ? items.filter(item => item.categoryId === selectedCategory)
      : items;
    setFilteredItems(places)
  }, [selectedCategory]);

  const addItemToItinerary = (item: Item) => {
    // Check if the item is already in the itinerary for the selected date
    const isItemInDate = itinerary.items.some(
      itineraryItem => itineraryItem.item.id === item.id && itineraryItem.date === selectedDate
    );

    if (isItemInDate) {
      toast.error("This attraction is already in your itinerary for this date");
      return;
    }

    // Calculate a reasonable start time based on existing items
    const existingItemsForDate = itinerary.items
      .filter(i => i.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    let startTime = "09:00";
    if (existingItemsForDate.length > 0) {
      const lastItem = existingItemsForDate[existingItemsForDate.length - 1];
      const [hours, minutes] = lastItem.startTime.split(':').map(Number);
      
      // Add the average spend time to calculate new start time
      const lastItemSpendTimeMinutes = lastItem.item.avgSpendTime;
      let newMinutes = minutes + lastItemSpendTimeMinutes;
      const newHours = hours + Math.floor(newMinutes / 60);
      newMinutes = newMinutes % 60;
      
      // Format the new time
      startTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    }

    // Create a new itinerary item
    const newItineraryItem: ItineraryItem = {
      item: item,
      date: selectedDate,
      startTime: startTime,
    };

    // Add to itinerary
    setItinerary(prev => ({
      ...prev,
      items: [...prev.items, newItineraryItem]
    }));

    toast.success(`Added ${item.name} to your itinerary`);
  };

  const removeItemFromItinerary = (itemToRemove: ItineraryItem) => {
    setItinerary(prev => ({
      ...prev,
      items: prev.items.filter(item => 
        !(item.item.id === itemToRemove.item.id && item.date === itemToRemove.date)
      )
    }));
    toast.success(`Removed ${itemToRemove.item.name} from your itinerary`);
  };

  const updateChecklist = (newChecklist: ChecklistItem[]) => {
    setItinerary(prev => ({
      ...prev,
      checklist: newChecklist
    }));
  };

  const addDate = () => {
    if (form.getValues().startDate && form.getValues().endDate) {
      const startDate = new Date(form.getValues().startDate);
      const endDate = new Date(form.getValues().endDate);
      
      if (startDate > endDate) {
        toast.error("End date must be after start date");
        return;
      }
      
      const newDates = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        newDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setAvailableDates(newDates);
      setSelectedDate(newDates[0]);
      setItinerary(prev => ({
        ...prev,
        dates: newDates,
        name: form.getValues().name
      }));
      
      toast.success(`Trip dates set from ${form.getValues().startDate} to ${form.getValues().endDate}`);
    } else {
      toast.error("Please enter both start and end dates");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(20);
    doc.text(itinerary.name, pageWidth / 2, 20, { align: 'center' });
    
    // Add dates
    doc.setFontSize(12);
    doc.text(`Trip Dates: ${itinerary.dates[0]} to ${itinerary.dates[itinerary.dates.length - 1]}`, 20, 30);
    
    let yPos = 40;
    
    // Group items by date
    const itemsByDate: Record<string, ItineraryItem[]> = {};
    itinerary.items.forEach(item => {
      if (!itemsByDate[item.date]) {
        itemsByDate[item.date] = [];
      }
      itemsByDate[item.date].push(item);
    });
    
    // Sort dates
    const sortedDates = Object.keys(itemsByDate).sort();
    
    // Add itinerary section
    doc.setFontSize(16);
    doc.text("Itinerary", 20, yPos);
    yPos += 10;
    
    sortedDates.forEach(date => {
      // If we're getting close to the end of the page, add a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add date header
      doc.setFontSize(14);
      doc.text(`Day: ${date}`, 20, yPos);
      yPos += 10;
      
      // Sort items by start time
      const sortedItems = itemsByDate[date].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
      
      sortedItems.forEach(item => {
        doc.setFontSize(12);
        doc.text(`${item.startTime} - ${item.item.name}`, 30, yPos);
        yPos += 7;
        
        doc.setFontSize(10);
        doc.text(`Duration: ${item.item.avgSpendTime} minutes`, 35, yPos);
        yPos += 5;
        
        doc.text(`Location: ${item.item.address}`, 35, yPos);
        yPos += 5;
        
        doc.text(`Transport: ${item.item.buses.join(", ")}`, 35, yPos);
        yPos += 10;
        
        // Check if we need a page break
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
      
      yPos += 10;
    });
    
    // Add packing checklist section if there are items
    if (itinerary.checklist && itinerary.checklist.length > 0) {
      doc.addPage();
      yPos = 20;
      
      doc.setFontSize(16);
      doc.text("Packing Checklist", 20, yPos);
      yPos += 10;
      
      // Group by category
      const categoriesMap: Record<string, ChecklistItem[]> = {};
      itinerary.checklist.forEach(item => {
        if (!categoriesMap[item.category]) {
          categoriesMap[item.category] = [];
        }
        categoriesMap[item.category].push(item);
      });
      
      // Print each category and its items
      Object.keys(categoriesMap).sort().forEach(category => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text(category, 20, yPos);
        yPos += 8;
        
        categoriesMap[category].forEach(item => {
          doc.setFontSize(10);
          doc.text(`□ ${item.name} ${item.checked ? '(Packed)' : ''}`, 30, yPos);
          yPos += 6;
          
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
        
        yPos += 5;
      });
    }
    
    // Save the PDF
    doc.save(`${itinerary.name.replace(/\s+/g, '_')}.pdf`);
    toast.success("Itinerary downloaded as PDF");
  };

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 data-aos="fade-up" className="text-4xl font-bold mb-2">Plan Your Journey</h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground mb-8">
          Create a personalized itinerary for your visit to Kyoto by selecting attractions, planning your days, and preparing with a packing checklist.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6" data-aos="fade-up" data-aos-delay="200">
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Set your trip name and dates</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Kyoto Adventure" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="button" onClick={addDate} className="w-full">
                      Set Trip Dates
                    </Button>
                  </div>
                </Form>
              </CardContent>
            </Card>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "itinerary" | "packing")}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="itinerary" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Itinerary</span>
                </TabsTrigger>
                <TabsTrigger value="packing" className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>Packing</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="itinerary">
                <Card>
                  <CardHeader>
                    <CardTitle>My Itinerary</CardTitle>
                    <CardDescription>
                      {itinerary.items.length} attractions planned over {itinerary.dates.length} days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <Tabs defaultValue={availableDates[0]} value={selectedDate} onValueChange={setSelectedDate}>
                      <TabsList className="w-full justify-start px-6 overflow-x-auto">
                        {availableDates.map(date => (
                          <TabsTrigger key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      {availableDates.map(date => (
                        <TabsContent key={date} value={date} className="px-6">
                          <div className="space-y-2 mt-2">
                            {itinerary.items
                              .filter(item => item.date === date)
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))
                              .map(item => (
                                <Card key={`${item.item.id}-${item.date}`} className="border border-border">
                                  <div className="p-4 flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="h-3 w-3" />
                                        <span>{item.startTime}</span>
                                        <span>({item.item.avgSpendTime} min)</span>
                                      </div>
                                      <h3 className="font-semibold mt-1">{item.item.name}</h3>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{item.item.address}</span>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-6 w-6 rounded-full"
                                      onClick={() => removeItemFromItinerary(item)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </Card>
                              ))}
                            
                            {itinerary.items.filter(item => item.date === date).length === 0 && (
                              <p className="text-center text-muted-foreground py-4">
                                No attractions added for this day yet
                              </p>
                            )}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="packing">
                <PackingChecklist 
                  checklist={itinerary.checklist || []}
                  onChange={updateChecklist}
                />
              </TabsContent>
              
              {itinerary.items.length > 0 && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2" 
                    onClick={generatePDF}
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Complete Plan PDF</span>
                  </Button>
                </div>
              )}
            </Tabs>
          </div>
          
          <div className="lg:col-span-8" data-aos="fade-up" data-aos-delay="300">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Attractions</CardTitle>
                    <CardDescription>Add places to visit to your itinerary</CardDescription>
                  </div>
                  <div>
                    <select 
                      className="p-2 border rounded-md text-sm"
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.placeId} value={category.placeId}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="overflow-hidden border-border">
                      <div className="aspect-[3/2] relative">
                        <img 
                          src={item.images[0]} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Avg. time: {item.avgSpendTime} minutes</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                          <Route className="h-3 w-3" />
                          <span className="truncate">{item.buses[0]}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">View Details</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{item.name}</DialogTitle>
                                <DialogDescription>
                                  {categories.find(c => c.id === item.categoryId)?.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="aspect-video overflow-hidden rounded-md">
                                <img 
                                  src={item.images[0]} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="space-y-3 mt-2">
                                <p>{item.description}</p>
                                <div>
                                  <h4 className="font-medium mb-1">Visit Duration</h4>
                                  <p className="text-sm flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>Approximately {item.avgSpendTime} minutes</span>
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Transportation</h4>
                                  <ul className="text-sm space-y-1">
                                    {item.buses.map((bus, idx) => (
                                      <li key={idx} className="flex items-center gap-1">
                                        <Route className="h-4 w-4" />
                                        <span>{bus}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Location</h4>
                                  <p className="text-sm flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{item.address}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <DialogClose asChild>
                                  <Button 
                                    onClick={() => addItemToItinerary(item)} 
                                    className="flex items-center gap-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span>Add to Itinerary</span>
                                  </Button>
                                </DialogClose>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" onClick={() => addItemToItinerary(item)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyPlannerPage;
