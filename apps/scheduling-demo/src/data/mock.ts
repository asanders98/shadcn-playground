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
export const STAFF: ReadonlyArray<StaffMember> = ROSTER.map((member, i) => ({
  ...member,
  initials: initialsOf(member.name),
  color: PALETTE[i % PALETTE.length]!,
}));
