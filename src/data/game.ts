import type {
  Boss,
  Chapter,
  Companion,
  Kingdom,
  Mission,
  Pillar,
  Project,
  Ritual,
  WeekDay,
} from "@/types/game";

export const allWeekDays: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

export const chapters: Chapter[] = [
  {
    id: "chapter-ras",
    title: "Création de RAS",
    description:
      "Forger le premier compagnon de vie utilisable au quotidien.",
  },
];

export const bosses: Boss[] = [
  {
    id: "boss-chaos",
    chapterId: "chapter-ras",
    name: "Le Chaos Quotidien",
    description:
      "Une force insidieuse qui transforme les journées sans direction en désordre, dispersion et abandon.",
    ability: "Désorganisation",
    weakness: "Discipline",
    maxHp: 100,
    rewardGlory: 150,
    phases: [
      {
        name: "Le Brouillard",
        minHpPercent: 67,
        description:
          "Le Chaos brouille les priorités et rend chaque action plus difficile à commencer.",
      },
      {
        name: "La Résistance",
        minHpPercent: 34,
        description:
          "Le Chaos résiste et tente de détourner le Héros de ses engagements.",
      },
      {
        name: "Le Dernier Rempart",
        minHpPercent: 1,
        description:
          "Le Chaos vacille, mais rassemble ses dernières forces.",
      },
      {
        name: "Vaincu",
        minHpPercent: 0,
        description: "Le Chaos Quotidien a été repoussé.",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "project-ras-v1",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Construire la V1 de RAS",
  },
  {
    id: "project-corps",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Forger le Corps",
  },
  {
    id: "project-ordre",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Clarifier l’Ordre Mental",
  },
];

export const rituals: Ritual[] = [
  {
    id: "ritual-aube",
    title: "Rituel de l’Aube",
    time: "Aube",
  },
  {
    id: "ritual-jour",
    title: "Rituel du Jour",
    time: "Jour",
  },
  {
    id: "ritual-crepuscule",
    title: "Rituel du Crépuscule",
    time: "Crépuscule",
  },
];

export const missions: Mission[] = [
  {
    id: "mission-ouvrir-ras",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-aube",
    title: "Ouvrir RAS",
    pillar: "Discipline",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-eau",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-corps",
    ritualId: "ritual-aube",
    title: "Boire un grand verre d’eau",
    pillar: "Santé",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-priere",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ordre",
    ritualId: "ritual-aube",
    title: "Faire une prière courte",
    pillar: "Foi",
    xp: 15,
    glory: 8,
    damage: 8,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-plan",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ordre",
    ritualId: "ritual-aube",
    title: "Choisir la première action utile du jour",
    pillar: "Discipline",
    xp: 15,
    glory: 8,
    damage: 8,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-action-prioritaire",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-jour",
    title: "Accomplir l’action prioritaire du jour",
    pillar: "Leadership",
    xp: 30,
    glory: 15,
    damage: 15,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-seance",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-corps",
    ritualId: "ritual-jour",
    title: "Faire la séance prévue",
    pillar: "Force",
    xp: 30,
    glory: 15,
    damage: 15,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-preparer-demain",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ordre",
    ritualId: "ritual-crepuscule",
    title: "Préparer la journée de demain",
    pillar: "Discipline",
    xp: 15,
    glory: 8,
    damage: 8,
    daysOfWeek: allWeekDays,
  },
  {
    id: "mission-gratitude",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ordre",
    ritualId: "ritual-crepuscule",
    title: "Faire le bilan et exprimer une gratitude",
    pillar: "Foi",
    xp: 15,
    glory: 8,
    damage: 8,
    daysOfWeek: allWeekDays,
  },
];

export const kingdom: Kingdom = {
  state: "Le Royaume s’éveille...",
};

export const kingdomBuildings: Record<Pillar, string> = {
  Force: "Arène d’entraînement",
  Savoir: "Bibliothèque",
  Discipline: "Tour de garde",
  Santé: "Jardin des soins",
  Leadership: "Salle du conseil",
  Foi: "Chapelle",
  Relations: "Place des alliés",
};

export const companion: Companion = {
  start: "Le Royaume attend ton premier pas.",
  success: "Bien. Le Royaume a senti ton action. Le Chaos recule.",
};

export const companionMissionMessages: Record<Pillar, string> = {
  Discipline: "La Discipline renforce les fondations du Royaume.",
  Santé: "Le corps récupère. Le Royaume respire mieux.",
  Foi: "La Foi éclaire la route avant l’action.",
  Force: "La Force prépare le Héros au combat.",
  Savoir: "Le Savoir agrandit les murs invisibles du Royaume.",
  Leadership: "Le Leadership donne une direction au Royaume.",
  Relations: "Les liens solides rendent le Royaume moins seul.",
};