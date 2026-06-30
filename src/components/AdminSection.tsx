import React from "react";
import { Band, EventItem, NewsItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { ShieldCheck, CheckCircle2, Trash2, Milestone, BellRing, Sparkles } from "lucide-react";

interface AdminSectionProps {
  bands: Band[];
  events: EventItem[];
  news: NewsItem[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onApproveBand: (id: string) => Promise<void>;
  onDeleteBand: (id: string) => Promise<void>;
  onApproveEvent: (id: string) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onApproveNews: (id: string) => Promise<void>;
  onDeleteNews: (id: string) => Promise<void>;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  bands,
  events,
  news,
  user,
  lang,
  onApproveBand,
  onDeleteBand,
  onApproveEvent,
  onDeleteEvent,
  onApproveNews,
  onDeleteNews
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";

  if (!isAdmin) {
    return (
      <div className="bg-red-950/20 border border-red-900/40 p-6 rounded-xl text-center space-y-3 font-mono">
        <Milestone size={32} className="text-red-500 mx-auto animate-bounce" />
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">{t.onlyAdminPrompt}</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          {lang === "pt" 
            ? "Para gerenciar aprovações de conteúdo enviado e administrar o catálogo global, faça login acima utilizando o e-mail administrador patricioaug@gmail.com." 
            : "To authorize user submissions and moderate the rock index, authenticate above as the system manager patricioaug@gmail.com."}
        </p>
      </div>
    );
  }

  // Pending contents
  const pendingBands = bands.filter(b => !b.approved);
  const pendingEvents = events.filter(e => !e.approved);
  const pendingNews = news.filter(n => !n.approved);

  const totalPending = pendingBands.length + pendingEvents.length + pendingNews.length;

  return (
    <div id="admin-panel-dashboard" className="space-y-6">
      <div className="bg-gradient-to-r from-red-950/40 via-neutral-900 to-amber-950/20 p-6 rounded-xl border border-red-950/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-800/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-red-950/60 rounded-xl border border-red-900/40 text-rose-500">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">
              {t.adminDashboard}
            </h2>
            <p className="text-xs text-neutral-300 mt-1">
              {t.adminWelcome}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
          <span className="text-[10px] text-neutral-500 uppercase">Aprovações Pendentes</span>
          <span className="text-2xl font-black text-amber-500 block mt-1">{totalPending}</span>
        </div>
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
          <span className="text-[10px] text-neutral-500 uppercase">Bandas Ativas</span>
          <span className="text-2xl font-black text-rose-500 block mt-1">
            {bands.filter(b => b.approved).length} / {bands.length}
          </span>
        </div>
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850">
          <span className="text-[10px] text-neutral-500 uppercase">Eventos & Agenda</span>
          <span className="text-2xl font-black text-blue-500 block mt-1">
            {events.filter(e => e.approved).length} / {events.length}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-amber-500 flex items-center gap-2 border-b border-neutral-800 pb-2">
        <BellRing size={15} />
        {t.pendingValidation}
      </h3>

      {totalPending === 0 ? (
        <div className="text-center py-10 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-xl">
          <p className="text-xs text-neutral-400 font-mono">⚡ {t.noPendingItems}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Bands */}
          {pendingBands.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                🎸 Bandas enviadas por usuários ({pendingBands.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {pendingBands.map(b => (
                  <div key={b.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white font-mono">{b.name}</h5>
                      <p className="text-[10px] text-amber-500 font-mono uppercase">{b.genre} • {b.country} • {b.formationYear}</p>
                      <p className="text-[11px] text-neutral-400 font-sans line-clamp-1 italic max-w-xl">
                        {typeof b.bio === "string" ? b.bio : b.bio[lang] || b.bio["en"]}
                      </p>
                    </div>
                    <div className="flex gap-1.5 font-mono">
                      <button
                        onClick={() => b.id && onApproveBand(b.id)}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                      >
                        ✔ Aprovar
                      </button>
                      <button
                        onClick={() => b.id && onDeleteBand(b.id)}
                        className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                      >
                        ✖ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Shows / Festivals */}
          {pendingEvents.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                📅 Shows e Festivais ({pendingEvents.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {pendingEvents.map(e => (
                  <div key={e.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h5 className="text-sm font-bold text-white font-mono">
                        {e.isFestival ? "🎪 Festival: " : "🎸 Show: "} {e.name}
                      </h5>
                      <p className="text-[10px] text-blue-400 font-mono uppercase">{e.date} • {e.location}</p>
                      {e.lineup && e.lineup.length > 0 && (
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Lineup: {e.lineup.join(", ")}</p>
                      )}
                    </div>
                    <div className="flex gap-1.5 font-mono">
                      <button
                        onClick={() => e.id && onApproveEvent(e.id)}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                      >
                        ✔ Aprovar
                      </button>
                      <button
                        onClick={() => e.id && onDeleteEvent(e.id)}
                        className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                      >
                        ✖ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending News */}
          {pendingNews.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                📰 Matérias de Notícias enviadas ({pendingNews.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {pendingNews.map(n => {
                  const titleStr = typeof n.title === "string" ? n.title : (n.title[lang] || n.title["en"] || "");
                  return (
                    <div key={n.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-white font-mono">{titleStr}</h5>
                        <p className="text-[11px] text-neutral-400 font-sans line-clamp-1 italic max-w-xl">
                          {typeof n.content === "string" ? n.content : n.content[lang] || n.content["en"]}
                        </p>
                      </div>
                      <div className="flex gap-1.5 font-mono">
                        <button
                          onClick={() => n.id && onApproveNews(n.id)}
                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                        >
                          ✔ Aprovar
                        </button>
                        <button
                          onClick={() => n.id && onDeleteNews(n.id)}
                          className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-900 px-3 py-1 text-[10px] uppercase font-bold rounded cursor-pointer transition"
                        >
                          ✖ Deletar
                        </button>
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
  );
};
