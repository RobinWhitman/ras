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
  { id: "boss-foi", chapterId: "chapter-ras", name: "Marcher avec Dieu", icon: "✝️", maxHp: 250, rewardGlory: 150 },
  { id: "boss-arme", chapterId: "chapter-ras", name: "Forger l’Arme", icon: "⚔️", maxHp: 300, rewardGlory: 175 },
  { id: "boss-ras", chapterId: "chapter-ras", name: "Bâtir le Royaume", domain: "RAS", icon: "👑", maxHp: 350, rewardGlory: 200 },
  { id: "boss-phf", chapterId: "chapter-ras", name: "Nourrir le Royaume", domain: "PHF", icon: "🍱", maxHp: 400, rewardGlory: 225 },
  { id: "boss-citadelle", chapterId: "chapter-ras", name: "Bâtir la Citadelle", icon: "🏰", maxHp: 450, rewardGlory: 250 },
  { id: "boss-transmettre", chapterId: "chapter-ras", name: "Transmettre", icon: "🎓", maxHp: 500, rewardGlory: 275 },
  { id: "boss-foyer", chapterId: "chapter-ras", name: "Fonder un Foyer", icon: "❤️", maxHp: 550, rewardGlory: 300 },
];

export const projects: Project[] = [
  {
    id: "project-ras-v1",
    chapterId: "chapter-ras",
    bossId: "boss-ras",
    title: "Construire la V1 de RAS",
  },
  {
    id: "project-corps",
    chapterId: "chapter-ras",
    bossId: "boss-arme",
    title: "Forger le Corps",
  },
  {
    id: "project-ordre",
    chapterId: "chapter-ras",
    bossId: "boss-foi",
    title: "Clarifier l’Ordre Mental",
  },
  {
    id: "project-phf",
    chapterId: "chapter-ras",
    bossId: "boss-phf",
    title: "Développer PHF",
  },
  {
    id: "project-transmission",
    chapterId: "chapter-ras",
    bossId: "boss-transmettre",
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
    bossId: "boss-phf",
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
    bossId: "boss-transmettre",
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
    bossId: "boss-phf",
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
    bossId: "boss-phf",
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
