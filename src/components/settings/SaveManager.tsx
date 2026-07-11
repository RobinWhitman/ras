"use client";

import { ChangeEvent, useRef, useState } from "react";

const SAVE_KEY = "ras-save-v9";

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

      const exportData = {
        application: "RAS",
        version: 1,
        exportedAt: new Date().toISOString(),
        save: parsedSave,
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

  function isValidSave(value: unknown): value is Record<string, unknown> {
    if (
      typeof value !== "object" ||
      value === null ||
      Array.isArray(value)
    ) {
      return false;
    }

    const save = value as Record<string, unknown>;

    return (
      typeof save.xp === "number" &&
      typeof save.glory === "number" &&
      typeof save.bossHp === "number" &&
      Array.isArray(save.dailyMissions) &&
      Array.isArray(save.completedMissionIds) &&
      typeof save.pillarProgress === "object" &&
      save.pillarProgress !== null
    );
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

      const importedSave =
        parsedFile?.application === "RAS" && parsedFile?.save
          ? parsedFile.save
          : parsedFile;

      if (!isValidSave(importedSave)) {
        throw new Error("Invalid save");
      }

      const confirmed = window.confirm(
        "Importer cette sauvegarde remplacera toute la progression actuellement enregistrée dans RAS. Continuer ?"
      );

      if (!confirmed) {
        event.target.value = "";
        return;
      }

      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(importedSave)
      );

      window.location.reload();
    } catch {
      setError(
        "Ce fichier n’est pas une sauvegarde RAS valide."
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
            conservable sur ton ordinateur.
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
            Restaure une progression précédemment exportée.
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