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
  };
}

export function useGame() {
  const [save, setSave] = useState<SaveData>(createDefaultSave);
  const [message, setMessage] = useState(companion.start);

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);

    if (!stored) return;

    const parsedSave = JSON.parse(stored) as Partial<SaveData>;

    const storedSave: SaveData = {
      ...createDefaultSave(),
      ...parsedSave,
      pillarProgress: {
        ...createEmptyPillarProgress(),
        ...(parsedSave.pillarProgress ?? {}),
      },
      completedMissions: parsedSave.completedMissions ?? [],
    };

    const today = getTodayDate();

    if (storedSave.currentDate !== today) {
      const newDaySave: SaveData = {
        ...storedSave,

        currentDate: today,
        missionIndex: 0,
        dailyGlory: 0,
        completedMissions: [],

        // La progression permanente des Piliers est conservée.
        pillarProgress: storedSave.pillarProgress,
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

    updateSave({
      ...save,
      missionIndex: save.missionIndex + 1,
      xp: save.xp + currentMission.xp,
      glory: save.glory + currentMission.glory,
      dailyGlory: save.dailyGlory + currentMission.glory,
      bossHp: Math.max(save.bossHp - currentMission.damage, 0),
      completedMissions: [...save.completedMissions, completedMission],
      pillarProgress: updatedPillarProgress,
    });

    setMessage(companionMissionMessages[currentMission.pillar]);
  }

  function resetGame() {
    const freshSave = createDefaultSave();

    localStorage.removeItem(SAVE_KEY);
    setSave(freshSave);
    setMessage(companion.start);
  }

  function simulateNewDay() {
    const newDaySave: SaveData = {
      ...save,
      currentDate: "ancienne-date",
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(newDaySave));
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