"use client";

import Link from "next/link";
import DebugPanel from "@/components/dashboard/DebugPanel";
import SaveManager from "@/components/settings/SaveManager";
import { useGame } from "@/hooks/useGame";

export default function SettingsPage() {
  const {
    save,
    resetGame,
    simulateNewDay,
  } = useGame();

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              ⚙️ Paramètres
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-2 text-2xl font-bold">
            💾 Sauvegarde
          </h2>

          <p className="mb-5 text-zinc-400">
            Exporte régulièrement ta progression afin de pouvoir la
            restaurer sur un autre navigateur ou après un problème.
          </p>

          <SaveManager />
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-3 text-2xl font-bold">
            📊 Progression actuelle
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-zinc-800 p-4">
              <p className="text-zinc-500">XP</p>

              <p className="text-xl font-bold">
                {save.xp}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 p-4">
              <p className="text-zinc-500">Glory</p>

              <p className="text-xl font-bold">
                {save.glory}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 p-4">
              <p className="text-zinc-500">Série</p>

              <p className="text-xl font-bold">
                {save.currentStreak}
              </p>
            </div>

            <div className="rounded-lg border border-zinc-800 p-4">
              <p className="text-zinc-500">
                Journées archivées
              </p>

              <p className="text-xl font-bold">
                {save.dayHistory.length}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-2 text-2xl font-bold">
            🧪 Outils de développement
          </h2>

          <p className="mb-5 text-zinc-400">
            Ces commandes servent uniquement à tester RAS pendant son
            développement.
          </p>

          <DebugPanel
            onReset={resetGame}
            onSimulateNewDay={simulateNewDay}
          />
        </section>

        <section className="rounded-xl border border-red-950 p-5">
          <h2 className="mb-2 text-2xl font-bold text-red-400">
            ⚠️ Zone dangereuse
          </h2>

          <p className="text-sm text-zinc-400">
            Le Reset total supprime toute la progression présente dans
            ce navigateur. Exporte une sauvegarde avant de l’utiliser.
          </p>
        </section>
      </div>
    </main>
  );
}