"use client";

import { useState } from "react";
import { allWeekDays, projects, rituals } from "@/data/game";
import type { Mission, Pillar, WeekDay } from "@/types/game";

type MissionManagerProps = {
  missions: Mission[];
  ritualStarted: boolean;
  onAddMission: (
    title: string,
    pillar: Pillar,
    ritualId: string,
    daysOfWeek: WeekDay[],
    projectId?: string
  ) => void;
  onUpdateMission: (mission: Mission) => void;
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

const weekDays: { value: WeekDay; label: string }[] = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 0, label: "Dim" },
];

function toggleWeekDay(daysOfWeek: WeekDay[], day: WeekDay) {
  if (daysOfWeek.includes(day)) {
    return daysOfWeek.filter((item) => item !== day);
  }

  return [...daysOfWeek, day].sort(
    (first, second) =>
      allWeekDays.indexOf(first) - allWeekDays.indexOf(second)
  );
}

function formatDays(daysOfWeek: WeekDay[]) {
  if (daysOfWeek.length === 7) return "Tous les jours";

  return weekDays
    .filter((day) => daysOfWeek.includes(day.value))
    .map((day) => day.label)
    .join(", ");
}

function formatRewards(mission: Mission) {
  return `+${mission.xp} XP · +${mission.glory} Glory · -${mission.damage} PV`;
}

export default function MissionManager({
  missions,
  ritualStarted,
  onAddMission,
  onUpdateMission,
  onRemoveMission,
  onRestoreDefaults,
}: MissionManagerProps) {
  const [title, setTitle] = useState("");
  const [pillar, setPillar] = useState<Pillar>("Discipline");
  const [ritualId, setRitualId] = useState("ritual-aube");
  const [projectId, setProjectId] = useState(
    projects[0]?.id ?? "project-ras-v1"
  );
  const [daysOfWeek, setDaysOfWeek] =
    useState<WeekDay[]>(allWeekDays);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onAddMission(title, pillar, ritualId, daysOfWeek, projectId);

    setTitle("");
    setDaysOfWeek(allWeekDays);
  }

  function updateMission(
    mission: Mission,
    updates: Partial<Mission>
  ) {
    onUpdateMission({
      ...mission,
      ...updates,
    });
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
                    <ul className="space-y-3">
                      {ritualMissions.map((mission) => (
                        <li
                          key={mission.id}
                          className="space-y-3 rounded-lg border border-zinc-800 p-3"
                        >
                          <input
                            value={mission.title}
                            onChange={(event) =>
                              updateMission(mission, {
                                title: event.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-bold text-white"
                          />

                          <div className="grid gap-2 md:grid-cols-3">
                            <select
                              value={mission.pillar}
                              onChange={(event) =>
                                updateMission(mission, {
                                  pillar: event.target.value as Pillar,
                                })
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                            >
                              {pillars.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>

                            <select
                              value={mission.ritualId}
                              onChange={(event) =>
                                updateMission(mission, {
                                  ritualId: event.target.value,
                                })
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                            >
                              {rituals.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.title}
                                </option>
                              ))}
                            </select>

                            <select
                              value={mission.projectId}
                              onChange={(event) =>
                                updateMission(mission, {
                                  projectId: event.target.value,
                                })
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
                            >
                              {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                  {project.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400">
                            Récompenses automatiques :{" "}
                            <span className="font-bold text-yellow-400">
                              {formatRewards(mission)}
                            </span>
                          </div>

                          <div>
                            <p className="mb-2 text-xs text-zinc-500">
                              {formatDays(mission.daysOfWeek)}
                            </p>

                            <div className="grid grid-cols-7 gap-1">
                              {weekDays.map((day) => {
                                const selected =
                                  mission.daysOfWeek.includes(day.value);
                                const nextDays = toggleWeekDay(
                                  mission.daysOfWeek,
                                  day.value
                                );

                                return (
                                  <button
                                    key={day.value}
                                    type="button"
                                    disabled={nextDays.length === 0}
                                    onClick={() =>
                                      updateMission(mission, {
                                        daysOfWeek: nextDays,
                                      })
                                    }
                                    className={
                                      selected
                                        ? "rounded-md border border-yellow-500 bg-yellow-500 px-1 py-1 text-[11px] font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
                                        : "rounded-md border border-zinc-700 px-1 py-1 text-[11px] font-bold text-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
                                    }
                                  >
                                    {day.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveMission(mission.id)}
                            className="w-full rounded-lg border border-red-900 px-3 py-2 text-xs font-bold text-red-400"
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
            className="grid gap-3 rounded-xl border border-zinc-800 p-4 lg:grid-cols-[1fr_170px_190px]"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
              onChange={(event) => setRitualId(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white"
            >
              {rituals.map((ritual) => (
                <option key={ritual.id} value={ritual.id}>
                  {ritual.title}
                </option>
              ))}
            </select>

            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white lg:col-span-3"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>

            <div className="lg:col-span-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                Jours planifiés
              </p>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const selected = daysOfWeek.includes(day.value);
                  const nextDays = toggleWeekDay(daysOfWeek, day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      disabled={nextDays.length === 0}
                      onClick={() => setDaysOfWeek(nextDays)}
                      className={
                        selected
                          ? "rounded-lg border border-yellow-500 bg-yellow-500 px-2 py-2 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
                          : "rounded-lg border border-zinc-700 px-2 py-2 text-xs font-bold text-zinc-400 disabled:cursor-not-allowed disabled:opacity-40"
                      }
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-black lg:col-span-3"
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