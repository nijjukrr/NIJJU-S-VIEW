import test from 'node:test';
import assert from 'node:assert/strict';
import { FrameCache } from './frameCache.js';

async function drain(cache) {
  while (cache.pending.size || cache.queue.length)
    await new Promise(setImmediate);
}

test('frame cache bounds concurrency and decoded memory while scrolling', async () => {
  let active = 0,
    peak = 0,
    closed = 0;
  const cache = new FrameCache(() => {}, {
    limit: 8,
    load: async (index) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise(setImmediate);
      active--;
      return { index, close: () => closed++ };
    },
  });
  cache.request(100);
  await drain(cache);
  assert.ok(peak <= 4);
  assert.ok(cache.frames.size <= 8);
  assert.equal(cache.get(100).index, 100);
  cache.request(400);
  await drain(cache);
  assert.equal(cache.get(400).index, 400);
  assert.ok(cache.frames.size <= 8 && closed > 0);
  cache.dispose();
  assert.equal(cache.frames.size, 0);
});

test('a stationary mobile playhead does not reload evicted neighbors', async () => {
  let loads = 0;
  const cache = new FrameCache(() => {}, {
    limit: 18,
    load: async () => {
      loads++;
      return { close() {} };
    },
  });
  cache.request(200);
  await drain(cache);
  const settled = loads;
  for (let i = 0; i < 5; i++) {
    cache.request(200);
    await drain(cache);
  }
  assert.equal(loads, settled);
  cache.dispose();
});

test('failed frames do not loop requests or stop neighboring frames', async () => {
  let failures = 0;
  const cache = new FrameCache(() => {}, {
    load: async (index) => {
      if (index === 5) {
        failures++;
        throw new Error('missing');
      }
      return { close() {} };
    },
  });
  cache.request(5);
  await drain(cache);
  cache.request(5);
  await drain(cache);
  assert.equal(failures, 1);
  assert.ok(cache.get(6));
  cache.dispose();
});

test('disposal aborts outstanding loads and closes late bitmap results', async () => {
  const requests = [];
  let closed = 0;
  const cache = new FrameCache(() => assert.fail('callback after disposal'), {
    load: (index, signal) =>
      new Promise((resolve) => requests.push({ signal, resolve })),
  });
  cache.request(0);
  cache.dispose();
  assert.ok(requests.every((request) => request.signal.aborted));
  requests.forEach((request) => request.resolve({ close: () => closed++ }));
  await drain(cache);
  assert.equal(closed, requests.length);
});
