import Link from "next/link";

type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
  currentStreak: number;
  bestStreak: number;
};

const linkClass =
  "rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-400";

export default function TopBar({
  heroLevel,
  xp,
  glory,
  currentStreak,
  bestStreak,
}: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between rounded-xl border border-zinc-800 px-5">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold">RAS</h1>

        <Link href="/missions" className={linkClass}>
          🎯 Missions
        </Link>

        <Link href="/hero" className={linkClass}>
          🧍 Héros
        </Link>

        <Link href="/chapter" className={linkClass}>
          📕 Chapitre
        </Link>

        <Link href="/projects" className={linkClass}>
          📜 Projets
        </Link>

        <Link href="/kingdom" className={linkClass}>
          🏰 Royaume
        </Link>

        <Link href="/journal" className={linkClass}>
          📖 Journal
        </Link>

        <Link href="/settings" className={linkClass}>
          ⚙️ Paramètres
        </Link>
      </div>

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