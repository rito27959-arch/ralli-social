import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: vercel({ includeFiles: [
    'node_modules/@rolldown/binding-linux-x64-gnu/package.json',
    'node_modules/@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node'
  ] }),
  integrations: [react()],
  vite: { plugins: [tailwindcss()] }
});
