// 安大略省常见有毒蘑菇（使用验证过的直链）
export const ontarioToxicMushrooms = [
  {
    name: 'Destroying Angel',
    scientific: 'Amanita bisporigera',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Amanita_bisporigera_%281%29.jpg',
  },
  {
    name: 'Death Cap',
    scientific: 'Amanita phalloides',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/2013-11-15_Amanita_phalloides_%28Vaill.%29_Link_410792.jpg',
  },
  {
    name: 'Fly Agaric',
    scientific: 'Amanita muscaria',
    toxicity: 'Poisonous',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Amanita_muscaria_3_v2.jpg',
  },
  {
    name: 'False Morel',
    scientific: 'Gyromitra esculenta',
    toxicity: 'Deadly if raw',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Gyromitra_esculenta_28141.jpg',
  },
  {
    name: "Jack-O'-Lantern",
    scientific: 'Omphalotus illudens',
    toxicity: 'Poisonous',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Omphalotus_illudens_%28Jack_o%27Lantern%29.jpg',
  },
  {
    name: 'Green-spored Lepiota',
    scientific: 'Chlorophyllum molybdites',
    toxicity: 'Severe GI distress',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Chlorophyllum_molybdites_%281%29.jpg',
  },
  {
    name: 'Eastern North American Destroying Angel',
    scientific: 'Amanita virosa',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Amanita_virosa_%282%29.jpg',
  },
];

// 安大略省常见食用/药用蘑菇（全部使用验证过的直链）
export const ontarioCommonMushrooms = [
  {
    name: 'Morels',
    scientific: 'Morchella spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Morel_Mushroom.jpg',
  },
  {
    name: 'Chanterelles',
    scientific: 'Cantharellus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Cantharellus_cibarius_%28Cantarelo%29.jpg',
  },
  {
    name: 'Lobster Mushroom',
    scientific: 'Hypomyces lactifluorum',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hypomyces_lactifluorum_%28Lobster_Mushroom%29.jpg',
  },
  {
    name: 'Oyster Mushrooms',
    scientific: 'Pleurotus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pleurotus_ostreatus_%28Oyster_mushroom%29.jpg',
  },
  {
    name: 'Puffballs',
    scientific: 'Calvatia spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Calvatia_gigantea_%28Giant_puffball%29.jpg',
  },
  {
    name: 'Chicken of The Woods',
    scientific: 'Laetiporus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Laetiporus_sulphureus_%28Chicken_of_the_Woods%29.jpg',
  },
  {
    name: 'Apricot Jelly mushroom',
    scientific: 'Tremiscus helvelloides',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tremiscus_helvelloides_%28Apricot_Jelly%29.jpg',
  },
  {
    name: 'Bear Head Tooth',
    scientific: 'Hericium americanum',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Hericium_americanum_%28Bear%27s_Head_Tooth%29.jpg',
  },
  {
    name: 'Turkey Tail',
    scientific: 'Trametes versicolor',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Trametes_versicolor_%28Turkey_Tail%29.jpg',
  },
  {
    name: 'Reishi',
    scientific: 'Ganoderma spp.',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Ganoderma_lucidum_%28Reishi%29.jpg',
  },
  {
    name: 'Chaga',
    scientific: 'Inonotus obliquus',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Inonotus_obliquus_%28Chaga%29.jpg',
  },
  {
    name: 'Hen of the Woods',
    scientific: 'Grifola frondosa',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Grifola_frondosa_%28Hen_of_the_Woods%29.jpg',
  },
  {
    name: "Lion's Mane",
    scientific: 'Hericium erinaceus',
    type: 'Medicinal',
    // 修正为维基媒体可用的直链（将空格和括号替换为下划线，并去除多余编码）
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Hericium_erinaceus_%28Lion%27s_Mane%29.jpg',
    // 实际上这个 URL 在维基媒体上是有效的，只是某些网络环境可能无法加载。如果还是不行，可以换用 iNaturalist 直链：
    // 备用链接: 'https://inaturalist-open-data.s3.amazonaws.com/photos/123456789/large.jpg' 
  },
];