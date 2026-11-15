import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaptionCerita } from "../Caption";
import { JEDA_AWAL, jadwal, type IdAdegan, TOTAL_FRAME } from "./naskah";
import { Bisikan, Diterima, Judul, Nama, Penutup, Sujud, Surga, Tanah, Taubat, Turun } from "./Adegan";

const KOMPONEN: Record<IdAdegan, React.FC<{ d: number }>> = {
  judul: Judul,
  tanah: Tanah,
  nama: Nama,
  sujud: Sujud,
  surga: Surga,
  bisikan: Bisikan,
  turun: Turun,
  taubat: Taubat,
  diterima: Diterima,
  penutup: Penutup,
};

// Transisi antar adegan: muncul sambil sedikit membesar, hilang memudar
const Transisi: React.FC<{ d: number; children: React.ReactNode }> = ({ d, children }) => {
  const frame = useCurrentFrame();
  const masuk = interpolate(frame, [0, 9], [0, 1], { extrapolateRight: "clamp" });
  const keluar = interpolate(frame, [d - 7, d], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(masuk, keluar), transform: `scale(${1.04 - masuk * 0.04})` }}>
      {children}
    </AbsoluteFill>
  );
};

// pakaiSuara = narasi Speko di public/nabi-adam/*.mp3
export type KisahAdamProps = { pakaiMusik: boolean; pakaiSuara: boolean };

export const KisahAdam: React.FC<KisahAdamProps> = ({ pakaiMusik, pakaiSuara }) => {
  return (
    <AbsoluteFill style={{ background: "#1a0b4d" }}>
      {jadwal.map((a) => {
        const Komponen = KOMPONEN[a.id];
        const akhirCaption = JEDA_AWAL + Math.round((a.captionDetik ?? a.suara) * 30);
        return (
          <Sequence key={a.id} from={a.mulai} durationInFrames={a.durasi}>
            <Transisi d={a.durasi}>
              <Komponen d={a.durasi} />
              <CaptionCerita teks={a.teks} awal={JEDA_AWAL} akhir={akhirCaption} />
            </Transisi>
            {pakaiSuara && (
              <Sequence from={JEDA_AWAL} layout="none">
                <Audio src={staticFile(`nabi-adam/${a.id}.mp3`)} />
              </Sequence>
            )}
          </Sequence>
        );
      })}

      {pakaiMusik && (
        <Audio
          src={staticFile("musik.mp3")}
          loop
          volume={(f) =>
            interpolate(f, [0, 20, TOTAL_FRAME - 40, TOTAL_FRAME], [0, pakaiSuara ? 0.07 : 0.18, pakaiSuara ? 0.07 : 0.18, 0], {
              extrapolateRight: "clamp",
            })
          }
        />
      )}
    </AbsoluteFill>
  );
};
