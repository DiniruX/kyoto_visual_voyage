
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    // Animate elements on load
    const timer1 = setTimeout(() => {
      titleRef.current?.classList.add('translate-y-0', 'opacity-100');
    }, 300);
    
    const timer2 = setTimeout(() => {
      subtitleRef.current?.classList.add('translate-y-0', 'opacity-100');
    }, 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1602764363500-e8e8455de955?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center text-white z-10">
        <h1 
          ref={titleRef}
          data-aos="fade-up"
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 transform translate-y-10 opacity-0 transition-all duration-700 ease-out"
        >
          <span className="block font-serif-jp text-kyoto-sakura">京都の旅</span>
          <span className="block">Kyoto Visual Voyage</span>
        </h1>
        <p 
          ref={subtitleRef}
          data-aos="fade-up" 
          data-aos-delay="300"
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 transform translate-y-10 opacity-0 transition-all duration-700 delay-300 ease-out"
        >
          Experience the ancient capital's timeless beauty through an immersive visual journey
        </p>
        <div data-aos="fade-up" data-aos-delay="600" className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="group bg-kyoto-crimson hover:bg-kyoto-crimson/90">
            <Link to="/categories">
              Explore Kyoto
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
            <Link to="/about">
              About
            </Link>
          </Button>
        </div>
      </div>
      
      <div data-aos="fade-up" data-aos-delay="900" className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-white transform rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
