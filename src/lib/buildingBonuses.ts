import type { Pillar } from "@/types/game";

export interface BuildingBonus {
  level: number;
  title: string;
  description: string;
}

export const BUILDING_BONUSES: Record<Pillar, BuildingBonus[]> = {
  Force: [
    { level: 1, title: "Camp d'entraînement", description: "Aucun bonus." },
    { level: 2, title: "Salle d'armes", description: "+5% XP Force" },
    { level: 3, title: "Arène", description: "+10% XP Force" },
    { level: 4, title: "Arène Royale", description: "Mission Force rare" },
    { level: 5, title: "Arène Légendaire", description: "+20% XP Force" },
  ],

  Santé: [
    { level: 1, title: "Infirmerie", description: "Aucun bonus." },
    { level: 2, title: "Jardin médicinal", description: "Bonus Santé" },
    { level: 3, title: "Grand Hôpital", description: "+10% Santé" },
    { level: 4, title: "Temple des soins", description: "Mission Santé rare" },
    { level: 5, title: "Sanatorium Royal", description: "+20% Santé" },
  ],

  Discipline: [
    { level: 1, title: "Tour", description: "Aucun bonus." },
    { level: 2, title: "Caserne", description: "+5% Discipline" },
    { level: 3, title: "Citadelle", description: "+10% Discipline" },
    { level: 4, title: "Forteresse", description: "Mission rare" },
    { level: 5, title: "Bastion Royal", description: "+20% Discipline" },
  ],

  Savoir: [
    { level: 1, title: "Bibliothèque", description: "Aucun bonus." },
    { level: 2, title: "Archives", description: "+5% Savoir" },
    { level: 3, title: "Académie", description: "+10% Savoir" },
    { level: 4, title: "Université", description: "Mission rare" },
    { level: 5, title: "Grande Bibliothèque", description: "+20% Savoir" },
  ],

  Leadership: [
    { level: 1, title: "Palais", description: "Aucun bonus." },
    { level: 2, title: "Salle du Conseil", description: "+5% Leadership" },
    { level: 3, title: "Capitole", description: "+10% Leadership" },
    { level: 4, title: "Palais Royal", description: "Mission rare" },
    { level: 5, title: "Palais Impérial", description: "+20% Leadership" },
  ],

  Foi: [
    { level: 1, title: "Sanctuaire", description: "Aucun bonus." },
    { level: 2, title: "Chapelle", description: "+5% Foi" },
    { level: 3, title: "Cathédrale", description: "+10% Foi" },
    { level: 4, title: "Basilique", description: "Mission rare" },
    { level: 5, title: "Temple Sacré", description: "+20% Foi" },
  ],

  Relations: [
    { level: 1, title: "Place", description: "Aucun bonus." },
    { level: 2, title: "Marché", description: "+5% Relations" },
    { level: 3, title: "Forum", description: "+10% Relations" },
    { level: 4, title: "Place Royale", description: "Mission rare" },
    { level: 5, title: "Capitale", description: "+20% Relations" },
  ],
};