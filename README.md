# Ralli · Réseau social communautaire (socle 0.1)

Projet Astro SSR + React Islands + Firebase. Identité provisoire. Le socle permet des interactions sociales réelles après connexion à un projet Firebase ; il **n'est pas encore un produit commercial complet**. Aucun paiement, annonce, abonnement, chiffre de revenu ou déploiement Firebase réel n'est simulé.

## Démarrer

```bash
npm ci
npm --prefix functions ci
cp .env.example .env.local
# Configurer le projet Firebase et les variables de .env.local
npm run dev
```

Documentation : [architecture](docs/ARCHITECTURE.md), [configuration et déploiement](docs/DEPLOYMENT.md), [état et feuille de route](docs/ROADMAP.md).

## Vérifier

```bash
npm run check
npm test
npm run test:rules
npm run build
npm run test:e2e
```

Les clés web Firebase peuvent être publiques, mais les secrets et comptes de service ne doivent jamais être envoyés au navigateur. Les routes privées nécessitent un cookie signé et vérifié côté serveur. L'attribution du rôle `admin` est réservée à l'opérateur.
