"use client";

import { useEffect, useMemo, useState } from "react";
import { routineDefinitions } from "@/data/routines";
import {
  GAME_SAVE_KEY,
  normalizeSaveData,
} from "@/hooks/useGame";
import {
  applyRoutineReward,
  getRoutineReward,
} from "@/lib/routineRewards";
import {
  advanceRoutineSave,
  completeRoutinePeriod,
  createRoutineSave,
  getLocalDate,
  getRoutinePeriod,
  isRoutineAvailable,
  normalizeRoutineSave,
  ROUTINE_SAVE_KEY,
} from "@/lib/routines";
import type {
  PhysicalAssessment,
  RoutineSaveData,
} from "@/types/routines";

function persistRoutineSave(save: RoutineSaveData) {
  localStorage.setItem(
    ROUTINE_SAVE_KEY,
    JSON.stringify(save)
  );
}

export function useRoutines() {
  const [today, setToday] = useState(getLocalDate);
  const [rewardMessage, setRewardMessage] = useState("");
  const [save, setSave] = useState<RoutineSaveData>(() =>
    createRoutineSave(routineDefinitions, today)
  );

  useEffect(() => {
    function refreshDate() {
      setToday(getLocalDate());
    }

    function refreshWhenVisible() {
      if (document.visibilityState === "visible") {
        refreshDate();
      }
    }

    const dateInterval = window.setInterval(
      refreshDate,
      60_000
    );

    window.addEventListener("focus", refreshDate);
    document.addEventListener(
      "visibilitychange",
      refreshWhenVisible
    );

    return () => {
      window.clearInterval(dateInterval);
      window.removeEventListener("focus", refreshDate);
      document.removeEventListener(
        "visibilitychange",
        refreshWhenVisible
      );
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ROUTINE_SAVE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      const normalized = normalizeRoutineSave(
        parsed,
        routineDefinitions,
        today
      );
      const advanced = advanceRoutineSave(
        normalized,
        routineDefinitions,
        today
      );

      setSave(advanced);
      persistRoutineSave(advanced);
    } catch {
      const freshSave = createRoutineSave(
        routineDefinitions,
        today
      );

      setSave(freshSave);
      persistRoutineSave(freshSave);
    }
  }, [today]);

  const availableRoutines = useMemo(
    () =>
      routineDefinitions
        .filter((routine) => isRoutineAvailable(routine, today))
        .sort(
          (first, second) =>
            first.section.localeCompare(second.section) ||
            first.order - second.order
        ),
    [today]
  );

  function awardRoutine(routine: (typeof routineDefinitions)[number]) {
    try {
      const storedGame = localStorage.getItem(GAME_SAVE_KEY);
      const gameSave = normalizeSaveData(
        storedGame ? JSON.parse(storedGame) : null
      );
      const nextGameSave = applyRoutineReward(gameSave, routine);
      const reward = getRoutineReward(routine);

      localStorage.setItem(
        GAME_SAVE_KEY,
        JSON.stringify(nextGameSave)
      );
      setRewardMessage(
        `${routine.title} : +${reward.xp} XP et +${reward.glory} Glory`
      );
    } catch {
      setRewardMessage(
        "La routine est validée, mais la récompense n’a pas pu être enregistrée."
      );
    }
  }

  function completeRoutine(routineId: string) {
    const routine = routineDefinitions.find(
      (item) => item.id === routineId
    );

    if (!routine) return;

    const nextSave = completeRoutinePeriod(
      save,
      routine,
      today
    );

    if (nextSave === save) return;

    persistRoutineSave(nextSave);
    setSave(nextSave);
    awardRoutine(routine);
  }

  function addPhysicalAssessment(
    assessment: PhysicalAssessment
  ) {
    const routine = routineDefinitions.find(
      (item) => item.id === "periodique-bilan-physique"
    );

    if (!routine) return;

    const withAssessment: RoutineSaveData = {
      ...save,
      physicalAssessments: [
        assessment,
        ...save.physicalAssessments,
      ],
    };

    const nextSave = completeRoutinePeriod(
      withAssessment,
      routine,
      today
    );

    persistRoutineSave(nextSave);
    setSave(nextSave);
    awardRoutine(routine);
  }

  function resetRoutines() {
    const freshSave = createRoutineSave(
      routineDefinitions,
      today
    );

    localStorage.removeItem(ROUTINE_SAVE_KEY);
    setSave(freshSave);
  }

  const routineStates = Object.fromEntries(
    routineDefinitions.map((routine) => [
      routine.id,
      getRoutinePeriod(save, routine, today),
    ])
  );

  const spiritualProjectUnlocked = [
    "aube-priere",
    "jour-benedicite",
    "crepuscule-priere",
    "hebdo-lecture-biblique",
  ].every(
    (routineId) =>
      (save.progress[routineId]?.currentStreak ?? 0) >= 200
  );

  return {
    today,
    save,
    routines: routineDefinitions,
    availableRoutines,
    routineStates,
    spiritualProjectUnlocked,
    rewardMessage,
    completeRoutine,
    addPhysicalAssessment,
    resetRoutines,
  };
}
