// Daily Google Scholar update (run by .github/workflows/update-scholar.yml).
// One SerpApi request (engine=google_scholar_author) per run; rewrites src/data/scholar.json only when
// the numbers pass validation and changed, or when last_checked is 30+ days old (keeps the repo active
// so GitHub doesn't pause the schedule). On any problem it keeps the file as is and exits 0 with a warning.
// No dependencies; needs Node 18+ (global fetch). The API key is never logged.
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/scholar.json', import.meta.url);
const AUTHOR_ID = 'DadaCmsAAAAJ';
const MAX_DROP = 0.05; // citations may not fall more than 5% in one update (Scholar glitches)
const REFRESH_DAYS = 30;

const warn = (msg) => {
  console.log(`::warning::${msg} Keeping src/data/scholar.json unchanged.`);
  process.exit(0);
};

const key = process.env.SERPAPI_KEY;
if (!key) warn('SERPAPI_KEY is not set.');

const current = JSON.parse(await readFile(FILE, 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const url = new URL('https://serpapi.com/search.json');
url.search = new URLSearchParams({ engine: 'google_scholar_author', author_id: AUTHOR_ID, hl: 'en', api_key: key }).toString();

let data;
try {
  console.log(`SerpApi request: engine=google_scholar_author author_id=${AUTHOR_ID}`); // exactly one per run
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) warn(`SerpApi request failed (HTTP ${res.status}): ${data.error ?? 'no details'}.`);
} catch (e) {
  warn(`SerpApi request failed: ${e.name}.`);
}

// cited_by.table: [{ citations: { all, since_YYYY } }, { h_index: {...} }, { i10_index: {...} }]
const table = data?.cited_by?.table ?? [];
const pick = (name) => table.find((row) => row[name])?.[name]?.all;
const next = { citations: pick('citations'), h_index: pick('h_index'), i10_index: pick('i10_index') };
console.log(`Scholar now: citations=${next.citations} h_index=${next.h_index} i10_index=${next.i10_index}`);
console.log(`Stored:      citations=${current.citations} h_index=${current.h_index} i10_index=${current.i10_index}`);

for (const [k, v] of Object.entries(next)) {
  if (!Number.isInteger(v) || v <= 0) warn(`Invalid ${k}: ${JSON.stringify(v)}.`);
}
if (current.citations > 0 && next.citations < current.citations * (1 - MAX_DROP)) {
  warn(`Citations dropped from ${current.citations} to ${next.citations} (more than ${MAX_DROP * 100}%).`);
}

const changed = ['citations', 'h_index', 'i10_index'].some((k) => next[k] !== current[k]);
const lastChecked = current.last_checked ?? current.updated;
const stale = (Date.parse(today) - Date.parse(lastChecked)) / 86_400_000 >= REFRESH_DAYS;

if (!changed && !stale) {
  console.log('No change; file left as is.');
  process.exit(0);
}
const out = changed ? { ...next, updated: today, last_checked: today } : { ...current, last_checked: today };
await writeFile(FILE, JSON.stringify(out) + '\n');
console.log(changed ? 'Numbers changed; scholar.json updated.' : `Unchanged for ${REFRESH_DAYS}+ days; refreshed last_checked.`);
