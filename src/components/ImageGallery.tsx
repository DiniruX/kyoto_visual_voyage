// Balage Diniru Sandipa
// M25W0576

import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full" data-aos="fade-up">
      <Carousel className="w-full max-w-4xl mx-auto" setApi={setApi}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img src={image} alt={`${name} - image ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center mt-4">
          <CarouselPrevious className="relative -left-0 top-0 translate-y-0" />
          <div className="mx-4 text-sm text-muted-foreground">
            {currentIndex + 1} / {images.length}
          </div>
          <CarouselNext className="relative -right-0 top-0 translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default ImageGallery;
