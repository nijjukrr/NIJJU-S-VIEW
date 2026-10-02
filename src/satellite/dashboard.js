const views = {
  data_layers: {
    eyebrow: 'COMPLETE DATA CATALOG',
    title: 'Every Nijju’s Eye layer',
    primary: 'name',
    columns: [],
  },
  satellites: {
    eyebrow: 'ORBITAL ASSETS',
    title: 'Satellite registry',
    primary: 'name',
    columns: [
      ['id', 'Asset ID'],
      ['name', 'Satellite'],
      ['orbit_type', 'Orbit'],
      ['operator', 'Operator'],
      ['altitude_km', 'Altitude'],
      ['speed_kmh', 'Speed'],
      ['status', 'Status'],
      ['last_contact', 'Last contact'],
    ],
  },
  flights: {
    eyebrow: 'AIRSPACE ACTIVITY',
    title: 'Flight registry',
    primary: 'callsign',
    columns: [
      ['id', 'Flight ID'],
      ['callsign', 'Callsign'],
      ['aircraft_type', 'Aircraft'],
      ['origin', 'Origin'],
      ['destination', 'Destination'],
      ['altitude_m', 'Altitude'],
      ['status', 'Status'],
      ['observed_at', 'Observed'],
    ],
  },
  cameras: {
    eyebrow: 'GROUND OBSERVATION',
    title: 'Camera registry',
    primary: 'name',
    columns: [
      ['id', 'Camera ID'],
      ['name', 'Camera'],
      ['location', 'Location'],
      ['category', 'Category'],
      ['source', 'Source'],
      ['status', 'Status'],
      ['last_checked', 'Last checked'],
    ],
  },
  crew: {
    eyebrow: 'MISSION PERSONNEL',
    title: 'Crew directory',
    primary: 'name',
    columns: [
      ['id', 'Crew ID'],
      ['name', 'Name'],
      ['role', 'Role'],
      ['shift', 'Shift'],
      ['satellite_name', 'Assignment'],
      ['status', 'Status'],
      ['email', 'Contact'],
    ],
  },
};

let currentView = 'data_layers';
let currentCategory = '';
let allLayers = [];
let selectedLayer = null;
let selectedStyle = 'normal';
let launchAltitudeKm = 12000;
let requestId = 0;
const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? '—').replace(
    /[&<>'"]/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[
        char
      ],
  );
}

function formatValue(key, value) {
  if (value == null || value === '') return '—';
  if (key === 'altitude_km') return `${Number(value).toLocaleString()} km`;
  if (key === 'altitude_m') return `${Number(value).toLocaleString()} m`;
  if (key === 'speed_kmh') return `${Number(value).toLocaleString()} km/h`;
  if (
    key.includes('_at') ||
    key === 'last_contact' ||
    key === 'last_checked' ||
    key === 'observed_at'
  )
    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  return String(value);
}

function statusBadge(status) {
  return `<span class="status status-${escapeHtml(status)}"><i></i>${escapeHtml(status)}</span>`;
}

async function loadSummary() {
  const response = await fetch('/api/satellite-db/summary');
  if (!response.ok) throw new Error('Summary endpoint unavailable');
  const data = await response.json();
  const metrics = [
    [
      'satellite',
      data.satellites.online,
      `${data.satellites.total} registered`,
      'satellites',
    ],
    ['flight', data.flights.active, `${data.flights.total} tracked`, 'flights'],
    [
      'camera',
      data.cameras.online,
      `${data.cameras.total} configured`,
      'cameras',
    ],
    ['crew', data.crew.online, `${data.crew.total} assigned`, 'crew'],
    [
      'layer',
      data.layers.total,
      `${data.layers.live} live feeds`,
      'data_layers',
    ],
  ];
  for (const [id, value, sub, type] of metrics) {
    $(`#${id}Metric`).textContent = value;
    $(`#${id}Sub`).textContent = sub;
    document.querySelector(`[data-nav-count="${type}"]`).textContent = value;
  }
}

function globeUrl(layer = selectedLayer) {
  if (!layer) return '/';
  const params = new URLSearchParams({
    lat: '20',
    lon: '78',
    alt: String(launchAltitudeKm * 1000),
    heading: '0',
    pitch: '-90',
    style: selectedStyle,
    map: 'photoreal',
    v: '2',
    l: layer.share_token,
  });
  return `/?portal=1#${params}`;
}

