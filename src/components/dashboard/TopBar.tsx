"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/data/navigation";
import BrandLogo from "@/components/BrandLogo";

type TopBarProps = {
  heroLevel: number;
  xp: number;
  glory: number;
  currentStreak: number;
  bestStreak: number;
  currentDate: string;
};

function formatCurrentDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export default function TopBar({
  heroLevel,
  xp,
  glory,
  currentStreak,
  bestStreak,
  currentDate,
}: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-2 z-40 flex min-h-16 min-w-0 items-center gap-2 rounded-lg border border-zinc-800 bg-black/95 px-2 py-2 backdrop-blur sm:gap-4 sm:px-3 lg:static lg:h-16 lg:py-0">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <BrandLogo compact />

        <nav className="hidden min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] md:block [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5">
            {navigationLinks.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded border px-2 text-sm font-bold transition ${
                    active
                      ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span className="hidden 2xl:inline">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="min-w-0 md:hidden">
          <p className="truncate text-sm font-black text-white">
            RAS · Robin Niv. {heroLevel}
          </p>
          <p className="truncate text-[11px] capitalize text-yellow-400">
            {formatCurrentDate(currentDate)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-right sm:gap-4 sm:border-l sm:border-zinc-800 sm:pl-4">
        <div className="hidden md:block">
          <p className="whitespace-nowrap text-xs font-bold capitalize text-yellow-400">
            {formatCurrentDate(currentDate)}
          </p>
          <p className="text-[10px] text-zinc-500">
            Missions du jour
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-black text-orange-400">
            Série {currentStreak}
          </p>
          <p className="text-[10px] text-zinc-500">
            Record {bestStreak}
          </p>
        </div>

        <div>
          <p className="whitespace-nowrap text-xs font-black text-white sm:text-sm">
            <span className="hidden sm:inline">Robin · </span>
            Niv. {heroLevel}
          </p>
          <p className="whitespace-nowrap text-[10px] text-zinc-400">
            {xp} XP · {glory} G
          </p>
        </div>
      </div>
    </header>
  );
}
