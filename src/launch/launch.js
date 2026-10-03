import './launch.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight } from 'lucide-react';
import { clamp, EXIT_DURATION, frameAt, frameUrl } from './introConfig.js';
import { FrameCache } from './frameCache.js';

export function mountIntro() {
  const shell = document.querySelector('.app-shell');
  const root = document.createElement('section');
  root.className = 'eye-story';
  root.setAttribute('aria-label', "Nijju's Eye horror story");
  root.innerHTML = `
    <div class="eye-story__world" aria-hidden="true">
      <img class="eye-story__poster" src="${frameUrl(0)}" alt="">
      <canvas class="eye-story__film"></canvas>
    </div>
    <div class="eye-story__shade" aria-hidden="true"></div>
    <button class="eye-story__enter" type="button" hidden>Enter OrbitOS <span class="eye-story__enter-icon" aria-hidden="true"></span></button>
`;
  const spacer = document.createElement('div');
  spacer.className = 'eye-story__scroll';
  spacer.setAttribute('aria-hidden', 'true');
  document.body.append(root, spacer);
  const iconRoots = [['.eye-story__enter-icon', ArrowRight]].map(
    ([selector, Icon]) => {
      const iconRoot = createRoot(root.querySelector(selector));
      iconRoot.render(createElement(Icon, { size: 20, 'aria-hidden': true }));
      return iconRoot;
    },
  );
  document.documentElement.classList.add('eye-story-open');
  const previousDisplay = shell.style.display;
  const previousRestoration = history.scrollRestoration;
  shell.style.display = 'none';
  shell.inert = true;
  shell.setAttribute('aria-hidden', 'true');
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  delete document.documentElement.dataset.introPending;
  clearTimeout(window.nijjuIntroWatchdog);
  const canvas = root.querySelector('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  const enterButton = root.querySelector('.eye-story__enter');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0,
    target = 0,
    frame = 0,
    lastTime = 0,
    drawnFrame = -1,
    leaving = false,
    scrollRange = 1;
  const cache = new FrameCache(wake, { limit: innerWidth < 700 ? 18 : 28 });
  function paint() {
    const index = frameAt(progress);
    cache.request(index, target >= progress ? 1 : -1);
    const bitmap = cache.get(index);
    if (bitmap && context && drawnFrame !== index) {
      const scale = Math.max(
        canvas.width / bitmap.width,
        canvas.height / bitmap.height,
      );
      const w = bitmap.width * scale,
        h = bitmap.height * scale;
      context.drawImage(
        bitmap,
        (canvas.width - w) / 2,
        (canvas.height - h) / 2,
        w,
        h,
      );
      drawnFrame = index;
      canvas.dataset.frame = String(index);
      canvas.style.opacity = '1';
    }
    root.dataset.progress = progress.toFixed(5);
    root.dataset.frameTarget = String(index);
    enterButton.hidden = progress < 0.9999;
  }
  function tick(now) {
    frame = 0;
    if (leaving) return;
    const delta = Math.min(64, Math.max(1, now - lastTime));
    lastTime = now;
    progress +=
      (target - progress) *
      (preference.matches ? 1 : 1 - Math.exp(-delta / 85));
    if (Math.abs(target - progress) < 0.00005) progress = target;
    paint();
    if (Math.abs(target - progress) > 0.00005)
      frame = requestAnimationFrame(tick);
  }
  function wake() {
    if (leaving || frame) return;
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function onScroll() {
    target = clamp(window.scrollY / scrollRange);
    wake();
  }
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(root.clientWidth * dpr);
    canvas.height = Math.round(root.clientHeight * dpr);
    drawnFrame = -1;
    scrollRange = Math.max(1, spacer.offsetHeight - innerHeight);
    onScroll();
  }
  function enter() {
    if (leaving) return;
    leaving = true;
    cancelAnimationFrame(frame);
    cache.dispose();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', resize);
    shell.style.display = previousDisplay;
    root.classList.add('eye-story--exiting');
    root.querySelectorAll('button,input').forEach((c) => (c.disabled = true));
    spacer.remove();
    window.scrollTo(0, 0);
    setTimeout(() => {
      iconRoots.forEach((iconRoot) => iconRoot.unmount());
      root.remove();
      document.documentElement.classList.remove('eye-story-open');
      shell.inert = false;
      shell.removeAttribute('aria-hidden');
      history.scrollRestoration = previousRestoration;
      const main = shell.querySelector('main');
      if (main) {
        main.tabIndex = -1;
        main.focus({ preventScroll: true });
      }
      const url = new URL(location.href);
      url.searchParams.delete('intro');
      history.replaceState(history.state, '', url);
    }, EXIT_DURATION);
  }
  enterButton.addEventListener('click', enter);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);
  resize();
  paint();
}
if (new URLSearchParams(location.search).get('intro') === '1') mountIntro();
