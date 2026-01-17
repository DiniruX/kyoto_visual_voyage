// Balage Diniru Sandipa
// M25W0576

import { useEffect, useState } from "react";
import { Category, Item } from "@/types";
import InteractiveMap from "@/components/InteractiveMap";
import { MapPin } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const KyotoMapPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const fetchAllItems = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories/items`);
        const data = await response.json();
  
        setItems(data.data);
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

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 data-aos="fade-up" className="text-4xl font-bold mb-2">Kyoto Map</h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground mb-8">
          Explore Kyoto attractions on an interactive map. Filter by categories and click on pins to see details.
        </p>
        
        <div className="flex items-center gap-2 mb-4" data-aos="fade-up" data-aos-delay="200">
          <MapPin className="w-4 h-4 text-kyoto-crimson" />
          <span className="text-sm text-muted-foreground">
            Click on pins to see attraction details
          </span>
        </div>
        
        <InteractiveMap 
          items={items} 
          categories={categories} 
          className="shadow-lg"
        />
      </div>
    </div>
  );
};

export default KyotoMapPage;
