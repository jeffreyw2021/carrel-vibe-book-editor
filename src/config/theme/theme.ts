"use client";

import { alpha, createTheme } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles";

import "@/config/theme/themeTypes";
import {
  paletteColor,
  brandedGreys,
  createPrimaryInteractionLayers,
  deriveTypography,
  modePalette,
  reverseScale,
} from "./themeUtils";
export {
  toRem,
  paletteColor,
  brandedGreys,
  createPrimaryInteractionLayers,
  deriveTypography,
  meshGradientPaletteFromPrimary,
  modePalette,
  reverseScale,
} from "./themeUtils";
export type {
  PrimaryInteractionLayers,
  AuthHeroMeshPalette,
  MeshGradientPaletteOptions,
} from "./themeUtils";

export const PRIMARY_FONT = "var(--font-urbanist), Urbanist, sans-serif";
export const SECONDARY_FONT = "var(--font-inter), Inter, sans-serif";

// prettier-ignore
const TYPOGRAPHY_VARIANTS = {
  h1:        { fontSize: 32, fontWeight: 600, lineHeight: 1.12, letterSpacing: 0 },
  h2:        { fontSize: 24, fontWeight: 600, lineHeight: 1.3,   letterSpacing: 0 },
  h3:        { fontSize: 20, fontWeight: 500, lineHeight: 1.4,   letterSpacing: 0 },
  h4:        { fontSize: 18, fontWeight: 500, lineHeight: 1.4,   letterSpacing: 0 },
  h5:        { fontSize: 15, fontWeight: 500, lineHeight: 1.5,   letterSpacing: 0 },
  h6:        { fontSize: 14, fontWeight: 500, lineHeight: 1.1,   letterSpacing: 0 },
  subtitle1: { fontSize: 14, fontWeight: 400, lineHeight: 1.1,   letterSpacing: 0 },
  subtitle2: { fontSize: 13, fontWeight: 400, lineHeight: 1.1,   letterSpacing: 0 },
  body1:     { fontSize: 15, fontWeight: 400, lineHeight: 1.36,  letterSpacing: 0 },
  body2:     { fontSize: 12, fontWeight: 400, lineHeight: 1.5,   letterSpacing: 0 },
  caption:   { fontSize: 13, fontWeight: 500, lineHeight: 1.4,   letterSpacing: 0 },
} as const;

export const PRIMARY_COLOR = "#477FFF";
const SEMANTIC_COLORS = {
  primary: paletteColor(PRIMARY_COLOR),
  secondary: paletteColor("#47F6FF"),
  error: paletteColor("#d32f2f"),
  warning: paletteColor("#ed6c02"),
  info: paletteColor("#0288d1"),
  success: paletteColor("#2e7d32"),
};

// prettier-ignore
const COLOR_SCALES = {
  blue:   { 50: "#ffffff", 100: "#f0f4ff", 200: "#e0e8ff", 300: "#c0d1ff", 400: "#a0baff", 500: "#80a2ff", 600: "#608bff", 700: "#4073ff", 800: "#205cff", 900: "#0066ff" },
  red:    { 50: "#fff5f5", 100: "#ffe3e3", 200: "#ffc9c9", 300: "#ffa8a8", 400: "#ff8787", 500: "#ff6b6b", 600: "#fa5252", 700: "#f03e3e", 800: "#e03131", 900: "#c92a2a" },
  green:  { 50: "#ebfbee", 100: "#d3f9d8", 200: "#b2f2bb", 300: "#8ce99a", 400: "#69db7c", 500: "#51cf66", 600: "#40c057", 700: "#37b24d", 800: "#2f9e44", 900: "#2b8a3e" },
  yellow: { 50: "#fff9db", 100: "#fff3bf", 200: "#ffec99", 300: "#ffe066", 400: "#ffd43b", 500: "#fcc419", 600: "#fab005", 700: "#f59f00", 800: "#f08c00", 900: "#e67700" },
  orange: { 50: "#fff4e6", 100: "#ffe8cc", 200: "#ffd8a8", 300: "#ffc078", 400: "#ffa94d", 500: "#ff922b", 600: "#fd7e14", 700: "#f76707", 800: "#e8590c", 900: "#d9480f" },
  purple: { 50: "#f8f0fc", 100: "#f3d9fa", 200: "#eebefa", 300: "#e599f7", 400: "#da77f2", 500: "#cc5de8", 600: "#be4bdb", 700: "#ae3ec9", 800: "#9c36b5", 900: "#862e9c" },
  pink:   { 50: "#fff0f6", 100: "#ffdeeb", 200: "#fcc2d7", 300: "#faa2c1", 400: "#f783ac", 500: "#f06595", 600: "#e64980", 700: "#d6336c", 800: "#c2255c", 900: "#a61e4d" },
  teal:   { 50: "#e6fcf5", 100: "#c3fae8", 200: "#96f2d7", 300: "#63e6be", 400: "#38d9a9", 500: "#20c997", 600: "#12b886", 700: "#0ca678", 800: "#099268", 900: "#087f5b" },
  cyan:   { 50: "#e3fafc", 100: "#c5f6fa", 200: "#99e9f2", 300: "#66d9e8", 400: "#3bc9db", 500: "#22b8cf", 600: "#15aabf", 700: "#1098ad", 800: "#0c8599", 900: "#0b7285" },
  indigo: { 50: "#edf2ff", 100: "#dbe4ff", 200: "#bac8ff", 300: "#91a7ff", 400: "#74c0fc", 500: "#4dabf7", 600: "#339af0", 700: "#228be6", 800: "#1c7ed6", 900: "#1971c2" },
  brown:  { 50: "#fdf8f6", 100: "#f2e8e5", 200: "#eaddd7", 300: "#e0cec7", 400: "#d2bab0", 500: "#bcaaa4", 600: "#a1887f", 700: "#795548", 800: "#6d4c41", 900: "#4e342e" },
  overlay: { light: "rgba(31, 41, 55, 0.08)", medium: "rgba(31, 41, 55, 0.1)", dark: "rgba(31, 41, 55, 0.2)", white: "rgba(255, 255, 255, 0.6)" },
};

