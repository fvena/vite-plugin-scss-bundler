import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

import type { ScssBundlerPluginOptions } from "../src/types";

import { validatePluginOptions } from "../src/validate";

vi.mock("fs");

const options: ScssBundlerPluginOptions = {
  entryFile: "main.scss",
  virtualName: "virtual:my-scss-bundle",
};

describe("validatePluginOptions", () => {
  describe("entryFile validation", () => {
    it("should throw an error if entryFile is missing", () => {
      const config = { ...options };
      // @ts-expect-error - testing invalid options
      delete config.entryFile;

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError("The 'entryFile' parameter is required.");
    });

    it("should throw an error if entryFile not exists", () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      const config = { ...options, entryFile: "main.scss" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The path "main.scss" does not exist.');
    });

    it("should throw an error if entryFile has invalid extension", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.css");
      const config = { ...options, entryFile: "main.css" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The file "main.css" must have a ".scss" extension.');
    });
  });

  describe("virtualName validation", () => {
    it("should throw an error if virtualName is invalid", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.scss");
      const config = { ...options, virtualName: "invalid" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The virtualName "invalid" must start with "virtual:"');
    });

    it("should validate successfully with correct virtualName", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.scss");
      const config = { ...options, virtualName: "virtual:my-scss-bundle" };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });

    it("should validate successfully with correct parameters", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "main.scss");
      const config = { ...options };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });
  });
});
