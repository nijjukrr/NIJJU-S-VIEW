import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  dashboardSummary,
  listRecords,
  openSatelliteDatabase,
} from './database.js';

test('seeds related demonstration records and reports dashboard totals', () => {
  const filename = join(
    tmpdir(),
    `satellite-db-${process.pid}-${Date.now()}.sqlite`,
  );
  const db = openSatelliteDatabase(filename);
  try {
    assert.deepEqual(dashboardSummary(db), {
      satellites: { total: 8, online: 6 },
      flights: { total: 8, active: 6 },
      cameras: { total: 8, online: 6 },
      crew: { total: 6, online: 5 },
      layers: { total: 28, live: 18, online: 27 },
    });
    const assignedCrew = listRecords(db, 'crew', { query: 'ZARYA' });
    assert.equal(assignedCrew.length, 1);
    assert.equal(assignedCrew[0].name, 'Dr. Maya Rao');
    assert.equal(assignedCrew[0].satellite_name, 'ISS (ZARYA)');
  } finally {
    db.close();
    rmSync(filename, { force: true });
  }
});

test('filters each supported collection and rejects unknown table names', () => {
  const filename = join(
    tmpdir(),
    `satellite-db-${process.pid}-${Date.now()}-filter.sqlite`,
  );
  const db = openSatelliteDatabase(filename);
  try {
    assert.equal(listRecords(db, 'flights', { status: 'active' }).length, 6);
    assert.equal(listRecords(db, 'cameras', { query: 'India' }).length, 4);
    assert.equal(
      listRecords(db, 'data_layers', { query: 'military' }).length,
      3,
    );
    assert.equal(listRecords(db, 'not_a_table'), null);
  } finally {
    db.close();
    rmSync(filename, { force: true });
  }
});
