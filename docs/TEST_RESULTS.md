# Vérification du dépôt GitHub, le 10 octobre 2026

Le premier commit omettait `src/lib/`, bien que le middleware, les pages et le test financier en dépendent. Un build frais reproduisait l'erreur Vercel `UNRESOLVED_IMPORT: Could not resolve './lib/firebase.server'`. Les quatre modules ont été ajoutés au dépôt.

| Vérification | Résultat | Portée |
| --- | --- | --- |
| `npm run check` | Réussi : 0 erreur, 0 avertissement ; 8 indications sur `FormEvent` | Astro, TypeScript frontend et Functions ; dépendances Functions installées |
| `npm run build` | Réussi ; présence du module natif Rolldown contrôlée dans la fonction Vercel isolée | Pages publiques pré-rendues et bundle SSR Vercel ; avertissement de chunk > 500 Ko |
| `npm test` | 1 test réussi | Calcul du simulateur financier |
| `npm run test:rules` | Non exécuté ici : JDK 17 local, Firebase CLI exige JDK 21 | Le pipeline CI installe Java 21 avant ce test |
| `npm run test:e2e` | Non exécuté ici : binaire Chromium absent, téléchargement Playwright tronqué par le réseau | Le pipeline CI installe Chromium avant ce test |
| Firebase réel et paiement | Non exécuté | Aucun identifiant de projet ou compte marchand autorisé dans cet environnement |
| Lighthouse / Web Vitals | Non mesurés | Aucun score annoncé |

Le 10 octobre 2026, le déploiement Vercel du correctif SSR a été vérifié sur `https://ralli-social.vercel.app` : `/connexion` et `/inscription` répondent 200 ; `/app` et `/admin` redirigent vers la connexion sans session ; `robots.txt` et `sitemap.xml` répondent 200. La cause du `FUNCTION_INVOCATION_FAILED` était l'absence du binding natif Linux de Rolldown dans la fonction Vercel. Un contrôle au build évite une récidive. La CI GitHub Actions du correctif (`0a5570c`) a réussi.

Le backend métier compile, mais ses fonctions n'ont pas encore de tests d'intégration complets avec Authentication et Functions Emulator. Les parcours payants ne sont pas développés. Une validation de sécurité et d'exploitation supplémentaire est requise avant ouverture publique. Le projet Firebase réel et les identifiants serveur doivent être configurés pour que l'inscription et les fonctions sociales opèrent réellement.
