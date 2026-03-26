// Unified Indic table: U+0900–U+0DFF, indexed by (codepoint - 0x0900).
// Built by merging 10 per-script tables (each 0x80 entries, laid out contiguously).
var indicTable = (function () {
  const sources = [
    devanagariTable,
    bengaliTable,
    gurmukhiTable,
    gujaratiTable,
    odiaTable,
    tamilTable,
    teluguTable,
    kannadaTable,
    malayalamTable,
    sinhalaTable,
  ];
  const t = new Array(0x500).fill(null);
  sources.forEach((src, i) => {
    src.forEach((entry, j) => {
      if (entry !== null) t[i * 0x80 + j] = entry;
    });
  });
  return t;
})();
