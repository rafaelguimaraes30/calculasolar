import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "@/components/home/Navbar";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { TarifaDataTable } from "@/components/tarifas/TarifaDataTable";
import { TarifaInternalLinks } from "@/components/tarifas/TarifaInternalLinks";
import {
  TARIFA_COMPOSITION_SECTION,
  TARIFA_FAQ_ITEMS,
  TARIFA_SOLAR_SECTION,
} from "@/lib/tarifas/tarifasContent";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildTarifaArticleJsonLd,
} from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import {
  getAllTarifaSlugs,
  getTarifaPageBySlug,
} from "@/lib/tarifas/tarifasSeoData";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTarifaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getTarifaPageBySlug(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: `Tarifa da ${page.distribuidora} (${page.uf})`,
    description: `Confira os componentes tarifários da ${page.distribuidora} em ${page.uf}. Valores de referência de TE, TUSD, ICMS e PIS/COFINS.`,
    path: `/tarifa/${slug}`,
    keywords: [
      "tarifa energia",
      page.distribuidora,
      page.uf,
      "TE",
      "TUSD",
      "concessionária",
    ],
    type: "article",
  });
}

export default async function TarifaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getTarifaPageBySlug(slug);
  if (!page) notFound();

  const pageUrl = `${SITE_URL}/tarifa/${slug}`;
  const title = `Tarifa da ${page.distribuidora} (${page.uf})`;

  return (
    <>
      <JsonLd
        data={buildTarifaArticleJsonLd({
          title,
          description: `Tarifa de energia elétrica da ${page.distribuidora} em ${page.uf}.`,
          url: pageUrl,
        })}
      />
      <JsonLd data={buildFaqPageJsonLd(TARIFA_FAQ_ITEMS)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Início", item: SITE_URL },
          { name: "Tarifas", item: `${SITE_URL}/tarifas` },
          {
            name: page.uf,
            item: `${SITE_URL}/tarifas/${page.uf.toLowerCase()}`,
          },
          { name: page.distribuidora, item: pageUrl },
        ])}
      />
      <JsonLd data={buildOrganizationJsonLd()} />
      <Navbar />
      <main className="bg-background">
        <AdSlot position="top-banner" className="mx-auto mt-4 max-w-7xl px-4 h-20 sm:h-24" />
        <article className="py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              className="mb-6"
              items={[
                { label: "Início", href: "/" },
                { label: "Tarifas", href: "/tarifas" },
                { label: page.uf, href: `/tarifas/${page.uf.toLowerCase()}` },
                { label: page.distribuidora },
              ]}
            />

            <header>
              <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                {title}
              </h1>
              <p className="mt-4 text-lg text-navy-700/70">
                Informações institucionais da concessionária de energia elétrica
                na sua região.
              </p>
            </header>

            <AdSlot position="inline-content" className="my-8 h-20 sm:h-24" />

            <TarifaDataTable page={page} />

            <section className="mt-10 space-y-4">
              <h2 className="text-xl font-bold text-navy-900">
                {TARIFA_COMPOSITION_SECTION.heading}
              </h2>
              {TARIFA_COMPOSITION_SECTION.paragraphs.map((p) => (
                <p key={p} className="text-base leading-relaxed text-navy-700/80">
                  {p}
                </p>
              ))}
              <ul className="space-y-3">
                {TARIFA_COMPOSITION_SECTION.items.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-navy-800/10 bg-white p-4"
                  >
                    <p className="font-semibold text-navy-900">{item.title}</p>
                    <p className="mt-1 text-sm text-navy-700/70">{item.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-10 rounded-2xl border border-solar-500/20 bg-solar-500/8 p-8">
              <h2 className="text-xl font-bold text-navy-900">
                {TARIFA_SOLAR_SECTION.heading}
              </h2>
              {TARIFA_SOLAR_SECTION.paragraphs.map((p) => (
                <p key={p} className="mt-3 text-base leading-relaxed text-navy-700/80">
                  {p}
                </p>
              ))}
              <Link
                href="/simulador"
                className="mt-5 inline-flex rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-8 py-3 text-sm font-bold text-navy-900 transition-all hover:scale-105"
              >
                Simule sua economia com energia solar
              </Link>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold text-navy-900">
                Perguntas Frequentes
              </h2>
              <div className="mt-4 space-y-4">
                {TARIFA_FAQ_ITEMS.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-xl border border-navy-800/10 bg-white p-4"
                  >
                    <h3 className="font-semibold text-navy-900">{item.question}</h3>
                    <p className="mt-2 text-sm text-navy-700/70">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10">
              <TarifaInternalLinks uf={page.uf} />
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
