"use client";

import type { CSSProperties } from "react";
import { alpha, lighten, darken } from "@mui/material/styles";

export const toRem = (px: number) => `${px / 16}rem`;

/**
 * Generate a full palette color object from a single main hex.
 * Uses MUI's own formula: light = lighten(main, tonalOffset), dark = darken(main, tonalOffset * 1.5).
 */
export function paletteColor(
  main: string,
  contrastText = "#fff",
  tonalOffset = 0.2,
) {
  return {
    main,
    light: lighten(main, tonalOffset * 4.5),
    dark: darken(main, tonalOffset * 1.5),
    contrastText,
  };
}

/* ── Branded grey scale ────────────────────────────────────────────── */

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  return [0, 0, Math.round(l * 100)];
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function normHue(h: number): number {
  const x = h % 360;
  return x < 0 ? x + 360 : x;
}

function hslToHex(h: number, s: number, l: number): string {
  const s1 = s / 100,
    l1 = l / 100;
  const a = s1 * Math.min(l1, 1 - l1);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** MUI default neutral grey lightness values (0–100). */
// prettier-ignore
const GREY_LIGHTNESS = {
  50: 98, 100: 96, 200: 93, 300: 88,
  400: 74, 500: 62, 600: 46, 700: 38,
  800: 26, 900: 13,
} as const;

/**
 * Generate a grey scale subtly tinted toward a primary color's hue.
 *
 * In dark mode the lightness values are reversed so that semantic usage
 * (e.g. grey[50] = subtle background, grey[900] = strong foreground)
 * works correctly in both modes.
 *
 * @param primaryHex  — the main brand color (e.g. "#1976d2")
 * @param saturation  — how much hue to inject, 0–100 (default 5 = subtle)
 * @param mode        — "light" | "dark" (default "light")
 */
export function brandedGreys(
  primaryHex: string,
  saturation = 5,
  mode: "light" | "dark" = "light",
) {
  const [hue] = hexToHsl(primaryHex);
  const steps = Object.keys(
    GREY_LIGHTNESS,
  ) as unknown as (keyof typeof GREY_LIGHTNESS)[];
  const lightnesses = steps.map((s) => GREY_LIGHTNESS[s]);
  const values = mode === "dark" ? [...lightnesses].reverse() : lightnesses;
  const result: Record<string, string> = {};
  for (let i = 0; i < steps.length; i++) {
    result[steps[i]] = hslToHex(hue, saturation, values[i]);
  }
  return result;
}

/**
 * Reverse a numeric-keyed color scale so that semantic step usage
 * (low = subtle, high = strong) works in dark mode.
 *
 * Swaps values: 50↔900, 100↔800, 200↔700, 300↔600, 400↔500.
 */
export function reverseScale<T extends Record<string, string>>(
  scale: T,
): Record<string, string> {
  const keys = Object.keys(scale).sort((a, b) => Number(a) - Number(b));
  const values = keys.map((k) => scale[k]);
  const reversed = [...values].reverse();
  const result: Record<string, string> = {};
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = reversed[i];
  }
  return result;
}

/**
 * Algorithmic mesh-gradient palette from a single brand hex (auth hero, marketing shells).
 *
 * **Two families** (avoids “template lavender” smear):
 * - **Chill blue** — analogous toward cyan/teal only (negative hue deltas from primary),
 *   no purple-pink drift.
 * - **Passionate orange** — hues clustered around the **complement** (~h0+180°) with
 *   high saturation (amber → coral range), not small offsets from blue (which read as
 *   violet in HSL).
 *
 * Heavy blur still avoids dumping complement directly on top of primary in the same blob
 * stack; warm layer uses screen blend on top of cool base.
 *
 * **Yin–yang read:** linear stops sweep cool → complement → cool on the hero diagonal; {@link radialYin}
 * / {@link radialYang} anchor the two poles as large corner washes.
 */
