import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  MEAL_PERIODS,
  SHIFTS,
  type Shift,
  type ShiftStatus,
  shiftStatus,
  staffById,
  summarizeShifts,
  WEEK_DAYS,
  weekDayDates,
  weekLabel,
} from "../data/mock";

// Status → existing Badge variant + the tint used to colour-code the card.
// Amber/"warning" is composed from the existing warning token — no new library
// variants are introduced here.
const STATUS_STYLE: Record<
  ShiftStatus,
  { label: string; badge: "success" | "warning" | "destructive"; accent: string }
> = {
  confirmed: {
    label: "Confirmed",
    badge: "success",
    accent: "border-l-success bg-success/5",
  },
  partial: {
    label: "Partially filled",
    badge: "warning",
    accent: "border-l-warning bg-warning/5",
  },
  urgent: {
    label: "Urgent",
    badge: "destructive",
    accent: "border-l-destructive bg-destructive/5",
  },
};

/** Small circular avatar for a staff member, coloured from the roster palette. */
function StaffAvatar({ id, className }: { id: string; className?: string }) {
  const member = staffById(id);
  if (!member) return null;
  return (
    <Avatar className={className}>
      <AvatarFallback style={{ backgroundColor: member.color, color: "#fff" }}>
        {member.initials}
      </AvatarFallback>
    </Avatar>
  );
}

/** The overlapping avatar stack (max 3 shown) with a `+N` overflow chip. */
function AvatarStack({ ids }: { ids: string[] }) {
  const shown = ids.slice(0, 3);
  const overflow = ids.length - shown.length;
  if (ids.length === 0) {
    return <span className="text-xs text-muted-foreground">Unstaffed</span>;
  }
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((id) => (
          <StaffAvatar
            key={id}
            id={id}
            className="size-7 ring-2 ring-card"
          />
        ))}
      </div>
      {overflow > 0 && (
        <span className="ml-1 text-xs font-semibold text-muted-foreground">
          +{overflow}
        </span>
      )}
    </div>
  );
}

/** One shift cell — a clickable, status-tinted card. */
function ShiftCard({
  shift,
  onOpen,
}: {
  shift: Shift;
  onOpen: (shift: Shift) => void;
}) {
  const status = useMemo(() => shiftStatus(shift), [shift]);
  const style = STATUS_STYLE[status];
  const filled = shift.assignedStaffIds.length;
  const assignedNames = shift.assignedStaffIds
    .map((id) => staffById(id)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`${shift.mealPeriod} ${shift.role} · ${WEEK_DAYS[shift.day]}`}
      onClick={() => onOpen(shift)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(shift);
        }
      }}
      className={`flex cursor-pointer flex-col gap-2 border-l-4 p-3 text-left transition-shadow hover:shadow-floating focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${style.accent}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-numeric text-sm font-semibold tabular-nums text-foreground">
          {filled}/{shift.required}
        </span>
        <Badge variant={style.badge}>{style.label}</Badge>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <AvatarStack ids={shift.assignedStaffIds} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {assignedNames || "No one assigned yet"}
        </TooltipContent>
      </Tooltip>

      <span className="text-xs text-muted-foreground">
        {shift.applicantIds.length} applied to work
      </span>
    </Card>
  );
}

/**
 * Planning — the hero screen. A weekly shift-planner grid (days as columns,
 * roles grouped by meal period as rows) rendered in the Acme skin. Cards are
 * colour-coded by fill status; clicking one opens the applicants drawer.
 * The "Today" button and date stepper are cosmetic (shifts never change).
 */
export function PlanningView() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<Shift | null>(null);

  const summary = useMemo(() => summarizeShifts(SHIFTS), []);
  const dayDates = useMemo(() => weekDayDates(weekOffset), [weekOffset]);

  // Group shifts by meal-period name + role row for grid lookup.
  const shiftAt = useMemo(() => {
    const map = new Map<string, Shift>();
    for (const shift of SHIFTS) {
      map.set(`${shift.mealPeriod}|${shift.role}|${shift.day}`, shift);
    }
    return map;
  }, []);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Planning</h1>
        <p className="text-sm text-muted-foreground">
          Build and publish the weekly shift schedule.
        </p>
      </header>

      {/* Toolbar: Today + date-range stepper (label is cosmetic). */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekOffset(0)}
          >
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous week"
              onClick={() => setWeekOffset((offset) => offset - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="font-numeric text-sm font-medium tabular-nums text-foreground">
              {weekLabel(weekOffset)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next week"
              onClick={() => setWeekOffset((offset) => offset + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        {/* Status-summary rollup. */}
        <p className="text-sm text-muted-foreground" data-testid="shift-summary">
          <span className="font-semibold text-foreground">{summary.open}</span>{" "}
          open ·{" "}
          <span className="font-semibold text-success">
            {summary.confirmed}
          </span>{" "}
          confirmed ·{" "}
          <span className="font-semibold text-warning">{summary.partial}</span>{" "}
          partially filled ·{" "}
          <span className="font-semibold text-destructive">
            {summary.urgent}
          </span>{" "}
          urgent
        </p>
      </div>

      {/* Grid: scrolls horizontally on narrow screens rather than reflowing. */}
      <div className="overflow-x-auto">
        <div className="min-w-[920px] space-y-4">
          {/* Day-column header row. */}
          <div className="grid grid-cols-[160px_repeat(7,minmax(0,1fr))] gap-2">
            <div />
            {WEEK_DAYS.map((day, index) => (
              <div key={day} className="px-1 text-center">
                <div className="text-sm font-semibold text-foreground">
                  {day}
                </div>
                <div className="font-numeric text-xs tabular-nums text-muted-foreground">
                  {dayDates[index]}
                </div>
              </div>
            ))}
          </div>

          {MEAL_PERIODS.map((period) => (
            <div key={period.name} className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {period.name}
              </h2>
              {period.roles.map((role) => (
                <div
                  key={`${period.name}-${role}`}
                  className="grid grid-cols-[160px_repeat(7,minmax(0,1fr))] items-stretch gap-2"
                >
                  <div className="flex items-center text-sm font-medium text-foreground">
                    {role}
                  </div>
                  {WEEK_DAYS.map((_, day) => {
                    const shift = shiftAt.get(
                      `${period.name}|${role}|${day}`,
                    );
                    return (
                      <div key={day}>
                        {shift && (
                          <ShiftCard shift={shift} onOpen={setSelected} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Applicants drawer for the selected shift. */}
      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selected.role} · {WEEK_DAYS[selected.day]}
                </SheetTitle>
                <SheetDescription>
                  {selected.mealPeriod} · {selected.assignedStaffIds.length}/
                  {selected.required} filled · {selected.applicantIds.length}{" "}
                  applied
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 overflow-y-auto">
                <h3 className="text-sm font-semibold text-foreground">
                  Applicants
                </h3>
                {selected.applicantIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No applicants yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {selected.applicantIds.map((id) => {
                      const member = staffById(id);
                      if (!member) return null;
                      return (
                        <li
                          key={id}
                          className="flex items-center gap-3 py-2"
                        >
                          <StaffAvatar id={id} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.role}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
