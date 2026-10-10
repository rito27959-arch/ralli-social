# État, risques et premiers clients

## Réellement codé

Site public, pages institutionnelles identifiées comme brouillons lorsque nécessaire, Auth email vérifié/Google, sessions SSR, édition de nom/bio/photo, posts texte et une image, commentaires, likes, follows, création et adhésion aux communautés publiques, événements et inscription avec capacité transactionnelle, messages texte privés en temps réel, signalements de posts et revue administrative, simulateur de scénario financier.

Le fonctionnement de ces parcours avec un **projet Firebase réel** n'est pas vérifié tant que les identifiants et services ne sont pas fournis. Le build et les tests locaux sont rapportés séparément.

## Encore requis avant lancement public

Suppression/export de compte et nettoyage en cascade ; vidéos et albums ; profils et communautés privés ; gestion avancée des membres et des rôles ; invitations ; réponses, partages et enregistrements ; fil abonnements à grande échelle ; recherches et pages publiques indexables ; blocage, lecture des messages, notifications FCM ; modération et contestations complètes ; contrôle d'âge ; CSP vérifiée ; politique légale validée ; conformité selon marchés ; logs structurés et sauvegardes.

Monétisation : vérifier l'éligibilité du compte marchand et les capacités récurrentes de CinetPay ou d'un fournisseur international. Développer ensuite le fournisseur sandbox, signature webhook, idempotence, reconduction, remboursement, facturation et audit. Ajouter les campagnes directes seulement avec validation et antifraude. AdSense doit être approuvé séparément. Le simulateur n'est pas une comptabilité ; les tarifs 9/49/199 USD ne sont pas des produits achetables.

## Cible 10 000 USD mensuels

Hypothèse illustrative : 40 clients Business × 199 USD = 7 960 USD et 227 Creator × 9 USD = 2 043 USD, soit 10 003 USD de MRR brut théorique avant résiliation, coûts, taxes et paiements. Ce scénario ne garantit ni demande ni conversion ; il faut valider les offres avec de vrais clients.

## Acquisition par étapes

1. Choisir un segment précis, par exemple organisateurs de communautés étudiantes ou clubs professionnels dans une ville, et conduire 20 entretiens sur leurs outils actuels.
2. Recruter 5 organisateurs pilotes, créer leurs premières communautés et événements avec eux ; mesurer la présence réelle et les retours hebdomadaires.
3. Résoudre les problèmes de fiabilité, sécurité et modération avant d'ouvrir davantage d'inscriptions. Mesurer activation, rétention J7 et présence aux événements avec consentement approprié.
4. Proposer une offre payante uniquement si une tâche répétitive apporte un gain démontré. Tester une vente pilote via un prestataire éligible avec remboursement, facture et support.
5. Comparer MRR encaissé, résiliation, coûts Firebase, support, acquisition et marge avant d'accélérer la publicité ou le marketing.
