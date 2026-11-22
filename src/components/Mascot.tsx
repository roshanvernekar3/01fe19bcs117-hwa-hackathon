import React from "react";

type MascotType = "dog" | "cat";
type MascotAnim = "float" | "peek" | "wiggle" | "bounce" | "none";

export default function Mascot({
  type = "dog",
  size = "md",
  anim = "float",
  className = "",
}: {
  type?: MascotType;
  size?: "sm" | "md" | "lg";
  anim?: MascotAnim;
  className?: string;
}) {
  const emoji = type === "dog" ? "🐶" : "🐱";
  const sizes = { sm: "text-2xl", md: "text-4xl", lg: "text-6xl" };
  const animClass =
    anim === "float" ? "animate-float" :
    anim === "peek" ? "animate-peek" :
    anim === "wiggle" ? "animate-wiggle" :
    anim === "bounce" ? "animate-bounce-soft" : "";
  return (
    <span
      className={`inline-block select-none drop-shadow-md ${sizes[size]} ${animClass} ${className}`}
      aria-hidden="true"
    >
      {emoji}
    </span>
  );
}