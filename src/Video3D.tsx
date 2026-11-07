import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Scene } from "./Scene";
import { Captions } from "./Captions";
import { Title } from "./Title";

export type Video3DProps = {
  judul: string;
  warnaObjek: string;
  warnaLatar: string;
  pakaiMusik: boolean;
};


export const Video3D: React.FC<Video3DProps> = ({
  judul,
  warnaObjek,
  warnaLatar,
  pakaiMusik,
}) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: warnaLatar }}>
      {/* LAPISAN 1: Animasi 3D (Three.js) */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 50, position: [0, 0, 9] }}
      >
        <Scene warna={warnaObjek} />
      </ThreeCanvas>

      {/* LAPISAN 2: Judul di atas */}
      <Title teks={judul} />

      {/* LAPISAN 3: Caption ala TikTok di bawah */}
      <Captions />

      {/* LAPISAN 4: Audio (ganti file di folder public/) */}
      {pakaiMusik && <Audio src={staticFile("musik.mp3")} volume={0.4} />}
      {/* Kalau punya voiceover, taruh public/voiceover.mp3 lalu aktifkan baris ini: */}
      {/* <Audio src={staticFile("voiceover.mp3")} volume={1} /> */}
    </AbsoluteFill>
  );
};
