"use client";

import {
  bosses,
  chapters,
  kingdom,
  kingdomBuildings,
  projects,
  rituals,
} from "@/data/game";
import { useGame } from "@/hooks/useGame";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import DebugActions from "@/components/DebugActions";

export default function MorningCouncil() {
  const {
    save,
    currentMission,
    message,
    pillarScores,
    accomplirMission,
    resetGame,
  } = useGame();

  const activeChapter = chapters[0];
  const activeBoss = bosses[0];

  const activeProject = currentMission
    ? projects.find((project) => project.id === currentMission.projectId)
    : projects[0];

  const activeRitual = currentMission
    ? rituals.find((ritual) => ritual.id === currentMission.ritualId)
    : rituals[0];

  const bossDefeated = save.bossHp <= 0;
  const heroLevel = Math.floor(save.xp / 50) + 1;
  const currentLevelXp = save.xp % 50;
  const unlockedBuildings = pillarScores.filter((item) => item.score > 0);
  const morningCompleted = !currentMission;

  let dayState = "🌙 Repos";
  if (save.glory >= 5) dayState = "🛡 Solide";
  if (save.glory >= 15) dayState = "⭐ Héroïque";
  if (save.glory >= 28) dayState = "🌟 Légendaire";

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-5xl font-bold">RAS</h1>

          <div className="text-right">
            <p className="text-xl font-bold">Robin — Niveau {heroLevel}</p>
            <p className="text-zinc-400">
              XP {save.xp} · Glory {save.glory}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 border border-yellow-500 rounded-xl p-6 bg-yellow-500/10">
            <p className="text-sm uppercase tracking-widest text-yellow-400 mb-4">
              Conseil du Matin
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <h2 className="text-xl font-bold">🏰 Où j’en suis ?</h2>
                <p className="text-zinc-300">
                  {kingdom.state}
                </p>
                <p className="text-yellow-400 mt-2">{dayState}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  ⚔ Pourquoi ça compte ?
                </h2>
                <p className="text-zinc-300">{activeChapter.title}</p>
                <p className="text-zinc-400">{activeBoss.name}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  🎯 Prochaine action
                </h2>
                <p className="text-zinc-300">
                  {currentMission
                    ? currentMission.title
                    : "Rituel de l’Aube accompli."}
                </p>
              </div>
            </div>

            {currentMission ? (
              <button
                onClick={accomplirMission}
                className="w-full bg-yellow-500 text-black font-bold px-6 py-4 rounded-xl"
              >
                ✅ Accomplir la Mission
              </button>
            ) : (
              <div className="border border-yellow-500 rounded-xl p-4">
                <p className="text-yellow-400 font-bold">
                  🌅 Rituel de l’Aube accompli
                </p>
                <p className="text-zinc-300">La journée peut commencer.</p>
              </div>
            )}
          </section>

          <Card title="🧍 Héros">
            <p className="text-lg font-semibold">Robin — Niveau {heroLevel}</p>
            <ProgressBar value={currentLevelXp} max={50} color="yellow" />
            <p className="mt-3 text-zinc-400">
              {currentLevelXp} / 50 XP vers le prochain niveau
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card title="👹 Boss actuel">
            <p className="text-lg font-semibold">{activeBoss.name}</p>
            <ProgressBar value={save.bossHp} max={activeBoss.maxHp} color="red" />

            <p className="mt-3">
              {save.bossHp} / {activeBoss.maxHp} PV
            </p>

            {bossDefeated && (
              <div className="mt-4 border border-yellow-500 rounded-xl p-4">
                <p className="text-yellow-400 font-bold">
                  🏆 Boss vaincu : {activeBoss.name}
                </p>
              </div>
            )}
          </Card>

          <Card title="🎯 Mission">
            {currentMission ? (
              <>
                <h3 className="text-xl font-semibold mb-3">
                  {currentMission.title}
                </h3>

                <div className="space-y-1 text-zinc-400">
                  <p>Pilier : {currentMission.pillar}</p>
                  <p>XP : +{currentMission.xp}</p>
                  <p>Glory : +{currentMission.glory}</p>
                  <p>Dégâts Boss : -{currentMission.damage} PV</p>
                </div>
              </>
            ) : (
              <p className="text-zinc-400">
                Aucune mission restante. Le Rituel de l’Aube est terminé.
              </p>
            )}
          </Card>

          <Card title="🧙 Compagnon">
            <p>{message}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card title="🏛 Piliers">
            <div className="space-y-3">
              {pillarScores.map((item) => (
                <div key={item.pillar}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.pillar}</span>
                    <span>{item.score}</span>
                  </div>
                  <ProgressBar value={Math.min(item.score * 5, 100)} max={100} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="🏰 Royaume">
            <p>{kingdom.state}</p>

            <div className="mt-4">
              {unlockedBuildings.length === 0 ? (
                <p className="text-zinc-400">
                  Aucun bâtiment actif.
                </p>
              ) : (
                <ul className="space-y-2">
                  {unlockedBuildings.map((item) => (
                    <li key={item.pillar} className="border border-zinc-800 rounded-lg p-3">
                      <p className="font-semibold">
                        {kingdomBuildings[item.pillar]}
                      </p>
                      <p className="text-zinc-400">
                        Pilier {item.pillar}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card title="📖 Journal">
            {save.completedMissions.length === 0 ? (
              <p className="text-zinc-400">
                Aucune mission accomplie aujourd'hui.
              </p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {save.completedMissions.map((mission) => (
                  <li key={mission.id} className="border border-zinc-800 rounded-lg p-3">
                    <p className="font-semibold">{mission.title}</p>
                    <p className="text-zinc-400">
                      {mission.pillar} · +{mission.xp} XP · +{mission.glory} Glory
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="⚔ Détails du Chapitre">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p>
              Chapitre : <strong>{activeChapter.title}</strong>
            </p>
            <p>
              Projet : <strong>{activeProject?.title}</strong>
            </p>
            <p>
              Rituel : <strong>{activeRitual?.title}</strong>
            </p>
          </div>
        </Card>

        <DebugActions onReset={resetGame} />
      </div>
    </main>
  );
}