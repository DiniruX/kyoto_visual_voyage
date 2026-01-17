
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Language = "en" | "ja";

export function LanguageToggle() {
  const [language, setLanguage] = useState<Language>("en");

  // In a real app, you'd implement proper i18n and persist the language choice
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // For demonstration purposes, just show language change
    console.log(`Language changed to: ${newLanguage}`);
    localStorage.setItem("language", newLanguage);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Change language(Development in progress)"
          aria-label="Change language(Development in progress)"
          disabled
        >
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("ja")}
          className={language === "ja" ? "bg-accent" : ""}
        >
          日本語
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
