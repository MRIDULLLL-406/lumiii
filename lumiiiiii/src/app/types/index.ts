// User Profile Types
export type NeuroProfile = 'adhd' | 'autism' | 'dyslexia' | 'general' | 'multiple';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type MotivationStyle = 'calm' | 'friendly' | 'direct';
export type CognitiveMode = 'simple' | 'detailed' | 'visual';

export interface UserProfile {
  id: string;
  neuroProfile: NeuroProfile;
  motivationStyle: MotivationStyle;
  preferences: {
    voiceEnabled: boolean;
    readingMode: boolean;
    lowSensoryMode: boolean;
    focusBubbleDefault: boolean;
    celebrationStyle: 'subtle' | 'moderate' | 'enthusiastic' | 'none';
    sessionLimitMinutes: number;
    dyslexiaFont: boolean;
  };
  createdAt: Date;
  lastActive: Date;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  energyLevel: EnergyLevel;
  estimatedMinutes: number;
  steps: TaskStep[];
  isJustStart?: boolean;
  completedAt?: Date;
  createdAt: Date;
  stuckCount: number;
  pauseCount: number;
  easeRating?: number; // 1-5, how easy it felt
}

export interface TaskStep {
  id: string;
  description: string;
  isComplete: boolean;
  simplifiedDescription?: string;
  voiceGuidance?: string;
  completedAt?: Date;
  stuckAt?: Date;
}

// Session Types
export interface Session {
  id: string;
  taskId: string;
  startedAt: Date;
  endedAt?: Date;
  currentStepIndex: number;
  pauses: SessionPause[];
  emotionCheckins: EmotionCheckin[];
  overwhelmDetections: number;
  elapsedMinutes: number;
}

export interface SessionPause {
  startedAt: Date;
  resumedAt?: Date;
  reason?: 'user' | 'overwhelm' | 'time-limit';
}

export interface EmotionCheckin {
  timestamp: Date;
  emotion: 'overwhelmed' | 'stuck' | 'focused' | 'tired' | 'energized';
  autoDetected: boolean;
}

// Progress Types
export interface MicroWin {
  id: string;
  type: 'step-complete' | 'task-complete' | 'just-started' | 'returned-after-break' | 'asked-for-help';
  taskId: string;
  timestamp: Date;
  celebrated: boolean;
}

export interface StuckPattern {
  taskId: string;
  stepDescription: string;
  frequency: number;
  lastOccurred: Date;
  suggestedHelp: string;
}

// AI Support Types
export interface AIResponse {
  message: string;
  tone: 'supportive' | 'encouraging' | 'practical' | 'calming';
  suggestions?: string[];
  simplifiedVersion?: string;
}
