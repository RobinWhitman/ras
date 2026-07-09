import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import type { Pillar } from "@/types/game";

type PillarsPanelProps = {
  pillarScores: {
    pillar: Pillar;
    score: number;
  }[];
};

export default function PillarsPanel({ pillarScores }: PillarsPanelProps) {
  return (
    <Card title="🏛 Piliers">
      <div className="space-y-3">
        {pillarScores.map((item) => (
          <div key={item.pillar}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.pillar}</span>
              <span>{item.score}</span>
            </div>

            <ProgressBar value={Math.min(item.score * 5, 100)} max={100} />
          </div>
        ))}
      </div>
    </Card>
  );
}