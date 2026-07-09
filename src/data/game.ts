import type {
  Boss,
  Chapter,
  Companion,
  Kingdom,
  Mission,
  Project,
  Ritual,
} from "@/types/game";

export const chapters: Chapter[] = [
  {
    id: "chapter-ras",
    title: "Création de RAS",
    description: "Forger le premier compagnon de vie utilisable au quotidien.",
  },
];

export const bosses: Boss[] = [
  {
    id: "boss-chaos",
    chapterId: "chapter-ras",
    name: "Le Chaos Quotidien",
    maxHp: 100,
  },
];

export const projects: Project[] = [
  {
    id: "project-ras-v1",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    title: "Construire la V1 de RAS",
  },
];

export const rituals: Ritual[] = [
  {
    id: "ritual-aube",
    title: "Rituel de l'Aube",
    time: "Aube",
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
  },
  {
    id: "mission-eau",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-aube",
    title: "Boire un grand verre d'eau",
    pillar: "Santé",
    xp: 10,
    glory: 5,
    damage: 5,
  },
  {
    id: "mission-priere",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-aube",
    title: "Faire une prière courte",
    pillar: "Foi",
    xp: 15,
    glory: 8,
    damage: 8,
  },
  {
    id: "mission-plan",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-aube",
    title: "Choisir la première action utile du jour",
    pillar: "Discipline",
    xp: 15,
    glory: 8,
    damage: 8,
  },
  {
    id: "mission-mobilite",
    chapterId: "chapter-ras",
    bossId: "boss-chaos",
    projectId: "project-ras-v1",
    ritualId: "ritual-aube",
    title: "Faire 5 minutes de mobilité",
    pillar: "Santé",
    xp: 20,
    glory: 10,
    damage: 10,
  },
];

export const kingdom: Kingdom = {
  state: "Le Royaume s'éveille...",
};

export const kingdomBuildings = {
  Force: "Arène d'entraînement",
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