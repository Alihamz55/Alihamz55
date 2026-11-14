import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Font lokal (Luckiest Guy, huruf kapital saja) supaya render tidak bergantung pada Google Fonts.
const FONT_JUDUL = "IklanJudul";
if (typeof document !== "undefined") {
  const tunggu = delayRender("Memuat font iklan");
  const font = new FontFace(FONT_JUDUL, `url(${staticFile("iklan-huruf/font/LuckiestGuy.ttf")})`);
  font
    .load()
    .then((f) => {
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      continueRender(tunggu);
    })
    .catch(() => continueRender(tunggu));
}

// Iklan 9:16 (20 detik) untuk ebook "Belajar Menulis Huruf A-Z".
// Dipakai di TikTok, Reels/Facebook, dan YouTube Shorts.
// Teks penting ditaruh di tengah: bagian bawah layar tertutup tombol & caption aplikasi.

// Durasi tiap adegan (frame, 30 fps) mengikuti panjang suara narator (public/iklan-huruf/suara/*.wav).
const D1 = 90, D2 = 156, D3 = 256, D4 = 99, D5 = 150;
const PER_HALAMAN = D3 / 4;
export const IKLAN_FRAME = D1 + D2 + D3 + D4 + D5;
const NAVY = "#1E3A8A";
const ORANYE = "#F97316";
const KREM = "#FFF8EC";

