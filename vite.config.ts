import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
// STANDALONE=1 -> un seul fichier HTML (hors ligne)
export default defineConfig({ base: './', plugins: [react(), tailwindcss(), ...(process.env.STANDALONE ? [viteSingleFile()] : [])] });
