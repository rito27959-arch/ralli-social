import { initializeApp,applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const uid=process.env.ADMIN_UID,projectId=process.env.FIREBASE_PROJECT_ID;
if(!uid||!projectId)throw new Error('Définissez ADMIN_UID et FIREBASE_PROJECT_ID.');
initializeApp({projectId,credential:applicationDefault()});
const auth=getAuth(),user=await auth.getUser(uid);
await auth.setCustomUserClaims(uid,{...user.customClaims,admin:true});
console.log(`Droit administrateur attribué à ${uid}. Reconnexion nécessaire.`);
