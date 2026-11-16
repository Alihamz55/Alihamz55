import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  cancelRender,
  continueRender,
  delayRender,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { Cover, FONT_TEBAL, FONT_TEKS } from "./Cover";
import { AKSEN, CLIP, DETIK_HOOK, FRAME_COVER, GELAP } from "./data";

// Subtitle ringan: 1 halaman = kata-kata dalam rentang waktu ini
const GANTI_SETIAP_MS = 900;

export const NinoClip: React.FC<{ nomor: 1 | 2 | 3 }> = ({ nomor }) => {
  const clip = CLIP[nomor - 1];
  const { fps } = useVideoConfig();
  const captions = useCaptions(`nino/clip${nomor}.captions.json`);

  return (
    <AbsoluteFill style={{ backgroundColor: GELAP }}>
      <OffthreadVideo src={staticFile(`nino/clip${nomor}.mp4`)} />
      {captions ? <Subtitle captions={captions} /> : null}
      <Sequence from={FRAME_COVER} durationInFrames={Math.round(DETIK_HOOK * fps)} layout="none">
        <Hook baris={clip.hook} />
      </Sequence>
      {/* Cover ditempel di frame pertama → otomatis jadi cover default TikTok */}
      <Sequence durationInFrames={FRAME_COVER} layout="none">
        <Cover clip={clip} />
      </Sequence>
    </AbsoluteFill>
  );
};

const useCaptions = (file: string): Caption[] | null => {
  const [data, setData] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender(`Memuat ${file}`));
  useEffect(() => {
    fetch(staticFile(file))
      .then((r) => r.json())
      .then((json: Caption[]) => {
        setData(json);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [file, handle]);
  return data;
};

const Hook: React.FC<{ baris: [string, string] }> = ({ baris }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          fontFamily: FONT_TEBAL,
          transform: `scale(${0.85 + 0.15 * masuk})`,
          opacity: masuk,
        }}
      >
        <span style={{ ...barisHook, background: "white", color: GELAP }}>{baris[0]}</span>
        <span style={{ ...barisHook, background: AKSEN, color: GELAP }}>{baris[1]}</span>
      </div>
    </AbsoluteFill>
  );
};

const barisHook: React.CSSProperties = {
  fontSize: 64,
  lineHeight: 1.1,
  padding: "12px 22px",
  borderRadius: 14,
  textAlign: "center",
};

const Subtitle: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: GANTI_SETIAP_MS,
      }),
    [captions]
  );
  return (
    <>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const mulai = Math.round((page.startMs / 1000) * fps);
        const akhirMs = Math.min(
          next ? next.startMs : Infinity,
          page.startMs + page.durationMs + 400
        );
        const durasi = Math.max(1, Math.round(((akhirMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={mulai} durationInFrames={durasi} layout="none">
            <HalamanSubtitle page={page} />
          </Sequence>
        );
      })}
    </>
  );
};

const HalamanSubtitle: React.FC<{
  page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number];
}> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sekarangMs = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 520 }}>
      <div
        style={{
          fontFamily: FONT_TEKS,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.15,
          textAlign: "center",
          padding: "0 70px",
          whiteSpace: "pre-wrap",
          color: "white",
          WebkitTextStroke: "12px black",
          paintOrder: "stroke",
        }}
      >
        {page.tokens.map((t) => {
          const aktif = sekarangMs >= t.fromMs && sekarangMs < t.toMs;
          return (
            <span key={t.fromMs} style={{ color: aktif ? AKSEN : "white" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
