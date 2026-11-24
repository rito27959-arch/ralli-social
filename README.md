<div align="center">

# Ralli

**A social network built around communities and events.**

Posts start the conversation. Shared spaces and real-life meetups give it a future.

[![CI](https://github.com/rito27959-arch/ralli-social/actions/workflows/ci.yml/badge.svg)](https://github.com/rito27959-arch/ralli-social/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/foundation-0.1-6D48E8?style=flat-square)
![Astro](https://img.shields.io/badge/Astro%207-SSR-1A1A1A?style=flat-square&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-islands-1A1A1A?style=flat-square&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%C2%B7%20Firestore%20%C2%B7%20Functions-1A1A1A?style=flat-square&logo=firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/hosted%20on-Vercel-1A1A1A?style=flat-square&logo=vercel&logoColor=white)

[**Architecture**](docs/ARCHITECTURE.md) &nbsp;·&nbsp; [**Deployment**](docs/DEPLOYMENT.md) &nbsp;·&nbsp; [**Roadmap**](docs/ROADMAP.md)

</div>

<br>

> [!NOTE]
> **Ralli is a working foundation, not a finished product.** Real social interactions work once a Firebase project is connected. No payment, ad, subscription, revenue figure or Firebase deployment is simulated. *Ralli* is a working name.

## What works today

<table>
<tr>
<td width="33%" valign="top">

**People**
- E-mail (verified) or Google sign-in
- Server-verified SSR sessions
- Name, bio and photo editing
- Follows

</td>
<td width="33%" valign="top">

**Conversation**
- Text posts with one image
- Comments and likes
- Real-time private text messages
- Post reporting with admin review

</td>
<td width="33%" valign="top">

**Together**
- Create and join public communities
- Events with transactional, capacity-aware RSVP
- A financial scenario simulator

</td>
</tr>
</table>

## Architecture

```mermaid
flowchart LR
    U["Browser"] --> V["Astro 7 on Vercel<br/><sub>pre-rendered marketing · SSR /app and /admin<br/>React hydrated only where interactive</sub>"]
    V -- "session cookie<br/>verified by Admin SDK" --> ADM["Firebase Admin<br/><sub>server only</sub>"]
    U -- "reads, uploads<br/>under Security Rules" --> FS[("Firestore · Storage")]
    U -- "App Check" --> FN["Cloud Functions v2<br/><sub>likes, follows, communities,<br/>events, RSVP, messages, reports</sub>"]
    FN --> FS
    ADM --> FS
    classDef s fill:#1A1A1A,stroke:#6D48E8,color:#fff
    class U,V,ADM,FS,FN s
```

- **Identity** — a fresh Firebase ID token is exchanged for a session cookie verified by the Admin SDK on private routes, with Origin and CSRF-token checks on server operations.
- **Writes** — `posts` and `comments` are written directly under restrictive rules; every other mutation goes through validated, transactional Cloud Functions.
- **Privilege** — financial and administrative rights are unreachable from the client. Only the server can grant the `admin` claim.

Full data model, queries and known limits: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Get started

```bash
npm ci
npm --prefix functions ci
cp .env.example .env.local     # then fill in your Firebase project settings
npm run dev
```

Firebase web keys may be public; service accounts and secrets must **never** reach the browser.

## Verify

```bash
npm run check          # types
npm test               # unit tests
npm run test:rules     # Firestore and Storage security rules
npm run build
npm run test:e2e       # Playwright
```

## Before a public launch

Account deletion and export, private profiles and communities, advanced roles, invitations, notifications, blocking, complete moderation, age checks, a verified CSP, validated legal policies, structured logs and backups. Messages are **not** end-to-end encrypted — access relies on Firestore rules and server permissions. See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full list and the step-by-step plan to find first customers.

<br>

<div align="center">
<sub>Designed and built in Yaoundé, Cameroon.</sub>
</div>
