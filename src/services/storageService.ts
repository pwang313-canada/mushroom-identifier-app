// src/services/storageService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mushroom_history';

export async function saveIdentification(
  name: string,
  scientific: string,
  score: number,
  lat: number,
  lon: number
) {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const data = existing ? JSON.parse(existing) : [];

    data.push({
      name,
      scientific,
      score,
      lat,
      lon,
      timestamp: Date.now(),
    });

    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save error:', e);
  }
}

export async function getFrequentMushroomsNearby(
  lat: number,
  lon: number,
  radiusKm: number
) {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const data = existing ? JSON.parse(existing) : [];

    return data; // MVP: just return all
  } catch {
    return [];
  }
}