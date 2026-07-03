import React from "react";
import { motion } from "motion/react";
import { Band } from "../firebase";
import { Music, Globe, Calendar, ArrowLeft, Skull, Clock, HelpCircle, AlertCircle } from "lucide-react";
// @ts-ignore
import metalCatalogLogo from "../assets/images/metal_catalog_logo_1782380109985.jpg";
import { getProxiedImageUrl } from "../utils/imageProxy";

interface YesterdayBandsSectionProps {
  bands: Band[];
  lang: "pt" | "en" | "es";
  onBackToCatalog: () => void;
}

export const YesterdayBandsSection: React.FC<YesterdayBandsSectionProps> = ({
  bands,
  lang,
  onBackToCatalog,
}) => {
  // Determine yesterday's date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayYear = yesterday.getFullYear();
  const yesterdayMonth = yesterday.getMonth();
  const yesterdayDate = yesterday.getDate();

  // Helper to check if a band was added yesterday
  const isAddedYesterday = (band: Band) => {
    if (!band.createdAt) return false;

    let createdDate: Date;
    if (typeof band.createdAt === "string") {
      createdDate = new Date(band.createdAt);
    } else if (band.createdAt.toDate && typeof band.createdAt.toDate === "function") {
      createdDate = band.createdAt.toDate();
    } else if (band.createdAt.seconds) {
      createdDate = new Date(band.createdAt.seconds * 1000);
    } else {
      createdDate = new Date(band.createdAt);
    }

    if (isNaN(createdDate.getTime())) return false;

    return (
      createdDate.getFullYear() === yesterdayYear &&
      createdDate.getMonth() === yesterdayMonth &&
      createdDate.getDate() === yesterdayDate
    );
  };

  // Filter bands added yesterday
  const yesterdayBands = bands.filter(isAddedYesterday);

  // Localized texts
  const t = {
    pt: {
      title: "Adicionadas Ontem",
      subtitle: "Bandas que entraram no catálogo no dia anterior",
      backBtn: "Voltar ao Menu Principal",
      noBands: "Nenhuma banda foi adicionada ontem.",
      addedOn: "Adicionado em",
      formation: "Formada em",
      country: "País de origem",
      genre: "Gênero de Metal",
      viewInCatalog: "Ver no Catálogo",
      yesterdayDate: "Data de referência"
    },
    en: {
      title: "Added Yesterday",
      subtitle: "Bands added to the catalog on the previous day",
      backBtn: "Back to Main Menu",
      noBands: "No bands were added yesterday.",
      addedOn: "Added on",
      formation: "Formed in",
      country: "Country of origin",
      genre: "Metal Genre",
      viewInCatalog: "View in Catalog",
      yesterdayDate: "Reference Date"
    },
    es: {
      title: "Añadidas Ayer",
      subtitle: "Bandas que ingresaron al catálogo el día anterior",
      backBtn: "Volver al Menú Principal",
      noBands: "No se agregaron bandas ayer.",
      addedOn: "Agregado el",
      formation: "Formada en",
      country: "País de origen",
      genre: "Género de Metal",
      viewInCatalog: "Ver en Catálogo",
      yesterdayDate: "Fecha de referencia"
    },
  }[lang];

  // Format yesterday's date beautifully
  const formattedYesterdayStr = yesterday.toLocaleDateString(
    lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="space-y-6">
      {/* Header card with action */}
      <div className="bg-zinc-950 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-950/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-rose-500">
              <Clock size={16} className="animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                {t.yesterdayDate}: {formattedYesterdayStr}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider font-mono">
              ⚡ {t.title}
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={onBackToCatalog}
            className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-900/40 hover:border-red-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shadow-lg shadow-black/50"
          >
            <ArrowLeft size={14} />
            <span>{t.backBtn}</span>
          </button>
        </div>
      </div>

      {/* Grid of bands */}
      {yesterdayBands.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40 space-y-4"
        >
          <div className="w-12 h-12 bg-neutral-900/80 border border-neutral-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-neutral-400 font-mono font-medium">
              {t.noBands}
            </p>
            <p className="text-xs text-neutral-500 font-mono">
              {lang === "pt"
                ? "Tente cadastrar uma nova banda para testar este fluxo!"
                : "Try adding a new band to test this feature!"}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yesterdayBands.map((band, index) => {
            const bioText =
              typeof band.bio === "string"
                ? band.bio
                : band.bio?.[lang] || band.bio?.en || "";

            return (
              <motion.div
                key={band.id || `yesterday-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-zinc-950 border border-neutral-900 text-neutral-200 p-5 rounded-xl hover:border-red-950/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition font-mono flex items-center flex-wrap gap-2">
                        {band.name}
                      </h3>
                      <p className="text-[11px] text-red-500 font-mono uppercase tracking-wider font-semibold">
                        {band.genre}
                      </p>
                    </div>

                    <div className="w-10 h-10 bg-black border border-neutral-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                      <img
                        src={getProxiedImageUrl(band.logoUrl || metalCatalogLogo, 100)}
                        className="w-full h-full object-cover"
                        alt={band.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = metalCatalogLogo;
                        }}
                      />
                    </div>
                  </div>

                  {/* Core facts */}
                  <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-neutral-900/50 rounded-lg border border-neutral-850 font-mono text-center">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">
                        {t.country}
                      </span>
                      <span className="text-xs text-neutral-200 mt-0.5 inline-flex items-center gap-1 justify-center">
                        <Globe size={11} className="text-neutral-500" />
                        {band.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase">
                        {t.formation}
                      </span>
                      <span className="text-xs text-neutral-200 mt-0.5 inline-flex items-center gap-1 justify-center">
                        <Calendar size={11} className="text-neutral-500" />
                        {band.formationYear}
                      </span>
                    </div>
                  </div>

                  {/* Bio summary */}
                  {bioText && bioText.trim() !== "" && (
                    <p className="text-xs text-stone-400 leading-relaxed font-sans mb-3 line-clamp-3">
                      {bioText}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center text-[10px] font-mono text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {t.addedOn}: {new Date(yesterday).toLocaleDateString()}
                  </span>

                  <button
                    onClick={onBackToCatalog}
                    className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition"
                  >
                    <span>{t.viewInCatalog}</span>
                    <ArrowLeft size={10} className="rotate-180" />
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
