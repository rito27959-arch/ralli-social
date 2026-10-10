# Vérification effectuée le 10 octobre 2026

| Vérification | Résultat | Portée |
| --- | --- | --- |
| `npm run check` | Réussi : 0 erreur, 0 avertissement ; 8 indications sur `FormEvent` | Astro, TypeScript frontend et Functions |
| `npm run build` | Réussi | Pages publiques pré-rendues et bundle SSR Vercel ; avertissement de chunk > 500 Ko |
| `npm test` | 1 test réussi | Calcul du simulateur financier |
| `npm run test:rules` | 4 tests réussis | Firestore et Storage avec émulateurs ; refus d'usurpation, profil et paiement privés, conversations, formats de médias |
| `npm run test:e2e` | 2 tests réussis | Navigation marketing et redirection des routes privées sans cookie |
| Inspection visuelle Chromium | Effectuée en desktop 1440 × 900 et mobile 390 × 844 | Composition d'accueil ; aucun débordement horizontal mobile constaté |
| Firebase réel et paiement | Non exécuté | Aucun identifiant de projet ou compte marchand autorisé dans cet environnement |
| Lighthouse / Web Vitals | Non mesurés | Aucun score annoncé |

Le backend métier compile, mais ses fonctions n'ont pas encore de tests d'intégration complets avec Authentication et Functions Emulator. Les parcours payants ne sont pas développés. Une validation de sécurité et d'exploitation supplémentaire est requise avant ouverture publique.
