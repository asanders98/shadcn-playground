import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PoolsView } from "./PoolsView";

describe("PoolsView", () => {
  it("renders candidate cards once the skeleton flourish clears", async () => {
    render(<PoolsView />);

    // Cards land after the first-load skeleton beat.
    expect(await screen.findByText("Ava Romano")).toBeInTheDocument();
    expect(screen.getByText("Isla Moreno")).toBeInTheDocument();
  });

  it("filters the visible candidates live as the user types", async () => {
    render(<PoolsView />);

    await screen.findByText("Ava Romano");
    expect(screen.getByText("Ben Carter")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search candidates"), {
      target: { value: "Ava" },
    });

    // The match stays; a non-matching candidate disappears.
    expect(screen.getByText("Ava Romano")).toBeInTheDocument();
    expect(screen.queryByText("Ben Carter")).not.toBeInTheDocument();
  });
});
