/**
 * Banco local de módulos fotovoltaicos.
 * Substituível via `setModulesDataProvider()` (ex.: Supabase no futuro).
 */

export type ModuleCellType = "Monocristalino" | "Bifacial";

export interface SolarModuleRecord {
  id: string;
  fabricante: string;
  modelo: string;
  potenciaW: number;
  eficienciaPercent: number;
  /** Largura do módulo em milímetros */
  larguraMm: number;
  /** Altura (comprimento) do módulo em milímetros */
  alturaMm: number;
  tipo: ModuleCellType;
  /** Preço médio por placa (R$) — equipamento, sem instalação */
  precoMedioReais: number;
}

export interface ModulesDataProvider {
  getAll(): SolarModuleRecord[];
  getById(id: string): SolarModuleRecord | undefined;
  getManufacturers(): string[];
  getPowersByManufacturer(fabricante: string): number[];
  findByManufacturerAndPower(
    fabricante: string,
    potenciaW: number,
  ): SolarModuleRecord | undefined;
}

/** Espaço extra entre fileiras de painéis (sombras, passagens) */
export const AREA_SPACING_FACTOR = 1.1;

/** Custo médio de instalação por kWp (inversor, estrutura, cabos, mão de obra) */
export const CUSTO_INSTALACAO_POR_KWP = 1_800;

