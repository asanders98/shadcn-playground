import { TooltipProvider } from "@acme/ui";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SHIFTS, staffById, WEEK_DAYS } from "../data/mock";
import { PlanningView } from "./PlanningView";

function renderView() {
  return render(
    <TooltipProvider>
      <PlanningView />
    </TooltipProvider>,
  );
}

describe("PlanningView", () => {
  it("renders the weekly grid: day columns, shift cards, and the summary line", () => {
    renderView();

    // Every weekday is a column header.
    for (const day of WEEK_DAYS) {
      expect(screen.getAllByText(day).length).toBeGreaterThan(0);
    }

    // At least one shift card shows a fill ratio like "2/3".
    expect(screen.getAllByText(/^\d+\/\d+$/).length).toBeGreaterThan(0);

    // The status-summary rollup is present.
    expect(screen.getByTestId("shift-summary")).toHaveTextContent(
      /partially filled/,
    );
  });

  it("opens the applicants drawer with the shift's applicants when a card is clicked", () => {
    renderView();

    // Pick a known shift with at least one applicant and click its card.
    const shift = SHIFTS.find((s) => s.applicantIds.length > 0)!;
    const card = screen.getByRole("button", {
      name: `${shift.mealPeriod} ${shift.role} · ${WEEK_DAYS[shift.day]}`,
    });
    fireEvent.click(card);

    // The drawer lists that shift's applicants by name and role.
    const drawer = screen.getByRole("dialog");
    const applicant = staffById(shift.applicantIds[0]!)!;
    expect(within(drawer).getByText(applicant.name)).toBeInTheDocument();
    expect(
      within(drawer).getAllByText(applicant.role).length,
    ).toBeGreaterThan(0);
  });
});
