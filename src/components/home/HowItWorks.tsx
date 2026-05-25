import { BarChart3, ClipboardList, Sun } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Informe seu consumo",
    description:
      "Digite cidade, estado, consumo mensal em kWh e o tipo do imóvel. Leva menos de um minuto.",
  },
  {
    number: "02",
    icon: Sun,
    title: "Simulamos sua geração",
    description:
      "Cruzamos seus dados com a irradiação solar real da sua região no Brasil para dimensionar o sistema.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Veja economia e retorno",
    description:
      "Receba painéis necessários, potência, economia mensal, payback e geração estimada em um painel claro.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-navy-900 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-800/50 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-solar-400">
            Passo a passo
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Simples como{" "}
            <span className="gradient-text">1, 2, 3</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Você não precisa entender de energia solar. Nós traduzimos tudo para você.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-1/2 top-24 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-solar-500/40 to-transparent lg:block" />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-solar-500 to-solar-400 shadow-lg shadow-solar-500/30">
                    <step.icon className="h-9 w-9 text-navy-900" strokeWidth={2} />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-solar-400 ring-2 ring-navy-900">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="my-6 h-8 w-px bg-gradient-to-b from-solar-500/50 to-transparent lg:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
