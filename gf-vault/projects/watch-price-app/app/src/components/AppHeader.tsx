import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { colors } from "../theme";

export default function AppHeader({ navigation, route, back }: NativeStackHeaderProps) {
  const isHome = route.name === "Home";

  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {back ? (
          <Pressable
            style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
            onPress={() => navigation.goBack()}
            hitSlop={10}
          >
            <Text style={styles.navButtonText}>← Back</Text>
          </Pressable>
        ) : null}
      </View>

      <Pressable onPress={() => navigation.navigate("Home")} hitSlop={10}>
        <Text style={styles.brand}>GF VAULT</Text>
      </Pressable>

      <View style={[styles.side, styles.sideRight]}>
        {!isHome ? (
          <Pressable
            style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
            onPress={() => navigation.navigate("Home")}
            hitSlop={10}
          >
            <Text style={styles.navButtonText}>Home</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: Platform.select({ ios: 54, android: 36, default: 16 }),
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  side: { minWidth: 64 },
  sideRight: { alignItems: "flex-end" },
  brand: { color: colors.primary, fontSize: 13, fontWeight: "800", letterSpacing: 1.5 },
  navButton: { paddingVertical: 4, paddingHorizontal: 6 },
  navButtonPressed: { opacity: 0.6 },
  navButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
});
