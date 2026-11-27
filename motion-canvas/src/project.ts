import {makeProject} from '@motion-canvas/core';
import './fonts/fonts.css';
import asepLari from './scenes/asep-lari?scene';
import suara from './audio/asep-lari.wav';

// Format vertikal 1080x1920 (Shorts/TikTok). Ukuran disimpan di project.meta.
// Contoh lama (scenes/example.tsx) masih ada; tambahkan ke daftar kalau perlu.
export default makeProject({
  scenes: [asepLari],
  audio: suara,
});
