export const views = {
  data_layers: {
    title: 'Layer catalog',
    subtitle: 'Global intelligence sources',
    primary: 'name',
    columns: [
      ['name', 'Layer'],
      ['category', 'Category'],
      ['data_mode', 'Mode'],
      ['source', 'Source'],
    ],
  },
  satellites: {
    title: 'Satellite registry',
    subtitle: 'Orbital assets',
    primary: 'name',
    columns: [
      ['id', 'Asset ID'],
      ['name', 'Satellite'],
      ['orbit_type', 'Orbit'],
      ['operator', 'Operator'],
      ['altitude_km', 'Altitude'],
      ['status', 'Status'],
    ],
  },
  flights: {
    title: 'Flight registry',
    subtitle: 'Airspace activity',
    primary: 'callsign',
    columns: [
      ['callsign', 'Callsign'],
      ['aircraft_type', 'Aircraft'],
      ['origin', 'Origin'],
      ['destination', 'Destination'],
      ['altitude_m', 'Altitude'],
      ['status', 'Status'],
    ],
  },
  cameras: {
    title: 'Camera registry',
    subtitle: 'Ground observation',
    primary: 'name',
    columns: [
      ['name', 'Camera'],
      ['location', 'Location'],
      ['category', 'Category'],
      ['source', 'Source'],
      ['status', 'Status'],
    ],
  },
  crew: {
    title: 'Crew directory',
    subtitle: 'Mission personnel',
    primary: 'name',
    columns: [
      ['name', 'Name'],
      ['role', 'Role'],
      ['shift', 'Shift'],
      ['satellite_name', 'Assignment'],
      ['status', 'Status'],
    ],
  },
};
export function globeUrl(layer, style = 'normal', altitude = 12000) {
  const params = new URLSearchParams({
    lat: '20',
    lon: '78',
    alt: String(altitude * 1000),
    heading: '0',
    pitch: '-90',
    style,
    map: 'osm',
    v: '2',
  });
  if (layer) params.set('l', layer.share_token);
  return `/?portal=1#${params}`;
}
export function formatValue(key, value) {
  if (value == null || value === '') return '-';
  if (key === 'altitude_km') return `${Number(value).toLocaleString()} km`;
  if (key === 'altitude_m') return `${Number(value).toLocaleString()} m`;
  if (key === 'speed_kmh') return `${Number(value).toLocaleString()} km/h`;
  if (/(_at|last_contact|last_checked)$/.test(key))
    return new Date(value).toLocaleString();
  return String(value);
}
export function filterRows(records, query, status, category) {
  const needle = query.trim().toLowerCase();
  return records.filter(
    (row) =>
      (!status || (row.data_mode || row.status) === status) &&
      (!category || row.category === category) &&
      (!needle || Object.values(row).join(' ').toLowerCase().includes(needle)),
  );
}
export function exportCsv(records, columns) {
  const cell = (value) =>
    `"${String(value ?? '')
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""')}"`;
  return [
    columns.map(([, label]) => label),
    ...records.map((row) => columns.map(([key]) => row[key])),
  ]
    .map((row) => row.map(cell).join(','))
    .join('\r\n');
}