function launchLayer(layer) {
  window.location.assign(globeUrl(layer));
}

function selectLayer(layer) {
  selectedLayer = layer;
  $('#selectedLayerLabel').textContent =
    layer?.name?.toUpperCase() || 'ALL LAYERS';
}

async function loadLayers() {
  const response = await fetch('/api/satellite-db/data_layers');
  if (!response.ok) throw new Error('Layer catalog unavailable');
  const data = await response.json();
  allLayers = data.records;
  renderCategoryFilters();
  renderLayers();
}

function renderCategoryFilters() {
  const categories = [
    ...new Set(allLayers.map((layer) => layer.category)),
  ].sort();
  $('#categoryFilters').innerHTML = ['', ...categories]
    .map(
      (category) =>
        `<button data-category="${escapeHtml(category)}" class="${currentCategory === category ? 'active' : ''}">${escapeHtml(category || 'All')}</button>`,
    )
    .join('');
  document.querySelectorAll('#categoryFilters button').forEach((button) =>
    button.addEventListener('click', () => {
      currentCategory = button.dataset.category;
      renderCategoryFilters();
      renderLayers();
    }),
  );
}

function renderLayers() {
  const query = $('#layerSearch').value.trim().toLowerCase();
  const layers = allLayers.filter(
    (layer) =>
      (!currentCategory || layer.category === currentCategory) &&
      (!query ||
        [layer.name, layer.category, layer.description, layer.source]
          .join(' ')
          .toLowerCase()
          .includes(query)),
  );
  $('#layerTitle').textContent = currentCategory
    ? `${currentCategory} data layers`
    : 'Every Nijju’s Eye layer';
  $('#layerCount').textContent =
    `${layers.length} integrated layer${layers.length === 1 ? '' : 's'}`;
  $('#layerGrid').innerHTML = layers
    .map(
      (
        layer,
      ) => `<article class="layer-card" data-layer-id="${escapeHtml(layer.id)}">
        <span class="layer-card-icon">${escapeHtml(layer.icon)}</span>
        <h3>${escapeHtml(layer.name)}</h3>
        <p>${escapeHtml(layer.description)}</p>
        <div class="layer-meta"><span>${escapeHtml(layer.category)}</span><span class="${layer.data_mode === 'live' ? 'live' : ''}">${escapeHtml(layer.data_mode)}</span></div>
        <footer><small title="${escapeHtml(layer.source)}">${escapeHtml(layer.source)}</small><button data-launch="${escapeHtml(layer.id)}">VIEW ON GLOBE ↗</button></footer>
      </article>`,
    )
    .join('');
  document.querySelectorAll('[data-launch]').forEach((button) =>
    button.addEventListener('click', () => {
      const layer = allLayers.find((item) => item.id === button.dataset.launch);
      selectLayer(layer);
      launchLayer(layer);
    }),
  );
}

async function loadRecords() {
  const ownRequest = ++requestId;
  const query = new URLSearchParams();
  const status = $('#statusFilter').value;
  const search = $('#search').value.trim();
  if (status) query.set('status', status);
  if (search) query.set('q', search);
  $('#tableBody').innerHTML =
    '<tr><td class="loading-cell" colspan="8">Querying database…</td></tr>';
  try {
    const response = await fetch(`/api/satellite-db/${currentView}?${query}`);
    if (!response.ok) throw new Error('Database query failed');
    const data = await response.json();
    if (ownRequest !== requestId) return;
    renderTable(data.records);
  } catch (error) {
    $('#tableBody').innerHTML =
      `<tr><td class="error-cell" colspan="8">${escapeHtml(error.message)}</td></tr>`;
    showToast('Could not reach the Satellite database API');
  }
}

function renderTable(records) {
  const view = views[currentView];
  $('#tableHead').innerHTML =
    `<tr>${view.columns.map(([, label]) => `<th>${label}</th>`).join('')}</tr>`;
  $('#recordCount').textContent =
    `${records.length} record${records.length === 1 ? '' : 's'}`;
  if (!records.length) {
    $('#tableBody').innerHTML =
      '<tr><td class="empty-cell" colspan="8">No matching records found.</td></tr>';
    return;
  }
  $('#tableBody').innerHTML = records
    .map(
      (record, index) =>
        `<tr tabindex="0" data-index="${index}">${view.columns.map(([key]) => `<td>${key === 'status' ? statusBadge(record[key]) : escapeHtml(formatValue(key, record[key]))}</td>`).join('')}</tr>`,
    )
    .join('');
  document.querySelectorAll('#tableBody tr').forEach((row) => {
    const open = () => openRecord(records[Number(row.dataset.index)]);
    row.addEventListener('click', open);
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') open();
    });
  });
}

