import fs from "node:fs";
import path from "node:path";

/**
 * Writes content to a file, creating directories if necessary.
 *
 * @param filePath - The path to the file.
 * @param content - The content to write.
 */
export function writeFile(filePath: string, content: string) {
  try {
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf8");
  } catch (error) {
    throw new Error(`Error writing ${filePath}: ${(error as Error).message}`);
  }
}
