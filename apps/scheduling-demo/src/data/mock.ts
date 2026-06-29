// Single shared mock-data module for the Acme Scheduling demo.
//
// Everything here is DETERMINISTIC — no faker, no Math.random, no async, no
// Date.now. Every render and every test sees the exact same roster, so smoke
// tests and screenshots are stable. Later view slices (Planning, Attendance,
// Pools) extend this module with shifts, attendance rows, and the candidate
// pool, all keyed off these same staff ids.

/** The company shown in the sidebar switcher and the My Company settings form. */
export const COMPANY = {
  id: "acme-bistro",
  name: "Acme Bistro",
  email: "hello@acmebistro.com",
  phone: "(555) 014-2200",
} as const;

export interface StaffMember {
  /** Stable id used to key shifts / attendance / pool rows in later slices. */
  id: string;
  name: string;
  /** Job title, shown next to the name. */
  role: string;
  /** Two-letter avatar fallback, derived from the name. */
  initials: string;
  /** Deterministic avatar colour (hex), assigned by roster position. */
  color: string;
}

// A fixed palette drawn from the Acme DS accent range. Staff are assigned a
// colour by their position in the roster, so the mapping never shifts.
const PALETTE = [
  "#2563eb", // blue
  "#7c3aed", // violet
  "#db2777", // pink
  "#ea580c", // orange
  "#16a34a", // green
  "#0891b2", // cyan
  "#ca8a04", // amber
  "#dc2626", // red
] as const;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

// Turn a raw {id,name,role} record into a full person: initials and colour are
// derived here so they can never drift out of sync with the name/order. The
// palette index is passed in so staff and candidates share one colour sequence.
function makePerson(
  member: { id: string; name: string; role: string },
  paletteIndex: number,
): StaffMember {
  return {
    ...member,
    initials: initialsOf(member.name),
    color: PALETTE[paletteIndex % PALETTE.length]!,
  };
}

// The raw roster — name + role only. Initials and colour are derived below so
// the two can never drift out of sync with the name/order.
const ROSTER: ReadonlyArray<{ id: string; name: string; role: string }> = [
  { id: "s1", name: "Ava Romano", role: "Shift Lead" },
  { id: "s2", name: "Ben Carter", role: "Line Cook" },
  { id: "s3", name: "Chloe Nguyen", role: "Server" },
  { id: "s4", name: "Diego Flores", role: "Bartender" },
  { id: "s5", name: "Emma Schultz", role: "Host" },
  { id: "s6", name: "Farid Hassan", role: "Sous Chef" },
  { id: "s7", name: "Grace Liu", role: "Server" },
  { id: "s8", name: "Henry Olsen", role: "Dishwasher" },
];

/** The staff roster — ~8 people, fully typed, with initials + colour. */
export const STAFF: ReadonlyArray<StaffMember> = ROSTER.map((member, i) =>
  makePerson(member, i),
);

/** Index STAFF by id so views can resolve an id reference to a person. */
export const STAFF_BY_ID: ReadonlyMap<string, StaffMember> = new Map(
  STAFF.map((member) => [member.id, member]),
);

/** Look up a roster member by id (used to resolve shift assignments). */
export function staffById(id: string): StaffMember | undefined {
  return STAFF_BY_ID.get(id);
}

// =============================================================================
// Planning view — the week-of-shifts data
// =============================================================================
// Still fully DETERMINISTIC: every shift's required/assigned/applicant counts
// are derived from its grid position, so the planner, summary rollup, and smoke
// tests all see the same board on every render. Shifts reference staff by id.

/** Columns of the planner grid — the seven days of the week. */
export const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export interface MealPeriod {
  /** Display name of the meal period (a group of role rows). */
  name: string;
  /** Role rows shown under this meal period, top to bottom. */
  roles: string[];
}

/** Row groups of the planner grid — roles grouped by meal period. */
export const MEAL_PERIODS: ReadonlyArray<MealPeriod> = [
  { name: "Brunch", roles: ["Server", "Host"] },
  { name: "Dinner", roles: ["Server", "Bartender", "Line Cook"] },
];

