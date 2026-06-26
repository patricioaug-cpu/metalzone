import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to extract JSON securely from Gemini responses (stripping any extra text or backticks)
function extractJSON(text: string): string {
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = text.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = text.lastIndexOf("]");
  }

  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1);
  }
  return text.trim();
}

function formatErrorLog(err: any): string {
  if (!err) return "Unknown error occurred";
  const msg = err.message || String(err);
  if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("quota")) {
    return "Gemini API Quota Exceeded (429 / RESOURCE_EXHAUSTED). Defaulting to elegant local fallback content.";
  }
  return msg;
}

// Lazy loaded Gemini AI client with secure diagnostic logging
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[SERVER] GEMINI_API_KEY environment variable is missing.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

function getSuggestFallback(bandName: string, lang: string) {
  const isPt = lang === "pt";
  const nameClean = bandName.trim();
  const nameLower = nameClean.toLowerCase();

  if (nameLower.includes("sepultura")) {
    return {
      name: "Sepultura",
      formationYear: 1984,
      country: isPt ? "Brasil" : "Brazil",
      genre: "Thrash Metal / Groove Metal",
      bio: isPt 
        ? "Banda pioneira de metal formada em Belo Horizonte, Minas Gerais. Famosa mundialmente pela união única de ritmos tribais brasileiros com o peso do thrash metal groove."
        : "Highly influential heavy metal act formed in Belo Horizonte, Brazil. Pioneered the classic blend of Brazilian tribal rhythms with heavy thrash and groove metal.",
      logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      logoPlaceholderText: "Sharp thrash yellow/dark contrast signature logo",
      members: [
        { name: "Andreas Kisser", role: "Lead Guitar", status: "active" },
        { name: "Derrick Green", role: "Vocals", status: "active" },
        { name: "Max Cavalera", role: "Vocals & Guitar", status: "former" }
      ],
      discography: [
        { title: "Beneath the Remains", year: 1989, type: "Album" },
        { title: "Arise", year: 1991, type: "Album" },
        { title: "Chaos A.D.", year: 1993, type: "Album" },
        { title: "Roots", year: 1996, type: "Album" }
      ],
      socials: { instagram: "@sepultura", website: "https://www.sepultura.com.br" },
      contacts: { email: "booking@sepultura.com.br" }
    };
  }

  if (nameLower.includes("metallica")) {
    return {
      name: "Metallica",
      formationYear: 1981,
      country: "United States",
      genre: "Thrash Metal / Heavy Metal",
      bio: isPt 
        ? "Uma das bandas mais bem-sucedidas comercialmente e influentes da história da música, definindo o som do thrash metal do início dos anos 80."
        : "One of the most commercially successful and influential heavy metal bands of all time, largely defining the thrash metal subgenre from the early 1980s.",
      logoUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
      logoPlaceholderText: "Classic sharp lightning font metallic nameplate",
      members: [
        { name: "James Hetfield", role: "Vocals & Rhythm Guitar", status: "active" },
        { name: "Lars Ulrich", role: "Drums", status: "active" },
        { name: "Kirk Hammett", role: "Lead Guitar", status: "active" },
        { name: "Robert Trujillo", role: "Bass", status: "active" }
      ],
      discography: [
        { title: "Kill 'Em All", year: 1983, type: "Album" },
        { title: "Ride the Lightning", year: 1984, type: "Album" },
        { title: "Master of Puppets", year: 1986, type: "Album" },
        { title: "Metallica (The Black Album)", year: 1991, type: "Album" }
      ],
      socials: { instagram: "@metallica", website: "https://www.metallica.com" },
      contacts: { email: "press@metallica.com" }
    };
  }

  return {
    name: nameClean,
    formationYear: 2010,
    country: isPt ? "Internacional" : "International",
    genre: "Heavy Metal / Hard Rock",
    bio: "",
    logoUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
    logoPlaceholderText: "Gothic/industrial style sharp branding nameplate",
    members: [],
    discography: [],
    socials: { instagram: `@${nameClean.toLowerCase().replace(/\s+/g, "")}`, website: `http://www.${nameClean.toLowerCase().replace(/\s+/g, "")}.com` },
    contacts: { email: `contact@${nameClean.toLowerCase().replace(/\s+/g, "")}.com` }
  };
}

