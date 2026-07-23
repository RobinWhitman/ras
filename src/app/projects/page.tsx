"use client";

import Link from "next/link";
import { projectDetails } from "@/data/projects";
import { getProjectTargetXp, useGame } from "@/hooks/useGame";

export default function ProjectsPage() {
  const { save } = useGame();

  const totalInvestedXp = projectDetails.reduce(
    (total, project) => total + (save.projectProgress[project.id] ?? 0),
    0
  );

  const waitingLevelUps = projectDetails.filter((project) =>
    save.completedProjectIds.includes(project.id)
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

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Projets suivis
            </p>

            <p className="mt-2 text-3xl font-bold">
              {projectDetails.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Niveaux vaincus
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {Object.values(save.completedProjectLevels).reduce(
                (total, levels) => total + levels.length,
                0
              )}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              XP de niveau courant
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalInvestedXp}
            </p>
          </div>
        </section>

        {waitingLevelUps.length > 0 && (
          <section className="rounded-xl border border-yellow-700 bg-yellow-500/10 p-5">
            <p className="font-bold text-yellow-400">
              Niveau suivant préparé demain
            </p>

            <p className="mt-2 text-sm text-zinc-300">
              Les Projets vaincus aujourd’hui passeront au niveau suivant au
              changement de jour.
            </p>
          </section>
        )}

        <section className="grid gap-5 lg:grid-cols-3">
          {projectDetails.map((project) => {
            const currentLevel = save.projectLevels[project.id] ?? 1;
            const targetXp = getProjectTargetXp(
              project.targetXp,
              currentLevel
            );
            const totalXp = save.projectProgress[project.id] ?? 0;

            const progress = Math.min(
              100,
              Math.round((totalXp / targetXp) * 100)
            );

            const levelDefeated =
              save.completedProjectLevels[project.id]?.includes(
                currentLevel
              ) ?? false;

            const waitingNextLevel =
              save.completedProjectIds.includes(project.id);

            const remainingXp = Math.max(targetXp - totalXp, 0);

            const linkedMissionCount = save.dailyMissions.filter(
              (mission) => mission.projectId === project.id
            ).length;

            return (
              <article
                key={project.id}
                className={`rounded-xl border p-5 ${
                  levelDefeated
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl">
                      {project.icon}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-widest text-yellow-400">
                      {levelDefeated
                        ? "Niveau vaincu"
                        : "Projet actif"}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {project.title}
                    </h2>

                    <p className="mt-1 text-sm font-bold text-zinc-300">
                      Niveau {currentLevel}
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-yellow-400">
                    {progress}%
                  </p>
                </div>

                <p className="mt-4 text-sm text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold">
                      Progression du niveau
                    </span>

                    <span className="text-yellow-400">
                      {totalXp} / {targetXp} XP
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-zinc-500">
                    {levelDefeated
                      ? waitingNextLevel
                        ? "Niveau vaincu. Passage au niveau suivant demain."
                        : "Niveau vaincu."
                      : `${remainingXp} XP restants avant victoire`}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border border-zinc-800 p-3">
                    <p className="text-zinc-500">
                      Missions liées
                    </p>

                    <p className="mt-1 font-bold">
                      {linkedMissionCount}
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800 p-3">
                    <p className="text-zinc-500">
                      Récompense
                    </p>

                    <p className="mt-1 font-bold text-yellow-400">
                      +{project.rewardGlory} Glory
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800 p-3">
                    <p className="text-zinc-500">
                      Vaincus
                    </p>

                    <p className="mt-1 font-bold">
                      {save.completedProjectLevels[project.id]?.length ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-zinc-800 p-3">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Objectif
                  </p>

                  <p className="mt-2 text-sm text-zinc-300">
                    {project.objective}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}