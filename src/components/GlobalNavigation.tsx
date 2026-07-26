"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/data/navigation";
import BrandLogo from "@/components/BrandLogo";

export default function GlobalNavigation() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-800 bg-black/95 px-4 text-white backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1800px] min-w-0 items-center gap-4">
        <BrandLogo />

        <nav className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-1.5">
            {navigationLinks.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(
                  `${link.href}/`
                );

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  aria-current={
                    active ? "page" : undefined
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

                  <span className="hidden xl:inline">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}