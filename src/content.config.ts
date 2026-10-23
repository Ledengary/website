// Schemas for everything in src/data/. A missing or misspelled field fails the
// build with a message naming the file and the field.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// A YAML file holding one object (e.g. profile.yaml) becomes a single entry.
const single = (id: string) => (text: string) => [{ id, ...parse(text) }];

// A YAML list whose items don't need hand-written ids.
const list = (prefix: string) => (text: string) =>
  ((parse(text) ?? []) as Record<string, unknown>[]).map((item, i) => ({ id: `${prefix}-${i}`, ...item }));

const link = z.object({ label: z.string(), url: z.string() });

const profile = defineCollection({
  loader: file('src/data/profile.yaml', { parser: single('profile') }),
  schema: z.object({
    name: z.string(),
    name_variants: z.array(z.string()).default([]),
    roles: z.array(z.object({ title: z.string(), rest: z.string() })),
    links: z.array(link.extend({ icon: z.enum(['scholar', 'github', 'linkedin', 'email', 'resume']) })),
    thesis: z.string().optional(),
    email: z.email(),
    scholar_url: z.url(),
    intro: z.string(),
    seo: z.object({ description: z.string() }),
  }),
});

const news = defineCollection({
  loader: file('src/data/news.yaml', { parser: list('news') }),
  schema: z.object({
    date: z.string().regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, 'use "YYYY-MM" or "YYYY"'),
    category: z.enum(['publication', 'abstract', 'talk', 'honor', 'career', 'teaching', 'media']),
    title: z.string(),
    body: z.string(), // inline Markdown
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]), // shown as buttons after the text
  }),
});

const collaborators = defineCollection({
  loader: file('src/data/collaborators.yaml', { parser: (text) => ((parse(text) ?? []) as Record<string, unknown>[]).map((c, order) => ({ id: `collaborator-${order}`, order, ...c })) }),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    logo: z.string(),
    height: z.number().positive(),
  }),
});

// "At a Glance" cards on Home.
const highlights = defineCollection({
  loader: file('src/data/highlights.yaml', { parser: list('highlight') }),
  schema: z.object({
    kicker: z.string(),
    figure: z.object({ value: z.string(), unit: z.string() }),
    caption: z.string(),
    rows: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    table: z
      .object({
        head: z.tuple([z.string(), z.string(), z.string()]).optional(),
        rows: z.array(z.tuple([z.string(), z.string(), z.string()])),
        links: z.record(z.string(), z.string()).optional(), // middle-column text -> link target
      })
      .optional(),
    pairs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    footnote: z.string(),
  }),
});

// Papers on /research.
const publications = defineCollection({
  // `order` records each paper's position in the file, since collections don't keep file order.
  loader: file('src/data/publications.yaml', {
    parser: (text) => ((parse(text) ?? []) as Record<string, unknown>[]).map((p, order) => ({ ...p, order })),
  }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue_short: z.string().optional(),
    venue_full: z.string().optional(),
    year: z.number().int().optional(),
    type: z.enum(['main-conference', 'conference', 'journal', 'abstract', 'preprint']),
    theme: z.enum(['confidence', 'oncology', 'earlier']),
    subgroup: z.string(),
    tags: z.array(z.enum(['core-cs', 'oncology', 'medical', 'finance'])).default([]),
    highlight: z.string().optional(),
    status_note: z.string().optional(),
    short_name: z.string(),
    links: z
      .object({
        paper: z.url().optional(),
        code: z.url().optional(),
        data: z.url().optional(),
        video: z.url().optional(),
        arxiv: z.url().optional(),
      })
      .default({}),
  }),
});

// About page (src/data/about/*.yaml). Order is the file order.
const ordered = (prefix: string) => (text: string) =>
  ((parse(text) ?? []) as Record<string, unknown>[]).map((item, order) => ({ id: `${prefix}-${order}`, order, ...item }));
const aboutLink = z.object({ label: z.string(), url: z.string(), group: z.string().optional() });
const orgEntry = z.object({
  order: z.number(),
  org: z.string(),
  role: z.string(),
  dates: z.string(),
  detail: z.string().optional(),
  logo: z.string().optional(),
  links: z.array(aboutLink).default([]),
  thesis: z.object({ title: z.string(), url: z.string().optional(), sentence: z.string() }).optional(),
  courses: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        terms: z.string(),
        size: z.string().optional(),
        links: z.array(aboutLink).default([]),
        materials: z.array(aboutLink).default([]), // one shared icon, label-only buttons kept together
      }),
    )
    .optional(),
});
const aboutRow = z.object({
  order: z.number(),
  title: z.string(),
  year: z.string().optional(),
  text: z.string().default(''),
  logo: z.string().optional(),
  links: z.array(aboutLink).default([]),
});
// Media coverage (src/data/media.yaml): About › In the Media, News, and the paper rows on /research.
const media = defineCollection({
  loader: file('src/data/media.yaml', { parser: (text) => (parse(text) ?? []) as Record<string, unknown>[] }),
  schema: z.object({
    id: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use "YYYY-MM-DD"'),
    outlet: z.string(),
    outlet_short: z.string(),
    format: z.enum(['article', 'radio', 'tv']),
    title: z.string(),
    byline: z.string().optional(),
    url: z.url(),
    cta: z.enum(['Read', 'Listen', 'Watch']),
    logo: z.string().optional(),
    related_paper: z.string(), // a publication id
  }),
});

// Talks and posters with photos or video (src/data/presentations.yaml): /research › Presentations.
const presType = z.enum(['talk', 'oral', 'invited', 'rapid-fire', 'spotlight', 'poster', 'tutorial', 'guest-lecture']);
const presentations = defineCollection({
  loader: file('src/data/presentations.yaml', { parser: (text) => (parse(text) ?? []) as Record<string, unknown>[] }),
  schema: z
    .object({
      id: z.string(),
      date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, 'use "YYYY-MM-DD", "YYYY-MM" or "YYYY"'), // shown as month and year
      event: z.string(),
      location: z.string().optional(),
      title: z.string(),
      type: presType,
      related_paper: z.string().optional(), // a publication id
      also: z.array(z.object({ title: z.string(), type: presType, related_paper: z.string().optional() })).default([]),
      youtube: z.object({ id: z.string(), start: z.number().int().nonnegative().optional() }).optional(),
      photos: z.array(z.object({ file: z.string(), caption: z.string(), alt: z.string(), position: z.string().optional() })).default([]),
      links: z.object({ slides: z.url().optional(), paper: z.url().optional() }).default({}),
    })
    .refine((p) => p.youtube || p.photos.length > 0, 'needs photos or a video'),
});

const aboutOrgs = (name: string) =>
  defineCollection({ loader: file(`src/data/about/${name}.yaml`, { parser: ordered(name) }), schema: orgEntry });
const aboutRows = (name: string) =>
  defineCollection({ loader: file(`src/data/about/${name}.yaml`, { parser: ordered(name) }), schema: aboutRow });

export const collections = {
  experience: aboutOrgs('experience'),
  education: aboutOrgs('education'),
  teaching: aboutOrgs('teaching'),
  honors: aboutRows('honors'),
  service: aboutRows('service'),
  beyond: aboutRows('beyond'),
  media,
  presentations,
  publications,
  profile,
  news,
  collaborators,
  highlights,
};
