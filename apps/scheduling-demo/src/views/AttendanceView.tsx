import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Switch,
} from "@acme/ui";
import { Fragment, useState } from "react";

import { ATTENDANCE, STAFF_BY_ID } from "../data/mock";

/**
 * Attendance — a live clocked-in roster. Each row resolves an attendance record
 * to the shared staff member (so the same people appear across the demo) and
 * shows their avatar, name, role, active/on-break status, hours worked against
 * scheduled, and a present/absent toggle.
 *
 * The toggle is cosmetic local state only — nothing is persisted.
 */
export function AttendanceView() {
  // Seed the present/absent state from the mock, keyed by staff id.
  const [present, setPresent] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ATTENDANCE.map((row) => [row.staffId, row.present])),
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Track clock-ins, no-shows, and time worked.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Clocked-in roster</CardTitle>
          <CardDescription>
            {ATTENDANCE.length} staff on the clock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {ATTENDANCE.map((row, i) => {
              const member = STAFF_BY_ID.get(row.staffId);
              if (!member) return null;

              const isPresent = present[row.staffId] ?? false;
              const onBreak = row.status === "on-break";
              // Clamp so an overtime row can't overflow the bar past 100%.
              const pct = Math.min(
                100,
                Math.round((row.hoursWorked / row.hoursScheduled) * 100),
              );

              return (
                <Fragment key={row.staffId}>
                  {i > 0 && <Separator />}
                  <li className="flex items-center gap-4 py-4">
                    <Avatar>
                      <AvatarFallback
                        style={{ backgroundColor: member.color, color: "#fff" }}
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <Badge variant="outline">{member.role}</Badge>
                        <Badge variant={onBreak ? "warning" : "success"}>
                          {onBreak ? "On break" : "Active"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <Progress
                          value={pct}
                          aria-label={`Hours worked for ${member.name}`}
                          className="max-w-60"
                        />
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {row.hoursWorked} / {row.hoursScheduled} h
                        </span>
                      </div>
                    </div>

                    <label className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      <span>{isPresent ? "Present" : "Absent"}</span>
                      <Switch
                        checked={isPresent}
                        onCheckedChange={(checked) =>
                          setPresent((prev) => ({
                            ...prev,
                            [row.staffId]: checked,
                          }))
                        }
                        aria-label={`Toggle attendance for ${member.name}`}
                      />
                    </label>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
