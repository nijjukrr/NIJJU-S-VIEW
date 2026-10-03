import './launch.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  clamp,
  EXIT_DURATION,
  frameAt,
  frameUrl,
  MEDIA,
  stills,
  stillAt,
} from './introConfig.js';
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
      ${stills.map((s) => `<img class="eye-story__still" data-scene="${s.file}" src="${MEDIA}${s.file}" alt="" decoding="async">`).join('')}
    </div>
    <div class="eye-story__shade" aria-hidden="true"></div>
    <button class="eye-story__skip" type="button" aria-label="Skip intro" title="Skip intro"></button>
    <footer class="eye-story__footer">
      <button class="eye-story__rewind" type="button" aria-label="Rewind story" title="Rewind story"></button>
      <div class="eye-story__progress"><span>Scroll to enter</span><input type="range" min="0" max="1000" step="1" value="0" aria-label="Story progress"></div>
    </footer>`;
  const spacer = document.createElement('div');
  spacer.className = 'eye-story__scroll';
  spacer.setAttribute('aria-hidden', 'true');
  document.body.append(root, spacer);
  const iconRoots = [
    ['.eye-story__skip', ArrowRight],
    ['.eye-story__rewind', RotateCcw],
  ].map(([selector, Icon]) => {
    const iconRoot = createRoot(root.querySelector(selector));
    iconRoot.render(createElement(Icon, { size: 20, 'aria-hidden': true }));
    return iconRoot;
  });
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
  const photos = [...root.querySelectorAll('.eye-story__still')];
  const slider = root.querySelector('input');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0,
    target = 0,
    frame = 0,
    lastTime = 0,
    drawnFrame = -1,
    leaving = false,
    scrollRange = 1;
  let userMoved = false;
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
    photos.forEach((photo, i) => {
      const state = stillAt(stills[i], progress);
      photo.style.opacity = state.opacity;
      photo.style.transform = preference.matches
        ? 'none'
        : `scale(${state.scale})`;
    });
    root.dataset.progress = progress.toFixed(5);
    root.dataset.frameTarget = String(index);
    slider.value = Math.round(progress * 1000);
    slider.setAttribute(
      'aria-valuetext',
      `${Math.round(progress * 100)} percent`,
    );
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
    if (userMoved && progress >= 0.9999 && target === 1) {
      enter();
      return;
    }
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
    if (target > 0) userMoved = true;
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
  root.querySelector('.eye-story__rewind').addEventListener('click', () =>
    window.scrollTo({
      top: 0,
      behavior: preference.matches ? 'instant' : 'smooth',
    }),
  );
  slider.addEventListener('input', () =>
    window.scrollTo({
      top: (Number(slider.value) / 1000) * scrollRange,
      behavior: 'instant',
    }),
  );
  root.querySelector('.eye-story__skip').addEventListener('click', enter);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', resize);
  resize();
  paint();
}
if (new URLSearchParams(location.search).get('intro') === '1') mountIntro();
