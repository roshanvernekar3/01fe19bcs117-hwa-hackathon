import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/12 blur-[110px]" />
        <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[34vw] font-bold leading-none tracking-[-0.08em] text-outline opacity-[0.05]">
          404
        </p>
      </div>

      <div className="container-x flex flex-col items-center text-center">
        <p className="eyebrow">Signal lost / 404</p>
        <h1 className="mt-4 text-[clamp(2.6rem,8vw,6rem)] font-medium leading-[0.9] tracking-[-0.05em] text-chrome">
          This thread
          <br />
          <span className="text-gradient">doesn&apos;t exist.</span>
        </h1>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-silver/45">
          The piece may have sold out, moved to the archive, or the link was mistyped. The system is
          still here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-primary">
            Explore the catalogue <Icon name="arrow-right" size={15} />
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back to the system
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/25">
          <Link href="/style-match" className="hover:text-violet-bright">AI Style Match</Link>
          <Link href="/sustainability" className="hover:text-violet-bright">Sustainability</Link>
          <Link href="/support" className="hover:text-violet-bright">Support</Link>
        </div>
      </div>
    </div>
  );
}
