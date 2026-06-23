import React, { useState } from "react";
import { Band, BandMember, DiscographyItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { 
  Sparkles, Globe, Calendar, Music, UserCheck, Disc, Mail, Phone, 
  MapPin, Plus, Trash2, Edit2, CheckCircle, Clock, ExternalLink, X, Youtube
} from "lucide-react";

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

// BandLogo to render official band art/photos with a styled fallback badge
const BandLogo: React.FC<{ name: string; url: string; className?: string }> = ({ name, url, className = "w-12 h-12" }) => {
  const [failed, setFailed] = useState(false);
  
  const initials = name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (failed || !url) {
    return (
      <div className={`${className} rounded bg-gradient-to-b from-stone-900 to-black border border-red-900/40 flex flex-col items-center justify-center text-center shadow font-mono text-[11px] font-extrabold uppercase tracking-widest text-[#f52a2a] shrink-0 grow-0`}>
        <span className="text-[14px]">🔥</span>
        <span className="text-[8px] text-zinc-400 mt-0.5">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className={`${className} rounded object-cover border border-neutral-700/60 shadow shrink-0 grow-0`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
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
}

export const BandSection: React.FC<BandSectionProps> = ({
  bands,
  user,
  lang,
  onAddBand,
  onDeleteBand,
  onEditBand,
  isRefreshing,
  globalSearch
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";
  const isLogged = !!user;

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedGenre, setAppliedGenre] = useState("");
  const [appliedCountry, setAppliedCountry] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [expandedBandId, setExpandedBandId] = useState<string | null>(null);

  // Gemini Natural Language AI Search States
  const [geminiQuery, setGeminiQuery] = useState("");
  const [matchedIds, setMatchedIds] = useState<string[] | null>(null);
  const [geminiSearching, setGeminiSearching] = useState(false);
  const [geminiError, setGeminiError] = useState("");

  // Form State
  const [formName, setFormName] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [formCountry, setFormCountry] = useState("");
  const [formYear, setFormYear] = useState(2000);
  const [formBio, setFormBio] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formMembersText, setFormMembersText] = useState("");
  const [formDiscographyText, setFormDiscographyText] = useState("");
  const [formInstagram, setFormInstagram] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Taste-based Discovery States
  const [showDiscoverPanel, setShowDiscoverPanel] = useState(false);
  const [discoverGenres, setDiscoverGenres] = useState<string[]>([]);
  const [discoverInfo, setDiscoverInfo] = useState("");
  const [discoverResults, setDiscoverResults] = useState<any[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverError, setDiscoverError] = useState("");

  // Detailed Modals for Clickable Members and Albums
  const [activeDetailType, setActiveDetailType] = useState<"member" | "album" | null>(null);
  const [activeDetailBandName, setActiveDetailBandName] = useState("");
  const [activeDetailTargetName, setActiveDetailTargetName] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailError, setDetailError] = useState("");

  const handleDiscoverSuggest = async () => {
    setDiscoverLoading(true);
    setDiscoverError("");
    setDiscoverResults([]);
    try {
      const response = await fetch("/api/bands/ai-discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          genres: discoverGenres,
          info: discoverInfo,
          lang
        })
      });
      if (!response.ok) {
        throw new Error(lang === "pt" ? "Erro ao obter recomendações. Verifique a chave de API." : "Failed to obtain recommendations. Verify API key configuration.");
      }
      const data = await response.json();
      if (data && data.recommendations) {
        setDiscoverResults(data.recommendations);
      } else {
        throw new Error("No recommendations returned.");
      }
    } catch (err: any) {
      setDiscoverError(err.message || "Error");
    } finally {
      setDiscoverLoading(false);
    }
  };

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
      setDetailError(err.message || "Failed to load info");
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleDiscoverGenre = (genreStr: string) => {
    if (discoverGenres.includes(genreStr)) {
      setDiscoverGenres(discoverGenres.filter(g => g !== genreStr));
    } else {
      setDiscoverGenres([...discoverGenres, genreStr]);
    }
  };

  // Get distinct genres and countries for filters
  const allGenres = Array.from(new Set(bands.map(b => b.genre.toLowerCase()).filter(Boolean)));
  
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

  // Filter bands with deferred global search and local search
  const filteredBands = bands.filter(band => {
    const activeSearch = (globalSearch || appliedSearch || "").trim().toLowerCase();
    
    const bName = (band.name || "").toLowerCase();
    const bGenre = (band.genre || "").toLowerCase();
    let bBio = "";
    if (band.bio) {
      if (typeof band.bio === "string") {
        bBio = band.bio.toLowerCase();
      } else if (typeof band.bio === "object") {
        bBio = ((band.bio[lang] || band.bio["en"] || band.bio["es"] || "") as string).toLowerCase();
      }
    }

    // When the Gemini smart advanced filter is active (matchedIds is not null),
    // we bypass other manual search inputs to prevent conflict.
    const matchesSearch = matchedIds !== null || !activeSearch ||
      bName.includes(activeSearch) || 
      bGenre.includes(activeSearch) || 
      bBio.includes(activeSearch);
    
    const matchesGenre = matchedIds !== null || !appliedGenre || bGenre === appliedGenre.toLowerCase();
    const matchesCountry = matchedIds !== null || !appliedCountry || (band.country || "").toLowerCase() === appliedCountry.toLowerCase();
    
    // Gemini Natural Language matched IDs validation
    const matchesGeminiMatched = matchedIds === null || (!!band.id && matchedIds.includes(band.id));

    // Non-approved are only shown to Admin, or the user who submitted them
    const isApproved = !!band.approved;
    const isSubmittedByMe = !!(user && band.submittedBy === user.uid);
    const canSee = isApproved || isSubmittedByMe || isAdmin;

    return matchesSearch && matchesGenre && matchesCountry && matchesGeminiMatched && canSee;
  });

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
          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&q=80"
        ];
        const randomImg = DEFAULT_METAL_IMAGES[Math.floor(Math.random() * DEFAULT_METAL_IMAGES.length)];
        setFormLogoUrl(randomImg);
      }
      
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
    setAppliedGenre(selectedGenre);
    setAppliedCountry(selectedCountry);
    setHasSearched(true);
    // Clear Gemini search to avoid conflicting active states
    setMatchedIds(null);
  };

  const handleClearManualSearch = () => {
    setSearch("");
    setSelectedGenre("");
    setSelectedCountry("");
    setAppliedSearch("");
    setAppliedGenre("");
    setAppliedCountry("");
    setHasSearched(false);
  };

  // Submit Band Form
  const handleSubmitBand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName || !formGenre) {
      setFormError(lang === "pt" ? "Nome e subgêneros são obrigatórios!" : "Name and subgenre are required!");
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
      setFormMembersText("");
      setFormDiscographyText("");
      setFormInstagram("");
      setFormWebsite("");
      setFormEmail("");
      setFormPhone("");
      setShowSubmitForm(false);
    }
  };

  return (
    <div id="band-section-wrapper" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
            <Music className="text-red-600" />
            {t.navBands}
          </h2>
          <p className="text-xs text-neutral-400">
            {lang === "pt" 
              ? "Catálogo mundial com classificação ultra específica e detalhada." 
              : "Global metal archive categorized by extreme specific subgenres."}
          </p>
        </div>

        {isLogged && (
          <button
            id="btn-trigger-add-band"
            onClick={() => {
              setShowSubmitForm(!showSubmitForm);
              setFormError("");
            }}
            className="px-4 py-2 bg-red-950 border border-red-800/40 hover:bg-red-900 text-white rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center gap-2"
          >
            <Plus size={14} />
            {t.submitBandBtn}
          </button>
        )}
      </div>

      {/* Suggestion Notification if guest */}
      {!isLogged && (
        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-400 font-mono">
          🤘 {lang === "pt" 
            ? "Quer propor uma nova banda para o catálogo? Faça login acima para cadastrar!" 
            : "Want to submit a metal band to this database? Log in above to unlock submissions!"}
        </div>
      )}

      {/* ADD/SUBMIT BAND FORM CONTAINER */}
      {showSubmitForm && isLogged && (
        <form onSubmit={handleSubmitBand} className="bg-neutral-900 border border-red-950 p-6 rounded-xl space-y-4 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-900/10 rounded-full filter blur-xl"></div>
          
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
            <h3 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} />
              {t.submitBandTitle}
            </h3>
            <span className="text-[10px] text-neutral-500 font-mono">
              {isAdmin 
                ? (lang === "pt" ? "Aprovação Automática (Admin)" : "Auto Approve (Admin)")
                : t.pendingText}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.bandNameField} *</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Sepultura"
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={handleAIFill}
                  disabled={aiLoading}
                  title={t.aiCompleteBtn}
                  className="px-2.5 bg-red-900 hover:bg-red-800 text-white rounded text-xs transition duration-200 flex items-center justify-center"
                >
                  {aiLoading ? "⌛" : <Sparkles size={14} className="animate-pulse" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.bandGenreField} *</label>
              <input
                type="text"
                value={formGenre}
                onChange={(e) => setFormGenre(e.target.value)}
                placeholder="Ex: Melodic Death Metal"
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.bandCountryField}</label>
              <input
                type="text"
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                placeholder="Ex: Brazil"
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.formationYear}</label>
              <input
                type="number"
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.bandLogoField}</label>
              <input
                type="url"
                value={formLogoUrl}
                onChange={(e) => setFormLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.bandBioField}</label>
            <textarea
              rows={3}
              value={formBio}
              onChange={(e) => setFormBio(e.target.value)}
              placeholder="A brief history of their legacy..."
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.members}</label>
              <textarea
                rows={3}
                value={formMembersText}
                onChange={(e) => setFormMembersText(e.target.value)}
                placeholder={t.bandMembersPlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-400 font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">{t.discography}</label>
              <textarea
                rows={3}
                value={formDiscographyText}
                onChange={(e) => setFormDiscographyText(e.target.value)}
                placeholder={t.bandDiscographyPlaceholder}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-400 font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="border-t border-neutral-850 pt-3">
            <h4 className="text-[11px] font-mono font-bold text-amber-500 uppercase mb-2">
              🔗 Socials & Global Booking Contacts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Instagram: @band_handle"
                value={formInstagram}
                onChange={(e) => setFormInstagram(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-2.5 py-1.5 rounded font-mono"
              />
              <input
                type="url"
                placeholder="Official Website URL"
                value={formWebsite}
                onChange={(e) => setFormWebsite(e.target.value)}
                className="bg-neutral-950 border border-neutral-850 text-xs text-neutral-200 px-2.5 py-1.5 rounded font-mono"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <input
                type="email"
                placeholder="Booking Email: booking@band.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-2.5 py-1.5 rounded font-mono"
              />
              <input
                type="text"
                placeholder="Booking Line: +1 555-..."
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-2.5 py-1.5 rounded font-mono"
              />
            </div>
          </div>

          {formError && <p className="text-xs text-red-500 font-mono">⚠️ {formError}</p>}
          {aiLoading && <p className="text-xs text-red-400 font-mono animate-pulse">⚡ {t.aiCompleting}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSubmitForm(false)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-900 hover:bg-red-800 text-white text-xs font-mono font-bold rounded shadow-lg"
            >
              🚀 {isAdmin ? (lang === "pt" ? "Publicar Agora" : "Publish Now") : t.saveBtn}
            </button>
          </div>
        </form>
      )}

      {/* FILTER CONTROLS GRID */}
      <form onSubmit={handleManualSearch} className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🔍 Palavra-Chave / Nome" : "🔍 Keyword / Name"}
            </label>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-200 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🎸 Gênero de Metal" : "🎸 Metal Genre"}
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-400 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-red-600"
            >
              <option value="">{t.allGenres}</option>
              {allGenres.map(g => (
                <option key={g} value={g} className="bg-neutral-950 text-neutral-200 capitalize">{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1 font-semibold">
              {lang === "pt" ? "🌍 País de Origem" : "🌍 Country of Origin"}
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-805 text-xs text-neutral-400 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-red-600"
            >
              <option value="">{lang === "pt" ? "Todos os Países" : t.allCountries}</option>
              {allCountries.map(c => (
                <option key={c} value={c} className="bg-neutral-950 text-neutral-200">{c}</option>
              ))}
            </select>
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
                {filteredBands.map(b => (
                  <div key={b.id} className="flex items-center justify-between gap-2.5 p-2 bg-neutral-900/55 border border-neutral-800/65 rounded-md hover:border-red-950/40 transition">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-xs text-red-500 shrink-0">🎸</span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white font-mono truncate">{b.name}</p>
                        <p className="text-[9px] text-zinc-500 font-mono capitalize truncate">{b.genre} • {b.country}</p>
                      </div>
                    </div>
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
                      className="text-[9px] uppercase font-bold tracking-wider text-red-400 hover:text-red-350 font-mono px-2 py-1 bg-neutral-950 hover:bg-neutral-900 rounded border border-neutral-800 shrink-0 transition cursor-pointer"
                    >
                      {lang === "pt" ? "Ver Detalhes" : "View Details"}
                    </button>
                  </div>
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

      {/* TASTE-BASED INTERACTIVE DISCOVERY PANEL */}
      <div id="ai-discovery-container" className="bg-gradient-to-br from-neutral-900 via-zinc-950 to-neutral-950 border border-red-950/45 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-44 h-44 bg-red-800/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        {/* Banner Button */}
        <button
          onClick={() => {
            setShowDiscoverPanel(!showDiscoverPanel);
            setDiscoverError("");
          }}
          className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900/80 transition duration-200 text-left group cursor-pointer border-b border-neutral-900"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">👉</span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono group-hover:text-red-500 transition flex items-center gap-2">
                {lang === "pt" ? "Descobrir Novas Bandas de Metal" : "Discover New Metal Bands"}
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                {lang === "pt" 
                  ? "Análise de gosto musical e sugestões automáticas personalizadas usando IA." 
                  : "Music flavor profiling and automated custom suggestions guided by AI."}
              </p>
            </div>
          </div>
          <span className="text-sm text-neutral-500 group-hover:text-red-500 transition font-mono pr-2">
            {showDiscoverPanel ? "▲" : "▼"}
          </span>
        </button>

        {showDiscoverPanel && (
          <div className="p-5 space-y-4">
            {/* Step 1: Subgenres preference list */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                1. {lang === "pt" ? "Selecione subgêneros de preferência" : "Select preferred subgenres"}:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["death metal", "black metal", "doom metal", "thrash metal", "progressive metal", "gothic metal", "groove metal"].map(gen => {
                  const active = discoverGenres.includes(gen);
                  return (
                    <button
                      key={gen}
                      onClick={() => toggleDiscoverGenre(gen)}
                      className={`text-[10px] font-mono capitalize px-3 py-1.5 rounded-lg border transition cursor-pointer select-none ${
                        active 
                          ? "bg-red-950/80 border-red-500/70 text-white font-bold" 
                          : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:border-neutral-800"
                      }`}
                    >
                      {gen}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Custom contextual details prompt input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                2. {lang === "pt" ? "Escreva sobre o seu gosto musical ou bandas favoritas" : "Write about your music tastes or favorite bands"}:
              </label>
              <textarea
                value={discoverInfo}
                onChange={(e) => setDiscoverInfo(e.target.value)}
                rows={2}
                placeholder={
                  lang === "pt" 
                    ? "Ex: 'Eu adoro os vocais limpos de Opeth, guitarras arrastadas de Candlemass e riffs clássicos de Iron Maiden. Sem vocais excessivos.'" 
                    : "e.g. 'I love atmospheric synths of Emperor, acoustic blends of Agalloch, and energetic drums. Preferred clean clean vocal variations.'"
                }
                className="w-full bg-neutral-950 border border-neutral-850 p-3 rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition"
              />
            </div>

            {/* Discover Trigger Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDiscoverSuggest}
                disabled={discoverLoading}
                className="px-5 py-2.5 bg-red-950 border border-red-800/60 hover:bg-red-900 disabled:bg-neutral-900 disabled:border-neutral-850 disabled:text-neutral-600 text-white rounded-xl text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg shadow-red-950/10 cursor-pointer"
              >
                {discoverLoading ? (
                  <>
                    <span className="w-3 h-3 rounded-full border border-zinc-500 border-t-white animate-spin"></span>
                    {lang === "pt" ? "Analisando Gosto..." : "Profiling Music Flavor..."}
                  </>
                ) : (
                  <>
                    <span>🤘</span>
                    {lang === "pt" ? "Disparar Sugestões Automáticas" : "Trigger Automatic Suggestions"}
                  </>
                )}
              </button>
            </div>

            {/* Error notifications */}
            {discoverError && (
              <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-mono rounded">
                ⚠️ {discoverError}
              </div>
            )}

            {/* Recommendations Output Grid */}
            {discoverResults.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-900">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 block">
                  🔥 {lang === "pt" ? "Recomendações Geradas Pela Análise" : "Recommendations Generated By Analysis"}:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discoverResults.map((rec, idx) => {
                    return (
                      <div key={idx} className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 space-y-3 shadow-inner flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                                ⚡ {rec.name}
                              </h4>
                              <p className="text-[10px] text-red-500 font-mono tracking-wide uppercase mt-0.5 font-bold">
                                {rec.genre}
                              </p>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded">
                              {rec.country} ({rec.formationYear})
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-400 font-sans mt-2.5 leading-relaxed">
                            {rec.bio}
                          </p>

                          {rec.subgenres && rec.subgenres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {rec.subgenres.map((sg: string, i: number) => (
                                <span key={i} className="text-[8px] font-mono text-zinc-500 border border-neutral-900 px-1.5 py-0.5 rounded bg-zinc-950">
                                  #{sg}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions for recommendations */}
                        <div className="pt-3 border-t border-neutral-900/50 flex items-center justify-between gap-2 mt-2">
                          <button
                            onClick={() => handleFetchDetails("member", rec.name, rec.members?.[0]?.name || "Vocalist")}
                            className="text-[10px] text-zinc-400 hover:text-white font-mono underline cursor-pointer"
                          >
                            {lang === "pt" ? "Ver Integrante" : "Inspect Member"}
                          </button>
                          
                          {isLogged ? (
                            <button
                              onClick={() => {
                                // transform recommendation schema to scheme for onAddBand
                                const membersArray: BandMember[] = (rec.members || []).map((m: any) => ({
                                  name: m.name,
                                  role: m.role || "Musician",
                                  status: m.status || "active"
                                }));
                                
                                const discographyArray: DiscographyItem[] = (rec.discography || []).map((d: any) => ({
                                  title: d.title,
                                  year: parseInt(d.year) || 2020,
                                  type: d.type || "Album"
                                }));

                                const newBand: Omit<Band, "id"> = {
                                  name: rec.name,
                                  genre: rec.genre || "heavy metal",
                                  country: rec.country || "Unknown",
                                  formationYear: parseInt(rec.formationYear) || 2000,
                                  bio: {
                                    pt: rec.bio,
                                    en: rec.bio,
                                    es: rec.bio
                                  },
                                  logoUrl: rec.logoUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
                                  members: membersArray,
                                  discography: discographyArray,
                                  approved: isAdmin, // admins approve automatically, guests submit for review
                                  submittedBy: user?.uid || "guest",
                                  socials: {
                                    website: rec.social_links?.website || "não encontrado",
                                    instagram: rec.social_links?.instagram || "não encontrado",
                                    spotify: rec.social_links?.spotify || "não encontrado",
                                    youtube: rec.social_links?.youtube || "não encontrado"
                                  },
                                  contacts: {
                                    email: rec.contacts?.email || "não encontrado",
                                    phone: rec.contacts?.phone || "não encontrado"
                                  }
                                };

                                onAddBand(newBand);
                                // remove from suggested panel state
                                setDiscoverResults(prev => prev.filter(p => p.name !== rec.name));
                              }}
                              className="px-2.5 py-1 bg-neutral-900 border border-red-950 hover:bg-red-950/15 text-[10px] font-mono font-bold text-red-400 hover:text-red-300 rounded cursor-pointer leading-tight"
                            >
                              ➕ {lang === "pt" ? "Trazer ao Catálogo" : "Import to Catalog"}
                            </button>
                          ) : (
                            <span className="text-[9px] text-zinc-650 font-mono italic">
                              {lang === "pt" ? "(Login p/ importar)" : "(Login to import)"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GEMINI CHAT/NATURAL LANGUAGE ADVANCED SEARCH BAR */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/80 rounded-xl p-4 space-y-3.5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-2 border-b border-neutral-850 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="text-red-500 animate-pulse" size={16} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200">
              {lang === "pt" ? "Filtro Avançado Inteligente" : lang === "es" ? "Filtro Avanzado Inteligente" : "Advanced Smart Filter"}
            </span>
          </div>
        </div>

        <form onSubmit={handleGeminiSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={geminiQuery}
              onChange={(e) => setGeminiQuery(e.target.value)}
              placeholder={
                lang === "pt"
                  ? "Ex: 'bandas de death metal formadas na Suécia nos anos 90'"
                  : lang === "es"
                  ? "Ej: 'bandas de thrash metal formadas en Brasil en los 80'"
                  : "e.g., 'death metal bands formed in Sweden in the 90s' or 'brazilian acts'"
              }
              className="w-full bg-neutral-950 border border-neutral-850 text-xs text-neutral-200 pl-3 pr-10 py-2.5 rounded-lg font-mono focus:outline-none focus:border-red-600 transition duration-200"
            />
            {geminiQuery && (
              <button
                type="button"
                onClick={handleClearGeminiSearch}
                className="absolute right-2.5 top-2 py-0.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono font-extrabold"
                title="Limpar filtros"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={geminiSearching || !geminiQuery.trim()}
            className="px-5 py-2.5 bg-red-950 hover:bg-red-900 text-white border border-red-900/40 hover:border-red-600 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-1.5 shadow-xl cursor-pointer"
          >
            {geminiSearching ? (
              <>
                <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <span>{lang === "pt" ? "Analisando..." : "Analyzing..."}</span>
              </>
            ) : (
              <>
                <Sparkles size={13} />
                <span>{lang === "pt" ? "Consultar" : "Query"}</span>
              </>
            )}
          </button>
        </form>

        {geminiError && (
          <p className="text-[10px] text-red-500 font-mono bg-red-950/20 p-2 rounded border border-red-950/60 mt-1">
            ⚠️ {geminiError}
          </p>
        )}

        {/* Suggestion tags for easy clicks */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider font-semibold">
            {lang === "pt" ? "Sugestões de busca:" : "Query ideas:"}
          </span>
          {[
            lang === "pt" ? "bandas suecas anos 90" : "swedish bands 90s",
            lang === "pt" ? "bandas brasileiras thrash metal" : "brazilian thrash bands",
            lang === "pt" ? "formadas nos anos 80" : "formed in the 80s"
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setGeminiQuery(suggestion);
              }}
              className="text-[9px] bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white font-mono px-2 py-1 rounded border border-neutral-850/80 transition cursor-pointer"
            >
              "{suggestion}"
            </button>
          ))}
        </div>

        {/* Filters Active Badge */}
        {/* Filters Active Badge and Results list */}
        {matchedIds !== null && (() => {
          const matchedBandsList = bands.filter(b => b.id && matchedIds.includes(b.id));
          return (
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between gap-2 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg select-none">
                <div className="flex items-center gap-2 text-[10.5px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    {lang === "pt" 
                      ? `Filtro IA Ativo: Encontradas ${matchedBandsList.length} bandas correspondentes.` 
                      : lang === "es"
                      ? `Filtro IA Activo: Encontradas ${matchedBandsList.length} bandas correspondientes.`
                      : `AI Filter Active: ${matchedBandsList.length} matching bands found.`
                    }
                  </span>
                </div>
                <button
                  onClick={handleClearGeminiSearch}
                  className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 hover:text-emerald-300 font-mono bg-emerald-950 px-2.5 py-1 rounded border border-emerald-900/60 transition cursor-pointer"
                >
                  {lang === "pt" ? "Resetar Filtro" : "Reset Filter"}
                </button>
              </div>

              {matchedBandsList.length > 0 && (
                <div className="bg-neutral-950/70 border border-neutral-850 p-3 rounded-lg space-y-2">
                  <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-semibold">
                    {lang === "pt" ? "Resultados Filtrados:" : lang === "es" ? "Resultados Filtrados:" : "Filtered Results:"}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {matchedBandsList.map(b => (
                      <div key={b.id} className="flex items-center justify-between gap-2.5 p-2 bg-neutral-900/55 border border-neutral-800/65 rounded-md hover:border-red-950/40 transition">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-xs text-red-500 shrink-0">⚡</span>
                          <div className="truncate">
                            <p className="text-xs font-bold text-white font-mono truncate">{b.name}</p>
                            <p className="text-[9px] text-zinc-500 font-mono capitalize truncate">{b.genre} • {b.country}</p>
                          </div>
                        </div>
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
                          className="text-[9px] uppercase font-bold tracking-wider text-red-400 hover:text-red-350 font-mono px-2 py-1 bg-neutral-950 hover:bg-neutral-900 rounded border border-neutral-800 shrink-0 transition cursor-pointer"
                        >
                          {lang === "pt" ? "Ver" : "View"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* BAND CARDS DISPLAY */}
      {filteredBands.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
          <p className="text-sm text-neutral-500 font-mono">{t.noBandsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBands.map(band => {
            const isExpanded = expandedBandId === band.id;
            const bioText = typeof band.bio === "string" ? band.bio : (band.bio[lang] || band.bio["en"] || "");

            return (
              <div
                key={band.id}
                id={`band-card-${band.id}`}
                className="bg-neutral-900/90 hover:bg-neutral-900 text-neutral-200 p-5 rounded-xl border border-neutral-800/80 hover:border-red-950/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3">
                      <BandLogo name={band.name} url={band.logoUrl || ""} className="w-12 h-12" />
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition font-mono flex items-center gap-2">
                          {band.name}
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
                    </div>

                    <div className="flex gap-1.5 shrink-0">
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
                  <p className="text-xs text-stone-400 leading-relaxed font-sans line-clamp-3 mb-3">
                    {bioText || "No band biography registered yet in this language."}
                  </p>
                </div>

                {/* EXPANDED DETAILED AREA */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-4">
                    {/* Expanded Cover Band Banner */}
                    <div className="w-full h-36 rounded-lg overflow-hidden relative border border-neutral-800/60 bg-neutral-950 flex shadow-inner transition group-hover:border-red-900/40">
                      <BandLogo name={band.name} url={band.logoUrl || ""} className="w-full h-full brightness-[0.35]" />
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

                    {/* Official Website & YouTube Links */}
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
                    </div>
                  </div>
                )}

                <button
                  id={`btn-toggle-expand-band-${band.id}`}
                  onClick={() => setExpandedBandId(isExpanded ? null : (band.id || null))}
                  className="w-full mt-4 bg-neutral-950 hover:bg-neutral-850 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition text-neutral-300 border border-neutral-800/80 flex items-center justify-center gap-1"
                >
                  {isExpanded 
                    ? (lang === "pt" ? "▲ Recolher Detalhes" : "▲ Collapse Details")
                    : (lang === "pt" ? "▼ Mostrar Discografia" : "▼ Show Discography")
                  }
                </button>
              </div>
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
                </div>

                <div className="border-t border-neutral-800/80 pt-3.5 space-y-4">
                  {activeDetailType === "member" ? (
                    <>
                      {/* Birth Info */}
                      <div className="grid grid-cols-1 select-text">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{lang === "pt" ? "Origem / Nascimento" : "Birth / Origin"}</span>
                        <p className="text-xs text-neutral-300 font-mono mt-0.5">{detailData.birthInfo || "Não encontrado"}</p>
                      </div>

                      {/* Instruments tags */}
                      {detailData.instruments && detailData.instruments.length > 0 && (
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
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Papel & Atuação" : "Historical Role & Style"}</span>
                        <p className="text-xs text-neutral-300 leading-relaxed mt-1 bg-neutral-950/40 p-3 border border-neutral-850 rounded font-sans whitespace-pre-line select-text">
                          {detailData.contributions}
                        </p>
                      </div>

                      {/* Other Bands */}
                      {detailData.otherBands && detailData.otherBands.length > 0 && (
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
                      {detailData.trivia && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Fatos Notáveis & Curiosidades" : "Gear & Trivia"}</span>
                          <p className="text-xs text-zinc-400 mt-1 italic font-sans pl-2.5 border-l-2 border-amber-600/50 select-text">
                            {detailData.trivia}
                          </p>
                        </div>
                      )}

                      {/* Legacy summary */}
                      {detailData.summary && (
                        <div className="bg-amber-950/10 p-3 border border-amber-900/25 rounded font-sans text-xs text-zinc-300 relative overflow-hidden">
                          <span className="text-base absolute right-2 bottom-1 text-amber-950 select-none">★</span>
                          🌟 {detailData.summary}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Release Info */}
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Lançamento Oficial" : "Official Release Date"}</span>
                        <p className="text-xs text-neutral-300 font-mono mt-0.5">{detailData.releaseInfo || "Não encontrado"}</p>
                      </div>

                      {/* Subgenres / themes */}
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Estilo & Temas Líricos" : "Style & Lyrical Themes"}</span>
                        <p className="text-xs text-neutral-300 mt-0.5 capitalize">{detailData.genre || "Não encontrado"}</p>
                      </div>

                      {/* Tracklist inside list container */}
                      {detailData.tracklist && detailData.tracklist.length > 0 && (
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
                      {detailData.anecdote && (
                        <div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase block tracking-wider">{lang === "pt" ? "Backstory de Produção & Curiosidades" : "Recording Backstory & Trivia"}</span>
                          <p className="text-xs text-stone-400 leading-relaxed mt-1 bg-neutral-950/40 p-3 border border-neutral-850 rounded font-sans select-text">
                            {detailData.anecdote}
                          </p>
                        </div>
                      )}

                      {/* Impact / reception */}
                      {detailData.reception && (
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
    </div>
  );
};
