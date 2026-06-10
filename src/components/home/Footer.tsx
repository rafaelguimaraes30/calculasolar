import { CookiePreferencesLink } from "@/components/analytics/CookiePreferencesLink";
import { Mail, MapPin, Sun } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Produto: [
    { label: "Simulador", href: "/simulador" },
    { label: "Concessionárias", href: "/tarifas" },
    { label: "Como funciona", href: "/#como-funciona" },
    { label: "Benefícios", href: "/#beneficios" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Notícias", href: "/ultimas-noticias" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de uso", href: "#" },
    { label: "cookies", href: "" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-navy-800/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-solar-500 to-solar-400">
                <Sun className="h-5 w-5 text-navy-900" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-bold text-navy-900">
                Calcula<span className="text-solar-600">Solar</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-700/65">
              Simulador gratuito de energia solar para residências e comércios no
              Brasil. Descubra quantos painéis você precisa com dados reais da
              sua cidade.
            </p>
            <div className="mt-6 space-y-2 text-sm text-navy-700/60">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-solar-600" />
                contato@calculasolar.com.br
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-solar-600" />
                Brasil
              </p>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-navy-900">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.label === "cookies" ? (
                      <CookiePreferencesLink />
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-navy-700/65 transition-colors hover:text-solar-600"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800/10 pt-8 sm:flex-row">
          <p className="text-sm text-navy-700/50">
            © {new Date().getFullYear()} CalculaSolar. Todos os direitos reservados.
          </p>
          <p className="text-xs text-navy-700/40">
            Simulação ilustrativa. Valores reais dependem de análise técnica no local.
          </p>
        </div>
      </div>
    </footer>
  );
}
