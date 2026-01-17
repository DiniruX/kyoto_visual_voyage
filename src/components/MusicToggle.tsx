
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume, VolumeX } from "lucide-react";

export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Using a nature sounds track instead of the previous music
    // audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    audioRef.current = new Audio("/bg-music/japanese-piano.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; 
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMusic}
      title={isPlaying ? "Mute nature sounds" : "Play nature sounds"}
      aria-label={isPlaying ? "Mute nature sounds" : "Play nature sounds"}
    >
      {isPlaying ? <Volume className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
    </Button>
  );
}
