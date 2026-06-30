import React, { useState } from "react";
import { 
  signOut,
  User
} from "firebase/auth";
import { translations } from "../translations";
import { ShieldAlert, LogOut, Mail } from "lucide-react";

interface AuthSectionProps {
  user: User | null;
  onAuthChange: (user: User | null, isGuest: boolean) => void;
  lang: "pt" | "en" | "es";
  isGuest: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ user, onAuthChange, lang, isGuest }) => {
  const t = translations[lang];
  
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleInstantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg(
        lang === "pt" 
          ? "Por favor, digite um endereço de e-mail válido." 
          : lang === "es"
          ? "Por favor, introduzca un correo electrónico válido."
          : "Please enter a valid email address."
      );
      return;
    }

    const email = emailInput.trim().toLowerCase();
    if (!email.includes("@")) {
      setErrorMsg(
        lang === "pt"
          ? "Formato de e-mail inválido."
          : lang === "es"
          ? "Formato de correo inválido."
          : "Invalid email format."
      );
      return;
    }

    setLoading(true);
    resetFields();

    try {
      // Create a clean mock user profile so the catalog features and Admin approvals are fully functional
      const mockUser = {
        email: email,
        uid: "user_" + email.replace(/[^a-z0-9]/g, ""),
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: []
      } as unknown as User;

      onAuthChange(mockUser, false);
      setSuccessMsg(t.authSuccessMsg);
    } catch (err: any) {
      setErrorMsg(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    onAuthChange(null, false);
    resetFields();
    setEmailInput("");
  };

  const toggleGuestMode = () => {
    onAuthChange(null, true);
    resetFields();
  };

  const isAdmin = user?.email === "patricioaug@gmail.com";

  if (user) {
    return (
      <div id="auth-panel-logged" className="bg-neutral-900 border border-red-900/30 p-6 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-950/20 rounded-full filter blur-xl"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-sm text-neutral-400 uppercase tracking-widest font-mono">
                {lang === "pt" ? "Membro Autenticado" : lang === "es" ? "Miembro Autenticado" : "Authenticated Member"}
              </p>
            </div>
            <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              {user.email}
              {isAdmin && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-mono font-bold uppercase animate-pulse">
                  MASTER ADMIN
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {lang === "pt" 
                ? "Acesso total aos recursos do catálogo principal." 
                : lang === "es"
                ? "Acceso total a los recursos del catálogo principal."
                : "Full access to global rock catalog resources."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              id="btn-signout"
              onClick={handleSignOut}
              className="px-4 py-2 bg-gradient-to-r from-red-900 to-amber-900 hover:from-red-800 hover:to-amber-800 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow"
            >
              <LogOut size={14} />
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user && isGuest) {
    return null;
  }

  return (
    <div id="auth-panel-anonymous" className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl relative overflow-hidden max-w-lg mx-auto">
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-950/10 rounded-full filter blur-3xl"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider font-mono mb-2">
          {lang === "pt" ? "Acessar o Metal Catalog" : lang === "es" ? "Acceder a Metal Catalog" : "Access Metal Catalog"}
        </h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
          {lang === "pt"
            ? "Insira seu e-mail para propor bandas, interagir com o catálogo, gerenciar aprovações e usufruir de recursos avançados."
            : lang === "es"
            ? "Ingrese su correo para proponer bandas, interactuar con el catálogo, gestionar aprobaciones y disfrutar de funciones avanzadas."
            : "Enter your email to submit bands, interact with the catalog, manage approvals, and enjoy advanced features."}
        </p>
      </div>

      <form onSubmit={handleInstantLogin} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-widest font-mono text-zinc-400 mb-1.5">
            {lang === "pt" ? "Endereço de E-mail" : lang === "es" ? "Dirección de Correo" : "Email Address"}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
              <Mail size={16} />
            </span>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="seu-email@exemplo.com"
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg text-sm font-sans tracking-wide transition-all duration-300 shadow-xl disabled:opacity-50 cursor-pointer"
        >
          {loading 
            ? (lang === "pt" ? "Acessando..." : lang === "es" ? "Accediendo..." : "Accessing...") 
            : (lang === "pt" ? "Acessar Catálogo" : lang === "es" ? "Acceder al Catálogo" : "Access Catalog")}
        </button>

        <div className="flex items-center my-4">
          <div className="grow border-t border-neutral-800"></div>
          <span className="mx-3 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
            {lang === "pt" ? "ou" : lang === "es" ? "o" : "or"}
          </span>
          <div className="grow border-t border-neutral-800"></div>
        </div>

        <button
          type="button"
          onClick={toggleGuestMode}
          className="w-full bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-300 font-mono py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          🎸 {t.guestModeBtn}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-950/40 border border-red-900/50 rounded flex gap-2 items-center">
          <ShieldAlert className="text-red-500 shrink-0" size={16} />
          <p className="text-[11px] text-red-200 font-mono leading-tight">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-950/50 rounded flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <p className="text-[11px] text-emerald-200 font-mono leading-tight">{successMsg}</p>
        </div>
      )}
    </div>
  );
};
