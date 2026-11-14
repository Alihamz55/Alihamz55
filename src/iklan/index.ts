// Entry point terpisah khusus iklan: tidak ikut memuat font Google dari komposisi lain.
// Render: npx remotion render src/iklan/index.ts IklanHuruf out/iklan-huruf.mp4
import { registerRoot } from "remotion";
import { IklanRoot } from "./IklanRoot";

registerRoot(IklanRoot);
