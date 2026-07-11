import Link from "next/link";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { getBossPhase } from "@/lib/bosses";
import type { Boss } from "@/types/game";

type BossPanelProps = {
  boss: Boss;
  bossHp: number;
  bossDefeated: boolean;
};

export default function BossPanel({
  boss,
  bossHp,
  bossDefeated,
}: BossPanelProps) {
  const phase = getBossPhase(boss, bossHp);

  return (
    <Card title="👹 Boss">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">
            {boss.name}
          </p>

          <p className="text-xs text-yellow-400">
            {phase.name}
          </p>
        </div>

        <p className="text-xs text-zinc-400">
          Faiblesse : {boss.weakness}
        </p>
      </div>

      <ProgressBar
        value={bossHp}
        max={boss.maxHp}
        color="red"
      />

      <div className="mt-2 flex justify-between text-xs">
        <span>
          {bossHp}/{boss.maxHp} PV
        </span>

        <span className="text-yellow-400">
          Récompense : {boss.rewardGlory} Glory
        </span>
      </div>

      {bossDefeated && (
        <p className="mt-2 font-bold text-yellow-400">
          🏆 Boss vaincu
        </p>
      )}

      <Link
        href="/boss"
        className="mt-3 block rounded-lg border border-zinc-700 px-3 py-1.5 text-center text-xs font-bold"
      >
        Ouvrir le Boss →
      </Link>
    </Card>
  );
}