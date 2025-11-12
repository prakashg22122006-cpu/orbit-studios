import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, RotateCcw, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Study = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState<"pomodoro" | "deep">("pomodoro");
  const pomodoroTime = 25 * 60; // 25 minutes
  const deepFocusTime = 90 * 60; // 90 minutes
  const targetTime = sessionType === "pomodoro" ? pomodoroTime : deepFocusTime;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds < targetTime) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (seconds >= targetTime) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, targetTime]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / targetTime) * 100;

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const recentSessions = [
    { subject: "Mathematics", duration: 90, date: "Today", completed: true },
    { subject: "Chemistry", duration: 60, date: "Today", completed: true },
    { subject: "History", duration: 45, date: "Yesterday", completed: true },
    { subject: "Physics", duration: 75, date: "Yesterday", completed: true },
  ];

  const totalStudyTime = recentSessions.reduce((sum, s) => sum + s.duration, 0);
  const avgSessionTime = Math.round(totalStudyTime / recentSessions.length);

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl mb-2">Study Planner</h1>
              <p className="text-xl text-muted-foreground">
                Focus sessions, timers, and productivity tracking
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Timer Card */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Focus Timer</CardTitle>
              <CardDescription>
                Choose your study mode and start focusing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Selection */}
              <div className="flex gap-4">
                <Button
                  variant={sessionType === "pomodoro" ? "default" : "outline"}
                  onClick={() => {
                    setSessionType("pomodoro");
                    resetTimer();
                  }}
                  className="flex-1"
                >
                  Pomodoro (25 min)
                </Button>
                <Button
                  variant={sessionType === "deep" ? "default" : "outline"}
                  onClick={() => {
                    setSessionType("deep");
                    resetTimer();
                  }}
                  className="flex-1"
                >
                  Deep Focus (90 min)
                </Button>
              </div>

              {/* Timer Display */}
              <div className="text-center py-8">
                <div className="text-7xl md:text-8xl font-bold mb-4 gradient-hero bg-clip-text text-transparent">
                  {formatTime(seconds)}
                </div>
                <Progress value={progress} className="h-3 mb-6" />
                <p className="text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={toggleTimer}
                  className="w-32"
                >
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetTimer}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold">{Math.round(totalStudyTime / 60)}h</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-6 h-6 text-success" />
                  <span className="text-3xl font-bold">{recentSessions.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-accent" />
                  <span className="text-3xl font-bold">{avgSessionTime}</span>
                </div>
                <p className="text-sm text-muted-foreground">Avg. Session (min)</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="md:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Study Sessions</CardTitle>
              <CardDescription>Your focus history and productivity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.map((session, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
                  >
                    <Clock className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">{session.subject}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{session.duration} min</p>
                      <p className="text-xs text-success">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Study;
