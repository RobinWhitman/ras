import {
  readFile,
  stat,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();

const requiredFiles = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/missions/page.tsx",
  "src/app/rituals/page.tsx",
  "src/app/projects/page.tsx",
  "src/app/boss/page.tsx",
  "src/app/chapter/page.tsx",
  "src/app/companion/page.tsx",
  "src/app/journal/page.tsx",
  "src/app/achievements/page.tsx",
  "src/app/settings/page.tsx",
  "src/components/BrandLogo.tsx",
  "src/components/GlobalNavigation.tsx",
  "src/components/dashboard/Dashboard.tsx",
  "src/components/dashboard/MorningPanel.tsx",
  "src/components/dashboard/TopBar.tsx",
  "src/components/dashboard/VictoryToast.tsx",
  "src/components/settings/SaveManager.tsx",
  "src/data/navigation.ts",
  "src/data/routines.ts",
  "src/hooks/useGame.ts",
  "src/hooks/useRoutines.ts",
  "src/lib/routines.ts",
  "src/types/game.ts",
  "src/types/routines.ts",
];

const requiredAssets = [
  "public/assets/hero/robin-pixel.png",
  "public/assets/companion/loki-pixel.png",
  "public/assets/brand/ras-logo.png",
];

const sourceRequirements = [
  {
    file: "src/hooks/useGame.ts",
    markers: [
      "normalizeSaveData",
      "plannedMissions",
      "completedProjectLevels",
      "completedBossLevels",
    ],
  },
  {
    file: "src/types/game.ts",
    markers: [
      "schemaVersion",
      "plannedMissions",
      "bossLevels",
      "projectLevels",
    ],
  },
  {
    file: "src/components/dashboard/Dashboard.tsx",
    markers: [
      "VictoryToast",
      "unlockedAchievementSignature",
      "hasPlannedMissionsToday",
    ],
  },
  {
    file: "src/app/layout.tsx",
    markers: [
      "GlobalNavigation",
      "RAS — The Game of Life",
    ],
  },
  {
    file: "src/data/navigation.ts",
    markers: ["/rituals", "Rituels"],
  },
  {
    file: "src/data/routines.ts",
    markers: [
      "Meal prep personnel",
      "hebdo-lecture-biblique",
      "periodique-bilan-physique",
      "primalLoopSteps",
    ],
  },
  {
    file: "src/data/game.ts",
    markers: [
      "Production PHF",
      "Livraisons clients",
      "Coaching haltérophilie",
      "Ventes PHF",
    ],
  },
  {
    file: "src/hooks/useRoutines.ts",
    markers: [
      "spiritualProjectUnlocked",
      "addPhysicalAssessment",
      "completeRoutine",
    ],
  },
  {
    file: "src/components/settings/SaveManager.tsx",
    markers: [
      "ROUTINE_SAVE_KEY",
      "routines",
      "normalizeRoutineSave",
    ],
  },
];

const errors = [];

async function verifyFile(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);

  try {
    const fileStat = await stat(absolutePath);

    if (!fileStat.isFile()) {
      errors.push(
        `${relativePath} existe mais n'est pas un fichier.`
      );
      return;
    }

    if (fileStat.size === 0) {
      errors.push(`${relativePath} est vide.`);
    }
  } catch {
    errors.push(`${relativePath} est manquant.`);
  }
}

async function verifyAsset(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);

  try {
    const fileStat = await stat(absolutePath);

    if (!fileStat.isFile()) {
      errors.push(
        `${relativePath} n'est pas un fichier image.`
      );
      return;
    }

    if (fileStat.size < 1024) {
      errors.push(
        `${relativePath} semble vide ou incomplet.`
      );
    }
  } catch {
    errors.push(`${relativePath} est manquant.`);
  }
}

async function verifySource({ file, markers }) {
  const absolutePath = path.join(projectRoot, file);

  try {
    const source = await readFile(absolutePath, "utf8");

    markers.forEach((marker) => {
      if (!source.includes(marker)) {
        errors.push(
          `${file} ne contient plus le bloc requis : ${marker}.`
        );
      }
    });
  } catch {
    errors.push(`${file} ne peut pas être contrôlé.`);
  }
}

await Promise.all([
  ...requiredFiles.map(verifyFile),
  ...requiredAssets.map(verifyAsset),
  ...sourceRequirements.map(verifySource),
]);

if (errors.length > 0) {
  console.error("\nVérification RAS échouée :\n");

  errors.forEach((error) => {
    console.error(`- ${error}`);
  });

  console.error("");
  process.exit(1);
}

console.log(
  "Structure RAS validée : fichiers, progression, routines et assets présents."
);
