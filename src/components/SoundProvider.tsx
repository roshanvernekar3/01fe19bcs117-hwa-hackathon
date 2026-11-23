"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode, useCallback } from "react";
import * as sound from "@/lib/sound";

type SoundContextType = {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  play: (name: string) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(true);
  const [volume, setVolumeState] = useState(0.4);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try {
      const e = localStorage.getItem("pb_sound_enabled");
      const v = localStorage.getItem("pb_sound_volume");
      if (e !== null) setEnabledState(e === "true");
      if (v !== null) setVolumeState(Number(v));
    } catch {}
  }, []);

  useEffect(() => {
    sound.setEnabled(enabled);
    localStorage.setItem("pb_sound_enabled", String(enabled));
  }, [enabled]);

  useEffect(() => {
    sound.setVolume(volume);
    localStorage.setItem("pb_sound_volume", String(volume));
  }, [volume]);

  // global click -> pop (unless a sound played recently)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      const btn = target.closest("button, a[role='button']");
      if (!btn) return;
      // skip if a specific sound just played
      if (Date.now() - sound.lastSoundTime() < 80) return;
      // skip sound toggle and volume controls
      if (btn.getAttribute("data-no-sound") === "true") return;
      sound.play("pop");
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);

  const toggle = () => setEnabledState((v) => !v);
  const setVol = (v: number) => setVolumeState(v);
  const play = (name: string) => {
    if (!enabled) return;
    sound.play(name);
  };

  useEffect(() => {
    (window as unknown as { __sound: { play: (n: string) => void } }).__sound = { play };
  }, [play]);

  return (
    <SoundContext.Provider value={{ enabled, volume, toggle, setVolume: setVol, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}