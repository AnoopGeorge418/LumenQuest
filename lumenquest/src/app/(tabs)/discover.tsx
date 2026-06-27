import { useAppTheme } from "@/context/ThemeContext";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Discover = () => {
  const theme = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background }}>
      <View style={{ paddingLeft: 20, paddingRight: 20 }}></View>
    </SafeAreaView>
  );
};

export default Discover;
