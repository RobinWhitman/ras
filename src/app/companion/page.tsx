"use client";

import Link from "next/link";
import { bosses } from "@/data/game";
import { useGame } from "@/hooks/useGame";
import { createGameMasterBriefing } from "@/lib/gameMaster";

const priorityClasses = {
  haute:
    "border-red-900 bg-red-950/20",
  moyenne:
    "border-yellow-900 bg-yellow-950/10",
  basse:
    "border-zinc-800",
};

export default function CompanionPage() {
  const {
    save,
    currentMission,
    message,
    pillarScores,
    accomplirMission,
  } = useGame();

  const activeBoss = bosses[0];

  const briefing = createGameMasterBriefing(
    save,
    pillarScores,
    currentMission,
    activeBoss
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
              🧙 Compagnon
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <article className="rounded-xl border border-zinc-800 p-5">
            <div className="flex aspect-square items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <p className="text-7xl">🧙</p>

                <p className="mt-3 text-sm text-zinc-500">
                  Apparence définitive à venir
                </p>
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-2xl font-bold">
                Le Premier Conseiller
              </h2>

              <p className="mt-2 text-yellow-400">
                Voix du Royaume
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-yellow-700 bg-yellow-500/10 p-6">
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              Conseil actuel
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {briefing.greeting}
            </h2>

            <p className="mt-4 text-lg text-zinc-300">
              {briefing.summary}
            </p>

            <div className="mt-6 rounded-xl border border-yellow-700 p-5">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Priorité immédiate
              </p>

              <p className="mt-2 text-2xl font-bold">
                {briefing.mainObjective}
              </p>

              {briefing.recommendedMission && (
                <>
                  <p className="mt-2 text-sm text-zinc-400">
                    Pilier :{" "}
                    {briefing.recommendedMission.pillar}
                    {" · "}
                    +{briefing.recommendedMission.xp} XP
                    {" · "}
                    +{briefing.recommendedMission.glory} Glory
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      accomplirMission(
                        briefing.recommendedMission?.id
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-yellow-500 px-5 py-3 font-bold text-black"
                  >
                    ✅ Accomplir la Mission
                  </button>
                </>
              )}
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Progression de la journée
            </h2>

            <p className="font-bold text-yellow-400">
              {briefing.completedCount} /{" "}
              {briefing.totalCount}
            </p>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{
                width: `${briefing.progressPercent}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            {briefing.progressPercent}% de la journée
            accomplie
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {briefing.alerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-xl border p-5 ${
                priorityClasses[alert.priority]
              }`}
            >
              <div className="flex items-start gap-4">
                <p className="text-3xl">
                  {alert.icon}
                </p>

                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Priorité {alert.priority}
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    {alert.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    {alert.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Pilier recommandé
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-400">
              {briefing.recommendedPillar}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Faiblesse du Boss
            </p>

            <p className="mt-2 text-2xl font-bold text-red-400">
              {activeBoss.weakness}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Série actuelle
            </p>

            <p className="mt-2 text-2xl font-bold">
              {save.currentStreak} jour(s)
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="text-2xl font-bold">
            Dernière parole du Compagnon
          </h2>

          <p className="mt-3 text-zinc-400">
            {message}
          </p>
        </section>
      </div>
    </main>
  );
}