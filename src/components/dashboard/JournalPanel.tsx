import Link from "next/link";
import Card from "@/components/Card";
import type { CompletedMission } from "@/types/game";

type JournalPanelProps = {
  completedMissions: CompletedMission[];
};

export default function JournalPanel({
  completedMissions,
}: JournalPanelProps) {
  const visibleMissions = completedMissions.slice(-6).reverse();

  return (
    <Card title="📖 Journal">
      {visibleMissions.length === 0 ? (
        <p className="text-zinc-400">
          Aucune mission accomplie aujourd&apos;hui.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {visibleMissions.map((mission) => (
            <div
              key={mission.id}
              className="min-h-20 rounded-lg border border-zinc-800 p-2"
            >
              <p className="line-clamp-2 text-xs font-bold">
                {mission.title}
              </p>

              <p className="mt-1 text-[11px] text-zinc-500">
                {mission.pillar}
              </p>

              <p className="mt-1 text-[11px] text-yellow-400">
                +{mission.xp} XP · +{mission.glory} G
              </p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/journal"
        className="mt-3 block rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-bold text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-400"
      >
        Ouvrir le Journal complet →
      </Link>
    </Card>
  );
}