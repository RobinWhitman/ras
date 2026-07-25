import Link from "next/link";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";

type HeroPanelProps = {
  heroLevel: number;
  currentLevelXp: number;
};

export default function HeroPanel({
  heroLevel,
  currentLevelXp,
}: HeroPanelProps) {
  return (
    <Card title="⚔ Héros">
      <div className="relative h-40 overflow-hidden rounded-xl border border-yellow-900/60 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.16),transparent_62%)]" />

        <img
          src="/assets/hero/robin-pixel.png"
          alt="Robin, Héros de RAS"
          className="relative z-10 h-full w-full object-contain object-bottom"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold">
            Robin
          </p>

          <p className="text-xs text-yellow-400">
            Niveau {heroLevel}
          </p>
        </div>

        <p className="rounded-lg border border-zinc-800 px-2 py-1 text-xs font-bold text-zinc-300">
          Héros
        </p>
      </div>

      <div className="mt-3">
        <ProgressBar
          value={currentLevelXp}
          max={50}
          color="yellow"
        />

        <p className="mt-2 text-sm text-zinc-400">
          {currentLevelXp} / 50 XP
        </p>
      </div>

      <Link
        href="/hero"
        className="mt-3 block rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-bold transition hover:border-yellow-500 hover:text-yellow-400"
      >
        Ouvrir le Héros →
      </Link>
    </Card>
  );
}