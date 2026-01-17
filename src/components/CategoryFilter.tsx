
import { useState } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  onFilterChange: (categoryId: string | null) => void;
  className?: string;
}

export function CategoryFilter({ categories, onFilterChange, className }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    onFilterChange(categoryId);
  };

  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      <Button
        variant="outline"
        className={cn(
          "border-kyoto-sakura/30 hover:border-kyoto-sakura",
          activeCategory === null ? "bg-kyoto-sakura/20 border-kyoto-crimson" : ""
        )}
        onClick={() => handleCategoryClick(null)}
      >
        All
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={cn(
            "border-kyoto-sakura/30 hover:border-kyoto-sakura",
            activeCategory === category.id ? "bg-kyoto-sakura/20 border-kyoto-crimson" : ""
          )}
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
