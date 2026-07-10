"use client";

import { useEffect, useState } from "react";
import {
  bosses,
  companion,
  companionMissionMessages,
  missions as defaultMissions,
} from "@/data/game";
import type {
  CompletedMission,
  Mission,
  Pillar,
  PillarProgress,
  SaveData,
} from "@/types/game";

const SAVE_KEY = "ras-save-v9";
const CONFIG_VERSION = 2;
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

function getTodayDate() {
  return new Date().toLocaleDateString("fr-CA");
}

function getPreviousDate(date: string) {
  const previousDate = new Date(`${date}T12:00:00`);
  previousDate.setDate(previousDate.getDate() - 1);

  return previousDate.toLocaleDateString("fr-CA");
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

function cloneDefaultMissions(): Mission[] {
  return defaultMissions.map((mission) => ({ ...mission }));
}

function migrateMissions(
  existingMissions: Mission[],
  version: number
): Mission[] {
  if (version >= CONFIG_VERSION) {
    return existingMissions;
  }

  const migratedMissions = [...existingMissions];

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
        .map((mission) => ({ ...mission }))
    );
  }

  if (!hasDuskMissions) {
    migratedMissions.push(
      ...defaultMissions
        .filter(
          (mission) => mission.ritualId === "ritual-crepuscule"
        )
        .map((mission) => ({ ...mission }))
    );
  }

  return migratedMissions;
}

function createDefaultSave(): SaveData {
  return {
    currentDate: getTodayDate(),
    missionIndex: 0,

    xp: 0,
    glory: 0,
    bossHp: activeBoss.maxHp,

    dailyGlory: 0,
    completedMissions: [],
    completedMissionIds: [],
    dailyMissions: cloneDefaultMissions(),

    pillarProgress: createEmptyPillarProgress(),

    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,

    missionConfigVersion: CONFIG_VERSION,
  };
}

