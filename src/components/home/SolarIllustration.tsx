export function SolarIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -left-8 top-1/4 h-48 w-48 rounded-full bg-solar-500/20 blur-3xl animate-pulse-glow" />
      <div className="absolute -right-4 bottom-1/4 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl animate-pulse-glow animation-delay-300" />

      <div className="relative animate-float">
        <svg
          viewBox="0 0 480 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full drop-shadow-2xl"
          aria-hidden
        >
          <defs>
            <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e4a7a" />
              <stop offset="100%" stopColor="#0f2744" />
            </linearGradient>
            <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd54f" />
              <stop offset="100%" stopColor="#f5b800" />
            </linearGradient>
            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5b800" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f5b800" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="380"
              y1="80"
              x2={380 + 50 * Math.cos((angle * Math.PI) / 180)}
              y2={80 + 50 * Math.sin((angle * Math.PI) / 180)}
              stroke="url(#rayGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}

          {/* Sun */}
          <circle cx="380" cy="80" r="42" fill="url(#sunGrad)" />
          <circle cx="380" cy="80" r="52" fill="#f5b800" fillOpacity="0.15" />

          {/* House base */}
          <path
            d="M80 320 L240 200 L400 320 V360 H80 Z"
            fill="#0a1628"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <rect x="120" y="280" width="50" height="80" rx="4" fill="#15325a" />
          <rect x="310" y="280" width="50" height="80" rx="4" fill="#15325a" />

          {/* Roof panels row 1 */}
          <g transform="translate(130, 215)">
            {[0, 1, 2, 3].map((i) => (
              <g key={i} transform={`translate(${i * 58}, 0)`}>
                <rect
                  width="52"
                  height="38"
                  rx="3"
                  fill="url(#panelGrad)"
                  stroke="#f5b800"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                <line x1="8" y1="12" x2="44" y2="12" stroke="#f5b800" strokeOpacity="0.3" strokeWidth="1" />
                <line x1="8" y1="24" x2="44" y2="24" stroke="#f5b800" strokeOpacity="0.3" strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* Ground panels */}
          <g transform="translate(60, 330)">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 70}, ${i * -8}) rotate(-15 ${26} ${20})`}>
                <rect
                  width="52"
                  height="32"
                  rx="3"
                  fill="url(#panelGrad)"
                  stroke="#ffd54f"
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                <line x1="6" y1="10" x2="46" y2="10" stroke="#ffd54f" strokeOpacity="0.4" strokeWidth="1" />
                <line x1="6" y1="20" x2="46" y2="20" stroke="#ffd54f" strokeOpacity="0.4" strokeWidth="1" />
              </g>
            ))}
          </g>

          {/* Energy flow line */}
          <path
            d="M350 130 Q280 180 200 220"
            stroke="#f5b800"
            strokeWidth="2"
            strokeDasharray="8 6"
            fill="none"
            opacity="0.6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-28"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Stats bubble */}
          <g transform="translate(20, 60)">
            <rect width="140" height="72" rx="16" fill="rgba(255,255,255,0.95)" />
            <text x="20" y="32" fill="#0f2744" fontSize="11" fontFamily="system-ui" fontWeight="600">
              Geração estimada
            </text>
            <text x="20" y="54" fill="#0f2744" fontSize="20" fontFamily="system-ui" fontWeight="800">
              4.850 kWh
            </text>
            <circle cx="115" cy="36" r="18" fill="#f5b800" fillOpacity="0.2" />
            <text x="108" y="41" fill="#e6a800" fontSize="14" fontFamily="system-ui" fontWeight="700">
              ↑
            </text>
          </g>

          {/* Economy bubble */}
          <g transform="translate(300, 300)">
            <rect width="130" height="64" rx="14" fill="rgba(10,22,40,0.9)" stroke="rgba(245,184,0,0.3)" strokeWidth="1" />
            <text x="16" y="28" fill="#94a3b8" fontSize="10" fontFamily="system-ui">
              Economia mensal
            </text>
            <text x="16" y="48" fill="#ffd54f" fontSize="18" fontFamily="system-ui" fontWeight="800">
              R$ 420/mês
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
