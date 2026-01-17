import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MonthlyEventsPage = () => {
  const [months, setMonths] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  
  // New States: Separate the month details from the list of events
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const fetchEventData = async () => {
    try {
      // 1. Fetch Months (Metadata: description, highlight)
      const monthsRes = await fetch(`${BASE_URL}/event-months`);
      const monthsData = await monthsRes.json();
      const sortedMonths = monthsData?.data || [];
      setMonths(sortedMonths);

      // 2. Fetch All Events
      const eventsRes = await fetch(`${BASE_URL}/events`);
      const eventsData = await eventsRes.json();
      const eventsList = eventsData?.data || [];
      setAllEvents(eventsList);

      // 3. Initialize with Current Month
      const currentMonthName = format(new Date(), "MMMM");
      const monthRecord = sortedMonths.find(m => m.month.toLowerCase() === currentMonthName.toLowerCase());
      
      if (monthRecord) {
        updateDisplay(monthRecord, eventsList);
      } else if (sortedMonths.length > 0) {
        // Fallback to first month if current month isn't in DB
        updateDisplay(sortedMonths[0], eventsList);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Helper function to sync Month info and its Events
  const updateDisplay = (monthRecord, eventsList) => {
    setSelectedMonth(monthRecord);
    const relatedEvents = eventsList.filter(e => e.monthId === monthRecord.monthId);
    setFilteredEvents(relatedEvents);
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const handleMonthChange = (monthName: string) => {
    const monthRecord = months.find((m) => m.month.toLowerCase() === monthName.toLowerCase());
    if (monthRecord) {
      updateDisplay(monthRecord, allEvents);
    }
  };

  if (!selectedMonth) {
    return <div className="py-16 min-h-screen container mx-auto px-4">Loading events...</div>;
  }

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">What's Special This Month</h1>
          <p className="text-muted-foreground mb-8">
            Discover seasonal festivals and cultural activities happening in Kyoto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Month Selection */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Select Month</span>
                </CardTitle>
                <CardDescription>Currently showing {selectedMonth.month}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedMonth.month.toLowerCase()} orientation="vertical" className="w-full" onValueChange={handleMonthChange}>
                  <TabsList className="flex flex-col h-auto space-y-1">
                    {months.map((m) => (
                      <TabsTrigger key={m.id} value={m.month.toLowerCase()} className="justify-start text-left w-full">
                        {m.month}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Main Content: Month Details + Event Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Header: From the 'Months' table */}
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6 lg:p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-3">{selectedMonth.month} in Kyoto</h2>
              <p className="text-lg font-medium text-primary mb-2">Highlight: {selectedMonth.highlight}</p>
              <p className="text-muted-foreground">{selectedMonth.description}</p>
            </div>

            <h3 className="text-2xl font-bold mt-8">Featured Events</h3>
            
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <Card key={event.id}>
                    <div className="aspect-video overflow-hidden">
                      <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>
                        {event.date} • {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border rounded-lg border-dashed">
                <p className="text-muted-foreground">No specific events listed for this month yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEventsPage;