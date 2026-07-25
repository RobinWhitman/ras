"use client";

import {
  bosses,
  chapters,
  kingdom,
  projects,
  rituals,
} from "@/data/game";
import { getBossTargetHp, useGame } from "@/hooks/useGame";
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
  const baseBoss = bosses[0];
  const bossLevel = save.bossLevels[baseBoss.id] ?? 1;
  const activeBoss = {
    ...baseBoss,
    maxHp: getBossTargetHp(baseBoss.maxHp, bossLevel),
  };

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

  const bossDefeated = save.defeatedBossIds.includes(baseBoss.id);
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
          <div className="col-span-3 row-span-2 min-h-0">
            <HeroPanel
              heroLevel={heroLevel}
              currentLevelXp={currentLevelXp}
            />
          </div>

          <div className="col-span-6 min-h-0">
            <MorningPanel
              kingdomState={kingdom.state}
              dayState={dayState}
              chapterTitle={activeChapter.title}
              bossName={`${activeBoss.name} Niv. ${bossLevel}`}
              currentMission={currentMission}
              onAccomplish={() => accomplirMission()}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <KingdomPanel pillarScores={pillarScores} />
          </div>

          <div className="col-span-3 min-h-0">
            <PillarsPanel pillarScores={pillarScores} />
          </div>

          <div className="col-span-3 min-h-0">
            <BossPanel
              boss={activeBoss}
              bossHp={save.bossHp}
              bossLevel={bossLevel}
              bossDefeated={bossDefeated}
            />
          </div>

          <div className="col-span-3 row-span-2 min-h-0">
            <JournalPanel
              completedMissions={save.completedMissions}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <Card title="🐈‍⬛ LOKI">
              <div className="flex h-full flex-col">
                <p className="flex-1">{message}</p>

                <a
                  href="/companion"
                  className="mt-3 rounded-lg border border-green-900 px-3 py-2 text-center text-xs font-bold text-green-400 transition hover:border-green-500"
                >
                  Consulter LOKI →
                </a>
              </div>
            </Card>
          </div>

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