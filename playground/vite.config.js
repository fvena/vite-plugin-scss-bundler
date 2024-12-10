import { defineConfig } from "vite";
import scssBundlerPlugin from "vite-plugin-scss-bundler";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    scssBundlerPlugin({
      entryFile: "src/styles/main.scss",
      output: "src/bundled.scss",
    }),
  ],
});
