// Loads src/data/highlights.yaml for the "At a Glance" cards.
import { getCollection, type CollectionEntry } from 'astro:content';
import { scholar } from './scholar';

export type Highlight = CollectionEntry<'highlights'>['data'];

// Fill "{citations}" and "{h_index}" from scholar.json, and use non-breaking hyphens so
// words like "low-resource" never split across lines.
function text(s: string): string {
  return s
    .replace(/\{citations\}/g, scholar.citations.toLocaleString('en-US'))
    .replace(/\{h_index\}/g, String(scholar.h_index))
    .replace(/(\w)-(?=\w)/g, '$1\u2011');
}

function deep<T>(v: T): T {
  if (typeof v === 'string') return text(v) as T;
  if (Array.isArray(v)) return v.map(deep) as T;
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)])) as T;
  }
  return v;
}

export async function getHighlights(): Promise<Highlight[]> {
  // Link targets are URLs, so they skip the text pass (it would turn their hyphens non-breaking).
  return (await getCollection('highlights')).map(({ data }) => {
    const out = deep(data);
    if (data.table && out.table) out.table.links = data.table.links;
    return out;
  });
}
