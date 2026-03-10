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
  { id: '1', name: 'Uni Fits',  count: 14, privacy: 'Private', colors: ['#FFD166','#FF6B9D','#74C0FC'] },
  { id: '2', name: 'Going Out', count: 8,  privacy: 'Friends', colors: ['#B197FC','#63E6BE','#FFD166'] },
  { id: '3', name: 'Winter 24', count: 22, privacy: 'Private', colors: ['#74C0FC','#FF6B9D','#B197FC'] },
  { id: '4', name: 'Everyday',  count: 31, privacy: 'Public',  colors: ['#63E6BE','#FFD166','#FF6B9D'] },
];

function StickerFan({ colors }) {
  return (
    <View style={styles.fanContainer}>
      {colors.map((color, i) => (
        <View key={i} style={[styles.fanSticker, { backgroundColor: color, transform: [{ rotate: `${(i - 1) * 8}deg` }], zIndex: i, left: i * 6 }]} />
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

export default function HomeScreen() {
  const [wardrobes] = useState(SAMPLE_WARDROBES);
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <Text style={styles.wordmark}>MyDrobe</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>MY WARDROBES</Text>
        <View style={styles.grid}>
          {wardrobes.map(w => (
            <WardrobeCard key={w.id} wardrobe={w} onPress={() => {}} />
          ))}
          <TouchableOpacity style={styles.newCard} activeOpacity={0.7}>
            <Text style={styles.newCardPlus}>+</Text>
            <Text style={styles.newCardLabel}>New Wardrobe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  safe:          { flex: 1, backgroundColor: '#FFFFFF' },
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8E4DC', backgroundColor: '#FFFFFF' },
  wordmark:      { fontSize: 22, fontWeight: '800', color: '#1A1814', letterSpacing: -0.5 },
  avatar:        { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3DFF8E', justifyContent: 'center', alignItems: 'center' },
  avatarText:    { fontSize: 13, fontWeight: '700', color: '#1A1814' },
  scroll:        { flex: 1, backgroundColor: '#F7F5F0' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionLabel:  { fontSize: 10, fontWeight: '700', color: '#9B9690', letterSpacing: 1.4, marginBottom: 12 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:          { width: '47.5%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E8E4DC', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  fanContainer:  { height: 120, backgroundColor: '#FAFAF7', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  fanSticker:    { position: 'absolute', width: 60, height: 80, borderRadius: 10 },
  cardBottom:    { padding: 12 },
  cardName:      { fontSize: 13, fontWeight: '700', color: '#1A1814', marginBottom: 6 },
  cardMeta:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardCount:     { fontSize: 11, color: '#9B9690' },
  privacyPill:   { backgroundColor: '#F0EDE6', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  privacyText:   { fontSize: 9, fontWeight: '600', color: '#9B9690' },
  newCard:       { width: '47.5%', backgroundColor: '#FAFAF7', borderRadius: 16, borderWidth: 1.5, borderColor: '#E8E4DC', borderStyle: 'dashed', height: 160, justifyContent: 'center', alignItems: 'center' },
  newCardPlus:   { fontSize: 28, color: '#9B9690', marginBottom: 4 },
  newCardLabel:  { fontSize: 12, color: '#9B9690', fontWeight: '600' },
  bottomNav:     { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#E8E4DC', backgroundColor: '#FFFFFF' },
  navItem:       { alignItems: 'center', flex: 1 },
  navIcon:       { fontSize: 20, color: '#9B9690', marginBottom: 2 },
  navLabel:      { fontSize: 10, color: '#9B9690', fontWeight: '600' },
  navActive:     { color: '#1A1814' },
  addFab:        { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1A1814', justifyContent: 'center', alignItems: 'center' },
  addFabText:    { fontSize: 28, color: '#3DFF8E', lineHeight: 32 },
});
