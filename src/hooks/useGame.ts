"use client";

import { useEffect, useState } from "react";
import {
  bosses,
  companion,
  companionMissionMessages,
  missions,
} from "@/data/game";
import type { CompletedMission, SaveData } from "@/types/game";

const SAVE_KEY = "ras-save-v7";

const activeBoss = bosses[0];

const defaultSave: SaveData = {
  missionIndex: 0,
  xp: 0,
  glory: 0,
  bossHp: activeBoss.maxHp,
  completedMissions: [],
};

export function useGame() {
  const [save, setSave] = useState<SaveData>(defaultSave);
  const [message, setMessage] = useState(companion.start);

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);
    if (stored) setSave(JSON.parse(stored));
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
      missionIndex: save.missionIndex + 1,
      xp: save.xp + currentMission.xp,
      glory: save.glory + currentMission.glory,
      bossHp: Math.max(save.bossHp - currentMission.damage, 0),
      completedMissions: [...save.completedMissions, completedMission],
    });

    setMessage(companionMissionMessages[currentMission.pillar]);
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    setSave(defaultSave);
    setMessage(companion.start);
  }

  const pillars = [
    "Force",
    "Savoir",
    "Discipline",
    "Santé",
    "Leadership",
    "Foi",
    "Relations",
  ] as const;

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
  };
}