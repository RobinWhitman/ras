"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
  currentStreak: number;
  bestStreak: number;
};

const navigationLinks = [
  {
    href: "/missions",
    label: "Missions",
    icon: "🎯",
  },
  {
    href: "/companion",
    label: "LOKI",
    icon: "🐈‍⬛",
  },
  {
    href: "/hero",
    label: "Héros",
    icon: "🧍",
  },
  {
    href: "/chapter",
    label: "Chapitre",
    icon: "📕",
  },
  {
    href: "/projects",
    label: "Projets",
    icon: "📜",
  },
  {
    href: "/kingdom",
    label: "Royaume",
    icon: "🏰",
  },
  {
    href: "/achievements",
    label: "Succès",
    icon: "🏆",
  },
  {
    href: "/report",
    label: "Rapport",
    icon: "📊",
  },
  {
    href: "/journal",
    label: "Journal",
    icon: "📖",
  },
  {
    href: "/settings",
    label: "Réglages",
    icon: "⚙️",
  },
] as const;

export default function TopBar({
  heroLevel,
  xp,
  glory,
  currentStreak,
  bestStreak,
}: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-16 min-w-0 items-center gap-4 rounded-lg border border-zinc-800 bg-black px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          href="/"
          title="Dashboard"
          className="shrink-0 text-3xl font-black text-white transition hover:text-yellow-400"
        >
          RAS
        </Link>

        <nav className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5">
            {navigationLinks.map((link) => {
              const active =
                pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`flex h-9 min-w-9 shrink-0 items-center justify-center gap-2 rounded border px-2 text-sm font-bold transition ${
                    active
                      ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">
                    {link.icon}
                  </span>

                  <span className="hidden 2xl:inline">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-4 border-l border-zinc-800 pl-4 text-right">
        <div className="hidden lg:block">
          <p className="text-sm font-black text-orange-400">
            Série {currentStreak}
          </p>

          <p className="text-[10px] text-zinc-500">
            Record {bestStreak}
          </p>
        </div>

        <div>
          <p className="whitespace-nowrap text-sm font-black text-white">
            Robin · Niv. {heroLevel}
          </p>

          <p className="whitespace-nowrap text-[10px] text-zinc-400">
            {xp} XP · {glory} Glory
          </p>
        </div>
      </div>
    </header>
  );
}