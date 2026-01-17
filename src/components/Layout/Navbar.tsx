
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "../ThemeToggle";
import { MusicToggle } from "../MusicToggle";
import { LanguageToggle } from "../LanguageToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, Calendar, Camera, MessageSquare } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Map", path: "/map", icon: <MapPin className="w-4 h-4" /> },
    { name: "Plan Journey", path: "/planner", icon: <Calendar className="w-4 h-4" /> },
    { name: "Monthly Events", path: "/events", icon: <Calendar className="w-4 h-4" /> },
    { name: "Photo Wall", path: "/photos", icon: <Camera className="w-4 h-4" /> },
    { name: "Travel Tips", path: "/tips", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-jp text-xl font-bold tracking-tight text-kyoto-crimson">
              京都<span className="text-sm text-foreground">Kyoto Guide</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-1">
                  {link.icon}
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>

          {/* Right section - Theme toggle, etc */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <MusicToggle />
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary p-2 rounded-md flex items-center gap-2",
                        location.pathname === link.path
                          ? "text-primary bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
