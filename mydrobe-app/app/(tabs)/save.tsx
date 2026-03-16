import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const T = {
  bg:      "#F7F5F0",
  surface: "#FFFFFF",
  border:  "#E8E4DC",
  ink:     "#1A1814",
  muted:   "#9B9690",
  lime:    "#3DFF8E",
  tag:     "#F0EDE6",
};

const DEFAULT_WARDROBES = ["Uni Fits", "Going Out", "Winter 24", "Everyday"];

export default function SaveOutfitScreen() {
  const { photo } = useLocalSearchParams();
  const [outfitName, setOutfitName] = useState("");
  const [selectedWardrobe, setSelectedWardrobe] = useState("Going Out");
  const [wardrobes, setWardrobes] = useState(DEFAULT_WARDROBES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const clearData = async () => {
      await AsyncStorage.removeItem("outfits");
      console.log("CLEARED ALL OUTFITS");
    };
    clearData();
  }, []);

  useEffect(() => {
    loadWardrobes();
  }, []);

  const loadWardrobes = async () => {
    try {
      const stored = await AsyncStorage.getItem("wardrobes");
      if (stored) {
        const parsed = JSON.parse(stored);
        setWardrobes(parsed.map((w: any) => w.name));
      }
    } catch (e) {
      console.log("Could not load wardrobes");
    }
  };

  const saveOutfit = async () => {
    if (!outfitName.trim()) {
      Alert.alert("Name your outfit", "Give this outfit a name before saving.");
      return;
    }

    setSaving(true);

    try {
      const outfit = {
        id: Date.now().toString(),
        name: outfitName.trim(),
        wardrobe: selectedWardrobe,
        photo: photo,
        savedAt: new Date().toISOString(),
      };

      console.log("SAVING OUTFIT TO WARDROBE:", selectedWardrobe);

      // Load existing outfits
      const existing = await AsyncStorage.getItem("outfits");
      const outfits = existing ? JSON.parse(existing) : [];
      outfits.push(outfit);
      await AsyncStorage.setItem("outfits", JSON.stringify(outfits));

      Alert.alert(
        "Saved! 🎉",
        `"${outfitName}" saved to ${selectedWardrobe}`,
        [{ text: "Back to Wardrobe", onPress: () => router.push("/(tabs)/") }]
      );
    } catch (e) {
      Alert.alert("Error", "Could not save outfit. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Save Outfit</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Photo preview */}
        {photo ? (
          <View style={styles.photoWrap}>
            <Image source={{ uri: photo as string }} style={styles.photo} resizeMode="contain" />
          </View>
        ) : null}

        {/* Outfit name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OUTFIT NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Library day, Friday night..."
            placeholderTextColor={T.muted}
            value={outfitName}
            onChangeText={setOutfitName}
            autoFocus
          />
        </View>

        {/* Pick wardrobe */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SAVE TO WARDROBE</Text>
          <View style={styles.wardrobeGrid}>
            {wardrobes.map((w) => (
              <TouchableOpacity
                key={w}
                style={[styles.wardrobeChip, selectedWardrobe === w && styles.wardrobeChipActive]}
                onPress={() => setSelectedWardrobe(w)}>
                <Text style={[styles.wardrobeChipText, selectedWardrobe === w && styles.wardrobeChipTextActive]}>
                  {w}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={saveOutfit}
          disabled={saving}
          activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save to Wardrobe →"}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:                   { flex: 1, backgroundColor: T.bg },
  header:                 { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn:                { fontSize: 14, color: T.ink, fontWeight: "600" },
  headerTitle:            { fontSize: 16, fontWeight: "800", color: T.ink, letterSpacing: -0.3 },
  content:                { padding: 20, paddingBottom: 60 },
  photoWrap:              { backgroundColor: T.surface, borderRadius: 20, overflow: "hidden", marginBottom: 24, borderWidth: 1, borderColor: T.border },
  photo:                  { width: "100%", height: 340 },
  section:                { marginBottom: 24 },
  sectionLabel:           { fontSize: 10, fontWeight: "700", color: T.muted, letterSpacing: 1.6, marginBottom: 10 },
  input:                  { backgroundColor: T.surface, borderRadius: 14, borderWidth: 1, borderColor: T.border, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: T.ink },
  wardrobeGrid:           { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  wardrobeChip:           { backgroundColor: T.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: T.border },
  wardrobeChipActive:     { backgroundColor: T.ink, borderColor: T.ink },
  wardrobeChipText:       { fontSize: 13, fontWeight: "600", color: T.ink },
  wardrobeChipTextActive: { color: T.lime },
  saveBtn:                { backgroundColor: T.ink, borderRadius: 16, padding: 20, alignItems: "center", marginTop: 10 },
  saveBtnDisabled:        { opacity: 0.5 },
  saveBtnText:            { color: T.lime, fontSize: 16, fontWeight: "800" },
});