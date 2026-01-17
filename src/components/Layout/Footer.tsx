
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-kyoto-charcoal text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif-jp font-bold mb-4">
              <span className="text-kyoto-sakura">京都</span> Visual Voyage
            </h3>
            <p className="text-gray-300">
              Discover the beauty and culture of Kyoto, Japan through our visual journey.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-kyoto-sakura transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-kyoto-sakura transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-kyoto-sakura transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Disclaimer</h4>
            <p className="text-gray-300 text-sm">
              This is a demo project showcasing a visual guide to Kyoto. Images are from Unsplash.
              © {new Date().getFullYear()} Kyoto Visual Voyage
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
