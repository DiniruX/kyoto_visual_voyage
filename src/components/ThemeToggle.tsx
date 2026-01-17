
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { LightbulbOff, Lightbulb } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Lightbulb className="h-5 w-5" />
      ) : (
        <LightbulbOff className="h-5 w-5" />
      )}
    </Button>
  );
}
