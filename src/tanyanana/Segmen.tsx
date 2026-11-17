import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BAYANG, clamp, FONT, W } from "./tema";
import { JEDA_AWAL, type Segmen, waktuFrasa, waktuKata } from "./tipe";

// Area "panggung" visual: y 250–1060. Caption di bawahnya, Nana paling bawah.
type P<T extends Segmen["jenis"]> = { s: Extract<Segmen, { jenis: T }>; d: number; suara: number; nomor?: number };

const Pil: React.FC<{ warna: string; children: React.ReactNode; ukuran?: number; style?: React.CSSProperties }> = ({
  warna,
  children,
  ukuran = 48,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      background: warna,
      color: "#fff",
      fontFamily: FONT,
      fontSize: ukuran,
      padding: "8px 34px",
      borderRadius: 60,
      border: "6px solid #fff",
      filter: BAYANG,
      ...style,
    }}
  >
    {children}
  </div>
);

const Sinar: React.FC<{ y: number; warna: string }> = ({ y, warna }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 700,
        top: y - 700,
        width: 1400,
        height: 1400,
        transform: `rotate(${f * 0.4}deg)`,
        background: `repeating-conic-gradient(${warna} 0deg 9deg, transparent 9deg 22deg)`,
        WebkitMaskImage: "radial-gradient(circle, black 8%, transparent 58%)",
        maskImage: "radial-gradient(circle, black 8%, transparent 58%)",
        opacity: 0.5,
      }}
    />
  );
};

