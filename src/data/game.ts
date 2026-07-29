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
  {
    id: "project-phf",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Développer PHF",
  },
  {
    id: "project-transmission",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Transmettre et accompagner",
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
    id: "mission-livraisons-clients",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-phf",
    ritualId: "ritual-jour",
    title: "Livraisons clients",
    pillar: "Discipline",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: [1, 3],
  },
  {
    id: "mission-coaching-halterophilie",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-transmission",
    ritualId: "ritual-crepuscule",
    title: "Coaching haltérophilie",
    pillar: "Leadership",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: [1],
  },
  {
    id: "mission-ventes-phf",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-phf",
    ritualId: "ritual-jour",
    title: "Ventes PHF · 11 h à 14 h",
    pillar: "Leadership",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: [4],
  },
  {
    id: "mission-production-phf",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-phf",
    ritualId: "ritual-jour",
    title: "Production PHF",
    pillar: "Discipline",
    xp: 10,
    glory: 5,
    damage: 5,
    daysOfWeek: [6],
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
