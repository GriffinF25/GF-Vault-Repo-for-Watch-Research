import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

// Stub: RevenueCat + Apple/Google IAP wiring comes in the store-submission
// phase. This screen exists so the free-tier limit flow is complete end to
// end; the button shows inline feedback rather than a real purchase flow.
export default function PaywallScreen({ navigation }: Props) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>You've used your free lookups this month</Text>
        <Text style={styles.body}>
          GF Vault Premium gives you unlimited price checks, force-refreshed live data, and full
          comps history.
        </Text>

        {showComingSoon ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Premium subscriptions aren't live yet — they launch closer to the App Store release.
            </Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={() => setShowComingSoon(true)}>
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: { width: "100%", maxWidth: 480 },
  title: { fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginBottom: 12 },
  body: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 30 },
  notice: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 14,
    marginBottom: 16,
  },
  noticeText: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  secondaryButton: { alignItems: "center", marginTop: 18, paddingVertical: 10 },
  secondaryButtonText: { color: colors.textMuted, fontSize: 15 },
});
