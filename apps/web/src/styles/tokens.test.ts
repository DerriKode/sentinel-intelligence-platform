import { describe, expect, it } from "vitest";
import globalStyles from "../styles.css?raw";
import tokens from "./tokens.css?raw";

const requiredTokenFamilies = [
  "--color-text-primary",
  "--font-family-sans",
  "--font-size-md",
  "--space-4",
  "--radius-md",
  "--border-default",
  "--shadow-subtle",
  "--motion-duration-fast",
  "--breakpoint-mobile",
  "--layout-content-max"
];

function tokenHex(token: string) {
  const match = tokens.match(new RegExp(`${token}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!match) {
    throw new Error(`Missing hexadecimal token value for ${token}`);
  }
  return match[1];
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const first = relativeLuminance(tokenHex(foreground));
  const second = relativeLuminance(tokenHex(background));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe("design token contract", () => {
  it.each(requiredTokenFamilies)("defines %s centrally", (token) => {
    expect(tokens).toContain(`${token}:`);
  });

  it("defines semantic states and a dual-contrast focus treatment", () => {
    for (const token of [
      "--color-success",
      "--color-loading",
      "--color-error",
      "--color-restricted",
      "--color-warning",
      "--color-focus-ring",
      "--color-focus-contrast"
    ]) {
      expect(tokens).toContain(`${token}:`);
    }

    expect(globalStyles).toContain("var(--color-focus-ring)");
    expect(globalStyles).toContain("var(--color-focus-contrast)");
  });

  it("imports the central tokens and keeps component colors tokenized", () => {
    expect(globalStyles.trimStart()).toMatch(/^@import "\.\/styles\/tokens\.css";/);
    expect(globalStyles).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(globalStyles).not.toMatch(/rgba?\(/i);
  });

  it("preserves tablet, mobile, and reduced-motion foundations", () => {
    expect(tokens).toContain("--breakpoint-tablet: 52.5rem");
    expect(tokens).toContain("--breakpoint-mobile: 40rem");
    expect(globalStyles).toContain("@media (max-width: 52.5rem)");
    expect(globalStyles).toContain("@media (max-width: 40rem)");
    expect(globalStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(globalStyles).toContain("var(--motion-duration-instant)");
  });

  it.each([
    ["--color-navy-950", "--color-white"],
    ["--color-slate-600", "--color-white"],
    ["--color-teal-700", "--color-white"],
    ["--color-amber-700", "--color-amber-100"],
    ["--color-red-700", "--color-red-100"],
    ["--color-purple-700", "--color-purple-100"]
  ])("%s meets 4.5:1 contrast against %s", (foreground, background) => {
    expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });
});
