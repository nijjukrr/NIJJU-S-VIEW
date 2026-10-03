import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { frameAt, FRAME_COUNT } from './introConfig.js';

test('all 960 source video frames remain available and distinct', () => {
  const hashes = new Set();
  for (let i = 0; i < FRAME_COUNT; i++) {
    const file = new URL(
      `../../public/media/horror/frames/${String(i).padStart(4, '0')}.webp`,
      import.meta.url,
    );
    hashes.add(createHash('sha256').update(readFileSync(file)).digest('hex'));
  }
  assert.equal(FRAME_COUNT, 960);
  assert.ok(hashes.size >= 900);
});
test('film mapping advances continuously without reversing chronology', () => {
  let previous = 0;
  for (let i = 0; i <= 1000; i++) {
    const frame = frameAt(i / 1000);
    assert.ok(frame >= previous && frame < FRAME_COUNT);
    previous = frame;
  }
  assert.equal(frameAt(0), 0);
  assert.equal(frameAt(0.5), 480);
  assert.equal(frameAt(1), 959);
});
test('intro has no playback controls or copy before the final entry button', () => {
  const code = readFileSync(new URL('./launch.js', import.meta.url), 'utf8');
  assert.doesNotMatch(
    code,
    /Scroll to enter|eye-story__rewind|eye-story__progress|<input|<footer/,
  );
  assert.doesNotMatch(
    code,
    /THE LAST SIGNAL|ARCHIVE 001|FICTIONAL TRANSMISSION|eye-story__line|<h[12]>/,
  );
  assert.doesNotMatch(code, /autoplay|\.play\(|setInterval|setTimeout\(enter/);
  assert.doesNotMatch(code, /eye-story__still|<video/);
  assert.match(code, /enterButton\.hidden = progress < 0\.9999/);
  assert.match(code, /enterButton\.addEventListener\('click', enter\)/);
});
