"use client";

import { useState } from "react";

export default function Home() {
  const missions = [
    "Faire le Rituel de l'Aube",
    "Boire un grand verre d'eau",
    "Faire la séance prévue aujourd'hui",
  ];

  const [missionIndex, setMissionIndex] = useState(0);
  const [xp, setXp] = useState(0);
  const [glory, setGlory] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [message, setMessage] = useState("Le Royaume attend ton premier pas.");

  const mission = missions[missionIndex];

  function accomplirMission() {
    setXp(xp + 10);
    setGlory(glory + 5);
    setBossHp(Math.max(bossHp - 5, 0));
    setMessage("Bien. Le Royaume a senti ton action. Le Chaos recule.");

    if (missionIndex < missions.length - 1) {
      setMissionIndex(missionIndex + 1);
    } else {
      setMessage("Toutes les missions du matin sont accomplies.");
    }
  }

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
          <p className="mt-2">PV : {bossHp} / 100</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🎯 Mission</h2>
          <p className="mb-6">{mission}</p>

          <button
            onClick={accomplirMission}
            className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl"
          >
            Accomplir la Mission
          </button>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🧙 Compagnon</h2>
          <p>{message}</p>
        </section>

        <footer className="flex gap-6 text-xl font-bold">
          <p>XP : {xp}</p>
          <p>Glory : {glory}</p>
        </footer>
      </div>
    </main>
  );
}