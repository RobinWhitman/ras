"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";
import EvolvingAvatar, { getAvatarStage } from "@/components/EvolvingAvatar";
import {
  buildingNames,
  getBuildingProgress,
} from "@/lib/buildings";
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

function getHeroTitle(level: number) {
  return getAvatarStage(level).rank;
}

export default function HeroPage() {
  const { save, pillarScores } = useGame();

  const heroLevel = Math.floor(save.xp / 50) + 1;
  const currentLevelXp = save.xp % 50;
  const xpProgress = Math.round(
    (currentLevelXp / 50) * 100
  );

  const heroTitle = getHeroTitle(heroLevel);

  const strongestPillar = [...pillarScores].sort(
    (a, b) => b.score - a.score
  )[0];

  const totalPillarScore = pillarScores.reduce(
    (total, item) => total + item.score,
    0
  );

  const totalBuildingLevels = pillarScores.reduce(
    (total, item) =>
      total + getBuildingProgress(item.score).level,
    0
  );

  const totalCompletedMissions =
    save.completedMissions.length +
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
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              ⚔ Héros
            </h1>
          </div>

          <Link
            href="/"
            className="min-h-11 rounded-lg bg-yellow-500 px-5 py-3 text-center font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <article className="overflow-hidden rounded-xl border border-yellow-900/60 bg-zinc-950">
            <div className="relative flex aspect-[3/4] items-end justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.14),transparent_62%)]">
              <EvolvingAvatar kind="hero" level={heroLevel} className="h-full w-full" />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5">
                <h2 className="text-3xl font-bold">
                  Robin
                </h2>

                <p className="mt-1 font-bold text-yellow-400">
                  {heroTitle}
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Niveau {heroLevel}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-zinc-800 p-6">
            <div className="flex flex-col justify-between gap-5 md:flex-row">
              <div>
                <p className="text-sm uppercase tracking-widest text-yellow-400">
                  Progression du Héros
                </p>

                <h2 className="mt-2 text-4xl font-bold">
                  Niveau {heroLevel}
                </h2>

                <p className="mt-3 text-zinc-400">
                  Chaque action réelle renforce le Héros,
                  développe le Royaume et écrit la Légende.
                </p>
              </div>

              <div className="min-w-56 rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Pilier dominant
                </p>

                <p className="mt-1 text-xl font-bold text-yellow-400">
                  {pillarIcons[strongestPillar.pillar]}{" "}
                  {strongestPillar.pillar}
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {strongestPillar.score} points
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex justify-between">
                <span className="font-bold">
                  XP vers le prochain niveau
                </span>

                <span className="text-yellow-400">
                  {currentLevelXp} / 50 XP
                </span>
              </div>

              <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  XP total
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {save.xp}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Glory
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {save.glory}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Série actuelle
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {save.currentStreak}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">
                  Record
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {save.bestStreak}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-4 text-2xl font-bold">
            🏛 Les 7 Piliers
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillarScores.map((item) => {
              const building = getBuildingProgress(
                item.score
              );

              const progress = Math.min(
                item.score * 5,
                100
              );

              return (
                <article
                  key={item.pillar}
                  className="rounded-xl border border-zinc-800 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl">
                        {pillarIcons[item.pillar]}
                      </p>

                      <h3 className="mt-1 font-bold">
                        {item.pillar}
                      </h3>
                    </div>

                    <p className="text-2xl font-bold text-yellow-400">
                      {item.score}
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      {buildingNames[item.pillar]}
                    </span>

                    <span>
                      Niveau {building.level}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Missions accomplies
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalCompletedMissions}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Puissance des Piliers
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalPillarScore}
            </p>
          </article>

          <article className="rounded-xl border border-zinc-800 p-5">
            <p className="text-sm text-zinc-500">
              Niveaux du Royaume
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalBuildingLevels}
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="text-2xl font-bold">
            📜 Légende actuelle
          </h2>

          <p className="mt-3 text-zinc-400">
            Robin est un {heroTitle.toLowerCase()} de
            niveau {heroLevel}. Son Pilier dominant est{" "}
            {strongestPillar.pillar}, son Royaume compte{" "}
            {totalBuildingLevels} niveaux cumulés et sa
            meilleure série atteint {save.bestStreak} jour(s).
          </p>
        </section>
      </div>
    </main>
  );
}
