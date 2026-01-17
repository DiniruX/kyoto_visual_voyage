// Balage Diniru Sandipa
// M25W0576

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Item, Category } from "@/types";
import ImageGallery from "@/components/ImageGallery";
import GoogleMap from "@/components/GoogleMap";
import VideoPlayer from "@/components/VideoPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories/items`);
      const data = await response.json();

      setAllItems(data.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const fetchItemDetails = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/categories/items/${id}`);
      const data = await response.json();

      setItem(data.place);
      await fetchCategoryDetails(data.place ? data.place.categoryId : "");
    } catch (err) {
      console.error("Error fetching item:", err);
    }
  };

  const fetchCategoryDetails = async (categoryId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();

      const foundCategory = data.data.find((c: Category) => c.placeId === categoryId) || null;
      setCategory(foundCategory);
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };
  
  useEffect(() => {
    if (!itemId) return;
    const loadData = async () => {
      await fetchItemDetails(itemId);
      await fetchAllItems();
    };
    loadData();
  }, [itemId]);

  useEffect(() => {
    if (allItems.length > 0 && itemId) {
      const otherItems = allItems.filter((i) => i.id !== itemId);
      const shuffled = [...otherItems].sort(() => 0.5 - Math.random());
      setFeaturedItems(shuffled.slice(0, 3));

      if (contentRef.current) {
        contentRef.current.classList.remove("opacity-0");
        contentRef.current.classList.add("opacity-100");
      }
    }
  }, [allItems, itemId]);

  if (!item || !category) {
    return (
      <div className="py-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">
            {item.name}
          </h1>
          <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-2 text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/categories" className="hover:text-primary transition-colors">
              Categories
            </Link>
            <span>/</span>
            <Link to={`/categories/${category.id}`} className="hover:text-primary transition-colors">
              {category.name}
            </Link>
            <span>/</span>
            <span>{item.name}</span>
          </div>
        </div>

        <div ref={contentRef} className="opacity-0 transition-opacity duration-1000 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div data-aos="fade-up">
              <ImageGallery images={item.images} name={item.name} />
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl font-bold mb-3">About</h2>
              <p className="text-lg leading-relaxed">{item.description}</p>
            </div>

            {item.videoUrl && (
              <div data-aos="fade-up" data-aos-delay="300">
                <h2 className="text-2xl font-bold mb-3">Video Tour</h2>
                <VideoPlayer videoUrl={item.videoUrl} title={item.name} />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div data-aos="fade-up" data-aos-delay="400">
              <h2 className="text-2xl font-bold mb-3">Location</h2>
              <p className="mb-4">{item.address}</p>
              <GoogleMap lat={item.lat} lng={item.lng} address={item.address} />
            </div>

            <div data-aos="fade-up" data-aos-delay="500">
              <h2 className="text-2xl font-bold mb-3">Getting There</h2>
              <div className="bg-muted p-4 rounded-lg">
                <div className="mb-2">
                  <span className="font-semibold">Average time spent:</span> {item.avgSpendTime} minutes
                </div>
                <div>
                  <span className="font-semibold">Transport options:</span>
                  <ul className="list-disc list-inside mt-1">
                    {item.buses.map((bus, index) => (
                      <li key={index}>{bus}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Places Section */}
        <div className="mt-16" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-6">More Places to Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((featuredItem) => (
              <Card key={featuredItem.id} className="overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={featuredItem.images[0]} alt={featuredItem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{featuredItem.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{featuredItem.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full group">
                    <Link to={`/items/${featuredItem.placeId}`}>
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage;
