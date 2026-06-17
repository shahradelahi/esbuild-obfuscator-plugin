<h1 align="center">
  <sup>esbuild-obfuscator-plugin</sup>
  <br>
  <a href="https://github.com/shahradelahi/esbuild-obfuscator-plugin/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/esbuild-obfuscator-plugin/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/esbuild-obfuscator-plugin"><img src="https://img.shields.io/npm/v/esbuild-obfuscator-plugin.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/esbuild-obfuscator-plugin"><img src="https://img.shields.io/bundlephobia/minzip/esbuild-obfuscator-plugin" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=esbuild-obfuscator-plugin"><img src="https://packagephobia.com/badge?p=esbuild-obfuscator-plugin" alt="Install Size"></a>
</h1>

_esbuild-obfuscator-plugin_ is an elegant and powerful JavaScript obfuscator plugin for esbuild, powered by [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install esbuild-obfuscator-plugin
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install esbuild-obfuscator-plugin
```

**yarn**

```bash
yarn add esbuild-obfuscator-plugin
```

</details>

## 📖 Usage

### Basic Usage

Automatically obfuscate source files matching JavaScript and TypeScript extensions.

```ts
import esbuild from 'esbuild';
import ObfuscatorPlugin from 'esbuild-obfuscator-plugin';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  plugins: [
    ObfuscatorPlugin({
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
});
```

### Obfuscate Output Files

Obfuscate generated output files on build completion instead of source files.

```ts
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  plugins: [
    ObfuscatorPlugin({
      obfuscateOutput: true,
      compact: true,
    }),
  ],
});
```

### File Filtering

Limit obfuscation to specific files using glob patterns or a custom function.

```ts
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  plugins: [
    ObfuscatorPlugin({
      filter: ['**/src/secret/**/*', '**/utils.ts'],
      compact: true,
    }),
  ],
});
```

Using a custom function:

```ts
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  plugins: [
    ObfuscatorPlugin({
      filter: (path) => path.endsWith('.ts'),
      compact: true,
    }),
  ],
});
```

### Code Injection

Inject additional code headers or banners into specific files.

```ts
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  plugins: [
    ObfuscatorPlugin({
      inject: {
        '**/index.ts': ['console.log("Injected header statement!");'],
      },
      compact: true,
    }),
  ],
});
```

## 📚 Documentation

For all obfuscation options, please see the [javascript-obfuscator documentation](https://github.com/javascript-obfuscator/javascript-obfuscator#options).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/esbuild-obfuscator-plugin).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/esbuild-obfuscator-plugin/graphs/contributors).
