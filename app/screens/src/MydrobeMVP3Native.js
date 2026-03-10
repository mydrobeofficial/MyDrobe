import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MydrobeMVP3Native() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>MyDrobe MVP v3</Text>
      
      <View style={styles.wardrobeItem}>
        <Text style={styles.itemText}>👗 Outfit 1</Text>
      </View>

      <View style={styles.wardrobeItem}>
        <Text style={styles.itemText}>🧥 Outfit 2</Text>
      </View>

      <View style={styles.wardrobeItem}>
        <Text style={styles.itemText}>👖 Outfit 3</Text>
      </View>

      <Text style={styles.footer}>Your digital wardrobe in Expo Go!</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wardrobeItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
  },
  footer: {
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
});
