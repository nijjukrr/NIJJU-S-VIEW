import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const indexHtml = await readFile(
  new URL('../../index.html', import.meta.url),
  'utf8',
);
const dashboardHtml = await readFile(
  new URL('../../satellite.html', import.meta.url),
  'utf8',
);
const dashboardScript = await readFile(
  new URL('./dashboardModel.js', import.meta.url),
  'utf8',
);
const launchHtml = await readFile(
  new URL('../../launch.html', import.meta.url),
  'utf8',
);
const introScript = await readFile(
  new URL('../launch/launch.js', import.meta.url),
  'utf8',
);

test("cinematic entry stays inside Nijju's Eye and dismisses without navigation", () => {
  assert.match(launchHtml, /\/satellite\.html\?intro=1/);
  assert.match(dashboardHtml, /src="\/src\/launch\/launch\.js"/);
  assert.match(introScript, /Nijju's Eye/);
  assert.match(introScript, /shell\.inert = false/);
  assert.match(introScript, /root\.remove\(\)/);
  assert.doesNotMatch(introScript, /location\.(assign|replace)|ORBITOPS|5174/);
});

test('root entry opens the orbital intro unless a globe launch is explicit', () => {
  assert.match(
    indexHtml,
    /!search\.has\('portal'\) && !search\.has\('globe'\)/,
  );
  assert.match(indexHtml, /window\.location\.replace\('\/launch\.html'\)/);
});

test('dashboard globe link opts out of the root redirect', () => {
  assert.match(dashboardHtml, /href="\/\?globe=1"/);
});

test('dashboard launches use the working map directly', () => {
  assert.match(
    dashboardScript,
    /if \(layer\) params\.set\('l', layer\.share_token\)/,
  );
  assert.match(dashboardScript, /map: 'osm'/);
  assert.doesNotMatch(dashboardScript, /map: 'photoreal'/);
});
