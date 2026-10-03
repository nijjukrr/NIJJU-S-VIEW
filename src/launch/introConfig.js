export const FRAME_COUNT = 960;
export const EXIT_DURATION = 650;
export const MEDIA = '/media/horror/';
export const clamp = (value) => Math.max(0, Math.min(1, value));
export const smooth = (value) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};
export const frameUrl = (index) =>
  `${MEDIA}frames/${String(index).padStart(4, '0')}.webp`;

export function frameAt(progress) {
  return Math.round(clamp(progress) * (FRAME_COUNT - 1));
}
