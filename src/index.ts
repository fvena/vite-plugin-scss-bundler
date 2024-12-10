import type { Plugin } from "vite";

import path from "node:path";

import type {
  DefaultScssBundlerPluginOptions,
  InputScssBundlerPluginOptions,
  ScssBundlerPluginOptions,
} from "./types";

import { createScssBundler } from "./bundler";
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
      // Merge input options with defaults
      options = { ...defaultOptions, ...inputOptions };

      // Resolve paths
      if (options.entryFile)
        options.entryFile = path.resolve(resolvedConfig.root, options.entryFile);

      try {
        validatePluginOptions(options);
        virtualModuleId = options.virtualName;
      } catch (error) {
        console.error(error);
      }
    },

    buildStart() {
      try {
        scssBundle = createScssBundler(options.entryFile);
      } catch (error) {
        console.error(error);
      }
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
