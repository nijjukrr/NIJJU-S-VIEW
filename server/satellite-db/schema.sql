-- ============================================================================
-- NIJJU'S EYE // SATELLITE OPERATIONS DATABASE SCHEMA
-- Target DBMS: SQLite 3.x / PostgreSQL compatible
-- Database: data/satellite-operations.sqlite
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Table: satellites
-- Description: Orbital satellite tracking catalog with telemetry attributes.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS satellites (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    orbit_type      TEXT NOT NULL,
    operator        TEXT NOT NULL,
    status          TEXT NOT NULL CHECK(status IN ('online', 'offline', 'maintenance')),
    altitude_km     REAL NOT NULL,
    speed_kmh       REAL NOT NULL,
    inclination_deg REAL NOT NULL,
    last_contact    TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: flights
-- Description: Civil and military flight telemetry snapshot.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flights (
    id              TEXT PRIMARY KEY,
    callsign        TEXT NOT NULL,
    registration    TEXT NOT NULL,
    aircraft_type   TEXT NOT NULL,
    origin          TEXT NOT NULL,
    destination     TEXT NOT NULL,
    status          TEXT NOT NULL CHECK(status IN ('active', 'landed', 'delayed')),
    altitude_m      REAL NOT NULL,
    speed_kmh       REAL NOT NULL,
    heading_deg     REAL NOT NULL,
    latitude        REAL NOT NULL,
    longitude       REAL NOT NULL,
    observed_at     TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: cameras
-- Description: Global ground sensor & public CCTV camera catalog.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cameras (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    location        TEXT NOT NULL,
    category        TEXT NOT NULL,
    status          TEXT NOT NULL CHECK(status IN ('online', 'offline', 'maintenance')),
    latitude        REAL NOT NULL,
    longitude       REAL NOT NULL,
    source          TEXT NOT NULL,
    last_checked    TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- Table: crew
-- Description: Operations personnel and operator assignment roster.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crew (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    role            TEXT NOT NULL,
    shift           TEXT NOT NULL,
    status          TEXT NOT NULL CHECK(status IN ('online', 'offline')),
    satellite_id    TEXT,
    email           TEXT NOT NULL UNIQUE,
    FOREIGN KEY (satellite_id) REFERENCES satellites(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- Table: data_layers
-- Description: 28 shareable geospatial layers with share tokens and data modes.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS data_layers (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    category        TEXT NOT NULL,
    description     TEXT NOT NULL,
    source          TEXT NOT NULL,
    data_mode       TEXT NOT NULL CHECK(data_mode IN ('live', 'forecast', 'reference', 'snapshot', 'derived', 'interactive')),
    status          TEXT NOT NULL CHECK(status IN ('online', 'configured', 'offline')),
    share_token     TEXT NOT NULL UNIQUE,
    icon            TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- Indexes: Performance optimization for filtering and category queries
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_satellites_status ON satellites(status);
CREATE INDEX IF NOT EXISTS idx_flights_status    ON flights(status);
CREATE INDEX IF NOT EXISTS idx_cameras_status    ON cameras(status);
CREATE INDEX IF NOT EXISTS idx_crew_status       ON crew(status);
CREATE INDEX IF NOT EXISTS idx_layers_category   ON data_layers(category);
CREATE INDEX IF NOT EXISTS idx_layers_mode       ON data_layers(data_mode);
