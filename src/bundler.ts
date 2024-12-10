import fs from "node:fs";
import path from "node:path";

const IMPORT_PATTERN = /@(import|use|forward)\s+["']([^"']+)["'](?:\s+as\s+(\*|\w+))?\s*;?/gi;
const ALLOWED_EXTENSIONS = new Set(["css", "scss"]);
export const processedFiles = new Set<string>();

/**
 * Resolve the content of a SCSS file by embedding its imports.
 *
 * @param filePath - The path of the SCSS file to resolve.
 * @returns The fully resolved SCSS content.
 */
function createScssBundler(filePath: string): string {
  // Skip already processed files
  if (processedFiles.has(filePath)) return "";
  processedFiles.add(filePath);

  const fileDirectory = path.dirname(filePath);
  const fileContent = fs.readFileSync(filePath, "utf8");

  return fileContent.replaceAll(
    IMPORT_PATTERN,
    (match, importType: string, importPath: string, namespace: string) => {
      // Skip native Sass modules
      if (importPath.startsWith("sass:")) return `${match} // Ignored native Sass module import`;

      // Cannot import files with a namespace
      if (importType !== "import" && (!namespace || namespace !== "*")) {
        throw new Error(`${filePath}, cannot import files with a namespace "${match}"`);
      }

      // Resolve the import path
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

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(root, filePath);

    if (fs.existsSync(absolutePath)) return absolutePath;

    const partialPath = absolutePath.replace(/\/([^/]+)$/, "/_$1");
    if (fs.existsSync(partialPath)) return partialPath;
  }

  for (const extension of ALLOWED_EXTENSIONS) {
    const possiblePath = `${filePath}.${extension}`;
    const absolutePath = path.isAbsolute(possiblePath)
      ? possiblePath
      : path.resolve(root, possiblePath);

    if (fs.existsSync(absolutePath)) return absolutePath;

    const partialPath = absolutePath.replace(/\/([^/]+)$/, "/_$1");
    if (fs.existsSync(partialPath)) return partialPath;
  }

  throw new Error(`The imported file "${filePath}" not found.`);
}

export { createScssBundler, resolveImportPath };
