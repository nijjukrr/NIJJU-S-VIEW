import {
  openSatelliteDatabase,
  dashboardSummary,
  listRecords,
} from './database.js';

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

export function satelliteDbmsPlugin() {
  let db;
  function install(server) {
    db = openSatelliteDatabase();
    server.middlewares.use('/api/satellite-db', (request, response) => {
      if (request.method !== 'GET')
        return sendJson(response, 405, { error: 'Method not allowed' });
      const url = new URL(request.url || '/', 'http://localhost');
      if (url.pathname === '/summary' || url.pathname === '/')
        return sendJson(response, 200, dashboardSummary(db));
      const type = url.pathname.slice(1);
      const records = listRecords(db, type, {
        status: String(url.searchParams.get('status') || '').slice(0, 32),
        query: String(url.searchParams.get('q') || '').slice(0, 80),
      });
      if (!records)
        return sendJson(response, 404, { error: 'Unknown data collection' });
      return sendJson(response, 200, { records, count: records.length });
    });
    server.httpServer?.once('close', () => {
      db?.close();
      db = undefined;
    });
  }
  return {
    name: 'satellite-dbms-api',
    configureServer: install,
    configurePreviewServer: install,
    closeBundle() {
      db?.close();
      db = undefined;
    },
  };
}
