import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";
import publicShellStyles from "./public-shell.css?raw";
import {
  PublicPortalShell,
  type PublicPageState
} from "./index";

const navigationItems = [
  { label: "Report", href: "/public/report" },
  { label: "Track a submission", href: "/public/track" },
  { label: "Safety and privacy", href: "/public/privacy" },
  { label: "Help", href: "/public/help" }
];

const languages = [
  { code: "en", label: "English", available: true },
  { code: "tw", label: "Twi", available: false }
];

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

interface PublicShellHarnessProps {
  pageState?: PublicPageState;
  onRetry?: () => void;
  onLanguageChange?: (language: string) => void;
  languageOptions?: typeof languages;
}

function PublicShellHarness({
  pageState = "ready",
  onRetry,
  onLanguageChange,
  languageOptions = languages
}: PublicShellHarnessProps) {
  const [activeHref, setActiveHref] = useState("/public/report");

  return (
    <PublicPortalShell
      navigationItems={navigationItems}
      activeHref={activeHref}
      currentLanguage="en"
      languages={languageOptions}
      pageEyebrow="Public reporting"
      pageTitle="Share information safely."
      pageDescription="Synthetic public-service context."
      pageState={pageState}
      onNavigate={setActiveHref}
      onRetry={onRetry}
      onLanguageChange={onLanguageChange}
    >
      <p>Public shell content</p>
    </PublicPortalShell>
  );
}

describe("public portal shell", () => {
  beforeEach(() => {
    setCompactViewport(false);
    window.history.replaceState({}, "", "/");
    document.title = "Sentinel test";
  });

  it("provides distinct public landmarks, service limits, privacy guidance, and title", () => {
    render(<PublicShellHarness />);

    expect(screen.getByRole("link", { name: "Skip to public service content" })).toHaveAttribute(
      "href",
      "#public-main-content"
    );
    expect(screen.getByRole("navigation", { name: "Public primary navigation" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Public policy and support" })).toBeVisible();
    expect(screen.getByLabelText("Privacy reminder")).toHaveTextContent("Never place a tracking secret");
    expect(screen.getByText(/This portal does not dispatch help/)).toBeVisible();
    expect(screen.getByRole("main")).toHaveTextContent("Public shell content");
    expect(document.title).toBe("Share information safely. — Sentinel Public Reporting");
  });

  it("uses only the approved shallow public destinations and safe canonical URLs", () => {
    render(<PublicShellHarness />);
    const navigation = screen.getByRole("navigation", { name: "Public primary navigation" });
    const links = within(navigation).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Report",
      "Track a submission",
      "Safety and privacy",
      "Help"
    ]);
    expect(links.every((link) => link.getAttribute("href")?.startsWith("/public/"))).toBe(true);
    expect(links.every((link) => !/[?#]/.test(link.getAttribute("href") ?? ""))).toBe(true);
    expect(screen.queryByText(/staff role|candidate result|evidence access/i)).not.toBeInTheDocument();
  });

  it("marks unavailable translations without presenting them as complete", () => {
    const onLanguageChange = vi.fn();
    render(<PublicShellHarness onLanguageChange={onLanguageChange} />);

    const language = screen.getByRole("combobox", { name: "Language" });
    expect(language).toHaveValue("en");
    expect(language).toHaveAccessibleDescription("Twi translation is not yet available.");
    expect(screen.getByRole("option", { name: "Twi — not yet available" })).toBeDisabled();
    expect(onLanguageChange).not.toHaveBeenCalled();
  });

  it("emits an available language choice without changing copy itself", async () => {
    const onLanguageChange = vi.fn();
    const availableLanguages = languages.map((language) => ({ ...language, available: true }));
    render(
      <PublicShellHarness
        languageOptions={availableLanguages}
        onLanguageChange={onLanguageChange}
      />
    );

    await userEvent.setup().selectOptions(screen.getByRole("combobox", { name: "Language" }), "tw");
    expect(onLanguageChange).toHaveBeenCalledWith("tw");
  });

  it("keeps compact public navigation inert and restores focus after Escape or scrim dismissal", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();
    render(<PublicShellHarness />);
    const menu = screen.getByRole("button", { name: "Open public navigation" });
    const navigation = screen.getByLabelText("Public primary navigation");

    expect(navigation).toHaveAttribute("aria-hidden", "true");
    expect(navigation).toHaveAttribute("inert");
    await user.click(menu);
    await waitFor(() => expect(screen.getByRole("link", { name: "Report" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(menu).toHaveFocus());

    await user.click(menu);
    await user.click(screen.getByRole("button", { name: "Dismiss public navigation" }));
    await waitFor(() => expect(menu).toHaveFocus());
    expect(navigation).toHaveAttribute("inert");
  });

  it("closes compact navigation, marks the route, and focuses the page title", async () => {
    setCompactViewport(true);
    const user = userEvent.setup();
    render(<PublicShellHarness />);

    await user.click(screen.getByRole("button", { name: "Open public navigation" }));
    const openNavigation = screen.getByRole("navigation", { name: "Public primary navigation" });
    await user.click(within(openNavigation).getByRole("link", { name: "Help" }));

    const navigation = screen.getByLabelText("Public primary navigation");
    expect(navigation.querySelector('a[href="/public/help"]')).toHaveAttribute("aria-current", "page");
    expect(navigation).toHaveAttribute("inert");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Share information safely." })).toHaveFocus());
  });

  it.each([
    ["loading", "Loading this public service", "status"],
    ["empty", "No public information is available", "status"],
    ["error", "This public service could not be loaded", "alert"],
    ["success", "The public action is complete", "status"],
    ["denied", "This public page is not available", "status"],
    ["validation", "Some information needs attention", "alert"]
  ] as const)("renders the safe %s public-page boundary", (state, title, role) => {
    render(<PublicShellHarness pageState={state} />);

    expect(screen.getByRole(role)).toHaveTextContent(title);
    expect(screen.queryByText("Public shell content")).not.toBeInTheDocument();
  });

  it("offers retry only when the public error is recoverable", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<PublicShellHarness pageState="error" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("keeps the /public preview isolated from internal navigation and staff context", () => {
    window.history.replaceState({}, "", "/public");
    render(<App />);

    expect(screen.getByRole("navigation", { name: "Public primary navigation" })).toBeVisible();
    expect(screen.queryByLabelText("Internal application navigation")).not.toBeInTheDocument();
    expect(screen.queryByText("Local preview user")).not.toBeInTheDocument();
    expect(screen.queryByText("Synthetic operations context")).not.toBeInTheDocument();
    expect(screen.getByText("English", { selector: "option" })).toBeInTheDocument();
  });

  it("uses tokens and mobile-first, narrow, coarse, reduced-motion, and forced-color rules", () => {
    expect(publicShellStyles).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(/i);
    expect(publicShellStyles).toContain("@media (min-width: 40.0625rem)");
    expect(publicShellStyles).toContain("@media (max-width: 24rem)");
    expect(publicShellStyles).toContain("@media (pointer: coarse)");
    expect(publicShellStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(publicShellStyles).toContain("@media (forced-colors: active)");
  });
});
