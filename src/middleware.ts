import { defineMiddleware } from 'astro:middleware';

// Runs on every page at build time, so links from components, data files and Markdown are all covered.
//
// 1. Base path: the site may be served under a sub-path (astro.config.mjs `base`, e.g. '/website' for
//    the GitHub Pages preview). Root-relative URLs written in code and data ("/about/", "/resume.pdf",
//    "/research#ccps-emnlp25", "/icons/…") get that prefix here; Astro already prefixes its own
//    assets. With base '/' nothing changes.
// 2. Links that leave the site (and the resume PDF) open in a new tab. Pages within the site and mailto:
//    links keep the normal same-tab behaviour.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, ''); // '' or '/website'
const NEW_TAB = /^(https?:)?\/\/|\/resume\.pdf$/;

const withBase = (url: string) =>
  BASE && url.startsWith('/') && !url.startsWith('//') && url !== BASE && !url.startsWith(`${BASE}/`) ? BASE + url : url;

function rewrite(html: string): string {
  if (BASE) {
    html = html.replace(/(<(?:a|link|img|source|script|iframe|form)\b[^>]*?\s(?:href|src|action)=")([^"]*)"/g, (_m, pre: string, url: string) => `${pre}${withBase(url)}"`);
  }
  return html.replace(/<a\b([^>]*)>/g, (tag, attrs: string) => {
    const href = /\shref="([^"]*)"/.exec(attrs)?.[1];
    if (!href || !NEW_TAB.test(href) || /\starget=/.test(attrs)) return tag;
    return `<a${attrs} target="_blank" rel="noopener noreferrer">`;
  });
}

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  return new Response(rewrite(await response.text()), {
    status: response.status,
    headers: response.headers,
  });
});
