"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSound } from "@/components/SoundProvider";

export default function PageSound() {
  const pathname = usePathname();
  const sound = useSound();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    sound.play("page");
  }, [pathname, sound]);
  return null;
}