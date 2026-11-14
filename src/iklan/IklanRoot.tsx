import { Composition } from "remotion";
import { IklanHuruf, IKLAN_FRAME } from "./IklanHuruf";

export const IklanRoot: React.FC = () => (
  <Composition id="IklanHuruf" component={IklanHuruf} durationInFrames={IKLAN_FRAME} fps={30} width={1080} height={1920} />
);
