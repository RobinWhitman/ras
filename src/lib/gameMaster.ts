import type {
  Boss,
  Mission,
  Pillar,
  SaveData,
} from "@/types/game";

export type PillarScore = {
  pillar: Pillar;
  score: number;
};

export type GameMasterAlert = {
  id: string;
  icon: string;
  title: string;
  description: string;
  priority: "haute" | "moyenne" | "basse";
};

export type GameMasterBriefing = {
  greeting: string;
  summary: string;
  mainObjective: string;
  recommendedPillar: Pillar;
  recommendedMission: Mission | undefined;
  completedCount: number;
  totalCount: number;
  progressPercent: number;
  alerts: GameMasterAlert[];
};

function getWeakestPillar(
  pillarScores: PillarScore[]
): Pillar {
  const sortedPillars = [...pillarScores].sort(
    (a, b) => a.score - b.score
  );

  return sortedPillars[0]?.pillar ?? "Discipline";
}

function getDayGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Le Royaume s’éveille.";
  }

  if (hour < 18) {
    return "La journée est engagée.";
  }

  return "Le Crépuscule approche.";
}

export function createGameMasterBriefing(
  save: SaveData,
  pillarScores: PillarScore[],
  currentMission: Mission | undefined,
  boss: Boss
): GameMasterBriefing {
  const completedCount = save.completedMissionIds.length;
  const totalCount = save.dailyMissions.length;

  const progressPercent =
    totalCount === 0
      ? 0
      : Math.round(
          (completedCount / totalCount) * 100
        );

  const recommendedPillar =
    getWeakestPillar(pillarScores);

  const alerts: GameMasterAlert[] = [];

  if (completedCount === 0) {
    alerts.push({
      id: "start-day",
      icon: "🌅",
      title: "La journée attend son premier acte",
      description:
        "Accomplis une première Mission pour mettre le Royaume en mouvement.",
      priority: "haute",
    });
  }

  if (
    save.currentStreak > 0 &&
    completedCount < totalCount
  ) {
    alerts.push({
      id: "protect-streak",
      icon: "🔥",
      title: `Série de ${save.currentStreak} jour(s)`,
      description:
        "Termine toutes les Missions aujourd’hui pour prolonger la Série.",
      priority: "haute",
    });
  }

  if (
    currentMission &&
    currentMission.pillar === boss.weakness &&
    save.bossHp > 0
  ) {
    alerts.push({
      id: "boss-weakness",
      icon: "⚔️",
      title: "Faiblesse du Boss détectée",
      description: `La Mission recommandée développe ${boss.weakness}, la faiblesse de ${boss.name}.`,
      priority: "haute",
    });
  }

  const weakestPillarMission =
    save.dailyMissions.find(
      (mission) =>
        mission.pillar === recommendedPillar &&
        !save.completedMissionIds.includes(
          mission.id
        )
    );

  if (weakestPillarMission) {
    alerts.push({
      id: "weak-pillar",
      icon: "🏛️",
      title: `${recommendedPillar} demande de l’attention`,
      description: `La Mission « ${weakestPillarMission.title} » permet de renforcer ce Pilier.`,
      priority: "moyenne",
    });
  }

  if (progressPercent >= 75 && progressPercent < 100) {
    alerts.push({
      id: "near-completion",
      icon: "🏆",
      title: "La journée est presque accomplie",
      description:
        "Il reste peu de Missions avant de verrouiller la journée.",
      priority: "moyenne",
    });
  }

  if (save.bossHp <= 25 && save.bossHp > 0) {
    alerts.push({
      id: "boss-low",
      icon: "👹",
      title: `${boss.name} vacille`,
      description: `Il ne lui reste que ${save.bossHp} PV. La victoire est proche.`,
      priority: "moyenne",
    });
  }

  if (completedCount === totalCount && totalCount > 0) {
    alerts.push({
      id: "day-completed",
      icon: "🌟",
      title: "Journée accomplie",
      description:
        "Toutes les Missions sont terminées. Cette journée rejoindra les Archives.",
      priority: "basse",
    });
  }

  let summary =
    "Le Royaume attend une action réelle.";

  if (progressPercent > 0 && progressPercent < 50) {
    summary =
      "La journée a commencé, mais l’essentiel reste à accomplir.";
  }

  if (progressPercent >= 50 && progressPercent < 100) {
    summary =
      "Le Royaume progresse. Maintiens l’élan jusqu’au dernier Rituel.";
  }

  if (progressPercent === 100) {
    summary =
      "La journée est complète. Le Royaume a reçu tout ce que tu pouvais lui offrir aujourd’hui.";
  }

  const mainObjective = currentMission
    ? currentMission.title
    : "Préserver la progression et préparer demain.";

  return {
    greeting: getDayGreeting(),
    summary,
    mainObjective,
    recommendedPillar,
    recommendedMission: currentMission,
    completedCount,
    totalCount,
    progressPercent,
    alerts,
  };
}