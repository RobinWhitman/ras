"use client";

import { bosses, chapters, kingdom, projects, rituals } from "@/data/game";
import { useGame } from "@/hooks/useGame";

export default function MorningCouncil() {
  const { save, currentMission, message, accomplirMission, resetGame } =
    useGame();

  const activeChapter = chapters[0];
  const activeBoss = bosses[0];
  const activeProject = currentMission
    ? projects.find((project) => project.id === currentMission.projectId)
    : projects[0];
  const activeRitual = currentMission
    ? rituals.find((ritual) => ritual.id === currentMission.ritualId)
    : rituals[0];

  const bossLifePercent = Math.round((save.bossHp / activeBoss.maxHp) * 100);
  const heroLevel = Math.floor(save.xp / 50) + 1;
  const currentLevelXp = save.xp % 50;
  const levelProgress = Math.round((currentLevelXp / 50) * 100);

  let dayState = "🌙 Repos";
  if (save.glory >= 5) dayState = "🛡 Solide";
  if (save.glory >= 15) dayState = "⭐ Héroïque";
  if (save.glory >= 28) dayState = "🌟 Légendaire";

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold">RAS</h1>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">📜 Journée</h2>
          <p className="text-xl font-semibold">{dayState}</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🧍 Héros</h2>
          <p className="text-lg font-semibold">Robin — Niveau {heroLevel}</p>

          <div className="w-full h-4 bg-zinc-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            />
          </div>

          <p className="mt-3">
            {currentLevelXp} / 50 XP vers le prochain niveau
          </p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🏰 Où j'en suis ?</h2>
          <p>{kingdom.state}</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">
            ⚔ Pourquoi cette journée compte ?
          </h2>

          <p>
            Chapitre : <strong>{activeChapter.title}</strong>
          </p>

          <p>
            Projet : <strong>{activeProject?.title}</strong>
          </p>

          <p>
            Rituel : <strong>{activeRitual?.title}</strong>
          </p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">👹 Boss actuel</h2>
          <p className="text-lg font-semibold">{activeBoss.name}</p>

          <div className="w-full h-4 bg-zinc-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${bossLifePercent}%` }}
            />
          </div>

          <p className="mt-3">
            {save.bossHp} / {activeBoss.maxHp} PV
          </p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🎯 Mission</h2>

          {currentMission ? (
            <>
              <h3 className="text-xl font-semibold mb-3">
                {currentMission.title}
              </h3>

              <div className="space-y-1 text-zinc-400 mb-6">
                <p>Pilier : {currentMission.pillar}</p>
                <p>XP : +{currentMission.xp}</p>
                <p>Glory : +{currentMission.glory}</p>
                <p>Dégâts Boss : -{currentMission.damage} PV</p>
              </div>

              <button
                onClick={accomplirMission}
                className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl"
              >
                Accomplir la Mission
              </button>
            </>
          ) : (
            <p className="mb-6">Toutes les missions sont accomplies.</p>
          )}

          <button
            onClick={resetGame}
            className="ml-4 bg-red-600 text-white font-bold px-6 py-3 rounded-xl"
          >
            Reset
          </button>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">🧙 Compagnon</h2>
          <p>{message}</p>
        </section>

        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-3">📖 Journal</h2>

          {save.completedMissions.length === 0 ? (
            <p className="text-zinc-400">Aucune mission accomplie aujourd'hui.</p>
          ) : (
            <ul className="space-y-3">
              {save.completedMissions.map((mission) => (
                <li
                  key={mission.id}
                  className="border border-zinc-800 rounded-lg p-4"
                >
                  <p className="font-semibold">{mission.title}</p>
                  <p className="text-zinc-400">
                    {mission.pillar} · +{mission.xp} XP · +{mission.glory} Glory
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="flex gap-6 text-xl font-bold">
          <p>XP total : {save.xp}</p>
          <p>Glory : {save.glory}</p>
        </footer>
      </div>
    </main>
  );
}