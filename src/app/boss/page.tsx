"use client";

import Link from "next/link";
import { bosses } from "@/data/game";
import { useGame } from "@/hooks/useGame";
import {
  getBossHpPercent,
  getBossPhase,
} from "@/lib/bosses";

export default function BossPage() {
  const { save } = useGame();
  const boss = bosses[0];

  const hpPercent = getBossHpPercent(
    save.bossHp,
    boss.maxHp
  );

  const currentPhase = getBossPhase(
    boss,
    save.bossHp
  );

  const defeated =
    save.defeatedBossIds.includes(boss.id);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-red-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              👹 Boss actuel
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-xl border border-red-900 bg-red-950/10 p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div>
              <p className="text-sm uppercase tracking-widest text-red-400">
                {currentPhase.name}
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {boss.name}
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400">
                {boss.description}
              </p>
            </div>

            <div className="min-w-56 rounded-xl border border-zinc-800 p-4">
              <p className="text-sm text-zinc-500">
                Faiblesse
              </p>

              <p className="text-xl font-bold text-yellow-400">
                {boss.weakness}
              </p>

              <p className="mt-4 text-sm text-zinc-500">
                Capacité
              </p>

              <p className="text-xl font-bold">
                {boss.ability}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex justify-between">
              <span className="font-bold">
                Points de vie
              </span>

              <span>
                {save.bossHp}/{boss.maxHp} PV
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{
                  width: `${hpPercent}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Phase actuelle
            </p>

            <p className="mt-1 text-xl font-bold">
              {currentPhase.name}
            </p>

            <p className="mt-2 text-zinc-400">
              {currentPhase.description}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-yellow-900 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Récompense
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-400">
              +{boss.rewardGlory} Glory
            </p>

            <p className="mt-2 text-zinc-400">
              Cette récompense n’est accordée qu’une fois.
            </p>
          </div>

          {defeated && (
            <div className="mt-6 rounded-xl border border-yellow-500 bg-yellow-500/10 p-5">
              <p className="text-2xl font-bold text-yellow-400">
                🏆 Boss vaincu
              </p>

              <p className="mt-2 text-zinc-300">
                Le Chaos Quotidien a été repoussé et sa récompense a rejoint ta Légende.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-4 text-2xl font-bold">
            Phases du combat
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
            {boss.phases.map((phase) => {
              const active =
                phase.name === currentPhase.name;

              return (
                <article
                  key={phase.name}
                  className={`rounded-xl border p-4 ${
                    active
                      ? "border-red-500 bg-red-950/20"
                      : "border-zinc-800"
                  }`}
                >
                  <p className="font-bold">
                    {phase.name}
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    {phase.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}