// src/screens/MushroomDetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Linking, Button, ScrollView } from 'react-native';
import { MushroomItem } from '../types/recognition.types';

const fallbackImage = require('../assets/images/placeholder.jpg');

export default function MushroomDetailScreen({ mushroom, onBack }: { mushroom: MushroomItem; onBack: () => void }) {
  return (
    <View style={styles.container}>
      <Button title="← 返回" onPress={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.scientificName}>{mushroom.scientificName}</Text>
        {mushroom.commonName && <Text style={styles.commonName}>🍄 {mushroom.commonName}</Text>}
        <Text style={styles.status}>分类: {mushroom.edibleStatus}</Text>
        
        <Image
          source={mushroom.imageUri ? { uri: mushroom.imageUri } : fallbackImage}
          style={styles.image}
        />

        {/* ========== DESCRIPTION SECTION ========== */}
        {mushroom.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>📖 识别特征：</Text>
            <Text style={styles.descriptionText}>{mushroom.description}</Text>
          </View>
        )}
        {/* ======================================== */}

        {mushroom.wikipediaUrl ? (
          <Text style={styles.link} onPress={() => Linking.openURL(mushroom.wikipediaUrl)}>
            🔗 维基百科查看详情
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  scientificName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  commonName: { fontSize: 16, fontStyle: 'italic', color: '#555', marginBottom: 8 },
  status: { fontSize: 14, color: '#2c3e50', marginBottom: 8 },
  image: { width: '100%', height: 250, borderRadius: 12, marginVertical: 12, resizeMode: 'cover' },
  descriptionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2c3e50',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  link: { color: '#0077cc', textDecorationLine: 'underline', marginTop: 12, fontSize: 14 },
});