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
import Card from "@/components/Card";

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
    <main className="h-screen overflow-hidden bg-black text-white p-3 text-sm">
      <div className="h-full mx-auto max-w-[1800px] grid grid-rows-[64px_1fr] gap-3">
        <TopBar heroLevel={heroLevel} xp={save.xp} glory={save.glory} />

        <div className="grid grid-cols-12 grid-rows-[220px_240px_1fr] gap-3 min-h-0">
          <div className="col-span-3 row-span-2 min-h-0">
            <HeroPanel heroLevel={heroLevel} currentLevelXp={currentLevelXp} />
          </div>

          <div className="col-span-6 min-h-0">
            <MorningPanel
              kingdomState={kingdom.state}
              dayState={dayState}
              chapterTitle={activeChapter.title}
              bossName={activeBoss.name}
              currentMission={currentMission}
              onAccomplish={accomplirMission}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <BossPanel
              boss={activeBoss}
              bossHp={save.bossHp}
              bossDefeated={bossDefeated}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <PillarsPanel pillarScores={pillarScores} />
          </div>

          <div className="col-span-3 min-h-0">
            <KingdomPanel
              kingdomState={kingdom.state}
              unlockedBuildings={unlockedBuildings}
              kingdomBuildings={kingdomBuildings}
            />
          </div>

          <div className="col-span-3 row-span-2 min-h-0">
            <JournalPanel completedMissions={save.completedMissions} />
          </div>

          <div className="col-span-3 min-h-0">
            <Card title="🧙 Compagnon">
              <p>{message}</p>
            </Card>
          </div>

          <div className="col-span-6 min-h-0">
            <Card title="⚔ Chapitre">
              <div className="grid grid-cols-3 gap-3">
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
          </div>

          <div className="col-span-3 min-h-0">
            <DebugPanel onReset={resetGame} />
          </div>
        </div>
      </div>
    </main>
  );
}