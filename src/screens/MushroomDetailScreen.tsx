// src/screens/MushroomDetailScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Linking, Button } from 'react-native';
import { MushroomItem } from '../types/recognition.types';

const fallbackImage = require('../assets/images/placeholder.jpg');

export default function MushroomDetailScreen({ mushroom, onBack }: { mushroom: MushroomItem; onBack: () => void }) {
  return (
    <View style={styles.container}>
      <Button title="← 返回" onPress={onBack} />
      <Text style={styles.scientificName}>{mushroom.scientificName}</Text>
      <Text>{mushroom.commonName}</Text>
      <Text>分类: {mushroom.edibleStatus}</Text>
      <Image
        source={mushroom.imageUri ? { uri: mushroom.imageUri } : fallbackImage}
        style={styles.image}
      />
      {mushroom.wikipediaUrl ? (
        <Text style={styles.link} onPress={() => Linking.openURL(mushroom.wikipediaUrl)}>
          维基百科查看详情
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  scientificName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  image: { width: 300, height: 300, borderRadius: 12, marginVertical: 12 },
  link: { color: 'blue', textDecorationLine: 'underline', marginTop: 12 },
});