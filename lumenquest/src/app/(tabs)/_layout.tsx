import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "@/context/ThemeContext";

const TabsLayout = () => {

    const theme = useAppTheme()
    
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              height: 70,
              marginBottom: 30,
              marginLeft: 20,
              marginRight: 20,
              paddingTop: 10,
              borderRadius: 20,
              backgroundColor: theme?.card,
              borderTopWidth: 0,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            tabBarActiveTintColor: theme?.primary,
            tabBarInactiveTintColor: theme?.textSecondary,
            tabBarLabelStyle: {
              fontFamily: "PlayfairDisplay-Regular",
              fontSize: 12,
              letterSpacing: 2,
            },
        }}>

            {/*Home tab*/}
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons
                    size={size} color={color} name={focused ? "home" : "home-outline"} />
                ),
              }}
            />

        {/*Discover Tab*/}
        <Tabs.Screen
            name="discover"
            options={{
            title: "Explore",
            tabBarIcon: ({ focused, color, size }) => (
                <Ionicons size={size} color={color} name={focused ? "compass" : "compass-outline"} />
            ),
            }}
        />
    </Tabs>
  );
};

export default TabsLayout;
