import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Warung } from "./Warung";
import { BalonDialog, Intro, Outro, PapanWarung } from "./Overlay";

export type Episode12Props = { pakaiMusik: boolean };

export const Episode12: React.FC<Episode12Props> = ({ pakaiMusik }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {/* 3D: warung coto + 2 karakter */}
      <ThreeCanvas width={width} height={height} camera={{ fov: 50, position: [0, 2.6, 10] }}>
        <Warung />
      </ThreeCanvas>

      <PapanWarung />
      <BalonDialog />
      <Intro />
      <Outro />

      {pakaiMusik && <Audio src={staticFile("musik.mp3")} volume={0.25} loop />}
      {/* Voiceover: rekam dialognya, simpan sebagai public/ep12-voiceover.mp3, lalu buka komentar ini */}
      {/* <Audio src={staticFile("ep12-voiceover.mp3")} /> */}
    </AbsoluteFill>
  );
};
