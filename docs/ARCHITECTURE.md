# Architecture de Ralli (version 0.1)

## Proposition de valeur

Un réseau centré sur les communautés et événements : les publications lancent les échanges, les espaces communs et rencontres leur donnent une suite. Nom provisoire à contrôler avant lancement.

## Flux

- Astro 7 sur Vercel : pages marketing pré-rendues, `/app` et `/admin` en SSR. React est hydratée uniquement pour les parcours interactifs.
- Firebase Auth : email vérifié ou Google. Un jeton d'identité récent est échangé contre un cookie de session Firebase vérifié par Admin SDK sur les routes privées. Origin + jeton CSRF pour les opérations serveur. L'Admin SDK reste sur serveur.
- Client Firebase SDK : lectures Firestore et upload Storage sous Security Rules. Firestore `posts` et `comments` sont écrits directement sous des règles restrictives.
- Functions v2 : likes, follows, communautés, événements, RSVP, messages et signalements, avec App Check et validations serveur.
- Firestore : droits financiers et administratifs interdits au client ; seul le serveur peut attribuer les claims `admin`.

## Modèle de données et requêtes

| Collection | Champs utiles | Écriture | Lecture |
| --- | --- | --- | --- |
| `users/{uid}` | uid, handle stable, displayName, bio, photoURL, coverURL, createdAt | Session serveur ; l'auteur peut modifier quatre champs publics | Membres connectés |
| `posts/{id}` | authorId, body, imageURLs, visibility, createdAt | Auteur sous règle | Membres, publications publiques |
| `posts/{id}/comments/{id}` | authorId, body, createdAt | Auteur sous règle | Membres si post public |
| `posts/{id}/likes/{uid}` | uid, createdAt | Function transactionnelle | Membres |
| `follows/{follower}_{following}` | followerId, followingId | Function transactionnelle | Membres |
| `communities/{id}/members/{uid}` | rôle, joinedAt | Functions seulement | Membres |
| `events/{id}/attendees/{uid}` | uid, joinedAt | Function transactionnelle | Membres |
| `conversations/{hash}/messages/{id}` | senderId, body, createdAt | Function, participants uniquement | Participants uniquement |
| `reports/{id}` | reporterId, kind, reason, status | Function et serveur admin | Admin exclusivement |
| `auditLogs/{id}` | actorId, action, targetId, createdAt | Serveur admin | Serveur exclusivement |

Les index composites sont dans `firestore.indexes.json`. Le fil découverte est paginé par `createdAt` (12 documents). Le fil abonnements est limité aux dix premiers comptes suivis et doit être remplacé par une architecture de fan-out ou des requêtes segmentées avant grande échelle. Les listes de communautés, événements et conversations sont plafonnées à 30 éléments ; il manque une pagination avant une charge réelle. Les messages actifs sont limités aux 30 plus récents avec désabonnement du listener lors du changement de conversation.

## Sécurité et limites connues

- Un document `users` est public pour les membres et ne doit jamais recevoir email, téléphone, date de naissance ou droits payants. Utiliser des documents privés avec règles distinctes.
- La Storage publique sert uniquement aux images de publications publiques. Ne pas ajouter de posts privés avec médias tant que Storage et URL de téléchargement ne sont pas conçus pour la confidentialité.
- Les documents et fichiers associés à une publication supprimée ne sont pas nettoyés récursivement dans cette version. La suppression du compte, l'export et la politique de conservation restent à implémenter avant lancement public.
- Anti-abus initial : App Check et cadence minimale par action serveur. Il faut encore limiter les créations directes de posts/commentaires par quotas serveur, mettre en place modération opérationnelle et surveillance des coûts.
- Les données de messagerie ne sont pas chiffrées de bout en bout. Le contrôle repose sur les règles Firestore et les permissions serveur.
- Les règles n'offrent pas d'accès client aux paiements, abonnements, statistiques financières, campagnes et paramètres globaux. Aucun paiement ou droit Premium n'est accordé par ce code.
- La vérification visuelle WCAG, les Core Web Vitals et les tests sur appareils réels restent à réaliser. Aucun score Lighthouse n'est revendiqué.
