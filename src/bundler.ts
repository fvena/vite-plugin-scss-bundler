import fs from "node:fs";
import path from "node:path";

const IMPORT_PATTERN = /@(import|use|forward)\s+["']([^"']+)["'](?:\s+as\s+(\*|\w+))?\s*;?/gi;
const ALLOWED_EXTENSIONS = new Set(["css", "scss"]);

/**
 * Resolve the content of a SCSS file by embedding its imports.
 *
 * @param filePath - The path of the SCSS file to resolve.
 * @returns The fully resolved SCSS content.
 */
function createScssBundler(filePath: string): string {
  const fileDirectory = path.dirname(filePath);
  const fileContent = fs.readFileSync(filePath, "utf8");

  return fileContent.replaceAll(
    IMPORT_PATTERN,
    (match, importType: string, importPath: string, namespace: string) => {
      console.log(importType, importPath, namespace);
      const resolvedPath = resolveImportPath(importPath, fileDirectory);
      return createScssBundler(resolvedPath);
    },
  );
}

/**
 * Resolve the path of an imported file.
 *
 * @param filePath - The path of the imported file.
 * @param root - The root directory of the project.
 * @returns The resolved path of the imported file.
 */
function resolveImportPath(filePath: string, root: string): string {
  // Check if the file path starts with a double dot

  // Get extension, remove initial dot
  const cleanedPath = filePath.replace(/^\.{1,2}\//, "");
  const parts = cleanedPath.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";

  if (extension) {
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw new Error(`The imported file "${filePath}" must have a ".scss" or ".css" extension.`);
    }

    return path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath);
  }

  for (const extension of ALLOWED_EXTENSIONS) {
    const possiblePath = `${filePath}.${extension}`;
    const absolutePath = path.isAbsolute(possiblePath)
      ? possiblePath
      : path.resolve(root, possiblePath);

    if (fs.existsSync(absolutePath)) return absolutePath;
  }

  throw new Error(`The imported file "${filePath}" not found.`);
}

export { createScssBundler, resolveImportPath };
