// src/hooks/useMushroomObservations.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export interface Mushroom {
  id: number;
  name: string; // scientific name
  commonName: string;
  imageUri: string | null;
  summary: string;
  isToxic: boolean;
}

export function useMushroomObservations() {
  const [edible, setEdible] = useState<Mushroom[]>([]);
  const [toxic, setToxic] = useState<Mushroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('位置权限被拒绝');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lon = loc.coords.longitude;

        console.log('Fetching mushrooms near:', lat, lon);

        // Get observations near current location
        const url = `https://api.inaturalist.org/v2/observations?taxon_id=47126&geo=true&lat=${lat}&lng=${lon}&radius=50&per_page=50`; 
        // taxon_id=47126 is Fungi (mushrooms)
        const res = await fetch(url);
        const json = await res.json();

        if (!json.results) {
          setError('未找到区域蘑菇');
          setLoading(false);
          return;
        }

        const edibleList: Mushroom[] = [];
        const toxicList: Mushroom[] = [];

        for (const obs of json.results) {
          const taxonArray = Array.isArray(obs.taxon) ? obs.taxon : [obs.taxon];
          const taxon = taxonArray[0]; // use first if multiple spp.

          if (!taxon) continue;

          const mushroom: Mushroom = {
            id: obs.id,
            name: taxon.name,
            commonName: taxon.preferred_common_name || '',
            imageUri: taxon.default_photo?.medium || null,
            summary: taxon.wikipedia_summary || '无描述',
            isToxic: taxon.is_toxic || false, // assume API has is_toxic boolean
          };

          // Log the URL
          console.log('Mushroom image URL:', mushroom.imageUri);

          if (mushroom.isToxic) toxicList.push(mushroom);
          else edibleList.push(mushroom);
        }

        setEdible(edibleList);
        setToxic(toxicList);
      } catch (err: any) {
        console.error('useMushroomObservations error:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { edible, toxic, loading, error };
}