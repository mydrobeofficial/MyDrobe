import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';

const T = {
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  border: "#E8E4DC",
  ink: "#1A1814",
  muted: "#9B9690",
  lime: "#3DFF8E",
};

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: T.border,
          backgroundColor: T.surface,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 28 : 16,
          paddingHorizontal: 24,
          height: Platform.OS === "ios" ? 100 : 80,
        },
        tabBarActiveTintColor: T.ink,
        tabBarInactiveTintColor: T.muted,
        tabBarLabelStyle: {
          fontFamily: "Syne_600SemiBold",
          fontSize: 10,
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{
          title: "Wardrobe",
          tabBarLabel: "Wardrobe",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>▦</Text>,
        }}
      />
      <Tabs.Screen 
        name="add" 
        options={{
          title: "Add",
          tabBarLabel: "",
          tabBarStyle: { display: 'none' },
          tabBarIcon: ({ color }) => (
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: T.ink, justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 32, color: T.lime, fontWeight: "300" }}>+</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>◉</Text>,
        }}
      />
      <Tabs.Screen name="save" options={{ href: null }} />
      <Tabs.Screen name="wardrobe" options={{ href: null }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}