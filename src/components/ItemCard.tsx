
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Item } from "../types";
import { ArrowRight } from "lucide-react";

interface ItemCardProps {
  item: Item;
  index: number;
}

const ItemCard = ({ item, index }: ItemCardProps) => {
  return (
    <Link to={`/items/${item.placeId}`}>
      <Card 
        data-aos="fade-up" 
        data-aos-delay={`${index * 100}`}
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg group kyoto-card"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <CardContent className="p-5 relative">
          <h3 className="text-xl font-semibold mb-2 pr-8 text-kyoto-crimson">{item.name}</h3>
          <p className="text-muted-foreground line-clamp-2">{item.description.substring(0, 100)}...</p>
          <ArrowRight className="absolute right-5 top-5 text-kyoto-wasabi opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ItemCard;
