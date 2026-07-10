"use client";

import Link from "next/link";
import { useGame } from "@/hooks/useGame";
import {
  buildingNames,
  getBuildingProgress,
} from "@/lib/buildings";
import { BUILDING_BONUSES } from "@/lib/buildingBonuses";
import type { Pillar } from "@/types/game";

const buildingIcons: Record<Pillar, string> = {
  Force: "⚔️",
  Savoir: "📚",
  Discipline: "🛡️",
  Santé: "🌿",
  Leadership: "👑",
  Foi: "✨",
  Relations: "🤝",
};

const buildingDescriptions: Record<Pillar, string> = {
  Force:
    "L’Arène représente ta puissance physique, ton entraînement et ta capacité à affronter les épreuves.",
  Savoir:
    "La Bibliothèque conserve les connaissances acquises et développe la sagesse du Royaume.",
  Discipline:
    "La Tour protège tes habitudes, ton organisation et ta régularité.",
  Santé:
    "L’Infirmerie reflète ta nutrition, ton sommeil, ton hygiène et ta récupération.",
  Leadership:
    "Le Palais représente tes projets, ton activité professionnelle et tes responsabilités.",
  Foi:
    "Le Sanctuaire grandit grâce à la prière, la gratitude et la fidélité à tes valeurs.",
  Relations:
    "La Place représente les liens entretenus avec ta famille, tes amis et tes alliés.",
};

export default function KingdomPage() {
  const { pillarScores } = useGame();

  const totalLevels = pillarScores.reduce((total, item) => {
    return total + getBuildingProgress(item.score).level;
  }, 0);

  const totalScore = pillarScores.reduce(
    (total, item) => total + item.score,
    0
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
              🏰 Royaume
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Bâtiments
            </p>
            <p className="text-2xl font-bold">
              {pillarScores.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Niveaux cumulés
            </p>
            <p className="text-2xl font-bold">
              {totalLevels}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Progression totale
            </p>
            <p className="text-2xl font-bold">
              {totalScore}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <p className="text-sm text-zinc-500">
              Royaume
            </p>
            <p className="text-2xl font-bold">
              Niveau {Math.floor(totalLevels / 7)}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillarScores.map((item) => {
            const progress = getBuildingProgress(item.score);

            const bonusIndex = Math.min(
              progress.level - 1,
              BUILDING_BONUSES[item.pillar].length - 1
            );

            const currentBonus =
              BUILDING_BONUSES[item.pillar][bonusIndex];

            const nextBonus =
              BUILDING_BONUSES[item.pillar][bonusIndex + 1];

            return (
              <article
                key={item.pillar}
                className="rounded-xl border border-zinc-800 p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-3xl">
                      {buildingIcons[item.pillar]}
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {buildingNames[item.pillar]}
                    </h2>

                    <p className="text-sm text-yellow-400">
                      {currentBonus.title}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      Niveau {progress.level}
                    </p>

                    <p className="text-sm text-zinc-500">
                      Pilier {item.pillar}
                    </p>
                  </div>
                </div>

                <p className="min-h-16 text-sm text-zinc-400">
                  {buildingDescriptions[item.pillar]}
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progression</span>

                    <span className="text-yellow-400">
                      {progress.current}/{progress.next}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-zinc-800 p-3">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Effet actuel
                  </p>

                  <p className="mt-1 font-bold text-yellow-400">
                    {currentBonus.description}
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-zinc-800 p-3">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Prochain niveau
                  </p>

                  <p className="mt-1 font-bold">
                    {nextBonus
                      ? `${nextBonus.title} — ${nextBonus.description}`
                      : "Évolution maximale atteinte"}
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