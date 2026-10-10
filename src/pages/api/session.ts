import type { APIRoute } from 'astro';
import { sameOrigin } from '../../lib/session';

export const POST:APIRoute=async ({request,cookies})=>{
 if(!sameOrigin(request) || !cookies.get('ralli_csrf')?.value || request.headers.get('x-csrf-token') !== cookies.get('ralli_csrf')?.value)
  return new Response('CSRF',{status:403});
 try {
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
  if(!token) return new Response('Token absent',{status:401});
  const {adminAuth,adminDb}=await import('../../lib/firebase.server');
  const decoded=await adminAuth().verifyIdToken(token,true);
  if(decoded.email && !decoded.email_verified)return new Response('Adresse électronique non vérifiée',{status:403});
  if(Date.now()/1000 - decoded.auth_time > 300) return new Response('Connexion trop ancienne',{status:401});
  const cookie=await adminAuth().createSessionCookie(token,{expiresIn:5*24*60*60*1000});
  const ref=adminDb().doc(`users/${decoded.uid}`);
  if(!(await ref.get()).exists) {
   const safeName=(decoded.name || decoded.email?.split('@')[0] || 'Membre').slice(0,80);
   await ref.create({uid:decoded.uid,handle:`u_${decoded.uid.slice(0,16)}`,displayName:safeName,bio:'',photoURL:'',coverURL:'',createdAt:new Date()}).catch(e=>{if(e.code!==6)throw e});
  }
  cookies.set('ralli_session',cookie,{httpOnly:true,secure:import.meta.env.PROD,sameSite:'lax',path:'/',maxAge:5*24*60*60});
  return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
 }catch{return new Response('Session refusée',{status:401});}
};
