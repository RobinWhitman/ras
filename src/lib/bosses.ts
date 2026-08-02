import type { Boss, BossPhase } from "@/types/game";

export function getBossHpPercent(
  bossHp: number,
  maxHp: number
): number {
  if (maxHp <= 0) return 0;

  return Math.max(
    0,
    Math.min(100, Math.round((bossHp / maxHp) * 100))
  );
}

export function getBossPhase(
  boss: Boss,
  bossHp: number
): BossPhase {
  const hpPercent = getBossHpPercent(bossHp, boss.maxHp);
  const phases = boss.phases ?? [];

  if (phases.length === 0) {
    return hpPercent === 0
      ? { name: "Vaincu", minHpPercent: 0, description: "Combat terminé." }
      : { name: "Combat en cours", minHpPercent: 1, description: "Les actions réelles font progresser ce combat." };
  }

  return (
    phases.find(
      (phase) => hpPercent >= phase.minHpPercent
    ) ?? phases[phases.length - 1]
  );
}
