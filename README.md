<!-- PROJECT HEADER -->
<br />
<p align="right">
  ⭐ &nbsp;&nbsp;<strong>to the project if you like it</strong> ↗️:
</p>

<p align="center">
  <h2 align="center">vite-plugin-scss-bundler</h2>
  <div align="center">A Vite plugin to bundle SCSS libraries into a single file. Supports both virtual serving and physical file writing.</div>
</p>

<br/>

<div align="center">

[![SemVer](https://img.shields.io/npm/v/vite-plugin-scss-bundler)]()
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

</div>

<p align="center">
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="https://github.com/fvena/vite-plugin-scss-bundler/issues">Report Bug</a>
  ·
  <a href="https://github.com/fvena/vite-plugin-scss-bundler/issues">Request Feature</a>
</p>

<br/>

<details open="false">
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#motivation">Motivation</a>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributions">Contributions</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## 💡 Motivation

The motivation behind `vite-plugin-scss-bundler` is to create a unified SCSS bundle that can be easily utilized in various scenarios:

Previewing Content: Pass the bundled SCSS library to components or tools that require the complete stylesheet for rendering previews or managing styles dynamically.
Extracting Information: Simplify the extraction of key information from the library, such as variables, colors, typography settings, and configuration values, to streamline workflows and enable advanced integrations.

## 🌟 Features

- **Full SCSS Support:** Compatible with `@import`, `@use`, and `@forward`.
- **Dependency Resolution:** Maintains the correct order of imports to ensure the correct cascade of styles.
- **Avoid Duplicates:** Automatically skips duplicate imports.
- **Virtual Bundle Module:** Provides a virtual SCSS bundle that can be imported directly into your project.
- **Output to File:** Optionally save the bundle as a physical `.scss` file.
- **Watch Mode:** Automatically rebuilds the bundle when changes are detected in the SCSS files.
- **Ignore Patterns:** Supports regex patterns to exclude files from the bundle.
- **Customizable Virtual Module Name:** Change the default name `virtual:scss-bundle` to suit your project.
- **Warnings & Errors:** Displays clear warnings and stops execution on critical errors, ensuring reliability.

## 🚀Getting Started

### Installation

```sh
npm install vite-plugin-scss-bundler
```

## 🛠️ Usage

In your `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import scssBundlePlugin from "vite-plugin-scss-bundler";

export default defineConfig({
  plugins: [
    scssBundlePlugin({
      inputDir: "src/styles",
      entryFile: "main.scss",
      output: "dist/bundle.scss",
      watch: true,
      ignore: [/test\.scss$/, /_temp/],
      minify: true,
      silent: false,
    }),
  ],
});
```

### Using the Virtual Bundle

The plugin provides a virtual module (virtual:scss-bundle by default) that allows you to include the SCSS bundle directly in your project without saving it to a file. Here's how to use it:

```scss
// Stylesheet file
@use "virtual:scss-bundle";
```

```ts
// TypeScript file
import libraryScss from "virtual:scss-bundle";
```

You can also customize the virtual module's name using the virtualName parameter in the plugin configuration.

For TypeScript projects, add the following declaration to avoid type errors in a `virtual.d.ts` file or any existing .d.ts file in your project:

```ts
declare module "virtual:scss-bundle" {
  const scss: string;
  export default scss;
}
```

This tells TypeScript what to expect when importing the virtual:scss-bundle module.

## ⚙️ Configuration

| Parameter     | Type     | Description                                                                  | Default             |
| ------------- | -------- | ---------------------------------------------------------------------------- | ------------------- |
| watchDir      | string   | Path to the directory to watch for changes library.                          | Required            |
| entryFile     | string   | Entry file for the SCSS bundle.                                              | Required            |
| output        | string   | Path to save the bundled SCSS file (optional).                               | null (only virtual) |
| ignoreImports | RegExp[] | Regex patterns to skip specified SCSS imports.                               | []                  |
| virtualName   | string   | Custom name for the virtual SCSS bundle module.                              | virtual:scss-bundle |
| minify        | boolean  | Minifies the bundled SCSS code (without compiling to CSS).                   | false               |
| silent        | boolean  | Suppresses success, info, and warning messages. Errors will always be shown. | false               |

## 🗺️ Roadmap

- [] Add namespace support for @use and @forward.

## 🤝 Contributions

Explain how users can contribute to your library, typically:

Reporting bugs
Fixing bugs
Adding new features
Sharing on social media
Becoming an official contributor
Making a small donation

## 📜 License

Indicating the type of license for your project helps others know what they can and cannot do with it. You can find templates for all types of licenses here: <https://opensource.org/licenses>. Choose wisely, as this will determine how others can use your library.

In my case, I am developing open-source code and using the MIT license, which allows users to do almost anything with the code.

## 🙌 Footer

This is the closing section of your README. You can be creative here: introduce yourself, thank users for their interest, or ask them to give the project a star.
