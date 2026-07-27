import { Platform, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../theme";

export interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function SelectField({ label, value, onChange, options, placeholder }: Props) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={value}
          onValueChange={(v) => onChange(String(v))}
          style={styles.picker}
          dropdownIconColor={colors.textSecondary}
        >
          {placeholder ? <Picker.Item label={placeholder} value="" /> : null}
          {options.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6, fontWeight: "600" },
  pickerWrap: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    justifyContent: "center",
  },
  picker: {
    color: colors.textPrimary,
    backgroundColor: "transparent",
    ...(Platform.OS === "web" ? { height: 48, paddingHorizontal: 10, borderWidth: 0 } : {}),
  },
});
