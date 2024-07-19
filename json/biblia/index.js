// assets/biblia/index.js

import PrimeraCorintios from "./1_corintios";
import PrimeraCronicas from "./1_cronicas";
import PrimeraJuan from "./1_juan";
import PrimeraPedro from "./1_pedro";
import PrimeraReyes from "./1_reyes";
import PrimeraSamuel from "./1_samuel";
import PrimeraTesalonicenses from "./1_tesalonicenses";
import PrimeraTimoteo from "./1_timoteo";
import SegundaCorintios from "./2_corintios";
import SegundaCronicas from "./2_cronicas";
import SegundaJuan from "./2_juan";
import SegundaPedro from "./2_pedro";
import SegundaReyes from "./2_reyes";
import SegundaSamuel from "./2_samuel";
import SegundaTesalonicenses from "./2_tesalonicenses";
import SegundaTimoteo from "./2_timoteo";
import TerceraJuan from "./3_juan";
import Abdias from "./abdias";
import Amos from "./amos";
import Apocalipsis from "./apocalipsis";
import Cantares from "./cantares";
import Colosenses from "./colosenses";
import Daniel from "./daniel";
import Deuteronomio from "./deuteronomio";
import Eclesiastes from "./eclesiastes";
import Efesios from "./efesios";
import Esdras from "./esdras";
import Ester from "./ester";
import Exodo from "./exodo";
import Ezequiel from "./ezequiel";
import Filemon from "./filemon";
import Filipenses from "./filipenses";
import Galatas from "./galatas";
import Genesis from "./genesis";
import Habacuc from "./habacuc";
import Hageo from "./hageo";
import Hebreos from "./hebreos";
import Hechos from "./hechos";
import Isaias from "./isaias";
import Jeremias from "./jeremias";
import Job from "./job";
import Joel from "./joel";
import Jonas from "./jonas";
import Josue from "./josue";
import Juan from "./juan";
import Judas from "./judas";
import Jueces from "./jueces";
import Lamentaciones from "./lamentaciones";
import Levitico from "./levitico";
import Lucas from "./lucas";
import Malaquias from "./malaquias";
import Marcos from "./marcos";
import Mateo from "./mateo";
import Miqueas from "./miqueas";
import Nahum from "./nahum";
import Nehemias from "./nehemias";
import Numeros from "./numeros";
import Oseas from "./oseas";
import Proverbios from "./proverbios";
import Romanos from "./romanos";
import Rut from "./rut";
import Salmos from "./salmos";
import Santiago from "./santiago";
import Sofonias from "./sofonias";
import Tito from "./tito";
import Zacarias from "./zacarias";
// assets/biblia/index.js

// Importaciones (se mantienen igual)
// ...

export const Bible = {
  // Antiguo Testamento
  Genesis,
  Exodo,
  Levitico,
  Numeros,
  Deuteronomio,
  Josue,
  Jueces,
  Rut,
  PrimeraSamuel,
  SegundaSamuel,
  PrimeraReyes,
  SegundaReyes,
  PrimeraCronicas,
  SegundaCronicas,
  Esdras,
  Nehemias,
  Ester,
  Job,
  Salmos,
  Proverbios,
  Eclesiastes,
  Cantares,
  Isaias,
  Jeremias,
  Lamentaciones,
  Ezequiel,
  Daniel,
  Oseas,
  Joel,
  Amos,
  Abdias,
  Jonas,
  Miqueas,
  Nahum,
  Habacuc,
  Sofonias,
  Hageo,
  Zacarias,
  Malaquias,
  // Nuevo Testamento
  Mateo,
  Marcos,
  Lucas,
  Juan,
  Hechos,
  Romanos,
  PrimeraCorintios,
  SegundaCorintios,
  Galatas,
  Efesios,
  Filipenses,
  Colosenses,
  PrimeraTesalonicenses,
  SegundaTesalonicenses,
  PrimeraTimoteo,
  SegundaTimoteo,
  Tito,
  Filemon,
  Hebreos,
  Santiago,
  PrimeraPedro,
  SegundaPedro,
  PrimeraJuan,
  SegundaJuan,
  TerceraJuan,
  Judas,
  Apocalipsis,
};

