export type Pillar =
  | "Force"
  | "Savoir"
  | "Discipline"
  | "Santé"
  | "Leadership"
  | "Foi"
  | "Relations";

export type RitualTime = "Aube" | "Jour" | "Crépuscule";

export interface Chapter {
  id: string;
  title: string;
  description: string;
}

export interface BossPhase {
  name: string;
  minHpPercent: number;
  description: string;
}

export interface Boss {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  ability: string;
  weakness: Pillar;
  maxHp: number;
  rewardGlory: number;
  phases: BossPhase[];
}

export interface Project {
  id: string;
  chapterId: string;
  bossId: string;
  title: string;
}

export interface Ritual {
  id: string;
  title: string;
  time: RitualTime;
}

export interface Mission {
  id: string;
  chapterId: string;
  bossId: string;
  projectId: string;
  ritualId: string;
  title: string;
  pillar: Pillar;
  xp: number;
  glory: number;
  damage: number;
}

export interface CompletedMission {
  id: string;
  title: string;
  pillar: Pillar;
  xp: number;
  glory: number;
}

export interface DayArchive {
  date: string;
  xpGained: number;
  gloryGained: number;
  completedMissions: CompletedMission[];
  skippedMissionCount: number;
  plannedMissionCount: number;
}

export interface Kingdom {
  state: string;
}

export interface Companion {
  start: string;
  success: string;
}

export type PillarProgress = Record<Pillar, number>;

export interface SaveData {
  currentDate: string;
  missionIndex: number;

  xp: number;
  glory: number;
  bossHp: number;

  dailyGlory: number;
  completedMissions: CompletedMission[];
  completedMissionIds: string[];
  skippedMissionIds: string[];
  dailyMissions: Mission[];

  dayHistory: DayArchive[];

  pillarProgress: PillarProgress;

  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;

  missionConfigVersion: number;
  defeatedBossIds: string[];
}