# /docs/HANDOVER.md

Statut : documentation officielle de passation de RAS — The Game of Life.

Ce document remplace la mémoire de l’ancienne conversation. Le dépôt Git reste la source de vérité du code. En cas de divergence entre ce document et le dépôt, le code compilant du dépôt fait foi.

## Dernier état confirmé

Tous les développements sont validés jusqu’au **Macro Sprint 15 — Migration de sauvegarde versionnée**.

## Projet

RAS — The Game of Life est une application Next.js / TypeScript / Tailwind qui transforme la vie quotidienne de Robin en RPG personnel.

Robin est le Héros. Sa vie devient un Royaume. Ses actions deviennent des Missions, Rituels, Piliers, Projets, Boss et Chapitres.

## Principes verrouillés

- RAS est un RPG de vie réelle, pas une todo-list.
- Dashboard compact paysage.
- Pages dédiées pour les détails.
- 7 Piliers : Force, Savoir, Discipline, Santé, Leadership, Foi, Relations.
- 3 Rituels : Aube, Jour, Crépuscule.
- Missions donnent XP, Glory, progression de Pilier et dégâts au Boss.
- Missions non applicables peuvent être mises au repos sans punition.
- LOKI est le compagnon officiel : chat noir aux yeux verts, Premier Conseiller.
- localStorage pour la V1.
- Export/import JSON obligatoire.
- Vercel gratuit pour le déploiement.
- Ne pas redéfinir la philosophie, la roadmap ou l’architecture sans demande explicite.

## Sprints confirmés

1. Dashboard initial.
2. Sauvegarde localStorage.
3. Missions XP / Glory / dégâts.
4. Journal quotidien.
5. Piliers permanents.
6. Boss, phases, faiblesse et récompense.
7. Héros et niveaux.
8. Rituels.
9. Royaume et bâtiments.
10. Projets.
11. Chapitre.
12. Missions ignorées sans punition.
13. Planning hebdomadaire des Missions.
14. Éditeur complet de Mission.
15. Migration de sauvegarde versionnée.

## Macro Sprint 13 — Planning hebdomadaire des Missions

Statut : appliqué et testé.

Changements validés :

- ajout de `WeekDay` ;
- ajout de `daysOfWeek` dans `Mission` ;
- filtrage des Missions actives selon le jour ;
- édition des jours dans `MissionManager` ;
- ajout de Mission avec jours personnalisés ;
- conservation du planning au rechargement ;
- Missions non planifiées ne bloquent pas la journée.

## Macro Sprint 14 — Éditeur complet de Mission

Statut : appliqué et testé.

Changements validés :

- modification du titre ;
- modification du Pilier ;
- modification du Rituel ;
- modification des jours ;
- modification XP ;
- modification Glory ;
- modification dégâts Boss ;
- ajout et suppression conservés ;
- persistance au rechargement.

## Macro Sprint 15 — Migration de sauvegarde versionnée

Statut : appliqué et testé le 14 juillet 2026.

Changements validés :

- ajout de `schemaVersion` dans `SaveData` ;
- normalisation robuste des sauvegardes locales ;
- migration automatique des anciennes Missions sans `daysOfWeek` ;
- sécurisation des imports JSON ;
- export de sauvegarde versionné ;
- refus propre des fichiers JSON non compatibles ;
- conservation de la progression existante après migration ;
- vérification de `/missions`, `/settings` et `/report`.

## Sprint en cours / prochain

**Macro Sprint 16 — Plusieurs Projets et association réelle Mission → Projet**.

Objectif : permettre plusieurs Projets actifs ou configurables, et faire en sorte que les Missions contribuent réellement à leur Projet lié au lieu d’utiliser seulement l’XP globale.

## Étapes suivantes recommandées

1. Plusieurs Projets et association réelle Mission → Projet.
2. Récompense Projet réellement attribuée une seule fois.
3. Plusieurs Boss et sélection active.
4. Rotation / passage au Boss suivant.
5. Plusieurs Chapitres et progression séquentielle.
6. Récompense Chapitre réellement attribuée une seule fois.
7. Clarifier les jours sans Mission et leur effet sur la Série.
8. Conserver dans les Archives la configuration exacte du jour.
9. Notifications de Succès et level-up.
10. Design final et assets.

## Commandes habituelles

```bash
npm run build
npm run dev
git add .
git commit -m "..."
git push