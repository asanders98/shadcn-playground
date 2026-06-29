import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ATTENDANCE, STAFF_BY_ID } from "../data/mock";
import { AttendanceView } from "./AttendanceView";

describe("AttendanceView", () => {
  it("renders the clocked-in roster with avatars, role badges, and progress", () => {
    render(<AttendanceView />);

    // One row per clocked-in staff member, each resolved from the shared roster.
    const first = STAFF_BY_ID.get(ATTENDANCE[0]!.staffId)!;
    expect(screen.getByText(first.name)).toBeInTheDocument();
    // Role Badge for that person.
    expect(screen.getByText(first.role)).toBeInTheDocument();
    // Avatar fallback shows their initials.
    expect(screen.getAllByText(first.initials).length).toBeGreaterThan(0);

    // A Progress indicator per row (Radix exposes role="progressbar").
    expect(screen.getAllByRole("progressbar")).toHaveLength(ATTENDANCE.length);
  });

  it("toggles a row's present/absent switch", () => {
    render(<AttendanceView />);

    const first = STAFF_BY_ID.get(ATTENDANCE[0]!.staffId)!;
    const toggle = screen.getByRole("switch", {
      name: `Toggle attendance for ${first.name}`,
    });
    const label = toggle.closest("label")!;

    expect(within(label).getByText("Present")).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(within(label).getByText("Absent")).toBeInTheDocument();
  });
});
