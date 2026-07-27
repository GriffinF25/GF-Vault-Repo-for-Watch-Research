import { useMemo, useRef, useState } from "react";
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import type { Comp } from "../types";
import { colors } from "../theme";

interface Props {
  comps: Comp[];
  priceLow: number;
  priceHigh: number;
}

const W = 320;
const H = 200;
const PAD = { top: 18, right: 14, bottom: 26, left: 52 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

type Range = "all" | 90 | 30;
const RANGES: { key: Range; label: string }[] = [
  { key: "all", label: "All" },
  { key: 90, label: "90D" },
  { key: 30, label: "30D" },
];

function niceStep(range: number): number {
  if (range <= 0) return 1;
  const rough = range / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  const step = residual >= 5 ? 10 : residual >= 2 ? 5 : residual >= 1 ? 2 : 1;
  return step * magnitude;
}

function formatPrice(v: number): string {
  return `$${Math.round(v).toLocaleString()}`;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function PriceHistoryChart({ comps, priceLow, priceHigh }: Props) {
  const [range, setRange] = useState<Range>("all");
  const [crosshair, setCrosshair] = useState<{ vbX: number; comp: Comp } | null>(null);
  const containerWidthRef = useRef(0);

  const filtered = useMemo(() => {
    if (range === "all") return comps;
    const cutoff = Date.now() - range * 86_400_000;
    return comps.filter((c) => new Date(c.date).getTime() >= cutoff);
  }, [comps, range]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [filtered],
  );
  const soldPoints = useMemo(() => sorted.filter((c) => c.status === "sold"), [sorted]);

  if (comps.length === 0) return null;

  if (sorted.length === 0) {
    return (
      <View style={styles.wrap}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Price history</Text>
          <RangeToggle range={range} onChange={setRange} />
        </View>
        <Text style={styles.emptyText}>No comps in this window — try a wider range.</Text>
      </View>
    );
  }

  const allPrices = sorted.map((c) => c.price).concat([priceLow, priceHigh]);
  const rawMin = Math.min(...allPrices);
  const rawMax = Math.max(...allPrices);
  const step = niceStep(rawMax - rawMin || rawMax * 0.2 || 100);
  const yMin = Math.max(0, Math.floor(rawMin / step) * step - step);
  const yMax = Math.ceil(rawMax / step) * step + step;

  const times = sorted.map((c) => new Date(c.date).getTime());
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const tSpan = tMax - tMin || 1;

  const x = (iso: string) => PAD.left + ((new Date(iso).getTime() - tMin) / tSpan) * INNER_W;
  const y = (price: number) => PAD.top + INNER_H - ((price - yMin) / (yMax - yMin)) * INNER_H;

  const linePath = soldPoints
    .map((c, i) => `${i === 0 ? "M" : "L"} ${x(c.date).toFixed(1)} ${y(c.price).toFixed(1)}`)
    .join(" ");

  const ticks = [yMin, yMin + (yMax - yMin) / 2, yMax];
  const bandTop = y(priceHigh);
  const bandBottom = y(priceLow);

  function nearestComp(vbX: number): Comp {
    let nearest = sorted[0];
    let minDist = Infinity;
    for (const c of sorted) {
      const dist = Math.abs(x(c.date) - vbX);
      if (dist < minDist) {
        minDist = dist;
        nearest = c;
      }
    }
    return nearest;
  }

  function updateFromTouchX(localX: number) {
    if (!containerWidthRef.current) return;
    const scale = W / containerWidthRef.current;
    const vbX = Math.max(PAD.left, Math.min(W - PAD.right, localX * scale));
    setCrosshair({ vbX, comp: nearestComp(vbX) });
  }

  // Drag-to-scrub crosshair (react-native-svg's per-shape onPress isn't
  // reliable on the web target, so a single PanResponder on an overlay
  // drives the whole interaction — works identically on native and web).
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => updateFromTouchX(e.nativeEvent.locationX),
    onPanResponderMove: (e) => updateFromTouchX(e.nativeEvent.locationX),
  });

  function handleLayout(e: LayoutChangeEvent) {
    containerWidthRef.current = e.nativeEvent.layout.width;
  }

  const lastSold = soldPoints[soldPoints.length - 1];

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Price history</Text>
        <RangeToggle range={range} onChange={setRange} />
      </View>

      <View style={styles.svgContainer} onLayout={handleLayout} {...panResponder.panHandlers}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          {ticks.map((t, i) => (
            <Line
              key={i}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke={colors.border}
              strokeWidth={1}
            />
          ))}
          {ticks.map((t, i) => (
            <SvgText
              key={`label-${i}`}
              x={PAD.left - 8}
              y={y(t) + 3}
              fontSize={9}
              fill={colors.textMuted}
              textAnchor="end"
            >
              {formatPrice(t)}
            </SvgText>
          ))}

          <Rect
            x={PAD.left}
            y={bandTop}
            width={INNER_W}
            height={Math.max(1, bandBottom - bandTop)}
            fill={colors.primary}
            opacity={0.1}
          />

          {sorted
            .filter((c) => c.status === "active")
            .map((c, i) => (
              <Circle
                key={`active-${i}`}
                cx={x(c.date)}
                cy={y(c.price)}
                r={4}
                fill={colors.background}
                stroke={colors.textMuted}
                strokeWidth={1.5}
                opacity={0.7}
              />
            ))}

          {soldPoints.length > 1 ? (
            <Path
              d={linePath}
              stroke={colors.primary}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {soldPoints.map((c, i) => (
            <Circle
              key={`sold-${i}`}
              cx={x(c.date)}
              cy={y(c.price)}
              r={5}
              fill={colors.primary}
              stroke={colors.background}
              strokeWidth={2}
            />
          ))}

          {lastSold ? (
            <SvgText
              x={x(lastSold.date)}
              y={y(lastSold.price) - 12}
              fontSize={10}
              fontWeight="700"
              fill={colors.textPrimary}
              textAnchor="middle"
            >
              {formatPrice(lastSold.price)}
            </SvgText>
          ) : null}

          {crosshair ? (
            <>
              <Line
                x1={crosshair.vbX}
                x2={crosshair.vbX}
                y1={PAD.top}
                y2={PAD.top + INNER_H}
                stroke={colors.textSecondary}
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <Circle
                cx={x(crosshair.comp.date)}
                cy={y(crosshair.comp.price)}
                r={7}
                fill="none"
                stroke={colors.textPrimary}
                strokeWidth={1.5}
              />
            </>
          ) : null}

          <SvgText x={PAD.left} y={H - 6} fontSize={9} fill={colors.textMuted} textAnchor="start">
            {formatShortDate(sorted[0].date)}
          </SvgText>
          <SvgText x={W - PAD.right} y={H - 6} fontSize={9} fill={colors.textMuted} textAnchor="end">
            {formatShortDate(sorted[sorted.length - 1].date)}
          </SvgText>
        </Svg>
      </View>

      <View style={styles.legendRow}>
        <LegendDot color={colors.primary} label="Sold" />
        <LegendDot color={colors.textMuted} label="Active listing" outline />
        <LegendSwatch label="Current estimate range" />
      </View>

      <View style={styles.tooltip}>
        {crosshair ? (
          <>
            <Text style={styles.tooltipPrice}>
              {formatPrice(crosshair.comp.price)} · {crosshair.comp.status}
            </Text>
            <Text style={styles.tooltipMeta}>
              {crosshair.comp.source} · {crosshair.comp.date} · {crosshair.comp.condition}
            </Text>
          </>
        ) : (
          <Text style={styles.tooltipHint}>Drag across the chart to inspect any comp</Text>
        )}
      </View>
    </View>
  );
}

function RangeToggle({ range, onChange }: { range: Range; onChange: (r: Range) => void }) {
  return (
    <View style={styles.rangeRow}>
      {RANGES.map((r) => (
        <Pressable
          key={r.key}
          onPress={() => onChange(r.key)}
          style={[styles.rangeButton, range === r.key && styles.rangeButtonActive]}
        >
          <Text style={[styles.rangeButtonText, range === r.key && styles.rangeButtonTextActive]}>
            {r.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function LegendDot({ color, label, outline }: { color: string; label: string; outline?: boolean }) {
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendDot,
          outline
            ? { borderColor: color, borderWidth: 1.5, backgroundColor: "transparent" }
            : { backgroundColor: color },
        ]}
      />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function LegendSwatch({ label }: { label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={styles.legendSwatch} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { color: colors.textPrimary, fontSize: 15, fontWeight: "700" },
  rangeRow: { flexDirection: "row", gap: 4 },
  rangeButton: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  rangeButtonActive: { backgroundColor: colors.surfaceAlt },
  rangeButtonText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  rangeButtonTextActive: { color: colors.primary },
  svgContainer: { width: "100%" },
  emptyText: { color: colors.textMuted, fontSize: 12, paddingVertical: 24, textAlign: "center" },
  legendRow: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendSwatch: { width: 10, height: 10, borderRadius: 2, backgroundColor: colors.primary, opacity: 0.25 },
  legendText: { color: colors.textMuted, fontSize: 11 },
  tooltip: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 44,
    justifyContent: "center",
  },
  tooltipPrice: { color: colors.textPrimary, fontWeight: "700", fontSize: 13 },
  tooltipMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  tooltipHint: { color: colors.textMuted, fontSize: 11, fontStyle: "italic" },
});
