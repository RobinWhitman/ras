"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";
import { createWeeklyReport } from "@/lib/weeklyReport";
import type { Pillar } from "@/types/game";

const pillarIcons: Record<Pillar, string> = {
  Force: "💪",
  Savoir: "🧠",
  Discipline: "🛡️",
  Santé: "❤️",
  Leadership: "👑",
  Foi: "✨",
  Relations: "🤝",
};

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export default function ReportPage() {
  const { save } = useGame();
  const report = createWeeklyReport(save);

  const maxDayGlory = Math.max(
    ...report.days.map((day) => day.glory),
    1
  );

  const maxPillarScore = Math.max(
    ...report.pillarScores.map(
      (pillar) => pillar.score
    ),
    1
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
              📊 Rapport Hebdomadaire
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <article className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Missions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {report.totalMissions}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              XP gagnés
            </p>

            <p className="mt-2 text-3xl font-bold">
              {report.totalXp}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Glory gagnée
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {report.totalGlory}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Journées complètes
            </p>

            <p className="mt-2 text-3xl font-bold">
              {report.completedDays}/7
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Régularité
            </p>

            <p className="mt-2 text-3xl font-bold">
              {report.completionRate}%
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-green-900 bg-green-950/10 p-6">
          <p className="text-sm uppercase tracking-widest text-green-400">
            🐈‍⬛ Analyse de LOKI
          </p>

          <p className="mt-3 text-2xl font-bold">
            « {report.lokiSummary} »
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-5 text-2xl font-bold">
            📅 Les sept derniers jours
          </h2>

          <div className="grid grid-cols-7 gap-3">
            {report.days.map((day) => {
              const barHeight = Math.max(
                6,
                Math.round(
                  (day.glory / maxDayGlory) * 100
                )
              );

              return (
                <article
                  key={day.date}
                  className="flex min-h-72 flex-col rounded-xl border border-zinc-800 p-3"
                >
                  <p className="text-center text-xs font-bold capitalize">
                    {formatShortDate(day.date)}
                  </p>

                  <div className="mt-4 flex flex-1 items-end justify-center">
                    <div className="flex h-40 w-full items-end justify-center rounded-lg bg-zinc-950 px-3">
                      <div
                        className={`w-full rounded-t-md ${
                          day.completed
                            ? "bg-yellow-500"
                            : day.missionCount > 0
                              ? "bg-zinc-500"
                              : "bg-zinc-800"
                        }`}
                        style={{
                          height: `${barHeight}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="font-bold text-yellow-400">
                      {day.glory} G
                    </p>

                    <p className="text-xs text-zinc-500">
                      {day.missionCount} Mission(s)
                    </p>

                    <p className="mt-1 text-xs">
                      {day.completed
                        ? "🌟 Complète"
                        : day.missionCount > 0
                          ? "🛡 En cours"
                          : "🌙 Repos"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border border-zinc-800 p-5">
            <h2 className="mb-5 text-2xl font-bold">
              🏛 Progression des Piliers
            </h2>

            <div className="space-y-4">
              {report.pillarScores
                .sort((a, b) => b.score - a.score)
                .map((item) => {
                  const progress = Math.round(
                    (item.score / maxPillarScore) * 100
                  );

                  return (
                    <div key={item.pillar}>
                      <div className="mb-2 flex justify-between">
                        <span className="font-bold">
                          {pillarIcons[item.pillar]}{" "}
                          {item.pillar}
                        </span>

                        <span className="text-yellow-400">
                          {item.score}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-yellow-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </article>

          <article className="space-y-4">
            <div className="rounded-xl border border-yellow-900 p-5">
              <p className="text-sm text-zinc-500">
                Pilier dominant
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                {pillarIcons[
                  report.strongestPillar.pillar
                ]}{" "}
                {report.strongestPillar.pillar}
              </p>

              <p className="mt-2 text-zinc-400">
                {report.strongestPillar.score} points gagnés
                cette semaine.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-5">
              <p className="text-sm text-zinc-500">
                Pilier à renforcer
              </p>

              <p className="mt-2 text-3xl font-bold">
                {pillarIcons[
                  report.weakestPillar.pillar
                ]}{" "}
                {report.weakestPillar.pillar}
              </p>

              <p className="mt-2 text-zinc-400">
                {report.weakestPillar.score} point(s) gagné(s)
                cette semaine.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-5">
              <p className="text-sm text-zinc-500">
                Meilleure journée
              </p>

              <p className="mt-2 text-2xl font-bold capitalize">
                {report.bestDay
                  ? formatFullDate(report.bestDay.date)
                  : "Aucune"}
              </p>

              <p className="mt-2 text-yellow-400">
                {report.bestDay?.glory ?? 0} Glory ·{" "}
                {report.bestDay?.missionCount ?? 0} Mission(s)
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}