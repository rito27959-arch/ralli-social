// Temporary production diagnostic: classify failures without returning exception text.
import { readFile, writeFile } from 'node:fs/promises';

const directory = new URL('../.vercel/output/functions/_render.func/', import.meta.url);
const configUrl = new URL('.vc-config.json', directory);
const config = JSON.parse(await readFile(configUrl, 'utf8'));
if (config.handler !== 'dist/server/entry.mjs') {
  throw new Error('Unexpected Astro Vercel function handler');
}

const wrapper = `let entry;
async function load() {
  if (!entry) entry = import('./dist/server/entry.mjs').then((module) => module.default);
  return entry;
}
function diagnostic(stage, error) {
  const code = typeof error?.code === 'string' && /^[A-Z_]{2,40}$/.test(error.code) ? error.code : 'NONE';
  const name = typeof error?.name === 'string' && /^[A-Za-z]{1,40}$/.test(error.name) ? error.name : 'Error';
  const message = typeof error?.message === 'string' ? error.message : '';
  const trace = typeof error?.stack === 'string' ? error.stack : '';
  const source = ['rolldown', 'sharp', 'firebase-admin', '@vercel/routing-utils', 'astro', 'react'].find((module) =>
    message.includes(module) || trace.includes('/node_modules/' + module + '/')) || 'unknown';
  const reason = /native binding/i.test(message) ? 'native-binding'
    : /cannot find|not found|could not resolve/i.test(message) ? 'missing-dependency'
    : /invalid|unsupported/i.test(message) ? 'invalid-runtime'
    : /permission|access denied/i.test(message) ? 'permissions'
    : /environment|configuration|config/i.test(message) ? 'configuration'
    : 'unknown';
  return new Response(JSON.stringify({ stage, code, name, source, reason }), {
    status: 500,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
export default {
  async fetch(request) {
    let handler;
    try { handler = await load(); } catch (error) { return diagnostic('import', error); }
    try { return await handler.fetch(request); } catch (error) { return diagnostic('request', error); }
  }
};
`;
await writeFile(new URL('diagnostic-entry.mjs', directory), wrapper);
config.handler = 'diagnostic-entry.mjs';
await writeFile(configUrl, JSON.stringify(config));
