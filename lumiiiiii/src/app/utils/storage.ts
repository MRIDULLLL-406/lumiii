import type { UserProfile, Task, Session, MicroWin, StuckPattern } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'neuro-assistant-profile',
  TASKS: 'neuro-assistant-tasks',
  SESSIONS: 'neuro-assistant-sessions',
  MICRO_WINS: 'neuro-assistant-wins',
  STUCK_PATTERNS: 'neuro-assistant-patterns',
};

// User Profile
export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) return null;
  const profile = JSON.parse(data);
  profile.createdAt = new Date(profile.createdAt);
  profile.lastActive = new Date(profile.lastActive);
  return profile;
}

// Tasks
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!data) return [];
  const tasks = JSON.parse(data);
  return tasks.map((task: Task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    steps: task.steps.map(step => ({
      ...step,
      completedAt: step.completedAt ? new Date(step.completedAt) : undefined,
      stuckAt: step.stuckAt ? new Date(step.stuckAt) : undefined,
    })),
  }));
}

// Sessions
export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  if (!data) return [];
  const sessions = JSON.parse(data);
  return sessions.map((session: Session) => ({
    ...session,
    startedAt: new Date(session.startedAt),
    endedAt: session.endedAt ? new Date(session.endedAt) : undefined,
    pauses: session.pauses.map(pause => ({
      startedAt: new Date(pause.startedAt),
      resumedAt: pause.resumedAt ? new Date(pause.resumedAt) : undefined,
      reason: pause.reason,
    })),
    emotionCheckins: session.emotionCheckins.map(checkin => ({
      ...checkin,
      timestamp: new Date(checkin.timestamp),
    })),
  }));
}

// Micro Wins
export function saveMicroWins(wins: MicroWin[]): void {
  localStorage.setItem(STORAGE_KEYS.MICRO_WINS, JSON.stringify(wins));
}

export function getMicroWins(): MicroWin[] {
  const data = localStorage.getItem(STORAGE_KEYS.MICRO_WINS);
  if (!data) return [];
  const wins = JSON.parse(data);
  return wins.map((win: MicroWin) => ({
    ...win,
    timestamp: new Date(win.timestamp),
  }));
}

// Stuck Patterns
export function saveStuckPatterns(patterns: StuckPattern[]): void {
  localStorage.setItem(STORAGE_KEYS.STUCK_PATTERNS, JSON.stringify(patterns));
}

export function getStuckPatterns(): StuckPattern[] {
  const data = localStorage.getItem(STORAGE_KEYS.STUCK_PATTERNS);
  if (!data) return [];
  const patterns = JSON.parse(data);
  return patterns.map((pattern: StuckPattern) => ({
    ...pattern,
    lastOccurred: new Date(pattern.lastOccurred),
  }));
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
