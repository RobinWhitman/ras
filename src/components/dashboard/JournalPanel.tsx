import Card from "@/components/Card";
import type { CompletedMission } from "@/types/game";

type JournalPanelProps = {
  completedMissions: CompletedMission[];
};

export default function JournalPanel({
  completedMissions,
}: JournalPanelProps) {
  return (
    <Card title="📖 Journal">
      {completedMissions.length === 0 ? (
        <p className="text-zinc-400">
          Aucune mission accomplie aujourd'hui.
        </p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto">
          {completedMissions.map((mission) => (
            <li
              key={mission.id}
              className="border border-zinc-800 rounded-lg p-3"
            >
              <p className="font-semibold">{mission.title}</p>
              <p className="text-zinc-400">
                {mission.pillar} · +{mission.xp} XP · +{mission.glory} Glory
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}