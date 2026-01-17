// Balage Diniru Sandipa
// M25W0576

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  placeId: string;  
}

export interface Item {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  videoUrl?: string;
  avgSpendTime: number;
  buses: string[];
  placeId: string;
}

export interface ItineraryItem {
  item: Item;
  date: string;
  startTime: string;
  endTime?: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface Itinerary {
  id: string;
  name: string;
  description?: string;
  dates: string[];
  items: ItineraryItem[];
  checklist?: ChecklistItem[];
}

export interface MonthlyEvent {
  id: string;
  monthId: string;
  month: string;
  highlight: string;
  description: string;
  featuredEvents: FeaturedEvent[];
}

export interface FeaturedEvent {
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
}

export interface UserPhoto {
  id: string;
  image_data: string;
  placeId: string;
  placeName: string;
  uploadedAt: string;
  caption?: string;
  uploadedBy?: string;
  status: "pending" | "approved" | "rejected";
}

export interface UserTip {
  id: string;
  placeId: string;
  placeName: string;
  tip: string;
  uploadedAt: string;
  postedBy: string;
  likes: number;
  status: "pending" | "approved" | "rejected";
}
