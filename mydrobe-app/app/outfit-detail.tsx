import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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

export default function OutfitDetailScreen() {
  const { outfitId, name, description, wardrobe, photo, savedAt } = useLocalSearchParams();

  const formattedDate = savedAt ? new Date(savedAt as string).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "";

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outfit</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Full-size outfit image */}
        {photo ? (
          <View style={styles.photoWrap}>
            <Image 
              source={{ uri: photo as string }} 
              style={styles.photo} 
              resizeMode="contain" 
            />
          </View>
        ) : null}

        {/* Outfit info */}
        <View style={styles.infoCard}>
          <Text style={styles.outfitName}>{name}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Wardrobe</Text>
              <Text style={styles.metaValue}>{wardrobe}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Saved</Text>
              <Text style={styles.metaValue}>{formattedDate}</Text>
            </View>
          </View>

          {description ? (
            <>
              <View style={styles.divider} />
              <View>
                <Text style={styles.descriptionLabel}>Notes</Text>
                <Text style={styles.descriptionText}>{description}</Text>
              </View>
            </>
          ) : null}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: T.bg },
  header:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn:           { fontSize: 14, color: T.ink, fontWeight: "600" },
  headerTitle:       { fontSize: 16, fontWeight: "800", color: T.ink, letterSpacing: -0.3 },
  content:           { padding: 16, paddingBottom: 60 },
  photoWrap:         { backgroundColor: T.surface, borderRadius: 20, overflow: "hidden", marginBottom: 24, borderWidth: 1, borderColor: T.border, padding: 20 },
  photo:             { width: "100%", height: 500 },
  infoCard:          { backgroundColor: T.surface, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 20, marginBottom: 20 },
  outfitName:        { fontSize: 20, fontWeight: "800", color: T.ink, marginBottom: 16, letterSpacing: -0.3 },
  metaRow:           { flexDirection: "row", alignItems: "center" },
  metaItem:          { flex: 1 },
  metaLabel:         { fontSize: 10, fontWeight: "700", color: T.muted, letterSpacing: 0.8, marginBottom: 4 },
  metaValue:         { fontSize: 14, fontWeight: "700", color: T.ink },
  metaDivider:       { width: 1, height: 40, backgroundColor: T.border },
  divider:           { height: 1, backgroundColor: T.border, marginVertical: 16 },
  descriptionLabel:  { fontSize: 10, fontWeight: "700", color: T.muted, letterSpacing: 0.8, marginBottom: 8 },
  descriptionText:   { fontSize: 14, color: T.ink, lineHeight: 20 },
});