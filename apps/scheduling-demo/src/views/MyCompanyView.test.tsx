import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { MyCompanyView } from "./MyCompanyView";

function renderView() {
  return render(
    <MemoryRouter>
      <MyCompanyView />
    </MemoryRouter>,
  );
}

describe("MyCompanyView", () => {
  it("renders the tabbed settings form with company details", () => {
    renderView();

    expect(
      screen.getByRole("heading", { name: "My Company" }),
    ).toBeInTheDocument();
    // The three tabbed sections are present...
    expect(screen.getByRole("tab", { name: "General" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Scheduling" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Notifications" }),
    ).toBeInTheDocument();
    // ...and the General tab's company-details fields are visible by default.
    expect(screen.getByLabelText("Company name")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact email")).toBeInTheDocument();
  });

  it("switches tabs to reveal the other tab's content", () => {
    renderView();

    // General content is shown; Scheduling content isn't mounted yet.
    expect(screen.getByLabelText("Company name")).toBeInTheDocument();
    expect(
      screen.queryByText("Maximum weekly hours per employee"),
    ).not.toBeInTheDocument();

    // Radix Tabs activate on mousedown (button 0).
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Scheduling" }));

    // Scheduling content is now shown and the General fields are gone.
    expect(
      screen.getByText("Maximum weekly hours per employee"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Company name")).not.toBeInTheDocument();
  });

  it("shows a confirmation when Save is clicked (and persists nothing)", () => {
    renderView();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    const confirmation = screen.getByRole("alert");
    expect(confirmation).toBeInTheDocument();
    expect(confirmation).toHaveTextContent("Settings saved");
  });
});