export const SOLAR_MODULES: readonly SolarModuleRecord[] = [
  // Jinko Solar
  {
    id: "jinko-tiger-neo-550",
    fabricante: "Jinko Solar",
    modelo: "Tiger Neo 550W",
    potenciaW: 550,
    eficienciaPercent: 21.3,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 850,
  },
  {
    id: "jinko-tiger-neo-575",
    fabricante: "Jinko Solar",
    modelo: "Tiger Neo 575W",
    potenciaW: 575,
    eficienciaPercent: 22.1,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 920,
  },
  {
    id: "jinko-tiger-neo-585",
    fabricante: "Jinko Solar",
    modelo: "Tiger Neo 585W",
    potenciaW: 585,
    eficienciaPercent: 22.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 980,
  },
  {
    id: "jinko-tiger-neo-610",
    fabricante: "Jinko Solar",
    modelo: "Tiger Neo 610W",
    potenciaW: 610,
    eficienciaPercent: 23.0,
    larguraMm: 1134,
    alturaMm: 2384,
    tipo: "Monocristalino",
    precoMedioReais: 1_050,
  },
  // Trina Solar
  {
    id: "trina-vertex-s-550",
    fabricante: "Trina Solar",
    modelo: "Vertex S+ 550W",
    potenciaW: 550,
    eficienciaPercent: 21.4,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 840,
  },
  {
    id: "trina-vertex-s-575",
    fabricante: "Trina Solar",
    modelo: "Vertex S+ 575W",
    potenciaW: 575,
    eficienciaPercent: 22.2,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 910,
  },
  {
    id: "trina-vertex-s-585",
    fabricante: "Trina Solar",
    modelo: "Vertex S+ 585W",
    potenciaW: 585,
    eficienciaPercent: 22.6,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 970,
  },
  {
    id: "trina-vertex-s-610",
    fabricante: "Trina Solar",
    modelo: "Vertex S+ 610W",
    potenciaW: 610,
    eficienciaPercent: 23.1,
    larguraMm: 1134,
    alturaMm: 2384,
    tipo: "Monocristalino",
    precoMedioReais: 1_040,
  },
  // Canadian Solar
  {
    id: "canadian-hiku7-550",
    fabricante: "Canadian Solar",
    modelo: "HiKu7 550W",
    potenciaW: 550,
    eficienciaPercent: 21.2,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 830,
  },
  {
    id: "canadian-hiku7-575",
    fabricante: "Canadian Solar",
    modelo: "HiKu7 575W",
    potenciaW: 575,
    eficienciaPercent: 22.0,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 900,
  },
  {
    id: "canadian-hiku7-585",
    fabricante: "Canadian Solar",
    modelo: "HiKu7 585W",
    potenciaW: 585,
    eficienciaPercent: 22.4,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 960,
  },
  {
    id: "canadian-hiku7-610",
    fabricante: "Canadian Solar",
    modelo: "HiKu7 610W",
    potenciaW: 610,
    eficienciaPercent: 22.9,
    larguraMm: 1134,
    alturaMm: 2384,
    tipo: "Monocristalino",
    precoMedioReais: 1_030,
  },
  // JA Solar
  {
    id: "ja-deepblue-550",
    fabricante: "JA Solar",
    modelo: "DeepBlue 4.0 550W",
    potenciaW: 550,
    eficienciaPercent: 21.3,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 820,
  },
  {
    id: "ja-deepblue-575",
    fabricante: "JA Solar",
    modelo: "DeepBlue 4.0 575W",
    potenciaW: 575,
    eficienciaPercent: 22.1,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 890,
  },
  {
    id: "ja-deepblue-585",
    fabricante: "JA Solar",
    modelo: "DeepBlue 4.0 585W",
    potenciaW: 585,
    eficienciaPercent: 22.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 950,
  },
  {
    id: "ja-deepblue-610",
    fabricante: "JA Solar",
    modelo: "DeepBlue 4.0 610W",
    potenciaW: 610,
    eficienciaPercent: 23.0,
    larguraMm: 1134,
    alturaMm: 2384,
    tipo: "Monocristalino",
    precoMedioReais: 1_020,
  },
  // Longi Solar
  {
    id: "longi-himo6-550",
    fabricante: "Longi Solar",
    modelo: "Hi-MO 6 550W",
    potenciaW: 550,
    eficienciaPercent: 21.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 860,
  },
  {
    id: "longi-himo6-575",
    fabricante: "Longi Solar",
    modelo: "Hi-MO 6 575W",
    potenciaW: 575,
    eficienciaPercent: 22.3,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 930,
  },
  {
    id: "longi-himo6-585",
    fabricante: "Longi Solar",
    modelo: "Hi-MO 6 585W",
    potenciaW: 585,
    eficienciaPercent: 22.7,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 990,
  },
  {
    id: "longi-himo6-610",
    fabricante: "Longi Solar",
    modelo: "Hi-MO 6 610W",
    potenciaW: 610,
    eficienciaPercent: 23.2,
    larguraMm: 1134,
    alturaMm: 2384,
    tipo: "Bifacial",
    precoMedioReais: 1_060,
  },
  // Genérico
  {
    id: "generic-600w",
    fabricante: "Genérico",
    modelo: "Módulo Fotovoltaico 500–720W (Simulação)",
    potenciaW: 600,
    eficienciaPercent: 21.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 900,
  },
  {
    id: "generic-500",
    fabricante: "Genérico",
    modelo: "Linha Genérica 500W",
    potenciaW: 500,
    eficienciaPercent: 21.0,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 750,
  },
  {
    id: "generic-530",
    fabricante: "Genérico",
    modelo: "Linha Genérica 530W",
    potenciaW: 530,
    eficienciaPercent: 21.3,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 795,
  },
  {
    id: "generic-550",
    fabricante: "Genérico",
    modelo: "Linha Genérica 550W",
    potenciaW: 550,
    eficienciaPercent: 21.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 825,
  },
  {
    id: "generic-580",
    fabricante: "Genérico",
    modelo: "Linha Genérica 580W",
    potenciaW: 580,
    eficienciaPercent: 21.8,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 870,
  },
  {
    id: "generic-585",
    fabricante: "Genérico",
    modelo: "Linha Genérica 585W",
    potenciaW: 585,
    eficienciaPercent: 21.9,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 878,
  },
  {
    id: "generic-590",
    fabricante: "Genérico",
    modelo: "Linha Genérica 590W",
    potenciaW: 590,
    eficienciaPercent: 21.9,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 885,
  },
  {
    id: "generic-600",
    fabricante: "Genérico",
    modelo: "Linha Genérica 600W",
    potenciaW: 600,
    eficienciaPercent: 22.0,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 900,
  },
  {
    id: "generic-610",
    fabricante: "Genérico",
    modelo: "Linha Genérica 610W",
    potenciaW: 610,
    eficienciaPercent: 22.1,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 915,
  },
  {
    id: "generic-620",
    fabricante: "Genérico",
    modelo: "Linha Genérica 620W",
    potenciaW: 620,
    eficienciaPercent: 22.2,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 930,
  },
  {
    id: "generic-650",
    fabricante: "Genérico",
    modelo: "Linha Genérica 650W",
    potenciaW: 650,
    eficienciaPercent: 22.5,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 975,
  },
  {
    id: "generic-695",
    fabricante: "Genérico",
    modelo: "Linha Genérica 695W",
    potenciaW: 695,
    eficienciaPercent: 23.0,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 1_043,
  },
  {
    id: "generic-700",
    fabricante: "Genérico",
    modelo: "Linha Genérica 700W",
    potenciaW: 700,
    eficienciaPercent: 23.0,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 1_050,
  },
  {
    id: "generic-710",
    fabricante: "Genérico",
    modelo: "Linha Genérica 710W",
    potenciaW: 710,
    eficienciaPercent: 23.1,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 1_065,
  },
  {
    id: "generic-720",
    fabricante: "Genérico",
    modelo: "Linha Genérica 720W",
    potenciaW: 720,
    eficienciaPercent: 23.2,
    larguraMm: 1134,
    alturaMm: 2278,
    tipo: "Monocristalino",
    precoMedioReais: 1_080,
  },
] as const;

