import React from "react";
import { translations } from "../translations";
import { DollarSign, Landmark, Store, Award, TrendingUp, Sparkles, CheckCircle } from "lucide-react";

interface MonetizeSectionProps {
  lang: "pt" | "en" | "es";
}

export const MonetizeSection: React.FC<MonetizeSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const getMonetizeIdeas = () => {
    if (lang === "pt") {
      return [
        {
          title: "1. Destaque Patrocinado de Bandas (B2B)",
          desc: "Bandas independentes, assessores de imprensa e gravadoras pagam uma assinatura mensal para fixar seus novos álbuns, logotipos e clipes no topo do feed global da comunidade.",
          profit: "R$ 49,90 - R$ 199,00 por banda/mês",
          icon: <Award className="text-amber-500" size={20} />
        },
        {
          title: "2. Anúncios Altamente Segmentados",
          desc: "Anuncie serviços premium direcionados para o público exato: Lojas de instrumentos musicais, estúdios de gravação, escolas de canto, luthiers e marcas de vestuário headbanger.",
          profit: "R$ 50,00 por CPM de banner direcionado",
          icon: <TrendingUp className="text-rose-500" size={20} />
        },
        {
          title: "3. Loja de Merchandising do Canal (B2C)",
          desc: "Venda direta das camisas, copos e moletons oficiais da marca Metal Catalog ou taxas de intermediação de canecas, patches e broches de metal para parceiros no Brasil.",
          profit: "30% a 50% de margem no vestuário de algodão sustentável",
          icon: <Store className="text-emerald-500" size={20} />
        },
        {
          title: "4. Conteúdo por Assinatura Premium (Paywall)",
          desc: "Entrevistas completas de bastidores, transmissões exclusivas com ícones do trash/death metal e cupons de descontos para grandes shows para membros apoiadores.",
          profit: "R$ 9,90 por mês de assinatura do legionário",
          icon: <Sparkles className="text-blue-500" size={20} />
        },
        {
          title: "5. Programa de Afiliados para Ingressos",
          desc: "Faça parceria com grandes tiqueteiras como Sympla, Eventim ou Ticketmaster para receber comissões automáticas para cada ingresso de show ou festival comprado clicando no botão do aplicativo.",
          profit: "3% a 7% de comissão por ticket vendido",
          icon: <Landmark className="text-indigo-400" size={20} />
        }
      ];
    } else if (lang === "es") {
      return [
        {
          title: "1. Promoción B2B de Bandas",
          desc: "Las agrupaciones de metal pagan un abono por destacar sus lanzamientos, portadas y fechas de conciertos en la cabecera mundial de la aplicación.",
          profit: "USD 15 - USD 50 mensuales por banda",
          icon: <Award className="text-amber-500" size={20} />
        },
        {
          title: "2. Anuncios Segmentados de Equipos",
          desc: "Banners específicos y reseñas patrocinadas para escuelas de música, fabricantes de guitarras, talleres de luthier y tiendas de ropa gótica.",
          profit: "Modelos CPM directos con auspiciantes premium",
          icon: <TrendingUp className="text-rose-500" size={20} />
        },
        {
          title: "3. Merchandising Exclusivo (WhatsApp)",
          desc: "Cobro directo de mercancía oficial de Metal Catalog o productos coleccionables de edición limitada con envíos garantizados.",
          profit: "Altas ganancias con preventas de parches y accesorios",
          icon: <Store className="text-emerald-500" size={20} />
        },
        {
          title: "4. Acceso VIP Premium",
          desc: "Sección exclusiva de entrevistas completas y descargas de álbumes en formato de alta fidelidad para fanáticos legionarios.",
          profit: "USD 2.99 / membresía mensual",
          icon: <Sparkles className="text-blue-500" size={20} />
        }
      ];
    } else {
      return [
        {
          title: "1. B2B Band Promotion Spotlights",
          desc: "Extreme metal artists and labels pay a recurring subscription to promote their latest EPs, singles, and contact channels on top grids.",
          profit: "$15.00 - $60.00 / monthly billing",
          icon: <Award className="text-amber-500" size={20} />
        },
        {
          title: "2. High-Yield Target Advertisements",
          desc: "Highly target placements for boutique synth developers, guitar lesson platforms, luthiers, instrument shops, and metal festivals.",
          profit: "Direct B2B deals with instrument brands",
          icon: <TrendingUp className="text-rose-500" size={20} />
        },
        {
          title: "3. Interactive Merchandise Affiliation",
          desc: "Direct retail sales of Metal Catalog classic street tees, hoods, and steel wristbands integrated with live checkouts.",
          profit: "Custom printed high-margin physical goodies",
          icon: <Store className="text-emerald-500" size={20} />
        },
        {
          title: "4. Premium Supporter Paywall",
          desc: "Ad-free browsing, full long-form interviews, exclusive concert setlist access, and high-fidelity band timelines.",
          profit: "$2.99 / support month",
          icon: <Sparkles className="text-blue-500" size={20} />
        }
      ];
    }
  };

  return (
    <div id="monetize-section-wrapper" className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl text-emerald-500">
            <DollarSign size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">{t.monetizeTitle}</h2>
            <p className="text-xs text-neutral-400 mt-1">{t.monetizeSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-xl font-mono text-xs text-emerald-200">
        💡 {t.monetizeIntro}
      </div>

      {/* BEN-TO SYSTEM GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getMonetizeIdeas().map((idea, idx) => (
          <div
            key={idx}
            className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-xl hover:border-emerald-950 transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="p-2 bg-neutral-950 border border-neutral-850 rounded-lg">
                  {idea.icon}
                </span>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded uppercase font-bold">
                  B2B Hub
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono leading-tight">
                {idea.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans font-medium">
                {idea.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-850/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-500 uppercase">{lang === "pt" ? "Est. Lucro" : "Est. Profit"}</span>
              <span className="text-emerald-400 font-bold">{idea.profit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DIRECT DEVELOPER PROPOSAL BANNER FOR PATRICIO */}
      <div className="p-5 bg-neutral-950 border border-neutral-850 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1">
            🚀 {lang === "pt" ? "Pronto para decolar de forma mundial na Play Store?" : "Ready to launch globally on Play Store?"}
          </h4>
          <p className="text-[11px] text-neutral-400 max-w-xl font-sans font-medium">
            {lang === "pt"
              ? "Este aplicativo está totalmente estruturado e compatível com as diretrizes do Google Play Console. Use essas estratégias de monetização para transformar sua paixão por heavy metal em um aplicativo lucrativo!"
              : "This application conforms strictly to standard high-performance guidelines. Deploy seamlessly to play store and customize these direct monetization engines with your partners!"}
          </p>
        </div>
        <div className="shrink-0">
          <a
            href="https://wa.me/5531973267529?text=Patrício, quero patrocinar o Metal Catalog!"
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-mono text-xs font-black rounded-lg uppercase tracking-wide inline-flex items-center gap-1"
          >
            💬 WhatsApp Patrício
          </a>
        </div>
      </div>
    </div>
  );
};
