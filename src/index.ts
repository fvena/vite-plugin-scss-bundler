import type { Plugin, ResolvedConfig } from "vite";

/**
 * A Vite plugin to bundle SCSS libraries into a single file.
 * Supports both virtual serving and physical file writing.
 */
export default function scssBundlerPlugin(): Plugin {
  let viteConfig: ResolvedConfig;

  /* eslint-disable perfectionist/sort-objects */
  return {
    name: "vite-plugin-scss-bundler",
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;
    },
    buildStart() {
      console.log("Build started!");
      console.log("Vite config:", viteConfig);
    },
  };
  /* eslint-enabled perfectionist/sort-objects */
}
