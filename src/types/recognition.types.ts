// src/types/recognition.types.ts

export interface MushroomItem {
  scientificName: string;     // cleaned scientific name
  commonName: string;         // English common name
  edibleStatus: string;       // '可食用' / '有毒' / '未知'
  imageUri: string;           // photo URL or fallback
  wikipediaUrl?: string;      // optional link
}