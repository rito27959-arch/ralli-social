import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const config = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'not-configured',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'demo-ralli',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-ralli.appspot.com',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '0',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || 'not-configured',
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

export const configured = Boolean(
  import.meta.env.PUBLIC_FIREBASE_API_KEY &&
  import.meta.env.PUBLIC_FIREBASE_PROJECT_ID &&
  import.meta.env.PUBLIC_FIREBASE_APP_ID
);

const app = getApps().length ? getApp() : initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

if (typeof window !== 'undefined' && configured) {
  if (import.meta.env.PUBLIC_USE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  } else if (import.meta.env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.PUBLIC_FIREBASE_APPCHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  }
}
