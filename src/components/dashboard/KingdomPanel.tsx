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
  return (
    <Card title="🏰 Royaume">
      <div className="grid grid-cols-2 gap-2">
        {pillarScores.map((item) => {
          const progress = getBuildingProgress(item.score);

          return (
            <div
              key={item.pillar}
              className="rounded-lg border border-zinc-800 p-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-bold">
                  {buildingIcons[item.pillar]}{" "}
                  {buildingNames[item.pillar]}
                </p>

                <span className="text-xs font-bold text-yellow-400">
                  {item.score}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Niv. {progress.level}</span>

                <span>
                  {progress.current}/{progress.next}
                </span>
              </div>

              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}