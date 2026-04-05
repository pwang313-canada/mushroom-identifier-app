import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

import { initDatabase, saveIdentification, getFrequentMushroomsNearby } from './database';
import { ontarioToxicMushrooms, ontarioCommonMushrooms } from './ontarioMushrooms';

type Screen = 'home' | 'search' | 'camera' | 'detail';

// ---------- iNaturalist 识别 ----------
async function identifyMushroom(imageUri: string): Promise<any[]> {
  const formData = new FormData();
  (formData as any).append('image', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });
  try {
    const res = await fetch('https://api.inaturalist.org/v1/computervision/score_image', {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const json = await res.json();
    return json.result?.slice(0, 5) || [];
  } catch (error) {
    console.error(error);
    throw new Error('识别失败');
  }
}

// ---------- 按名称搜索 ----------
async function searchMushroomByName(name: string): Promise<any[]> {
  const url = `https://api.inaturalist.org/v1/taxons/autocomplete?q=${encodeURIComponent(name)}&per_page=5`;
  const res = await fetch(url);
  const json = await res.json();
  return json.results || [];
}

// ---------- 辅助函数：提取属名（如果包含 spp. / sp.）----------
function getSearchTerm(scientificName: string): string {
  const cleaned = scientificName.trim();
  // 匹配 "spp." 或 "sp."（不区分大小写，支持末尾有点或无点）
  if (/spp\.?$/i.test(cleaned) || /sp\.?$/i.test(cleaned)) {
    const parts = cleaned.split(/\s+/);
    if (parts.length > 0) {
      return parts[0]; // 返回第一个单词（属名）
    }
  }
  return cleaned;
}

// ---------- 使用 iNaturalist API 获取蘑菇图片（核心修复）----------
async function fetchMushroomImage(scientificName: string): Promise<string | null> {
  if (!scientificName) return null;
  
  // 关键修复：将 "Morchella spp." 转换为 "Morchella"
  const searchTerm = getSearchTerm(scientificName);
  console.log(`原始学名: ${scientificName} -> 搜索词: ${searchTerm}`);

  try {
    // 1. 搜索物种 ID（使用清洗后的词）
    const searchUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(searchTerm)}&per_page=1`;
    const searchRes = await fetch(searchUrl);
    const searchJson = await searchRes.json();
    if (!searchJson.results || searchJson.results.length === 0) {
      console.log(`未找到学名: ${scientificName} (搜索词: ${searchTerm})`);
      return null;
    }
    const taxonId = searchJson.results[0].id;

    // 2. 获取物种详情（包含图片）
    const taxonUrl = `https://api.inaturalist.org/v1/taxa/${taxonId}`;
    const taxonRes = await fetch(taxonUrl);
    const taxonJson = await taxonRes.json();
    const defaultPhoto = taxonJson.results?.[0]?.default_photo;
    if (defaultPhoto && defaultPhoto.medium_url) {
      console.log(`获取图片成功: ${scientificName} -> ${defaultPhoto.medium_url}`);
      return defaultPhoto.medium_url;
    }
    return null;
  } catch (error) {
    console.error(`获取图片失败 ${scientificName}:`, error);
    return null;
  }
}

