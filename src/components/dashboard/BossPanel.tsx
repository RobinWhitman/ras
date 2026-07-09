import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
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
  return (
    <Card title="👹 Boss">
      <p className="text-lg font-semibold">{boss.name}</p>

      <ProgressBar value={bossHp} max={boss.maxHp} color="red" />

      <p className="mt-3">
        {bossHp} / {boss.maxHp} PV
      </p>

      {bossDefeated && (
        <div className="mt-4 border border-yellow-500 rounded-xl p-4">
          <p className="text-yellow-400 font-bold">
            🏆 Boss vaincu
          </p>
        </div>
      )}
    </Card>
  );
}