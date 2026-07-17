import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import shellStyles from "./shell.css?raw";
import {
  InternalAppShell,
  type InternalNavigationGroup,
  type InternalWorkspaceState
} from "./index";

const navigationGroups: InternalNavigationGroup[] = [
  {
    label: "Operations",
    items: [
      {
        label: "Authorized workspace",
        href: "#authorized",
        code: "AW",
        requiredCapabilities: ["workspace:view"]
      },
      {
        label: "Restricted administration",
        href: "#restricted",
        code: "RA",
        requiredCapabilities: ["administration:manage"]
      }
    ]
  },
  {
    label: "Restricted group",
    items: [
      {
        label: "Restricted audit",
        href: "#audit",
        requiredCapabilities: ["audit:view"]
      }
    ]
  }
];

const userContext = {
  displayName: "Synthetic user",
  roleLabel: "Investigator preview",
  organizationLabel: "Synthetic operations"
};

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

interface ShellHarnessProps {
  capabilities?: string[];
  workspaceState?: InternalWorkspaceState;
  onRetry?: () => void;
}

function ShellHarness({
  capabilities = ["workspace:view"],
  workspaceState = "ready",
  onRetry
}: ShellHarnessProps) {
  const [activeHref, setActiveHref] = useState("#authorized");

  return (
    <InternalAppShell
      navigationGroups={navigationGroups}
      capabilities={capabilities}
      activeHref={activeHref}
      userContext={userContext}
      workspaceEyebrow="Internal operations"
      workspaceTitle="Authorized workspace"
      workspaceDescription="Synthetic local context only."
      breadcrumbs={[
        { label: "Internal", href: "#authorized" },
        { label: "Authorized workspace" }
      ]}
      workspaceState={workspaceState}
      onNavigate={setActiveHref}
      onRetry={onRetry}
    >
      <p>Authorized workspace content</p>
    </InternalAppShell>
  );
}

describe("internal application shell", () => {
  beforeEach(() => {
    setCompactViewport(false);
  });

  it("provides named landmarks, context, breadcrumbs, and a current destination", () => {
    render(<ShellHarness />);

    expect(screen.getByRole("link", { name: "Skip to internal workspace" })).toHaveAttribute(
      "href",
      "#main-content"
    );
    expect(screen.getByLabelText("Internal application navigation")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Internal primary navigation" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Authorized workspace/ })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByText("Synthetic operations")).toBeVisible();
    expect(screen.getByText("Investigator preview")).toBeVisible();
    expect(screen.getByRole("main")).toHaveTextContent("Authorized workspace content");
  });

  it("shows only capability-authorized destinations and removes empty groups", () => {
    render(<ShellHarness />);
    const navigation = screen.getByRole("navigation", { name: "Internal primary navigation" });

    expect(within(navigation).getByRole("link", { name: /Authorized workspace/ })).toBeVisible();
    expect(within(navigation).queryByText("Restricted administration")).not.toBeInTheDocument();
    expect(within(navigation).queryByText("Restricted group")).not.toBeInTheDocument();
    expect(within(navigation).queryByText("Restricted audit")).not.toBeInTheDocument();
  });

  it("uses a safe empty-navigation message and focuses the close control when no link is available", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();
    render(<ShellHarness capabilities={[]} />);

    const menu = screen.getByRole("button", { name: "Open internal navigation" });
    await user.click(menu);

    expect(screen.getByText("No internal destinations are available for this context.")).toBeVisible();
    await waitFor(() => expect(screen.getByRole("button", { name: "Close navigation panel" })).toHaveFocus());
  });

  it("keeps compact navigation inert when closed and restores focus after dismissal", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();
    render(<ShellHarness />);
    const menu = screen.getByRole("button", { name: "Open internal navigation" });
    const sidebar = screen.getByLabelText("Internal application navigation");

    expect(sidebar).toHaveAttribute("aria-hidden", "true");
    expect(sidebar).toHaveAttribute("inert");
    await user.click(menu);
    await waitFor(() => expect(screen.getByRole("link", { name: /Authorized workspace/ })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(menu).toHaveFocus());

    await user.click(menu);
    await user.click(screen.getByRole("button", { name: "Dismiss internal navigation" }));
    await waitFor(() => expect(menu).toHaveFocus());
    expect(sidebar).toHaveAttribute("inert");
  });

  it("closes compact navigation and focuses the workspace title after route selection", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();

    function RouteHarness() {
      const [activeHref, setActiveHref] = useState("#authorized");
      return (
        <InternalAppShell
          navigationGroups={[
            {
              label: "Operations",
              items: [
                { label: "Authorized workspace", href: "#authorized" },
                { label: "Review queue", href: "#review" }
              ]
            }
          ]}
          capabilities={[]}
          activeHref={activeHref}
          userContext={userContext}
          workspaceEyebrow="Internal operations"
          workspaceTitle="Authorized workspace"
          workspaceDescription="Synthetic local context only."
          onNavigate={setActiveHref}
        >
          <p>Workspace content</p>
        </InternalAppShell>
      );
    }

    render(<RouteHarness />);
    await user.click(screen.getByRole("button", { name: "Open internal navigation" }));
    await user.click(screen.getByRole("link", { name: "Review queue" }));

    expect(
      screen.getByLabelText("Internal application navigation").querySelector('a[href="#review"]')
    ).toHaveAttribute("aria-current", "page");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Authorized workspace" })).toHaveFocus());
    expect(screen.getByLabelText("Internal application navigation")).toHaveAttribute("inert");
  });

  it.each([
    ["loading", "Loading the internal workspace", "status"],
    ["denied", "This internal workspace is not available", "status"],
    ["error", "The internal workspace could not be loaded", "alert"]
  ] as const)("renders a safe %s workspace boundary", (state, title, role) => {
    render(<ShellHarness workspaceState={state} />);

    expect(screen.getByRole(role)).toHaveTextContent(title);
    expect(screen.queryByText("Authorized workspace content")).not.toBeInTheDocument();
  });

  it("offers an explicit retry only for recoverable workspace errors", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ShellHarness workspaceState="error" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("uses design tokens and includes responsive, coarse-pointer, and forced-color rules", () => {
    expect(shellStyles).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(/i);
    expect(shellStyles).toContain("@media (max-width: 52.5rem)");
    expect(shellStyles).toContain("@media (max-width: 40rem)");
    expect(shellStyles).toContain("@media (pointer: coarse)");
    expect(shellStyles).toContain("@media (forced-colors: active)");
  });
});
