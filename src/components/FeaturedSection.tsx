
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Category, Item } from "../types";

interface FeaturedSectionProps {
  featuredItem: Item;
  categories: Category[];
}

const FeaturedSection = ({ featuredItem, categories }: FeaturedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 opacity-0 transition-opacity duration-1000"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${featuredItem.images[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl text-white">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold mb-4">Featured: {featuredItem.name}</h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-lg mb-6 text-gray-200">{featuredItem.description.substring(0, 150)}...</p>
          <div data-aos="fade-up" data-aos-delay="200" className="flex flex-wrap gap-4 mb-8">
            {categories.slice(0, 4).map((category, index) => (
              <Link 
                key={category.placeId} 
                to={`/categories/${category.placeId}`}
                data-aos="fade-up"
                data-aos-delay={`${300 + index * 50}`}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <Button asChild className="group" data-aos="fade-up" data-aos-delay="500">
            <Link to={`/items/${featuredItem.placeId}`}>
              Explore Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
