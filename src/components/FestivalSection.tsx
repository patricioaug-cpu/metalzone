import React, { useState, useEffect } from "react";
import { EventItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { getProxiedImageUrl } from "../utils/imageProxy";
import { 
  Calendar, MapPin, Tag, Plus, CheckCircle, ExternalLink, Flame, 
  Hourglass, Ticket, Star, ThumbsUp, Filter, Heart, Share2, X, QrCode
} from "lucide-react";
import { EventSkeletonList } from "./SkeletonLoader";
import { QRCodeSVG } from "qrcode.react";

interface FestivalSectionProps {
  events: EventItem[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onAddEvent: (event: Omit<EventItem, "id">) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<void>;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialFilterTab?: "festivals" | "shows";
  isLoading?: boolean;
}

// Robust image renderer with error boundaries and customized styled fallbacks
const FestivalImage: React.FC<{ url?: string; name: string; isFestival: boolean }> = ({ url, name, isFestival }) => {
  const [failed, setFailed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!url) {
      setFailed(true);
      setChecking(false);
      return;
    }

    // Validate URL structure before trying to fetch
    const cleanUrl = url.trim();
    const isUrlWellFormed = cleanUrl.startsWith("http://") || 
                            cleanUrl.startsWith("https://") || 
                            cleanUrl.startsWith("/") || 
                            cleanUrl.startsWith("data:");
                            
    if (!isUrlWellFormed) {
      setFailed(true);
      setChecking(false);
      return;
    }

    setChecking(true);
    setFailed(false);

    // Pre-verify image validity before attempting to render
    const img = new Image();
    img.src = getProxiedImageUrl(cleanUrl, 600);
    img.onload = () => {
      setFailed(false);
      setChecking(false);
    };
    img.onerror = () => {
      setFailed(true);
      setChecking(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  if (checking) {
    return (
      <div className="w-full h-32 bg-neutral-900 rounded-lg mb-3 border border-neutral-800 flex items-center justify-center animate-pulse">
        <Flame className="w-6 h-6 text-neutral-700 animate-bounce" />
      </div>
    );
  }

  if (failed || !url) {
    return (
      <div className="w-full h-32 relative bg-neutral-950 rounded-lg mb-3 border border-red-900/30 overflow-hidden flex flex-col items-center justify-center shadow-lg group-hover:border-rose-800/40 transition-colors duration-300">
        {/* Decorative background light effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Subtle decorative grid/stripes on the background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#fff_12.5%,transparent_12.5%,transparent_50%,#fff_50%,#fff_62.5%,transparent_62.5%,transparent_100%)] bg-[length:10px_10px] pointer-events-none" />

        {/* Central festival/show name display */}
        <div className="flex flex-col items-center justify-center z-10 px-4 text-center max-w-full">
          <p className="text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-zinc-100 line-clamp-3">
            {name}
          </p>
        </div>

        {/* Ticket-like punch card layout details */}
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[8px] font-mono tracking-widest text-zinc-500 uppercase pointer-events-none">
          <span>{isFestival ? "🎪 FESTIVAL STAGE" : "🎸 LIVE CONCERT"}</span>
          <span className="text-rose-500/40">● PASS</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={getProxiedImageUrl(url, 600)}
      alt={name}
      referrerPolicy="no-referrer"
      className="w-full h-32 object-cover rounded-lg mb-3 border border-neutral-800 group-hover:border-neutral-700 transition-all duration-300"
      onError={() => setFailed(true)}
    />
  );
};

// Separate component for live countdown calculation to prevent global re-renders
const FestivalCountdown: React.FC<{ targetDate: string; lang: "pt" | "en" | "es" }> = ({ targetDate, lang }) => {
  const t = translations[lang];
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, expired: true }));
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.expired) {
    return (
      <span className="text-[11px] font-mono uppercase bg-red-950 px-2 py-0.5 rounded text-red-400 font-bold tracking-widest block text-center mt-2 border border-red-800/30">
        🤘 {lang === "pt" ? "PORTÕES ABERTOS" : "GATES OPENED"}
      </span>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-4 gap-1.5 text-center font-mono p-2 bg-neutral-950/80 rounded-lg border border-neutral-850">
      <div className="bg-neutral-900 border border-neutral-800 p-1 rounded">
        <span className="text-sm font-black text-rose-500 block leading-none">{timeLeft.days}</span>
        <span className="text-[8px] text-neutral-500 uppercase">{t.days}</span>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 p-1 rounded">
        <span className="text-sm font-black text-amber-500 block leading-none">{timeLeft.hours}</span>
        <span className="text-[8px] text-neutral-500 uppercase">{t.hours}</span>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 p-1 rounded">
        <span className="text-sm font-black text-amber-500 block leading-none">{timeLeft.minutes}</span>
        <span className="text-[8px] text-neutral-500 uppercase">{t.minutes}</span>
      </div>
      <div className="bg-neutral-900 border border-neutral-800 p-1 rounded animate-pulse">
        <span className="text-sm font-black text-amber-400 block leading-none">{timeLeft.seconds}</span>
        <span className="text-[8px] text-neutral-500 uppercase">{t.seconds}</span>
      </div>
    </div>
  );
};

export const FestivalSection: React.FC<FestivalSectionProps> = ({
  events,
  user,
  lang,
  onAddEvent,
  onDeleteEvent,
  favorites,
  onToggleFavorite,
  initialFilterTab,
  isLoading
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";
  const isLogged = true;

  const [activeFilterTab, setActiveFilterTab] = useState<"festivals" | "shows">(initialFilterTab || "festivals");
  const [sharingEvent, setSharingEvent] = useState<EventItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [qrEvent, setQrEvent] = useState<EventItem | null>(null);
  
  useEffect(() => {
    if (initialFilterTab) {
      setActiveFilterTab(initialFilterTab);
    }
  }, [initialFilterTab]);

  // Geolocation & local search states
  const [geoCity, setGeoCity] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [geoResult, setGeoResult] = useState<{
    locationDetected: string;
    localBands: any[];
    localEvents: any[];
  } | null>(null);

  const handleGeoSearch = async (useCoords: boolean) => {
    setGeoLoading(true);
    setGeoError("");
    setGeoResult(null);

    const performSearch = async (lat?: number, lon?: number, fallbackCity?: string) => {
      try {
        const queryCity = fallbackCity || geoCity.trim();
        const res = await fetch("/api/events/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat,
            lon,
            city: queryCity,
            lang
          })
        });
        if (!res.ok) throw new Error("Server error searching regional gigs.");
        const data = await res.json();
        setGeoResult(data);
      } catch (err: any) {
        setGeoError(err.message || "Failed to locate regional bands or concerts.");
      } finally {
        setGeoLoading(false);
      }
    };

    if (useCoords) {
      if (!navigator.geolocation) {
        setGeoError(
          lang === "pt" 
            ? "Geolocalização não suportada no seu navegador. Buscando Belo Horizonte..." 
            : lang === "es"
            ? "La geolocalización no es compatible. Buscando Belo Horizonte..."
            : "Geolocation is not supported. Searching Belo Horizonte..."
        );
        performSearch(undefined, undefined, "Belo Horizonte");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          performSearch(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation permission rejected or error:", err);
          setGeoError(
            lang === "pt" 
              ? "Localização negada ou indisponível. Carregando Belo Horizonte como padrão..." 
              : lang === "es"
              ? "Ubicación rechazada o no disponible. Cargando Belo Horizonte por defecto..."
              : "Location tracking rejected or unavailable. Loading Belo Horizonte by default..."
          );
          performSearch(undefined, undefined, "Belo Horizonte");
        },
        { timeout: 8000 }
      );
    } else {
      if (!geoCity.trim()) {
        setGeoError(
          lang === "pt" 
            ? "Por favor, digite o nome de uma cidade." 
            : lang === "es"
            ? "Por favor, introduzca el nombre de una ciudad."
            : "Please type a city name."
        );
        setGeoLoading(false);
        return;
      }
      performSearch();
    }
  };

  // Auto-fetch local shows via Ticketmaster when shows tab becomes active
  useEffect(() => {
    if (activeFilterTab === "shows" && !geoResult && !geoLoading) {
      handleGeoSearch(true);
    }
  }, [activeFilterTab]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formLineupText, setFormLineupText] = useState("");
  const [formTicketLink, setFormTicketLink] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [isFestival, setIsFestival] = useState(true);
  const [formError, setFormError] = useState("");

  const countries = Array.from(new Set(events.map(ev => {
    const parts = ev.location.split(",");
    return parts[parts.length - 1]?.trim();
  }).filter(Boolean)));

  // Filter shows and festivals dynamically using Ticketmaster events for shows
  const filteredEvents = (() => {
    if (activeFilterTab === "festivals") {
      return events.filter(ev => {
        if (!ev.isFestival) return false;
        
        const evParts = ev.location.split(",");
        const evCountry = evParts[evParts.length - 1]?.trim().toLowerCase() || "";
        const matchesCountry = !selectedCountry || evCountry.includes(selectedCountry.toLowerCase());

        const isApproved = ev.approved;
        const isSubmittedByMe = user && ev.submittedBy === user.uid;
        return isApproved || isAdmin || isSubmittedByMe;
      });
    } else {
      // For shows: replace static shows with real Ticketmaster local events from geoResult!
      if (geoResult && geoResult.localEvents && geoResult.localEvents.length > 0) {
        return geoResult.localEvents.map((le: any, idx: number) => ({
          id: le.id || `tm-${idx}-${le.name.replace(/\s+/g, "-")}`,
          name: le.name,
          date: le.date,
          location: le.location,
          lineup: le.lineup || [],
          ticketLink: le.ticketLink,
          imageUrl: le.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80",
          isFestival: !!le.isFestival,
          approved: true,
          submittedBy: "ticketmaster"
        }));
      }

      // Initial state before loading is finished: show static local/curated shows
      return events.filter(ev => {
        if (ev.isFestival) return false;

        const evParts = ev.location.split(",");
        const evCountry = evParts[evParts.length - 1]?.trim().toLowerCase() || "";
        const matchesCountry = !selectedCountry || evCountry.includes(selectedCountry.toLowerCase());

        const isApproved = ev.approved;
        const isSubmittedByMe = user && ev.submittedBy === user.uid;
        return isApproved || isAdmin || isSubmittedByMe;
      });
    }
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName || !formDate || !formLocation) {
      setFormError(lang === "pt" ? "Todos os campos obrigatórios (*) devem ser preenchidos!" : "All required (*) fields must be completed!");
      return;
    }

    const lineup = formLineupText.split(",").map(b => b.trim()).filter(Boolean);

    const payload: Omit<EventItem, "id"> = {
      name: formName.trim(),
      date: formDate,
      location: formLocation.trim(),
      lineup,
      ticketLink: formTicketLink.trim() || undefined,
      imageUrl: formImageUrl.trim() || undefined,
      isFestival,
      countdownDate: isFestival ? `${formDate}T12:00:00Z` : undefined,
      approved: isAdmin,
      submittedBy: user?.uid || "guest"
    };

    const success = await onAddEvent(payload);
    if (success) {
      setFormName("");
      setFormDate("");
      setFormLocation("");
      setFormLineupText("");
      setFormTicketLink("");
      setFormImageUrl("");
      setShowForm(false);
    }
  };

  return (
    <div id="festival-section-wrapper" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
            <Flame className="text-rose-600" />
            {initialFilterTab === "shows" 
              ? (lang === "pt" ? "Shows Locais & Bandas Regionais" : "Local Rock Gigs & Regional Artists")
              : initialFilterTab === "festivals"
              ? (lang === "pt" ? "Festivais Globais de Metal" : "Global Metal Festivals")
              : (lang === "pt" ? "Festivais & Agenda de Shows" : "Festivals & Concert Tour Agenda")
            }
          </h2>
          <p className="text-xs text-neutral-400">
            {initialFilterTab === "shows"
              ? (lang === "pt" ? "Encontre shows de underground, bares de rock e artistas locais na sua cidade." : "Find underground concerts, local rock clubs, and active artists near you.")
              : (lang === "pt" ? "Confira os maiores festivais de rock e metal do mundo e cronogramas locais." : "Witness massive global metal festivals and localized tour itineraries.")
            }
          </p>
        </div>

        {/* Event registration button was removed per user request */}
      </div>

      {/* GEOLOCATION FINDER FOR SHOWS & BANDS */}
      {activeFilterTab === "shows" && (
        <div id="shows-geolocation-box" className="bg-gradient-to-br from-neutral-900 via-zinc-950 to-neutral-950 border border-neutral-850 p-5 rounded-2xl relative shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
            <MapPin className="text-red-500" size={16} />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-100">
              {lang === "pt" ? "Radar de Shows & Bandas Locais" : lang === "es" ? "Radar de Conciertos y Bandas Locales" : "Regional Concert & Artist Radar"}
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 font-sans leading-relaxed space-y-2">
            <p className="border-l-2 border-red-600 pl-2">
              🇧🇷 <strong>PT:</strong> Ative sua localização geográfica ou digite seu município abaixo para mapear eventos underground, bares ativos de metal e bandas locais.
            </p>
            <p className="border-l-2 border-neutral-600 pl-2">
              🇺🇸 <strong>EN:</strong> Enable geographic tracking or type your city below to map underground metal shows, active live rock stages, and hometown acts.
            </p>
            <p className="border-l-2 border-amber-600 pl-2">
              🇪🇸 <strong>ES:</strong> Active su ubicación geográfica o introduzca su ciudad abajo para mapear conciertos de metal underground, escenarios de rock en vivo y bandas locales.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => handleGeoSearch(true)}
              disabled={geoLoading}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-xs font-mono font-bold text-red-400 border border-neutral-850 hover:border-red-900/30 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer select-none"
            >
              📍 {lang === "pt" ? "Detectar Minha Região" : lang === "es" ? "Detectar Mi Región" : "Detect My Position"}
            </button>

            <div className="flex-1 flex gap-1.5">
              <input
                type="text"
                placeholder={lang === "pt" ? "Ou digite sua Cidade (Ex: Belo Horizonte)" : lang === "es" ? "O introduzca su Ciudad (Ej: Madrid)" : "Or type city (e.g., Gothenburg, Sweden)"}
                value={geoCity}
                onChange={(e) => setGeoCity(e.target.value)}
                className="flex-1 bg-neutral-950 border border-neutral-850 text-xs text-neutral-200 px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-red-600 transition"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGeoSearch(false);
                }}
              />
              <button
                onClick={() => handleGeoSearch(false)}
                disabled={geoLoading}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono rounded-lg transition cursor-pointer"
              >
                {lang === "pt" || lang === "es" ? "Buscar" : "Search"}
              </button>
            </div>
          </div>

          {geoLoading && (
            <div className="flex items-center justify-center py-4 gap-2">
              <span className="w-4 h-4 rounded-full border border-neutral-400 border-t-white animate-spin"></span>
              <span className="text-[10px] text-zinc-400 font-mono animate-pulse">
                {lang === "pt" ? "Sintonizando amplificadores regionais..." : lang === "es" ? "Sintonizando amplificadores regionales..." : "Sintonizing regional amps..."}
              </span>
            </div>
          )}

          {geoError && (
            <p className="text-[10px] text-red-500 font-mono">⚠️ {geoError}</p>
          )}

          {/* Geo results block */}
          {geoResult && (
            <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl space-y-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block">
                  🏟️ {lang === "pt" ? `Região Detectada: ${geoResult.locationDetected}` : lang === "es" ? `Región Detectada: ${geoResult.locationDetected}` : `Detected Region: ${geoResult.locationDetected}`}
                </span>
                <button
                  onClick={() => setGeoResult(null)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
                >
                  ✕ {lang === "pt" ? "Limpar" : lang === "es" ? "Limpiar" : "Clear"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Information banner */}
                <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-3 text-left font-mono text-xs text-rose-300 flex items-start gap-2">
                  <span className="text-base select-none shrink-0">🎫</span>
                  <div>
                    <strong className="text-white text-[11px] block">
                      {lang === "pt" 
                        ? "Eventos Reais Carregados!" 
                        : lang === "es" 
                        ? "¡Eventos Reales Cargados!" 
                        : "Real Events Loaded!"}
                    </strong>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                      {lang === "pt"
                        ? "Conectamos com sucesso à API oficial do Ticketmaster para mapear shows e festivais locais reais nesta região. A agenda, ingressos oficiais e lineups estão disponíveis nos cartões logo abaixo."
                        : lang === "es"
                        ? "Conectamos con éxito a la API oficial de Ticketmaster para mapear conciertos locales reales en esta región. El calendario, las entradas oficiales y las alineaciones están disponibles en las tarjetas de abajo."
                        : "Successfully connected with the official Ticketmaster Discovery API to map real local tours and events for this area. Ticket links and official lineups are accessible on the card grid below."}
                    </p>
                  </div>
                </div>

                {/* Local bands */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                    🎸 {lang === "pt" ? "Artistas Regionais Ativos" : lang === "es" ? "Artistas Regionales Activos" : "Active Regional Artists"}:
                  </span>
                  {geoResult.localBands && geoResult.localBands.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {geoResult.localBands.map((lb: any, i: number) => (
                        <div key={i} className="bg-neutral-900 p-2.5 border border-neutral-850 rounded-lg text-left font-mono text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="text-white font-bold">{lb.name}</span>
                              <span className="text-[9px] text-rose-500 shrink-0 capitalize font-bold">{lb.genre}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 pl-1 border-l border-rose-950/60 leading-snug">{lb.bio}</p>
                          </div>
                          {lb.socials?.instagram && (
                            <span className="text-[9px] text-neutral-500 text-right block mt-2 self-end">
                              📷 {lb.socials.instagram}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-mono italic">
                      {lang === "pt" ? "Nenhuma banda local catalogada nesta praça." : lang === "es" ? "Ninguna banda local catalogada para esta región." : "No regional acts found in archive."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABS SELECTOR FOR FESTIVALS & SHOWS */}
      {!initialFilterTab && (
        <div className="flex flex-col md:flex-row justify-between gap-3 border-b border-neutral-800 pb-3">
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800/80 max-w-xs">
            <button
              id="tab-festivals-trigger"
              onClick={() => setActiveFilterTab("festivals")}
              className={`flex-1 px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer ${
                activeFilterTab === "festivals" ? "bg-red-950 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              🎪 {t.navFestivals}
            </button>
            <button
              id="tab-shows-trigger"
              onClick={() => setActiveFilterTab("shows")}
              className={`flex-1 px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer ${
                activeFilterTab === "shows" ? "bg-red-950 text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              🎸 {t.navShows}
            </button>
          </div>

          {/* Filter by Country dropdown */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 py-1.5 px-3 rounded-lg font-mono focus:outline-none"
            >
              <option value="">{t.filterByCountry}</option>
              {countries.map(c => (
                <option key={c} value={c} className="bg-neutral-950 text-neutral-200">{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* CONDITIONAL COUNTRY FILTER DISPLAY IF TAB IS SET BUT DROPDOWN NOT RENDERED IN TAB Switcher */}
      {initialFilterTab && (
        <div className="flex justify-end gap-2">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-500" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 py-1.5 px-3 rounded-lg font-mono focus:outline-none"
            >
              <option value="">{t.filterByCountry}</option>
              {countries.map(c => (
                <option key={c} value={c} className="bg-neutral-950 text-neutral-200">{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Event registration form removed per user request */}

      {/* EVENT CARDS DISPLAY GRID */}
      {isLoading ? (
        <EventSkeletonList />
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
          <p className="text-sm text-neutral-500 font-mono">{t.noEventsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((ev, index) => {
            const isFav = ev.id ? favorites.includes(ev.id) : false;
            const hasBanner = !!ev.imageUrl;
            
            return (
              <div
                key={ev.id}
                id={`event-card-${ev.id}`}
                className={`${
                  index % 2 === 0
                    ? "bg-black border border-neutral-900 hover:border-rose-950/40"
                    : "bg-neutral-900 border border-neutral-800 hover:border-rose-950/40"
                } p-4 rounded-xl flex flex-col justify-between hover:shadow-2xl transition duration-300 group`}
              >
                <div>
                  {/* Event Thumbnail */}
                  <FestivalImage url={ev.imageUrl} name={ev.name} isFestival={ev.isFestival} />

                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-sm font-bold text-white font-mono group-hover:text-amber-500 transition">
                      {ev.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {/* Share Button */}
                      <button
                        onClick={() => setSharingEvent(ev)}
                        className="p-1 hover:bg-neutral-950 rounded bg-neutral-950/40 text-neutral-500 hover:text-amber-500 transition cursor-pointer"
                        title={lang === "pt" ? "Compartilhar Evento" : lang === "es" ? "Compartir Evento" : "Share Event"}
                      >
                        <Share2 size={14} />
                      </button>

                      {/* QR Code Button */}
                      <button
                        onClick={() => setQrEvent(ev)}
                        className="p-1 hover:bg-neutral-950 rounded bg-neutral-950/40 text-neutral-500 hover:text-red-500 transition cursor-pointer"
                        title={lang === "pt" ? "QR Code do Evento" : lang === "es" ? "Código QR del Evento" : "Event QR Code"}
                      >
                        <QrCode size={14} />
                      </button>

                      {/* Heart Button for favorited shows */}
                      <button
                        onClick={() => ev.id && onToggleFavorite(ev.id)}
                        className="p-1 hover:bg-neutral-950 rounded bg-neutral-950/40"
                        title="Favoritar"
                      >
                        <Heart
                          size={15}
                          className={isFav ? "text-rose-500 fill-rose-500 animate-bounce" : "text-neutral-500 hover:text-neutral-300"}
                        />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => ev.id && onDeleteEvent(ev.id)}
                          className="p-1 text-neutral-500 hover:text-red-500 bg-neutral-950/40 hover:bg-neutral-950 rounded transition"
                          title={t.deleteBtn}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Date and Location */}
                  <div className="space-y-1.5 mt-3 text-neutral-300 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-neutral-500" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-neutral-500" />
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  {/* Countdown Timer ONLY if Festival */}
                  {ev.isFestival && ev.countdownDate && (
                    <FestivalCountdown targetDate={ev.countdownDate} lang={lang} />
                  )}

                  {/* Lineup list */}
                  {ev.lineup && ev.lineup.length > 0 && (
                    <div className="mt-3.5 pt-3.5 border-t border-neutral-850">
                      <span className="text-[9px] text-neutral-500 uppercase block font-mono font-bold">
                        {t.lineup}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ev.lineup.map((band, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-neutral-950 text-neutral-300 border border-neutral-850 px-2 py-0.5 rounded font-mono"
                          >
                            ⭐ {band}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                  {ev.ticketLink && (
                    <a
                      href={ev.ticketLink.startsWith("http") ? ev.ticketLink : `https://${ev.ticketLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-rose-950/20 hover:bg-rose-900 border border-rose-900/60 hover:border-rose-900 hover:scale-[1.02] text-white py-2 rounded-lg text-xs font-mono font-bold transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Ticket size={12} />
                      {t.buyTickets}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EVENT SHARE MODAL OVERLAY */}
      {sharingEvent && (() => {
        const shareText = (() => {
          const lineupText = sharingEvent.lineup && sharingEvent.lineup.length > 0
            ? sharingEvent.lineup.map(band => `• ${band}`).join("\n")
            : "";

          let text = `📅 *${sharingEvent.name}* 📅\n`;
          text += `━━━━━━━━━━━━━━━━━━━━\n`;
          text += `📆 ${lang === "pt" ? "Data" : lang === "es" ? "Fecha" : "Date"}: ${sharingEvent.date}\n`;
          text += `📍 ${lang === "pt" ? "Local" : lang === "es" ? "Lugar" : "Location"}: ${sharingEvent.location}\n`;
          if (sharingEvent.isFestival) {
            text += `⭐ ${lang === "pt" ? "Tipo: Festival" : lang === "es" ? "Tipo: Festival" : "Type: Festival"}\n`;
          }
          if (sharingEvent.ticketLink) {
            text += `🎟️ ${lang === "pt" ? "Ingressos" : lang === "es" ? "Entradas" : "Tickets"}: ${sharingEvent.ticketLink}\n`;
          }
          text += `━━━━━━━━━━━━━━━━━━━━\n\n`;

          if (lineupText) {
            text += `🎸 *Lineup:*\n${lineupText}\n\n`;
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
                title: sharingEvent.name,
                text: shareText,
              });
            } catch (err) {
              console.log("Native share error:", err);
            }
          }
        };

        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        const emailUrl = `mailto:?subject=${encodeURIComponent(sharingEvent.name)}&body=${encodeURIComponent(shareText)}`;

        return (
          <div id="event-share-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-neutral-900 border border-neutral-850 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 font-sans text-neutral-200">
              <button
                onClick={() => setSharingEvent(null)}
                className="absolute top-4 right-4 p-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg border border-neutral-800 transition cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>

              <div>
                <h3 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest">
                  📢 {lang === "pt" ? "Compartilhar Evento" : lang === "es" ? "Compartir Evento" : "Share Event"}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  {lang === "pt" 
                    ? "Veja o texto gerado e escolha como deseja compartilhar:" 
                    : lang === "es"
                    ? "Vea el texto generado y elija cómo deseja compartir:"
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
                  onClick={() => setSharingEvent(null)}
                  className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 text-xs font-mono font-bold rounded-lg transition cursor-pointer"
                >
                  {lang === "pt" ? "Fechar" : lang === "es" ? "Cerrar" : "Close"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* EVENT QR CODE GENERATOR MODAL OVERLAY */}
      {qrEvent && (() => {
        const qrValue = (() => {
          let text = `📅 ${qrEvent.name} 📅\n`;
          text += `📆 Date: ${qrEvent.date}\n`;
          text += `📍 Location: ${qrEvent.location}\n`;
          if (qrEvent.isFestival) {
            text += `⭐ Type: Festival\n`;
          }
          if (qrEvent.ticketLink) {
            text += `🎟️ Tickets: ${qrEvent.ticketLink}\n`;
          }
          if (qrEvent.lineup && qrEvent.lineup.length > 0) {
            text += `🎸 Lineup: ${qrEvent.lineup.join(", ")}\n`;
          }
          return text;
        })();

        return (
          <div id="event-qr-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative bg-neutral-900 border border-neutral-850 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 font-sans text-neutral-200 text-center">
              <button
                onClick={() => setQrEvent(null)}
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
                  {qrEvent.name}
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
                  onClick={() => setQrEvent(null)}
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
