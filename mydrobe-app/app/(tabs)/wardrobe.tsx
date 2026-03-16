import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableOpacity,
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

const WIDTH = Dimensions.get("window").width;
const CARD_SIZE = (WIDTH - 48) / 2;

export default function WardrobeDetailScreen() {
  const { name } = useLocalSearchParams();
  const [outfits, setOutfits] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadOutfits();
    }, [name])
  );

  const loadOutfits = async () => {
    try {
      const stored = await AsyncStorage.getItem("outfits");
      if (stored) {
        const all = JSON.parse(stored);
        const wardrobeName = Array.isArray(name) ? name[0] : name;
        console.log("Looking for wardrobe:", wardrobeName);
        console.log("All outfits:", all.map((o: any) => ({ name: o.name, wardrobe: o.wardrobe })));
        
        const filtered = all.filter((o: any) => o.wardrobe === wardrobeName);
        console.log("Filtered result:", filtered.length, "outfits");
        setOutfits(filtered);
      }
    } catch (e) {
      console.log("Could not load outfits");
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
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{outfits.length} fits</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {outfits.length === 0 ? (
          // Empty state
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👗</Text>
            <Text style={styles.emptyTitle}>No outfits yet</Text>
            <Text style={styles.emptySub}>Tap + to clip and save your first outfit to this wardrobe.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push("/(tabs)/add")}>
              <Text style={styles.emptyBtnText}>+ Add Outfit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Outfit grid
          <View style={styles.grid}>
            {outfits.map((outfit: any) => (
              <View key={outfit.id} style={styles.card}>
                <View style={styles.photoWrap}>
                  <Image
                    source={{ uri: outfit.photo }}
                    style={styles.photo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardName} numberOfLines={1}>{outfit.name}</Text>
                  <Text style={styles.cardDate}>
                    {new Date(outfit.savedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </Text>
                </View>
              </View>
            ))}

            {/* Add more */}
            <TouchableOpacity style={styles.addCard} onPress={() => router.push("/(tabs)/add")}>
              <Text style={styles.addPlus}>+</Text>
              <Text style={styles.addLabel}>Add Outfit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: T.bg },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn:      { fontSize: 14, color: T.ink, fontWeight: "600" },
  headerTitle:  { fontSize: 16, fontWeight: "800", color: T.ink, letterSpacing: -0.3 },
  countBadge:   { backgroundColor: T.tag, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  countText:    { fontSize: 11, fontWeight: "700", color: T.muted },
  content:      { padding: 16, paddingBottom: 60 },
  emptyState:   { alignItems: "center", paddingTop: 80 },
  emptyEmoji:   { fontSize: 48, marginBottom: 16 },
  emptyTitle:   { fontSize: 20, fontWeight: "800", color: T.ink, marginBottom: 8 },
  emptySub:     { fontSize: 14, color: T.muted, textAlign: "center", lineHeight: 20, marginBottom: 28, paddingHorizontal: 20 },
  emptyBtn:     { backgroundColor: T.ink, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  emptyBtnText: { color: T.lime, fontSize: 14, fontWeight: "800" },
  grid:         { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  card:         { width: CARD_SIZE, backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: "hidden" },
  photoWrap:    { height: CARD_SIZE * 1.2, backgroundColor: T.tag, justifyContent: "center", alignItems: "center" },
  photo:        { width: "100%", height: "100%" },
  cardBody:     { padding: 10 },
  cardName:     { fontSize: 13, fontWeight: "700", color: T.ink, marginBottom: 3 },
  cardDate:     { fontSize: 11, color: T.muted },
  addCard:      { width: CARD_SIZE, height: CARD_SIZE * 1.4, backgroundColor: T.bg, borderRadius: 16, borderWidth: 1.5, borderColor: T.border, borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
  addPlus:      { fontSize: 28, color: T.muted, marginBottom: 6 },
  addLabel:     { fontSize: 12, fontWeight: "600", color: T.muted },
});