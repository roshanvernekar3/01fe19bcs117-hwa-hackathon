import type { GarmentKind } from "@/lib/products";

type Variant = "card" | "detail" | "hero";

type GarmentArtProps = {
  kind: GarmentKind;
  label: string;
  slug?: string;
  variant?: Variant;
  className?: string;
  showHud?: boolean;
};

/**
 * A hand-built "holographic garment scan". Deliberately illustrative rather
 * than photographic: it keeps the catalogue fast, original and perfectly
 * on-palette at every size.
 */
export default function GarmentArt({
  kind,
  label,
  slug = "rewear",
  variant = "card",
  className = "",
  showHud = true,
}: GarmentArtProps) {
  const uid = `${slug}-${kind}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, "");
  const fill = `fill-${uid}`;
  const stroke = `stroke-${uid}`;
  const accent = `accent-${uid}`;
  const glow = `glow-${uid}`;
  const sheen = `sheen-${uid}`;
  const clip = `clip-${uid}`;

  const strokeProps = {
    stroke: `url(#${stroke})`,
    strokeWidth: variant === "card" ? 1.7 : 1.5,
    fill: "none",
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const accentProps = {
    stroke: `url(#${accent})`,
    strokeWidth: 1.35,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const faint = "rgba(201,203,212,0.26)";

  const silhouettes: Record<GarmentKind, React.ReactNode> = {
    jacket: (
      <>
        <path
          d="M180 78C165 78 155 82 146 92L104 108L72 172L97 186L118 145L110 256L120 348L180 358L240 348L250 256L242 145L263 186L288 172L256 108L214 92C205 82 195 78 180 78Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M146 92L180 128L214 92" {...accentProps} strokeWidth="1.8" />
        <path d="M156 94L180 118L204 94" stroke={faint} strokeWidth="1" fill="none" />
        <path d="M180 128V350" stroke="rgba(241,242,246,0.42)" strokeWidth="1" strokeDasharray="4 5" />
        <path d="M198 166L238 173L234 224L198 217Z" {...strokeProps} fill="rgba(168,85,247,0.06)" strokeWidth="1.2" />
        <path d="M198 180L236 186" stroke={faint} strokeWidth="1" />
        <path d="M126 263L164 267L164 298L130 294Z" {...strokeProps} fill="rgba(255,255,255,0.025)" strokeWidth="1.2" />
        <path d="M234 263L196 267L196 298L230 294Z" {...strokeProps} fill="rgba(255,255,255,0.025)" strokeWidth="1.2" />
        <path d="M120 145L112 256M240 145L248 256" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <path d="M124 330L236 330" stroke="rgba(241,242,246,0.32)" strokeWidth="1.2" />
        <circle cx="180" cy="128" r="3.2" fill="#C084FC" />
        <circle cx="238" cy="173" r="2.1" fill="#E8E9EE" />
        <circle cx="126" cy="263" r="2.1" fill="#E8E9EE" />
      </>
    ),
    bomber: (
      <>
        <path
          d="M180 86C167 86 157 90 149 99L108 114L78 176L102 189L122 150L116 246L126 296L180 306L234 296L244 246L238 150L258 189L282 176L252 114L211 99C203 90 193 86 180 86Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M149 99L180 124L211 99" {...accentProps} strokeWidth="2.2" />
        <path d="M180 124V300" stroke="rgba(241,242,246,0.45)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M126 283L234 283" stroke="rgba(241,242,246,0.4)" strokeWidth="1.4" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={`b${i}`} d={`M${132 + i * 9} 284V296`} stroke="rgba(201,203,212,0.28)" strokeWidth="1" />
        ))}
        <path d="M80 167L103 180M280 167L257 180" stroke="rgba(241,242,246,0.4)" strokeWidth="1.4" />
        <path d="M200 168L234 174L231 214L200 208Z" {...strokeProps} fill="rgba(168,85,247,0.08)" strokeWidth="1.1" />
        <path d="M124 220L150 224" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="180" cy="124" r="3.2" fill="#C084FC" />
        <circle cx="231" cy="204" r="2.1" fill="#E8E9EE" />
      </>
    ),
    trench: (
      <>
        <path
          d="M180 78C164 78 154 82 145 92L100 108L66 178L92 192L116 146L108 270L102 422L180 434L258 422L252 270L244 146L268 192L294 178L260 108L215 92C206 82 196 78 180 78Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M145 92L180 148L215 92" {...accentProps} strokeWidth="1.8" />
        <path d="M157 94L180 132L203 94" stroke={faint} strokeWidth="1" fill="none" />
        <path d="M180 148V430" stroke="rgba(241,242,246,0.4)" strokeWidth="1" strokeDasharray="4 5" />
        <path d="M110 268H250" stroke="rgba(241,242,246,0.34)" strokeWidth="1.4" />
        <rect x="110" y="262" width="140" height="14" rx="3" fill="rgba(255,255,255,0.055)" stroke="rgba(201,203,212,0.4)" strokeWidth="1" />
        <rect x="168" y="260" width="24" height="18" rx="2" fill="none" stroke={`url(#${accent})`} strokeWidth="1.4" />
        <path d="M124 310L164 314L164 348L128 344Z" {...strokeProps} fill="rgba(255,255,255,0.025)" strokeWidth="1.1" />
        <path d="M236 310L196 314L196 348L232 344Z" {...strokeProps} fill="rgba(255,255,255,0.025)" strokeWidth="1.1" />
        <path d="M120 146L112 268M240 146L248 268" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <path d="M180 430L168 422M180 430L192 422" stroke="rgba(201,203,212,0.4)" strokeWidth="1.2" />
        <circle cx="180" cy="148" r="3.2" fill="#C084FC" />
        <circle cx="178" cy="239" r="2" fill="#E8E9EE" />
        <circle cx="182" cy="239" r="2" fill="#E8E9EE" />
      </>
    ),
    hoodie: (
      <>
        <path
          d="M146 106C150 78 210 78 214 106C214 121 199 130 180 130C161 130 146 121 146 106Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="1.8"
        />
        <path
          d="M180 120C164 120 152 124 144 136L98 150L62 224L90 238L116 180L108 290L118 360L180 370L242 360L252 290L244 180L270 238L298 224L262 150L216 136C208 124 196 120 180 120Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M146 106C158 118 202 118 214 106" {...accentProps} />
        <path d="M164 130V190M196 130V190" stroke="rgba(241,242,246,0.45)" strokeWidth="1.2" />
        <circle cx="164" cy="192" r="3" fill="#C084FC" />
        <circle cx="196" cy="192" r="3" fill="#C084FC" />
        <path d="M124 298H236L226 340H134Z" {...strokeProps} fill="rgba(255,255,255,0.03)" strokeWidth="1.3" />
        <path d="M150 300L166 328M210 300L194 328" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <path d="M120 344H240" stroke="rgba(241,242,246,0.3)" strokeWidth="1.2" />
        <path d="M107 283L115 283M245 283L253 283" stroke="rgba(201,203,212,0.28)" strokeWidth="1" />
        <circle cx="180" cy="130" r="2.5" fill="#E8E9EE" />
      </>
    ),
    knit: (
      <>
        <path
          d="M180 86C168 86 158 90 151 98L112 112L88 184L110 194L126 152L118 338L180 350L242 338L234 152L250 194L272 184L248 112L209 98C202 90 192 86 180 86Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M151 98C160 110 200 110 209 98" {...accentProps} strokeWidth="1.8" />
        <path d="M151 98C151 88 209 88 209 98" stroke={faint} strokeWidth="1" fill="none" />
        <path d="M130 188H152V218H190V248H220" stroke={`url(#${accent})`} strokeWidth="1.2" fill="none" opacity="0.85" />
        <circle cx="130" cy="188" r="2.3" fill="#C084FC" />
        <circle cx="220" cy="248" r="2.3" fill="#C084FC" />
        <path d="M154 256H206V278H154Z" stroke="rgba(255,255,255,0.14)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={`k${i}`} d={`M${124 + i * 12} 338V348`} stroke="rgba(201,203,212,0.24)" strokeWidth="1" />
        ))}
        <path d="M118 152L118 330M242 152L242 330" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="180" cy="98" r="2.4" fill="#E8E9EE" />
      </>
    ),
    tee: (
      <>
        <path
          d="M180 90C170 90 162 93 156 99L116 112L94 168L116 180L132 144L126 330L180 340L234 330L228 144L244 180L266 168L244 112L204 99C198 93 190 90 180 90Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M156 99C165 113 195 113 204 99" {...accentProps} strokeWidth="1.8" />
        <path d="M132 144L132 326M228 144L228 326" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M126 320L234 320" stroke="rgba(241,242,246,0.3)" strokeWidth="1.2" />
        <path d="M152 152L166 152M208 152L194 152" stroke="rgba(192,132,252,0.8)" strokeWidth="1.2" />
        <circle cx="180" cy="116" r="2.2" fill="#E8E9EE" />
      </>
    ),
    cargo: (
      <>
        <path
          d="M116 96H244L250 250L234 440H190L180 214L170 440H126L110 250Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M112 116H248" stroke="rgba(241,242,246,0.38)" strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={`bl${i}`} d={`M${126 + i * 22} 96V108`} stroke="rgba(201,203,212,0.25)" strokeWidth="1" />
        ))}
        <path d="M180 108V214" stroke="rgba(241,242,246,0.28)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M124 238H166L164 292L130 286Z" {...strokeProps} fill="rgba(168,85,247,0.07)" strokeWidth="1.2" />
        <path d="M236 238H194L196 292L230 286Z" {...strokeProps} fill="rgba(168,85,247,0.07)" strokeWidth="1.2" />
        <path d="M128 252H162M198 252H232" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        <path d="M132 310H172M188 310H228" stroke="rgba(241,242,246,0.3)" strokeWidth="1.2" />
        <path d="M180 320L172 320M180 340L172 340" stroke="rgba(201,203,212,0.2)" strokeWidth="1" />
        <path d="M126 430L170 430M190 430L234 430" stroke="rgba(201,203,212,0.3)" strokeWidth="1.2" />
        <circle cx="180" cy="108" r="2.4" fill="#E8E9EE" />
        <circle cx="163" cy="235" r="2" fill="#C084FC" />
      </>
    ),
    denim: (
      <>
        <path
          d="M118 98H242L248 250L232 434H188L180 216L172 434H128L112 250Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M114 118H246" stroke="rgba(241,242,246,0.36)" strokeWidth="1.4" />
        <path d="M180 118V216" stroke="rgba(241,242,246,0.24)" strokeWidth="1" strokeDasharray="5 5" />
        <path d="M128 222H170L168 280L134 276Z" fill="rgba(255,255,255,0.025)" stroke="rgba(192,132,252,0.5)" strokeWidth="1.1" strokeDasharray="3 3" />
        <path d="M232 222H192L194 280L228 276Z" fill="rgba(255,255,255,0.025)" stroke="rgba(192,132,252,0.5)" strokeWidth="1.1" strokeDasharray="3 3" />
        <path d="M136 300H166L164 340L138 336Z" fill="rgba(168,85,247,0.04)" stroke="rgba(192,132,252,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <path d="M198 300H228L226 340L200 336Z" fill="rgba(168,85,247,0.04)" stroke="rgba(192,132,252,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <path d="M126 128L132 425M234 128L228 425" stroke="rgba(192,132,252,0.3)" strokeWidth="1" strokeDasharray="3 4" />
        {[
          [130, 132],
          [230, 132],
          [166, 224],
          [194, 224],
        ].map(([cx, cy], i) => (
          <circle key={`r${i}`} cx={cx} cy={cy} r="2.2" fill="#E8E9EE" opacity="0.8" />
        ))}
        <circle cx="180" cy="118" r="2.4" fill="#E8E9EE" />
      </>
    ),
    bag: (
      <>
        <path
          d="M100 164C118 64 242 64 260 164"
          fill="none"
          stroke="rgba(201,203,212,0.32)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M100 164C118 64 242 64 260 164"
          fill="none"
          stroke="rgba(168,85,247,0.55)"
          strokeWidth="1.4"
          strokeDasharray="3 7"
        />
        <rect x="102" y="166" width="156" height="156" rx="34" fill={`url(#${fill})`} stroke={`url(#${stroke})`} strokeWidth="2" />
        <path d="M104 192C104 174 130 164 180 164C230 164 256 174 256 192V228C230 246 130 246 104 228Z" fill="rgba(255,255,255,0.035)" stroke="rgba(241,242,246,0.32)" strokeWidth="1.2" />
        <circle cx="180" cy="256" r="30" fill="none" stroke={`url(#${accent})`} strokeWidth="2.4" />
        <circle cx="180" cy="256" r="21" fill="none" stroke="rgba(201,203,212,0.4)" strokeWidth="1" />
        <circle cx="180" cy="256" r="7" fill="rgba(168,85,247,0.16)" stroke="rgba(192,132,252,0.7)" strokeWidth="1.2" />
        <path d="M138 214H222" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <rect x="162" y="284" width="36" height="12" rx="3" fill="rgba(255,255,255,0.04)" stroke="rgba(201,203,212,0.35)" strokeWidth="1" />
        <path d="M100 176L94 176M260 176L266 176" stroke="rgba(201,203,212,0.35)" strokeWidth="2" />
      </>
    ),
    cap: (
      <>
        <path
          d="M92 230C92 150 136 108 180 108C224 108 268 150 268 230Z"
          fill={`url(#${fill})`}
          stroke={`url(#${stroke})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M180 108C148 146 138 190 140 232M180 108C212 146 222 190 220 232M180 108V232" stroke="rgba(241,242,246,0.22)" strokeWidth="1" />
        <path d="M86 234C116 214 244 214 274 234C244 260 116 260 86 234Z" fill={`url(#${fill})`} stroke={`url(#${stroke})`} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 236C130 224 230 224 260 236" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <circle cx="180" cy="112" r="6" fill="rgba(255,255,255,0.06)" stroke="rgba(201,203,212,0.5)" strokeWidth="1.2" />
        <path d="M172 190L180 178L188 190L180 202Z" fill="rgba(168,85,247,0.16)" stroke={`url(#${accent})`} strokeWidth="1.4" />
        <path d="M154 226C170 220 190 220 206 226" stroke="rgba(192,132,252,0.45)" strokeWidth="1" strokeDasharray="2 4" />
      </>
    ),
  };

  const code = slug.replace(/-/g, " ").slice(0, 14).toUpperCase();

  return (
    <svg
      viewBox="0 0 360 460"
      className={className}
      role="img"
      aria-label={`${label} — holographic garment scan`}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <title>{label} — holographic garment scan</title>
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#261d35" />
          <stop offset="38%" stopColor="#15111d" />
          <stop offset="72%" stopColor="#0a080e" />
          <stop offset="100%" stopColor="#181223" />
        </linearGradient>
        <linearGradient id={stroke} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1F2F6" />
          <stop offset="38%" stopColor="#C9CBD4" />
          <stop offset="62%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id={accent} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id={glow} cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.34" />
          <stop offset="64%" stopColor="#6D28D9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#050506" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#C084FC" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clip}>
          <rect x="0" y="0" width="360" height="460" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clip})`}>
        <ellipse cx="180" cy="238" rx="160" ry="172" fill={`url(#${glow})`} opacity={variant === "card" ? 0.75 : 1} />

        {/* measurement field */}
        <circle cx="180" cy="238" r="150" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" strokeDasharray="1 9" />
        <circle cx="180" cy="238" r="118" fill="none" stroke="rgba(168,85,247,0.09)" strokeWidth="1" />
        <path d="M180 56V80M180 396V420M30 238H54M306 238H330" stroke="rgba(201,203,212,0.3)" strokeWidth="1" />
        <path d="M44 96H58M44 96V110M316 96H302M316 96V110M44 380H58M44 380V366M316 380H302M316 380V366" stroke="rgba(201,203,212,0.3)" strokeWidth="1" />

        {/* dot matrix */}
        <g fill="rgba(201,203,212,0.28)">
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`d-${row}-${col}`} cx={36 + col * 7} cy={170 + row * 7} r="0.8" />
            ))
          )}
        </g>

        <g className="garment-float">{silhouettes[kind]}</g>

        {/* scan sweep */}
        <g className="garment-scan" opacity="0.8">
          <rect x="28" y="0" width="304" height="16" fill={`url(#${sheen})`} opacity="0.35" />
          <path d="M28 8H332" stroke={`url(#${accent})`} strokeWidth="1" opacity="0.65" />
        </g>
        <g className="garment-sheen">
          <rect x="0" y="40" width="46" height="380" fill={`url(#${sheen})`} opacity="0.5" transform="rotate(14 0 40)" />
        </g>

        {showHud && (
          <g
            fontFamily="var(--font-space-mono), monospace"
            fontSize={variant === "card" ? 7 : 8}
            letterSpacing="2"
            fill="rgba(201,203,212,0.5)"
          >
            <text x="28" y="30">RW / SCAN {code || "PIECE"}</text>
            <text x="332" y="30" textAnchor="end">360°</text>
            <text x="28" y="444">FIBRE PASSPORT // VERIFIED</text>
            <text x="332" y="444" textAnchor="end">SS26</text>
            <path d="M28 440H88" stroke="rgba(192,132,252,0.5)" strokeWidth="1" />
          </g>
        )}

        {/* corner brackets */}
        <path
          d="M22 22H46M22 22V46M338 22H314M338 22V46M22 438H46M22 438V414M338 438H314M338 438V414"
          stroke="rgba(192,132,252,0.4)"
          strokeWidth="1"
          fill="none"
        />
      </g>
    </svg>
  );
}
