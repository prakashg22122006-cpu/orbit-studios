import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Play, Pause, RotateCcw, BarChart3, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  date: string;
  completed: boolean;
}

const Study = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState<"pomodoro" | "deep">("pomodoro");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const { toast } = useToast();

  const pomodoroTime = 25 * 60;
  const deepFocusTime = 90 * 60;
  const targetTime = sessionType === "pomodoro" ? pomodoroTime : deepFocusTime;

  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds < targetTime) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (seconds >= targetTime) {
      setIsActive(false);
      completeSession();
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

  const toggleTimer = () => {
    if (!isActive && seconds === 0 && !currentSubject) {
      setIsSubjectDialogOpen(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const startWithSubject = () => {
    if (currentSubject.trim()) {
      setIsSubjectDialogOpen(false);
      setIsActive(true);
      toast({
        title: "Study session started",
        description: `Focus on ${currentSubject}`,
      });
    }
  };

  const completeSession = () => {
    if (currentSubject) {
      const newSession: StudySession = {
        id: Date.now(),
        subject: currentSubject,
        duration: Math.floor(targetTime / 60),
        date: new Date().toLocaleDateString(),
        completed: true
      };
      setSessions([newSession, ...sessions]);
      setCurrentSubject("");
      toast({
        title: "Session completed! 🎉",
        description: `Great work on ${currentSubject}`,
      });
    }
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast({
      title: "Session deleted",
      description: "Study session has been removed",
    });
  };

  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgSessionTime = sessions.length > 0 ? Math.round(totalStudyTime / sessions.length) : 0;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
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
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Focus Timer</CardTitle>
              <CardDescription>
                {currentSubject ? `Studying: ${currentSubject}` : "Choose your study mode and start focusing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button
                  variant={sessionType === "pomodoro" ? "default" : "outline"}
                  onClick={() => {
                    setSessionType("pomodoro");
                    resetTimer();
                  }}
                  className="flex-1"
                  disabled={isActive}
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
                  disabled={isActive}
                >
                  Deep Focus (90 min)
                </Button>
              </div>

              <div className="text-center py-8">
                <div className="text-7xl md:text-8xl font-bold mb-4 gradient-hero bg-clip-text text-transparent">
                  {formatTime(seconds)}
                </div>
                <Progress value={progress} className="h-3 mb-6" />
                <p className="text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>

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
                  disabled={isActive}
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

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
                  <span className="text-3xl font-bold">{sessions.length}</span>
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

          <Card className="md:col-span-3 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Study Sessions</CardTitle>
              <CardDescription>Your focus history and productivity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No study sessions yet</p>
                  <p className="text-sm">Start your first focus session above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 group hover:bg-secondary transition-smooth"
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-smooth"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What are you studying?</DialogTitle>
            <DialogDescription>Enter the subject or topic for this focus session</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Subject/Topic</Label>
            <Input 
              placeholder="e.g., Mathematics, Chemistry, History..."
              value={currentSubject}
              onChange={(e) => setCurrentSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startWithSubject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button>
            <Button onClick={startWithSubject}>Start Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Study;
