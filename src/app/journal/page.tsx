"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";
import type { Mission } from "@/types/game";

type MissionStatus =
  | "completed"
  | "skipped"
  | "pending";

const statusLabels: Record<MissionStatus, string> = {
  completed: "Accomplie",
  skipped: "Repos",
  pending: "Non résolue",
};

const statusClasses: Record<MissionStatus, string> = {
  completed: "border-green-800 text-green-400",
  skipped: "border-blue-900 text-blue-400",
  pending: "border-zinc-800 text-zinc-500",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function getMissionStatus(
  missionId: string,
  completedMissionIds: string[],
  skippedMissionIds: string[]
): MissionStatus {
  if (completedMissionIds.includes(missionId)) {
    return "completed";
  }

  if (skippedMissionIds.includes(missionId)) {
    return "skipped";
  }

  return "pending";
}

function MissionCard({
  mission,
  status,
}: {
  mission: Mission;
  status: MissionStatus;
}) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold">
            {mission.title}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {mission.pillar} · {mission.ritualId}
          </p>
        </div>

        <span
          className={`shrink-0 rounded border px-2 py-1 text-[10px] font-bold uppercase ${statusClasses[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <p className="mt-3 text-xs text-yellow-400">
        +{mission.xp} XP · +{mission.glory} Glory ·{" "}
        {mission.damage} dégâts
      </p>
    </article>
  );
}

export default function JournalPage() {
  const { save, activeMissions } = useGame();

  const totalArchivedMissions =
    save.dayHistory.reduce(
      (total, day) =>
        total + day.completedMissions.length,
      0
    );

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col items-stretch gap-4 rounded-lg border border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm uppercase text-yellow-400">
              RAS
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Journal et Archives
            </h1>
          </div>

          <Link
            href="/"
            className="min-h-11 rounded bg-yellow-500 px-5 py-3 text-center font-bold text-black"
          >
            Retour au Dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions aujourd’hui
            </p>

            <p className="text-2xl font-bold">
              {save.completedMissions.length}/
              {activeMissions.length}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Journées archivées
            </p>

            <p className="text-2xl font-bold">
              {save.dayHistory.length}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions archivées
            </p>

            <p className="text-2xl font-bold">
              {totalArchivedMissions}
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Meilleure série
            </p>

            <p className="text-2xl font-bold">
              {save.bestStreak}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-yellow-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-yellow-400">
                Aujourd’hui
              </p>

              <h2 className="text-2xl font-bold">
                {formatDate(save.currentDate)}
              </h2>
            </div>

            <div className="text-right">
              <p className="font-bold text-yellow-400">
                +{save.dailyGlory} Glory
              </p>

              <p className="text-sm text-zinc-500">
                {save.completedMissions.length} accomplie(s)
                {" · "}
                {save.skippedMissionIds.length} repos
              </p>
            </div>
          </div>

          {activeMissions.length === 0 ? (
            <p className="text-zinc-400">
              Aucune mission planifiée aujourd’hui.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  status={getMissionStatus(
                    mission.id,
                    save.completedMissionIds,
                    save.skippedMissionIds
                  )}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            Archives
          </h2>

          {save.dayHistory.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 p-5">
              <p className="text-zinc-400">
                Aucune journée archivée.
              </p>
            </div>
          ) : (
            save.dayHistory.map((day) => {
              const completedIds =
                day.completedMissions.map(
                  (mission) => mission.id
                );

              return (
                <details
                  key={day.date}
                  className="rounded-lg border border-zinc-800 p-5"
                >
                  <summary className="cursor-pointer">
                    <div className="inline-flex w-[calc(100%-24px)] items-center justify-between gap-4 align-middle">
                      <div>
                        <p className="font-bold capitalize">
                          {formatDate(day.date)}
                        </p>

                        <p className="text-sm text-zinc-500">
                          {day.completedMissions.length}/
                          {day.plannedMissionCount} accomplie(s)
                          {" · "}
                          {day.skippedMissionCount} repos
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-yellow-400">
                          +{day.xpGained} XP
                        </p>

                        <p className="text-sm text-yellow-400">
                          +{day.gloryGained} Glory
                        </p>
                      </div>
                    </div>
                  </summary>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {day.plannedMissions.map(
                      (mission) => (
                        <MissionCard
                          key={`${day.date}-${mission.id}`}
                          mission={mission}
                          status={getMissionStatus(
                            mission.id,
                            completedIds,
                            day.skippedMissionIds
                          )}
                        />
                      )
                    )}
                  </div>
                </details>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
