"use client";

import {
  bosses,
  chapters,
  kingdom,
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
          {/* HÉROS — gauche, deux premières rangées */}
          <div className="col-span-3 row-span-2 min-h-0">
            <HeroPanel
              heroLevel={heroLevel}
              currentLevelXp={currentLevelXp}
            />
          </div>

          {/* CONSEIL — centre haut */}
          <div className="col-span-6 min-h-0">
            <MorningPanel
              kingdomState={kingdom.state}
              dayState={dayState}
              chapterTitle={activeChapter.title}
              bossName={activeBoss.name}
              currentMission={currentMission}
              onAccomplish={() => accomplirMission()}
            />
          </div>

          {/* ROYAUME — bloc orange, uniquement en haut à droite */}
          <div className="col-span-3 min-h-0">
            <KingdomPanel pillarScores={pillarScores} />
          </div>

          {/* PILIERS — centre milieu gauche */}
          <div className="col-span-3 min-h-0">
            <PillarsPanel pillarScores={pillarScores} />
          </div>

          {/* BOSS — centre milieu droit */}
          <div className="col-span-3 min-h-0">
            <BossPanel
              boss={activeBoss}
              bossHp={save.bossHp}
              bossDefeated={bossDefeated}
            />
          </div>

          {/* JOURNAL — bloc rouge, deux rangées à droite */}
          <div className="col-span-3 row-span-2 min-h-0">
            <JournalPanel
              completedMissions={save.completedMissions}
            />
          </div>

          {/* COMPAGNON — bas gauche */}
          <div className="col-span-3 min-h-0">
            <Card title="🧙 Compagnon">
  <div className="flex h-full flex-col">
    <p className="flex-1">{message}</p>

    <a
      href="/companion"
      className="mt-3 rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-bold transition hover:border-yellow-500 hover:text-yellow-400"
    >
      Ouvrir le Compagnon →
    </a>
  </div>
</Card>
          </div>

          {/* CHAPITRE — bas centre */}
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