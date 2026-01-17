// Balage Diniru Sandipa
// M25W0576

import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 data-aos="fade-up" className="text-4xl font-bold mb-4">About This Project</h1>
          <div data-aos="fade-up" data-aos-delay="100" className="flex items-center gap-2 text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span>About</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-16">
          <div 
            ref={addToRefs}
            data-aos="fade-up" 
            data-aos-delay="100"
            className="opacity-0 transition-opacity duration-1000 delay-100"
          >
            <h2 className="text-2xl font-bold mb-4">About Kyoto Visual Voyage</h2>
            <p className="mb-4 text-lg">
              Kyoto Visual Voyage is an immersive guide to Kyoto, Japan, designed to showcase the city's unique blend of traditional culture and modern attractions through captivating visuals and comprehensive information.
            </p>
            <p className="text-lg">
              This project was created as a demonstration of a modern React application using best practices and engaging design principles.
            </p>
          </div>

          <div
            ref={addToRefs}
            data-aos="fade-up" 
            data-aos-delay="200"
            className="opacity-0 transition-opacity duration-1000 delay-200"
          >
            <h2 className="text-2xl font-bold mb-4">Technical Information</h2>
            <p className="mb-4 text-lg">
              This site was built using React, Tailwind CSS, and several modern web technologies. All data is stored in static JSON files rather than a database, making it completely client-side.
            </p>
            <p className="text-lg">
              Features include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2 text-lg">
              <li>Responsive design that works on mobile and desktop</li>
              <li>Interactive components with animations</li>
              <li>Image galleries and embedded videos</li>
              <li>Google Maps integration</li>
              <li>Background music with controls</li>
            </ul>
          </div>

          <div
            ref={addToRefs}
            data-aos="fade-up" 
            data-aos-delay="300"
            className="opacity-0 transition-opacity duration-1000 delay-300"
          >
            <h2 className="text-2xl font-bold mb-4">About Kyoto</h2>
            <p className="mb-4 text-lg">
              Kyoto served as Japan's capital and the emperor's residence from 794 until 1868. It is now the country's seventh largest city with a population of 1.4 million people.
            </p>
            <p className="text-lg">
              Over the centuries, Kyoto was destroyed by many wars and fires, but due to its exceptional historic value, the city was spared from air raids during World War II. Because of this, Kyoto is one of the few Japanese cities that still have an abundance of prewar buildings, such as traditional townhouses, and many important cultural sites including historic temples and shrines.
            </p>
          </div>

          <div
            ref={addToRefs}
            data-aos="fade-up" 
            data-aos-delay="400"
            className="opacity-0 transition-opacity duration-1000 delay-400"
          >
            <h2 className="text-2xl font-bold mb-4">Image Credits</h2>
            <p className="text-lg">
              All images used on this site are from Unsplash, a source for freely-usable images. I thank the photographers who make their work available for projects like this.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
