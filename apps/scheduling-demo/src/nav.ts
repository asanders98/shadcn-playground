import {
  Building2,
  CalendarDays,
  ClipboardCheck,
  Component,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

export interface NavItem {
  /** Route path (also the hash fragment, e.g. #/planning). */
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

// Single source of truth for the four demo routes. The sidebar renders these
// in order, and App wires the same paths to their view components. `/planning`
// is the default landing route.
export const NAV: ReadonlyArray<NavItem> = [
  { to: "/planning", label: "Planning", icon: CalendarDays },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/pools", label: "Pools", icon: Users },
  { to: "/my-company", label: "My Company", icon: Building2 },
  { to: "/components", label: "Components", icon: Component },
];
