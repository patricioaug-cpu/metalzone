import { Band } from "./firebase";

export const ADDITIONAL_SEED_BANDS: Band[] = [
  // --- GRANDES NOMES ---
  {
    name: "Megadeth",
    country: "United States",
    formationYear: 1983,
    genre: "Thrash Metal",
    bio: {
      pt: "Lenda do Thrash Metal pioneira liderada por Dave Mustaine, famosa por sua velocidade e complexidade técnica refinada.",
      en: "Pioneering thrash metal legends led by Dave Mustaine, highly acclaimed for their technical speed and precision.",
      es: "Leyendas pioneras del thrash metal lideradas por Dave Mustaine, aclamadas por su velocidad técnica y precisión."
    },
    members: [{ name: "Dave Mustaine", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Rust in Peace", year: 1990, type: "Album" }],
    socials: { website: "https://www.megadeth.com", instagram: "@megadeth" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Pantera",
    country: "United States",
    formationYear: 1981,
    genre: "Groove Metal / Thrash Metal",
    bio: {
      pt: "Revolucionaram o cenário do metal dos anos 90 com riffs esmagadores de Dimebag Darrell e o groove agressivo incomparável.",
      en: "Revolutionized the 90s metal scene with crushing Dimebag Darrell riffs and an unmatched aggressive groove.",
      es: "Revolucionaron la escena del metal de los 90 con riffs demoledores de Dimebag Darrell y un groove agresivo inigualable."
    },
    members: [{ name: "Philip Anselmo", role: "Vocals", status: "active" }],
    discography: [{ title: "Vulgar Display of Power", year: 1992, type: "Album" }],
    socials: { website: "https://www.pantera.com", instagram: "@panteraofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Judas Priest",
    country: "United Kingdom",
    formationYear: 1969,
    genre: "Heavy Metal",
    bio: {
      pt: "Os legítimos 'Metal Gods'. Definiram os padrões estéticos, visuais de couro com tachas e andamento clássico do metal.",
      en: "The true 'Metal Gods' who defined the classic leather-and-spikes aesthetic and dual-guitar heavy metal attack.",
      es: "Los verdaderos 'Metal Gods' que definieron la estética de cuero y tachuelas y el ataque clásico del heavy metal."
    },
    members: [{ name: "Rob Halford", role: "Vocals", status: "active" }],
    discography: [{ title: "Painkiller", year: 1990, type: "Album" }],
    socials: { website: "https://www.judaspriest.com", instagram: "@judaspriest" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Motörhead",
    country: "United Kingdom",
    formationYear: 1975,
    genre: "Heavy Metal / Speed Metal",
    bio: {
      pt: "Liderados pelo eterno Lemmy Kilmister. Uniram a fúria acelerada do punk com o peso ensurdecedor do rock clássico.",
      en: "Led by the immortal Lemmy Kilmister. Fused the fast-paced energy of punk rock with the deafening weight of heavy metal.",
      es: "Liderados por el inmortal Lemmy Kilmister. Fusionaron la energía acelerada del punk con el peso ensordecedor del heavy metal."
    },
    members: [{ name: "Lemmy Kilmister", role: "Bass & Vocals", status: "former" }],
    discography: [{ title: "Ace of Spades", year: 1980, type: "Album" }],
    socials: { website: "https://www.imotorhead.com", instagram: "@motorhead" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Anthrax",
    country: "United States",
    formationYear: 1981,
    genre: "Thrash Metal",
    bio: {
      pt: "Membros do histórico Big Four do Thrash Metal, conhecidos por sua energia incomparável e atitude crossover.",
      en: "Renowned members of the legendary Big Four of Thrash Metal, combining speed with high-energy crossover punk attitude.",
      es: "Miembros reconocidos del legendario Big Four del Thrash Metal, que combinan velocidad con actitud de punk crossover."
    },
    members: [{ name: "Scott Ian", role: "Guitars", status: "active" }],
    discography: [{ title: "Among the Living", year: 1987, type: "Album" }],
    socials: { website: "https://www.anthrax.com", instagram: "@anthrax" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Slipknot",
    country: "United States",
    formationYear: 1995,
    genre: "Alternative Metal / Nu Metal",
    bio: {
      pt: "Famosos por suas máscaras grotescas e performances ao vivo caóticas, são um dos maiores ícones do metal moderno.",
      en: "Famous for their theatrical masks and chaotic high-intensity live shows, they are icons of modern alternative metal.",
      es: "Famosos por sus máscaras teatrales y espectáculos caóticos de alta intensidad, son íconos del metal alternativo moderno."
    },
    members: [{ name: "Corey Taylor", role: "Vocals", status: "active" }],
    discography: [{ title: "Iowa", year: 2001, type: "Album" }],
    socials: { website: "https://www.slipknot1.com", instagram: "@slipknot" },
    contacts: {}, approved: true, submittedBy: "system"
  },

  // --- DEATH / EXTREME ---
  {
    name: "Cannibal Corpse",
    country: "United States",
    formationYear: 1988,
    genre: "Death Metal",
    bio: "Pioneiros brutais do Death Metal, influenciaram gerações com andamentos rápidos e temas inspirados em horror sangrento.",
    members: [{ name: "George Corpsegrinder", role: "Vocals", status: "active" }],
    discography: [{ title: "Tomb of the Mutilated", year: 1992, type: "Album" }],
    socials: { instagram: "@cannibalcorpseofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Morbid Angel",
    country: "United States",
    formationYear: 1983,
    genre: "Death Metal",
    bio: "Uma das bandas mais aclamadas e influentes do Death Metal da Flórida, liderada pelo guitarrista genial Trey Azagthoth.",
    members: [{ name: "Trey Azagthoth", role: "Guitars", status: "active" }],
    discography: [{ title: "Altars of Madness", year: 1989, type: "Album" }],
    socials: { website: "https://www.morbidangel.com" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Obituary",
    country: "United States",
    formationYear: 1984,
    genre: "Death Metal",
    bio: "Pioneiros do Death Metal com andamentos lentos arrastados, vocais guturais de John Tardy e riffs de alta densidade.",
    members: [{ name: "John Tardy", role: "Vocals", status: "active" }],
    discography: [{ title: "Slowly We Rot", year: 1989, type: "Album" }],
    socials: { instagram: "@obituaryband" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Deicide",
    country: "United States",
    formationYear: 1987,
    genre: "Death Metal",
    bio: "Liderada por Glen Benton, famosa por suas temáticas satânicas implacáveis, vocais sobrepostos e riffs extremamente velozes.",
    members: [{ name: "Glen Benton", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Deicide", year: 1990, type: "Album" }],
    socials: { instagram: "@deicideofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Nile",
    country: "United States",
    formationYear: 1993,
    genre: "Technical Death Metal",
    bio: "Famosos por fundir Death Metal extremamente técnico e rápido com influências, melodias e mistérios do Antigo Egito.",
    members: [{ name: "Karl Sanders", role: "Guitars & Vocals", status: "active" }],
    discography: [{ title: "Annihilation of the Wicked", year: 2005, type: "Album" }],
    socials: { instagram: "@nile_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Behemoth",
    country: "Poland",
    formationYear: 1991,
    genre: "Blackened Death Metal",
    bio: "Sob liderança de Nergal, evoluíram do black metal cru clássico para uma força monumental de metal extremo teatral e blasfemo.",
    members: [{ name: "Nergal", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "The Satanist", year: 2014, type: "Album" }],
    socials: { instagram: "@behemothofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Amon Amarth",
    country: "Sweden",
    formationYear: 1992,
    genre: "Melodic Death Metal / Viking Metal",
    bio: "Icônica banda sueca com temática mitológica viking, riffs pesados melódicos e performances de palco repletas de navios dragões.",
    members: [{ name: "Johan Hegg", role: "Vocals", status: "active" }],
    discography: [{ title: "Twilight of the Thunder God", year: 2008, type: "Album" }],
    socials: { instagram: "@amonamarth" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Arch Enemy",
    country: "Sweden",
    formationYear: 1995,
    genre: "Melodic Death Metal",
    bio: "Ícone mundial do Death Metal Melódico, consagrado com solos de guitarra gêmeos brilhantes e os vocais arrasadores de Alissa White-Gluz.",
    members: [{ name: "Alissa White-Gluz", role: "Vocals", status: "active" }],
    discography: [{ title: "Anthems of Rebellion", year: 2003, type: "Album" }],
    socials: { instagram: "@archenemyofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Carcass",
    country: "United Kingdom",
    formationYear: 1985,
    genre: "Melodic Death Metal / Grindcore",
    bio: "Começaram como pioneiros do goregrind extremo de garagem e transitaram para estabelecer as bases do Death Metal Melódico de alta precisão.",
    members: [{ name: "Jeff Walker", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Heartwork", year: 1993, type: "Album" }],
    socials: { instagram: "@carcassband" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- PROGRESSIVE / TECHNICAL ---
  {
    name: "Opeth",
    country: "Sweden",
    formationYear: 1989,
    genre: "Progressive Metal / Death Metal",
    bio: "Pioneiros liderados por Mikael Åkerfeldt, mesclando de forma sublime a brutalidade do death metal extremo com passagens acústicas melancólicas.",
    members: [{ name: "Mikael Åkerfeldt", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Blackwater Park", year: 2001, type: "Album" }],
    socials: { instagram: "@opethband" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Meshuggah",
    country: "Sweden",
    formationYear: 1987,
    genre: "Technical Progressive Metal",
    bio: "Criadores da polirritmia extrema moderna e do gênero Djent, famosos por andamentos matemáticos e peso assustador.",
    members: [{ name: "Jens Kidman", role: "Vocals", status: "active" }],
    discography: [{ title: "ObZen", year: 2008, type: "Album" }],
    socials: { instagram: "@meshuggah" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Gojira",
    country: "France",
    formationYear: 1996,
    genre: "Progressive Metal / Groove Metal",
    bio: "Gigantes do metal francês, conhecidos por riffs extremamente rítmicos, temática focada na ecologia e precisão cirúrgica de bateria.",
    members: [{ name: "Joe Duplantier", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "From Mars to Sirius", year: 2005, type: "Album" }],
    socials: { instagram: "@gojiraofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Tool",
    country: "United States",
    formationYear: 1990,
    genre: "Progressive Metal / Rock",
    bio: "Altamente conceituados por composições de tempos matemáticos alternados, letras profundas, visuais místicos e artes experimentais.",
    members: [{ name: "Maynard James Keenan", role: "Vocals", status: "active" }],
    discography: [{ title: "Lateralus", year: 2001, type: "Album" }],
    socials: { instagram: "@toolmusic" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Porcupine Tree",
    country: "United Kingdom",
    formationYear: 1987,
    genre: "Progressive Metal / Rock",
    bio: "Idealizada pelo mestre Steven Wilson, a banda funde psicodelia clássica, metal melancólico e texturas sonoras cinematográficas.",
    members: [{ name: "Steven Wilson", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "In Absentia", year: 2002, type: "Album" }],
    socials: { instagram: "@porcupinetreeofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Devin Townsend Project",
    country: "Canada",
    formationYear: 2009,
    genre: "Progressive Metal",
    bio: "Projeto conceitual do gênio multifacetado canadense Devin Townsend, misturando peso industrial, corais e ficção científica.",
    members: [{ name: "Devin Townsend", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Epicloud", year: 2012, type: "Album" }],
    socials: { instagram: "@dvntownsend" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Haken",
    country: "United Kingdom",
    formationYear: 2007,
    genre: "Progressive Metal",
    bio: "Uma das principais bandas da nova geração do metal progressivo, famosa por melodias grandiosas, vocais harmonizados e peso moderno.",
    members: [{ name: "Ross Jennings", role: "Vocals", status: "active" }],
    discography: [{ title: "The Mountain", year: 2013, type: "Album" }],
    socials: { instagram: "@haken_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Symphony X",
    country: "United States",
    formationYear: 1994,
    genre: "Symphonic Progressive Metal",
    bio: "Combinam solos neoclássicos velozes do guitarrista Michael Romeo com arranjos sinfônicos e o vocal potente de Russell Allen.",
    members: [{ name: "Michael Romeo", role: "Guitars", status: "active" }],
    discography: [{ title: "The Divine Wings of Tragedy", year: 1997, type: "Album" }],
    socials: { instagram: "@symphonyxofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Animals as Leaders",
    country: "United States",
    formationYear: 2007,
    genre: "Instrumental Progressive Metal / Djent",
    bio: "Liderados pelo virtuoso da guitarra de 8 cordas Tosin Abasi, são pioneiros do metal instrumental técnico progressivo moderno.",
    members: [{ name: "Tosin Abasi", role: "Guitars", status: "active" }],
    discography: [{ title: "The Joy of Motion", year: 2014, type: "Album" }],
    socials: { instagram: "@animalsasleaders" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- METALCORE / MODERN ---
  {
    name: "Lamb of God",
    country: "United States",
    formationYear: 1994,
    genre: "Groove Metal / Metalcore",
    bio: "Lendas do Groove Metal, famosos por riffs sincopados devastadores de Mark Morton e vocais brutais incomparáveis de Randy Blythe.",
    members: [{ name: "Randy Blythe", role: "Vocals", status: "active" }],
    discography: [{ title: "Ashes of the Wake", year: 2004, type: "Album" }],
    socials: { instagram: "@lambofgod" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Killswitch Engage",
    country: "United States",
    formationYear: 1999,
    genre: "Metalcore",
    bio: "Pioneiros do som Metalcore melódico de Massachusetts, combinando refrões altamente melódicos com breakdown de guitarra pesados.",
    members: [{ name: "Jesse Leach", role: "Vocals", status: "active" }],
    discography: [{ title: "The End of Heartache", year: 2004, type: "Album" }],
    socials: { instagram: "@killswitchengage" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Trivium",
    country: "United States",
    formationYear: 1999,
    genre: "Modern Heavy Metal / Metalcore",
    bio: "Liderada por Matt Heafy, funde de forma magistral thrash metal clássico, velocidade do power metal e a agressividade do metalcore.",
    members: [{ name: "Matt Heafy", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Shogun", year: 2008, type: "Album" }],
    socials: { instagram: "@triviumband" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Parkway Drive",
    country: "Australia",
    formationYear: 2003,
    genre: "Metalcore / Arena Metal",
    bio: "Partiram da Austrália para conquistar arenas mundiais, com riffs pesados marcantes, breakdowns épicos e produções visuais de fogo.",
    members: [{ name: "Winston McCall", role: "Vocals", status: "active" }],
    discography: [{ title: "Horizons", year: 2007, type: "Album" }],
    socials: { instagram: "@parkwaydriveofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Architects",
    country: "United Kingdom",
    formationYear: 2004,
    genre: "Progressive Metalcore",
    bio: "Uma das bandas britânicas mais influentes do metalcore moderno, famosa por letras políticas profundas, peso absurdo e texturas eletrônicas.",
    members: [{ name: "Sam Carter", role: "Vocals", status: "active" }],
    discography: [{ title: "All Our Gods Have Abandoned Us", year: 2016, type: "Album" }],
    socials: { instagram: "@architects" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Bullet For My Valentine",
    country: "United Kingdom",
    formationYear: 1998,
    genre: "Metalcore / Alternative Metal",
    bio: "Estouraram mundialmente com o aclamado 'The Poison', redefinindo o apelo comercial do metalcore melódico dos anos 2000.",
    members: [{ name: "Matt Tuck", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "The Poison", year: 2005, type: "Album" }],
    socials: { instagram: "@bulletformyvalentine" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "As I Lay Dying",
    country: "United States",
    formationYear: 2000,
    genre: "Metalcore",
    bio: "Pilar definitivo do metalcore americano, consagrados com riffs harmonizados de guitarra suecos e bateria de ritmo frenético.",
    members: [{ name: "Tim Lambesis", role: "Vocals", status: "active" }],
    discography: [{ title: "An Ocean Between Us", year: 2007, type: "Album" }],
    socials: { instagram: "@asilaydying" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "August Burns Red",
    country: "United States",
    formationYear: 2003,
    genre: "Technical Metalcore",
    bio: "Conhecidos mundialmente por sua precisão rítmica cirúrgica, solos técnicos complexos de guitarra e breakdowns massivos.",
    members: [{ name: "Jake Luhrs", role: "Vocals", status: "active" }],
    discography: [{ title: "Constellations", year: 2009, type: "Album" }],
    socials: { instagram: "@augustburnsred" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Bring Me The Horizon",
    country: "United Kingdom",
    formationYear: 2004,
    genre: "Alternative Rock / Metal / Metalcore",
    bio: "Liderados por Oli Sykes, começaram no deathcore extremo e evoluíram continuamente para fundir rock alternativo, eletrônico e metalcore.",
    members: [{ name: "Oliver Sykes", role: "Vocals", status: "active" }],
    discography: [{ title: "Sempiternal", year: 2013, type: "Album" }],
    socials: { instagram: "@bringmethehorizon" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Spiritbox",
    country: "Canada",
    formationYear: 2017,
    genre: "Alternative Metal / Djent",
    bio: "Uma das bandas mais populares da atualidade, liderada pelos incríveis vocais limpos e guturais brutais de Courtney LaPlante.",
    members: [{ name: "Courtney LaPlante", role: "Vocals", status: "active" }],
    discography: [{ title: "Eternal Blue", year: 2021, type: "Album" }],
    socials: { instagram: "@spiritboxmusic" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- BLACK / DOOM / ATMOSPHERIC ---
  {
    name: "Mayhem",
    country: "Norway",
    formationYear: 1984,
    genre: "Black Metal",
    bio: "A banda mais controversa e lendária do Black Metal norueguês, pioneira na agressividade e estética obscura de maquiagem.",
    members: [{ name: "Necrobutcher", role: "Bass", status: "active" }],
    discography: [{ title: "De Mysteriis Dom Sathanas", year: 1994, type: "Album" }],
    socials: { instagram: "@thetruemayhem" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Darkthrone",
    country: "Norway",
    formationYear: 1986,
    genre: "Black Metal / Heavy Metal",
    bio: "Pioneiros do Black Metal cru analógico de produção de garagem, mantendo-se avessos a turnês sob comando de Fenriz.",
    members: [{ name: "Fenriz", role: "Drums & Bass", status: "active" }],
    discography: [{ title: "A Blaze in the Northern Sky", year: 1992, type: "Album" }],
    socials: { instagram: "@darkthroneofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Emperor",
    country: "Norway",
    formationYear: 1991,
    genre: "Symphonic Black Metal",
    bio: "Gênios da fusão da fúria do black metal com harmonias de sintetizadores sinfônicos majestosos e solos de Ihsahn.",
    members: [{ name: "Ihsahn", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "In the Nightside Eclipse", year: 1994, type: "Album" }],
    socials: { instagram: "@emperorofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Immortal",
    country: "Norway",
    formationYear: 1991,
    genre: "Black Metal",
    bio: "Famosos por riffs extremamente rápidos de temática de inverno do reino místico de Blashyrkh e corpse paint icônico.",
    members: [{ name: "Demonaz", role: "Guitars & Vocals", status: "active" }],
    discography: [{ title: "Sons of Northern Darkness", year: 2002, type: "Album" }],
    socials: { instagram: "@immortalofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Burzum",
    country: "Norway",
    formationYear: 1991,
    genre: "Black Metal / Ambient",
    bio: "Projeto solo instrumental e conceitual que marcou os alicerces do black metal atmosférico e dungeon synth primitivo.",
    members: [{ name: "Varg Vikernes", role: "All Instruments", status: "active" }],
    discography: [{ title: "Filosofem", year: 1996, type: "Album" }],
    socials: { website: "https://www.burzum.org" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Electric Wizard",
    country: "United Kingdom",
    formationYear: 1993,
    genre: "Stoner Doom Metal",
    bio: "Definidores do som de Doom Metal mais pesado do mundo, fundindo riffs psicodélicos inspirados em ocultismo clássico de terror.",
    members: [{ name: "Jus Oborn", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Dopethrone", year: 2000, type: "Album" }],
    socials: { instagram: "@electricwizardband" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Paradise Lost",
    country: "United Kingdom",
    formationYear: 1988,
    genre: "Gothic Metal / Doom Metal",
    bio: "Criadores fundamentais do som Gothic Metal, equilibrando a melancolia do Doom com arranjos melódicos e sombrios.",
    members: [{ name: "Nick Holmes", role: "Vocals", status: "active" }],
    discography: [{ title: "Gothic", year: 1991, type: "Album" }],
    socials: { instagram: "@paradiselostofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "My Dying Bride",
    country: "United Kingdom",
    formationYear: 1990,
    genre: "Gothic Doom Metal",
    bio: "Pioneiros em misturar violinos sombrios, teclados teatrais e vocais de lamento ao peso extremo do doom metal britânico.",
    members: [{ name: "Aaron Stainthorpe", role: "Vocals", status: "active" }],
    discography: [{ title: "Turn Loose the Swans", year: 1993, type: "Album" }],
    socials: { instagram: "@mydyingbrideofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Swallow the Sun",
    country: "Finland",
    formationYear: 2000,
    genre: "Melodic Doom / Death Metal",
    bio: "Líderes do doom metal melódico moderno na Finlândia, trazendo uma densa atmosfera melancólica com beleza gelada única.",
    members: [{ name: "Juha Raivio", role: "Guitars", status: "active" }],
    discography: [{ title: "Songs from the North", year: 2015, type: "Album" }],
    socials: { instagram: "@swallowthesunofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- BANDAS BRASILEIRAS ---
  {
    name: "Krisiun",
    country: "Brazil",
    formationYear: 1990,
    genre: "Brutal Death Metal",
    bio: "Trio brasileiro de irmãos respeitado internacionalmente por sua velocidade inacreditável de bateria e riffs incessantes.",
    members: [{ name: "Alex Camargo", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Black Force Domain", year: 1995, type: "Album" }],
    socials: { instagram: "@krisiun" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Claustrofobia",
    country: "Brazil",
    formationYear: 1994,
    genre: "Thrash / Death Metal",
    bio: "Gigantes brasileiros do thrash metal underground, famosos por misturar agressividade rítmica, percussão brasileira e grooves pesados.",
    members: [{ name: "Marcus D'Angelo", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Unbreakable", year: 2022, type: "Album" }],
    socials: { instagram: "@claustrofobia_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Dr. Sin",
    country: "Brazil",
    formationYear: 1991,
    genre: "Hard Rock / Heavy Metal",
    bio: "Trio virtuoso consagrado de rock pesado e heavy metal brasileiro, famoso pela técnica instrumental de guitarra de Edu Ardanuy.",
    members: [{ name: "Andria Busic", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Dr. Sin", year: 1993, type: "Album" }],
    socials: { instagram: "@drsinoficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Nervosa",
    country: "Brazil",
    formationYear: 2010,
    genre: "Thrash / Death Metal",
    bio: {
      pt: "Banda brasileira de thrash/death metal formada em São Paulo em 2010 pela guitarrista Prika Amaral. Reconhecida internacionalmente por sua sonoridade agressiva, rápida e puramente feminina, a Nervosa consolidou seu espaço no cenário mundial do metal extremo.",
      en: "Brazilian thrash/death metal band formed in São Paulo in 2010 by guitarist Prika Amaral. Internationally acclaimed for their aggressive, fast-paced, all-female lineup sound, Nervosa has firmly established their place in the global extreme metal scene.",
      es: "Banda brasileña de thrash/death metal formada en São Paulo en 2010 por la guitarrista Prika Amaral. Aclamada internacionalmente por su sonido agresivo y rápido, Nervosa se ha establecido firmemente en la escena mundial del metal extremo."
    },
    members: [
      { name: "Prika Amaral", role: "Vocals & Rhythm Guitar", status: "active" },
      { name: "Helena Kotina", role: "Lead Guitar", status: "active" },
      { name: "Hel Pyre", role: "Bass", status: "active" },
      { name: "Gabriela Abud", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "Victim of Yourself", year: 2014, type: "Album" },
      { title: "Agony", year: 2016, type: "Album" },
      { title: "Downfall of Mankind", year: 2018, type: "Album" },
      { title: "Perpetual Chaos", year: 2021, type: "Album" },
      { title: "Jailbreak", year: 2023, type: "Album" }
    ],
    socials: { instagram: "@nervosathrash" },
    contacts: {},
    approved: true,
    submittedBy: "system"
  },
  {
    name: "Project46",
    country: "Brazil",
    formationYear: 2008,
    genre: "Metalcore / Groove Metal",
    bio: "Uma das bandas de metal moderno mais proeminentes do Brasil, com letras cantadas em português abordando temas de injustiça social.",
    members: [{ name: "Caio MacBeserra", role: "Vocals", status: "active" }],
    discography: [{ title: "TR3S", year: 2017, type: "Album" }],
    socials: { instagram: "@project46_oficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Shaman",
    country: "Brazil",
    formationYear: 2000,
    genre: "Symphonic Power Metal",
    bio: "Fundada por membros dissidentes do Angra, conquistou fama mundial com clássicos eternos nas vozes lendárias de Andre Matos.",
    members: [{ name: "Hugo Mariutti", role: "Guitars", status: "active" }],
    discography: [{ title: "Ritual", year: 2002, type: "Album" }],
    socials: { instagram: "@shamanbandoficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Torture Squad",
    country: "Brazil",
    formationYear: 1990,
    genre: "Thrash / Death Metal",
    bio: "Importante pilar do metal extremo brasileiro, misturando de forma contundente e técnica a velocidade do thrash e o peso do death.",
    members: [{ name: "Mayara Puertas", role: "Vocals", status: "active" }],
    discography: [{ title: "The Relic of the Beast", year: 2003, type: "Album" }],
    socials: { instagram: "@torturesquad" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Eminence",
    country: "Brazil",
    formationYear: 1995,
    genre: "Groove Metal / Modern Metal",
    bio: "Banda mineira de Belo Horizonte fundada por Alan Wallace, conhecida internacionalmente por riffs industriais pesados e grooves modernos.",
    members: [{ name: "Bruno Coimbra", role: "Vocals", status: "active" }],
    discography: [{ title: "The Black Star", year: 2013, type: "Album" }],
    socials: { instagram: "@eminenceband" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- THRASH MODERNO ---
  {
    name: "Kreator",
    country: "Germany",
    formationYear: 1982,
    genre: "Thrash Metal",
    bio: "Lendas do Thrash Metal alemão lideradas por Mille Petrozza, conhecidos por sua agressividade ríspida, temas violentos e refrões grandiosos.",
    members: [{ name: "Mille Petrozza", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Pleasure to Kill", year: 1986, type: "Album" }],
    socials: { instagram: "@kreatorofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Sodom",
    country: "Germany",
    formationYear: 1982,
    genre: "Thrash Metal",
    bio: "Liderada por Tom Angelripper, é uma das bandas mais brutais e influentes do thrash alemão clássico.",
    members: [{ name: "Tom Angelripper", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Agent Orange", year: 1989, type: "Album" }],
    socials: { instagram: "@sodom_band_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Destruction",
    country: "Germany",
    formationYear: 1982,
    genre: "Thrash Metal",
    bio: "Completa o lendário trio do thrash alemão clássico com riffs cortantes e os vocais estridentes marcantes de Schmier.",
    members: [{ name: "Schmier", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Eternal Ban", year: 1986, type: "Album" }],
    socials: { instagram: "@destruction_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Testament",
    country: "United States",
    formationYear: 1983,
    genre: "Thrash Metal",
    bio: "Lendas da Bay Area, reconhecidos mundialmente pelo vocal potente de Chuck Billy e a técnica virtuosa de guitarra de Alex Skolnick.",
    members: [{ name: "Chuck Billy", role: "Vocals", status: "active" }],
    discography: [{ title: "The Legacy", year: 1987, type: "Album" }],
    socials: { instagram: "@testamentofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Exodus",
    country: "United States",
    formationYear: 1979,
    genre: "Thrash Metal",
    bio: "Os verdadeiros arquitetos pioneiros do thrash metal da Bay Area de San Francisco, comandados pelo mestre de riffs Gary Holt.",
    members: [{ name: "Gary Holt", role: "Guitars", status: "active" }],
    discography: [{ title: "Bonded by Blood", year: 1985, type: "Album" }],
    socials: { instagram: "@exodusbandofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Overkill",
    country: "United States",
    formationYear: 1980,
    genre: "Thrash Metal",
    bio: "Banda lendária do thrash de Nova Jersey, consagrada pela voz única e estridente de Bobby 'Blitz' Ellsworth.",
    members: [{ name: "Bobby Blitz", role: "Vocals", status: "active" }],
    discography: [{ title: "The Years of Decay", year: 1989, type: "Album" }],
    socials: { instagram: "@overkillofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Havok",
    country: "United States",
    formationYear: 2004,
    genre: "Thrash Metal",
    bio: "Líderes do renascimento moderno do Thrash Metal nos EUA, com composições rápidas de andamentos técnicos e críticas sociais ácidas.",
    members: [{ name: "David Sanchez", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Time Is Up", year: 2011, type: "Album" }],
    socials: { instagram: "@havokbandofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Municipal Waste",
    country: "United States",
    formationYear: 2001,
    genre: "Crossover Thrash",
    bio: "Mestres absolutos do Crossover Thrash moderno, famosos por shows intensos repletos de moshes em festivais.",
    members: [{ name: "Tony Foresta", role: "Vocals", status: "active" }],
    discography: [{ title: "The Art of Partying", year: 2007, type: "Album" }],
    socials: { instagram: "@municipalwaste" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Warbringer",
    country: "United States",
    formationYear: 2004,
    genre: "Thrash Metal",
    bio: "Uma das bandas mais agressivas do thrash moderno da Califórnia, aliando andamentos frenéticos com letras inspiradas na guerra.",
    members: [{ name: "John Kevill", role: "Vocals", status: "active" }],
    discography: [{ title: "Woe to the Vanquished", year: 2017, type: "Album" }],
    socials: { instagram: "@warbringermusic" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Toxic Holocaust",
    country: "United States",
    formationYear: 1999,
    genre: "Blackened Thrash Metal / Speed Metal",
    bio: "Projeto solo do multi-instrumentista Joel Grind, fundindo thrash metal oitentista clássico com atitude punk crua e temas nucleares.",
    members: [{ name: "Joel Grind", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "An Overdose of Death...", year: 2008, type: "Album" }],
    socials: { instagram: "@toxicholocaust_official" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- OUTRAS RELEVANTES GLOBAIS ---
  {
    name: "Sabaton",
    country: "Sweden",
    formationYear: 1999,
    genre: "Power Metal",
    bio: "Icônica banda de power metal mundialmente famosa por suas letras épicas e teatrais baseadas em fatos e batalhas de guerras históricas reais.",
    members: [{ name: "Joakim Brodén", role: "Vocals", status: "active" }],
    discography: [{ title: "The Art of War", year: 2008, type: "Album" }],
    socials: { instagram: "@sabatononline" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Nightwish",
    country: "Finland",
    formationYear: 1996,
    genre: "Symphonic Metal",
    bio: "Pioneiros incontestáveis do metal sinfônico mundial, unindo guitarras pesadas de metal com arranjos de orquestra clássica e vozes de ópera.",
    members: [{ name: "Tuomas Holopainen", role: "Keyboards", status: "active" }],
    discography: [{ title: "Once", year: 2004, type: "Album" }],
    socials: { instagram: "@nightwish" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Epica",
    country: "Netherlands",
    formationYear: 2002,
    genre: "Symphonic Metal",
    bio: "Banda de prestígio liderada por Simone Simons, equilibrando de forma perfeita corais operáticos grandiosos com peso extremo.",
    members: [{ name: "Simone Simons", role: "Vocals", status: "active" }],
    discography: [{ title: "Design Your Universe", year: 2009, type: "Album" }],
    socials: { instagram: "@epicaofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Within Temptation",
    country: "Netherlands",
    formationYear: 1996,
    genre: "Symphonic Metal",
    bio: "Liderada pelos belíssimos vocais limpos de Sharon den Adel, são um dos maiores representantes globais do metal gótico sinfônico.",
    members: [{ name: "Sharon den Adel", role: "Vocals", status: "active" }],
    discography: [{ title: "The Silent Force", year: 2004, type: "Album" }],
    socials: { instagram: "@wtofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Powerwolf",
    country: "Germany",
    formationYear: 2003,
    genre: "Power Metal",
    bio: "Famosos por seu estilo teatral com temática voltada a lendas de lobisomens e estética gótica eclesiástica de palco.",
    members: [{ name: "Attila Dorn", role: "Vocals", status: "active" }],
    discography: [{ title: "Blood of the Saints", year: 2011, type: "Album" }],
    socials: { instagram: "@powerwolf_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Blind Guardian",
    country: "Germany",
    formationYear: 1984,
    genre: "Power Metal / Speed Metal",
    bio: "Considerados os bardos definitivos do metal, famosos por suas canções baseadas nas obras mitológicas de J.R.R. Tolkien.",
    members: [{ name: "Hansi Kürsch", role: "Vocals", status: "active" }],
    discography: [{ title: "Imaginations from the Other Side", year: 1995, type: "Album" }],
    socials: { instagram: "@blindguardian" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "HammerFall",
    country: "Sweden",
    formationYear: 1993,
    genre: "Heavy Metal / Power Metal",
    bio: "Banda que resgatou o Heavy Metal tradicional clássico nos anos 90, com hinos épicos sobre martelos sagrados e guerreiros.",
    members: [{ name: "Joacim Cans", role: "Vocals", status: "active" }],
    discography: [{ title: "Glory to the Brave", year: 1997, type: "Album" }],
    socials: { instagram: "@hammerfall_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Rammstein",
    country: "Germany",
    formationYear: 1994,
    genre: "Neue Deutsche Härte / Industrial Metal",
    bio: "Titãs do metal industrial alemão de Berlim, mundialmente famosos por shows pirotécnicos teatrais massivos e som ultra pesado.",
    members: [{ name: "Till Lindemann", role: "Vocals", status: "active" }],
    discography: [{ title: "Mutter", year: 2001, type: "Album" }],
    socials: { instagram: "@rammsteinofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "In Flames",
    country: "Sweden",
    formationYear: 1990,
    genre: "Melodic Death Metal / Alternative Metal",
    bio: "Começaram como pioneiros do som clássico do death metal melódico de Gotemburgo e transitaram para o metal alternativo moderno.",
    members: [{ name: "Anders Fridén", role: "Vocals", status: "active" }],
    discography: [{ title: "Clayman", year: 2000, type: "Album" }],
    socials: { instagram: "@inflames" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Children of Bodom",
    country: "Finland",
    formationYear: 1993,
    genre: "Melodic Death Metal / Power Metal",
    bio: "Consagrada pelos virtuosos solos rápidos de guitarra e teclado do saudoso guitarrista genial Alexi Laiho.",
    members: [{ name: "Alexi Laiho", role: "Vocals & Lead Guitars", status: "former" }],
    discography: [{ title: "Follow the Reaper", year: 2000, type: "Album" }],
    socials: { instagram: "@cobhc" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- NOVA GERAÇÃO / POPULARES ATUAIS ---
  {
    name: "Lorna Shore",
    country: "United States",
    formationYear: 2010,
    genre: "Symphonic Deathcore",
    bio: "Redefiniram o deathcore moderno ao fundir arranjos sinfônicos grandiosos de orquestra com os guturais assustadores de Will Ramos.",
    members: [{ name: "Will Ramos", role: "Vocals", status: "active" }],
    discography: [{ title: "Pain Remains", year: 2022, type: "Album" }],
    socials: { instagram: "@lornashore" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Slaughter to Prevail",
    country: "Russia",
    formationYear: 2014,
    genre: "Deathcore",
    bio: "Liderada por Alex Terrible, famosa por suas máscaras douradas icônicas e shows brutais repletos de vocais absurdamente guturais.",
    members: [{ name: "Alex Terrible", role: "Vocals", status: "active" }],
    discography: [{ title: "Kostolom", year: 2021, type: "Album" }],
    socials: { instagram: "@slaughtertoprevailg" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Jinjer",
    country: "Ukraine",
    formationYear: 2009,
    genre: "Progressive Metalcore / Groove Metal",
    bio: "Banda ucraniana respeitada mundialmente, sob comando da vocalista e frontwoman de imensa técnica de canto Tatiana Shmayluk.",
    members: [{ name: "Tatiana Shmayluk", role: "Vocals", status: "active" }],
    discography: [{ title: "Macro", year: 2019, type: "Album" }],
    socials: { instagram: "@jinjer_official" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Sleep Token",
    country: "United Kingdom",
    formationYear: 2016,
    genre: "Alternative Metal / Progressive Rock",
    bio: "Banda mascarada misteriosa sob liderança de 'Vessel', que explodiu no Tiktok e festivais ao fundir pop, eletrônica e metal pesado.",
    members: [{ name: "Vessel", role: "Vocals & Keyboards", status: "active" }],
    discography: [{ title: "Take Me Back to Eden", year: 2023, type: "Album" }],
    socials: { instagram: "@sleep_token" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Bad Omens",
    country: "United States",
    formationYear: 2015,
    genre: "Alternative Metal / Metalcore",
    bio: "Alcançaram imenso sucesso nos charts ao fundir rock alternativo melódico com breakdowns agressivos de metalcore modernos.",
    members: [{ name: "Noah Sebastian", role: "Vocals", status: "active" }],
    discography: [{ title: "The Death of Peace of Mind", year: 2022, type: "Album" }],
    socials: { instagram: "@badomensofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Ice Nine Kills",
    country: "United States",
    formationYear: 2000,
    genre: "Metalcore / Symphonic Metal",
    bio: "Conceitualizaram o seu som em torno de homenagens e referências diretas a grandes clássicos do cinema de terror slasher.",
    members: [{ name: "Spencer Charnas", role: "Vocals", status: "active" }],
    discography: [{ title: "The Silver Scream", year: 2018, type: "Album" }],
    socials: { instagram: "@iceninekills" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Fit For An Autopsy",
    country: "United States",
    formationYear: 2008,
    genre: "Deathcore / Groove Metal",
    bio: "Banda consagrada de deathcore técnico dos EUA, que mistura andamentos brutais, andamento progressivo e letras de teor político.",
    members: [{ name: "Joe Badolato", role: "Vocals", status: "active" }],
    discography: [{ title: "Oh What the Future Holds", year: 2022, type: "Album" }],
    socials: { instagram: "@fitforanautopsy" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Whitechapel",
    country: "United States",
    formationYear: 2006,
    genre: "Deathcore",
    bio: "Precursores do deathcore clássico de Knoxville, conhecidos por sua muralha sonora maciça formada por três guitarristas.",
    members: [{ name: "Phil Bozeman", role: "Vocals", status: "active" }],
    discography: [{ title: "The Valley", year: 2019, type: "Album" }],
    socials: { instagram: "@whitechapelband" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Shadow of Intent",
    country: "United States",
    formationYear: 2014,
    genre: "Symphonic Deathcore",
    bio: "Trazem riffs incrivelmente técnicos, andamentos rápidos e letras ricas baseadas no universo e lore do game Halo.",
    members: [{ name: "Ben Duerr", role: "Vocals", status: "active" }],
    discography: [{ title: "Melancholy", year: 2019, type: "Album" }],
    socials: { instagram: "@shadowofintentct" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Turnstile",
    country: "United States",
    formationYear: 2010,
    genre: "Hardcore Punk / Alternative Rock",
    bio: "Banda icônica de Baltimore de Crossover Hardcore, misturando punk rock acelerado com grooves clássicos e atitude de pista de skate.",
    members: [{ name: "Brendan Yates", role: "Vocals", status: "active" }],
    discography: [{ title: "Glow On", year: 2021, type: "Album" }],
    socials: { instagram: "@turnstilehardcore" }, contacts: {}, approved: true, submittedBy: "system"
  },

  // --- EXTRAS IMPORTANTES ---
  {
    name: "Ghost",
    country: "Sweden",
    formationYear: 2006,
    genre: "Occult Rock / Heavy Metal",
    bio: "Banda teatral sueca liderada pelo genial Tobias Forge incorporando personagens eclesiais satânicos cativantes de palco.",
    members: [{ name: "Papa Emeritus IV", role: "Vocals", status: "active" }],
    discography: [{ title: "Meliora", year: 2015, type: "Album" }],
    socials: { instagram: "@thebandghost" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Avenged Sevenfold",
    country: "United States",
    formationYear: 1999,
    genre: "Alternative Metal / Heavy Metal",
    bio: "Ascenderam ao topo das rádios globais com riffs velozes de dupla harmonia de Synyster Gates e os vocais característicos de M. Shadows.",
    members: [{ name: "M. Shadows", role: "Vocals", status: "active" }],
    discography: [{ title: "City of Evil", year: 2005, type: "Album" }],
    socials: { instagram: "@avengedsevenfold" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Alter Bridge",
    country: "United States",
    formationYear: 2004,
    genre: "Alternative Metal / Hard Rock",
    bio: "Famosos por canções de riffs pesados e melódicos guiados pela brilhante técnica vocal lírica de Myles Kennedy.",
    members: [{ name: "Myles Kennedy", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Blackbird", year: 2007, type: "Album" }],
    socials: { instagram: "@alterbridgeofficial" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Mastodon",
    country: "United States",
    formationYear: 2000,
    genre: "Progressive Metal / Sludge Metal",
    bio: "Aclamada banda conceitual progressiva com quatro vocalistas, misturando de forma orgânica peso de riffs com passagens psicodélicas.",
    members: [{ name: "Troy Sanders", role: "Bass & Vocals", status: "active" }],
    discography: [{ title: "Crack the Skye", year: 2009, type: "Album" }],
    socials: { instagram: "@mastodonrocks" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Baroness",
    country: "United States",
    formationYear: 2003,
    genre: "Sludge Metal / Progressive Metal",
    bio: "Famosos por seus álbuns com nomes de cores e riffs de guitarras gêmeas harmonizadas melancólicas de alta beleza artística.",
    members: [{ name: "John Baizley", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Purple", year: 2015, type: "Album" }],
    socials: { instagram: "@yourbaroness" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Code Orange",
    country: "United States",
    formationYear: 2008,
    genre: "Metalcore / Industrial Hardcore",
    bio: "Trazem uma fúria industrial experimental agressiva aliada a elementos rítmicos de hardcore de garagem.",
    members: [{ name: "Jami Morgan", role: "Vocals & Drums", status: "active" }],
    discography: [{ title: "Underneath", year: 2020, type: "Album" }],
    socials: { instagram: "@codeorangetoth" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Periphery",
    country: "United States",
    formationYear: 2005,
    genre: "Progressive Metal / Djent",
    bio: "Pioneiros influentes do movimento Djent moderno mundial, liderados pelos riffs inventivos de três guitarristas mestre.",
    members: [{ name: "Spencer Sotelo", role: "Vocals", status: "active" }],
    discography: [{ title: "Periphery II: This Time It's Personal", year: 2012, type: "Album" }],
    socials: { instagram: "@periphery" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "While She Sleeps",
    country: "United Kingdom",
    formationYear: 2006,
    genre: "Metalcore",
    bio: "Uma das bandas britânicas mais enérgicas do metalcore moderno, famosa por riffs sincopados repletos de vocais de coro coletivos.",
    members: [{ name: "Loz Taylor", role: "Vocals", status: "active" }],
    discography: [{ title: "Brainwashed", year: 2015, type: "Album" }],
    socials: { instagram: "@whileshesleeps" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Every Time I Die",
    country: "United States",
    formationYear: 1998,
    genre: "Metalcore / Southern Rock",
    bio: "Lendária e caótica fusão de hardcore agressivo com ritmos sulistas e o humor lírico ácido marcante de Keith Buckley.",
    members: [{ name: "Keith Buckley", role: "Vocals", status: "former" }],
    discography: [{ title: "Low Teens", year: 2016, type: "Album" }],
    socials: { instagram: "@everytimeidie" }, contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Skank",
    country: "Brazil",
    formationYear: 1991,
    genre: "Pop Rock / Reggae Rock",
    bio: "Embora mais pop rock, é um dos maiores nomes surgidos na capital mineira, com melodias inesquecíveis e alcance nacional estrondoso.",
    members: [{ name: "Samuel Rosa", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Calango", year: 1994, type: "Album" }],
    socials: { website: "https://www.skank.com.br", instagram: "@skankoficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Pato Fu",
    country: "Brazil",
    formationYear: 1992,
    genre: "Indie Rock / Alternative Rock",
    bio: "Rock alternativo com forte identidade criativa e experimental de Belo Horizonte, liderados pelos vocais carismáticos de Fernanda Takai.",
    members: [{ name: "Fernanda Takai", role: "Vocals", status: "active" }],
    discography: [{ title: "Isopor", year: 1999, type: "Album" }],
    socials: { website: "https://www.patofu.com.br", instagram: "@patofu" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Paradise in Flames",
    country: "Brazil",
    formationYear: 2002,
    genre: "Extreme Metal / Symphonic Black Death Metal",
    bio: "Banda atual de Belo Horizonte, destaque nacional no metal extremo, conhecida por shows altamente teatrais e complexidade musical refinada.",
    members: [{ name: "A. Damien", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Devil's Fire", year: 2020, type: "Album" }],
    socials: { instagram: "@paradiseinflamesband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Tuatha de Danann",
    country: "Brazil",
    formationYear: 1994,
    genre: "Folk Metal / Celtic Metal",
    bio: "Diretamente de Varginha, mescla com maestria heavy metal com influências celtas tradicionais e folclore brasileiro, possuindo forte presença internacional.",
    members: [{ name: "Bruno Maia", role: "Vocals, Flute, Guitars", status: "active" }],
    discography: [{ title: "Tingaralatingadun", year: 2001, type: "Album" }],
    socials: { instagram: "@tuathadedanannofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Black Pantera",
    country: "Brazil",
    formationYear: 2014,
    genre: "Crossover / Thrash Metal / Hardcore",
    bio: "Trio explosivo e engajado de Uberaba, fundindo thrash metal, hardcore punk e letras de forte combate ao racismo e opressão.",
    members: [{ name: "Charles Gama", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "Ascensão", year: 2022, type: "Album" }],
    socials: { instagram: "@blackpanteraoficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Uganga",
    country: "Brazil",
    formationYear: 1993,
    genre: "Thrash Metal / Hardcore",
    bio: "Grande força do Triângulo Mineiro, mesclando Thrash Metal e Hardcore de garagem com letras críticas pesadas de imensa energia física de palco.",
    members: [{ name: "Manu Joker", role: "Vocals", status: "active" }],
    discography: [{ title: "Vol. 3: Caos de Lama", year: 2013, type: "Album" }],
    socials: { instagram: "@ugangaband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Drowned",
    country: "Brazil",
    formationYear: 1998,
    genre: "Death Metal / Thrash Metal",
    bio: "Death metal de alta precisão técnica e riffs brutais, consolidando-se como uma grande referência histórica no underground mineiro.",
    members: [{ name: "Fernando Lima", role: "Vocals", status: "active" }],
    discography: [{ title: "Bonegrinder", year: 2001, type: "Album" }],
    socials: { instagram: "@drowned_band" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Concreto",
    country: "Brazil",
    formationYear: 1994,
    genre: "Alternative Metal / Stoner Rock / Hardcore",
    bio: "Ícone de Belo Horizonte, mistura de forma autêntica metal alternativo pesado, stoner rock e hardcore, com presença marcante em festivais locais.",
    members: [{ name: "Hugo", role: "Vocals & Bass", status: "active" }],
    discography: [{ title: "Calor Humano", year: 2001, type: "Album" }],
    socials: { instagram: "@bandaconcreto" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Hellish War",
    country: "Brazil",
    formationYear: 1995,
    genre: "Heavy Metal",
    bio: "Heavy metal tradicional e speed metal com pegada clássica oitentista, solos gêmeos de guitarra e crescente reconhecimento global.",
    members: [{ name: "Rogerio", role: "Guitars", status: "active" }],
    discography: [{ title: "Defender of Metal", year: 2001, type: "Album" }],
    socials: { instagram: "@hellishwar" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Seventh Seal",
    country: "Brazil",
    formationYear: 1995,
    genre: "Power Metal / Progressive Metal",
    bio: "Destaque do metal melódico nacional, apostando alto em melodias épicas orquestradas, arranjos de teclado refinados e solos técnicos.",
    members: [{ name: "Tiago", role: "Vocals", status: "active" }],
    discography: [{ title: "Messengers of a New Hope", year: 2001, type: "Album" }],
    socials: { instagram: "@seventhsealofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Lethal Curse",
    country: "Brazil",
    formationYear: 2012,
    genre: "Thrash Metal",
    bio: "Thrash metal emergente de Belo Horizonte com riffs agressivos acelerados, shows energéticos contagiantes e base de fãs engajada.",
    members: [{ name: "Lethal", role: "Vocals & Guitars", status: "active" }],
    discography: [{ title: "D.Y.S.P.H.O.R.I.A", year: 2019, type: "Album" }],
    socials: { instagram: "@lethalcurse" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Overdose",
    country: "Brazil",
    formationYear: 1983,
    genre: "Thrash Metal / Heavy Metal",
    bio: "Lenda pioneira do metal de Belo Horizonte, famosa pelo split álbum histórico 'Século XX' com o Sepultura em 1985 e turnês mundiais nos anos 90.",
    members: [{ name: "Pedro 'Bozó'", role: "Vocals", status: "active" }],
    discography: [{ title: "Século XX (Split)", year: 1985, type: "Album" }],
    socials: { instagram: "@overdose_official_band" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Foxie",
    country: "Brazil",
    formationYear: 1986,
    genre: "Glam Metal / Hard Rock",
    bio: "Banda icônica do circuito de Hard Rock de Belo Horizonte, trazendo riffs contagiantes, refrões marcantes e visual oitentista glamoroso.",
    members: [{ name: "Foxie", role: "Vocals", status: "active" }],
    discography: [{ title: "Foxie Live", year: 1992, type: "EP" }],
    socials: { instagram: "@bandafoxie" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Ancient Mariners",
    country: "Brazil",
    formationYear: 2002,
    genre: "Heavy Metal / Iron Maiden Tribute",
    bio: "Considerada um dos tributos mais fiéis e tradicionais ao Iron Maiden do Brasil, reproduzindo com maestria arranjos e figurinos clássicos nos palcos de BH.",
    members: [{ name: "Mariner", role: "Vocals", status: "active" }],
    discography: [{ title: "Live Tribute", year: 2015, type: "EP" }],
    socials: { instagram: "@ancientmariners_maidentribute" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Sacrificed",
    country: "Brazil",
    formationYear: 2004,
    genre: "Melodic Death Metal / Heavy Metal",
    bio: "Destaque do metal moderno em Belo Horizonte, liderada pelos potentes vocais de Kell Hell, aliando peso extremo, agressividade e melodias marcantes.",
    members: [{ name: "Kell Hell", role: "Vocals", status: "active" }],
    discography: [{ title: "Enraged", year: 2018, type: "Album" }],
    socials: { instagram: "@sacrificedofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Living Park",
    country: "Brazil",
    formationYear: 2015,
    genre: "Alternative Rock / Pop Rock",
    bio: "Banda de destaque na noite de Belo Horizonte, conhecida por performances cheias de energia, arranjos modernos e covers de altíssimo nível.",
    members: [{ name: "Living", role: "Vocals", status: "active" }],
    discography: [{ title: "Park Sessions", year: 2021, type: "EP" }],
    socials: { instagram: "@livingparkoficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Iowa",
    country: "Brazil",
    formationYear: 2010,
    genre: "Nu Metal / Slipknot Tribute",
    bio: "O maior e mais insano tributo ao Slipknot em Minas Gerais, reproduzindo com fidelidade cirúrgica as máscaras, macacões e a fúria caótica do grupo de Iowa.",
    members: [{ name: "Corey", role: "Vocals", status: "active" }],
    discography: [{ title: "Tribute Live Show", year: 2018, type: "EP" }],
    socials: { instagram: "@iowaslipknottribute" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda Give It Away",
    country: "Brazil",
    formationYear: 2012,
    genre: "Funk Rock / Red Hot Chili Peppers Tribute",
    bio: "Tributo de alta energia ao Red Hot Chili Peppers em Belo Horizonte, consagrado pela semelhança vocal, groove impecável de baixo e sintonia de palco.",
    members: [{ name: "Flea", role: "Bass", status: "active" }],
    discography: [{ title: "Peppers Tribute Night", year: 2019, type: "EP" }],
    socials: { instagram: "@giveitaway_rhcptribute" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Stryper",
    country: "United States",
    formationYear: 1983,
    genre: "Christian Glam Metal / Heavy Metal",
    bio: {
      pt: "Uma das bandas mais influentes do metal cristão mundial, conhecida pelo visual listrado em amarelo e preto, guitarras harmonizadas e os vocais agudos de Michael Sweet. Ajuda a difundir o metal cristão.",
      en: "One of the most influential Christian metal acts worldwide, famous for their yellow-and-black striped stage gear, harmonized guitars, and Michael Sweet's high-register vocals.",
      es: "Una de las bandas de metal cristiano más influyentes del mundo, famosa por sus trajes a rayas amarillas y negras, guitarras armonizadas y la potente voz de Michael Sweet."
    },
    members: [
      { name: "Michael Sweet", role: "Vocals & Guitars", status: "active" },
      { name: "Oz Fox", role: "Guitars", status: "active" },
      { name: "Perry Richardson", role: "Bass", status: "active" },
      { name: "Robert Sweet", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "To Hell with the Devil", year: 1986, type: "Album" },
      { title: "Soldiers Under Command", year: 1985, type: "Album" },
      { title: "The Yellow and Black Attack", year: 1984, type: "Album" }
    ],
    socials: { instagram: "@stryper", website: "http://www.stryper.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Petra",
    country: "United States",
    formationYear: 1972,
    genre: "Christian Rock / Hard Rock",
    bio: {
      pt: "Pioneiros absolutos do rock cristão, fundados na década de 70. Definiram o estilo com arranjos melódicos, mensagens de fé e guitarras marcantes de Bob Hartman. Uma grande referência do rock cristão.",
      en: "Absolute pioneers of Christian rock, formed in the 70s. They defined the genre with melodic arrangements, messages of faith, and Bob Hartman's soaring guitar work.",
      es: "Pioneros absolutos del rock cristiano, fundados en la década de los 70. Definieron el género con arreglos melódicos, mensajes de fe y las guitarras de Bob Hartman."
    },
    members: [
      { name: "Bob Hartman", role: "Guitars", status: "active" },
      { name: "John Schlitt", role: "Vocals", status: "active" },
      { name: "Louie Weaver", role: "Drums", status: "active" },
      { name: "John Lawry", role: "Keyboards", status: "active" }
    ],
    discography: [
      { title: "Beyond Belief", year: 1990, type: "Album" },
      { title: "More Power to Ya", year: 1982, type: "Album" },
      { title: "On Fire!", year: 1988, type: "Album" }
    ],
    socials: { instagram: "@petraband", website: "http://www.petraband.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Whitecross",
    country: "United States",
    formationYear: 1985,
    genre: "Christian Hard Rock",
    bio: {
      pt: "Banda de hard rock cristão famosa pelos solos virtuosos de Rex Carroll, frequentemente comparados ao estilo de Eddie Van Halen, e pelos vocais rasgados de Scott Wenzel. Representante icônica do rock cristão.",
      en: "Christian hard rock band famous for Rex Carroll's virtuous guitar solos, frequently compared to Eddie Van Halen, and Scott Wenzel's gritty vocals.",
      es: "Banda de hard rock cristiano famosa por los virtuosos solos de Rex Carroll, comparados con el estilo de Eddie Van Halen, y la voz de Scott Wenzel."
    },
    members: [
      { name: "Rex Carroll", role: "Guitars", status: "active" },
      { name: "Scott Wenzel", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Whitecross", year: 1987, type: "Album" },
      { title: "Triumphant Return", year: 1989, type: "Album" },
      { title: "In the Kingdom", year: 1991, type: "Album" }
    ],
    socials: { instagram: "@whitecrossofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Barren Cross",
    country: "United States",
    formationYear: 1983,
    genre: "Christian Heavy Metal",
    bio: {
      pt: "Consagrada banda de heavy metal tradicional cristão, apresentando uma sonoridade técnica muito próxima ao estilo de riffs e vocais de metal cristão clássico.",
      en: "Renowned traditional Christian heavy metal band, delivering a technical sound highly reminiscent of classic heavy metal paired with socially conscious lyrics.",
      es: "Consagrada banda de heavy metal tradicional cristiano, que presenta una sonoridad técnica muy cercana al estilo del metal clásico."
    },
    members: [
      { name: "Mike Lee", role: "Vocals", status: "active" },
      { name: "Ray Parris", role: "Guitars", status: "active" },
      { name: "Steve Whitaker", role: "Drums", status: "active" },
      { name: "Jim LaVerde", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Atomic Arena", year: 1988, type: "Album" },
      { title: "State of Control", year: 1989, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Bloodgood",
    country: "United States",
    formationYear: 1984,
    genre: "Christian Heavy Metal",
    bio: {
      pt: "Grande expoente do metal clássico cristão, conhecida por performances teatrais impactantes retratando temas espirituais e vocais dramáticos de Les Carlsen.",
      en: "Major exponent of classic Christian metal, known for dramatic theatrical stage performances portraying spiritual themes and Les Carlsen's intense vocals.",
      es: "Gran exponente del metal clásico cristiano, conocido por sus impactantes actuaciones teatrales y la voz dramática de Les Carlsen."
    },
    members: [
      { name: "Les Carlsen", role: "Vocals", status: "active" },
      { name: "Michael Bloodgood", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Detonation", year: 1987, type: "Album" },
      { title: "Bloodgood", year: 1986, type: "Album" }
    ],
    socials: { instagram: "@bloodgoodband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Tourniquet",
    country: "United States",
    formationYear: 1989,
    genre: "Technical Christian Thrash Metal",
    bio: {
      pt: "Formada pelo baterista Ted Kirkpatrick, a banda misturou thrash metal agressivo com música clássica, termos médicos e letras contra a crueldade animal. Um marco do metal cristão mais pesado.",
      en: "Formed by drummer Ted Kirkpatrick, the band combined aggressive thrash metal with classical music influences, medical terminology, and lyrics advocating animal rights.",
      es: "Formada por el baterista Ted Kirkpatrick, la banda mezcló thrash metal agresivo con música clásica, términos médicos y letras a favor de los derechos de los animales."
    },
    members: [
      { name: "Ted Kirkpatrick", role: "Drums", status: "active" },
      { name: "Gary Lenaire", role: "Guitars & Vocals", status: "active" },
      { name: "Guy Ritter", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Psycho Surgery", year: 1991, type: "Album" },
      { title: "Pathogenic Ocular Dissonance", year: 1992, type: "Album" },
      { title: "Stop the Bleeding", year: 1990, type: "Album" }
    ],
    socials: { instagram: "@tourniquetmetal" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Deliverance",
    country: "United States",
    formationYear: 1985,
    genre: "Christian Thrash / Speed Metal",
    bio: {
      pt: "Conhecidos pelo apelido 'Big D', são pioneiros do thrash metal cristão rápido e melódico sob a liderança do vocalista e guitarrista Jimmy P. Brown II. Grande nome do metal cristão.",
      en: "Known as 'Big D', they are pioneers of fast, melodic Christian thrash metal under the leadership of vocalist and guitarist Jimmy P. Brown II.",
      es: "Conocidos con el apodo de 'Big D', son pioneros del thrash metal cristiano rápido y melódico bajo el liderazgo de Jimmy P. Brown II."
    },
    members: [
      { name: "Jimmy P. Brown II", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "Deliverance", year: 1989, type: "Album" },
      { title: "Weapons of Our Warfare", year: 1990, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Mortification",
    country: "Australia",
    formationYear: 1990,
    genre: "Christian Death Metal",
    bio: {
      pt: "Os grandes pioneiros do death metal cristão mundial. Sob liderança de Steve Rowe, trouxeram o som extremo do death/grind para o meio cristão internacional.",
      en: "The premier pioneers of Christian death metal worldwide. Led by Steve Rowe, they successfully introduced extreme death/grind sounds into the Christian scene.",
      es: "Los grandes pioneros del death metal cristiano mundial. Liderados por Steve Rowe, introdujeron el sonido extremo del death/grind en la escena cristiana."
    },
    members: [
      { name: "Steve Rowe", role: "Bass & Vocals", status: "active" }
    ],
    discography: [
      { title: "Scrolls of the Megilloth", year: 1992, type: "Album" },
      { title: "Post Momentary Affliction", year: 1993, type: "Album" }
    ],
    socials: { website: "http://www.roweproductions.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Believer",
    country: "United States",
    formationYear: 1986,
    genre: "Technical Christian Progressive Thrash",
    bio: {
      pt: "Aclamada banda de thrash metal técnico e progressivo cristão, famosa por usar elementos de ópera e orquestra sinfônica em arranjos matemáticos do metal cristão.",
      en: "Highly acclaimed technical and progressive Christian thrash metal band, famous for incorporating operatic and symphonic elements into complex, mathematical arrangements.",
      es: "Aclamada banda de thrash metal técnico y progresivo cristiano, famosa por usar elementos de ópera y orquesta sinfónica."
    },
    members: [
      { name: "Kurt Bachman", role: "Vocals & Guitars", status: "active" },
      { name: "Joey Daub", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "Sanity Obscure", year: 1990, type: "Album" },
      { title: "Dimensions", year: 1993, type: "Album" }
    ],
    socials: { instagram: "@believerband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Extol",
    country: "Norway",
    formationYear: 1993,
    genre: "Christian Progressive Death / Black Metal",
    bio: {
      pt: "Banda norueguesa de metal extremo progressivo e sofisticado, aclamada pela complexidade musical, guitarras dissonantes e atmosfera avant-garde do metal cristão escandinavo.",
      en: "Sophisticated progressive extreme metal band from Norway, highly acclaimed for their musical complexity, dissonant guitars, and avant-garde atmosphere.",
      es: "Banda noruega de metal extremo progresivo y sofisticado, aclamada por su complejidad musical y atmósfera de metal cristiano."
    },
    members: [
      { name: "Peter Espevoll", role: "Vocals", status: "active" },
      { name: "Ole Børud", role: "Guitars & Vocals", status: "active" }
    ],
    discography: [
      { title: "Undeceived", year: 2000, type: "Album" },
      { title: "Burial", year: 1998, type: "Album" }
    ],
    socials: { instagram: "@extolofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Skillet",
    country: "United States",
    formationYear: 1996,
    genre: "Christian Alternative Rock / Industrial Metal",
    bio: {
      pt: "Uma das bandas de rock alternativo e rock cristão mais populares da atualidade, liderada pelo casal John e Cooper, misturando riffs eletrônicos, orquestrações e peso comercial.",
      en: "One of the most popular modern alternative rock bands, led by John and Korey Cooper, blending electronic riffs, orchestration, and commercially successful hard rock weight.",
      es: "Una de las bandas de rock alternativo más populares hoy en día, que mezcla riffs electrónicos, arreglos orquestales y un rock cristiano comercial exitoso."
    },
    members: [
      { name: "John Cooper", role: "Vocals & Bass", status: "active" },
      { name: "Korey Cooper", role: "Guitars & Keyboards", status: "active" },
      { name: "Jen Ledger", role: "Drums & Vocals", status: "active" },
      { name: "Seth Morrison", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Awake", year: 2009, type: "Album" },
      { title: "Comatose", year: 2006, type: "Album" },
      { title: "Unleashed", year: 2016, type: "Album" }
    ],
    socials: { instagram: "@skilletmusic", website: "http://www.skillet.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "P.O.D. (Payable on Death)",
    country: "United States",
    formationYear: 1992,
    genre: "Christian Nu Metal / Rap Metal",
    bio: {
      pt: "Gigantes do nu metal e rapcore mundial, misturando influências de reggae, punk e metal com letras espirituais de impacto urbano e base forte no rock cristão.",
      en: "Worldwide giants of nu metal and rapcore, fusing reggae, punk, and metal influences with spiritual lyrics addressing urban life.",
      es: "Gigantes del nu metal y rapcore mundial, que mezclan influencias de reggae, punk y metal con letras espirituales de gran impacto."
    },
    members: [
      { name: "Sonny Sandoval", role: "Vocals", status: "active" },
      { name: "Marcos Curiel", role: "Guitars", status: "active" },
      { name: "Wuv Bernardo", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "Satellite", year: 2001, type: "Album" },
      { title: "The Fundamental Elements of Southtown", year: 1999, type: "Album" }
    ],
    socials: { instagram: "@pod", website: "http://www.payableondeath.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Demon Hunter",
    country: "United States",
    formationYear: 2001,
    genre: "Christian Metalcore / Alternative Metal",
    bio: {
      pt: "Liderada por Ryan Clark, a banda destaca-se por fundir metalcore agressivo de riffs pesados com baladas melódicas refinadas de voz limpa barítona. Destaque do metal cristão moderno.",
      en: "Led by Ryan Clark, the band is prominent for fusing aggressive metalcore riffs with refined, melodic clean-sung baritone ballads.",
      es: "Liderada por Ryan Clark, la banda se destaca por fusionar metalcore agresivo con baladas melódicas de voz limpia."
    },
    members: [
      { name: "Ryan Clark", role: "Vocals", status: "active" },
      { name: "Jeremiah Scott", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "The Triptych", year: 2005, type: "Album" },
      { title: "Storm the Gates of Hell", year: 2007, type: "Album" }
    ],
    socials: { instagram: "@demonhunter", website: "http://www.demonhunter.net" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Underoath",
    country: "United States",
    formationYear: 1997,
    genre: "Christian Post-Hardcore / Metalcore",
    bio: {
      pt: "Uma das bandas de post-hardcore e rock cristão mais aclamadas dos anos 2000, fundindo teclados atmosféricos, vocais gritados desesperados de Spencer Chamberlain e bateria frenética de Aaron Gillespie.",
      en: "One of the most acclaimed post-hardcore bands of the 2000s, fusing atmospheric keyboards, Spencer Chamberlain's desperate screamed vocals, and Aaron Gillespie's frenetic drumming.",
      es: "Una de las bandas de post-hardcore más aclamadas de los años 2000, que fusiona teclados atmosféricos, gritos desesperados y ritmos acelerados."
    },
    members: [
      { name: "Spencer Chamberlain", role: "Vocals", status: "active" },
      { name: "Aaron Gillespie", role: "Drums & Vocals", status: "active" }
    ],
    discography: [
      { title: "They're Only Chasing Safety", year: 2004, type: "Album" },
      { title: "Define the Great Line", year: 2006, type: "Album" }
    ],
    socials: { instagram: "@underoathband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Living Sacrifice",
    country: "United States",
    formationYear: 1989,
    genre: "Christian Thrash / Death Metal / Metalcore",
    bio: {
      pt: "Banda pioneira de metal extremo cristão, influenciou diretamente o surgimento do metalcore moderno com riffs pesados, percussão sincopada e vocais brutais.",
      en: "Pioneering Christian extreme metal band that heavily influenced modern metalcore with heavy riffs, syncopated percussion, and crushing vocals.",
      es: "Banda pionera de metal extremo cristiano, que influyó directamente en el surgimiento del metalcore moderno con riffs pesados."
    },
    members: [
      { name: "Bruce Fitzhugh", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "Reborn", year: 1997, type: "Album" },
      { title: "The Hammering Process", year: 2000, type: "Album" }
    ],
    socials: { instagram: "@livingsacrifice" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Vengeance Rising",
    country: "United States",
    formationYear: 1987,
    genre: "Christian Thrash Metal / Speed Metal",
    bio: {
      pt: "Pioneiros do thrash metal cristão extremo dos anos 80, conhecidos por sua agressividade ríspida crua e letras focadas em teologia bíblica.",
      en: "Pioneers of extreme 1980s Christian thrash metal, renowned for their raw speed, gritty vocal style, and lyrics focused on theological concepts.",
      es: "Pioneros del thrash metal cristiano extremo de los años 80, conocidos por su agresividad cruda."
    },
    members: [
      { name: "Roger Martinez", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Human Sacrifice", year: 1988, type: "Album" },
      { title: "Once Dead", year: 1990, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Disciple",
    country: "United States",
    formationYear: 1992,
    genre: "Christian Hard Rock / Alternative Metal",
    bio: {
      pt: "Banda de hard rock e metal moderno norte-americana com riffs de guitarra pesados, refrões melódicos inspiradores e presença marcante de Kevin Young. Importante no rock cristão.",
      en: "American hard rock and modern metal band delivering heavy guitar riffs, inspiring melodic choruses, and the prominent leadership of Kevin Young.",
      es: "Banda de hard rock y metal moderno estadounidense con riffs pesados y estribillos melódicos inspiradores."
    },
    members: [
      { name: "Kevin Young", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Southern Hospitality", year: 2008, type: "Album" },
      { title: "Scars Remain", year: 2006, type: "Album" }
    ],
    socials: { instagram: "@disciplerocks" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Red",
    country: "United States",
    formationYear: 2002,
    genre: "Christian Alternative Rock / Symphonic Metal",
    bio: {
      pt: "Famosos por misturar rock alternativo denso com arranjos sinfônicos orquestrados de cordas dramáticas e vocais rasgados de Michael Barnes. Marco do rock cristão moderno.",
      en: "Famous for blending dark alternative rock with epic symphonic string arrangements and Michael Barnes's soaring, passionate vocals.",
      es: "Famosos por mezclar rock alternativo denso con arreglos sinfónicos orquestados y cuerdas dramáticas."
    },
    members: [
      { name: "Michael Barnes", role: "Vocals", status: "active" },
      { name: "Anthony Armstrong", role: "Guitars", status: "active" },
      { name: "Randy Armstrong", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "End of Silence", year: 2006, type: "Album" },
      { title: "Innocence & Instinct", year: 2009, type: "Album" }
    ],
    socials: { instagram: "@thebandred", website: "http://www.thebandred.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Fireflight",
    country: "United States",
    formationYear: 1999,
    genre: "Christian Alternative Rock",
    bio: {
      pt: "Destaque do rock alternativo cristão norte-americano liderado pela voz feminina potente de Dawn Michele, estourando com o single 'Unbreakable'.",
      en: "Prominent Christian alternative rock band from the USA led by Dawn Michele's powerful female vocals, exploding globally with the hit single 'Unbreakable'.",
      es: "Banda de rock alternativo cristiano estadounidense liderada por la potente voz femenina de Dawn Michele."
    },
    members: [
      { name: "Dawn Michele", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Unbreakable", year: 2008, type: "Album" }
    ],
    socials: { instagram: "@fireflight_official" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Rebanhão",
    country: "Brazil",
    formationYear: 1979,
    genre: "Christian Rock / Pop Rock",
    bio: {
      pt: "Pioneiros históricos do rock cristão no Brasil. Fundada por Janires Magalhães Manso, a banda enfrentou barreiras preconceituosas ao levar guitarras e teclados ao meio evangélico brasileiro.",
      en: "Historical pioneers of Christian rock in Brazil. Founded by Janires, they broke major cultural barriers by introducing electric guitars and modern keyboards to Brazilian churches.",
      es: "Pioneros históricos del rock cristiano en Brasil. Fundada por Janires, enfrentaron barreras culturales al llevar guitarras a las iglesias."
    },
    members: [
      { name: "Janires", role: "Vocals & Guitars", status: "former" },
      { name: "Carlinhos Felix", role: "Vocals & Guitars", status: "active" },
      { name: "Pedro Braconnot", role: "Keyboards", status: "active" }
    ],
    discography: [
      { title: "Mais Doce que o Mel", year: 1981, type: "Album" },
      { title: "Luz do Mundo", year: 1983, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Resgate",
    country: "Brazil",
    formationYear: 1989,
    genre: "Christian Rock / Hard Rock",
    bio: {
      pt: "Uma das bandas mais duradouras do rock cristão brasileiro, combinando hard rock clássico, blues e letras com fina ironia inteligente e reflexões bíblicas.",
      en: "One of the longest-running Brazilian Christian rock bands, combining classic hard rock, blues, and smart, ironical lyrics with biblical reflections.",
      es: "Una de las bandas más duraderas del rock cristiano brasileño, que combina hard rock clásico y letras con ironía."
    },
    members: [
      { name: "Zé Bruno", role: "Vocals & Guitars", status: "active" },
      { name: "Hamilton Gomes", role: "Guitars", status: "active" },
      { name: "Marcelo Basso", role: "Bass", status: "active" },
      { name: "Jorge Bruno", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "On the Rock", year: 1995, type: "Album" },
      { title: "Resgate", year: 1997, type: "Album" }
    ],
    socials: { instagram: "@bandaresgate" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Oficina G3",
    country: "Brazil",
    formationYear: 1987,
    genre: "Christian Metal / Progressive Metal",
    bio: {
      pt: "A maior e mais influente banda de rock e metal cristão do Brasil, conhecida pelo virtuosismo de Juninho Afram e a voz brilhante de Mauro Henrique na fase progressiva. Referência máxima do metal cristão.",
      en: "The largest and most influential Christian rock and metal band in Brazil, highly acclaimed for Juninho Afram's virtuoso guitar work and Mauro Henrique's brilliant vocals.",
      es: "La mayor y más influyente banda de rock y metal cristiano de Brasil, famosa por la técnica de Juninho Afram."
    },
    members: [
      { name: "Juninho Afram", role: "Guitars", status: "active" },
      { name: "Duca Tambasco", role: "Bass", status: "active" },
      { name: "Jean Carllos", role: "Keyboards", status: "active" }
    ],
    discography: [
      { title: "Humanos", year: 2002, type: "Album" },
      { title: "Depois da Guerra", year: 2008, type: "Album" },
      { title: "O Tempo", year: 2000, type: "Album" }
    ],
    socials: { instagram: "@oficinag3", website: "http://www.oficinag3.com.br" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Antidemon",
    country: "Brazil",
    formationYear: 1994,
    genre: "Christian Death Metal / Grindcore",
    bio: {
      pt: "Banda brasileira de grindcore e death metal extremo respeitada no underground mundial, liderada pelo Pastor Batista e famosa por suas extensas turnês internacionais de metal cristão.",
      en: "Brazilian grindcore and extreme death metal act highly respected in the worldwide underground scene, led by Pastor Batista and famous for their extensive international tours.",
      es: "Banda brasileña de grindcore y death metal extremo respetada en el underground mundial, liderada por el Pastor Batista."
    },
    members: [
      { name: "Batista", role: "Bass & Vocals", status: "active" },
      { name: "Juliana", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "Demonocídio", year: 1999, type: "Album" },
      { title: "Anillo de Fuego", year: 2012, type: "Album" }
    ],
    socials: { instagram: "@antidemon.official" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Krig",
    country: "Brazil",
    formationYear: 2007,
    genre: "Christian Death Metal / Grindcore",
    bio: {
      pt: "Banda brasileira de death metal técnico e grindcore de Belo Horizonte, conhecida por sua precisão e velocidade avassaladora com letras espirituais profundas. Relevante no metal cristão.",
      en: "Brazilian technical death metal and grindcore act from Belo Horizonte, known for their precision, blistering speed, and profound spiritual lyrics.",
      es: "Banda brasileña de death metal técnico y grindcore de Belo Horizonte, conocida por su precisión y letras espirituales."
    },
    members: [
      { name: "Isaque", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Target: Destroy", year: 2009, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Ceremonya",
    country: "Brazil",
    formationYear: 2003,
    genre: "Christian Heavy Metal / Power Metal",
    bio: {
      pt: "Formada em São Paulo, combina heavy metal clássico com power metal e letras cantadas em português de teor espiritual e reflexivo. Destaque do metal cristão paulista.",
      en: "Formed in São Paulo, the band blends classic heavy metal with power metal elements, singing in Portuguese about spiritual and reflective themes.",
      es: "Formada en São Paulo, combina heavy metal clásico con power metal y letras de temática espiritual en portugués."
    },
    members: [
      { name: "Danilo Lopes", role: "Vocals & Drums", status: "active" }
    ],
    discography: [
      { title: "Ceremonya", year: 2006, type: "Album" }
    ],
    socials: { instagram: "@ceremonyaband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Dort",
    country: "Brazil",
    formationYear: 2011,
    genre: "Christian Thrash / Death Metal",
    bio: {
      pt: "Grande representante do thrash/death metal nacional, aliando riffs pesados e rápidos com temáticas espirituais contundentes do underground de metal cristão brasileiro.",
      en: "Strong representative of national thrash/death metal, combining heavy and fast riffs with intense spiritual themes of the Christian underground.",
      es: "Gran representante del thrash/death metal nacional, que combina riffs pesados con temáticas espirituales."
    },
    members: [
      { name: "Dort", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Dort", year: 2015, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Skymetal",
    country: "Brazil",
    formationYear: 1997,
    genre: "Christian Metal / Unblack Metal",
    bio: {
      pt: "Projeto pioneiro de metal extremo com temática espiritual focado em black metal atmosférico e unblack metal no underground nacional de metal cristão.",
      en: "Pioneering extreme metal project with spiritual themes, focusing on atmospheric black metal and unblack metal in the Brazilian underground.",
      es: "Proyecto pionero de metal extremo de temática espiritual centrado en el black metal atmosférico y unblack metal."
    },
    members: [
      { name: "SkyMetal", role: "All Instruments", status: "active" }
    ],
    discography: [
      { title: "SkyMetal Project", year: 2002, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "PG",
    country: "Brazil",
    formationYear: 2004,
    genre: "Christian Rock / Hard Rock",
    bio: {
      pt: "PG (ex-vocalista do Oficina G3) consolidou uma expressiva carreira solo de hard rock e rock cristão, com mensagens marcantes de adoração e fé no cenário nacional.",
      en: "PG (former lead vocalist of Oficina G3) established a highly successful solo career in Brazil, blending hard rock weight with modern worship songs.",
      es: "PG (ex vocalista de Oficina G3) consolidó una expresiva carrera solista de hard rock con mensajes de fe."
    },
    members: [
      { name: "PG", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Adoração", year: 2004, type: "Album" },
      { title: "De Volta à Estrada", year: 2006, type: "Album" }
    ],
    socials: { instagram: "@cantorpg" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Tanlan",
    country: "Brazil",
    formationYear: 2004,
    genre: "Christian Alternative Rock / Indie",
    bio: {
      pt: "Representantes do rock alternativo do sul do Brasil, trazem composições refinadas de rock cristão com influências poéticas profundas e reflexivas.",
      en: "Alternative rock representatives from southern Brazil, delivering refined compositions influenced by modern indie rock with deep poetic reflections.",
      es: "Representantes del rock alternativo del sur de Brasil, que traen composiciones refinadas e influencias poéticas."
    },
    members: [
      { name: "Fábio Sampaio", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "Um Dia a Mais", year: 2012, type: "Album" },
      { title: "É Só o Começo", year: 2008, type: "Album" }
    ],
    socials: { instagram: "@tanlan" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Palavrantiga",
    country: "Brazil",
    formationYear: 2007,
    genre: "Christian Indie Rock",
    bio: {
      pt: "Liderada por Marcos Almeida, a banda de Belo Horizonte destacou-se nacionalmente no indie rock por suas letras poéticas de rock cristão sobre cotidiano e espiritualidade sem clichês.",
      en: "Led by singer-songwriter Marcos Almeida, this indie rock band from Belo Horizonte earned national acclaim for poetic lyrics about daily life and spirituality without clichés.",
      es: "Liderada por Marcos Almeida, la banda de Belo Horizonte se destacó en el indie rock por sus letras poéticas sobre cotidianidad."
    },
    members: [
      { name: "Marcos Almeida", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "Esperar é Caminhar", year: 2010, type: "Album" },
      { title: "Sobre o Mesmo Chão", year: 2012, type: "Album" }
    ],
    socials: { instagram: "@palavrantiga" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Discopraise",
    country: "Brazil",
    formationYear: 2001,
    genre: "Christian Pop Rock",
    bio: {
      pt: "Originária do Distrito Federal, a banda se destacou em sua fase inicial por um pop rock dinâmico e rock cristão com influências de funk/disco de guitarras marcantes.",
      en: "Originating from Brasília, the band earned prominence in their early career for a dynamic pop rock and Christian rock sound with groovy guitar funk.",
      es: "Originaria del Distrito Federal de Brasil, la banda se destacó en su fase inicial por un pop rock dinámico."
    },
    members: [
      { name: "Clayton O'Lee", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Transformado", year: 2007, type: "Album" }
    ],
    socials: { instagram: "@discopraise" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Metal Nobre",
    country: "Brazil",
    formationYear: 1997,
    genre: "Christian Hard Rock / Heavy Metal",
    bio: {
      pt: "Uma das bandas mais influentes do hard rock e heavy metal cristão brasileiro do final dos anos 90, ajudando a difundir o metal cristão nacional.",
      en: "One of the most influential bands in Brazilian Christian hard rock and heavy metal during the late 90s, helping spread national Christian metal.",
      es: "Una de las bandas más influyentes del hard rock y heavy metal cristiano brasileño del final de los años 90."
    },
    members: [
      { name: "JT", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Metal Nobre II", year: 1998, type: "Album" },
      { title: "Nas Ruas", year: 2001, type: "Album" }
    ],
    socials: { instagram: "@bandametalnobre" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Voz da Verdade",
    country: "Brazil",
    formationYear: 1978,
    genre: "Christian Rock / Classic Gospel",
    bio: {
      pt: "Um dos conjuntos gospel e de rock cristão mais antigos do país. Incorporou fortes guitarras de rock e metal em seus arranjos desde a década de 80.",
      en: "One of the oldest and most influential gospel ensembles in Brazil. Fused traditional gospel with strong rock and metal guitar arrangements since the 80s.",
      es: "Uno de los conjuntos de gospel más antiguos de Brasil, que incorporó guitarras de rock y metal."
    },
    members: [
      { name: "Carlos A. Moysés", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "O Escudo", year: 2003, type: "Album" },
      { title: "O Melhor de Deus está por Vir", year: 1999, type: "Album" }
    ],
    socials: { website: "http://www.vozdaverdade.com.br" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Stauros",
    country: "Brazil",
    formationYear: 1992,
    genre: "Christian Heavy Metal",
    bio: {
      pt: "Banda catarinense de heavy metal e thrash conhecida nacionalmente pela absurda técnica do guitarrista Renatinho e pelo clássico álbum 'Sentido de Viver'. Marco do metal cristão nacional.",
      en: "Heavy and thrash metal band from Santa Catarina, nationally known for guitarist Renatinho's incredible technical shredding and the classic album 'Sentido de Viver'.",
      es: "Banda de heavy metal y thrash de Santa Catarina, conocida por la gran técnica de guitarra de Renatinho."
    },
    members: [
      { name: "Renatinho", role: "Guitars", status: "active" },
      { name: "Cesar", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Sentido de Viver", year: 1997, type: "Album" },
      { title: "Vento Forte", year: 2001, type: "Album" }
    ],
    socials: { instagram: "@stauroficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Strife",
    country: "United States",
    formationYear: 1991,
    genre: "Hardcore Punk",
    bio: {
      pt: "Banda de hardcore punk de Los Angeles pertencente à cena 'straight edge', reconhecida mundialmente pela agressividade sonora direta e temática de integridade social.",
      en: "Los Angeles hardcore punk band belonging to the 'straight edge' movement, highly respected for their aggressive sound and themes of social integrity.",
      es: "Banda de hardcore punk de Los Ángeles perteneciente a la escena 'straight edge', reconocida por su agresividad."
    },
    members: [
      { name: "Rick Rodney", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "One Truth", year: 1994, type: "Album" },
      { title: "In This Defiance", year: 1997, type: "Album" }
    ],
    socials: { instagram: "@strife_la" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Krino",
    country: "Brazil",
    formationYear: 2005,
    genre: "Christian Heavy Metal",
    bio: {
      pt: "Banda brasileira de metal cristão clássico com letras inspiradoras de fé, arranjos de guitarras com distorção de peso e firme base de fãs no underground brasileiro.",
      en: "Brazilian classic Christian heavy metal band delivering inspiring lyrics of faith, solid guitar arrangements, and a persistent underground following.",
      es: "Banda brasileña de metal cristiano clásico con letras inspiradoras de fe y guitarras pesadas."
    },
    members: [
      { name: "Marcelo", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Krino", year: 2008, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Benbaruke",
    country: "Brazil",
    formationYear: 2009,
    genre: "Christian Hard Rock",
    bio: {
      pt: "Projeto de rock e hard rock cristão brasileiro focado em melodias marcantes, guitarras distorcidas de peso e mensagens espirituais profundas.",
      en: "Brazilian Christian rock and hard rock project focused on driving melodies, heavy distorted guitar riffs, and profound spiritual messages.",
      es: "Proyecto de rock y hard rock cristiano brasileño centrado en melodías marcantes."
    },
    members: [
      { name: "Ben", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Caminho", year: 2012, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Symphonia Eterna",
    country: "Brazil",
    formationYear: 2008,
    genre: "Christian Symphonic Metal",
    bio: {
      pt: "Banda de metal sinfônico cristão brasileira com vocais operáticos femininos líricos, arranjos de teclados grandiosos e solos melodiosos de guitarra.",
      en: "Brazilian Christian symphonic metal band featuring clean operatic female vocals, grand keyboard orchestrations, and highly melodic guitar leads.",
      es: "Banda de metal sinfónico cristiano brasileña con voces operáticas femeninas y teclados grandiosos."
    },
    members: [
      { name: "Leticia", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Symphonia Eterna", year: 2011, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Perpetual Legacy",
    country: "Brazil",
    formationYear: 2014,
    genre: "Christian Symphonic Metal",
    bio: {
      pt: "Destaque do metal sinfônico cristão brasileiro liderada pelos potentes vocais de Michelle Rodovalho, mesclando peso extremo moderno de guitarra com arranjos clássicos de piano.",
      en: "Prominent Brazilian Christian symphonic metal band led by Michelle Rodovalho's powerful vocals, fusing modern heavy guitars with classical piano arrangements.",
      es: "Destacada banda de metal sinfónico cristiano brasileña liderada por los potentes vocales de Michelle Rodovalho."
    },
    members: [
      { name: "Michelle Rodovalho", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "A New Horizon", year: 2015, type: "Album" }
    ],
    socials: { instagram: "@perpetuallegacy" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Rarmagon",
    country: "Brazil",
    formationYear: 2010,
    genre: "Christian Death Metal",
    bio: {
      pt: "Banda de death metal cristão extremo brasileira do cenário underground, conhecida por riffs pesados velozes, bateria brutal e temática de batalha espiritual cristã.",
      en: "Brazilian extreme Christian death metal band from the underground scene, known for blistering fast riffs, brutal drumming, and themes of spiritual warfare.",
      es: "Banda de death metal cristiano extremo brasileña del underground, conocida por sus riffs rápidos."
    },
    members: [
      { name: "Rarmagon", role: "All Instruments", status: "active" }
    ],
    discography: [
      { title: "Rarmagon", year: 2014, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Soul Factor",
    country: "Brazil",
    formationYear: 2002,
    genre: "Christian Hardcore",
    bio: {
      pt: "Hardcore cristão com forte pegada punk e metalcore de Minas Gerais, conhecido por apresentações intensas, letras sinceras e grande engajamento social.",
      en: "Christian hardcore band from Minas Gerais combining raw punk energy and metalcore weight, known for intense live shows, sincere lyrics, and social activism.",
      es: "Banda de hardcore cristiano de Minas Gerais que combina punk y metalcore."
    },
    members: [
      { name: "Soul", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Factor", year: 2005, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Sonata Arctica",
    country: "Finland",
    formationYear: 1996,
    genre: "Power Metal",
    bio: {
      pt: "Uma das bandas de power metal melódico mais aclamadas do mundo, famosa por andamentos extremamente rápidos, duetos virtuosos de teclado e guitarra e os vocais melódicos de Tony Kakko.",
      en: "One of the world's most acclaimed melodic power metal bands, renowned for blistering tempos, virtuoso guitar/keyboard duets, and Tony Kakko's melodic vocal style.",
      es: "Una de las bandas de power metal melódico más aclamadas del mundo, famosa por sus ritmos rápidos."
    },
    members: [
      { name: "Tony Kakko", role: "Vocals", status: "active" },
      { name: "Elias Viljanen", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Ecliptica", year: 1999, type: "Album" },
      { title: "Silence", year: 2001, type: "Album" }
    ],
    socials: { instagram: "@sonataarcticaofficial", website: "http://www.sonataarctica.info" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Interxesor",
    country: "Brazil",
    formationYear: 2012,
    genre: "Christian Thrash / Death Metal",
    bio: {
      pt: "Banda brasileira de thrash/death metal underground focada em riffs cortantes velozes, bateria técnica rítmica e mensagens de resistência espiritual do metal cristão.",
      en: "Brazilian underground thrash/death metal act focusing on fast sharp riffs, complex technical drumming, and messages of Christian spiritual resilience.",
      es: "Banda brasileña de thrash/death metal underground enfocada en riffs rápidos."
    },
    members: [
      { name: "Inter", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Interxesor", year: 2016, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Kilmara",
    country: "Spain",
    formationYear: 2003,
    genre: "Melodic Heavy Metal",
    bio: {
      pt: "Banda espanhola de heavy metal melódico de Barcelona, conhecida por guitarras potentes harmonizadas, vocais de grande alcance e refrões épicos de arena.",
      en: "Melodic heavy metal band from Barcelona, Spain, known for powerful harmonized guitars, high-range vocals, and epic arena-ready choruses.",
      es: "Banda española de heavy metal melódico de Barcelona, conocida por sus potentes guitarras."
    },
    members: [
      { name: "Daniel", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Hunting Souls", year: 2007, type: "Album" },
      { title: "Across the Realm of Time", year: 2018, type: "Album" }
    ],
    socials: { instagram: "@kilmara_official" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Banda HH",
    country: "Brazil",
    formationYear: 2010,
    genre: "Christian Rock / Pop Rock",
    bio: {
      pt: "Banda de rock e pop rock cristão brasileira famosa por melodias suaves cativantes, mensagens positivas de esperança e grande empatia com o público evangélico.",
      en: "Brazilian Christian rock and pop rock band known for catchy, soothing melodies, positive messages of hope, and strong connection with young audiences.",
      es: "Banda de rock y pop rock cristiano brasileña conocida por sus melodías suaves."
    },
    members: [
      { name: "HH", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Caminhar", year: 2014, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Helloween",
    country: "Germany",
    formationYear: 1984,
    genre: "Power Metal / Speed Metal",
    bio: {
      pt: "Praticamente os fundadores do power metal moderno. A banda alemã revolucionou o metal com guitarras gêmeas ultra rápidas, melodias felizes e refrões épicos com clássicos como 'Keeper of the Seven Keys'.",
      en: "Virtually the founders of modern power metal. The German band revolutionized metal with rapid-fire twin-guitar harmonies, uplifting melodies, and epic anthems like 'Keeper of the Seven Keys'.",
      es: "Prácticamente los fundadores del power metal moderno. La banda alemana revolucionó el metal con guitarras dobles ultrarrápidas y estribillos épicos."
    },
    members: [
      { name: "Andi Deris", role: "Vocals", status: "active" },
      { name: "Michael Kiske", role: "Vocals", status: "active" },
      { name: "Kai Hansen", role: "Guitars & Vocals", status: "active" },
      { name: "Michael Weikath", role: "Guitars", status: "active" },
      { name: "Sascha Gerstner", role: "Guitars", status: "active" },
      { name: "Markus Grosskopf", role: "Bass", status: "active" },
      { name: "Daniel Löble", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "Keeper of the Seven Keys Part I", year: 1987, type: "Album" },
      { title: "Keeper of the Seven Keys Part II", year: 1988, type: "Album" },
      { title: "Helloween", year: 2021, type: "Album" }
    ],
    socials: { instagram: "@helloweenofficial", website: "https://www.helloween.org" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Gamma Ray",
    country: "Germany",
    formationYear: 1989,
    genre: "Power Metal / Speed Metal",
    bio: {
      pt: "Fundada por Kai Hansen após sua saída do Helloween, a banda tornou-se um dos pilares mais respeitados e influentes do power metal mundial com velocidade e energia crua.",
      en: "Founded by Kai Hansen after his departure from Helloween, the band became one of the most respected and influential pillars of global speed/power metal.",
      es: "Fundada por Kai Hansen tras su salida de Helloween, la banda se convirtió en uno de los pilares más respetados del power metal mundial."
    },
    members: [
      { name: "Kai Hansen", role: "Vocals & Guitars", status: "active" },
      { name: "Henjo Richter", role: "Guitars", status: "active" },
      { name: "Dirk Schlächter", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Land of the Free", year: 1995, type: "Album" },
      { title: "Powerplant", year: 1999, type: "Album" }
    ],
    socials: { instagram: "@gammaray_band" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Stratovarius",
    country: "Finland",
    formationYear: 1984,
    genre: "Melodic Power Metal",
    bio: {
      pt: "Gigantes do metal melódico finlandês, misturando passagens neoclássicas rápidas de teclado e guitarra virtuosa com os vocais épicos e melódicos marcantes de Timo Kotipelto.",
      en: "Giants of Finnish melodic power metal, blending fast neoclassical keyboard and virtuoso guitar runs with Timo Kotipelto's soaring signature vocals.",
      es: "Gigantes del metal melódico finlandés, que mezclan pasajes neoclásicos rápidos de teclado y guitarra con voces épicas."
    },
    members: [
      { name: "Timo Kotipelto", role: "Vocals", status: "active" },
      { name: "Jens Johansson", role: "Keyboards", status: "active" },
      { name: "Matias Kupiainen", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Visions", year: 1997, type: "Album" },
      { title: "Episode", year: 1996, type: "Album" },
      { title: "Nemesis", year: 2013, type: "Album" }
    ],
    socials: { instagram: "@stratovariusofficial", website: "http://www.stratovarius.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Rhapsody of Fire",
    country: "Italy",
    formationYear: 1993,
    genre: "Symphonic Power Metal",
    bio: {
      pt: "Criadores do 'Hollywood Metal', unindo riffs pesados de power metal a arranjos orquestrais dignos de trilhas sonoras de cinema de fantasia medieval e corais operáticos gigantes.",
      en: "Creators of 'Hollywood Metal', fusing rapid power metal riffs with grand orchestral arrangements, film-score orchestrations, and massive operatic choirs.",
      es: "Creadores del 'Hollywood Metal', que unen riffs rápidos con arreglos orquestales de bandas sonoras de cine fantástico."
    },
    members: [
      { name: "Alex Staropoli", role: "Keyboards", status: "active" },
      { name: "Giacomo Voli", role: "Vocals", status: "active" },
      { name: "Luca Turilli", role: "Former Guitars", status: "former" },
      { name: "Fabio Lione", role: "Former Vocals", status: "former" }
    ],
    discography: [
      { title: "Symphony of Enchanted Lands", year: 1998, type: "Album" },
      { title: "Legendary Tales", year: 1997, type: "Album" }
    ],
    socials: { instagram: "@rhapsodyoffireofficial", website: "http://www.rhapsodyoffire.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Kamelot",
    country: "United States",
    formationYear: 1991,
    genre: "Symphonic Progressive Power Metal",
    bio: {
      pt: "Banda norte-americana que refinou o power metal melódico com nuances progressivas, atmosfera gótica/sinfônica densa e composições altamente poéticas.",
      en: "American band that refined melodic power metal with progressive nuances, dark gothic/symphonic atmospheres, and highly poetic storytelling.",
      es: "Banda estadounidense que refinó el power metal con matices progresivos y atmósferas góticas sofisticadas."
    },
    members: [
      { name: "Thomas Youngblood", role: "Guitars", status: "active" },
      { name: "Tommy Karevik", role: "Vocals", status: "active" },
      { name: "Roy Khan", role: "Former Vocals", status: "former" }
    ],
    discography: [
      { title: "The Black Halo", year: 2005, type: "Album" },
      { title: "Epica", year: 2003, type: "Album" }
    ],
    socials: { instagram: "@kamelotofficial", website: "http://www.kamelot.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Avantasia",
    country: "Germany",
    formationYear: 1999,
    genre: "Symphonic Power Metal / Metal Opera",
    bio: {
      pt: "O monumental projeto teatral concebido por Tobias Sammet. Reúne grandes nomes lendários do rock e metal mundial em álbuns conceituais de ópera-metal majestosos.",
      en: "The monumental metal opera project conceived by Tobias Sammet, gathering legendary rock and metal guest vocalists in majestic fantasy-driven concept albums.",
      es: "El monumental proyecto de ópera metal concebido por Tobias Sammet, que reúne a grandes leyendas del rock y metal mundial."
    },
    members: [
      { name: "Tobias Sammet", role: "Vocals & Bass", status: "active" },
      { name: "Sascha Paeth", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "The Metal Opera", year: 2001, type: "Album" },
      { title: "The Scarecrow", year: 2008, type: "Album" }
    ],
    socials: { instagram: "@tobiassammetofficial", website: "http://www.tobiassammet.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "DragonForce",
    country: "United Kingdom",
    formationYear: 1999,
    genre: "Extreme Power Metal",
    bio: {
      pt: "Famosos internacionalmente por sua velocidade absurdamente rápida, duetos de guitarra inacreditáveis e efeitos sonoros inspirados em videogames clássicos de 16-bits.",
      en: "World-famous for their blistering extreme speeds, rapid-fire guitar solos, and chaotic sound effects heavily inspired by classic 16-bit video games.",
      es: "Famosos mundialmente por su velocidad extrema, solos rapidísimos y efectos inspirados en videojuegos clásicos."
    },
    members: [
      { name: "Herman Li", role: "Guitars", status: "active" },
      { name: "Sam Totman", role: "Guitars", status: "active" },
      { name: "Marc Hudson", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Inhuman Rampage", year: 2006, type: "Album" },
      { title: "Valley of the Damned", year: 2003, type: "Album" }
    ],
    socials: { instagram: "@dragonforcehq", website: "https://dragonforce.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Edguy",
    country: "Germany",
    formationYear: 1992,
    genre: "Melodic Power Metal / Hard Rock",
    bio: {
      pt: "Liderada pelo carismático Tobias Sammet, a banda conquistou prestígio mundial unindo peso, melodia refinada e um senso de humor único em suas performances.",
      en: "Led by the charismatic Tobias Sammet, the band gained worldwide acclaim, successfully blending classic heavy riffs, catchy hooks, and a unique sense of humor.",
      es: "Liderada por el carismático Tobias Sammet, la banda unió riffs de metal y melodías con un gran sentido del humor."
    },
    members: [
      { name: "Tobias Sammet", role: "Vocals", status: "active" },
      { name: "Jens Ludwig", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Hellfire Club", year: 2004, type: "Album" },
      { title: "Mandrake", year: 2001, type: "Album" }
    ],
    socials: { website: "http://www.edguy.net" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Primal Fear",
    country: "Germany",
    formationYear: 1997,
    genre: "Power Metal / Traditional Heavy Metal",
    bio: {
      pt: "Uma das bandas de metal tradicional/power mais potentes da Europa, famosa pelo vocalista virtuoso Ralf Scheepers de alcance vocal absurdo estilo Rob Halford.",
      en: "One of the heaviest power metal acts in Europe, famous for Ralf Scheepers' soaring high-register vocals and driving, thrashy guitar attacks.",
      es: "Una de las bandas de metal tradicional más potentes de Europa, famosa por los increíbles agudos de Ralf Scheepers."
    },
    members: [
      { name: "Ralf Scheepers", role: "Vocals", status: "active" },
      { name: "Mat Sinner", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Metal Commando", year: 2020, type: "Album" },
      { title: "Nuclear Fire", year: 2001, type: "Album" }
    ],
    socials: { instagram: "@primalfearofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Iced Earth",
    country: "United States",
    formationYear: 1984,
    genre: "Power Metal / Thrash Metal",
    bio: {
      pt: "Unindo riffs de palhetadas rápidas típicas do thrash metal com melodias dramáticas e letras conceituais de power metal sob a liderança marcante de Jon Schaffer.",
      en: "Combining rapid-fire thrash metal guitar triplet-picking with the epic storytelling, dark themes, and dramatic arrangements of power metal.",
      es: "Combinando riffs rápidos de thrash con las temáticas de fantasía y estribillos épicos del power metal."
    },
    members: [
      { name: "Jon Schaffer", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Something Wicked This Way Comes", year: 1998, type: "Album" },
      { title: "The Dark Saga", year: 1996, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Freedom Call",
    country: "Germany",
    formationYear: 1998,
    genre: "Melodic Power Metal",
    bio: {
      pt: "Conhecidos como os reis do 'Happy Metal', oferecem composições ultra melódicas, refrões alegres de união e letras otimistas carregadas de energia positiva.",
      en: "Known as the kings of 'Happy Metal', delivering ultra-melodic guitar leads, anthemic positive choruses, and uplifting fantasy themes.",
      es: "Conocidos como los reyes del 'Happy Metal', ofrecen composiciones sumamente melódicas y optimistas."
    },
    members: [
      { name: "Chris Bay", role: "Vocals & Guitars", status: "active" }
    ],
    discography: [
      { title: "Crystal Empire", year: 2001, type: "Album" },
      { title: "Eternity", year: 2002, type: "Album" }
    ],
    socials: { instagram: "@freedomcallofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Andre Matos",
    country: "Brazil",
    formationYear: 2006,
    genre: "Power Metal / Symphonic Metal",
    bio: {
      pt: "Projeto solo do lendário maestro e vocalista do metal brasileiro Andre Matos (ex-Viper, Angra, Shaman), aclamado por seu metal neoclássico elegante e sua voz angelical única.",
      en: "Solo project of the late legendary Brazilian metal maestro and vocalist Andre Matos (ex-Viper, Angra, Shaman), highly acclaimed for elegant neoclassical arrangements.",
      es: "Proyecto solista del fallecido vocalista y maestro del metal brasileño Andre Matos (ex Viper, Angra, Shaman)."
    },
    members: [
      { name: "Andre Matos", role: "Vocals & Piano (R.I.P.)", status: "former" },
      { name: "Hugo Mariutti", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Time to Be Free", year: 2007, type: "Album" },
      { title: "Mentalize", year: 2009, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Hibria",
    country: "Brazil",
    formationYear: 1996,
    genre: "Technical Power Metal / Speed Metal",
    bio: {
      pt: "Banda gaúcha reverenciada internacionalmente (especialmente no Japão) por sua técnica absurda, velocidade implacável, baixo estalado proeminente e guitarras virtuosas.",
      en: "Brazilian band from Porto Alegre, internationally revered (particularly in Japan) for blistering speeds, aggressive technical basslines, and virtuoso dual-guitars.",
      es: "Banda brasileña reverenciada internacionalmente (especialmente en Japón) por su técnica impecable y velocidad implacable."
    },
    members: [
      { name: "Abel Camargo", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Defying the Rules", year: 2004, type: "Album" },
      { title: "The Skull Collectors", year: 2008, type: "Album" }
    ],
    socials: { instagram: "@hibriaofficial" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Aquaria",
    country: "Brazil",
    formationYear: 1999,
    genre: "Symphonic Power Metal",
    bio: {
      pt: "Banda carioca de metal sinfônico e melódico de altíssima qualidade, famosa por melodias belas guiadas por piano clássico inspiradoras de fantasias épicas.",
      en: "Brazilian symphonic metal band from Rio de Janeiro, widely acclaimed for gorgeous, piano-driven orchestration and inspiring, fantasy-based compositions.",
      es: "Banda de metal sinfónico carioca de alta calidad, famosa por sus melodías de piano clásico."
    },
    members: [
      { name: "Vitor Veiga", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Luxaeterna", year: 2005, type: "Album" },
      { title: "Shambala", year: 2007, type: "Album" }
    ],
    socials: { instagram: "@aquariaband" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Almah",
    country: "Brazil",
    formationYear: 2006,
    genre: "Modern Power Metal",
    bio: {
      pt: "Projeto fundado por Edu Falaschi (ex-Angra) que se desenvolveu em uma banda consolidada de metal moderno, mesclando power metal técnico com riffs contemporâneos pesados.",
      en: "Project founded by Edu Falaschi (ex-Angra) that evolved into a full-fledged metal force, fusing technical progressive power metal with modern heavy guitar riffs.",
      es: "Proyecto fundado por Edu Falaschi (ex Angra) que se consolidó en una gran banda de metal moderno y técnico."
    },
    members: [
      { name: "Edu Falaschi", role: "Vocals", status: "active" },
      { name: "Marcelo Barbosa", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Almah", year: 2006, type: "Album" },
      { title: "Fragile Equality", year: 2008, type: "Album" }
    ],
    socials: { instagram: "@almah_official" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Viper",
    country: "Brazil",
    formationYear: 1985,
    genre: "Heavy Metal / Power Metal",
    bio: {
      pt: "Pioneiros absolutos do heavy/power metal no Brasil. Lançaram o seminal álbum 'Theater of Fate' e serviram como o ponto de partida do lendário vocalista Andre Matos.",
      en: "Absolute pioneers of heavy/power metal in Brazil, releasing the legendary 'Theater of Fate' and serving as the starting ground for legendary singer Andre Matos.",
      es: "Pioneros absolutos del heavy/power metal en Brasil, sirviendo como punto de partida de Andre Matos."
    },
    members: [
      { name: "Felipe Machado", role: "Guitars (R.I.P.)", status: "former" },
      { name: "Pit Passarell", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Theater of Fate", year: 1989, type: "Album" },
      { title: "Soldiers of Sunrise", year: 1987, type: "Album" }
    ],
    socials: { instagram: "@viper_brazil" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Glory Opera",
    country: "Brazil",
    formationYear: 1997,
    genre: "Symphonic Power Metal",
    bio: {
      pt: "Banda lendária de Manaus pioneira do power metal da Amazônia, aclamada pelo fantástico álbum conceitual 'Rising' que mistura metal progressivo e lendas regionais.",
      en: "Legendary progressive power metal band from Manaus, widely known for their highly conceptual album 'Rising' blending metal with regional Amazonian legends.",
      es: "Banda mítica de Manaus, pionera en mezclar power metal progresivo con leyendas regionales del Amazonas."
    },
    members: [
      { name: "Humberto Sobrinho", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Rising", year: 2001, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Hangar",
    country: "Brazil",
    formationYear: 1997,
    genre: "Progressive Power Metal",
    bio: {
      pt: "Banda de metal progressivo e power de alto calibre técnico, liderada pelo icônico baterista Aquiles Priester (ex-Angra), famosa por arranjos rítmicos pesados e complexos.",
      en: "High-caliber technical progressive power metal band led by master drummer Aquiles Priester (ex-Angra), famous for complex rhythmic patterns and powerful riffs.",
      es: "Banda de metal progresivo y power de alto calibre técnico, liderada por el icónico baterista Aquiles Priester."
    },
    members: [
      { name: "Aquiles Priester", role: "Drums", status: "active" },
      { name: "Nando Mello", role: "Bass", status: "active" }
    ],
    discography: [
      { title: "Reason to Believe", year: 2007, type: "Album" },
      { title: "The Inside Chamber", year: 2001, type: "Album" }
    ],
    socials: { instagram: "@hangarofficial", website: "http://www.aquilespriester.com" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "SoulSpell",
    country: "Brazil",
    formationYear: 2005,
    genre: "Symphonic Metal / Metal Opera",
    bio: {
      pt: "O maior projeto de metal ópera do Brasil, idealizado por Heleno Vale. Reúne múltiplos vocalistas em narrativas complexas de fantasia com grandiosa produção orquestral.",
      en: "The largest metal opera project in Brazil, created by Heleno Vale, uniting diverse vocal talents across epic orchestral and symphonic narratives.",
      es: "El mayor proyecto de ópera metal de Brasil, idealizado por Heleno Vale, con múltiples vocalistas e historias de fantasía."
    },
    members: [
      { name: "Heleno Vale", role: "Drums & Director", status: "active" }
    ],
    discography: [
      { title: "A Legacy of Honor", year: 2008, type: "Album" },
      { title: "The Labyrinth of Truths", year: 2010, type: "Album" }
    ],
    socials: { instagram: "@soulspellmetalopera" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Armored Dawn",
    country: "Brazil",
    formationYear: 2014,
    genre: "Heavy Metal / Power Metal",
    bio: {
      pt: "Banda paulista de heavy/power metal com grande projeção internacional, turnês europeias consistentes e produções de videoclipes cinematográficos.",
      en: "Symphonic heavy/power metal band from São Paulo, gaining robust international touring presence and cinematic-level music video productions.",
      es: "Banda brasileña con gran proyección internacional, giras europeas y videoclips de nivel cinematográfico."
    },
    members: [
      { name: "Eduardo Parras", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Barbarians in Black", year: 2018, type: "Album" }
    ],
    socials: { instagram: "@armoreddawn" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Trend Kill Ghosts",
    country: "Brazil",
    formationYear: 2018,
    genre: "Melodic Power Metal",
    bio: {
      pt: "Destaque da nova geração do power metal melódico brasileiro, entregando canções rápidas, refrões energéticos inspiradores e letras motivacionais de superação.",
      en: "Rising force in Brazilian melodic power metal, delivering fast-paced tempos, soaring vocal hooks, and highly inspiring motivational lyrics.",
      es: "Destacada banda de la nueva generación del power metal melódico brasileño, con canciones rápidas y motivacionales."
    },
    members: [
      { name: "Diogo Nunes", role: "Vocals", status: "active" },
      { name: "Rogério Oliveira", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Kill Your Ghosts", year: 2019, type: "Album" },
      { title: "Until the End", year: 2021, type: "Album" }
    ],
    socials: { instagram: "@trendkillghosts" },
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Heavenly Flames",
    country: "Brazil",
    formationYear: 2012,
    genre: "Melodic Power Metal",
    bio: {
      pt: "Banda brasileira do circuito underground de power metal melódico, inspirada no estilo clássico finlandês com guitarras velozes e andamento enérgico.",
      en: "Brazilian melodic power metal project from the underground circuit, inspired by Finnish fast melodic dual guitars and energetic drum beats.",
      es: "Banda brasileña de power metal melódico del underground, inspirada por los ritmos rápidos del metal finlandés."
    },
    members: [
      { name: "Guilherme", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Flames of Glory", year: 2016, type: "EP" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Dark Avenger",
    country: "Brazil",
    formationYear: 1993,
    genre: "Heavy Metal / Power Metal",
    bio: {
      pt: "Liderada pelo saudoso mestre vocalista Mário Linhares, a banda brasiliense consolidou-se como um ícone nacional de power metal denso, dramático e conceitual.",
      en: "Led by the late extraordinary vocal maestro Mário Linhares, the band consolidated its status as an icon of theatrical, conceptual, and powerful heavy metal.",
      es: "Liderada por el fallecido maestro vocal Mário Linhares, la banda es un icono del power metal teatral y conceptual de Brasil."
    },
    members: [
      { name: "Mário Linhares", role: "Vocals (R.I.P.)", status: "former" }
    ],
    discography: [
      { title: "Dark Avenger", year: 1995, type: "Album" },
      { title: "Tales of Avalon: The Terror", year: 2013, type: "Album" }
    ],
    socials: {},
    contacts: {}, approved: true, submittedBy: "system"
  },
  {
    name: "Give It Uai",
    country: "Brazil",
    formationYear: 2024,
    genre: "Rock / Metal",
    bio: {
      pt: "Banda de Belo Horizonte (MG) com conta oficial no Instagram @give_it_uai.",
      en: "Band from Belo Horizonte (MG) with official Instagram account @give_it_uai.",
      es: "Banda de Belo Horizonte (MG) con cuenta oficial de Instagram @give_it_uai."
    },
    members: [],
    discography: [],
    socials: {
      instagram: "@give_it_uai"
    },
    contacts: {},
    approved: true,
    submittedBy: "system"
  },
  {
    name: "Crypta",
    country: "Brazil",
    formationYear: 2019,
    genre: "Death Metal",
    bio: {
      pt: "Banda brasileira de death metal formada em 2019 pela baixista e vocalista Fernanda Lira e pela baterista Luana Dametto, após suas saídas da banda Nervosa. Com uma sonoridade pesada, técnica e sombria, a Crypta rapidamente se tornou uma das principais forças do metal extremo internacional.",
      en: "Brazilian death metal band formed in 2019 by bassist and vocalist Fernanda Lira and drummer Luana Dametto, following their departure from Nervosa. With a heavy, technical, and dark sound, Crypta quickly became one of the leading forces in international extreme metal.",
      es: "Banda brasileña de death metal formada en 2019 por la bajista y vocalista Fernanda Lira y la baterista Luana Dametto, tras su salida de Nervosa. Con un sonido pesado, técnico y oscuro, Crypta se convirtió rápidamente en una de las principales fuerzas del metal extremo internacional."
    },
    members: [
      { name: "Fernanda Lira", role: "Vocals & Bass", status: "active" },
      { name: "Luana Dametto", role: "Drums", status: "active" },
      { name: "Tainá Bergamaschi", role: "Guitars", status: "active" },
      { name: "Jéssica di Falchi", role: "Guitars", status: "active" }
    ],
    discography: [
      { title: "Echoes of the Soul", year: 2021, type: "Album" },
      { title: "Shades of Sorrow", year: 2023, type: "Album" }
    ],
    socials: {
      instagram: "@cryptadeath"
    },
    contacts: {},
    approved: true,
    submittedBy: "system"
  },
  {
    name: "The Troops of Doom",
    country: "Brazil",
    formationYear: 2020,
    genre: "Death / Thrash Metal",
    bio: {
      pt: "Supergrupo de death/thrash metal fundado em 2020 por Jairo 'Tormentor' Guedz, guitarrista original do Sepultura. A proposta é resgatar a sonoridade clássica e crua do metal extremo dos anos 80.",
      en: "Death/thrash metal supergroup founded in 2020 by Jairo 'Tormentor' Guedz, the original guitarist of Sepultura. Their mission is to revive the classic, raw sound of 1980s extreme metal.",
      es: "Supergrupo de death/thrash metal fundado en 2020 por Jairo 'Tormentor' Guedz, guitarrista original de Sepultura. Su misión es revivir el sonido clásico y crudo del metal extremo de los años 80."
    },
    members: [
      { name: "Jairo Guedz", role: "Guitars", status: "active" },
      { name: "Alex Kafer", role: "Vocals & Bass", status: "active" },
      { name: "Marcelo Vasco", role: "Guitars", status: "active" },
      { name: "Alexandre Oliveira", role: "Drums", status: "active" }
    ],
    discography: [
      { title: "The Gate", year: 2020, type: "EP" },
      { title: "Antichrist Reborn", year: 2022, type: "Album" },
      { title: "A Mass to the Grotesque", year: 2024, type: "Album" }
    ],
    socials: {
      instagram: "@thetroopsofdoom"
    },
    contacts: {},
    approved: true,
    submittedBy: "system"
  },
  {
    name: "Cerimonial Sacred",
    country: "Brazil",
    formationYear: 1998,
    genre: "Symphonic Black Metal",
    bio: {
      pt: "Banda paranaense de Symphonic Black Metal formada em Ponta Grossa em 1998. Destaca-se pelas atmosferas sombrias, arranjos de teclado elaborados e letras focadas em temas espirituais.",
      en: "Symphonic Black Metal band from Ponta Grossa, Paraná, formed in 1998. Recognized for their dark atmosphere, elaborate keyboard arrangements, and spiritual themes.",
      es: "Banda de Symphonic Black Metal de Ponta Grossa, Paraná, formada en 1998. Destacada por su atmósfera oscura, arreglos de teclado elaborados y temas espirituales."
    },
    members: [
      { name: "Lord Sarcofagus", role: "Guitars", status: "active" },
      { name: "Meliscent", role: "Vocals", status: "active" }
    ],
    discography: [
      { title: "Our Runes of Our Death", year: 2005, type: "Album" },
      { title: "ChristuSect", year: 2015, type: "Album" },
      { title: "Eternity", year: 2021, type: "Album" }
    ],
    socials: {
      instagram: "@cerimonialsacred"
    },
    contacts: {},
    approved: true,
    submittedBy: "system"
  }
];
