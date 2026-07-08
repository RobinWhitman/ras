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

  let dayState = "🌙 Repos";
  if (save.glory >= 5) dayState = "🛡 Solide";
  if (save.glory >= 15) dayState = "⭐ Héroïque";
  if (save.glory >= 28) dayState = "🌟 Légendaire";

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold">RAS</h1>

        <Card title="📜 Journée">
          <p className="text-xl font-semibold">{dayState}</p>
        </Card>

        <Card title="🧍 Héros">
          <p className="text-lg font-semibold">Robin — Niveau {heroLevel}</p>
          <ProgressBar value={currentLevelXp} max={50} color="yellow" />
          <p className="mt-3">
            {currentLevelXp} / 50 XP vers le prochain niveau
          </p>
        </Card>

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

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Bâtiments débloqués</h3>

            {unlockedBuildings.length === 0 ? (
              <p className="text-zinc-400">
                Aucun bâtiment actif. Le Royaume attend ta première action.
              </p>
            ) : (
              <ul className="space-y-2">
                {unlockedBuildings.map((item) => (
                  <li
                    key={item.pillar}
                    className="border border-zinc-800 rounded-lg p-3"
                  >
                    <p className="font-semibold">
                      {kingdomBuildings[item.pillar]}
                    </p>
                    <p className="text-zinc-400">
                      Débloqué par le Pilier {item.pillar}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card title="⚔ Pourquoi cette journée compte ?">
          <p>
            Chapitre : <strong>{activeChapter.title}</strong>
          </p>
          <p>
            Projet : <strong>{activeProject?.title}</strong>
          </p>
          <p>
            Rituel : <strong>{activeRitual?.title}</strong>
          </p>
        </Card>

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
              <p className="text-zinc-300 mt-1">
                Le Chaos Quotidien a été repoussé. Le Royaume gagne en stabilité.
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
        </Card>

        <Card title="🧙 Compagnon">
          <p>{message}</p>
        </Card>

        <Card title="📖 Journal">
          {save.completedMissions.length === 0 ? (
            <p className="text-zinc-400">
              Aucune mission accomplie aujourd'hui.
            </p>
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
        </Card>

        <footer className="flex gap-6 text-xl font-bold">
          <p>XP total : {save.xp}</p>
          <p>Glory : {save.glory}</p>
        </footer>

        <DebugActions onReset={resetGame} />
      </div>
    </main>
  );
}