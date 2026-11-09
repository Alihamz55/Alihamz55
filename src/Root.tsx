import { Composition } from "remotion";
import { Video3D } from "./Video3D";
import { Episode12 } from "./ep12/Episode12";
import { TOTAL_FRAME, FPS } from "./ep12/naskah";
import { Doa } from "./doa/Doa";
import { DURASI_DETIK } from "./doa/lagu";
import { NeonStreets } from "./neon/NeonStreets";
import { Cover as NeonCover } from "./neon/Cover";
import { DURASI_DETIK as DURASI_NEON, FPS as FPS_NEON } from "./neon/lirik";

// Ukuran vertikal 9:16 → pas untuk YouTube Shorts, TikTok, Reels/Facebook
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NeonCover"
        component={NeonCover}
        durationInFrames={1}
        fps={30}
        width={3000}
        height={3000}
        defaultProps={{ subjudul: "" }}
      />
      <Composition
        id="NeonStreets"
        component={NeonStreets}
        durationInFrames={Math.round(DURASI_NEON * FPS_NEON)}
        fps={FPS_NEON}
        width={1080}
        height={1920}
        defaultProps={{ pakaiLagu: true }}
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
