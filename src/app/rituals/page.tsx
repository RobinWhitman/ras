"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import {
  primalLoopSteps,
  routineMilestones,
} from "@/data/routines";
import {
  formatRoutineCadence,
  getRoutineTargetCount,
} from "@/lib/routines";
import { getRoutineReward } from "@/lib/routineRewards";
import { useRoutines } from "@/hooks/useRoutines";
import type {
  PhysicalAssessment,
  RoutineDefinition,
  RoutineSection,
} from "@/types/routines";

const sectionOrder: RoutineSection[] = [
  "Aube",
  "Jour",
  "Crépuscule",
  "Hebdomadaire",
  "Périodique",
];

const sectionIcons: Record<RoutineSection, string> = {
  Aube: "🌅",
  Jour: "☀️",
  Crépuscule: "🌙",
  Hebdomadaire: "📅",
  Périodique: "🧭",
};

type PhotoField = "frontPhoto" | "sidePhoto" | "backPhoto";

type AssessmentForm = {
  date: string;
  weight: string;
  waist: string;
  chest: string;
  arm: string;
  thigh: string;
  frontPhoto: string;
  sidePhoto: string;
  backPhoto: string;
};

function formatDisplayDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR");
}

function compressPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      const maximumSide = 520;
      const scale = Math.min(
        1,
        maximumSide / Math.max(image.width, image.height)
      );
      const canvas = document.createElement("canvas");

      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas indisponible"));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.62));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image illisible"));
    };

    image.src = objectUrl;
  });
}

function PhysicalAssessmentForm({
  today,
  onSave,
}: {
  today: string;
  onSave: (assessment: PhysicalAssessment) => void;
}) {
  const [form, setForm] = useState<AssessmentForm>({
    date: today,
    weight: "",
    waist: "",
    chest: "",
    arm: "",
    thigh: "",
    frontPhoto: "",
    sidePhoto: "",
    backPhoto: "",
  });
  const [message, setMessage] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState<PhotoField | null>(
    null
  );

  function updateMeasurement(
    field: keyof AssessmentForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function updatePhoto(
    field: PhotoField,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setLoadingPhoto(field);

    try {
      const photo = await compressPhoto(file);

      setForm((current) => ({
        ...current,
        [field]: photo,
      }));
    } catch {
      setMessage("Cette photo ne peut pas être enregistrée.");
    } finally {
      setLoadingPhoto(null);
      event.target.value = "";
    }
  }

  function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const measurements = [
      form.weight,
      form.waist,
      form.chest,
      form.arm,
      form.thigh,
    ].map(Number);

    const invalidMeasurement = measurements.some(
      (measurement) =>
        !Number.isFinite(measurement) || measurement <= 0
    );

    if (
      invalidMeasurement ||
      !form.date ||
      !form.frontPhoto ||
      !form.sidePhoto ||
      !form.backPhoto
    ) {
      setMessage(
        "Renseigne toutes les mesures et les trois photos avant de valider."
      );
      return;
    }

    onSave({
      id: `assessment-${form.date}-${Date.now()}`,
      date: form.date,
      weight: measurements[0],
      waist: measurements[1],
      chest: measurements[2],
      arm: measurements[3],
      thigh: measurements[4],
      frontPhoto: form.frontPhoto,
      sidePhoto: form.sidePhoto,
      backPhoto: form.backPhoto,
    });

    setForm({
      date: today,
      weight: "",
      waist: "",
      chest: "",
      arm: "",
      thigh: "",
      frontPhoto: "",
      sidePhoto: "",
      backPhoto: "",
    });
    setMessage("Bilan physique enregistré.");
  }

  const photoInputs: {
    field: PhotoField;
    label: string;
  }[] = [
    { field: "frontPhoto", label: "Photo de face" },
    { field: "sidePhoto", label: "Photo de profil" },
    { field: "backPhoto", label: "Photo de dos" },
  ];

  return (
    <form
      onSubmit={submitAssessment}
      className="space-y-5 rounded-lg border border-yellow-700 bg-yellow-500/5 p-5"
    >
      <div>
        <h3 className="text-xl font-bold text-yellow-400">
          Nouveau bilan physique
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          Les mesures et les photos restent conservées dans ton
          historique.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 text-sm font-bold text-zinc-300">
          Date
          <input
            type="date"
            value={form.date}
            max={today}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateMeasurement("date", event.target.value)
            }
            required
            className="w-full rounded border border-zinc-700 bg-black px-3 py-2 text-white"
          />
        </label>

        {[
          ["weight", "Poids", "kg"],
          ["waist", "Tour de taille", "cm"],
          ["chest", "Tour de poitrine", "cm"],
          ["arm", "Tour de bras", "cm"],
          ["thigh", "Tour de cuisse", "cm"],
        ].map(([field, label, unit]) => (
          <label
            key={field}
            className="space-y-2 text-sm font-bold text-zinc-300"
          >
            {label} ({unit})
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form[field as keyof AssessmentForm]}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateMeasurement(
                  field as keyof AssessmentForm,
                  event.target.value
                )
              }
              required
              className="w-full rounded border border-zinc-700 bg-black px-3 py-2 text-white"
            />
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {photoInputs.map(({ field, label }) => (
          <label
            key={field}
            className={`cursor-pointer rounded border p-4 text-center text-sm font-bold transition ${
              form[field]
                ? "border-green-700 bg-green-950/20 text-green-400"
                : "border-zinc-700 text-zinc-300 hover:border-yellow-500"
            }`}
          >
            {loadingPhoto === field
              ? "Traitement..."
              : form[field]
                ? `${label} enregistrée`
                : label}
            <input
              type="file"
              accept="image/*"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updatePhoto(field, event)
              }
              className="hidden"
            />
          </label>
        ))}
      </div>

      {message && (
        <p className="text-sm font-bold text-yellow-400">{message}</p>
      )}

      <button
        type="submit"
        disabled={loadingPhoto !== null}
        className="rounded bg-yellow-500 px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        Enregistrer le bilan
      </button>
    </form>
  );
}

