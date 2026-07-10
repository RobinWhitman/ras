import Card from "@/components/Card";
import {
  buildingNames,
  getBuildingProgress,
} from "@/lib/buildings";
import type { Pillar } from "@/types/game";

type Props = {
  pillarScores: {
    pillar: Pillar;
    score: number;
  }[];
};

export default function KingdomPanel({
  pillarScores,
}: Props) {

  return (
    <Card title="🏰 Royaume">

      <div className="space-y-3">

        {pillarScores.map((item) => {

          const building =
            getBuildingProgress(item.score);

          return (

            <div
              key={item.pillar}
              className="rounded-lg border border-zinc-800 p-3"
            >

              <div className="flex justify-between">

                <div>

                  <p className="font-bold">

                    {buildingNames[item.pillar]}

                  </p>

                  <p className="text-xs text-zinc-500">

                    Niveau {building.level}

                  </p>

                </div>

                <p className="text-yellow-400 font-bold">

                  {item.score}

                </p>

              </div>

              <div className="mt-3 h-2 rounded-full bg-zinc-800">

                <div
                  className="h-full rounded-full bg-yellow-500 transition-all"
                  style={{
                    width: `${building.percent}%`,
                  }}
                />

              </div>

              <p className="mt-1 text-xs text-zinc-500">

                {building.current} / {building.next}

              </p>

            </div>

          );

        })}

      </div>

    </Card>
  );

}