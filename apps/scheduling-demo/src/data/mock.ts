// Single shared mock-data module for the Acme Scheduling demo.
//
// Everything here is DETERMINISTIC — no faker, no Math.random, no async, no
// Date.now. Every render and every test sees the exact same roster, so smoke
// tests and screenshots are stable. Later view slices (Planning, Attendance,
// Pools) extend this module with shifts, attendance rows, and the candidate
// pool, all keyed off these same staff ids.

/** The company shown in the sidebar switcher. */
export const COMPANY = {
  id: "acme-bistro",
  name: "Acme Bistro",
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
