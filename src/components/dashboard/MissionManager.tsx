"use client";

import { useState } from "react";
import { allWeekDays, rituals } from "@/data/game";
import type { Mission, Pillar, WeekDay } from "@/types/game";

type MissionManagerProps = {
  missions: Mission[];
  ritualStarted: boolean;
  onAddMission: (
    title: string,
    pillar: Pillar,
    ritualId: string,
    daysOfWeek: WeekDay[]
  ) => void;
  onUpdateMissionDays: (
    missionId: string,
    daysOfWeek: WeekDay[]
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

const weekDays: { value: WeekDay; label: string }[] = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mer" },
  { value: 4, label: "Jeu" },
  { value: 5, label: "Ven" },
  { value: 6, label: "Sam" },
  { value: 0, label: "Dim" },
];

function toggleWeekDay(
  daysOfWeek: WeekDay[],
  day: WeekDay
) {
  if (daysOfWeek.includes(day)) {
    return daysOfWeek.filter((item) => item !== day);
  }

  return [...daysOfWeek, day].sort(
    (first, second) =>
      allWeekDays.indexOf(first) - allWeekDays.indexOf(second)
  );
}

function formatDays(daysOfWeek: WeekDay[]) {
  if (daysOfWeek.length === 7) {
    return "Tous les jours";
  }

  return weekDays
    .filter((day) => daysOfWeek.includes(day.value))
    .map((day) => day.label)
    .join(", ");
}

export default function MissionManager({
  missions,
  ritualStarted,
  onAddMission,
  onUpdateMissionDays,
  onRemoveMission,
  onRestoreDefaults,
}: MissionManagerProps) {
  const [title, setTitle] = useState("");
  const [pillar, setPillar] = useState<Pillar>("Discipline");
  const [ritualId, setRitualId] = useState("ritual-aube");
  const [daysOfWeek, setDaysOfWeek] =
    useState<WeekDay[]>(allWeekDays);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    onAddMission(title, pillar, ritualId, daysOfWeek);
    setTitle("");
    setDaysOfWeek(allWeekDays);
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
                          className="space-y-3 rounded-lg border border-zinc-800 p-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                {index + 1}. {mission.title}
                              </p>

                              <p className="text-xs text-zinc-500">
                                {mission.pillar} · +{mission.xp} XP ·{" "}
                                {formatDays(mission.daysOfWeek)}
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
                          </div>

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
                                    onUpdateMissionDays(
                                      mission.id,
                                      nextDays
                                    )
                                  }
                                  className={`rounded-md border px-1 py-1 text-[11px] font-bold ${
                                    selected
                                      ? "border-yellow-500 bg-yellow-500 text-black"
                                      : "border-zinc-700 text-zinc-400"
                                  } disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                  {day