import { CormorantGaramond_400Regular_Italic, CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond";
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from "@expo-google-fonts/syne";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const T = { bg: "#F7F5F0", surface: "#FFFFFF", card: "#FAFAF8", border: "#E8E4DC", ink: "#1A1814", muted: "#9B9690", lime: "#3DFF8E", tag: "#F0EDE6" };

const COLOR_PALETTES = [
  // Neutral Whites & Creams
  { name: "Minimalist", colors: ["#FFFFFF", "#D3D3D3", "#000000"] },
  { name: "Cream", colors: ["#FFFDD0", "#F5F5DC", "#FAEBD7"] },
  { name: "Soft Neutrals", colors: ["#E8D4C4", "#D4C4B4", "#C0B0A0"] },
  
  // Warm Neutrals (Beige/Taupe)
  { name: "Neutral Beige", colors: ["#D4C5B9", "#C4B5A0", "#A89968"] },
  { name: "Warm Taupe", colors: ["#B38B6D", "#A0826D", "#8B7355"] },
  { name: "Mocha", colors: ["#A89968", "#8B7355", "#704214"] },
  
  // Browns
  { name: "Classic Brown", colors: ["#8B4513", "#704214", "#5C4033"] },
  
  // Greys & Charcoals
  { name: "Cool Grey", colors: ["#A9A9A9", "#808080", "#404040"] },
  { name: "Charcoal", colors: ["#36454F", "#2F4F4F", "#1C1C1C"] },
  
  // Earth Tones (Fall/Autumn)
  { name: "Fall", colors: ["#CD5C5C", "#CD853F", "#808000"] },
  { name: "Cottagecore", colors: ["#F5F5DC", "#9DC183", "#CD5C5C"] },
  
  // Pastel/Soft (Spring)
  { name: "Spring", colors: ["#F5E6E8", "#C8E6C9", "#FFF9C4"] },
  
  // Warm Brights (Summer)
  { name: "Summer", colors: ["#FF7F50", "#F4A460", "#FFB347"] },
  
  // Cool Tones (Winter/Blue)
  { name: "Winter", colors: ["#708090", "#B0E0E6", "#2F4F4F"] },
  
  // Romance/Burgundy
  { name: "Date Night", colors: ["#800020", "#F08080", "#F5DEB3"] },
  { name: "Dark Academia", colors: ["#800020", "#355E3B", "#36454F"] },
  
  // Urban/Streetwear
  { name: "Streetwear", colors: ["#000000", "#404040", "#696969"] },
  
  // Bright & Vibrant (last)
  { name: "Going Out", colors: ["#663399", "#FF1493", "#E6B800"] },
  { name: "Maximalist", colors: ["#50C878", "#0047AB", "#9932CC"] },
  { name: "Y2K", colors: ["#FF1493", "#87CEEB", "#A8E6CF"] },
];

const DEFAULT_WARDROBES = [
  { id: "1", name: "Uni Fits",  count: 0, privacy: "Private", colors: ["#D4C5B9", "#C4B5A0", "#A89968"] },
  { id: "2", name: "Going Out", count: 0, privacy: "Friends", colors: ["#663399", "#FF1493", "#E6B800"] },
  { id: "3", name: "Winter 24", count: 0, privacy: "Private", colors: ["#708090", "#B0E0E6", "#2F4F4F"] },
  { id: "4", name: "Everyday",  count: 0, privacy: "Public",  colors: ["#F5F5DC", "#9DC183", "#CD5C5C"] },
];

function StickerFan({ colors }) {
  const angles = [-12, 0, 12];
  return (
    <View style={styles.fanWrap}>
      {colors.map((color, i) => (
        <View key={i} style={[styles.sticker, {
          backgroundColor: color,
          transform: [{ rotate: angles[i] + "deg" }],
          zIndex: i + 1,
        }]} />
      ))}
    </View>
  );
}

function WardrobeCard({ w, onDelete }) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.82} 
      onPress={() => router.push({ pathname: "/(tabs)/wardrobe", params: { name: w.name, id: w.id } })}
      onLongPress={() => {
        Alert.alert(
          `Delete "${w.name}"?`,
          "This will remove the wardrobe but keep your saved outfits.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => onDelete(w.id), style: "destructive" }
          ]
        );
      }}
    >
      <View style={styles.fanArea}>
        <StickerFan colors={w.colors} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{w.name}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardCount}>{w.count} fits</Text>
          <View style={[styles.pill, w.privacy === "Public" && styles.pillPublic]}>
            <Text style={[styles.pillText, w.privacy === "Public" && styles.pillTextPublic]}>{w.privacy}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [wardrobes, setWardrobes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newWardrobeName, setNewWardrobeName] = useState("");
  const [selectedColorPalette, setSelectedColorPalette] = useState(COLOR_PALETTES[0]);

  const [fontsLoaded] = useFonts({
    Syne_800ExtraBold,
    Syne_700Bold,
    Syne_600SemiBold,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
  });

  useFocusEffect(
    useCallback(() => {
      loadWardrobes();
    }, [])
  );

  const loadWardrobes = async () => {
    try {
      const stored = await AsyncStorage.getItem("wardrobes");
      if (stored) {
        const saved = JSON.parse(stored);
        
        // Load outfit counts
        const outfitsStored = await AsyncStorage.getItem("outfits");
        if (outfitsStored) {
          const all = JSON.parse(outfitsStored);
          const updated = saved.map(w => ({
            ...w,
            count: all.filter((o: any) => o.wardrobe === w.name).length
          }));
          setWardrobes(updated);
        } else {
          setWardrobes(saved);
        }
      } else {
        // Only initialize defaults if wardrobes don't exist
        await AsyncStorage.setItem("wardrobes", JSON.stringify(DEFAULT_WARDROBES));
        setWardrobes(DEFAULT_WARDROBES);
      }
    } catch (e) {
      console.log("Could not load wardrobes");
    }
  };

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("onboardingSeen");
        if (!seen) {
          router.replace("/(tabs)/onboarding");
        }
      } catch (e) {
        console.log("Could not check onboarding");
      }
    };
    checkOnboarding();
  }, []);

  const createWardrobe = async () => {
    if (!newWardrobeName.trim()) {
      Alert.alert("Name required", "Give your wardrobe a name");
      return;
    }

    const newWardrobe = {
      id: Date.now().toString(),
      name: newWardrobeName.trim(),
      count: 0,
      privacy: "Private",
      colors: selectedColorPalette.colors,
    };

    const updated = [...wardrobes, newWardrobe];
    setWardrobes(updated);
    await AsyncStorage.setItem("wardrobes", JSON.stringify(updated));
    setNewWardrobeName("");
    setSelectedColorPalette(COLOR_PALETTES[0]);
    setShowModal(false);
    Alert.alert("Success! 🎉", `"${newWardrobe.name}" wardrobe created`);
  };

  const deleteWardrobe = async (id: string) => {
    const updated = wardrobes.filter(w => w.id !== id);
    setWardrobes(updated);
    await AsyncStorage.setItem("wardrobes", JSON.stringify(updated));
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: T.bg }}>
        <ActivityIndicator color={T.lime} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={T.surface} />

      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.wordmark}>MyDrobe</Text>
            <View style={{ backgroundColor: "#3DFF8E", borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontFamily: "Syne_700Bold", fontSize: 10, color: "#1A1814", letterSpacing: 0.5 }}>PHASE 1</Text>
            </View>
          </View>
          <Text style={styles.tagline}>your wardrobe, made seen.</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>M</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>MY WARDROBES</Text>
          <View style={styles.limeBadge}>
            <Text style={styles.limeBadgeText}>{wardrobes.length} total</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {wardrobes.map(w => <WardrobeCard key={w.id} w={w} onDelete={deleteWardrobe} />)}
          <TouchableOpacity style={styles.newCard} activeOpacity={0.7} onPress={() => setShowModal(true)}>
            <Text style={styles.newPlus}>+</Text>
            <Text style={styles.newLabel}>New Wardrobe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>Start your streak</Text>
              <Text style={styles.streakSub}>Add your first outfit today</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.streakBtn}>
            <Text style={styles.streakBtnText}>Add fit</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Wardrobe</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Wardrobe name..."
              placeholderTextColor={T.muted}
              value={newWardrobeName}
              onChangeText={setNewWardrobeName}
              autoFocus
            />

            <Text style={styles.colorLabel}>Choose your palette</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorScroll}
            >
              {COLOR_PALETTES.map((palette) => (
                <TouchableOpacity
                  key={palette.name}
                  style={[
                    styles.paletteOption,
                    selectedColorPalette.name === palette.name && styles.paletteOptionActive
                  ]}
                  onPress={() => setSelectedColorPalette(palette)}
                >
                  <View style={styles.palettePreview}>
                    <StickerFan colors={palette.colors} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => {
                setShowModal(false);
                setNewWardrobeName("");
                setSelectedColorPalette(COLOR_PALETTES[0]);
              }}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnCreate} onPress={createWardrobe}>
                <Text style={styles.modalBtnCreateText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 22, paddingTop: 18, paddingBottom: 14, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E8E4DC" },
  wordmark: { fontFamily: "Syne_800ExtraBold", fontSize: 28, color: "#1A1814", letterSpacing: -1 },
  tagline: { fontFamily: "CormorantGaramond_400Regular_Italic", fontSize: 13, color: "#9B9690", marginTop: 1 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#3DFF8E", justifyContent: "center", alignItems: "center" },
  avatarLetter: { fontFamily: "Syne_800ExtraBold", fontSize: 15, color: "#1A1814" },
  scroll: { flex: 1, backgroundColor: "#F7F5F0" },
  scrollInner: { padding: 18, paddingBottom: 110 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionLabel: { fontFamily: "Syne_700Bold", fontSize: 10, color: "#9B9690", letterSpacing: 1.6 },
  limeBadge: { backgroundColor: "#3DFF8E30", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  limeBadgeText: { fontFamily: "Syne_600SemiBold", fontSize: 10, color: "#00A854" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 14, marginBottom: 20 },
  card: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E8E4DC", overflow: "hidden", shadowColor: "#1A1814", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  fanArea: { height: 140, backgroundColor: "#FAFAF8", justifyContent: "center", alignItems: "center" },
  fanWrap: { width: 100, height: 110, position: "relative", justifyContent: "center", alignItems: "center" },
  sticker: { position: "absolute", width: 68, height: 90, borderRadius: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 },
  cardBody: { padding: 13 },
  cardName: { fontFamily: "Syne_700Bold", fontSize: 14, color: "#1A1814", marginBottom: 7, letterSpacing: -0.2 },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardCount: { fontFamily: "Syne_600SemiBold", fontSize: 11, color: "#9B9690" },
  pill: { backgroundColor: "#F0EDE6", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3 },
  pillPublic: { backgroundColor: "#3DFF8E30" },
  pillText: { fontFamily: "Syne_600SemiBold", fontSize: 9, color: "#9B9690", letterSpacing: 0.3 },
  pillTextPublic: { color: "#00A854" },
  newCard: { width: "48%", height: 195, backgroundColor: "#FAFAF8", borderRadius: 18, borderWidth: 1.5, borderColor: "#E8E4DC", borderStyle: "dashed", justifyContent: "center", alignItems: "center" },
  newPlus: { fontSize: 30, color: "#9B9690", marginBottom: 6, fontWeight: "300" },
  newLabel: { fontFamily: "Syne_600SemiBold", fontSize: 12, color: "#9B9690", letterSpacing: 0.2 },
  streakCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E8E4DC", padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", shadowColor: "#1A1814", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  streakLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  streakEmoji: { fontSize: 28 },
  streakTitle: { fontFamily: "Syne_700Bold", fontSize: 13, color: "#1A1814", marginBottom: 2 },
  streakSub: { fontFamily: "CormorantGaramond_400Regular_Italic", fontSize: 13, color: "#9B9690" },
  streakBtn: { backgroundColor: "#1A1814", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  streakBtnText: { fontFamily: "Syne_700Bold", fontSize: 11, color: "#3DFF8E", letterSpacing: 0.3 },
  
  // Modal
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end", zIndex: 1000 },
  modal: { backgroundColor: T.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: "90%" },
  modalTitle: { fontFamily: "Syne_800ExtraBold", fontSize: 20, color: T.ink, marginBottom: 16, letterSpacing: -0.3 },
  modalInput: { backgroundColor: T.tag, borderRadius: 12, borderWidth: 1, borderColor: T.border, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: T.ink, marginBottom: 20 },
  colorLabel: { fontFamily: "Syne_700Bold", fontSize: 12, color: T.ink, marginBottom: 20, letterSpacing: 0.2 },
  colorScroll: { paddingHorizontal: 0, paddingBottom: 24, paddingTop: 8 },
  paletteOption: { alignItems: "center", marginRight: 16, paddingHorizontal: 8, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: "transparent" },
  paletteOptionActive: { borderColor: T.ink, backgroundColor: T.tag },
  palettePreview: { width: 70, height: 70, borderRadius: 8, justifyContent: "center", alignItems: "center", backgroundColor: T.tag },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 24 },
  modalBtnCancel: { flex: 1, backgroundColor: T.tag, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalBtnCancelText: { fontFamily: "Syne_700Bold", fontSize: 14, color: T.muted },
  modalBtnCreate: { flex: 1, backgroundColor: T.ink, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalBtnCreateText: { fontFamily: "Syne_700Bold", fontSize: 14, color: T.lime },
});