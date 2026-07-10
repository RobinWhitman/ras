import { rituals } from "@/data/game";
import type { Mission } from "@/types/game";

type MorningPanelProps = {
  kingdomState: string;
  dayState: string;
  chapterTitle: string;
  bossName: string;
  currentMission: Mission | undefined;
  onAccomplish: () => void;
};

export default function MorningPanel({
  kingdomState,
  dayState,
  chapterTitle,
  bossName,
  currentMission,
  onAccomplish,
}: MorningPanelProps) {
  const currentRitual = currentMission
    ? rituals.find(
        (ritual) => ritual.id === currentMission.ritualId
      )
    : undefined;

  return (
    <section className="h-full overflow-hidden rounded-xl border border-yellow-500 bg-yellow-500/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-yellow-400">
          Conseil du Jour
        </p>

        <p className="text-xs font-bold text-yellow-400">
          {currentRitual
            ? currentRitual.title
            : "Journée accomplie"}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <h2 className="font-bold">🏰 Où j’en suis ?</h2>
          <p className="text-sm text-zinc-300">
            {kingdomState}
          </p>
          <p className="text-sm text-yellow-400">
            {dayState}
          </p>
        </div>

        <div>
          <h2 className="font-bold">⚔ Pourquoi ?</h2>
          <p className="text-sm text-zinc-300">
            {chapterTitle}
          </p>
          <p className="text-sm text-zinc-400">
            {bossName}
          </p>
        </div>

        <div>
          <h2 className="font-bold">🎯 Action</h2>
          <p className="text-sm text-zinc-300">
            {currentMission
              ? currentMission.title
              : "Toutes les missions sont accomplies."}
          </p>
        </div>
      </div>

      {currentMission ? (
        <button
          onClick={onAccomplish}
          className="w-full rounded-xl bg-yellow-500 px-4 py-3 font-bold text-black"
        >
          ✅ Accomplir la Mission
        </button>
      ) : (
        <div className="rounded-xl border border-yellow-500 p-3">
          <p className="font-bold text-yellow-400">
            🏆 Journée accomplie
          </p>
        </div>
      )}
    </section>
  );
}