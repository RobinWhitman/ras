"use client";

import Link from "next/link";
import { projectDetails } from "@/data/projects";
import { useGame } from "@/hooks/useGame";

export default function ProjectsPage() {
  const { save } = useGame();

  const project = projectDetails[0];

  const archivedXp = save.dayHistory.reduce(
    (daysTotal, day) =>
      daysTotal +
      day.completedMissions.reduce(
        (missionsTotal, mission) =>
          missionsTotal + mission.xp,
        0
      ),
    0
  );

  const todayXp = save.completedMissions.reduce(
    (total, mission) => total + mission.xp,
    0
  );

  const projectXp = archivedXp + todayXp;

  const progress = Math.min(
    100,
    Math.round((projectXp / project.targetXp) * 100)
  );

  const completed = projectXp >= project.targetXp;

  const remainingXp = Math.max(
    project.targetXp - projectXp,
    0
  );

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              📜 Projets
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section
          className={`rounded-xl border p-6 ${
            completed
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-zinc-800"
          }`}
        >
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="max-w-3xl">
              <p className="text-4xl">
                {project.icon}
              </p>

              <p className="mt-3 text-sm uppercase tracking-widest text-yellow-400">
                {completed ? "Projet terminé" : "Projet actif"}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {project.title}
              </h2>

              <p className="mt-4 text-zinc-400">
                {project.description}
              </p>
            </div>

            <div className="min-w-56 rounded-xl border border-zinc-800 p-4">
              <p className="text-sm text-zinc-500">
                Récompense finale
              </p>

              <p className="mt-1 text-2xl font-bold text-yellow-400">
                +{project.rewardGlory} Glory
              </p>

              <p className="mt-5 text-sm text-zinc-500">
                État
              </p>

              <p className="mt-1 text-xl font-bold">
                {completed ? "🏆 Accompli" : "⚒️ En construction"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">
                Progression
              </span>

              <span className="text-yellow-400">
                {projectXp} / {project.targetXp} XP
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-sm text-zinc-500">
              <span>{progress}% accompli</span>

              <span>
                {completed
                  ? "Objectif atteint"
                  : `${remainingXp} XP restants`}
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              XP investis aujourd’hui
            </p>

            <p className="mt-2 text-3xl font-bold">
              {todayXp}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              XP archivés
            </p>

            <p className="mt-2 text-3xl font-bold">
              {archivedXp}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Journées investies
            </p>

            <p className="mt-2 text-3xl font-bold">
              {save.dayHistory.length}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="text-2xl font-bold">
            🎯 Objectif du Projet
          </h2>

          <p className="mt-3 text-zinc-400">
            {project.objective}
          </p>
        </section>

        {completed && (
          <section className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-6">
            <p className="text-2xl font-bold text-yellow-400">
              🏆 Projet terminé
            </p>

            <p className="mt-2 text-zinc-300">
              La V1 de RAS a atteint son objectif de progression.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}