import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Sinar, Teks, Pil } from "../iklan/IklanHuruf";

// Video tutorial 9:16: cara print ebook di rumah atau di tempat fotokopi.
// Suara narator: public/tutorial-print/suara/1..10.wav (Speko, "Siti - Ad Narrator").

const FONT_ISI = "TutorialIsi";
if (typeof document !== "undefined") {
  const tunggu = delayRender("Memuat font tutorial");
  new FontFace(FONT_ISI, `url(${staticFile("tutorial-print/font/Baloo2-ExtraBold.ttf")})`)
    .load()
    .then((f) => {
      (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
      continueRender(tunggu);
    })
    .catch(() => continueRender(tunggu));
}

const NAVY = "#1E3A8A";
const ORANYE = "#F97316";
const KREM = "#FFF8EC";
const HIJAU = "#22C55E";

// panjang suara tiap adegan (frame, 30 fps), lalu diberi jeda
const SUARA = [88, 256, 124, 97, 226, 116, 163, 312, 206, 167];
const NASKAH = [
  "Sudah beli ebooknya? Yuk, kita print!",
  "Pertama, buka email atau halaman setelah pembayaran, lalu tekan tombol Download. File PDF akan tersimpan di HP.",
  "Ada dua cara: print di rumah, atau ke tempat fotokopi.",
  "Kalau print di rumah, siapkan kertas ukuran A4.",
  "Buka file PDF, pilih Print. Atur kertas A4, dan skala 100% atau ukuran asli.",
  "Mau hemat tinta? Print satu huruf per hari saja.",
  "Kalau ke fotokopi, kirim file PDF lewat WhatsApp, atau bawa di flashdisk.",
  "Bilang saja: print A4, cover berwarna, isinya boleh hitam putih supaya lebih hemat. Bisa juga dijilid spiral jadi buku.",
  "Tips! Laminating lembarnya, lalu pakai spidol papan tulis. Bisa dihapus dan dipakai berkali-kali.",
  "Selamat belajar! Ada pertanyaan? Kirim pesan ke alidraws, ya.",
];
const DURASI = SUARA.map((d, i) => d + (i === SUARA.length - 1 ? 50 : 24));
const MULAI = DURASI.map((_, i) => DURASI.slice(0, i).reduce((a, b) => a + b, 0));
export const TUTORIAL_FRAME = DURASI.reduce((a, b) => a + b, 0);

const useMasuk = (tunda = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - tunda, fps, config: { damping } });
};

const Isi: React.FC<{ children: React.ReactNode; ukuran?: number; warna?: string; style?: React.CSSProperties }> = ({
  children,
  ukuran = 52,
  warna = NAVY,
  style,
}) => <div style={{ fontFamily: FONT_ISI, fontSize: ukuran, color: warna, lineHeight: 1.15, ...style }}>{children}</div>;

// ---------- bingkai umum ----------
const Langkah: React.FC<{ label: string; warna: string; children: React.ReactNode }> = ({ label, warna, children }) => (
  <AbsoluteFill style={{ backgroundColor: KREM }}>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
      <Pil teks={label} warna={warna} />
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 380, paddingTop: 120 }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const Subjudul: React.FC<{ teks: string }> = ({ teks }) => {
  const s = useMasuk(4, 16);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 400 }}>
      <div
        style={{
          width: 940,
          background: "rgba(30,58,138,0.92)",
          borderRadius: 28,
          padding: "22px 34px",
          textAlign: "center",
          opacity: s,
          transform: `translateY(${(1 - s) * 30}px)`,
        }}
      >
        <Isi ukuran={44} warna="white">
          {teks}
        </Isi>
      </div>
    </AbsoluteFill>
  );
};

const Jari: React.FC<{ x: number; y: number; tekan: number }> = ({ x, y, tekan }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 70,
      height: 70,
      borderRadius: 999,
      background: "rgba(249,115,22,0.35)",
      border: "6px solid #F97316",
      transform: `scale(${1 - tekan * 0.25})`,
    }}
  />
);

