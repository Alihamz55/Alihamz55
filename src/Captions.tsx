import { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import dataCaption from "../public/captions.json";

// Berapa milidetik sekali ganti "halaman" caption
const GANTI_SETIAP_MS = 1200;

export const Captions: React.FC = () => {
  const { fps } = useVideoConfig();

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: dataCaption as Caption[],
        combineTokensWithinMilliseconds: GANTI_SETIAP_MS,
      }),
    []
  );

  return (
    <>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const mulai = Math.round((page.startMs / 1000) * fps);
        const selesaiMs = next ? next.startMs : page.startMs + GANTI_SETIAP_MS;
        const durasi = Math.max(1, Math.round(((selesaiMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={mulai} durationInFrames={durasi} layout="none">
            <HalamanCaption page={page} />
          </Sequence>
        );
      })}
    </>
  );
};

const HalamanCaption: React.FC<{
  page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number];
}> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Waktu sekarang (ms) dihitung dari awal video
  const sekarangMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 380 }}>
      <div
        style={{
          fontSize: 90,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "0 60px",
          whiteSpace: "pre-wrap",
          WebkitTextStroke: "4px black",
          paintOrder: "stroke",
        }}
      >
        {page.tokens.map((t) => {
          const aktif = sekarangMs >= t.fromMs && sekarangMs < t.toMs;
          return (
            <span key={t.fromMs} style={{ color: aktif ? "#ffd166" : "white" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
