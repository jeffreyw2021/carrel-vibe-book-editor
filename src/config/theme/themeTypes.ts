import React from "react";

import type { PrimaryInteractionLayers } from "@/config/theme/themeUtils";

declare module "@mui/material/styles" {
  interface Palette {
    primaryInteraction: PrimaryInteractionLayers;
  }

  interface PaletteOptions {
    primaryInteraction?: PrimaryInteractionLayers;
  }

  interface Theme {
    secondaryTypography: {
      fontFamily: string;
      [variant: string]: unknown;
    };
    colors: {
      blue: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
      };
      red: {
        50: string;
        100: string;
        200: string;
      };
      green: {
        50: string;
        100: string;
        main: string;
      };
      overlay: {
        light: string;
        medium: string;
        dark: string;
        white: string;
      };
    };
  }

  interface ThemeOptions {
    secondaryTypography?: {
      fontFamily: string;
      [variant: string]: unknown;
    };
    colors?: {
      blue?: {
        50?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
        700?: string;
        800?: string;
        900?: string;
      };
      red?: {
        50?: string;
        100?: string;
        200?: string;
        300?: string;
        400?: string;
        500?: string;
        600?: string;
      };
      green?: {
        50?: string;
        100?: string;
        main?: string;
      };
      overlay?: {
        light?: string;
        medium?: string;
        dark?: string;
        white?: string;
      };
    };
  }

  interface SimplePaletteColorOptions {
    transparent?: string;
  }

  interface PaletteColor {
    transparent?: string;
  }

  interface TypographyVariants {
    label: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
}