const HP: React.FC<{ children: React.ReactNode; tinggi?: number }> = ({ children, tinggi = 1000 }) => (
  <div
    style={{
      width: 520,
      height: tinggi,
      background: "#111827",
      borderRadius: 64,
      padding: 22,
      boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
      position: "relative",
    }}
  >
    <div style={{ width: "100%", height: "100%", background: "white", borderRadius: 44, overflow: "hidden", position: "relative" }}>
      {children}
    </div>
  </div>
);

const FilePDF: React.FC<{ s: number }> = ({ s }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: "#FEF3C7",
      borderRadius: 22,
      padding: "18px 22px",
      transform: `scale(${s})`,
      opacity: s,
    }}
  >
    <div style={{ width: 70, height: 88, background: "#EF4444", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Isi ukuran={26} warna="white">PDF</Isi>
    </div>
    <div>
      <Isi ukuran={26}>Belajar-Menulis-Huruf-A-Z.pdf</Isi>
      <Isi ukuran={24} warna={HIJAU}>✓ Tersimpan di HP</Isi>
    </div>
  </div>
);

// ---------- adegan ----------
const A1: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useMasuk(6, 10);
  return (
    <AbsoluteFill>
      <Sinar />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 170, gap: 10 }}>
        <Teks ukuran={96}>CARA PRINT</Teks>
        <Teks ukuran={96} warna={ORANYE} garis="#7C2D12" mulai={6}>EBOOK</Teks>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 280 }}>
        <Img
          src={staticFile("iklan-huruf/hal1.png")}
          style={{
            width: 560,
            borderRadius: 18,
            boxShadow: "0 24px 50px rgba(0,0,0,0.3)",
            transform: `scale(${s}) rotate(${-4 + Math.sin(frame / 12) * 2}deg)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const A2: React.FC = () => {
  const frame = useCurrentFrame();
  const tekan = interpolate(frame, [70, 80, 90], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jariMasuk = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const file = useMasuk(95, 12);
  return (
    <Langkah label="LANGKAH 1: DOWNLOAD" warna="#0EA5E9">
      <div style={{ position: "relative" }}>
        <HP tinggi={900}>
          <div style={{ padding: 36, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: 999, background: HIJAU, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 40 }}>
              <Isi ukuran={80} warna="white">✓</Isi>
            </div>
            <Isi ukuran={40} style={{ textAlign: "center" }}>Pembayaran berhasil</Isi>
            <Isi ukuran={28} warna="#6B7280" style={{ textAlign: "center" }}>Belajar Menulis Huruf A–Z</Isi>
            <div
              style={{
                marginTop: 30,
                background: ORANYE,
                borderRadius: 999,
                padding: "22px 70px",
                transform: `scale(${1 - tekan * 0.08})`,
                boxShadow: "0 8px 0 #9A3412",
              }}
            >
              <Isi ukuran={44} warna="white">Download</Isi>
            </div>
            <div style={{ marginTop: 30 }}>
              <FilePDF s={file} />
            </div>
          </div>
        </HP>
        <div style={{ opacity: jariMasuk }}>
          <Jari x={226 + (1 - jariMasuk) * 200} y={415 + (1 - jariMasuk) * 200} tekan={tekan} />
        </div>
      </div>
    </Langkah>
  );
};

const Kartu: React.FC<{ judul: string; warna: string; tunda: number; children: React.ReactNode }> = ({ judul, warna, tunda, children }) => {
  const s = useMasuk(tunda, 11);
  return (
    <div
      style={{
        width: 440,
        height: 560,
        background: "white",
        border: `8px solid ${warna}`,
        borderRadius: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        boxShadow: "0 16px 0 rgba(0,0,0,0.12)",
        transform: `scale(${s})`,
      }}
    >
      {children}
      <Isi ukuran={46} warna={warna} style={{ textAlign: "center" }}>
        {judul}
      </Isi>
    </div>
  );
};

const IkonRumah = () => (
  <svg width={260} height={240} viewBox="0 0 260 240">
    <polygon points="130,10 250,110 10,110" fill="#EF4444" />
    <rect x="40" y="105" width="180" height="125" fill="#FDE68A" />
    <rect x="105" y="150" width="50" height="80" fill="#92400E" />
    <rect x="55" y="130" width="38" height="38" fill="#93C5FD" />
    <rect x="167" y="130" width="38" height="38" fill="#93C5FD" />
  </svg>
);

const IkonToko = () => (
  <svg width={260} height={240} viewBox="0 0 260 240">
    <rect x="20" y="80" width="220" height="150" fill="#E0F2FE" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${20 + i * 44} 40 h44 v40 a22 22 0 0 1 -44 0 z`} fill={i % 2 ? "white" : "#0EA5E9"} />
    ))}
    <rect x="45" y="120" width="80" height="110" fill="#0369A1" />
    <rect x="145" y="120" width="75" height="60" fill="white" stroke="#0369A1" strokeWidth="6" />
    <text x="182" y="160" fontSize="26" textAnchor="middle" fill="#0369A1" fontFamily="sans-serif" fontWeight="bold">
      A4
    </text>
  </svg>
);

