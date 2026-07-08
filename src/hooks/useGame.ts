"use client";

import { useEffect, useState } from "react";
import { boss, companion, missions } from "@/data/game";
import type { SaveData } from "@/types/game";

const SAVE_KEY = "ras-save-v3";

const defaultSave: SaveData = {
  missionIndex: 0,
  xp: 0,
  glory: 0,
  bossHp: boss.maxHp,
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

    updateSave({
      missionIndex: save.missionIndex + 1,
      xp: save.xp + currentMission.xp,
      glory: save.glory + currentMission.glory,
      bossHp: Math.max(save.bossHp - currentMission.damage, 0),
    });

    setMessage(companion.success);
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    setSave(defaultSave);
    setMessage(companion.start);
  }

  return {
    save,
    currentMission,
    message,
    accomplirMission,
    resetGame,
  };
}