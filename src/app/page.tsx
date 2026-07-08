"use client";

import { useEffect, useState } from "react";

const SAVE_KEY = "ras-save-v1";

const missions = [
  "Faire le Rituel de l'Aube",
  "Boire un grand verre d'eau",
  "Faire la séance prévue aujourd'hui",
];

type Save = {
  missionIndex: number;
  xp: number;
  glory: number;
  bossHp: number;
};

const defaultSave: Save = {
  missionIndex: 0,
  xp: 0,
  glory: 0,
  bossHp: 100,
};

export default function Home() {
  const [save, setSave] = useState<Save>(defaultSave);
  const [message, setMessage] = useState("Le Royaume attend ton premier pas.");

  useEffect(() => {
    const stored = localStorage.getItem(SAVE_KEY);

    if (stored) {
      setSave(JSON.parse(stored));
    }
  }, []);

  function updateSave(nextSave: Save) {
    setSave(nextSave);
    localStorage.setItem(SAVE_KEY, JSON.stringify(nextSave));
  }

  function accomplirMission() {
    const nextSave: Save = {
      missionIndex: Math.min(save.missionIndex + 1, missions.length),
      xp: save.xp + 10,
      glory: save.glory + 5,
      bossHp: Math.max(save.bossHp - 5, 0),
    };

    updateSave(nextSave);
    setMessage("Bien. Le Royaume a senti ton action. Le Chaos recule.");
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    setSave(defaultSave);
    setMessage("Le Royaume attend ton premier pas.");
  }

  const currentMission = missions[save.missionIndex];

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold">RAS</h1>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🏰 Où j'en suis ?</h2>
          <p>Le Royaume s'éveille...</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">⚔ Boss actuel</h2>
          <p>Le Chaos Quotidien</p>
          <p className="mt-2">PV : {save.bossHp} / 100</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🎯 Mission</h2>

          <p className="mb-6">
            {currentMission ?? "Toutes les missions sont accomplies."}
          </p>

          <div className="flex gap-4">
            <button
              onClick={accomplirMission}
              disabled={!currentMission}
              className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl disabled:opacity-50"
            >
              Accomplir
            </button>

            <button
              onClick={resetGame}
              className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🧙 Compagnon</h2>
          <p>{message}</p>
        </section>

        <footer className="flex gap-6 text-xl font-bold">
          <p>XP : {save.xp}</p>
          <p>Glory : {save.glory}</p>
        </footer>
      </div>
    </main>
  );
}