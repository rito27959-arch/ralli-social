import { access } from 'node:fs/promises';

// Rolldown is imported by the generated Astro SSR entry. Its native package
// must be present in the isolated Vercel function, not just in root node_modules.
const binding = new URL(
  '../.vercel/output/functions/_render.func/node_modules/@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node',
  import.meta.url
);
try {
  await access(binding);
} catch {
  throw new Error('Vercel SSR bundle is missing the Rolldown Linux native binding');
}