export interface AuthHeroMeshPalette {
  coolBlobs: readonly [string, string, string, string, string, string];
  warmBlobs: readonly [string, string, string, string, string, string, string];
  radialTopRight: string;
  radialTopLeft: string;
  radialBottomCenter: string;
  /** Large cool pool (yin pole) — azure / cyan, distinct from {@link radialTopLeft}. */
  radialYin: string;
  /** Large warm pool (yang pole) — tangerine / amber opposite the chill axis. */
  radialYang: string;
  linearStop1: string;
  linearStop2: string;
  linearStop3: string;
  linearStop4: string;
  /** Fifth stop closes the taijitu sweep back toward chill so the ramp isn’t orange-only. */
  linearStop5: string;
  rimA: string;
  rimB: string;
  vignetteDeep: string;
  vignetteInk: string;
  vignetteWarmWash: string;
}

/** Optional tuning for {@link meshGradientPaletteFromPrimary} (auth hero / marketing mesh). */
export type MeshGradientPaletteOptions = {
  /**
   * Multiplies HSL saturation on every generated stop (`1` = default curve).
   * Typical vivid range **1.12–1.28** on bright bases.
   */
  chromaBoost?: number;
};

export function meshGradientPaletteFromPrimary(
  primaryHex: string,
  options?: MeshGradientPaletteOptions,
): AuthHeroMeshPalette {
  const [hRaw, sRaw, lRaw] = hexToHsl(primaryHex);
  const h0 = normHue(hRaw);
  const s = clamp(sRaw, 52, 90);
  const l = clamp(lRaw, 48, 62);

  const chromaBoost = clamp(options?.chromaBoost ?? 1, 0.75, 1.45);
  /** Boost authored saturation values (0–100) toward more vivid color. */
  const adjS = (saturation: number) =>
    clamp(Math.round(saturation * chromaBoost), 28, 100);

  /** Orange / amber cluster opposite the primary on the wheel — reads “passionate”, not purple. */
  const ho = normHue(h0 + 178);

  /* Chill pole — biased toward cyan/teal/indigo so it reads clearly **not** orange (yin). */
  const coolBlobs = [
    primaryHex,
    hslToHex(
      normHue(h0 - 12),
      adjS(clamp(Math.round(s * 1), 54, 94)),
      clamp(l + 2, 44, 62),
    ),
    hslToHex(
      normHue(h0 - 34),
      adjS(clamp(Math.round(s * 0.96), 54, 92)),
      clamp(l + 4, 42, 62),
    ),
    hslToHex(
      normHue(h0 - 22),
      adjS(clamp(Math.round(s * 0.94), 52, 92)),
      clamp(l + 3, 42, 60),
    ),
    hslToHex(
      normHue(h0 - 44),
      adjS(clamp(Math.round(s * 0.92), 52, 90)),
      clamp(l + 6, 42, 62),
    ),
    /** Electric teal anchor — separates cool mass from warm complement in blur. */
    hslToHex(
      normHue(h0 - 28),
      adjS(clamp(Math.round(s * 0.9), 50, 90)),
      clamp(l + 4, 46, 62),
    ),
  ] as const;

  /** Yang pole — saturated amber→coral (complement cluster); pops through soft-light / screen. */
  const warmBlobs = [
    hslToHex(normHue(ho - 16), adjS(94), 52),
    hslToHex(normHue(ho - 6), adjS(96), 48),
    hslToHex(normHue(ho + 6), adjS(92), 50),
    hslToHex(normHue(ho + 14), adjS(90), 48),
    hslToHex(normHue(ho - 24), adjS(90), 46),
    hslToHex(normHue(ho + 2), adjS(94), 46),
    hslToHex(normHue(ho - 10), adjS(88), 54),
  ] as const;

  const radialTopRight = hslToHex(normHue(ho + 2), adjS(92), 56);
  const radialTopLeft = hslToHex(normHue(h0 - 38), adjS(58), 62);
  const radialBottomCenter = hslToHex(normHue(h0 - 14), adjS(54), 58);

  const radialYin = hslToHex(normHue(h0 - 26), adjS(64), 54);
  const radialYang = hslToHex(normHue(ho - 2), adjS(86), 50);

  /**
   * Five-stop taijitu sweep on the auth diagonal: **yin (cool) → yang (orange) → yin** so both
   * poles stay loud without washing to mush (blur lifts perceived lightness).
   */
  const linearStop1 = hslToHex(normHue(h0 - 16), adjS(62), 66);
  const linearStop2 = hslToHex(normHue(h0 - 32), adjS(58), 60);
  const linearStop3 = hslToHex(normHue(ho - 6), adjS(84), 52);
  const linearStop4 = hslToHex(normHue(ho + 12), adjS(78), 56);
  const linearStop5 = hslToHex(normHue(h0 - 8), adjS(54), 68);

  const rimA = hslToHex(normHue(ho - 4), adjS(88), 50);
  const rimB = hslToHex(normHue(ho + 8), adjS(90), 48);

  const vignetteDeep = hslToHex(normHue(h0 - 4), adjS(30), 54);
  const vignetteInk = hslToHex(normHue(h0 - 6), adjS(28), 50);
  const vignetteWarmWash = hslToHex(normHue(ho + 2), adjS(58), 66);

  return {
    coolBlobs,
    warmBlobs,
    radialTopRight,
    radialTopLeft,
    radialBottomCenter,
    radialYin,
    radialYang,
    linearStop1,
    linearStop2,
    linearStop3,
    linearStop4,
    linearStop5,
    rimA,
    rimB,
    vignetteDeep,
    vignetteInk,
    vignetteWarmWash,
  };
}

