"use client";

import { useEffect, useMemo, useState } from "react";
import { routineDefinitions } from "@/data/routines";
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
  const today = getLocalDate();
  const [save, setSave] = useState<RoutineSaveData>(() =>
    createRoutineSave(routineDefinitions, today)
  );

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

  function completeRoutine(routineId: string) {
    const routine = routineDefinitions.find(
      (item) => item.id === routineId
    );

    if (!routine) return;

    setSave((currentSave) => {
      const nextSave = completeRoutinePeriod(
        currentSave,
        routine,
        today
      );

      persistRoutineSave(nextSave);
      return nextSave;
    });
  }

  function addPhysicalAssessment(
    assessment: PhysicalAssessment
  ) {
    const routine = routineDefinitions.find(
      (item) => item.id === "periodique-bilan-physique"
    );

    if (!routine) return;

    setSave((currentSave) => {
      const withAssessment: RoutineSaveData = {
        ...currentSave,
        physicalAssessments: [
          assessment,
          ...currentSave.physicalAssessments,
        ],
      };

      const nextSave = completeRoutinePeriod(
        withAssessment,
        routine,
        today
      );

      persistRoutineSave(nextSave);
      return nextSave;
    });
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
    completeRoutine,
    addPhysicalAssessment,
    resetRoutines,
  };
}
