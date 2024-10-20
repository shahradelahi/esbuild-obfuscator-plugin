import { promises } from 'node:fs';
import { type Plugin } from 'esbuild';
import JavaScriptObfuscator, { type ObfuscatorOptions } from 'javascript-obfuscator';
import MicroMatch from 'micromatch';

export interface ObfuscatorPluginOptions extends ObfuscatorOptions {
  filter?: (path: string) => boolean | string[];
}

export default function ObfuscatorPlugin(options: ObfuscatorPluginOptions): Plugin {
  const { obfuscateOutput = false, filter = [], ...obfuscateOptions } = options;
  return {
    name: 'obfuscator',
    setup: (build) => {
      build.initialOptions.write = false;
      return build.onEnd(async ({ outputFiles, errors }) => {
        if (!errors.length && outputFiles?.length) {
          for (const output of outputFiles) {
            const shouldObfuscate =
              typeof filter === 'function'
                ? filter(output.path)
                : MicroMatch.isMatch(output.path, filter);

            if (!shouldObfuscate) return;

            const obfuscatedCode = JavaScriptObfuscator.obfuscate(
              output.text,
              obfuscateOptions
            ).getObfuscatedCode();

            await promises.writeFile(output.path, obfuscatedCode);
          }
        }
      });
    },
  };
}
