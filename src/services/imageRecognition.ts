// src/services/imageRecognition.ts
import * as FileSystem from 'expo-file-system';

const API_URL = 'https://api.inaturalist.org/v1/computervision/score_image';

export interface RecognitionResult {
  mushroomName: string;
  scientificName: string;
  confidence: number;
  isEdible: boolean;
  warning: string;
}

export async function identifyMushroom(imageUri: string): Promise<RecognitionResult> {
  // 1. 将图片转为base64格式
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  // 2. 调用后端API
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 }),
  });
  
  // 3. 解析并返回结果
  const data = await response.json();
  return {
    mushroomName: data.name,
    scientificName: data.scientific_name,
    confidence: data.confidence,
    isEdible: data.edible,
    warning: data.warning || '⚠️ 本结果仅供参考，请勿用于实际食用决策',
  };
}