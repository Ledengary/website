// The /research category selector: one state drives the buttons, the band, the SVG outline and the
// list. These tests check the geometry and state invariants numerically across widths, pixel ratios,
// zoom levels and interactions, and save close-up screenshots of the joins in test-results/shots/.
import { test, expect, type Page, type Browser } from '@playwright/test';
import fs from 'node:fs';
import astroConfig from '../astro.config.mjs';

// The site's base path ('' or e.g. '/website'), from astro.config.mjs.
const B = (astroConfig.base ?? '/').replace(/\/$/, '');

const TOL = 0.5;
const THEMES = ['confidence', 'oncology', 'earlier'] as const;
const SETTLE = 900; // smooth scroll + settle re-check

type Probe = Awaited<ReturnType<typeof probe>>;

// Everything measured in one pass, in viewport coordinates.
async function probe(page: Page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-pub-filter]')!;
    const svg = document.querySelector('.tab-outline') as SVGSVGElement;
    const stroke = svg.querySelector('.tab-outline__stroke')!;
    const strip = document.querySelector('.cat-cards') as HTMLElement;
    const list = document.querySelector('#pub-list')!;
    const sel = document.querySelector('.cat-card[aria-pressed="true"]') as HTMLElement | null;
    const narrow = matchMedia('(max-width: 639px)').matches;
    const d = stroke.getAttribute('d');
    // Parse "M x y H x A rx ry rot large sweep x y V y ..." into points for each command.
    const cmds: { c: string; n: number[] }[] = [];
    if (d) for (const m of d.matchAll(/([MHVA])([^MHVA]*)/g)) cmds.push({ c: m[1], n: m[2].trim().split(/[\s,]+/).map(Number) });
    const r = (el: Element) => {
      const b = el.getBoundingClientRect();
      return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, width: b.width };
    };
    const svgBox = r(svg);
    const arrows = [...document.querySelectorAll('.cat-arrow')].map((a) => !a.classList.contains('is-off') && getComputedStyle(a).display !== 'none');
    const fades = [Number(strip.dataset.fadeLeft || 0) > 0, Number(strip.dataset.fadeRight || 0) > 0];
    return {
      key: sel?.dataset.theme ?? null,
      filtered: root.classList.contains('is-filtered'),
      narrow,
      svgShown: !svg.hasAttribute('hidden') && getComputedStyle(svg).display !== 'none',
      hasPath: !!d,
      cmds,
      svgBox,
      sel: sel ? r(sel) : null,
      list: r(list),
      strip: r(strip),
      bandShown: getComputedStyle(list, '::after').content !== 'none',
      scrollLeft: strip.scrollLeft,
      maxScroll: strip.scrollWidth - strip.clientWidth,
      arrows,
      fades,
      pageOverflow: document.scrollingElement!.scrollWidth - innerWidth,
      clientWidth: document.documentElement.clientWidth,
      themesShown: [...document.querySelectorAll('.pub-theme')].filter((t) => !(t as HTMLElement).hidden).map((t) => (t as HTMLElement).dataset.theme),
      allPressedLooksPlain: (() => {
        const all = document.querySelector('.cat-card--all') as HTMLElement | null;
        if (!all || all.getAttribute('aria-pressed') !== 'true' || !narrow) return true;
        const cs = getComputedStyle(all);
        return cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent';
      })(),
    };
  });
}

// The invariants. `inView`: the selected tab must sit fully inside the strip (true after a selection
// settles; false after a manual swipe, where it may legitimately be scrolled away).
function check(p: Probe, label: string, { inView = true } = {}) {
  const at = (s: string) => `${label}: ${s}`;
  expect(p.pageOverflow, at('no horizontal page scroll')).toBeLessThanOrEqual(0);

  // Arrows follow the scroll position (mobile only; never on desktop).
  const canL = p.narrow && p.maxScroll > 1 && p.scrollLeft > 1;
  const canR = p.narrow && p.maxScroll > 1 && p.scrollLeft < p.maxScroll - 1;
  expect(p.arrows, at('arrow visibility')).toEqual([canL, canR]);
  expect(p.fades, at('fade visibility')).toEqual([canL, canR]);

  const themeSelected = p.key !== null && p.key !== 'all';
  expect(p.filtered, at('band state matches selection')).toBe(themeSelected);
  if (!themeSelected) {
    expect(p.svgShown || p.hasPath, at('no path when nothing/All is selected')).toBe(false);
    expect(p.bandShown, at('no band when nothing/All is selected')).toBe(false);
    expect(p.themesShown, at('all themes listed')).toEqual(['confidence', 'oncology', 'earlier']);
    expect(p.allPressedLooksPlain, at('"All" has no pill')).toBe(true);
    return;
  }
  expect(p.themesShown, at('only the selected theme listed')).toEqual([p.key]);
  expect(p.svgShown && p.hasPath, at('path drawn')).toBe(true);
  expect(p.bandShown, at('band drawn')).toBe(true);

  const c = p.cmds;
  const ox = p.svgBox.left, oy = p.svgBox.top;
  const [M, A1, V1, A2, H1, A3, V2, A4] = c;
  expect(c.map((x) => x.c).join(''), at('tab outline shape')).toBe('MAVAHAVA');
  // Both ends of the tab outline land on the band line: its 2px stroke's top edge on the band's top.
  const lineY = oy + M.n[1];
  expect(Math.abs(lineY - 1 - p.list.top), at(`outline foot y ${lineY - 1} vs band top ${p.list.top}`)).toBeLessThanOrEqual(TOL);
  expect(Math.abs(oy + A4.n[6] - lineY), at('both feet on the line')).toBeLessThanOrEqual(TOL);
  // Tab segment hugs the selected tab (stroke centred 1px inside each edge).
  const L = ox + A1.n[5], R = ox + A3.n[5], T = oy + A2.n[6];
  void V1; void V2; void H1;
  expect(Math.abs(L - 1 - p.sel!.left), at(`tab left ${L - 1} vs ${p.sel!.left}`)).toBeLessThanOrEqual(TOL);
  expect(Math.abs(R + 1 - p.sel!.right), at(`tab right ${R + 1} vs ${p.sel!.right}`)).toBeLessThanOrEqual(TOL);
  expect(Math.abs(T - 1 - p.sel!.top), at(`tab top ${T - 1} vs ${p.sel!.top}`)).toBeLessThanOrEqual(TOL);
  // The tab reaches through the line into the band (no seam under it).
  expect(p.sel!.bottom, at('tab overlaps the band')).toBeGreaterThanOrEqual(p.list.top + 2);

  if (p.narrow && inView) {
    const fade = 18;
    const minL = p.strip.left + (p.fades[0] ? fade : 0);
    const maxR = p.strip.right - (p.fades[1] ? fade : 0);
    expect(p.sel!.left, at('tab clear of the left arrow/fade')).toBeGreaterThanOrEqual(minL - TOL);
    expect(p.sel!.right, at('tab clear of the right arrow/fade')).toBeLessThanOrEqual(maxR + TOL);
  }
}

