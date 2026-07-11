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

  return (
    boss.phases.find(
      (phase) => hpPercent >= phase.minHpPercent
    ) ?? boss.phases[boss.phases.length - 1]
  );
}