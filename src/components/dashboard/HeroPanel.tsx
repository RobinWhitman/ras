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
      <div className="h-32 border border-zinc-800 rounded-xl flex items-center justify-center mb-3">
        <p className="text-zinc-500">Avatar</p>
      </div>

      <p className="font-semibold">Robin — Niveau {heroLevel}</p>
      <ProgressBar value={currentLevelXp} max={50} color="yellow" />

      <p className="mt-2 text-sm text-zinc-400">
        {currentLevelXp} / 50 XP
      </p>
    </Card>
  );
}