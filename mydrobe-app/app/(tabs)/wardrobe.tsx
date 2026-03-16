import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
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
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [wardrobeOptions, setWardrobeOptions] = useState([]);
  const [selectedWardrobes, setSelectedWardrobes] = useState({});
  const [showMultiWardrobeModal, setShowMultiWardrobeModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadOutfits();
      loadWardrobes();
    }, [name])
  );

  const loadOutfits = async () => {
    try {
      const stored = await AsyncStorage.getItem("outfits");
      if (stored) {
        const all = JSON.parse(stored);
        const wardrobeName = Array.isArray(name) ? name[0] : name;
        
        const filtered = all.filter((o: any) => o.wardrobe === wardrobeName);
        setOutfits(filtered);
      }
    } catch (e) {
      console.log("Could not load outfits");
    }
  };

  const loadWardrobes = async () => {
    try {
      const stored = await AsyncStorage.getItem("wardrobes");
      if (stored) {
        const parsed = JSON.parse(stored);
        setWardrobeOptions(parsed.map((w: any) => w.name));
      }
    } catch (e) {
      console.log("Could not load wardrobes");
    }
  };

  const addOutfitToWardrobes = async () => {
    if (!selectedOutfit || Object.values(selectedWardrobes).every(v => !v)) {
      Alert.alert("Select wardrobes", "Choose at least one wardrobe to add this outfit to");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("outfits");
      const allOutfits = stored ? JSON.parse(stored) : [];
      
      const selectedWardrobeNames = Object.keys(selectedWardrobes).filter(w => selectedWardrobes[w]);
      
      selectedWardrobeNames.forEach(wardrobeName => {
        if (wardrobeName !== selectedOutfit.wardrobe) {
          const outfitCopy = {
            ...selectedOutfit,
            id: Date.now().toString() + Math.random(),
            wardrobe: wardrobeName,
          };
          allOutfits.push(outfitCopy);
        }
      });
      
      await AsyncStorage.setItem("outfits", JSON.stringify(allOutfits));
      
      setShowMultiWardrobeModal(false);
      setSelectedOutfit(null);
      setSelectedWardrobes({});
      
      Alert.alert("Success! 🎉", "Outfit added to selected wardrobes");
      loadOutfits();
    } catch (e) {
      Alert.alert("Error", "Could not add outfit to wardrobes");
    }
  };

  const deleteOutfit = async (outfitId: string) => {
    try {
      const stored = await AsyncStorage.getItem("outfits");
      const allOutfits = stored ? JSON.parse(stored) : [];
      
      const updated = allOutfits.filter((o: any) => o.id !== outfitId);
      await AsyncStorage.setItem("outfits", JSON.stringify(updated));
      
      Alert.alert("Sent to thrift! 🎀", "Outfit removed from your wardrobe");
      loadOutfits();
    } catch (e) {
      Alert.alert("Error", "Could not delete outfit");
    }
  };

  const openMultiWardrobeModal = (outfit) => {
    setSelectedOutfit(outfit);
    const initialSelection = {};
    wardrobeOptions.forEach(w => {
      initialSelection[w] = false;
    });
    setSelectedWardrobes(initialSelection);
    setShowMultiWardrobeModal(true);
  };

  const toggleWardrobeSelection = (wardrobeName) => {
    setSelectedWardrobes(prev => ({
      ...prev,
      [wardrobeName]: !prev[wardrobeName]
    }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

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
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👗</Text>
            <Text style={styles.emptyTitle}>No outfits yet</Text>
            <Text style={styles.emptySub}>Tap + to clip and save your first outfit to this wardrobe.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push("/(tabs)/add")}>
              <Text style={styles.emptyBtnText}>+ Add Outfit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {outfits.map((outfit: any) => (
              <TouchableOpacity 
                key={outfit.id} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: "/outfit-detail",
                  params: {
                    outfitId: outfit.id,
                    name: outfit.name,
                    description: outfit.description,
                    wardrobe: outfit.wardrobe,
                    photo: outfit.photo,
                    savedAt: outfit.savedAt
                  }
                })}
                onLongPress={() => {
                  Alert.alert(
                    "What's next?",
                    "",
                    [
                      { text: "add to other wardrobes", onPress: () => openMultiWardrobeModal(outfit) },
                      { text: "send to thrift 🚮", onPress: () => deleteOutfit(outfit.id), style: "destructive" },
                      { text: "cancel", style: "cancel" }
                    ]
                  );
                }}
              >
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
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addCard} onPress={() => router.push("/(tabs)/add")}>
              <Text style={styles.addPlus}>+</Text>
              <Text style={styles.addLabel}>Add Outfit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Multi-Wardrobe Modal */}
      {showMultiWardrobeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add to Wardrobes</Text>
            <Text style={styles.modalSub}>Select wardrobes to copy this outfit to</Text>

            <ScrollView style={styles.wardrobesList}>
              {wardrobeOptions.map(wardrobeName => (
                <TouchableOpacity
                  key={wardrobeName}
                  style={styles.wardrobeOption}
                  onPress={() => toggleWardrobeSelection(wardrobeName)}
                >
                  <View style={[styles.checkbox, selectedWardrobes[wardrobeName] && styles.checkboxActive]}>
                    {selectedWardrobes[wardrobeName] && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.wardrobeOptionText}>{wardrobeName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalBtnCancel}
                onPress={() => {
                  setShowMultiWardrobeModal(false);
                  setSelectedOutfit(null);
                  setSelectedWardrobes({});
                }}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalBtnAdd}
                onPress={addOutfitToWardrobes}
              >
                <Text style={styles.modalBtnAddText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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

  // Modal
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end", zIndex: 1000 },
  modal: { backgroundColor: T.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: "80%" },
  modalTitle: { fontFamily: "Syne_800ExtraBold", fontSize: 18, color: T.ink, marginBottom: 4, letterSpacing: -0.2 },
  modalSub: { fontFamily: "CormorantGaramond_400Regular_Italic", fontSize: 13, color: T.muted, marginBottom: 16 },
  wardrobesList: { maxHeight: 300, marginBottom: 20 },
  wardrobeOption: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: T.border, marginRight: 12, justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: T.ink, borderColor: T.ink },
  checkmark: { color: T.lime, fontSize: 16, fontWeight: "bold" },
  wardrobeOptionText: { fontFamily: "Syne_700Bold", fontSize: 14, color: T.ink, flex: 1 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalBtnCancel: { flex: 1, backgroundColor: T.tag, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalBtnCancelText: { fontFamily: "Syne_700Bold", fontSize: 14, color: T.muted },
  modalBtnAdd: { flex: 1, backgroundColor: T.ink, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  modalBtnAddText: { fontFamily: "Syne_700Bold", fontSize: 14, color: T.lime },
});