import {makeProject} from '@motion-canvas/core';
import './fonts/fonts.css';
import hidupSehat from './scenes/hidup-sehat?scene';
import suara from './audio/hidup-sehat.wav';

// Format vertikal 1080x1920 (Shorts/TikTok). Ukuran disimpan di project.meta.
// Scene lain (example, asep-lari) masih ada di folder scenes/; ganti di sini kalau perlu.
export default makeProject({
  scenes: [hidupSehat],
  audio: suara,
});
