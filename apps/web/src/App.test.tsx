import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("frontend foundation", () => {
  it("provides a named main landmark, skip link, and keyboard-reachable state controls", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("heading", { name: "A dependable shell for public-safety work." })).toBeVisible();
    expect(screen.getByRole("group", { name: "Foundation state preview" })).toBeVisible();
  });

  it.each([
    ["Loading", "Preparing your workspace"],
    ["Empty", "No records to show yet"],
    ["Error", "We could not load this workspace"],
    ["Permission denied", "Access is not available for this view"],
    ["Validation", "Review the highlighted fields"]
  ])("renders the %s state with an actionable message", async (label, title) => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: label }));

    expect(screen.getByRole("heading", { name: title })).toBeVisible();
    expect(screen.getByRole("button", { name: label })).toHaveAttribute("aria-pressed", "true");
  });

  it("announces validation errors and accepts a corrected value", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Save placeholder" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a workspace label before continuing.");
    expect(screen.getByRole("textbox", { name: "Workspace label" })).toHaveAttribute("aria-invalid", "true");

    await user.type(screen.getByRole("textbox", { name: "Workspace label" }), "Central operations");
    await user.click(screen.getByRole("button", { name: "Save placeholder" }));

    expect(screen.getByRole("heading", { name: "The foundation is ready" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Workspace label" })).toHaveAttribute("aria-invalid", "false");
  });

  it("supports a responsive navigation toggle with an accessible name", async () => {
    const user = userEvent.setup();
    render(<App />);
    const menu = screen.getByRole("button", { name: "Menu" });

    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-controls", "application-navigation");
    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Close navigation" })).toBeVisible();
  });
});
