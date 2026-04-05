// src/screens/CameraScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Button, Text, ActivityIndicator, StyleSheet, FlatList, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MushroomItem } from '../types/recognition.types';
import { fetchMushroomsByLocation } from '../services/iNaturalistService';
import MushroomDetailScreen from './MushroomDetailScreen';

const fallbackImage = require('../assets/images/placeholder.jpg');

export default function CameraScreen() {
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mushrooms, setMushrooms] = useState<MushroomItem[]>([]);
  const [selected, setSelected] = useState<MushroomItem | null>(null);

  const loadMushrooms = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('位置权限被拒绝');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const list = await fetchMushroomsByLocation(loc.coords.latitude, loc.coords.longitude);
      setMushrooms(list);
    } catch (err: any) {
      Alert.alert('错误', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMushrooms();
  }, []);

  if (selected) {
    return <MushroomDetailScreen mushroom={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>本地蘑菇列表</Text>
      {locationError && <Text style={{ color: 'red' }}>{locationError}</Text>}
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <FlatList
          data={mushrooms}
          keyExtractor={(item) => item.scientificName}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.commonName || item.scientificName}</Text>
              <Text>学名: {item.scientificName}</Text>
              <Text>分类: {item.edibleStatus}</Text>
              <Image
                source={item.imageUri ? { uri: item.imageUri } : fallbackImage}
                style={styles.image}
                onError={() => console.log('Image failed:', item.imageUri)}
              />
              <Button title="查看详情" onPress={() => setSelected(item)} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#fff', marginBottom: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  image: { width: 150, height: 150, borderRadius: 12, marginTop: 8 },
});