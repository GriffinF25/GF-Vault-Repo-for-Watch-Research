import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer, DarkTheme, type Theme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import type { RootStackParamList } from "./src/types";
import { ensureSession } from "./src/lib/supabase";
import { colors } from "./src/theme";
import AppHeader from "./src/components/AppHeader";
import HomeScreen from "./src/screens/HomeScreen";
import ResultScreen from "./src/screens/ResultScreen";
import SellToUsScreen from "./src/screens/SellToUsScreen";
import PaywallScreen from "./src/screens/PaywallScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.textPrimary,
  },
};

// Reflects the current screen in the browser URL/history so the browser's
// own back/forward buttons work too, not just the in-app header.
const linking = {
  prefixes: [],
  config: {
    screens: {
      Home: "",
      Result: "result",
      SellToUs: "sell",
      Paywall: "paywall",
    },
  },
};

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSession()
      .catch((err) => console.error("Failed to establish session:", err))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme} linking={linking}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ header: (props) => <AppHeader {...props} /> }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="SellToUs" component={SellToUsScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
