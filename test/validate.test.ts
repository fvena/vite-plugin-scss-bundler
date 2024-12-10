import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

import type { ScssBundlerPluginOptions } from "../src/types";

import { validatePluginOptions } from "../src/validate";

vi.mock("fs");

const options: ScssBundlerPluginOptions = {
  entryFile: "src/main.scss",
  silent: false,
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
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.css");
      const config = { ...options, entryFile: "src/main.css" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The file "src/main.css" must have a ".scss" extension.');
    });
  });

  describe("virtualName validation", () => {
    it("should throw an error if virtualName is invalid", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, virtualName: "invalid" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The virtualName "invalid" must start with "virtual:"');
    });

    it("should validate successfully with correct virtualName", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, virtualName: "virtual:my-scss-bundle" };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });
  });

  describe("output validation", () => {
    it("should validate successfully with correct output", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, output: "output.scss" };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });

    it("should throw an error if output has invalid extension", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, output: "output.css" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The file "output.css" must have a ".scss" extension.');
    });
  });

  describe("watchDir validation", () => {
    it("should throw an error if watchDir not exists", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, watchDir: "src" };

      expect(() => {
        validatePluginOptions(config);
      }).toThrowError('The path "src" does not exist.');
    });

    it("should validate successfully with correct watchDir", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) =>
        ["src/main.scss", "src/styles"].includes(path as string),
      );
      const config = { ...options, watchDir: "src/styles" };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });
  });

  describe("silent validation", () => {
    it("should throw an error if silent is invalid", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, silent: "off" };

      expect(() => {
        // @ts-expect-error - testing invalid options
        validatePluginOptions(config);
      }).toThrowError("The option must be a boolean.");
    });

    it("should validate successfully with correct silent", () => {
      vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
      const config = { ...options, silent: true };

      expect(() => {
        validatePluginOptions(config);
      }).toBeTruthy();
    });
  });

  it("should validate successfully with correct parameters", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "src/main.scss");
    const config = { ...options };

    expect(() => {
      validatePluginOptions(config);
    }).toBeTruthy();
  });
});
