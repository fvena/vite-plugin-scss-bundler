import type { Plugin } from "vite";

import path from "node:path";

import type {
  DefaultScssBundlerPluginOptions,
  InputScssBundlerPluginOptions,
  ScssBundlerPluginOptions,
} from "./types";

import { createScssBundler, processedFiles } from "./bundler";
import { writeFile } from "./file";
import { validatePluginOptions } from "./validate";

const defaultOptions: DefaultScssBundlerPluginOptions = {
  virtualName: "virtual:scss-bundle",
};

/**
 * A Vite plugin to bundle SCSS libraries into a single file.
 * Supports both virtual serving and physical file writing.
 */
export default function scssBundlerPlugin(inputOptions: InputScssBundlerPluginOptions): Plugin {
  let virtualModuleId = "";
  let scssBundle: string;
  let options: ScssBundlerPluginOptions;
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;

  /* eslint-disable perfectionist/sort-objects */
  return {
    name: "vite-plugin-scss-bundler",

    configResolved(resolvedConfig) {
      const { root } = resolvedConfig;

      // Merge input options with defaults
      options = { ...defaultOptions, ...inputOptions };

      // Resolve paths
      if (options.entryFile) options.entryFile = path.resolve(root, options.entryFile);
      if (options.output) options.output = path.resolve(root, options.output);
      if (options.watchDir) options.watchDir = path.resolve(root, options.watchDir);

      // Validate options
      validatePluginOptions(options);
      virtualModuleId = options.virtualName;
    },

    buildStart() {
      try {
        scssBundle = createScssBundler(options.entryFile);
        if (options.output) writeFile(options.output, scssBundle);
      } catch (error) {
        console.error(error);
      }
    },

    handleHotUpdate({ file, server }) {
      if (!options.watchDir) return; // Only process changes if watchDir is set
      if (!file.startsWith(options.watchDir)) return; // Only process changes in the specified directory
      if (!file.endsWith(".scss") && !file.endsWith(".css")) return; // Only process changes in `.scss` or `.css` files
      if (options.output && file.endsWith(options.output)) return; // Avoid infinite loops if the output file is in the watchDir

      try {
        processedFiles.clear(); // Clear the cache
        scssBundle = createScssBundler(options.entryFile);
        if (options.output) writeFile(options.output, scssBundle);
      } catch (error) {
        console.error(error);
      }

      server.ws.send({ path: "*", type: "full-reload" });

      return [];
    },

    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : undefined;
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(scssBundle)};`;
      }
      return;
    },
    /* eslint-enabled perfectionist/sort-objects */
  };
}
