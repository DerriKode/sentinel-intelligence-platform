import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

function setCompactViewport(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  );
}

describe("frontend foundation", () => {
  beforeEach(() => {
    setCompactViewport(false);
  });

  it("provides a named main landmark, skip link, and keyboard-reachable state controls", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
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
    expect(screen.getByRole("heading", { name: title }).closest("[role]")).toHaveAttribute(
      "role",
      label === "Error" ? "alert" : "status"
    );
  });

  it("announces validation errors and accepts a corrected value", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Save placeholder" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a workspace label before continuing.");
    expect(screen.getByRole("textbox", { name: "Workspace label" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox", { name: "Workspace label" })).toHaveFocus();

    await user.type(screen.getByRole("textbox", { name: "Workspace label" }), "Central operations");
    await user.click(screen.getByRole("button", { name: "Save placeholder" }));

    expect(screen.getByRole("heading", { name: "The foundation is ready" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Workspace label" })).toHaveAttribute("aria-invalid", "false");
  });

  it("marks loading as busy and announces completion states atomically", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Loading" }));
    const loadingState = screen.getByRole("heading", { name: "Preparing your workspace" }).closest("[role]");
    expect(loadingState).toHaveAttribute("role", "status");
    expect(loadingState).toHaveAttribute("aria-busy", "true");
    expect(loadingState).toHaveAttribute("aria-atomic", "true");

    await user.click(screen.getByRole("button", { name: "Success" }));
    const successState = screen.getByRole("heading", { name: "The foundation is ready" }).closest("[role]");
    expect(successState).toHaveAttribute("aria-busy", "false");
    expect(successState).toHaveAttribute("aria-live", "polite");
  });

  it("keeps closed mobile navigation inert and restores focus after Escape or scrim dismissal", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();
    render(<App />);
    const menu = screen.getByRole("button", { name: "Open navigation" });
    const navigation = screen.getByLabelText("Application navigation");

    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-controls", "application-navigation");
    expect(navigation).toHaveAttribute("aria-hidden", "true");
    expect(navigation).toHaveAttribute("inert");

    await user.click(menu);
    expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(navigation).not.toHaveAttribute("aria-hidden");
    expect(navigation).not.toHaveAttribute("inert");
    await waitFor(() => expect(screen.getByRole("link", { name: /Foundation/ })).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(menu).toHaveFocus());
    expect(menu).toHaveAccessibleName("Open navigation");
    expect(navigation).toHaveAttribute("inert");

    await user.click(menu);
    await user.click(screen.getByRole("button", { name: "Dismiss navigation" }));
    await waitFor(() => expect(menu).toHaveFocus());
    expect(menu).toHaveAttribute("aria-expanded", "false");
  });
});
