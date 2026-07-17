import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { ApplicationState } from "../data-feedback";
import { Button } from "../forms";

export interface InternalNavigationItem {
  label: string;
  href: string;
  code?: string;
  requiredCapabilities?: string[];
}

export interface InternalNavigationGroup {
  label: string;
  items: InternalNavigationItem[];
}

export interface InternalBreadcrumb {
  label: string;
  href?: string;
}

export interface InternalUserContext {
  displayName: string;
  roleLabel: string;
  organizationLabel: string;
}

export type InternalWorkspaceState = "ready" | "loading" | "error" | "denied";

export interface InternalAppShellProps {
  navigationGroups: InternalNavigationGroup[];
  capabilities: string[];
  activeHref: string;
  userContext: InternalUserContext;
  workspaceEyebrow: string;
  workspaceTitle: string;
  workspaceDescription: string;
  breadcrumbs?: InternalBreadcrumb[];
  workspaceActions?: ReactNode;
  workspaceState?: InternalWorkspaceState;
  stateTitle?: string;
  stateMessage?: string;
  environmentLabel?: string;
  footerVersion?: string;
  children: ReactNode;
  onNavigate?: (href: string) => void;
  onRetry?: () => void;
}

const compactNavigationQuery = "(max-width: 52.5rem)";

const defaultWorkspaceStateCopy: Record<
  Exclude<InternalWorkspaceState, "ready">,
  { title: string; message: string }
