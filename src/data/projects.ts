export type ProjectDetails = {
  id: string;
  title: string;
  description: string;
  objective: string;
  targetXp: number;
  rewardGlory: number;
  icon: string;
};

export const projectDetails: ProjectDetails[] = [
  {
    id: "project-ras-v1",
    title: "Construire la V1 de RAS",
    description:
      "Créer une première version stable et réellement utilisable de RAS au quotidien.",
    objective:
      "Disposer d’un système complet de missions, progression, royaume, boss, journal et sauvegarde.",
    targetXp: 1000,
    rewardGlory: 500,
    icon: "⚒️",
  },
];