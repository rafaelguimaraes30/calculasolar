/**
 * Gera populacao.json (codigo_ibge → habitantes) a partir de fonte pública.
 * Executar: node scripts/generate-populacao.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SOURCES = [
  "https://raw.githubusercontent.com/nataliasm23/municipios-br/master/data/municipios.json",
];

async function fetchPopulacao() {
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;
      const map = {};
      for (const m of data) {
        const codigo = m.ibge_code ?? m.codigo_ibge ?? m.id;
        const pop =
          m.populacao_estimada_2025 ?? m.populacao_2022 ?? m.populacao ?? m.population;
        if (codigo && typeof pop === "number" && pop > 0) {
          map[codigo] = pop;
        }
      }
      if (Object.keys(map).length > 100) return map;
    } catch {
      /* tenta próxima fonte */
    }
  }
  return null;
}

const populacao = await fetchPopulacao();
if (!populacao) {
  console.error("Não foi possível obter dados de população.");
  process.exit(1);
}

const outPath = path.join(root, "src/lib/solar/data/populacao.json");
fs.writeFileSync(outPath, JSON.stringify(populacao), { encoding: "utf8" });
const above100k = Object.values(populacao).filter((p) => p >= 100_000).length;
console.log(`Gerado populacao.json: ${Object.keys(populacao).length} municípios, ${above100k} acima de 100 mil.`);
