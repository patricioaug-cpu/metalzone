import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { User } from "firebase/auth";

interface OnlineUsersTrackerProps {
  user: User | null;
  isGuest: boolean;
  onCountChange: (count: number, usersList: Array<{ id: string; email: string | null; isGuest: boolean; isMe: boolean }>) => void;
}

export const OnlineUsersTracker: React.FC<OnlineUsersTrackerProps> = ({ 
  user, 
  isGuest,
  onCountChange 
}) => {
  const [sessionId] = useState(() => {
    // Generate or fetch tab-persistent session ID
    const SESSION_KEY = "metal_catalog_session_id";
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  });

  const lastActiveRef = useRef<number>(Date.now());

  // Handle setting/updating presence in Firestore
  useEffect(() => {
    const docRef = doc(db, "stats", `presence_${sessionId}`);

    const updatePresence = async () => {
      const now = Date.now();
      lastActiveRef.current = now;
      
      try {
        await setDoc(docRef, {
          id: sessionId,
          type: "presence",
          lastActive: now,
          uid: user?.uid || null,
          email: user?.email || null,
          isGuest: isGuest,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn("Could not register user presence: ", err);
      }
    };

    // Initial check-in
    updatePresence();

    // Heartbeat every 25 seconds
    const interval = setInterval(updatePresence, 25000);

    // Cleanup on unmount (or page close)
    const handleUnload = () => {
      // Synchronous attempt on window close
      try {
        const docRefString = `stats/presence_${sessionId}`;
        // Best effort delete
        deleteDoc(docRef).catch(() => {});
      } catch (e) {}
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      // Clean up document on unmount
      deleteDoc(docRef).catch(() => {});
    };
  }, [sessionId, user, isGuest]);

  // Read online users and clean up old records
  useEffect(() => {
    const statsCol = collection(db, "stats");
    
    // Listen to stats collection
    const unsubscribe = onSnapshot(statsCol, (snapshot) => {
      const now = Date.now();
      const activeThreshold = now - 120000; // 2 minutes active window
      const staleThreshold = now - 300000;   // 5 minutes stale threshold for deleting

      const activeList: Array<{ id: string; email: string | null; isGuest: boolean; isMe: boolean }> = [];
      const staleDocIds: string[] = [];

      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (data.type === "presence") {
          const lastActive = data.lastActive || 0;
          
          if (lastActive > activeThreshold) {
            activeList.push({
              id: data.id || d.id,
              email: data.email || null,
              isGuest: !!data.isGuest,
              isMe: data.id === sessionId
            });
          } else if (lastActive < staleThreshold) {
            staleDocIds.push(d.id);
          }
        }
      });

      // Notify parent component of current active users
      // Ensure at least 1 online user (the current session) is shown
      const finalCount = Math.max(1, activeList.length);
      onCountChange(finalCount, activeList);

      // Distributive Cleanup: periodically delete stale documents so the DB stays compact
      staleDocIds.forEach(async (docId) => {
        try {
          await deleteDoc(doc(db, "stats", docId));
        } catch (e) {
          // Ignore permission/concurrency errors during deletion of other users' stale docs
        }
      });
    }, (error) => {
      console.warn("Presence snapshot listener error: ", error);
      // Fallback: at least show 1 online user
      onCountChange(1, [{ id: sessionId, email: user?.email || null, isGuest, isMe: true }]);
    });

    return () => {
      unsubscribe();
    };
  }, [sessionId, user, isGuest, onCountChange]);

  return null; // This is a headless logic component
};
