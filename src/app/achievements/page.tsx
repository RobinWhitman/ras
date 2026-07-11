"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";
import {
  getAchievements,
  type AchievementCategory,
} from "@/lib/achievements";

const categories: AchievementCategory[] = [
  "Missions",
  "Discipline",
  "Héros",
  "Royaume",
  "Boss",
  "Légende",
];

export default function AchievementsPage() {
  const {
    save,
    pillarScores,
  } = useGame();

  const achievements = getAchievements(
    save,
    pillarScores
  );

  const unlockedAchievements =
    achievements.filter(
      (achievement) => achievement.unlocked
    );

  const completionPercent = Math.round(
    (
      unlockedAchievements.length /
      achievements.length
    ) * 100
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
              🏆 Hall des Succès
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-xl border border-yellow-900 bg-yellow-500/5 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Progression du Hall
              </p>

              <p className="mt-1 text-3xl font-bold">
                {unlockedAchievements.length}
                {" / "}
                {achievements.length}
              </p>
            </div>

            <p className="text-4xl font-bold text-yellow-400">
              {completionPercent}%
            </p>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{
                width: `${completionPercent}%`,
              }}
            />
          </div>
        </section>

        {categories.map((category) => {
          const categoryAchievements =
            achievements.filter(
              (achievement) =>
                achievement.category === category
            );

          if (
            categoryAchievements.length === 0
          ) {
            return null;
          }

          const categoryUnlocked =
            categoryAchievements.filter(
              (achievement) =>
                achievement.unlocked
            ).length;

          return (
            <section
              key={category}
              className="rounded-xl border border-zinc-800 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {category}
                </h2>

                <p className="text-sm text-zinc-400">
                  {categoryUnlocked}
                  {" / "}
                  {categoryAchievements.length}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categoryAchievements.map(
                  (achievement) => {
                    const progressPercent =
                      achievement.target === 0
                        ? 0
                        : Math.min(
                            100,
                            Math.round(
                              (
                                achievement.progress /
                                achievement.target
                              ) * 100
                            )
                          );

                    return (
                      <article
                        key={achievement.id}
                        className={`rounded-xl border p-5 ${
                          achievement.unlocked
                            ? "border-yellow-700 bg-yellow-500/10"
                            : "border-zinc-800 bg-zinc-950/40"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border text-3xl ${
                              achievement.unlocked
                                ? "border-yellow-700"
                                : "border-zinc-800 grayscale"
                            }`}
                          >
                            {achievement.unlocked
                              ? achievement.icon
                              : "🔒"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs uppercase tracking-widest text-zinc-500">
                              {achievement.unlocked
                                ? "Débloqué"
                                : "Verrouillé"}
                            </p>

                            <h3
                              className={`mt-1 text-lg font-bold ${
                                achievement.unlocked
                                  ? "text-yellow-400"
                                  : "text-zinc-300"
                              }`}
                            >
                              {achievement.title}
                            </h3>

                            <p className="mt-2 text-sm text-zinc-400">
                              {achievement.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="text-zinc-500">
                              Progression
                            </span>

                            <span>
                              {achievement.progress}
                              {" / "}
                              {achievement.target}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className={`h-full ${
                                achievement.unlocked
                                  ? "bg-yellow-500"
                                  : "bg-zinc-600"
                              }`}
                              style={{
                                width: `${progressPercent}%`,
                              }}
                            />
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}