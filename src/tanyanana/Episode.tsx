import React from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Nana } from "./Nana";
import { Caption, PanggungFakta, PanggungJawab, PanggungLangkah, PanggungMisi, PanggungTanya } from "./Segmen";
import { BAYANG, FONT, W } from "./tema";
import { type DataEpisode, type Ekspresi, JEDA_AWAL, jadwalEpisode, kodeEpisode, type Segmen } from "./tipe";

export type EpisodeProps = {
  data: DataEpisode;
  durasi: Record<string, number>;
  pakaiSuara: boolean;
};

const ekspresiNana = (s: Segmen): Ekspresi => {
  if (s.jenis === "tanya") return s.ekspresi ?? "bingung";
  if (s.jenis === "fakta") return "kaget";
  if (s.jenis === "jawab") return "dengar";
  return "senang";
};

const Latar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: W.krem,
        backgroundImage: "radial-gradient(rgba(108,92,231,0.12) 5px, transparent 6px)",
        backgroundSize: "60px 60px",
        backgroundPosition: `${f * 0.4}px ${f * 0.4}px`,
      }}
    >
      {[
        [W.kuning, -160, 160, 520],
        [W.teal, 760, 520, 460],
        [W.pink, -120, 1050, 420],
        [W.ungu, 820, 1350, 380],
      ].map(([c, x, y, s], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: (x as number) + Math.sin(f / 50 + i) * 30,
            top: (y as number) + Math.cos(f / 60 + i) * 30,
            width: s as number,
            height: s as number,
            borderRadius: "50%",
            background: c as string,
            opacity: 0.16,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Kepala: React.FC<{ nomor: number }> = ({ nomor }) => (
  <div style={{ position: "absolute", top: 90, left: 50, right: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div
      style={{
        background: W.oranye,
        color: "#fff",
        fontFamily: FONT,
        fontSize: 58,
        padding: "6px 36px",
        borderRadius: 50,
        border: "7px solid #fff",
        filter: BAYANG,
        transform: "rotate(-3deg)",
      }}
    >
      KENAPA YA?
    </div>
    <div style={{ background: W.gelap, color: W.kuning, fontFamily: FONT, fontSize: 44, padding: "6px 28px", borderRadius: 40 }}>
      #{kodeEpisode(nomor)}
    </div>
  </div>
);

export const EpisodeTanyaNana: React.FC<EpisodeProps> = ({ data, durasi, pakaiSuara }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jadwal = jadwalEpisode(data, durasi);
  const kini = jadwal.find((j) => f >= j.mulai && f < j.mulai + j.d) ?? jadwal[jadwal.length - 1];
  const lokal = f - kini.mulai;
  const bicara = kini.s.jenis === "tanya" && lokal >= JEDA_AWAL && lokal < JEDA_AWAL + kini.suara;
  const masukNana = spring({ frame: f, fps, config: { damping: 13 } });
  let nomorJawab = 0;

  return (
    <AbsoluteFill>
      <Latar />
      <Kepala nomor={data.nomor} />
      {jadwal.map((j) => {
        if (j.s.jenis === "jawab") nomorJawab++;
        const nomor = nomorJawab;
        const s = j.s;
        return (
          <Sequence key={j.i} from={j.mulai} durationInFrames={j.d}>
            <Keluar d={j.d}>
              {s.jenis === "tanya" && <PanggungTanya s={s} d={j.d} suara={j.suara} />}
              {s.jenis === "jawab" && <PanggungJawab s={s} d={j.d} suara={j.suara} nomor={nomor} />}
              {s.jenis === "fakta" && <PanggungFakta s={s} d={j.d} suara={j.suara} />}
              {s.jenis === "langkah" && <PanggungLangkah s={s} d={j.d} suara={j.suara} />}
              {s.jenis === "misi" && <PanggungMisi s={s} d={j.d} suara={j.suara} />}
              {(s.jenis === "jawab" || s.jenis === "fakta" || s.jenis === "misi") && <Caption teks={s.teks} suara={j.suara} />}
            </Keluar>
            {pakaiSuara && (
              <Sequence from={JEDA_AWAL} layout="none">
                <Audio src={staticFile(`tanyanana/${kodeEpisode(data.nomor)}/${j.i}.mp3`)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {/* Nana selalu di bawah, ekspresinya ikut segmen */}
      <div
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 1290 + (1 - masukNana) * 600,
          width: 540,
          height: 702,
          filter: "drop-shadow(0 12px 0 rgba(45,42,50,0.15))",
        }}
      >
        <Nana ekspresi={ekspresiNana(kini.s)} bicara={bicara} />
      </div>
      {/* Kilatan kecil saat ganti segmen */}
      {jadwal.slice(1).map((j) => {
        const o = interpolate(f, [j.mulai, j.mulai + 6], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return f >= j.mulai && f < j.mulai + 6 ? (
          <AbsoluteFill key={j.i} style={{ background: "#fff", opacity: o * (0.6 + random(`k${j.i}`) * 0.2), pointerEvents: "none" }} />
        ) : null;
      })}
    </AbsoluteFill>
  );
};

const Keluar: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [d - 6, d], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
