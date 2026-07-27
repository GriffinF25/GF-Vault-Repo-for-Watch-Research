import { useState } from "react";
import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import type { Comp } from "../types";
import { colors } from "../theme";

interface Props {
  comp: Comp;
}

export default function ListingCard({ comp }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const isSold = comp.status === "sold";
  const hasImage = Boolean(comp.image_url) && !imageFailed;
  const hasLink = Boolean(comp.listing_url);

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {hasImage ? (
          <Image
            source={{ uri: comp.image_url }}
            style={styles.image}
            onError={() => setImageFailed(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No photo available</Text>
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: isSold ? colors.primary : colors.surfaceAlt }]}>
          <Text style={[styles.statusBadgeText, { color: isSold ? colors.primaryText : colors.textSecondary }]}>
            {comp.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${comp.price.toLocaleString()}</Text>
          <Text style={styles.date}>{comp.date}</Text>
        </View>
        <Text style={styles.source} numberOfLines={2}>
          {comp.source}
        </Text>
        <Text style={styles.condition}>{comp.condition}</Text>
        {comp.notes ? (
          <Text style={styles.notes} numberOfLines={4}>
            {comp.notes}
          </Text>
        ) : null}

        {hasLink ? (
          <Pressable onPress={() => Linking.openURL(comp.listing_url!)} style={styles.linkRow}>
            <Text style={styles.linkText}>View listing ↗</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const IMAGE_HEIGHT = 160;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    flexGrow: 1,
    flexBasis: "100%",
  },
  imageWrap: { height: IMAGE_HEIGHT, backgroundColor: colors.surfaceAlt, position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  imagePlaceholderText: { color: colors.textMuted, fontSize: 12 },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  body: { padding: 12 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  price: { color: colors.textPrimary, fontSize: 17, fontWeight: "800" },
  date: { color: colors.textMuted, fontSize: 11 },
  source: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", marginTop: 4 },
  condition: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  notes: { color: colors.textSecondary, fontSize: 12, marginTop: 6, lineHeight: 17 },
  linkRow: { marginTop: 10 },
  linkText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
});
