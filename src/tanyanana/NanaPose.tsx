import React from "react";
import { AbsoluteFill } from "remotion";
import { Nana } from "./Nana";
import type { Ekspresi } from "./tipe";

// Nana saja, latar transparan — untuk dipakai sebagai gambar di film lain (mis. Lemo-Opuscar).
export const NanaPose: React.FC<{ ekspresi: Ekspresi; bicara: boolean }> = ({ ekspresi, bicara }) => (
  <AbsoluteFill>
    <Nana ekspresi={ekspresi} bicara={bicara} />
  </AbsoluteFill>
);
