// @ts-check
import { defineConfig } from 'astro/config';

// Where the site is served: '/website' for the GitHub Pages preview (ledengary.github.io/website/).
// Switch to '/' (and add public/CNAME) for the custom domain. See docs/LAUNCH.md.
const base = '/website';

export default defineConfig({
  site: 'https://www.khanmohammadi.me',
  base,
  output: 'static',
  devToolbar: { enabled: false },
  // The Academic page became About.
  redirects: { '/academic': `${base.replace(/\/$/, '')}/about/` },
});
