import { StyleSheet, View } from "react-native";
import type { Comp } from "../types";
import { useResponsive } from "../hooks/useResponsive";
import ListingCard from "./ListingCard";

interface Props {
  comps: Comp[];
}

export default function ListingsGrid({ comps }: Props) {
  const { isTablet, isDesktop } = useResponsive();
  const columns = isDesktop ? 3 : isTablet ? 2 : 1;
  const basis = columns === 1 ? "100%" : columns === 2 ? "48%" : "31.5%";

  return (
    <View style={styles.grid}>
      {comps.map((comp, i) => (
        <View key={i} style={{ flexBasis: basis, flexGrow: 1 }}>
          <ListingCard comp={comp} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
});
