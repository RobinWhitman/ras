"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function JournalPage() {
  const { save } = useGame();

  const totalArchivedMissions =
    save.dayHistory.reduce(
      (total, day) =>
        total + day.completedMissions.length,
      0
    );

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              📖 Journal et Archives
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions aujourd’hui
            </p>

            <p className="text-2xl font-bold">
              {save.completedMissions.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Journées archivées
            </p>

            <p className="text-2xl font-bold">
              {save.dayHistory.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions archivées
            </p>

            <p className="text-2xl font-bold">
              {totalArchivedMissions}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Meilleure série
            </p>

            <p className="text-2xl font-bold">
              {save.bestStreak}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-yellow-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-yellow-400">
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
                {save.completedMissions.length} mission(s)
              </p>
            </div>
          </div>

          {save.completedMissions.length === 0 ? (
            <p className="text-zinc-400">
              Aucune mission accomplie aujourd’hui.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {save.completedMissions.map(
                (mission, index) => (
                  <article
                    key={`${mission.id}-${index}`}
                    className="rounded-lg border border-zinc-800 p-3"
                  >
                    <p className="font-bold">
                      {mission.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {mission.pillar}
                    </p>

                    <p className="mt-2 text-xs text-yellow-400">
                      +{mission.xp} XP · +{mission.glory} Glory
                    </p>
                  </article>
                )
              )}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            🗃 Archives
          </h2>

          {save.dayHistory.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 p-5">
              <p className="text-zinc-400">
                Aucune journée archivée pour le moment.
              </p>
            </div>
          ) : (
            save.dayHistory.map((day) => (
              <details
                key={day.date}
                className="rounded-xl border border-zinc-800 p-5"
              >
                <summary className="cursor-pointer">
                  <div className="inline-flex w-[calc(100%-24px)] items-center justify-between gap-4 align-middle">
                    <div>
                      <p className="font-bold capitalize">
                        {formatDate(day.date)}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {day.completedMissions.length} mission(s)
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

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {day.completedMissions.map(
                    (mission, index) => (
                      <article
                        key={`${day.date}-${mission.id}-${index}`}
                        className="rounded-lg border border-zinc-800 p-3"
                      >
                        <p className="font-bold">
                          {mission.title}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {mission.pillar}
                        </p>

                        <p className="mt-2 text-xs text-yellow-400">
                          +{mission.xp} XP · +{mission.glory} Glory
                        </p>
                      </article>
                    )
                  )}
                </div>
              </details>
            ))
          )}
        </section>
      </div>
    </main>
  );
}