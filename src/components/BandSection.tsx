import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Band, BandMember, DiscographyItem } from "../firebase";
import { translations } from "../translations";
import { getStaticFallbackDetails } from "../utils/staticDetails";
import { User } from "firebase/auth";
import { getProxiedImageUrl } from "../utils/imageProxy";
import { 
  Sparkles, Globe, Calendar, Music, UserCheck, Disc, Mail, Phone, 
  MapPin, Plus, Trash2, Edit2, CheckCircle, Clock, ExternalLink, X, Youtube,
  Share2, QrCode, Play, Video
} from "lucide-react";
import { BandSkeletonList } from "./SkeletonLoader";
import { QRCodeSVG } from "qrcode.react";

// @ts-ignore
import metalCatalogLogo from "../assets/images/metal_catalog_logo_1782380109985.jpg";

const WORLD_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan",
  "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// BandLogo to render official band logo/photos with a fallback chain
const BandLogo: React.FC<{
  name: string;
  url?: string;
  logoUrl?: string;
  photoUrl?: string;
  className?: string;
}> = ({ name, url, logoUrl, photoUrl, className = "w-12 h-12" }) => {
  const [imgIndex, setImgIndex] = useState(0);

  const candidateUrls: string[] = [];
  const officialLogo = (logoUrl || "").trim();

  if (officialLogo !== "") {
    candidateUrls.push(officialLogo);
  }
  // Stay Metal fallback logo is always the final image choice
  candidateUrls.push(metalCatalogLogo);

  const currentUrl = candidateUrls[imgIndex];

  const handleImgError = () => {
    if (imgIndex < candidateUrls.length - 1) {
      setImgIndex(prev => prev + 1);
    } else {
      setImgIndex(candidateUrls.length);
    }
  };

  // If even the fallback fails or we have no images
  if (imgIndex >= candidateUrls.length || !currentUrl) {
    return (
      <img
        src={metalCatalogLogo}
        alt="Stay Metal Logo Fallback"
        className={`${className} rounded object-cover border border-neutral-700/60 shadow shrink-0 grow-0`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <img
      src={getProxiedImageUrl(currentUrl, 150)}
      alt={name}
      className={`${className} rounded object-cover border border-neutral-700/60 shadow shrink-0 grow-0`}
      referrerPolicy="no-referrer"
      onError={handleImgError}
    />
  );
};



interface BandSectionProps {
  bands: Band[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onAddBand: (band: Omit<Band, "id">) => Promise<boolean>;
  onDeleteBand: (id: string) => Promise<void>;
  onEditBand: (id: string, updated: Partial<Band>) => Promise<void>;
  isRefreshing: boolean;
  globalSearch?: string;
  onClearGlobalSearch?: () => void;
  isLoading?: boolean;
  onOpenVideoWindow?: (url?: string, title?: string) => void;
}

export const BandSection: React.FC<BandSectionProps> = ({
  bands,
  user,
  lang,
  onAddBand,
  onDeleteBand,
  onEditBand,
  isRefreshing,
  globalSearch,
  onClearGlobalSearch,
  isLoading,
  onOpenVideoWindow
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";
  const isLogged = true;



  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  useEffect(() => {
    setActiveSuggestionIndex(-1);
  }, [search]);

  const handleSelectSuggestion = (bandName: string) => {
    setSearch(bandName);
    setAppliedSearch(bandName);
    setAppliedGenres([]);
    setAppliedCountries([]);
    setHasSearched(true);
    setMatchedIds(null);
    setShowSuggestions(false);
  };

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [genreSearch, setGenreSearch] = useState("");
  const [sharingBand, setSharingBand] = useState<Band | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [qrBand, setQrBand] = useState<Band | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedGenres, setAppliedGenres] = useState<string[]>([]);
  const [appliedCountries, setAppliedCountries] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [expandedBandId, setExpandedBandId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  useEffect(() => {
    if (globalSearch !== undefined) {
      setSearch(globalSearch);
      setAppliedSearch(globalSearch);
      if (globalSearch) {
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
    }
  }, [globalSearch]);

  const [geminiQuery, setGeminiQuery] = useState("");
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [geminiSearching, setGeminiSearching] = useState(false);
  const [geminiError, setGeminiError] = useState("");

  const [formName, setFormName] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formYear, setFormYear] = useState(2000);
  const [formBio, setFormBio] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [formMembersText, setFormMembersText] = useState("");
  const [formDiscographyText, setFormDiscographyText] = useState("");
  const [formInstagram, setFormInstagram] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [searchingPhotoBandId, setSearchingPhotoBandId] = useState<string | null>(null);
  const [photoSearchErrors, setPhotoSearchErrors] = useState<Record<string, string>>({});



  const [activeDetailType, setActiveDetailType] = useState<"member" | "album" | null>(null);
  const [activeDetailBandName, setActiveDetailBandName] = useState("");
  const [activeDetailTargetName, setActiveDetailTargetName] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailError, setDetailError] = useState("");



  const handleFetchDetails = async (type: "member" | "album", bandName: string, targetName: string) => {
    setActiveDetailType(type);
    setActiveDetailBandName(bandName);
    setActiveDetailTargetName(targetName);
    setDetailLoading(true);
    setDetailError("");
    setDetailData(null);
    try {
      const response = await fetch("/api/details/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          bandName,
          targetName,
          lang
        })
      });
      if (!response.ok) {
        throw new Error("Failed to load details");
      }
      const data = await response.json();
      setDetailData(data);
    } catch (err: any) {
      console.warn("Details fetch failed. Falling back to high-quality static facts database for Vercel deployment.", err);
      // Fallback seamlessly to static historical details
      const fallbackData = getStaticFallbackDetails(type, bandName, targetName, lang);
      setDetailData(fallbackData);
      // Ensure error state is completely empty so no error modal pops up
      setDetailError("");
    } finally {
      setDetailLoading(false);
    }
  };





  const ROCK_GENRES = [
    "rock", "hard rock", "classic rock", "progressive rock", "heavy rock", 
    "grunge", "indie rock", "pop rock", "punk rock", "gothic rock", "alternative rock"
  ];

  const allGenres = Array.from(
    new Set([
      ...bands.map(b => b.genre.toLowerCase().trim()),
      ...ROCK_GENRES
    ].filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  
  const allCountries = Array.from(
    new Set(
      [
        ...bands.map(b => b.country),
        ...WORLD_COUNTRIES
      ]
      .map(c => c ? c.trim() : "")
      .filter(c => c && !c.toLowerCase().includes("sesc") && !c.toLowerCase().includes("palladium") && !c.toLowerCase().includes("belo horizonte"))
    )
  ).sort((a, b) => a.localeCompare(b));

  const baseFilteredBands = bands.filter(band => {
    const activeSearch = (globalSearch || appliedSearch || "").trim().toLowerCase();
    
    const bName = (band.name || "").toLowerCase();
    const bGenre = (band.genre || "").toLowerCase();
    let bBio = "";
    let bBioAll = "";
    if (band.bio) {
      if (typeof band.bio === "string") {
        bBio = band.bio.toLowerCase();
        bBioAll = bBio;
      } else if (typeof band.bio === "object") {
        bBio = ((band.bio[lang] || band.bio["en"] || band.bio["es"] || "") as string).toLowerCase();
        bBioAll = Object.values(band.bio).join(" ").toLowerCase();
      }
    }

    let matchesSearch = matchedIds !== null || !activeSearch;
    if (!matchesSearch) {
      const standardMatch = 
        bName.includes(activeSearch) || 
        bGenre.includes(activeSearch) || 
        bBio.includes(activeSearch);

      // Semantic synonyms fallback for Christian rock / metal
      const isChristianMetalSearch = activeSearch.includes("metal crist") || activeSearch.includes("christian metal");
      const isChristianRockSearch = activeSearch.includes("rock crist") || activeSearch.includes("christian rock");

      const isChristianBand = bGenre.includes("christian") || bGenre.includes("crist") || bBioAll.includes("crist") || bBioAll.includes("christian");
      const isMetalGenre = bGenre.includes("metal") || bGenre.includes("thrash") || bGenre.includes("death") || bGenre.includes("black") || bGenre.includes("unblack") || bGenre.includes("grindcore") || bGenre.includes("core");
      const isRockGenre = bGenre.includes("rock") || bGenre.includes("hardcore") || bGenre.includes("punk");

      const matchChristianMetal = isChristianMetalSearch && isChristianBand && (isMetalGenre || bBioAll.includes("metal"));
      const matchChristianRock = isChristianRockSearch && isChristianBand && (isRockGenre || bBioAll.includes("rock"));

      matchesSearch = standardMatch || matchChristianMetal || matchChristianRock;
    }
    
    const matchesGenre = matchedIds !== null || appliedGenres.length === 0 || 
      appliedGenres.some(g => {
        const target = g.toLowerCase().trim();
        return bGenre.includes(target) || target.includes(bGenre);
      });
    const matchesCountry = matchedIds !== null || appliedCountries.length === 0 || 
      appliedCountries.some(c => (band.country || "").toLowerCase() === c.toLowerCase());
    
    // Gemini Natural Language matched IDs validation
    const matchesGeminiMatched = matchedIds === null || (!!band.id && matchedIds.includes(band.id));

    // Non-approved are only shown to Admin, or the user who submitted them
    const isApproved = !!band.approved;
    const isSubmittedByMe = !!(user && band.submittedBy === user.uid);
    const canSee = isApproved || isSubmittedByMe || isAdmin;

    return matchesSearch && matchesGenre && matchesCountry && matchesGeminiMatched && canSee;
  });

  const filteredBands = baseFilteredBands.filter(band => {
    if (!selectedLetter) return true;
    return (band.name || "").trim().toUpperCase().startsWith(selectedLetter);
  });

  const availableLetters = Array.from(
    new Set(
      baseFilteredBands.map(b => (b.name || "").trim().charAt(0).toUpperCase())
    )
  );

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      setTimeout(() => {
        const firstCardOfLetter = baseFilteredBands.find(b => (b.name || "").trim().toUpperCase().startsWith(letter));
        if (firstCardOfLetter) {
          const el = document.getElementById(`band-card-${firstCardOfLetter.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("ring-2", "ring-red-600/80", "transition-all", "duration-500");
            setTimeout(() => {
              el.classList.remove("ring-2", "ring-red-600/80");
            }, 2000);
          }
        } else {
          const container = document.getElementById("bands-list-section-header");
          if (container) {
            container.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 150);
    }
  };

  const sortedBands = [...filteredBands].sort((a, b) => {
    if (!sortOrder) return 0;
    const nameA = (a.name || "").trim().toLowerCase();
    const nameB = (b.name || "").trim().toLowerCase();
    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB, lang === "pt" ? "pt-BR" : "en-US");
    } else {
      return nameB.localeCompare(nameA, lang === "pt" ? "pt-BR" : "en-US");
    }
  });

  const [photoSearching, setPhotoSearching] = useState(false);

  const handleSearchPhoto = async () => {
    if (!formName.trim()) {
      setFormError(lang === "pt" ? "Digite o nome da banda primeiro para buscar a foto!" : "Type the band name first to search for a photo!");
      return;
    }
    setFormError("");
    setPhotoSearching(true);
    try {
      const res = await fetch("/api/bands/search-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandName: formName })
      });
      const data = await res.json();
      if (data.photoUrl && data.photoUrl.trim() !== "") {
        setFormPhotoUrl(data.photoUrl);
      } else {
        setFormError(lang === "pt" ? "Nenhuma foto oficial encontrada na internet para esta banda. Tente inserir manualmente." : "No official photo found on the internet for this band. Try entering manually.");
      }
    } catch (err) {
      console.error(err);
      setFormError(lang === "pt" ? "Erro de conexão ao buscar foto da banda." : "Connection error searching for band photo.");
    } finally {
      setPhotoSearching(false);
    }
  };

  const handleFetchAndSaveBandPhoto = async (band: Band) => {
    if (!band.id) return;
    setSearchingPhotoBandId(band.id);
    setPhotoSearchErrors(prev => {
      const copy = { ...prev };
      delete copy[band.id!];
      return copy;
    });

    try {
      const res = await fetch("/api/bands/search-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandName: band.name })
      });
      const data = await res.json();
      if (data.photoUrl && data.photoUrl.trim() !== "") {
        await onEditBand(band.id, { photoUrl: data.photoUrl });
      } else {
        const msg = lang === "pt" 
          ? "Nenhuma foto oficial encontrada." 
          : "No official photo found.";
        setPhotoSearchErrors(prev => ({ ...prev, [band.id!]: msg }));
        setTimeout(() => {
          setPhotoSearchErrors(prev => {
            const copy = { ...prev };
            delete copy[band.id!];
            return copy;
          });
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      const msg = lang === "pt" 
        ? "Erro ao buscar foto." 
        : "Error searching photo.";
      setPhotoSearchErrors(prev => ({ ...prev, [band.id!]: msg }));
      setTimeout(() => {
        setPhotoSearchErrors(prev => {
          const copy = { ...prev };
          delete copy[band.id!];
          return copy;
        });
      }, 5000);
    } finally {
      setSearchingPhotoBandId(null);
    }
  };

  // Handle AI Auto-Suggest via Gemini
  const handleAIFill = async () => {
    if (!formName.trim()) {
      setFormError(lang === "pt" ? "Digite o nome da banda para que a IA busque as informações!" : "Type the band name first so the AI can look it up!");
      return;
    }
    setFormError("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/bands/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bandName: formName, lang })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Populate Form
      setFormGenre(data.genre || "");
      setFormCountry(data.country || "");
      setFormYear(Number(data.formationYear) || 2000);
      setFormBio(typeof data.bio === "string" ? data.bio : (data.bio[lang] || JSON.stringify(data.bio)));
      
      if (data.logoUrl) {
        setFormLogoUrl(data.logoUrl);
      } else {
        const DEFAULT_METAL_IMAGES = [
          "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80",
          "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80"
        ];
        const randomImg = DEFAULT_METAL_IMAGES[Math.floor(Math.random() * DEFAULT_METAL_IMAGES.length)];
        setFormLogoUrl(randomImg);
      }

      setFormPhotoUrl(data.photoUrl || "");
      
      if (data.members && Array.isArray(data.members)) {
        const memStr = data.members.map((m: any) => `${m.name}; ${m.role}, ${m.status || 'active'}`).join("\n");
        setFormMembersText(memStr);
      }
      
      if (data.discography && Array.isArray(data.discography)) {
        const discStr = data.discography.map((d: any) => `${d.title}; ${d.year}, ${d.type || 'Album'}`).join("\n");
        setFormDiscographyText(discStr);
      }

      if (data.socials) {
        setFormInstagram(data.socials.instagram || "");
        setFormWebsite(data.socials.website || "");
      }
      if (data.contacts) {
        setFormEmail(data.contacts.email || "");
        setFormPhone(data.contacts.phone || "");
      }
    } catch (err: any) {
      console.error(err);
      setFormError(lang === "pt" 
        ? "Erro ao consultar a IA. Preencha manualmente ou verifique sua conexão." 
        : "Failed to consult AI. Please fill in manually or check connectivity."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Natural Language search matching via Google Gemini query
  const handleGeminiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geminiQuery.trim()) return;

    setGeminiSearching(true);
    setGeminiError("");

    try {
      // Map bands list to light models for token defense and maximum performance
      const bandsPayload = bands.map(b => ({
        id: b.id,
        name: b.name,
        genre: b.genre,
        country: b.country,
        formationYear: b.formationYear
      }));

      const res = await fetch("/api/bands/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bandsList: bandsPayload, 
          query: geminiQuery 
        })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMatchedIds(data.matchedIds ?? []);
    } catch (err: any) {
      console.error("Gemini search failed:", err);
      setGeminiError(lang === "pt" 
        ? "Erro ao realizar busca inteligente por IA. Verifique conexões." 
        : "Advanced AI search failed. Check your connection or Secrets."
      );
    } finally {
      setGeminiSearching(false);
    }
  };

  const handleClearGeminiSearch = () => {
    setGeminiQuery("");
    setMatchedIds(null);
    setGeminiError("");
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(search);
    setAppliedGenres(selectedGenres);
    setAppliedCountries(selectedCountries);
    setHasSearched(true);
    // Clear Gemini search to avoid conflicting active states
    setMatchedIds(null);
  };

  const handleClearManualSearch = () => {
    setSearch("");
    setSelectedGenres([]);
    setSelectedCountries([]);
    setAppliedSearch("");
    setAppliedGenres([]);
    setAppliedCountries([]);
    setHasSearched(false);
    if (onClearGlobalSearch) {
      onClearGlobalSearch();
    }
  };

  // Submit Band Form
  const handleSubmitBand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName || !formGenre) {
      setFormError(lang === "pt" ? "Nome e gênero são obrigatórios!" : "Name and genre are required!");
      return;
    }

    // Parse members
    const members: BandMember[] = [];
    if (formMembersText.trim()) {
      const lines = formMembersText.split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        const [name, rest] = line.split(";");
        const [role, status] = rest ? rest.split(",") : ["Guitar/Vocals", "active"];
        members.push({
          name: name?.trim() || "Unknown",
          role: role?.trim() || "Guitar",
          status: (status?.trim() === "former" ? "former" : "active")
        });
      }
    }

    // Parse discography
    const discography: DiscographyItem[] = [];
    if (formDiscographyText.trim()) {
      const lines = formDiscographyText.split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        const [title, rest] = line.split(";");
        const [yearStr, type] = rest ? rest.split(",") : ["2000", "Album"];
        discography.push({
          title: title?.trim() || "Untitled",
          year: Number(yearStr?.trim()) || 2000,
          type: (type?.trim() as any) || "Album"
        });
      }
    }

    const DEFAULT_METAL_IMAGES = [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&q=80"
    ];
    const randomFallbackImg = DEFAULT_METAL_IMAGES[Math.floor(Math.random() * DEFAULT_METAL_IMAGES.length)];

    const bandPayload: Omit<Band, "id"> = {
      name: formName.trim(),
      logoUrl: formLogoUrl.trim() || randomFallbackImg,
      photoUrl: formPhotoUrl.trim() || undefined,
      country: formCountry.trim() || (lang === "pt" ? "Sem País" : "Unknown"),
      formationYear: Number(formYear) || 2000,
      genre: formGenre.trim(),
      bio: typeof formBio === "string" ? formBio.trim() : { [lang]: formBio },
      members,
      discography,
      socials: {
        instagram: formInstagram.trim() || undefined,
        website: formWebsite.trim() || undefined,
      },
      contacts: {
        email: formEmail.trim() || undefined,
        phone: formPhone.trim() || undefined
      },
      approved: isAdmin, // Auto approve lock only for patricioaug@gmail.com
      submittedBy: user?.uid || "guest"
    };

    const success = await onAddBand(bandPayload);
    if (success) {
      // Clear Form
      setFormName("");
      setFormGenre("");
      setFormCountry("");
      setFormYear(2000);
      setFormBio("");
      setFormLogoUrl("");
      setFormPhotoUrl("");
      setFormMembersText("");
      setFormDiscographyText("");
      setFormInstagram("");
      setFormWebsite("");
      setFormEmail("");
      setFormPhone("");
      setShowSubmitForm(false);
    }
  };

  const suggestedBands = search.trim()
    ? bands
        .filter(b => b.approved && b.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 6)
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestedBands.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => 
        prev < suggestedBands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => 
        prev > 0 ? prev - 1 : suggestedBands.length - 1
      );
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestedBands.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestedBands[activeSuggestionIndex].name);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div id="band-section-wrapper" className="space-y-6">
      {/* FILTER CONTROLS GRID */}
      <form onSubmit={handleManualSearch} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🔍 Palavra-Chave / Nome" : "🔍 Keyword / Name"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-200 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-red-600"
              />
              {showSuggestions && suggestedBands.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl max-h-60 overflow-y-auto shadow-2xl z-50">
                  {suggestedBands.map((b, idx) => (
                    <button
                      key={b.id || idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                      }}
                      onClick={() => handleSelectSuggestion(b.name)}
                      className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-neutral-900 last:border-b-0 transition flex justify-between items-center ${
                        activeSuggestionIndex === idx 
                          ? "bg-red-950/40 text-rose-400 border-l-2 border-red-600 pl-2.5" 
                          : "hover:bg-red-950/20 text-neutral-300 hover:text-rose-400 pl-3"
                      }`}
                    >
                      <span>{b.name}</span>
                      <span className="text-[9px] text-zinc-500 capitalize">{b.genre}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🎸 Gênero" : "🎸 Genre"}
            </label>
            <button
              type="button"
              onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-300 px-3 py-2 rounded-lg font-mono text-left flex justify-between items-center focus:outline-none focus:border-red-600 h-[34px]"
            >
              <span className="truncate">
                {selectedGenres.length === 0
                  ? (lang === "pt" ? "Todos os Gêneros" : t.allGenres)
                  : selectedGenres.length === 1
                  ? `1 ${lang === "pt" ? "Gênero" : "Genre"}: ${selectedGenres[0]}`
                  : `${selectedGenres.length} ${lang === "pt" ? "Gêneros Selecionados" : "Genres Selected"}`}
              </span>
              <span className="text-[10px] text-zinc-500">▼</span>
            </button>

            {isGenreDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 z-50 space-y-2 max-h-64 overflow-y-auto shadow-2xl">
                <input
                  type="text"
                  placeholder={lang === "pt" ? "Filtrar gêneros..." : "Filter genres..."}
                  value={genreSearch}
                  onChange={(e) => setGenreSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-200 px-2.5 py-1.5 rounded focus:outline-none focus:border-red-600 font-mono"
                />
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {allGenres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).map(g => {
                    const isChecked = selectedGenres.includes(g);
                    return (
                      <label
                        key={g}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 text-xs text-neutral-300 capitalize cursor-pointer font-mono"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedGenres(selectedGenres.filter(x => x !== g));
                            } else {
                              setSelectedGenres([...selectedGenres, g]);
                            }
                          }}
                          className="rounded border-neutral-800 bg-neutral-950 text-red-600 focus:ring-red-600/30 w-3.5 h-3.5"
                        />
                        <span>{g}</span>
                      </label>
                    );
                  })}
                  {allGenres.filter(g => g.toLowerCase().includes(genreSearch.toLowerCase())).length === 0 && (
                    <p className="text-[10px] text-zinc-500 text-center font-mono py-1">
                      {lang === "pt" ? "Nenhum gênero encontrado" : "No genres found"}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-neutral-800 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedGenres([])}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-950/20 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-900/30 transition cursor-pointer font-bold"
                  >
                    {lang === "pt" ? "Limpar" : "Clear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGenreDropdownOpen(false)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-lg border border-red-700 hover:border-red-600 shadow-lg shadow-red-950/50 hover:shadow-red-950/70 transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🌍 País de Origem" : "🌍 Country of Origin"}
            </label>
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-300 px-3 py-2 rounded-lg font-mono text-left flex justify-between items-center focus:outline-none focus:border-red-600 h-[34px]"
            >
              <span className="truncate">
                {selectedCountries.length === 0
                  ? (lang === "pt" ? "Todos os Países" : t.allCountries)
                  : selectedCountries.length === 1
                  ? `1 ${lang === "pt" ? "País" : "Country"}: ${selectedCountries[0]}`
                  : `${selectedCountries.length} ${lang === "pt" ? "Países Selecionados" : "Countries Selected"}`}
              </span>
              <span className="text-[10px] text-zinc-500">▼</span>
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-neutral-950 border border-neutral-800 rounded-xl p-3 z-50 space-y-2 max-h-64 overflow-y-auto shadow-2xl">
                <input
                  type="text"
                  placeholder={lang === "pt" ? "Filtrar países..." : "Filter countries..."}
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-200 px-2.5 py-1.5 rounded focus:outline-none focus:border-red-600 font-mono"
                />
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {allCountries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).map(c => {
                    const isChecked = selectedCountries.includes(c);
                    return (
                      <label
                        key={c}
                        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-900 text-xs text-neutral-300 capitalize cursor-pointer font-mono"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCountries(selectedCountries.filter(x => x !== c));
                            } else {
                              setSelectedCountries([...selectedCountries, c]);
                            }
                          }}
                          className="rounded border-neutral-800 bg-neutral-950 text-red-600 focus:ring-red-600/30 w-3.5 h-3.5"
                        />
                        <span>{c}</span>
                      </label>
                    );
                  })}
                  {allCountries.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase())).length === 0 && (
                    <p className="text-[10px] text-zinc-500 text-center font-mono py-1">
                      {lang === "pt" ? "Nenhum país encontrado" : "No countries found"}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-neutral-800 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSelectedCountries([])}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-950/20 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-900/30 transition cursor-pointer font-bold"
                  >
                    {lang === "pt" ? "Limpar" : "Clear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(false)}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-lg border border-red-700 hover:border-red-600 shadow-lg shadow-red-950/50 hover:shadow-red-950/70 transition-all duration-150 cursor-pointer active:scale-95"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1 border-t border-neutral-900/60">
          <button
            type="button"
            onClick={handleClearManualSearch}
            className="px-4 py-1.5 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded border border-neutral-800 transition cursor-pointer"
          >
            ❌ {lang === "pt" ? "Limpar" : "Clear"}
          </button>
          <button
            type="submit"
            className="px-5 py-1.5 bg-red-950 hover:bg-red-900 border border-red-900/45 text-red-100 text-[11px] font-mono font-bold uppercase tracking-wider rounded transition cursor-pointer flex items-center gap-1 shadow-md"
          >
            🔍 {lang === "pt" ? "Buscar" : "Search"}
          </button>
        </div>
      </form>

      {/* MANUAL SEARCH RESULTS PREVIEW */}
      {hasSearched && (
        <div className="bg-neutral-900/40 border border-neutral-800 p-4 rounded-xl space-y-3.5 transition">
          <div className="flex items-center justify-between gap-2 bg-red-950/15 border border-red-900/30 p-2.5 rounded-lg select-none">
            <div className="flex items-center gap-2 text-[10.5px] text-red-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>
                {lang === "pt"
                  ? `Filtro de Busca Ativo: Encontradas ${filteredBands.length} bandas correspondentes.`
                  : lang === "es"
                  ? `Filtro de Búsqueda Activo: Encontradas ${filteredBands.length} bandas correspondientes.`
                  : `Search Filter Active: ${filteredBands.length} matching bands found.`
                }
              </span>
            </div>
            <button
              onClick={handleClearManualSearch}
              className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:text-red-350 font-mono bg-red-955 px-2.5 py-1 rounded border border-red-900/60 transition cursor-pointer"
            >
              {lang === "pt" ? "Resetar Filtro" : "Reset Filter"}
            </button>
          </div>

          {filteredBands.length > 0 ? (
            <div className="bg-neutral-950/70 border border-neutral-850 p-3 rounded-lg space-y-2">
              <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-semibold">
                {lang === "pt" ? "Resultados Encontrados na Tela:" : lang === "es" ? "Resultados Encontrados en Pantalla:" : "Found Results on Screen:"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sortedBands.map(b => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-between gap-2.5 p-2 bg-neutral-900/55 border border-neutral-800/65 rounded-md hover:border-red-950/40 transition shadow-sm"
                  >
                    <div className="flex items-center gap-2 relative">
                      <span className="text-xs text-red-500 shrink-0">🎸</span>
                      <div className="truncate relative group/tooltip">
                        <p className="text-xs font-bold text-white font-mono truncate hover:text-red-400 transition cursor-help decoration-dotted decoration-zinc-500 hover:underline underline-offset-2">{b.name}</p>
                        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 scale-95 opacity-0 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 transition-all duration-200 z-50 bg-neutral-950 border border-red-900/60 text-neutral-200 rounded-md p-2.5 shadow-2xl text-left font-mono normal-case tracking-normal">
                          <div className="text-red-400 font-extrabold border-b border-neutral-800 pb-1 mb-1 text-[10px] truncate">{b.name}</div>
                          <div className="space-y-0.5 text-[9px] text-zinc-300">
                            <div><span className="text-zinc-500 font-bold uppercase text-[8px]">{lang === "pt" ? "Gênero:" : "Genre:"}</span> {b.genre}</div>
                            <div><span className="text-zinc-500 font-bold uppercase text-[8px]">{lang === "pt" ? "País:" : "Country:"}</span> {b.country}</div>
                            <div><span className="text-zinc-500 font-bold uppercase text-[8px]">{lang === "pt" ? "Formação:" : "Year Formed:"}</span> {b.formationYear || "N/A"}</div>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-950 border-r border-b border-red-900/60 rotate-45 -mt-1"></div>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          if (b.id) {
                            setExpandedBandId(b.id);
                            setTimeout(() => {
                              const el = document.getElementById(`band-card-${b.id}`);
                              if (el) {
                                el.scrollIntoView({ behavior: "smooth", block: "center" });
                              }
                            }, 100);
                          }
                        }}
                        className="text-[9px] uppercase font-bold tracking-wider text-red-400 hover:text-red-350 font-mono px-2 py-1 bg-neutral-950 hover:bg-neutral-900 rounded border border-neutral-800 transition cursor-pointer"
                      >
                        {lang === "pt" ? "Ver Detalhes" : "View Details"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-950/40 border border-neutral-850/60 p-4 rounded-lg text-center">
              <p className="text-xs text-neutral-500 font-mono">
                {lang === "pt" ? "Nenhuma banda corresponde aos critérios selecionados." : "No bands matched the selected criteria."}
              </p>
            </div>
          )}
        </div>
      )}





      {/* BAND CARDS DISPLAY */}
      <div id="bands-list-section-header"></div>
      
      {baseFilteredBands.length > 0 && (
        <div className="mb-4 bg-neutral-950/60 border border-neutral-850/70 p-3.5 rounded-xl space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between gap-2 border-b border-neutral-900 pb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-extrabold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              {lang === "pt" ? "Navegação Alfabética:" : lang === "es" ? "Navegación Alfabética:" : "Alphabetical Navigation:"}
            </span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-[9.5px] uppercase font-extrabold tracking-widest text-red-500 hover:text-red-400 font-mono transition cursor-pointer flex items-center gap-1 bg-red-950/20 px-2 py-0.5 rounded border border-red-900/30"
              >
                ✕ {lang === "pt" ? "Mostrar Todas" : lang === "es" ? "Mostrar Todas" : "Show All"}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5 py-0.5">
            {alphabet.map((letter) => {
              const hasBands = availableLetters.includes(letter);
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!hasBands}
                  onClick={() => handleLetterClick(letter)}
                  className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-xs font-bold font-mono transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/50 scale-110 border border-red-500"
                      : hasBands
                      ? "bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white hover:border-red-900/50"
                      : "bg-neutral-950/40 border border-neutral-950/15 text-neutral-600 opacity-20 cursor-not-allowed"
                  }`}
                  title={
                    hasBands 
                      ? (lang === "pt" ? `Ver bandas com ${letter}` : `View bands with ${letter}`) 
                      : (lang === "pt" ? "Nenhuma banda" : "No bands")
                  }
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filteredBands.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/40 border border-neutral-800/50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400 font-extrabold">
              {lang === "pt" ? "⚡ Ordenar lista:" : lang === "es" ? "⚡ Ordenar lista:" : "⚡ Sort list:"}
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setSortOrder(null)}
              className={`px-2.5 py-1 rounded border uppercase font-extrabold transition cursor-pointer ${
                sortOrder === null
                  ? "bg-red-950/60 border-red-800 text-red-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {lang === "pt" ? "Padrão" : lang === "es" ? "Por defecto" : "Default"}
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("asc")}
              className={`px-2.5 py-1 rounded border uppercase font-extrabold transition cursor-pointer flex items-center gap-1 ${
                sortOrder === "asc"
                  ? "bg-red-950/60 border-red-800 text-red-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <span>A ➔ Z</span>
            </button>
            <button
              type="button"
              onClick={() => setSortOrder("desc")}
              className={`px-2.5 py-1 rounded border uppercase font-extrabold transition cursor-pointer flex items-center gap-1 ${
                sortOrder === "desc"
                  ? "bg-red-950/60 border-red-800 text-red-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              <span>Z ➔ A</span>
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <BandSkeletonList />
      ) : filteredBands.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
          <p className="text-sm text-neutral-500 font-mono">{t.noBandsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedBands.map((band, index) => {
            const isExpanded = expandedBandId === band.id;
            const bioText = typeof band.bio === "string" ? band.bio : (band.bio[lang] || band.bio["en"] || "");

            return (
              <motion.div
                key={band.id}
                id={`band-card-${band.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ 
                  opacity: { duration: 0.4 },
                  y: { duration: 0.4 },
                  scale: { duration: 0.2, ease: "easeOut" }
                }}
                className={`${
                  index % 2 === 0 
                    ? "bg-black hover:bg-neutral-950 border border-neutral-900" 
                    : "bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800"
                } text-neutral-200 p-5 rounded-xl hover:border-red-950/50 transition-all duration-300 shadow-xl flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition font-mono flex items-center flex-wrap gap-2">
                        <span className="relative group/tooltip cursor-help decoration-dotted hover:underline underline-offset-4">
                          {band.name}
                          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 scale-95 opacity-0 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 transition-all duration-200 z-50 bg-neutral-950 border border-red-900/60 text-neutral-200 rounded-md p-3 shadow-2xl text-left font-mono normal-case tracking-normal">
                            <div className="text-red-400 font-extrabold border-b border-neutral-800 pb-1 mb-1 text-[11px] truncate">{band.name}</div>
                            <div className="space-y-1 text-[10px] text-zinc-300">
                              <div><span className="text-zinc-500 font-bold uppercase text-[8px] tracking-wider">{lang === "pt" ? "Gênero:" : "Genre:"}</span> {band.genre}</div>
                              <div><span className="text-zinc-500 font-bold uppercase text-[8px] tracking-wider">{lang === "pt" ? "País:" : "Country:"}</span> {band.country}</div>
                              <div><span className="text-zinc-500 font-bold uppercase text-[8px] tracking-wider">{lang === "pt" ? "Formação:" : "Year Formed:"}</span> {band.formationYear || "N/A"}</div>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-950 border-r border-b border-red-900/60 rotate-45 -mt-1"></div>
                          </span>
                        </span>
                        {!band.approved && (
                          <span className="bg-amber-950 border border-amber-800 text-amber-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-mono">
                            {lang === "pt" ? "Pendente" : "Pending"}
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-red-500 font-mono uppercase tracking-wider font-semibold">
                        {band.genre}
                      </p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">

                      <button
                        onClick={() => setSharingBand(band)}
                        className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-amber-500 rounded-lg transition cursor-pointer"
                        title={lang === "pt" ? "Compartilhar Banda" : lang === "es" ? "Compartir Banda" : "Share Band"}
                      >
                        <Share2 size={13} />
                      </button>
                      <button
                        onClick={() => setQrBand(band)}
                        className="p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                        title={lang === "pt" ? "QR Code da Banda" : lang === "es" ? "Código QR de la Banda" : "Band QR Code"}
                      >
                        <QrCode size={13} />
                      </button>
                      {isAdmin && (
                        <button
                          id={`btn-del-band-${band.id}`}
                          onClick={() => band.id && onDeleteBand(band.id)}
                          className="p-1.5 bg-neutral-950 hover:bg-red-950 text-neutral-500 hover:text-red-400 rounded-lg transition"
                          title={t.deleteBtn}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Core facts */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-neutral-950/75 rounded-lg border border-neutral-850 font-mono text-center">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">{t.originCountry}</span>
                      <span className="text-xs text-neutral-200 mt-0.5 inline-flex items-center gap-1 justify-center">
                        <Globe size={11} className="text-neutral-500" />
                        {band.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">{t.formationYear}</span>
                      <span className="text-xs text-neutral-200 mt-0.5 inline-flex items-center gap-1 justify-center">
                        <Calendar size={11} className="text-neutral-500" />
                        {band.formationYear}
                      </span>
                    </div>
                  </div>

                  {/* BIO Paragraph */}
                  {bioText && bioText.trim() !== "" && (
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-3">
                      {bioText}
                    </p>
                  )}

                  {/* More Info Section (Metal Archives & Wikipedia) */}
                  <div className="mt-2 mb-4 flex flex-wrap gap-2">
                    <a
                      href={`https://www.metal-archives.com/search?searchString=${encodeURIComponent(band.name)}&type=band_name`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-neutral-950 hover:bg-neutral-900 border-neutral-850 hover:border-red-900 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      title={lang === "pt" ? "Ver no Metal Archives" : lang === "es" ? "Ver en Metal Archives" : "View on Metal Archives"}
                    >
                      <ExternalLink size={10} className="text-red-500" />
                      <span>Metal Archives</span>
                    </a>
                    <a
                      href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(band.name + " (band)")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-neutral-950 hover:bg-neutral-900 border-neutral-850 hover:border-red-900 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      title={lang === "pt" ? "Ver na Wikipedia" : lang === "es" ? "Ver en Wikipedia" : "View on Wikipedia"}
                    >
                      <Globe size={10} className="text-blue-500" />
                      <span>{lang === "pt" ? "Mais Info (Wiki)" : lang === "es" ? "Más Info (Wiki)" : "More Info (Wiki)"}</span>
                    </a>
                  </div>

                  {/* Iron Maiden Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "iron maiden" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/Ij99dud8-0A?is=9D0afOxpSgKjmCa0", "Iron Maiden - Wasted Years");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Death Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "death" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/7j8vUbMmOwM?is=-OTDhB4Wi7a8Ct05", "Death");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Dream Theater Custom Video Button */}
                  {(band.name?.toLowerCase().trim() === "dream theater" || band.name?.toLowerCase().trim() === "dream theather") && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/JuZ2zp-6lLY?is=6Dtto7VH0leXKhJS", "Dream Theater");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Candlemass Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "candlemass" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/5cMPITYwvTs?is=25JsCrRAp4U9q3tZ", "Candlemass");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Sepultura Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "sepultura" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/0K4J90s1A2M?is=HZYGBeUjOYKZzkYT", "Sepultura");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Angra Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "angra" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/yMvuk1NFnnw?is=wrRrgHDJ3W5zWr6S", "Angra");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Black Sabbath Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "black sabbath" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/Uq42HUUJFzU?is=W6h8bsaZMLZKjFb2", "Black Sabbath");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Slayer Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "slayer" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/-q66zKQ3-XM?is=IqIditj5sVwC0_Zm", "Slayer");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Metallica Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "metallica" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/qdlQyNe_9tE?is=2TK3uW4Cdf3OFmnZ", "Metallica");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}

                  {/* Red Devil Vortex Custom Video Button */}
                  {band.name?.toLowerCase().trim() === "red devil vortex" && onOpenVideoWindow && (
                    <div className="mt-2 mb-4 flex justify-start">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoWindow("https://youtu.be/aFc43UhZsNI?is=thWnwMXg7n-SzW5C", "Red Devil Vortex");
                        }}
                        className="px-2.5 py-1 rounded-full text-[8.5px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-red-950/80 hover:bg-red-900 border-red-900/30 hover:border-red-600 text-zinc-300 hover:text-white hover:scale-[1.02] active:scale-[0.98] shrink-0 shadow-md"
                      >
                        <Video size={10} className="text-red-500" />
                        <span>{lang === "pt" ? "Vídeo da Banda" : lang === "es" ? "Vídeo de la Banda" : "Band Video"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* EXPANDED DETAILED AREA */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-4">
                    {/* Expanded Cover Band Banner */}
                    <div className="w-full h-36 rounded-lg overflow-hidden relative border border-neutral-800/60 bg-neutral-950 flex shadow-inner transition group-hover:border-red-900/40">
                      <BandLogo name={band.name} logoUrl={band.logoUrl} photoUrl={band.photoUrl} className="w-full h-full brightness-[0.35]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30 flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase tracking-widest font-mono text-zinc-400 bg-neutral-950/80 px-2.5 py-1 rounded border border-neutral-800">
                            {band.country}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest font-mono text-red-400 bg-red-950/80 px-2.5 py-1 rounded border border-red-900/30">
                            {band.formationYear}
                          </span>
                        </div>
                        <div>
                          <p className="text-xl font-black text-white tracking-wider font-mono uppercase">
                            {band.name}
                          </p>
                          <p className="text-xs text-red-500 font-mono tracking-wide mt-0.5 capitalize">
                            ⚡ {band.genre}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Band Photo Section if photoUrl exists */}
                    {band.photoUrl && band.photoUrl.trim() !== "" && (
                      <div className="bg-neutral-950/50 p-3.5 rounded-lg border border-neutral-850/70 shadow-inner">
                        <span className="text-[9px] text-zinc-400 font-mono block uppercase mb-2 flex items-center gap-1.5 font-bold tracking-wider">
                          📸 {lang === "pt" ? "FOTO OFICIAL DA BANDA" : "OFFICIAL BAND PHOTO"}
                        </span>
                        <div className="w-full max-h-72 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40 flex items-center justify-center">
                          <img
                            src={getProxiedImageUrl(band.photoUrl, 600)}
                            alt={band.name}
                            className="w-full h-auto max-h-72 object-contain hover:scale-[1.01] transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}



                    {/* Members List */}
                    {band.members && band.members.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
                          <UserCheck size={12} className="text-amber-500" />
                          {t.members} <span className="text-[9px] text-neutral-500 normal-case font-normal">({lang === "pt" ? "clique para ver detalhes" : "click to view profile"})</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.55">
                          {band.members.map((m, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleFetchDetails("member", band.name, m.name)}
                              className={`text-[10px] px-2.5 py-1 rounded font-mono text-left cursor-pointer transition-all border ${
                                m.status === "active" 
                                  ? "bg-neutral-950 text-neutral-200 border-neutral-850 hover:border-amber-500/80 hover:bg-neutral-900" 
                                  : "bg-neutral-950 text-neutral-500 line-through decoration-red-900 border-neutral-850 hover:border-amber-700/80 hover:bg-neutral-900"
                              }`}
                              title={lang === "pt" ? `Ver perfil do integrante ${m.name}` : `View details for ${m.name}`}
                            >
                              👤 {m.name} <span className="text-[9px] text-zinc-500 font-sans">({m.role})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Discography */}
                    {band.discography && band.discography.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
                          <Disc size={12} className="text-red-500" />
                          {t.discography} <span className="text-[9px] text-neutral-500 normal-case font-normal">({lang === "pt" ? "clique para ver faixa/estúdio" : "click to see tracks/info"})</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                          {band.discography.map((d, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleFetchDetails("album", band.name, d.title)}
                              className="w-full text-left bg-neutral-950/70 p-2.5 border border-neutral-850 hover:border-red-600/80 hover:bg-neutral-900 rounded flex justify-between text-[11px] font-mono cursor-pointer transition-all"
                              title={lang === "pt" ? `Ver detalhes do disco ${d.title}` : `View tracklist and trivia for ${d.title}`}
                            >
                              <span className="text-neutral-200 font-bold truncate pr-1">📀 {d.title}</span>
                              <span className="text-red-500 italic shrink-0">{d.year} ({d.type})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contacts & Booking */}
                    {(band.contacts?.email || band.contacts?.phone) && (
                      <div className="p-3 bg-red-950/10 border border-red-950/40 rounded-lg space-y-1.5 font-mono text-[11px]">
                        <span className="text-[9px] text-neutral-500 block uppercase font-bold tracking-wider text-amber-500">
                          📞 {t.contactsHeader}
                        </span>
                        {band.contacts.email && (
                          <p className="flex items-center gap-1.5 text-neutral-300">
                            <Mail size={11} className="text-red-500" />
                            {band.contacts.email}
                          </p>
                        )}
                        {band.contacts.phone && (
                          <p className="flex items-center gap-1.5 text-neutral-300">
                            <Phone size={11} className="text-red-500" />
                            {band.contacts.phone}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Official Website, Verified Source & YouTube Links */}
                    <div className="flex flex-wrap gap-2">
                      {band.socials?.website && (
                        <a
                          href={band.socials.website.startsWith("http") ? band.socials.website : `https://${band.socials.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-950 hover:bg-neutral-850 px-2.5 py-1.5 rounded text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 border border-neutral-850 hover:border-blue-900/40 transition duration-200"
                        >
                          <ExternalLink size={11} /> {lang === "pt" ? "Site Oficial" : "Official Website"}
                        </a>
                      )}
                      {band.sourceUrl && (
                        <a
                          href={band.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-950 hover:bg-neutral-850 px-2.5 py-1.5 rounded text-[10px] font-mono text-amber-500 hover:text-amber-400 flex items-center gap-1.5 border border-neutral-850 hover:border-amber-900/40 transition duration-200"
                        >
                          <Globe size={11} className="text-amber-500" /> {lang === "pt" ? "Fonte de Informações" : "Verified Source"}
                        </a>
                      )}
                      {band.socials?.instagram && (
                        <a
                          href={band.socials.instagram.startsWith("http") ? band.socials.instagram : `https://instagram.com/${band.socials.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-950 hover:bg-neutral-850 px-2.5 py-1.5 rounded text-[10px] font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1 border border-neutral-850 hover:border-pink-900/40 transition duration-200"
                        >
                          📷 {band.socials.instagram}
                        </a>
                      )}
                      
                      {/* Clickable YouTube channel link for ALL bands */}
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(band.name + " metal band")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-950 hover:bg-neutral-850 px-2.5 py-1.5 rounded text-[10px] font-mono text-red-500 hover:text-red-400 flex items-center gap-1.5 border border-neutral-850 hover:border-red-900/40 transition duration-150 cursor-pointer"
                      >
                        <Youtube size={11} className="text-red-500" />
                        <span>YouTube</span>
                      </a>

                      {/* Clickable Spotify search link for ALL bands */}
                      <a
                        href={`https://open.spotify.com/search/${encodeURIComponent(band.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-950 hover:bg-neutral-850 px-2.5 py-1.5 rounded text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 border border-neutral-850 hover:border-emerald-900/40 transition duration-150 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Spotify</span>
                      </a>
                    </div>
                  </div>
                )}

                <button
                  id={`btn-toggle-expand-band-${band.id}`}
                  onClick={() => setExpandedBandId(isExpanded ? null : (band.id || null))}
                  className="w-full mt-4 bg-neutral-950 hover:bg-neutral-850 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition text-neutral-300 border border-neutral-800/80 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isExpanded 
                    ? (lang === "pt" ? "▲ Recolher Detalhes" : "▲ Collapse Details")
                    : (lang === "pt" ? "▼ Mostrar Discografia" : "▼ Show Discography")
                  }
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CLICKED DETAILS MODAL OVERLAY */}
      {activeDetailType && (
        <div id="clicked-details-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-neutral-900 border border-neutral-800/80 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 shadow-2xl space-y-4 font-sans text-neutral-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveDetailType(null)}
              className="absolute top-4 right-4 p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition cursor-pointer"
              title="Close"
            >
              <X size={14} />
            </button>

            {detailLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div id="loader-spinner" className="relative w-12 h-12 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin"></span>
                  <Music className="text-red-500 animate-pulse" size={18} />
                </div>
                <p className="text-xs text-neutral-400 font-mono animate-pulse text-center">
                  {lang === "pt" ? "Consultando arquivos históricos..." : "Consulting historical database archives..."}
                </p>
              </div>
            ) : detailError ? (
              <div className="py-6 space-y-3 text-center">
                <p className="text-sm text-red-500 font-mono">⚠️ {detailError}</p>
                <button
                  onClick={() => setActiveDetailType(null)}
                  className="px-4 py-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 text-xs font-mono rounded-lg transition"
                >
                  {lang === "pt" ? "Fechar" : "Close"}
                </button>
              </div>
            ) : detailData ? (
              <div className="space-y-4">
                {/* Header info */}
                <div>
                  <span className="text-[10px] bg-red-950/60 border border-red-900/45 text-red-400 px-2.5 py-0.5 rounded-full font-mono uppercase font-bold tracking-widest leading-none block w-max">
                    {activeDetailType === "member" 
                      ? (lang === "pt" ? "Membro de Banda • Perfil" : "Band Member • Profile")
                      : (lang === "pt" ? "Lançamento Oficial • Dossiê" : "Official Release • Dossier")
                    }
                  </span>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono mt-2 pr-6 leading-tight">
                    {activeDetailType === "member" ? detailData.name : detailData.title}
                  </h3>
                  <p className="text-xs text-red-500 font-mono tracking-wide mt-1 font-semibold uppercase">
                    🎸 {activeDetailBandName}
                  </p>
                  {activeDetailType === "album" && (
                    <div className="mt-3">
                      <a
                        href={`https://open.spotify.com/search/${encodeURIComponent(activeDetailBandName + " " + detailData.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 hover:bg-emerald-900/40 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg text-[10px] font-mono transition duration-150 cursor-pointer shadow-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{lang === "pt" ? "🎧 Ouvir Álbum no Spotify" : "🎧 Listen on Spotify"}</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-800/80 pt-3.5 space-y-4">
                  {activeDetailType === "member" ? (
                    <>
                      {/* Birth Info */}
                      {detailData.birthInfo && 
                       !detailData.birthInfo.toLowerCase().includes("não encontrado") && 
                       !detailData.birthInfo.toLowerCase().includes("not found") && 
                       !detailData.birthInfo.toLowerCase().includes("offline") && (
                        <div className="grid grid-cols-1 select-text">
                          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{lang === "pt" ? "Origem / Nascimento" : "Birth / Origin"}</span>
                          <p className="text-xs text-neutral-300 font-mono mt-0.5">{detailData.birthInfo}</p>
                        </div>
                      )}

                      {/* Instruments tags */}
                      {detailData.instruments && 
                       detailData.instruments.length > 0 && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-1 tracking-wider">{lang === "pt" ? "Instrumentos tocados" : "Instruments played"}</span>
                          <div className="flex flex-wrap gap-1">
                            {detailData.instruments.map((ins: string, i: number) => (
                              <span key={i} className="text-[9px] font-mono bg-neutral-950 text-neutral-300 px-2 py-0.5 rounded border border-neutral-850">
                                🛡️ {ins}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contributions */}
                      {detailData.contributions && 
                       !detailData.contributions.toLowerCase().includes("membro ativo essencial") && 
                       !detailData.contributions.toLowerCase().includes("miembro activo indispensable") && 
                       !detailData.contributions.toLowerCase().includes("crucial band member") && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Papel & Atuação" : "Historical Role & Style"}</span>
                          <p className="text-xs text-neutral-300 leading-relaxed mt-1 bg-neutral-950/40 p-3 border border-neutral-850 rounded font-sans whitespace-pre-line select-text">
                            {detailData.contributions}
                          </p>
                        </div>
                      )}

                      {/* Other Bands */}
                      {detailData.otherBands && 
                       detailData.otherBands.length > 0 && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-1 tracking-wider">{lang === "pt" ? "Outras Bandas Conhecidas" : "Other Notable Band Affiliations"}</span>
                          <div className="flex flex-wrap gap-1">
                            {detailData.otherBands.map((ob: string, i: number) => (
                              <span key={i} className="text-[9px] font-mono bg-neutral-950 text-amber-500 px-2.5 py-0.5 rounded border border-neutral-850 font-bold">
                                {ob}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Equipment / Trivia */}
                      {detailData.trivia && 
                       !detailData.trivia.toLowerCase().includes("conhecido por suas performances") && 
                       !detailData.trivia.toLowerCase().includes("famoso por sus") && 
                       !detailData.trivia.toLowerCase().includes("well-known for") && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Fatos Notáveis & Curiosidades" : "Gear & Trivia"}</span>
                          <p className="text-xs text-zinc-400 mt-1 italic font-sans pl-2.5 border-l-2 border-amber-600/50 select-text">
                            {detailData.trivia}
                          </p>
                        </div>
                      )}

                      {/* Legacy summary */}
                      {detailData.summary && 
                       !detailData.summary.toLowerCase().includes("composições e presença") && 
                       !detailData.summary.toLowerCase().includes("composiciones y presencia") && 
                       !detailData.summary.toLowerCase().includes("stellar and highly influential") && (
                        <div className="bg-amber-950/10 p-3 border border-amber-900/25 rounded font-sans text-xs text-zinc-300 relative overflow-hidden">
                          <span className="text-base absolute right-2 bottom-1 text-amber-950 select-none">★</span>
                          🌟 {detailData.summary}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Release Info */}
                      {detailData.releaseInfo && 
                       !detailData.releaseInfo.toLowerCase().includes("studio release") && 
                       !detailData.releaseInfo.toLowerCase().includes("independent/major label") && 
                       !detailData.releaseInfo.toLowerCase().includes("não encontrado") && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Lançamento Oficial" : "Official Release Date"}</span>
                          <p className="text-xs text-neutral-300 font-mono mt-0.5">{detailData.releaseInfo}</p>
                        </div>
                      )}

                      {/* Subgenres / themes */}
                      {detailData.genre && 
                       !detailData.genre.toLowerCase().includes("heavy metal / hard rock") && 
                       !detailData.genre.toLowerCase().includes("não encontrado") && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Estilo & Temas Líricos" : "Style & Lyrical Themes"}</span>
                          <p className="text-xs text-neutral-300 mt-0.5 capitalize">{detailData.genre}</p>
                        </div>
                      )}

                      {/* Tracklist inside list container */}
                      {detailData.tracklist && 
                       detailData.tracklist.length > 0 && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block mb-1.5 tracking-wider">{lang === "pt" ? "Lista Original de Músicas" : "Original Tracklist"}</span>
                          <div className="bg-neutral-950 border border-neutral-850 rounded-lg overflow-hidden divide-y divide-neutral-850 select-text">
                            {detailData.tracklist.map((tk: any, i: number) => (
                              <div key={i} className="flex justify-between items-center px-3 py-1.5 text-xs font-mono">
                                <span className="text-neutral-300 truncate"><span className="text-neutral-500 pr-1">{i+1}.</span> {tk.track}</span>
                                <span className="text-neutral-500 text-[10px] shrink-0">{tk.length || "--:--"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Backstory */}
                      {detailData.anecdote && 
                       !detailData.anecdote.toLowerCase().includes("gravado durante sessões") && 
                       !detailData.anecdote.toLowerCase().includes("grabado en sesiones") && 
                       !detailData.anecdote.toLowerCase().includes("recorded during a high-activity") && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Backstory de Produção & Curiosidades" : "Recording Backstory & Trivia"}</span>
                          <p className="text-xs text-stone-400 leading-relaxed mt-1 bg-neutral-950/40 p-3 border border-neutral-850 rounded font-sans select-text">
                            {detailData.anecdote}
                          </p>
                        </div>
                      )}

                      {/* Impact / reception */}
                      {detailData.reception && 
                       !detailData.reception.toLowerCase().includes("amplamente reverenciado por") && 
                       !detailData.reception.toLowerCase().includes("grandemente aclamado") && 
                       !detailData.reception.toLowerCase().includes("met with solid acclaim") && (
                        <div className="bg-red-950/10 p-3 border border-red-950/35 rounded font-sans text-xs text-zinc-300 relative overflow-hidden">
                          <span className="text-base absolute right-2 bottom-1 text-red-950 select-none">★</span>
                          🏆 {detailData.reception}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-neutral-850">
                  <button
                    onClick={() => setActiveDetailType(null)}
                    className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-zinc-300 text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                  >
                    {lang === "pt" ? "Fechar Dossiê" : "Close dossier"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-neutral-400 font-mono">{lang === "pt" ? "Buscando dados no além..." : "Searching files..."}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BAND SHARE MODAL OVERLAY */}
      {sharingBand && (() => {
        const shareText = (() => {
          const bioText = typeof sharingBand.bio === "string" 
            ? sharingBand.bio 
            : (sharingBand.bio?.[lang] || sharingBand.bio?.pt || sharingBand.bio?.en || sharingBand.bio?.es || "");
          
          const membersText = sharingBand.members && sharingBand.members.length > 0
            ? sharingBand.members.map(m => `• ${m.name} (${m.role})`).join("\n")
            : "";

          const discographyText = sharingBand.discography && sharingBand.discography.length > 0
            ? sharingBand.discography.map(d => `• ${d.title} (${d.year} - ${d.type})`).join("\n")
            : "";

          const instagramValue = sharingBand.socials?.instagram || "";
          const websiteValue = sharingBand.socials?.website || "";
          const emailValue = sharingBand.contacts?.email || "";
          const phoneValue = sharingBand.contacts?.phone || "";

          let text = `🎵 *${sharingBand.name}* 🎵\n`;
          text += `━━━━━━━━━━━━━━━━━━━━\n`;
          text += `⚡ ${lang === "pt" ? "Gênero" : lang === "es" ? "Género" : "Genre"}: ${sharingBand.genre}\n`;
          text += `🌍 ${lang === "pt" ? "País" : lang === "es" ? "País" : "Country"}: ${sharingBand.country}\n`;
          if (sharingBand.formationYear) {
            text += `📅 ${lang === "pt" ? "Ano de Formação" : lang === "es" ? "Año de Formación" : "Year Formed"}: ${sharingBand.formationYear}\n`;
          }
          text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

          if (bioText.trim() !== "") {
            text += `📖 *${lang === "pt" ? "Biografia" : lang === "es" ? "Biografía" : "Biography"}:*\n${bioText}\n\n`;
          }

          if (membersText) {
            text += `👥 *${lang === "pt" ? "Integrantes" : lang === "es" ? "Integrantes" : "Members"}:*\n${membersText}\n\n`;
          }

          if (discographyText) {
            text += `📀 *${lang === "pt" ? "Discografia" : lang === "es" ? "Discografía" : "Discography"}:*\n${discographyText}\n\n`;
          }

          if (instagramValue || websiteValue) {
            text += `🔗 *Redes Sociais:*\n`;
            if (instagramValue) text += `• Instagram: ${instagramValue}\n`;
            if (websiteValue) text += `• Website: ${websiteValue}\n`;
            text += `\n`;
          }

          if (emailValue || phoneValue) {
            text += `📞 *${lang === "pt" ? "Contato" : lang === "es" ? "Contacto" : "Contact"}:*\n`;
            if (emailValue) text += `• E-mail: ${emailValue}\n`;
            if (phoneValue) text += `• Tel: ${phoneValue}\n`;
            text += `\n`;
          }

          text += `🤘 Compartilhado via Stay Metal 🤘`;
          return text;
        })();

        const handleCopy = () => {
          navigator.clipboard.writeText(shareText);
          setCopiedText(true);
          setTimeout(() => setCopiedText(false), 2000);
        };

        const handleNativeShare = async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: sharingBand.name,
                text: shareText,
              });
            } catch (err) {
              console.log("Native share error:", err);
            }
          }
        };

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(sharingBand.name)}&body=${encodeURIComponent(shareText)}`;

        return (
          <div id="band-share-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-neutral-900 border border-neutral-850 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 font-sans text-neutral-200">
              <button
                onClick={() => setSharingBand(null)}
                className="absolute top-4 right-4 p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>

              <div>
                <h3 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest">
                  📢 {lang === "pt" ? "Compartilhar Banda" : lang === "es" ? "Compartir Banda" : "Share Band"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  {lang === "pt" 
                    ? "Veja o texto gerado e escolha como deseja compartilhar:" 
                    : lang === "es"
                    ? "Vea el texto generado y elija cómo desea compartir:"
                    : "Review the generated text and choose how you want to share:"}
                </p>
              </div>

              {/* Text Preview Area */}
              <div className="bg-neutral-950 border border-neutral-850 rounded-lg p-3.5 max-h-[40vh] overflow-y-auto font-mono text-[11px] whitespace-pre-wrap select-text leading-relaxed text-zinc-300">
                {shareText}
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                    copiedText 
                      ? "bg-emerald-900 text-emerald-100 border border-emerald-700" 
                      : "bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border border-neutral-800"
                  }`}
                >
                  📋 {copiedText 
                    ? (lang === "pt" ? "Copiado!" : lang === "es" ? "¡Copiado!" : "Copied!") 
                    : (lang === "pt" ? "Copiar Texto" : lang === "es" ? "Copiar Texto" : "Copy Text")}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/40 rounded-lg text-xs font-mono font-bold transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  💬 {lang === "pt" ? "WhatsApp" : "WhatsApp"}
                </a>

                <a
                  href={emailUrl}
                  className="px-4 py-2 bg-blue-950/40 hover:bg-blue-900/40 text-blue-400 border border-blue-900/40 rounded-lg text-xs font-mono font-bold transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-center"
                >
                  ✉️ {lang === "pt" ? "Enviar por E-mail" : lang === "es" ? "Enviar por Correo" : "Send Email"}
                </a>

                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="px-4 py-2 bg-purple-950/40 hover:bg-purple-900/40 text-purple-400 border border-purple-900/40 rounded-lg text-xs font-mono font-bold transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    📱 {lang === "pt" ? "Sistema / Outros" : lang === "es" ? "Sistema / Otros" : "System Share"}
                  </button>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-850">
                <button
                  onClick={() => setSharingBand(null)}
                  className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                >
                  {lang === "pt" ? "Fechar" : lang === "es" ? "Cerrar" : "Close"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* QR CODE GENERATOR MODAL OVERLAY */}
      {qrBand && (() => {
        const qrValue = (() => {
          let text = `🎵 ${qrBand.name} 🎵\n`;
          text += `⚡ Genre: ${qrBand.genre}\n`;
          text += `🌍 Country: ${qrBand.country}\n`;
          if (qrBand.formationYear) {
            text += `📅 Formed: ${qrBand.formationYear}\n`;
          }
          if (qrBand.socials?.website) {
            text += `🔗 Web: ${qrBand.socials.website}\n`;
          }
          if (qrBand.socials?.instagram) {
            text += `📸 IG: ${qrBand.socials.instagram}\n`;
          }
          return text;
        })();

        return (
          <div id="band-qr-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-neutral-900 border border-neutral-850 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 font-sans text-neutral-200 text-center">
              <button
                onClick={() => setQrBand(null)}
                className="absolute top-4 right-4 p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>

              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest">
                  📱 {lang === "pt" ? "Compartilhar via QR Code" : lang === "es" ? "Compartir vía QR Code" : "Scan to Share"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  {qrBand.name}
                </p>
              </div>

              {/* QR Container with pristine high-contrast padding */}
              <div className="flex justify-center items-center py-4">
                <div className="p-4 bg-white rounded-xl shadow-inner border border-neutral-200">
                  <QRCodeSVG 
                    value={qrValue} 
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-850 text-left whitespace-pre-wrap select-all">
                {qrValue}
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setQrBand(null)}
                  className="px-6 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                >
                  {lang === "pt" ? "Fechar" : lang === "es" ? "Cerrar" : "Close"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
