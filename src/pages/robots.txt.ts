import type {APIRoute} from 'astro';
export const GET:APIRoute=({site})=>new Response(`User-agent: *\nDisallow: /app/\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${new URL('/sitemap.xml',site??'http://localhost:4321')}\n`,{headers:{'content-type':'text/plain'}});
