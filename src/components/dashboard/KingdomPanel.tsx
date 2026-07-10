import Card from "@/components/Card";
import {
  buildingNames,
  getBuildingProgress,
} from "@/lib/buildings";
import { BUILDING_BONUSES } from "@/lib/buildingBonuses";
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
      <div className="grid grid-cols-2 gap-1">
        {pillarScores.map((item) => {
          const progress = getBuildingProgress(item.score);
          const bonus =
  BUILDING_BONUSES[item.pillar][
    Math.min(progress.level - 1, 4)
  ];

          return (
            <div
              key={item.pillar}
              className="rounded-md border border-zinc-800 px-2 py-1"
            >
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-[11px] font-bold">
                  <p className="text-[9px] text-yellow-500">
  {bonus.title}
</p>

<p className="text-[8px] text-zinc-500 truncate">
  {bonus.description}
</p>
                  {buildingIcons[item.pillar]}{" "}
                  {buildingNames[item.pillar]}
                </p>

                <span className="text-[10px] font-bold text-yellow-400">
                  {item.score}
                </span>
              </div>

              <div className="mt-0.5 flex items-center justify-between text-[9px] text-zinc-500">
                <span>Niv. {progress.level}</span>
                <span>
                  {progress.current}/{progress.next}
                </span>
              </div>

              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-zinc-800">
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