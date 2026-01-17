// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "@/components/CategoryCard";
import { Category } from "@/types";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories`);
        const data = await response.json();

        // Sort by date (newest first)
        const loadedPhotos = data?.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        setCategories(loadedPhotos);
        setIsLoading(false);
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

    fetchImages();
  }, []);

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">
            Explore Kyoto
          </h1>
          <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>Categories</span>
          </div>
        </div>

        <div ref={contentRef} className="opacity-0 transition-opacity duration-1000 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