export const Sinar: React.FC<{ warna?: string }> = ({ warna = "#FDE047" }) => {
  const frame = useCurrentFrame();
  const n = 18;
  const putar = frame * 0.25;
  return (
    <AbsoluteFill style={{ backgroundColor: "#FACC15", overflow: "hidden" }}>
      <svg width={1080} height={1920} viewBox="-540 -960 1080 1920">
        <g transform={`rotate(${putar})`}>
          {Array.from({ length: n }).map((_, i) => {
            const a1 = ((i * 2) / (n * 2)) * Math.PI * 2;
            const a2 = ((i * 2 + 1) / (n * 2)) * Math.PI * 2;
            const R = 1500;
            return (
              <path
                key={i}
                d={`M0 0 L${R * Math.cos(a1)} ${R * Math.sin(a1)} L${R * Math.cos(a2)} ${R * Math.sin(a2)} Z`}
                fill={warna}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const Teks: React.FC<{
  children: React.ReactNode;
  ukuran: number;
  warna?: string;
  garis?: string;
  mulai?: number;
  style?: React.CSSProperties;
}> = ({ children, ukuran, warna = "white", garis = NAVY, mulai = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: 11, mass: 0.6 } });
  return (
    <div
      style={{
        fontFamily: FONT_JUDUL,
        fontSize: ukuran,
        color: warna,
        textAlign: "center",
        lineHeight: 1.05,
        WebkitTextStroke: `${Math.round(ukuran * 0.09)}px ${garis}`,
        paintOrder: "stroke fill",
        textShadow: `0 ${Math.round(ukuran * 0.08)}px 0 ${garis}`,
        transform: `scale(${s})`,
        opacity: frame < mulai ? 0 : 1,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pil: React.FC<{ teks: string; warna: string; mulai?: number }> = ({ teks, warna, mulai = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        fontFamily: FONT_JUDUL,
        fontSize: 64,
        color: "white",
        background: warna,
        padding: "18px 48px",
        borderRadius: 999,
        boxShadow: "0 10px 0 rgba(0,0,0,0.25)",
        transform: `translateY(${(1 - s) * 80}px) scale(${0.6 + 0.4 * s})`,
        opacity: s,
      }}
    >
      {teks}
    </div>
  );
};

// 1. Hook: masalah orang tua
const Adegan1: React.FC = () => {
  const frame = useCurrentFrame();
  const goyang = Math.sin(frame / 4) * 3;
  return (
    <AbsoluteFill>
      <Sinar />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30, paddingBottom: 200 }}>
        <Teks ukuran={110} mulai={0}>Anak susah</Teks>
        <Teks ukuran={110} mulai={8}>diajak belajar</Teks>
        <div style={{ transform: `rotate(${goyang}deg)` }}>
          <Teks ukuran={190} warna={ORANYE} garis="#7C2D12" mulai={16}>
            NULIS?
          </Teks>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 2. Solusi: cover
const Adegan2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 10, mass: 0.8 } });
  const zoom = interpolate(frame, [0, 90], [1, 1.06]);
  return (
    <AbsoluteFill>
      <Sinar warna="#FEF08A" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
        <Teks ukuran={100}>Coba cara ini!</Teks>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 120 }}>
        <Img
          src={staticFile("iklan-huruf/hal1.png")}
          style={{
            width: 800,
            borderRadius: 24,
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            transform: `scale(${s * zoom}) rotate(${(1 - s) * -20 - 3}deg)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3. Isi halaman
const HALAMAN = [
  { file: "hal3.png", teks: "Warnai hurufnya", warna: "#EF4444" },
  { file: "hal9.png", teks: "Tebalkan dari titik hijau", warna: "#EC4899" },
  { file: "hal15.png", teks: "Lingkari hurufnya", warna: "#8B5CF6" },
  { file: "hal27.png", teks: "Lengkap A sampai Z!", warna: "#22C55E" },
];

const Halaman: React.FC<{ file: string; teks: string; warna: string }> = ({ file, teks, warna }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const masuk = spring({ frame, fps, config: { damping: 14 } });
  const zoom = interpolate(frame, [0, PER_HALAMAN], [1, 1.08]);
  return (
    <AbsoluteFill style={{ backgroundColor: KREM }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
        <Img
          src={staticFile(`iklan-huruf/${file}`)}
          style={{
            width: 900,
            borderRadius: 20,
            boxShadow: "0 24px 50px rgba(0,0,0,0.25)",
            transform: `translateX(${(1 - masuk) * 1100}px) scale(${zoom})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <Pil teks={teks} warna={warna} mulai={6} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 4. Bonus sertifikat
const Adegan4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill>
      <Sinar />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <Teks ukuran={110} warna="#FDE047" garis="#92400E">BONUS</Teks>
        <Teks ukuran={80} mulai={6}>Sertifikat + Tabel Bintang</Teks>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 260 }}>
        <Img
          src={staticFile("iklan-huruf/hal29.png")}
          style={{
            width: 700,
            borderRadius: 20,
            boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
            transform: `scale(${s}) rotate(${4 - 4 * s + 3}deg)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 5. Ajakan
const Adegan5: React.FC = () => {
  const frame = useCurrentFrame();
  const denyut = 1 + Math.sin(frame / 5) * 0.04;
  return (
    <AbsoluteFill>
      <Sinar warna="#FEF08A" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36, paddingBottom: 260 }}>
        <Teks ukuran={120} warna="#EF4444" garis="#7F1D1D">COBA GRATIS</Teks>
        <Teks ukuran={78} mulai={8}>lembar huruf A</Teks>
        <div style={{ height: 20 }} />
        <Teks ukuran={64} mulai={16}>Versi lengkap 26 huruf</Teks>
        <Teks ukuran={64} mulai={16}>cuma Rp25 ribu</Teks>
        <div style={{ height: 30 }} />
        <div style={{ transform: `scale(${denyut})` }}>
          <Pil teks="Link di bio" warna={ORANYE} mulai={26} />
        </div>
        <Teks ukuran={70} warna={NAVY} garis="white" mulai={34}>
          lynk.id/alidraws
        </Teks>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IklanHuruf: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: KREM }}>
      <Sequence durationInFrames={D1}>
        <Adegan1 />
      </Sequence>
      <Sequence from={D1} durationInFrames={D2}>
        <Adegan2 />
      </Sequence>
      {HALAMAN.map((h, i) => (
        <Sequence key={h.file} from={D1 + D2 + i * PER_HALAMAN} durationInFrames={PER_HALAMAN}>
          <Halaman {...h} />
        </Sequence>
      ))}
      <Sequence from={D1 + D2 + D3} durationInFrames={D4}>
        <Adegan4 />
      </Sequence>
      <Sequence from={D1 + D2 + D3 + D4} durationInFrames={D5}>
        <Adegan5 />
      </Sequence>
      {/* Musik latar orisinal (ebook-huruf/jualan/buat_musik.py), dikecilkan supaya narator tetap jelas */}
      <Audio src={staticFile("iklan-huruf/musik-latar.wav")} volume={0.32} />
      {[0, D1, D1 + D2, D1 + D2 + D3, D1 + D2 + D3 + D4].map((mulai, i) => (
        <Sequence key={`suara${i}`} from={mulai + 6}>
          <Audio src={staticFile(`iklan-huruf/suara/${i + 1}.wav`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
