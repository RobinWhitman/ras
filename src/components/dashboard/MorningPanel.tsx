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
  return (
    <section className="h-full overflow-hidden border border-yellow-500 rounded-xl p-4 bg-yellow-500/10">
      <p className="text-xs uppercase tracking-widest text-yellow-400 mb-3">
        Conseil du Matin
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <h2 className="font-bold">🏰 Où j’en suis ?</h2>
          <p className="text-sm text-zinc-300">{kingdomState}</p>
          <p className="text-sm text-yellow-400">{dayState}</p>
        </div>

        <div>
          <h2 className="font-bold">⚔ Pourquoi ?</h2>
          <p className="text-sm text-zinc-300">{chapterTitle}</p>
          <p className="text-sm text-zinc-400">{bossName}</p>
        </div>

        <div>
          <h2 className="font-bold">🎯 Action</h2>
          <p className="text-sm text-zinc-300">
            {currentMission ? currentMission.title : "Rituel accompli."}
          </p>
        </div>
      </div>

      {currentMission ? (
        <button
          onClick={onAccomplish}
          className="w-full bg-yellow-500 text-black font-bold px-4 py-3 rounded-xl"
        >
          ✅ Accomplir la Mission
        </button>
      ) : (
        <div className="border border-yellow-500 rounded-xl p-3">
          <p className="text-yellow-400 font-bold">🌅 Rituel accompli</p>
        </div>
      )}
    </section>
  );
}