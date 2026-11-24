import type { ReactNode } from "react";

export default function Marquee({
  children,
  speed = "normal",
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: "normal" | "slow";
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee-mask overflow-hidden ${className}`} aria-hidden="true">
      <div className={`marquee ${speed === "slow" ? "marquee-slow" : ""} ${reverse ? "marquee-reverse" : ""}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  );
}
