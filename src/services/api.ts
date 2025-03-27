
import axios from 'axios';
import { ApiResponse, Tree, TreeFormData, TreeImageUploadData } from '../types';
import { supabase } from '@/integrations/supabase/client';

// This would normally point to your backend API
const API_BASE_URL = 'https://api.example.com';

// Mock data for development
const MOCK_TREES: Tree[] = [
  {
    id: '1',
    name: 'Ancient Oak',
    scientific_name: 'Quercus robur',
    family: 'Fagaceae',
    common_name_english: 'English Oak',
    common_name_malayalam: 'ഓക്ക്',
    native_range: 'Europe, Western Asia',
    species: 'Quercus robur',
    location: 'North Campus',
    description: 'A magnificent oak tree estimated to be over 200 years old. It provides shade for students and habitat for local wildlife.',
    imageUrl: 'https://images.unsplash.com/photo-1542202229-7d93c33f5d07',
    addedDate: '2023-10-15'
  },
  {
    id: '2',
    name: 'Japanese Maple',
    scientific_name: 'Acer palmatum',
    family: 'Sapindaceae',
    common_name_english: 'Japanese Maple',
    common_name_malayalam: 'ജാപ്പനീസ് മേപ്പിൾ',
    native_range: 'Japan, Korea, China',
    species: 'Acer palmatum',
    location: 'East Garden',
    description: 'Known for its stunning red foliage, this Japanese maple adds vibrant color to the garden throughout autumn.',
    imageUrl: 'https://images.unsplash.com/photo-1567641091594-13a9faa0f814',
    addedDate: '2023-11-02'
  },
  {
    id: '3',
    name: 'Weeping Willow',
    scientific_name: 'Salix babylonica',
    family: 'Salicaceae',
    common_name_english: 'Weeping Willow',
    common_name_malayalam: 'വില്ലോ മരം',
    native_range: 'Northern China',
    species: 'Salix babylonica',
    location: 'Lakeside',
    description: 'This graceful willow with its sweeping branches creates a peaceful atmosphere by the college lake.',
    imageUrl: 'https://images.unsplash.com/photo-1636680271758-1d4c155a6e8d',
    addedDate: '2023-09-28'
  },
  {
    id: '4',
    name: 'Silver Birch',
    scientific_name: 'Betula pendula',
    family: 'Betulaceae',
    common_name_english: 'Silver Birch',
    common_name_malayalam: 'വെള്ളി ബിർച്ച്',
    native_range: 'Europe, Asia',
    species: 'Betula pendula',
    location: 'West Campus',
    description: 'Distinguished by its white bark, this birch tree stands in contrast to the surrounding vegetation.',
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5',
    addedDate: '2024-01-12'
  },
  {
    id: '5',
    name: 'Coastal Redwood',
    scientific_name: 'Sequoia sempervirens',
    family: 'Cupressaceae',
    common_name_english: 'Coast Redwood',
    common_name_malayalam: 'തീരദേശ റെഡ്‌വുഡ്',
    native_range: 'California, Oregon',
    species: 'Sequoia sempervirens',
    location: 'Central Plaza',
    description: 'A young coastal redwood planted as part of the college\'s commitment to growing future heritage trees.',
    imageUrl: 'https://images.unsplash.com/photo-1503785640985-f62e3aeee448',
    addedDate: '2023-12-08'
  }
];

