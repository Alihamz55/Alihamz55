import { Composition } from "remotion";
import { Video3D } from "./Video3D";
import { Episode12 } from "./ep12/Episode12";
import { TOTAL_FRAME, FPS } from "./ep12/naskah";
import { Doa } from "./doa/Doa";
import { DURASI_DETIK } from "./doa/lagu";
import { IklanHuruf, IKLAN_FRAME } from "./iklan/IklanHuruf";

// Ukuran vertikal 9:16 → pas untuk YouTube Shorts, TikTok, Reels/Facebook
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IklanHuruf"
        component={IklanHuruf}
        durationInFrames={IKLAN_FRAME}
        fps={30}
        width={1080}
        height={1920}
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
