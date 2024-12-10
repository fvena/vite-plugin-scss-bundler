import type { Plugin } from "vite";

import path from "node:path";

import type { ScssBundlerPluginOptions } from "./types";

import { validatePluginOptions } from "./validate";

const defaultOptions: Partial<ScssBundlerPluginOptions> = {};

/**
 * A Vite plugin to bundle SCSS libraries into a single file.
 * Supports both virtual serving and physical file writing.
 */
export default function scssBundlerPlugin(options: ScssBundlerPluginOptions): Plugin {
  /* eslint-disable perfectionist/sort-objects */
  return {
    name: "vite-plugin-scss-bundler",
    configResolved(resolvedConfig) {
      const root = resolvedConfig.root;

      // Merge options with defaults
      options = { ...defaultOptions, ...options } as ScssBundlerPluginOptions;

      // Resolve paths
      if (options.entryFile) options.entryFile = path.resolve(root, options.entryFile);

      try {
        validatePluginOptions(options);
      } catch (error) {
        console.error(error);
      }
    },
    buildStart() {
      console.log("Building SCSS libraries...");
      console.log("Options:", options);
    },
    /* eslint-enabled perfectionist/sort-objects */
  };
}
