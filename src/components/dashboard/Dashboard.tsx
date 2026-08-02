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
import EvolvingAvatar from "@/components/EvolvingAvatar";

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
  const baseBoss =
    bosses.find((boss) => boss.id === save.activeBossId) ?? bosses[0];
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
    <main className="min-h-dvh overflow-x-hidden bg-black p-2 text-sm text-white sm:p-3 lg:h-dvh lg:overflow-hidden">
      <VictoryToast
        message={toastMessage}
        visible={toastVisible}
      />

      <div className="mx-auto flex min-h-full max-w-[1800px] flex-col gap-2 lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[64px_minmax(0,1fr)] lg:gap-3">
        <TopBar
          heroLevel={heroLevel}
          xp={save.xp}
          glory={save.glory}
          currentStreak={save.currentStreak}
          bestStreak={save.bestStreak}
          currentDate={save.currentDate}
        />

        <div className="grid grid-cols-1 gap-2 lg:min-h-0 lg:grid-cols-12 lg:grid-rows-[200px_220px_minmax(0,1fr)] lg:gap-3">
          <div className="order-2 min-h-[390px] lg:order-none lg:col-span-3 lg:row-span-2 lg:min-h-0">
            <HeroPanel
              heroLevel={heroLevel}
              currentLevelXp={currentLevelXp}
            />
          </div>

          <div className="order-1 min-h-[240px] lg:order-none lg:col-span-6 lg:min-h-0">
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

          <div className="order-3 min-h-[230px] lg:order-none lg:col-span-3 lg:min-h-0">
            <KingdomPanel
              pillarScores={pillarScores}
            />
          </div>

          <div className="order-4 min-h-[350px] lg:order-none lg:col-span-3 lg:min-h-0">
            <PillarsPanel
              pillarScores={pillarScores}
            />
          </div>

          <div className="order-5 min-h-[240px] lg:order-none lg:col-span-3 lg:min-h-0">
            <BossPanel
              boss={activeBoss}
              bossHp={save.bossHp}
              bossLevel={bossLevel}
              bossDefeated={bossDefeated}
            />
          </div>

          <div className="order-8 min-h-[300px] lg:order-none lg:col-span-3 lg:row-span-2 lg:min-h-0">
            <JournalPanel
              completedMissions={
                save.completedMissions
              }
            />
          </div>

          <div className="order-6 min-h-[190px] lg:order-none lg:col-span-3 lg:min-h-0">
            <Card title="LOKI">
              <div className="flex h-full items-center gap-3">
                <EvolvingAvatar kind="loki" level={heroLevel} className="h-20 w-20 shrink-0 rounded" />

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

          <div className="order-7 min-h-[250px] lg:order-none lg:col-span-6 lg:min-h-0">
            <Card title="Chapitre actif">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
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
