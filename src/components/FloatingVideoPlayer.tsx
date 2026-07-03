import React, { useState, useEffect, useRef } from "react";
import { X, Move, Maximize2, Sparkles } from "lucide-react";

export interface FloatingWindow {
  id: string;
  title: string;
  videoUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface FloatingVideoPlayerProps {
  windows: FloatingWindow[];
  onCloseWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onUpdateWindow: (id: string, updates: Partial<FloatingWindow>) => void;
  lang: "pt" | "en" | "es";
}

export const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({
  windows,
  onCloseWindow,
  onFocusWindow,
  onUpdateWindow,
  lang,
}) => {
  return (
    <>
      {windows.map((win) => (
        <VideoWindow
          key={win.id}
          windowData={win}
          onClose={() => onCloseWindow(win.id)}
          onFocus={() => onFocusWindow(win.id)}
          onUpdate={(updates) => onUpdateWindow(win.id, updates)}
          lang={lang}
        />
      ))}
    </>
  );
};

interface VideoWindowProps {
  windowData: FloatingWindow;
  onClose: () => void;
  onFocus: () => void;
  onUpdate: (updates: Partial<FloatingWindow>) => void;
  lang: "pt" | "en" | "es";
}

const VideoWindow: React.FC<VideoWindowProps> = ({
  windowData,
  onClose,
  onFocus,
  onUpdate,
  lang,
}) => {
  const { x, y, width, height, zIndex, title, videoUrl } = windowData;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, winW: 0, winH: 0 });

  // 1-second silent WAV base64 data URL to satisfy browser background audio play rules
  const [silentAudioUrl] = useState(
    "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
  );

  // Web Audio Keep-Alive and Media Session API Integration
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let oscillator: OscillatorNode | null = null;
    let gainNode: GainNode | null = null;

    const startAudioKeepAlive = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        audioCtx = new AudioContextClass();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 1; // 1 Hz (sub-audible infrasound)
        gainNode.gain.value = 0.001; // extremely low inaudible gain

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
      } catch (e) {
        console.warn("Unable to start Web Audio keep-alive:", e);
      }
    };

    const registerMediaSession = () => {
      if ("mediaSession" in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: lang === "pt" ? "Vídeo da Semana (Stay Metal)" : lang === "es" ? "Vídeo de la Semana (Stay Metal)" : "Video of the Week (Stay Metal)",
            artist: "Stay Metal Weekly Highlight",
            album: "Stay Metal Community",
            artwork: [
              { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=128&h=128&fit=crop", sizes: "128x128", type: "image/jpeg" },
              { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=512&h=512&fit=crop", sizes: "512x512", type: "image/jpeg" }
            ],
          });

          // Handlers to support locked screen background play resumption
          navigator.mediaSession.setActionHandler("play", () => {
            if (audioCtx && audioCtx.state === "suspended") {
              audioCtx.resume();
            }
          });
          navigator.mediaSession.setActionHandler("pause", () => {
            if (audioCtx && audioCtx.state === "running") {
              audioCtx.suspend();
            }
          });
        } catch (err) {
          console.warn("Media Session API failed to setup:", err);
        }
      }
    };

    const handleInteraction = () => {
      if (!audioCtx) {
        startAudioKeepAlive();
        registerMediaSession();
      }
    };

    // Trigger on first click or touch to bypass browser autoplay rules
    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);

      if (oscillator) {
        try { oscillator.stop(); } catch (e) {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch (e) {}
      }
    };
  }, [lang]);

  // Extract YouTube ID and construct embed URL
  const getEmbedUrl = (url: string) => {
    // Standard and short links:
    // https://youtu.be/BH7oNQ2SYs8?si=...
    // https://www.youtube.com/watch?v=BH7oNQ2SYs8
    let videoId = "BH7oNQ2SYs8"; // default fallback
    try {
      if (url.includes("youtu.be/")) {
        const parts = url.split("youtu.be/");
        if (parts[1]) {
          videoId = parts[1].split("?")[0];
        }
      } else if (url.includes("v=")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        videoId = urlParams.get("v") || videoId;
      }
    } catch (e) {
      console.error("Error parsing youtube url", e);
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  const handleMouseDownDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    onFocus();
    setIsDragging(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      winX: x,
      winY: y,
    };

    if (!("touches" in e)) {
      e.preventDefault();
    }
  };

  const handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    onFocus();
    setIsResizing(true);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      winW: width,
      winH: height,
    };

    e.stopPropagation();
    if (!("touches" in e)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const dx = clientX - dragStartRef.current.x;
        const dy = clientY - dragStartRef.current.y;

        // Boundary checks to keep it partially on screen
        const nextX = Math.max(10, Math.min(window.innerWidth - 80, dragStartRef.current.winX + dx));
        const nextY = Math.max(10, Math.min(window.innerHeight - 60, dragStartRef.current.winY + dy));

        onUpdate({ x: nextX, y: nextY });
      }

      if (isResizing) {
        const dx = clientX - resizeStartRef.current.x;
        const dy = clientY - resizeStartRef.current.y;

        const nextW = Math.max(280, Math.min(window.innerWidth - x - 10, resizeStartRef.current.winW + dx));
        const nextH = Math.max(180, Math.min(window.innerHeight - y - 10, resizeStartRef.current.winH + dy));

        onUpdate({ width: nextW, height: nextH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isResizing, x, y, onUpdate]);

  return (
    <div
      style={{
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex: zIndex,
      }}
      className="bg-neutral-950 border-2 border-red-900/60 rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden group select-none backdrop-blur-md transition-shadow focus-within:border-red-600/80 hover:shadow-[0_15px_60px_rgba(220,38,38,0.15)]"
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar (Draggable) */}
      <div
        onMouseDown={handleMouseDownDrag}
        onTouchStart={handleMouseDownDrag}
        className="bg-gradient-to-r from-red-950 to-neutral-950 border-b border-red-900/30 px-3 py-2 flex items-center justify-between cursor-move shrink-0"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Move size={12} className="text-red-500 shrink-0" />
          <span className="text-[10px] font-mono font-black text-white tracking-wider uppercase truncate">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-red-900/40 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={lang === "pt" ? "Fechar" : "Close"}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Video Content Container */}
      <div className="flex-1 bg-black relative">
        {/* Transparent Overlay to capture mouse events when dragging or resizing */}
        {(isDragging || isResizing) && (
          <div className="absolute inset-0 bg-transparent z-50 cursor-move" />
        )}

        <iframe
          src={getEmbedUrl(videoUrl)}
          title="Stay Metal video of the week player"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Hidden loop audio player that stays active to trick browser into allowing lock-screen playback */}
        <audio
          src={silentAudioUrl}
          autoPlay
          loop
          className="hidden"
          ref={(el) => {
            if (el) {
              el.volume = 0.001; // completely inaudible but registered as active audio
              const playSilent = () => {
                el.play().catch(() => {});
              };
              playSilent();
              window.addEventListener("click", playSilent, { once: true });
              window.addEventListener("touchstart", playSilent, { once: true });
            }
          }}
        />
      </div>

      {/* Resize Handle (Bottom-Right Corner) */}
      <div
        onMouseDown={handleMouseDownResize}
        onTouchStart={handleMouseDownResize}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-0.5 z-40 group"
        title={lang === "pt" ? "Redimensionar" : "Resize"}
      >
        <Maximize2 size={10} className="text-neutral-500 group-hover:text-red-500 transition-colors transform rotate-90" />
      </div>
    </div>
  );
};
