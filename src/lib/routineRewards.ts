import type { SaveData } from "@/types/game";
import type { RoutineDefinition } from "@/types/routines";

export type RoutineReward = {
  xp: number;
  glory: number;
};

export function getRoutineReward(
  routine: RoutineDefinition
): RoutineReward {
  if (routine.section === "Périodique") {
    return { xp: 15, glory: 5 };
  }

  if (routine.section === "Hebdomadaire") {
    return { xp: 5, glory: 2 };
  }

  return { xp: 2, glory: 1 };
}

export function applyRoutineReward(
  save: SaveData,
  routine: RoutineDefinition
): SaveData {
  const reward = getRoutineReward(routine);

  return {
    ...save,
    xp: save.xp + reward.xp,
    glory: save.glory + reward.glory,
    dailyGlory: save.dailyGlory + reward.glory,
    pillarProgress: {
      ...save.pillarProgress,
      [routine.pillar]:
        (save.pillarProgress[routine.pillar] ?? 0) + reward.glory,
    },
  };
}
