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
  {
    id: "project-corps-performance",
    title: "Forger le Corps",
    description:
      "Transformer l’énergie physique, la santé et l’entraînement en progression visible.",
    objective:
      "Ancrer les séances, la récupération et les routines de santé dans le système quotidien.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "💪",
  },
  {
    id: "project-ordre-mental",
    title: "Clarifier l’Ordre Mental",
    description:
      "Réduire le chaos par la planification, l’étude, la prière et les décisions utiles.",
    objective:
      "Installer des actions régulières de discipline, savoir et foi pour stabiliser les journées.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "🛡️",
  },
];

export function getProjectDetail(projectId: string) {
  return (
    projectDetails.find((project) => project.id === projectId) ??
    projectDetails[0]
  );
}