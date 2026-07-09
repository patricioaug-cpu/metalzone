import React, { useState } from "react";
import { translations } from "../translations";
import { Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react";

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
          a: "Toda a inserção de novos conteúdos (bandas, festivais e shows de metal) é realizada entrando em contato direto com o desenvolvedor por e-mail ou WhatsApp!"
        },
        {
          q: "Quem gerencia e aprova as bandas no catálogo?",
          a: "O desenvolvedor e administrador (patricioaug@gmail.com) gerencia toda a base de dados de forma oficial, garantindo a qualidade e veracidade das informações inseridas."
        }
      ];
    } else if (lang === "es") {
      return [
        {
          q: "¿Cómo registro nuevas bandas, festivales o conciertos?",
          a: "¡Todo el ingreso de nuevo contenido (bandas, festivales y conciertos de metal) se realiza contactando directamente al desarrollador por correo electrónico o WhatsApp!"
        },
        {
          q: "¿Quién administra o aprueba las peticiones en el catálogo?",
          a: "El administrador y desarrollador (patricioaug@gmail.com) cuenta con poderes para moderar o publicar nuevos elementos, manteniendo el orden de la plataforma."
        }
      ];
    } else {
      return [
        {
          q: "How do I register new bands, festivals, or shows?",
          a: "All new entries (bands, festivals, and concerts) are registered by contacting the developer directly via email or WhatsApp!"
        },
        {
          q: "Who moderates and approves the catalog database?",
          a: "The supreme developer and administrator (patricioaug@gmail.com) curates, revises, and updates the entire database content officially."
        }
      ];
    }
  };

  return (
    <div id="help-section-wrapper" className="space-y-4">
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

        {/* Contact direct with Developer */}
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
        </div>
      </div>
    </div>
  );
};
