import { CormorantGaramond_400Regular_Italic } from "@expo-google-fonts/cormorant-garamond";
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from "@expo-google-fonts/syne";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const T = {
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  border: "#E8E4DC",
  ink: "#1A1814",
  muted: "#9B9690",
  lime: "#3DFF8E",
  tag: "#F0EDE6",
};

const WIDTH = Dimensions.get("window").width;
const CARD_SIZE = (WIDTH - 48) / 2;

export default function ProfileScreen() {
  const [outfits, setOutfits] = useState([]);
  const [streak, setStreak] = useState(0);

  const [fontsLoaded] = useFonts({
    Syne_800ExtraBold,
    Syne_700Bold,
    Syne_600SemiBold,
    CormorantGaramond_400Regular_Italic,
  });

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  const loadProfileData = async () => {
    try {
      const stored = await AsyncStorage.getItem("outfits");
      if (stored) {
        const all = JSON.parse(stored);
        setOutfits(all);

        // Calculate streak (simple version: count consecutive days with outfits)
        const today = new Date().toDateString();
        const lastOutfitDate = all.length > 0 
          ? new Date(all[all.length - 1].savedAt).toDateString() 
          : null;
        
        if (lastOutfitDate === today) {
          setStreak(all.length);
        }
      }
    } catch (e) {
      console.log("Could not load profile data");
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const totalOutfits = outfits.length;
  const recentOutfits = outfits.slice(-6).reverse();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSub}>your style history</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>M</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalOutfits}</Text>
            <Text style={styles.statLabel}>Outfits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🔥</Text>
            <Text style={styles.statLabel}>{streak} day streak</Text>
          </View>
        </View>

        {/* History section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Outfit History</Text>

          {recentOutfits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>👗</Text>
              <Text style={styles.emptyText}>No outfits yet</Text>
              <TouchableOpacity 
                style={styles.emptyBtn}
                onPress={() => router.push("/(tabs)/add")}
              >
                <Text style={styles.emptyBtnText}>+ Add your first outfit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.grid}>
              {recentOutfits.map((outfit: any) => (
                <View key={outfit.id} style={styles.card}>
                  <View style={styles.photoWrap}>
                    <Image
                      source={{ uri: outfit.photo }}
                      style={styles.photo}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {outfit.name}
                    </Text>
                    <Text style={styles.cardDate}>
                      {new Date(outfit.savedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.surface },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 24,
    color: T.ink,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 13,
    color: T.muted,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.lime,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 16,
    color: T.ink,
  },
  content: { padding: 20, paddingBottom: 60 },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  statNumber: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 28,
    color: T.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Syne_600SemiBold",
    fontSize: 11,
    color: T.muted,
    letterSpacing: 0.3,
  },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: {
    fontFamily: "Syne_700Bold",
    fontSize: 14,
    color: T.ink,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontFamily: "Syne_700Bold",
    fontSize: 16,
    color: T.ink,
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: T.ink,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  emptyBtnText: {
    fontFamily: "Syne_700Bold",
    fontSize: 13,
    color: T.lime,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: CARD_SIZE,
    backgroundColor: T.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  photoWrap: {
    height: CARD_SIZE * 1.2,
    backgroundColor: T.tag,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: { width: "100%", height: "100%" },
  cardBody: { padding: 10 },
  cardName: {
    fontFamily: "Syne_700Bold",
    fontSize: 12,
    color: T.ink,
    marginBottom: 3,
  },
  cardDate: {
    fontFamily: "Syne_600SemiBold",
    fontSize: 10,
    color: T.muted,
  },
});