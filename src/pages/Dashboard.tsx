import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Award, Clock, TrendingUp, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  priority: string;
  completed: boolean;
}

interface Habit {
  id: number;
  title: string;
  completedToday: boolean;
  streak: number;
}

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  completed: boolean;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedHabits = localStorage.getItem('habits');
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
  }, []);

  const todayTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const studyHoursToday = sessions.reduce((sum, s) => sum + (s.completed ? s.duration : 0), 0) / 60;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl mb-2">Welcome Back! 🚀</h1>
          <p className="text-xl text-muted-foreground">
            Here's your productivity overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">{completedTasks}/{todayTasks}</span>
              </div>
              <p className="text-sm text-muted-foreground">Tasks Today</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-accent" />
                <span className="text-3xl font-bold">{currentStreak}</span>
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-success" />
                <span className="text-3xl font-bold">{studyHoursToday}h</span>
              </div>
              <p className="text-sm text-muted-foreground">Study Hours</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <span className="text-3xl font-bold">87%</span>
              </div>
              <p className="text-sm text-muted-foreground">Productivity</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Today's Tasks</CardTitle>
                  <CardDescription>Focus on high-priority items first</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/tasks">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks yet. Start by adding your first task!</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link to="/tasks">Add Task</Link>
                  </Button>
                </div>
              ) : (
                tasks.slice(0, 5).map(task => (
                  <TaskItem 
                    key={task.id}
                    title={task.title} 
                    priority={task.priority} 
                    completed={task.completed} 
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/tasks">
                  <Target className="mr-2 h-4 w-4" />
                  Add New Task
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/habits">
                  <Award className="mr-2 h-4 w-4" />
                  Check Habits
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/study">
                  <Clock className="mr-2 h-4 w-4" />
                  Start Study Session
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link to="/analytics">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Habits Overview */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Today's Habits</CardTitle>
                  <CardDescription>Keep your streak alive!</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/habits">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {habits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No habits tracked yet. Build your first habit!</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link to="/habits">Add Habit</Link>
                  </Button>
                </div>
              ) : (
                habits.slice(0, 4).map(habit => (
                  <HabitItem 
                    key={habit.id}
                    title={habit.title} 
                    completed={habit.completedToday} 
                    streak={habit.streak} 
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Study Sessions */}
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Recent Study Sessions</CardTitle>
                  <CardDescription>Your focus time breakdown</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/study">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No study sessions yet. Start your first session!</p>
                  <Button asChild className="mt-4" size="sm">
                    <Link to="/study">Start Session</Link>
                  </Button>
                </div>
              ) : (
                sessions.slice(0, 3).map(session => (
                  <SessionItem 
                    key={session.id}
                    subject={session.subject} 
                    duration={session.duration} 
                    completed={session.completed} 
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ title, priority, completed }: { title: string; priority: string; completed: boolean }) => {
  const priorityColors = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-accent/10 text-accent",
    low: "bg-muted text-muted-foreground"
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
        {completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
      <span className={`flex-1 ${completed ? 'line-through text-muted-foreground' : ''}`}>{title}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority as keyof typeof priorityColors]}`}>
        {priority}
      </span>
    </div>
  );
};

const HabitItem = ({ title, completed, streak }: { title: string; completed: boolean; streak: number }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${completed ? 'bg-success border-success' : 'border-muted-foreground'}`}>
        {completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
      <span className="flex-1">{title}</span>
      <div className="flex items-center gap-1 text-accent">
        <Award className="w-4 h-4" />
        <span className="text-sm font-semibold">{streak}</span>
      </div>
    </div>
  );
};

const SessionItem = ({ subject, duration, completed }: { subject: string; duration: number; completed: boolean }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
      <Clock className={`w-5 h-5 ${completed ? 'text-success' : 'text-muted-foreground'}`} />
      <div className="flex-1">
        <p className="font-medium">{subject}</p>
        <p className="text-sm text-muted-foreground">{duration} minutes</p>
      </div>
      {completed && <CheckCircle2 className="w-5 h-5 text-success" />}
    </div>
  );
};

export default Dashboard;
