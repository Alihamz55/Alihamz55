import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { Panggung } from "./Panggung";
import { DURASI_DETIK } from "./lagu";

const LAGU = staticFile("doa/lagu.mp3");

export const Doa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const audio = useAudioData(LAGU);

  // Kekuatan suara di frame ini (0–1), dipakai untuk denyut cahaya
  let volume = 0;
  if (audio) {
    const v = visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 32 });
    volume = v.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#140a32" }}>
      <ThreeCanvas width={width} height={height} flat camera={{ fov: 50, position: [0, 0, 5] }}>
        <Panggung durasi={DURASI_DETIK} volume={volume} />
      </ThreeCanvas>
      <Audio src={LAGU} />
    </AbsoluteFill>
  );
};