async function open(browser: Browser, width: number, height: number, dpr: number, opts: Parameters<Browser['newContext']>[0] = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, isMobile: width < 640, hasTouch: width < 640, ...opts });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(B + '/research');
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors };
}


// Pixel check on the band line's rows, across the full viewport width. The line's opening is the
// selected tab's full span (outer ends of its two 14px curves, 13px outside the tab), wherever the tab
// really is, including under an arrow zone or past the viewport edge:
// - outside the span every column is petrol;
// - inside it no column is petrol, except the ~8px at each end where the tab's own curve lifts off.
// Decoded in the page's canvas.
async function scanBandLine(page: Page, label: string) {
  // Plain viewport captures only: a full-page capture resizes the viewport, which makes the page
  // re-layout mid-capture. So bring the line into view first.
  await page.evaluate(() => {
    const t = document.querySelector('#pub-list')!.getBoundingClientRect().top;
    if (t < 60 || t > innerHeight - 60) window.scrollBy(0, t - innerHeight / 2);
  });
  await page.waitForTimeout(150);
  const geo = await page.evaluate(() => {
    const l = document.querySelector('#pub-list')!.getBoundingClientRect();
    const sel = document.querySelector('.cat-card[aria-pressed="true"]')!.getBoundingClientRect();
    const w = document.documentElement.clientWidth;
    // A tab reaching into a showing arrow's zone continues off-screen: no line from there to that edge.
    const v = document.querySelector('.cat-cards')!.getBoundingClientRect();
    const showing = (side: string) => getComputedStyle(document.querySelector(`.cat-arrow--${side}`)!).display !== 'none';
    let a = sel.left - 13, b = sel.right + 13;
    if (showing('left') && a < v.left) a = -100;
    if (showing('right') && b > v.right) b = w + 100;
    return { y: l.top, w, a, b, dpr: devicePixelRatio };
  });
  const png = await page.screenshot({ clip: { x: 0, y: geo.y, width: geo.w, height: 2 } });
  const res = await page.evaluate(async ({ b64, geo }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const cv = document.createElement('canvas');
    cv.width = img.width;
    cv.height = img.height;
    const cx = cv.getContext('2d')!;
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    const k = geo.dpr;
    const missing: number[] = [], stray: number[] = [];
    for (let x = 0; x < cv.width; x++) {
      let petrol = Infinity;
      for (let y = 0; y < cv.height; y++) {
        const i = (y * cv.width + x) * 4;
        petrol = Math.min(petrol, Math.hypot(d[i] - 14, d[i + 1] - 116, d[i + 2] - 144));
      }
      const cssX = (x + 0.5) / k;
      if (cssX < geo.a - 0.5 || cssX > geo.b + 0.5) {
        if (petrol > 60) missing.push(x);
      } else if (cssX > geo.a + 8 && cssX < geo.b - 8) {
        if (petrol < 90) stray.push(x);
      }
    }
    return { width: cv.width, missing, stray };
  }, { b64: png.toString('base64'), geo });
  expect(res.missing.length, `${label}: band line petrol outside the tab's span (gaps at ${res.missing.slice(0, 8).join(',')} of ${res.width})`).toBe(0);
  expect(res.stray.length, `${label}: no band line inside the tab's span (petrol at ${res.stray.slice(0, 8).join(',')})`).toBe(0);
}

// Symmetry: the two arrow zones are mirror images in their computed styles, and the strip fades
// the same width toward both of them.
async function checkSymmetry(page: Page, label: string) {
  const st = await page.evaluate(() => {
    const pick = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        display: cs.display,
        bg: cs.backgroundColor,
        z: cs.zIndex,
        w: cs.width,
        h: Math.round(r.height * 100) / 100,
        top: Math.round(r.top * 100) / 100,
        pos: cs.position,
        pad: cs.padding,
      };
    };
    const strip = document.querySelector('.cat-cards') as HTMLElement;
    return { al: pick('.cat-arrow--left'), ar: pick('.cat-arrow--right'), fl: strip.dataset.fadeLeft, fr: strip.dataset.fadeRight };
  });
  expect(st.ar, `${label}: arrow zones mirrored`).toEqual(st.al);
  expect(st.al.bg, `${label}: arrow zones white`).toBe('rgb(255, 255, 255)');
  expect(st.fl, `${label}: same fade both sides`).toBe(st.fr);
  expect(Number(st.fl), `${label}: fading`).toBeGreaterThan(0);
}

