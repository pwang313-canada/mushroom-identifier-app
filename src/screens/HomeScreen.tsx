// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useMushroomObservations } from '../hooks/useMushroomObservations';
import { useNavigation } from '@react-navigation/native';

const fallbackImage = require('../assets/images/placeholder.jpg');

export default function HomeScreen() {
  const { edible, toxic, loading, error } = useMushroomObservations();
  const navigation = useNavigation();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  const renderList = (list: typeof edible, title: string) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      {list.length === 0 && <Text style={{ marginBottom: 12 }}>未找到蘑菇</Text>}
      {list.map(m => (
        <TouchableOpacity
          key={m.id}
          style={styles.card}
          onPress={() => navigation.navigate('MushroomDetail', { mushroom: m })}
        >
          <Image source={m.imageUri ? { uri: m.imageUri } : fallbackImage} style={styles.image} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{m.commonName || m.name}</Text>
            <Text style={styles.scientific}>{m.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <ScrollView style={styles.container}>
      {renderList(edible, '可食用')}
      {renderList(toxic, '有毒')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 8, marginBottom: 8 },
  image: { width: 60, height: 60, borderRadius: 30 },
  name: { fontSize: 16, fontWeight: 'bold' },
  scientific: { fontSize: 12, color: '#555' },
});