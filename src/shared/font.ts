import { loadFont as loadLilita } from "@remotion/google-fonts/LilitaOne";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";

// Font judul/papan nama (tebal, bulat)
export const FONT_JUDUL = loadLilita("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
// Font balon dialog (gaya tulisan tangan komik)
export const FONT_KOMIK = loadMarker("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
