import Link from "next/link";

interface TarifaInternalLinksProps {
  uf?: string;
}

const RELATED_BLOG = [
  {
    href: "/blog/como-funciona-energia-solar-economia-conta-luz",
    label: "Como a energia solar reduz a conta de luz",
  },
  {
    href: "/blog/energia-solar-vale-a-pena-2026",
    label: "Energia solar vale a pena em 2026?",
  },
  {
    href: "/blog/quanto-custa-instalar-energia-solar-2026",
    label: "Quanto custa instalar energia solar",
  },
];

export function TarifaInternalLinks({ uf }: TarifaInternalLinksProps) {
  return (
    <nav
      aria-label="Links relacionados"
      className="rounded-2xl border border-navy-800/10 bg-white p-6"
    >
      <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
        Navegue pelo CalculaSolar
      </h2>
      <ul className="mt-4 flex flex-wrap gap-4 text-sm">
        <li>
          <Link href="/" className="font-medium text-solar-600 hover:text-solar-600/80">
            Página inicial
          </Link>
        </li>
        <li>
          <Link href="/simulador" className="font-medium text-solar-600 hover:text-solar-600/80">
            Simulador
          </Link>
        </li>
        <li>
          <Link href="/blog" className="font-medium text-solar-600 hover:text-solar-600/80">
            Blog
          </Link>
        </li>
        <li>
          <Link
            href="/ultimas-noticias"
            className="font-medium text-solar-600 hover:text-solar-600/80"
          >
            Últimas notícias
          </Link>
        </li>
        <li>
          <Link href="/tarifas" className="font-medium text-solar-600 hover:text-solar-600/80">
            Tarifas
          </Link>
        </li>
        {uf && (
          <li>
            <Link
              href={`/tarifas/${uf.toLowerCase()}`}
              className="font-medium text-solar-600 hover:text-solar-600/80"
            >
              Tarifas em {uf}
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/ranking-tarifas"
            className="font-medium text-solar-600 hover:text-solar-600/80"
          >
            Ranking nacional
          </Link>
        </li>
      </ul>

      <h3 className="mt-6 text-sm font-bold text-navy-900">Artigos relacionados</h3>
      <ul className="mt-3 space-y-2">
        {RELATED_BLOG.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm font-medium text-navy-800 hover:text-solar-600"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