/** A shift's fill state, derived from assigned-vs-required. */
export type ShiftStatus = "confirmed" | "partial" | "urgent";

export interface Shift {
  /** Stable id, also used as the React key and test handle. */
  id: string;
  /** Meal period this shift belongs to (matches a MEAL_PERIODS name). */
  mealPeriod: string;
  /** Role row label (matches a role in its meal period). */
  role: string;
  /** Column index 0..6 into WEEK_DAYS. */
  day: number;
  /** Seats that need filling. */
  required: number;
  /** Staff assigned to the shift (ids into STAFF). */
  assignedStaffIds: string[];
  /** Staff who applied but aren't assigned yet (ids into STAFF). */
  applicantIds: string[];
}

const STAFF_IDS = STAFF.map((member) => member.id);

/** Take `count` ids starting at `start`, wrapping around the roster. */
function rotate(start: number, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(STAFF_IDS[(start + i) % STAFF_IDS.length]!);
  }
  return out;
}

// Build one shift per (role row × day) cell. Required/filled/applicant counts
// come from the cell's position so the board is varied but reproducible.
function buildShifts(): Shift[] {
  const shifts: Shift[] = [];
  let row = 0;
  for (const period of MEAL_PERIODS) {
    for (const role of period.roles) {
      for (let day = 0; day < WEEK_DAYS.length; day++) {
        const required = 2 + ((row + day) % 3); // 2..4 seats
        const filled = (day * 3 + row * 2) % (required + 1); // 0..required
        const start = (row * 5 + day * 3) % STAFF_IDS.length;
        const assignedStaffIds = rotate(start, filled);

        // Applicants are the next roster members after the assigned block,
        // skipping anyone already assigned to this shift.
        const wanted = 1 + ((row + day) % 3); // 1..3 applicants
        const applicantIds: string[] = [];
        for (
          let probe = start + filled;
          applicantIds.length < wanted &&
          probe < start + filled + STAFF_IDS.length;
          probe++
        ) {
          const id = STAFF_IDS[probe % STAFF_IDS.length]!;
          if (!assignedStaffIds.includes(id)) applicantIds.push(id);
        }

        shifts.push({
          id: `sh-${row}-${day}`,
          mealPeriod: period.name,
          role,
          day,
          required,
          assignedStaffIds,
          applicantIds,
        });
      }
      row++;
    }
  }
  return shifts;
}

/** The full week of shifts — one card per role-row × day cell. */
export const SHIFTS: ReadonlyArray<Shift> = buildShifts();

/** Derive a shift's status from how many of its seats are filled. */
export function shiftStatus(shift: Shift): ShiftStatus {
  const filled = shift.assignedStaffIds.length;
  if (filled === 0) return "urgent";
  if (filled >= shift.required) return "confirmed";
  return "partial";
}

export interface ShiftSummary {
  total: number;
  confirmed: number;
  partial: number;
  urgent: number;
  /** Shifts still needing staff (partial + urgent). */
  open: number;
}

/** Count shifts by status bucket for the rollup line above the grid. */
export function summarizeShifts(
  shifts: ReadonlyArray<Shift>,
): ShiftSummary {
  let confirmed = 0;
  let partial = 0;
  let urgent = 0;
  for (const shift of shifts) {
    const status = shiftStatus(shift);
    if (status === "confirmed") confirmed++;
    else if (status === "partial") partial++;
    else urgent++;
  }
  return {
    total: shifts.length,
    confirmed,
    partial,
    urgent,
    open: partial + urgent,
  };
}

// The week the board represents. Stepping the date range is cosmetic — the
// shifts never change — so we only recompute the label, off a fixed Monday.
const WEEK_BASE_MS = Date.UTC(2025, 8, 15); // Mon 15 Sep 2025
const DAY_MS = 86_400_000;

