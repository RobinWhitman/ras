"use client";

import { useEffect, useState } from "react";
import {
  allWeekDays,
  bosses,
  companion,
  companionMissionMessages,
  missions as defaultMissions,
} from "@/data/game";
import { projectDetails } from "@/data/projects";
import type {
  CompletedMission,
  DayArchive,
  Mission,
  Pillar,
  PillarProgress,
  ProjectProgress,
  SaveData,
  WeekDay,
} from "@/types/game";

const SAVE_KEY = "ras-save-v9";
const SAVE_SCHEMA_VERSION = 4;
const CONFIG_VERSION = 4;
const activeBoss = bosses[0];

const pillars: Pillar[] = [
  "Force",
  "Savoir",
  "Discipline",
  "Santé",
  "Leadership",
  "Foi",
  "Relations",
];

const ritualOrder = [
  "ritual-aube",
  "ritual-jour",
  "ritual-crepuscule",
];

function getTodayDate() {
  return new Date().toLocaleDateString("fr-CA");
}

function getPreviousDate(date: string) {
  const previousDate = new Date(`${date}T12:00:00`);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate.toLocaleDateString("fr-CA");
}

function getWeekDay(date: string): WeekDay {
  return new Date(`${date}T12:00:00`).getDay() as WeekDay;
}

export function getMissionsForDate(
  missions: Mission[],
  date: string
) {
  const weekDay = getWeekDay(date);

  return missions.filter((mission) =>
    mission.daysOfWeek.includes(weekDay)
  );
}

function isPillar(value: unknown): value is Pillar {
  return pillars.includes(value as Pillar);
}

function isWeekDay(value: unknown): value is WeekDay {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 6
  );
}

function cleanNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.round(value))
    : fallback;
}

function cleanStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function createEmptyPillarProgress(): PillarProgress {
  return {
    Force: 0,
    Savoir: 0,
    Discipline: 0,
    Santé: 0,
    Leadership: 0,
    Foi: 0,
    Relations: 0,
  };
}

function createEmptyProjectProgress(): ProjectProgress {
  return projectDetails.reduce<ProjectProgress>((progress, project) => {
    progress[project.id] = 0;
    return progress;
  }, {});
}

function normalizeCompletedMission(
  mission: Partial<CompletedMission>
): CompletedMission {
  return {
    id:
      typeof mission.id === "string" && mission.id.trim()
        ? mission.id
        : `completed-${Date.now()}`,
    title:
      typeof mission.title === "string" && mission.title.trim()
        ? mission.title.trim()
        : "Mission accomplie",
    pillar: isPillar(mission.pillar) ? mission.pillar : "Discipline",
    projectId:
      typeof mission.projectId === "string" && mission.projectId.trim()
        ? mission.projectId
        : "project-ras-v1",
    xp: cleanNumber(mission.xp, 0),
    glory: cleanNumber(mission.glory, 0),
  };
}

function normalizeMission(
  mission: Partial<Mission>,
  index = 0
): Mission {
  const days =
    Array.isArray(mission.daysOfWeek) &&
    mission.daysOfWeek.filter(isWeekDay).length > 0
      ? mission.daysOfWeek.filter(isWeekDay)
      : allWeekDays;

  return {
    id:
      typeof mission.id === "string" && mission.id.trim()
        ? mission.id
        : `mission-${Date.now()}-${index}`,
    chapterId:
      typeof mission.chapterId === "string"
        ? mission.chapterId
        : "chapter-ras",
    bossId:
      typeof mission.bossId === "string"
        ? mission.bossId
        : "boss-chaos",
    projectId:
      typeof mission.projectId === "string"
        ? mission.projectId
        : "project-ras-v1",
    ritualId:
      typeof mission.ritualId === "string"
        ? mission.ritualId
        : "ritual-aube",
    title:
      typeof mission.title === "string" && mission.title.trim()
        ? mission.title.trim()
        : "Mission sans titre",
    pillar: isPillar(mission.pillar) ? mission.pillar : "Discipline",
    xp: cleanNumber(mission.xp, 10),
    glory: cleanNumber(mission.glory, 5),
    damage: cleanNumber(mission.damage, 5),
    daysOfWeek: days,
  };
}

function cloneDefaultMissions(): Mission[] {
  return defaultMissions.map((mission, index) =>
    normalizeMission({ ...mission }, index)
  );
}

