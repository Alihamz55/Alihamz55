import { Composition } from "remotion";
import { TutorialPrint, TUTORIAL_FRAME } from "./TutorialPrint";

export const TutorialRoot: React.FC = () => (
  <Composition id="TutorialPrint" component={TutorialPrint} durationInFrames={TUTORIAL_FRAME} fps={30} width={1080} height={1920} />
);
