import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import {
  frameAt,
  FRAME_COUNT,
  VIDEO_END,
  stills,
  stillAt,
} from './introConfig.js';

test('all seven requested photos are present in chronological order', () => {
  const requested = stills.filter((s) => s.source);
  assert.deepEqual(
    requested.map((s) => s.source),
    [
      '22 AM-1',
      '24 AM-2',
      '27 AM-3',
      '32 AM-5',
      '34 AM-6',
      '36 AM-7',
      '38 AM-8',
    ],
  );
  for (const still of stills) {
    assert.ok(
      existsSync(
        new URL(`../../public/media/horror/${still.file}`, import.meta.url),
      ),
    );
    assert.ok(still.start < still.end);
    assert.equal(stillAt(still, (still.start + still.end) / 2).opacity, 1);
  }
});
test('all 480 source video frames remain available and distinct', () => {
  const hashes = new Set();
  for (let i = 0; i < FRAME_COUNT; i++) {
    const file = new URL(
      `../../public/media/horror/frames/${String(i).padStart(4, '0')}.webp`,
      import.meta.url,
    );
    hashes.add(createHash('sha256').update(readFileSync(file)).digest('hex'));
  }
  assert.equal(FRAME_COUNT, 480);
  assert.ok(hashes.size >= 400);
});
test('film mapping holds during photos and advances without reversing chronology', () => {
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const frame = frameAt(i / 1000);
    assert.ok(frame >= previous && frame < FRAME_COUNT);
    previous = frame;
  }
  assert.equal(frameAt(0), 0);
  assert.equal(frameAt(VIDEO_END), 479);
  assert.equal(frameAt(0.18), frameAt(0.22));
  assert.equal(frameAt(0.49), 270);
});
test('only Scroll to enter remains as visible intro copy', () => {
  const code = readFileSync(new URL('./launch.js', import.meta.url), 'utf8');
  assert.match(code, /Scroll to enter/);
  assert.doesNotMatch(
    code,
    /THE LAST SIGNAL|ARCHIVE 001|FICTIONAL TRANSMISSION|eye-story__line|<h[12]>/,
  );
  assert.doesNotMatch(code, /autoplay|\.play\(|setInterval|setTimeout\(enter/);
  assert.match(code, /userMoved && progress >= 0\.9999 && target === 1/);
});
