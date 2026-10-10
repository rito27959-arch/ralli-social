import type {APIRoute} from 'astro';
import {sameOrigin} from '../../../lib/session';
export const POST:APIRoute=async ({request,cookies})=>{
 if(!sameOrigin(request)||request.headers.get('x-csrf-token')!==cookies.get('ralli_csrf')?.value)return new Response('CSRF',{status:403});
 try{
  const session=cookies.get('ralli_session')?.value;
  if(!session)return new Response('Non authentifié',{status:401});
  const {adminAuth,adminDb}=await import('../../../lib/firebase.server');
  const user=await adminAuth().verifySessionCookie(session,true);
  if(user.admin!==true)return new Response('Accès refusé',{status:403});
  const {reportId}=await request.json() as {reportId?:string};
  if(!reportId||!/^[A-Za-z0-9_-]{1,128}$/.test(reportId))return new Response('Identifiant invalide',{status:400});
  const ref=adminDb().doc(`reports/${reportId}`);
  await adminDb().runTransaction(async t=>{
   const snap=await t.get(ref);
   if(!snap.exists||snap.data()?.status!=='open')throw new Error('Rapport indisponible');
   t.update(ref,{status:'reviewed',reviewedBy:user.uid,reviewedAt:new Date()});
   t.create(adminDb().collection('auditLogs').doc(),{actorId:user.uid,action:'report.reviewed',targetId:reportId,createdAt:new Date()});
  });
  return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
 }catch{return new Response('Action refusée',{status:403});}
};
