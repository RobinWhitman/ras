import Card from "@/components/Card";
import type { Pillar } from "@/types/game";

type KingdomPanelProps = {
  kingdomState: string;
  unlockedBuildings: {
    pillar: Pillar;
    score: number;
  }[];
  kingdomBuildings: Record<Pillar, string>;
};

export default function KingdomPanel({
  kingdomState,
  unlockedBuildings,
  kingdomBuildings,
}: KingdomPanelProps) {
  return (
    <Card title="🏰 Royaume">
      <p>{kingdomState}</p>

      <div className="mt-4">
        {unlockedBuildings.length === 0 ? (
          <p className="text-zinc-400">Aucun bâtiment actif.</p>
        ) : (
          <ul className="space-y-2">
            {unlockedBuildings.map((item) => (
              <li
                key={item.pillar}
                className="border border-zinc-800 rounded-lg p-3"
              >
                <p className="font-semibold">
                  {kingdomBuildings[item.pillar]}
                </p>
                <p className="text-zinc-400">Pilier {item.pillar}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}