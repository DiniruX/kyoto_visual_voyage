
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <Link to={`/categories/${category.placeId}`}>
      <Card 
        data-aos="fade-up" 
        data-aos-delay={`${index * 100}`}
        className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group kyoto-card"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>
        <CardContent className="p-5">
          <h3 className="text-xl font-semibold mb-2 text-kyoto-crimson">{category.name}</h3>
          <p className="text-muted-foreground">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;
