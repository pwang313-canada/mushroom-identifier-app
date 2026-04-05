// src/services/iNaturalistService.ts
import { MushroomItem } from '../types/recognition.types';

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

function cleanScientificName(name: string) {
  return name.replace(/\s+spp?\.?$/i, '').trim();
}

function mapEdibleStatus(taxon: any): string {
  if (!taxon) return '未知';
  const edibleGenera = ['Morchella', 'Cantharellus', 'Pleurotus'];
  const toxicGenera = ['Amanita'];
  if (edibleGenera.includes(taxon.name)) return '可食用';
  if (toxicGenera.includes(taxon.name)) return '有毒';
  return '未知';
}

export async function fetchMushroomsByLocation(lat: number, lon: number): Promise<MushroomItem[]> {
  try {
    const url = `https://api.inaturalist.org/v2/observations?lat=${lat}&lng=${lon}&taxon_id=47126&quality_grade=research&per_page=50`;
    console.log('Fetching iNaturalist URL:', url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`iNaturalist API error ${res.status}`);

    const data = await res.json();
    const results: MushroomItem[] = [];

    for (const obs of data.results) {
      const taxon = obs.taxon;
      if (!taxon) continue;

      const scientificName = cleanScientificName(taxon.name);
      const commonName = taxon.preferred_common_name || '';
      const edibleStatus = mapEdibleStatus(taxon);

      let imageUri = fallbackImage;
      if (taxon.default_photo?.medium) {
        imageUri = taxon.default_photo.medium;
      } else if (obs.photos?.[0]?.url) {
        imageUri = obs.photos[0].url.replace('square', 'medium');
      }

      const wikipediaUrl = taxon.wikipedia_url || '';

      results.push({
        scientificName,
        commonName,
        edibleStatus,
        imageUri,
        wikipediaUrl,
      });
    }

    console.log('Fetched mushrooms:', results.map((m) => m.scientificName));
    return results;
  } catch (err) {
    console.error('fetchMushroomsByLocation error', err);
    return [];
  }
}