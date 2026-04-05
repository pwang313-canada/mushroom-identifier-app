// 安大略省常见有毒蘑菇（添加了 description 字段）
export interface Mushroom {
  name: string;
  scientific: string;
  toxicity?: string;
  type?: string;
  imageUrl: string;
  description?: string;   // 新增识别特征描述
}

export const ontarioToxicMushrooms: Mushroom[] = [
  {
    name: 'Destroying Angel',
    scientific: 'Amanita bisporigera',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Amanita_bisporigera_%281%29.jpg',
    description: '全体白色，菌盖光滑，菌柄有菌环和杯状菌托。与可食用的蘑菇区别：可食用蘑菇一般无菌托或菌环。注意不要与白色草菇混淆。',
  },
  {
    name: 'Death Cap',
    scientific: 'Amanita phalloides',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/39/2013-11-15_Amanita_phalloides_%28Vaill.%29_Link_410792.jpg',
    description: '菌盖橄榄绿色至黄褐色，菌褶白色，菌柄有大型菌环和杯状菌托。注意与草菇区别：草菇无白色菌环和菌托。',
  },
  {
    name: 'Fly Agaric',
    scientific: 'Amanita muscaria',
    toxicity: 'Poisonous',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Amanita_muscaria_3_v2.jpg',
    description: '菌盖鲜红色至橙红色，散布白色鳞片；菌柄有菌环，基部膨大。常见于桦木、松林下。与可食用的红菇区别：红菇菌盖无鳞片，菌褶脆而易碎。',
  },
  {
    name: 'False Morel',
    scientific: 'Gyromitra esculenta',
    toxicity: 'Deadly if raw',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Gyromitra_esculenta_28141.jpg',
    description: '菌盖不规则扭曲、脑状，红褐色至深褐色，菌柄短粗。注意与真羊肚菌区别：真羊肚菌菌盖蜂窝状，规则且中空。',
  },
  {
    name: "Jack-O'-Lantern",
    scientific: 'Omphalotus illudens',
    toxicity: 'Poisonous',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Omphalotus_illudens_%28Jack_o%27Lantern%29.jpg',
    description: '菌盖橙黄色至橙褐色，菌褶发光（暗处可见绿光）。注意与鸡油菌区别：鸡油菌菌褶为棱纹状，不分叉且下延，不发光。',
  },
  {
    name: 'Green-spored Lepiota',
    scientific: 'Chlorophyllum molybdites',
    toxicity: 'Severe GI distress',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Chlorophyllum_molybdites_%281%29.jpg',
    description: '菌盖白色至浅褐色，上有褐色鳞片；菌褶成熟后呈淡绿色。常生长在草坪、草地上。',
  },
  {
    name: 'Eastern North American Destroying Angel',
    scientific: 'Amanita virosa',
    toxicity: 'Deadly',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Amanita_virosa_%282%29.jpg',
    description: '全体白色，菌盖光滑，菌柄有菌环和大型杯状菌托。与 Destroying Angel 相似，同样致命。',
  },
];

// 安大略省常见食用/药用蘑菇（添加了 description 字段）
export const ontarioCommonMushrooms = [
  {
    name: 'Morels',
    scientific: 'Morchella spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Morel_Mushroom.jpg',
    description: '菌盖蜂窝状，似羊肚，黄褐色至灰褐色；菌柄白色中空。春季生长于林地、河岸。注意与“假羊肚菌”区别：后者菌盖不规则扭曲，有毒。',
  },
  {
    name: 'Chanterelles',
    scientific: 'Cantharellus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Cantharellus_cibarius_%28Cantarelo%29.jpg',
    description: '菌盖喇叭形，杏黄色至蛋黄色，边缘卷曲；菌褶为棱纹状，分叉且下延。有淡淡的果香。注意与有毒的“杰克灯笼菇”区别：后者菌褶锐利且发光。',
  },
  {
    name: 'Lobster Mushroom',
    scientific: 'Hypomyces lactifluorum',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Hypomyces_lactifluorum_%28Lobster_Mushroom%29.jpg',
    description: '子实体呈亮橙红色至珊瑚红色，表面粗糙不平，形状不规则。它实际上是一种寄生菌，覆盖在宿主蘑菇上。无类似有毒种。',
  },
  {
    name: 'Oyster Mushrooms',
    scientific: 'Pleurotus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pleurotus_ostreatus_%28Oyster_mushroom%29.jpg',
    description: '菌盖扇形或贝壳状，灰白色至灰褐色，菌褶白色且下延。群生于腐木上。注意与某些有毒的侧耳区别：有毒种类通常有刺激性气味。',
  },
  {
    name: 'Puffballs',
    scientific: 'Calvatia spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Calvatia_gigantea_%28Giant_puffball%29.jpg',
    description: '球形或梨形，内部纯白色、均匀致密。必须切开确认内部纯白方可食用。注意与未成熟的毒鹅膏（内部有幼菇轮廓）区别。',
  },
  {
    name: 'Chicken of The Woods',
    scientific: 'Laetiporus spp.',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Laetiporus_sulphureus_%28Chicken_of_the_Woods%29.jpg',
    description: '菌盖鲜橙色至硫黄色，覆瓦状排列，无柄。生于树桩或树干上。注意与有毒的“硫化菌”区别：后者颜色更红且味道苦。',
  },
  {
    name: 'Apricot Jelly mushroom',
    scientific: 'Tremiscus helvelloides',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tremiscus_helvelloides_%28Apricot_Jelly%29.jpg',
    description: '子实体胶质，呈杏黄色至粉橙色，喇叭形或片状。表面光滑，半透明。生于针叶林地上。无毒，无近似有毒种。',
  },
  {
    name: 'Bear Head Tooth',
    scientific: 'Hericium americanum',
    type: 'Edible',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Hericium_americanum_%28Bear%27s_Head_Tooth%29.jpg',
    description: '子实体白色，下垂的长齿状刺，似熊头。生长于硬木树伤口处。无有毒近似种。',
  },
  {
    name: 'Turkey Tail',
    scientific: 'Trametes versicolor',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Trametes_versicolor_%28Turkey_Tail%29.jpg',
    description: '菌盖扁平，具同心环带，颜色多样（灰、褐、蓝、橙等）。菌肉白色，孔状。生于腐木上。注意与“云芝”区别：云芝颜色更单一。',
  },
  {
    name: 'Reishi',
    scientific: 'Ganoderma spp.',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Ganoderma_lucidum_%28Reishi%29.jpg',
    description: '菌盖肾形，红褐色至紫褐色，表面漆样光泽。菌柄侧生。生于阔叶树基部。注意与“树舌”区别：树舌无柄。',
  },
  {
    name: 'Chaga',
    scientific: 'Inonotus obliquus',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Inonotus_obliquus_%28Chaga%29.jpg',
    description: '黑色块状菌核，似烧焦的木炭，内部黄褐色。生于桦树上。无近似种。',
  },
  {
    name: 'Hen of the Woods',
    scientific: 'Grifola frondosa',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Grifola_frondosa_%28Hen_of_the_Woods%29.jpg',
    description: '子实体由多个灰色至褐色菌盖组成，呈簇状。生于橡树基部。注意与“硫磺菌”区别：后者颜色鲜艳。',
  },
  {
    name: "Lion's Mane",
    scientific: 'Hericium erinaceus',
    type: 'Medicinal',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Hericium_erinaceus_%28Lion%27s_Mane%29.jpg',
    description: '子实体白色，下垂的长刺状结构，似狮鬃。生长于硬木树伤口处。药用价值高，可促进神经生长。无有毒近似种。',
  },
];