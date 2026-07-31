"use client";

import Link from "next/link";
import { bosses, chapters } from "@/data/game";
import { projectDetails } from "@/data/projects";
import {
  getBossTargetHp,
  getProjectTargetXp,
  useGame,
} from "@/hooks/useGame";
import {
  getBossHpPercent,
  getBossPhase,
} from "@/lib/bosses";

export default function ChapterPage() {
  const { save } = useGame();

  const chapter = chapters[0];
  const baseBoss = bosses[0];

  const bossLevel = save.bossLevels[baseBoss.id] ?? 1;
  const bossMaxHp = getBossTargetHp(baseBoss.maxHp, bossLevel);
  const boss = {
    ...baseBoss,
    maxHp: bossMaxHp,
  };

  const bossHpPercent = getBossHpPercent(save.bossHp, boss.maxHp);
  const bossProgress = 100 - bossHpPercent;
  const bossPhase = getBossPhase(boss, save.bossHp);
  const bossLevelDefeated =
    save.completedBossLevels[baseBoss.id]?.includes(bossLevel) ?? false;

  const projectStates = projectDetails.map((project) => {
    const level = save.projectLevels[project.id] ?? 1;
    const targetXp = getProjectTargetXp(project.targetXp, level);
    const currentXp = save.projectProgress[project.id] ?? 0;
    const progress = Math.min(
      100,
      Math.round((currentXp / targetXp) * 100)
    );

    const levelDefeated =
      save.completedProjectLevels[project.id]?.includes(level) ?? false;

    const defeatedCount =
      save.completedProjectLevels[project.id]?.length ?? 0;

    const linkedMissionCount = save.dailyMissions.filter(
      (mission) => mission.projectId === project.id
    ).length;

    return {
      project,
      level,
      targetXp,
      currentXp,
      progress,
      levelDefeated,
      defeatedCount,
      linkedMissionCount,
    };
  });

  const averageProjectProgress =
    projectStates.length === 0
      ? 0
      : Math.round(
          projectStates.reduce(
            (total, item) => total + item.progress,
            0
          ) / projectStates.length
        );

  const chapterProgress = Math.round(
    averageProjectProgress * 0.65 + bossProgress * 0.35
  );

  const defeatedProjectLevels = projectStates.reduce(
    (total, item) => total + item.defeatedCount,
    0
  );

  const defeatedBossLevels =
    save.completedBossLevels[baseBoss.id]?.length ?? 0;

  const totalMissionCount =
    save.completedMissions.length +
    save.dayHistory.reduce(
      (total, day) => total + day.completedMissions.length,
      0
    );

  const chapterState =
    bossLevelDefeated && projectStates.every((item) => item.levelDefeated)
      ? "Chapitre dominé"
      : "Chapitre en cours";

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col items-stretch gap-4 rounded-lg border border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              📕 Chapitre actif
            </h1>
          </div>

          <Link
            href="/"
            className="min-h-11 rounded-lg bg-yellow-500 px-5 py-3 text-center font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-xl border border-zinc-800 p-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest text-yellow-400">
                {chapterState}
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {chapter.title}
              </h2>

              <p className="mt-4 text-zinc-400">
                {chapter.description}
              </p>
            </div>

            <div className="min-w-64 rounded-xl border border-zinc-800 p-5">
              <p className="text-sm text-zinc-500">
                Progression globale
              </p>

              <p className="mt-2 text-4xl font-bold text-yellow-400">
                {chapterProgress}%
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                Calcul
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                Projets 65% · Boss 35%
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between">
              <span className="font-bold">
                Progression du Chapitre
              </span>

              <span className="text-yellow-400">
                {chapterProgress}%
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${chapterProgress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <section className="rounded-xl border border-zinc-800 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Projets du Chapitre
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Progression des fronts
                  </h2>
                </div>

                <p className="text-2xl font-bold text-yellow-400">
                  {averageProjectProgress}%
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                {projectStates.map((item) => (
                  <article
                    key={item.project.id}
                    className={`rounded-xl border p-4 ${
                      item.levelDefeated
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-3xl">
                          {item.project.icon}
                        </p>

                        <h3 className="mt-2 font-bold">
                          {item.project.title}
                        </h3>

                        <p className="mt-1 text-xs font-bold text-yellow-400">
                          Niveau {item.level}
                        </p>
                      </div>

                      <p className="text-xl font-bold text-yellow-400">
                        {item.progress}%
                      </p>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full bg-yellow-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-zinc-400">
                      <span>
                        {item.currentXp}/{item.targetXp} XP
                      </span>

                      <span>
                        {item.levelDefeated
                          ? "Niveau vaincu"
                          : `${Math.max(
                              item.targetXp - item.currentXp,
                              0
                            )} XP restants`}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg border border-zinc-800 p-2">
                        <p className="text-zinc-500">
                          Missions
                        </p>

                        <p className="mt-1 font-bold">
                          {item.linkedMissionCount}
                        </p>
                      </div>

                      <div className="rounded-lg border border-zinc-800 p-2">
                        <p className="text-zinc-500">
                          Vaincus
                        </p>

                        <p className="mt-1 font-bold">
                          {item.defeatedCount}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link
                href="/projects"
                className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center font-bold transition hover:border-yellow-500 hover:text-yellow-400"
              >
                Ouvrir les Projets →
              </Link>
            </section>
          </div>

          <aside className="space-y-5">
            <article
              className={`rounded-xl border p-5 ${
                bossLevelDefeated
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-red-900 bg-red-950/10"
              }`}
            >
              <p className="text-sm uppercase tracking-widest text-red-400">
                Boss du Chapitre
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                👹 {boss.name}
              </h2>

              <p className="mt-1 text-sm font-bold text-yellow-400">
                Niveau {bossLevel} · {bossPhase.name}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-bold">
                    PV
                  </span>

                  <span className="text-red-400">
                    {save.bossHp}/{boss.maxHp}
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${bossHpPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border border-zinc-800 p-3">
                  <p className="text-zinc-500">
                    Progression
                  </p>

                  <p className="mt-1 font-bold">
                    {bossProgress}%
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-800 p-3">
                  <p className="text-zinc-500">
                    Niveaux vaincus
                  </p>

                  <p className="mt-1 font-bold">
                    {defeatedBossLevels}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-400">
                Faiblesse :{" "}
                <span className="font-bold text-yellow-400">
                  {boss.weakness}
                </span>
              </p>

              {bossLevelDefeated && (
                <p className="mt-3 rounded-lg border border-yellow-500 bg-yellow-500/10 p-3 text-sm font-bold text-yellow-400">
                  Niveau vaincu. Passage au niveau {bossLevel + 1} demain.
                </p>
              )}

              <Link
                href="/boss"
                className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center font-bold transition hover:border-red-500 hover:text-red-400"
              >
                Ouvrir le Boss →
              </Link>
            </article>

            <section className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Missions accomplies
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalMissionCount}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Journées archivées
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {save.dayHistory.length}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Niv. Projets vaincus
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-400">
                  {defeatedProjectLevels}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Meilleure série
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {save.bestStreak}
                </p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
