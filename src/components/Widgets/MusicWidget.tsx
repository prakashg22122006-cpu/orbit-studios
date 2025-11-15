import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause, SkipForward, SkipBack } from "lucide-react";

const playlist = [
  "Lo-fi Study Beats",
  "Classical Focus",
  "Ambient Rain",
  "Nature Sounds",
  "Instrumental Jazz"
];

export const MusicWidget = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState([25]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setProgress([0]);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress([0]);
  };

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5" />
          Focus Music
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-lg font-medium mb-1">{playlist[currentTrack]}</div>
          <div className="text-sm text-muted-foreground">Study Playlist</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Progress</div>
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon" onClick={prevTrack}>
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={nextTrack}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Volume: {volume[0]}%</div>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
