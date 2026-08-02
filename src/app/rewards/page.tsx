"use client";

import Link from "next/link";
import { gloryRewards } from "@/data/rewards";
import { useGame } from "@/hooks/useGame";

export default function RewardsPage() {
  const { save, message, acheterRecompense } = useGame();

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-yellow-400">Coffre du Royaume</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">🧰 Récompenses</h1>
          </div>
          <div className="flex items-center gap-3">
            <strong className="rounded border border-yellow-700 px-4 py-3 text-yellow-300">{save.glory} Glory</strong>
            <Link href="/" className="min-h-11 rounded bg-yellow-500 px-4 py-3 text-center font-bold text-black">Dashboard</Link>
          </div>
        </header>

        {message && <p className="rounded border border-zinc-800 p-4 text-zinc-300">{message}</p>}

        <section className="grid gap-3 sm:grid-cols-2">
          {gloryRewards.map((reward) => (
            <article key={reward.id} className="rounded-lg border border-zinc-800 p-5">
              <p className="text-4xl">{reward.icon}</p>
              <h2 className="mt-3 text-xl font-bold">{reward.title}</h2>
              <p className="mt-2 font-bold text-yellow-400">{reward.cost} Glory</p>
              <button
                type="button"
                disabled={save.glory < reward.cost}
                onClick={() => acheterRecompense(reward.id, reward.title, reward.cost)}
                className="mt-4 min-h-11 w-full rounded bg-yellow-500 font-bold text-black disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {save.glory < reward.cost ? "Glory insuffisante" : "Débloquer"}
              </button>
            </article>
          ))}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">Historique</h2>
          <div className="space-y-2">
            {save.rewardHistory.length === 0 ? (
              <p className="rounded border border-zinc-800 p-4 text-zinc-500">Aucune récompense débloquée.</p>
            ) : save.rewardHistory.slice(0, 20).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between rounded border border-zinc-800 p-3">
                <span>{purchase.title}</span>
                <span className="text-yellow-400">-{purchase.cost} Glory</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
