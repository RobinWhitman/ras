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
    id: "project-corps",
    title: "Forger le Corps",
    description:
      "Transformer l’entraînement, la santé et la récupération en progression durable.",
    objective:
      "Ancrer les séances, l’hydratation, la récupération et les routines physiques dans le quotidien.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "💪",
  },
  {
    id: "project-ordre",
    title: "Clarifier l’Ordre Mental",
    description:
      "Réduire le chaos par la planification, la foi, l’étude et les décisions utiles.",
    objective:
      "Installer des actions régulières de discipline, savoir et foi pour rendre les journées plus nettes.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "🛡️",
  },
  {
    id: "project-phf",
    title: "Développer PHF",
    description:
      "Faire progresser la production, les ventes et les livraisons de PHF.",
    objective:
      "Transformer les actions professionnelles réalisées pour PHF en progression suivie.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "🍱",
  },
  {
    id: "project-transmission",
    title: "Transmettre et accompagner",
    description:
      "Faire progresser les activités de coaching, de formation et de transmission.",
    objective:
      "Transformer les accompagnements réalisés en progression suivie.",
    targetXp: 600,
    rewardGlory: 250,
    icon: "🎓",
  },
];

export function getProjectDetail(projectId: string) {
  return (
    projectDetails.find((project) => project.id === projectId) ??
    projectDetails[0]
  );
}
