"use client";

import { useSound } from "@/components/SoundProvider";

export default function PetSound({ emoji, sound, className }: { emoji: string; sound: "bark" | "meow"; className?: string }) {
  const s = useSound();
  return (
    <span
      onClick={() => s.play(sound)}
      className={`cursor-pointer select-none ${className ?? ""}`}
      role="button"
      aria-label={sound === "bark" ? "dog" : "cat"}
    >
      {emoji}
    </span>
  );
}