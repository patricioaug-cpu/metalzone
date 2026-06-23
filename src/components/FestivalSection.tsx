import React, { useState, useEffect } from "react";
import { EventItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { 
  Calendar, MapPin, Tag, Plus, CheckCircle, ExternalLink, Flame, 
  Hourglass, Ticket, Star, ThumbsUp, Filter, Heart 
} from "lucide-react";

interface FestivalSectionProps {
  events: EventItem[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onAddEvent: (event: Omit<EventItem, "id">) => Promise<boolean>;
  onDeleteEvent: (id: string) => Promise<void>;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  initialFilterTab?: "festivals" | "shows";
}

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
  initialFilterTab
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";
  const isLogged = !!user;

  const [activeFilterTab, setActiveFilterTab] = useState<"festivals" | "shows">(initialFilterTab || "festivals");
  
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

    const performSearch = async (lat?: number, lon?: number) => {
      try {
        const res = await fetch("/api/events/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat,
            lon,
            city: geoCity.trim(),
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
            ? "Geolocalização não suportada no seu navegador." 
            : lang === "es"
            ? "La geolocalización no es compatible con su navegador."
            : "Geolocation is not supported by your browser."
        );
        setGeoLoading(false);
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
              ? "Erro ou permissão negada. Por favor, digite sua cidade abaixo para buscar manualmente." 
              : lang === "es"
              ? "Error o permiso denegado. Por favor, introduzca su ciudad abajo para buscar manualmente."
              : "Permission denied or error. Please input city manually below to search."
          );
          setGeoLoading(false);
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

  // Filter shows and festivals
  const filteredEvents = events.filter(ev => {
    const matchesTab = activeFilterTab === "festivals" ? ev.isFestival : !ev.isFestival;
    
    const evParts = ev.location.split(",");
    const evCountry = evParts[evParts.length - 1]?.trim().toLowerCase() || "";
    const matchesCountry = !selectedCountry || evCountry.includes(selectedCountry.toLowerCase());

    const isApproved = ev.approved;
    const isSubmittedByMe = user && ev.submittedBy === user.uid;
    const canSee = isApproved || isAdmin || isSubmittedByMe;

    return matchesTab && matchesCountry && canSee;
  });

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
    <div id="festival-section-wrapper" className="space-y-6">
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

        {isLogged && (
          <button
            id="btn-register-show"
            onClick={() => {
              setShowForm(!showForm);
              setFormError("");
              if (initialFilterTab) {
                setIsFestival(initialFilterTab === "festivals");
              }
            }}
            className="px-4 py-2 border border-rose-900/40 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-widest flex items-center gap-2 transition cursor-pointer"
          >
            <Plus size={14} />
            {t.submitEventTitle}
          </button>
        )}
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
                  🏟️ {lang === "pt" ? `Resultados para: ${geoResult.locationDetected}` : lang === "es" ? `Resultados para: ${geoResult.locationDetected}` : `Detected Arena: ${geoResult.locationDetected}`}
                </span>
                <button
                  onClick={() => setGeoResult(null)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
                >
                  ✕ {lang === "pt" ? "Limpar" : lang === "es" ? "Limpiar" : "Clear"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local bands */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    🎸 {lang === "pt" ? "Bandas Regionais Ativas" : lang === "es" ? "Bandas Regionales Activas" : "Active Regional Bands"}:
                  </span>
                  {geoResult.localBands && geoResult.localBands.length > 0 ? (
                    <div className="space-y-1.5">
                      {geoResult.localBands.map((lb: any, i: number) => (
                        <div key={i} className="bg-neutral-900 p-2.5 border border-neutral-850 rounded text-left font-mono text-xs flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <span className="text-white font-bold">{lb.name}</span>
                              <span className="text-[9px] text-red-500 shrink-0 capitalize">{lb.genre}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 pl-1 border-l border-neutral-800">{lb.bio}</p>
                          </div>
                          {lb.socials?.instagram && (
                            <span className="text-[9px] text-neutral-500 text-right block mt-1.5 self-end">
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

                {/* Local events */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-400 block">
                    🎪 {lang === "pt" ? "Shows e Festivais Próximos" : lang === "es" ? "Conciertos y Eventos Próximos" : "Upcoming Gigs & Festivals"}:
                  </span>
                  {geoResult.localEvents && geoResult.localEvents.length > 0 ? (
                    <div className="space-y-1.5">
                      {geoResult.localEvents.map((le: any, i: number) => (
                        <div key={i} className="bg-neutral-900 p-2.5 border border-neutral-850 rounded text-left font-mono text-xs space-y-1">
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-neutral-200 font-bold leading-tight">{le.name}</span>
                            <span className="text-[9px] bg-red-950/60 text-red-400 px-1 py-0.5 rounded border border-red-900/30 shrink-0 select-none">
                              {le.date}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400">📍 {le.location}</p>
                          {le.lineup && le.lineup.length > 0 && (
                            <p className="text-[9px] text-neutral-600 truncate">Line: {le.lineup.join(", ")}</p>
                          )}
                          {le.ticketLink && !le.ticketLink.includes("não encontrado") && (
                            <a
                              href={le.ticketLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-amber-500 font-bold hover:underline block pt-1"
                            >
                              🎫 {lang === "pt" ? "Comprar Ingressos" : lang === "es" ? "Comprar Entradas" : "Buy Tickets"} →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-mono italic">
                      {lang === "pt" ? "Nenhum show localizado agendado para breve." : lang === "es" ? "Ningún concierto agendado para esta área." : "No upcoming tours found for city."}
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

      {/* SHOW INSERTION DIALOG FORM */}
      {showForm && isLogged && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-rose-950/30 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-rose-500 border-b border-neutral-800 pb-2 flex items-center gap-1.5">
            <Calendar size={14} />
            {t.submitEventTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Nome do Evento *</label>
              <input
                type="text"
                placeholder="Ex: Wacken Open Air 2026"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Data do Evento *</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Localização (Cidade, País) *</label>
              <input
                type="text"
                placeholder="Ex: Wacken, Germany"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">URL do Banner/Foto</label>
              <input
                type="url"
                placeholder="https://..."
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Tipo de Evento</label>
              <div className="flex gap-4 p-2 bg-neutral-950 border border-neutral-800 rounded">
                <label className="flex items-center gap-2 text-xs text-neutral-300 font-mono cursor-pointer">
                  <input
                    type="radio"
                    name="isFestivalRadio"
                    checked={isFestival}
                    onChange={() => setIsFestival(true)}
                  />
                  🎪 Festival Mundial
                </label>
                <label className="flex items-center gap-2 text-xs text-neutral-300 font-mono cursor-pointer">
                  <input
                    type="radio"
                    name="isFestivalRadio"
                    checked={!isFestival}
                    onChange={() => setIsFestival(false)}
                  />
                  🎸 Show Local / Turnê
                </label>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Link de Ingressos</label>
              <input
                type="url"
                placeholder="https://..."
                value={formTicketLink}
                onChange={(e) => setFormTicketLink(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Line-up (Bandas separadas por vírgulas)</label>
            <input
              type="text"
              placeholder="Ex: Sepultura, Angra, Ratos de Porão"
              value={formLineupText}
              onChange={(e) => setFormLineupText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          {formError && <p className="text-xs text-red-500 font-mono">⚠️ {formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono rounded"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-900 hover:bg-rose-800 text-white text-xs font-mono font-bold rounded shadow-lg"
            >
              🔥 Enviar para Curadoria
            </button>
          </div>
        </form>
      )}

      {/* EVENT CARDS DISPLAY GRID */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
          <p className="text-sm text-neutral-500 font-mono">{t.noEventsFound}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map(ev => {
            const isFav = ev.id ? favorites.includes(ev.id) : false;
            const hasBanner = !!ev.imageUrl;
            
            return (
              <div
                key={ev.id}
                id={`event-card-${ev.id}`}
                className="bg-neutral-900 border border-neutral-800 hover:border-rose-950/40 p-4 rounded-xl flex flex-col justify-between hover:shadow-2xl transition duration-300 group"
              >
                <div>
                  {/* Event Thumbnail */}
                  {hasBanner ? (
                    <img
                      src={ev.imageUrl}
                      alt={ev.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-32 object-cover rounded-lg mb-3 border border-neutral-800"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-red-950/40 to-neutral-800 rounded-lg mb-3 border border-red-900/10 flex flex-col items-center justify-center font-mono">
                      {ev.isFestival ? "🎪 FESTIVAL WORLD STAGE" : "🎸 LOCAL ROCK SHOW"}
                    </div>
                  )}

                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-sm font-bold text-white font-mono group-hover:text-amber-500 transition line-clamp-2">
                      {ev.name}
                    </h3>
                    <div className="flex items-center gap-1">
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
                      <span className="truncate">{ev.location}</span>
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
                      className="flex-1 text-center bg-rose-950/20 hover:bg-rose-900 border border-rose-900/60 hover:border-rose-900 hover:scale-[1.02] text-white py-2 rounded-lg text-xs font-mono font-bold transition duration-300 flex items-center justify-center gap-1"
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
    </div>
  );
};
