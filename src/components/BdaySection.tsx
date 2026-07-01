import React, { useState } from "react";
import { motion } from "motion/react";
import { Band, DiscographyItem } from "../firebase";
import { Calendar, ArrowLeft, Disc, Music, Sparkles, Volume2, Search, Flame } from "lucide-react";

interface BdaySectionProps {
  bands: Band[];
  lang: "pt" | "en" | "es";
  onBackToCatalog: () => void;
  onViewBand: (bandName: string) => void;
}

// Deterministic hashing function to map an album to a stable Month (0-11) and Day (1-maxDay) of the year
export function getDeterministicReleaseDate(bandName: string, albumTitle: string, year: number) {
  // Use a combination of band name, album title and year to form a stable unique string
  const str = `${bandName}_${albumTitle}_${year}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Deterministic month (0 to 11)
  const month = hash % 12;

  // Days in that month
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const maxDay = daysInMonths[month];

  // Deterministic day (1 to maxDay)
  const day = (hash % maxDay) + 1;

  return { month, day };
}

// Month names dictionary
const monthNames = {
  pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
};
// Localized strings
const t = {
  pt: {
    title: "📅 Álbuns de Aniversário",
    subtitle: "Celebre os marcos do metal! Álbuns lendários que fazem aniversário de lançamento na data atual e nesta semana.",
    todayTab: "📅 Aniversários de Hoje",
    weekTab: "📅 Esta Semana",
    allTab: "🎸 Todos os Álbuns",
    backBtn: "Voltar ao Catálogo",
    released: "Lançado em",
    celebrating: "",
    years: "anos",
    viewBand: "Ver Perfil da Banda",
    emptyToday: "Nenhum álbum de metal fazendo aniversário exatamente hoje. Confira os outros dias desta semana!",
    searchPlaceholder: "Filtrar por banda ou álbum...",
    anniversaryOn: "Aniversário em",
    daysLeft: "Em",
    daysAgo: "Há",
    daysUnit: "dias",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    todayLabel: "HOJE!",
    epicMarcos: "Marcos Históricos",
    showMore: "Ver mais aniversários da semana"
  },
  en: {
    title: "📅 Album Anniversaries",
    subtitle: "Celebrate the milestones of metal! Legendary albums celebrating their release anniversary today and this week.",
    todayTab: "📅 Today's Anniversaries",
    weekTab: "📅 This Week",
    allTab: "🎸 All Albums",
    backBtn: "Back to Catalog",
    released: "Released in",
    celebrating: "",
    years: "years",
    viewBand: "View Band Profile",
    emptyToday: "No metal albums celebrating exactly today. Check out the other days of this week!",
    searchPlaceholder: "Filter by band or album...",
    anniversaryOn: "Anniversary on",
    daysLeft: "In",
    daysAgo: "",
    daysUnit: "days ago",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    todayLabel: "TODAY!",
    epicMarcos: "Historical Milestones",
    showMore: "Show more anniversaries this week"
  },
  es: {
    title: "📅 Aniversarios de Álbumes",
    subtitle: "¡Celebra los hitos del metal! Álbumes legendarios que celebran su aniversario de lanzamiento en la fecha actual y esta semana.",
    todayTab: "📅 Cumpleaños de Hoy",
    weekTab: "📅 Esta Semana",
    allTab: "🎸 Todos los Álbumes",
    backBtn: "Voltar ao Catálogo",
    released: "Lanzado en",
    celebrating: "",
    years: "años",
    viewBand: "Ver Perfil de la Banda",
    emptyToday: "Ningún álbum de metal cumple años hoy exactamente. ¡Mira los otros días de esta semana!",
    searchPlaceholder: "Filtrar por banda o álbum...",
    anniversaryOn: "Aniversario el",
    daysLeft: "En",
    daysAgo: "Hace",
    daysUnit: "días",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    todayLabel: "¡HOY!",
    epicMarcos: "Hitos Históricos",
    showMore: "Ver más aniversarios de la semana"
  }
};

interface RichAnniversaryItem {
  band: Band;
  album: DiscographyItem;
  releaseMonth: number;
  releaseDay: number;
  yearsOld: number;
  diffDays: number; // 0 = today, 1 = tomorrow, -1 = yesterday, etc.
  formattedDate: string;
}

export const BdaySection: React.FC<BdaySectionProps> = ({
  bands,
  lang,
  onBackToCatalog,
  onViewBand
}) => {
  const currentLang = t[lang] || t.pt;
  const months = monthNames[lang] || monthNames.pt;
  
  const [activeSubTab, setActiveSubTab] = useState<"today" | "week" | "all">("today");
  const [searchTerm, setSearchTerm] = useState("");

  // Get current date parameters
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11
  const currentDay = today.getDate(); // 1-31

  // Gather all albums from all bands and enrich with deterministic release info
  const allAnniversaries: RichAnniversaryItem[] = [];

  bands.forEach(band => {
    if (band.discography && Array.isArray(band.discography)) {
      band.discography.forEach(album => {
        const { month, day } = getDeterministicReleaseDate(band.name, album.title, album.year);
        
        // Calculate years old
        const yearsOld = currentYear - album.year;
        
        // Calculate date difference within current year
        // Create date objects for comparison
        const todayAnniv = new Date(currentYear, currentMonth, currentDay);
        const albumAnniv = new Date(currentYear, month, day);
        
        const diffTime = albumAnniv.getTime() - todayAnniv.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        const formattedDate = `${day} de ${months[month]}`;

        allAnniversaries.push({
          band,
          album,
          releaseMonth: month,
          releaseDay: day,
          yearsOld,
          diffDays,
          formattedDate
        });
      });
    }
  });

  // Filter based on active sub-tab
  let filteredItems = allAnniversaries.filter(item => {
    // Search matching
    const matchesSearch = 
      item.band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.album.title.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (!matchesSearch) return false;

    if (activeSubTab === "today") {
      return item.diffDays === 0;
    } else if (activeSubTab === "week") {
      // Within -7 days to +7 days
      return item.diffDays >= -7 && item.diffDays <= 7;
    } else {
      // All
      return true;
    }
  });

  // Sorting
  filteredItems.sort((a, b) => {
    if (activeSubTab === "today") {
      // Sort by years old descending (older albums first)
      return b.yearsOld - a.yearsOld;
    } else if (activeSubTab === "week") {
      // Sort by absolute distance to today, then today's first
      if (a.diffDays === 0 && b.diffDays !== 0) return -1;
      if (b.diffDays === 0 && a.diffDays !== 0) return 1;
      return Math.abs(a.diffDays) - Math.abs(b.diffDays);
    } else {
      // Default sort alphabetically by band then album title
      return a.band.name.localeCompare(b.band.name);
    }
  });

  // Helper to format absolute difference
  const getDiffLabel = (diff: number) => {
    if (diff === 0) return currentLang.todayLabel;
    if (diff === -1) return currentLang.yesterday;
    if (diff === 1) return currentLang.tomorrow;
    if (diff > 1) {
      return `${currentLang.daysLeft} ${diff} ${currentLang.daysUnit}`;
    } else {
      return `${currentLang.daysAgo} ${Math.abs(diff)} ${currentLang.daysUnit}`;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-950/40 rounded-xl border border-red-900/30 text-rose-500">
              <Sparkles size={20} className="animate-bounce" />
            </span>
            <h2 className="text-xl font-black font-mono uppercase tracking-wider text-white">
              {currentLang.title}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-sans max-w-2xl">
            {currentLang.subtitle}
          </p>
        </div>

        <button
          onClick={onBackToCatalog}
          className="flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white px-4 py-2 rounded-xl border border-neutral-850 hover:border-neutral-800 text-xs font-bold font-mono uppercase transition active:scale-95 cursor-pointer h-10 shadow-lg"
        >
          <ArrowLeft size={14} />
          {currentLang.backBtn}
        </button>
      </div>

      {/* Date display & search bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Today's calendar widget */}
        <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex items-center gap-3.5 shadow-md">
          <div className="bg-red-950/30 border border-red-900/40 text-rose-500 rounded-lg p-2.5 shrink-0">
            <Calendar size={22} />
          </div>
          <div className="font-mono">
            <span className="text-[9px] text-neutral-500 uppercase block tracking-widest">
              {lang === "pt" ? "Data Atual" : lang === "es" ? "Fecha Actual" : "Current Date"}
            </span>
            <span className="text-sm font-bold text-neutral-200 capitalize">
              {currentDay} de {months[currentMonth]}
            </span>
          </div>
        </div>

        {/* Filter Input */}
        <div className="md:col-span-2 relative">
          <span className="absolute left-3.5 top-3 text-neutral-500">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder={currentLang.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 hover:border-neutral-800 text-xs text-neutral-200 pl-10 pr-4 py-3 rounded-xl font-mono focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 transition-all shadow-md h-[46px]"
          />
        </div>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex gap-2 border-b border-neutral-900 pb-1 font-mono">
        <button
          onClick={() => setActiveSubTab("today")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-150 cursor-pointer ${
            activeSubTab === "today"
              ? "border-red-600 text-rose-400"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {currentLang.todayTab} ({allAnniversaries.filter(i => i.diffDays === 0).length})
        </button>
        <button
          onClick={() => setActiveSubTab("week")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-150 cursor-pointer ${
            activeSubTab === "week"
              ? "border-red-600 text-rose-400"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {currentLang.weekTab} ({allAnniversaries.filter(i => i.diffDays >= -7 && i.diffDays <= 7).length})
        </button>
        <button
          onClick={() => setActiveSubTab("all")}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition duration-150 cursor-pointer ${
            activeSubTab === "all"
              ? "border-red-600 text-rose-400"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {currentLang.allTab} ({allAnniversaries.length})
        </button>
      </div>

      {/* Main Grid View */}
      {filteredItems.length === 0 ? (
        <div className="bg-neutral-950 border border-neutral-850 p-12 rounded-2xl text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-600 mx-auto">
            <Disc size={28} className="animate-spin-slow" />
          </div>
          <div className="space-y-1.5 font-mono">
            <h4 className="text-sm font-bold text-neutral-300 uppercase">
              {lang === "pt" ? "Nenhum Álbum Encontrado" : "No Albums Found"}
            </h4>
            <p className="text-[11px] text-neutral-500">
              {activeSubTab === "today" ? currentLang.emptyToday : (lang === "pt" ? "Tente ajustar seu filtro de pesquisa." : "Try adjusting your search filter.")}
            </p>
          </div>
          {activeSubTab === "today" && (
            <button
              onClick={() => setActiveSubTab("week")}
              className="bg-red-950/40 text-rose-400 border border-red-900/40 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold hover:bg-red-950/60 hover:text-white transition cursor-pointer"
            >
              {currentLang.showMore}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, index) => {
            const isToday = item.diffDays === 0;
            return (
              <motion.div
                key={`${item.band.name}_${item.album.title}_${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.4) }}
                className={`relative bg-neutral-950/70 backdrop-blur-sm rounded-2xl border p-5 flex flex-col justify-between transition-all group overflow-hidden ${
                  isToday 
                    ? "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)] bg-gradient-to-b from-neutral-950/80 to-amber-950/10" 
                    : "border-neutral-850 hover:border-neutral-800"
                }`}
              >
                {/* Visual Glow background on active item */}
                {isToday && (
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none group-hover:scale-125 transition duration-500"></div>
                )}
                
                {/* Header Tag / Day Diff */}
                <div className="flex justify-between items-start gap-2 mb-4 font-mono">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isToday
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm"
                      : Math.abs(item.diffDays) === 1
                      ? "bg-rose-950/40 text-rose-400 border border-rose-900/30"
                      : "bg-neutral-900 text-zinc-500"
                  }`}>
                    {isToday && <Sparkles size={8} className="animate-pulse" />}
                    {getDiffLabel(item.diffDays)}
                  </span>
                  
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase">
                    {item.formattedDate}
                  </span>
                </div>

                {/* Core Album / Band info */}
                <div className="flex items-start gap-4">
                  {/* Decorative Album Vinyl with dynamic rotating hover */}
                  <div className="relative shrink-0 w-16 h-16 bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-800 shadow-md overflow-hidden group-hover:border-neutral-700 transition">
                    <Disc className="absolute inset-0 m-auto text-neutral-800 w-14 h-14 group-hover:rotate-180 transition-all duration-1000" />
                    <Music className={`absolute inset-0 m-auto ${isToday ? "text-amber-500" : "text-neutral-500"} group-hover:scale-110 transition duration-300`} size={18} />
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-neutral-950 border border-neutral-800"></div>
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    {/* Band Name */}
                    <h3 className="text-sm font-bold text-white font-mono truncate group-hover:text-red-400 transition">
                      {item.band.name}
                    </h3>
                    
                    {/* Album Title */}
                    <h4 className="text-xs font-semibold text-neutral-300 font-sans italic truncate">
                      {item.album.title}
                    </h4>
                    
                    {/* Year of Release */}
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {currentLang.released}: <span className="text-neutral-300">{item.album.year}</span> • <span className="uppercase text-[9px] bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-400">{item.album.type}</span>
                    </p>
                  </div>
                </div>

                {/* Footer celebratory message or button */}
                <div className="border-t border-neutral-900 pt-4 mt-5 flex flex-col gap-2.5 font-mono">
                  {/* Years celebrated count */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                    <Volume2 size={11} className={`${isToday ? "text-amber-500" : "text-zinc-600"}`} />
                    <span>
                      <strong className={`${isToday ? "text-amber-400" : "text-neutral-200"}`}>{item.yearsOld}</strong> {currentLang.years}
                    </span>
                  </div>

                  {/* Interactivity to profile */}
                  <button
                    onClick={() => onViewBand(item.band.name)}
                    className={`w-full text-center text-[10px] uppercase tracking-wider py-1.5 rounded-lg border font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:shadow ${
                      isToday
                        ? "bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border-amber-500/30 hover:border-amber-500"
                        : "bg-neutral-900 hover:bg-red-950/20 text-neutral-400 hover:text-rose-400 border-neutral-800 hover:border-red-900/30"
                    }`}
                  >
                    <Flame size={11} />
                    {currentLang.viewBand}
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </div>
  );
};
