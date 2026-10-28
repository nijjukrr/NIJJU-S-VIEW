export const VIDEO_URL = '/media/futuristic-tracking.mp4';
export const VIDEO_FALLBACK_URL =
  '/Creating_futuristic_tracking_video_6ac63e22.mp4';
export const EXIT_DURATION = 650;
export const VIDEO_DURATION_DEFAULT = 8.0;

export const clamp = (value) => Math.max(0, Math.min(1, value));

export const smooth = (value) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};

export function videoTimeAt(progress, duration = VIDEO_DURATION_DEFAULT) {
  const p = clamp(progress);
  const total = Math.max(0.1, Number(duration) || VIDEO_DURATION_DEFAULT);
  return Math.min(total - 0.05, p * total);
}

// Backwards compatibility bindings
export const FRAME_COUNT = 960;
export const MEDIA = '/media/horror/';
export const frameUrl = (index) =>
  `${MEDIA}frames/${String(index).padStart(4, '0')}.webp`;

export function frameAt(progress) {
  return Math.round(clamp(progress) * (FRAME_COUNT - 1));
}
