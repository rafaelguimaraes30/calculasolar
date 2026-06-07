type AdPosition = "top-banner" | "inline-content" | "after-results" | "sidebar";

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

const POSITION_LABELS: Record<AdPosition, string> = {
  "top-banner": "Banner superior",
  "inline-content": "Conteúdo patrocinado",
  "after-results": "Após resultados",
  sidebar: "Barra lateral",
};

/**
 * Placeholder para futura monetização (Google AdSense).
 * Não exibe anúncios — apenas reserva espaço no layout.
 */
export function AdSlot({ position, className = "" }: AdSlotProps) {
  return (
    <div
      data-ad-slot={position}
      aria-hidden="true"
      className={`ad-slot-placeholder flex items-center justify-center rounded-xl border border-dashed border-navy-800/10 bg-navy-900/[0.02] text-center text-[10px] font-medium uppercase tracking-wider text-navy-700/25 ${className}`}
    >
      <span className="sr-only">Espaço reservado para anúncio: {POSITION_LABELS[position]}</span>
    </div>
  );
}