function getDiscoverFallback(genres: string[], info: string, lang: string) {
  const isPt = lang === "pt";
  const isEs = lang === "es";
  
  const genreLower = (((genres && genres[0]) ? genres[0] : "") + " " + info).toLowerCase().trim();
  
  let recs = [];
  
  if (genreLower.includes("doom")) {
    recs = [
      {
        name: "Candlemass",
        country: isPt ? "Suécia" : "Sweden",
        genre: "Epic Doom Metal",
        formationYear: 1984,
        subgenres: ["Epic Doom", "Heavy Metal", "Classic Rock"],
        bio: isPt 
          ? "Pioneira do gênero Epic Doom Metal, conhecida por riffs pesados e arrastados inspirados no Black Sabbath, combinados com vocais líricos operísticos."
          : isEs
          ? "Banda sueca pionera del Doom Metal épico, célebre por sus riffs monolíticos y pesados inspirados en Black Sabbath y voces operísticas majestuosas."
          : "Swedish epic doom metal pioneers, renowned for heavy, slow-tempo riffs heavily influenced by Black Sabbath paired with grand operatic vocals.",
        logoUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
        members: [{ name: "Leif Edling", role: "Bass", status: "active" }],
        former_members: [],
        discography: [{ title: "Epicus Doomicus Metallicus", year: 1986, type: "Album" }],
        social_links: { instagram: "@candlemassbandofficial", website: "https://candlemass.se" },
        contacts: { email: "booking@candlemass.se" }
      },
      {
        name: "Khemmis",
        country: "United States",
        genre: "Atmospheric Doom Metal",
        formationYear: 2012,
        subgenres: ["Atmospheric Doom", "Heavy Metal"],
        bio: isPt 
          ? "Banda de Denver que combina doom arrastado, harmonias de guitarras gêmeas no estilo Iron Maiden e vocais melódicos altíssimos."
          : isEs
          ? "Grupo originario de Denver que fusiona la pesadez del doom melódico con el dinámico juego de guitarras gemelas típicas del heavy metal clásico."
          : "Denver-based metal group blending slow crushing doom metal with magnificent classic dual-guitar harmonies and clean clean vocals.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        members: [{ name: "Phil Pendergast", role: "Vocals & Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Hunted", year: 2016, type: "Album" }],
        social_links: { instagram: "@khemmisdoom", website: "https://khemmisdoom.com" },
        contacts: { email: "booking@khemmisdoom.com" }
      }
    ];
  } else if (genreLower.includes("black")) {
    recs = [
      {
        name: "Emperor",
        country: isPt ? "Noruega" : "Norway",
        genre: "Symphonic Black Metal",
        formationYear: 1991,
        subgenres: ["Symphonic Black", "Extreme Metal"],
        bio: isPt 
          ? "Banda norueguesa de enorme prestígio que ajudou a moldar o Black Metal Sinfônico, unindo agressividade crua com teclados e melodias orquestrais imponentes."
          : isEs
          ? "Iconos noruegos fundadores del black metal sinfónico, conocidos por su maestría instrumental y fusión de coros orquestales oscuros."
          : "Prestigious Norwegian symphonic black metal pioneers, combining blast beats and harsh vocals with grand, atmospheric orchestral keyboards.",
        logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
        members: [{ name: "Ihsahn", role: "Vocals & Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Anthems to the Welkin at Dusk", year: 1997, type: "Album" }],
        social_links: { instagram: "@emperorofficial", website: "https://emperorhorde.com" },
        contacts: { email: "booking@emperorhorde.com" }
      },
      {
        name: "Mgła",
        country: isPt ? "Polônia" : "Poland",
        genre: "Atmospheric Black Metal",
        formationYear: 2000,
        subgenres: ["Atmospheric Black Metal", "Melodic Black Metal"],
        bio: isPt 
          ? "Banda polonesa que se destaca pelas melodias cortantes de guitarra, percussão virtuosa e composições ricas e sombrias sobre existencialismo."
          : isEs
          ? "Proyecto polaco aclamado por sus melodías de guitarra afiladas, ritmos de batería intrincados y letras nihilistas profundas."
          : "Acclaimed Polish atmospheric black metal project, standing out with melodic guitar hooks, brilliant technical percussion, and philosophical themes.",
        logoUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
        members: [{ name: "M.", role: "Vocals & Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Exercises in Futility", year: 2015, type: "Album" }],
        social_links: { instagram: "@mglaofficial", website: "http://www.no-solace.com" },
        contacts: { email: "mgmt@no-solace.com" }
      }
    ];
  } else if (genreLower.includes("thrash")) {
    recs = [
      {
        name: "Megadeth",
        country: "United States",
        genre: "Technical Thrash Metal",
        formationYear: 1983,
        subgenres: ["Thrash Metal", "Speed Metal"],
        bio: isPt 
          ? "Um dos gigantes do thrash metal americano, famoso por riffs técnicos rápidos, solos de guitarra intrincados e letras inteligentes de teor político."
          : isEs
          ? "Formidable pilar del thrash metal americano, distinguido por sus ritmos rápidos y solos de guitarra sumamente intrincados."
          : "One of the absolute giants of American thrash metal, highly celebrated for complex speed riffs, intricate guitar solos, and socio-political themes.",
        logoUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
        members: [{ name: "Dave Mustaine", role: "Vocals & Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Rust in Peace", year: 1990, type: "Album" }],
        social_links: { instagram: "@megadeth", website: "https://megadeth.com" },
        contacts: { email: "booking@megadeth.com" }
      },
      {
        name: "Power Trip",
        country: "United States",
        genre: "Crossover Thrash Metal",
        formationYear: 2008,
        subgenres: ["Thrash", "Hardcore Punk"],
        bio: isPt 
          ? "Banda texana que revitalizou o crossover thrash com riffs esmagadores que unem o peso do metal à atitude do hardcore punk subterrâneo."
          : isEs
          ? "Banda de Texas que insufló nueva vida al estilo crossover crossover, con riffs demoledores que unen el thrash con el hardcore agresivo."
          : "Texan powerhouse that revitalized the crossover thrash subgenre, fusing crushing thrash riffs with high-energy underground hardcore punk.",
        logoUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
        members: [{ name: "Blake Ibanez", role: "Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Nightmare Logic", year: 2017, type: "Album" }],
        social_links: { instagram: "@powertriptx", website: "https://powertrip.bandcamp.com" },
        contacts: { email: "booking@powertrip.com" }
      }
    ];
  } else if (genreLower.includes("progressive")) {
    recs = [
      {
        name: "Dream Theater",
        country: "United States",
        genre: "Progressive Metal",
        formationYear: 1985,
        subgenres: ["Progressive Metal", "Heavy Metal", "Hard Rock"],
        bio: isPt 
          ? "Pioneira absoluta e icônica no metal progressivo moderno, celebrada pela técnica instrumental virtuosa de seus músicos em músicas longas e conceituais."
          : isEs
          ? "Pioneros absolutos del metal progresivo, mundialmente elogiados por el virtuosismo técnico de su alineación estelar."
          : "Absolute pioneers of modern progressive metal, internationally celebrated for the outstanding virtuoso technical musicianship of each band member.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        members: [{ name: "James LaBrie", role: "Vocals", status: "active" }],
        former_members: [],
        discography: [{ title: "Images and Words", year: 1992, type: "Album" }],
        social_links: { instagram: "@dreamtheaterofficial", website: "https://dreamtheater.net" },
        contacts: { email: "management@dreamtheater.net" }
      },
      {
        name: "Haken",
        country: "United Kingdom",
        genre: "Modern Progressive Metal",
        formationYear: 2007,
        subgenres: ["Progressive Rock", "Alternative Metal"],
        bio: isPt 
          ? "Banda de destaque no rock progressivo inglês atual, que mistura elementos de metal pesado instrumental, jazz fusion e texturas teatrais marcantes."
          : isEs
          ? "Destacada formación inglesa que matiza metal pesado intrincado con pasajes de jazz fusión, coros teatrales y metal alternativo."
          : "Intriguing modern English progressive metal group fusing heavy riffs with jazz fusion, theatrical vocal lines, and rich synthesizer textures.",
        logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
        members: [{ name: "Ross Jennings", role: "Vocals", status: "active" }],
        former_members: [],
        discography: [{ title: "The Mountain", year: 2013, type: "Album" }],
        social_links: { instagram: "@haken_official", website: "https://hakenmusic.com" },
        contacts: { email: "booking@hakenmusic.com" }
      }
    ];
  } else {
    recs = [
      {
        name: "Crypta",
        country: isPt ? "Brasil" : "Brazil",
        genre: "Death Metal / Thrash Metal",
        formationYear: 2019,
        subgenres: ["Death Metal", "Thrash Metal", "Extreme Metal"],
        bio: isPt 
          ? "Banda brasileira de Death Metal formada em São Paulo por ex-integrantes da Nervosa. Conhecidas por riffs rápidos, vocais brutais e energia implacável nas apresentações."
          : isEs
          ? "Banda de death metal pesado formada en São Paulo por ex-integrantes de Nervosa. Son conocidas por sus ritmos veloces y potente sonido extremo en directo."
          : "Blazing Brazilian death metal band formed in São Paulo by former members of Nervosa. Known for their fast tempo, crushing riffs, and relentless extreme energy.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        members: [{ name: "Fernanda Lira", role: "Vocals & Bass", status: "active" }],
        former_members: [],
        discography: [{ title: "Echoes of the Soul", year: 2021, type: "Album" }],
        social_links: { instagram: "@cryptadeath", website: "https://www.cryptaofficial.com" },
        contacts: { email: "booking@cryptaofficial.com" }
      },
      {
        name: "Opeth",
        country: isPt ? "Suécia" : "Sweden",
        genre: "Progressive Metal / Death Metal",
        formationYear: 1989,
        subgenres: ["Progressive Metal", "Acoustic Rock", "Death Metal"],
        bio: isPt 
          ? "Banda icônica que mistura death metal melódico com rock progressivo dos anos 70. Famosa por alternar entre vocais guturais intensos e partes acústicas limpas e bucólicas."
          : isEs
          ? "Icono del metal progresivo sueco, famosa por fusionar la agresión del death metal clásico con arreglos acústicos refinados de rock progresivo setentero."
          : "Iconic Swedish progressive metal force, legendary for combining heavy death metal dynamics with beautiful 70s-style acoustic progressive rock.",
        logoUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
        members: [{ name: "Mikael Åkerfeldt", role: "Vocals & Guitar", status: "active" }],
        former_members: [],
        discography: [{ title: "Blackwater Park", year: 2001, type: "Album" }],
        social_links: { instagram: "@opethband", website: "https://www.opeth.com" },
        contacts: { email: "management@opeth.com" }
      }
    ];
  }

  return { recommendations: recs };
}

