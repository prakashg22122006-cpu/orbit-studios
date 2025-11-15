import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, BookOpen, Brain, Trophy, Settings, Award, BarChart3, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ClockWidget } from "@/components/Widgets/ClockWidget";
import { NotesWidget } from "@/components/Widgets/NotesWidget";
import { MusicWidget } from "@/components/Widgets/MusicWidget";
import { FocusTimerWidget } from "@/components/Widgets/FocusTimerWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl mb-2 font-bold">Student Productivity OS 🚀</h1>
          <p className="text-xl text-muted-foreground">
            Your complete dashboard for academic success
          </p>
        </div>

        {/* Widget Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ClockWidget />
          <FocusTimerWidget />
          <NotesWidget />
          <MusicWidget />
        </div>

        {/* Systems Hub Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Systems Hub</h2>
          <p className="text-muted-foreground mb-6">Access all your productivity tools</p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tasks & Goals */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Task & Goal Manager</CardTitle>
              <CardDescription>
                Organize tasks with Kanban, Calendar, and Timeline views
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/tasks">Open Tasks</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Study Planner */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Study Planner</CardTitle>
              <CardDescription>
                Create study plans, track subjects, and manage your syllabus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/study-planner">Plan Studies</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Habits */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Habit Tracker</CardTitle>
              <CardDescription>
                Build habits, track streaks, and earn XP badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/habits">Track Habits</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Focus & Pomodoro */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Focus & Pomodoro</CardTitle>
              <CardDescription>
                Deep focus sessions with analytics and music
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/study">Start Focus</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Notes & Files</CardTitle>
              <CardDescription>
                Organize notes, flashcards, and study materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/notes">Manage Notes</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Journal */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Journal & Reflection</CardTitle>
              <CardDescription>
                Daily mood tracking and reflection journal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/journal">Open Journal</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Gamification */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Gamification</CardTitle>
              <CardDescription>
                Levels, badges, challenges, and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/gamification">View Progress</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Track productivity insights and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Settings & Profile</CardTitle>
              <CardDescription>
                Customize themes, preferences, and data management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/settings">Configure</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
