import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
// import react from "@vitejs/plugin-react";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA(),
    // @ts-ignore
    // react({ fastRefresh: false }),
    react(),
    glsl({
      include: [
        "**/*.glsl",
        "**/*.wgsl",
        "**/*.vert",
        "**/*.frag",
        "**/*.vs",
        "**/*.fs",
      ],
      exclude: undefined, // Glob pattern, or array of glob patterns to ignore
      warnDuplicatedImports: true, // Warn if the same chunk was imported multiple times
      defaultExtension: "glsl", // Shader suffix when no extension is specified
      compress: false, // Compress output shader code
      watch: true, // Recompile shader on change
      root: "/", // Directory for root imports
    }),
  ],
  worker: {
    plugins: [react()],
  },
  define: {
    "process.env": process.env,
  },
});