function getSearchFallback(bandsList: any[], query: string): string[] {
  const q = query.toLowerCase().trim();
  const matched = bandsList.filter(b => {
    const name = (b.name || "").toLowerCase();
    const genre = (b.genre || "").toLowerCase();
    const country = (b.country || "").toLowerCase();
    const year = String(b.formationYear || "");

    return name.includes(q) || genre.includes(q) || country.includes(q) || year.includes(q);
  });
  return matched.map(m => m.id);
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory stats for high fidelity user tracking
const registeredUsersCache = { count: 342 }; // Base stats that scale as people register
const activeSessions = new Set<string>();
let activeOnlineSimulatedOffset = 18; // Base rockers online

// API: Get App Stats (Online + Total Registered)
app.get("/api/stats", (req: Request, res: Response) => {
  const ip = req.headers["x-forwarded-for"] || req.ip || "unknown";
  activeSessions.add(ip.toString());
  
  // Clean up sessions older than 5 minutes optionally, but keep counter dynamic
  const onlineCount = activeSessions.size + activeOnlineSimulatedOffset + Math.floor(Math.random() * 5) - 2;
  const totalRegistered = registeredUsersCache.count;

  res.json({
    online: Math.max(5, onlineCount),
    registered: totalRegistered
  });
});

// API: Track newly registered users dynamically
app.post("/api/stats/increment-registered", (req: Request, res: Response) => {
  registeredUsersCache.count += 1;
  res.json({ success: true, count: registeredUsersCache.count });
});

// API: Fetch Band details from Gemini AI securely client-side
app.post("/api/bands/ai-suggest", async (req: Request, res: Response) => {
  const { bandName, lang = "pt" } = req.body;

  if (!bandName) {
    res.status(400).json({ error: "Band name is required" });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    console.info(`[SERVER] Gemini not configured, serving suggestion fallback for: "${bandName}"`);
    res.json(getSuggestFallback(bandName, lang));
    return;
  }

  try {
    const prompt = `You are a Heavy Metal and Rock encyclopedia database. 
You MUST look up, search, and integrate accurate, rich, authoritative information for any requested band using databases like Wikipedia (https://wikipedia.org/), Encyclopedia Metallum (https://www.metal-archives.com/), and social media profiles like Instagram. 
You MUST expand and search extensively for ALL kinds of rock/metal bands, including small local bands, regional underground acts, independent artists, emerging bands, as well as mainstream groups. Search Wikipedia index schemas and metal catalogs to construct valid historic biographies, specific subgenres, correct years, and real member lineups. Include any regional domestic bands with maximum precision.
All text content (bio, instrument descriptions, headers, etc.) MUST be answered in the language code: "${lang}" (e.g. "pt" for Brazilian Portuguese, "en" for English, "es" for Spanish).
 
CRITICAL DIRECTIVE: You are STRICTLY FORBIDDEN from using the word "lendário", "lendária", "lenda", "lendas", "legendary", "legendaria" or "legendarios" anywhere in your generated text, bios, or descriptions. Use "influente", "icônico", "pioneiro", "histórico", "relevante", "clássico", or similar synonyms instead.

CRITICAL DIRECTIVE 2: Only provide specific, real, authentic, and historically accurate descriptions/details for this exact band and its members. If you cannot find specific, authentic details/descriptions about the band's biography, its members, their roles/instruments played, or its discography/albums, you MUST leave those fields completely empty or blank (e.g., return "" for bio, and empty arrays [] for members and discography). Do NOT under any circumstances generate generic, filler, or placeholder bios, generic member names (like "Vocalist" or "Guitarist"), generic instruments/roles, or generic album/release titles. If you don't have real specific details, return nothing/empty values for those attributes.
 
Return STRICTLY a JSON object with EXACTLY the following structure (do NOT wrap in markdown code blocks like \`\`\`json, return only the raw string):
{
  "name": "Band Name",
  "formationYear": 1980,
  "country": "Origin Country Name",
  "genre": "Very specific subgenre (e.g., Progressive Metal, Melodic Death Metal, Thrash Metal, Atmospheric Black Metal) - DO NOT BE GENERAL",
  "bio": "A rich paragraph detailing the band's history, influences, and significance in the requested language. Make sure NOT to include any 'legendary'/'lendário' words. If no specific bio exists, leave empty \"\".",
  "logoUrl": "A high-quality Unsplash image URL related to rock/metal music from this pre-approved list (choose the most fitting): https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80 (heavy metal live concert), https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80 (stage dynamic microphone), https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80 (vibrant metal festival crowd), https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80 (glowing concert stage), https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80 (stacked guitar amplifiers), or https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80 (crowd in metal show)",
  "logoPlaceholderText": "Suggestions for banner/logo style (e.g. sharp dark runes, gothic font, classic yellow logo)",
  "members": [
    { "name": "Member Name", "role": "Vocals / Guitar / Drums / etc.", "status": "active" | "former" }
  ],
  "discography": [
    { "title": "Album/EP Title", "year": 1985, "type": "Album" | "EP" | "Single" }
  ],
  "socials": {
    "instagram": "@band_handle",
    "website": "official webpage URL if exists"
  },
  "contacts": {
    "email": "booking@bandmail.com or press@bandmail.com",
    "phone": "Contact phone if exists or place Booking Contact"
  }
}
If you do not find the exact band, make a best-effort retrieval using a similarly named actual active or historical heavy metal/rock band. Ensure the subgenres are granular (e.g., "brutal death metal" instead of "metal", "heavy metal" or "stoner rock"). Look for regional accounts on Instagram, Wikipedia, or index entries on metal-archives.com.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    const cleanJson = extractJSON(responseText);

    try {
      const bandData = JSON.parse(cleanJson);
      res.json(bandData);
    } catch (parseErr: any) {
      console.warn("Failed to parse Gemini output, serving suggestion fallback:", parseErr?.message || String(parseErr));
      res.json(getSuggestFallback(bandName, lang));
    }
  } catch (err: any) {
    console.warn("Gemini suggestion fallback triggered:", formatErrorLog(err));
    res.json(getSuggestFallback(bandName, lang));
  }
});

// API: Advanced natural language search using Gemini
app.post("/api/bands/ai-search", async (req: Request, res: Response) => {
  const { bandsList, query } = req.body;

  if (!query) {
    res.status(400).json({ error: "Search query is required" });
    return;
  }

  if (!bandsList || !Array.isArray(bandsList)) {
    res.status(400).json({ error: "bandsList array is required" });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    console.info(`[SERVER] Gemini not configured, serving keyword search fallback for query: "${query}"`);
    res.json({ matchedIds: getSearchFallback(bandsList, query) });
    return;
  }

  try {
    const prompt = `You are a heavy metal and rock database assistant.
You are given a query in natural language and a list of bands with their core metadata (id, name, genre, country, formationYear).
Your absolute goal is to filter this list and return ONLY the IDs of the bands that match the search query requirements.

Understand queries in English, Portuguese, or Spanish.
Examples of reasoning:
- Query: "bandas de death metal formadas na Suécia nos anos 90" (or similar): Filter for bands with country containing Sweden/Suécia, genre containing death metal (or subgenres), and formationYear between 1990 and 1999 (inclusive).
- Query: "80s thrash metal": Filter for genre containing Thrash Metal and formationYear between 1980 and 1989.
- Query: "bandas do Brasil": Filter for country containing Brazil or Brasil.
Evaluate each band carefully against the user request. Be inclusive of all metal subgenres that reasonably fit.

List of Bands:
${JSON.stringify(bandsList, null, 2)}

User Natural Language Query:
"${query}"

Return STRICTLY a JSON array of strings containing the "id"s of matching bands.
Example output:
["band-123", "band-456"]

Do not wrap response in markdown code blocks like \`\`\`json. Return ONLY the raw string corresponding to the valid JSON array of strings. If no bands fit, return an empty array: []`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    const cleanJson = extractJSON(responseText);

    try {
      const matchedIds = JSON.parse(cleanJson);
      if (Array.isArray(matchedIds)) {
        res.json({ matchedIds });
      } else {
        console.warn("Gemini did not return an array, serving keyword fallback:", responseText);
        res.json({ matchedIds: getSearchFallback(bandsList, query) });
      }
    } catch {
      console.warn("Failed to parse Gemini search output, serving keyword fallback:", responseText);
      res.json({ matchedIds: getSearchFallback(bandsList, query) });
    }
  } catch (err: any) {
    console.warn("Gemini search fallback triggered:", formatErrorLog(err));
    res.json({ matchedIds: getSearchFallback(bandsList, query) });
  }
});

// API: Discover new bands using Gemini with search grounding based on user taste analytical profiles
app.post("/api/bands/ai-discover", async (req: Request, res: Response) => {
  const { genres = [], info = "", lang = "pt" } = req.body;

  const ai = getAiClient();
  if (!ai) {
    console.info(`[SERVER] Gemini not configured, serving discovery fallback for genres: [${genres.join(", ")}]`);
    res.json(getDiscoverFallback(genres, info, lang));
    return;
  }

  try {
    const prompt = `You are a rock and heavy metal recommendation system helper.
Analyse the user's taste:
- Preferred subgenres: ${genres.join(", ") || "various heavy genres"}
- User taste specifications/notes: ${info || "none"}

Your mission is to find and suggest exactly 2 actual, existing bands that match these preferences. One should be a well-known name that is iconic, and another should be an underground or emerging, highly specific metal/rock band that they might not know yet.
You MUST search the internet (e.g., Wikipedia, Metal Archives) to return accurate, valid historical profiles and details.
Translate all text fields (bio, member roles, album/song info) to the language: "${lang}".

CRITICAL DIRECTIVE: Avoid using the word "lendário", "lendária", "lenda", "lendas", "legendary" or "legendaria" anywhere in bios and text description. Use "relevante", "influente", "icônico", "pioneiro", "clássico", "histórico" instead.

Return STRICTLY a JSON object with this exact schema (do NOT wrap in markdown code blocks like \`\`\`json, return only the raw string):
{
  "recommendations": [
    {
      "name": "Band Name",
      "country": "Origin Country",
      "genre": "Granular Subgenre (e.g. Melodic Death Metal, Post-Metal, Stoner Doom - DO NOT use generic Rock or Metal)",
      "formationYear": 2005,
      "subgenres": ["additional subgenre 1", "additional subgenre 2"],
      "bio": "A summary biography detailing the band's history, specific sound traits and style. Do not use legendary/lenda words.",
      "logoUrl": "A high-quality Unsplash image URL related to rock/metal music. Choose one from this list: https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80, https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80, https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80, https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80, https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80, or https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80",
      "members": [
        { "name": "Member Name", "role": "Vocals / Lead Guitar / Drums", "status": "active" }
      ],
      "former_members": [
        { "name": "Former Member Name", "role": "Bass", "status": "former" }
      ],
      "discography": [
        { "title": "Album/EP/Single Title", "year": 2010, "type": "Album" }
      ],
      "social_links": {
        "spotify": "official spotify link",
        "instagram": "official instagram username (with @)",
        "youtube": "official youtube link",
        "website": "official website URL"
      },
      "contacts": {
        "email": "booking@email.com",
        "phone": "or direct contact link"
      }
    }
  ]
}
Ensure all keys are populated. If an official link or contact is not found, use "não encontrado".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    const cleanJson = extractJSON(responseText);

    try {
      const result = JSON.parse(cleanJson);
      res.json(result);
    } catch (parseErr: any) {
      console.warn("Failed to parse Gemini output, serving discovery fallback:", parseErr?.message || String(parseErr));
      res.json(getDiscoverFallback(genres, info, lang));
    }
  } catch (err: any) {
    console.warn("Gemini discovery fallback triggered:", formatErrorLog(err));
    res.json(getDiscoverFallback(genres, info, lang));
  }
});

// Helper: Fetch real events from Ticketmaster API when TICKETMASTER_API_KEY is configured
async function fetchTicketmasterEvents(params: { lat?: number; lon?: number; city?: string }) {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    console.log("No TICKETMASTER_API_KEY found in environmental config. Falling back to grounded AI search.");
    return null;
  }

  try {
    const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
    url.searchParams.append("apikey", apiKey);
    url.searchParams.append("classificationName", "music");
    url.searchParams.append("keyword", "metal");
    url.searchParams.append("size", "24");
    url.searchParams.append("sort", "date,asc");

    if (params.city) {
      url.searchParams.append("city", params.city);
    } else if (params.lat !== undefined && params.lon !== undefined) {
      url.searchParams.append("latlong", `${params.lat},${params.lon}`);
      url.searchParams.append("radius", "200");
      url.searchParams.append("unit", "km");
    }

    console.log("Contacting Ticketmaster Discovery Engine with coordinates/city query...");
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.warn(`Ticketmaster server responded with HTTP status ${res.status}`);
      return null;
    }
    const data: any = await res.json();
    return data._embedded?.events || [];
  } catch (err: any) {
    console.warn("Ticketmaster service handled notice:", err?.message || String(err));
    return null;
  }
}

// API: Find local shows and local bands based on client coordinate or input location (grounded search)
app.post("/api/events/local", async (req: Request, res: Response) => {
  const { lat, lon, city = "", lang = "pt" } = req.body;

  const ai = getAiClient();

  try {
    // 1. Try Ticketmaster API first if key exists
    let tmEvents = null;
    if (process.env.TICKETMASTER_API_KEY) {
      tmEvents = await fetchTicketmasterEvents({ lat, lon, city });
    }

    if (tmEvents && tmEvents.length > 0) {
      console.log(`Successfully extracted ${tmEvents.length} live shows from Ticketmaster.`);
      
      const parsedEvents = tmEvents.map((item: any) => {
        const venue = item._embedded?.venues?.[0];
        const venueName = venue?.name || "Stage";
        const cityName = venue?.city?.name || "";
        const countryName = venue?.country?.name || venue?.country?.countryCode || "";
        const locationStr = [venueName, cityName, countryName].filter(Boolean).join(", ");
        
        let imageUrl = "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80";
        if (item.images && item.images.length > 0) {
          imageUrl = item.images[0].url;
        }

        const attractions = item._embedded?.attractions || [];
        const lineup = attractions.map((att: any) => att.name) || [];
        if (lineup.length === 0) {
          lineup.push(item.name);
        }

        return {
          name: item.name,
          date: item.dates?.start?.localDate || "2026-07-01",
          location: locationStr,
          lineup: lineup.slice(0, 4),
          ticketLink: item.url || "https://www.ticketmaster.com",
          isFestival: item.name.toLowerCase().includes("fest") || item.name.toLowerCase().includes("festival") || item.name.toLowerCase().includes("crue"),
          imageUrl
        };
      });

      // Augment Ticketmaster results: use Gemini to translate schedules/venues and generate real resident local bands.
      const detectedCity = city || tmEvents[0]._embedded?.venues?.[0]?.city?.name || "Detected Region";
      const detectedCountry = tmEvents[0]._embedded?.venues?.[0]?.country?.name || tmEvents[0]._embedded?.venues?.[0]?.country?.countryCode || "";
      const locationLabel = `${detectedCity}, ${detectedCountry}`;

      let result = null;
      try {
        const prompt = `You are a heavy metal rock concert reporter and regional guide.
We detected the following real upcoming events from the Ticketmaster Live API for the region "${locationLabel}":
${JSON.stringify(parsedEvents, null, 2)}

Your mission is to:
1. Provide a list of 2 real active local heavy metal/rock bands that are from or highly active in "${locationLabel}" or its immediate general country/region.
2. Translate or polish all names, event descriptions, venues, or band bios into language: "${lang}". Keep event names close to what's on ticket packages, but make sure descriptions or fields read natively.
3. Return STRICTLY a JSON object with this exact structure (do NOT wrap in markdown code blocks, do NOT have trailing commas, return only the raw JSON payload):
{
  "locationDetected": "${locationLabel}",
  "localBands": [
    {
      "name": "Local Band Name",
      "genre": "Specific Genre (e.g. Thrash Metal)",
      "country": "Origin Country",
      "formationYear": 2018,
      "bio": "Short 2-sentence bio showing their local significance.",
      "logoUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      "socials": { "instagram": "@band" }
    }
  ],
  "localEvents": [
    {
      "name": "Concert/Festival Name",
      "date": "YYYY-MM-DD",
      "location": "Venue Name, City, Country",
      "lineup": ["Band 1", "Band 2"],
      "ticketLink": "http://example.com/tickets",
      "isFestival": false,
      "imageUrl": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80"
    }
  ]
}
Ensure all keys are populated. The localEvents array MUST have the Ticketmaster events mapped list but translated/localized and corrected for the "${lang}" locale.`;

        if (!ai) throw new Error("Gemini AI is not available");
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });

        const responseText = response.text || "";
        const cleanJson = extractJSON(responseText);

        result = JSON.parse(cleanJson);
      } catch (geminiErr) {
        console.warn("Gemini translation/augmentation failed under Ticketmaster workflow, using clean localized fallback:", formatErrorLog(geminiErr));
        // Resilient fallback combining real Ticketmaster events with static legendary regional bands
        const isPt = lang === "pt";
        const isEs = lang === "es";
        result = {
          locationDetected: locationLabel,
          localBands: [
            {
              name: "Sepultura",
              genre: "Thrash Metal",
              country: detectedCountry || (isPt ? "Brasil" : "Brazil"),
              formationYear: 1984,
              bio: isPt 
                ? "Lendária banda regional de metal, pioneira na fusão de ritmos tribais locais com thrash/groove metal agressivo." 
                : isEs 
                ? "Banda de metal altamente influyente, pionera en la fusión de ritmos tribales con thrash metal pesado."
                : "Highly influential heavy metal act, pioneering the unique blend of local tribal rhythms with heavy thrash metal.",
              logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
              socials: { instagram: "@sepultura" }
            },
            {
              name: "Krisiun",
              genre: "Death Metal",
              country: detectedCountry || (isPt ? "Brasil" : "Brazil"),
              formationYear: 1990,
              bio: isPt 
                ? "Trio extremamente respeitado pela velocidade implacável e precisão técnica brutal nos palcos mundiais." 
                : isEs
                ? "Trío de death metal respetado por su velocidad implacable e increíble destreza técnica en vivo."
                : "World-renowned death metal power trio celebrated for their unrelenting speed and high technical precision.",
              logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
              socials: { instagram: "@krisiun" }
            }
          ],
          localEvents: parsedEvents
        };
      }
      res.json(result);
      return;
    }

    // 2. Fallback to Grounded Search if TM returns empty or is not configured
    const locQuery = city ? city : `region near latitude:${lat}, longitude:${lon}`;
    
    const prompt = `You are a heavy metal rock concert reporter and regional guide.
Given the user's location coordinates/city context: "${locQuery}".
Your mission is to find:
1. Real upcoming rock, hardcore, punk, or heavy metal shows, festivals, gigs, or events happening in this region.
2. Real local heavy metal/rock bands that are active and originate from this region/country.

Search the web (Ticketmaster, local rock blogs, band schedules, and news indices) to fetch real, active events or local artists.
If no specific upcoming concerts are found, you may suggest standard active local heavy metal venues, concert halls, and extremely representative regional bands of this city/state.
Translate all texts (event description, names, labels) to language: "${lang}".

Return STRICTLY a JSON object with this exact structure (do NOT wrap in markdown code blocks like \`\`\`json, return only the raw string):
{
  "locationDetected": "Name of detected city and country",
  "localBands": [
    {
      "name": "Local Band Name",
      "genre": "Specific Genre (e.g. Thrash Metal)",
      "country": "Origin Country",
      "formationYear": 2018,
      "bio": "Short 2-sentence bio showing their local significance.",
      "logoUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      "socials": { "instagram": "@band" }
    }
  ],
  "localEvents": [
    {
      "name": "Concert/Festival Name (e.g. BH Metal Fest or Metallica in City)",
      "date": "2026-09-12",
      "location": "Venue Name, City, Country",
      "lineup": ["Local Band 1", "Local Band 2"],
      "ticketLink": "http://example.com/tickets",
      "isFestival": false,
      "imageUrl": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80"
    }
  ]
}
Ensure all keys are populated with real or extremely representative fallback information if none is scheduled, but try your absolute best to search for actual acts.`;

    if (!ai) throw new Error("Gemini AI is not available");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    const cleanJson = extractJSON(responseText);

    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (err: any) {
    console.warn("Local events notice: serving resilient fallback content.", formatErrorLog(err));
    
    // Create a robust localized fallback response for the user
    const fallbackLocation = city || "Sua Região / Your Region";
    const isPt = lang === "pt";
    const isEs = lang === "es";
    
    const fallbackBandsPT = [
      {
        name: "Sepultura",
        genre: "Thrash Metal",
        country: "Brasil",
        formationYear: 1984,
        bio: "Uma das bandas de metal mais influentes da história da América Latina, misturando thrash agressivo com ritmos tribais.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@sepultura" }
      },
      {
        name: "Krisiun",
        genre: "Death Metal",
        country: "Brasil",
        formationYear: 1990,
        bio: "Trio gaúcho reverenciado mundialmente pela velocidade implacável e precisão técnica brutal no extreme metal.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@krisiun" }
      }
    ];

    const fallbackBandsES = [
      {
        name: "Barón Rojo",
        genre: "Hard Rock / Heavy Metal",
        country: "España",
        formationYear: 1980,
        bio: "Una de las bandas de heavy metal en español más importantes e influyentes, liderando la edad de oro del rock español.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@baronrojo" }
      },
      {
        name: "Iron Maiden",
        genre: "Heavy Metal",
        country: "Reino Unido",
        formationYear: 1975,
        bio: "Una leyenda del metal mundial con visitas masivas recurrentes en todos los estadios de América Latina y España.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@ironmaiden" }
      }
    ];

    const fallbackBandsEN = [
      {
        name: "Metallica",
        genre: "Heavy / Thrash Metal",
        country: "United States",
        formationYear: 1981,
        bio: "One of the most commercially successful and influential heavy metal bands of all time, filling arenas worldwide.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@metallica" }
      },
      {
        name: "Gojira",
        genre: "Progressive Metal",
        country: "France",
        formationYear: 1996,
        bio: "Renowned progressive metal band known for their environmentally themed lyrics and crushing technical rhythm sections.",
        logoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
        socials: { instagram: "@gojiraofficial" }
      }
    ];

    const fallbackEventsPT = [
      {
        name: "Metal Fest Tribute Tour",
        date: "2026-08-15",
        location: `Arena Municipal, ${fallbackLocation}`,
        lineup: ["Tribute Bands", "Host Act"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: true,
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80"
      },
      {
        name: "Thrash Metal Blitz",
        date: "2026-10-02",
        location: `Underground Club, ${fallbackLocation}`,
        lineup: ["Underground Legends", "Local Thrashers"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: false,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"
      }
    ];

    const fallbackEventsES = [
      {
        name: "Gira Tributo del Metal",
        date: "2026-08-15",
        location: `Arena Municipal, ${fallbackLocation}`,
        lineup: ["Bandas Tributo", "Artistas Locales"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: true,
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80"
      },
      {
        name: "Thrash Metal Tour",
        date: "2026-10-02",
        location: `Club Subterráneo, ${fallbackLocation}`,
        lineup: ["Leyendas locales", "Bandas de apoyo"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: false,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"
      }
    ];

    const fallbackEventsEN = [
      {
        name: "Metal Tribute Concert",
        date: "2026-08-15",
        location: `Main Stage Hall, ${fallbackLocation}`,
        lineup: ["Awesome Tributes", "Regional Acts"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: true,
        imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80"
      },
      {
        name: "Classic Heavy Metal Assault",
        date: "2026-10-02",
        location: `Underground Rock Bar, ${fallbackLocation}`,
        lineup: ["Local Metalheads", "Special Guests"],
        ticketLink: "https://www.ticketmaster.com",
        isFestival: false,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"
      }
    ];

    const selectedBands = isPt ? fallbackBandsPT : isEs ? fallbackBandsES : fallbackBandsEN;
    const selectedEvents = isPt ? fallbackEventsPT : isEs ? fallbackEventsES : fallbackEventsEN;

    res.json({
      locationDetected: fallbackLocation,
      localBands: selectedBands,
      localEvents: selectedEvents
    });
  }
});

// API: Generate fine-grained details for specific clicked member or album
app.post("/api/details/generate", async (req: Request, res: Response) => {
  const { type, bandName, targetName, lang = "pt" } = req.body;

  const ai = getAiClient();

  try {
    const prompt = type === "member"
      ? `Musician: "${targetName}" from the metal band "${bandName}".
Analyze and fetch real-world historical information about this musician.
Provide:
- Birth Information (Date, city and country, or leave empty if not found)
- Instruments (list of strings representing instruments played on recording and live)
- Contributions to "${bandName}" (summary of their role, specific traits, classic albums they played on)
- Other Notable Bands (list of strings with other existing bands they are or were linked to)
- Gear & Trivia (interesting equipment, performance style or historical anecdotes)
- Legacy Summary (legacy as a metal artist)

CRITICAL DIRECTIVE: Do NOT use the words "lendário", "lendária", "lenda", "lendas", "legendary", "legendaria" anywhere in descriptions. Translate all texts into: "${lang}".

CRITICAL DIRECTIVE 2: Only provide specific, real, authentic, and historically accurate descriptions/details for this exact musician. If you cannot find specific, authentic details/descriptions about their birth info, instruments played, contributions/role, other bands, gear/trivia, or legacy, you MUST leave those fields completely empty (e.g., return "" or an empty array []). Do NOT under any circumstances generate generic, filler, or placeholder info (like "Guitars, Bass, Vocals, Drums", "Membro ativo essencial", "Conhecido por suas performances intensas", etc.). If there are no specific descriptions, return nothing.

Return STRICTLY this JSON schema (do NOT wrap in markdown code blocks like \`\`\`json, return only the raw string):
{
  "name": "${targetName}",
  "birthInfo": "Specific birth date or country indicator, or empty \"\"",
  "instruments": ["instrument 1", "instrument 2"],
  "contributions": "Specific description of their work in ${bandName}, or empty \"\"",
  "otherBands": ["Band A", "Band B"],
  "trivia": "Specific gear details or historical facts, or empty \"\"",
  "summary": "Specific legacy message, or empty \"\""
}`
      : `Album/Release: "${targetName}" by the metal band "${bandName}".
Analyze and fetch real-world historical information about this album/EP/single release.
Provide:
- Official Release Info (date, record label background, or leave empty if not found)
- Genre (specific subgenres and conceptual themes of lyrics)
- Full Tracklist (realistic sequence of songs with estimated track lengths, at least 4-8 tracks if it is an album/EP)
- Backstory (facts about where it was recorded, writing or production anecdotes)
- Influence & Reception (critical impact or legacy)

CRITICAL DIRECTIVE: Do NOT use the words "lendário", "lendária", "lenda", "lendas", "legendary", "legendaria" anywhere in descriptions. Translate all texts into: "${lang}".

CRITICAL DIRECTIVE 2: Only provide specific, real, authentic, and historically accurate descriptions/details for this exact album. If you cannot find specific, authentic details/descriptions about the release info, genre/themes, tracklist, backstory, or critical reception/influence, you MUST leave those fields completely empty (e.g., return "" or an empty array []). Do NOT under any circumstances generate generic, filler, or placeholder info (like "Studio Release, Independent/Major Label", "Heavy Metal / Hard Rock", "Scream of the Damned", "Gravado durante sessões intensas", etc.). If there are no specific descriptions, return nothing.

Return STRICTLY this JSON schema (do NOT wrap in markdown code blocks like \`\`\`json, return only the raw string):
{
  "title": "${targetName}",
  "releaseInfo": "Specific release date and record label info, or empty \"\"",
  "genre": "Specific precise subgenres and themes, or empty \"\"",
  "tracklist": [
    { "track": "Track Title", "length": "Time" }
  ],
  "anecdote": "Specific recording trivia, songwriting backstory, or empty \"\"",
  "reception": "Specific summary of critical acclaim or influence, or empty \"\""
}`;

    if (!ai) throw new Error("Gemini client is not available");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const responseText = response.text || "";
    const cleanJson = extractJSON(responseText);

    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (err: any) {
    console.warn("Details generation offline mode activated:", formatErrorLog(err));
    
    // Provide an elegant fallback based on the requested target
    if (type === "member") {
      res.json({
        name: targetName,
        birthInfo: "",
        instruments: [],
        contributions: "",
        otherBands: [],
        trivia: "",
        summary: ""
      });
    } else {
      res.json({
        title: targetName,
        releaseInfo: "",
        genre: "",
        tracklist: [],
        anecdote: "",
        reception: ""
      });
    }
  }
});

// Vite server connection in dev, static static-serving in prod
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving loaded from /dist.");
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Rock & Metal server listening at http://0.0.0.0:${PORT}`);
    });
  }
};

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
