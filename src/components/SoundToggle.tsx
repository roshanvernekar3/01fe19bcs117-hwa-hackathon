"use client";

import { useEffect, useState } from "react";
import { isSoundOn, setSoundPref } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(isSoundOn());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const next = !on;
        setOn(next);
        setSoundPref(next);
      }}
      aria-label={on ? "Mute sounds" : "Unmute sounds"}
      className="fixed bottom-5 right-5 z-[9996] w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-lg border border-slate-200 flex items-center justify-center text-lg hover:scale-110 transition"
    >
      {on ? "🔊" : "🔇"}
    </button>
  );
}
