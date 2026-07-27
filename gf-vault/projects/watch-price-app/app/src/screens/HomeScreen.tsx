import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { checkPrice, FreeTierLimitError } from "../lib/api";
import { colors } from "../theme";
import SelectField from "../components/SelectField";
import {
  BRAND_MODELS,
  BRAND_OPTIONS,
  CONDITION_OPTIONS,
  OTHER_BRAND,
  OTHER_MODEL,
  SET_OPTIONS,
} from "../lib/watchCatalog";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [brandSelect, setBrandSelect] = useState("");
  const [brandCustom, setBrandCustom] = useState("");
  const [modelSelect, setModelSelect] = useState("");
  const [modelCustom, setModelCustom] = useState("");
  const [reference, setReference] = useState("");
  const [condition, setCondition] = useState("");
  const [setCompleteness, setSetCompleteness] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const knownModels = BRAND_MODELS[brandSelect];
  const isCustomBrand = brandSelect === OTHER_BRAND;
  const effectiveBrand = isCustomBrand ? brandCustom : brandSelect;
  const effectiveModel = !knownModels || modelSelect === OTHER_MODEL ? modelCustom : modelSelect;

  function handleBrandChange(v: string) {
    setBrandSelect(v);
    setModelSelect("");
    setModelCustom("");
  }

  async function handleCheckPrice() {
    if (!effectiveBrand.trim() || !effectiveModel.trim() || !reference.trim()) {
      setErrorMessage("Brand, model, and reference are required.");
      return;
    }
    setErrorMessage(null);
    setLoading(true);

    const input = {
      brand: effectiveBrand.trim(),
      model: effectiveModel.trim(),
      reference: reference.trim(),
      condition: condition || undefined,
      setCompleteness: setCompleteness || undefined,
      year: year.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const { estimate, cached, mock } = await checkPrice(input);
      navigation.navigate("Result", { input, estimate, cached, mock });
    } catch (err) {
      if (err instanceof FreeTierLimitError) {
        navigation.navigate("Paywall");
      } else {
        setErrorMessage("Something went wrong fetching that estimate. Try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GF VAULT</Text>
        </View>
        <Text style={styles.title}>What's your watch worth?</Text>
        <Text style={styles.subtitle}>
          Tell us as much as you know — the more detail, the more accurate the estimate.
        </Text>

        <View style={styles.card}>
          <SelectField
            label="Brand"
            value={brandSelect}
            onChange={handleBrandChange}
            options={BRAND_OPTIONS}
            placeholder="Select a brand"
          />
          {isCustomBrand ? (
            <Field label="Brand name" value={brandCustom} onChangeText={setBrandCustom} placeholder="e.g. IWC" />
          ) : null}

          {knownModels ? (
            <SelectField
              label="Model"
              value={modelSelect}
              onChange={setModelSelect}
              options={[
                ...knownModels.map((m) => ({ label: m, value: m })),
                { label: "Other model…", value: OTHER_MODEL },
              ]}
              placeholder="Select a model"
            />
          ) : (
            <Field label="Model" value={modelCustom} onChangeText={setModelCustom} placeholder="Submariner" />
          )}
          {knownModels && modelSelect === OTHER_MODEL ? (
            <Field label="Model name" value={modelCustom} onChangeText={setModelCustom} placeholder="e.g. Sea-Dweller" />
          ) : null}

          <Field
            label="Reference number"
            value={reference}
            onChangeText={setReference}
            placeholder="116610"
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <SelectField
                label="Condition"
                value={condition}
                onChange={setCondition}
                options={CONDITION_OPTIONS}
                placeholder="Optional"
              />
            </View>
            <View style={styles.rowItem}>
              <Field
                label="Year"
                value={year}
                onChangeText={setYear}
                placeholder="e.g. 2019"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <SelectField
            label="Box & papers"
            value={setCompleteness}
            onChange={setSetCompleteness}
            options={SET_OPTIONS}
            placeholder="Optional"
          />

          <Field
            label="Other factors (optional)"
            value={notes}
            onChangeText={setNotes}
            placeholder="Service history, aftermarket parts, discontinued dial, box condition..."
            multiline
          />

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCheckPrice}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryText} />
            ) : (
              <Text style={styles.buttonText}>Check Price</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad";
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={[styles.input, props.multiline && styles.inputMultiline]}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="words"
        multiline={props.multiline}
        numberOfLines={props.multiline ? 3 : 1}
        keyboardType={props.keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 24,
    paddingTop: 28,
    paddingBottom: 60,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  badgeText: { color: colors.primary, fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  title: { fontSize: 30, fontWeight: "800", color: colors.textPrimary, marginBottom: 8, lineHeight: 36 },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 30, lineHeight: 21 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: "top", paddingTop: 12 },
  error: { color: colors.danger, marginBottom: 12 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
});
