import React, { useState } from "react";
import { 
  auth, 
  db 
} from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updatePassword,
  signOut,
  User
} from "firebase/auth";
import { translations } from "../translations";
import { LogIn, UserPlus, Key, Mail, ShieldAlert, LogOut, Milestone, Eye, EyeOff } from "lucide-react";

interface AuthSectionProps {
  user: User | null;
  onAuthChange: (user: User | null, isGuest: boolean) => void;
  lang: "pt" | "en" | "es";
  isGuest: boolean;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ user, onAuthChange, lang, isGuest }) => {
  const t = translations[lang];
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "change">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const resetFields = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFields();
    if (!email || !password) {
      setErrorMsg(t.authErrorMsg);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      onAuthChange(userCredential.user, false);
      setSuccessMsg(t.authSuccessMsg);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t.authErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFields();
    if (password !== confirmPassword) {
      setErrorMsg(lang === "pt" ? "As senhas não coincidem!" : lang === "es" ? "¡Las contraseñas no coinciden!" : "Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      onAuthChange(userCredential.user, false);
      setSuccessMsg(t.authSuccessMsg);
      setMode("login");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || t.authErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFields();
    if (!email) {
      setErrorMsg(lang === "pt" ? "E-mail obrigatório." : "Email is required.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg(lang === "pt" ? "E-mail de recuperação enviado! Verifique sua caixa de entrada." : "Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setErrorMsg(err.message || t.authErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFields();
    if (!newPassword) {
      setErrorMsg(lang === "pt" ? "Digite a nova senha." : "Please type the new password.");
      return;
    }
    if (!auth.currentUser) {
      setErrorMsg(lang === "pt" ? "Você precisa estar logado para alterar a senha." : "You must be logged in to change your password.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMsg(lang === "pt" ? "Senha alterada com sucesso!" : "Password successfully updated!");
      setNewPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || t.authErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onAuthChange(null, false);
      resetFields();
    } catch (err) {
      console.error(err);
    }
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
                {lang === "pt" ? "Membro Autenticado" : "Authenticated Member"}
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
                ? "Acesso total aos recursos do portal principal." 
                : "Full access to global rock catalog resources."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              id="btn-goto-changepass"
              onClick={() => {
                setMode(mode === "change" ? "login" : "change");
                resetFields();
              }}
              className="px-3 py-2 text-xs font-medium border border-neutral-700 hover:border-neutral-500 text-neutral-300 rounded-lg transition-all font-mono"
            >
              🔑 {mode === "change" ? t.navBands : t.changePasswordLabel}
            </button>
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

        {mode === "change" && (
          <form onSubmit={handleChangePassword} className="mt-6 pt-6 border-t border-neutral-800/80 max-w-md">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 font-mono text-amber-500">
              {t.changePasswordLabel}
            </h4>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">{t.newPasswordLabel}</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-red-900 hover:bg-red-800 py-2 rounded text-white text-xs font-bold transition font-mono uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? t.refreshing : t.changePasswordBtn}
              </button>
            </div>
            {errorMsg && <p className="text-xs text-red-500 mt-2 font-mono">⚠️ {errorMsg}</p>}
            {successMsg && <p className="text-xs text-emerald-500 mt-2 font-mono">⚡ {successMsg}</p>}
          </form>
        )}
      </div>
    );
  }

  if (!user && isGuest) {
    return (
      <div id="auth-panel-guest-banner" className="bg-neutral-900 border border-neutral-850 p-4 rounded-xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-red-950/10 rounded-full filter blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 flex items-center justify-center shrink-0 border border-neutral-800 text-amber-500 font-bold text-xs">
            🤘
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === "pt" ? "Modo Visitante Ativo" : lang === "es" ? "Modo Invitado Activo" : "Guest Mode Active"}
            </p>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-normal">
              {lang === "pt" 
                ? "Você está navegando livremente pelo portal. Complete seu cadastro para propor novas bandas e sugerir shows!" 
                : lang === "es" 
                  ? "Estás navegando libremente por el portal. ¡Completa tu registro para proponer bandas y conciertos!" 
                  : "You are browsing the portal freely. Complete your registration to submit bands and suggest concerts!"}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAuthChange(null, false)}
          className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-mono rounded-lg transition-all font-bold tracking-wide cursor-pointer w-full sm:w-auto text-center shrink-0"
        >
          {lang === "pt" ? "🔑 Entrar ou Criar Conta" : lang === "es" ? "🔑 Entrar o Registrarse" : "🔑 Sign In / Sign Up"}
        </button>
      </div>
    );
  }

  return (
    <div id="auth-panel-anonymous" className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-red-950/10 rounded-full filter blur-3xl"></div>
      
      {/* Small selector for screens inside authentication */}
      <div className="flex gap-4 border-b border-neutral-800 pb-3 mb-5">
        <button
          onClick={() => { setMode("login"); resetFields(); }}
          className={`flex items-center gap-1 text-xs font-bold font-mono tracking-wider uppercase transition-all ${
            mode === "login" ? "text-red-500 border-b-2 border-red-500 pb-3 -mb-3.5" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <LogIn size={13} />
          {t.loginTitle}
        </button>
        <button
          onClick={() => { setMode("register"); resetFields(); }}
          className={`flex items-center gap-1 text-xs font-bold font-mono tracking-wider uppercase transition-all ${
            mode === "register" ? "text-red-500 border-b-2 border-red-500 pb-3 -mb-3.5" : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <UserPlus size={13} />
          {t.registerTitle}
        </button>
        {isGuest && (
          <span className="ml-auto bg-neutral-800 text-neutral-400 text-[10px] uppercase font-mono px-2.5 py-1 rounded-full flex items-center gap-1">
            <Milestone size={11} className="text-neutral-400" />
            {lang === "pt" ? "Modo Visitante Ativo" : "Visitor Mode Active"}
          </span>
        )}
      </div>

      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-mono">{t.emailLabel}</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-neutral-500"><Mail size={15} /></span>
              <input
                type="email"
                placeholder="you@metalmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 pl-9 pr-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-neutral-400 block uppercase font-mono">{t.passwordLabel}</label>
              <button
                type="button"
                onClick={() => { setMode("forgot"); resetFields(); }}
                className="text-[10px] text-amber-500 hover:underline font-mono"
              >
                {t.forgotPasswordLabel}
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-neutral-500"><Key size={15} /></span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 pl-9 pr-10 py-2 rounded focus:outline-none focus:border-red-600 font-mono tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-200"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-950 to-red-800 hover:from-red-900 hover:to-red-700 text-white font-bold py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xl shadow-red-950/20"
          >
            {loading ? t.refreshing : t.loginBtn}
          </button>
        </form>
      )}

      {mode === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-mono">{t.emailLabel}</label>
            <input
              type="email"
              placeholder="hellfire@metalmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-mono">{t.passwordLabel}</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="•••••••• (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono tracking-widest"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-mono">{t.confirmPasswordLabel}</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-neutral-800 to-red-900 hover:from-neutral-700 hover:to-red-800 text-white font-bold py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t.refreshing : t.registerBtn}
          </button>
        </form>
      )}

      {mode === "forgot" && (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            {lang === "pt" 
              ? "Digite o e-mail cadastrado. Um link de redefinição de senha seguro do Firebase será enviado para você." 
              : "Enter your registered email address. A secure recovery link will be sent directly to you."}
          </p>
          <div>
            <label className="text-xs text-neutral-400 block mb-1 uppercase font-mono">{t.emailLabel}</label>
            <input
              type="email"
              placeholder="your-forgotten@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 px-3 py-2 rounded focus:outline-none focus:border-red-600 font-mono"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded font-mono"
            >
              {loading ? t.refreshing : t.forgotPasswordBtn}
            </button>
            <button
              type="button"
              onClick={() => { setMode("login"); resetFields(); }}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs px-3 py-2 rounded font-mono"
            >
              {t.cancelBtn}
            </button>
          </div>
        </form>
      )}

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

      {!isGuest && mode === "login" && (
        <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500 mb-2 font-mono">
            {lang === "pt" ? "Deseja testar sem criar conta?" : "Want to try without creating an account?"}
          </p>
          <button
            type="button"
            onClick={toggleGuestMode}
            className="w-full bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-mono py-1.5 rounded text-[10px] uppercase transition-all tracking-wider"
          >
            🎸 {t.guestModeBtn}
          </button>
        </div>
      )}
    </div>
  );
};
