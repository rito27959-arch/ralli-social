import type { APIRoute } from 'astro';
import { sameOrigin } from '../../lib/session';
export const POST:APIRoute=({request,cookies})=>{
 if(!sameOrigin(request) || !cookies.get('ralli_csrf')?.value || request.headers.get('x-csrf-token')!==cookies.get('ralli_csrf')?.value)
  return new Response('CSRF',{status:403});
 cookies.delete('ralli_session',{path:'/'});
 return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
};
