import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Title: React.FC<{ teks: string }> = ({ teks }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const geser = interpolate(frame, [0, 20], [-40, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 220 }}>
      <div
        style={{
          opacity,
          transform: `translateY(${geser}px)`,
          color: "white",
          fontSize: 80,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "0 60px",
          textShadow: "0 6px 20px rgba(0,0,0,0.6)",
        }}
      >
        {teks}
      </div>
    </AbsoluteFill>
  );
};
