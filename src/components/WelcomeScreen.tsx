import React from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";

interface WelcomeScreenProps {
  lang: "pt" | "en" | "es";
  setLang: (l: "pt" | "en" | "es") => void;
  onEnter: () => void;
  logo: string;
}

export function WelcomeScreen({ lang, setLang, onEnter, logo }: WelcomeScreenProps) {
  // Translations specifically for the Welcome experience
  const text = {
    pt: {
      curation: "Acervo de Curadoria Underground & Clássicos",
    },
    en: {
      curation: "Curated Underground & Classic Archives",
    },
    es: {
      curation: "Archivo de Curaduría Underground y Clásicos",
    }
  }[lang];

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-stone-200 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
      
      {/* Extreme Visual Lightning Accents & Red Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-red-900/10 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-red-950/20 rounded-full filter blur-[140px] pointer-events-none z-0"></div>

      {/* Floating Sparks Animation in Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "0%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              y: ["0vh", "-100vh"],
              x: ["0px", `${(Math.random() - 0.5) * 60}px`],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Outer Gothic-Metal Frame */}
      <div className="absolute inset-4 border border-neutral-900/60 pointer-events-none rounded-2xl z-20">
      </div>

      {/* Content Center Card */}
      <div className="z-10 max-w-xl w-full px-6 py-10 flex flex-col items-center text-center space-y-8">
        
        {/* Visual Animation Stage */}
        <div className="relative flex items-center justify-center">
          
          {/* Animated Glowing Sun-Wheel / Circular Spikes */}
          <motion.div
            className="absolute w-52 h-52 border-2 border-dashed border-red-900/30 rounded-full pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute w-44 h-44 border border-red-600/20 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.08, 1], rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Symmetrical Pointy Horns Behind Logo */}
          <div className="absolute w-60 h-60 flex items-center justify-center opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full text-red-600 animate-pulse">
              <path d="M50,15 C52,25 62,35 75,35 C65,40 55,42 50,55 C45,42 35,40 25,35 C38,35 48,25 50,15 Z" fill="currentColor" />
              <path d="M50,85 C52,75 62,65 75,65 C65,60 55,58 50,45 C45,58 35,60 25,65 C38,65 48,75 50,85 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Actual Portal Brand Logo */}
          <motion.div 
            className="relative w-32 h-32 rounded-2xl bg-black border-2 border-red-600/80 p-1 overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.25)]"
            whileHover={{ scale: 1.05, borderColor: "#ef4444" }}
            animate={{
              boxShadow: [
                "0 0 25px rgba(220,38,38,0.2)",
                "0 0 45px rgba(220,38,38,0.45)",
                "0 0 25px rgba(220,38,38,0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img src={logo} className="w-full h-full object-cover rounded-xl" alt="Metal Catalog Logo" />
            
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>

        {/* Title & Subtitle Info */}
        <div className="space-y-3">
          <motion.h1 
            className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase filter drop-shadow-[0_4px_15px_rgba(239,68,68,0.3)] font-mono"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            METAL <span className="text-red-600">CATALOG</span>
          </motion.h1>

          <div className="flex items-center justify-center gap-1.5 pt-1.5">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
              {text.curation}
            </span>
          </div>
        </div>

        {/* Enter Templo Button */}
        <div className="w-full max-w-sm pt-2 space-y-4">
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-mono uppercase text-xs tracking-widest font-black py-4 px-6 rounded-xl cursor-pointer border border-red-500/30 shadow-[0_4px_30px_rgba(185,28,28,0.25)] hover:shadow-[0_4px_40px_rgba(220,38,38,0.45)] transition duration-150 flex items-center justify-center gap-1.5"
          >
            <span className="text-sm tracking-widest">
              {lang === "en" ? "Enter" : "Entrar"}
            </span>
          </motion.button>
        </div>

        {/* Welcome Languages Selector */}
        <div className="pt-6 border-t border-neutral-900/60 w-56 flex flex-col items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
            <Globe size={11} />
            <span>Idioma / Language / Idioma</span>
          </div>
          <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-850 justify-between w-full">
            <button
              onClick={() => setLang("pt")}
              className={`flex-1 py-1.5 text-[9.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "pt" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-300"}`}
            >
              PT
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex-1 py-1.5 text-[9.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "en" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-300"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`flex-1 py-1.5 text-[9.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "es" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-300"}`}
            >
              ES
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
