"use client";

import { Menu, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#simulador", label: "Simulador" },
  { href: "#resultados", label: "Resultados" },
  { href: "/blog", label: "Blog" },
  { href: "/ultimas-noticias", label: "Notícias" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerBackground = isHome
    ? scrolled
      ? "bg-navy-900/90 shadow-lg shadow-navy-950/20 backdrop-blur-xl"
      : "bg-navy-900/80 backdrop-blur-md"
    : "bg-navy-900/90 shadow-lg shadow-navy-950/20 backdrop-blur-md";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${headerBackground}`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-solar-500 to-solar-400 shadow-lg shadow-solar-500/30 transition-transform group-hover:scale-105">
            <Sun className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            Calcula<span className="gradient-text">Solar</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              {link.href.startsWith("/") ? (
                <Link
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-solar-400"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-solar-400"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#simulador"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-6 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-solar-500/25 transition-all hover:scale-105 hover:shadow-solar-500/40"
          >
            Simular Agora
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-900/95 px-4 py-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    className="block py-2 text-base font-medium text-white/80"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block py-2 text-base font-medium text-white/80"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a
                href="#simulador"
                className="mt-2 block rounded-full bg-gradient-to-r from-solar-500 to-solar-400 py-3 text-center text-sm font-semibold text-navy-900"
                onClick={() => setOpen(false)}
              >
                Simular Agora
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
