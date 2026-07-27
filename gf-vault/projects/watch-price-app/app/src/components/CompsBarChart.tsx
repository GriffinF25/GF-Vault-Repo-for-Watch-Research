import { StyleSheet, Text, View } from "react-native";
import type { Comp } from "../types";
import { colors } from "../theme";

interface Props {
  comps: Comp[];
}

export default function CompsBarChart({ comps }: Props) {
  if (comps.length === 0) return null;

  const sorted = [...comps].sort((a, b) => b.price - a.price);
  const maxPrice = Math.max(...sorted.map((c) => c.price));

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Comps found ({comps.length})</Text>
      {sorted.map((c, i) => {
        const widthPct = Math.max(6, (c.price / maxPrice) * 100);
        const isSold = c.status === "sold";
        return (
          <View key={i} style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.rowSource} numberOfLines={2}>
                {c.source}
              </Text>
              <Text style={styles.rowPrice}>${c.price.toLocaleString()}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${widthPct}%`,
                    backgroundColor: isSold ? colors.primary : colors.textMuted,
                    opacity: isSold ? 1 : 0.55,
                  },
                ]}
              />
            </View>
            <Text style={styles.rowDate}>
              {c.date} · {c.status}
            </Text>
          </View>
        );
      })}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Sold</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textMuted, opacity: 0.55 }]} />
          <Text style={styles.legendText}>Active listing</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: "700", marginBottom: 12 },
  row: { marginBottom: 14 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 8 },
  rowSource: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", flex: 1 },
  rowPrice: { color: colors.textPrimary, fontSize: 13, fontWeight: "700" },
  rowDate: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  legendRow: { flexDirection: "row", gap: 14, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textMuted, fontSize: 11 },
});
