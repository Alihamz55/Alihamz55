import {makeProject} from '@motion-canvas/core';
import './fonts/fonts.css';
import example from './scenes/example?scene';

// Format vertikal 1080x1920 (Shorts/TikTok). Ukuran disimpan di project.meta.
export default makeProject({
  scenes: [example],
});
