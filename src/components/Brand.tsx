import Link from "next/link";

export function Mark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14.2" stroke="currentColor" strokeWidth="1" opacity="0.32" />
      <path
        d="M10.5 23.5V8.5h6.9a4.9 4.9 0 1 1 0 9.8h-6.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M16.3 18.3 22.6 23.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="23.4" y="5.4" width="3.2" height="3.2" fill="var(--violet-bright)" />
    </svg>
  );
}

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 text-chrome"
      aria-label="REWEAR home"
    >
      <span className="relative inline-flex text-chrome transition-transform duration-500 group-hover:rotate-90">
        <Mark size={compact ? 24 : 30} />
      </span>
      <span
        className={`font-bold uppercase tracking-[0.2em] leading-none ${
          compact ? "text-[15px]" : "text-[17px] sm:text-lg"
        }`}
      >
        Rewear
      </span>
    </Link>
  );
}
