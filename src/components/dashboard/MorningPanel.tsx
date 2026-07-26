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
  const isRestDay =
    !hasPlannedMissionsToday && !currentMission;

  return (
    <Card title="Conseil du matin">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded border border-stone-800 bg-stone-950 p-2">
            <p className="text-stone-500">Royaume</p>
            <p className="truncate font-bold text-stone-100">
              {kingdomState}
            </p>
          </div>

          <div className="rounded border border-stone-800 bg-stone-950 p-2">
            <p className="text-stone-500">Jour</p>
            <p className="truncate font-bold text-stone-100">
              {dayState}
            </p>
          </div>

          <div className="rounded border border-stone-800 bg-stone-950 p-2">
            <p className="text-stone-500">Boss</p>
            <p className="truncate font-bold text-stone-100">
              {bossName}
            </p>
          </div>
        </div>

        {currentMission ? (
          <div className="flex min-h-0 flex-1 items-center justify-between gap-4 rounded border border-yellow-700 bg-yellow-950/30 p-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-yellow-500">
                Mission active
              </p>

              <h2 className="truncate text-base font-black text-yellow-100">
                {currentMission.title}
              </h2>

              <p className="text-xs text-stone-400">
                {currentMission.pillar} · +{currentMission.xp} XP
              </p>
            </div>

            <button
              type="button"
              onClick={onAccomplish}
              className="shrink-0 rounded border border-yellow-500 bg-yellow-600 px-4 py-2 text-xs font-black uppercase text-black hover:bg-yellow-400"
            >
              Accomplir
            </button>
          </div>
        ) : (
          <div className="flex flex-1 items-center rounded border border-stone-800 bg-stone-950 px-4">
            <div>
              <p className="font-bold text-stone-100">
                {isRestDay
                  ? "Repos stratégique"
                  : chapterTitle}
              </p>

              <p className="text-xs text-stone-400">
                {isRestDay
                  ? "Aucune mission planifiée aujourd’hui."
                  : "Toutes les missions du jour sont résolues."}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}