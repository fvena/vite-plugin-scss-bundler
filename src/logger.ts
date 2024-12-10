import chalk from "chalk";

/**
 * Logs an error message with a timestamp.
 *
 * @param message - The message to log.
 */
export function logError(message: string): void {
  console.error(
    chalk.gray(new Date().toLocaleTimeString()),
    chalk.bold.cyan("[SCSS Bundler]"),
    chalk.red(message),
  );
}

/**
 * Logs a success message with a timestamp.
 *
 * @param message - The message to log.
 */
export function logSuccess(message: string): void {
  console.log(
    chalk.gray(new Date().toLocaleTimeString()),
    chalk.bold.cyan("[SCSS Bundler]"),
    chalk.green(message),
  );
}
