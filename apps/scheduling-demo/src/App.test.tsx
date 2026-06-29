import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { App } from "./App";

function renderApp(initialPath = "/planning") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App shell", () => {
  it("renders the branded shell with the company switcher", () => {
    renderApp();
    // Branding reads "Acme Scheduling" and the company switcher shows the company.
    expect(screen.getAllByText("Acme Scheduling").length).toBeGreaterThan(0);
    expect(screen.getByText("Acme Bistro")).toBeInTheDocument();
  });

  it("lands on the Planning view by default", () => {
    renderApp("/");
    expect(
      screen.getByRole("heading", { name: "Planning" }),
    ).toBeInTheDocument();
  });

  it("switches the visible view when a nav item is clicked", () => {
    renderApp("/planning");
    expect(
      screen.getByRole("heading", { name: "Planning" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Attendance" }));

    expect(
      screen.getByRole("heading", { name: "Attendance" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Planning" }),
    ).not.toBeInTheDocument();
  });
});