/* ── Derived typography set ────────────────────────────────────────────── */

export type TypographyVariantDef = {
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number | string;
  textTransform?: CSSProperties["textTransform"];
};

type DerivedTypographyVariantStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
  textTransform?: CSSProperties["textTransform"];
};

/**
 * Derive a typography set by applying deltas to base variants.
 *
 * Each deviation is *added* to the base value per variant:
 * - `fontSizeDelta` in px (e.g. -2 → h1 96 becomes 94)
 * - `lineHeightDelta` unitless (e.g. -0.05 → h1 1.167 becomes 1.117)
 * - `letterSpacingDelta` in em (e.g. 0.005 → h1 becomes -0.01062em)
 *
 * @param baseVariants — the canonical variant definitions to derive from
 * @param fontFamily   — the font stack string for this set
 */
export function deriveTypography<
  V extends Record<string, TypographyVariantDef>,
>(
  baseVariants: V,
  fontFamily: string,
  fontSizeDelta = 0,
  lineHeightDelta = 0,
  letterSpacingDelta = 0,
): { fontFamily: string } & { [K in keyof V]: DerivedTypographyVariantStyle } {
  const variants: Record<string, Record<string, unknown>> = {};
  for (const [key, base] of Object.entries(baseVariants)) {
    const ls =
      typeof base.letterSpacing === "string"
        ? parseFloat(base.letterSpacing)
        : base.letterSpacing;
    variants[key] = {
      fontFamily,
      fontSize: base.fontSize + fontSizeDelta,
      fontWeight: base.fontWeight,
      lineHeight: Math.round((base.lineHeight + lineHeightDelta) * 1000) / 1000,
      letterSpacing: `${(ls + letterSpacingDelta).toFixed(5)}em`,
      ...(base.textTransform ? { textTransform: base.textTransform } : {}),
    };
  }
  return { fontFamily, ...variants } as { fontFamily: string } & {
    [K in keyof V]: DerivedTypographyVariantStyle;
  };
}

/* ── Mode-dependent palette ────────────────────────────────────────── */

/**
 * Generate the mode-dependent parts of a MUI palette (text, background,
 * divider, action) algorithmically.
 *
 * The formula: in light mode every alpha channel is based on black (0,0,0);
 * in dark mode it flips to white (255,255,255) with MUI's standard opacity
 * adjustments. Background surfaces use the provided `surface` color (defaults
 * to white / #121212).
 *
 * `background.paper` is offset from `default` so elevated surfaces (MUI Paper,
 * dialogs, menus) read slightly above the canvas: darker than default in light
 * mode, lighter in dark mode — aligned with MUI’s default palette behavior.
 *
 * @param mode    — "light" | "dark"
 * @param surface — optional background color override
 */
/** Translucent primary chrome shared by panel nav, filter toggle chips, soft primary buttons */
export type PrimaryInteractionLayers = {
  toggleChipSelected: string;
  toggleChipSelectedHover: string;
  sideNavActive: string;
  sideNavActiveHover: string;
  sideNavBorder: string;
  footerSoftPrimaryBg: string;
  footerSoftPrimaryHoverBg: string;
  footerSoftPrimaryBorder: string;
};

