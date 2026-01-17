// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import { Category, Item } from "@/types";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryDetailPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchAndSetCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();

      const foundCategory = data.data.find((cat) => cat.placeId === categoryId) || null;
      setCategory(foundCategory);
      if (contentRef.current) {
        setTimeout(() => {
          contentRef.current?.classList.add("fade-in");
        }, 100);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      setIsLoading(false);
    }
  };

  const fetchItemsInCategory = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryId}/items`);
      const data = await response.json();

      const categoryItems = data.data;
      setItems(categoryItems);
      if (contentRef.current) {
        setTimeout(() => {
          contentRef.current?.classList.add("fade-in");
        }, 100);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAndSetCategory();
      await fetchItemsInCategory();
      setIsLoading(false);
    };
    fetchData();
  }, [categoryId]);

  if (!category) return null;

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">
            {category.name}
          </h1>
          <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-2 text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>
          <p data-aos="fade-up" data-aos-delay="200" className="text-lg">
            {category.description}
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <ItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div data-aos="fade-up" className="text-center py-12">
            <p className="text-muted-foreground">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