function migrateMissions(
  existingMissions: Partial<Mission>[],
  version: number
): Mission[] {
  const migratedMissions = existingMissions.map((mission, index) =>
    normalizeMission(mission, index)
  );

  if (version < 2) {
    const hasDayMissions = migratedMissions.some(
      (mission) => mission.ritualId === "ritual-jour"
    );

    const hasDuskMissions = migratedMissions.some(
      (mission) => mission.ritualId === "ritual-crepuscule"
    );

    if (!hasDayMissions) {
      migratedMissions.push(
        ...defaultMissions
          .filter((mission) => mission.ritualId === "ritual-jour")
          .map((mission, index) => normalizeMission({ ...mission }, index))
      );
    }

    if (!hasDuskMissions) {
      migratedMissions.push(
        ...defaultMissions
          .filter((mission) => mission.ritualId === "ritual-crepuscule")
          .map((mission, index) => normalizeMission({ ...mission }, index))
      );
    }
  }

  return migratedMissions.sort(
    (a, b) =>
      ritualOrder.indexOf(a.ritualId) -
      ritualOrder.indexOf(b.ritualId)
  );
}

function normalizeDayArchive(day: Partial<DayArchive>): DayArchive {
  const completedMissions = Array.isArray(day.completedMissions)
    ? day.completedMissions.map((mission) =>
        normalizeCompletedMission(mission)
      )
    : [];

  return {
    date:
      typeof day.date === "string" && day.date
        ? day.date
        : getTodayDate(),
    xpGained: cleanNumber(
      day.xpGained,
      completedMissions.reduce(
        (total, mission) => total + mission.xp,
        0
      )
    ),
    gloryGained: cleanNumber(day.gloryGained, 0),
    completedMissions,
    skippedMissionCount: cleanNumber(day.skippedMissionCount, 0),
    plannedMissionCount: cleanNumber(
      day.plannedMissionCount,
      completedMissions.length
    ),
  };
}

function normalizePillarProgress(
  value: Partial<PillarProgress> | undefined
): PillarProgress {
  const empty = createEmptyPillarProgress();

  if (!value || typeof value !== "object") {
    return empty;
  }

  return {
    Force: cleanNumber(value.Force, 0),
    Savoir: cleanNumber(value.Savoir, 0),
    Discipline: cleanNumber(value.Discipline, 0),
    Santé: cleanNumber(value.Santé, 0),
    Leadership: cleanNumber(value.Leadership, 0),
    Foi: cleanNumber(value.Foi, 0),
    Relations: cleanNumber(value.Relations, 0),
  };
}

function rebuildProjectProgressFromHistory(
  completedMissions: CompletedMission[],
  dayHistory: DayArchive[]
): ProjectProgress {
  const progress = createEmptyProjectProgress();

  dayHistory.forEach((day) => {
    day.completedMissions.forEach((mission) => {
      progress[mission.projectId] =
        (progress[mission.projectId] ?? 0) + mission.xp;
    });
  });

  completedMissions.forEach((mission) => {
    progress[mission.projectId] =
      (progress[mission.projectId] ?? 0) + mission.xp;
  });

  return progress;
}

function normalizeProjectProgress(
  value: ProjectProgress | undefined,
  completedMissions: CompletedMission[],
  dayHistory: DayArchive[]
): ProjectProgress {
  const rebuilt = rebuildProjectProgressFromHistory(
    completedMissions,
    dayHistory
  );

  if (!value || typeof value !== "object") {
    return rebuilt;
  }

  const normalized = createEmptyProjectProgress();

  projectDetails.forEach((project) => {
    normalized[project.id] = Math.max(
      cleanNumber(value[project.id], 0),
      rebuilt[project.id] ?? 0
    );
  });

  return normalized;
}

function createDefaultSave(): SaveData {
  return {
    schemaVersion: SAVE_SCHEMA_VERSION,
    currentDate: getTodayDate(),
    missionIndex: 0,
    xp: 0,
    glory: 0,
    bossHp: activeBoss.maxHp,
    dailyGlory: 0,
    completedMissions: [],
    completedMissionIds: [],
    skippedMissionIds: [],
    dailyMissions: cloneDefaultMissions(),
    dayHistory: [],
    pillarProgress: createEmptyPillarProgress(),
    projectProgress: createEmptyProjectProgress(),
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    missionConfigVersion: CONFIG_VERSION,
    defeatedBossIds: [],
    completedProjectIds: [],
  };
}

