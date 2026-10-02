import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const defaultPath = resolve('data', 'satellite-operations.sqlite');

const seed = {
  satellites: [
    [
      'SAT-001',
      'ISS (ZARYA)',
      'LEO',
      'United States / Partners',
      'online',
      408,
      27600,
      51.64,
      '2026-10-02T05:14:00Z',
    ],
    [
      'SAT-002',
      'HUBBLE SPACE TELESCOPE',
      'LEO',
      'NASA / ESA',
      'online',
      535,
      27300,
      28.47,
      '2026-10-02T05:13:00Z',
    ],
    [
      'SAT-003',
      'NOAA 20',
      'Polar',
      'NOAA',
      'online',
      824,
      26600,
      98.74,
      '2026-10-02T05:12:00Z',
    ],
    [
      'SAT-004',
      'SENTINEL-2A',
      'Sun-synchronous',
      'ESA',
      'online',
      786,
      26900,
      98.56,
      '2026-10-02T05:11:00Z',
    ],
    [
      'SAT-005',
      'LANDSAT 9',
      'Sun-synchronous',
      'NASA / USGS',
      'maintenance',
      705,
      27000,
      98.22,
      '2026-10-02T04:58:00Z',
    ],
    [
      'SAT-006',
      'GPS BIIR-2',
      'MEO',
      'US Space Force',
      'online',
      20200,
      14000,
      55.0,
      '2026-10-02T05:10:00Z',
    ],
    [
      'SAT-007',
      'GOES-18',
      'Geostationary',
      'NOAA',
      'online',
      35786,
      11070,
      0.04,
      '2026-10-02T05:09:00Z',
    ],
    [
      'SAT-008',
      'STARLINK-30000',
      'LEO',
      'SpaceX',
      'offline',
      550,
      27600,
      53.2,
      '2026-10-02T03:40:00Z',
    ],
  ],
  flights: [
    [
      'FLT-001',
      'AIC173',
      'VT-ANL',
      'Boeing 787-8',
      'Delhi',
      'London',
      'active',
      10880,
      872,
      312,
      28.7041,
      77.1025,
      '2026-10-02T05:14:00Z',
    ],
    [
      'FLT-002',
      'IGO6214',
      'VT-IZR',
      'Airbus A320neo',
      'Bengaluru',
      'Mumbai',
      'active',
      9754,
      806,
      296,
      17.385,
      78.4867,
      '2026-10-02T05:14:00Z',
    ],
    [
      'FLT-003',
      'BAW119',
      'G-ZBKA',
      'Boeing 787-9',
      'London',
      'Bengaluru',
      'active',
      11277,
      901,
      124,
      48.8566,
      2.3522,
      '2026-10-02T05:13:00Z',
    ],
    [
      'FLT-004',
      'UAE516',
      'A6-EQH',
      'Boeing 777-300ER',
      'Dubai',
      'Delhi',
      'active',
      10363,
      887,
      91,
      25.2048,
      55.2708,
      '2026-10-02T05:13:00Z',
    ],
    [
      'FLT-005',
      'SIA406',
      '9V-SKS',
      'Airbus A380-800',
      'Singapore',
      'Delhi',
      'active',
      11582,
      918,
      304,
      13.7563,
      100.5018,
      '2026-10-02T05:12:00Z',
    ],
    [
      'FLT-006',
      'VTI825',
      'VT-TNC',
      'Airbus A320neo',
      'Chennai',
      'Hyderabad',
      'landed',
      0,
      0,
      0,
      13.0827,
      80.2707,
      '2026-10-02T04:45:00Z',
    ],
    [
      'FLT-007',
      'QTR578',
      'A7-BEV',
      'Boeing 777-300ER',
      'Doha',
      'Delhi',
      'delayed',
      0,
      0,
      0,
      25.2736,
      51.6081,
      '2026-10-02T05:00:00Z',
    ],
    [
      'FLT-008',
      'AKJ138',
      'VT-JRA',
      'Boeing 737 MAX 8',
      'Kolkata',
      'Pune',
      'active',
      9144,
      778,
      247,
      22.5726,
      88.3639,
      '2026-10-02T05:11:00Z',
    ],
  ],
  cameras: [
    [
      'CAM-001',
      'Austin Downtown Traffic',
      'Austin, USA',
      'traffic',
      'online',
      30.2672,
      -97.7431,
      'City of Austin Open Data',
      '2026-10-02T05:14:00Z',
    ],
    [
      'CAM-002',
      'Shinjuku Station East',
      'Tokyo, Japan',
      'public-space',
      'online',
      35.6896,
      139.7006,
      'Public demonstration feed',
      '2026-10-02T05:14:00Z',
    ],
    [
      'CAM-003',
      'Tallinn Harbour View',
      'Tallinn, Estonia',
      'harbour',
      'online',
      59.4427,
      24.7536,
      'Public demonstration feed',
      '2026-10-02T05:13:00Z',
    ],
    [
      'CAM-004',
      'Warendorf Market Square',
      'Warendorf, Germany',
      'public-space',
      'maintenance',
      51.9511,
      7.9876,
      'Public demonstration feed',
      '2026-10-02T04:31:00Z',
    ],
    [
      'CAM-005',
      'Delhi Ring Road Monitor',
      'Delhi, India',
      'traffic',
      'online',
      28.6139,
      77.209,
      'DBMS demonstration record',
      '2026-10-02T05:13:00Z',
    ],
    [
      'CAM-006',
      'Mumbai Coastal Road',
      'Mumbai, India',
      'traffic',
      'online',
      19.076,
      72.8777,
      'DBMS demonstration record',
      '2026-10-02T05:12:00Z',
    ],
    [
      'CAM-007',
      'Bengaluru Junction 12',
      'Bengaluru, India',
      'traffic',
      'offline',
      12.9716,
      77.5946,
      'DBMS demonstration record',
      '2026-10-02T03:02:00Z',
    ],
    [
      'CAM-008',
      'Chennai Marina View',
      'Chennai, India',
      'weather',
      'online',
      13.05,
      80.2824,
      'DBMS demonstration record',
      '2026-10-02T05:10:00Z',
    ],
  ],
  crew: [
    [
      'CRW-001',
      'Dr. Maya Rao',
      'Flight Dynamics Lead',
      'Day',
      'online',
      'SAT-001',
      'maya.rao@mission.local',
    ],
    [
      'CRW-002',
      'Ethan Brooks',
      'Telemetry Engineer',
      'Day',
      'online',
      'SAT-002',
      'ethan.brooks@mission.local',
    ],
    [
      'CRW-003',
      'Sofia Martinez',
      'Earth Observation Analyst',
      'Day',
      'online',
      'SAT-003',
      'sofia.martinez@mission.local',
    ],
    [
      'CRW-004',
      'Arjun Menon',
      'Ground Systems Engineer',
      'Night',
      'offline',
      'SAT-004',
      'arjun.menon@mission.local',
    ],
    [
      'CRW-005',
      'Lena Fischer',
      'Payload Specialist',
      'Night',
      'online',
      'SAT-005',
      'lena.fischer@mission.local',
    ],
    [
      'CRW-006',
      'Noah Williams',
      'Communications Officer',
      'Day',
      'online',
      'SAT-007',
      'noah.williams@mission.local',
    ],
  ],
  layers: [
    [
      'ais-live-vessels',
      'Live Vessels',
      'Maritime',
      'AIS vessel positions, headings and tracks',
      'AISStream',
      'live',
      'online',
      'a',
      '◈',
    ],
    [
      'alpr-cameras',
      'ALPR Cameras',
      'Ground',
      'Automatic number plate recognition camera locations',
      'OpenStreetMap / public sources',
      'reference',
      'online',
      'p',
      '▥',
    ],
    [
      'bhote-koshi-2026',
      'Bhote Koshi Event',
      'Events',
      'Before-and-after imagery for the 2026 Bhote Koshi event',
      'Bundled event pack',
      'snapshot',
      'online',
      'h',
      '◇',
    ],
    [
      'bhote-koshi-locator',
      'Bhote Koshi Locator',
      'Events',
      'Event location and regional boundary context',
      'Bundled event pack',
      'reference',
      'online',
      'z',
      '⌖',
    ],
    [
      'bikeshare',
      'Bike Share',
      'Mobility',
      'Public bike station availability',
      'GBFS providers',
      'live',
      'online',
      'b',
      '●',
    ],
    [
      'cctv',
      'Live CCTV',
      'Cameras',
      'Public camera catalog and supported live media',
      'Regional public feeds',
      'live',
      'online',
      'c',
      '▣',
    ],
    [
      'directions',
      'Directions',
      'Mobility',
      'Walking, cycling and driving route overlays',
      'OSRM',
      'interactive',
      'online',
      'n',
      '↗',
    ],
    [
      'earthquakes',
      'Earthquakes',
      'Environment',
      'Recent global seismic events',
      'USGS',
      'live',
      'online',
      'e',
      '◉',
    ],
    [
      'fire-perimeters',
      'Fire Perimeters',
      'Environment',
      'Mapped wildfire perimeter boundaries',
      'Public incident sources',
      'live',
      'online',
      '2',
      '△',
    ],
    [
      'flights',
      'Civil Flights',
      'Aviation',
      'Civil ADS-B aircraft positions and metadata',
      'OpenSky / adsb.lol',
      'live',
      'online',
      'f',
      '✈',
    ],
    [
      'local-dams',
      'Dams',
      'Infrastructure',
      'Global dam infrastructure locations',
      'OpenStreetMap extract',
      'reference',
      'online',
      'q',
      '▰',
    ],
    [
      'local-datacenters',
      'Data Centers',
      'Infrastructure',
      'Mapped data-center infrastructure',
      'OpenStreetMap extract',
      'reference',
      'online',
      'd',
      '▦',
    ],
    [
      'local-firms',
      'Active Fires',
      'Environment',
      'Satellite-derived active fire detections',
      'NASA FIRMS',
      'live',
      'online',
      'w',
      '▲',
    ],
    [
      'military',
      'Military Flights',
      'Defense',
      'Military-associated ADS-B aircraft observations',
      'OpenSky / adsb.lol',
      'live',
      'online',
      'm',
      '✦',
    ],
    [
      'military-awareness',
      'Contacts',
      'Defense',
      'Combined aircraft, vessel and installation awareness',
      'Derived in Nijju’s Eye',
      'derived',
      'online',
      'g',
      '◎',
    ],
    [
      'military-installations',
      'Military Installations',
      'Defense',
      'Mapped military sites and installations',
      'OpenStreetMap',
      'reference',
      'online',
      'i',
      '◆',
    ],
    [
      'radio',
      'Global Radio',
      'Signals',
      'Internet radio and public-safety directory',
      'Radio Browser',
      'live',
      'online',
      'r',
      '◖',
    ],
    [
      'recent-imagery',
      'Recent Imagery',
      'Imagery',
      'Recent Sentinel, Landsat and VIIRS imagery',
      'Esri / satellite providers',
      'live',
      'online',
      '1',
      '▧',
    ],
    [
      'rocket-launches',
      'Space Missions',
      'Space',
      'Launch schedule, mission tracks and replay data',
      'Launch Library 2 / CelesTrak',
      'live',
      'online',
      'x',
      '↟',
    ],
    [
      'satellites',
      'Satellites',
      'Space',
      'Orbital objects grouped by mission and constellation',
      'CelesTrak',
      'live',
      'online',
      's',
      '◉',
    ],
    [
      'telegeography-submarine-cables',
      'Submarine Cables',
      'Infrastructure',
      'Global undersea cable routes and landing points',
      'TeleGeography',
      'reference',
      'online',
      'u',
      '⌁',
    ],
    [
      'traffic',
      'Road Traffic',
      'Mobility',
      'Road network and congestion flow',
      'TomTom / OpenStreetMap',
      'live',
      'configured',
      't',
      '⌁',
    ],
    [
      'transit',
      'Public Transit',
      'Mobility',
      'Live public-transport vehicles and routes',
      'GTFS-Realtime providers',
      'live',
      'online',
      'j',
      '▤',
    ],
    [
      'weather-cyclones',
      'Tropical Cyclones',
      'Weather',
      'Current cyclone advisories, tracks and cones',
      'NOAA NHC / CPHC',
      'live',
      'online',
      'y',
      '🌀',
    ],
    [
      'weather-lightning',
      'Lightning Density',
      'Weather',
      'Observed lightning-strike density imagery',
      'NOAA nowCOAST',
      'live',
      'online',
      'l',
      'ϟ',
    ],
    [
      'weather-radar',
      'Weather Radar',
      'Weather',
      'Observed radar reflectivity',
      'NOAA nowCOAST',
      'live',
      'online',
      'v',
      '◌',
    ],
    [
      'weather-satellite',
      'Weather Satellite',
      'Weather',
      'GOES and global infrared cloud imagery',
      'NOAA nowCOAST',
      'live',
      'online',
      'o',
      '◍',
    ],
    [
      'wind',
      'Wind Forecast',
      'Weather',
      'Animated GFS and ECMWF wind fields',
      'NOAA GFS / ECMWF IFS',
      'forecast',
      'online',
      'k',
      '≋',
    ],
  ],
};

