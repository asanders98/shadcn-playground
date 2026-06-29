import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Import through the package's public boundary — the single seam a consuming
// app uses — not via a relative path to the component file.
import { Button } from "../index";

describe("Button (export boundary smoke test)", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies variant + size classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn).toHaveClass("bg-destructive");
    expect(btn).toHaveClass("h-11");
  });

  it("renders as a child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toHaveAttribute("href", "/home");
  });
});
