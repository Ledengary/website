// @ts-check
import { defineConfig } from 'astro/config';

// Where the site is served: '/' on the custom domain www.khanmohammadi.me (public/CNAME).
// Set to a sub-path such as '/website' to serve from ledengary.github.io/website/ instead. See docs/LAUNCH.md.
const base = '/';

export default defineConfig({
  site: 'https://www.khanmohammadi.me',
  base,
  output: 'static',
  devToolbar: { enabled: false },
  // The Academic page became About.
  redirects: { '/academic': `${base.replace(/\/$/, '')}/about/` },
});
