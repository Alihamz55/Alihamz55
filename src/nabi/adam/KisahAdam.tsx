import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CaptionCerita } from "../Caption";
import { FONT_JUDUL } from "../../shared/font";
import { jadwal, type IdAdegan, TOTAL_FRAME } from "./naskah";
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

export type KisahAdamProps = { pakaiMusik: boolean };

export const KisahAdam: React.FC<KisahAdamProps> = ({ pakaiMusik }) => {
  return (
    <AbsoluteFill style={{ background: "#1a0b4d" }}>
      {jadwal.map((a) => {
        const Komponen = KOMPONEN[a.id];
        return (
          <Sequence key={a.id} from={a.mulai} durationInFrames={a.durasi}>
            <Transisi d={a.durasi}>
              <Komponen d={a.durasi} />
              <CaptionCerita teks={a.teks} durasi={a.durasi} />
            </Transisi>
          </Sequence>
        );
      })}

      {/* Label channel kecil di pojok */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 50,
          padding: "6px 26px",
          borderRadius: 40,
          background: "rgba(26,11,77,0.55)",
          border: "3px solid rgba(255,255,255,0.7)",
          color: "#fff",
          fontFamily: FONT_JUDUL,
          fontSize: 36,
        }}
      >
        🌙 Nasyid Mungil
      </div>

      {pakaiMusik && (
        <Audio
          src={staticFile("musik.mp3")}
          loop
          volume={(f) => interpolate(f, [0, 20, TOTAL_FRAME - 40, TOTAL_FRAME], [0, 0.18, 0.18, 0], { extrapolateRight: "clamp" })}
        />
      )}
      {/* Voiceover: rekam narasinya, simpan sebagai public/nabi-adam-vo.mp3, lalu buka komentar ini */}
      {/* <Audio src={staticFile("nabi-adam-vo.mp3")} /> */}
    </AbsoluteFill>
  );
};
