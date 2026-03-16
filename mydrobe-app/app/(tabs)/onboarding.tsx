import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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

const SLIDES = [
  {
    emoji: "📸",
    title: "Clip Your Fits",
    description: "Take a photo of any outfit and we'll instantly remove the background to create a sticker.",
  },
  {
    emoji: "🗂",
    title: "Organize Your Wardrobe",
    description: "Save outfit stickers into custom wardrobes. Never forget a look you love.",
  },
  {
    emoji: "🔥",
    title: "Build Your Streak",
    description: "Add an outfit every day and start building your personal style vault.",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNext = async () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await AsyncStorage.setItem("onboardingSeen", "true");
      router.replace("/(tabs)/");
    }
  };

  const skip = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    router.replace("/(tabs)/");
  };

  const slide = SLIDES[currentSlide];
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </ScrollView>

      {/* Progress dots */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentSlide && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {isLastSlide ? "Get Started" : "Next →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.surface },
  skipBtn: { paddingHorizontal: 20, paddingVertical: 12 },
  skipText: { fontSize: 14, color: T.muted, fontWeight: "600" },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  center: { alignItems: "center" },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: {
    fontFamily: "Syne_800ExtraBold",
    fontSize: 28,
    color: T.ink,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 16,
    color: T.muted,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 24,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.border },
  dotActive: { backgroundColor: T.ink, width: 24 },
  bottomContainer: { paddingHorizontal: 20, paddingBottom: 32 },
  nextBtn: {
    backgroundColor: T.ink,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  nextBtnText: {
    color: T.lime,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});