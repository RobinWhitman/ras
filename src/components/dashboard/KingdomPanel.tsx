import Link from "next/link";
import Card from "@/components/Card";
import {
  buildingNames,
  getBuildingProgress,
} from "@/lib/buildings";
import type { Pillar } from "@/types/game";

type KingdomPanelProps = {
  pillarScores: {
    pillar: Pillar;
    score: number;
  }[];
};

const buildingIcons: Record<Pillar, string> = {
  Force: "⚔️",
  Savoir: "📚",
  Discipline: "🛡️",
  Santé: "🌿",
  Leadership: "👑",
  Foi: "✨",
  Relations: "🤝",
};

export default function KingdomPanel({
  pillarScores,
}: KingdomPanelProps) {
  const visibleBuildings = pillarScores.slice(0, 6);

  return (
    <Card title="🏰 Royaume">
      <div className="grid grid-cols-3 gap-1.5">
        {visibleBuildings.map((item) => {
          const progress = getBuildingProgress(item.score);

          return (
            <div
              key={item.pillar}
              className="rounded-md border border-zinc-800 p-1.5 text-center"
            >
              <p className="text-base">
                {buildingIcons[item.pillar]}
              </p>

              <p className="truncate text-[9px] font-bold">
                {buildingNames[item.pillar]}
              </p>

              <p className="text-[8px] text-yellow-400">
                Niv. {progress.level}
              </p>
            </div>
          );
        })}
      </div>

      <Link
        href="/kingdom"
        className="mt-2 block rounded-lg border border-zinc-700 px-3 py-1.5 text-center text-[10px] font-bold text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-400"
      >
        Ouvrir le Royaume complet →
      </Link>
    </Card>
  );
}