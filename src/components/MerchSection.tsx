import React, { useState } from "react";
import { MerchItem } from "../firebase";
import { translations } from "../translations";
import { User } from "firebase/auth";
import { ShoppingBag, Plus, Trash2, Send, ExternalLink } from "lucide-react";

interface MerchSectionProps {
  merch: MerchItem[];
  user: User | null;
  lang: "pt" | "en" | "es";
  onAddMerch: (item: Omit<MerchItem, "id">) => Promise<boolean>;
  onDeleteMerch: (id: string) => Promise<void>;
}

export const MerchSection: React.FC<MerchSectionProps> = ({
  merch,
  user,
  lang,
  onAddMerch,
  onDeleteMerch
}) => {
  const t = translations[lang];
  const isAdmin = user?.email === "patricioaug@gmail.com";

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState(50);
  const [formImage, setFormImage] = useState("");
  const [formPurchaseLink, setFormPurchaseLink] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formTitle || !formPrice) {
      setFormError("Title and Price are mandatory.");
      return;
    }

    const defaultPurchaseLink = `https://wa.me/5531973267529?text=Quero%20comprar%20o%20item%20${encodeURIComponent(formTitle)}`;

    const payload: Omit<MerchItem, "id"> = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      price: Number(formPrice),
      imageUrl: formImage.trim() || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
      purchaseLink: formPurchaseLink.trim() || defaultPurchaseLink
    };

    const success = await onAddMerch(payload);
    if (success) {
      setFormTitle("");
      setFormDesc("");
      setFormPrice(50);
      setFormImage("");
      setFormPurchaseLink("");
      setShowForm(false);
    }
  };

  return (
    <div id="merch-section-wrapper" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-mono">
            <ShoppingBag className="text-red-500" />
            {t.navMerch}
          </h2>
          <p className="text-xs text-neutral-400">
            {t.merchSubtitle}
          </p>
        </div>

        {isAdmin && (
          <button
            id="btn-add-merch"
            onClick={() => {
              setShowForm(!showForm);
              setFormError("");
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-950 to-neutral-900 border border-red-800/40 hover:from-red-900 text-white font-mono text-xs font-bold rounded-lg uppercase tracking-widest flex items-center gap-2"
          >
            <Plus size={14} />
            {t.submitMerchTitle}
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-red-500 uppercase tracking-widest border-b border-neutral-850 pb-2">
            👕 Adicionar Novo Item de Merchandising
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Título do Item *</label>
              <input
                type="text"
                placeholder="Ex: Camiseta Metal Catalog Vintage"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={formPrice}
                onChange={(e) => setFormPrice(Number(e.target.value))}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">URL da Imagem do Produto</label>
              <input
                type="url"
                placeholder="https://..."
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Link de Compra Direto (WhatsApp/Loja)</label>
              <input
                type="url"
                placeholder="Deixe em branco para compras automáticas para WhatsApp de Patrício"
                value={formPurchaseLink}
                onChange={(e) => setFormPurchaseLink(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 font-mono block mb-1 uppercase">Descrição Detalhada do Produto</label>
            <textarea
              rows={3}
              placeholder="Algodão orgânico escovado, estampas góticas..."
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600"
            />
          </div>

          {formError && <p className="text-xs text-red-500 font-mono">⚠️ {formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 bg-neutral-800 text-neutral-300 text-xs font-mono rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-900 hover:bg-red-850 text-white text-xs font-mono font-bold rounded"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      )}

      {/* MERCHANDISING LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merch.map(item => (
          <div
            key={item.id}
            id={`merch-card-${item.id}`}
            className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col justify-between hover:border-red-950 transition duration-300 group shadow-lg overflow-hidden relative"
          >
            <div className="absolute top-2 right-2 z-10">
              {isAdmin && (
                <button
                  onClick={() => item.id && onDeleteMerch(item.id)}
                  className="bg-neutral-950 hover:bg-red-950 text-neutral-500 hover:text-red-400 p-1.5 rounded-full transition shadow-md"
                  title="Deletar Item de Merch"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            <div>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-850 mb-4 flex items-center justify-center relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-red-950 border border-red-800/60 px-2.5 py-0.5 rounded font-mono text-xs font-bold text-white shadow-md">
                  R$ {item.price.toFixed(2)}
                </div>
              </div>

              <h3 className="text-md font-bold text-white font-mono group-hover:text-red-500 transition mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-medium line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="mt-5">
              <a
                href={item.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-red-950 hover:bg-red-900 border border-red-800/40 hover:border-red-800 text-white font-mono text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <ShoppingBag size={14} />
                {t.buyMerchBtn}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
