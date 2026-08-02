"use client";

import Link from "next/link";
import { bosses } from "@/data/game";
import { getBossTargetHp, useGame } from "@/hooks/useGame";
import { getBossHpPercent } from "@/lib/bosses";

export default function BossPage() {
  const { save } = useGame();
  const boss =
    bosses.find((item) => item.id === save.activeBossId) ?? bosses[0];
  const level = save.bossLevels[boss.id] ?? 1;
  const maxHp = getBossTargetHp(boss.maxHp, level);
  const progress = getBossHpPercent(save.bossHp, maxHp);
  const defeated = save.defeatedBossIds.includes(boss.id);

  return (
    <main className="min-h-screen bg-black p-3 text-white sm:p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-red-400">Combat réel</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Les 7 Boss</h1>
          </div>
          <Link href="/" className="min-h-11 rounded bg-yellow-500 px-5 py-3 text-center font-bold text-black">
            Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-lg border border-red-900 bg-red-950/10 p-5 sm:p-7">
          <p className="text-6xl">{boss.icon}</p>
          <p className="mt-4 text-sm font-bold uppercase text-red-400">
            Boss actuel · Niveau {level}{boss.domain ? ` · ${boss.domain}` : ""}
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{boss.name}</h2>
          <p className="mt-3 text-zinc-400">
            Les Missions et les actions de Projet infligent des dégâts. Une fois vaincu, le Boss suivant prend sa place le lendemain.
          </p>

          <div className="mt-7">
            <div className="mb-2 flex justify-between font-bold">
              <span>Points de vie</span>
              <span>{save.bossHp}/{maxHp} PV</span>
            </div>
            <div className="h-5 overflow-hidden rounded bg-zinc-800">
              <div className="h-full bg-red-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded border border-yellow-900 p-4">
            <span className="text-zinc-400">Récompense de victoire</span>
            <strong className="text-yellow-400">+{boss.rewardGlory} Glory</strong>
          </div>

          {defeated && (
            <p className="mt-5 rounded border border-yellow-500 bg-yellow-500/10 p-4 font-bold text-yellow-300">
              Boss vaincu. Le suivant apparaîtra demain.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">Ordre des Boss</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {bosses.map((item, index) => {
              const active = item.id === boss.id;
              const victories = save.completedBossLevels[item.id]?.length ?? 0;
              return (
                <article key={item.id} className={`flex items-center gap-4 rounded border p-4 ${active ? "border-yellow-500 bg-yellow-500/10" : "border-zinc-800"}`}>
                  <span className="text-3xl">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-zinc-500">{index + 1}/7</p>
                    <p className="font-bold">{item.name}{item.domain ? ` · ${item.domain}` : ""}</p>
                  </div>
                  <span className="text-sm text-zinc-400">{victories} victoire(s)</span>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
