import {
  Calculator,
  Clock,
  PiggyBank,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const benefits: {
  icon: LucideIcon;
  title: string;
  description: string;
  stat: string;
  gradient: string;
}[] = [
  {
    icon: PiggyBank,
    title: "Economia mensal",
    description:
      "Veja quanto você pode economizar na conta de luz todo mês com energia solar.",
    stat: "Até 95%",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: Calculator,
    title: "Cálculo automático",
    description:
      "Informe seu consumo e receba o dimensionamento ideal sem fórmulas complicadas.",
    stat: "Em 30s",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: Clock,
    title: "Payback",
    description:
      "Saiba em quantos anos seu investimento se paga com retorno claro e objetivo.",
    stat: "4–6 anos",
    gradient: "from-violet-500/20 to-violet-600/5",
  },
  {
    icon: TrendingUp,
    title: "Geração estimada",
    description:
      "Projeção de kWh mensal e anual com base na localização informada.",
    stat: "kWh reais",
    gradient: "from-solar-500/25 to-solar-600/5",
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-solar-600">
            Por que usar
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Tudo que você precisa saber,{" "}
            <span className="bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent">
              em linguagem simples
            </span>
          </h2>
          <p className="mt-4 text-lg text-navy-700/70">
            Sem jargão técnico. Resultados claros para tomar a melhor decisão sobre
            energia solar.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => (
            <article
              key={item.title}
              className="card-shine group relative rounded-2xl border border-navy-800/8 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-solar-500/30 hover:shadow-xl hover:shadow-solar-500/10"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${item.gradient} p-3`}
              >
                <item.icon className="h-6 w-6 text-navy-800" strokeWidth={2} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-solar-600">
                {item.stat}
              </p>
              <h3 className="mt-2 text-lg font-bold text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/65">
                {item.description}
              </p>
              <div className="mt-5 h-0.5 w-0 rounded-full bg-gradient-to-r from-solar-500 to-solar-400 transition-all duration-500 group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