function RoutineCard({
  routine,
  count,
  finalized,
  completedToday,
  currentStreak,
  bestStreak,
  onComplete,
}: {
  routine: RoutineDefinition;
  count: number;
  finalized: boolean;
  completedToday: boolean;
  currentStreak: number;
  bestStreak: number;
  onComplete: () => void;
}) {
  const target = getRoutineTargetCount(routine);
  const reward = getRoutineReward(routine);
  const disabled =
    finalized || (completedToday && !routine.allowMultiplePerDay);

  return (
    <article
      className={`rounded-lg border p-4 ${
        finalized
          ? "border-green-900 bg-green-950/20"
          : "border-zinc-800 bg-zinc-950"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white">{routine.title}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {routine.pillar} · {formatRoutineCadence(routine)} · +{reward.xp} XP · +{reward.glory} Glory
          </p>
        </div>

        <span
          className={`shrink-0 rounded border px-2 py-1 text-xs font-bold ${
            finalized
              ? "border-green-800 text-green-400"
              : "border-zinc-700 text-zinc-300"
          }`}
        >
          {Math.min(count, target)}/{target}
        </span>
      </div>

      <p className="mt-3 text-sm text-zinc-400">
        {routine.criteria}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border border-zinc-800 p-2">
          <p className="text-zinc-500">Série actuelle</p>
          <p className="mt-1 font-bold text-yellow-400">
            {currentStreak}
          </p>
        </div>
        <div className="rounded border border-zinc-800 p-2">
          <p className="text-zinc-500">Record</p>
          <p className="mt-1 font-bold text-white">{bestStreak}</p>
        </div>
      </div>

      {routine.inputKind !== "physical-assessment" && (
        <button
          type="button"
          onClick={onComplete}
          disabled={disabled}
          className="mt-4 w-full rounded bg-yellow-500 px-4 py-2 font-bold text-black disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {finalized
            ? "Accompli"
            : completedToday
              ? "Validé pour aujourd’hui"
              : target > 1
                ? `Valider (${Math.min(count, target)}/${target})`
                : "Accomplir"}
        </button>
      )}
    </article>
  );
}

export default function RitualsPage() {
  const {
    today,
    save,
    routines,
    availableRoutines,
    routineStates,
    spiritualProjectUnlocked,
    rewardMessage,
    completeRoutine,
    addPhysicalAssessment,
  } = useRoutines();

  const groupedRoutines = useMemo(
    () =>
      sectionOrder.map((section) => ({
        section,
        routines: availableRoutines.filter(
          (routine) => routine.section === section
        ),
      })),
    [availableRoutines]
  );

  const physicalRoutineState =
    routineStates["periodique-bilan-physique"];
  const physicalAssessmentAvailable =
    availableRoutines.some(
      (routine) => routine.id === "periodique-bilan-physique"
    ) && !physicalRoutineState?.period.finalized;

  return (
    <main className="min-h-screen bg-black p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="border-b border-zinc-800 pb-5">
          <p className="text-sm font-bold uppercase text-yellow-400">
            Rituels et routines
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Discipline du {formatDisplayDate(today)}
          </h1>
          <p className="mt-2 max-w-3xl text-zinc-400">
            Chaque série évolue indépendamment. Une pratique manquée ne
            remet à zéro que sa propre progression.
          </p>
        </header>

        {rewardMessage && (
          <section className="rounded-lg border border-yellow-600 bg-yellow-500/10 p-4 font-bold text-yellow-300">
            {rewardMessage}
          </section>
        )}

        {spiritualProjectUnlocked && (
          <section className="rounded-lg border border-yellow-500 bg-yellow-500/10 p-5 font-bold text-yellow-300">
            Ta marche est devenue constante. Un premier projet
            spirituel peut désormais être envisagé.
          </section>
        )}

        {groupedRoutines.map(({ section, routines: sectionRoutines }) =>
          sectionRoutines.length > 0 ? (
            <section key={section} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h2 className="text-xl font-bold">
                  {sectionIcons[section]} {section}
                </h2>
                <span className="text-sm text-zinc-500">
                  {sectionRoutines.length} pratique(s)
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sectionRoutines.map((routine) => {
                  const state = routineStates[routine.id];
                  const progress = save.progress[routine.id];

                  return (
                    <RoutineCard
                      key={routine.id}
                      routine={routine}
                      count={state?.period.count ?? 0}
                      finalized={state?.period.finalized ?? false}
                      completedToday={
                        state?.period.completionDates.includes(today) ??
                        false
                      }
                      currentStreak={progress?.currentStreak ?? 0}
                      bestStreak={progress?.bestStreak ?? 0}
                      onComplete={() => completeRoutine(routine.id)}
                    />
                  );
                })}
              </div>
            </section>
          ) : null
        )}

        {physicalAssessmentAvailable && (
          <PhysicalAssessmentForm
            today={today}
            onSave={addPhysicalAssessment}
          />
        )}

        <section className="space-y-4 border-t border-zinc-800 pt-6">
          <div>
            <h2 className="text-xl font-bold">
              Historique des bilans physiques
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {save.physicalAssessments.length} bilan(s) conservé(s)
            </p>
          </div>

          {save.physicalAssessments.length === 0 ? (
            <p className="rounded-lg border border-zinc-800 p-4 text-sm text-zinc-500">
              Aucun bilan physique enregistré.
            </p>
          ) : (
            <div className="space-y-3">
              {save.physicalAssessments.map((assessment) => (
                <article
                  key={assessment.id}
                  className="grid gap-4 rounded-lg border border-zinc-800 p-4 lg:grid-cols-[1fr_300px]"
                >
                  <div>
                    <h3 className="font-bold text-yellow-400">
                      {formatDisplayDate(assessment.date)}
                    </h3>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
                      <div>
                        <dt className="text-zinc-500">Poids</dt>
                        <dd className="font-bold">
                          {assessment.weight} kg
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">Taille</dt>
                        <dd className="font-bold">
                          {assessment.waist} cm
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">Poitrine</dt>
                        <dd className="font-bold">
                          {assessment.chest} cm
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">Bras</dt>
                        <dd className="font-bold">
                          {assessment.arm} cm
                        </dd>
                      </div>
                      <div>
                        <dt className="text-zinc-500">Cuisse</dt>
                        <dd className="font-bold">
                          {assessment.thigh} cm
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Face", assessment.frontPhoto],
                      ["Profil", assessment.sidePhoto],
                      ["Dos", assessment.backPhoto],
                    ].map(([label, photo]) => (
                      <a
                        key={label}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded border border-zinc-700"
                        title={`Ouvrir la photo ${label.toLowerCase()}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo}
                          alt={`${label}, bilan du ${formatDisplayDate(
                            assessment.date
                          )}`}
                          className="aspect-[3/4] w-full object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <details className="rounded-lg border border-zinc-800">
          <summary className="cursor-pointer p-5 text-xl font-bold">
            Toutes les séries et leur historique
          </summary>

          <div className="border-t border-zinc-800 p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {routines.map((routine) => {
                const progress = save.progress[routine.id];
                const reachedMilestones = routine.milestonesEnabled
                  ? routineMilestones.filter(
                      (milestone) =>
                        milestone <= (progress?.bestStreak ?? 0)
                    )
                  : [];

                return (
                  <details
                    key={routine.id}
                    className="rounded border border-zinc-800 p-3"
                  >
                    <summary className="cursor-pointer font-bold">
                      {routine.title}
                      <span className="ml-2 text-sm text-yellow-400">
                        {progress?.currentStreak ?? 0} · record{" "}
                        {progress?.bestStreak ?? 0}
                      </span>
                    </summary>

                    {reachedMilestones.length > 0 && (
                      <p className="mt-3 text-xs text-yellow-400">
                        Paliers atteints : {reachedMilestones.join(", ")}
                      </p>
                    )}

                    <div className="mt-3 max-h-52 space-y-2 overflow-y-auto text-xs">
                      {(progress?.history.length ?? 0) === 0 ? (
                        <p className="text-zinc-500">
                          Aucun cycle encore archivé.
                        </p>
                      ) : (
                        progress.history.map((entry) => (
                          <div
                            key={`${entry.periodKey}-${entry.evaluatedAt}`}
                            className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-2"
                          >
                            <span className="text-zinc-400">
                              {entry.periodLabel}
                            </span>
                            <span
                              className={
                                entry.status === "completed"
                                  ? "font-bold text-green-400"
                                  : "font-bold text-red-400"
                              }
                            >
                              {entry.status === "completed"
                                ? "Accompli"
                                : "Manqué"}{" "}
                              · {entry.completedCount}/
                              {entry.targetCount}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </details>

        <details className="rounded-lg border border-zinc-800">
          <summary className="cursor-pointer p-5 text-xl font-bold">
            Primal Loop
          </summary>

          <ol className="grid gap-3 border-t border-zinc-800 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {primalLoopSteps.map((step, index) => (
              <li
                key={step}
                className="rounded border border-zinc-800 p-3 text-sm"
              >
                <span className="mr-2 font-bold text-yellow-400">
                  {index + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </main>
  );
}
