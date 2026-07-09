type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
};

export default function TopBar({ heroLevel, xp, glory }: TopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between border border-zinc-800 rounded-xl px-5">
      <h1 className="text-4xl font-bold">RAS</h1>

      <div className="text-right">
        <p className="text-lg font-bold">Robin — Niveau {heroLevel}</p>
        <p className="text-sm text-zinc-400">
          XP {xp} · Glory {glory}
        </p>
      </div>
    </header>
  );
}