import { Composition, Still } from "remotion";
import { NinoClip } from "./nino/NinoClip";
import { Cover } from "./nino/Cover";
import { CLIP, FPS as FPS_NINO } from "./nino/data";
import { Video3D } from "./Video3D";
import { Episode12 } from "./ep12/Episode12";
import { TOTAL_FRAME, FPS } from "./ep12/naskah";
import { Doa } from "./doa/Doa";
import { DURASI_DETIK } from "./doa/lagu";

// Ukuran vertikal 9:16 → pas untuk YouTube Shorts, TikTok, Reels/Facebook
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {CLIP.map((clip) => (
        <Composition
          key={`clip${clip.nomor}`}
          id={`NinoClip${clip.nomor}`}
          component={NinoClip}
          durationInFrames={Math.floor(clip.durasiDetik * FPS_NINO)}
          fps={FPS_NINO}
          width={1080}
          height={1920}
          defaultProps={{ nomor: clip.nomor }}
        />
      ))}
      {CLIP.map((clip) => (
        <Still
          key={`cover${clip.nomor}`}
          id={`NinoCover${clip.nomor}`}
          component={Cover}
          width={1080}
          height={1920}
          defaultProps={{ clip }}
        />
      ))}
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
