import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadArchivo } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { AKSEN, GELAP, USERNAME, type DataClip } from "./data";

export const FONT_TEBAL = loadArchivo("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const FONT_TEKS = loadInter("normal", { weights: ["700", "800"], subsets: ["latin"] }).fontFamily;

// Cover 1080×1920. Semua teks di area tengah (y 300–1450) supaya aman
// dari potongan grid profil TikTok (3:4) dan tombol/caption di feed.
export const Cover: React.FC<{ clip: DataClip }> = ({ clip }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: GELAP }}>
      <Img
        src={staticFile(`nino/cover${clip.nomor}.png`)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 64,
          right: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          fontFamily: FONT_TEBAL,
        }}
      >
        <span style={{ ...pill, background: AKSEN, color: GELAP }}>{clip.label}</span>
        <span style={{ ...blok, background: GELAP, color: "white" }}>{clip.judul[0]}</span>
        <span style={{ ...blok, background: AKSEN, color: GELAP }}>{clip.judul[1]}</span>
        <span
          style={{
            background: GELAP,
            color: "white",
            fontFamily: FONT_TEKS,
            fontWeight: 800,
            fontSize: 38,
            lineHeight: 1.2,
            padding: "14px 22px",
          }}
        >
          {clip.subjudul}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1420,
          left: 64,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: GELAP,
          color: "white",
          padding: "12px 22px 12px 16px",
          borderRadius: 999,
          fontFamily: FONT_TEBAL,
          fontSize: 32,
          lineHeight: 1,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" aria-hidden>
          <path d="M7 4.5v15l12.5-7.5z" fill={AKSEN} />
        </svg>
        {USERNAME}
      </div>
    </AbsoluteFill>
  );
};

const pill: React.CSSProperties = {
  fontSize: 36,
  lineHeight: 1,
  padding: "14px 24px",
  borderRadius: 999,
  letterSpacing: "0.04em",
};

const blok: React.CSSProperties = {
  fontSize: 132,
  lineHeight: 1,
  padding: "18px 26px",
  letterSpacing: "-0.02em",
};
