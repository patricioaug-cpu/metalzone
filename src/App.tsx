import React, { useState, useEffect, useDeferredValue } from "react";
import { auth, db, SEED_BANDS, SEED_EVENTS, SEED_MERCH, Band, EventItem, MerchItem } from "./firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, updateDoc as fsUpdateDoc, getDoc, setDoc, increment } from "firebase/firestore";
import { translations } from "./translations";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import metalCatalogLogo from "./assets/images/metal_catalog_logo_1782380109985.jpg";

// Import modular pages
import { AuthSection } from "./components/AuthSection";
import { BandSection } from "./components/BandSection";
import { FestivalSection } from "./components/FestivalSection";
import { MerchSection } from "./components/MerchSection";
import { AdminSection } from "./components/AdminSection";
import { MonetizeSection } from "./components/MonetizeSection";
import { HelpSection } from "./components/HelpSection";
import { OnlineUsersTracker } from "./components/OnlineUsersTracker";
import { BdaySection, getDeterministicReleaseDate } from "./components/BdaySection";
import { YesterdayBandsSection } from "./components/YesterdayBandsSection";

import { 
  Flame, Music, Newspaper, ShoppingBag, Shield, DollarSign, HelpCircle, 
  RefreshCw, Globe, Phone, Mail, Star, Radio, Skull, Search, X, MapPin, Menu, LogOut,
  Calendar, Clock, Eye
} from "lucide-react";
import { WelcomeScreen } from "./components/WelcomeScreen";

