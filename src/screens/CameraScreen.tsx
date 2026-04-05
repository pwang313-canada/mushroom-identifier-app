// src/screens/CameraScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MushroomItem } from '../types/recognition.types';
import { fetchMushroomsByLocation } from '../services/iNaturalistService';
import ResultScreen from './ResultScreen';

export default function CameraScreen({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mushrooms, setMushrooms] = useState<MushroomItem[]>([]);

  const getMushrooms = async () => {
    setLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('位置权限被拒绝');
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const data = await fetchMushroomsByLocation(loc.coords.latitude, loc.coords.longitude);
      if (data.length === 0) Alert.alert('提示', '未找到附近蘑菇数据');
      setMushrooms(data);
    } catch (err: any) {
      console.error(err);
      Alert.alert('错误', err.message || '获取蘑菇列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMushrooms();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button title="← 返回主页" onPress={onBack} />
      {locationError && <Text style={{ color: 'red' }}>{locationError}</Text>}
      {loading && <ActivityIndicator size="large" />}
      {!loading && mushrooms.length > 0 && <ResultScreen mushrooms={mushrooms} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
});