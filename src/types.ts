export type DefaultScssBundlerPluginOptions = Omit<ScssBundlerPluginOptions, "entryFile">;
export type InputScssBundlerPluginOptions = Partial<DefaultScssBundlerPluginOptions> &
  Pick<ScssBundlerPluginOptions, "entryFile">;

export interface ScssBundlerPluginOptions {
  entryFile: string; // The main SCSS file to bundle
  output?: string; // Path to save the bundled SCSS file
  virtualName: string; // Custom name for the virtual SCSS bundle
  watchDir?: string; // Path to the directory to watch for changes.
}
