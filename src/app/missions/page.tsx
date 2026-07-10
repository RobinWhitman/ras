"use client";

import Link from "next/link";
import { rituals } from "@/data/game";
import MissionManager from "@/components/dashboard/MissionManager";
import { useGame } from "@/hooks/useGame";

export default function MissionsPage() {
  const {
    save,
    currentMission,
    ritualStarted,
    accomplirMission,
    addDailyMission,
    removeDailyMission,
    restoreDefaultMissions,
  } = useGame();

  const completedCount = save.completedMissionIds.length;
  const totalCount = save.dailyMissions.length;

  const progress =
    totalCount === 0
      ? 0
      : Math.round((completedCount / totalCount) * 100);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-xl border border-zinc-800 p-5">
          <div>
            <p className="text-sm uppercase tracking-widest text-yellow-400">
              RAS
            </p>

            <h1 className="text-3xl font-bold">
              🎯 Missions du jour
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-lg bg-yellow-500 px-5 py-3 font-bold text-black"
          >
            ← Retour au Dashboard
          </Link>
        </header>

        <section className="rounded-xl border border-zinc-800 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-bold">
              Progression de la journée
            </p>

            <p className="text-yellow-400">
              {completedCount} / {totalCount}
            </p>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          {rituals.map((ritual) => {
            const ritualMissions = save.dailyMissions.filter(
              (mission) => mission.ritualId === ritual.id
            );

            const ritualCompleted = ritualMissions.filter(
              (mission) =>
                save.completedMissionIds.includes(mission.id)
            ).length;

            return (
              <section
                key={ritual.id}
                className="rounded-xl border border-zinc-800 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {ritual.time === "Aube" && "🌅 "}
                    {ritual.time === "Jour" && "☀️ "}
                    {ritual.time === "Crépuscule" && "🌙 "}
                    {ritual.title}
                  </h2>

                  <span className="text-sm text-zinc-400">
                    {ritualCompleted}/{ritualMissions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {ritualMissions.map((mission) => {
                    const completed =
                      save.completedMissionIds.includes(mission.id);

                    const recommended =
                      currentMission?.id === mission.id;

                    return (
                      <article
                        key={mission.id}
                        className={`rounded-xl border p-4 ${
                          completed
                            ? "border-green-900 bg-green-950/20"
                            : recommended
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-zinc-800"
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold">
                              {completed && "✅ "}
                              {mission.title}
                            </h3>

                            <p className="mt-1 text-xs text-zinc-400">
                              {mission.pillar} · +{mission.xp} XP ·
                              +{mission.glory} Glory · -{mission.damage} PV
                            </p>
                          </div>

                          {recommended && !completed && (
                            <span className="rounded-full border border-yellow-500 px-2 py-1 text-[10px] font-bold text-yellow-400">
                              RECOMMANDÉE
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={completed}
                          onClick={() =>
                            accomplirMission(mission.id)
                          }
                          className={`w-full rounded-lg px-4 py-2 font-bold ${
                            completed
                              ? "cursor-default bg-zinc-800 text-zinc-500"
                              : "bg-yellow-500 text-black"
                          }`}
                        >
                          {completed
                            ? "Mission accomplie"
                            : "Accomplir"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="rounded-xl border border-zinc-800 p-5">
          <h2 className="mb-2 text-2xl font-bold">
            ⚙️ Configurer les Missions
          </h2>

          <p className="mb-5 text-zinc-400">
            Modifie ici les missions de l’Aube, du Jour et du Crépuscule.
          </p>

          <MissionManager
            missions={save.dailyMissions}
            ritualStarted={ritualStarted}
            onAddMission={addDailyMission}
            onRemoveMission={removeDailyMission}
            onRestoreDefaults={restoreDefaultMissions}
          />
        </section>
      </div>
    </main>
  );
}