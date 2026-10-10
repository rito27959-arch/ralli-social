import {beforeAll,afterAll,beforeEach,describe,it} from 'vitest';
import {initializeTestEnvironment,assertFails,assertSucceeds,type RulesTestEnvironment} from '@firebase/rules-unit-testing';
import {readFileSync} from 'node:fs';
import {doc,setDoc,getDoc,serverTimestamp,deleteDoc} from 'firebase/firestore';
let env:RulesTestEnvironment;
beforeAll(async()=>{
 if(!process.env.FIRESTORE_EMULATOR_HOST)throw new Error('Exécutez npm run test:rules avec les émulateurs.');
 env=await initializeTestEnvironment({projectId:'demo-ralli-rules',firestore:{rules:readFileSync('firestore.rules','utf8')},storage:{rules:readFileSync('storage.rules','utf8')}});
});
afterAll(async()=>{await env?.cleanup()});
beforeEach(async()=>{await env.clearFirestore();await env.clearStorage()});
describe('isolation des comptes',()=>{
 it('refuse la modification du profil d’autrui et des droits premium',async()=>{
  await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'users/alice'),{uid:'alice',displayName:'Alice',bio:'',role:'user',plan:'free'})});
  const bob=env.authenticatedContext('bob').firestore(),alice=env.authenticatedContext('alice').firestore();
  await assertFails(setDoc(doc(bob,'users/alice'),{displayName:'Intrus'},{merge:true}));
  await assertFails(setDoc(doc(alice,'users/alice'),{plan:'business'},{merge:true}));
  await assertSucceeds(setDoc(doc(alice,'users/alice'),{displayName:'Alice 2',bio:''},{merge:true}));
 });
 it('permet une publication propre, refuse usurpation et suppression d’autrui',async()=>{
  const alice=env.authenticatedContext('alice').firestore(),bob=env.authenticatedContext('bob').firestore();
  const payload={authorId:'alice',body:'Bonjour',imageURLs:[],visibility:'public',createdAt:serverTimestamp(),updatedAt:serverTimestamp()};
  await assertSucceeds(setDoc(doc(alice,'posts/post1'),payload));
  await assertFails(setDoc(doc(bob,'posts/post2'),payload));
  await assertFails(deleteDoc(doc(bob,'posts/post1')));
 });
 it('isole les conversations et les données financières',async()=>{
  await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'conversations/private'),{members:['alice','bob']});await setDoc(doc(ctx.firestore(),'payments/p1'),{amount:199})});
  await assertSucceeds(getDoc(doc(env.authenticatedContext('alice').firestore(),'conversations/private')));
  await assertFails(getDoc(doc(env.authenticatedContext('eve').firestore(),'conversations/private')));
  await assertFails(getDoc(doc(env.authenticatedContext('alice').firestore(),'payments/p1')));
 });
});
describe('fichiers médias',()=>{
 it('autorise une petite image propre, refuse un autre compte et un PDF',async()=>{
  const alice=env.authenticatedContext('alice').storage('gs://demo-ralli-rules.appspot.com');
  const bob=env.authenticatedContext('bob').storage('gs://demo-ralli-rules.appspot.com');
  await assertSucceeds(Promise.resolve(alice.ref('posts/alice/example.webp').put(new Uint8Array([1,2,3]),{contentType:'image/webp'})));
  await assertFails(Promise.resolve(bob.ref('posts/alice/intrusion.webp').put(new Uint8Array([1,2,3]),{contentType:'image/webp'})));
  await assertFails(Promise.resolve(alice.ref('posts/alice/file.pdf').put(new Uint8Array([1,2,3]),{contentType:'application/pdf'})));
 });
});
