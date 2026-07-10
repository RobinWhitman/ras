import type { Pillar } from "@/types/game";

export interface BuildingProgress {
  level: number;
  current: number;
 next: number;
  percent: number;
}

const LEVELS = [
  0,
  100,
  250,
  500,
  900,
  1400,
  2000,
  2800,
  3800,
  5000,
];

export function getBuildingProgress(
  score: number
): BuildingProgress {

  let level = 1;

  for (let i = 0; i < LEVELS.length; i++) {
    if (score >= LEVELS[i]) {
      level = i + 1;
    }
  }

  const currentThreshold =
    LEVELS[level - 1] ?? 0;

  const nextThreshold =
    LEVELS[level] ??
    currentThreshold + 1000;

  const current =
    score - currentThreshold;

  const next =
    nextThreshold - currentThreshold;

  const percent =
    Math.min(
      100,
      Math.round((current / next) * 100)
    );

  return {
    level,
    current,
    next,
    percent,
  };
}

export const buildingNames: Record<Pillar, string> = {

  Force: "Arène",

  Santé: "Infirmerie",

  Discipline: "Tour",

  Savoir: "Bibliothèque",

  Leadership: "Palais",

  Foi: "Sanctuaire",

  Relations: "Place",
};