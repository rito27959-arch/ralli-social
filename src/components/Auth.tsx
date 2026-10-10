import { useState, type FormEvent } from 'react';
import { auth, configured, googleProvider } from '../lib/firebase.client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, updateProfile,signOut } from 'firebase/auth';

export default function Auth({signup,csrf}:{signup:boolean;csrf:string}) {
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState('');
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function finish(user:import('firebase/auth').User) {
  const token=await user.getIdToken(true);
  const response=await fetch('/api/session',{method:'POST',headers:{authorization:`Bearer ${token}`,'x-csrf-token':csrf}});
  if(!response.ok)throw new Error('Impossible de créer la session. Vérifiez la configuration Firebase.');
  location.assign('/app');
 }
 async function submit(e:FormEvent){
  e.preventDefault();setBusy(true);setError('');
  try{
   const result=signup?await createUserWithEmailAndPassword(auth,email,password):await signInWithEmailAndPassword(auth,email,password);
   if(signup){await updateProfile(result.user,{displayName:name.trim().slice(0,80)});await sendEmailVerification(result.user);await signOut(auth);setNotice('Vérifiez votre adresse électronique, puis connectez-vous.');return;}
   await result.user.reload();
   if(!result.user.emailVerified){await sendEmailVerification(result.user);await signOut(auth);setNotice('Vérifiez votre adresse électronique. Un nouveau lien vient d’être envoyé.');return;}
   await finish(result.user);
  }catch(e){setError(e instanceof Error?e.message:'Connexion impossible.');}finally{setBusy(false)}
 }
 async function google(){setBusy(true);setError('');try{await finish((await signInWithPopup(auth,googleProvider)).user)}catch(e){setError(e instanceof Error?e.message:'Connexion Google impossible.')}finally{setBusy(false)}}
 async function reset(){if(!email){setError('Saisissez votre adresse électronique.');return}setBusy(true);try{await sendPasswordResetEmail(auth,email);setNotice('Un message de réinitialisation a été envoyé si ce compte existe.')}catch{setError('Réinitialisation indisponible.')}finally{setBusy(false)}}
 if(!configured)return <div className="alert">Connectez d’abord ce projet à Firebase avec les variables de .env.local.</div>;
 return <div className="auth-card"><div className="eyebrow">VOTRE ESPACE COMMENCE ICI</div><h1>{signup?'Créer un compte':'Bon retour parmi nous.'}</h1><p>{signup?'Rejoignez des personnes autour de ce qui compte pour vous.':'Les liens qui comptent vous attendent.'}</p>
 <form onSubmit={submit}>{signup&&<label>Votre nom<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} autoComplete="name" /></label>}
 <label>Adresse électronique<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" /></label>
 <label>Mot de passe<input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={signup?'new-password':'current-password'} /></label>
 <button className="button primary" disabled={busy}>{busy?'Un instant…':signup?'Créer mon compte':'Se connecter'}</button></form>
 <button className="button secondary" onClick={google} disabled={busy}>Continuer avec Google</button>
 {!signup&&<button className="link-button" onClick={reset} disabled={busy}>Mot de passe oublié ?</button>}
 <p role="alert" className="form-error">{error}</p><p role="status">{notice}</p>
 <p>{signup?'Déjà membre ?':'Nouveau ici ?'} <a href={signup?'/connexion':'/inscription'}>{signup?'Se connecter':'Créer un compte'}</a></p></div>;
}