const A3: React.FC = () => (
  <Langkah label="PILIH CARANYA" warna="#8B5CF6">
    <div style={{ display: "flex", gap: 40 }}>
      <Kartu judul="Print di Rumah" warna="#EF4444" tunda={4}>
        <IkonRumah />
      </Kartu>
      <Kartu judul="Ke Fotokopi" warna="#0EA5E9" tunda={40}>
        <IkonToko />
      </Kartu>
    </div>
  </Langkah>
);

const A4: React.FC = () => {
  const s = useMasuk(4, 10);
  return (
    <Langkah label="DI RUMAH: SIAPKAN KERTAS" warna="#EF4444">
      <div style={{ position: "relative", width: 560, height: 700, transform: `scale(${s})` }}>
        {[3, 2, 1, 0].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * 16,
              top: i * 16,
              width: 495,
              height: 640,
              background: "white",
              border: "4px solid #D1D5DB",
              borderRadius: 10,
              boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 0, top: 0, width: 495, height: 640, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Teks ukuran={170} warna={ORANYE} garis="#7C2D12">A4</Teks>
          <Isi ukuran={40} warna="#6B7280">HVS 70–80 gram</Isi>
        </div>
      </div>
    </Langkah>
  );
};

const BarisAtur: React.FC<{ kiri: string; kanan: string; sorot: number; tunda: number }> = ({ kiri, kanan, sorot, tunda }) => {
  const s = useMasuk(tunda, 14);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 26px",
        borderRadius: 18,
        background: sorot ? "#DCFCE7" : "#F3F4F6",
        border: sorot ? `4px solid ${HIJAU}` : "4px solid transparent",
        opacity: s,
        transform: `translateX(${(1 - s) * 60}px)`,
      }}
    >
      <Isi ukuran={36} warna="#374151">{kiri}</Isi>
      <Isi ukuran={36}>
        {kanan} {sorot ? "✓" : ""}
      </Isi>
    </div>
  );
};

