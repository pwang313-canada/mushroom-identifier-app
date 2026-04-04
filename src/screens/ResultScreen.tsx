import React from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useImageRecognition } from '../hooks/useImageRecognition';

const fallbackImage = require('../../assets/images/placeholder.jpg');

export default function ResultScreen({ results }: { results: any[] }) {
  return (
    <ScrollView style={styles.container}>
      {results.map((item, idx) => {
        const taxonName = item.taxon?.name || '未知';
        const commonName = item.taxon?.preferred_common_name || '';
        const { imageUri, loading, error } = useImageRecognition(taxonName);

        return (
          <View key={idx} style={styles.card}>
            <Text style={styles.scientificName}>{taxonName}</Text>
            <Text>{commonName}</Text>
            <Text>置信度: {Math.round(item.score * 100)}%</Text>

            {loading && <ActivityIndicator />}
            {!loading && <Image source={imageUri ? { uri: imageUri } : fallbackImage} style={styles.resultImage} />}
            {!loading && error && <Text style={{ color: 'red' }}>图片加载失败</Text>}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 12 },
  scientificName: { fontSize: 16, fontWeight: 'bold' },
  resultImage: { width: 150, height: 150, borderRadius: 12, marginTop: 8 },
});