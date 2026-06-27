import { Colors } from "@/constants/theme";
import { useThemeSwitcher } from "@/hooks/ThemeSwitcherHook";
import React, { createContext, useContext } from "react";

type Theme = typeof Colors.lightTheme;
const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeSwitcher();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