> = {
  loading: {
    title: "Loading the internal workspace",
    message: "The latest authorized context is being requested."
  },
  error: {
    title: "The internal workspace could not be loaded",
    message: "Try again or use the approved support route if the problem continues."
  },
  denied: {
    title: "This internal workspace is not available",
    message: "Your active role, organization, assignment, or workflow does not authorize this view."
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

function hasRequiredCapabilities(item: InternalNavigationItem, capabilities: Set<string>) {
  return (item.requiredCapabilities ?? []).every((capability) => capabilities.has(capability));
}

export function InternalAppShell({
  navigationGroups,
  capabilities,
  activeHref,
  userContext,
  workspaceEyebrow,
  workspaceTitle,
  workspaceDescription,
  breadcrumbs = [],
  workspaceActions,
  workspaceState = "ready",
  stateTitle,
  stateMessage,
  environmentLabel = "Local foundation",
  footerVersion = "Foundation v0.1.0",
  children,
  onNavigate,
  onRetry
}: InternalAppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompactNavigation = useMediaQuery(compactNavigationQuery);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const sidebarCloseRef = useRef<HTMLButtonElement>(null);
  const firstNavigationLinkRef = useRef<HTMLAnchorElement>(null);
  const workspaceTitleRef = useRef<HTMLHeadingElement>(null);
  const restoreMenuFocusRef = useRef(false);
  const previousActiveHrefRef = useRef(activeHref);
  const navigationId = useId();
  const capabilitiesSet = useMemo(() => new Set(capabilities), [capabilities]);
  const visibleGroups = useMemo(
    () => navigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => hasRequiredCapabilities(item, capabilitiesSet))
      }))
      .filter((group) => group.items.length > 0),
    [capabilitiesSet, navigationGroups]
  );

  useEffect(() => {
    if (!isCompactNavigation || !menuOpen) {
      return;
    }

    document.body.dataset.navigationOpen = "true";
    const focusTimer = window.setTimeout(
      () => (firstNavigationLinkRef.current ?? sidebarCloseRef.current)?.focus(),
      0
    );

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
      delete document.body.dataset.navigationOpen;

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
      workspaceTitleRef.current?.focus();
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

  function handleNavigation(href: string) {
    onNavigate?.(href);
    if (isCompactNavigation) {
      restoreMenuFocusRef.current = false;
      setMenuOpen(false);
      window.setTimeout(() => workspaceTitleRef.current?.focus(), 0);
    }
  }

  const stateCopy = workspaceState === "ready" ? undefined : defaultWorkspaceStateCopy[workspaceState];
  let navigationItemIndex = 0;

  return (
    <div className="app-shell internal-app-shell">
      <a className="skip-link" href="#main-content">
        Skip to internal workspace
      </a>

      <aside
        id={navigationId}
        className={`sidebar internal-sidebar${menuOpen ? " sidebar--open" : ""}`}
        aria-hidden={isCompactNavigation && !menuOpen ? true : undefined}
        aria-label="Internal application navigation"
        inert={isCompactNavigation && !menuOpen ? true : undefined}
      >
        <div className="internal-sidebar__brand-row">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">SI</span>
            <span>
              <strong>Sentinel</strong>
              <small>Intelligence Platform</small>
            </span>
          </div>
          <button
            ref={sidebarCloseRef}
            className="internal-sidebar__close"
            type="button"
            aria-label="Close navigation panel"
            hidden={!isCompactNavigation}
            onClick={() => closeNavigation(true)}
          >
            Close
          </button>
        </div>

        <p className="visually-hidden">
          Navigation visibility does not grant access. The server authorizes every destination and record.
        </p>

        <nav className="primary-nav internal-navigation" aria-label="Internal primary navigation">
          {visibleGroups.map((group) => {
            const groupId = `${navigationId}-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return (
              <section className="internal-navigation__group" aria-labelledby={groupId} key={group.label}>
                <p className="internal-navigation__group-label" id={groupId}>{group.label}</p>
                <ul>
                  {group.items.map((item) => {
                    const isFirstItem = navigationItemIndex === 0;
                    navigationItemIndex += 1;
                    const isActive = item.href === activeHref;
                    return (
                      <li key={item.href}>
                        <a
                          ref={isFirstItem ? firstNavigationLinkRef : undefined}
                          className={`nav-link${isActive ? " nav-link--active" : ""}`}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => handleNavigation(item.href)}
                        >
                          {item.code && <span aria-hidden="true">{item.code}</span>}
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
          {visibleGroups.length === 0 && (
            <p className="internal-navigation__empty">No internal destinations are available for this context.</p>
          )}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          <span>
            <small>Environment</small>
            <strong>{environmentLabel}</strong>
          </span>
        </div>
      </aside>

      {isCompactNavigation && menuOpen && (
        <button
          className="nav-scrim"
          type="button"
          aria-label="Dismiss internal navigation"
          onClick={() => closeNavigation(true)}
        />
      )}

      <div className="main-column">
        <header className="topbar internal-topbar">
          <button
            ref={menuToggleRef}
            className="menu-toggle"
            type="button"
            aria-controls={navigationId}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close internal navigation" : "Open internal navigation"}
            hidden={!isCompactNavigation}
            onClick={toggleNavigation}
          >
            Menu
          </button>

          <div className="internal-topbar__context">
            <span>Active context</span>
            <strong>{userContext.organizationLabel}</strong>
          </div>
          <div className="internal-topbar__user">
            <span className="internal-topbar__avatar" aria-hidden="true">
              {userContext.displayName.slice(0, 2).toUpperCase()}
            </span>
            <span>
              <strong>{userContext.displayName}</strong>
              <small>{userContext.roleLabel}</small>
            </span>
          </div>
        </header>

        <main id="main-content" className="main-content internal-workspace" tabIndex={-1}>
          <header className="page-heading internal-workspace__heading">
            {breadcrumbs.length > 0 && (
              <nav className="internal-breadcrumbs" aria-label="Breadcrumb">
                <ol>
                  {breadcrumbs.map((breadcrumb, index) => {
                    const current = index === breadcrumbs.length - 1;
                    return (
                      <li key={`${breadcrumb.label}-${index}`}>
                        {breadcrumb.href && !current
                          ? <a href={breadcrumb.href}>{breadcrumb.label}</a>
                          : <span aria-current={current ? "page" : undefined}>{breadcrumb.label}</span>}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}
            <div className="internal-workspace__title-row">
              <div>
                <p className="eyebrow">{workspaceEyebrow}</p>
                <h1 ref={workspaceTitleRef} tabIndex={-1}>{workspaceTitle}</h1>
                <p className="lede">{workspaceDescription}</p>
              </div>
              {workspaceActions && workspaceState === "ready" && (
                <div className="internal-workspace__actions">{workspaceActions}</div>
              )}
            </div>
          </header>

          {workspaceState === "ready" ? children : (
            <ApplicationState
              kind={workspaceState}
              title={stateTitle ?? stateCopy?.title ?? ""}
              message={stateMessage ?? stateCopy?.message ?? ""}
              actions={workspaceState === "error" && onRetry
                ? <Button variant="secondary" onClick={onRetry}>Try again</Button>
                : undefined}
            />
          )}
        </main>

        <footer className="footer internal-footer">
          <span>Sentinel Intelligence Platform</span>
          <span>{footerVersion}</span>
        </footer>
      </div>
    </div>
  );
}
