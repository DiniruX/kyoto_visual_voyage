
import { useState, useRef, useEffect } from 'react';
import { Category, Item } from '@/types';
import MapPin from './MapPin';
import MapItemPreview from './MapItemPreview';
import { CategoryFilter } from './CategoryFilter';
import { cn } from '@/lib/utils';
import { MapPin as MapPinIcon, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface InteractiveMapProps {
  items: Item[];
  categories: Category[];
  className?: string;
}

const InteractiveMap = ({ items, categories, className }: InteractiveMapProps) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapKey, setMapKey] = useState(0); // Force map reload when needed

  // This would ideally be a state value loaded from context/API
  const mapApiKey = 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'; // Demo key

  // Filter items by category
  const handleFilterChange = (categoryId: string | null) => {
    if (!categoryId) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => item.categoryId === categoryId);
      setFilteredItems(filtered);
    }
    // Force map refresh
    setMapKey(prevKey => prevKey + 1);
  };

  // Calculate map bounds to fit all pins
  const calculateMapBounds = () => {
    if (filteredItems.length === 0) return { lat: 35.0116, lng: 135.7681, zoom: 12 }; // Default to Kyoto center
    
    // Calculate center point from all pins
    const lats = filteredItems.map(item => item.location.coordinates.lat);
    const lngs = filteredItems.map(item => item.location.coordinates.lng);
    
    const center = {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
    };
    
    return { ...center, zoom: 12 };
  };

  const mapCenter = calculateMapBounds();

  return (
    <div className={cn("relative w-full h-[70vh] rounded-lg overflow-hidden", className)} data-aos="fade-up">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-foreground rounded-md px-4 py-2 shadow-md">
            <Filter className="w-4 h-4" /> 
            <span>Filter</span>
          </SheetTrigger>
          <SheetContent>
            <div className="py-6">
              <h3 className="text-lg font-medium mb-4">Filter by Category</h3>
              <CategoryFilter 
                categories={categories} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full h-full" ref={mapRef} key={mapKey}>
        {/* Google Maps iframe with pins */}
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=${mapApiKey}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapCenter.zoom}`}
        ></iframe>

        {/* Custom pins overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredItems.map((item) => (
            <MapPin 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedItem(item)}
              isSelected={selectedItem?.id === item.id}
            />
          ))}
        </div>
      </div>

      {/* Item preview when a pin is clicked */}
      {selectedItem && (
        <MapItemPreview
          item={selectedItem}
          category={categories.find(c => c.id === selectedItem.categoryId) || null}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default InteractiveMap;
