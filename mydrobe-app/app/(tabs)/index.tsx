import { CormorantGaramond_400Regular_Italic, CormorantGaramond_600SemiBold } from "@expo-google-fonts/cormorant-garamond";
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from "@expo-google-fonts/syne";
import React, { useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const T = { bg: "#F7F5F0", surface: "#FFFFFF", card: "#FAFAF8", border: "#E8E4DC", ink: "#1A1814", muted: "#9B9690", lime: "#3DFF8E", tag: "#F0EDE6" };

const WARDROBES = [
  { id: "1", name: "Uni Fits",  count: 14, privacy: "Private", colors: ["#4f4d49","#696256","#918978"] },
  { id: "2", name: "Going Out", count: 8,  privacy: "Friends", colors: ["#1A1814","#2E2B26","#444038"] },
  { id: "3", name: "Winter 24", count: 22, privacy: "Private", colors: ["#352517","#4d3b18","#685e4b"] },
  { id: "4", name: "Everyday",  count: 31, privacy: "Public",  colors: ["#3c2c19","#645638","#aaa69e"] },
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

function WardrobeCard({ w }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.82}>
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
  const [wardrobes] = useState(WARDROBES);

  const [fontsLoaded] = useFonts({
    Syne_800ExtraBold,
    Syne_700Bold,
    Syne_600SemiBold,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: T.bg }}>
        <ActivityIndicator color={T.lime} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.surface} />

      {/* Header */}
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

      {/* Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>

        {/* Section header */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>MY WARDROBES</Text>
          <View style={styles.limeBadge}>
            <Text style={styles.limeBadgeText}>{WARDROBES.length} total</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {wardrobes.map(w => <WardrobeCard key={w.id} w={w} />)}
          <TouchableOpacity style={styles.newCard} activeOpacity={0.7}>
            <Text style={styles.newPlus}>+</Text>
            <Text style={styles.newLabel}>New Wardrobe</Text>
          </TouchableOpacity>
        </View>

        {/* Streak nudge */}
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

      {/* Bottom Nav */}
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIconActive}>▦</Text>
          <Text style={styles.navLabelActive}>Wardrobe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
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
  nav: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingTop: 12, paddingBottom: Platform.OS === "ios" ? 28 : 16, paddingHorizontal: 24, borderTopWidth: 1, borderTopColor: "#E8E4DC", backgroundColor: "#FFFFFF" },
  navBtn: { alignItems: "center", flex: 1 },
  navIcon: { fontSize: 22, color: "#9B9690", marginBottom: 3 },
  navIconActive: { fontSize: 22, color: "#1A1814", marginBottom: 3 },
  navLabel: { fontFamily: "Syne_600SemiBold", fontSize: 10, color: "#9B9690", letterSpacing: 0.3 },
  navLabelActive: { fontFamily: "Syne_700Bold", fontSize: 10, color: "#1A1814", letterSpacing: 0.3 },
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#1A1814", justifyContent: "center", alignItems: "center", shadowColor: "#1A1814", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8, marginBottom: 4 },
  fabText: { fontSize: 32, color: "#3DFF8E", fontWeight: "300", lineHeight: 36 },
});
