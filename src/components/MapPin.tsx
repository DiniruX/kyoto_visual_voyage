
import { Item } from '@/types';
import { MapPin as MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapPinProps {
  item: Item;
  onClick: () => void;
  isSelected?: boolean;
}

const MapPin = ({ item, onClick, isSelected = false }: MapPinProps) => {
  // Calculate position based on map container size and coordinates
  // This is a simplified positioning that would need to be adjusted
  // based on the actual map implementation
  const calculatePosition = () => {
    const mapWidth = 100; // Use percentages for responsive positioning
    const mapHeight = 100;
    
    // These multipliers would need to be adjusted based on the map bounds
    // Simple linear mapping from lat/lng to percentages
    const left = ((item.location.coordinates.lng - 135.7) / 0.2) * mapWidth;
    const top = (1 - (item.location.coordinates.lat - 34.9) / 0.2) * mapHeight;
    
    return { left: `${left}%`, top: `${top}%` };
  };

  const position = calculatePosition();
  
  return (
    <div 
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto",
        "transition-all duration-300 hover:scale-125"
      )}
      style={{ left: position.left, top: position.top }}
      onClick={onClick}
    >
      <div className="relative">
        <MapPinIcon 
          className={cn(
            "w-6 h-6",
            isSelected ? "text-kyoto-crimson" : "text-primary",
            "drop-shadow-md"
          )}
        />
        
        {/* Pin shadow/reflection effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-black/30 rounded-full blur-[2px]"></div>
        
        {/* Pulse animation when selected */}
        {isSelected && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-kyoto-crimson/50"></div>
        )}
      </div>
    </div>
  );
};

export default MapPin;
