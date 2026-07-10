"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";

export default function JournalPage() {
  const { save } = useGame();

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              📖 Journal de la journée
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions accomplies
            </p>

            <p className="text-2xl font-bold">
              {save.completedMissions.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Glory aujourd&apos;hui
            </p>

            <p className="text-2xl font-bold">
              {save.dailyGlory}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              XP total
            </p>

            <p className="text-2xl font-bold">
              {save.xp}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Série actuelle
            </p>

            <p className="text-2xl font-bold">
              {save.currentStreak}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-4 text-2xl font-bold">
            Missions accomplies
          </h2>

          {save.completedMissions.length === 0 ? (
            <p className="text-zinc-400">
              Aucune mission accomplie aujourd&apos;hui.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...save.completedMissions]
                .reverse()
                .map((mission, index) => (
                  <article
                    key={`${mission.id}-${index}`}
                    className="rounded-xl border border-zinc-800 p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-bold">
                        {mission.title}
                      </h3>

                      <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-400">
                        {mission.pillar}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm">
                      <span className="text-yellow-400">
                        +{mission.xp} XP
                      </span>

                      <span className="text-yellow-400">
                        +{mission.glory} Glory
                      </span>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}