const FLAT_SHADOWS = Array.from({ length: 25 }, () => "none") as Shadows;

const SHARED_THEME_OPTIONS = (mode: "light" | "dark") => {
  const isDark = mode === "dark";
  const scales = isDark
    ? Object.fromEntries(
        Object.entries(COLOR_SCALES).map(([name, scale]) => [
          name,
          typeof scale === "object" && "50" in scale
            ? reverseScale(scale as Record<string, string>)
            : scale,
        ]),
      )
    : COLOR_SCALES;

  return {
    colors: scales,

    secondaryTypography: deriveTypography(
      TYPOGRAPHY_VARIANTS,
      SECONDARY_FONT,
      0,
      0,
      0,
    ),

    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      ...deriveTypography(TYPOGRAPHY_VARIANTS, PRIMARY_FONT),
      button: {
        textTransform: "none",
      },
    },

    spacing: 8,
    shape: { borderRadius: 8 },

    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1320, xl: 1536 },
    },

    transitions: {
      easing: {
        easeInOut: "ease-in-out",
        easeOut: "ease-in-out",
        easeIn: "ease-in-out",
        sharp: "ease-in-out",
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },

    zIndex: {
      mobileStepper: 1000,
      fab: 1050,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  } as const;
};

export function createAppTheme(mode: "light" | "dark" = "light") {
  const mp = modePalette(mode);
  const primaryInteraction = createPrimaryInteractionLayers(
    SEMANTIC_COLORS.primary,
    mode,
    mp.background.default,
  );

  return createTheme({
    shadows: FLAT_SHADOWS,
    palette: {
      ...SEMANTIC_COLORS,
      ...mp,
      grey: brandedGreys(PRIMARY_COLOR, 4, mode),
      primaryInteraction,
    },
    ...SHARED_THEME_OPTIONS(mode),
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            transition: "none",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderColor: "transparent",
              borderWidth: 0,
            },
            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              border: "none",
              borderWidth: 0,
            },
            "&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderWidth: 0,
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { transition: "none" },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { transition: "none" },
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: { transition: "none" },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { transition: "none" },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            display: "flex",
            flexWrap: "nowrap" as const,
            maxWidth: "100%",
            overflowX: "auto" as const,
            border: "none",
            borderRadius: 0,
            boxSizing: "border-box" as const,
            gap: 0,
            backgroundColor: "transparent",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "none" as const,
            border: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "&.Mui-selected": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              backgroundColor:
                theme.palette.primaryInteraction.toggleChipSelected,
              "&:hover": {
                backgroundColor:
                  theme.palette.primaryInteraction.toggleChipSelectedHover,
              },
            },
            "&.MuiToggleButtonGroup-grouped": {
              marginLeft: "-1px",
              boxSizing: "border-box" as const,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 0,
              boxShadow: "none",
              zIndex: 0,
              "&:first-of-type": {
                marginLeft: 0,
                borderTopLeftRadius: `var(--toggle-group-segment-radius, ${theme.spacing(0.5)})`,
                borderBottomLeftRadius: `var(--toggle-group-segment-radius, ${theme.spacing(0.5)})`,
              },
              "&:last-of-type": {
                borderTopRightRadius: `var(--toggle-group-segment-radius, ${theme.spacing(0.5)})`,
                borderBottomRightRadius: `var(--toggle-group-segment-radius, ${theme.spacing(0.5)})`,
              },
              "&.Mui-selected": {
                zIndex: 1,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                backgroundColor:
                  theme.palette.primaryInteraction.toggleChipSelected,
                "&:hover": {
                  backgroundColor:
                    theme.palette.primaryInteraction.toggleChipSelectedHover,
                },
              },
            },
          }),
        },
      },
    },
  });
}

export const secondaryTypography = deriveTypography(
  TYPOGRAPHY_VARIANTS,
  SECONDARY_FONT,
  -1.5,
  0,
  0,
);

export const theme = createAppTheme("light");
export default theme;

export {
  alpha,
  useTheme,
  lighten,
  darken,
  styled,
  keyframes,
} from "@mui/material/styles";
export type { SxProps, Theme, Breakpoint } from "@mui/material/styles";
