import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import TasksManager from "./pages/TasksManager";
import Habits from "./pages/Habits";
import Study from "./pages/Study";
import StudyPlanner from "./pages/StudyPlanner";
import Notes from "./pages/Notes";
import Journal from "./pages/Journal";
import Gamification from "./pages/Gamification";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TasksManager />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
