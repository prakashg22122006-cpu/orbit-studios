import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Target, TrendingUp, Zap, Calendar, Award, BarChart3, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.png";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight">
                Your Ultimate
                <br />
                <span className="text-accent">Productivity OS</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Master tasks, build habits, and ace your studies—all in one powerful platform designed for student success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/dashboard">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <a href="#features">Explore Features</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Student Productivity Dashboard" 
                className="rounded-2xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three powerful modules working together to transform your productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Task Goal Manager</CardTitle>
                <CardDescription className="text-base">
                  Organize and conquer your tasks with smart prioritization and deadline tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Smart auto-sorting by priority and deadline</span>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Visual progress tracking for every goal</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Recurring tasks and subtask breakdown</span>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <CardTitle className="text-2xl">Habit Tracker</CardTitle>
                <CardDescription className="text-base">
                  Build powerful habits with streak tracking and gamification rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Earn XP, badges, and unlock achievements</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Visual heatmap calendar for consistency</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Track streaks and celebrate milestones</span>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-smooth">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-success" />
                </div>
                <CardTitle className="text-2xl">Study Planner</CardTitle>
                <CardDescription className="text-base">
                  Focus timer, session tracking, and intelligent study scheduling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Pomodoro timer with deep focus modes</span>
                </div>
                <div className="flex items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Session analytics and productivity insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Weekly calendar with drag-drop scheduling</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who are mastering their goals, building better habits, and achieving academic excellence.
          </p>
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-smooth">
            <Link to="/dashboard">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
