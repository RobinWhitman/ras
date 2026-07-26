import Card from "../Card";
import type { Mission } from "@/types/game";

type MorningPanelProps = {
  kingdomState: string;
  dayState: string;
  chapterTitle: string;
  bossName: string;
  currentMission?: Mission;
  hasPlannedMissionsToday?: boolean;
  onAccomplish: () => void;
};

export default function MorningPanel({
  kingdomState,
  dayState,
  chapterTitle,
  bossName,
  currentMission,
  hasPlannedMissionsToday = true,
  onAccomplish,
}: MorningPanelProps) {
  const isRestDay = !hasPlannedMissionsToday && !currentMission;

  return (
    <Card title="Conseil du matin">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-500">
            Conseil du matin
          </p>
          <h2 className="mt-2 text-2xl font-black text-stone-100">
            {isRestDay ? "Repos stratégique" : chapterTitle}
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded border border-stone-800 bg-stone-950 p-3">
            <p className="text-xs uppercase text-stone-500">Royaume</p>
            <p className="mt-1 font-bold text-stone-100">{kingdomState}</p>
          </div>

          <div className="rounded border border-stone-800 bg-stone-950 p-3">
            <p className="text-xs uppercase text-stone-500">Jour</p>
            <p className="mt-1 font-bold text-stone-100">{dayState}</p>
          </div>

          <div className="rounded border border-stone-800 bg-stone-950 p-3">
            <p className="text-xs uppercase text-stone-500">Boss</p>
            <p className="mt-1 font-bold text-stone-100">{bossName}</p>
          </div>
        </div>

        {currentMission ? (
          <div className="rounded border border-yellow-700 bg-yellow-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
              Mission active
            </p>

            <h3 className="mt-2 text-xl font-black text-yellow-100">
              {currentMission.title}
            </h3>

            <p className="mt-2 text-sm text-stone-300">
              Pilier : {currentMission.pillar}
            </p>

            <button
              type="button"
              onClick={onAccomplish}
              className="mt-4 rounded border border-yellow-600 bg-yellow-700 px-4 py-2 text-sm font-black uppercase text-stone-950 hover:bg-yellow-500"
            >
              Accomplir
            </button>
          </div>
        ) : (
          <div className="rounded border border-stone-800 bg-stone-950 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              {isRestDay ? "Aucune mission planifiée" : "Aucune mission active"}
            </p>

            <h3 className="mt-2 text-xl font-black text-stone-100">
              {isRestDay
                ? "Ce jour ne brise pas ta série."
                : "Le Royaume attend ton prochain ordre."}
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              {isRestDay
                ? "Un jour sans mission prévue est maintenant considéré comme un repos stratégique."
                : "Planifie ou active une mission pour faire progresser ton héros."}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}