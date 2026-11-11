import { Cormorant_Garamond, Inter_Tight } from "next/font/google";

// Pair: strict grotesque (everything) + luxury italic serif (accent words only).
// Both must support Cyrillic (uk). Swap faces here, nothing else changes.
export const fontMain = Inter_Tight({
  weight: ["400", "500", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-main-family",
  display: "swap",
});

export const fontAccent = Cormorant_Garamond({
  weight: ["300", "400"],
  style: ["italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-accent-family",
  display: "swap",
});
