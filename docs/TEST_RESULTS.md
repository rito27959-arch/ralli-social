# Vérification du dépôt GitHub, le 10 octobre 2026

Le premier commit omettait `src/lib/`, bien que le middleware, les pages et le test financier en dépendent. Un build frais reproduisait l'erreur Vercel `UNRESOLVED_IMPORT: Could not resolve './lib/firebase.server'`. Les quatre modules ont été ajoutés au dépôt.

| Vérification | Résultat | Portée |
| --- | --- | --- |
| `npm run check` | Réussi : 0 erreur, 0 avertissement ; 8 indications sur `FormEvent` | Astro, TypeScript frontend et Functions ; dépendances Functions installées |
| `npm run build` | Réussi après restauration de `src/lib/` | Pages publiques pré-rendues et bundle SSR Vercel ; avertissement de chunk > 500 Ko |
| `npm test` | 1 test réussi | Calcul du simulateur financier |
| `npm run test:rules` | Non exécuté ici : JDK 17 local, Firebase CLI exige JDK 21 | Le pipeline CI installe Java 21 avant ce test |
| `npm run test:e2e` | Non exécuté ici : binaire Chromium absent, téléchargement Playwright tronqué par le réseau | Le pipeline CI installe Chromium avant ce test |
| Firebase réel et paiement | Non exécuté | Aucun identifiant de projet ou compte marchand autorisé dans cet environnement |
| Lighthouse / Web Vitals | Non mesurés | Aucun score annoncé |

Le backend métier compile, mais ses fonctions n'ont pas encore de tests d'intégration complets avec Authentication et Functions Emulator. Les parcours payants ne sont pas développés. Une validation de sécurité et d'exploitation supplémentaire est requise avant ouverture publique. Le build local ne prouve pas qu'un déploiement distant Vercel a réussi : vérifier son statut après le push.
