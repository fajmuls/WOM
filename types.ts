
export interface Workout {
  id: string;
  name: string;
  category?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  time?: number; // Added optional time in seconds
}

export interface LogEntry {
  id: string;
  workoutId: string;
  sets: WorkoutSet[];
  completed: boolean;
}

export type DailyLog = Record<string, LogEntry[]>;

export interface TimerSegment {
  id: string;
  name: string;
  type: 'warmup' | 'work' | 'rest' | 'cooldown';
  // For simple types: warmup, rest, cooldown
  duration: number;
  interval?: number; // Interval in seconds for warmup/cooldown ticks
  // For 'work' type
  workoutId?: string;
  sets?: number;
  workDuration?: number; 
  restDuration?: number;
}

export interface TimerTemplate {
  id: string;
  name: string;
  segments: TimerSegment[];
  restBetweenSegments?: {
    enabled: boolean;
    duration: number; // in seconds
  };
}

export type View = 'dashboard' | 'daily_log' | 'manage_workouts' | 'manage_timers' | 'settings' | 'music_player' | 'workout_schedule' | 'body_tracker' | 'post_workout_summary';

export interface ActiveTimerFlattenedSegment {
    name: string;
    duration: number;
    originalSegmentId: string;
    originalSegmentType: TimerSegment['type'];
    workoutId?: string;
    isRest: boolean;
    setNumber?: number;
    totalSets?: number;
    interval?: number;
}

export interface ActiveTimerState {
  type: 'quick' | 'template';
  isActive: boolean;
  // For quick timer
  totalSeconds?: number;
  initialDuration?: number;
  // For template timer
  template?: TimerTemplate;
  flattenedSegments?: ActiveTimerFlattenedSegment[];
  currentSegmentIndex?: number;
  timeInSegment?: number;
  timeElapsed?: number;
  totalDuration?: number;
}

export interface SoundConfig {
    frequency: number;
    endFrequency?: number;
    duration: number; // in seconds
    type: OscillatorType;
    volumeMultiplier?: number;
}

export type Language = 'en' | 'id';

export interface AppSettings {
    volume: number; // 0 to 1
    theme: 'dark' | 'light' | 'faztheme' | 'aritheme';
    language: Language;
    sounds: {
        timerEnd: SoundConfig;
        segmentEnd: SoundConfig;
        interval: SoundConfig;
        menuClick: SoundConfig;
    };
}

export interface PlaylistItem {
  id: string;
  url: string;
  type: 'single' | 'playlist';
}

export interface MusicState {
  playlist: PlaylistItem[];
  activeItemId: string | null;
}

export interface WorkoutSchedule {
  id: string;
  day: string; // e.g., 'Monday'
  time: string; // e.g., '17:00'
  type: 'workout' | 'plan';
  refId: string; // workoutId or planId
  name: string; // workoutName or planName
}

export interface WorkoutPlan {
  id:string;
  name: string;
  workoutIds: string[];
}

export interface BodyMeasurement {
    id: string;
    date: string; // ISO string
    weight: number; // in kg
    height: number; // in cm
    bodyFat?: number; // in %
}