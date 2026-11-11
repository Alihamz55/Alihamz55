import { Composition } from "remotion";
import { Video3D } from "./Video3D";
import { Episode12 } from "./ep12/Episode12";
import { TOTAL_FRAME, FPS } from "./ep12/naskah";
import { Doa } from "./doa/Doa";
import { DURASI_DETIK } from "./doa/lagu";
import { DURASI_DUEL, StickmanDuel } from "./stickman/Duel";
import { DURASI_KEROYOK, StickmanKeroyok } from "./stickman/Keroyok";
import { AyahDuluSekarang, AyahPembuka, AyahPenutup } from "./ayah/HariAyah";

// Ukuran vertikal 9:16 → pas untuk YouTube Shorts, TikTok, Reels/Facebook
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StickmanKeroyok"
        component={StickmanKeroyok}
        durationInFrames={DURASI_KEROYOK}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="StickmanDuel"
        component={StickmanDuel}
        durationInFrames={DURASI_DUEL}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ===== Hari Ayah Nasional: elemen untuk template CapCut ===== */}
      <Composition
        id="AyahPembuka"
        component={AyahPembuka}
        durationInFrames={30 * 4}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ baris1: "Untuk Ayah,", baris2: "DENGAN CINTA", keterangan: "HARI AYAH NASIONAL · 12 NOVEMBER" }}
      />
      <Composition
        id="AyahDuluSekarang"
        component={AyahDuluSekarang}
        durationInFrames={30 * 6}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ labelDulu: "DULU", labelSekarang: "SEKARANG" }}
      />
      <Composition
        id="AyahPenutup"
        component={AyahPenutup}
        durationInFrames={30 * 4}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ pesan: "Terima kasih, Ayah", tagar: "#HariAyah2026" }}
      />
      <Composition
        id="DoaPanggung"
        component={Doa}
        durationInFrames={Math.round(DURASI_DETIK * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ karakter: "perempuan" as const }}
      />
      <Composition
        id="DoaPanggungLaki"
        component={Doa}
        durationInFrames={Math.round(DURASI_DETIK * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ karakter: "laki" as const }}
      />
      <Composition
        id="Episode12"
        component={Episode12}
        durationInFrames={TOTAL_FRAME}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ pakaiMusik: true }}
      />
      <Composition
        id="Video3D"
        component={Video3D}
        durationInFrames={30 * 10} // 10 detik (30 fps x 10)
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          judul: "Belajar 3D itu seru!",
          warnaObjek: "#ff4d6d",
          warnaLatar: "#0b1026",
          pakaiMusik: true,
        }}
      />
    </>
  );
};