// ─────────── TANYA: pertanyaan besar sebagai hook ───────────
export const PanggungTanya: React.FC<P<"tanya">> = ({ s, suara }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kata = waktuKata(s.teks, JEDA_AWAL, suara);
  const pil = spring({ frame: f, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      {new Array(9).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 60 + random(`qx${i}`) * 900,
            top: 260 + random(`qy${i}`) * 760 + Math.sin(f / 15 + i) * 18,
            fontFamily: FONT,
            fontSize: 70 + random(`qs${i}`) * 90,
            color: [W.ungu, W.teal, W.oranye, W.pink][i % 4],
            opacity: 0.18,
            transform: `rotate(${random(`qr${i}`) * 50 - 25 + Math.sin(f / 20 + i) * 8}deg)`,
          }}
        >
          ?
        </div>
      ))}
      <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center", transform: `scale(${pil})` }}>
        <Pil warna={W.ungu}>{s.ekspresi === "senang" ? "💬 Nana" : "❓ Nana bertanya"}</Pil>
      </div>
      <div
        style={{
          position: "absolute",
          top: 430,
          left: 70,
          right: 70,
          height: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: s.teks.length > 50 ? 92 : 108,
          lineHeight: 1.12,
          color: W.gelap,
        }}
      >
        <div>
          {kata.map((k, i) => {
            const t = spring({ frame: f - k.mulai, fps, config: { damping: 11, stiffness: 160 } });
            const aktif = f >= k.mulai && f < (kata[i + 1]?.mulai ?? JEDA_AWAL + suara);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: 22,
                  opacity: Math.max(0.12, t),
                  transform: `translateY(${(1 - t) * 30}px) scale(${aktif ? 1.08 : 1})`,
                  color: aktif ? W.oranye : W.gelap,
                }}
              >
                {k.kata}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─────────── JAWAB: satu alasan, satu ikon besar ───────────
export const PanggungJawab: React.FC<P<"jawab">> = ({ s, nomor }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kartu = spring({ frame: f - 2, fps, config: { damping: 10 } });
  const label = spring({ frame: f - 14, fps, config: { damping: 12 } });
  const sumber = spring({ frame: f - 30, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Sinar y={620} warna="rgba(31,171,137,0.25)" />
      <div style={{ position: "absolute", top: 280, width: "100%", textAlign: "center" }}>
        <Pil warna={W.teal} style={{ transform: `scale(${kartu})` }}>
          ✨ Jawaban {nomor ?? ""}
        </Pil>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 210,
          top: 410,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#fff",
          border: `14px solid ${W.teal}`,
          filter: BAYANG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 230,
          transform: `scale(${kartu}) rotate(${(1 - kartu) * -25 + Math.sin(f / 18) * 3}deg)`,
        }}
      >
        {s.ikon}
      </div>
      <div style={{ position: "absolute", top: 870, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontSize: 84,
            color: W.tealGelap,
            WebkitTextStroke: "14px #fff",
            paintOrder: "stroke fill",
            transform: `scale(${label})`,
          }}
        >
          {s.label}
        </div>
        {s.sumber && (
          <div style={{ marginTop: 6, opacity: sumber, transform: `translateY(${(1 - sumber) * 20}px)` }}>
            <Pil warna={W.gelap} ukuran={36}>
              📖 {s.sumber}
            </Pil>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────── FAKTA: "Tahukah Kamu?" ───────────
export const PanggungFakta: React.FC<P<"fakta">> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kartu = spring({ frame: f - 4, fps, config: { damping: 9 } });
  const bersih = interpolate(f, [d * 0.25, d * 0.85], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Sinar y={640} warna="rgba(255,201,60,0.45)" />
      <div style={{ position: "absolute", top: 280, width: "100%", textAlign: "center" }}>
        <Pil warna={W.oranye} ukuran={56} style={{ transform: `scale(${kartu}) rotate(-3deg)` }}>
          💡 Tahukah Kamu?
        </Pil>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 200,
          top: 430,
          width: 400,
          height: 400,
          borderRadius: 80,
          background: "#fff",
          border: `14px solid ${W.kuning}`,
          filter: BAYANG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 220,
          transform: `scale(${kartu}) rotate(${Math.sin(f / 16) * 4}deg)`,
        }}
      >
        {s.ikon}
      </div>
      {/* Efek "bersih": titik abu-abu (kesalahan) luntur terbawa tetes air */}
      {s.efek === "bersih" &&
        new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r = 270 + random(`br${i}`) * 50;
          const x = 540 + Math.cos(a) * r;
          const y = 630 + Math.sin(a) * r * 0.85;
          const hilang = interpolate(bersih, [i / 20, i / 20 + 0.25], [1, 0], clamp);
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: x - 18,
                  top: y - 18 + (1 - hilang) * 90,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#8a8794",
                  opacity: hilang * 0.85,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 16,
                  top: y - 30,
                  fontSize: 40,
                  opacity: hilang < 1 && hilang > 0 ? 1 : 0,
                }}
              >
                💧
              </div>
              <div style={{ position: "absolute", left: x - 20, top: y - 24, fontSize: 40, opacity: 1 - hilang, color: W.kuning }}>✦</div>
            </React.Fragment>
          );
        })}
      {s.efek === "bintang" &&
        new Array(12).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 120 + random(`sx${i}`) * 840,
              top: 360 + random(`sy${i}`) * 600,
              fontSize: 40 + random(`ss${i}`) * 40,
              color: W.kuning,
              opacity: 0.5 + 0.5 * Math.sin(f / 6 + i),
            }}
          >
            ✦
          </div>
        ))}
      <div style={{ position: "absolute", top: 880, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontSize: 76,
            color: W.oranye,
            WebkitTextStroke: "14px #fff",
            paintOrder: "stroke fill",
            transform: `scale(${spring({ frame: f - 14, fps, config: { damping: 12 } })})`,
          }}
        >
          {s.label}
        </div>
        {s.sumber && (
          <div style={{ marginTop: 6 }}>
            <Pil warna={W.gelap} ukuran={36}>
              📖 {s.sumber}
            </Pil>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─────────── LANGKAH: kartu urutan, muncul sesuai narasi ───────────
export const PanggungLangkah: React.FC<P<"langkah">> = ({ s, suara }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = s.langkah.length;
  const kolom = n > 6 ? 3 : 2;
  const lebar = kolom === 3 ? 300 : 420;
  const tinggi = n > 6 ? 230 : 250;
  const mulai = s.langkah.map((l) => waktuFrasa(s.teks, l.kata, JEDA_AWAL, suara));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 270, width: "100%", textAlign: "center" }}>
        <Pil warna={W.ungu} ukuran={54} style={{ transform: `scale(${spring({ frame: f, fps, config: { damping: 12 } })})` }}>
          📋 {s.judul}
        </Pil>
      </div>
      <div
        style={{
          position: "absolute",
          top: 390,
          left: 0,
          right: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${kolom}, ${lebar}px)`,
          gap: 22,
          justifyContent: "center",
        }}
      >
        {s.langkah.map((l, i) => {
          const t = spring({ frame: f - mulai[i] + 4, fps, config: { damping: 11 } });
          const aktif = f >= mulai[i] && f < (mulai[i + 1] ?? JEDA_AWAL + suara + 10);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                height: tinggi,
                background: "#fff",
                borderRadius: 34,
                border: `8px solid ${aktif ? W.oranye : "#fff"}`,
                filter: BAYANG,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${t * (aktif ? 1.07 : 1)})`,
                opacity: t,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  background: aktif ? W.oranye : W.ungu,
                  color: "#fff",
                  fontFamily: FONT,
                  fontSize: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "5px solid #fff",
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 100, lineHeight: 1.1 }}>{l.ikon}</div>
              <div style={{ fontFamily: FONT, fontSize: 36, color: W.gelap, textAlign: "center", padding: "0 10px", lineHeight: 1.05 }}>
                {l.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─────────── MISI: tantangan hari ini + teaser besok ───────────
export const PanggungMisi: React.FC<P<"misi">> = ({ s, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kartu = spring({ frame: f - 2, fps, config: { damping: 11 } });
  const centang = spring({ frame: f - d * 0.4, fps, config: { damping: 8 } });
  const besok = spring({ frame: f - d * 0.55, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Sinar y={560} warna="rgba(255,111,145,0.25)" />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 280,
          background: "#fff",
          borderRadius: 50,
          border: `12px solid ${W.pink}`,
          padding: "40px 50px 50px",
          textAlign: "center",
          filter: BAYANG,
          transform: `scale(${kartu}) rotate(${(1 - kartu) * 6}deg)`,
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 70, color: W.pink }}>🎯 MISI HARI INI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 24, textAlign: "left" }}>
          <div
            style={{
              flex: "0 0 110px",
              height: 110,
              borderRadius: 26,
              border: `9px solid ${W.teal}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 90,
              color: W.teal,
              fontFamily: FONT,
            }}
          >
            <span style={{ transform: `scale(${centang})`, display: "inline-block" }}>✔</span>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 60, lineHeight: 1.12, color: W.gelap }}>{s.misi}</div>
        </div>
      </div>
      {s.besok && (
        <div
          style={{
            position: "absolute",
            left: 120,
            right: 120,
            top: 790,
            background: W.ungu,
            color: "#fff",
            borderRadius: 40,
            border: "8px solid #fff",
            padding: "22px 36px",
            textAlign: "center",
            fontFamily: FONT,
            filter: BAYANG,
            opacity: besok,
            transform: `translateY(${(1 - besok) * 80}px)`,
          }}
        >
          <div style={{ fontSize: 40, color: W.kuning }}>⏭️ BESOK:</div>
          <div style={{ fontSize: 52, lineHeight: 1.15 }}>{s.besok}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ─────────── Caption narasi Kakak (sorot kata) ───────────
export const Caption: React.FC<{ teks: string; suara: number }> = ({ teks, suara }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kata = waktuKata(teks, JEDA_AWAL, suara);
  const masuk = spring({ frame: f, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", top: 1085, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 30px",
          background: W.gelap,
          borderRadius: 36,
          padding: "20px 34px",
          fontFamily: FONT,
          fontSize: kata.length > 22 ? 44 : 50,
          lineHeight: 1.22,
          textAlign: "center",
          opacity: masuk,
          transform: `translateY(${(1 - masuk) * 40}px)`,
        }}
      >
        {kata.map((k, i) => {
          const aktif = f >= k.mulai && f < (kata[i + 1]?.mulai ?? JEDA_AWAL + suara);
          return (
            <span key={i} style={{ display: "inline-block", marginRight: 13, color: aktif ? W.kuning : f >= k.mulai ? "#fff" : "rgba(255,255,255,0.4)" }}>
              {k.kata}
            </span>
          );
        })}
      </div>
    </div>
  );
};
