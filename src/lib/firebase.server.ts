import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function serverApp() {
  const existing = getApps()[0];
  if (existing) return existing;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID manquant sur le serveur');
  return initializeApp({ credential: applicationDefault(), projectId });
}

export const adminAuth = () => getAuth(serverApp());
export const adminDb = () => getFirestore(serverApp());
