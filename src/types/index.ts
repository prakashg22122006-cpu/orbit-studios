// Core type definitions for the entire app

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  status: 'todo' | 'in-progress' | 'done';
  deadline?: string;
  subtasks?: Subtask[];
  dependencies?: string[];
  recurrence?: RecurrenceRule;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  endDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  streak: number;
  xp: number;
  completedDates: string[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  subject: string;
  topic?: string;
  duration: number;
  startTime: string;
  endTime: string;
  type: 'pomodoro' | 'deep-focus' | 'custom';
  focusScore?: number;
}

export interface StudyPlan {
  id: string;
  title: string;
  subjects: Subject[];
  startDate: string;
  endDate: string;
  totalHours: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  topics: Topic[];
  allocatedHours: number;
  completedHours: number;
  color: string;
}

export interface Topic {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: string;
  uploadedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'okay' | 'bad' | 'terrible';
  content: string;
  tags?: string[];
  gratitude?: string[];
  reflection?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'medium' | 'long';
  milestones: Milestone[];
  progress: number;
  startDate: string;
  endDate: string;
  category: string;
  linkedTasks?: string[];
  linkedHabits?: string[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  level: number;
  xp: number;
  rank: Rank;
  badges: Badge[];
  totalFocusHours: number;
  totalTasksCompleted: number;
  streakDays: number;
  theme: ThemeSettings;
  preferences: UserPreferences;
}

export type Rank = 'Novice' | 'Learner' | 'Scholar' | 'Expert' | 'Master' | 'Legend';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'task' | 'habit' | 'focus' | 'streak' | 'achievement';
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'focus' | 'night';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
}

export interface UserPreferences {
  pomodoroDuration: number;
  shortBreak: number;
  longBreak: number;
  dailyGoal: number;
  notifications: boolean;
  sounds: boolean;
  autoBackup: boolean;
}

export interface Widget {
  id: string;
  type: 'tasks' | 'habits' | 'focus' | 'analytics' | 'notes' | 'quotes' | 'calendar' | 'pomodoro';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config?: any;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: '7-day' | '30-day' | 'custom';
  progress: number;
  startDate: string;
  endDate: string;
  reward: {
    xp: number;
    badge?: string;
  };
}
