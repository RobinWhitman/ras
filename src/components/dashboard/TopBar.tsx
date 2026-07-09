type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
};

export default function TopBar({ heroLevel, xp, glory }: TopBarProps) {
  return (
    <header className="flex items-center justify-between border border-zinc-800 rounded-xl p-4">
      <h1 className="text-5xl font-bold">RAS</h1>

      <div className="text-right">
        <p className="text-xl font-bold">Robin — Niveau {heroLevel}</p>
        <p className="text-zinc-400">
          XP {xp} · Glory {glory}
        </p>
      </div>
    </header>
  );
}