import { StyleSheet, Text, View } from "react-native";
import type { Comp } from "../types";
import { colors } from "../theme";

interface Props {
  comps: Comp[];
}

// Dark-mode steps of the dataviz skill's validated 8-hue categorical order
// (references/palette.md) — fixed order, never cycled. Bar/adjacent forms
// clear the CVD gates through slot 4; a 5th+ marketplace folds into "Other".
const CATEGORICAL = ["#3987e5", "#d95926", "#199e70", "#c98500"];
const OTHER_COLOR = colors.textMuted;

function cleanSourceName(source: string): string {
  return source.replace(/\s*\(mock\)\s*/i, "").trim();
}

export default function MarketplaceBreakdown({ comps }: Props) {
  if (comps.length === 0) return null;

  const bySource = new Map<string, { count: number; total: number }>();
  for (const c of comps) {
    const name = cleanSourceName(c.source);
    const entry = bySource.get(name) ?? { count: 0, total: 0 };
    entry.count += 1;
    entry.total += c.price;
    bySource.set(name, entry);
  }

  const rows = [...bySource.entries()]
    .map(([name, { count, total }]) => ({ name, count, avg: total / count }))
    .sort((a, b) => b.count - a.count);

  const top = rows.slice(0, 4).map((r, i) => ({ ...r, color: CATEGORICAL[i] }));
  const rest = rows.slice(4);
  const folded =
    rest.length > 0
      ? [
          {
            name: `Other (${rest.length})`,
            count: rest.reduce((s, r) => s + r.count, 0),
            avg: rest.reduce((s, r) => s + r.avg * r.count, 0) / rest.reduce((s, r) => s + r.count, 0),
            color: OTHER_COLOR,
          },
        ]
      : [];

  const rowsToShow = [...top, ...folded];
  const maxCount = Math.max(...rowsToShow.map((r) => r.count));

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>By marketplace</Text>
      <Text style={styles.caption}>
        "Avg" is the average price of the comps found from that source below — not a broader market
        index.
      </Text>
      {rowsToShow.map((r) => (
        <View key={r.name} style={styles.row}>
          <View style={styles.rowTop}>
            <View style={styles.rowLabel}>
              <View style={[styles.dot, { backgroundColor: r.color }]} />
              <Text style={styles.rowName} numberOfLines={2}>
                {r.name}
              </Text>
            </View>
            <Text style={styles.rowMeta}>
              {r.count} · ${Math.round(r.avg).toLocaleString()} avg
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.bar,
                { width: `${Math.max(8, (r.count / maxCount) * 100)}%`, backgroundColor: r.color },
              ]}
            />
          </View>
        </View>
      ))}
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
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: "700", marginBottom: 4 },
  caption: { color: colors.textMuted, fontSize: 11, lineHeight: 15, marginBottom: 12 },
  row: { marginBottom: 12 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5, gap: 8 },
  rowLabel: { flexDirection: "row", alignItems: "flex-start", gap: 6, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  rowName: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", flex: 1 },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: { height: "100%", borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  rowMeta: { color: colors.textMuted, fontSize: 11, flexShrink: 0 },
});