// Arrow-zone pixel check: above the band line, a showing arrow's zone is white except its chevron.
async function checkArrowZone(page: Page, side: 'left' | 'right', label: string) {
  const geo = await page.evaluate((side) => {
    const a = document.querySelector(`.cat-arrow--${side}`) as HTMLElement;
    const b = a.getBoundingClientRect();
    // The zone runs from the strip's edge out to the screen edge.
    const vw = document.documentElement.clientWidth;
    const r = side === 'left' ? { left: 0, right: b.right } : { left: b.left, right: vw };
    const ch = a.querySelector('svg')!.getBoundingClientRect();
    return { x: r.left, y: b.top, w: r.right - r.left, h: b.height, cx1: ch.left - r.left - 1, cx2: ch.right - r.left + 1, cy1: ch.top - b.top - 1, cy2: ch.bottom - b.top + 1, dpr: devicePixelRatio };
  }, side);
  const png = await page.screenshot({ clip: { x: geo.x, y: geo.y, width: geo.w, height: geo.h } });
  const bad = await page.evaluate(async ({ b64, geo }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const cv = document.createElement('canvas');
    cv.width = img.width;
    cv.height = img.height;
    const cx = cv.getContext('2d')!;
    cx.drawImage(img, 0, 0);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    const k = geo.dpr;
    let n = 0, sample = '';
    for (let y = 0; y < cv.height; y++)
      for (let x = 0; x < cv.width; x++) {
        if (x >= geo.cx1 * k && x <= geo.cx2 * k && y >= geo.cy1 * k && y <= geo.cy2 * k) continue; // the chevron
        const i = (y * cv.width + x) * 4;
        if (Math.hypot(255 - d[i], 255 - d[i + 1], 255 - d[i + 2]) > 6) {
          n++;
          if (!sample) sample = `(${x},${y}) rgb(${d[i]},${d[i + 1]},${d[i + 2]})`;
        }
      }
    return { n, sample };
  }, { b64: png.toString('base64'), geo });
  expect(bad.n, `${label}: ${side} arrow zone white except the chevron (first off pixel ${bad.sample})`).toBe(0);
}

// Scroll the strip so the selected tab sits partly (about half) under the given arrow zone.
// Returns false when the strip can't place it there (e.g. the first tab can't go under the right arrow).
async function placeUnder(page: Page, side: 'left' | 'right') {
  for (let i = 0; i < 3; i++) {
    await page.evaluate((side) => {
      const s = document.querySelector('.cat-cards') as HTMLElement;
      const v = s.getBoundingClientRect();
      const t = document.querySelector('.cat-card[aria-pressed="true"]')!.getBoundingClientRect();
      const half = t.width / 2;
      s.scrollLeft += side === 'left' ? t.left - (v.left - half) : t.right - (v.right + half);
    }, side);
    await settle(page, 300);
  }
  return page.evaluate((side) => {
    const v = document.querySelector('.cat-cards')!.getBoundingClientRect();
    const t = document.querySelector('.cat-card[aria-pressed="true"]')!.getBoundingClientRect();
    const arrow = document.querySelector(`.cat-arrow--${side}`) as HTMLElement;
    const showing = getComputedStyle(arrow).display !== 'none';
    return showing && (side === 'left' ? t.left < v.left - 4 && t.right > v.left + 4 : t.right > v.right + 4 && t.left < v.right - 4);
  }, side);
}
const button = (page: Page, key: string) => page.locator(`.cat-card[data-theme="${key}"]`);
// Wait until the strip and the page have stopped scrolling (and any settle re-check has run).
async function settle(page: Page, ms = SETTLE) {
  await page.waitForTimeout(Math.min(ms, 300));
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const s = document.querySelector('.cat-cards') as HTMLElement;
        const a = s.scrollLeft;
        setTimeout(() => resolve(s.scrollLeft === a), 250);
      }),
    null,
    { timeout: 5000 },
  );
  await page.waitForTimeout(Math.max(0, ms - 300));
}

