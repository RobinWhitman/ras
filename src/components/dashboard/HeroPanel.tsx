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
    <Card title="🧍 Héros">
      <div className="flex h-32 items-center justify-center rounded-xl border border-zinc-800">
        <p className="text-5xl">🧍</p>
      </div>

      <p className="mt-3 font-semibold">
        Robin — Niveau {heroLevel}
      </p>

      <ProgressBar
        value={currentLevelXp}
        max={50}
        color="yellow"
      />

      <p className="mt-2 text-sm text-zinc-400">
        {currentLevelXp} / 50 XP
      </p>

      <Link
        href="/hero"
        className="mt-3 block rounded-lg border border-zinc-700 px-3 py-2 text-center text-xs font-bold transition hover:border-yellow-500 hover:text-yellow-400"
      >
        Ouvrir le Héros →
      </Link>
    </Card>
  );
}