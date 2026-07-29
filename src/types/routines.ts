import type { Pillar, WeekDay } from "@/types/game";

export type RoutineSection =
  | "Aube"
  | "Jour"
  | "Crépuscule"
  | "Hebdomadaire"
  | "Périodique";

export type RoutineCadence =
  | {
      kind: "daily";
      days: WeekDay[];
    }
  | {
      kind: "weekly-pattern";
      requiredDays: WeekDay[];
      flexibleDayGroups: WeekDay[][];
    }
  | {
      kind: "monthly";
      intervalMonths: 1 | 2 | 3;
    }
  | {
      kind: "monthly-day";
      day: number;
    }
  | {
      kind: "monthly-first-weekday";
      weekDay: WeekDay;
    }
  | {
      kind: "interval-days";
      startDate: string;
      intervalDays: number;
      earlyWindowDays?: number;
    }
  | {
      kind: "interval-months";
      startDate: string;
      intervalMonths: number;
    }
  | {
      kind: "yearly-first-weekday";
      month: number;
      weekDay: WeekDay;
    };

export type RoutineDefinition = {
  id: string;
  title: string;
  section: RoutineSection;
  pillar: Pillar;
  description: string;
  criteria: string;
  order: number;
  cadence: RoutineCadence;
  targetCount?: number;
  allowMultiplePerDay?: boolean;
  streakIncrement?: number;
  milestonesEnabled: boolean;
  inputKind?: "physical-assessment";
};

export type RoutineHistoryStatus =
  | "completed"
  | "missed";

export type RoutineHistoryEntry = {
  periodKey: string;
  periodLabel: string;
  evaluatedAt: string;
  status: RoutineHistoryStatus;
  completedCount: number;
  targetCount: number;
};

export type RoutineProgress = {
  currentStreak: number;
  bestStreak: number;
  history: RoutineHistoryEntry[];
};

export type RoutinePeriod = {
  count: number;
  completionDates: string[];
  finalized: boolean;
};

export type PhysicalAssessment = {
  id: string;
  date: string;
  weight: number;
  waist: number;
  chest: number;
  arm: number;
  thigh: number;
  frontPhoto: string;
  sidePhoto: string;
  backPhoto: string;
};

export type RoutineSaveData = {
  schemaVersion: number;
  lastEvaluatedDate: string;
  progress: Record<string, RoutineProgress>;
  periods: Record<string, Record<string, RoutinePeriod>>;
  physicalAssessments: PhysicalAssessment[];
};
