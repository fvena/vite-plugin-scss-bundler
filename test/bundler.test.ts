import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

import { createScssBundler, resolveImportPath } from "../src/bundler";

vi.mock("fs");

describe("createScssBundler", () => {
  it("should resolve the content of a SCSS file with import", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@import "variables";';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$primary-color: #333;");
  });

  it("should resolve the content of a SCSS file with @use", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@use "variables" as *;';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$primary-color: #333;");
  });

  it("should resolve the content of a SCSS file with @forward", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@forward "variables" as *;';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$primary-color: #333;");
  });

  it("should throw an error if the imported file has a namespace", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@use "variables" as myNamespace;';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      return "";
    });

    expect(() => {
      createScssBundler("/root/main.scss");
    }).toThrowError(
      '/root/main.scss, cannot import files with a namespace "@use "variables" as myNamespace;"',
    );
  });

  it("should throw an error if the imported file hasn't is *", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@use "variables";';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      return "";
    });

    expect(() => {
      createScssBundler("/root/main.scss");
    }).toThrowError('/root/main.scss, cannot import files with a namespace "@use "variables";"');
  });

  it("should resolve the content of a SCSS file with multiple imports", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) =>
      ["/root/colors.scss", "/root/variables.scss"].includes(path as string),
    );

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@import "colors";\n@import "variables";';
      if (filePath === "/root/variables.scss") return "$primary-color: #333;";
      if (filePath === "/root/colors.scss") return "$secondary-color: #555;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$secondary-color: #555;\n$primary-color: #333;");
  });

  it("should resolve the content of a SCSS file with multiple nested imports", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) =>
      ["/root/colors.scss", "/root/variables.scss"].includes(path as string),
    );

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@import "variables";';
      if (filePath === "/root/variables.scss") return '@import "colors";\n$primary-color: #333;';
      if (filePath === "/root/colors.scss") return "$secondary-color: #555;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$secondary-color: #555;\n$primary-color: #333;");
  });

  it("should resolve the content of a SCSS file with nested folders", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) =>
      ["/root/base/variables.scss", "/root/utils/colors.scss"].includes(path as string),
    );

    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@import "base/variables";';
      if (filePath === "/root/base/variables.scss")
        return '@import "../utils/colors";\n$primary-color: #333;';
      if (filePath === "/root/utils/colors.scss") return "$secondary-color: #555;";
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe("$secondary-color: #555;\n$primary-color: #333;");
  });

  it("should skip native Sass modules", () => {
    vi.spyOn(fs, "readFileSync").mockImplementation((filePath) => {
      if (filePath === "/root/main.scss") return '@import "sass:color";';
      return "";
    });

    const result = createScssBundler("/root/main.scss");
    expect(result).toBe('@import "sass:color"; // Ignored native Sass module import');
  });
});

describe("resolveImportPath", () => {
  it("should resolve the import path with extension", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    const result = resolveImportPath("variables.scss", "/root");
    expect(result).toBe("/root/variables.scss");
  });

  it("should resolve the import path without extension", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    const result = resolveImportPath("variables", "/root");
    expect(result).toBe("/root/variables.scss");
  });

  it("should resolve the import path with absolute path", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    const result = resolveImportPath("/root/variables", "/root");
    expect(result).toBe("/root/variables.scss");
  });

  it("should resolve the import path with relative path", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    const result = resolveImportPath("./variables", "/root");
    expect(result).toBe("/root/variables.scss");
  });

  it("should resolve the import path with relative path", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/variables.scss");

    const result = resolveImportPath("../variables", "/root/base");
    expect(result).toBe("/root/variables.scss");
  });

  it("should resolve the import path with partial", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/_variables.scss");

    const result = resolveImportPath("variables", "/root");
    expect(result).toBe("/root/_variables.scss");
  });

  it("should resolve the import path with partial and extension", () => {
    vi.spyOn(fs, "existsSync").mockImplementation((path) => path === "/root/_variables.scss");

    const result = resolveImportPath("variables.scss", "/root");
    expect(result).toBe("/root/_variables.scss");
  });

  it("should throw an error if the imported file not found", () => {
    vi.spyOn(fs, "existsSync").mockReturnValue(false);

    expect(() => {
      resolveImportPath("variables", "/root");
    }).toThrowError('The imported file "variables" not found.');
  });

  it("should throw an error if the imported file has an invalid extension", () => {
    expect(() => {
      resolveImportPath("variables.less", "/root");
    }).toThrowError('The imported file "variables.less" must have a ".scss" or ".css" extension.');
  });
});
