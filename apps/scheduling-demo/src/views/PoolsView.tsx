import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@acme/ui";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CANDIDATES, CANDIDATE_ROLES, type Candidate } from "../data/mock";
import { PlaceholderView } from "./PlaceholderView";

// Sentinel for the "all roles" option — Radix Select can't use an empty value.
const ALL_ROLES = "all";

// How long the skeleton flourish lingers on first load before the real cards
// swap in. Short enough to feel responsive; long enough to read as intentional.
const LOAD_DELAY_MS = 600;

/**
 * Pools — a searchable talent pool. Renders staff + external candidates as a
 * grid of cards, filtered live by a search box and a role dropdown. On first
 * mount it shows a skeleton flourish before the cards appear; all filtering is
 * cosmetic local state, with no async fetching.
 */
export function PoolsView() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>(ALL_ROLES);

  // First-load flourish: flip out of the skeleton state after a short beat.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CANDIDATES.filter((c) => {
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q);
      const matchesRole = role === ALL_ROLES || c.role === role;
      return matchesQuery && matchesRole;
    });
  }, [query, role]);

  return (
    <PlaceholderView
      title="Pools"
      description="Search the talent pool of staff and candidates available to fill open shifts."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or role…"
            aria-label="Search candidates"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="sm:w-56" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ROLES}>All roles</SelectItem>
            {CANDIDATE_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <CandidateSkeletonGrid />
      ) : visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No candidates match your search.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((candidate) => (
            <li key={candidate.id}>
              <CandidateCard candidate={candidate} />
            </li>
          ))}
        </ul>
      )}
    </PlaceholderView>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback
            style={{ backgroundColor: candidate.color, color: "#fff" }}
          >
            {candidate.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-foreground">
            {candidate.name}
          </p>
          <Badge variant="secondary">{candidate.role}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function CandidateSkeletonGrid() {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
