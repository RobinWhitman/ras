"use client";

import { ChangeEvent, useRef, useState } from "react";
import { normalizeSaveData } from "@/hooks/useGame";

const SAVE_KEY = "ras-save-v9";
const EXPORT_VERSION = 2;

type ExportFile = {
  application: "RAS";
  exportVersion: number;
  exportedAt: string;
  save: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function extractSaveFromFile(parsedFile: unknown) {
  if (
    isObject(parsedFile) &&
    parsedFile.application === "RAS" &&
    "save" in parsedFile
  ) {
    return parsedFile.save;
  }

  return parsedFile;
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
      const normalizedSave = normalizeSaveData(parsedSave);

      const exportData: ExportFile = {
        application: "RAS",
        exportVersion: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        save: normalizedSave,
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

      setMessage("Sauvegarde exportée avec succès.");
    } catch {
      setError("Impossible d’exporter la sauvegarde.");
    }
  }

  function openImportWindow() {
    setMessage("");
    setError("");

    fileInputRef.current?.click();
  }

  async function importSave(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setMessage("");
    setError("");

    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const fileContent = await file.text();
      const parsedFile = JSON.parse(fileContent);
      const importedSave = extractSaveFromFile(parsedFile);

      if (!isProbablyRasSave(importedSave)) {
        throw new Error("Invalid save");
      }

      const normalizedSave = normalizeSaveData(importedSave);

      const confirmed = window.confirm(
        "Importer cette sauvegarde remplacera toute la progression actuellement enregistrée dans RAS. Continuer ?"
      );

      if (!confirmed) {
        event.target.value = "";
        return;
      }

      localStorage.setItem(SAVE_KEY, JSON.stringify(normalizedSave));

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
          className="rounded-xl border border-yellow-700 bg-yellow-500/10 p-5 text-left transition hover:border-yellow-400"
        >
          <p className="text-lg font-bold text-yellow-400">
            📤 Exporter la sauvegarde
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Télécharge toute ta progression RAS dans un fichier
            versionné et réimportable.
          </p>
        </button>

        <button
          type="button"
          onClick={openImportWindow}
          className="rounded-xl border border-zinc-700 p-5 text-left transition hover:border-yellow-400"
        >
          <p className="text-lg font-bold">
            📥 Importer une sauvegarde
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Restaure une progression exportée. Les anciennes
            sauvegardes sont normalisées automatiquement.
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