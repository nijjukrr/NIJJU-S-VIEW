import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import {
  clamp,
  smooth,
  videoTimeAt,
  VIDEO_URL,
  VIDEO_FALLBACK_URL,
  VIDEO_DURATION_DEFAULT,
  frameAt,
  FRAME_COUNT,
} from './introConfig.js';

test('futuristic tracking video asset is present, valid, and non-empty', () => {
  const rootVideoPath = new URL(
    `../../Creating_futuristic_tracking_video_6ac63e22.mp4`,
    import.meta.url,
  );
  const publicVideoPath = new URL(
    `../../public/media/futuristic-tracking.mp4`,
    import.meta.url,
  );

  assert.ok(existsSync(rootVideoPath), 'Root video file must exist');
  assert.ok(existsSync(publicVideoPath), 'Public served video file must exist');

  const stat = statSync(publicVideoPath);
  assert.ok(stat.size > 1000000, `Video file must be valid size, got ${stat.size} bytes`);

  const header = readFileSync(publicVideoPath).subarray(0, 32);
  assert.ok(
    header.includes(Buffer.from('ftyp')) || header.includes(Buffer.from('moov')),
    'File must have valid MP4 atom header',
  );
});

test('video time mapping advances continuously and clamps bounds correctly', () => {
  const duration = 8.0;
  assert.equal(videoTimeAt(0, duration), 0);
  assert.ok(videoTimeAt(0.5, duration) > 3.5 && videoTimeAt(0.5, duration) < 4.5);
  assert.ok(videoTimeAt(1, duration) >= duration - 0.1);

  let previous = 0;
  for (let i = 0; i <= 100; i++) {
    const time = videoTimeAt(i / 100, duration);
    assert.ok(time >= previous, `Time must be monotonic at step ${i}`);
    assert.ok(time <= duration);
    previous = time;
  }
});

test('legacy frame helpers remain functional for backwards compatibility', () => {
  assert.equal(frameAt(0), 0);
  assert.equal(frameAt(0.5), 480);
  assert.equal(frameAt(1), 959);
  assert.equal(FRAME_COUNT, 960);
});

test('launch intro integrates video, scrolling animations, and enter button', () => {
  const code = readFileSync(new URL('./launch.js', import.meta.url), 'utf8');

  // Verify core requirements: video element, scrolling handlers, and enter button
  assert.match(code, /<video/i, 'Must render video element');
  assert.match(code, /eye-story__video/, 'Must use video class');
  assert.match(code, /enterButton\.addEventListener\('click', enter\)/, 'Enter button must be hooked to dismissal');
  assert.match(code, /window\.addEventListener\('scroll', onScroll/, 'Must handle scroll events');
  assert.match(code, /ENTER ORBITOS/, 'Must render Enter OrbitOS action');
  assert.match(code, /eye-story--exiting/, 'Must trigger exit animation on dismiss');
  assert.match(code, /shell\.inert = false/, 'Must restore dashboard shell on exit');
});
