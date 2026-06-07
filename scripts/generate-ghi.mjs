/**
 * Gera ghi.json nacional a partir de municipios.json + médias HSP por UF.
 * Executar: node scripts/generate-ghi.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FATORES = [1.08, 1.06, 1.02, 0.98, 0.94, 0.9, 0.91, 0.96, 1.0, 1.03, 1.06, 1.09];
const MEDIA_FATORES = FATORES.reduce((a, b) => a + b, 0) / FATORES.length;
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const CODIGO_UF_TO_SIGLA = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO",
  21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL",
  28: "SE", 29: "BA", 31: "MG", 32: "ES", 33: "RJ", 35: "SP", 41: "PR",
  42: "SC", 43: "RS", 50: "MS", 51: "MT", 52: "GO", 53: "DF",
};

/** Médias HSP por UF (kWh/m².dia) — referência regional */
const UF_HSP = {
  AC: 5.0, AL: 5.6, AP: 5.1, AM: 5.2, BA: 5.5, CE: 5.8, DF: 5.4, ES: 5.2,
  GO: 5.5, MA: 5.6, MG: 5.3, MS: 5.3, MT: 5.4, PA: 5.0, PB: 5.6, PR: 4.4,
  PE: 5.6, PI: 5.7, RJ: 5.0, RN: 5.7, RS: 4.5, RO: 5.1, RR: 5.3, SC: 4.6,
  SP: 4.8, SE: 5.5, TO: 5.5,
};

function round(n, d = 2) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

const municipiosPath = path.join(root, "src/lib/solar/data/municipios.json");
const municipios = JSON.parse(fs.readFileSync(municipiosPath, "utf8"));

const records = municipios.map((m) => {
  const uf = CODIGO_UF_TO_SIGLA[m.codigo_uf] ?? "DF";
  const hsp = UF_HSP[uf] ?? 5.0;
  const entry = {
    cidade: m.nome,
    uf,
    latitude: m.latitude,
    longitude: m.longitude,
  };
  for (let i = 0; i < MONTHS.length; i++) {
    entry[MONTHS[i]] = round(hsp * (FATORES[i] / MEDIA_FATORES));
  }
  return entry;
});

const outPath = path.join(root, "src/lib/solar/data/ghi.json");
fs.writeFileSync(outPath, JSON.stringify(records));
console.log(`Gerado ${records.length} registros em ghi.json`);
