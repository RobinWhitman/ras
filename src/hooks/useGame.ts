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

function createDefaultSave(): SaveData {
  return {
    currentDate: getTodayDate(),
    missionIndex: 0,

    xp: 0,
    glory: 0,
    bossHp: activeBoss.maxHp,

    dailyGlory: 0,
    completedMissions: [],
    dailyMissions: cloneDefaultMissions(),

    pillarProgress: createEmptyPillarProgress(),

    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
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

    const storedSave: SaveData = {
      ...defaultSave,
      ...parsedSave,

      completedMissions: parsedSave.completedMissions ?? [],
      dailyMissions:
        parsedSave.dailyMissions?.length
          ? parsedSave.dailyMissions
          : cloneDefaultMissions(),

      pillarProgress: {
        ...createEmptyPillarProgress(),
        ...(parsedSave.pillarProgress ?? {}),
      },

      currentStreak: parsedSave.currentStreak ?? 0,
      bestStreak: parsedSave.bestStreak ?? 0,
      lastCompletedDate: parsedSave.lastCompletedDate ?? null,
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
  }, []);

  const currentMission = save.dailyMissions[save.missionIndex];
  const ritualStarted = save.missionIndex > 0;

  function updateSave(nextSave: SaveData) {
    setSave(nextSave);
    localStorage.setItem(SAVE_KEY, JSON.stringify(nextSave));
  }

  function accomplirMission() {
    if (!currentMission) return;

    const completedMission: CompletedMission = {
      id: currentMission.id,
      title: currentMission.title,
      pillar: currentMission.pillar,
      xp: currentMission.xp,
      glory: currentMission.glory,
    };

    const updatedPillarProgress: PillarProgress = {
      ...save.pillarProgress,
      [currentMission.pillar]:
        save.pillarProgress[currentMission.pillar] + currentMission.glory,
    };

    const nextMissionIndex = save.missionIndex + 1;
    const ritualCompleted =
      nextMissionIndex >= save.dailyMissions.length;

    const today = getTodayDate();

    let nextCurrentStreak = save.currentStreak;
    let nextBestStreak = save.bestStreak;
    let nextLastCompletedDate = save.lastCompletedDate;

    if (ritualCompleted && save.lastCompletedDate !== today) {
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
      missionIndex: nextMissionIndex,

      xp: save.xp + currentMission.xp,
      glory: save.glory + currentMission.glory,
      dailyGlory: save.dailyGlory + currentMission.glory,

      bossHp: Math.max(
        save.bossHp - currentMission.damage,
        0
      ),

      completedMissions: [
        ...save.completedMissions,
        completedMission,
      ],

      pillarProgress: updatedPillarProgress,

      currentStreak: nextCurrentStreak,
      bestStreak: nextBestStreak,
      lastCompletedDate: nextLastCompletedDate,
    });

    setMessage(
      ritualCompleted
        ? "Le Rituel de l’Aube est accompli. Une nouvelle journée rejoint ta Légende."
        : companionMissionMessages[currentMission.pillar]
    );
  }

  function addDailyMission(title: string, pillar: Pillar) {
    if (ritualStarted || !title.trim()) return;

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      chapterId: "chapter-ras",
      bossId: "boss-chaos",
      projectId: "project-ras-v1",
      ritualId: "ritual-aube",
      title: title.trim(),
      pillar,
      xp: 10,
      glory: 5,
      damage: 5,
    };

    updateSave({
      ...save,
      dailyMissions: [...save.dailyMissions, newMission],
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