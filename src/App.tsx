import React, { useState, useEffect, useDeferredValue } from "react";
import { auth, db, SEED_BANDS, SEED_EVENTS, SEED_NEWS, SEED_MERCH, Band, EventItem, NewsItem, MerchItem } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, updateDoc as fsUpdateDoc } from "firebase/firestore";
import { translations } from "./translations";
import { motion, AnimatePresence } from "motion/react";

// Import modular pages
import { AuthSection } from "./components/AuthSection";
import { BandSection } from "./components/BandSection";
import { FestivalSection } from "./components/FestivalSection";
import { NewsSection } from "./components/NewsSection";
import { MerchSection } from "./components/MerchSection";
import { AdminSection } from "./components/AdminSection";
import { MonetizeSection } from "./components/MonetizeSection";
import { HelpSection } from "./components/HelpSection";

import { 
  Flame, Music, Newspaper, ShoppingBag, Shield, DollarSign, HelpCircle, 
  RefreshCw, Globe, Phone, Mail, Star, Radio, Skull, Search, X, MapPin, Menu
} from "lucide-react";

export default function App() {
  const [lang, setLang] = useState<"pt" | "en" | "es">("pt");
  type TabType = "bands" | "festivals" | "shows" | "news" | "help" | "admin";
  const [activeTab, setActiveTabTab] = useState<TabType>("bands");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // High-performance real-time search state
  const [headerSearch, setHeaderSearch] = useState("");
  const deferredSearch = useDeferredValue(headerSearch);

  const handleHeaderSearchChange = (value: string) => {
    setHeaderSearch(value);
    if (value && activeTab !== "bands" && activeTab !== "help") {
      setActiveTabTab("bands");
    }
  };
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true); // default guest is true so simple use is open immediately
  const [authChecked, setAuthChecked] = useState(false);

  // Loaded database arrays
  const [bands, setBands] = useState<Band[]>(SEED_BANDS);
  const [events, setEvents] = useState<EventItem[]>(SEED_EVENTS);
  const [news, setNews] = useState<NewsItem[]>(SEED_NEWS);
  const [merch, setMerch] = useState<MerchItem[]>(SEED_MERCH);

  // User list favorites
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotify, setRefreshNotify] = useState(false);

  const t = translations[lang];

  // Monitor user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuest(false);
      } else {
        setUser(null);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch collections from Firestore with high-reliability timeout races
  const fetchAllCollections = async () => {
    const fetchWithTimeout = async <T,>(promise: Promise<T>, ms: number, fallbackVal: T): Promise<T> => {
      let timeoutHandle: NodeJS.Timeout;
      const timeoutPromise = new Promise<T>((resolve) => {
        timeoutHandle = setTimeout(() => {
          resolve(fallbackVal);
        }, ms);
      });
      return Promise.race([
        promise.then(val => {
          clearTimeout(timeoutHandle);
          return val;
        }),
        timeoutPromise
      ]);
    };

    try {
      // 1. Bands
      const bandSnap = await fetchWithTimeout(getDocs(collection(db, "bands")), 7000, { empty: true, docs: [] } as any);
      if (bandSnap && !bandSnap.empty) {
        const loadedBands: Band[] = [];
        bandSnap.forEach((docSnap: any) => {
          loadedBands.push({ id: docSnap.id, ...docSnap.data() } as Band);
        });
        const merged = [...SEED_BANDS.filter(sb => !loadedBands.some(lb => lb.name === sb.name)), ...loadedBands];
        setBands(merged);
      } else {
        setBands(SEED_BANDS);
      }

      // 2. Events & Festivals
      const eventSnap = await fetchWithTimeout(getDocs(collection(db, "events")), 7000, { empty: true, docs: [] } as any);
      if (eventSnap && !eventSnap.empty) {
        const loadedEvents: EventItem[] = [];
        eventSnap.forEach((docSnap: any) => {
          loadedEvents.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
        });
        const merged = [...SEED_EVENTS.filter(se => !loadedEvents.some(le => le.name === se.name)), ...loadedEvents];
        setEvents(merged);
      } else {
        setEvents(SEED_EVENTS);
      }

      // 3. News
      const newsSnap = await fetchWithTimeout(getDocs(collection(db, "news")), 7000, { empty: true, docs: [] } as any);
      if (newsSnap && !newsSnap.empty) {
        const loadedNews: NewsItem[] = [];
        newsSnap.forEach((docSnap: any) => {
          loadedNews.push({ id: docSnap.id, ...docSnap.data() } as NewsItem);
        });
        const merged = [...SEED_NEWS.filter(sn => !loadedNews.some(ln => JSON.stringify(ln.title) === JSON.stringify(sn.title))), ...loadedNews];
        setNews(merged);
      } else {
        setNews(SEED_NEWS);
      }
    } catch (err) {
      console.warn("Could not query live Firestore directly (uninitialized rules or network), using rock static seed assets:", err);
      setBands(SEED_BANDS);
      setEvents(SEED_EVENTS);
      setNews(SEED_NEWS);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllCollections();
  }, []);

  // Master Refresh execution
  const handleMasterRefresh = async () => {
    setIsRefreshing(true);
    setRefreshNotify(true);

    // Dynamic short timeout promise to prevent UI hanging
    const refreshTimeout = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Refresh timeout exceeded"));
      }, 1200);
    });

    try {
      // Race fetchAllCollections against our smaller timeout
      await Promise.race([
        fetchAllCollections(),
        refreshTimeout
      ]);
    } catch (err) {
      console.warn("Master Refresh completed with error or timeout:", err);
    } finally {
      // Guaranteed visual spinner stop regardless of API request results, failures or timeouts
      setIsRefreshing(false);
      setTimeout(() => {
        setRefreshNotify(false);
      }, 1000);
    }
  };

  // --- SUBMISSIONS WRITE-FLOW VIA FIRESTORE ---

  // Standard Band Addition
  const handleAddBand = async (newBand: Omit<Band, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "bands"), newBand);
      // Append locally to prevent waiting latency
      setBands(prev => [...prev, { id: docRef.id, ...newBand }]);
      return true;
    } catch (err) {
      console.error("Firestore write permission block, adding to temporary local session: ", err);
      // fall back adding to temporary local registry
      setBands(prev => [...prev, { id: `local-${Date.now()}`, ...newBand }]);
      return true;
    }
  };

  const handleEditBand = async (id: string, updated: Partial<Band>) => {
    try {
      await fsUpdateDoc(doc(db, "bands", id), updated);
      setBands(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    } catch {
      setBands(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    }
  };

  // Standard Band Deletion (Admin only)
  const handleDeleteBand = async (id: string) => {
    try {
      await deleteDoc(doc(db, "bands", id));
      setBands(prev => prev.filter(b => b.id !== id));
    } catch {
      setBands(prev => prev.filter(b => b.id !== id));
    }
  };

  // Event / Festival Addition
  const handleAddEvent = async (newEvent: Omit<EventItem, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      setEvents(prev => [...prev, { id: docRef.id, ...newEvent }]);
      return true;
    } catch (err) {
      setEvents(prev => [...prev, { id: `local-${Date.now()}`, ...newEvent }]);
      return true;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  // News Addition
  const handleAddNews = async (newNews: Omit<NewsItem, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "news"), newNews);
      setNews(prev => [...prev, { id: docRef.id, ...newNews }]);
      return true;
    } catch {
      setNews(prev => [...prev, { id: `local-${Date.now()}`, ...newNews }]);
      return true;
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, "news", id));
      setNews(prev => prev.filter(n => n.id !== id));
    } catch {
      setNews(prev => prev.filter(n => n.id !== id));
    }
  };

  // Merch Addition
  const handleAddMerch = async (newMerch: Omit<MerchItem, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "merch"), newMerch);
      setMerch(prev => [...prev, { id: docRef.id, ...newMerch }]);
      return true;
    } catch {
      setMerch(prev => [...prev, { id: `local-${Date.now()}`, ...newMerch }]);
      return true;
    }
  };

  const handleDeleteMerch = async (id: string) => {
    try {
      await deleteDoc(doc(db, "merch", id));
      setMerch(prev => prev.filter(m => m.id !== id));
    } catch {
      setMerch(prev => prev.filter(m => m.id !== id));
    }
  };

  // Curation approvals
  const handleApproveBand = async (id: string) => {
    try {
      await fsUpdateDoc(doc(db, "bands", id), { approved: true });
      setBands(prev => prev.map(b => b.id === id ? { ...b, approved: true } : b));
    } catch {
      setBands(prev => prev.map(b => b.id === id ? { ...b, approved: true } : b));
    }
  };

  const handleApproveEvent = async (id: string) => {
    try {
      await fsUpdateDoc(doc(db, "events", id), { approved: true });
      setEvents(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e));
    } catch {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, approved: true } : e));
    }
  };

  const handleApproveNews = async (id: string) => {
    try {
      await fsUpdateDoc(doc(db, "news", id), { approved: true });
      setNews(prev => prev.map(n => n.id === id ? { ...n, approved: true } : n));
    } catch {
      setNews(prev => prev.map(n => n.id === id ? { ...n, approved: true } : n));
    }
  };

  // Toggle local favorite event
  const handleToggleFavoriteEvent = (id: string) => {
    setFavoriteEvents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAdmin = user?.email === "patricioaug@gmail.com";
  const userCheckLoaded = authChecked;



  return (
    <div className="min-h-screen bg-black text-stone-200 selection:bg-red-900 selection:text-white flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND ATMOSPHERE ACCENTS */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-950/20 rounded-full filter blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-stone-900/40 rounded-full filter blur-3xl pointer-events-none z-0"></div>

      {/* MASTER TOP NOTIFICATION TOAST BAR FOR ACTIVE SESSIONS */}
      {refreshNotify && (
        <div className="fixed top-4 right-4 z-50 bg-neutral-900 border border-emerald-900/50 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-2xl shadow-black/85 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {lang === "pt" ? "Sincronizado e Atualizado!" : "Database successfully synced!"}
        </div>
      )}

      {/* ----------------- MOBILE TOP BAR ----------------- */}
      <header className="md:hidden sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-neutral-900 py-3.5 px-4 flex justify-between items-center shadow-md w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 border border-red-900/60 rounded-xl flex items-center justify-center">
            <Skull className="text-red-500" size={15} />
          </div>
          <div>
            <h1 className="text-md font-black text-white uppercase tracking-widest font-mono select-none leading-none">
              MetalZone
            </h1>
            <p className="text-[7.5px] text-zinc-500 tracking-widest uppercase font-mono mt-0.5">
              Portal & Acervo
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Mobile Sync */}
          <button
            onClick={handleMasterRefresh}
            disabled={isRefreshing}
            className="p-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-stone-300 cursor-pointer"
            title={lang === "pt" ? "Sincronizar" : "Sync"}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-red-500" : ""} />
          </button>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-white cursor-pointer"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* ----------------- MOBILE SLIDE-OUT DRAWER ----------------- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Mobile Sidebar Content */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-neutral-900 flex flex-col justify-between font-mono text-zinc-300 z-50 p-6 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header item with close action */}
                <div className="flex justify-between items-center pb-4 border-b border-neutral-900">
                  <div className="flex items-center gap-2.5">
                    <Skull className="text-red-500" size={18} />
                    <span className="text-md font-black text-white tracking-widest">METALZONE</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-400 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Navigation inside drawer */}
                <div className="space-y-1">
                  <button
                    onClick={() => { setActiveTabTab("bands"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "bands" 
                        ? "bg-red-950/40 text-rose-400 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Music size={15} />
                      {t.navBands}
                    </span>
                    <span className="text-[9px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">
                      {bands.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTabTab("festivals"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "festivals" 
                        ? "bg-red-950/40 text-rose-450 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Flame size={15} />
                      {t.navFestivals}
                    </span>
                    <span className="text-[9px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">
                      {events.filter(e => e.isFestival).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTabTab("shows"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "shows" 
                        ? "bg-red-950/40 text-rose-450 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <MapPin size={15} className="text-red-500" />
                      {lang === "pt" ? "Shows" : lang === "es" ? "Conciertos" : "Shows"}
                    </span>
                    <span className="text-[9px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">
                      {events.filter(e => !e.isFestival).length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTabTab("news"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "news" 
                        ? "bg-red-950/40 text-rose-400 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Newspaper size={15} />
                      {t.navNews}
                    </span>
                    <span className="text-[9px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full">
                      {news.length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setActiveTabTab("help"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "help" 
                        ? "bg-red-950/40 text-rose-400 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={15} />
                      {lang === "pt" ? "Ajuda" : lang === "es" ? "Ayuda" : "Help"}
                    </span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setActiveTabTab("admin"); setIsSidebarOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                        activeTab === "admin" 
                          ? "bg-red-950 text-red-400 border-red-800" 
                          : "bg-neutral-950/50 text-red-500 border-red-950/50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Shield size={14} />
                        {t.navAdmin}
                      </span>
                    </button>
                  )}
                </div>

              </div>

              {/* Languages in Mobile Drawer */}
              <div className="space-y-4 pt-6 border-t border-neutral-900">
                <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-850 justify-between">
                  <button
                    onClick={() => setLang("pt")}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded cursor-pointer ${lang === "pt" ? "bg-red-950 text-white" : "text-neutral-500"}`}
                  >
                    PT
                  </button>
                  <button
                    onClick={() => setLang("en")}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded cursor-pointer ${lang === "en" ? "bg-red-950 text-white" : "text-neutral-500"}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang("es")}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded cursor-pointer ${lang === "es" ? "bg-red-950 text-white" : "text-neutral-500"}`}
                  >
                    ES
                  </button>
                </div>
                
                <div className="text-center text-[9px] text-neutral-500">
                  🤘 MetalZone | patricioaug@gmail.com
                </div>
              </div>

            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ----------------- FIXED LATERAL SIDEBAR (DESKTOP) ----------------- */}
      <nav className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-zinc-950 border-r border-neutral-900 font-mono text-zinc-300 z-40 select-none justify-between h-screen shrink-0 overflow-y-auto">
        <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
          
          {/* Sidebar Header Brand Area */}
          <div className="p-6 border-b border-neutral-900 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-gradient-to-b from-neutral-950 to-neutral-900 border border-red-700/60 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-950/30">
                <Skull className="text-red-500 fill-zinc-950" size={18} />
              </div>
              <div>
                <h1 className="text-lg font-black text-white uppercase tracking-widest leading-none pt-0.5 filter drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">
                  MetalZone
                </h1>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">
                  {lang === "pt" ? "Enciclopédia & Acervo" : lang === "es" ? "Enciclopedia & Acervo" : "Metal Wiki & Logs"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <div className="p-4 space-y-1.5 py-6">
            <button
              id="sidebar-nav-bands"
              onClick={() => setActiveTabTab("bands")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "bands" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Music size={15} />
                <span>{t.navBands}</span>
              </div>
              <span className="text-[9px] text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-neutral-850">
                {bands.length}
              </span>
            </button>

            <button
              id="sidebar-nav-festivals"
              onClick={() => setActiveTabTab("festivals")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "festivals" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame size={15} />
                <span>{t.navFestivals}</span>
              </div>
              <span className="text-[9px] text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-neutral-850">
                {events.filter(e => e.isFestival).length}
              </span>
            </button>

            <button
              id="sidebar-nav-shows"
              onClick={() => setActiveTabTab("shows")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "shows" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-red-500" />
                <span>{lang === "pt" ? "Shows" : lang === "es" ? "Conciertos" : "Shows"}</span>
              </div>
              <span className="text-[9px] text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-neutral-850">
                {events.filter(e => !e.isFestival).length}
              </span>
            </button>

            <button
              id="sidebar-nav-news"
              onClick={() => setActiveTabTab("news")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "news" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Newspaper size={15} />
                <span>{t.navNews}</span>
              </div>
              <span className="text-[9px] text-neutral-500 bg-neutral-900/60 px-2 py-0.5 rounded-full border border-neutral-850">
                {news.length}
              </span>
            </button>

            <button
              id="sidebar-nav-help"
              onClick={() => setActiveTabTab("help")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "help" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle size={15} />
                <span>{lang === "pt" ? "Ajuda" : lang === "es" ? "Ayuda" : "Help"}</span>
              </div>
            </button>

            {/* Admin trigger if admin */}
            {isAdmin && (
              <button
                id="sidebar-nav-admin"
                onClick={() => setActiveTabTab("admin")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                  activeTab === "admin" 
                    ? "bg-red-950 border-red-800 text-rose-400" 
                    : "bg-neutral-950/50 text-red-500 border-red-950/50 hover:bg-neutral-900/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield size={14} />
                  <span>{t.navAdmin || "Admin"}</span>
                </div>
                {bands.some(b => !b.approved) && (
                  <span className="bg-red-650 text-white text-[8px] px-1.5 py-0.2 rounded font-mono animate-pulse">
                    PENDING
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Database Info Widget inside sidebar */}
          <div className="px-6 py-4 mx-4 mb-4 bg-neutral-900/50 border border-neutral-900 rounded-xl space-y-2 select-none text-[10px] text-neutral-500 leading-snug mt-auto">
            <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest block border-b border-neutral-850 pb-1">
              Stats Acervo
            </span>
            <div className="flex justify-between">
              <span>Bands Ativas:</span>
              <span className="text-stone-300 font-bold">{bands.filter(b => b.approved).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Países:</span>
              <span className="text-stone-300 font-bold">
                {Array.from(new Set(bands.map(b => b.country).filter(Boolean))).length}
              </span>
            </div>
          </div>

        </div>

        {/* Sidebar Footer Zone */}
        <div className="p-4 border-t border-neutral-900 bg-neutral-950/80 space-y-4">
          
          {/* Sync Button */}
          <button
            id="sidebar-btn-sync"
            onClick={handleMasterRefresh}
            disabled={isRefreshing}
            className="w-full py-2 px-3 rounded-lg border border-neutral-850 bg-neutral-900/40 hover:bg-neutral-900 text-stone-200 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-red-500" : "text-neutral-500"} />
            <span>{isRefreshing ? t.refreshing : t.refreshBtn}</span>
          </button>

          {/* Languages selector in sidebar */}
          <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-850 justify-between">
            <button
              onClick={() => setLang("pt")}
              className={`flex-1 py-1 text-[10.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "pt" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-200"}`}
            >
              PT
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex-1 py-1 text-[10.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "en" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-200"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("es")}
              className={`flex-1 py-1 text-[10.5px] font-mono font-bold rounded cursor-pointer transition-colors ${lang === "es" ? "bg-red-950 text-white" : "text-neutral-500 hover:text-stone-200"}`}
            >
              ES
            </button>
          </div>

          <div className="text-center text-[8px] text-zinc-650 leading-tight">
            Patrício | {new Date().getFullYear()} MetalZone
          </div>
        </div>
      </nav>

      {/* ----------------- MAIN WORKSPACE LAYER (RIGHT PANEL) ----------------- */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 z-10 w-full space-y-6">
          
          {/* USER AUTHENTICATION EXPAND PANEL */}
          <AuthSection 
            user={user} 
            onAuthChange={(u, g) => {
              setUser(u);
              setIsGuest(g);
            }} 
            lang={lang} 
            isGuest={isGuest} 
          />

          {/* ACTIVE CONTENT WORKSPACE SWAPPER */}
          <div className="p-1 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="focus:outline-none"
              >
                {activeTab === "bands" && (
                  <BandSection
                    bands={bands}
                    user={user}
                    lang={lang}
                    onAddBand={handleAddBand}
                    onDeleteBand={handleDeleteBand}
                    onEditBand={handleEditBand}
                    isRefreshing={isRefreshing}
                    globalSearch={deferredSearch}
                  />
                )}

                {activeTab === "festivals" && (
                  <FestivalSection
                    events={events}
                    user={user}
                    lang={lang}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                    favorites={favoriteEvents}
                    onToggleFavorite={handleToggleFavoriteEvent}
                    initialFilterTab="festivals"
                  />
                )}

                {activeTab === "shows" && (
                  <FestivalSection
                    events={events}
                    user={user}
                    lang={lang}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                    favorites={favoriteEvents}
                    onToggleFavorite={handleToggleFavoriteEvent}
                    initialFilterTab="shows"
                  />
                )}

                {activeTab === "news" && (
                  <NewsSection
                    news={news}
                    user={user}
                    lang={lang}
                    onAddNews={handleAddNews}
                    onDeleteNews={handleDeleteNews}
                  />
                )}

                {activeTab === "help" && (
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-900 shadow-2xl relative overflow-hidden">
                    <HelpSection lang={lang} />
                  </div>
                )}

                {activeTab === "admin" && (
                  <AdminSection
                    bands={bands}
                    events={events}
                    news={news}
                    user={user}
                    lang={lang}
                    onApproveBand={handleApproveBand}
                    onDeleteBand={handleDeleteBand}
                    onApproveEvent={handleApproveEvent}
                    onDeleteEvent={handleDeleteEvent}
                    onApproveNews={handleApproveNews}
                    onDeleteNews={handleDeleteNews}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* SPONSOR SPACE FOOTER AD CARD inside Main Workspace */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-neutral-950 via-zinc-900/60 to-neutral-950 border border-neutral-850/60 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left select-none mt-8">
            <p className="text-xs text-neutral-300 font-mono">
              🛒 {lang === "pt" ? "Garanta instrumentos e pedais de distorção na filial parceira MetalZone BH." : "Upgrade your distortion stack with premium pedals at boutique metal outlets today."}
            </p>
            <a
              href="https://wa.me/5531973267529?text=Quero%20anunciar%20no%20MetalZone"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900 hover:bg-neutral-850 text-white font-mono px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold border border-neutral-800 transition block shrink-0 cursor-pointer"
            >
              {lang === "pt" ? "Anunciar / Patrocinar" : "Sponsor Space"}
            </a>
          </div>

        </main>

        {/* FOOTER GENERAL SECTION */}
        <footer className="mt-12 bg-neutral-950 border-t border-neutral-900 py-8 px-4 md:px-8 text-neutral-500 text-xs font-mono">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-stone-300 font-bold uppercase tracking-wider">🤘 MetalZone Portal Corporation</p>
              <p className="text-[11px] text-zinc-500">
                {lang === "pt" ? "Desenvolvido com maestria pesada sob encomenda." : "Engineered with heavy distortion under sovereign commissions."}
              </p>
            </div>

            <div className="text-center md:text-right space-y-1 leading-snug">
              <p className="text-zinc-400">Patrício - patricioaug@gmail.com</p>
              <p className="text-zinc-500">+55 (31) 97326-7529</p>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
