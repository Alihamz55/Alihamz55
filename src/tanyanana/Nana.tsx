import React from "react";
import { useCurrentFrame } from "remotion";
import type { Ekspresi } from "./tipe";
import { FONT, W } from "./tema";

// Karakter utama: Nana, anak perempuan berhijab teal yang selalu penasaran.
// Digambar dengan SVG supaya tajam & mudah diubah ekspresinya.
export const Nana: React.FC<{ ekspresi: Ekspresi; bicara: boolean }> = ({ ekspresi, bicara }) => {
  const f = useCurrentFrame();
  const napas = Math.sin(f / 14) * 6;
  const kedip = f % 105 < 4 ? 0.12 : 1;
  const miring = ekspresi === "bingung" ? -6 : ekspresi === "kaget" ? 3 : Math.sin(f / 30) * 1.5;
  const buka = bicara ? 0.3 + 0.7 * Math.abs(Math.sin(f / 2.6)) * (0.6 + 0.4 * Math.sin(f / 7)) : 0;

  const alisKiri =
    ekspresi === "bingung" ? "M146 182 Q166 168 186 178" : ekspresi === "kaget" ? "M148 176 Q166 164 184 174" : "M148 186 Q166 178 184 186";
  const alisKanan =
    ekspresi === "bingung" ? "M214 190 Q234 186 254 192" : ekspresi === "kaget" ? "M216 174 Q234 164 252 176" : "M216 186 Q234 178 252 186";

  let mulut: React.ReactNode;
  if (bicara) {
    mulut = (
      <g>
        <ellipse cx={200} cy={272} rx={17} ry={4 + 14 * buka} fill="#8B2E3C" />
        <ellipse cx={200} cy={272 + 8 * buka} rx={9} ry={3 + 4 * buka} fill="#FF7A8A" />
      </g>
    );
  } else if (ekspresi === "senang") {
    mulut = <path d="M174 262 Q200 300 226 262 Z" fill="#8B2E3C" stroke="#8B2E3C" strokeWidth={4} strokeLinejoin="round" />;
  } else if (ekspresi === "kaget") {
    mulut = <ellipse cx={200} cy={274} rx={11} ry={14} fill="#8B2E3C" />;
  } else if (ekspresi === "bingung") {
    mulut = <path d="M184 276 Q194 266 204 274 Q212 280 220 270" fill="none" stroke="#8B2E3C" strokeWidth={6} strokeLinecap="round" />;
  } else {
    mulut = <path d="M182 266 Q200 284 218 266" fill="none" stroke="#8B2E3C" strokeWidth={6} strokeLinecap="round" />;
  }

  return (
    <svg viewBox="0 0 400 520" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx={200} cy={512} rx={140} ry={16} fill="rgba(45,42,50,0.15)" />
      <g transform={`translate(0 ${napas})`}>
        {/* Badan / baju */}
        <path d="M100 530 Q108 372 200 360 Q292 372 300 530 Z" fill={W.oranye} />
        <path d="M150 380 Q200 410 250 380 L250 530 L150 530 Z" fill="#FF9F5E" />
        {/* Tangan melambai (senang) */}
        {ekspresi === "senang" && (
          <g transform={`rotate(${Math.sin(f / 4) * 14} 300 400)`}>
            <path d="M280 400 Q330 380 336 300" fill="none" stroke={W.oranye} strokeWidth={44} strokeLinecap="round" />
            <circle cx={338} cy={286} r={26} fill={W.kulit} />
          </g>
        )}
        <g transform={`rotate(${miring} 200 360)`}>
          {/* Hijab belakang */}
          <path d="M200 58 C306 58 334 150 326 236 C320 300 344 340 304 386 L96 386 C56 340 80 300 74 236 C66 150 94 58 200 58 Z" fill={W.teal} />
          {/* Wajah */}
          <ellipse cx={200} cy={222} rx={86} ry={92} fill={W.kulit} />
          {/* Tepi hijab di dahi */}
          <path d="M108 206 C108 112 292 112 292 206 C270 150 130 150 108 206 Z" fill={W.teal} />
          {/* Bros bunga */}
          <g transform="translate(288 168)">
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 12} cy={Math.sin((a * Math.PI) / 180) * 12} r={10} fill={W.pink} />
            ))}
            <circle r={8} fill={W.kuning} />
          </g>
          {/* Alis */}
          <path d={alisKiri} fill="none" stroke="#5B3A29" strokeWidth={7} strokeLinecap="round" />
          <path d={alisKanan} fill="none" stroke="#5B3A29" strokeWidth={7} strokeLinecap="round" />
          {/* Mata */}
          {[166, 234].map((x) => (
            <g key={x} transform={`translate(${x} 222) scale(1 ${kedip})`}>
              <ellipse rx={ekspresi === "kaget" ? 15 : 13} ry={ekspresi === "kaget" ? 20 : 17} fill={W.gelap} />
              <circle cx={4} cy={-6} r={5} fill="#fff" />
            </g>
          ))}
          {/* Pipi */}
          <circle cx={140} cy={254} r={16} fill={W.pink} opacity={0.35} />
          <circle cx={260} cy={254} r={16} fill={W.pink} opacity={0.35} />
          {mulut}
        </g>
        {/* Tangan di dagu (bingung) */}
        {ekspresi === "bingung" && (
          <g>
            <path d="M270 420 Q262 350 238 318" fill="none" stroke={W.oranye} strokeWidth={42} strokeLinecap="round" />
            <circle cx={232} cy={306} r={24} fill={W.kulit} />
          </g>
        )}
      </g>
      {/* Tanda tanya melayang */}
      {(ekspresi === "bingung" || ekspresi === "kaget") && (
        <text
          x={330}
          y={110 + Math.sin(f / 9) * 10}
          fontFamily={FONT}
          fontSize={110}
          fill={ekspresi === "kaget" ? W.oranye : W.ungu}
          stroke="#fff"
          strokeWidth={10}
          paintOrder="stroke"
          transform={`rotate(${Math.sin(f / 12) * 10} 350 80)`}
        >
          {ekspresi === "kaget" ? "!" : "?"}
        </text>
      )}
    </svg>
  );
};
