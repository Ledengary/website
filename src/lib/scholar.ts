// Google Scholar metrics. src/data/scholar.json will later be rewritten by a scheduled
// GitHub Action; validating it here means a malformed update fails the build instead of
// shipping "undefined citations".
import { z } from 'astro/zod';
import raw from '../data/scholar.json';

export const scholar = z
  .object({
    citations: z.number().int().nonnegative(),
    h_index: z.number().int().nonnegative(),
    i10_index: z.number().int().nonnegative(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .parse(raw);
