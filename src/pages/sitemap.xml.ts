import type {APIRoute} from 'astro';
const paths=['','fonctionnalites','communautes','createurs','entreprises','tarifs','a-propos','contact','aide','faq','confidentialite','conditions','publicite','cookies','signalement','accessibilite'];
export const GET:APIRoute=({site})=>new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${new URL('/'+p,site??'http://localhost:4321')}</loc></url>`).join('')}</urlset>`,{headers:{'content-type':'application/xml'}});
