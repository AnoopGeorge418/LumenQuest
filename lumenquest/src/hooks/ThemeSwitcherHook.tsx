import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export const useThemeSwitcher = () => {
  const colorSchema = useColorScheme();

  return colorSchema === "dark" ? Colors.darkTheme : Colors.lightTheme;
};
