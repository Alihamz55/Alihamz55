// No intro / no outro: hook on frame 0 (Shorts retention).
import * as SM from './story_main.js';
export const INTRO = 0, MAIN = SM.TOTAL, OUTRO = 0, TOTAL = SM.TOTAL, FPS = 30;
export const LIGHTS = SM.LIGHTS, SHOTS = SM.SHOTS;
export const shotAt = SM.shotAt, lightFor = SM.lightFor, camAt = SM.camAt, dofAt = SM.dofAt, actorsAt = SM.actorsAt, fxAt = SM.fxAt, worldAt = SM.worldAt;
