"use client";

import { useState } from "react";
import { rituals } from "@/data/game";
import type { Mission, Pillar } from "@/types/game";

type MissionManagerProps = {
  missions: Mission[];
  ritualStarted: boolean;
  onAddMission: (
    title: string,
    pillar: Pillar,
    ritualId: string
  ) => void;
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
  const [pillar, setPillar] =
    useState<Pillar>("Discipline");
  const [ritualId, setRitualId] =
    useState("ritual-aube");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onAddMission(title, pillar, ritualId);
    setTitle("");
  }

  return (
    <div className="space-y-5">
      {ritualStarted ? (
        <p className="text-zinc-400">
          La journée a commencé. La liste sera modifiable demain.
        </p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {rituals.map((ritual) => {
              const ritualMissions = missions.filter(
                (mission) => mission.ritualId === ritual.id
              );

              return (
                <section
                  key={ritual.id}
                  className="rounded-xl border border-zinc-800 p-4"
                >
                  <h3 className="mb-3 text-lg font-bold">
                    {ritual.time === "Aube" && "🌅 "}
                    {ritual.time === "Jour" && "☀️ "}
                    {ritual.time === "Crépuscule" && "🌙 "}
                    {ritual.title}
                  </h3>

                  {ritualMissions.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      Aucune mission.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {ritualMissions.map((mission, index) => (
                        <li
                          key={mission.id}
                          className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 p-3"
                        >
                          <div>
                            <p className="text-sm font-semibold">
                              {index + 1}. {mission.title}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {mission.pillar} · +{mission.xp} XP
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onRemoveMission(mission.id)
                            }
                            className="text-xs font-bold text-red-400"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-2 rounded-xl border border-zinc-800 p-4 md:grid-cols-[1fr_170px_190px_auto]"
          >
            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Nouvelle mission"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            />

            <select
              value={pillar}
              onChange={(event) =>
                setPillar(event.target.value as Pillar)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            >
              {pillars.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={ritualId}
              onChange={(event) =>
                setRitualId(event.target.value)
              }
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            >
              {rituals.map((ritual) => (
                <option key={ritual.id} value={ritual.id}>
                  {ritual.title}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black"
            >
              Ajouter
            </button>
          </form>

          <button
            type="button"
            onClick={onRestoreDefaults}
            className="text-sm text-zinc-400 underline"
          >
            Restaurer toutes les missions par défaut
          </button>
        </>
      )}
    </div>
  );
}