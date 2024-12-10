import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

import type { ScssBundlerPluginOptions } from "../src/types";

import { validatePluginOptions } from "../src/validate";

vi.mock("fs");

describe("validatePluginOptions", () => {
  describe("entryFile validation", () => {
    it("should throw an error if entryFile is missing", () => {
      const config = {} as ScssBundlerPluginOptions;
      expect(() => {
        validatePluginOptions(config);
      }).toThrowError("The 'entryFile' parameter is required.");
    });

    it("should throw an error if entryFile not exists", () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      const config = { entryFile: "main.scss" };
      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The path "main.scss" does not exist.');
    });

    it("should throw an error if entryFile has invalid extension", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.css");
      const config = { entryFile: "main.css" };
      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The file "main.css" must have a ".scss" extension.');
    });
  });

  it("should validate successfully with correct parameters", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.scss");
    const config = { entryFile: "main.scss" };
    expect(() => {
      validatePluginOptions(config);
    }).not.toThrow();
  });

  // it("should throw an error if output is defined but invalid", () => {
  //   const config = { entryFile: "main.scss", inputDir: "./src/styles", output: 123 };
  //   expect(() => {
  //     validatePluginOptions(config);
  //   }).toThrowError('The "output" parameter must be a valid string.');
  // });

  // it("should throw an error if ignore is not an array of regex", () => {
  //   const config = { entryFile: "main.scss", ignore: "invalid", inputDir: "./src/styles" };
  //   expect(() => {
  //     validatePluginOptions(config);
  //   }).toThrowError('The "ignore" parameter must be an array of regular expressions.');
  // });

  // it("should throw an error if virtualName is not a string", () => {
  //   const config = { entryFile: "main.scss", inputDir: "./src/styles", virtualName: 123 };
  //   expect(() => {
  //     validatePluginOptions(config);
  //   }).toThrowError('The "virtualName" parameter must be a string.');
  // });

  // it("should validate successfully with all valid parameters", () => {
  //   const config = {
  //     entryFile: "main.scss",
  //     ignore: [/test\.scss$/, /_temp/],
  //     inputDir: "./src/styles",
  //     output: "./dist/bundle.scss",
  //     virtualName: "virtual:my-scss-bundle",
  //   };
  //   expect(() => {
  //     validatePluginOptions(config);
  //   }).not.toThrow();
  // });
});
