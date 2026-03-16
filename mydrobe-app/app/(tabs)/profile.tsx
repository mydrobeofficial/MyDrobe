import { CormorantGaramond_400Regular_Italic } from "@expo-google-fonts/cormorant-garamond";
import { Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold, useFonts } from "@expo-google-fonts/syne";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const allOutfits = [...outfits].reverse();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Big Avatar */}
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarLetter}>M</Text>
          </View>

          {/* User name */}
          <Text style={styles.userName}>MyDrobe User</Text>
          <Text style={styles.userTagline}>building your style vault</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>{totalOutfits}</Text>
              <Text style={styles.miniStatLabel}>Outfits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>🔥</Text>
              <Text style={styles.miniStatLabel}>{streak} day</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.miniStat}>
              <Text style={styles.miniStatNumber}>4</Text>
              <Text style={styles.miniStatLabel}>Wardrobes</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Your Closet Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Closet</Text>
          <Text style={styles.sectionSub}>All {totalOutfits} outfits</Text>

          {allOutfits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={styles.emptyTitle}>Start your closet</Text>
              <Text style={styles.emptySub}>Every outfit you clip gets saved here</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {allOutfits.map((outfit: any) => (
                <View key={outfit.id} style={styles.card}>
                  <View style={styles.photoWrap}>
                    <View style={{ width: "100%", height: "100%", backgroundColor: T.tag, justifyContent: "center", alignItems: "center" }}>
                      <Text style={{ fontSize: 40 }}>👗</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {outfit.name}
                    </Text>
                    <Text style={styles.cardWardrobe} numberOfLines={1}>
                      {outfit.wardrobe}
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
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingBottom: 60 },
  
  // Profile Card
  profileCard: {
    backgroundColor: T.surface,
    marginHorizontal: 0,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  bigAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: T.lime,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  bigAvatarLetter: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 44,
    color: T.ink,
  },
  userName: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 28,
    color: T.ink,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  userTagline: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    color: T.muted,
    marginBottom: 28,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  miniStat: {
    alignItems: "center",
    flex: 1,
  },
  miniStatNumber: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 20,
    color: T.ink,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontFamily: "Syne_600SemiBold",
    fontSize: 10,
    color: T.muted,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: T.border,
    marginHorizontal: 16,
  },
  
  divider: {
    height: 1,
    backgroundColor: T.border,
    marginVertical: 24,
    marginHorizontal: 20,
  },

  sectionContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 18,
    color: T.ink,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 13,
    color: T.muted,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyTitle: {
    fontFamily: "Syne_700Bold",
    fontSize: 18,
    color: T.ink,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    color: T.muted,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 240,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  photoWrap: {
    height: CARD_SIZE * 1.2,
    backgroundColor: T.tag,
  },
  cardBody: { padding: 12 },
  cardName: {
    fontFamily: "Syne_700Bold",
    fontSize: 13,
    color: T.ink,
    marginBottom: 2,
  },
  cardWardrobe: {
    fontFamily: "Syne_600SemiBold",
    fontSize: 10,
    color: T.muted,
    marginBottom: 4,
  },
  cardDate: {
    fontFamily: "Syne_600SemiBold",
    fontSize: 10,
    color: T.muted,
    letterSpacing: 0.2,
  },
});