import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types";
import { ensureSession, isSupabaseConfigured, supabase } from "../lib/supabase";
import { colors } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "SellToUs">;

const MAX_PHOTOS = 4;

export default function SellToUsScreen({ route, navigation }: Props) {
  const { input } = route.params;
  const [condition, setCondition] = useState(input.condition ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function pickPhoto() {
    if (photos.length >= MAX_PHOTOS) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrorMessage("Allow photo library access to attach watch photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Name and email are required so we can follow up.");
      return;
    }
    setErrorMessage(null);
    setSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        // No backend yet — simulate the round trip so the flow is testable.
        await new Promise((resolve) => setTimeout(resolve, 600));
        setSubmitted(true);
        return;
      }

      const session = await ensureSession();
      if (!session) throw new Error("No session");

      const photoPaths: string[] = [];
      for (const uri of photos) {
        const path = `${session.user.id}/${Date.now()}-${photoPaths.length}.jpg`;
        const response = await fetch(uri);
        const blob = await response.blob();
        const { error: uploadError } = await supabase.storage
          .from("lead-photos")
          .upload(path, blob, { contentType: "image/jpeg" });
        if (uploadError) throw uploadError;
        photoPaths.push(path);
      }

      const { error } = await supabase.from("leads").insert({
        user_id: session.user.id,
        brand: input.brand,
        model: input.model,
        reference: input.reference,
        condition: condition.trim() || null,
        photos: photoPaths,
        contact_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim() || null,
        notes: notes.trim() || null,
      });
      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <View style={styles.confirmContainer}>
        <Text style={styles.confirmTitle}>Thanks — we've got it.</Text>
        <Text style={styles.confirmBody}>
          A GF Vault buyer will review your {input.brand} {input.model} and reach out at{" "}
          {email} within 1-2 business days.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sell to GF Vault</Text>
        <Text style={styles.subtitle}>
          {input.brand} {input.model} · Ref. {input.reference}
        </Text>

        <Field label="Condition" value={condition} onChangeText={setCondition} placeholder="Excellent" />

        <Text style={styles.label}>Photos ({photos.length}/{MAX_PHOTOS})</Text>
        <View style={styles.photoRow}>
          {photos.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.photoThumb} />
          ))}
          {photos.length < MAX_PHOTOS && (
            <TouchableOpacity style={styles.photoAdd} onPress={pickPhoto}>
              <Text style={styles.photoAddText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <Field label="Your name" value={name} onChangeText={setName} placeholder="Jane Doe" />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="jane@example.com"
        />
        <Field label="Phone (optional)" value={phone} onChangeText={setPhone} placeholder="" />
        <Field
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Box, papers, service history..."
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 60,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  title: { fontSize: 24, fontWeight: "800", color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
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
  photoRow: { flexDirection: "row", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  photoThumb: { width: 64, height: 64, borderRadius: 8 },
  photoAdd: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddText: { color: colors.textMuted, fontSize: 24 },
  error: { color: colors.danger, marginBottom: 12 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  confirmContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  confirmTitle: { fontSize: 24, fontWeight: "800", color: colors.textPrimary, marginBottom: 12 },
  confirmBody: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 30 },
});
