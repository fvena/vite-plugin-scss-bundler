export type DefaultScssBundlerPluginOptions = Omit<ScssBundlerPluginOptions, "entryFile">;
export type InputScssBundlerPluginOptions = Partial<DefaultScssBundlerPluginOptions> &
  Pick<ScssBundlerPluginOptions, "entryFile">;

export interface ScssBundlerPluginOptions {
  entryFile: string; // The main SCSS file to bundle
  virtualName: string; // Custom name for the virtual SCSS bundle
}
