"use client";

import { useEffect, useRef, useState } from "react";
import {
  bosses,
  chapters,
  companion,
  kingdom,
  projects,
  rituals,
} from "@/data/game";
import { getAchievements } from "@/lib/achievements";
import { getBossTargetHp, useGame } from "@/hooks/useGame";
import Card from "@/components/Card";
import TopBar from "./TopBar";
import HeroPanel from "./HeroPanel";
import MorningPanel from "./MorningPanel";
import BossPanel from "./BossPanel";
import KingdomPanel from "./KingdomPanel";
import PillarsPanel from "./PillarsPanel";
import JournalPanel from "./JournalPanel";
import VictoryToast from "./VictoryToast";

export default function Dashboard() {
  const {
    save,
    activeMissions,
    currentMission,
    message,
    pillarScores,
    hasPlannedMissionsToday,
    accomplirMission,
  } = useGame();

  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const activeChapter = chapters[0];
  const baseBoss = bosses[0];
  const bossLevel = save.bossLevels[baseBoss.id] ?? 1;
  const heroLevel = Math.floor(save.xp / 50) + 1;
  const currentLevelXp = save.xp % 50;

  const unlockedAchievementSignature = getAchievements(
    save,
    pillarScores
  )
    .filter((achievement) => achievement.unlocked)
    .map(
      (achievement) =>
        `${achievement.id}::${achievement.title}`
    )
    .sort()
    .join("|");

  const previousHeroLevel = useRef(heroLevel);

  const previousAchievementIds = useRef<string[]>(
    unlockedAchievementSignature
      ? unlockedAchievementSignature
          .split("|")
          .map((entry) => entry.split("::")[0])
      : []
  );

  const progressTrackingReady = useRef(false);

  const progressEventKey = [
    save.xp,
    save.glory,
    save.bossHp,
    save.completedMissionIds.length,
    save.skippedMissionIds.length,
  ].join(":");

  useEffect(() => {
    const showTimeout = window.setTimeout(() => {
      const currentAchievements =
        unlockedAchievementSignature
          ? unlockedAchievementSignature
              .split("|")
              .map((entry) => {
                const [id, ...titleParts] =
                  entry.split("::");

                return {
                  id,
                  title: titleParts.join("::"),
                };
              })
          : [];

      const currentAchievementIds =
        currentAchievements.map(
          (achievement) => achievement.id
        );

      const notifications: string[] = [];

      if (
        progressTrackingReady.current &&
        message !== companion.start &&
        heroLevel > previousHeroLevel.current
      ) {
        notifications.push(
          `Niveau ${heroLevel} atteint`
        );
      }

      if (
        progressTrackingReady.current &&
        message !== companion.start
      ) {
        currentAchievements
          .filter(
            (achievement) =>
              !previousAchievementIds.current.includes(
                achievement.id
              )
          )
          .forEach((achievement) => {
            notifications.push(
              `Succès débloqué : ${achievement.title}`
            );
          });
      }

      progressTrackingReady.current = true;
      previousHeroLevel.current = heroLevel;
      previousAchievementIds.current =
        currentAchievementIds;

      if (!message) return;

      setToastMessage(
        notifications.length > 0
          ? `${message} · ${notifications.join(" · ")}`
          : message
      );

      setToastVisible(true);
    }, 80);

    const hideTimeout = window.setTimeout(() => {
      setToastVisible(false);
    }, 3600);

    return () => {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
    };
  }, [
    heroLevel,
    message,
    progressEventKey,
    unlockedAchievementSignature,
  ]);

  const dashboardMission =
    currentMission ??
    activeMissions.find(
      (mission) =>
        !save.completedMissionIds.includes(
          mission.id
        ) &&
        !save.skippedMissionIds.includes(
          mission.id
        )
    );

  const activeBoss = {
    ...baseBoss,
    maxHp: getBossTargetHp(
      baseBoss.maxHp,
      bossLevel
    ),
  };

  const activeProject = dashboardMission
    ? projects.find(
        (project) =>
          project.id ===
          dashboardMission.projectId
      )
    : projects[0];

  const activeRitual = dashboardMission
    ? rituals.find(
        (ritual) =>
          ritual.id ===
          dashboardMission.ritualId
      )
    : rituals[0];

  const bossDefeated =
    save.defeatedBossIds.includes(
      baseBoss.id
    );

  let dayState = "Repos";

  if (save.dailyGlory >= 5) {
    dayState = "Solide";
  }

  if (save.dailyGlory >= 15) {
    dayState = "Héroïque";
  }

  if (save.dailyGlory >= 28) {
    dayState = "Légendaire";
  }

  return (
    <main className="h-dvh overflow-hidden bg-black p-3 text-sm text-white">
      <VictoryToast
        message={toastMessage}
        visible={toastVisible}
      />

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
              currentMission={dashboardMission}
              hasPlannedMissionsToday={
                hasPlannedMissionsToday
              }
              onAccomplish={() => {
                if (dashboardMission) {
                  accomplirMission(
                    dashboardMission.id
                  );
                }
              }}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <KingdomPanel
              pillarScores={pillarScores}
            />
          </div>

          <div className="col-span-3 min-h-0">
            <PillarsPanel
              pillarScores={pillarScores}
            />
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
              completedMissions={
                save.completedMissions
              }
            />
          </div>

          <div className="col-span-3 min-h-0">
            <Card title="LOKI">
              <div className="flex h-full items-center gap-3">
                <img
                  src="/assets/companion/loki-pixel.png"
                  alt="LOKI"
                  className="h-20 w-20 shrink-0 rounded border border-green-900 object-cover"
                />

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="line-clamp-3 flex-1 text-xs text-zinc-300">
                    {message}
                  </p>

                  <a
                    href="/companion"
                    className="mt-2 rounded border border-green-900 px-3 py-1.5 text-center text-xs font-bold text-green-400 hover:border-green-500"
                  >
                    Consulter LOKI
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-6 min-h-0">
            <Card title="Chapitre actif">
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
                    {activeProject?.title ??
                      "Aucun projet"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-zinc-500">
                    Rituel
                  </p>

                  <p className="font-bold">
                    {activeRitual?.title ??
                      "Aucun rituel"}
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