import { Config } from "@remotion/cli/config";

// Wajib untuk Three.js: pakai renderer OpenGL "angle" supaya 3D-nya ikut kerender
Config.setChromiumOpenGlRenderer("angle");
// Kalau render error "Error creating WebGL context" (misal di server tanpa GPU),
// jalankan: npm run render -- --gl=swangle
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
