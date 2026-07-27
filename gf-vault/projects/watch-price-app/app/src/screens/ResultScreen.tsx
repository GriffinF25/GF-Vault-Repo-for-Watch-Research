import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { colors } from "../theme";
import { useResponsive } from "../hooks/useResponsive";
import PriceHistoryChart from "../components/PriceHistoryChart";
import CompsBarChart from "../components/CompsBarChart";
import StatRow from "../components/StatRow";
import MarketplaceBreakdown from "../components/MarketplaceBreakdown";
import ListingsGrid from "../components/ListingsGrid";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

const CONFIDENCE_COLOR: Record<string, string> = {
  low: colors.danger,
  medium: colors.warning,
  "medium-high": colors.primary,
  high: colors.success,
};

const CONFIDENCE_EXPLANATION: Record<string, string> = {
  high: "3+ recent, exact-match sold comps agree closely — this range is well supported.",
  "medium-high": "Good matching comps found, with minor gaps or variation in price.",
  medium: "Adequate but mixed evidence — comps exist but aren't all exact matches or fully recent.",
  low: "Sparse or conflicting evidence — treat this range as a rough starting point.",
};

export default function ResultScreen({ route, navigation }: Props) {
  const { input, estimate, cached, mock } = route.params;
  const fetchedDate = new Date(estimate.fetched_at);
  const { isDesktop, containerMaxWidth } = useResponsive();

  const priceAndStats = (
    <>
      <View style={styles.priceCard}>
        <Text style={styles.priceLabel}>Estimated resale value</Text>
        <Text style={styles.priceRange}>
          ${estimate.price_low.toLocaleString()} – ${estimate.price_high.toLocaleString()}
        </Text>
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: CONFIDENCE_COLOR[estimate.confidence] ?? colors.textMuted },
            ]}
          >
            <Text style={styles.badgeText}>{estimate.confidence} confidence</Text>
          </View>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeOutlineText}>{estimate.liquidity_rating}</Text>
          </View>
        </View>
        <Text style={styles.confidenceExplain}>
          {CONFIDENCE_EXPLANATION[estimate.confidence] ?? ""}
        </Text>
        <Text style={styles.updated}>
          {cached ? "From cache · " : "Just researched · "}
          {fetchedDate.toLocaleString()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.sellButton}
        onPress={() => navigation.navigate("SellToUs", { input })}
      >
        <Text style={styles.sellButtonText}>Sell this watch to us →</Text>
      </TouchableOpacity>
    </>
  );

  const statSection = (
    <>
      <StatRow comps={estimate.comps} priceLow={estimate.price_low} priceHigh={estimate.price_high} />
      <Text style={styles.statCaption}>
        "Recent trend" compares the newer half of comps found to the older half — a rough directional
        signal, not a guarantee. Averages are computed only from the comps listed below, not a full
        market history.
      </Text>
    </>
  );

  const priceHistorySection = (
    <PriceHistoryChart
      comps={estimate.comps}
      priceLow={estimate.price_low}
      priceHigh={estimate.price_high}
    />
  );

  const marketplaceSection = (
    <>
      <MarketplaceBreakdown comps={estimate.comps} />
      <CompsBarChart comps={estimate.comps} />
    </>
  );

  return (
    <ScrollView style={styles.flex} contentContainerStyle={[styles.container, { maxWidth: containerMaxWidth }]}>
      {mock ? (
        <View style={styles.mockBanner}>
          <Text style={styles.mockBannerText}>
            Mock data — no backend configured yet. Prices below are placeholders.
          </Text>
        </View>
      ) : null}
      <Text style={styles.heading}>
        {estimate.brand} {estimate.model}
      </Text>
      <Text style={styles.reference}>Ref. {estimate.reference}</Text>

      {isDesktop ? (
        <View style={styles.desktopRow}>
          <View style={styles.desktopColLeft}>{priceAndStats}</View>
          <View style={styles.desktopColRight}>{statSection}</View>
        </View>
      ) : (
        <>
          {priceAndStats}
          {statSection}
        </>
      )}

      {isDesktop ? (
        <View style={styles.desktopRow}>
          <View style={styles.desktopColLeft}>{priceHistorySection}</View>
          <View style={styles.desktopColRight}>{marketplaceSection}</View>
        </View>
      ) : (
        <>
          {priceHistorySection}
          {marketplaceSection}
        </>
      )}

      <Text style={styles.sectionTitle}>Listings ({estimate.comps.length})</Text>
      <ListingsGrid comps={estimate.comps} />

      {estimate.sources.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Sources</Text>
          {estimate.sources.map((s, i) => (
            <Text key={i} style={styles.sourceLine}>
              • {s}
            </Text>
          ))}
        </>
      ) : null}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.backButtonText}>Check another watch</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 60,
    width: "100%",
    alignSelf: "center",
  },
  desktopRow: { flexDirection: "row", gap: 20, alignItems: "flex-start" },
  desktopColLeft: { flex: 1 },
  desktopColRight: { flex: 1 },
  mockBanner: {
    backgroundColor: colors.warningMuted,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  mockBannerText: { color: colors.warning, fontSize: 12, fontWeight: "600" },
  heading: { fontSize: 24, fontWeight: "800", color: colors.textPrimary },
  reference: { fontSize: 14, color: colors.textMuted, marginTop: 2, marginBottom: 20 },
  priceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceLabel: { color: colors.textSecondary, fontSize: 13, marginBottom: 6 },
  priceRange: { color: colors.textPrimary, fontSize: 26, fontWeight: "800" },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { color: colors.background, fontWeight: "700", fontSize: 12 },
  badgeOutline: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  badgeOutlineText: { color: colors.textSecondary, fontSize: 12, fontWeight: "600" },
  confidenceExplain: { color: colors.textMuted, fontSize: 12, marginTop: 10, lineHeight: 17 },
  updated: { color: colors.textMuted, fontSize: 12, marginTop: 10 },
  sellButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  sellButtonText: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  statCaption: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 8 },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 10,
  },
  sourceLine: { color: colors.textMuted, fontSize: 13, marginBottom: 4 },
  backButton: { alignItems: "center", marginTop: 30, paddingVertical: 10 },
  backButtonText: { color: colors.primary, fontSize: 15, fontWeight: "600" },
});
