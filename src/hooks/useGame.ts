"use client";

import { useEffect, useState } from "react";
import {
  bosses,
  companion,
  companionMissionMessages,
  missions,
} from "@/data/game";
import type {
  CompletedMission,
  Pillar,
  PillarProgress,
  SaveData,
} from "@/types/game";

const SAVE_KEY = "ras-save-v8";
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

function createDefaultSave(): SaveData {
  return {
    currentDate: getTodayDate(),
    missionIndex: 0,

    xp: 0,
    glory: 0,
    bossHp: activeBoss.maxHp,

    dailyGlory: 0,
    completedMissions: [],

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

  const currentMission = missions[save.missionIndex];

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
    const ritualCompleted = nextMissionIndex >= missions.length;
    const today = getTodayDate();

    let nextCurrentStreak = save.currentStreak;
    let nextBestStreak = save.bestStreak;
    let nextLastCompletedDate = save.lastCompletedDate;

    if (ritualCompleted && save.lastCompletedDate !== today) {
      const yesterday = getPreviousDate(today);

      if (save.lastCompletedDate === yesterday) {
        nextCurrentStreak = save.currentStreak + 1;
      } else {
        nextCurrentStreak = 1;
      }

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

    if (ritualCompleted) {
      setMessage(
        "Le Rituel de l’Aube est accompli. Une nouvelle journée rejoint ta Légende."
      );
    } else {
      setMessage(
        companionMissionMessages[currentMission.pillar]
      );
    }
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

      // On fait croire à RAS que la sauvegarde date d’hier.
      currentDate: yesterday,

      // Si une série existe, son dernier rituel est considéré comme accompli hier.
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
    accomplirMission,
    resetGame,
    simulateNewDay,
  };
}