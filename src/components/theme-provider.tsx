
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme", // Changed vite-ui-theme to a more generic ui-theme
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);
  const [resolvedTheme, setResolvedThemeState] = useState<"light" | "dark" | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Effect to set mounted and read initial theme from localStorage
  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme;
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        initialTheme = storedTheme;
      } else {
        initialTheme = defaultTheme;
      }
    } catch (e) {
      // localStorage might be disabled
      initialTheme = defaultTheme;
    }
    setThemeState(initialTheme);
  }, [defaultTheme, storageKey]);

  // Effect to apply theme to DOM and update resolvedTheme
  useEffect(() => {
    if (theme === undefined || !mounted) {
      // Set a default resolvedTheme if not mounted or theme is not yet determined.
      // This helps consumers like ThemeToggle have a non-undefined value.
      if (!resolvedTheme) { // Only set if not already set by a previous run or init
        setResolvedThemeState(defaultTheme === 'dark' || defaultTheme === 'light' ? defaultTheme : 'light');
      }
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let currentAppliedTheme: "light" | "dark";
    if (theme === "system") {
      const systemPref = window.matchMedia("(prefers-color-scheme: dark)");
      currentAppliedTheme = systemPref.matches ? "dark" : "light";
    } else {
      currentAppliedTheme = theme;
    }

    root.classList.add(currentAppliedTheme);
    setResolvedThemeState(currentAppliedTheme);

    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") { // only update if current theme is system
        const newSystemTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newSystemTheme);
        setResolvedThemeState(newSystemTheme);
      }
    };

    if (theme === "system") {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, mounted, defaultTheme, resolvedTheme]); // Added defaultTheme and resolvedTheme to dependencies for initial set

  const setTheme = (newTheme: Theme) => {
    if (mounted) {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        // localStorage might be disabled
      }
    }
    setThemeState(newTheme);
  };
  
  const contextValue = {
    theme: theme === undefined ? defaultTheme : theme,
    setTheme,
    resolvedTheme: resolvedTheme === undefined ? (defaultTheme === 'dark' || defaultTheme === 'light' ? defaultTheme : 'light') : resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