export const BibleMetadata = {
  // Antiguo Testamento
  Genesis: { name: "Génesis", abbr: "Gn", chapters: 50, testament: "Antiguo" },
  Exodo: { name: "Éxodo", abbr: "Éx", chapters: 40, testament: "Antiguo" },
  Levitico: {
    name: "Levítico",
    abbr: "Lv",
    chapters: 27,
    testament: "Antiguo",
  },
  Numeros: { name: "Números", abbr: "Nm", chapters: 36, testament: "Antiguo" },
  Deuteronomio: {
    name: "Deuteronomio",
    abbr: "Dt",
    chapters: 34,
    testament: "Antiguo",
  },
  Josue: { name: "Josué", abbr: "Jos", chapters: 24, testament: "Antiguo" },
  Jueces: { name: "Jueces", abbr: "Jue", chapters: 21, testament: "Antiguo" },
  Rut: { name: "Rut", abbr: "Rt", chapters: 4, testament: "Antiguo" },
  PrimeraSamuel: {
    name: "1 Samuel",
    abbr: "1 Sam",
    chapters: 31,
    testament: "Antiguo",
  },
  SegundaSamuel: {
    name: "2 Samuel",
    abbr: "2 Sam",
    chapters: 24,
    testament: "Antiguo",
  },
  PrimeraReyes: {
    name: "1 Reyes",
    abbr: "1 Re",
    chapters: 22,
    testament: "Antiguo",
  },
  SegundaReyes: {
    name: "2 Reyes",
    abbr: "2 Re",
    chapters: 25,
    testament: "Antiguo",
  },
  PrimeraCronicas: {
    name: "1 Crónicas",
    abbr: "1 Crón",
    chapters: 29,
    testament: "Antiguo",
  },
  SegundaCronicas: {
    name: "2 Crónicas",
    abbr: "2 Crón",
    chapters: 36,
    testament: "Antiguo",
  },
  Esdras: { name: "Esdras", abbr: "Esd", chapters: 10, testament: "Antiguo" },
  Nehemias: {
    name: "Nehemías",
    abbr: "Neh",
    chapters: 13,
    testament: "Antiguo",
  },
  Ester: { name: "Ester", abbr: "Est", chapters: 10, testament: "Antiguo" },
  Job: { name: "Job", abbr: "Job", chapters: 42, testament: "Antiguo" },
  Salmos: { name: "Salmos", abbr: "Sal", chapters: 150, testament: "Antiguo" },
  Proverbios: {
    name: "Proverbios",
    abbr: "Pr",
    chapters: 31,
    testament: "Antiguo",
  },
  Eclesiastes: {
    name: "Eclesiastés",
    abbr: "Ec",
    chapters: 12,
    testament: "Antiguo",
  },
  Cantares: {
    name: "Cantares",
    abbr: "Cant",
    chapters: 8,
    testament: "Antiguo",
  },
  Isaias: { name: "Isaías", abbr: "Is", chapters: 66, testament: "Antiguo" },
  Jeremias: {
    name: "Jeremías",
    abbr: "Jer",
    chapters: 52,
    testament: "Antiguo",
  },
  Lamentaciones: {
    name: "Lamentaciones",
    abbr: "Lm",
    chapters: 5,
    testament: "Antiguo",
  },
  Ezequiel: {
    name: "Ezequiel",
    abbr: "Ez",
    chapters: 48,
    testament: "Antiguo",
  },
  Daniel: { name: "Daniel", abbr: "Dn", chapters: 12, testament: "Antiguo" },
  Oseas: { name: "Oseas", abbr: "Os", chapters: 14, testament: "Antiguo" },
  Joel: { name: "Joel", abbr: "Jl", chapters: 3, testament: "Antiguo" },
  Amos: { name: "Amós", abbr: "Am", chapters: 9, testament: "Antiguo" },
  Abdias: { name: "Abdías", abbr: "Abd", chapters: 1, testament: "Antiguo" },
  Jonas: { name: "Jonás", abbr: "Jon", chapters: 4, testament: "Antiguo" },
  Miqueas: { name: "Miqueas", abbr: "Mi", chapters: 7, testament: "Antiguo" },
  Nahum: { name: "Nahúm", abbr: "Nah", chapters: 3, testament: "Antiguo" },
  Habacuc: { name: "Habacuc", abbr: "Hab", chapters: 3, testament: "Antiguo" },
  Sofonias: {
    name: "Sofonías",
    abbr: "Sof",
    chapters: 3,
    testament: "Antiguo",
  },
  Hageo: { name: "Hageo", abbr: "Hag", chapters: 2, testament: "Antiguo" },
  Zacarias: {
    name: "Zacarías",
    abbr: "Zac",
    chapters: 14,
    testament: "Antiguo",
  },
  Malaquias: {
    name: "Malaquías",
    abbr: "Mal",
    chapters: 4,
    testament: "Antiguo",
  },

  // Nuevo Testamento
  Mateo: { name: "Mateo", abbr: "Mt", chapters: 28, testament: "Nuevo" },
  Marcos: { name: "Marcos", abbr: "Mc", chapters: 16, testament: "Nuevo" },
  Lucas: { name: "Lucas", abbr: "Lc", chapters: 24, testament: "Nuevo" },
  Juan: { name: "Juan", abbr: "Jn", chapters: 21, testament: "Nuevo" },
  Hechos: { name: "Hechos", abbr: "Hch", chapters: 28, testament: "Nuevo" },
  Romanos: { name: "Romanos", abbr: "Ro", chapters: 16, testament: "Nuevo" },
  PrimeraCorintios: {
    name: "1 Corintios",
    abbr: "1 Cor",
    chapters: 16,
    testament: "Nuevo",
  },
  SegundaCorintios: {
    name: "2 Corintios",
    abbr: "2 Cor",
    chapters: 13,
    testament: "Nuevo",
  },
  Galatas: { name: "Gálatas", abbr: "Gál", chapters: 6, testament: "Nuevo" },
  Efesios: { name: "Efesios", abbr: "Ef", chapters: 6, testament: "Nuevo" },
  Filipenses: {
    name: "Filipenses",
    abbr: "Fil",
    chapters: 4,
    testament: "Nuevo",
  },
  Colosenses: {
    name: "Colosenses",
    abbr: "Col",
    chapters: 4,
    testament: "Nuevo",
  },
  PrimeraTesalonicenses: {
    name: "1 Tesalonicenses",
    abbr: "1 Tes",
    chapters: 5,
    testament: "Nuevo",
  },
  SegundaTesalonicenses: {
    name: "2 Tesalonicenses",
    abbr: "2 Tes",
    chapters: 3,
    testament: "Nuevo",
  },
  PrimeraTimoteo: {
    name: "1 Timoteo",
    abbr: "1 Tim",
    chapters: 6,
    testament: "Nuevo",
  },
  SegundaTimoteo: {
    name: "2 Timoteo",
    abbr: "2 Tim",
    chapters: 4,
    testament: "Nuevo",
  },
  Tito: { name: "Tito", abbr: "Tit", chapters: 3, testament: "Nuevo" },
  Filemon: { name: "Filemón", abbr: "Flm", chapters: 1, testament: "Nuevo" },
  Hebreos: { name: "Hebreos", abbr: "Heb", chapters: 13, testament: "Nuevo" },
  Santiago: { name: "Santiago", abbr: "Stg", chapters: 5, testament: "Nuevo" },
  PrimeraPedro: {
    name: "1 Pedro",
    abbr: "1 Pe",
    chapters: 5,
    testament: "Nuevo",
  },
  SegundaPedro: {
    name: "2 Pedro",
    abbr: "2 Pe",
    chapters: 3,
    testament: "Nuevo",
  },
  PrimeraJuan: {
    name: "1 Juan",
    abbr: "1 Jn",
    chapters: 5,
    testament: "Nuevo",
  },
  SegundaJuan: {
    name: "2 Juan",
    abbr: "2 Jn",
    chapters: 1,
    testament: "Nuevo",
  },
  TerceraJuan: {
    name: "3 Juan",
    abbr: "3 Jn",
    chapters: 1,
    testament: "Nuevo",
  },
  Judas: { name: "Judas", abbr: "Jud", chapters: 1, testament: "Nuevo" },
  Apocalipsis: {
    name: "Apocalipsis",
    abbr: "Ap",
    chapters: 22,
    testament: "Nuevo",
  },
};
