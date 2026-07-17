import { useState } from "react";
import { PublicPortalShell, type PublicNavigationItem } from "./PublicPortalShell";

const publicNavigation: PublicNavigationItem[] = [
  { label: "Report", href: "/public/report" },
  { label: "Track a submission", href: "/public/track" },
  { label: "Safety and privacy", href: "/public/privacy" },
  { label: "Help", href: "/public/help" }
];

const publicLanguages = [
  { code: "en", label: "English", available: true },
  { code: "tw", label: "Twi", available: false }
];

function initialPublicDestination() {
  const currentPath = window.location.pathname;
  return publicNavigation.find((item) => currentPath.startsWith(item.href))?.href ?? "/public";
}

export function PublicPortalPreview() {
  const [activeHref, setActiveHref] = useState(initialPublicDestination);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <PublicPortalShell
      navigationItems={publicNavigation}
      activeHref={activeHref}
      currentLanguage={currentLanguage}
      languages={publicLanguages}
      pageEyebrow="Public reporting service"
      pageTitle="Share information safely."
      pageDescription={
        "Submit a missing-person report, sighting, or tip without entering the internal operations portal."
      }
      pageActions={(
        <>
          <a className="public-action public-action--primary" href="#report-options">Choose a report type</a>
          <a className="public-action public-action--secondary" href="#tracking-guidance">Track a submission</a>
        </>
      )}
      onNavigate={setActiveHref}
      onLanguageChange={setCurrentLanguage}
    >
      <section className="public-service-notice" aria-labelledby="emergency-title">
        <p className="eyebrow">Before you continue</p>
        <h2 id="emergency-title">This service is not for emergencies.</h2>
        <p>
          If someone is in immediate danger or needs urgent assistance, contact the emergency service for your area.
        </p>
      </section>

      <section className="public-report-options" id="report-options" aria-labelledby="report-options-title">
        <div className="public-section-heading">
          <p className="eyebrow">Report options</p>
          <h2 id="report-options-title">What would you like to share?</h2>
          <p>Choose the option that best describes the information you have.</p>
        </div>
        <div className="public-report-options__grid">
          <article>
            <span aria-hidden="true">01</span>
            <h3>Missing person</h3>
            <p>Provide the minimum information needed to begin reviewing a missing-person report.</p>
            <p className="public-report-option__status">Form workflow is not active in this shell preview.</p>
          </article>
          <article>
            <span aria-hidden="true">02</span>
            <h3>Sighting</h3>
            <p>Share when and where you saw someone without accessing an internal case record.</p>
            <p className="public-report-option__status">Form workflow is not active in this shell preview.</p>
          </article>
          <article>
            <span aria-hidden="true">03</span>
            <h3>Tip</h3>
            <p>Send relevant information with clear privacy and moderation expectations.</p>
            <p className="public-report-option__status">Form workflow is not active in this shell preview.</p>
          </article>
        </div>
      </section>

      <section className="public-guidance-grid" aria-label="Public service guidance">
        <article id="tracking-guidance">
          <p className="eyebrow">Tracking</p>
          <h2>Keep your tracking details private.</h2>
          <p>
            Tracking will require a reference and a separate approved secret. Neither belongs in a URL,
            public message, or shared screenshot.
          </p>
        </article>
        <article>
          <p className="eyebrow">What the public portal shows</p>
          <h2>Only a limited public status.</h2>
          <p>
            Internal notes, assignments, staff identities, evidence, candidate information, and other reporters’
            submissions are never part of the public status experience.
          </p>
        </article>
      </section>
    </PublicPortalShell>
  );
}
