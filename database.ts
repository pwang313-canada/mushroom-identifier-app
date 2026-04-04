import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mushroom.db');

export const initDatabase = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS identifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mushroomName TEXT,
      scientificName TEXT,
      confidence REAL,
      latitude REAL,
      longitude REAL,
      timestamp INTEGER
    );
  `);
};

export const saveIdentification = async (
  mushroomName: string,
  scientificName: string,
  confidence: number,
  latitude: number,
  longitude: number
) => {
  const timestamp = Date.now();
  await db.runAsync(
    'INSERT INTO identifications (mushroomName, scientificName, confidence, latitude, longitude, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
    mushroomName,
    scientificName,
    confidence,
    latitude,
    longitude,
    timestamp
  );
};

// 获取附近（指定半径公里内）的所有识别记录
export const getNearbyIdentifications = async (
  lat: number,
  lon: number,
  radiusKm: number = 10
) => {
  const earthRadius = 6371;
  const latDiff = (radiusKm / earthRadius) * (180 / Math.PI);
  const lonDiff = (radiusKm / (earthRadius * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

  const minLat = lat - latDiff;
  const maxLat = lat + latDiff;
  const minLon = lon - lonDiff;
  const maxLon = lon + lonDiff;

  const results = await db.getAllAsync(
    `SELECT * FROM identifications 
     WHERE latitude BETWEEN ? AND ? 
     AND longitude BETWEEN ? AND ? 
     ORDER BY timestamp DESC`,
    minLat, maxLat, minLon, maxLon
  );
  return results;
};

// 获取附近出现频率最高的蘑菇（用于“常见蘑菇”）
export const getFrequentMushroomsNearby = async (lat: number, lon: number, radiusKm: number = 10) => {
  const records = await getNearbyIdentifications(lat, lon, radiusKm);
  const freq: { [key: string]: { count: number; scientificName: string } } = {};
  records.forEach((rec: any) => {
    const name = rec.mushroomName;
    if (!freq[name]) {
      freq[name] = { count: 0, scientificName: rec.scientificName };
    }
    freq[name].count++;
  });
  const sorted = Object.entries(freq)
    .map(([name, data]) => ({ name, scientificName: data.scientificName, count: data.count }))
    .sort((a, b) => b.count - a.count);
  return sorted;
};