# Satellite Operations DBMS

The academic dashboard opens by default at `http://localhost:4173/`. The original God's Eye View interface remains available at `/?globe=1`, and dashboard layer launches use `/?portal=1#...` share URLs.

## Run

```powershell
npm install
npm run dev
```

The first request creates `data/satellite-operations.sqlite`. The database uses five normalized entity tables:

- `satellites`: orbital asset identity and telemetry snapshot
- `flights`: civil flight position and status snapshot
- `cameras`: public camera catalog and health state
- `crew`: operations personnel, related to `satellites` by `satellite_id`
- `data_layers`: all 28 shareable God’s Eye View layers, their source, mode, category and stable globe share token

Indexes support status and category filters, a foreign key enforces crew assignment integrity, and `CHECK` constraints restrict status values. The Vite middleware exposes read-only endpoints beneath `/api/satellite-db`: `/summary`, `/satellites`, `/flights`, `/cameras`, `/crew`, and `/data_layers`. Collection endpoints accept `status` and `q` query parameters.

The top Live Data bar and every catalog card create a native God’s Eye View share URL. The URL enables only the chosen layer (`l=<stable token>`), uses the bundled OpenStreetMap imagery, carries the chosen Normal/CRT/NVG/FLIR/Noir style, and applies the selected launch altitude. The globe remains the original renderer and retains its own camera, selection, playback, layer and zoom controls.

The bundled rows are explicitly demonstration snapshots inspired by the categories and public-source architecture of God's Eye View. They must not be presented as live positions, live camera verification, or current operational telemetry.
