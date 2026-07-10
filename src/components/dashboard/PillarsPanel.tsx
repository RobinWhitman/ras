import Card from "@/components/Card";
import type { Pillar } from "@/types/game";

type PillarsPanelProps = {
  pillarScores: {
    pillar: Pillar;
    score: number;
  }[];
};

const pillarIcons: Record<Pillar, string> = {
  Force: "💪",
  Savoir: "🧠",
  Discipline: "🛡️",
  Santé: "❤️",
  Leadership: "👑",
  Foi: "✨",
  Relations: "🤝",
};

export default function PillarsPanel({
  pillarScores,
}: PillarsPanelProps) {
  return (
    <Card title="🏛 Piliers">
      <div className="grid grid-cols-2 gap-2">
        {pillarScores.map((item) => {
          const progress = Math.min(item.score * 5, 100);

          return (
            <div
              key={item.pillar}
              className="rounded-lg border border-zinc-800 p-2"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="truncate text-xs font-semibold">
                  {pillarIcons[item.pillar]} {item.pillar}
                </span>

                <span className="text-xs font-bold text-yellow-400">
                  {item.score}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}