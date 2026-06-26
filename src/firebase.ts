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

export interface NewsItem {
  id?: string;
  title: { [lang: string]: string } | string;
  content: { [lang: string]: string } | string;
  imageUrl?: string;
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
    logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
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
    logoUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    isFestival: true,
    countdownDate: "2026-07-11T16:00:00Z",
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
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    isFestival: false,
    approved: true,
    submittedBy: "system"
  }
];

export const SEED_NEWS: NewsItem[] = [
  {
    id: "news-world-1",
    title: {
      pt: "2026 está LOTADO de lançamentos importantes de Rock e Metal",
      en: "2026 is PACKED with major Rock and Metal album releases",
      es: "2026 está LLENO de lanzamientos importantes de Rock y Metal"
    },
    content: {
      pt: "Bandas como Megadeth, Kreator, Alter Bridge e Black Stone Cherry confirmaram ou lançaram novos álbuns em 2026. Também há expectativa de discos de Anthrax, Bring Me The Horizon e August Burns Red. O ano está sendo considerado um dos mais fortes da década, com lançamentos em todos os subgêneros (thrash, death, prog, metalcore). Até o Lamb of God entrou na leva com material novo previsto para 2026.",
      en: "Bands like Megadeth, Kreator, Alter Bridge, and Black Stone Cherry confirmed or released new albums in 2026. Expectation is also high for records by Anthrax, Bring Me The Horizon, and August Burns Red. The year is considered one of the strongest of the decade, with releases across all subgenres (thrash, death, prog, metalcore). Even Lamb of God has joined the pack with brand new material slated for 2026.",
      es: "Bandas como Megadeth, Kreator, Alter Bridge y Black Stone Cherry confirmaron o lanzaron nuevos álbumes en 2026. También hay expectativas de discos de Anthrax, Bring Me The Horizon y August Burns Red. El año está siendo considerado uno de los más fuertes de la década, con lanzamientos en todos los subgéneros (thrash, death, prog, metalcore). Hasta Lamb of God también entró en la lista con material nuevo previsto para 2026."
    },
    imageUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-world-2",
    title: {
      pt: "Grandes turnês mundiais movimentam as arenas em 2026",
      en: "Major world tours sweeping through arenas in 2026",
      es: "Grandes giras mundiales mueven los estadios en 2026"
    },
    content: {
      pt: "O Metallica segue com a turnê mundial M72 em 2026. O Megadeth iniciou sua turnê de despedida, com vários anos planejados pela frente. O Rush voltou surpreendentemente aos palcos após mais de uma década, e o My Chemical Romance continua com sua aclamada turnê comemorativa de The Black Parade. 2026 consolidou-se como um ano de retornos históricos e despedidas marcantes.",
      en: "Metallica continues with the M72 world tour in 2026. Megadeth has kicked off their farewell tour, with multiple years planned ahead. Rush has surprisingly returned to the stage after more than a decade, and My Chemical Romance continues their highly celebrated 'The Black Parade' tour. 2026 has solidified as a historic year of reunions and reunions.",
      es: "Metallica continúa con la gira mundial M72 en 2026. Megadeth inició su gira de despedida, con varios años planificados. Rush regresó sorpresivamente a los escenarios tras más de una década, y My Chemical Romance continúa su gira conmemorativa de The Black Parade. 2026 se ha consolidado como un año de regresos históricos y despedidas."
    },
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-world-3",
    title: {
      pt: "Reconhecimento histórico e tributos lendários marcam o ano",
      en: "Historic recognition and legendary tributes mark 2026",
      es: "Reconocimiento histórico y tributos legendarios marcan el año"
    },
    content: {
      pt: "O Iron Maiden foi oficialmente anunciado no prestigiado Rock and Roll Hall of Fame 2026. Além disso, shows especiais de homenagem e tributo marcaram o ano, como o show tributo do Children of Bodom em memória ao falecido guitarrista e vocalista Alexi Laiho.",
      en: "Iron Maiden has been officially announced for the prestigious Rock and Roll Hall of Fame 2026. Additionally, special tribute events marked the year, such as the Children of Bodom tribute shows honoring the memory of late guitarist and vocalist Alexi Laiho.",
      es: "Iron Maiden fue anunciado oficialmente en el prestigioso Rock and Roll Hall of Fame 2026. Además, shows especiales de homenaje marcaron el año, como el tributo de Children of Bodom en memoria del fallecido Alexi Laiho."
    },
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-world-4",
    title: {
      pt: "Febre de relançamentos, edições especiais e vinis colecionáveis",
      en: "Boom of reissues, special editions, and collectible vinyls",
      es: "Fiebre de reediciones, ediciones especiales y vinilos de colección"
    },
    content: {
      pt: "Diversas bandas clássicas estão lançando reedições caprichadas de seus álbuns antigos mais icônicos, como Metallica e Slayer. A grande tendência de mercado observada em 2026 é o foco absoluto em luxuosas edições comemorativas acompanhadas de discos de vinil colecionáveis de alta qualidade.",
      en: "Several classic bands are releasing highly detailed reissues of their most iconic older albums, including Metallica and Slayer. The strong market trend observed in 2026 is an absolute focus on luxurious commemorative editions accompanied by high-quality collectible vinyl records.",
      es: "Diversas bandas clásicas están lanzando reediciones muy cuidadas de sus álbumes antiguos más icónicos, como Metallica y Slayer. La gran tendencia del mercado en 2026 es el enfoque absoluto en lujosas ediciones conmemorativas acompañadas de vinilos de colección de alta qualidade."
    },
    imageUrl: "https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-world-5",
    title: {
      pt: "Nova geração e sonoridade híbrida ganham força total",
      en: "New generation and hybrid sounds gain total momentum",
      es: "La nueva generación y la sonoridad híbrida ganan fuerza total"
    },
    content: {
      pt: "Novas bandas de metal estão misturando com sucesso o peso tradicional com outros estilos alternativos, como rap e batidas eletrônicas. Um excelente exemplo é a banda Gradience, que funde perfeitamente death metal com trap e rap. Além deles, bandas como Dreamwell exploram temas mais filosóficos, complexos e sociais nas suas letras. O metal está cada vez mais experimental e diverso.",
      en: "New metal bands are successfully blending traditional heavy sounds with other alternative styles, such as rap and electronic beats. A great example is the band Gradience, perfectly fusing death metal with trap/rap. Meanwhile, bands like Dreamwell explore more philosophical, complex, and social themes in their lyrics. Metal is becoming increasingly experimental and diverse.",
      es: "Nuevas bandas de metal están mezclando con éxito el peso tradicional con otros estilos alternativos como el rap y la música electrónica. Un excelente ejemplo es la banda Gradience, que fusiona perfectamente death metal con trap y rap. Por su parte, agrupaciones como Dreamwell exploran temas más filosóficos y sociales en sus letras. El metal se vuelve cada vez más experimental y diverso."
    },
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-brazil-1",
    title: {
      pt: "2026 consagra-se como um dos maiores anos para o rock no Brasil",
      en: "2026 stands as one of the biggest years for rock in Brazil",
      es: "2026 se consagra como uno de los mayores años para el rock en Brasil"
    },
    content: {
      pt: "Mais de 200 shows internacionais foram oficialmente confirmados no país, consolidando o Brasil como rota obrigatória das turnês de bandas internacionais de todos os calibres pós-pandemia. Cidades como São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba e Porto Alegre concentram a maioria esmagadora dessas apresentações esgotadas.",
      en: "More than 200 international shows have been officially confirmed in the country, consolidating Brazil as a mandatory route for global tours of all sizes post-pandemic. Major cities like São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, and Porto Alegre host the vast majority of these sold-out performances.",
      es: "Más de 200 conciertos internacionales han sido oficialmente confirmados en el país, consolidando a Brasil como ruta obligatoria de giras internacionales post-pandemia. Ciudades como São Paulo, Río de Janeiro, Belo Horizonte, Curitiba y Porto Alegre concentran la gran mayoría de estas presentaciones agotadas."
    },
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-brazil-2",
    title: {
      pt: "Gigantes lendários do metal internacional confirmam passagens pelo Brasil",
      en: "Legendary international metal giants confirm tours in Brazil",
      es: "Gigantes legendarios del metal internacional confirman visitas a Brasil"
    },
    content: {
      pt: "O AC/DC retornou triunfante ao Brasil após muitos anos de ausência. Além deles, Guns N' Roses, Megadeth, Korn e Avenged Sevenfold estão com grandes apresentações confirmadas pelo país. Os fãs de metal melódico e tradicional também celebram as datas anunciadas de Helloween, Sonata Arctica, Amorphis e Iron Maiden, evidenciando uma fortíssima presença tanto de vertentes clássicas quanto de metalcore moderno.",
      en: "AC/DC returned triumphantly to Brazil after many years of absence. In addition, Guns N' Roses, Megadeth, Korn, and Avenged Sevenfold have major shows confirmed across the country. Melodic and traditional metal fans are also celebrating dates announced for Helloween, Sonata Arctica, Amorphis, and Iron Maiden, showing a very strong presence of classic styles as well as modern metalcore.",
      es: "AC/DC regresó triunfante a Brasil tras muchos años de ausencia. Además, Guns N' Roses, Megadeth, Korn y Avenged Sevenfold tienen grandes shows confirmados en el país. Los fanáticos del metal tradicional y melódico también celebran las fechas anunciadas de Helloween, Sonata Arctica, Amorphis e Iron Maiden, evidenciando una fuerte presencia tanto de clásicos como de metalcore moderno."
    },
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-brazil-3",
    title: {
      pt: "Festivais de proporções gigantescas agitam o calendário nacional",
      en: "Colossal festivals shake up the Brazilian national calendar",
      es: "Festivales de proporciones gigantescas agitan el calendario nacional"
    },
    content: {
      pt: "O Rock in Rio 2026 promete agitar setembro com grandes nomes lendários do rock e metal. O prestigiado festival Monsters of Rock retorna trazendo o Guns N' Roses como headliner de peso. Outros gigantes como Lollapalooza Brasil, Knotfest e Bangers Open Air vêm com escalações pesadíssimas repletas de bandas históricas e extremas.",
      en: "Rock in Rio 2026 promises to shake up September with legendary rock and metal acts. The prestigious Monsters of Rock festival returns bringing Guns N' Roses as headliner. Other major gatherings like Lollapalooza Brasil, Knotfest, and Bangers Open Air come packed with extremely heavy, historic lineups.",
      es: "Rock in Rio 2026 promete agitar septiembre con grandes nombres legendarios del rock y metal. El prestigioso festival Monsters of Rock regresa con Guns N' Roses como gran headliner. Otros gigantes como Lollapalooza Brasil, Knotfest y Bangers Open Air vienen con carteles pesadísimos llenos de bandas históricas y extremas."
    },
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "news-brazil-4",
    title: {
      pt: "Agenda insana de shows eletriza arenas brasileiras em 2026",
      en: "Insane show schedule electrifies Brazilian arenas in 2026",
      es: "Agenda insana de shows electriza estadios brasileños en 2026"
    },
    content: {
      pt: "Uma enxurrada de datas históricas promete esgotar ingressos rapidamente. A agenda inclui Avenged Sevenfold já em janeiro de 2026, My Chemical Romance com clássicos, AC/DC com múltiplas apresentações memoráveis em São Paulo, e o Iron Maiden lotando estádios inteiros com sua produção gigantesca. Bandas pesadas do underground como In Flames, Primal Fear e Beyond Creation também marcam presença.",
      en: "A flood of historic tour dates promises to sell out tickets rapidly. The schedule includes Avenged Sevenfold starting in January 2026, My Chemical Romance performing classic anthems, AC/DC with multiple highly-anticipated dates in São Paulo, and Iron Maiden filling massive stadiums. Underground favorites like In Flames, Primal Fear, and Beyond Creation are also touching down.",
      es: "Una ola de fechas históricas promete agotar boletos rápidamente. La agenda incluye a Avenged Sevenfold en enero de 2026, My Chemical Romance con clásicos memorables, AC/DC con múltiples presentaciones en São Paulo e Iron Maiden llenando estadios con su enorme producción. Bandas del underground pesado como In Flames, Primal Fear y Beyond Creation también están confirmadas."
    },
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80",
    approved: true,
    submittedBy: "system"
  }
];

export const SEED_MERCH: MerchItem[] = [
  {
    id: "merch-1",
    title: "Metal Catalog Official Vintage Tee",
    description: "Camiseta oficial Metal Catalog fabricada com algodão 100% orgânico premium, estampa gótica agressiva traseira. Confortável, durável e feita sob medida para os headbangers mais exigentes.",
    price: 99.90,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    purchaseLink: "https://wa.me/5531973267529?text=Quero%20comprar%20a%20Camiseta%20Oficial%20Metal%20Catalog"
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
