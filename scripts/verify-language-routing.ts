import assert from "node:assert/strict";
import { detectLanguageFromAcceptLanguage, detectLanguageFromCountry, normalizeLanguage } from "../lib/language";

assert.equal(detectLanguageFromCountry("GB"), "EN");
assert.equal(detectLanguageFromCountry("US"), "EN");
assert.equal(detectLanguageFromCountry("BG"), "BG");
assert.equal(detectLanguageFromCountry("DE"), "DE");
assert.equal(detectLanguageFromCountry("FR"), "FR");
assert.equal(detectLanguageFromCountry("ES"), "ES");
assert.equal(detectLanguageFromCountry("IT"), "IT");
assert.equal(detectLanguageFromCountry("BR"), "PT");
assert.equal(detectLanguageFromCountry("MX"), "ES");
assert.equal(detectLanguageFromCountry("ZZ"), null);

assert.equal(detectLanguageFromAcceptLanguage("fr-FR,fr;q=0.9,en;q=0.8"), "FR");
assert.equal(detectLanguageFromAcceptLanguage("de-DE,de;q=0.9,en;q=0.8"), "DE");
assert.equal(detectLanguageFromAcceptLanguage("pt-BR,pt;q=0.9,en;q=0.8"), "PT");
assert.equal(detectLanguageFromAcceptLanguage("en-US,en;q=0.9"), "EN");
assert.equal(detectLanguageFromAcceptLanguage("ja-JP,ja;q=0.9"), null);

assert.equal(normalizeLanguage("bg"), "BG");
assert.equal(normalizeLanguage("pt"), "PT");
assert.equal(normalizeLanguage("unknown"), null);

console.log("Language routing checks passed.");

export {};
