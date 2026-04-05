// src/screens/ResultScreen.tsx
import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MushroomItem } from '../types/recognition.types';

const fallbackImage = require('../assets/images/placeholder.jpg');

interface Props {
  mushrooms: MushroomItem[];
  onSelect?: (m: MushroomItem) => void;
}

export default function ResultScreen({ mushrooms, onSelect }: Props) {
  return (
    <ScrollView>
      {mushrooms.map((m, idx) => (
        <TouchableOpacity key={idx} onPress={() => onSelect && onSelect(m)}>
          <View style={styles.card}>
            <Text style={styles.scientificName}>{m.scientificName}</Text>
            <Text>{m.commonName}</Text>
            <Text>分类: {m.edibleStatus}</Text>
            <Image
              source={m.imageUri ? { uri: m.imageUri } : fallbackImage}
              style={styles.resultImage}
            />
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 12 },
  scientificName: { fontSize: 16, fontWeight: 'bold' },
  resultImage: { width: 150, height: 150, borderRadius: 12, marginTop: 8 },
});