export function normalizeSaveData(value: unknown): SaveData {
  const defaultSave = createDefaultSave();

  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return defaultSave;
  }

  const raw = value as Partial<SaveData>;

  const dailyMissions = Array.isArray(raw.dailyMissions)
    ? migrateMissions(raw.dailyMissions, raw.missionConfigVersion ?? 1)
    : cloneDefaultMissions();

  const completedMissions = Array.isArray(raw.completedMissions)
    ? raw.completedMissions.map((mission) =>
        normalizeCompletedMission(mission)
      )
    : [];

  const completedMissionIds =
    cleanStringArray(raw.completedMissionIds).length > 0
      ? cleanStringArray(raw.completedMissionIds)
      : completedMissions.map((mission) => mission.id);

  const dayHistory = Array.isArray(raw.dayHistory)
    ? raw.dayHistory.map((day) => normalizeDayArchive(day))
    : [];

  return {
    ...defaultSave,
    ...raw,
    schemaVersion: SAVE_SCHEMA_VERSION,
    currentDate:
      typeof raw.currentDate === "string" && raw.currentDate
        ? raw.currentDate
        : defaultSave.currentDate,
    missionIndex: cleanNumber(raw.missionIndex, 0),
    xp: cleanNumber(raw.xp, 0),
    glory: cleanNumber(raw.glory, 0),
    bossHp: cleanNumber(raw.bossHp, activeBoss.maxHp),
    dailyGlory: cleanNumber(raw.dailyGlory, 0),
    completedMissions,
    completedMissionIds,
    skippedMissionIds: cleanStringArray(raw.skippedMissionIds),
    dailyMissions,
    dayHistory,
    pillarProgress: normalizePillarProgress(raw.pillarProgress),
    projectProgress: normalizeProjectProgress(
      raw.projectProgress,
      completedMissions,
      dayHistory
    ),
    currentStreak: cleanNumber(raw.currentStreak, 0),
    bestStreak: cleanNumber(raw.bestStreak, 0),
    lastCompletedDate:
      typeof raw.lastCompletedDate === "string"
        ? raw.lastCompletedDate
        : null,
    missionConfigVersion: CONFIG_VERSION,
    defeatedBossIds: cleanStringArray(raw.defeatedBossIds),
    completedProjectIds: cleanStringArray(raw.completedProjectIds),
  };
}

function createDayArchive(save: SaveData): DayArchive {
  const xpGained = save.completedMissions.reduce(
    (total, mission) => total + mission.xp,
    0
  );

  return {
    date: save.currentDate,
    xpGained,
    gloryGained: save.dailyGlory,
    completedMissions: save.completedMissions,
    skippedMissionCount: save.skippedMissionIds.length,
    plannedMissionCount: getMissionsForDate(
      save.dailyMissions,
      save.currentDate
    ).length,
  };
}