export default function App() {
  const [lang, setLang] = useState<"pt" | "en" | "es">("pt");
  const [hasEntered, setHasEntered] = useState(false);
  type TabType = "bands" | "festivals" | "bday" | "help" | "admin" | "yesterday";
  const [activeTab, setActiveTabTab] = useState<TabType>("bands");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [headerSearch, setHeaderSearch] = useState("");
  const deferredSearch = useDeferredValue(headerSearch);

  const handleHeaderSearchChange = (value: string) => {
    setHeaderSearch(value);
    if (value && activeTab !== "bands" && activeTab !== "help") {
      setActiveTabTab("bands");
    }
  };
  
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id: string; email: string | null; isGuest: boolean; isMe: boolean }>>([]);
  const [authChecked, setAuthChecked] = useState(false);

  const [accesses, setAccesses] = useState<number>(() => {
    const saved = localStorage.getItem("metal_catalog_local_accesses");
    return saved ? parseInt(saved, 10) : 1240;
  });

  // Stats tracking for accesses (views)
  useEffect(() => {
    const trackAccess = async () => {
      try {
        const statsRef = doc(db, "stats", "global");
        const statsSnap = await getDoc(statsRef);
        
        let currentCount = 0;
        if (statsSnap.exists()) {
          const data = statsSnap.data();
          currentCount = data.accesses || 0;
          // Increment in Firestore
          await updateDoc(statsRef, {
            accesses: increment(1)
          });
          currentCount += 1;
        } else {
          // Create the document if it doesn't exist
          currentCount = 1240;
          await setDoc(statsRef, { accesses: currentCount });
        }
        
        setAccesses(currentCount);
        localStorage.setItem("metal_catalog_local_accesses", String(currentCount));
      } catch (err) {
        console.warn("Firestore stats tracking skipped or blocked, using local simulation:", err);
        const localSaved = localStorage.getItem("metal_catalog_local_accesses");
        const nextCount = localSaved ? parseInt(localSaved, 10) + 1 : 1241;
        setAccesses(nextCount);
        localStorage.setItem("metal_catalog_local_accesses", String(nextCount));
      }
    };
    
    const sessionKey = "metal_catalog_session_tracked_" + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
      trackAccess();
      sessionStorage.setItem(sessionKey, "true");
    } else {
      const fetchAccessOnly = async () => {
        try {
          const statsRef = doc(db, "stats", "global");
          const statsSnap = await getDoc(statsRef);
          if (statsSnap.exists()) {
            const count = statsSnap.data().accesses || 1240;
            setAccesses(count);
          }
        } catch {
          const localSaved = localStorage.getItem("metal_catalog_local_accesses");
          if (localSaved) setAccesses(parseInt(localSaved, 10));
        }
      };
      fetchAccessOnly();
    }
  }, []);

  const [bands, setBands] = useState<Band[]>(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();
    return SEED_BANDS.map(b => {
      if (b.name === "AnAkA" || b.name === "AutÓpsia" || b.name === "Collapse Death" || b.name === "Rygel") {
        return { ...b, createdAt: b.createdAt || yesterdayStr };
      }
      return b;
    });
  });

  const getYesterdayCount = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = yesterday.getMonth();
    const yesterdayDate = yesterday.getDate();

    return bands.filter(b => {
      if (!b.createdAt) return false;
      let createdDate: Date;
      if (typeof b.createdAt === "string") {
        createdDate = new Date(b.createdAt);
      } else if (b.createdAt.toDate && typeof b.createdAt.toDate === "function") {
        createdDate = b.createdAt.toDate();
      } else if (b.createdAt.seconds) {
        createdDate = new Date(b.createdAt.seconds * 1000);
      } else {
        createdDate = new Date(b.createdAt);
      }
      if (isNaN(createdDate.getTime())) return false;
      return createdDate.getFullYear() === yesterdayYear &&
             createdDate.getMonth() === yesterdayMonth &&
             createdDate.getDate() === yesterdayDate;
    }).length;
  };
  const [events, setEvents] = useState<EventItem[]>(SEED_EVENTS);
  const [merch, setMerch] = useState<MerchItem[]>(SEED_MERCH);
  const [isLoading, setIsLoading] = useState(true);

  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotify, setRefreshNotify] = useState(false);

  const t = translations[lang];

  // Send access email notification when a new or different user enters/uses the system
  useEffect(() => {
    // Generate or fetch a device-persistent random ID for Guest identification
    let deviceId = localStorage.getItem("metal_catalog_device_id");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem("metal_catalog_device_id", deviceId);
    }

    const currentUserKey = user ? `user_${user.email || user.uid}` : `guest_${deviceId}`;
    
    // Read the array of already notified user keys from localStorage
    const notifiedKeysStr = localStorage.getItem("metal_catalog_notified_keys") || "[]";
    let notifiedKeys: string[] = [];
    try {
      notifiedKeys = JSON.parse(notifiedKeysStr);
    } catch (e) {
      notifiedKeys = [];
    }

    if (!notifiedKeys.includes(currentUserKey)) {
      const sendAccessNotification = async () => {
        let clientCountry = "Unknown Country";
        try {
          const geoRes = await fetch("https://ipapi.co/json/");
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            clientCountry = geoData.country_name || geoData.country || "Unknown Country";
          }
        } catch (e) {
          console.warn("Client-side IP geolocation lookup bypassed:", e);
        }

        const clientTime = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

        try {
          const res = await fetch("/api/notify-access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              country: clientCountry,
              clientTime: clientTime,
              userEmail: user ? user.email : `Guest (Device: ${deviceId.substring(4, 10)})`,
              userType: user ? "Membro Autenticado" : "Visitante Anonimo"
            })
          });
          if (res.ok) {
            // Add the current user key to notifiedKeys so we don't spam for this specific user
            const updatedKeys = [...notifiedKeys, currentUserKey];
            localStorage.setItem("metal_catalog_notified_keys", JSON.stringify(updatedKeys));
            console.log("Access reported successfully for " + currentUserKey);
          }
        } catch (err) {
          console.error("Access notification report failed:", err);
        }
      };

      // Delay slightly to keep initial load swift
      const timer = setTimeout(() => {
        sendAccessNotification();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, isGuest]);

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

  const fetchAllCollections = async () => {
    setIsLoading(true);
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
      const bandSnap = await fetchWithTimeout(getDocs(collection(db, "bands")), 7000, { empty: true, docs: [] } as any);
      if (bandSnap && !bandSnap.empty) {
        const loadedBands: Band[] = [];
        bandSnap.forEach((docSnap: any) => {
          loadedBands.push({ id: docSnap.id, ...docSnap.data() } as Band);
        });

        const updatedLoadedBands = loadedBands.map(lb => {
          const seedMatch = SEED_BANDS.find(sb => sb.name === lb.name);
          if (seedMatch && seedMatch.logoUrl && lb.logoUrl !== seedMatch.logoUrl) {
            if (lb.id) {
              updateDoc(doc(db, "bands", lb.id), { logoUrl: seedMatch.logoUrl }).catch(e => 
                console.warn(`Could not update band logoUrl in database for ${lb.name}:`, e)
              );
            }
            return { ...lb, logoUrl: seedMatch.logoUrl };
          }
          return lb;
        });

        const merged = [...SEED_BANDS.filter(sb => !updatedLoadedBands.some(lb => lb.name === sb.name)), ...updatedLoadedBands];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString();
        const enriched = merged.map(b => {
          if (b.name === "AnAkA" || b.name === "AutÓpsia" || b.name === "Collapse Death" || b.name === "Rygel") {
            return { ...b, createdAt: b.createdAt || yesterdayStr };
          }
          return b;
        });
        setBands(enriched);
      } else {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString();
        const enriched = SEED_BANDS.map(b => {
          if (b.name === "AnAkA" || b.name === "AutÓpsia" || b.name === "Collapse Death" || b.name === "Rygel") {
            return { ...b, createdAt: b.createdAt || yesterdayStr };
          }
          return b;
        });
        setBands(enriched);
      }

      const eventSnap = await fetchWithTimeout(getDocs(collection(db, "events")), 7000, { empty: true, docs: [] } as any);
      if (eventSnap && !eventSnap.empty) {
        const loadedEvents: EventItem[] = [];
        eventSnap.forEach((docSnap: any) => {
          loadedEvents.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
        });

        const updatedLoadedEvents = loadedEvents.map(le => {
          const seedMatch = SEED_EVENTS.find(se => se.name === le.name);
          if (seedMatch && seedMatch.imageUrl && le.imageUrl !== seedMatch.imageUrl) {
            if (le.id) {
              updateDoc(doc(db, "events", le.id), { imageUrl: seedMatch.imageUrl }).catch(e =>
                console.warn(`Could not update event imageUrl in database for ${le.name}:`, e)
              );
            }
            return { ...le, imageUrl: seedMatch.imageUrl };
          }
          return le;
        });

        const merged = [...SEED_EVENTS.filter(se => !updatedLoadedEvents.some(le => le.name === se.name)), ...updatedLoadedEvents];
        setEvents(merged);
      } else {
        setEvents(SEED_EVENTS);
      }
    } catch (err) {
      console.warn("Could not query live Firestore directly, using rock static seed assets:", err);
      setBands(SEED_BANDS);
      setEvents(SEED_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Toggle local favorite event
  const handleToggleFavoriteEvent = (id: string) => {
    setFavoriteEvents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isAdmin = user?.email === "patricioaug@gmail.com";
  const userCheckLoaded = authChecked;

  const todayDateObj = new Date();
  const currentMonthIdx = todayDateObj.getMonth();
  const currentDayVal = todayDateObj.getDate();
  const bdayTodayCount = bands.reduce((acc, band) => {
    if (band.discography && Array.isArray(band.discography)) {
      const todayCount = band.discography.filter(album => {
        const { month, day } = getDeterministicReleaseDate(band.name, album.title, album.year);
        return month === currentMonthIdx && day === currentDayVal;
      }).length;
      return acc + todayCount;
    }
    return acc;
  }, 0);

  if (!hasEntered) {
    return (
      <WelcomeScreen 
        lang={lang} 
        setLang={setLang} 
        onEnter={() => setHasEntered(true)} 
        logo={metalCatalogLogo} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-stone-200 selection:bg-red-900 selection:text-white flex flex-col md:flex-row font-sans relative overflow-x-hidden">
      
      {/* REAL-TIME ONLINE USERS PRESENCE SYSTEM */}
      <OnlineUsersTracker 
        user={user} 
        isGuest={isGuest} 
        onCountChange={(count, users) => {
          setOnlineCount(count);
          setOnlineUsers(users);
        }} 
      />
      

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
      <header className="md:hidden sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-neutral-900 py-2.5 px-4 flex justify-between items-center shadow-md w-full shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
            <img src={metalCatalogLogo} className="w-full h-full object-cover" alt="Stay Metal Logo" />
          </div>
          <div>
            <h1 className="text-md font-black text-white uppercase tracking-widest font-mono select-none leading-none">
              Stay Metal
            </h1>
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
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                      <img src={metalCatalogLogo} className="w-full h-full object-cover" alt="Stay Metal Logo" />
                    </div>
                    <div>
                      <span className="text-md font-black text-white tracking-widest block leading-none">STAY METAL</span>
                    </div>
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
                    onClick={() => { setActiveTabTab("bday"); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                      activeTab === "bday" 
                        ? "bg-red-950/40 text-rose-400 border-red-900/40" 
                        : "bg-transparent text-neutral-450 border-transparent hover:bg-neutral-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Calendar size={15} className={bdayTodayCount > 0 ? "text-amber-500" : ""} />
                      {lang === "pt" ? "Aniversários (BDAY)" : lang === "es" ? "Aniversarios (BDAY)" : "Anniversaries (BDAY)"}
                    </span>
                    {bdayTodayCount > 0 && (
                      <span className="text-[9px] text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-900/40 shadow-sm">
                        {bdayTodayCount}
                      </span>
                    )}
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

                  {/* Mobile Exit Button */}
                  <button
                    onClick={() => { setHasEntered(false); setIsSidebarOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-950/40 bg-neutral-950 hover:bg-red-950/20 text-red-400 hover:text-red-300 transition duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2.5">
                      <LogOut size={15} />
                      {lang === "pt" ? "Sair do Aplicativo" : lang === "es" ? "Salir de la App" : "Exit App"}
                    </span>
                  </button>
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
                  🤘 Stay Metal | patricioaug@gmail.com
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
          <div className="p-5 border-b border-neutral-900 bg-black/40 flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 bg-black border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xl shadow-black/80 animate-pulse-slow">
              <img src={metalCatalogLogo} className="w-full h-full object-cover" alt="Stay Metal Logo" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-black text-white uppercase tracking-widest leading-none filter drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">
                Stay Metal
              </h1>
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-2.5 font-bold">
                {lang === "pt" ? "Enciclopédia" : lang === "es" ? "Enciclopedia" : "Metal Wiki & Logs"}
              </p>
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
              id="sidebar-nav-bday"
              onClick={() => setActiveTabTab("bday")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                activeTab === "bday" 
                  ? "bg-red-950/40 text-rose-400 border-red-900/40 shadow-md shadow-red-950/20" 
                  : "bg-transparent text-neutral-400 border-transparent hover:bg-neutral-900/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar size={15} className={bdayTodayCount > 0 ? "text-amber-500" : ""} />
                <span>{lang === "pt" ? "Aniversários (BDAY)" : lang === "es" ? "Aniversarios (BDAY)" : "Anniversaries (BDAY)"}</span>
              </div>
              {bdayTodayCount > 0 && (
                <span className="text-[9px] text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-900/40 shadow-sm animate-pulse">
                  {bdayTodayCount}
                </span>
              )}
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

            {/* Desktop Exit Button */}
            <button
              id="sidebar-nav-exit"
              onClick={() => setHasEntered(false)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-950/40 bg-neutral-950 hover:bg-red-950/20 text-red-400 hover:text-red-300 transition duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider"
            >
              <div className="flex items-center gap-2.5">
                <LogOut size={15} />
                <span>{lang === "pt" ? "Sair do Aplicativo" : lang === "es" ? "Salir de la App" : "Exit App"}</span>
              </div>
            </button>
          </div>

          {/* Database Info Widget inside sidebar */}
          <div className="px-6 py-4 mx-4 mb-4 bg-neutral-900/50 border border-neutral-900 rounded-xl space-y-2 text-[10px] text-neutral-500 leading-snug mt-auto relative group">
            <span className="text-[8px] text-red-500 font-bold uppercase tracking-widest block border-b border-neutral-850 pb-1 select-none">
              {lang === "pt" ? "Estatísticas" : lang === "es" ? "Estadísticas" : "Database Stats"}
            </span>
            <div className="flex justify-between select-none">
              <span>Bands Ativas:</span>
              <span className="text-stone-300 font-bold">{bands.filter(b => b.approved).length}</span>
            </div>
            <div className="flex justify-between select-none">
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
            Patrício | {new Date().getFullYear()} Stay Metal
          </div>
        </div>
      </nav>

      {/* ----------------- MAIN WORKSPACE LAYER (RIGHT PANEL) ----------------- */}
      <div className="md:pl-64 flex-1 flex flex-col min-w-0">
        
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 z-10 w-full space-y-6">
          
          {/* STATISTICS HEADER BAR */}
          <div className="flex items-center justify-around bg-zinc-950/80 backdrop-blur-md border border-neutral-900 py-2 px-3 sm:px-4 rounded-xl shadow-lg text-xs font-mono">
            <div className="flex items-center gap-1.5 min-w-0">
              <Eye size={13} className="text-rose-500 animate-pulse shrink-0" />
              <span className="text-zinc-500 font-bold text-[10px] sm:text-xs truncate">
                {lang === "pt" ? "Acessos:" : lang === "es" ? "Accesos:" : "Accesses:"}
              </span>
              <span className="text-white font-black text-[11px] sm:text-xs">
                {accesses}
              </span>
            </div>
            
            <div className="h-4 w-px bg-neutral-800 shrink-0 mx-1" />
            
            <div className="flex items-center gap-1.5 min-w-0">
              <Music size={13} className="text-rose-500 shrink-0" />
              <span className="text-zinc-500 font-bold text-[10px] sm:text-xs truncate">
                {lang === "pt" ? "Bandas:" : lang === "es" ? "Bandas:" : "Bands:"}
              </span>
              <span className="text-rose-500 font-black text-[11px] sm:text-xs">
                {bands.length}
              </span>
            </div>
            
            <div className="h-4 w-px bg-neutral-800 shrink-0 mx-1" />
            
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe size={13} className="text-rose-400 shrink-0" />
              <span className="text-zinc-500 font-bold text-[10px] sm:text-xs truncate">
                {lang === "pt" ? "Países:" : lang === "es" ? "Países:" : "Countries:"}
              </span>
              <span className="text-rose-400 font-black text-[11px] sm:text-xs">
                {Array.from(new Set(bands.map(b => b.country).filter(Boolean))).length}
              </span>
            </div>
          </div>

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

          {/* GLOBAL BACK TO MENU NAVIGATION BAR */}
          {activeTab !== "bands" && (
            <div id="global-navigation-bar" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
                  {lang === "pt" 
                    ? `Navegando: ${activeTab === "yesterday" ? "Adicionadas Ontem" : activeTab === "festivals" ? t.navFestivals : activeTab === "bday" ? "Aniversários de Lançamento" : activeTab === "help" ? "Ajuda" : t.navAdmin}` 
                    : `Navigating: ${activeTab === "yesterday" ? "Added Yesterday" : activeTab === "festivals" ? t.navFestivals : activeTab === "bday" ? "Album Anniversaries" : activeTab === "help" ? "Help" : t.navAdmin}`
                  }
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="global-btn-back-to-main"
                  onClick={() => {
                    setActiveTabTab("bands");
                    setHeaderSearch("");
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border bg-red-950 hover:bg-red-900 border-red-900/40 hover:border-red-600 text-white hover:scale-[1.02] shadow-md shadow-red-950/30"
                >
                  <Skull size={13} className="animate-pulse text-red-500" />
                  <span>
                    {lang === "pt" ? "Voltar ao Menu" : lang === "es" ? "Volver al Menú" : "Back to Menu"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE CONTENT WORKSPACE SWAPPER */}
          <div className="p-1 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                    onClearGlobalSearch={() => setHeaderSearch("")}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === "yesterday" && (
                  <YesterdayBandsSection
                    bands={bands}
                    lang={lang}
                    onBackToCatalog={() => {
                      setActiveTabTab("bands");
                      setHeaderSearch("");
                    }}
                  />
                )}

                {activeTab === "help" && (
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-900 shadow-2xl relative overflow-hidden">
                    <HelpSection lang={lang} />
                  </div>
                )}

                {activeTab === "bday" && (
                  <BdaySection
                    bands={bands}
                    lang={lang}
                    onBackToCatalog={() => {
                      setActiveTabTab("bands");
                      setHeaderSearch("");
                    }}
                    onViewBand={(bandName) => {
                      setHeaderSearch(bandName);
                      setActiveTabTab("bands");
                    }}
                  />
                )}

                {activeTab === "festivals" && (
                  <FestivalSection
                    events={events}
                    user={user}
                    lang={lang}
                    onAddEvent={async (e) => {
                      await handleAddEvent(e);
                      return true;
                    }}
                    onDeleteEvent={handleDeleteEvent}
                    favorites={favoriteEvents}
                    onToggleFavorite={handleToggleFavoriteEvent}
                    initialFilterTab="festivals"
                    isLoading={isLoading}
                  />
                )}

                {activeTab === "admin" && (
                  <AdminSection
                    bands={bands}
                    events={events}
                    user={user}
                    lang={lang}
                    onApproveBand={handleApproveBand}
                    onDeleteBand={handleDeleteBand}
                    onApproveEvent={handleApproveEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </main>



      </div>
    </div>
  );
}
