"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationLinks } from "@/data/navigation";
import BrandLogo from "@/components/BrandLogo";

const mobileNavigationLinks = [
  {
    href: "/",
    label: "Accueil",
    icon: "🏠",
  },
  ...navigationLinks,
];

export default function GlobalNavigation() {
  const pathname = usePathname();
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const activeLink = mobileNavRef.current?.querySelector(
      '[aria-current="page"]'
    );

    activeLink?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [pathname]);

  return (
    <>
      {pathname !== "/" && (
        <header className="sticky top-0 z-50 hidden h-16 border-b border-zinc-800 bg-black/95 px-4 text-white backdrop-blur md:block">
          <div className="mx-auto flex h-full max-w-[1800px] min-w-0 items-center gap-4">
            <BrandLogo />

            <nav className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                      className={`flex h-10 min-w-10 shrink-0 items-center justify-center gap-2 rounded border px-3 text-sm font-bold transition ${
                        active
                          ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <span aria-hidden="true">{link.icon}</span>
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
      )}

      <nav
        ref={mobileNavRef}
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-50 overflow-x-auto border-t border-zinc-800 bg-black/95 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.65)] backdrop-blur [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-16 w-max min-w-full items-stretch pb-[env(safe-area-inset-bottom)]">
          {mobileNavigationLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-[68px] flex-1 shrink-0 flex-col items-center justify-center gap-1 border-t-2 px-2 text-[10px] font-bold ${
                  active
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                    : "border-transparent text-zinc-500"
                }`}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
