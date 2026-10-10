# Installation et déploiement

## Prérequis

Node.js 24.12 ou plus récent pour le projet principal et les tests de règles, npm, Java 21 pour l'émulateur Firestore, un projet Firebase avec facturation compatible Functions v2, et un projet Vercel. Les Cloud Functions ciblent Node.js 22. Les services externes et l'identité légale de l'exploitant doivent être configurés par son propriétaire.

## Local

```bash
npm ci
npm --prefix functions ci
cp .env.example .env.local
# Remplir les clés publiques du projet Firebase dans .env.local
npm run dev
```

1. Créer le projet dans Firebase Console, relever son ID et enregistrer une application Web.
2. Activer Authentication : Email/Password et Google. Configurer les domaines autorisés et le modèle de vérification email.
3. Créer Firestore en mode production, Storage et vérifier la région choisie et les coûts. Configurer un budget et des alertes Google Cloud.
4. Copier les valeurs de la configuration web dans les variables `PUBLIC_FIREBASE_*`. Ces valeurs ne sont pas des secrets ; **ne jamais** placer un compte de service dans `PUBLIC_*`.
5. Définir `FIREBASE_PROJECT_ID`. Fournir les identifiants Admin SDK par Workload Identity/ADC dans Vercel et localement, sans clé committée. Limiter les permissions et la durée de vie des identifiants.
6. `npx firebase login`, puis `npx firebase use --add` ou `npx firebase deploy --project ID`. Déployer les règles et index d'abord, puis Functions : `npm run deploy:backend -- --project ID`.
7. Créer une clé de site reCAPTCHA v3, configurer App Check et `PUBLIC_FIREBASE_APPCHECK_SITE_KEY`. Ajouter les domaines de production et du projet Vercel. Tester avant d'activer l'enforcement sur les autres services. Les callables l'exigent déjà hors émulateur.
8. Seul un opérateur autorisé peut attribuer un droit administrateur par `ADMIN_UID=<uid> FIREBASE_PROJECT_ID=<id> node scripts/set-admin.mjs` avec ADC. Reconnexion nécessaire. Ne pas exécuter ce script à partir d'une entrée utilisateur.
9. Dans Vercel, lier le dépôt, déclarer les variables d'environnement sur serveur et celles préfixées `PUBLIC_` pour le build/client. Build command `npm run build`. Associer le domaine et ajouter les domaines autorisés dans Firebase Auth. Déployer avec la CI après tests.
10. Configurer Google Cloud Logging, quotas et alertes budget, sauvegardes Firestore et procédure de restauration testée. Vérifier les erreurs SSR, Functions et Storage après déploiement.

## Émulateurs

```bash
# Développement local isolé, avec des identifiants publics du projet de démonstration
PUBLIC_USE_EMULATORS=true npx firebase emulators:start --project demo-ralli
npm run test:rules
npm test
npm run check
npm run build
```

`test:rules` lance son propre émulateur : ne pas démarrer la même instance sur les mêmes ports. Le test E2E des pages publiques nécessite les binaires Playwright (`npx playwright install chromium`), puis `npm run test:e2e`.

## Retour arrière

1. Identifier le dernier déploiement Vercel stable et le réactiver.
2. Redéployer la dernière version validée des Functions et Security Rules depuis Git ; tester les migrations de données séparément.
3. Restaurer Firestore depuis une sauvegarde préalablement vérifiée si une mutation de données l'exige. Une restauration n'est pas équivalente au retour arrière du code.

## Secrets

Utiliser Secret Manager pour toute future clé de prestataire de paiement. Les webhooks doivent vérifier leur signature et l'état côté prestataire avant tout accès Premium. Aucun prestataire n'est connecté dans ce dépôt.