async function shot(page: Page, name: string) {
  // A 2x crop around the selected tab and its joins.
  const box = await page.evaluate(() => {
    const s = document.querySelector('.cat-card[aria-pressed="true"]')?.getBoundingClientRect();
    const l = document.querySelector('#pub-list')!.getBoundingClientRect();
    return s ? { x: Math.max(0, s.left - 40), y: Math.max(0, s.top - 20), w: s.width + 80, h: l.top - s.top + 40 } : null;
  });
  if (!box) return;
  fs.mkdirSync('test-results/shots', { recursive: true });
  await page.screenshot({ path: `test-results/shots/${name}.png`, clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
}

// ---------------------------------------------------------------------------------------------------

const WIDTHS = [360, 375, 390, 414, 640, 768, 1024, 1440];
const DPRS = [1, 2, 3];

for (const width of WIDTHS) {
  for (const dpr of DPRS) {
    test(`select every tab by click @ ${width}px, dpr ${dpr}`, async ({ browser }) => {
      const { ctx, page, errors } = await open(browser, width, 800, dpr);
      check(await probe(page), 'initial');
      for (const key of THEMES) {
        await button(page, key).click();
        await settle(page);
        check(await probe(page), `selected ${key}`);
        if (dpr >= 2) await scanBandLine(page, `${width}@${dpr} ${key}`);
        if (dpr === 2) await shot(page, `click-${width}-${key}`);
      }
      // Back to "all": the All tab on mobile, re-clicking the selected card on desktop.
      if (width < 640) await button(page, 'all').click();
      else await button(page, 'earlier').click();
      await settle(page);
      check(await probe(page), 'back to all');
      expect(errors).toEqual([]);
      await ctx.close();
    });
  }
}

for (const zoom of [0.67, 0.8, 0.9, 1.1, 1.25, 1.5, 2]) {
  test(`desktop zoom ${zoom * 100}%`, async ({ browser }) => {
    // Browser zoom on a 1440px window = a narrower CSS viewport at a higher pixel ratio.
    const { ctx, page, errors } = await open(browser, Math.round(1440 / zoom), 900, zoom);
    for (const key of THEMES) {
      await button(page, key).click();
      await settle(page);
      check(await probe(page), `zoom ${zoom} ${key}`);
    }
    await button(page, 'earlier').click();
    await settle(page);
    check(await probe(page), `zoom ${zoom} off`);
    expect(errors).toEqual([]);
    await ctx.close();
  });
}

for (const width of [375, 1440]) {
  test(`keyboard: arrows move focus, Enter and Space select @ ${width}px`, async ({ browser }) => {
    const { ctx, page } = await open(browser, width, 800, 2);
    const first = width < 640 ? 'all' : 'confidence';
    await button(page, first).focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await settle(page);
    let p = await probe(page);
    expect(p.key).toBe(width < 640 ? 'confidence' : 'oncology');
    check(p, 'Enter');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press(' ');
    await settle(page);
    p = await probe(page);
    expect(p.key).toBe(width < 640 ? 'oncology' : 'earlier');
    check(p, 'Space');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    if (width >= 640) await page.keyboard.press('ArrowLeft'); // wraps
    await page.keyboard.press('Enter');
    await settle(page);
    check(await probe(page), 'after arrow-left');
    // Arrow buttons are not in the tab order.
    expect(await page.locator('.cat-arrow').evaluateAll((as) => as.map((a) => (a as HTMLElement).tabIndex))).toEqual([-1, -1]);
    await ctx.close();
  });
}

test('mobile arrow buttons scroll the strip and keep the invariants', async ({ browser }) => {
  const { ctx, page } = await open(browser, 360, 740, 3);
  await button(page, 'confidence').click();
  await settle(page);
  for (let i = 0; i < 6; i++) {
    const right = page.locator('.cat-arrow--right');
    if (!(await right.isVisible())) break;
    await right.click();
    await settle(page, 700);
    check(await probe(page), `after right arrow ${i}`, { inView: false });
  }
  const p = await probe(page);
  expect(p.scrollLeft).toBeGreaterThanOrEqual(p.maxScroll - 1);
  for (let i = 0; i < 6; i++) {
    const left = page.locator('.cat-arrow--left');
    if (!(await left.isVisible())) break;
    await left.click();
    await settle(page, 700);
    check(await probe(page), `after left arrow ${i}`, { inView: false });
  }
  expect((await probe(page)).scrollLeft).toBeLessThanOrEqual(1);
  await ctx.close();
});

for (const width of [375, 1440]) {
  test(`rapid switching settles correctly @ ${width}px`, async ({ browser }) => {
    const { ctx, page } = await open(browser, width, 800, 2);
    await button(page, 'confidence').click();
    await page.waitForTimeout(60);
    await button(page, 'earlier').click();
    await page.waitForTimeout(60);
    await button(page, 'oncology').click();
    await settle(page, 1200);
    const p = await probe(page);
    expect(p.key).toBe('oncology');
    check(p, 'rapid');
    await ctx.close();
  });
}

test('manual swipe and page scroll keep the outline attached', async ({ browser }) => {
  const { ctx, page } = await open(browser, 375, 667, 3);
  await button(page, 'oncology').click();
  await settle(page);
  for (const x of [0, 40, 120, 9999, 60]) {
    await page.evaluate((x) => (document.querySelector('.cat-cards') as HTMLElement).scrollTo({ left: x }), x);
    await settle(page, 250);
    check(await probe(page), `strip scrolled to ${x}`, { inView: false });
  }
  for (const y of [300, 1200, 0, 600]) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await settle(page, 250);
    check(await probe(page), `page scrolled to ${y}`, { inView: false });
  }
  await ctx.close();
});

test('resizing across 640px with a tab selected, and orientation change', async ({ browser }) => {
  const { ctx, page } = await open(browser, 1024, 800, 2);
  await button(page, 'oncology').click();
  await settle(page);
  check(await probe(page), 'desktop');
  for (const [w, h] of [[600, 800], [375, 667], [700, 800], [1024, 800], [375, 667], [667, 375], [375, 667]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await settle(page);
    const p = await probe(page);
    expect(p.key, `${w}x${h} keeps the selection`).toBe('oncology');
    check(p, `${w}x${h}`);
  }
  await ctx.close();
});

test('loading with a hash, then back/forward', async ({ browser }) => {
  const { ctx, page } = await open(browser, 390, 844, 3);
  await page.goto(B + '/research#ccps-emnlp25');
  await page.evaluate(() => document.fonts.ready);
  check(await probe(page), 'hash load');
  await button(page, 'earlier').click();
  await settle(page);
  check(await probe(page), 'hash + select');
  await page.goto(B + '/');
  await page.goBack();
  await settle(page);
  check(await probe(page), 'after back');
  await page.goForward();
  await page.goBack();
  await settle(page);
  check(await probe(page), 'after forward+back');
  await ctx.close();
});

test('late web fonts: the path follows the final layout', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  await page.route(/\.(woff2?|ttf)(\?.*)?$/, async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto(B + '/research', { waitUntil: 'domcontentloaded' });
  await button(page, 'oncology').click();
  await settle(page, 500);
  release();
  await page.evaluate(() => document.fonts.ready);
  await settle(page, 500);
  check(await probe(page), 'after fonts loaded');
  await ctx.close();
});

for (const width of [375, 1440]) {
  test(`reduced motion @ ${width}px`, async ({ browser }) => {
    const { ctx, page } = await open(browser, width, 800, 2, { reducedMotion: 'reduce' });
    for (const key of THEMES) {
      await button(page, key).click();
      await settle(page, 200); // no smooth scrolling, so it settles almost at once
      check(await probe(page), `reduced ${key}`);
    }
    await ctx.close();
  });
}

for (const width of [375, 1440]) {
  test(`JavaScript disabled @ ${width}px`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width, height: 800 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(B + '/research');
    expect(await page.locator('.paper:visible').count()).toBe(24);
    expect(await page.locator('.tab-outline').isVisible()).toBe(false);
    expect(await page.locator('.cat-arrow, .cat-fade').count()).toBe(0);
    expect(await page.locator('a.cat-card').count()).toBe(4);
    const overflow = await page.evaluate(() => document.scrollingElement!.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await ctx.close();
  });
}

for (const width of [360, 375, 390, 414]) {
  for (const dpr of [2, 3]) {
    test(`tab scrolled under an edge keeps outline and line intact @ ${width}px, dpr ${dpr}`, async ({ browser }) => {
      const { ctx, page } = await open(browser, width, 800, dpr);
      for (const [key, to] of [['earlier', 0], ['confidence', 9999]] as const) {
        await button(page, key).click();
        await settle(page);
        await page.evaluate((x) => (document.querySelector('.cat-cards') as HTMLElement).scrollTo({ left: x }), to);
        await settle(page, 400);
        check(await probe(page), `${key} then strip scrolled to ${to}`, { inView: false });
        await scanBandLine(page, `${width}@${dpr} ${key} scrolled to ${to}`);
        await shot(page, `edge-${width}-${dpr}-${key}`);
      }
      await ctx.close();
    });
  }
}

test('arrows and fades are mirror images, with the selected tab near each edge', async ({ browser }) => {
  const { ctx, page } = await open(browser, 375, 800, 2);
  for (const key of ['confidence', 'earlier'] as const) {
    await button(page, key).click();
    await settle(page);
    // Scroll to the middle so both arrows and both fades are showing.
    await page.evaluate(() => {
      const s = document.querySelector('.cat-cards') as HTMLElement;
      s.scrollTo({ left: (s.scrollWidth - s.clientWidth) / 2 });
    });
    await settle(page, 400);
    const p = await probe(page);
    expect(p.arrows, `${key}: both arrows showing`).toEqual([true, true]);
    await checkSymmetry(page, key);
    await scanBandLine(page, `symmetry ${key}`);
  }
  await ctx.close();
});

test('selected tab is brought into view on load (back), resize and return', async ({ browser }) => {
  const { ctx, page } = await open(browser, 375, 800, 3);
  await button(page, 'earlier').click();
  await settle(page);
  await page.evaluate(() => (document.querySelector('.cat-cards') as HTMLElement).scrollTo({ left: 0 }));
  await settle(page, 300);
  await page.setViewportSize({ width: 360, height: 800 });
  await settle(page);
  check(await probe(page), 'after resize'); // inView: revealed again
  await page.evaluate(() => (document.querySelector('.cat-cards') as HTMLElement).scrollTo({ left: 0 }));
  await page.goto(B + '/');
  await page.goBack();
  await settle(page);
  check(await probe(page), 'after returning');
  await ctx.close();
});

for (const width of [360, 375, 390, 414]) {
  for (const dpr of [2, 3]) {
    test(`selected tab under an arrow: zone stays clean, line stays whole @ ${width}px, dpr ${dpr}`, async ({ browser }) => {
      const { ctx, page } = await open(browser, width, 800, dpr);
      let placed = 0;
      for (const key of THEMES) {
        for (const side of ['left', 'right'] as const) {
          await button(page, key).click();
          await settle(page);
          if (!(await placeUnder(page, side))) continue;
          placed++;
          const label = `${width}@${dpr} ${key} under ${side}`;
          check(await probe(page), label, { inView: false });
          await checkArrowZone(page, side, label);
          await scanBandLine(page, label);
          await shot(page, `under-${width}-${dpr}-${key}-${side}`);
        }
      }
      // At least Confidence under the left arrow and Earlier Work under the right one.
      expect(placed).toBeGreaterThanOrEqual(2);
      await ctx.close();
    });
  }
}

// Arriving from Home's links (e.g. CCPS) lights up that paper's row for a moment, then fades.
for (const id of ['ccps-emnlp25', 'rmcb-eacl26', 'bicr-aacl26']) {
  test(`paper highlight on arrival: ${id}`, async ({ browser }) => {
    const { ctx, page } = await open(browser, 1440, 900, 2);
    await page.goto(B + '/');
    await page.locator(`a[href="${B}/research#${id}"]`).click();
    await page.waitForURL(`**/research#${id}`);
    const row = page.locator(`#${id}`);
    await expect(row).toHaveClass(/is-flash/);
    const shown = await row.evaluate((r) => Number(getComputedStyle(r, '::before').opacity));
    expect(shown).toBeGreaterThan(0.5);
    // Centred vertically, unless the page can't scroll that far.
    const pos = await row.evaluate((r) => {
      const b = r.getBoundingClientRect();
      const maxScroll = document.scrollingElement!.scrollHeight - innerHeight;
      return { off: b.top + b.height / 2 - innerHeight / 2, atLimit: scrollY <= 0 || scrollY >= maxScroll - 1, inView: b.top >= 0 && b.bottom <= innerHeight };
    });
    expect(pos.inView).toBe(true);
    if (!pos.atLimit) expect(Math.abs(pos.off), 'paper centred vertically').toBeLessThanOrEqual(2);
    // Still lit after 2.5s; fading (steadily) by 3.75s; gone after ~4.7s.
    await page.waitForTimeout(2500);
    expect(await row.evaluate((r) => Number(getComputedStyle(r, '::before').opacity))).toBeGreaterThan(0.9);
    await page.waitForTimeout(1250);
    const mid = await row.evaluate((r) => Number(getComputedStyle(r, '::before').opacity));
    expect(mid).toBeGreaterThan(0.2);
    expect(mid).toBeLessThan(0.8);
    await page.waitForTimeout(1200);
    await expect(row).not.toHaveClass(/is-flash/);
    expect(await row.evaluate((r) => Number(getComputedStyle(r, '::before').opacity))).toBe(0);
    await ctx.close();
  });
}

// After the papers the bands alternate across Presentations and Collaborators, from the one state:
// nothing (or "All") selected → Presentations grey, Collaborators white; a card selected →
// Presentations white, Collaborators grey. Cards take the opposite colour of their band.
const GREY = 'rgb(248, 248, 248)';
const WHITE = 'rgb(255, 255, 255)';
const bands = (page: Page) =>
  page.evaluate(() => {
    const css = (sel: string) => getComputedStyle(document.querySelector(sel)!);
    return {
      pres: css('.pres').backgroundColor,
      card: css('.pres-card').backgroundColor,
      collab: css('.collab').backgroundColor,
      presBorder: css('.pres').borderTopWidth,
      collabBorder: css('.collab').borderTopWidth,
      overflow: document.scrollingElement!.scrollWidth - innerWidth,
    };
  });
async function expectBands(page: Page, selected: boolean, label: string) {
  const b = await bands(page);
  expect(b.pres, `${label}: presentations`).toBe(selected ? WHITE : GREY);
  expect(b.card, `${label}: cards opposite their band`).toBe(selected ? GREY : WHITE);
  expect(b.collab, `${label}: collaborators`).toBe(selected ? GREY : WHITE);
  expect(b.presBorder).toBe('1px');
  expect(b.collabBorder).toBe('1px');
  expect(b.overflow, `${label}: no horizontal scroll`).toBeLessThanOrEqual(0);
}

for (const width of [375, 1440]) {
  test(`presentations and collaborators backgrounds follow the selection @ ${width}px`, async ({ browser }) => {
    const { ctx, page } = await open(browser, width, 800, 2, { reducedMotion: 'reduce' });
    await expectBands(page, false, 'default');
    for (const key of THEMES) {
      await button(page, key).click();
      await settle(page, 300);
      await expectBands(page, true, key);
    }
    if (width < 640) await button(page, 'all').click();
    else await button(page, 'earlier').click();
    await settle(page, 300);
    await expectBands(page, false, 'back to all');
    // Rapid switching ends on a selection.
    await button(page, 'confidence').click();
    await button(page, 'oncology').click();
    await button(page, 'earlier').click();
    await settle(page, 300);
    await expectBands(page, true, 'after rapid switching');
    // Across the 640px breakpoint, both ways, the selection (and so the colours) stays.
    for (const w of width < 640 ? [1024, 375] : [375, 1440]) {
      await page.setViewportSize({ width: w, height: 800 });
      await settle(page, 300);
      await expectBands(page, true, `selected, resized to ${w}`);
    }
    // And with nothing selected, across 640px again.
    if (page.viewportSize()!.width < 640) await button(page, 'all').click();
    else await button(page, 'earlier').click();
    await settle(page, 300);
    for (const w of [600, 1024, 375]) {
      await page.setViewportSize({ width: w, height: 800 });
      await settle(page, 300);
      await expectBands(page, false, `nothing selected, resized to ${w}`);
    }
    await ctx.close();
  });
}

test('bands: nothing above moves when the backgrounds switch, and the default colours without JS', async ({ browser }) => {
  const { ctx, page } = await open(browser, 1440, 900, 1, { reducedMotion: 'reduce' });
  const heights = () =>
    page.evaluate(() => ['.pres', '.collab'].map((s) => document.querySelector(s)!.getBoundingClientRect().height));
  const h0 = await heights();
  expect(await page.locator('.collab img').count()).toBe(4);
  expect(await page.locator('.collab img').evaluateAll((is) => is.map((i) => i.getAttribute('alt')))).toEqual(['JPMorganChase', 'Henry Ford Health', 'NYU', 'Cedars-Sinai']);
  await button(page, 'confidence').click();
  await settle(page, 300);
  const h1 = await heights();
  h0.forEach((h, i) => expect(h1[i], 'same height in both states').toBeCloseTo(h, 1));
  await ctx.close();
  const off = await browser.newContext({ viewport: { width: 375, height: 800 }, javaScriptEnabled: false });
  const p2 = await off.newPage();
  await p2.goto(B + '/research');
  const b = await bands(p2);
  expect(b.pres).toBe(GREY);
  expect(b.collab).toBe(WHITE);
  // Without JS: lead photos link to full-size images, facades to youtube.com.
  const hrefs = await p2.locator('.pres-card__media > a').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const h of hrefs) expect(h).toMatch(new RegExp(`^https://www\\.youtube\\.com/watch\\?v=|^${B}/_astro/.+\\.webp$`));
  await off.close();
});

// --------------------------------------------------------------------------------------------------
// Presentations section: order, layout, video facades and the gallery.

const PRES_WIDTHS = [1440, 768, 375];

test('presentations: placement, heading count, newest first, card content', async ({ browser }) => {
  const { ctx, page, errors } = await open(browser, 1440, 900, 1);
  const order = await page.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.id || s.className));
  const iPres = order.indexOf('presentations');
  expect(iPres).toBeGreaterThan(0);
  expect(order[iPres + 1]).toBe('collaborators');
  const n = await page.locator('.pres-card').count();
  expect(n).toBe(7);
  await expect(page.locator('#presentations-title')).toHaveText(`Presentations · ${n}x`);
  expect(await page.locator('.pres-card').evaluateAll((cs) => cs.map((c) => c.id))).toEqual([
    'pres-astro-2026', 'pres-msu-ai-literacy', 'pres-precision-health-2025', 'pres-bhi-2025', 'pres-astro-2024', 'pres-cancer-symposium-2023', 'pres-bhi-2023',
  ]);
  // BHI 2025: two lines, each with its own pill; the video leads, photos open from the pill.
  const bhi = page.locator('#pres-bhi-2025');
  await expect(bhi.locator('.pres-line')).toHaveCount(2);
  await expect(bhi.locator('.pres-pill')).toHaveText(['Talk', 'Talk']);
  await expect(bhi.locator('.pres-card__media .yt')).toHaveCount(1);
  await expect(bhi.locator('.pres-card__photos')).toHaveText('Photos (2)');
  await expect(bhi.locator('.pres-card__kicker')).toHaveText('IEEE BHI 2025');
  await expect(bhi.locator('.pres-card__loc')).toHaveText('Atlanta');
  // Paper links point at existing paper rows.
  const papers = await page.locator(`.pres-card a[href^="${B}/research#"]`).evaluateAll((as) => as.map((a) => a.getAttribute('href')!.split('#')[1]));
  expect(papers.length).toBeGreaterThan(0);
  for (const id of papers) expect(await page.locator(`li.paper[id="${id}"]`).count(), id).toBe(1);
  // Photo-only card: lead photo + "+1" badge, responsive AVIF/WebP sources, lazy.
  const astro = page.locator('#pres-astro-2026');
  await expect(astro.locator('.pres-card__more')).toHaveText('+1 more photo');
  expect(await astro.locator('picture source').evaluateAll((s) => s.map((x) => x.getAttribute('type')))).toEqual(['image/avif', 'image/webp']);
  expect(await astro.locator('picture img').getAttribute('loading')).toBe('lazy');
  expect((await astro.locator('picture source').first().getAttribute('srcset'))!.split(',').length).toBeGreaterThan(1);
  expect(errors).toEqual([]);
  await ctx.close();
});

