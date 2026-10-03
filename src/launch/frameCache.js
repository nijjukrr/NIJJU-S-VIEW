import { FRAME_COUNT, frameUrl } from './introConfig.js';

async function decodeFrame(index, signal) {
  const response = await fetch(frameUrl(index), { signal });
  if (!response.ok) throw new Error(`Frame ${index}: ${response.status}`);
  return createImageBitmap(await response.blob());
}

// Keep decoded memory bounded; fetch only a small neighborhood around the playhead.
export class FrameCache {
  constructor(onReady, { limit = 24, load = decodeFrame } = {}) {
    this.onReady = onReady;
    this.limit = limit;
    this.load = load;
    this.frames = new Map();
    this.pending = new Map();
    this.failed = new Set();
    this.queue = [];
    this.cursor = 0;
    this.closed = false;
  }

  request(index, direction = 1) {
    if (this.closed) return;
    this.cursor = index;
    const priority = [index];
    for (let distance = 1; distance <= 9; distance++) {
      priority.push(index + distance * direction, index - distance * direction);
    }
    this.queue = priority
      .filter((value) => value >= 0 && value < FRAME_COUNT)
      .slice(0, this.limit)
      .filter(
        (value) =>
          value >= 0 &&
          value < FRAME_COUNT &&
          !this.frames.has(value) &&
          !this.pending.has(value) &&
          !this.failed.has(value),
      );
    this.pump();
  }

  pump() {
    while (!this.closed && this.pending.size < 4 && this.queue.length) {
      const index = this.queue.shift();
      const controller = new AbortController();
      this.pending.set(index, controller);
      this.load(index, controller.signal)
        .then((bitmap) => {
          if (this.closed) {
            bitmap.close();
            return;
          }
          this.frames.set(index, bitmap);
          while (this.frames.size > this.limit) {
            const farthest = [...this.frames.keys()].sort(
              (a, b) => Math.abs(b - this.cursor) - Math.abs(a - this.cursor),
            )[0];
            this.frames.get(farthest).close();
            this.frames.delete(farthest);
          }
          this.onReady();
        })
        .catch((error) => {
          if (error.name !== 'AbortError') this.failed.add(index);
        })
        .finally(() => {
          this.pending.delete(index);
          this.pump();
        });
    }
  }

  get(index) {
    return this.frames.get(index);
  }

  dispose() {
    this.closed = true;
    this.queue = [];
    this.pending.forEach((controller) => controller.abort());
    this.frames.forEach((bitmap) => bitmap.close());
    this.frames.clear();
  }
}
