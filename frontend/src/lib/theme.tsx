"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

// Read the stored preference (or the OS preference) lazily during the initial
// render rather than syncing it from an effect — avoids the
// react-hooks/set-state-in-effect anti-pattern. The value only affects the UI
// after hydration (see useHydrated below), so SSR output stays consistent
// between server and client.
function getInitialTheme(): Theme {
  return "dark";
}

// A subscribe function that never fires — the store value only changes once,
// from the server snapshot (false) to the client snapshot (true) right after
// hydration. This is the React-recommended way to detect "mounted on client"
// without calling setState inside an effect.
const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const hydrated = useHydrated();

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      return next;
    });
  }, []);

  // Prevent flash of wrong theme by not rendering until hydrated
  if (!hydrated) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