for (const width of PRES_WIDTHS) {
  test(`presentations: grid, 16:9 media, no horizontal scroll @ ${width}px`, async ({ browser }) => {
    const { ctx, page } = await open(browser, width, 900, 2);
    await page.locator('#presentations').scrollIntoViewIfNeeded();
    const g = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.pres-card')].map((c) => c.getBoundingClientRect());
      const media = [...document.querySelectorAll('.pres-card__media')].map((m) => m.getBoundingClientRect());
      const cs = getComputedStyle(document.querySelector('.pres-card')!);
      return {
        cols: new Set(cards.map((c) => Math.round(c.left))).size,
        ratios: media.map((m) => m.width / m.height),
        radius: cs.borderTopLeftRadius,
        shadow: cs.boxShadow,
        overflow: document.scrollingElement!.scrollWidth - innerWidth,
      };
    });
    expect(g.cols).toBe(width >= 768 ? 2 : 1);
    for (const r of g.ratios) expect(r).toBeCloseTo(16 / 9, 1);
    expect(g.radius).toBe('14px');
    expect(g.shadow).not.toBe('none');
    expect(g.overflow).toBeLessThanOrEqual(0);
    await ctx.close();
  });
}

test('presentations: videos load only on click, from youtube-nocookie, with the start time', async ({ browser }) => {
  const { ctx, page } = await open(browser, 1440, 900, 1);
  const yt: string[] = [];
  page.on('request', (r) => { if (/youtube(-nocookie)?\.com|googlevideo|ytimg\.com\/.*\.js/.test(r.url())) yt.push(r.url()); });
  await page.reload();
  await page.locator('#presentations').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(yt, 'no YouTube scripts or frames before a click').toEqual([]);
  await expect(page.locator('.pres iframe')).toHaveCount(0);
  // Thumbnails come from i.ytimg.com.
  const thumbs = await page.locator('.yt img').evaluateAll((is) => is.map((i) => (i as HTMLImageElement).src));
  expect(thumbs.length).toBe(4);
  for (const t of thumbs) expect(t).toMatch(/^https:\/\/i\.ytimg\.com\/vi\/[\w-]+\/hqdefault\.jpg$/);
  const card = page.locator('#pres-cancer-symposium-2023');
  await card.locator('.yt').click();
  const frame = card.locator('iframe.yt__frame');
  await expect(frame).toHaveCount(1);
  const src = await frame.getAttribute('src');
  expect(src).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/8ma7UzopwKQ\?/);
  expect(new URL(src!).searchParams.get('start')).toBe('205');
  // Only that card's video loaded.
  await expect(page.locator('.pres iframe')).toHaveCount(1);
  // Keyboard: Enter on a focused facade loads it too.
  await page.locator('#pres-bhi-2023 .yt').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#pres-bhi-2023 iframe')).toHaveCount(1);
  expect(new URL((await page.locator('#pres-bhi-2023 iframe').getAttribute('src'))!).searchParams.get('start')).toBeNull();
  await ctx.close();
});