export function openSatelliteDatabase(
  filename = process.env.SATELLITE_DB_PATH || defaultPath,
) {
  mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS satellites (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, orbit_type TEXT NOT NULL,
      operator TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('online','offline','maintenance')),
      altitude_km REAL NOT NULL, speed_kmh REAL NOT NULL, inclination_deg REAL NOT NULL, last_contact TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS flights (
      id TEXT PRIMARY KEY, callsign TEXT NOT NULL, registration TEXT NOT NULL, aircraft_type TEXT NOT NULL,
      origin TEXT NOT NULL, destination TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('active','landed','delayed')),
      altitude_m REAL NOT NULL, speed_kmh REAL NOT NULL, heading_deg REAL NOT NULL,
      latitude REAL NOT NULL, longitude REAL NOT NULL, observed_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS cameras (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, location TEXT NOT NULL, category TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('online','offline','maintenance')),
      latitude REAL NOT NULL, longitude REAL NOT NULL, source TEXT NOT NULL, last_checked TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS crew (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, shift TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('online','offline')), satellite_id TEXT,
      email TEXT NOT NULL UNIQUE, FOREIGN KEY (satellite_id) REFERENCES satellites(id)
    );
    CREATE TABLE IF NOT EXISTS data_layers (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
      description TEXT NOT NULL, source TEXT NOT NULL,
      data_mode TEXT NOT NULL CHECK(data_mode IN ('live','forecast','reference','snapshot','derived','interactive')),
      status TEXT NOT NULL CHECK(status IN ('online','configured','offline')),
      share_token TEXT NOT NULL UNIQUE, icon TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_satellites_status ON satellites(status);
    CREATE INDEX IF NOT EXISTS idx_flights_status ON flights(status);
    CREATE INDEX IF NOT EXISTS idx_cameras_status ON cameras(status);
    CREATE INDEX IF NOT EXISTS idx_crew_status ON crew(status);
    CREATE INDEX IF NOT EXISTS idx_layers_category ON data_layers(category);
    CREATE INDEX IF NOT EXISTS idx_layers_mode ON data_layers(data_mode);
  `);
  seedIfEmpty(db);
  db.prepare(
    "UPDATE data_layers SET source = 'Derived in Nijju’s Eye' WHERE id = 'military-awareness'",
  ).run();
  return db;
}

function insertRows(db, table, columns, rows) {
  const placeholders = columns.map(() => '?').join(',');
  const statement = db.prepare(
    `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`,
  );
  for (const row of rows) statement.run(...row);
}

function seedIfEmpty(db) {
  db.exec('BEGIN');
  try {
    if (!db.prepare('SELECT COUNT(*) AS count FROM satellites').get().count) {
      insertRows(
        db,
        'satellites',
        [
          'id',
          'name',
          'orbit_type',
          'operator',
          'status',
          'altitude_km',
          'speed_kmh',
          'inclination_deg',
          'last_contact',
        ],
        seed.satellites,
      );
      insertRows(
        db,
        'flights',
        [
          'id',
          'callsign',
          'registration',
          'aircraft_type',
          'origin',
          'destination',
          'status',
          'altitude_m',
          'speed_kmh',
          'heading_deg',
          'latitude',
          'longitude',
          'observed_at',
        ],
        seed.flights,
      );
      insertRows(
        db,
        'cameras',
        [
          'id',
          'name',
          'location',
          'category',
          'status',
          'latitude',
          'longitude',
          'source',
          'last_checked',
        ],
        seed.cameras,
      );
      insertRows(
        db,
        'crew',
        ['id', 'name', 'role', 'shift', 'status', 'satellite_id', 'email'],
        seed.crew,
      );
    }
    if (!db.prepare('SELECT COUNT(*) AS count FROM data_layers').get().count) {
      insertRows(
        db,
        'data_layers',
        [
          'id',
          'name',
          'category',
          'description',
          'source',
          'data_mode',
          'status',
          'share_token',
          'icon',
        ],
        seed.layers,
      );
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

const allowedTables = new Set([
  'satellites',
  'flights',
  'cameras',
  'crew',
  'data_layers',
]);

export function listRecords(db, type, { status = '', query = '' } = {}) {
  if (!allowedTables.has(type)) return null;
  const fields =
    type === 'crew' ? 'crew.*, satellites.name AS satellite_name' : `${type}.*`;
  const join =
    type === 'crew'
      ? ' LEFT JOIN satellites ON satellites.id = crew.satellite_id'
      : '';
  const searchable =
    type === 'satellites'
      ? ['name', 'operator', 'orbit_type']
      : type === 'flights'
        ? ['callsign', 'registration', 'aircraft_type', 'origin', 'destination']
        : type === 'cameras'
          ? ['name', 'location', 'category', 'source']
          : type === 'crew'
            ? ['crew.name', 'role', 'shift', 'email', 'satellites.name']
            : ['id', 'name', 'category', 'description', 'source', 'data_mode'];
  const conditions = [];
  const params = [];
  if (status) {
    conditions.push(`${type}.status = ?`);
    params.push(status);
  }
  if (query) {
    conditions.push(
      `(${searchable.map((field) => `${field} LIKE ?`).join(' OR ')})`,
    );
    for (let i = 0; i < searchable.length; i += 1) params.push(`%${query}%`);
  }
  const where = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
  return db
    .prepare(`SELECT ${fields} FROM ${type}${join}${where} ORDER BY ${type}.id`)
    .all(...params);
}

export function dashboardSummary(db) {
  const count = (table, condition = '1=1') =>
    db
      .prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${condition}`)
      .get().count;
  return {
    satellites: {
      total: count('satellites'),
      online: count('satellites', "status='online'"),
    },
    flights: {
      total: count('flights'),
      active: count('flights', "status='active'"),
    },
    cameras: {
      total: count('cameras'),
      online: count('cameras', "status='online'"),
    },
    crew: { total: count('crew'), online: count('crew', "status='online'") },
    layers: {
      total: count('data_layers'),
      live: count('data_layers', "data_mode='live'"),
      online: count('data_layers', "status='online'"),
    },
  };
}