const A5: React.FC = () => {
  const frame = useCurrentFrame();
  const tekan = interpolate(frame, [205, 213, 221], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Langkah label="DI RUMAH: ATUR PRINT" warna="#EF4444">
      <div style={{ width: 860, background: "white", borderRadius: 36, padding: 40, boxShadow: "0 20px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 20 }}>
        <Isi ukuran={52}>Print</Isi>
        <BarisAtur kiri="Printer" kanan="Printer saya" sorot={0} tunda={10} />
        <BarisAtur kiri="Ukuran kertas" kanan="A4" sorot={frame > 95 ? 1 : 0} tunda={20} />
        <BarisAtur kiri="Skala" kanan="100% / Ukuran asli" sorot={frame > 140 ? 1 : 0} tunda={30} />
        <BarisAtur kiri="Halaman" kanan="Semua / pilih" sorot={0} tunda={40} />
        <div style={{ alignSelf: "flex-end", marginTop: 16, background: ORANYE, borderRadius: 999, padding: "18px 64px", transform: `scale(${1 - tekan * 0.08})`, boxShadow: "0 8px 0 #9A3412" }}>
          <Isi ukuran={44} warna="white">Print</Isi>
        </div>
      </div>
    </Langkah>
  );
};

const Printer: React.FC<{ keluar: number; gambar: string }> = ({ keluar, gambar }) => (
  <div style={{ position: "relative", width: 640, height: 720 }}>
    {/* kertas keluar */}
    <div style={{ position: "absolute", left: 150, top: 243, width: 340, overflow: "hidden", height: keluar * 470, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}>
      <Img src={staticFile(gambar)} style={{ width: 340, display: "block", marginTop: (keluar - 1) * 470 }} />
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 640, height: 300, background: "#374151", borderRadius: 40 }}>
      <div style={{ position: "absolute", left: 100, top: 230, width: 440, height: 26, background: "#111827", borderRadius: 10 }} />
      <div style={{ position: "absolute", right: 50, top: 50, width: 30, height: 30, borderRadius: 99, background: HIJAU }} />
      <div style={{ position: "absolute", left: 60, top: 50 }}>
        <Isi ukuran={40} warna="white">PRINTER</Isi>
      </div>
    </div>
  </div>
);

const A6: React.FC = () => {
  const frame = useCurrentFrame();
  const keluar = interpolate(frame, [10, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Langkah label="TIPS HEMAT TINTA" warna="#22C55E">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <div style={{ background: "white", borderRadius: 28, padding: "20px 36px", boxShadow: "0 10px 24px rgba(0,0,0,0.1)" }}>
          <Isi ukuran={40} style={{ textAlign: "center" }}>Huruf A = hal. 3 • Huruf B = hal. 4</Isi>
          <Isi ukuran={40} style={{ textAlign: "center" }}>… sampai Huruf Z = hal. 28</Isi>
        </div>
        <Printer keluar={keluar} gambar="iklan-huruf/hal3.png" />
      </div>
    </Langkah>
  );
};

const A7: React.FC = () => {
  const bubble = useMasuk(20, 12);
  const usb = useMasuk(95, 10);
  return (
    <Langkah label="KE FOTOKOPI: KIRIM FILE" warna="#0EA5E9">
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <HP tinggi={760}>
          <div style={{ background: "#075E54", padding: "26px 28px" }}>
            <Isi ukuran={34} warna="white">Fotokopi Pak Budi</Isi>
          </div>
          <div style={{ padding: 26, background: "#ECE5DD", height: "100%" }}>
            <div style={{ marginLeft: "auto", width: 400, background: "#DCF8C6", borderRadius: 22, padding: 18, transform: `scale(${bubble})`, transformOrigin: "right top" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", background: "white", borderRadius: 14, padding: 12 }}>
                <div style={{ width: 54, height: 66, background: "#EF4444", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Isi ukuran={20} warna="white">PDF</Isi>
                </div>
                <Isi ukuran={22}>Belajar-Menulis-Huruf-A-Z.pdf</Isi>
              </div>
              <Isi ukuran={28} style={{ marginTop: 12 }}>
                Pak, tolong print A4 ya 🙏
              </Isi>
            </div>
          </div>
        </HP>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `scale(${usb})` }}>
          <Isi ukuran={44} warna="#6B7280">atau</Isi>
          <svg width={180} height={320} viewBox="0 0 180 320">
            <rect x="55" y="10" width="70" height="80" rx="8" fill="#9CA3AF" />
            <rect x="72" y="30" width="14" height="14" fill="#4B5563" />
            <rect x="94" y="30" width="14" height="14" fill="#4B5563" />
            <rect x="30" y="85" width="120" height="220" rx="24" fill={ORANYE} />
            <circle cx="90" cy="250" r="20" fill="#FDBA74" />
          </svg>
          <Isi ukuran={40}>Flashdisk</Isi>
        </div>
      </div>
    </Langkah>
  );
};

const Cek: React.FC<{ teks: string; tunda: number }> = ({ teks, tunda }) => {
  const s = useMasuk(tunda, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `scale(${0.7 + 0.3 * s})`, transformOrigin: "left center" }}>
      <div style={{ width: 66, height: 66, borderRadius: 999, background: HIJAU, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Isi ukuran={44} warna="white">✓</Isi>
      </div>
      <Isi ukuran={50}>{teks}</Isi>
    </div>
  );
};

const A8: React.FC = () => (
  <Langkah label="KE FOTOKOPI: BILANG INI" warna="#0EA5E9">
    <div style={{ width: 880, background: "white", borderRadius: 40, padding: "46px 50px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 30, position: "relative" }}>
      <Cek teks="Print ukuran A4" tunda={20} />
      <Cek teks="Cover berwarna" tunda={50} />
      <Cek teks="Isi hitam putih (lebih hemat)" tunda={90} />
      <Cek teks="Jilid spiral jadi buku" tunda={225} />
      <div style={{ position: "absolute", left: 90, bottom: -50, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "55px solid white" }} />
    </div>
  </Langkah>
);

const A9: React.FC = () => {
  const frame = useCurrentFrame();
  const kilau = interpolate(frame, [10, 60], [-400, 1100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coret = interpolate(frame, [75, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hapus = interpolate(frame, [140, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Langkah label="TIPS: PAKAI BERULANG" warna="#EC4899">
      <div style={{ position: "relative", width: 700, borderRadius: 24, overflow: "hidden", boxShadow: "0 0 0 14px rgba(147,197,253,0.6), 0 24px 50px rgba(0,0,0,0.25)" }}>
        <Img src={staticFile("iklan-huruf/hal3.png")} style={{ width: 700, display: "block" }} />
        <div style={{ position: "absolute", top: 0, left: kilau, width: 160, height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)", transform: "skewX(-20deg)" }} />
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={700} height={990} viewBox="0 0 700 990">
          {/* coretan spidol di baris tebalkan huruf A */}
          <path
            d="M95 560 L130 470 L165 560 M110 525 L150 525 M190 560 L225 470 L260 560 M205 525 L245 525"
            stroke="#2563EB"
            strokeWidth={9}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={600}
            strokeDashoffset={600 * (1 - coret)}
            opacity={1 - hapus}
          />
        </svg>
        <div style={{ position: "absolute", left: 60 + hapus * 220, top: 460, width: 110, height: 70, background: "#F9A8D4", borderRadius: 14, opacity: hapus > 0 && hapus < 1 ? 1 : 0, boxShadow: "0 6px 0 #DB2777" }} />
      </div>
    </Langkah>
  );
};

const A10: React.FC = () => {
  const s = useMasuk(10, 10);
  return (
    <AbsoluteFill>
      <Sinar warna="#FEF08A" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200, gap: 20 }}>
        <Teks ukuran={110} warna={ORANYE} garis="#7C2D12">SELAMAT</Teks>
        <Teks ukuran={110} mulai={6}>BELAJAR!</Teks>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 260, gap: 30 }}>
        <Img src={staticFile("tutorial-print/logo-alidraws.png")} style={{ width: 360, transform: `scale(${s})` }} />
        <Teks ukuran={64} warna={NAVY} garis="white" mulai={20}>
          LYNK.ID/ALIDRAWS
        </Teks>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ADEGAN = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10];

export const TutorialPrint: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: KREM }}>
    {ADEGAN.map((Adegan, i) => (
      <Sequence key={i} from={MULAI[i]} durationInFrames={DURASI[i]}>
        <Adegan />
        {i > 0 && i < ADEGAN.length - 1 ? <Subjudul teks={NASKAH[i]} /> : null}
      </Sequence>
    ))}
    <Audio src={staticFile("tutorial-print/musik-latar.wav")} volume={0.25} />
    {MULAI.map((m, i) => (
      <Sequence key={`suara${i}`} from={m + 6}>
        <Audio src={staticFile(`tutorial-print/suara/${i + 1}.wav`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