// ---------- 详情页（使用 iNaturalist API 动态加载图片）----------
function MushroomDetailScreen({
  route,
  onBack,
}: {
  route: { mushrooms: any[]; initialIndex: number; listType: string };
  onBack: () => void;
}) {
  const { mushrooms, initialIndex, listType } = route;
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentMushroom = mushrooms[selectedIndex];

  useEffect(() => {
    let mounted = true;
    const loadImage = async () => {
      setLoadingImage(true);
      setImageError(false);
      setImageUrl(null);
      // 动态从 iNaturalist 获取图片
      const url = await fetchMushroomImage(currentMushroom.scientific);
      if (mounted) {
        setImageUrl(url);
        if (!url) setImageError(true);
      }
      setLoadingImage(false);
    };
    loadImage();
    return () => { mounted = false; };
  }, [selectedIndex]);

  const handleImageError = () => setImageError(true);

  return (
    <SafeAreaView style={styles.container}>
      <Button title="← 返回主页" onPress={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.subtitle}>选择蘑菇：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedIndex}
            onValueChange={(itemValue) => setSelectedIndex(itemValue)}
            style={styles.picker}
            numberOfLines={1}
          >
            {mushrooms.map((m, idx) => (
              <Picker.Item key={idx} label={m.name} value={idx} />
            ))}
          </Picker>
        </View>

        <View style={styles.imageContainer}>
          {loadingImage && <ActivityIndicator size="large" />}
          {!loadingImage && imageUrl && !imageError && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.detailImage}
              onError={handleImageError}
            />
          )}
          {(!imageUrl || imageError) && !loadingImage && (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🍄</Text>
              <Text>图片加载失败</Text>
              <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{currentMushroom.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailName}>{currentMushroom.name}</Text>
          <Text style={styles.detailScientific}>{currentMushroom.scientific}</Text>
          {listType === 'toxic' ? (
            <Text style={styles.toxicity}>☠️ 毒性：{currentMushroom.toxicity}</Text>
          ) : (
            <Text style={currentMushroom.type === 'Medicinal' ? styles.medicinal : styles.edible}>
              {currentMushroom.type === 'Medicinal' ? '💊 药用蘑菇' : '🍽️ 可食用蘑菇'}
            </Text>
          )}
          <Text style={styles.disclaimer}>⚠️ 请勿仅凭此结果食用蘑菇，务必咨询专家。</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- 主页（保持不变）----------
function HomeScreen({
  onNavigate,
  onOpenDetail,
  currentLocation,
}: {
  onNavigate: (screen: Screen) => void;
  onOpenDetail: (mushrooms: any[], idx: number, type: string) => void;
  currentLocation: { lat: number; lon: number } | null;
}) {
  const [frequent, setFrequent] = useState<any[]>([]);
  const [loadingFreq, setLoadingFreq] = useState(false);

  useEffect(() => {
    if (currentLocation) loadFrequent();
  }, [currentLocation]);

  const loadFrequent = async () => {
    if (!currentLocation) return;
    setLoadingFreq(true);
    try {
      const nearby = await getFrequentMushroomsNearby(currentLocation.lat, currentLocation.lon, 20);
      setFrequent(nearby);
    } catch (e) { console.error(e); }
    finally { setLoadingFreq(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍄 安大略蘑菇指南</Text>
      {currentLocation && (
        <Text style={styles.locationText}>📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}</Text>
      )}

      <Text style={styles.sectionTitle}>⚠️ 安大略常见有毒蘑菇</Text>
      <ScrollView horizontal={false} style={styles.listContainer}>
        {ontarioToxicMushrooms.map((m, idx) => (
          <TouchableOpacity key={idx} onPress={() => onOpenDetail(ontarioToxicMushrooms, idx, 'toxic')}>
            <View style={styles.card}>
              <Text style={styles.mushroomName}>{m.name}</Text>
              <Text style={styles.scientificName}>{m.scientific}</Text>
              <Text style={styles.toxicity}>☠️ {m.toxicity}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>🍽️ 安大略常见食用 / 药用蘑菇</Text>
      <ScrollView horizontal={false} style={styles.listContainer}>
        {ontarioCommonMushrooms.map((m, idx) => (
          <TouchableOpacity key={idx} onPress={() => onOpenDetail(ontarioCommonMushrooms, idx, 'common')}>
            <View style={styles.card}>
              <Text style={styles.mushroomName}>{m.name}</Text>
              <Text style={styles.scientificName}>{m.scientific}</Text>
              <Text style={m.type === 'Medicinal' ? styles.medicinal : styles.edible}>
                {m.type === 'Medicinal' ? '药用' : '可食用'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>📍 你附近经常出现的蘑菇</Text>
      {loadingFreq && <ActivityIndicator size="small" />}
      {!loadingFreq && frequent.length === 0 && <Text style={styles.noData}>暂无数据，快去拍照识别吧！</Text>}
      <ScrollView horizontal={false} style={styles.listContainer}>
        {frequent.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.mushroomName}>{item.name}</Text>
            <Text style={styles.scientificName}>{item.scientificName}</Text>
            <Text>附近出现过 {item.count} 次</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonGroup}>
        <Button title="🔍 按名称搜索" onPress={() => onNavigate('search')} />
        <View style={{ height: 16 }} />
        <Button title="📸 拍照识别" onPress={() => onNavigate('camera')} />
      </View>
    </SafeAreaView>
  );
}

// ---------- 搜索页 ----------
function SearchByNameScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchMushroomByName(query);
      setResults(data);
    } catch { Alert.alert('错误', '搜索失败'); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="← 返回主页" onPress={onBack} />
      <Text style={styles.subtitle}>输入蘑菇名称：</Text>
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="例如: Amanita muscaria" />
      <Button title="搜索" onPress={handleSearch} />
      {loading && <ActivityIndicator size="large" />}
      <ScrollView style={{ marginTop: 20 }}>
        {results.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.scientificName}>{item.name}</Text>
            <Text>{item.preferred_common_name || '无常用名'}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- 拍照识别页 ----------
function CameraScreen({ onBack }: { onBack: () => void }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { setLocationError('位置权限被拒绝'); return null; }
    const loc = await Location.getCurrentPositionAsync({});
    return { lat: loc.coords.latitude, lon: loc.coords.longitude };
  };

  const handleIdentify = async (uri: string) => {
    setIdentifying(true);
    try {
      const loc = await getLocation();
      const suggestions = await identifyMushroom(uri);
      setResults(suggestions);
      if (suggestions.length > 0 && loc) {
        const top = suggestions[0];
        const name = top.taxon?.preferred_common_name || top.taxon?.name || 'Unknown';
        const scientific = top.taxon?.name || 'Unknown';
        await saveIdentification(name, scientific, top.score, loc.lat, loc.lon);
        Alert.alert('已保存', '识别结果和位置已存入数据库');
      }
    } catch (err: any) { Alert.alert('识别错误', err.message); }
    finally { setIdentifying(false); }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('需要权限', '请允许相机访问'); return; }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      setResults([]);
      await handleIdentify(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('需要权限', '请允许访问相册'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      setResults([]);
      await handleIdentify(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="← 返回主页" onPress={onBack} />
      {locationError && <Text style={{ color: 'red' }}>{locationError}</Text>}
      <View style={styles.buttonRow}>
        <Button title="📷 拍照" onPress={takePhoto} />
        <Button title="🖼️ 从相册选择" onPress={pickImage} />
      </View>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      {identifying && <ActivityIndicator size="large" />}
      <ScrollView>
        {results.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.scientificName}>{item.taxon?.name || '未知'}</Text>
            <Text>置信度: {Math.round(item.score * 100)}%</Text>
            <Text style={styles.disclaimer}>⚠️ 请勿仅凭此结果食用蘑菇</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- 主 App ----------
export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [detailParams, setDetailParams] = useState<{ mushrooms: any[]; initialIndex: number; listType: string } | null>(null);

  useEffect(() => {
    initDatabase();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      }
    })();
  }, []);

  const openDetail = (mushrooms: any[], idx: number, type: string) => {
    setDetailParams({ mushrooms, initialIndex: idx, listType: type });
    setScreen('detail');
  };

  if (screen === 'home') return <HomeScreen onNavigate={setScreen} onOpenDetail={openDetail} currentLocation={location} />;
  if (screen === 'search') return <SearchByNameScreen onBack={() => setScreen('home')} />;
  if (screen === 'camera') return <CameraScreen onBack={() => setScreen('home')} />;
  if (screen === 'detail' && detailParams) return <MushroomDetailScreen route={detailParams} onBack={() => setScreen('home')} />;
  return null;
}

// ---------- 样式 ----------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  locationText: { fontSize: 14, textAlign: 'center', marginBottom: 16, color: '#555' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  listContainer: { maxHeight: 220, marginBottom: 16 },
  card: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  mushroomName: { fontSize: 16, fontWeight: 'bold' },
  scientificName: { fontSize: 14, fontStyle: 'italic', color: '#2c3e50' },
  toxicity: { fontSize: 12, color: '#d32f2f', marginTop: 4 },
  edible: { fontSize: 12, color: '#2e7d32', marginTop: 4 },
  medicinal: { fontSize: 12, color: '#1976d2', marginTop: 4 },
  noData: { fontStyle: 'italic', color: '#777', marginBottom: 12 },
  subtitle: { fontSize: 20, marginVertical: 10 },
  buttonGroup: { marginTop: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginVertical: 10, backgroundColor: 'white' },
  preview: { width: '100%', height: 200, borderRadius: 12, marginVertical: 10, resizeMode: 'cover' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  disclaimer: { marginTop: 8, fontSize: 12, color: 'red' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginVertical: 10, backgroundColor: 'white', minHeight: 60, justifyContent: 'center' },
  picker: { height: 60, width: '100%' },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  detailImage: { width: 200, height: 200, borderRadius: 100, resizeMode: 'cover' },
  placeholderImage: { width: 200, height: 200, borderRadius: 100, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 80 },
  detailCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginTop: 20 },
  detailName: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  detailScientific: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', color: '#555', marginVertical: 8 },
});