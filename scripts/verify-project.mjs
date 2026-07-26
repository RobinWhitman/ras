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
  "src/data/navigation.ts",
  "src/hooks/useGame.ts",
  "src/types/game.ts"
];

const requiredAssets = [
  "public/assets/hero/robin-pixel.png",
  "public/assets/companion/loki-pixel.png",
  "public/assets/brand/ras-logo.png"
];

const sourceRequirements = [
  {
    file: "src/hooks/useGame.ts",
    markers: [
      "normalizeSaveData",
      "plannedMissions",
      "completedProjectLevels",
      "completedBossLevels"
    ]
  },
  {
    file: "src/types/game.ts",
    markers: [
      "schemaVersion",
      "plannedMissions",
      "bossLevels",
      "projectLevels"
    ]
  },
  {
    file: "src/components/dashboard/Dashboard.tsx",
    markers: [
      "VictoryToast",
      "unlockedAchievementSignature",
      "hasPlannedMissionsToday"
    ]
  },
  {
    file: "src/app/layout.tsx",
    markers: [
      "GlobalNavigation",
      "RAS — The Game of Life"
    ]
  }
];

const errors = [];

async function verifyFile(relativePath) {
  const absolutePath = path.join(
    projectRoot,
    relativePath
  );

  try {
    const fileStat = await stat(
      absolutePath
    );

    if (!fileStat.isFile()) {
      errors.push(
        `${relativePath} existe mais n'est pas un fichier.`
      );

      return;
    }

    if (fileStat.size === 0) {
      errors.push(
        `${relativePath} est vide.`
      );
    }
  } catch {
    errors.push(
      `${relativePath} est manquant.`
    );
  }
}

async function verifyAsset(relativePath) {
  const absolutePath = path.join(
    projectRoot,
    relativePath
  );

  try {
    const fileStat = await stat(
      absolutePath
    );

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
    errors.push(
      `${relativePath} est manquant.`
    );
  }
}

async function verifySource({
  file,
  markers,
}) {
  const absolutePath = path.join(
    projectRoot,
    file
  );

  try {
    const source = await readFile(
      absolutePath,
      "utf8"
    );

    markers.forEach((marker) => {
      if (!source.includes(marker)) {
        errors.push(
          `${file} ne contient plus le bloc requis : ${marker}.`
        );
      }
    });
  } catch {
    errors.push(
      `${file} ne peut pas être contrôlé.`
    );
  }
}

await Promise.all([
  ...requiredFiles.map(verifyFile),
  ...requiredAssets.map(verifyAsset),
  ...sourceRequirements.map(
    verifySource
  )
]);

if (errors.length > 0) {
  console.error(
    "\nVérification RAS échouée :\n"
  );

  errors.forEach((error) => {
    console.error(`- ${error}`);
  });

  console.error("");
  process.exit(1);
}

console.log(
  "Structure RAS validée : fichiers, progression et assets présents."
);