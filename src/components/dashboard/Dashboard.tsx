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
import TopBar from "./TopBar";
import HeroPanel from "./HeroPanel";
import MorningPanel from "./MorningPanel";
import BossPanel from "./BossPanel";
import KingdomPanel from "./KingdomPanel";
import PillarsPanel from "./PillarsPanel";
import JournalPanel from "./JournalPanel";

export default function Dashboard() {
  const {
    save,
    currentMission,
    message,
    pillarScores,
    accomplirMission,
  } = useGame();

  const activeChapter = chapters[0];
  const activeBoss = bosses[0];

  const activeProject = currentMission
    ? projects.find(
        (project) => project.id === currentMission.projectId
      )
    : projects[0];

  const activeRitual = currentMission
    ? rituals.find(
        (ritual) => ritual.id === currentMission.ritualId
      )
    : rituals[0];

  const bossDefeated = save.bossHp <= 0;
  const heroLevel = Math.floor(save.xp / 50) + 1;
  const currentLevelXp = save.xp % 50;

  const unlockedBuildings = pillarScores.filter(
    (item) => item.score > 0
  );

  let dayState = "🌙 Repos";

  if (save.dailyGlory >= 5) {
    dayState = "🛡 Solide";
  }

  if (save.dailyGlory >= 15) {
    dayState = "⭐ Héroïque";
  }

  if (save.dailyGlory >= 28) {
    dayState = "🌟 Légendaire";
  }

  return (
    <main className="h-dvh overflow-hidden bg-black p-3 text-sm text-white">
      <div className="mx-auto grid h-full max-w-[1800px] grid-rows-[64px_minmax(0,1fr)] gap-3">
        <TopBar
          heroLevel={heroLevel}
          xp={save.xp}
          glory={save.glory}
          currentStreak={save.currentStreak}
          bestStreak={save.bestStreak}
        />

        <div className="grid min-h-0 grid-cols-12 grid-rows-[200px_220px_minmax(0,1fr)] gap-3">
          {/* Colonne gauche : Héros */}
          <div className="col-span-3 row-span-2 min-h-0">
            <HeroPanel
              heroLevel={heroLevel}
              currentLevelXp={currentLevelXp}
            />
          </div>

          {/* Centre haut : action principale */}
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

          {/* Droite haut : Boss */}
          <div className="col-span-3 min-h-0">
            <BossPanel
              boss={activeBoss}
              bossHp={save.bossHp}
              bossDefeated={bossDefeated}
            />
          </div>

          {/* Centre milieu gauche : Piliers */}
          <div className="col-span-3 min-h-0">
            <PillarsPanel pillarScores={pillarScores} />
          </div>

          {/* Centre milieu droit : Royaume */}
          <div className="col-span-3 min-h-0">
            <KingdomPanel
    pillarScores={pillarScores}
            />
          </div>

          {/* Droite : Journal sur deux rangées */}
          <div className="col-span-3 row-span-2 min-h-0">
            <JournalPanel
              completedMissions={save.completedMissions}
            />
          </div>

          {/* Bas gauche : Compagnon */}
          <div className="col-span-3 min-h-0">
            <Card title="🧙 Compagnon">
              <div className="h-full overflow-y-auto">
                <p>{message}</p>
              </div>
            </Card>
          </div>

          {/* Bas centre : Chapitre */}
          <div className="col-span-6 min-h-0">
            <Card title="⚔ Chapitre actif">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-zinc-500">
                    Chapitre
                  </p>

                  <p className="font-bold">
                    {activeChapter.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Projet
                  </p>

                  <p className="font-bold">
                    {activeProject?.title}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Rituel
                  </p>

                  <p className="font-bold">
                    {activeRitual?.title}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-zinc-400">
                {activeChapter.description}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}