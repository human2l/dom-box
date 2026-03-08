// ============================================================
//  DOM Box — Puzzle Constants
// ============================================================

// --- Layer 1: Service Status Switches ---
// 5 services. Dependencies define which other services get toggled (XOR'd)
// when THIS service is toggled.
export const SERVICES = [
  { id: 'auth',     label: 'Auth Service',      dep: ['cache'] },
  { id: 'database', label: 'Database Engine',   dep: ['queue'] },
  { id: 'cache',    label: 'Cache Layer',       dep: [] },
  { id: 'queue',    label: 'Job Queue',         dep: [] },
  { id: 'gateway',  label: 'API Gateway',       dep: ['auth', 'database'] },
]

// The correct solved state (all true)
export const SWITCHES_SOLVED_STATE = {
  auth: true,
  database: true,
  cache: true,
  queue: true,
  gateway: true,
}

// --- Layer 2: Performance Sliders ---
// Win condition: sum === 150, and max diff between any two <= 30
export const SLIDERS = [
  { id: 'cpu',       label: 'CPU Allocation',  unit: '%',  min: 0, max: 100, initial: 33 },
  { id: 'memory',    label: 'Memory Limit',    unit: '%',  min: 0, max: 100, initial: 33 },
  { id: 'bandwidth', label: 'Bandwidth Cap',   unit: '%',  min: 0, max: 100, initial: 34 },
]
export const SLIDER_TARGET_SUM = 150
export const SLIDER_MAX_DIFF = 30

// --- Layer 3: Region Dropdown Cascade ---
// Decision tree: primary → failover → cdn
// Only one valid path leads to all-green
export const REGIONS_TREE = {
  'us-east-1': {
    failover: {
      'eu-west-2': {
        cdn: ['ap-south-1', 'us-west-2', 'sa-east-1'],  // all wrong
      },
      'ap-northeast-1': {
        cdn: ['us-east-1', 'sa-east-1'],  // both wrong
      },
      'ap-south-1': {
        cdn: ['ap-southeast-2', 'eu-central-1'],  // both wrong
      },
    },
  },
  'eu-central-1': {
    failover: {
      'us-west-2': {
        cdn: ['ap-south-1', 'eu-west-2', 'ap-northeast-1'],  // all wrong
      },
      'ap-south-1': {
        cdn: ['us-east-1', 'eu-central-1'],  // both wrong
      },
    },
  },
  'ap-southeast-2': {
    failover: {
      'us-east-1': {
        cdn: ['eu-central-1', 'ap-south-1'],  // all wrong
      },
      'ap-south-1': {
        cdn: ['ap-northeast-1', 'us-west-2', 'eu-west-2'],  // all wrong
      },
      'eu-west-2': {
        cdn: ['ap-south-1', 'ap-northeast-1', 'us-east-1'], // 'ap-south-1' ← CORRECT
      },
    },
  },
}

// The one correct combination
export const REGIONS_SOLUTION = {
  primary: 'ap-southeast-2',
  failover: 'eu-west-2',
  cdn: 'ap-south-1',
}

// Error messages for wrong combos — contain cryptic clues
export const REGION_ERROR_MESSAGES = [
  'Latency conflict: routing loop detected between selected nodes.',
  'Failover overlap: primary and failover share the same backbone.',
  'CDN edge mismatch: AP region requires AP-prefixed downstream edge.',
  'Configuration rejected: incompatible SLA tiers across selected zones.',
  'Topology error: selected CDN cannot reach the failover node.',
]

// Sidebar nav items — one changes name when Layer 1 is solved
export const NAV_ITEMS_DEFAULT = [
  { id: 'dashboard',  label: 'Dashboard',   icon: '⬛' },
  { id: 'analytics',  label: 'Analytics',   icon: '📈' },
  { id: 'users',      label: 'Users',       icon: '👥' },
  { id: 'settings',   label: 'Settings',    icon: '⚙️' },
  { id: 'logs',       label: 'Logs',        icon: '🗒️' },
]

export const NAV_ITEMS_LAYER1_SOLVED = [
  { id: 'dashboard',  label: 'Dashboard',     icon: '⬛' },
  { id: 'analytics',  label: 'AP-Analytics',  icon: '📈' },  // ← clue change
  { id: 'users',      label: 'Users',         icon: '👥' },
  { id: 'settings',   label: 'Settings',      icon: '⚙️' },
  { id: 'logs',       label: 'Logs',          icon: '🗒️' },
]

// --- Layer 4: System Logs ---
// 3 special lines have slightly different font-weight (600 vs 400)
// Their first characters spell B, O, X → recovery key = DOM-BOX
export const LOG_LINES = [
  { id: 'l01', text: '[INFO]  2026-03-08T09:00:01Z  scheduler: heartbeat ok', special: false },
  { id: 'l02', text: '[INFO]  2026-03-08T09:00:04Z  auth: token refreshed for user_1192', special: false },
  { id: 'l03', text: '[WARN]  2026-03-08T09:00:07Z  cache: eviction pressure at 84%', special: false },
  { id: 'l04', text: '[INFO]  2026-03-08T09:00:09Z  gateway: 204 /health', special: false },
  { id: 'l05', text: '[ERROR] 2026-03-08T09:00:12Z  Boundary check failed — unexpected state transition', special: true, clueChar: 'B' },
  { id: 'l06', text: '[INFO]  2026-03-08T09:00:15Z  database: query pool 12/64 active', special: false },
  { id: 'l07', text: '[INFO]  2026-03-08T09:00:18Z  queue: 0 pending jobs', special: false },
  { id: 'l08', text: '[WARN]  2026-03-08T09:00:21Z  bandwidth: throttle applied to region eu-west-2', special: false },
  { id: 'l09', text: '[INFO]  2026-03-08T09:00:24Z  gateway: 200 /api/v2/users', special: false },
  { id: 'l10', text: '[ERROR] 2026-03-08T09:00:27Z  Origin mismatch — fallback route failed', special: true, clueChar: 'O' },
  { id: 'l11', text: '[INFO]  2026-03-08T09:00:30Z  cache: write-back complete', special: false },
  { id: 'l12', text: '[INFO]  2026-03-08T09:00:33Z  auth: session gc collected 42 expired tokens', special: false },
  { id: 'l13', text: '[WARN]  2026-03-08T09:00:36Z  queue: job_8841 retried (attempt 3/5)', special: false },
  { id: 'l14', text: '[INFO]  2026-03-08T09:00:39Z  scheduler: next run in 60s', special: false },
  { id: 'l15', text: '[ERROR] 2026-03-08T09:00:42Z  Xact rollback — integrity constraint violation on node_core', special: true, clueChar: 'X' },
  { id: 'l16', text: '[INFO]  2026-03-08T09:00:45Z  gateway: 404 /api/v2/legacy', special: false },
  { id: 'l17', text: '[INFO]  2026-03-08T09:00:48Z  database: checkpoint flushed', special: false },
  { id: 'l18', text: '[WARN]  2026-03-08T09:00:51Z  memory: gc pause 18ms', special: false },
]

// Recovery key
export const RECOVERY_KEY = 'DOM-BOX'
export const TOAST_KEY_FRAGMENT = 'Recovery key fragment: DOM-'
