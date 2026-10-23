// /research › Presentations: click-to-load YouTube facades and the PhotoSwipe gallery (self-hosted,
// photoswipe 5.4.4 bundled from node_modules). Nothing from YouTube loads before a click except
// the thumbnail image.
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type Slide = { src: string; width: number; height: number; alt: string; caption: string };

// Video facades: swap the thumbnail link for a youtube-nocookie iframe that starts playing.
document.querySelectorAll<HTMLAnchorElement>('.yt[data-yt-id]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
    e.preventDefault();
    const params = new URLSearchParams({ autoplay: '1', rel: '0' });
    if (a.dataset.ytStart) params.set('start', a.dataset.ytStart);
    const f = document.createElement('iframe');
    f.className = 'yt__frame';
    f.src = `https://www.youtube-nocookie.com/embed/${a.dataset.ytId}?${params}`;
    f.title = a.getAttribute('aria-label')?.replace(/^Play video: /, '') ?? 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.allowFullscreen = true;
    a.replaceWith(f);
    f.focus();
  });
});

// Galleries: one per card, from the card's JSON. Any [data-gallery-open] opens it at that photo.
document.querySelectorAll<HTMLElement>('[data-pres]').forEach((card) => {
  const json = card.querySelector('script[data-gallery]');
  if (!json) return;
  const slides: Slide[] = JSON.parse(json.textContent || '[]');
  const lightbox = new PhotoSwipeLightbox({
    dataSource: slides,
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.92,
    showHideAnimationType: 'fade',
    padding: { top: 24, bottom: 72, left: 0, right: 0 }, // room for the caption
  });
  lightbox.on('uiRegister', () => {
    lightbox.pswp?.ui?.registerElement({
      name: 'caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        el.setAttribute('aria-live', 'polite');
        pswp.on('change', () => {
          el.textContent = (pswp.currSlide?.data as Partial<Slide> | undefined)?.caption ?? '';
        });
      },
    });
  });
  // Keyboard users land back on whatever opened the gallery.
  let opener: HTMLElement | null = null;
  lightbox.on('destroy', () => opener?.focus({ preventScroll: true }));
  lightbox.init();
  card.querySelectorAll<HTMLAnchorElement>('[data-gallery-open]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      opener = a;
      lightbox.loadAndOpen(Number(a.dataset.galleryOpen) || 0);
    });
  });
});