function formatDate(ms: number): string {
  const date = new Date(ms);
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(date.getUTCFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

/** The displayed week range, e.g. "15/09/25 – 21/09/25" at offset 0. */
export function weekLabel(offset: number): string {
  const start = WEEK_BASE_MS + offset * 7 * DAY_MS;
  return `${formatDate(start)} – ${formatDate(start + 6 * DAY_MS)}`;
}

/** Day-of-month for each column header in the displayed week. */
export function weekDayDates(offset: number): number[] {
  const start = WEEK_BASE_MS + offset * 7 * DAY_MS;
  return WEEK_DAYS.map((_, i) => new Date(start + i * DAY_MS).getUTCDate());
}

// A candidate in the talent pool is just a person (same identity model as
// STAFF) — the Pools screen shows current staff plus external candidates who
// are available to fill open shifts, so people stay coherent across screens.
export type Candidate = StaffMember;

// External candidates beyond the current staff. Roles overlap the roster on
// purpose so the role filter on the Pools screen narrows to more than one card.
const EXTRA_CANDIDATE_ROSTER: ReadonlyArray<{
  id: string;
  name: string;
  role: string;
}> = [
  { id: "c1", name: "Isla Moreno", role: "Server" },
  { id: "c2", name: "Jamal Wright", role: "Line Cook" },
  { id: "c3", name: "Kira Petrov", role: "Bartender" },
  { id: "c4", name: "Liam Walsh", role: "Host" },
  { id: "c5", name: "Maya Okafor", role: "Sous Chef" },
  { id: "c6", name: "Noah Bergström", role: "Server" },
  { id: "c7", name: "Priya Anand", role: "Barista" },
  { id: "c8", name: "Quinn Daniels", role: "Busser" },
];

/**
 * The talent pool: current staff first, then external candidates. The palette
 * index continues past the roster so every person keeps a distinct colour.
 */
export const CANDIDATES: ReadonlyArray<Candidate> = [
  ...STAFF,
  ...EXTRA_CANDIDATE_ROSTER.map((member, i) =>
    makePerson(member, STAFF.length + i),
  ),
];

/** Distinct roles across the pool, sorted — drives the Pools role filter. */
export const CANDIDATE_ROLES: ReadonlyArray<string> = [
  ...new Set(CANDIDATES.map((c) => c.role)),
].sort();

/** Whether someone is currently working a shift or stepped away on a break. */
export type AttendanceStatus = "active" | "on-break";

export interface AttendanceRow {
  /** References a {@link StaffMember} by id, so the same people appear across
   *  Planning, Attendance, and Pools. */
  staffId: string;
  status: AttendanceStatus;
  /** Hours clocked so far this shift. */
  hoursWorked: number;
  /** Hours this person is scheduled for. `hoursWorked / hoursScheduled` drives
   *  the per-row Progress bar. */
  hoursScheduled: number;
  /** Seed for the present/absent Switch — toggled in local state in the view. */
  present: boolean;
}

// The clocked-in roster. A deterministic slice of STAFF (not everyone is on the
// clock right now), each keyed by staff id so names/roles/avatars stay coherent
// with the rest of the demo. Hand-tuned — no Math.random — so smoke tests and
// screenshots are stable.
export const ATTENDANCE: ReadonlyArray<AttendanceRow> = [
  { staffId: "s1", status: "active", hoursWorked: 6.5, hoursScheduled: 8, present: true },
  { staffId: "s2", status: "active", hoursWorked: 3, hoursScheduled: 8, present: true },
  { staffId: "s3", status: "on-break", hoursWorked: 4.25, hoursScheduled: 6, present: true },
  { staffId: "s4", status: "active", hoursWorked: 7.5, hoursScheduled: 8, present: true },
  { staffId: "s6", status: "on-break", hoursWorked: 2, hoursScheduled: 8, present: true },
  { staffId: "s7", status: "active", hoursWorked: 5, hoursScheduled: 5, present: true },
];
