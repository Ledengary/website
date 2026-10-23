// Tiny inline-Markdown renderer for data-file text: [link](url), **bold**, *italic*.
// Everything else is HTML-escaped, so data files can't inject markup.
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(src: string): string {
  return escape(src.trim().replace(/\s+/g, ' '))
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}

// Plain data text with key figures marked as ==…== in the YAML ("==top 0.4%==") set in petrol,
// and [text](url) links. Everything else is HTML-escaped.
export function figures(src: string): string {
  return escape(src)
    .replace(/==([^=]+)==/g, '<span class="fig">$1</span>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
}

// Paragraphs separated by blank lines, each rendered with `inline`.
export function paragraphs(src: string): string[] {
  return src.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map(inline);
}

// "2025-09" -> "Sep 2025"; "2023" -> "2023"
export function shortMonthYear(date: string): string {
  const [y, m] = date.split('-').map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
