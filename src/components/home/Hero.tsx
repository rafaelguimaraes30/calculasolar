import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { SolarIllustration } from "./SolarIllustration";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pb-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-solar-500/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-blue-600/10 to-transparent blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-solar-500/30 bg-solar-500/10 px-4 py-1.5 text-sm font-medium text-solar-400">
              <Sparkles className="h-4 w-4" />
              Simulação gratuita com dados do Brasil
            </div>

            <h1 className="animate-fade-up animation-delay-100 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Descubra quantos{" "}
              <span className="gradient-text">painéis solares</span> você precisa
            </h1>

            <p className="animate-fade-up animation-delay-200 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 lg:mx-0">
              Simule gratuitamente a geração de energia solar da sua residência ou
              comércio usando dados reais da sua cidade no Brasil.
            </p>

            <div className="animate-fade-up animation-delay-300 mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#simulador"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-solar-500 to-solar-400 px-8 py-4 text-base font-bold text-navy-900 shadow-xl shadow-solar-500/30 transition-all hover:scale-105 hover:shadow-solar-500/50 sm:w-auto"
              >
                Simular Agora
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#como-funciona"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-solar-500/50 hover:bg-white/5 sm:w-auto"
              >
                Como funciona
              </a>
            </div>

            <div className="animate-fade-up animation-delay-400 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/50 lg:justify-start">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-solar-500" />
                100% gratuito
              </span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Sem cadastro</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Resultado em segundos</span>
            </div>
          </div>

          <div className="animate-fade-up animation-delay-200 relative">
            <SolarIllustration />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
