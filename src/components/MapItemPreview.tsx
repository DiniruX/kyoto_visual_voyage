
import { Item, Category } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapItemPreviewProps {
  item: Item;
  category: Category | null;
  onClose: () => void;
}

const MapItemPreview = ({ item, category, onClose }: MapItemPreviewProps) => {
  return (
    <div className="absolute bottom-4 left-4 z-30 w-80 animate-in fade-in slide-in-from-bottom-4">
      <Card className="bg-white/95 backdrop-blur-sm border-kyoto-sakura/30">
        <CardHeader className="pb-2 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 h-6 w-6" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
          {category && (
            <CardDescription>
              Category: {category.name}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          <AspectRatio ratio={16/9} className="overflow-hidden rounded-md mb-3">
            <img
              src={item.images[0]}
              alt={item.name}
              className="object-cover w-full h-full hover:scale-105 transition-transform"
            />
          </AspectRatio>
          <p className="text-sm line-clamp-2">{item.description}</p>
        </CardContent>
        <CardFooter>
          <Link to={`/items/${item.id}`} className="w-full">
            <Button variant="outline" className="w-full border-kyoto-crimson text-kyoto-crimson hover:bg-kyoto-crimson/10">
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MapItemPreview;
