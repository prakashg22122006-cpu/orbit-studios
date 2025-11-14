// XP, leveling, and badge system

import type { Rank, Badge } from '@/types';

const RANK_THRESHOLDS: Record<Rank, number> = {
  'Novice': 0,
  'Learner': 500,
  'Scholar': 2000,
  'Expert': 5000,
  'Master': 10000,
  'Legend': 20000,
};

const XP_REWARDS = {
  taskCompleted: 10,
  taskCompletedHigh: 25,
  habitCompleted: 15,
  studySession30min: 20,
  studySession60min: 40,
  streakMilestone: 50,
  goalCompleted: 100,
  challengeCompleted: 200,
};

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function calculateRank(xp: number): Rank {
  const ranks = Object.entries(RANK_THRESHOLDS).sort((a, b) => b[1] - a[1]);
  for (const [rank, threshold] of ranks) {
    if (xp >= threshold) return rank as Rank;
  }
  return 'Novice';
}

export function getNextRank(currentRank: Rank): { rank: Rank; xpNeeded: number } | null {
  const ranks: Rank[] = ['Novice', 'Learner', 'Scholar', 'Expert', 'Master', 'Legend'];
  const currentIndex = ranks.indexOf(currentRank);
  
  if (currentIndex === ranks.length - 1) return null;
  
  const nextRank = ranks[currentIndex + 1];
  return {
    rank: nextRank,
    xpNeeded: RANK_THRESHOLDS[nextRank],
  };
}

export function calculateXPForAction(action: keyof typeof XP_REWARDS, multiplier: number = 1): number {
  return Math.floor((XP_REWARDS[action] || 0) * multiplier);
}

export function checkBadgeEligibility(stats: {
  tasksCompleted: number;
  habitsCompleted: number;
  focusHours: number;
  streakDays: number;
  goalsCompleted: number;
}): Badge[] {
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();

  // Task badges
  if (stats.tasksCompleted >= 10) {
    newBadges.push({
      id: 'task-starter',
      name: 'Task Starter',
      description: 'Complete 10 tasks',
      icon: '✅',
      earnedAt: now,
      category: 'task',
    });
  }
  if (stats.tasksCompleted >= 100) {
    newBadges.push({
      id: 'task-master',
      name: 'Task Master',
      description: 'Complete 100 tasks',
      icon: '🏆',
      earnedAt: now,
      category: 'task',
    });
  }

  // Habit badges
  if (stats.habitsCompleted >= 30) {
    newBadges.push({
      id: 'habit-builder',
      name: 'Habit Builder',
      description: 'Complete 30 habits',
      icon: '🎯',
      earnedAt: now,
      category: 'habit',
    });
  }

  // Focus badges
  if (stats.focusHours >= 10) {
    newBadges.push({
      id: 'focus-apprentice',
      name: 'Focus Apprentice',
      description: 'Focus for 10 hours',
      icon: '🎧',
      earnedAt: now,
      category: 'focus',
    });
  }
  if (stats.focusHours >= 100) {
    newBadges.push({
      id: 'focus-master',
      name: 'Focus Master',
      description: 'Focus for 100 hours',
      icon: '🧠',
      earnedAt: now,
      category: 'focus',
    });
  }

  // Streak badges
  if (stats.streakDays >= 7) {
    newBadges.push({
      id: 'week-warrior',
      name: 'Week Warrior',
      description: '7-day streak',
      icon: '🔥',
      earnedAt: now,
      category: 'streak',
    });
  }
  if (stats.streakDays >= 30) {
    newBadges.push({
      id: 'month-champion',
      name: 'Month Champion',
      description: '30-day streak',
      icon: '⚡',
      earnedAt: now,
      category: 'streak',
    });
  }

  return newBadges;
}

export function getMotivationalMessage(xp: number, rank: Rank): string {
  const messages = {
    low: [
      "Every journey starts with a single step!",
      "You're building something great!",
      "Keep going, you're doing amazing!",
    ],
    medium: [
      "You're on fire! Keep up the momentum!",
      "Impressive progress! You're unstoppable!",
      "Your dedication is paying off!",
    ],
    high: [
      "You're a legend in the making!",
      "Incredible work! You're at the top!",
      "Your consistency is inspiring!",
    ],
  };

  let category: 'low' | 'medium' | 'high' = 'low';
  if (xp > 5000) category = 'high';
  else if (xp > 1000) category = 'medium';

  const messageList = messages[category];
  return messageList[Math.floor(Math.random() * messageList.length)];
}
