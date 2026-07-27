import { StyleSheet, Text, View } from "react-native";
import type { Comp } from "../types";
import { colors } from "../theme";

interface Props {
  comps: Comp[];
  priceLow: number;
  priceHigh: number;
}

function daysAgo(date: string): number {
  return Math.round((Date.now() - new Date(date).getTime()) / 86_400_000);
}

// Recent-half vs. older-half average of sold comps — a lightweight, honest
// trend signal computed from the actual comps returned, not a fabricated number.
function computeTrend(sold: Comp[]): number | null {
  if (sold.length < 4) return null;
  const sorted = [...sold].sort((a, b) => (a.date < b.date ? -1 : 1));
  const mid = Math.floor(sorted.length / 2);
  const older = sorted.slice(0, mid);
  const recent = sorted.slice(mid);
  const avg = (arr: Comp[]) => arr.reduce((sum, c) => sum + c.price, 0) / arr.length;
  const olderAvg = avg(older);
  const recentAvg = avg(recent);
  if (olderAvg === 0) return null;
  return ((recentAvg - olderAvg) / olderAvg) * 100;
}

export default function StatRow({ comps, priceLow, priceHigh }: Props) {
  const sold = comps.filter((c) => c.status === "sold");
  const midpoint = Math.round((priceLow + priceHigh) / 2);
  const trend = computeTrend(sold);
  const mostRecentSold = [...sold].sort((a, b) => (a.date > b.date ? -1 : 1))[0];
  const lastSaleDays = mostRecentSold ? daysAgo(mostRecentSold.date) : null;

  return (
    <View style={styles.row}>
      <Tile label="Est. value" value={`$${midpoint.toLocaleString()}`} sub="midpoint of range" />
      <Tile
        label="Recent trend"
        value={trend === null ? "—" : `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`}
        sub="vs. earlier comps"
        valueColor={trend === null ? colors.textPrimary : trend >= 0 ? colors.success : colors.danger}
      />
      <Tile label="Comps found" value={String(comps.length)} sub={`${sold.length} sold`} />
      <Tile
        label="Last sale"
        value={lastSaleDays === null ? "—" : `${lastSaleDays}d`}
        sub={lastSaleDays === null ? "no sold comps" : "ago"}
      />
    </View>
  );
}

function Tile({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  tile: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: "600", marginBottom: 4 },
  value: { color: colors.textPrimary, fontSize: 20, fontWeight: "800" },
  sub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
