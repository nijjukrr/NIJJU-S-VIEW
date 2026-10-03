import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Camera,
  ChevronRight,
  Download,
  Globe2,
  Layers,
  Moon,
  Plane,
  RefreshCw,
  Satellite,
  Search,
  Shield,
  Sun,
  Users,
  Cloud,
  Building2,
  Radio,
  RotateCcw,
} from 'lucide-react';
import './tallie.css';
import DashboardLayout from '@/components/watermelon/tallie-dashboard/dashboard-layout';
import {
  ThemeProvider,
  useTheme,
} from '@/components/watermelon/tallie-dashboard/components/tallie/theme-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  views,
  globeUrl,
  formatValue,
  filterRows,
  exportCsv,
} from './dashboardModel.js';

const collections = [
  ['data_layers', 'All layers', Layers],
  ['satellites', 'Satellites', Satellite],
  ['flights', 'Flights', Plane],
  ['cameras', 'Cameras', Camera],
  ['crew', 'Crew', Users],
];
const categories = [
  ['Defense', Shield],
  ['Weather', Cloud],
  ['Infrastructure', Building2],
];
async function getData(path, signal) {
  const response = await fetch(`/api/satellite-db/${path}`, { signal });
  if (!response.ok) throw new Error('Database unavailable. Try refreshing.');
  return response.json();
}
function Navigation({ view, category, onSelect, summary }) {
  const { setOpenMobile } = useSidebar();
  function select(v, c = '') {
    onSelect(v, c);
    setOpenMobile(false);
  }
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-6">
        <a
          href="/satellite.html"
          className="flex items-center gap-3 overflow-hidden"
        >
          <img
            src="/nijjus-eye.png"
            alt=""
            className="size-9 shrink-0 rounded-md object-cover"
          />
          <span className="whitespace-nowrap text-base font-semibold group-data-[collapsible=icon]:hidden">
            NIJJU'S EYE
          </span>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            {collections.map(([key, label, Icon]) => (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  tooltip={label}
                  isActive={view === key && !category}
                  onClick={() => select(key)}
                >
                  <Icon />
                  <span>{label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {summary?.[key === 'data_layers' ? 'layers' : key]?.total ??
                      ''}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarMenu>
            {categories.map(([name, Icon]) => (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton
                  tooltip={name}
                  isActive={category === name}
                  onClick={() => select('data_layers', name)}
                >
                  <Icon />
                  <span>{name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Open 3D globe">
                <a href="/?globe=1">
                  <Globe2 />
                  <span>3D globe</span>
                  <ArrowUpRight className="ml-auto" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Replay intro">
                <a href="/launch.html">
                  <RotateCcw />
                  <span>Replay intro</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-md bg-background">
            <Radio className="size-4" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium">Local workspace</p>
            <p className="text-xs text-muted-foreground">
              SQLite operations catalog
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
function Topbar({ title }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger />
        <span className="hidden text-sm text-muted-foreground sm:inline">
          Workspace
        </span>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm font-medium">{title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        title="Toggle theme"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      >
        {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}
function Badge({ value }) {
  const good = ['online', 'active', 'live'].includes(value);
  const warning = ['maintenance', 'delayed'].includes(value);
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs capitalize ${good ? 'text-emerald-600 dark:text-emerald-400' : warning ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
function Dashboard() {
  const [view, setView] = useState('data_layers'),
    [category, setCategory] = useState(''),
    [query, setQuery] = useState(''),
    [status, setStatus] = useState('');
  const [layers, setLayers] = useState([]),
    [records, setRecords] = useState([]),
    [summary, setSummary] = useState(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0),
    [selected, setSelected] = useState(null);
  const [style, setStyle] = useState('normal'),
    [altitude, setAltitude] = useState(12000);
  useEffect(() => {
    const controller = new AbortController();
    setError('');
    setLoading(true);
    Promise.all([
      getData('summary', controller.signal),
      getData('data_layers', controller.signal),
      view === 'data_layers'
        ? Promise.resolve(null)
        : getData(view, controller.signal),
    ])
      .then(([s, l, r]) => {
        setSummary(s);
        setLayers(l.records);
        setRecords(r?.records || l.records);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [view, revision]);
  function selectView(next, cat = '') {
    setView(next);
    setCategory(cat);
    setQuery('');
    setStatus('');
    setSelected(null);
  }
  const rows = useMemo(
    () => filterRows(records, query, status, category),
    [records, query, status, category],
  );
  const config = views[view];
  const title = category ? `${category} layers` : config.title;
  const options = [
    ...new Set(records.map((row) => row.data_mode || row.status)),
  ]
    .filter(Boolean)
    .sort();
  function launch(row) {
    const id = {
      satellites: 'satellites',
      flights: 'flights',
      cameras: 'cctv',
      crew: 'satellites',
    }[view];
    const layer =
      view === 'data_layers' ? row : layers.find((l) => l.id === id);
    window.location.assign(globeUrl(layer, style, altitude));
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([exportCsv(rows, config.columns)], {
        type: 'text/csv;charset=utf-8',
      }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `nijjus-eye-${view}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const metrics = [
    ['satellites', 'online', 'Satellites', Satellite, 'registered'],
    ['flights', 'active', 'Active flights', Plane, 'tracked'],
    ['cameras', 'online', 'Online cameras', Camera, 'configured'],
    ['crew', 'online', 'Crew on duty', Users, 'assigned'],
  ];
  return (
    <DashboardLayout
      sidebar={
        <Navigation
          view={view}
          category={category}
          onSelect={selectView}
          summary={summary}
        />
      }
      topbar={<Topbar title={title} />}
    >
      <div className="flex flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              NIJJU'S EYE / OPERATIONS
            </p>
            <h1 className="font-serif text-3xl leading-tight">
              Global operations overview
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh data"
              title="Refresh data"
              disabled={loading}
              onClick={() => setRevision((n) => n + 1)}
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button asChild>
              <a href={globeUrl(null, style, altitude)}>
                Open globe
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </section>
        <section aria-label="System metrics">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-medium">Workspace overview</h2>
            <span className="text-xs text-muted-foreground">
              Demonstration records
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {metrics.map(([key, field, label, Icon, sub]) => (
              <article
                key={key}
                className="flex min-h-36 flex-col justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="size-4 shrink-0" />
                  {label}
                </div>
                <div>
                  <p className="mt-5 text-3xl font-medium">
                    {summary?.[key]?.[field] ?? '-'}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {summary?.[key]?.total ?? '-'} {sub}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="flex flex-wrap items-center gap-3 border-y border-border py-4"
          aria-label="Globe launch controls"
        >
          <Globe2 className="size-4" />
          <span className="mr-auto text-sm font-medium">Globe view</span>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Altitude
            <select
              aria-label="Launch altitude"
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value))}
            >
              {[25, 500, 3000, 12000, 40000].map((n) => (
                <option key={n} value={n}>
                  {n.toLocaleString()} km
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            Mode
            <select
              aria-label="Visual mode"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {['normal', 'crt', 'nvg', 'flir', 'noir'].map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </section>
        <section className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {view === 'data_layers'
                  ? `${layers.length} integrated sources`
                  : config.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={download}
                disabled={loading || !!error || !rows.length}
              >
                <Download />
                Export
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 basis-52">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label="Search records"
                placeholder="Search records..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {view === 'data_layers' && (
              <select
                aria-label="Filter by category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {[...new Set(layers.map((l) => l.category))].sort().map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            )}
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">
                All {view === 'data_layers' ? 'modes' : 'statuses'}
              </option>
              {options.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {error ? (
            <div
              role="alert"
              className="border-l-2 border-red-500 px-4 py-3 text-sm"
            >
              {error}{' '}
              <Button
                variant="outline"
                onClick={() => setRevision((n) => n + 1)}
              >
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {config.columns.map(([key, label]) => (
                    <TableHead key={key} className="h-12 bg-card px-4">
                      {label}
                    </TableHead>
                  ))}
                  <TableHead className="bg-card">
                    <span className="sr-only">Open</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={config.columns.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      Loading records...
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      tabIndex={0}
                      role="button"
                      aria-label={`Inspect ${row[config.primary]}`}
                      className="h-16 cursor-pointer"
                      onClick={() => setSelected(row)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelected(row);
                        }
                      }}
                    >
                      {config.columns.map(([key]) => (
                        <TableCell
                          key={key}
                          className="max-w-80 whitespace-normal px-4 py-4"
                        >
                          {['status', 'data_mode'].includes(key) ? (
                            <Badge value={row[key]} />
                          ) : (
                            <span
                              className={
                                key === config.primary ? 'font-medium' : ''
                              }
                            >
                              {formatValue(key, row[key])}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={config.columns.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No matching records.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{loading ? 'Loading' : `${rows.length} records`}</span>
            <span>SQLite catalog / Demo records are not live telemetry</span>
          </div>
        </section>
      </div>
      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selected?.[config.primary]}</SheetTitle>
            <SheetDescription>{config.subtitle}</SheetDescription>
          </SheetHeader>
          <dl className="grid grid-cols-1 gap-5 px-4">
            {selected &&
              Object.entries(selected)
                .filter(([key]) => key !== config.primary && key !== 'icon')
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="mb-1 text-xs capitalize text-muted-foreground">
                      {key.replaceAll('_', ' ')}
                    </dt>
                    <dd className="break-words text-sm">
                      {formatValue(key, value)}
                    </dd>
                  </div>
                ))}
          </dl>
          <div className="border-t border-border p-4">
            <Button className="w-full" onClick={() => launch(selected)}>
              View on globe
              <ArrowUpRight />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
createRoot(document.getElementById('dashboard-root')).render(
  <ThemeProvider defaultTheme="light" storageKey="nijjus-eye-dashboard-theme">
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  </ThemeProvider>,
);
