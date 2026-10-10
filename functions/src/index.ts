import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { createHash } from 'node:crypto';
import { z } from 'zod';

initializeApp();
const db = getFirestore();
const options = { enforceAppCheck: true, maxInstances: 30, region: 'europe-west1' } as const;
const text = z.string().trim().min(1).max(2000);
const id = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
const short = z.string().trim().min(2).max(80);
function actor(request: {auth?: {uid:string}}) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Connectez-vous.');
  return request.auth.uid;
}
function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw new HttpsError('invalid-argument', 'Données invalides.');
  return result.data;
}
async function limit(uid:string, action:string, intervalMs:number) {
  const ref = db.doc(`rateLimits/${uid}_${action}`);
  await db.runTransaction(async t => {
    const snap = await t.get(ref);
    if (snap.exists && Date.now() - (snap.data()?.at ?? 0) < intervalMs) throw new HttpsError('resource-exhausted','Réessayez un peu plus tard.');
    t.set(ref,{at:Date.now()});
  });
}

export const toggleLike = onCall(options, async req => {
  const uid = actor(req);
  const { postId } = parse(z.object({postId:id}),req.data);
  const post = db.doc(`posts/${postId}`);
  const like = post.collection('likes').doc(uid);
  return db.runTransaction(async t => {
    const p = await t.get(post), l = await t.get(like);
    if (!p.exists || p.data()?.visibility !== 'public') throw new HttpsError('not-found','Publication introuvable.');
    if (l.exists) t.delete(like); else t.set(like,{uid,createdAt:FieldValue.serverTimestamp()});
    return {liked:!l.exists};
  });
});

export const toggleFollow = onCall(options, async req => {
  const uid = actor(req);
  const { target } = parse(z.object({target:id}),req.data);
  if (uid === target) throw new HttpsError('invalid-argument','Compte identique.');
  const user = db.doc(`users/${target}`);
  const ref = db.doc(`follows/${uid}_${target}`);
  return db.runTransaction(async t => {
    const u = await t.get(user), f = await t.get(ref);
    if (!u.exists) throw new HttpsError('not-found','Compte introuvable.');
    if (f.exists) t.delete(ref); else t.set(ref,{followerId:uid,followingId:target,createdAt:FieldValue.serverTimestamp()});
    return {following:!f.exists};
  });
});

export const createCommunity = onCall(options, async req => {
  const uid = actor(req);
  await limit(uid,'community',30_000);
  const input = parse(z.object({name:short,description:z.string().trim().max(500),visibility:z.enum(['public','private'])}),req.data);
  const ref=db.collection('communities').doc();
  const batch=db.batch();
  batch.set(ref,{...input,ownerId:uid,createdAt:FieldValue.serverTimestamp(),status:'active'});
  batch.set(ref.collection('members').doc(uid),{uid,role:'owner',joinedAt:FieldValue.serverTimestamp()});
  await batch.commit();
  return {id:ref.id};
});

export const joinCommunity = onCall(options, async req => {
  const uid=actor(req);
  const {communityId}=parse(z.object({communityId:id}),req.data);
  const ref=db.doc(`communities/${communityId}`);
  const member=ref.collection('members').doc(uid);
  await db.runTransaction(async t=>{
    const c=await t.get(ref),m=await t.get(member);
    if (!c.exists || c.data()?.visibility!=='public' || c.data()?.status!=='active') throw new HttpsError('permission-denied','Communauté indisponible.');
    if (!m.exists) t.set(member,{uid,role:'member',joinedAt:FieldValue.serverTimestamp()});
  });
  return {joined:true};
});

export const createEvent = onCall(options, async req => {
  const uid=actor(req);
  await limit(uid,'event',15_000);
  const input=parse(z.object({title:short,description:z.string().trim().max(1000),startAt:z.number().int(),timezone:z.string().min(2).max(64),place:z.string().trim().min(2).max(160),capacity:z.number().int().min(1).max(10000)}),req.data);
  if(input.startAt<Date.now()+60_000) throw new HttpsError('invalid-argument','Choisissez une date future.');
  const ref=db.collection('events').doc();
  await ref.set({...input,startAt:Timestamp.fromMillis(input.startAt),ownerId:uid,status:'active',attendeeCount:0,createdAt:FieldValue.serverTimestamp()});
  return {id:ref.id};
});

export const rsvpEvent = onCall(options,async req=>{
  const uid=actor(req);
  const {eventId}=parse(z.object({eventId:id}),req.data);
  const event=db.doc(`events/${eventId}`), attendee=event.collection('attendees').doc(uid);
  await db.runTransaction(async t=>{
    const e=await t.get(event),a=await t.get(attendee);
    if(!e.exists || e.data()?.status!=='active' || e.data()?.startAt.toMillis()<=Date.now()) throw new HttpsError('failed-precondition','Événement indisponible.');
    if(a.exists)return;
    if(e.data()!.attendeeCount>=e.data()!.capacity)throw new HttpsError('resource-exhausted','Complet.');
    t.create(attendee,{uid,joinedAt:FieldValue.serverTimestamp()});
    t.update(event,{attendeeCount:FieldValue.increment(1)});
  });
  return {joined:true};
});

export const sendMessage = onCall(options,async req=>{
  const uid=actor(req);
  await limit(uid,'message',1000);
  const {recipientId,body}=parse(z.object({recipientId:id,body:text.max(1000)}),req.data);
  if(uid===recipientId)throw new HttpsError('invalid-argument','Destinataire identique.');
  const target=await db.doc(`users/${recipientId}`).get();
  if(!target.exists)throw new HttpsError('not-found','Destinataire introuvable.');
  const blocked=await db.getAll(db.doc(`blocks/${uid}_${recipientId}`),db.doc(`blocks/${recipientId}_${uid}`));
  if(blocked.some(s=>s.exists))throw new HttpsError('permission-denied','Conversation indisponible.');
  const cid=createHash('sha256').update([uid,recipientId].sort().join(':')).digest('hex');
  const ref=db.doc(`conversations/${cid}`);
  const msg=ref.collection('messages').doc();
  const batch=db.batch();
  batch.set(ref,{members:[uid,recipientId].sort(),updatedAt:FieldValue.serverTimestamp()}, {merge:true});
  batch.create(msg,{senderId:uid,body,createdAt:FieldValue.serverTimestamp()});
  await batch.commit();
  return {conversationId:cid,messageId:msg.id};
});

export const reportContent = onCall(options,async req=>{
  const uid=actor(req);
  await limit(uid,'report',60_000);
  const data=parse(z.object({kind:z.enum(['post','user','message']),targetId:id,reason:z.string().trim().min(10).max(500)}),req.data);
  await db.collection('reports').add({...data,reporterId:uid,status:'open',createdAt:FieldValue.serverTimestamp()});
  return {received:true};
});
