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
  getFirestore, 
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
const db = getFirestore(app);

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
    logoUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
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
  }
];

export const SEED_EVENTS: EventItem[] = [
  {
    id: "seed-festival-1",
    name: "Wacken Open Air (W.O.A)",
    date: "2026-07-29",
    location: "Wacken, Germany",
    lineup: ["Iron Maiden", "Judas Priest", "Amon Amarth", "Kreator", "Behemoth"],
    ticketLink: "https://www.wacken.com/en/tickets-shop/",
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80",
    isFestival: true,
    countdownDate: "2026-07-29T12:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-2",
    name: "Hellfest Open Air",
    date: "2026-06-18",
    location: "Clisson, France",
    lineup: ["Metallica", "Tool", "Machine Head", "Gojira", "Mastodon", "Opeth"],
    ticketLink: "https://www.hellfest.fr/en/tickets",
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
    isFestival: true,
    countdownDate: "2026-06-18T10:00:00Z",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-festival-3",
    name: "Rock in Rio",
    date: "2026-09-11",
    location: "Rio de Janeiro, Brazil",
    lineup: ["Megadeth", "Sepultura", "Dream Theater", "Angra", "Evanescence"],
    ticketLink: "https://rockinrio.com/rio/pt-br/ingressos/",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    isFestival: true,
    countdownDate: "2026-09-11T14:00:00Z",
    approved: true,
    submittedBy: "system"
  },
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
    id: "seed-news-1",
    title: {
      pt: "Iron Maiden confirma álbum de estúdio e turnê mundial massiva para os próximos anos!",
      en: "Iron Maiden confirms new studio album and massive upcoming world tour!",
      es: "¡Iron Maiden confirma nuevo álbum de estudio y una gira mundial masiva!"
    },
    content: {
      pt: "A icônica banda de heavy metal anunciou que se reunirá em estúdio novamente com o produtor Kevin Shirley para gravar o sucessor de Senjutsu. O álbum promete explorar temas épicos e será apoiado por uma das maiores turnês visuais de sua história, incluindo passagens extensas pelo Brasil, América Latina e Europa medieval.",
      en: "The icônicas heavy metal band announced they are gathering in studio with producer Kevin Shirley to record the successor of Senjutsu. The upcoming masterpiece promises epic tracks and will be backed by a massive visual stage tour, covering extensive legs in the Americas, historical European locations, and Asian festivals.",
      es: "La icónica banda de heavy metal anunció que se reunirá en el estudio con el productor Kevin Shirley para grabar el sucesor de Senjutsu. La obra promete canciones épicas y contará con el respaldo de una gira espectacular por toda América Latina, Europa y Asia."
    },
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80",
    approved: true,
    submittedBy: "system"
  },
  {
    id: "seed-news-2",
    title: {
      pt: "Sepultura e Anthrax anunciam turnê mundial histórica de celebração do Metal!",
      en: "Sepultura and Anthrax announce historical metal joint tour!",
      es: "¡Sepultura y Anthrax anuncian una gira histórica de metal!"
    },
    content: {
      pt: "Os gigantes do thrash anunciaram uma turnê monumental cruzando as Américas. A turnê servirá como homenagem às quatro décadas de história de ambas as bandas, com convidados especiais de death metal de primeira linha em cada cidade parceira.",
      en: "The thrash metal giants announced a monumental co-headlining run across the Americas. The tour serves as a superb tribute to four decades of extreme music history, with premier local metal bands opening in each partner city.",
      es: "Los gigantes del thrash anunciaron una monumental gira conjunta por América. El recorrido servirá de homenaje a cuatro décadas de música extrema, con bandas locales de death metal como invitadas de honor."
    },
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    approved: true,
    submittedBy: "system"
  }
];

export const SEED_MERCH: MerchItem[] = [
  {
    id: "merch-1",
    title: "MetalZone Official Vintage Tee",
    description: "Camiseta oficial MetalZone fabricada com algodão 100% orgânico premium, estampa gótica agressiva traseira. Confortável, durável e feita sob medida para os headbangers mais exigentes.",
    price: 99.90,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
    purchaseLink: "https://wa.me/5531973267529?text=Quero%20comprar%20a%20Camiseta%20Oficial%20MetalZone"
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
