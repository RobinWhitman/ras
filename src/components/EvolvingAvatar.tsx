const stages = [
  { level: 1, rank: "Éveillé", accent: "#713f12", mark: "" },
  { level: 10, rank: "Aventurier", accent: "#92400e", mark: "◆" },
  { level: 25, rank: "Gardien", accent: "#71717a", mark: "⚔" },
  { level: 50, rank: "Champion", accent: "#b91c1c", mark: "🛡" },
  { level: 75, rank: "Seigneur", accent: "#a16207", mark: "✦" },
  { level: 100, rank: "Souverain", accent: "#eab308", mark: "♛" },
] as const;

export function getAvatarStage(level: number) {
  return [...stages].reverse().find((stage) => level >= stage.level) ?? stages[0];
}

export default function EvolvingAvatar({
  kind,
  level,
  className = "",
}: {
  kind: "hero" | "loki";
  level: number;
  className?: string;
}) {
  const stageIndex = Math.max(
    0,
    stages.findIndex((stage, index) =>
      level >= stage.level && (index === stages.length - 1 || level < stages[index + 1].level)
    )
  );
  const stage = stages[stageIndex];

  if (kind === "hero" && stageIndex > 0) {
    return (
      <div
        role="img"
        aria-label={`Robin, ${stage.rank}, niveau ${level}`}
        className={`relative bg-no-repeat ${className}`}
        style={{
          backgroundImage: "url('/assets/hero/robin-evolution-sheet.png')",
          backgroundSize: "600% auto",
          backgroundPosition: `${stageIndex * 20}% 70%`,
          boxShadow: `inset 0 0 0 2px ${stage.accent}`,
        }}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ boxShadow: `inset 0 0 0 2px ${stage.accent}` }}>
      <img
        src={kind === "hero" ? "/assets/hero/robin-pixel.png" : "/assets/companion/loki-pixel.png"}
        alt={kind === "hero" ? "Robin, Héros de RAS" : "LOKI"}
        className="h-full w-full object-cover"
        style={{ filter: `contrast(${1 + stageIndex * 0.05}) saturate(${1 + stageIndex * 0.08})` }}
      />
      {stage.mark && (
        <span className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-yellow-500 bg-black/80 text-lg text-yellow-300">
          {stage.mark}
        </span>
      )}
    </div>
  );
}
