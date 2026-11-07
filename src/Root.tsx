import { Composition } from "remotion";
import { Video3D } from "./Video3D";

// Ukuran vertikal 9:16 → pas untuk YouTube Shorts, TikTok, Reels/Facebook
export const RemotionRoot: React.FC = () => {
  return (
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
  );
};