function openRecord(record) {
  const view = views[currentView];
  $('#dialogType').textContent = `${view.eyebrow} / ${record.id}`;
  $('#dialogTitle').textContent = record[view.primary];
  $('#dialogFields').innerHTML = Object.entries(record)
    .filter(([key]) => key !== view.primary)
    .map(
      ([key, value]) =>
        `<div><small>${escapeHtml(key.replaceAll('_', ' '))}</small><strong>${key === 'status' ? statusBadge(value) : escapeHtml(formatValue(key, value))}</strong></div>`,
    )
    .join('');
  const layerIds = {
    satellites: 'satellites',
    flights: 'flights',
    cameras: 'cctv',
    crew: 'satellites',
  };
  const layer = allLayers.find((item) => item.id === layerIds[currentView]);
  $('#dialogGlobe').onclick = () => launchLayer(layer);
  $('#recordDialog').showModal();
}

function selectView(view, category = '') {
  currentView = view;
  currentCategory = category;
  document
    .querySelectorAll('.nav-item')
    .forEach((item) =>
      item.classList.toggle(
        'active',
        item.dataset.view === view &&
          (item.dataset.category || '') === category,
      ),
    );
  if (view === 'data_layers') {
    $('#layerExplorer').hidden = false;
    $('#recordPanel').hidden = true;
    renderCategoryFilters();
    renderLayers();
    return;
  }
  $('#layerExplorer').hidden = true;
  $('#recordPanel').hidden = false;
  $('#viewEyebrow').textContent = views[view].eyebrow;
  $('#viewTitle').textContent = views[view].title;
  $('#search').value = '';
  $('#statusFilter').value = '';
  loadRecords();
}

function showToast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  setTimeout(() => $('#toast').classList.remove('show'), 3200);
}

document
  .querySelectorAll('.nav-item')
  .forEach((item) =>
    item.addEventListener('click', () =>
      selectView(item.dataset.view, item.dataset.category || ''),
    ),
  );
document.querySelectorAll('[data-live-layer]').forEach((button) =>
  button.addEventListener('click', () => {
    const layer = allLayers.find(
      (item) => item.id === button.dataset.liveLayer,
    );
    if (!layer) return showToast('Layer catalog is still loading');
    selectLayer(layer);
    launchLayer(layer);
  }),
);
document.querySelectorAll('.mode').forEach((button) =>
  button.addEventListener('click', () => {
    selectedStyle = button.dataset.style;
    document
      .querySelectorAll('.mode')
      .forEach((item) => item.classList.toggle('active', item === button));
  }),
);
function updateAltitude() {
  $('#altitudeOutput').textContent = `${launchAltitudeKm.toLocaleString()} km`;
}
$('#zoomIn').addEventListener('click', () => {
  launchAltitudeKm = Math.max(25, Math.round(launchAltitudeKm / 2));
  updateAltitude();
});
$('#zoomOut').addEventListener('click', () => {
  launchAltitudeKm = Math.min(40000, launchAltitudeKm * 2);
  updateAltitude();
});
$('#launchGlobe').addEventListener('click', () => launchLayer(selectedLayer));
$('#layerSearch').addEventListener('input', renderLayers);
$('#statusFilter').addEventListener('change', loadRecords);
let searchTimer;
$('#search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadRecords, 250);
});
$('.dialog-close').addEventListener('click', () => $('#recordDialog').close());
$('#recordDialog').addEventListener('click', (event) => {
  if (event.target === $('#recordDialog')) $('#recordDialog').close();
});
setInterval(() => {
  $('#clock').textContent = new Date().toLocaleTimeString([], {
    hour12: false,
  });
}, 1000);
$('#clock').textContent = new Date().toLocaleTimeString([], { hour12: false });

Promise.all([loadSummary(), loadLayers()]).catch((error) =>
  showToast(error.message),
);
