
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import CategoryCard from "@/components/CategoryCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Category, Item } from "@/types";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [featuredItem, setFeaturedItem] = useState<Item | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();

      // Sort by date (newest first)
        const cat = data?.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      setCategories(cat);
      setFilteredCategories(cat);

    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/items`);
      const data = await response.json();

      // Sort by date (newest first)
        const items = data?.data.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      setItems(items);

      if (items.length > 0) {
        // Randomly select a featured item
        const randomIndex = Math.floor(Math.random() * items.length);
        setFeaturedItem(items[randomIndex]);
      }

    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    // Load data
    const loadData = async () => {
      await fetchCategories();
      await fetchItems();
    };

    loadData();
  }, []);

  const handleFilterChange = (categoryId: string | null) => {
    setActiveFilter(categoryId);
    if (categoryId === null) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) => category.id === categoryId)
      );
    }
  };

  if (!featuredItem) return null;

  return (
    <div>
      <HeroSection />
      
      <section className="py-20 bg-kyoto-paper/50">
        <div className="container mx-auto px-4">
          <h2 data-aos="fade-up" className="text-3xl font-bold text-center mb-3 font-serif-jp">
            <span className="text-kyoto-crimson">探検</span> <span className="text-foreground">Explore Kyoto</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the enchanting city of Kyoto through its diverse attractions,
            from ancient temples to modern experiences.
          </p>
          
          <div data-aos="fade-up" data-aos-delay="200">
            <CategoryFilter 
              categories={categories} 
              onFilterChange={handleFilterChange} 
              className="mb-12"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {featuredItem && <FeaturedSection featuredItem={featuredItem} categories={categories} />}
    </div>
  );
};

export default HomePage;
