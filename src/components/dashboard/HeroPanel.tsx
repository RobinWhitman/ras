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
      <div className="aspect-square border border-zinc-800 rounded-xl flex items-center justify-center mb-4">
        <p className="text-zinc-500">Avatar</p>
      </div>

      <p className="text-lg font-semibold">Robin — Niveau {heroLevel}</p>

      <ProgressBar value={currentLevelXp} max={50} color="yellow" />

      <p className="mt-3 text-zinc-400">
        {currentLevelXp} / 50 XP vers le prochain niveau
      </p>
    </Card>
  );
}