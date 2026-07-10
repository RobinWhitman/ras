"use client";

import { useState } from "react";
import type { Mission, Pillar } from "@/types/game";

type MissionManagerProps = {
  missions: Mission[];
  ritualStarted: boolean;
  onAddMission: (title: string, pillar: Pillar) => void;
  onRemoveMission: (missionId: string) => void;
  onRestoreDefaults: () => void;
};

const pillars: Pillar[] = [
  "Force",
  "Savoir",
  "Discipline",
  "Santé",
  "Leadership",
  "Foi",
  "Relations",
];

export default function MissionManager({
  missions,
  ritualStarted,
  onAddMission,
  onRemoveMission,
  onRestoreDefaults,
}: MissionManagerProps) {
  const [title, setTitle] = useState("");
  const [pillar, setPillar] = useState<Pillar>("Discipline");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddMission(title, pillar);
    setTitle("");
  }

  return (
    <details className="border border-zinc-800 rounded-xl p-3">
      <summary className="cursor-pointer font-bold">
        ⚙️ Configurer le Rituel de l’Aube
      </summary>

      {ritualStarted ? (
        <p className="mt-3 text-zinc-400">
          Le rituel a commencé. La liste sera modifiable demain.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {missions.map((mission, index) => (
              <li
                key={mission.id}
                className="flex items-center justify-between gap-3 border border-zinc-800 rounded-lg p-3"
              >
                <div>
                  <p className="font-semibold">
                    {index + 1}. {mission.title}
                  </p>

                  <p className="text-xs text-zinc-400">
                    {mission.pillar} · +{mission.xp} XP · +{mission.glory} Glory
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveMission(mission.id)}
                  className="text-red-400 font-bold px-2"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-2"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nouvelle mission"
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
            />

            <select
              value={pillar}
              onChange={(event) =>
                setPillar(event.target.value as Pillar)
              }
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white"
            >
              {pillars.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-yellow-500 text-black font-bold rounded-lg px-4 py-2"
            >
              Ajouter
            </button>
          </form>

          <button
            type="button"
            onClick={onRestoreDefaults}
            className="text-sm text-zinc-400 underline"
          >
            Restaurer les missions par défaut
          </button>
        </div>
      )}
    </details>
  );
}