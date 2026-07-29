"use client";

import { ChangeEvent, useRef, useState } from "react";
import { routineDefinitions } from "@/data/routines";
import { normalizeSaveData } from "@/hooks/useGame";
import {
  normalizeRoutineSave,
  ROUTINE_SAVE_KEY,
} from "@/lib/routines";

const SAVE_KEY = "ras-save-v9";
const EXPORT_VERSION = 3;

type ExportFile = {
  application: "RAS";
  exportVersion: number;
  exportedAt: string;
  save: unknown;
  routines: unknown;
};

type ExtractedSave = {
  save: unknown;
  routines?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function extractSaveFromFile(parsedFile: unknown): ExtractedSave {
  if (
    isObject(parsedFile) &&
    parsedFile.application === "RAS" &&
    "save" in parsedFile
  ) {
    return {
      save: parsedFile.save,
      routines:
        "routines" in parsedFile ? parsedFile.routines : undefined,
    };
  }

  return {
    save: parsedFile,
  };
}

function isProbablyRasSave(value: unknown) {
  if (!isObject(value)) return false;

  const hasCoreProgress =
    typeof value.xp === "number" ||
    typeof value.glory === "number" ||
    typeof value.bossHp === "number";

  const hasMissionData =
    Array.isArray(value.dailyMissions) ||
    Array.isArray(value.completedMissions) ||
    Array.isArray(value.completedMissionIds);

  const hasSaveShape =
    typeof value.currentDate === "string" ||
    typeof value.missionConfigVersion === "number" ||
    typeof value.schemaVersion === "number";

  return hasCoreProgress || hasMissionData || hasSaveShape;
}

export default function SaveManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function exportSave() {
    setMessage("");
    setError("");

    const storedSave = localStorage.getItem(SAVE_KEY);

    if (!storedSave) {
      setError("Aucune sauvegarde RAS n’a été trouvée.");
      return;
    }

    try {
      const parsedSave = JSON.parse(storedSave);
      const storedRoutines = localStorage.getItem(ROUTINE_SAVE_KEY);
      const parsedRoutines = storedRoutines
        ? JSON.parse(storedRoutines)
        : null;

      const exportData: ExportFile = {
        application: "RAS",
        exportVersion: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        save: normalizeSaveData(parsedSave),
        routines: normalizeRoutineSave(
          parsedRoutines,
          routineDefinitions
        ),
      };

      const fileContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([fileContent], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toLocaleDateString("fr-CA");

      link.href = downloadUrl;
      link.download = `ras-sauvegarde-${date}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setMessage(
        "Progression, routines et bilans physiques exportés avec succès."
      );
    } catch {
      setError("Impossible d’exporter la sauvegarde.");
    }
  }

  function openImportWindow() {
    setMessage("");
    setError("");
    fileInputRef.current?.click();
  }

  async function importSave(event: ChangeEvent<HTMLInputElement>) {
    setMessage("");
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileContent = await file.text();
      const parsedFile = JSON.parse(fileContent);
      const extracted = extractSaveFromFile(parsedFile);

      if (!isProbablyRasSave(extracted.save)) {
        throw new Error("Invalid save");
      }

      const normalizedSave = normalizeSaveData(extracted.save);
      const normalizedRoutines =
        extracted.routines === undefined
          ? null
          : normalizeRoutineSave(
              extracted.routines,
              routineDefinitions
            );

      const confirmed = window.confirm(
        "Importer cette sauvegarde remplacera la progression actuellement enregistrée dans RAS. Continuer ?"
      );

      if (!confirmed) {
        event.target.value = "";
        return;
      }

      localStorage.setItem(SAVE_KEY, JSON.stringify(normalizedSave));

      if (normalizedRoutines) {
        localStorage.setItem(
          ROUTINE_SAVE_KEY,
          JSON.stringify(normalizedRoutines)
        );
      }

      window.location.reload();
    } catch {
      setError(
        "Ce fichier n’est pas une sauvegarde RAS valide ou lisible."
      );
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={exportSave}
          className="rounded-lg border border-yellow-700 bg-yellow-500/10 p-5 text-left transition hover:border-yellow-400"
        >
          <p className="text-lg font-bold text-yellow-400">
            📤 Exporter la sauvegarde
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Télécharge la progression, les routines et les bilans
            physiques dans un fichier réimportable.
          </p>
        </button>

        <button
          type="button"
          onClick={openImportWindow}
          className="rounded-lg border border-zinc-700 p-5 text-left transition hover:border-yellow-400"
        >
          <p className="text-lg font-bold">
            📥 Importer une sauvegarde
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Restaure une progression exportée. Les anciennes
            sauvegardes restent compatibles.
          </p>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={importSave}
        className="hidden"
      />

      {message && (
        <div className="rounded-lg border border-green-800 bg-green-950/20 p-3 text-sm text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/20 p-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
