
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Lightbulb } from "lucide-react";

const facts = [
  "Kyoto was Japan's capital for over 1,000 years (794-1868).",
  "There are over 1,600 Buddhist temples in Kyoto.",
  "Kyoto was spared from bombing during WWII due to its cultural significance.",
  "The city has 17 UNESCO World Heritage Sites.",
  "Kinkaku-ji (Golden Pavilion) is actually coated in real gold leaf.",
  "Gion is one of Japan's most famous geisha districts.",
  "Kyoto's Fushimi Inari Shrine has over 10,000 torii gates.",
  "Kyoto is known as the 'City of Ten Thousand Shrines'.",
  "Nintendo was founded in Kyoto in 1889 as a playing card company.",
  "The Philosopher's Walk is a stone path following a canal lined with cherry trees."
];

export function KyotoFact() {
  const [lastShownFactIndex, setLastShownFactIndex] = useState<number | null>(null);

  const showRandomFact = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * facts.length);
    } while (randomIndex === lastShownFactIndex && facts.length > 1);
    
    setLastShownFactIndex(randomIndex);
    
    toast("Did you know?", {
      description: facts[randomIndex],
      icon: <Lightbulb className="h-5 w-5 text-kyoto-wasabi" />,
      duration: 6000,
    });
  };

  useEffect(() => {
    // Show first fact after 3 seconds
    const initialTimer = setTimeout(showRandomFact, 3000);
    
    // Show facts periodically
    const intervalTimer = setInterval(showRandomFact, 60000); // Every minute
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return null; // This component doesn't render anything
}
