import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';

const T = {
  bg:      '#F7F5F0',
  surface: '#FFFFFF',
  card:    '#FAFAF7',
  border:  '#E8E4DC',
  ink:     '#1A1814',
  muted:   '#9B9690',
  lime:    '#3DFF8E',
  tag:     '#F0EDE6',
};

const SAMPLE_WARDROBES = [
  { id: '1', name: 'Uni Fits',   count: 14, privacy: 'Private',  colors: ['#FFD166','#FF6B9D','#74C0FC'] },
  { id: '2', name: 'Going Out',  count: 8,  privacy: 'Friends',  colors: ['#B197FC','#63E6BE','#FFD166'] },
  { id: '3', name: 'Winter 24',  count: 22, privacy: 'Private',  colors: ['#74C0FC','#FF6B9D','#B197FC'] },
  { id: '4', name: 'Everyday',   count: 31, privacy: 'Public',   colors: ['#63E6BE','#FFD166','#FF6B9D'] },
];

function StickerFan({ colors }) {
  return (
    <View style={styles.fanContainer}>
      {colors.map((color, i) => (
        <View key={i} style={[
          styles.fanSticker,
          {
            backgroundColor: color,
            transform: [{ rotate: `${(i - 1) * 8}deg` }],
            zIndex: i,
            left: i * 6,
          }
        ]} />
      ))}
    </View>
  );
}

function WardrobeCard({ wardrobe, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <StickerFan colors={wardrobe.colors} />
      <View style={styles.cardBottom}>
        <Text style={styles.cardName}>{wardrobe.name}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardCount}>{wardrobe.count} fits</Text>
          <View style={styles.privacyPill}>
            <Text style={styles.privacyText}>{wardrobe.privacy}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function WardrobeScreen() {
  const [wardrobes, setWardrobes] = useState(SAMPLE_WARDROBES);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={T.surface} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>MyDrobe</Text>
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.iconText}>⊞</Text>
          </TouchableOpacity>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Section label */}
        <Text style={styles.sectionLabel}>MY WARDROBES</Text>

        {/* Grid */}
        <View style={styles.grid}>
          {wardrobes.map(w => (
            <WardrobeCard key={w.id} wardrobe={w} onPress={() => {}} />
          ))}

          {/* New Wardrobe card */}
          <TouchableOpacity style={styles.newCard} activeOpacity={0.7}>
            <Text style={styles.newCardPlus}>+</Text>
            <Text style={styles.newCardLabel}>New Wardrobe</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⊞</Text>
          <Text style={[styles.navLabel, styles.navActive]}>Wardrobe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addFab}>
          <Text style={styles.addFabText}>＋</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>◉</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: T.surface },
  topBar:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.surface },
  wordmark:       { fontSize: 22, fontWeight: '800', color: T.ink, letterSpacing: -0.5 },
  topRight:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn:        { padding: 4 },
  iconText:       { fontSize: 18, color: T.muted },
  avatar:         { width: 32, height: 32, borderRadius: 16, backgroundColor: T.lime, justifyContent: 'center', alignItems: 'center' },
  avatarText:     { fontSize: 13, fontWeight: '700', color: T.ink },
  scroll:         { flex: 1, backgroundColor: T.bg },
  scrollContent:  { padding: 16, paddingBottom: 100 },
  sectionLabel:   { fontSize: 10, fontWeight: '700', color: T.muted, letterSpacing: 1.4, marginBottom: 12, marginLeft: 2 },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:           { width: '47.5%', backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  fanContainer:   { height: 120, backgroundColor: T.card, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  fanSticker:     { position: 'absolute', width: 60, height: 80, borderRadius: 10 },
  cardBottom:     { padding: 12 },
  cardName:       { fontSize: 13, fontWeight: '700', color: T.ink, marginBottom: 6 },
  cardMeta:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardCount:      { fontSize: 11, color: T.muted },
  privacyPill:    { backgroundColor: T.tag, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  privacyText:    { fontSize: 9, fontWeight: '600', color: T.muted },
  newCard:        { width: '47.5%', backgroundColor: T.card, borderRadius: 16, borderWidth: 1.5, borderColor: T.border, borderStyle: 'dashed', height: 160, justifyContent: 'center', alignItems: 'center' },
  newCardPlus:    { fontSize: 28, color: T.muted, marginBottom: 4 },
  newCardLabel:   { fontSize: 12, color: T.muted, fontWeight: '600' },
  bottomNav:      { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: T.border, backgroundColor: T.surface },
  navItem:        { alignItems: 'center', flex: 1 },
  navIcon:        { fontSize: 20, color: T.muted, marginBottom: 2 },
  navLabel:       { fontSize: 10, color: T.muted, fontWeight: '600' },
  navActive:      { color: T.ink },
  addFab:         { width: 56, height: 56, borderRadius: 28, backgroundColor: T.ink, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  addFabText:     { fontSize: 28, color: T.lime, lineHeight: 32 },
});
