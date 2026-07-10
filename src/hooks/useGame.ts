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
  SaveData,
} from "@/types/game";

const SAVE_KEY = "ras-save-v8";
const activeBoss = bosses[0];

function getTodayDate() {
  return new Date().toLocaleDateString("fr-CA");
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
  };
}

export function useGame() {
  const [save, setSave] = useState<SaveData>(createDefaultSave);
  const [message, setMessage] = useState(companion.start);

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);

    if (!stored) return;

    const storedSave: SaveData = JSON.parse(stored);
    const today = getTodayDate();

    if (storedSave.currentDate !== today) {
      const newDaySave: SaveData = {
        ...storedSave,
        currentDate: today,
        missionIndex: 0,
        dailyGlory: 0,
        completedMissions: [],
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

    updateSave({
      ...save,
      missionIndex: save.missionIndex + 1,
      xp: save.xp + currentMission.xp,
      glory: save.glory + currentMission.glory,
      dailyGlory: save.dailyGlory + currentMission.glory,
      bossHp: Math.max(save.bossHp - currentMission.damage, 0),
      completedMissions: [...save.completedMissions, completedMission],
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

  const pillars: Pillar[] = [
    "Force",
    "Savoir",
    "Discipline",
    "Santé",
    "Leadership",
    "Foi",
    "Relations",
  ];

  const pillarScores = pillars.map((pillar) => {
    const score = save.completedMissions
      .filter((mission) => mission.pillar === pillar)
      .reduce((total, mission) => total + mission.glory, 0);

    return { pillar, score };
  });

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