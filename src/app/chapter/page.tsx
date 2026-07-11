"use client";

import Link from "next/link";
import { bosses, chapters, projects } from "@/data/game";
import { projectDetails } from "@/data/projects";
import { useGame } from "@/hooks/useGame";
import { getBossHpPercent, getBossPhase } from "@/lib/bosses";

export default function ChapterPage() {
  const { save } = useGame();

  const chapter = chapters[0];
  const boss = bosses[0];
  const project = projects[0];
  const projectDetail = projectDetails.find(
    (item) => item.id === project.id
  );

  const archivedXp = save.dayHistory.reduce(
    (total, day) => total + day.xpGained,
    0
  );

  const todayXp = save.completedMissions.reduce(
    (total, mission) => total + mission.xp,
    0
  );

  const chapterXp = archivedXp + todayXp;
  const targetXp = projectDetail?.targetXp ?? 1000;

  const projectProgress = Math.min(
    100,
    Math.round((chapterXp / targetXp) * 100)
  );

  const bossProgress = 100 - getBossHpPercent(
    save.bossHp,
    boss.maxHp
  );

  const chapterProgress = Math.round(
    (projectProgress + bossProgress) / 2
  );

  const bossPhase = getBossPhase(boss, save.bossHp);
  const bossDefeated = save.defeatedBossIds.includes(boss.id);
  const projectCompleted = chapterXp >= targetXp;
  const chapterCompleted = bossDefeated && projectCompleted;

  const archivedMissionCount = save.dayHistory.reduce(
    (total, day) => total + day.completedMissions.length,
    0
  );

  const totalMissionCount =
    archivedMissionCount + save.completedMissions.length;

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              📕 Chapitre actif
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
            chapterCompleted
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-zinc-800"
          }`}
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-widest text-yellow-400">
                {chapterCompleted
                  ? "Chapitre accompli"
                  : "Chapitre en cours"}
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
                Progression générale
              </p>

              <p className="mt-2 text-4xl font-bold text-yellow-400">
                {chapterProgress}%
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                État
              </p>

              <p className="mt-1 text-xl font-bold">
                {chapterCompleted
                  ? "🏆 Accompli"
                  : "⚔️ En cours"}
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

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-xl border border-zinc-800 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-zinc-500">
                  Projet principal
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  ⚒️ {project.title}
                </h2>
              </div>

              <p className="text-2xl font-bold text-yellow-400">
                {projectProgress}%
              </p>
            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${projectProgress}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-zinc-400">
              <span>
                {chapterXp}/{targetXp} XP
              </span>

              <span>
                {projectCompleted
                  ? "Projet terminé"
                  : `${Math.max(targetXp - chapterXp, 0)} XP restants`}
              </span>
            </div>

            <Link
              href="/projects"
              className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center font-bold transition hover:border-yellow-500 hover:text-yellow-400"
            >
              Ouvrir le Projet →
            </Link>
          </article>

          <article className="rounded-xl border border-zinc-800 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-zinc-500">
                  Boss du Chapitre
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  👹 {boss.name}
                </h2>

                <p className="mt-1 text-sm text-red-400">
                  {bossPhase.name}
                </p>
              </div>

              <p className="text-2xl font-bold text-red-400">
                {save.bossHp} PV
              </p>
            </div>

            <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-red-600"
                style={{
                  width: `${getBossHpPercent(
                    save.bossHp,
                    boss.maxHp
                  )}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-sm text-zinc-400">
              <span>
                Faiblesse : {boss.weakness}
              </span>

              <span>
                {bossDefeated
                  ? "Boss vaincu"
                  : `${boss.rewardGlory} Glory à gagner`}
              </span>
            </div>

            <Link
              href="/boss"
              className="mt-5 block rounded-lg border border-zinc-700 px-4 py-2 text-center font-bold transition hover:border-red-500 hover:text-red-400"
            >
              Ouvrir le Boss →
            </Link>
          </article>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
              XP investi
            </p>

            <p className="mt-2 text-3xl font-bold">
              {chapterXp}
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

        {chapterCompleted && (
          <section className="rounded-xl border border-yellow-500 bg-yellow-500/10 p-6">
            <p className="text-3xl font-bold text-yellow-400">
              🏆 Chapitre accompli
            </p>

            <p className="mt-3 text-zinc-300">
              Le Projet est terminé et le Boss a été vaincu.
              Ce chapitre peut désormais rejoindre la Légende.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}