// List of predefined trees from the user's input
const PREDEFINED_TREES: Partial<Tree>[] = [
  {
    name: 'Royal Palm',
    scientific_name: 'ROYSTONIA REGIA',
    family: 'ARECACEAE',
    common_name_english: 'ROYAL PALM',
    common_name_malayalam: 'രാജപ്പന',
    native_range: 'Tropical America',
    species: 'ROYSTONIA REGIA',
    location: 'EMEA College',
    description: 'A tall, elegant palm tree with a smooth gray trunk and a crown of feathery fronds.'
  },
  {
    name: 'Guava Tree',
    scientific_name: 'PSIDIUM GUJAVA',
    family: 'MYRTACEAE',
    common_name_english: 'Guava',
    common_name_malayalam: 'പേര',
    native_range: 'South Tropical America',
    species: 'PSIDIUM GUJAVA',
    location: 'EMEA College',
    description: 'A small tree with spreading branches and edible, aromatic fruits.'
  },
  {
    name: 'Paper Flower',
    scientific_name: 'BOUGAINVILLEA SPECTABILIS',
    family: 'NYCTAGINACEAE',
    common_name_english: 'PAPER FLOWER',
    common_name_malayalam: 'കടലാസ് പൂവ്',
    species: 'BOUGAINVILLEA SPECTABILIS',
    location: 'EMEA College',
    description: 'A woody, climbing shrub with vibrant, papery bracts surrounding its small flowers.'
  },
  {
    name: 'Tamarind Tree',
    scientific_name: 'TAMARINDUS INDICA',
    family: 'FABACEAE',
    common_name_english: 'TAMARIND TREE',
    common_name_malayalam: 'പുളി',
    species: 'TAMARINDUS INDICA',
    location: 'EMEA College',
    description: 'A long-lived, large tree with an edible, sour fruit used in many culinary applications.'
  },
  {
    name: 'Vat Tree',
    scientific_name: 'MACARANGA PELTATA',
    family: 'EUPHORBIACEAE',
    common_name_malayalam: 'പൊടുകണ്ണി',
    species: 'MACARANGA PELTATA',
    location: 'EMEA College',
    description: 'A fast-growing, pioneer tree species commonly found in disturbed areas.'
  },
  {
    name: 'Flame Tree',
    scientific_name: 'DELONIX REGIA',
    family: 'FABACEAE',
    common_name_english: 'GULMOHR, MAY FLOWER',
    common_name_malayalam: 'പൂമരം',
    native_range: 'Madagascar',
    species: 'DELONIX REGIA',
    location: 'EMEA College',
    description: 'Known for its fern-like leaves and flamboyant display of fiery red-orange bloom.'
  },
  {
    name: 'Mangium',
    scientific_name: 'ACACIA MANGIUM',
    family: 'FABACEAE',
    common_name_english: 'MANGIUM, HICKORY WATTLE',
    common_name_malayalam: 'മാഞ്ചിയം',
    native_range: 'Maluku, New Guinea & Queensland',
    species: 'ACACIA MANGIUM',
    location: 'EMEA College',
    description: 'A fast-growing tree species used for reforestation and timber production.'
  },
  {
    name: 'Mahogany',
    scientific_name: 'SWIETENIA MAHOGANI',
    family: 'MELIACEAE',
    common_name_english: 'MAHOGANY',
    common_name_malayalam: 'മഹാഗണി',
    species: 'SWIETENIA MAHOGANI',
    location: 'EMEA College',
    description: 'A tropical hardwood tree valued for its beautiful reddish-brown timber.'
  },
  {
    name: 'Queen Crepe Myrtle',
    scientific_name: 'LAGERSTROEMIA SPECIOSA',
    family: 'LYTHRACEAE',
    common_name_english: 'QUEEN CREPE MYRTLE',
    common_name_malayalam: 'മണിമരുത്',
    species: 'LAGERSTROEMIA SPECIOSA',
    location: 'EMEA College',
    description: 'A flowering tree known for its showy purple flowers and interesting bark patterns.'
  },
  {
    name: "Buddha's Belly Bamboo",
    scientific_name: 'BAMBUSA VENTRICOSA',
    family: 'POACEAE',
    common_name_english: "BUDDHA'S BELLY BAMBOO",
    species: 'BAMBUSA VENTRICOSA',
    location: 'EMEA College',
    description: 'A bamboo species known for its swollen, bulbous internodes that resemble a Buddha belly.'
  },
  {
    name: 'Spiny Bamboo',
    scientific_name: 'BAMBUSA BAMBOS',
    family: 'POACEAE',
    common_name_english: 'Spiny Bamboo',
    common_name_malayalam: 'മുള',
    native_range: 'Indo-China',
    species: 'BAMBUSA BAMBOS',
    location: 'EMEA College',
    description: 'A thorny bamboo species with robust culms used for various purposes.'
  },
  {
    name: 'Paradise Tree',
    scientific_name: 'SIMAROUBA GLAUCA',
    family: 'SIMAROUBACEAE',
    common_name_english: 'Paradise Tree',
    common_name_malayalam: 'ലക്ഷ്മിതരു',
    native_range: 'Mexico to Tropical America',
    species: 'SIMAROUBA GLAUCA',
    location: 'EMEA College',
    description: 'An evergreen tree with numerous medicinal and industrial uses.'
  },
  {
    name: 'Iron Wood of Malabar',
    scientific_name: 'HOPEA PARVIFLORA',
    family: 'DIPTEROCARPACEAE',
    common_name_english: 'Iron Wood of Malabar',
    common_name_malayalam: 'ഉരിപ്പ്, കമ്പകം',
    native_range: 'Southwestern Ghats',
    species: 'HOPEA PARVIFLORA',
    location: 'EMEA College',
    description: 'A valuable timber tree known for its hard, durable wood.'
  },
  {
    name: 'Sita Ashok',
    scientific_name: 'SARACA ASOCA',
    family: 'FABACEAE',
    common_name_english: 'Sita Ashok',
    common_name_malayalam: 'അശോകം',
    native_range: 'Eastern Pakistan to Myanmar & Sri Lanka',
    species: 'SARACA ASOCA',
    location: 'EMEA College',
    description: 'A sacred tree in Hindu mythology, with medicinal properties.'
  },
  {
    name: 'Henna Plant',
    scientific_name: 'LAWSONIA INERMIS',
    family: 'LYTHRACEAE',
    common_name_english: 'Henna Plant',
    common_name_malayalam: 'മയിലാഞ്ചി',
    species: 'LAWSONIA INERMIS',
    location: 'EMEA College',
    description: 'A flowering plant used for producing the natural dye henna.'
  },
  {
    name: 'Beach Almond',
    scientific_name: 'TERMINALIA BELLIRICA',
    family: 'COMBRETACEAE',
    common_name_english: 'Beach Almond',
    common_name_malayalam: 'താന്നി',
    native_range: 'India, China & Malaysia',
    species: 'TERMINALIA BELLIRICA',
    location: 'EMEA College',
    description: 'A deciduous tree with medicinal fruits and valuable timber.'
  },
  {
    name: 'White Teak',
    scientific_name: 'GMELINA ARBOREA',
    family: 'VERBENACEAE',
    common_name_english: 'White Teak',
    common_name_malayalam: 'കുമിഴ്',
    native_range: 'Indian subcontinent',
    species: 'GMELINA ARBOREA',
    location: 'EMEA College',
    description: 'A fast-growing deciduous tree used for timber and medicinal purposes.'
  },
  {
    name: 'Cluster Fig',
    scientific_name: 'FICUS RACEMOSA',
    family: 'MORACEAE',
    common_name_english: 'Cluster Fig',
    common_name_malayalam: 'അത്തി',
    native_range: 'Pakistan, India, Northern Queensland',
    species: 'FICUS RACEMOSA',
    location: 'EMEA College',
    description: 'A fig tree bearing fruit directly on the trunk and branches.'
  },
  {
    name: 'Indian Gooseberry',
    scientific_name: 'PHYLLANTHUS EMBLICA',
    family: 'EUPHORBIACEAE',
    common_name_english: 'Indian Gooseberry',
    common_name_malayalam: 'നെല്ലി',
    native_range: 'Tropical Asia',
    species: 'PHYLLANTHUS EMBLICA',
    location: 'EMEA College',
    description: 'A deciduous tree with edible fruits high in vitamin C.'
  },
  {
    name: 'Ivory Tree',
    scientific_name: 'HOLARRHENA PUBESCENS',
    family: 'APOCYNACEAE',
    common_name_english: 'Ivory Tree',
    common_name_malayalam: 'കുടകപ്പാല',
    species: 'HOLARRHENA PUBESCENS',
    location: 'EMEA College',
    description: 'A medicinal plant with white flowers and bark used in traditional medicine.'
  },
  {
    name: 'Holoptelia',
    scientific_name: 'HOLOPTELIA INTEGRIFOLIA',
    family: 'ULMACEAE',
    common_name_malayalam: 'ഞെട്ടാവൽ',
    native_range: 'Indo-Malaysia',
    species: 'HOLOPTELIA INTEGRIFOLIA',
    location: 'EMEA College',
    description: 'A large deciduous tree with medicinal properties.'
  },
  {
    name: 'Hill Mango',
    scientific_name: 'COMMIPHORA CAUDATA',
    family: 'BURSERACEAE',
    common_name_english: 'Hill Mango',
    species: 'COMMIPHORA CAUDATA',
    location: 'EMEA College',
    description: 'A tree that yields aromatic gum resin used in traditional medicine.'
  },
  {
    name: 'Peepal Tree',
    scientific_name: 'FICUS RELIGIOSA',
    family: 'MORACEAE',
    common_name_english: 'Peepal, Holy Fig Tree',
    common_name_malayalam: 'അരയാൽ',
    native_range: 'Southeast Pakistan to Myanmar',
    species: 'FICUS RELIGIOSA',
    location: 'EMEA College',
    description: 'A sacred tree in several religions, known for its heart-shaped leaves.'
  },
  {
    name: 'Sweet Indrajao',
    scientific_name: 'WRIGHTIA TINCTORIA',
    family: 'APOCYNACEAE',
    common_name_english: 'Sweet Indrajao',
    common_name_malayalam: 'ദന്തപ്പാല',
    species: 'WRIGHTIA TINCTORIA',
    location: 'EMEA College',
    description: 'A medicinal tree with white flowers and seeds that yield indigo dye.'
  },
  {
    name: 'Indian Bael',
    scientific_name: 'AEGLE MARMELOS',
    family: 'RUTACEAE',
    common_name_english: 'Indian Bael, Wood Apple',
    common_name_malayalam: 'കൂവളം',
    native_range: 'India & Sri Lanka',
    species: 'AEGLE MARMELOS',
    location: 'EMEA College',
    description: 'A sacred tree with medicinal fruits used in traditional medicine.'
  },
  {
    name: 'Mango Tree',
    scientific_name: 'MANGIFERA INDICA',
    family: 'ANACARDIACEAE',
    common_name_english: 'Mango tree',
    common_name_malayalam: 'മാവ്',
    native_range: 'Assam to China',
    species: 'MANGIFERA INDICA',
    location: 'EMEA College',
    description: 'A fruit tree producing the popular mango fruit, native to South Asia.'
  },
  {
    name: 'Sandal Tree',
    scientific_name: 'SANTALUM ALBUM',
    family: 'SANTALACEAE',
    common_name_english: 'Sandal Tree',
    common_name_malayalam: 'ചന്ദനം',
    native_range: 'Java to Northern Australia',
    species: 'SANTALUM ALBUM',
    location: 'EMEA College',
    description: 'A tree prized for its fragrant heartwood used in perfumes and religious ceremonies.'
  },
  {
    name: 'Neem Tree',
    scientific_name: 'AZADIRACHTA INDICA',
    family: 'MELIACEAE',
    common_name_english: 'Neem',
    common_name_malayalam: 'വേപ്പ്',
    native_range: 'Assam to Indo-China',
    species: 'AZADIRACHTA INDICA',
    location: 'EMEA College',
    description: 'A drought-resistant tree with numerous medicinal properties.'
  },
  {
    name: 'Bengal Bamboo',
    scientific_name: 'BAMBUSA TULDA',
    family: 'POACEAE',
    common_name_english: 'Bengal Bamboo',
    native_range: 'India',
    species: 'BAMBUSA TULDA',
    location: 'EMEA College',
    description: 'A versatile bamboo species used for construction, furniture, and paper making.'
  },
  {
    name: 'Running Bamboo',
    scientific_name: 'PLEIOBLASTUS FORTUNEI',
    family: 'POACEAE',
    common_name_english: 'Running Bamboo',
    native_range: 'Southern Japan',
    species: 'PLEIOBLASTUS FORTUNEI',
    location: 'EMEA College',
    description: 'A dwarf bamboo species with variegated leaves, spreading through underground runners.'
  },
  {
    name: 'Yellow Bamboo',
    scientific_name: 'BAMBUSA STRIATA',
    family: 'POACEAE',
    common_name_english: 'Yellow Bamboo',
    common_name_malayalam: 'മഞ്ഞമുള',
    species: 'BAMBUSA STRIATA',
    location: 'EMEA College',
    description: 'An ornamental bamboo with golden yellow culms striped with green.'
  },
  {
    name: 'Forest Red Gum',
    scientific_name: 'EUCALYPTUS TERETICORNIS',
    family: 'MYRTACEAE',
    common_name_english: 'Forest Red Gum',
    common_name_malayalam: 'യൂക്കാലി',
    native_range: 'Australia',
    species: 'EUCALYPTUS TERETICORNIS',
    location: 'EMEA College',
    description: 'A tall eucalyptus tree with medicinal leaves and valuable timber.'
  },
  {
    name: 'Mahogany (Large-leaf)',
    scientific_name: 'SWIETENIA MACROPHYLLA',
    family: 'MELIACEAE',
    common_name_english: 'Mahogany',
    common_name_malayalam: 'മഹാഗണി',
    native_range: 'Mexico to Bolivia & Brazil',
    species: 'SWIETENIA MACROPHYLLA',
    location: 'EMEA College',
    description: 'A large tropical tree valued for its beautiful reddish-brown timber.'
  },
  {
    name: 'Star Gooseberry',
    scientific_name: 'PHYLLANTHUS ACIDUS',
    family: 'EUPHORBIACEAE',
    common_name_english: 'Star Gooseberry',
    common_name_malayalam: 'അരിനെല്ലി',
    native_range: 'Brazil',
    species: 'PHYLLANTHUS ACIDUS',
    location: 'EMEA College',
    description: 'A fruit tree with sour, crisp berries that grow directly on the branches.'
  },
  {
    name: 'Sky Flower',
    scientific_name: 'DURANTA ERECTA',
    family: 'VERBENACEAE',
    common_name_english: 'Sky Flower',
    common_name_malayalam: 'ചെമ്പഴുക്കാച്ചെടി',
    native_range: 'Tropical America',
    species: 'DURANTA ERECTA',
    location: 'EMEA College',
    description: 'An ornamental shrub with blue or white flowers and yellow-orange berries.'
  },
  {
    name: 'Dividivi Plant',
    scientific_name: 'LIBIDIBIA CORIARIA',
    family: 'FABACEAE',
    common_name_english: 'Dividivi Plant',
    common_name_malayalam: 'ഡിവിഡിവി',
    native_range: 'Mexico to Venezuela',
    species: 'LIBIDIBIA CORIARIA',
    location: 'EMEA College',
    description: 'A tree with twisted seed pods rich in tannins, used for leather tanning.'
  },
  {
    name: 'Madagascar Almond',
    scientific_name: 'TERMINALIA MANTALY',
    family: 'COMBRETACEAE',
    common_name_english: 'Madagascar Almond',
    native_range: 'Madagascar',
    species: 'TERMINALIA MANTALY',
    location: 'EMEA College',
    description: 'An ornamental tree with horizontal branches arranged in tiers.'
  },
  {
    name: 'Fox Tail Palm',
    scientific_name: 'WOODYETIA BIFURCATA',
    family: 'ARECACEAE',
    common_name_english: 'Fox Tail Palm',
    native_range: 'Queensland, Australia',
    species: 'WOODYETIA BIFURCATA',
    location: 'EMEA College',
    description: 'A palm tree with feathery fronds resembling a fox\'s tail.'
  },
  {
    name: 'Rain Tree',
    scientific_name: 'SAMANEA SAMAN',
    family: 'FABACEAE',
    common_name_english: 'Rain Tree',
    common_name_malayalam: 'മഴമരം',
    native_range: 'Central America to Venezuela & Ecuador',
    species: 'SAMANEA SAMAN',
    location: 'EMEA College',
    description: 'A large, wide-canopied tree with pink flower heads and edible pods.'
  },
  {
    name: 'Indian Beech Tree',
    scientific_name: 'PONGAMIA PINNATA',
    family: 'FABACEAE',
    common_name_english: 'Indian Beech Tree',
    common_name_malayalam: 'ഉങ്ങ്',
    native_range: 'Asia to Western Pacific',
    species: 'PONGAMIA PINNATA',
    location: 'EMEA College',
    description: 'A fast-growing tree with seeds that yield oil used for biodiesel production.'
  },
  {
    name: 'Yellow Palm',
    scientific_name: 'DYPSIS LUTESCENS',
    family: 'ARECACEAE',
    common_name_english: 'Yellow Palm',
    species: 'DYPSIS LUTESCENS',
    location: 'EMEA College',
    description: 'A popular ornamental palm with yellow-green stems and feathery fronds.'
  },
  {
    name: 'Weeping Fig',
    scientific_name: 'FICUS BENJAMINA',
    family: 'MORACEAE',
    common_name_english: 'Weeping Fig',
    native_range: 'Tropical Asia & Northern Australia',
    species: 'FICUS BENJAMINA',
    location: 'EMEA College',
    description: 'A popular ornamental tree or houseplant with drooping branches and glossy leaves.'
  },
  {
    name: 'Indian Almond Tree',
    scientific_name: 'TERMINALIA CATAPPA',
    family: 'COMBRETACEAE',
    common_name_english: 'Indian Almond Tree',
    common_name_malayalam: 'ബദാം',
    species: 'TERMINALIA CATAPPA',
    location: 'EMEA College',
    description: 'A large tropical tree with edible nuts and leaves that turn red before falling.'
  },
  {
    name: 'Golden Rain Tree',
    scientific_name: 'KOELREUTERIA BIPINNATA',
    family: 'SAPINDACEAE',
    common_name_english: 'Golden Rain Tree',
    common_name_malayalam: 'കനകമഴമരം',
    native_range: 'China',
    species: 'KOELREUTERIA BIPINNATA',
    location: 'EMEA College',
    description: 'A deciduous tree with bright yellow flowers and papery seed capsules.'
  },
  {
    name: 'Giant Indian Fig',
    scientific_name: 'FICUS AURICULATA',
    family: 'MORACEAE',
    common_name_english: 'Giant Indian Fig',
    common_name_malayalam: 'അത്തി',
    native_range: 'Northeast Pakistan to South China & Malaysia',
    species: 'FICUS AURICULATA',
    location: 'EMEA College',
    description: 'A fig tree known for its large, ear-shaped leaves and edible figs.'
  },
  {
    name: 'Australian Brush Cherry',
    scientific_name: 'EUGENIA MYRTIFOLIA',
    family: 'MYRTACEAE',
    common_name_english: 'Australian Brush Cherry',
    native_range: 'Australia',
    species: 'EUGENIA MYRTIFOLIA',
    location: 'EMEA College',
    description: 'An evergreen tree with glossy foliage and edible purplish-red berries.'
  },
  {
    name: 'Banyan Tree',
    scientific_name: 'FICUS BENGALENSIS',
    family: 'MORACEAE',
    common_name_english: 'Banyan Tree',
    common_name_malayalam: 'പേരാൽ',
    native_range: 'India & Pakistan',
    species: 'FICUS BENGALENSIS',
    location: 'EMEA College',
    description: 'A massive fig tree that spreads by dropping aerial roots from its branches.'
  },
  {
    name: 'Chikoo',
    scientific_name: 'MANILKARA ZAPOTA',
    family: 'SAPOTACEAE',
    common_name_english: 'Chikoo',
    common_name_malayalam: 'സപ്പോട്ട',
    native_range: 'Mexico to Colombia',
    species: 'MANILKARA ZAPOTA',
    location: 'EMEA College',
    description: 'A fruit tree producing sweet, brown sapota fruits; its sap is used for chewing gum.'
  },
  {
    name: 'Lipstick Tree',
    scientific_name: 'BIXA ORELLANA',
    family: 'BIXACEAE',
    common_name_english: 'Lipstick Tree',
    native_range: 'Mexico to South Tropical America',
    species: 'BIXA ORELLANA',
    location: 'EMEA College',
    description: 'A shrub whose seeds yield a red-orange dye used for food coloring and cosmetics.'
  },
  {
    name: 'Plumeria',
    scientific_name: 'PLUMERIA PUDICA',
    family: 'APOCYNACEAE',
    common_name_english: 'Plumeria',
    native_range: 'Panama, Colombia & Venezuela',
    species: 'PLUMERIA PUDICA',
    location: 'EMEA College',
    description: 'A flowering tree with white flowers and unique spoon-shaped leaves.'
  },
  {
    name: 'Adenocalymma',
    scientific_name: 'ADENOCALYMMA IMPERATORIS-MAXIMILIANII',
    family: 'BIGNONIACEAE',
    species: 'ADENOCALYMMA IMPERATORIS-MAXIMILIANII',
    location: 'EMEA College',
    description: 'A climbing vine with showy yellow flowers.'
  },
  {
    name: 'Parakeet Flower',
    scientific_name: 'HELICONIA PSITTACORUM',
    family: 'HELICONIACEAE',
    common_name_english: 'Parakeet Flower',
    native_range: 'Caribbean',
    species: 'HELICONIA PSITTACORUM',
    location: 'EMEA College',
    description: 'A tropical plant with colorful, bird-like flower bracts.'
  },
  {
    name: 'Variegated Screwpine',
    scientific_name: 'PANDANUS TECTORIUS "Variegata"',
    family: 'PANDANACEAE',
    common_name_english: 'Screwpine',
    species: 'PANDANUS TECTORIUS',
    location: 'EMEA College',
    description: 'A palm-like tree with long, sword-shaped leaves arranged in a spiral pattern.'
  },
  {
    name: 'Hakkinan Banana',
    scientific_name: 'MUSA HAEKKINENII',
    family: 'MUSACEAE',
    common_name_malayalam: 'ഹക്കിനാൻ വാഴ',
    native_range: 'Vietnam',
    species: 'MUSA HAEKKINENII',
    location: 'EMEA College',
    description: 'A species of wild banana native to Vietnam.'
  },
  {
    name: 'Golden Philodendron',
    scientific_name: 'PHILODENDRON GOLDEN MELINONII',
    family: 'ARACEAE',
    species: 'PHILODENDRON GOLDEN MELINONII',
    location: 'EMEA College',
    description: 'A climbing philodendron with large, glossy leaves with golden variegation.'
  },
  {
    name: 'Chinese Croton',
    scientific_name: 'EXCOECARIA BICOLOR "Variegata"',
    family: 'EUPHORBIACEAE',
    common_name_english: 'Chinese Croton',
    species: 'EXCOECARIA BICOLOR',
    location: 'EMEA College',
    description: 'An ornamental shrub with variegated leaves, red on the underside.'
  },
  {
    name: 'White Champak',
    scientific_name: 'MICHELIA ALBA',
    family: 'MAGNOLIACEAE',
    common_name_english: 'White Champak',
    common_name_malayalam: 'വെള്ളച്ചെമ്പകം',
    native_range: 'Southeast Asia',
    species: 'MICHELIA ALBA',
    location: 'EMEA College',
    description: 'A tropical tree with strongly fragrant white flowers used in perfumery.'
  },
  {
    name: 'Mangosteen',
    scientific_name: 'GARCINIA MANGOSTANA',
    family: 'CLUSIACEAE',
    common_name_english: 'Mangosteen',
    common_name_malayalam: 'മാംഗോസ്റ്റിൻ',
    native_range: 'Southeast Asia',
    species: 'GARCINIA MANGOSTANA',
    location: 'EMEA College',
    description: 'A slow-growing tropical evergreen tree that produces sweet, purple fruits.'
  },
  {
    name: 'Acacia',
    scientific_name: 'ACACIA AURICULIFORMIS',
    family: 'FABACEAE',
    common_name_english: 'Acacia',
    common_name_malayalam: 'അക്കേഷ്യ',
    native_range: 'New Guinea & Northern Australia',
    species: 'ACACIA AURICULIFORMIS',
    location: 'EMEA College',
    description: 'A fast-growing, nitrogen-fixing tree used for reforestation and fuel wood.'
  },
  {
    name: 'Copper Pod Tree',
    scientific_name: 'PELTOPHORUM PTEROCARPUM',
    family: 'FABACEAE',
    common_name_english: 'Copper Pod Tree',
    common_name_malayalam: 'ചാരക്കൊന്ന',
    native_range: 'Indo-China, Northern Australia',
    species: 'PELTOPHORUM PTEROCARPUM',
    location: 'EMEA College',
    description: 'A deciduous tree with a spreading crown and bright yellow flowers.'
  },
  {
    name: 'Maharukh',
    scientific_name: 'AILANTHUS TRIPHYSA',
    family: 'SIMAROUBACEAE',
    common_name_english: 'Maharukh',
    common_name_malayalam: 'മട്ടി',
    species: 'AILANTHUS TRIPHYSA',
    location: 'EMEA College',
    description: 'A deciduous tree with fragrant flowers and medicinal bark.'
  },
  {
    name: 'Paper Flower Climber',
    scientific_name: 'GETONIA FLORIBUNDA',
    family: 'COMBRETACEAE',
    common_name_english: 'Paper Flower Climber',
    common_name_malayalam: 'പുല്ലാനി',
    native_range: 'India, China, Malaysia',
    species: 'GETONIA FLORIBUNDA',
    location: 'EMEA College',
    description: 'A woody climber with papery, persistent sepals that aid in wind dispersal of seeds.'
  },
  {
    name: 'Cemetery Tree',
    scientific_name: 'MONOON LONGIFOLIUM',
    family: 'ANNONACEAE',
    common_name_english: 'Polyalthia, Cemetery Tree',
    common_name_malayalam: 'അരണമരം',
    native_range: 'Southern India & Sri Lanka',
    species: 'MONOON LONGIFOLIUM',
    location: 'EMEA College',
    description: 'An evergreen tree often planted in cemeteries and as an ornamental.'
  },
  {
    name: 'Indian Tulip Tree',
    scientific_name: 'THESPESIA POPULNEA',
    family: 'MALVACEAE',
    common_name_english: 'Indian Tulip Tree',
    common_name_malayalam: 'പൂവരശ്',
    species: 'THESPESIA POPULNEA',
    location: 'EMEA College',
    description: 'A coastal tree with heart-shaped leaves and yellow flowers that turn purple.'
  },
  {
    name: 'Pinto Peanut',
    scientific_name: 'ARACHIS PINTOI',
    family: 'FABACEAE',
    common_name_english: 'Pinto Peanut',
    native_range: 'Eastern Brazil',
    species: 'ARACHIS PINTOI',
    location: 'EMEA College',
    description: 'A perennial ground cover with yellow flowers, used for erosion control.'
  },
  {
    name: 'South Indian Plum',
    scientific_name: 'SYZYGIUM CARYOPHYLLATUM',
    family: 'MYRTACEAE',
    common_name_english: 'South Indian Plum',
    common_name_malayalam: 'ചെറുഞാറ',
    native_range: 'India & Sri Lanka',
    species: 'SYZYGIUM CARYOPHYLLATUM',
    location: 'EMEA College',
    description: 'A small tree with edible fruits that turn black when ripe.'
  },
  {
    name: 'Kindal Tree',
    scientific_name: 'TERMINALIA PANICULATA',
    family: 'COMBRETACEAE',
    common_name_english: 'Kindal Tree',
    common_name_malayalam: 'മരുത്',
    native_range: 'Southern India',
    species: 'TERMINALIA PANICULATA',
    location: 'EMEA College',
    description: 'A deciduous tree with winged fruits and bark used for tanning.'
  },
  {
    name: 'Red Ivy',
    scientific_name: 'STROBILANTHES ALTERNATA',
    family: 'ACANTHACEAE',
    common_name_english: 'Red Ivy',
    common_name_malayalam: 'മുറികൂട്ടി',
    native_range: 'Eastern Malaysia',
    species: 'STROBILANTHES ALTERNATA',
    location: 'EMEA College',
    description: 'A small shrub with red-tinged foliage and blue flowers.'
  },
  {
    name: 'Honey Myrtle',
    scientific_name: 'MELALEUCA LINARIIFOLIA',
    family: 'MYRTACEAE',
    common_name_english: 'Honey Myrtle',
    native_range: 'Australia',
    species: 'MELALEUCA LINARIIFOLIA',
    location: 'EMEA College',
    description: 'A paperbark tree with small, white, honey-scented flowers in dense spikes.'
  },
  {
    name: 'Red Silk Cotton Tree',
    scientific_name: 'BOMBAX CEIBA',
    family: 'MALVACEAE',
    common_name_english: 'Red Silk Cotton Tree',
    common_name_malayalam: 'മുള്ളിലം',
    native_range: 'Tropical Asia to Northern Australia',
    species: 'BOMBAX CEIBA',
    location: 'EMEA College',
    description: 'A large deciduous tree with bright red flowers and a spiny trunk.'
  },
  {
    name: 'Cashew Nut Tree',
    scientific_name: 'ANACARDIUM OCCIDENTALE',
    family: 'ANACARDIACEAE',
    common_name_english: 'Cashew Nut Tree',
    common_name_malayalam: 'കശുമാവ്',
    native_range: 'South America',
    species: 'ANACARDIUM OCCIDENTALE',
    location: 'EMEA College',
    description: 'A tropical tree that produces cashew nuts and cashew apples.'
  },
  {
    name: 'Mauritius Hemp',
    scientific_name: 'FURCRAEA FOETIDA',
    family: 'AGAVACEAE',
    common_name_english: 'Mauritius Hemp',
    native_range: 'Northern South America & Caribbean',
    species: 'FURCRAEA FOETIDA',
    location: 'EMEA College',
    description: 'A succulent plant with a rosette of long, sword-shaped leaves, used for fiber.'
  },
  {
    name: 'Glorybower',
    scientific_name: 'CLERODENDRUM SPLENDENS',
    family: 'LAMIACEAE',
    common_name_english: 'Glorybower',
    native_range: 'Tropical West Africa',
    species: 'CLERODENDRUM SPLENDENS',
    location: 'EMEA College',
    description: 'A climbing shrub with clusters of bright red flowers.'
  },
  {
    name: 'Mouse Tail Plant',
    scientific_name: 'PHYLLANTHUS MYRTIFOLIUS',
    family: 'PHYLLANTHACEAE',
    common_name_english: 'Mouse Tail Plant',
    native_range: 'Sri Lanka',
    species: 'PHYLLANTHUS MYRTIFOLIUS',
    location: 'EMEA College',
    description: 'An ornamental shrub with small leaves arranged along the branches like a mouse tail.'
  }
];

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions

