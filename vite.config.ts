import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from "vite-plugin-svgr";
import server from "./server";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  root: './src',
  publicDir: '../public',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
  },
  server: {
    host: true,
    port: 3535,
  },
  plugins: [
    react({ plugins: [] }),
    svgr(),
    server(),
    glsl({ minify: process.argv.includes('build') })
  ],
});