export function useGame() {
  const [save, setSave] = useState<SaveData>(createDefaultSave);
  const [message, setMessage] = useState(companion.start);

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);

    if (!stored) return;

    const parsedSave = JSON.parse(stored) as Partial<SaveData>;
    const defaultSave = createDefaultSave();

    const storedMissions =
      parsedSave.dailyMissions?.length
        ? parsedSave.dailyMissions
        : cloneDefaultMissions();

    const storedVersion = parsedSave.missionConfigVersion ?? 1;

    const completedMissionIds =
      parsedSave.completedMissionIds ??
      parsedSave.completedMissions?.map((mission) => mission.id) ??
      [];

    const storedSave: SaveData = {
      ...defaultSave,
      ...parsedSave,

      completedMissions: parsedSave.completedMissions ?? [],
      completedMissionIds,

      dailyMissions: migrateMissions(
        storedMissions,
        storedVersion
      ),

      pillarProgress: {
        ...createEmptyPillarProgress(),
        ...(parsedSave.pillarProgress ?? {}),
      },

      currentStreak: parsedSave.currentStreak ?? 0,
      bestStreak: parsedSave.bestStreak ?? 0,
      lastCompletedDate: parsedSave.lastCompletedDate ?? null,

      missionConfigVersion: CONFIG_VERSION,
    };

    const today = getTodayDate();

    if (storedSave.currentDate !== today) {
      const yesterday = getPreviousDate(today);

      const streakStillAlive =
        storedSave.lastCompletedDate === yesterday ||
        storedSave.lastCompletedDate === today;

      const newDaySave: SaveData = {
        ...storedSave,
        currentDate: today,
        missionIndex: 0,
        dailyGlory: 0,
        completedMissions: [],
        completedMissionIds: [],
        currentStreak: streakStillAlive
          ? storedSave.currentStreak
          : 0,
      };

      setSave(newDaySave);
      localStorage.setItem(SAVE_KEY, JSON.stringify(newDaySave));
      setMessage("Une nouvelle journée commence. Le Royaume s’éveille.");
      return;
    }

    setSave(storedSave);
    localStorage.setItem(SAVE_KEY, JSON.stringify(storedSave));
  }, []);

  const currentMission = save.dailyMissions.find(
    (mission) => !save.completedMissionIds.includes(mission.id)
  );

  const ritualStarted = save.completedMissionIds.length > 0;

  function updateSave(nextSave: SaveData) {
    setSave(nextSave);
    localStorage.setItem(SAVE_KEY, JSON.stringify(nextSave));
  }

  function accomplirMission(missionId?: string) {
    const missionToComplete = missionId
      ? save.dailyMissions.find((mission) => mission.id === missionId)
      : currentMission;

    if (!missionToComplete) return;

    if (save.completedMissionIds.includes(missionToComplete.id)) {
      return;
    }

    const completedMission: CompletedMission = {
      id: missionToComplete.id,
      title: missionToComplete.title,
      pillar: missionToComplete.pillar,
      xp: missionToComplete.xp,
      glory: missionToComplete.glory,
    };

    const updatedPillarProgress: PillarProgress = {
      ...save.pillarProgress,
      [missionToComplete.pillar]:
        save.pillarProgress[missionToComplete.pillar] +
        missionToComplete.glory,
    };

    const nextCompletedMissionIds = [
      ...save.completedMissionIds,
      missionToComplete.id,
    ];

    const dayCompleted =
      nextCompletedMissionIds.length >= save.dailyMissions.length;

    const today = getTodayDate();

    let nextCurrentStreak = save.currentStreak;
    let nextBestStreak = save.bestStreak;
    let nextLastCompletedDate = save.lastCompletedDate;

    if (dayCompleted && save.lastCompletedDate !== today) {
      const yesterday = getPreviousDate(today);

      nextCurrentStreak =
        save.lastCompletedDate === yesterday
          ? save.currentStreak + 1
          : 1;

      nextBestStreak = Math.max(
        save.bestStreak,
        nextCurrentStreak
      );

      nextLastCompletedDate = today;
    }

    updateSave({
      ...save,

      missionIndex: nextCompletedMissionIds.length,

      xp: save.xp + missionToComplete.xp,
      glory: save.glory + missionToComplete.glory,
      dailyGlory: save.dailyGlory + missionToComplete.glory,

      bossHp: Math.max(
        save.bossHp - missionToComplete.damage,
        0
      ),

      completedMissions: [
        ...save.completedMissions,
        completedMission,
      ],

      completedMissionIds: nextCompletedMissionIds,
      pillarProgress: updatedPillarProgress,

      currentStreak: nextCurrentStreak,
      bestStreak: nextBestStreak,
      lastCompletedDate: nextLastCompletedDate,
    });

    setMessage(
      dayCompleted
        ? "La journée est accomplie. Elle rejoint désormais ta Légende."
        : companionMissionMessages[missionToComplete.pillar]
    );
  }

  function addDailyMission(
    title: string,
    pillar: Pillar,
    ritualId: string
  ) {
    if (ritualStarted || !title.trim()) return;

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      chapterId: "chapter-ras",
      bossId: "boss-chaos",
      projectId: "project-ras-v1",
      ritualId,
      title: title.trim(),
      pillar,
      xp: 10,
      glory: 5,
      damage: 5,
    };

    const ritualOrder = [
      "ritual-aube",
      "ritual-jour",
      "ritual-crepuscule",
    ];

    const updatedMissions = [
      ...save.dailyMissions,
      newMission,
    ].sort(
      (a, b) =>
        ritualOrder.indexOf(a.ritualId) -
        ritualOrder.indexOf(b.ritualId)
    );

    updateSave({
      ...save,
      dailyMissions: updatedMissions,
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
      lastCompletedDate:
        save.currentStreak > 0
          ? yesterday
          : null,
    };

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(simulatedSave)
    );

    window.location.reload();
  }

  const pillarScores = pillars.map((pillar) => ({
    pillar,
    score: save.pillarProgress[pillar],
  }));

  return {
    save,
    currentMission,
    message,
    pillarScores,
    ritualStarted,

    accomplirMission,
    addDailyMission,
    removeDailyMission,
    restoreDefaultMissions,
    resetGame,
    simulateNewDay,
  };
}