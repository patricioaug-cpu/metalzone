import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updatePassword
} from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager,
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  where,
  getDocFromServer
} from "firebase/firestore";
import { ADDITIONAL_SEED_BANDS } from "./additional_bands";

// Firebase web configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyD9yIsoYNfhv_8MLqQvQBLAKidudhS0Mcc",
  authDomain: "angular-pathway-gjlsj.firebaseapp.com",
  projectId: "angular-pathway-gjlsj",
  storageBucket: "angular-pathway-gjlsj.firebasestorage.app",
  messagingSenderId: "209742393290",
  appId: "1:209742393290:web:d1487093e5988b21eb6933"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, "ai-studio-6ac61fd6-dbd2-4b02-83bf-013943ce0462");

// Verify Connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client appears offline or needs setup verification.");
    }
  }
}
testConnection();

export { auth, db };

// Interfaces for our application
export interface BandMember {
  name: string;
  role: string;
  status: "active" | "former";
}

export interface DiscographyItem {
  title: string;
  year: number;
  type: "Album" | "EP" | "Single";
}

export interface Band {
  id?: string;
  name: string;
  logoUrl?: string;
  photoUrl?: string;
  logoPlaceholderText?: string;
  country: string;
  formationYear: number;
  genre: string; // Specific (e.g. Melodic Death Metal, Brutal Death Metal, Atmospheric Black Metal)
  bio: { [lang: string]: string } | string; // support multi-language bio
  members: BandMember[];
  discography: DiscographyItem[];
  socials: {
    spotify?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  contacts: {
    email?: string;
    phone?: string;
  };
  approved: boolean;
  submittedBy: string;
  sourceUrl?: string;
  createdAt?: any;
}

export interface EventItem {
  id?: string;
  name: string;
  date: string;
  location: string; // City + Country
  lineup: string[]; // Names of bands
  ticketLink?: string;
  imageUrl?: string;
  isFestival: boolean;
  countdownDate?: string; // used if isFestival
  approved: boolean;
  submittedBy: string;
  createdAt?: any;
}

export interface MerchItem {
  id?: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  purchaseLink: string;
}

// Rich multi-language localized static seed fallback data
export const SEED_BANDS: Band[] = [
  {
    id: "seed-band-1",
    name: "Iron Maiden",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Iron_Maiden_-_Wacken_Open_Air_2016_07.jpg",
    logoPlaceholderText: "Classic yellow metal stamp logo",
    country: "United Kingdom",
    formationYear: 1975,
    genre: "New Wave of British Heavy Metal (NWOBHM)",
    bio: {
      pt: "Uma das bandas mais influentes no heavy metal, os ícones britânicos do Iron Maiden moldaram o gênero com guitarras gêmeas harmonizadas, os vocais operáticos de Bruce Dickinson e seu mascote icônico Eddie.",
      en: "One of the most influential and enduring heavy metal bands of all time, British icons Iron Maiden pioneered the NWOBHM sound with harmonized twin guitars, Bruce Dickinson's operatic vocals, and their iconic mascot Eddie.",
      es: "Una de las bandas de heavy metal más influyentes de todos los tiempos, los iconos británicos Iron Maiden fueron pioneros del sonido NWOBHM con guitarras gemelas armonizadas, la voz operística de Bruce Dickinson y su icónica mascota Eddie."
    },
    members: [
      { name: "Bruce Dickinson", role: "Vocals", status: "active" },
      { name: "Steve Harris", role: "Bass", status: "active" },
      { name: "Dave Murray", role: "Guitar", status: "active" },
      { name: "Adrian Smith", role: "Guitar", status: "active" },
      { name: "Janick Gers", role: "Guitar", status: "active" },
      { name: "Nicko McBrain", role: "Drums", status: "active" },
      { name: "Paul Di'Anno", role: "Former Vocals", status: "former" }
    ],
    discography: [
      { title: "Iron Maiden", year: 1980, type: "Album" },
      { title: "The Number of the Beast", year: 1982, type: "Album" },
      { title: "Powerslave", year: 1984, type: "Album" },
      { title: "Seventh Son of a Seventh Son", year: 1988, type: "Album" },
      { title: "Senjutsu", year: 2021, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/6S2g1Cj0p9g47g2I0ZnhA1",
      instagram: "@ironmaiden",
      website: "https://www.ironmaiden.com"
    },
    contacts: {
      email: "management@phantommusic.co.uk",
      phone: "+44 207 439 7733"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-2",
    name: "Death",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Death_To_All_-_Graspop_Metal_Meeting_2015_01.jpg",
    logoPlaceholderText: "Classic bloody gore spike logo",
    country: "United States",
    formationYear: 1983,
    genre: "Technical Death Metal",
    bio: {
      pt: "Liderada pelo brilhante guitarrista e vocalista Chuck Schuldiner (o pioneiro influente do death metal), a banda Death evoluiu de um som brutal e cru para um death metal altamente progressivo e técnico, mudando a história da música agressiva.",
      en: "Led by mastermind guitarist/vocalist Chuck Schuldiner, widely regarded as a key pioneer of death metal, Death evolved from raw primitive speed brutality into a highly technical, philosophical, and progressive force.",
      es: "Liderada por el guitarrista y vocalista Chuck Schuldiner, considerado un pionero clave del death metal, Death evolucionó desde una brutalidad cruda hacia una fuerza altamente técnica, filosófica y progresiva."
    },
    members: [
      { name: "Chuck Schuldiner", role: "Guitar, Vocals", status: "active" },
      { name: "Gene Hoglan", role: "Drums", status: "former" },
      { name: "Steve Di Giorgio", role: "Bass", status: "former" },
      { name: "Shannon Hamm", role: "Guitar", status: "former" }
    ],
    discography: [
      { title: "Scream Bloody Gore", year: 1987, type: "Album" },
      { title: "Leprosy", year: 1988, type: "Album" },
      { title: "Human", year: 1991, type: "Album" },
      { title: "Individual Thought Patterns", year: 1993, type: "Album" },
      { title: "Symbolic", year: 1995, type: "Album" },
      { title: "The Sound of Perseverance", year: 1998, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/4X96O0S6Zor6p6gZ7pGpqS",
      instagram: "@deathofficial",
      website: "https://www.metalblade.com/death"
    },
    contacts: {
      email: "bookings@emptywords.org",
      phone: "+1 407 555 9821"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-3",
    name: "Dream Theater",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Dream_Theater_-_Wacken_Open_Air_2015_04.jpg",
    logoPlaceholderText: "Majesty symbol majestic monogram",
    country: "United States",
    formationYear: 1985,
    genre: "Progressive Metal",
    bio: {
      pt: "Gigantes pioneiros do metal progressivo moderno. Unindo a agressividade do metal clássico e a brilhante complexidade do rock progressivo britânico dos anos 70, com solos virtuosos insanos.",
      en: "The undisputed pioneers of modern progressive metal. Blending the heavy aggression of traditional metal with the intricate, virtuoso complexity of 70s progressive rock.",
      es: "Los pioneros indiscutibles del metal progresivo moderno. Mezclando la agresión del metal tradicional con la compleja complejidad virtuosa del rock progresivo de los 70."
    },
    members: [
      { name: "James LaBrie", role: "Vocals", status: "active" },
      { name: "John Petrucci", role: "Guitar, Backing Vocals", status: "active" },
      { name: "Mike Portnoy", role: "Drums, Vocals", status: "active" },
      { name: "John Myung", role: "Bass", status: "active" },
      { name: "Jordan Rudess", role: "Keyboards", status: "active" }
    ],
    discography: [
      { title: "Images and Words", year: 1992, type: "Album" },
      { title: "Metropolis Pt. 2: Scenes from a Memory", year: 1999, type: "Album" },
      { title: "Octavarium", year: 2005, type: "Album" },
      { title: "Parasomnia", year: 2025, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/2aa7Z67by0tSgL6wHGn36Y",
      instagram: "@dreamtheaterofficial",
      website: "https://www.dreamtheater.net"
    },
    contacts: {
      email: "press@dreamtheater.net",
      phone: "+1 212 555 9011"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-4",
    name: "Candlemass",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/de/Candlemass_-_Wacken_Open_Air_2016_01.jpg",
    logoPlaceholderText: "Classic thick epic doom cross logo",
    country: "Sweden",
    formationYear: 1984,
    genre: "Epic Doom Metal",
    bio: {
      pt: "Mestres suecos do doom metal tradicional. Seus riffs ultra lentos, pesados e vocais quase religiosos definiram os pilares do doom metal épico em clássicos eternos de melancolia medieval.",
      en: "Swedish masters of traditional doom metal. Their ultra-slow, crushing riffs, crushing basslines, and operatic, theatrical vocals defined the blueprint of Epic Doom Metal with tales of grief and ancient magic.",
      es: "Maestros suecos del doom metal tradicional. Sus riffs lentos y aplastantes, y su voz operística definieron el plano del Doom Metal Épico lleno de tristeza medieval."
    },
    members: [
      { name: "Johan Längqvist", role: "Vocals", status: "active" },
      { name: "Leif Edling", role: "Bass, Songwriting", status: "active" },
      { name: "Mappe Björkman", role: "Guitar", status: "active" },
      { name: "Lars Johansson", role: "Guitar", status: "active" },
      { name: "Jan Lindh", role: "Drums", status: "active" },
      { name: "Messiah Marcolin", role: "Former Vocals", status: "former" }
    ],
    discography: [
      { title: "Epicus Doomicus Metallicus", year: 1986, type: "Album" },
      { title: "Nightfall", year: 1987, type: "Album" },
      { title: "Ancient Dreams", year: 1988, type: "Album" },
      { title: "The Door to Doom", year: 2019, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/194g9f6ZJgC0A62XFhCidD",
      instagram: "@candlemassbyedling",
      website: "https://www.candlemass.se"
    },
    contacts: {
      email: "booking@candlemass.se",
      phone: "+46 8 500 1201"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-5",
    name: "Sepultura",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sepultura_-_Wacken_Open_Air_2018_09.jpg",
    logoPlaceholderText: "Sharp aggressive tribal metal thrash logo",
    country: "Brazil",
    formationYear: 1984,
    genre: "Thrash / Groove Metal",
    bio: {
      pt: "Nascida em Belo Horizonte, Minas Gerais, o Sepultura levou o metal brasileiro para o cenário global. Com raízes no thrash e death metal, a banda revolucionou a música mundial ao fundir o peso do metal com ritmos tribais brasileiros e parcerias icônicas.",
      en: "Formed in Belo Horizonte, Brazil, Sepultura conquered the global metal scene. Starting as a raw black/death thrash force, they redefined heavy music with ground-breaking tribal percussion mixtures.",
      es: "Formada en Belo Horizonte, Brasil, Sepultura conquistó la escena del metal global. Inicialmente thrash metal crudo, transformaron la música pesada al fusionar metal con percusión tribal tradicional de Brasil."
    },
    members: [
      { name: "Andreas Kisser", role: "Guitars", status: "active" },
      { name: "Derrick Green", role: "Vocals", status: "active" },
      { name: "Paulo Jr.", role: "Bass", status: "active" },
      { name: "Greyson Nekrutman", role: "Drums", status: "active" },
      { name: "Max Cavalera", role: "Former Vocals/Guitars", status: "former" },
      { name: "Iggor Cavalera", role: "Former Drums", status: "former" }
    ],
    discography: [
      { title: "Morbid Visions", year: 1986, type: "Album" },
      { title: "Schizophrenia", year: 1987, type: "Album" },
      { title: "Beneath the Remains", year: 1989, type: "Album" },
      { title: "Arise", year: 1991, type: "Album" },
      { title: "Chaos A.D.", year: 1993, type: "Album" },
      { title: "Roots", year: 1996, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/6m799XAsv27vdRIsfXAnQh",
      instagram: "@sepultura",
      website: "https://www.sepultura.com.br"
    },
    contacts: {
      email: "booking@sepultura.com",
      phone: "+55 11 98888-7777"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-6",
    name: "Angra",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Angra_at_Le_Forum_in_2015.jpg",
    logoPlaceholderText: "Elegant neoclassical power fire logo",
    country: "Brazil",
    formationYear: 1991,
    genre: "Neoclassical Power / Progressive Metal",
    bio: {
      pt: "Uma das maiores expressões do metal melódico global, o Angra de São Paulo combina impecavelmente arranjos neoclássicos, guitarras harmonizadas ultrarrápidas, e música folclórica brasileira e progressiva de forma genial.",
      en: "One of the absolute premier forces in progressive power metal, Angra blends neoclassical symphonic precision, rapid-fire dual guitars, and subtle Brazilian traditional regional music.",
      es: "Una de las mayores fuerzas del power progressive metal, Angra de São Paulo fusiona arreglos melódicos neoclásicos, solos dobles ultrarrápidos y folclore brasileño tradicional."
    },
    members: [
      { name: "Rafael Bittencourt", role: "Guitars", status: "active" },
      { name: "Felipe Andreoli", role: "Bass", status: "active" },
      { name: "Fabio Lione", role: "Vocals", status: "active" },
      { name: "Marcelo Barbosa", role: "Guitars", status: "active" },
      { name: "Bruno Valverde", role: "Drums", status: "active" },
      { name: "Andre Matos", role: "Former Vocals (R.I.P.)", status: "former" },
      { name: "Kiko Loureiro", role: "Former Guitars", status: "former" }
    ],
    discography: [
      { title: "Angels Cry", year: 1993, type: "Album" },
      { title: "Holy Land", year: 1996, type: "Album" },
      { title: "Rebirth", year: 2001, type: "Album" },
      { title: "Temple of Shadows", year: 2004, type: "Album" },
      { title: "Cycles of Pain", year: 2023, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/776Sg79v6SclRdfnI6pE8G",
      instagram: "@angraofficial",
      website: "https://www.angra.net"
    },
    contacts: {
      email: "management@angra.net",
      phone: "+55 11 97777-6666"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-7",
    name: "Sarcófago",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Behemoth_live_at_Wacken_2018.jpg",
    logoPlaceholderText: "Raw black spike horror crypt logo",
    country: "Brazil",
    formationYear: 1985,
    genre: "First Wave Black / Death Metal",
    bio: {
      pt: "Formada em Belo Horizonte, Minas Gerais, é amplamente celebrada em enciclopédias oficiais de metal como a Metal-Archives por pavimentar o caminho do black metal extremo mundial. Sua estética agressiva com maquiagem corpse paint influenciou diretamente a renomada cena escandinava e norueguesa.",
      en: "Formed in Belo Horizonte, Brazil, Sarcófago is highly celebrated by official encylopedias like Metal-Archives for pioneering raw, extreme black and death metal. Their blast beats, spiked leather, and corpse paint style heavily inspired the European black metal scene.",
      es: "Formada en Belo Horizonte, Sarcófago es altamente celebrada por enciclopedias oficiales como Metal-Archives por pavimentar el camino del brutal black y death metal extremo. Su estética de maquillaje pintoresco influyó directamente en la escena escandinava."
    },
    members: [
      { name: "Wagner Lamounier", role: "Vocals, Guitars", status: "active" },
      { name: "Gerald Minelli", role: "Bass", status: "active" },
      { name: "Zéder Patrício", role: "Guitars", status: "former" },
      { name: "Eduardo Pompu", role: "Drums", status: "former" }
    ],
    discography: [
      { title: "I.N.R.I.", year: 1987, type: "Album" },
      { title: "Rotting", year: 1989, type: "EP" },
      { title: "The Laws of Scourge", year: 1991, type: "Album" },
      { title: "Hate", year: 1994, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/4hXvR9m9wY2X6w4p16yF1G",
      instagram: "@sarcofagometalbg",
      website: "https://www.cogumelo.com.br"
    },
    contacts: {
      email: "cogumelobookings@cogumelo.com",
      phone: "+55 31 3224-0493"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-8",
    name: "Black Sabbath",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/42/Black_Sabbath_1970.jpg",
    logoPlaceholderText: "Purple typography occult metal cross shield logo",
    country: "United Kingdom",
    formationYear: 1968,
    genre: "Traditional Doom / Heavy Metal",
    bio: {
      pt: "Os padrinhos absolutos e criadores do Heavy Metal. Nascida nas indústrias cinzentas de Birmingham, a banda foi liderada pelos riffs pesados de Tony Iommi e o carisma de Ozzy Osbourne, desenhando a estética sombria de toda a música pesada moderna.",
      en: "The founding fathers who spawned Heavy Metal. Hailing from industrial Birmingham, the heavy riffs of Tony Iommi and the ominous charisma of Ozzy Osbourne birthed the occult, slow, and crushed sounds of heavy metal.",
      es: "Los padres fundadores que sembraron el Heavy Metal. Nacidos de la Birmingham industrial, los pesados acordes de Tony Iommi y el carisma lúgubre de Ozzy Osbourne gestaron toda la gama del metal gótico y doom."
    },
    members: [
      { name: "Tony Iommi", role: "Guitars", status: "active" },
      { name: "Ozzy Osbourne", role: "Vocals", status: "active" },
      { name: "Geezer Butler", role: "Bass", status: "active" },
      { name: "Bill Ward", role: "Drums", status: "active" },
      { name: "Ronnie James Dio", role: "Former Vocals (R.I.P.)", status: "former" }
    ],
    discography: [
      { title: "Black Sabbath", year: 1970, type: "Album" },
      { title: "Paranoid", year: 1970, type: "Album" },
      { title: "Master of Reality", year: 1971, type: "Album" },
      { title: "Heaven and Hell", year: 1980, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/5SgND9v6SclRdfnI6pE8G",
      instagram: "@blacksabbath",
      website: "https://www.blacksabbath.com"
    },
    contacts: {
      email: "sabbookings@birminghamrocks.co.uk",
      phone: "+44 121 555-0101"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-9",
    name: "Slayer",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Slayer_-_Wacken_Open_Air_2014_05.jpg",
    logoPlaceholderText: "Metallic red swords military star slayer logo",
    country: "United States",
    formationYear: 1981,
    genre: "Extreme Thrash Metal",
    bio: {
      pt: "Considerada a face mais agressiva da realeza do thrash metal estadounidense. Conhecidos por seus andamentos ultrarrápidos, solos caóticos e letras profanas, influenciaram quase todas as gerações de death e black metal subsequentes.",
      en: "Widely regarded as the most aggressive of the Thrash Metal royalty. Renowned for their breakneck-speed tempos, chaotic chromatic twin solos, and dark themes that inspired death and black metal.",
      es: "Considerada la versión más violenta de la realeza del thrash metal. Reconocidos por tempos vertiginosos, caóticos solos duales y temática oscura que inspiró al death y black metal mundiales."
    },
    members: [
      { name: "Kerry King", role: "Guitars", status: "active" },
      { name: "Tom Araya", role: "Vocals, Bass", status: "active" },
      { name: "Gary Holt", role: "Guitars", status: "active" },
      { name: "Paul Bostaph", role: "Drums", status: "active" },
      { name: "Jeff Hanneman", role: "Former Guitars (R.I.P.)", status: "former" },
      { name: "Dave Lombardo", role: "Former Drums", status: "former" }
    ],
    discography: [
      { title: "Show No Mercy", year: 1983, type: "Album" },
      { title: "Hell Awaits", year: 1985, type: "Album" },
      { title: "Reign in Blood", year: 1986, type: "Album" },
      { title: "Seasons in the Abyss", year: 1990, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/1IQ2eBE6p78vdR",
      instagram: "@slayerbandofficial",
      website: "https://www.slayer.net"
    },
    contacts: {
      email: "slayer@americanrecordings.com",
      phone: "+1 310 555-6660"
    },
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-band-10",
    name: "Metallica",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/07/Metallica_at_The_O2_Arena_London_2017.jpg",
    logoPlaceholderText: "Classic metallic silver lightning letters logo",
    country: "United States",
    formationYear: 1981,
    genre: "Thrash / Heavy Metal",
    bio: {
      pt: "A banda de heavy metal de maior sucesso comercial da história da música nacional e internacional. Iniciando como uma força implacável do thrash californiano, evoluíram para turnês de estádio globais imensas sem perder os riffs pesados.",
      en: "The most commercially successful heavy metal band of all time. Starting as a fierce force of underground Californian thrash metal, they rose to conquer world stadiums while retaining classic riffs.",
      es: "La banda de heavy metal con mayor éxito comercial en la historia musical. Partiendo de un feroz thrash metal underground en California, conquistaron estadios enteros alrededor del mundo entero."
    },
    members: [
      { name: "James Hetfield", role: "Vocals, Rhythm Guitars", status: "active" },
      { name: "Lars Ulrich", role: "Drums", status: "active" },
      { name: "Kirk Hammett", role: "Lead Guitars", status: "active" },
      { name: "Robert Trujillo", role: "Bass", status: "active" },
      { name: "Cliff Burton", role: "Former Bass (R.I.P.)", status: "former" },
      { name: "Jason Newsted", role: "Former Bass", status: "former" }
    ],
    discography: [
      { title: "Kill 'Em All", year: 1983, type: "Album" },
      { title: "Ride the Lightning", year: 1984, type: "Album" },
      { title: "Master of Puppets", year: 1986, type: "Album" },
      { title: "...And Justice for All", year: 1988, type: "Album" },
      { title: "Metallica (The Black Album)", year: 1991, type: "Album" },
      { title: "72 Seasons", year: 2023, type: "Album" }
    ],
    socials: {
      spotify: "https://open.spotify.com/embed/artist/2ye2Wgw4gimnd3e9R6I4gY",
      instagram: "@metallica",
      website: "https://www.metallica.com"
    },
    contacts: {
      email: "bookings@qprime.com",
      phone: "+1 212 555-8800"
    },
    approved: true,
    submittedBy: "system"
  },
  ...ADDITIONAL_SEED_BANDS
].map((band, index) => ({
  ...band,
  id: band.id || `seed-band-add-${index}-${band.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
} as Band));

export const SEED_EVENTS: EventItem[] = [
  // --- GLOBAIS: Gigantes ---
  {
    id: "seed-festival-wacken",
    name: "Wacken Open Air (W.O.A)",
    date: "2026-07-29",
    location: "Wacken, Germany",
    lineup: ["Iron Maiden", "Judas Priest", "Amon Amarth", "Kreator", "Behemoth", "Lamb of God"],
    ticketLink: "https://www.wacken.com/en/tickets-shop/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Wacken_Open_Air_2018_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-07-29T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-hellfest",
    name: "Hellfest Open Air",
    date: "2026-06-18",
    location: "Clisson, France",
    lineup: ["Metallica", "Tool", "Machine Head", "Gojira", "Mastodon", "Opeth", "Lamb of God"],
    ticketLink: "https://www.hellfest.fr/en/tickets",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hellfest_2018_Crowd_and_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-06-18T10:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-download",
    name: "Download Festival",
    date: "2026-06-12",
    location: "Donington Park, United Kingdom",
    lineup: ["Queens of the Stone Age", "Fall Out Boy", "Avenged Sevenfold", "Pantera", "Megadeth"],
    ticketLink: "https://downloadfestival.co.uk/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Download_Festival_2017_Main_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-06-12T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-graspop",
    name: "Graspop Metal Meeting",
    date: "2026-06-19",
    location: "Dessel, Belgium",
    lineup: ["Alice Cooper", "Bruce Dickinson", "Deep Purple", "Megadeth", "Judas Priest"],
    ticketLink: "https://www.graspop.be/en/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Graspop_Metal_Meeting_2018_Mainstage.jpg",
    isFestival: true,
    countdownDate: "2026-06-19T11:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-swedenrock",
    name: "Sweden Rock Festival",
    date: "2026-06-03",
    location: "Sölvesborg, Sweden",
    lineup: ["Journey", "Evanescence", "Megadeth", "Alice Cooper", "The Hives"],
    ticketLink: "https://www.swedenrock.com/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Sweden_Rock_Festival_Main_Stage_2019.jpg",
    isFestival: true,
    countdownDate: "2026-06-03T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- GLOBAIS: Metal Pesado e Extremo ---
  {
    id: "seed-festival-brutalassault",
    name: "Brutal Assault",
    date: "2026-08-05",
    location: "Jaroměř, Czech Republic",
    lineup: ["Carcass", "Emperor", "Behemoth", "Satyricon", "Abbath", "Lamb of God"],
    ticketLink: "https://brutalassault.cz/en",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Brutal_Assault_2019_Stage_Lights.jpg",
    isFestival: true,
    countdownDate: "2026-08-05T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-bloodstock",
    name: "Bloodstock Open Air",
    date: "2026-08-06",
    location: "Derbyshire, England",
    lineup: ["Amon Amarth", "Architects", "Opeth", "Clutch", "Malevolence", "Lamb of God"],
    ticketLink: "https://www.bloodstock.uk.com/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Bloodstock_Festival_Main_Stage_2019.jpg",
    isFestival: true,
    countdownDate: "2026-08-06T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-marylanddeathfest",
    name: "Maryland Deathfest",
    date: "2026-05-21",
    location: "Baltimore, USA",
    lineup: ["Gorgoroth", "Obituary", "Blood Incantation", "Cryptopsy", "Incantation"],
    ticketLink: "https://www.deathfests.com/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Maryland_Deathfest_2016_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-05-21T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-inferno",
    name: "Inferno Metal Festival",
    date: "2026-04-02",
    location: "Oslo, Norway",
    lineup: ["Dimmu Borgir", "Taake", "Kampfar", "Gorgoroth", "Borknagar"],
    ticketLink: "https://www.infernofestival.net/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Inferno_Festival_Oslo_Stage_2018.jpg",
    isFestival: true,
    countdownDate: "2026-04-02T16:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- GLOBAIS: Modernos e Alternativos ---
  {
    id: "seed-festival-rockamring",
    name: "Rock am Ring / Rock im Park",
    date: "2026-06-05",
    location: "Nürburgring, Germany",
    lineup: ["Green Day", "Billy Talent", "Corey Taylor", "Babymetal", "Bad Omens"],
    ticketLink: "https://www.rock-am-ring.com/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/09/Rock_am_Ring_2018_Main_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-06-05T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-resurrection",
    name: "Resurrection Fest",
    date: "2026-06-24",
    location: "Viveiro, Spain",
    lineup: ["Avenged Sevenfold", "Alice Cooper", "Machine Head", "Bring Me The Horizon"],
    ticketLink: "https://www.resurrectionfest.es/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Resurrection_Fest_2019_Mainstage.jpg",
    isFestival: true,
    countdownDate: "2026-06-24T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-copenhell",
    name: "Copenhell",
    date: "2026-06-17",
    location: "Copenhagen, Denmark",
    lineup: ["Tool", "Dropkick Murphys", "Machine Head", "Uriah Heep", "Body Count"],
    ticketLink: "https://www.copenhell.dk/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/af/Copenhell_Festival_2018.jpg",
    isFestival: true,
    countdownDate: "2026-06-17T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-tonsofrock",
    name: "Tons of Rock",
    date: "2026-06-24",
    location: "Oslo, Norway",
    lineup: ["Metallica", "Judas Priest", "Tool", "Greta Van Fleet", "Satyricon"],
    ticketLink: "https://www.tonsofrock.no/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/98/Tons_of_Rock_2019.jpg",
    isFestival: true,
    countdownDate: "2026-06-24T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-tuska",
    name: "Tuska Open Air",
    date: "2026-06-26",
    location: "Helsinki, Finland",
    lineup: ["Pendulum", "Dimmu Borgir", "Alcest", "Suburban Tribe", "Lordi"],
    ticketLink: "https://www.tuska.fi/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Tuska_2019.jpg",
    isFestival: true,
    countdownDate: "2026-06-26T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- GLOBAIS: Clássicos e Históricos ---
  {
    id: "seed-festival-monstersofrock",
    name: "Monsters of Rock (World Stage)",
    date: "2026-11-14",
    location: "Castle Donington, United Kingdom (Legacy)",
    lineup: ["Iron Maiden", "AC/DC", "Metallica", "Def Leppard", "Scorpions"],
    ticketLink: "https://www.monstersofrock.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Monsters_of_Rock_1991.jpg",
    isFestival: true,
    countdownDate: "2026-11-14T15:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-dynamo",
    name: "Dynamo Open Air",
    date: "2026-05-30",
    location: "Eindhoven, Netherlands (Legacy Tribute)",
    lineup: ["Pantera", "Slayer", "Fear Factory", "Machine Head", "Sepultura"],
    ticketLink: "https://www.dynamo-open-air.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Dynamo_Open_Air_1999_Crowd.jpg",
    isFestival: true,
    countdownDate: "2026-05-30T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- BRASIL: Gigantes e Internacionais ---
  {
    id: "seed-festival-rockinrio",
    name: "Rock in Rio",
    date: "2026-09-11",
    location: "Rio de Janeiro, Brazil",
    lineup: ["Megadeth", "Sepultura", "Iron Maiden", "Evanescence", "Guns N' Roses"],
    ticketLink: "https://rockinrio.com/rio/pt-br/ingressos/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Rock_in_Rio_Palco_Mundo_2017.jpg",
    isFestival: true,
    countdownDate: "2026-09-11T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-lollabr",
    name: "Lollapalooza Brasil",
    date: "2026-03-27",
    location: "São Paulo, Brazil (Autódromo de Interlagos)",
    lineup: ["Blink-182", "Arcade Fire", "The Offspring", "Thirty Seconds to Mars"],
    ticketLink: "https://www.lollapaloozabr.com/",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Lollapalooza_Brasil_2018.jpg",
    isFestival: true,
    countdownDate: "2026-03-27T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-monstersbr",
    name: "Monsters of Rock Brasil",
    date: "2026-04-19",
    location: "São Paulo, Brazil (Allianz Parque)",
    lineup: ["Guns N' Roses", "Scorpions", "Deep Purple", "Helloween", "Doro Pesch"],
    ticketLink: "https://www.eventim.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/14/Monsters_of_Rock_Brasil_2015_Arena_Anhembi.jpg",
    isFestival: true,
    countdownDate: "2026-04-19T13:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- BRASIL: Focados em Metal ---
  {
    id: "seed-festival-knotfestbr",
    name: "Knotfest Brasil",
    date: "2026-10-18",
    location: "São Paulo, Brazil",
    lineup: ["Slipknot", "Lamb of God", "Mudvayne", "Bad Omens", "Amon Amarth"],
    ticketLink: "https://www.eventim.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Slipknot_live_at_Knotfest_2019.jpg",
    isFestival: true,
    countdownDate: "2026-10-18T13:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-bangers",
    name: "Bangers Open Air (ex-Summer Breeze)",
    date: "2026-04-26",
    location: "São Paulo, Brazil (Memorial da América Latina)",
    lineup: ["Mercyful Fate", "Gene Simmons Band", "Within Temptation", "Anthrax", "Lamb of God"],
    ticketLink: "https://www.clubedoingresso.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Summer_Breeze_2017.jpg",
    isFestival: true,
    countdownDate: "2026-04-26T11:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-liberation",
    name: "Liberation Festival",
    date: "2026-11-08",
    location: "São Paulo, Brazil (Espaço Unimed)",
    lineup: ["Kreator", "Arch Enemy", "Testament", "Carcass", "Crypta"],
    ticketLink: "https://www.clubedoingresso.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Kreator_live_at_Festival.jpg",
    isFestival: true,
    countdownDate: "2026-11-08T16:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- BRASIL: Nacional e Alternativo ---
  {
    id: "seed-festival-joaorock",
    name: "João Rock",
    date: "2026-06-06",
    location: "Ribeirão Preto, Brazil",
    lineup: ["Os Paralamas do Sucesso", "Sp技术", "CPM 22", "Pittyl", "Emicida"],
    ticketLink: "https://www.joaorock.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Festival_Joao_Rock_Ribeirao_Preto.jpg",
    isFestival: true,
    countdownDate: "2026-06-06T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-primaverasp",
    name: "Primavera Sound São Paulo",
    date: "2026-12-05",
    location: "São Paulo, Brazil (Autódromo de Interlagos)",
    lineup: ["The Cure", "The Killers", "Beck", "Pet Shop Boys", "Roisin Murphy"],
    ticketLink: "https://www.ticketsforfun.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/da/Primavera_Sound_Crowd_and_Lights.jpg",
    isFestival: true,
    countdownDate: "2026-12-05T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-poraodorock",
    name: "Porão do Rock",
    date: "2026-09-26",
    location: "Brasília, DF, Brazil",
    lineup: ["Ratos de Porão", "Angra", "Dead Fish", "Plebe Rude", "Sepultura"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Porao_do_Rock_Crowd.jpg",
    isFestival: true,
    countdownDate: "2026-09-26T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-primerock",
    name: "Prime Rock Brasil",
    date: "2026-10-10",
    location: "Belo Horizonte & Curitiba, Brazil",
    lineup: ["Nando Reis", "Capital Inicial", "Jota Quest", "Biquini Cavadão"],
    ticketLink: "https://www.blueticket.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/34/Prime_Rock_Brasil_Stage_Lights.jpg",
    isFestival: true,
    countdownDate: "2026-10-10T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- BRASIL: Underground e Extremo ---
  {
    id: "seed-festival-abrilprorock",
    name: "Abril Pro Rock",
    date: "2026-04-12",
    location: "Recife, PE, Brazil",
    lineup: ["Sodom", "Krisiun", "Korzus", "Violator", "Cólera"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Abril_Pro_Rock_Crowd.jpg",
    isFestival: true,
    countdownDate: "2026-04-12T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-goianianoise",
    name: "Goiânia Noise Festival",
    date: "2026-05-15",
    location: "Goiânia, GO, Brazil",
    lineup: ["Sepultura", "Odair José", "Mukeka di Rato", "Ratos de Porão"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Goiania_Noise_Festival_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-05-15T15:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-setembronegro",
    name: "Setembro Negro Festival",
    date: "2026-09-04",
    location: "São Paulo, Brazil (Carioca Club)",
    lineup: ["Sodom", "Demolition Hammer", "Vulcano", "Razor", "Incantation"],
    ticketLink: "https://www.clubedoingresso.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Extreme_metal_stage_lights.jpg",
    isFestival: true,
    countdownDate: "2026-09-04T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-macaemetal",
    name: "Macaé Metal Fest",
    date: "2026-07-11",
    location: "Macaé, RJ, Brazil",
    lineup: ["Krisiun", "Sarcófago Tribute", "Grave Desecrator", "Unearthly"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Krisiun_live_on_stage_metal.jpg",
    isFestival: true,
    countdownDate: "2026-07-11T16:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-saoluisrockfest",
    name: "São Luís Rock Fest",
    date: "2026-07-17",
    location: "São Luís, MA, Brazil (The Rock Pub)",
    lineup: ["Critical Fear", "Brutallian", "Bastardz", "Distorch", "Collapse Death", "Prodby"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Goiania_Noise_Festival_Stage.jpg",
    isFestival: true,
    countdownDate: "2026-07-17T20:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-necrofest",
    name: "Necro Fest 2",
    date: "2026-08-08",
    location: "São Luís, MA, Brazil (Parada 64 - Litorânea)",
    lineup: ["Necroneurose", "Inferno", "Exumador", "Collapse Death", "Razor", "Cranium Crushing"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Extreme_metal_stage_lights.jpg",
    isFestival: true,
    countdownDate: "2026-08-08T16:00:00Z",
    approved: true,
    submittedBy: "system"
  },

  // --- OUTROS/SHOWS ---
  {
    id: "seed-event-1",
    name: "Angra Tour 2026 - Belo Horizonte",
    date: "2026-08-15",
    location: "Belo Horizonte, Brazil (Sesc Palladium)",
    lineup: ["Angra", "Viper"],
    ticketLink: "https://www.sympla.com.br",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Angra_-_Milano_2018.jpg",
    isFestival: false,
    approved: true,
    submittedBy: "system"
  }
];

export const SEED_MERCH: MerchItem[] = [
  {
    id: "merch-1",
    title: "Stay Metal Official Vintage Tee",
    description: "Camiseta oficial Stay Metal fabricada com algodão 100% orgânico premium, estampa gótica agressiva traseira. Confortável, durável e feita sob medida para os headbangers mais exigentes.",
    price: 99.90,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    purchaseLink: "https://wa.me/5531973267529?text=Quero%20comprar%20a%20Camiseta%20Oficial%20Stay%20Metal"
  },
  {
    id: "merch-2",
    title: "Wõrld Dominãtion Embroidered Hoody",
    description: "Moletom oficial preto pesado com capuz ajustável e bordado escandinavo feito à mão nas costas. Proteja-se do frio nos festivais de metal mais intensos da Europa.",
    price: 199.90,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    purchaseLink: "https://wa.me/5531973267529?text=Quero%20comprar%20o%20Moletom%20World%20Domination"
  },
  {
    id: "merch-3",
    title: "Rock & Metal Leather Wristband",
    description: "Pulseira de couro legítimo de alta resistência curtido ao óleo, com rebites metálicos negros em parafuso. Produção exclusiva e artesanal para colecionadores.",
    price: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
    purchaseLink: "https://wa.me/5531973267529?text=Quero%20comprar%20a%20Pulseira%20de%20Couro"
  }
];
