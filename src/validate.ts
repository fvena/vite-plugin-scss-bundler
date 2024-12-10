import fs from "node:fs";

import type { ScssBundlerPluginOptions } from "./types";

/**
 * Validate if the file exists.
 *
 * @param file - The file to validate
 * @returns - True if the file exists
 * @throws - If the file does not exist
 */
function pathExists(path: string) {
  if (!fs.existsSync(path)) {
    throw new Error(`The path "${path}" does not exist.`);
  }

  return true;
}

/**
 * Validate a boolean option.
 *
 * @param option - The option to validate
 * @returns - True if the option is valid
 * @throws - If the option is invalid
 */
function validateBooleanOption(option: boolean) {
  if (typeof option !== "boolean") {
    throw new TypeError(`The option must be a boolean.`);
  }

  return true;
}

/**
 * Validate the file extension.
 *
 * @param path - The file path
 * @param extension - The required extension
 * @returns - True if the extension is valid
 * @throws - If the extension is invalid
 */
function validateExtension(path: string, extension: string) {
  if (!path.endsWith(extension)) {
    throw new Error(`The file "${path}" must have a "${extension}" extension.`);
  }

  return true;
}

/**
 * Validate the plugin options.
 *
 * @param options - Plugin options
 * @returns - True if the options are valid
 * @throws - If the options are invalid
 */
function validatePluginOptions(options: ScssBundlerPluginOptions) {
  // Validate required options
  if (!options.entryFile) throw new Error("The 'entryFile' parameter is required.");

  // Validate data
  pathExists(options.entryFile);
  validateExtension(options.entryFile, ".scss");
  validateVirtualName(options.virtualName);
  validateBooleanOption(options.silent);
  if (options.output) validateExtension(options.output, ".scss");
  if (options.watchDir) pathExists(options.watchDir);

  return true;
}

// validate virtualName start with 'virtual:'
function validateVirtualName(virtualName: string) {
  if (!virtualName.startsWith("virtual:")) {
    throw new Error(`The virtualName "${virtualName}" must start with "virtual:"`);
  }

  return true;
}

export { validatePluginOptions };
