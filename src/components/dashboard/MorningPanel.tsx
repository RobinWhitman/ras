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
    <section className="h-full border border-yellow-500 rounded-xl p-6 bg-yellow-500/10">
      <p className="text-sm uppercase tracking-widest text-yellow-400 mb-4">
        Conseil du Matin
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold">🏰 Où j’en suis ?</h2>
          <p className="text-zinc-300">{kingdomState}</p>
          <p className="text-yellow-400 mt-2">{dayState}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">⚔ Pourquoi ça compte ?</h2>
          <p className="text-zinc-300">{chapterTitle}</p>
          <p className="text-zinc-400">{bossName}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold">🎯 Prochaine action</h2>
          <p className="text-zinc-300">
            {currentMission
              ? currentMission.title
              : "Rituel de l’Aube accompli."}
          </p>
        </div>
      </div>

      {currentMission ? (
        <button
          onClick={onAccomplish}
          className="w-full bg-yellow-500 text-black font-bold px-6 py-4 rounded-xl"
        >
          ✅ Accomplir la Mission
        </button>
      ) : (
        <div className="border border-yellow-500 rounded-xl p-4">
          <p className="text-yellow-400 font-bold">
            🌅 Rituel de l’Aube accompli
          </p>
          <p className="text-zinc-300">La journée peut commencer.</p>
        </div>
      )}
    </section>
  );
}