const pswpState = (page: Page) =>
  page.evaluate(() => {
    const root = document.querySelector('.pswp');
    const img = document.querySelector('.pswp img.pswp__img:not(.pswp__img--placeholder)') as HTMLImageElement | null;
    return {
      open: !!root,
      caption: document.querySelector('.pswp__caption')?.textContent ?? null,
      counter: document.querySelector('.pswp__counter')?.textContent?.replace(/\s/g, '') ?? null,
      src: img?.getAttribute('src') ?? null,
      overflow: document.scrollingElement!.scrollWidth - innerWidth,
    };
  });

for (const width of PRES_WIDTHS) {
  test(`presentations gallery: mouse, keyboard and Escape @ ${width}px`, async ({ browser }) => {
    const { ctx, page, errors } = await open(browser, width, 900, 2);
    const card = page.locator('#pres-astro-2026');
    await card.scrollIntoViewIfNeeded();
    // Mouse: click the lead photo.
    await card.locator('.pres-card__lead').click();
    await expect(page.locator('.pswp')).toHaveCount(1);
    await expect(page.locator('.pswp__caption')).toHaveText('Presenting our oral session at ASTRO 2026, Boston.');
    await page.waitForFunction(() => !!document.querySelector('.pswp img.pswp__img:not(.pswp__img--placeholder)'));
    let s = await pswpState(page);
    expect(s.counter).toBe('1/2');
    expect(s.src).toMatch(/\.webp$/);
    // Arrow button (the arrows are hidden on touch-sized screens by PhotoSwipe; use the keyboard there).
    if (width >= 768) await page.locator('.pswp__button--arrow--next').click();
    else await page.keyboard.press('ArrowRight');
    await expect(page.locator('.pswp__caption')).toHaveText('With fellow presenters at our digital poster station, ASTRO 2026, Boston.');
    expect((await pswpState(page)).counter).toBe('2/2');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.pswp__caption')).toHaveText('Presenting our oral session at ASTRO 2026, Boston.');
    await page.keyboard.press('Escape');
    await expect(page.locator('.pswp')).toHaveCount(0);
    // Focus returns to the opener.
    expect(await page.evaluate(() => document.activeElement?.classList.contains('pres-card__lead'))).toBe(true);
    // Keyboard only: Enter on the "Photos (2)" pill of the video card.
    const pill = page.locator('#pres-bhi-2025 .pres-card__photos');
    await pill.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.pswp__caption')).toHaveText('Presenting hybrid student-teacher LLM refinement at IEEE BHI 2025, Atlanta.');
    await page.waitForTimeout(500); // opening fade
    expect(await page.evaluate(() => !!document.activeElement?.closest('.pswp')), 'focus moves into the gallery').toBe(true);
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.pswp__caption')).toHaveText('Giving my NextGen Scholar talk at IEEE BHI 2025, Atlanta.');
    s = await pswpState(page);
    expect(s.overflow).toBeLessThanOrEqual(0);
    await page.keyboard.press('Escape');
    await expect(page.locator('.pswp')).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.classList.contains('pres-card__photos'))).toBe(true);
    // The video did not load from opening its card's photos.
    await expect(page.locator('#pres-bhi-2025 iframe')).toHaveCount(0);
    expect(errors).toEqual([]);
    await ctx.close();
  });
}

