"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "@/config/theme/theme";

type ThemePreference = "light" | "dark" | "system";
type ResolvedMode = "light" | "dark";

const THEME_STORAGE_KEY = "carrel_theme_preference";
const DEFAULT_THEME_PREFERENCE: ThemePreference = "light";

type ColorModeContextValue = {
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  resolvedMode: ResolvedMode;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_THEME_PREFERENCE;
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_THEME_PREFERENCE;
}

function writeStoredTheme(pref: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // localStorage unavailable
  }
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within MuiProvider");
  return ctx;
}

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [systemDark, setSystemDark] = useState(false);
  const [preference, setPreferenceState] = useState<ThemePreference>(
    DEFAULT_THEME_PREFERENCE,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemDark(mq.matches);
    apply();
    setPreferenceState(readStoredTheme());
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const resolvedMode = useMemo<ResolvedMode>(() => {
    if (preference === "system") return systemDark ? "dark" : "light";
    return preference;
  }, [preference, systemDark]);

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p);
    writeStoredTheme(p);
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference, resolvedMode }),
    [preference, setPreference, resolvedMode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
