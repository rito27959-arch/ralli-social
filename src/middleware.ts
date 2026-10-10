import { defineMiddleware } from 'astro:middleware';
export const onRequest=defineMiddleware(async (context,next)=>{
 const {pathname}=new URL(context.request.url);
 if(!pathname.startsWith('/app') && !pathname.startsWith('/admin'))return next();
 const cookie=context.cookies.get('ralli_session')?.value;
 if(!cookie)return context.redirect('/connexion');
 try {
  const {adminAuth}=await import('./lib/firebase.server');
  const user=await adminAuth().verifySessionCookie(cookie,true);
  if(pathname.startsWith('/admin') && user.admin!==true)return new Response('Accès refusé',{status:403});
  context.locals.userId=user.uid;
  const response=await next();
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('X-Robots-Tag','noindex, nofollow');
  return response;
 }catch{context.cookies.delete('ralli_session',{path:'/'});return context.redirect('/connexion');}
});
