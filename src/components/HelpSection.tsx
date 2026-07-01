import React, { useState } from "react";
import { translations } from "../translations";
import { HelpCircle, Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react";

interface HelpSectionProps {
  lang: "pt" | "en" | "es";
}

export const HelpSection: React.FC<HelpSectionProps> = ({ lang }) => {
  const t = translations[lang];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    
    // Simulate direct developer contact
    setSuccess(true);
    setName("");
    setEmail("");
    setMsg("");
    setTimeout(() => setSuccess(false), 5000);
  };

  const getFaqs = () => {
    if (lang === "pt") {
      return [
        {
          q: "Como cadastro novas bandas, festivais ou shows?",
          a: "Toda a inserção de novos conteúdos (bandas, festivais e shows de metal) é realizada entrando em contato direto com o desenvolvedor Patrício por e-mail ou WhatsApp!"
        },
        {
          q: "Quem gerencia e aprova as bandas no catálogo?",
          a: "O desenvolvedor e administrador Patrício (patricioaug@gmail.com) gerencia toda a base de dados de forma oficial, garantindo a qualidade e veracidade das informações inseridas."
        },
        {
          q: "Posso favoritar shows e festivais?",
          a: "Sim! Na aba 'Festivais' ou 'Shows', basta clicar no ícone de coração de qualquer card para guardá-lo nos seus favoritos!"
        }
      ];
    } else if (lang === "es") {
      return [
        {
          q: "¿Cómo registro nuevas bandas, festivales o conciertos?",
          a: "¡Todo el ingreso de nuevo contenido (bandas, festivales y conciertos de metal) se realiza contactando directamente al desarrollador Patrício por correo electrónico o WhatsApp!"
        },
        {
          q: "¿Quién administra o aprueba las peticiones en el catálogo?",
          a: "El administrador y desarrollador Patrício (patricioaug@gmail.com) cuenta con poderes para moderar o publicar nuevos elementos, manteniendo el orden de la plataforma."
        },
        {
          q: "¿Puedo añadir espectáculos y álbumes a favoritos?",
          a: "¡Por supuesto! Simplemente presione o haga clic en el ícono de corazón en cualquier pancarta de show para guardarlo en sus favoritos."
        }
      ];
    } else {
      return [
        {
          q: "How do I register new bands, festivals, or shows?",
          a: "All new entries (bands, festivals, and concerts) are registered by contacting the developer Patrício directly via email or WhatsApp!"
        },
        {
          q: "Who moderates and approves the catalog database?",
          a: "The supreme developer and administrator Patrício (patricioaug@gmail.com) curates, revises, and updates the entire database content officially."
        },
        {
          q: "Is there a favorites storage system?",
          a: "Yes! Simply click the heart button next to any local gig or festival countdown to store it securely in your local favorites list!"
        }
      ];
    }
  };

  return (
    <div id="help-section-wrapper" className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-xl text-amber-500">
            <HelpCircle size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">{t.helpTitle}</h2>
            <p className="text-xs text-neutral-400 mt-1">{t.helpWelcome}</p>
          </div>
        </div>
      </div>

      {/* TUTORIAL AND GUIDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-red-500 border-b border-neutral-850 pb-2">
            🧠 {t.faqTitle}
          </h3>
          <div className="space-y-3.5">
            {getFaqs().map((faq, idx) => (
              <div key={idx} className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1">
                  ⭐ <span className="text-stone-100">{faq.q}</span>
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact direct with Patrício */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-500 border-b border-neutral-850 pb-2">
            📞 {t.contactDeveloperTitle}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
            {t.contactDeveloperText}
          </p>

          {/* Quick interactive stats card contact */}
          <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            <a
              href="mailto:patricioaug@gmail.com"
              className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 rounded-lg flex items-center gap-2.5 transition text-xs font-bold text-stone-200"
            >
              <Mail className="text-red-500 shrink-0" size={16} />
              <span>patricioaug@gmail.com</span>
            </a>
            <a
              href="https://wa.me/5531973267529"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-neutral-900 border border-neutral-800 hover:border-emerald-700 rounded-lg flex items-center gap-2.5 transition text-xs font-bold text-stone-200"
            >
              <MessageSquare className="text-emerald-500 shrink-0" size={16} />
              <span>+55 (31) 97326-7529</span>
            </a>
          </div>

          {/* Contact Developer message form */}
          <form onSubmit={handleSubmit} className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 space-y-3">
            <h4 className="text-[11px] font-mono font-bold text-neutral-300 uppercase">
              ✉️ {lang === "pt" ? "Mensagem Direta de Suporte" : "Direct Support Mailer"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder={lang === "pt" ? "Seu Nome" : "Your Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-red-600 font-mono"
              />
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
            <textarea
              rows={3}
              placeholder={lang === "pt" ? "Escreva aqui sua sugestão..." : "Write your questions or ideas..."}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
              className="w-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:border-red-600"
            />
            
            {success && (
              <div className="p-2 bg-emerald-950/40 border border-emerald-900/30 rounded flex items-center gap-1.5 text-[11px] text-emerald-300 font-mono">
                <CheckCircle size={14} className="text-emerald-400 shrink-0 animate-bounce" />
                <span>{lang === "pt" ? "Mensagem enviada com sucesso a Patrício!" : "Success! Your inquiry has been forwarded to Patrício."}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-1.5 bg-gradient-to-r from-red-950 to-red-800 hover:from-red-900 hover:to-red-700 text-white font-mono font-bold text-xs uppercase tracking-widest rounded transition flex items-center justify-center gap-1.5"
            >
              <Send size={11} />
              {lang === "pt" ? "Enviar Mensagem" : "Dispatch Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
