import type {
  DayArchive,
  Mission,
  Pillar,
  SaveData,
  WeekDay,
} from "@/types/game";

export type WeeklyPillarScore = {
  pillar: Pillar;
  score: number;
};

export type WeeklyDay = {
  date: string;
  missionCount: number;
  xp: number;
  glory: number;
  completed: boolean;
};

export type WeeklyReport = {
  days: WeeklyDay[];
  totalMissions: number;
  totalXp: number;
  totalGlory: number;
  completedDays: number;
  completionRate: number;
  strongestPillar: WeeklyPillarScore;
  weakestPillar: WeeklyPillarScore;
  pillarScores: WeeklyPillarScore[];
  bestDay: WeeklyDay | null;
  lokiSummary: string;
};

const pillars: Pillar[] = [
  "Force",
  "Savoir",
  "Discipline",
  "Santé",
  "Leadership",
  "Foi",
  "Relations",
];

function getDateKey(date: Date) {
  return date.toLocaleDateString("fr-CA");
}

function getLastSevenDates() {
  const dates: string[] = [];
  const today = new Date();

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    dates.push(getDateKey(date));
  }

  return dates;
}

function findArchive(
  history: DayArchive[],
  date: string
) {
  return history.find((day) => day.date === date);
}

function getWeekDay(date: string): WeekDay {
  return new Date(`${date}T12:00:00`).getDay() as WeekDay;
}

function getPlannedMissionCount(
  missions: Mission[],
  date: string
) {
  const weekDay = getWeekDay(date);

  return missions.filter((mission) =>
    mission.daysOfWeek.includes(weekDay)
  ).length;
}

export function createWeeklyReport(
  save: SaveData
): WeeklyReport {
  const dates = getLastSevenDates();

  const pillarMap: Record<Pillar, number> = {
    Force: 0,
    Savoir: 0,
    Discipline: 0,
    Santé: 0,
    Leadership: 0,
    Foi: 0,
    Relations: 0,
  };

  const days: WeeklyDay[] = dates.map((date) => {
    const isToday = date === save.currentDate;
    const archive = findArchive(save.dayHistory, date);

    const missions = isToday
      ? save.completedMissions
      : archive?.completedMissions ?? [];

    const xp = missions.reduce(
      (total, mission) => total + mission.xp,
      0
    );

    const glory = isToday
      ? save.dailyGlory
      : archive?.gloryGained ?? 0;

    const plannedMissionCount = isToday
      ? getPlannedMissionCount(save.dailyMissions, date)
      : archive?.plannedMissionCount ?? missions.length;

    const skippedMissionCount = isToday
      ? save.skippedMissionIds.length
      : archive?.skippedMissionCount ?? 0;

    const resolvedMissionCount =
      missions.length + skippedMissionCount;

    missions.forEach((mission) => {
      pillarMap[mission.pillar] += mission.glory;
    });

    return {
      date,
      missionCount: missions.length,
      xp,
      glory,
      completed:
        plannedMissionCount > 0 &&
        resolvedMissionCount >= plannedMissionCount,
    };
  });

  const totalMissions = days.reduce(
    (total, day) => total + day.missionCount,
    0
  );

  const totalXp = days.reduce(
    (total, day) => total + day.xp,
    0
  );

  const totalGlory = days.reduce(
    (total, day) => total + day.glory,
    0
  );

  const completedDays = days.filter(
    (day) => day.completed
  ).length;

  const completionRate = Math.round(
    (completedDays / 7) * 100
  );

  const pillarScores = pillars.map((pillar) => ({
    pillar,
    score: pillarMap[pillar],
  }));

  const sortedPillars = [...pillarScores].sort(
    (a, b) => b.score - a.score
  );

  const strongestPillar =
    sortedPillars[0] ?? {
      pillar: "Discipline" as Pillar,
      score: 0,
    };

  const weakestPillar =
    sortedPillars[sortedPillars.length - 1] ?? {
      pillar: "Relations" as Pillar,
      score: 0,
    };

  const bestDay =
    [...days].sort(
      (a, b) => b.glory - a.glory
    )[0] ?? null;

  let lokiSummary =
    "La semaine est encore silencieuse. Chaque grande Légende commence par une première action.";

  if (totalMissions > 0) {
    lokiSummary =
      `Tu as accompli ${totalMissions} Missions cette semaine. ` +
      `${strongestPillar.pillar} domine actuellement ton Royaume.`;
  }

  if (completionRate >= 50) {
    lokiSummary =
      `Le Royaume avance avec constance. ${completedDays} journées sur 7 ont été entièrement accomplies. ` +
      `Ton Pilier dominant est ${strongestPillar.pillar}.`;
  }

  if (completionRate >= 85) {
    lokiSummary =
      `Une semaine remarquable. Tu as transformé la discipline en mouvement réel. ` +
      `${strongestPillar.pillar} porte aujourd’hui ton ascension.`;
  }

  return {
    days,
    totalMissions,
    totalXp,
    totalGlory,
    completedDays,
    completionRate,
    strongestPillar,
    weakestPillar,
    pillarScores,
    bestDay,
    lokiSummary,
  };
}