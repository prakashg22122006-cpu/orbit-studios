import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Play, Pause, RotateCcw, BarChart3, Trash2, Download, Settings, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  date: string;
  completed: boolean;
  sessionType: string;
}

interface Settings {
  pomodoroDuration: number;
  deepFocusDuration: number;
  breakDuration: number;
  enableBreakReminders: boolean;
  enableMotivation: boolean;
  enableSound: boolean;
  soundVolume: number;
}

const motivationalMessages = [
  "You're doing amazing! Keep it up! 🌟",
  "Focus is your superpower! 💪",
  "Every minute counts towards your goals! 🎯",
  "You're one step closer to success! 🚀",
  "Believe in yourself! You've got this! ✨",
  "Stay focused, stay strong! 🔥",
  "Your hard work will pay off! 💎",
  "Progress, not perfection! 📈",
];

const Study = () => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessionType, setSessionType] = useState<"pomodoro" | "deep">("pomodoro");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState<Settings>({
    pomodoroDuration: 25,
    deepFocusDuration: 90,
    breakDuration: 5,
    enableBreakReminders: true,
    enableMotivation: true,
    enableSound: false,
    soundVolume: 50,
  });

  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const savedSettings = localStorage.getItem('focusSettings');
    const savedStreak = localStorage.getItem('focusStreak');
    
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedStreak) setCurrentStreak(parseInt(savedStreak));
  }, []);

  useEffect(() => { localStorage.setItem('studySessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('focusSettings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('focusStreak', currentStreak.toString()); }, [currentStreak]);

  const targetTime = isBreakTime ? settings.breakDuration * 60 : (sessionType === "pomodoro" ? settings.pomodoroDuration : settings.deepFocusDuration) * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds < targetTime) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (seconds >= targetTime) {
      setIsActive(false);
      isBreakTime ? completeBreak() : completeSession();
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, seconds, targetTime, isBreakTime]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (seconds / targetTime) * 100;

  const toggleTimer = () => {
    if (!isActive && seconds === 0 && !currentSubject && !isBreakTime) {
      setIsSubjectDialogOpen(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setIsBreakTime(false);
  };

  const startWithSubject = () => {
    if (currentSubject.trim()) {
      setIsSubjectDialogOpen(false);
      setIsActive(true);
      if (settings.enableMotivation) {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        toast({ title: randomMessage, description: `Focus session started: ${currentSubject}` });
      }
    }
  };

  const completeSession = () => {
    if (currentSubject) {
      const newSession: StudySession = {
        id: Date.now(),
        subject: currentSubject,
        duration: Math.floor(targetTime / 60),
        date: new Date().toISOString(),
        completed: true,
        sessionType: sessionType
      };
      setSessions([newSession, ...sessions]);
      setCurrentStreak(currentStreak + 1);
      toast({ title: "Session completed! 🎉", description: `Great work on ${currentSubject}. Streak: ${currentStreak + 1}` });

      if (settings.enableBreakReminders && sessionType === "pomodoro") {
        setIsBreakTime(true);
        setSeconds(0);
        setIsActive(true);
        toast({ title: "Break time! 🌿", description: `Take a ${settings.breakDuration} minute break` });
      } else {
        setCurrentSubject("");
      }
    }
  };

  const completeBreak = () => {
    setIsBreakTime(false);
    setSeconds(0);
    setCurrentSubject("");
    toast({ title: "Break completed!", description: "Ready for your next session?" });
  };

  const deleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast({ title: "Session deleted", description: "Study session has been removed" });
  };

  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    const today = new Date().toDateString();
    return sessions.filter(s => new Date(s.date).toDateString() === today).length;
  };

  const calculateFocusRatio = () => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const daysPassed = sessions.length > 0 ? Math.max(1, Math.ceil((Date.now() - new Date(sessions[sessions.length - 1].date).getTime()) / (1000 * 60 * 60 * 24))) : 1;
    const expectedMinutes = daysPassed * 120;
    return Math.min(100, Math.round((totalMinutes / expectedMinutes) * 100));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Subject', 'Duration (min)', 'Type', 'Completed'];
    const rows = sessions.map(s => [new Date(s.date).toLocaleDateString(), s.subject, s.duration, s.sessionType, s.completed ? 'Yes' : 'No']);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: "Report exported", description: "CSV file has been downloaded" });
  };

  const exportToPDF = () => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const avgSession = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
    const content = `FOCUS & STUDY REPORT\nGenerated: ${new Date().toLocaleDateString()}\n\nSTATISTICS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nTotal Sessions: ${sessions.length}\nTotal Focus Time: ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m\nAverage Session: ${avgSession} minutes\nCurrent Streak: ${currentStreak} sessions\nFocus Ratio: ${calculateFocusRatio()}%\n\nRECENT SESSIONS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${sessions.slice(0, 10).map(s => `${new Date(s.date).toLocaleDateString()} | ${s.subject} | ${s.duration}min | ${s.sessionType}`).join('\n')}\n\nKeep up the excellent work! 🚀`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast({ title: "Report exported", description: "Text report has been downloaded" });
  };

  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgSessionTime = sessions.length > 0 ? Math.round(totalStudyTime / sessions.length) : 0;
  const todayStreak = calculateStreak();
  const focusRatio = calculateFocusRatio();

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Focus & Pomodoro Center</h1>
            <p className="text-muted-foreground">Track your focus sessions and boost productivity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}><Settings className="h-4 w-4" /></Button>
            <Link to="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />{isBreakTime ? "Break Time" : "Focus Timer"}</span>
                <div className="flex gap-2">
                  {!isBreakTime && (<><Button variant={sessionType === "pomodoro" ? "default" : "outline"} size="sm" onClick={() => { if (!isActive) { setSessionType("pomodoro"); setSeconds(0); }}} disabled={isActive}>Pomodoro ({settings.pomodoroDuration}m)</Button><Button variant={sessionType === "deep" ? "default" : "outline"} size="sm" onClick={() => { if (!isActive) { setSessionType("deep"); setSeconds(0); }}} disabled={isActive}>Deep Focus ({settings.deepFocusDuration}m)</Button></>)}
                  <Button variant="outline" size="sm" onClick={() => setIsSoundPlaying(!isSoundPlaying)}>{isSoundPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button>
                </div>
              </CardTitle>
              {currentSubject && !isBreakTime && <CardDescription>Current focus: <strong>{currentSubject}</strong></CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="text-7xl font-bold text-primary">{formatTime(targetTime - seconds)}</div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={toggleTimer} className="w-32">{isActive ? <><Pause className="mr-2 h-5 w-5" />Pause</> : <><Play className="mr-2 h-5 w-5" />Start</>}</Button>
                  <Button size="lg" variant="outline" onClick={resetTimer} className="w-32"><RotateCcw className="mr-2 h-5 w-5" />Reset</Button>
                </div>
                {isSoundPlaying && settings.enableSound && <p className="text-sm text-muted-foreground">🎵 Ambient focus sounds playing...</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Focus Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Sessions</span><span className="text-2xl font-bold">{sessions.length}</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Total Focus Time</span><span className="text-2xl font-bold">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Average Session</span><span className="text-2xl font-bold">{avgSessionTime} min</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Current Streak</span><span className="text-2xl font-bold text-accent">{currentStreak} 🔥</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Focus Ratio</span><span className="text-2xl font-bold text-primary">{focusRatio}%</span></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Today's Sessions</span><span className="text-2xl font-bold">{todayStreak}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Download className="h-5 w-5 text-primary" />Export Reports</CardTitle><CardDescription>Download your focus data and analytics</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline" onClick={exportToCSV} disabled={sessions.length === 0}><Download className="mr-2 h-4 w-4" />Export as CSV</Button>
                <Button className="w-full" variant="outline" onClick={exportToPDF} disabled={sessions.length === 0}><Download className="mr-2 h-4 w-4" />Export as Text Report</Button>
                <p className="text-xs text-muted-foreground text-center mt-4">{sessions.length === 0 ? "Complete some focus sessions to enable exports" : `${sessions.length} sessions available for export`}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Focus Sessions</CardTitle><CardDescription>{sessions.length === 0 ? "No sessions yet. Start your first focus session!" : `Showing ${Math.min(10, sessions.length)} most recent sessions`}</CardDescription></CardHeader>
          <CardContent>
            {sessions.length === 0 ? (<div className="text-center py-12"><Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Start a focus session to see your history here</p></div>) : (
              <div className="space-y-3">{sessions.slice(0, 10).map((session) => (<div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"><div className="flex-1"><div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{session.subject}</h4><span className={`text-xs px-2 py-1 rounded ${session.sessionType === 'pomodoro' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>{session.sessionType === 'pomodoro' ? 'Pomodoro' : 'Deep Focus'}</span></div><div className="flex gap-4 text-sm text-muted-foreground"><span>{new Date(session.date).toLocaleDateString()}</span><span>{session.duration} minutes</span><span>{new Date(session.date).toLocaleTimeString()}</span></div></div><Button variant="ghost" size="icon" onClick={() => deleteSession(session.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>))}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Start Focus Session</DialogTitle><DialogDescription>What will you be focusing on?</DialogDescription></DialogHeader><div className="space-y-4 py-4"><div className="space-y-2"><Label htmlFor="subject">Subject / Topic</Label><Input id="subject" placeholder="e.g., Mathematics Assignment" value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && startWithSubject()} /></div></div><DialogFooter><Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>Cancel</Button><Button onClick={startWithSubject} disabled={!currentSubject.trim()}><Play className="mr-2 h-4 w-4" />Start Session</Button></DialogFooter></DialogContent>
      </Dialog>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Focus Settings</DialogTitle><DialogDescription>Customize your focus sessions</DialogDescription></DialogHeader><div className="space-y-6 py-4"><div className="space-y-2"><Label>Pomodoro Duration: {settings.pomodoroDuration} minutes</Label><Slider value={[settings.pomodoroDuration]} onValueChange={(value) => setSettings({...settings, pomodoroDuration: value[0]})} min={10} max={60} step={5} /></div><div className="space-y-2"><Label>Deep Focus Duration: {settings.deepFocusDuration} minutes</Label><Slider value={[settings.deepFocusDuration]} onValueChange={(value) => setSettings({...settings, deepFocusDuration: value[0]})} min={30} max={180} step={15} /></div><div className="space-y-2"><Label>Break Duration: {settings.breakDuration} minutes</Label><Slider value={[settings.breakDuration]} onValueChange={(value) => setSettings({...settings, breakDuration: value[0]})} min={5} max={30} step={5} /></div><div className="flex items-center justify-between"><Label>Break Reminders</Label><Switch checked={settings.enableBreakReminders} onCheckedChange={(checked) => setSettings({...settings, enableBreakReminders: checked})} /></div><div className="flex items-center justify-between"><Label>Motivational Messages</Label><Switch checked={settings.enableMotivation} onCheckedChange={(checked) => setSettings({...settings, enableMotivation: checked})} /></div><div className="flex items-center justify-between"><Label>Focus Sounds</Label><Switch checked={settings.enableSound} onCheckedChange={(checked) => setSettings({...settings, enableSound: checked})} /></div>{settings.enableSound && (<div className="space-y-2"><Label>Sound Volume: {settings.soundVolume}%</Label><Slider value={[settings.soundVolume]} onValueChange={(value) => setSettings({...settings, soundVolume: value[0]})} min={0} max={100} step={10} /></div>)}</div><DialogFooter><Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
};

export default Study;