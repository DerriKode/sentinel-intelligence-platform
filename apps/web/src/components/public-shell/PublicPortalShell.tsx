import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";
import { ApplicationState, type ApplicationStateKind } from "../data-feedback";
import { Button } from "../forms";

export interface PublicNavigationItem {
  label: string;
  href: string;
}

export interface PublicLanguageOption {
  code: string;
  label: string;
  available: boolean;
}

export type PublicPageState = "ready" | ApplicationStateKind;

export interface PublicPortalShellProps {
  navigationItems: PublicNavigationItem[];
  activeHref: string;
  currentLanguage: string;
  languages: PublicLanguageOption[];
  pageEyebrow: string;
  pageTitle: string;
  pageDescription: string;
  children: ReactNode;
  pageActions?: ReactNode;
  pageState?: PublicPageState;
  stateTitle?: string;
  stateMessage?: string;
  privacyMessage?: string;
  onNavigate?: (href: string) => void;
  onLanguageChange?: (language: string) => void;
  onRetry?: () => void;
}

const compactNavigationQuery = "(max-width: 40rem)";

const defaultPageStateCopy: Record<
  Exclude<PublicPageState, "ready">,
  { title: string; message: string }
> = {
  loading: {
    title: "Loading this public service",
    message: "Please wait while the requested public information is prepared."
  },
  empty: {
    title: "No public information is available",
    message: "Return to public reporting or use the help page for safe next steps."
  },
  error: {
    title: "This public service could not be loaded",
    message: "Try again later. No submission or protected record details are shown."
  },
  success: {
    title: "The public action is complete",
    message: "Follow the confirmed next step shown for this action."
  },
  denied: {
    title: "This public page is not available",
    message: "Return to public reporting. This message does not confirm whether a protected record exists."
  },
  validation: {
    title: "Some information needs attention",
    message: "Review the identified fields and correct them before continuing."
  }
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia?.(query).matches ?? false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(query);
    if (!mediaQuery) {
      return;
    }

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

export function PublicPortalShell({
  navigationItems,
  activeHref,
  currentLanguage,
  languages,
  pageEyebrow,
  pageTitle,
  pageDescription,
  children,
  pageActions,
  pageState = "ready",
  stateTitle,
  stateMessage,
  privacyMessage = "Share only what is needed for your report. Never place a tracking secret in a link or message.",
  onNavigate,
  onLanguageChange,
  onRetry
}: PublicPortalShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompactNavigation = useMediaQuery(compactNavigationQuery);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstNavigationLinkRef = useRef<HTMLAnchorElement>(null);
  const pageTitleRef = useRef<HTMLHeadingElement>(null);
  const restoreMenuFocusRef = useRef(false);
  const previousActiveHrefRef = useRef(activeHref);
  const navigationId = useId();
  const languageId = useId();
  const languageStatusId = useId();
  const unavailableLanguages = languages.filter((language) => !language.available);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${pageTitle} — Sentinel Public Reporting`;
    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);

  useEffect(() => {
    if (!isCompactNavigation || !menuOpen) {
      return;
    }

    document.body.dataset.publicNavigationOpen = "true";
    const focusTimer = window.setTimeout(() => firstNavigationLinkRef.current?.focus(), 0);

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreMenuFocusRef.current = true;
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleEscape);
      delete document.body.dataset.publicNavigationOpen;

      if (restoreMenuFocusRef.current) {
        restoreMenuFocusRef.current = false;
        menuToggleRef.current?.focus();
      }
    };
  }, [isCompactNavigation, menuOpen]);

  useEffect(() => {
    if (!isCompactNavigation && menuOpen) {
      restoreMenuFocusRef.current = false;
      setMenuOpen(false);
    }
  }, [isCompactNavigation, menuOpen]);

  useEffect(() => {
    if (previousActiveHrefRef.current !== activeHref) {
      previousActiveHrefRef.current = activeHref;
      pageTitleRef.current?.focus();
    }
  }, [activeHref]);

  function closeNavigation(restoreFocus: boolean) {
    restoreMenuFocusRef.current = restoreFocus;
    setMenuOpen(false);
  }

  function toggleNavigation() {
    if (menuOpen) {
      closeNavigation(true);
      return;
    }

    restoreMenuFocusRef.current = false;
    setMenuOpen(true);
  }

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    onNavigate?.(href);

    if (isCompactNavigation) {
      restoreMenuFocusRef.current = false;
      setMenuOpen(false);
      window.setTimeout(() => pageTitleRef.current?.focus(), 0);
    }
  }

  function handleLanguageChange(languageCode: string) {
    const selectedLanguage = languages.find((language) => language.code === languageCode);
    if (selectedLanguage?.available) {
      onLanguageChange?.(languageCode);
    }
  }

  const stateCopy = pageState === "ready" ? undefined : defaultPageStateCopy[pageState];

  return (
    <div className="public-portal">
      <a className="skip-link" href="#public-main-content">
        Skip to public service content
      </a>

      <div className="public-utility">
        <p className="public-utility__emergency">
          <strong>Immediate danger?</strong> Contact your local emergency services. This portal does not dispatch help.
        </p>
        <div className="public-language">
          <label htmlFor={languageId}>Language</label>
          <select
            id={languageId}
            value={currentLanguage}
            aria-describedby={languageStatusId}
            onChange={(event) => handleLanguageChange(event.target.value)}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code} disabled={!language.available}>
                {language.label}{language.available ? "" : " — not yet available"}
              </option>
            ))}
          </select>
          <span className="visually-hidden" id={languageStatusId}>
            {unavailableLanguages.length > 0
              ? `${unavailableLanguages.map((language) => language.label).join(", ")} translation is not yet available.`
              : "All listed translations are available."}
          </span>
        </div>
      </div>

      <header className="public-header">
        <div className="public-header__inner">
          <a
            className="public-brand"
            href="/public"
            onClick={(event) => handleNavigation(event, "/public")}
          >
            <span className="public-brand__mark" aria-hidden="true">SI</span>
            <span>
              <strong>Sentinel</strong>
              <small>Public Reporting</small>
            </span>
          </a>

          <button
            ref={menuToggleRef}
            className="public-menu-toggle"
            type="button"
            aria-controls={navigationId}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close public navigation" : "Open public navigation"}
            hidden={!isCompactNavigation}
            onClick={toggleNavigation}
          >
            Menu
          </button>

          <nav
            id={navigationId}
            className={`public-navigation${menuOpen ? " public-navigation--open" : ""}`}
            aria-label="Public primary navigation"
            aria-hidden={isCompactNavigation && !menuOpen ? true : undefined}
            inert={isCompactNavigation && !menuOpen ? true : undefined}
          >
            <div className="public-navigation__heading">
              <strong>Public services</strong>
              <button
                className="public-navigation__close"
                type="button"
                aria-label="Close public navigation panel"
                hidden={!isCompactNavigation}
                onClick={() => closeNavigation(true)}
              >
                Close
              </button>
            </div>
            <ul>
              {navigationItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    ref={index === 0 ? firstNavigationLinkRef : undefined}
                    href={item.href}
                    aria-current={item.href === activeHref ? "page" : undefined}
                    onClick={(event) => handleNavigation(event, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {isCompactNavigation && menuOpen && (
        <button
          className="public-navigation-scrim"
          type="button"
          aria-label="Dismiss public navigation"
          onClick={() => closeNavigation(true)}
        />
      )}

      <main id="public-main-content" className="public-main" tabIndex={-1}>
        <aside className="public-privacy-reminder" aria-label="Privacy reminder">
          <strong>Privacy reminder</strong>
          <p>{privacyMessage}</p>
        </aside>

        <header className="public-page-heading">
          <p className="eyebrow">{pageEyebrow}</p>
          <h1 ref={pageTitleRef} tabIndex={-1}>{pageTitle}</h1>
          <p>{pageDescription}</p>
          {pageActions && pageState === "ready" && (
            <div className="public-page-heading__actions">{pageActions}</div>
          )}
        </header>

        {pageState === "ready" ? children : (
          <ApplicationState
            kind={pageState}
            title={stateTitle ?? stateCopy?.title ?? ""}
            message={stateMessage ?? stateCopy?.message ?? ""}
            actions={pageState === "error" && onRetry
              ? <Button variant="secondary" onClick={onRetry}>Try again</Button>
              : undefined}
          />
        )}
      </main>

      <footer className="public-footer">
        <div>
          <strong>Sentinel Public Reporting</strong>
          <p>For reports, sightings, and tips. Not an emergency dispatch service.</p>
        </div>
        <nav aria-label="Public policy and support">
          <a href="/public/privacy" onClick={(event) => handleNavigation(event, "/public/privacy")}>Privacy</a>
          <a
            href="/public/accessibility"
            onClick={(event) => handleNavigation(event, "/public/accessibility")}
          >
            Accessibility
          </a>
          <a href="/public/help" onClick={(event) => handleNavigation(event, "/public/help")}>Help</a>
        </nav>
      </footer>
    </div>
  );
}
