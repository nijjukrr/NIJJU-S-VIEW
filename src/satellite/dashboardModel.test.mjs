import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterRows,
  globeUrl,
  exportCsv,
  formatValue,
  views,
} from './dashboardModel.js';

test('layer mode filtering is independent of database status', () => {
  const rows = [
    { name: 'Radar', category: 'Weather', data_mode: 'live', status: 'online' },
    {
      name: 'Wind',
      category: 'Weather',
      data_mode: 'forecast',
      status: 'configured',
    },
  ];
  assert.deepEqual(filterRows(rows, 'rad', 'live', 'Weather'), [rows[0]]);
  assert.equal(filterRows(rows, '', 'reference', '').length, 0);
});
test('record searches combine status with case-insensitive query', () => {
  const rows = [
    { name: 'ISS', status: 'online' },
    { name: 'ISS backup', status: 'offline' },
  ];
  assert.deepEqual(filterRows(rows, ' iss ', 'online', ''), [rows[0]]);
});
test('globe launch retains selected layer, altitude and visual mode', () => {
  const result = new URL(
    globeUrl({ share_token: 's' }, 'nvg', 500),
    'http://localhost',
  );
  const hash = new URLSearchParams(result.hash.slice(1));
  assert.equal(result.searchParams.get('portal'), '1');
  assert.equal(hash.get('l'), 's');
  assert.equal(hash.get('alt'), '500000');
  assert.equal(hash.get('style'), 'nvg');
  assert.equal(hash.get('map'), 'osm');
});
test('CSV exports shown fields and neutralizes spreadsheet formulas', () => {
  const csv = exportCsv(
    [{ name: '=SUM(1,2)', status: 'online' }],
    [
      ['name', 'Name'],
      ['status', 'Status'],
    ],
  );
  assert.equal(csv, '"Name","Status"\r\n"\'=SUM(1,2)","online"');
});
test('all original collections have a primary field and columns', () => {
  assert.equal(Object.keys(views).length, 5);
  for (const view of Object.values(views))
    assert.ok(view.primary && view.columns.length);
  assert.equal(formatValue('altitude_km', 500), '500 km');
});