export const getTrees = async (): Promise<ApiResponse<Tree[]>> => {
  try {
    // Get trees from Supabase
    const { data, error } = await supabase
      .from('trees')
      .select('*');
    
    if (error) throw error;
    
    // If data is available from Supabase, use it
    if (data && data.length > 0) {
      const formattedTrees = data.map(tree => ({
        ...tree,
        id: tree.id,
        name: tree.name,
        scientific_name: tree.scientific_name,
        family: tree.family,
        common_name_english: tree.common_name_english,
        common_name_malayalam: tree.common_name_malayalam || undefined,
        native_range: tree.native_range || undefined,
        species: tree.species,
        location: tree.location,
        description: tree.description || '',
        imageUrl: tree.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(tree.added_date).toISOString().split('T')[0],
        pendingImage: !tree.image_url || tree.image_url.includes('placeholder') || tree.image_url.includes('unsplash'),
      }));
      return { success: true, data: formattedTrees };
    }
    
    // Fall back to mock data if no data in Supabase
    return { success: true, data: MOCK_TREES };
  } catch (error) {
    console.error('Error fetching trees:', error);
    return { success: false, error: 'Failed to fetch trees' };
  }
};

export const getTree = async (id: string): Promise<ApiResponse<Tree>> => {
  try {
    // Try to get tree from Supabase
    const { data, error } = await supabase
      .from('trees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // If found in Supabase, return it
    if (data) {
      const formattedTree = {
        id: data.id,
        name: data.name,
        scientific_name: data.scientific_name,
        family: data.family,
        common_name_english: data.common_name_english,
        common_name_malayalam: data.common_name_malayalam || undefined,
        native_range: data.native_range || undefined,
        species: data.species,
        location: data.location,
        description: data.description || '',
        imageUrl: data.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(data.added_date).toISOString().split('T')[0],
        pendingImage: !data.image_url || data.image_url.includes('placeholder') || data.image_url.includes('unsplash'),
      };
      return { success: true, data: formattedTree };
    }
    
    // Fall back to mock data
    const tree = MOCK_TREES.find(t => t.id === id);
    if (!tree) {
      return { success: false, error: 'Tree not found' };
    }
    return { success: true, data: tree };
  } catch (error) {
    console.error(`Error fetching tree ${id}:`, error);
    return { success: false, error: 'Failed to fetch tree details' };
  }
};

export const addTree = async (treeData: TreeFormData): Promise<ApiResponse<Tree>> => {
  try {
    // Handle image upload if provided
    let imageUrl = null;
    
    if (treeData.image && !treeData.skipImageUpload) {
      const fileExt = treeData.image.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `trees/${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('trees')
        .upload(filePath, treeData.image);
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue with adding the tree, but without an image
      } else if (uploadData) {
        // Get the public URL
        const { data } = supabase.storage.from('trees').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }
    
    // Prepare the data for Supabase
    const treeRecord = {
      name: treeData.name || '',
      scientific_name: treeData.scientific_name || '',
      family: treeData.family || '',
      common_name_english: treeData.common_name_english || '',
      common_name_malayalam: treeData.common_name_malayalam || null,
      native_range: treeData.native_range || null,
      species: treeData.species || '',
      location: treeData.location || 'EMEA College',
      description: treeData.description || null,
      image_url: imageUrl
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('trees')
      .insert(treeRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    if (data) {
      const newTree: Tree = {
        id: data.id,
        name: data.name,
        scientific_name: data.scientific_name,
        family: data.family,
        common_name_english: data.common_name_english,
        common_name_malayalam: data.common_name_malayalam,
        native_range: data.native_range,
        species: data.species,
        location: data.location,
        description: data.description || '',
        imageUrl: data.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(data.added_date).toISOString().split('T')[0],
        pendingImage: !data.image_url
      };
      
      return { success: true, data: newTree };
    }
    
    // Fallback to mock implementation
    const newTree: Tree = {
      id: String(Date.now()),
      name: treeData.name,
      scientific_name: treeData.scientific_name,
      family: treeData.family,
      common_name_english: treeData.common_name_english,
      common_name_malayalam: treeData.common_name_malayalam,
      native_range: treeData.native_range,
      species: treeData.species,
      location: treeData.location,
      description: treeData.description || '',
      imageUrl: treeData.skipImageUpload ? 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86' : (treeData.image ? URL.createObjectURL(treeData.image) : 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86'),
      addedDate: new Date().toISOString().split('T')[0],
      pendingImage: treeData.skipImageUpload || !treeData.image
    };
    
    return { success: true, data: newTree };
  } catch (error) {
    console.error('Error adding tree:', error);
    return { success: false, error: 'Failed to add tree' };
  }
};

export const uploadTreeImage = async (data: TreeImageUploadData): Promise<ApiResponse<Tree>> => {
  try {
    const { treeId, image } = data;
    
    // Get the current tree data
    const { data: treeData, error: fetchError } = await supabase
      .from('trees')
      .select('*')
      .eq('id', treeId)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!treeData) {
      return { success: false, error: 'Tree not found' };
    }
    
    // Upload the image to Supabase Storage
    const fileExt = image.name.split('.').pop() || 'jpg';
    const fileName = `tree_${treeId}_${Date.now()}.${fileExt}`;
    const filePath = `trees/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trees')
      .upload(filePath, image);
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return { success: false, error: `Image upload failed: ${uploadError.message}` };
    }
    
    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage.from('trees').getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;
    
    // Update the tree with the new image URL
    const { data: updatedTree, error: updateError } = await supabase
      .from('trees')
      .update({ image_url: imageUrl })
      .eq('id', treeId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    if (updatedTree) {
      const tree: Tree = {
        id: updatedTree.id,
        name: updatedTree.name,
        scientific_name: updatedTree.scientific_name,
        family: updatedTree.family,
        common_name_english: updatedTree.common_name_english,
        common_name_malayalam: updatedTree.common_name_malayalam,
        native_range: updatedTree.native_range,
        species: updatedTree.species,
        location: updatedTree.location,
        description: updatedTree.description || '',
        imageUrl: updatedTree.image_url || imageUrl,
        addedDate: new Date(updatedTree.added_date).toISOString().split('T')[0],
        pendingImage: false
      };
      
      return { success: true, data: tree };
    }
    
    return { 
      success: false, 
      error: 'Failed to update tree with new image' 
    };
  } catch (error) {
    console.error('Error uploading tree image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

// Add a function to bulk add the predefined trees
export const addPredefinedTrees = async (): Promise<ApiResponse<Tree[]>> => {
  try {
    const addedTrees: Tree[] = [];
    
    for (const treeData of PREDEFINED_TREES) {
      // Format the tree data for insertion
      const treeRecord = {
        name: treeData.name || '',
        scientific_name: treeData.scientific_name || '',
        family: treeData.family || '',
        common_name_english: treeData.common_name_english || '',
        common_name_malayalam: treeData.common_name_malayalam || null,
        native_range: treeData.native_range || null,
        species: treeData.species || '',
        location: treeData.location || 'EMEA College',
        description: treeData.description || null,
        image_url: null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('trees')
        .insert(treeRecord)
        .select()
        .single();
        
      if (error) {
        console.error(`Error adding tree ${treeData.name}:`, error);
        continue; // Skip to the next tree if there's an error
      }
      
      if (data) {
        const newTree: Tree = {
          id: data.id,
          name: data.name,
          scientific_name: data.scientific_name,
          family: data.family,
          common_name_english: data.common_name_english,
          common_name_malayalam: data.common_name_malayalam,
          native_range: data.native_range,
          species: data.species,
          location: data.location,
          description: data.description || '',
          imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
          addedDate: new Date(data.added_date).toISOString().split('T')[0],
          pendingImage: true
        };
        
        addedTrees.push(newTree);
      }
    }
    
    return { 
      success: true, 
      data: addedTrees,
      error: addedTrees.length < PREDEFINED_TREES.length 
        ? `Successfully added ${addedTrees.length} of ${PREDEFINED_TREES.length} trees.` 
        : undefined
    };
  } catch (error) {
    console.error('Error adding predefined trees:', error);
    return { success: false, error: 'Failed to add predefined trees' };
  }
};

export default api;