export const DEFAULT_MODULE_ID = "jinko-tiger-neo-585";

class LocalModulesDataProvider implements ModulesDataProvider {
  private readonly byId: Map<string, SolarModuleRecord>;

  constructor(private readonly modules: readonly SolarModuleRecord[]) {
    this.byId = new Map(modules.map((m) => [m.id, m]));
  }

  getAll(): SolarModuleRecord[] {
    return [...this.modules];
  }

  getById(id: string): SolarModuleRecord | undefined {
    return this.byId.get(id);
  }

  getManufacturers(): string[] {
    const set = new Set(this.modules.map((m) => m.fabricante));
    return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  getPowersByManufacturer(fabricante: string): number[] {
    const powers = this.modules
      .filter((m) => m.fabricante === fabricante)
      .map((m) => m.potenciaW);
    return [...new Set(powers)].sort((a, b) => a - b);
  }

  findByManufacturerAndPower(
    fabricante: string,
    potenciaW: number,
  ): SolarModuleRecord | undefined {
    return this.modules.find(
      (m) => m.fabricante === fabricante && m.potenciaW === potenciaW,
    );
  }
}

let activeProvider: ModulesDataProvider = new LocalModulesDataProvider(
  SOLAR_MODULES,
);

export function setModulesDataProvider(provider: ModulesDataProvider): void {
  activeProvider = provider;
}

export function getModulesDataProvider(): ModulesDataProvider {
  return activeProvider;
}

export function getModuleById(id: string): SolarModuleRecord | undefined {
  return activeProvider.getById(id);
}

export function getDefaultModule(): SolarModuleRecord {
  return (
    activeProvider.getById(DEFAULT_MODULE_ID) ?? activeProvider.getAll()[0]
  );
}

export function getManufacturers(): string[] {
  return activeProvider.getManufacturers();
}

export function getPowersByManufacturer(fabricante: string): number[] {
  return activeProvider.getPowersByManufacturer(fabricante);
}

/** Área de um módulo em m² (face do painel) */
export function getModuleAreaM2(module: SolarModuleRecord): number {
  return (module.larguraMm * module.alturaMm) / 1_000_000;
}

/** Área total do arranjo com folga entre fileiras */
export function calculateArrayAreaM2(
  quantidade: number,
  module: SolarModuleRecord,
): number {
  return quantidade * getModuleAreaM2(module) * AREA_SPACING_FACTOR;
}

export function calculateModulesInvestment(
  quantidade: number,
  module: SolarModuleRecord,
  potenciaInstaladaKwp: number,
): {
  custoModulosReais: number;
  custoInstalacaoReais: number;
  investimentoTotalReais: number;
} {
  const custoModulosReais = quantidade * module.precoMedioReais;
  const custoInstalacaoReais = potenciaInstaladaKwp * CUSTO_INSTALACAO_POR_KWP;
  return {
    custoModulosReais,
    custoInstalacaoReais,
    investimentoTotalReais: custoModulosReais + custoInstalacaoReais,
  };
}
