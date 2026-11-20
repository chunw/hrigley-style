// Shop display helper (her rule, 2026-11-20): every dimension shown in the
// shop carries its inch conversion, rounded to whole inches. The stored
// data stays cm-only on purpose: the book reads the same data files and
// keeps cm-only there.
const toInches = (cm: number) => Math.round(cm / 2.54);

export function withInches(
  text: string | undefined | null,
  lang: "en" | "zh",
): string {
  if (!text) return text ?? "";
  const pair = /(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(cm|厘米)/g;
  let out = text.replace(pair, (m, a, b) =>
    lang === "zh"
      ? `${m}（${toInches(parseFloat(a))} × ${toInches(parseFloat(b))} 英寸）`
      : `${m} (${toInches(parseFloat(a))} × ${toInches(parseFloat(b))} in)`,
  );
  // Single values ("4 cm", "5厘米"); the lookbehind keeps the second number
  // of a pair (already converted above) from matching again.
  const single = /(?<![\d.×x])(?<![×x]\s)(\d+(?:\.\d+)?)\s*(cm|厘米)/g;
  out = out.replace(single, (m, a) =>
    lang === "zh"
      ? `${m}（${toInches(parseFloat(a))} 英寸）`
      : `${m} (${toInches(parseFloat(a))} in)`,
  );
  return out;
}
