import { en } from "./en";
import { pt } from "./pt";

// Any Portuguese variant (pt, pt-BR, pt-PT) → Portuguese; everything else falls
// back to English. Resolved once at load.
const isPortuguese = navigator.language.toLowerCase().startsWith("pt");

export const translations = isPortuguese ? pt : en;
