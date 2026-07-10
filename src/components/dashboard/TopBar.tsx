type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
  currentStreak: number;
  bestStreak: number;
};

export default function TopBar({
  heroLevel,
  xp,
  glory,
  currentStreak,
  bestStreak,
}: TopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between border border-zinc-800 rounded-xl px-5">
      <h1 className="text-4xl font-bold">RAS</h1>

      <div className="flex items-center gap-8 text-right">
        <div>
          <p className="font-bold">
            🔥 Série : {currentStreak}
          </p>

          <p className="text-xs text-zinc-400">
            Record : {bestStreak}
          </p>
        </div>

        <div>
          <p className="text-lg font-bold">
            Robin — Niveau {heroLevel}
          </p>

          <p className="text-sm text-zinc-400">
            XP {xp} · Glory {glory}
          </p>
        </div>
      </div>
    </header>
  );
}