import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert, Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from "react-native";

const T = {
  bg:      "#F7F5F0",
  surface: "#FFFFFF",
  border:  "#E8E4DC",
  ink:     "#1A1814",
  muted:   "#9B9690",
  lime:    "#3DFF8E",
  tag:     "#F0EDE6",
};

export default function AddOutfitScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [step, setStep] = useState("camera"); // camera | preview
  const cameraRef = useRef(null);

  // Handle no permission
  if (!permission) {
    return <View style={styles.safe} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.permBox}>
          <Text style={styles.permTitle}>Camera Access</Text>
          <Text style={styles.permSub}>MyDrobe needs camera access to clip your outfits.</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
const clipBackground = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append("image_file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "outfit.jpg",
    } as any);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.EXPO_PUBLIC_REMOVEBG_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Background removal failed");
    }

    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    Alert.alert("Oops", "Could not remove background. Try again.");
    return null;
  }
};

  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      setPhoto(result.uri);
      setStep("preview");
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setStep("preview");
    }
  };

  const retake = () => {
    setPhoto(null);
    setStep("camera");
  };

  // STEP 1 — Camera
  if (step === "camera") {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" />
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>

          {/* Top bar */}
          <SafeAreaView>
            <View style={styles.camTopBar}>
              <Text style={styles.camTitle}>Add Outfit</Text>
              <View style={styles.tipChip}>
                <Text style={styles.tipText}>Plain bg = cleaner clip</Text>
              </View>
            </View>
          </SafeAreaView>

          {/* Silhouette guide */}
          <View style={styles.silhouetteGuide}>
            <View style={styles.silhouetteOutline} />
          </View>

          {/* Bottom controls */}
          <SafeAreaView style={styles.camBottom}>
            <View style={styles.camControls}>

              {/* Gallery */}
              <TouchableOpacity style={styles.galleryBtn} onPress={pickFromGallery}>
                <Text style={styles.galleryIcon}>⊞</Text>
                <Text style={styles.galleryLabel}>Gallery</Text>
              </TouchableOpacity>

              {/* Shutter */}
              <TouchableOpacity style={styles.shutter} onPress={takePhoto}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>

              {/* Flip placeholder */}
              <View style={styles.galleryBtn}>
                <Text style={styles.galleryIcon}>↺</Text>
                <Text style={styles.galleryLabel}>Flip</Text>
              </View>

            </View>
          </SafeAreaView>

        </CameraView>
      </View>
    );
  }

  // STEP 2 — Preview
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={retake}>
          <Text style={styles.backBtn}>← Retake</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Outfit</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.previewContent}>

        {/* Photo preview */}
        <View style={styles.photoWrap}>
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
          <View style={styles.clipOverlay}>
            <Text style={styles.clipOverlayText}>Tap clip to remove background</Text>
          </View>
        </View>

{/* Clip button — the magic moment */}
        <TouchableOpacity style={styles.clipBtn} activeOpacity={0.85}
          onPress={async () => {
            const clipped = await clipBackground(photo);
            if (clipped) {
              setPhoto(clipped);
              router.push({ pathname: "/(tabs)/save", params: { photo: clipped } });
            }
          }}>
          <Text style={styles.clipBtnText}>✂️ Clip Outfit</Text>
          <Text style={styles.clipBtnSub}>removes background instantly</Text>
        </TouchableOpacity>

        {/* Or save as-is */}
        <TouchableOpacity style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Save without clipping →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:              { flex: 1, backgroundColor: T.bg },
  cameraContainer:   { flex: 1, backgroundColor: "#000" },
  camera:            { flex: 1 },
  camTopBar:         { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 },
  camTitle:          { color: "#FFFFFF", fontSize: 18, fontWeight: "800", letterSpacing: -0.5 },
  tipChip:           { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  tipText:           { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  silhouetteGuide:   { flex: 1, justifyContent: "center", alignItems: "center" },
  silhouetteOutline: { width: 180, height: 320, borderRadius: 90, borderWidth: 2, borderColor: "rgba(255,255,255,0.3)", borderStyle: "dashed" },
  camBottom:         { paddingBottom: 20 },
  camControls:       { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 30, paddingVertical: 20 },
  galleryBtn:        { alignItems: "center", width: 60 },
  galleryIcon:       { fontSize: 28, color: "#FFFFFF", marginBottom: 4 },
  galleryLabel:      { fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  shutter:           { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.3)", justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  shutterInner:      { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFFFFF" },
  header:            { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, backgroundColor: T.surface, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn:           { fontSize: 14, color: T.ink, fontWeight: "600" },
  headerTitle:       { fontSize: 16, fontWeight: "800", color: T.ink, letterSpacing: -0.3 },
  previewContent:    { padding: 20, paddingBottom: 60 },
  photoWrap:         { borderRadius: 20, overflow: "hidden", marginBottom: 20, position: "relative" },
  photo:             { width: "100%", height: 420, borderRadius: 20 },
  clipOverlay:       { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(26,24,20,0.5)", padding: 12, alignItems: "center" },
  clipOverlayText:   { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  clipBtn:           { backgroundColor: T.ink, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 12 },
  clipBtnText:       { color: T.lime, fontSize: 18, fontWeight: "800", marginBottom: 4 },
  clipBtnSub:        { color: "rgba(255,255,255,0.5)", fontSize: 12 },
  skipBtn:           { alignItems: "center", padding: 16 },
  skipBtnText:       { color: T.muted, fontSize: 14, fontWeight: "600" },
  permBox:           { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  permTitle:         { fontSize: 24, fontWeight: "800", color: T.ink, marginBottom: 10 },
  permSub:           { fontSize: 15, color: T.muted, textAlign: "center", marginBottom: 30, lineHeight: 22 },
  permBtn:           { backgroundColor: T.ink, borderRadius: 14, paddingHorizontal: 30, paddingVertical: 16 },
  permBtnText:       { color: T.lime, fontSize: 15, fontWeight: "800" },
});
