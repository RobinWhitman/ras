import type { Boss, Companion, Kingdom, Mission } from "@/types/game";

export const missions: Mission[] = [
  {
    id: "mission-aube",
    title: "Faire le Rituel de l'Aube",
    pillar: "Foi",
    xp: 15,
    glory: 8,
    damage: 8,
  },
  {
    id: "mission-eau",
    title: "Boire un grand verre d'eau",
    pillar: "Santé",
    xp: 10,
    glory: 5,
    damage: 5,
  },
  {
    id: "mission-seance",
    title: "Faire la séance prévue aujourd'hui",
    pillar: "Force",
    xp: 30,
    glory: 15,
    damage: 15,
  },
];

export const boss: Boss = {
  name: "Le Chaos Quotidien",
  maxHp: 100,
};

export const kingdom: Kingdom = {
  state: "Le Royaume s'éveille...",
};

export const companion: Companion = {
  start: "Le Royaume attend ton premier pas.",
  success: "Bien. Le Royaume a senti ton action. Le Chaos recule.",
};