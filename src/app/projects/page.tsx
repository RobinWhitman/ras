"use client";

import Link from "next/link";
import { projectDetails } from "@/data/projects";
import { useGame } from "@/hooks/useGame";

export default function ProjectsPage() {
  const { save } = useGame();

  function getProjectXp(projectId: string) {
    const archivedXp = save.dayHistory.reduce(
      (daysTotal, day) =>
        daysTotal +
        day.completedMissions
          .filter((mission) => mission.projectId === projectId)
          .reduce(
            (missionsTotal, mission) => missionsTotal + mission.xp,
            0
          ),
      0
    );

    const todayXp = save.completedMissions
      .filter((mission) => mission.projectId === projectId)
      .reduce((total, mission) => total + mission.xp, 0);

    return {
      archivedXp,
      todayXp,
      totalXp: archivedXp + todayXp,
    };
  }

  const totalInvestedXp = projectDetails.reduce(
    (total, project) => total + getProjectXp(project.id).totalXp,
    0
  );

  const completedProjects = projectDetails.filter((project) => {
    const { totalXp } = getProjectXp(project.id);
    return totalXp >= project.targetXp;
  });

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
              Projets terminés
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {completedProjects.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              XP investis
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalInvestedXp}
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {projectDetails.map((project) => {
            const { archivedXp, todayXp, totalXp } = getProjectXp(project.id);

            const progress = Math.min(
              100,
              Math.round((totalXp / project.targetXp) * 100)
            );

            const completed = totalXp >= project.targetXp;

            const remainingXp = Math.max(
              project.targetXp - totalXp,
              0
            );

            return (
              <article
                key={project.id}
                className={`rounded-xl border p-5 ${
                  completed
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
                      {completed ? "Projet terminé" : "Projet actif"}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {project.title}
                    </h2>
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
                      Progression
                    </span>

                    <span className="text-yellow-400">
                      {totalXp} / {project.targetXp} XP
                    </span>
                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-zinc-500">
                    {completed
                      ? `Objectif atteint · +${project.rewardGlory} Glory prévue`
                      : `${remainingXp} XP restants`}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-zinc-800 p-3">
                    <p className="text-zinc-500">
                      Aujourd’hui
                    </p>

                    <p className="mt-1 font-bold">
                      {todayXp} XP
                    </p>
                  </div>

                  <div className="rounded-lg border border-zinc-800 p-3">
                    <p className="text-zinc-500">
                      Archives
                    </p>

                    <p className="mt-1 font-bold">
                      {archivedXp} XP
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