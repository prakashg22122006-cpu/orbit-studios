import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FocusTimerWidget = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const totalTime = 25 * 60;
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessions((s) => s + 1);
            toast({
              title: "Focus session complete! 🎉",
              description: "Take a 5-minute break",
            });
            return totalTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, toast]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Focus Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{formatTime(timeLeft)}</div>
          <div className="text-sm text-muted-foreground">Pomodoro Session</div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex justify-center gap-2">
          <Button size="lg" onClick={toggleTimer}>
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="outline" onClick={resetTimer}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold">{sessions}</div>
          <div className="text-xs text-muted-foreground">Sessions Today</div>
        </div>
      </CardContent>
    </Card>
  );
};
