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
import TopBar from "./TopBar";
import HeroPanel from "./HeroPanel";
import MorningPanel from "./MorningPanel";
import BossPanel from "./BossPanel";
import KingdomPanel from "./KingdomPanel";
import PillarsPanel from "./PillarsPanel";
import JournalPanel from "./JournalPanel";
import DebugPanel from "./DebugPanel";

export default function Dashboard() {
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
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <TopBar heroLevel={heroLevel} xp={save.xp} glory={save.glory} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1">
            <HeroPanel
              heroLevel={heroLevel}
              currentLevelXp={currentLevelXp}
            />
          </div>

          <div className="xl:col-span-3">
            <MorningPanel
              kingdomState={kingdom.state}
              dayState={dayState}
              chapterTitle={activeChapter.title}
              bossName={activeBoss.name}
              currentMission={currentMission}
              onAccomplish={accomplirMission}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <BossPanel
            boss={activeBoss}
            bossHp={save.bossHp}
            bossDefeated={bossDefeated}
          />

          <KingdomPanel
            kingdomState={kingdom.state}
            unlockedBuildings={unlockedBuildings}
            kingdomBuildings={kingdomBuildings}
          />

          <PillarsPanel pillarScores={pillarScores} />

          <JournalPanel completedMissions={save.completedMissions} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="border border-zinc-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">🧙 Compagnon</h2>
            <p>{message}</p>
          </section>

          <section className="border border-zinc-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-3">⚔ Détails du Chapitre</h2>
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
        </div>

        <DebugPanel onReset={resetGame} />
      </div>
    </main>
  );
}