import React, { useState } from "react";
import { NewsItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { Newspaper, Plus, Trash2, Calendar, CheckCircle } from "lucide-react";

interface NewsSectionProps {
  news: NewsItem[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onAddNews: (item: Omit<NewsItem, "id">) => Promise<boolean>;
  onDeleteNews: (id: string) => Promise<void>;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  user,
  lang,
  onAddNews,
  onDeleteNews
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";
  const isLogged = true;

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formError, setFormError] = useState("");

  const filteredNews = news.filter(item => {
    const isApproved = item.approved;
    const isSubmittedByMe = user && item.submittedBy === user.uid;
    return isApproved || isAdmin || isSubmittedByMe;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle || !formContent) {
      setFormError(lang === "pt" ? "Título e conteúdo são obrigatórios!" : "Title and content are required!");
      return;
    }

    const payload: Omit<NewsItem, "id"> = {
      title: typeof formTitle === "string" ? formTitle.trim() : { [lang]: formTitle },
      content: typeof formContent === "string" ? formContent.trim() : { [lang]: formContent },
      imageUrl: formImageUrl.trim() || undefined,
      approved: isAdmin,
      submittedBy: user?.uid || "guest"
    };

    const success = await onAddNews(payload);
    if (success) {
      setFormTitle("");
      setFormContent("");
      setFormImageUrl("");
      setShowForm(false);
    }
  };

  return (
    <div id="news-section-wrapper" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
            <Newspaper className="text-amber-500" />
            {t.newsTab}
          </h2>
          <p className="text-xs text-neutral-400">
            {lang === "pt" 
              ? "Confira os últimos lançamentos de álbuns, notícias e turnês internacionais em primeira mão." 
              : "Witness direct news on extreme music events, single drops, and album releases."}
          </p>
        </div>

        {isLogged && (
          <button
            id="btn-register-news"
            onClick={() => {
              setShowForm(!showForm);
              setFormError("");
            }}
            className="px-4 py-2 border border-amber-900/40 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-widest flex items-center gap-2 transition"
          >
            <Plus size={14} />
            {t.submitNewsTitle}
          </button>
        )}
      </div>

      {showForm && isLogged && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-850 p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-amber-500 border-b border-neutral-800 pb-2">
            ✒️ {t.submitNewsTitle}
          </h3>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Título da Notícia *</label>
            <input
              type="text"
              placeholder="Ex: Novo single do Iron Maiden lançado!"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">URL de Imagem de Destaque</label>
            <input
              type="url"
              placeholder="https://..."
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Conteúdo do Artigo *</label>
            <textarea
              rows={5}
              placeholder="Escreva os detalhes da turnê ou do lançamento do CD..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none"
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
              className="px-4 py-1.5 bg-amber-800 hover:bg-amber-700 text-white text-xs font-mono font-bold rounded shadow-lg"
            >
              🚀 {t.saveBtn}
            </button>
          </div>
        </form>
      )}

      {filteredNews.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
          <p className="text-sm text-neutral-500 font-mono">{t.noNewsFound}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNews.map(item => {
            const hasBanner = !!item.imageUrl;
            const titleStr = typeof item.title === "string" ? item.title : (item.title[lang] || item.title["en"] || "");
            const contentStr = typeof item.content === "string" ? item.content : (item.content[lang] || item.content["en"] || "");

            return (
              <div
                key={item.id}
                id={`news-card-${item.id}`}
                className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col md:flex-row gap-5 items-start justify-between transition group"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start flex-1">
                  {hasBanner ? (
                    <img
                      src={item.imageUrl}
                      alt="News Banner"
                      className="w-full md:w-36 h-28 object-cover rounded-lg border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full md:w-36 h-28 bg-neutral-950 rounded-lg flex flex-col items-center justify-center text-xs text-neutral-500 font-mono shrink-0 border border-neutral-850">
                      🖤 NEWS
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-amber-500 font-mono border border-amber-950 bg-amber-950/20 px-2 py-0.5 rounded uppercase">
                        Heavy Metal
                      </span>
                      {!item.approved && (
                        <span className="bg-amber-950 border border-amber-800 text-amber-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-mono">
                          {lang === "pt" ? "Pendente" : "Pending"}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-md font-bold text-white group-hover:text-amber-400 transition font-mono">
                      {titleStr}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
                      {contentStr}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => item.id && onDeleteNews(item.id)}
                    className="p-1.5 p-2 bg-neutral-950 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 rounded-lg shrink-0 transition"
                    title={t.deleteBtn}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