/**
 * Single source of truth for “soft” primary UI (low-alpha washes on dark surfaces).
 * Light mode keeps toggle fills on `primary.light`; dark mode uses alpha(primary.main).
 */
export function createPrimaryInteractionLayers(
  primary: { main: string; light: string },
  mode: "light" | "dark",
  backgroundDefault: string,
): PrimaryInteractionLayers {
  const { main, light } = primary;
  if (mode === "dark") {
    return {
      toggleChipSelected: alpha(main, 0.0),
      toggleChipSelectedHover: alpha(main, 0.14),
      sideNavActive: alpha(main, 0.0),
      sideNavActiveHover: alpha(main, 0.14),
      sideNavBorder: alpha(main, 0.32),
      footerSoftPrimaryBg: alpha(main, 0.0),
      footerSoftPrimaryHoverBg: alpha(main, 0.14),
      footerSoftPrimaryBorder: alpha(main, 0.8),
    };
  }
  return {
    toggleChipSelected: light,
    toggleChipSelectedHover: light,
    sideNavActive: alpha(main, 0.12),
    sideNavActiveHover: alpha(main, 0.16),
    sideNavBorder: alpha(main, 0.45),
    footerSoftPrimaryBg: backgroundDefault,
    footerSoftPrimaryHoverBg: light,
    footerSoftPrimaryBorder: alpha(main, 0.5),
  };
}

/**
 * MUI's `alpha(color, o)` treats `color` as a **solid** (non-alpha) value when possible.
 * Storing `divider` as `rgba(…, 0.12)` and then using `alpha(divider, 0.5)` at call sites
 * double-composites opacity and looks wrong. The legacy token was "12% black/white over
 * the canvas"; we keep that look as a **fully opaque** `rgb(…)` mixed against
 * `background.default` so `alpha(theme.palette.divider, x)` is always predictable.
 */
const PALETTE_DIVIDER_BLEND = 0.12;

function hexToRgb(
  hex: string,
  fallback: [number, number, number],
): [number, number, number] {
  const h = hex.trim().replace("#", "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return fallback;
}

function opaqueDividerOverCanvas(
  canvasBgHex: string,
  mode: "light" | "dark",
): string {
  const fallback: [number, number, number] =
    mode === "light" ? [255, 255, 255] : [18, 18, 18];
  const rgb = hexToRgb(canvasBgHex, fallback);
  const a = PALETTE_DIVIDER_BLEND;
  const fg: [number, number, number] =
    mode === "light" ? [0, 0, 0] : [255, 255, 255];
  const blend = (i: number) => Math.round(a * fg[i] + (1 - a) * rgb[i]);
  return `rgb(${blend(0)}, ${blend(1)}, ${blend(2)})`;
}

export function modePalette(mode: "light" | "dark", surface?: string) {
  const isLight = mode === "light";
  const base = isLight ? "0, 0, 0" : "255, 255, 255";
  const bg = surface ?? (isLight ? "#ffffff" : "#121212");
  const paper = isLight ? darken(bg, 0.02) : lighten(bg, 0.02);

  return {
    mode,
    text: {
      primary: isLight ? `rgba(${base}, 0.87)` : "#fff",
      secondary: `rgba(${base}, ${isLight ? 0.6 : 0.7})`,
      disabled: `rgba(${base}, ${isLight ? 0.38 : 0.5})`,
      ...(isLight ? {} : { icon: `rgba(${base}, 0.5)` }),
    },
    background: { default: bg, paper },
    divider: opaqueDividerOverCanvas(bg, mode),
    action: {
      active: isLight ? `rgba(${base}, 0.54)` : "#fff",
      hover: `rgba(${base}, ${isLight ? 0.04 : 0.08})`,
      hoverOpacity: isLight ? 0.04 : 0.08,
      selected: `rgba(${base}, ${isLight ? 0.08 : 0.16})`,
      selectedOpacity: isLight ? 0.08 : 0.16,
      disabled: `rgba(${base}, ${isLight ? 0.26 : 0.3})`,
      disabledBackground: `rgba(${base}, 0.12)`,
      disabledOpacity: 0.38,
      focus: `rgba(${base}, 0.12)`,
      focusOpacity: 0.12,
      activatedOpacity: isLight ? 0.12 : 0.24,
    },
    common: { white: "#fff", black: "#000" },
  };
}
