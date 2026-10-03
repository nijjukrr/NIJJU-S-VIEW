export const FRAME_COUNT = 480;
export const VIDEO_END = 0.86;
export const EXIT_DURATION = 650;
export const MEDIA = '/media/horror/';
export const clamp = (value) => Math.max(0, Math.min(1, value));
export const smooth = (value) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};
export const frameUrl = (index) =>
  `${MEDIA}frames/${String(index).padStart(4, '0')}.webp`;

// Stills pause the matching moment in the film; the next clip resumes from it.
const anchors = [
  [0, 0],
  [0.07, 0],
  [0.16, 60],
  [0.23, 60],
  [0.3, 150],
  [0.37, 150],
  [0.46, 270],
  [0.53, 270],
  [0.6, 340],
  [0.67, 340],
  [0.74, 408],
  [0.81, 408],
  [0.86, 479],
  [1, 479],
];
export function frameAt(progress) {
  const p = clamp(progress);
  const i = Math.max(
    0,
    anchors.findLastIndex(([at]) => p >= at),
  );
  const [start, from] = anchors[i];
  const [end, to] = anchors[i + 1] || anchors[i];
  return Math.round(
    from + (to - from) * (end === start ? 0 : (p - start) / (end - start)),
  );
}
export const stills = [
  { file: 'solar-contact.webp', start: 0, end: 0.07, source: '22 AM-1' },
  { file: 'solar-escape.webp', start: 0.16, end: 0.23, source: '24 AM-2' },
  { file: 'ruined-station.webp', start: 0.3, end: 0.37, source: '27 AM-3' },
  { file: 'astronaut.webp', start: 0.46, end: 0.53, source: '32 AM-5' },
  { file: 'reentry.webp', start: 0.6, end: 0.67, source: '34 AM-6' },
  { file: 'impact.webp', start: 0.74, end: 0.81, source: '36 AM-7' },
  { file: 'aftermath.webp', start: 0.86, end: 0.94, source: '38 AM-8' },
  { file: 'helmet.webp', start: 0.925, end: 0.97 },
  { file: 'visor-tap.webp', start: 0.955, end: 1.02 },
];
export function stillAt(still, progress) {
  const local = clamp((progress - still.start) / (still.end - still.start));
  const fade = 0.012;
  const opacity =
    (still.start === 0 ? 1 : smooth((progress - still.start) / fade)) *
    (still.end > 1 ? 1 : 1 - smooth((progress - still.end + fade) / fade));
  // The slight base crop keeps source corner marks outside the viewport.
  return { opacity, scale: 1.045 + local * 0.065 };
}