export function useGame() {
  const [save, setSave] = useState<SaveData>(createDefaultSave);
  const [message, setMessage] = useState(companion.start);

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);

    if (!stored) return;

    try {
      const parsedSave = JSON.parse(stored);
      const storedSave = normalizeSaveData(parsedSave);
      const today = getTodayDate();

      if (storedSave.currentDate !== today) {
        const yesterday = getPreviousDate(today);

        const streakStillAlive =
          storedSave.lastCompletedDate === yesterday ||
          storedSave.lastCompletedDate === today;

        const shouldArchiveDay =
          storedSave.completedMissions.length > 0 ||
          storedSave.skippedMissionIds.length > 0 ||
          storedSave.dailyGlory > 0;

        const historyWithoutDuplicate = storedSave.dayHistory.filter(
          (day) => day.date !== storedSave.currentDate
        );

        const nextHistory = shouldArchiveDay
          ? [createDayArchive(storedSave), ...historyWithoutDuplicate]
          : historyWithoutDuplicate;

        const newDaySave: SaveData = {
          ...storedSave,
          currentDate: today,
          missionIndex: 0,
          dailyGlory: 0,
          completedMissions: [],
          completedMissionIds: [],
          skippedMissionIds: [],
          dayHistory: nextHistory,
          currentStreak: streakStillAlive
            ? storedSave.currentStreak
            : 0,
        };

        setSave(newDaySave);
        localStorage.setItem(SAVE_KEY, JSON.stringify(newDaySave));

        setMessage(
          "Une nouvelle journée commence. La précédente rejoint les Archives."
        );

        return;
      }

      setSave(storedSave);
      localStorage.setItem(SAVE_KEY, JSON.stringify(storedSave));
    } catch {
      const freshSave = createDefaultSave();

      localStorage.setItem(SAVE_KEY, JSON.stringify(freshSave));
      setSave(freshSave);
      setMessage(
        "La sauvegarde locale était illisible. RAS a recréé une base propre."
      );
    }
  }, []);

  const activeMissions = getMissionsForDate(
    save.dailyMissions,
    save.currentDate
  );

  const resolvedMissionIds = [
    ...save.completedMissionIds,
    ...save.skippedMissionIds,
  ];

  const currentMission = activeMissions.find(
    (mission) => !resolvedMissionIds.includes(mission.id)
  );

  const ritualStarted = activeMissions.some((mission) =>
    resolvedMissionIds.includes(mission.id)
  );

  function updateSave(nextSave: SaveData) {
    const normalizedSave = normalizeSaveData(nextSave);

    setSave(normalizedSave);
    localStorage.setItem(SAVE_KEY, JSON.stringify(normalizedSave));
  }

  function calculateStreak(
    nextResolvedCount: number,
    plannedMissionCount: number
  ) {
    const dayCompleted =
      plannedMissionCount > 0 &&
      nextResolvedCount >= plannedMissionCount;

    const today = getTodayDate();

    if (!dayCompleted || save.lastCompletedDate === today) {
      return {
        currentStreak: save.currentStreak,
        bestStreak: save.bestStreak,
        lastCompletedDate: save.lastCompletedDate,
      };
    }

    const yesterday = getPreviousDate(today);

    const currentStreak =
      save.lastCompletedDate === yesterday
        ? save.currentStreak + 1
        : 1;

    return {
      currentStreak,
      bestStreak: Math.max(save.bestStreak, currentStreak),
      lastCompletedDate: today,
    };
  }

  function accomplirMission(missionId?: string) {
    const missionToComplete = missionId
      ? activeMissions.find((mission) => mission.id === missionId)
      : currentMission;

    if (!missionToComplete) return;

    if (
      save.completedMissionIds.includes(missionToComplete.id) ||
      save.skippedMissionIds.includes(missionToComplete.id)
    ) {
      return;
    }

    const completedMission: CompletedMission = {
      id: missionToComplete.id,
      title: missionToComplete.title,
      pillar: missionToComplete.pillar,
      projectId: missionToComplete.projectId,
      xp: missionToComplete.xp,
      glory: missionToComplete.glory,
    };

    const updatedPillarProgress: PillarProgress = {
      ...save.pillarProgress,
      [missionToComplete.pillar]:
        save.pillarProgress[missionToComplete.pillar] +
        missionToComplete.glory,
    };

    const updatedProjectProgress: ProjectProgress = {
      ...save.projectProgress,
      [missionToComplete.projectId]:
        (save.projectProgress[missionToComplete.projectId] ?? 0) +
        missionToComplete.xp,
    };

    const nextCompletedMissionIds = [
      ...save.completedMissionIds,
      missionToComplete.id,
    ];

    const nextCompletedMissions = [
      ...save.completedMissions,
      completedMission,
    ];

    const nextResolvedCount =
      nextCompletedMissionIds.length + save.skippedMissionIds.length;

    const dayCompleted = nextResolvedCount >= activeMissions.length;

    const nextBossHp = Math.max(
      save.bossHp - missionToComplete.damage,
      0
    );

    const bossJustDefeated =
      save.bossHp > 0 &&
      nextBossHp === 0 &&
      !save.defeatedBossIds.includes(activeBoss.id);

    const nextDefeatedBossIds = bossJustDefeated
      ? [...save.defeatedBossIds, activeBoss.id]
      : save.defeatedBossIds;

    const bossReward = bossJustDefeated ? activeBoss.rewardGlory : 0;

    const project = projectDetails.find(
      (item) => item.id === missionToComplete.projectId
    );

    const previousProjectXp =
      save.projectProgress[missionToComplete.projectId] ?? 0;

    const nextProjectXp =
      updatedProjectProgress[missionToComplete.projectId] ?? 0;

    const projectJustCompleted =
      !!project &&
      previousProjectXp < project.targetXp &&
      nextProjectXp >= project.targetXp &&
      !save.completedProjectIds.includes(project.id);

    const projectReward = projectJustCompleted
      ? project.rewardGlory
      : 0;

    const nextCompletedProjectIds = projectJustCompleted && project
      ? [...save.completedProjectIds, project.id]
      : save.completedProjectIds;

    const streak = calculateStreak(
      nextResolvedCount,
      activeMissions.length
    );

    updateSave({
      ...save,
      missionIndex: nextResolvedCount,
      xp: save.xp + missionToComplete.xp,
      glory:
        save.glory +
        missionToComplete.glory +
        bossReward +
        projectReward,
      dailyGlory: save.dailyGlory + missionToComplete.glory,
      bossHp: nextBossHp,
      completedMissions: nextCompletedMissions,
      completedMissionIds: nextCompletedMissionIds,
      pillarProgress: updatedPillarProgress,
      projectProgress: updatedProjectProgress,
      currentStreak: streak.currentStreak,
      bestStreak: streak.bestStreak,
      lastCompletedDate: streak.lastCompletedDate,
      defeatedBossIds: nextDefeatedBossIds,
      completedProjectIds: nextCompletedProjectIds,
    });

    if (projectJustCompleted && project) {
      setMessage(
        `Projet terminé : ${project.title}. Le Royaume reçoit ${project.rewardGlory} Glory.`
      );
      return;
    }

    if (bossJustDefeated) {
      setMessage(
        `Le Boss ${activeBoss.name} est vaincu. Le Royaume reçoit ${activeBoss.rewardGlory} Glory.`
      );
      return;
    }

    if (dayCompleted) {
      setMessage(
        "La journée est accomplie. Les Missions non applicables n’ont entraîné aucune sanction."
      );
      return;
    }

    setMessage(companionMissionMessages[missionToComplete.pillar]);
  }

  function skipMission(missionId: string) {
    const mission = activeMissions.find((item) => item.id === missionId);

    if (!mission) return;

    if (
      save.completedMissionIds.includes(missionId) ||
      save.skippedMissionIds.includes(missionId)
    ) {
      return;
    }

    const nextSkippedMissionIds = [
      ...save.skippedMissionIds,
      missionId,
    ];

    const nextResolvedCount =
      save.completedMissionIds.length + nextSkippedMissionIds.length;

    const dayCompleted = nextResolvedCount >= activeMissions.length;

    const streak = calculateStreak(
      nextResolvedCount,
      activeMissions.length
    );

    updateSave({
      ...save,
      missionIndex: nextResolvedCount,
      skippedMissionIds: nextSkippedMissionIds,
      currentStreak: streak.currentStreak,
      bestStreak: streak.bestStreak,
      lastCompletedDate: streak.lastCompletedDate,
    });

    setMessage(
      dayCompleted
        ? "La journée est résolue. Certaines Missions ne s’appliquaient simplement pas aujourd’hui."
        : `La Mission « ${mission.title} » est laissée au repos aujourd’hui.`
    );
  }

  function addDailyMission(
    title: string,
    pillar: Pillar,
    ritualId: string,
    daysOfWeek: WeekDay[] = allWeekDays,
    projectId = "project-ras-v1"
  ) {
    if (ritualStarted || !title.trim() || daysOfWeek.length === 0) return;

    const newMission = normalizeMission({
      id: `mission-${Date.now()}`,
      chapterId: "chapter-ras",
      bossId: "boss-chaos",
      projectId,
      ritualId,
      title: title.trim(),
      pillar,
      xp: 10,
      glory: 5,
      damage: 5,
      daysOfWeek,
    });

    const updatedMissions = [...save.dailyMissions, newMission].sort(
      (a, b) =>
        ritualOrder.indexOf(a.ritualId) -
        ritualOrder.indexOf(b.ritualId)
    );

    updateSave({
      ...save,
      dailyMissions: updatedMissions,
    });
  }

  function updateDailyMission(updatedMission: Mission) {
    if (ritualStarted) return;

    const normalizedMission = normalizeMission(updatedMission);

    updateSave({
      ...save,
      dailyMissions: save.dailyMissions.map((mission) =>
        mission.id === normalizedMission.id ? normalizedMission : mission
      ),
    });
  }

  function removeDailyMission(missionId: string) {
    if (ritualStarted) return;

    updateSave({
      ...save,
      dailyMissions: save.dailyMissions.filter(
        (mission) => mission.id !== missionId
      ),
    });
  }

  function restoreDefaultMissions() {
    if (ritualStarted) return;

    updateSave({
      ...save,
      dailyMissions: cloneDefaultMissions(),
      missionConfigVersion: CONFIG_VERSION,
    });
  }

  function resetGame() {
    const freshSave = createDefaultSave();

    localStorage.removeItem(SAVE_KEY);
    setSave(freshSave);
    setMessage(companion.start);
  }

  function simulateNewDay() {
    const today = getTodayDate();
    const yesterday = getPreviousDate(today);

    const simulatedSave: SaveData = {
      ...save,
      currentDate: yesterday,
      lastCompletedDate: save.currentStreak > 0 ? yesterday : null,
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(simulatedSave));
    window.location.reload();
  }

  const pillarScores = pillars.map((pillar) => ({
    pillar,
    score: save.pillarProgress[pillar],
  }));

  return {
    save,
    activeMissions,
    currentMission,
    message,
    pillarScores,
    ritualStarted,
    accomplirMission,
    skipMission,
    addDailyMission,
    updateDailyMission,
    removeDailyMission,
    restoreDefaultMissions,
    resetGame,
    simulateNewDay,
  };
}