test('presentations gallery: touch swipe and tap @ 375px', async ({ browser }) => {
  const { ctx, page } = await open(browser, 375, 800, 3);
  const card = page.locator('#pres-precision-health-2025');
  await card.scrollIntoViewIfNeeded();
  await card.locator('.pres-card__lead').tap();
  await expect(page.locator('.pswp__caption')).toHaveText('Presenting our CCPS poster at the MSU and Henry Ford Health Precision Health Symposium.');
  await page.waitForTimeout(600); // let the opening fade finish
  // Swipe left with a real touch sequence (CDP), then right.
  const cdp = await ctx.newCDPSession(page);
  const swipe = async (from: number, to: number) => {
    const y = 400;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from, y }] });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from + ((to - from) * i) / 8, y }] });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(600);
  };
  await swipe(320, 40);
  await expect(page.locator('.pswp__caption')).toHaveText('Receiving an Honorable Mention at the MSU and Henry Ford Health Precision Health Symposium.');
  await swipe(40, 320);
  await expect(page.locator('.pswp__caption')).toHaveText('Presenting our CCPS poster at the MSU and Henry Ford Health Precision Health Symposium.');
  expect((await pswpState(page)).overflow).toBeLessThanOrEqual(0);
  // Close button by tap.
  await page.locator('.pswp__button--close').tap();
  await expect(page.locator('.pswp')).toHaveCount(0);
  await ctx.close();
});
