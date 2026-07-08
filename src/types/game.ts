export type Pillar =
  | "Force"
  | "Savoir"
  | "Discipline"
  | "Santé"
  | "Leadership"
  | "Foi"
  | "Relations";

export interface Mission {
  id: string;
  title: string;
  pillar: Pillar;
  xp: number;
  glory: number;
  damage: number;
}

export interface Boss {
  name: string;
  maxHp: number;
}

export interface Kingdom {
  state: string;
}

export interface Companion {
  start: string;
  success: string;
}

export interface SaveData {
  missionIndex: number;
  xp: number;
  glory: number;
  bossHp: number;
}