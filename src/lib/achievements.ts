import {
  getBuildingProgress,
} from "@/lib/buildings";
import type {
  Pillar,
  SaveData,
} from "@/types/game";

export type AchievementCategory =
  | "Missions"
  | "Discipline"
  | "Héros"
  | "Royaume"
  | "Boss"
  | "Légende";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlocked: boolean;
  progress: number;
  target: number;
};

type PillarScore = {
  pillar: Pillar;
  score: number;
};

function clampProgress(
  value: number,
  target: number
) {
  return Math.min(value, target);
}

export function getAchievements(
  save: SaveData,
  pillarScores: PillarScore[]
): Achievement[] {
  const archivedMissions =
    save.dayHistory.reduce(
      (total, day) =>
        total + day.completedMissions.length,
      0
    );

  const totalCompletedMissions =
    archivedMissions +
    save.completedMissions.length;

  const heroLevel =
    Math.floor(save.xp / 50) + 1;

  const totalBuildingLevels =
    pillarScores.reduce(
      (total, item) =>
        total +
        getBuildingProgress(item.score).level,
      0
    );

  const levelTwoBuildings =
    pillarScores.filter(
      (item) =>
        getBuildingProgress(item.score).level >= 2
    ).length;

  const developedPillars =
    pillarScores.filter(
      (item) => item.score >= 50
    ).length;

  return [
    {
      id: "first-mission",
      title: "Le Premier Pas",
      description:
        "Accomplir une première Mission.",
      icon: "👣",
      category: "Missions",
      unlocked: totalCompletedMissions >= 1,
      progress: clampProgress(
        totalCompletedMissions,
        1
      ),
      target: 1,
    },
    {
      id: "ten-missions",
      title: "Héros en Mouvement",
      description:
        "Accomplir 10 Missions.",
      icon: "⚔️",
      category: "Missions",
      unlocked: totalCompletedMissions >= 10,
      progress: clampProgress(
        totalCompletedMissions,
        10
      ),
      target: 10,
    },
    {
      id: "fifty-missions",
      title: "Infatigable",
      description:
        "Accomplir 50 Missions.",
      icon: "🏹",
      category: "Missions",
      unlocked: totalCompletedMissions >= 50,
      progress: clampProgress(
        totalCompletedMissions,
        50
      ),
      target: 50,
    },
    {
      id: "first-day",
      title: "Une Journée dans la Légende",
      description:
        "Terminer une journée complète.",
      icon: "🌅",
      category: "Discipline",
      unlocked:
        save.currentStreak >= 1 ||
        save.bestStreak >= 1,
      progress: clampProgress(
        save.bestStreak,
        1
      ),
      target: 1,
    },
    {
      id: "streak-three",
      title: "L’Élan",
      description:
        "Atteindre une Série de 3 jours.",
      icon: "🔥",
      category: "Discipline",
      unlocked: save.bestStreak >= 3,
      progress: clampProgress(
        save.bestStreak,
        3
      ),
      target: 3,
    },
    {
      id: "streak-seven",
      title: "La Semaine du Guerrier",
      description:
        "Atteindre une Série de 7 jours.",
      icon: "🛡️",
      category: "Discipline",
      unlocked: save.bestStreak >= 7,
      progress: clampProgress(
        save.bestStreak,
        7
      ),
      target: 7,
    },
    {
      id: "level-five",
      title: "Héros en Ascension",
      description:
        "Atteindre le niveau 5.",
      icon: "🧍",
      category: "Héros",
      unlocked: heroLevel >= 5,
      progress: clampProgress(
        heroLevel,
        5
      ),
      target: 5,
    },
    {
      id: "level-ten",
      title: "Gardien du Royaume",
      description:
        "Atteindre le niveau 10.",
      icon: "👑",
      category: "Héros",
      unlocked: heroLevel >= 10,
      progress: clampProgress(
        heroLevel,
        10
      ),
      target: 10,
    },
    {
      id: "glory-one-hundred",
      title: "Premiers Échos de Gloire",
      description:
        "Accumuler 100 Glory.",
      icon: "✨",
      category: "Légende",
      unlocked: save.glory >= 100,
      progress: clampProgress(
        save.glory,
        100
      ),
      target: 100,
    },
    {
      id: "glory-five-hundred",
      title: "Nom Reconnu",
      description:
        "Accumuler 500 Glory.",
      icon: "🏆",
      category: "Légende",
      unlocked: save.glory >= 500,
      progress: clampProgress(
        save.glory,
        500
      ),
      target: 500,
    },
    {
      id: "first-building-level",
      title: "Le Royaume Grandit",
      description:
        "Faire progresser un bâtiment au niveau 2.",
      icon: "🏰",
      category: "Royaume",
      unlocked: levelTwoBuildings >= 1,
      progress: clampProgress(
        levelTwoBuildings,
        1
      ),
      target: 1,
    },
    {
      id: "three-buildings",
      title: "Bâtisseur",
      description:
        "Faire progresser 3 bâtiments au niveau 2.",
      icon: "⚒️",
      category: "Royaume",
      unlocked: levelTwoBuildings >= 3,
      progress: clampProgress(
        levelTwoBuildings,
        3
      ),
      target: 3,
    },
    {
      id: "kingdom-levels",
      title: "Royaume Florissant",
      description:
        "Atteindre 14 niveaux cumulés de bâtiments.",
      icon: "🏛️",
      category: "Royaume",
      unlocked: totalBuildingLevels >= 14,
      progress: clampProgress(
        totalBuildingLevels,
        14
      ),
      target: 14,
    },
    {
      id: "pillar-developed",
      title: "Pilier Éveillé",
      description:
        "Atteindre 50 points dans un Pilier.",
      icon: "💠",
      category: "Royaume",
      unlocked: developedPillars >= 1,
      progress: clampProgress(
        developedPillars,
        1
      ),
      target: 1,
    },
    {
      id: "balanced-kingdom",
      title: "Royaume Équilibré",
      description:
        "Atteindre 50 points dans les 7 Piliers.",
      icon: "🌟",
      category: "Royaume",
      unlocked: developedPillars >= 7,
      progress: clampProgress(
        developedPillars,
        7
      ),
      target: 7,
    },
    {
      id: "first-boss",
      title: "Pourfendeur du Chaos",
      description:
        "Vaincre un premier Boss.",
      icon: "👹",
      category: "Boss",
      unlocked:
        save.defeatedBossIds.length >= 1,
      progress: clampProgress(
        save.defeatedBossIds.length,
        1
      ),
      target: 1,
    },
  ];
}