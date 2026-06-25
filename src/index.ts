import { promises } from 'node:fs';
import { isAbsolute, relative } from 'node:path';
import { isMatch as globIsMatch } from '@se-oss/glob';
import { transform, type Loader, type Plugin } from 'esbuild';
import JavaScriptObfuscator from 'javascript-obfuscator';

import type { ObfuscatorPluginOptions } from './typings';

export type * from './typings';

export default function ObfuscatorPlugin(options: ObfuscatorPluginOptions): Plugin {
  const { obfuscateOutput = false, filter = [], ...obfuscateOptions } = options;
  return {
    name: 'obfuscator',
    setup: (build) => {
      function shouldObfuscate(path: string) {
        if (typeof filter === 'function') {
          return filter(path);
        } else if (Array.isArray(filter) && filter.length > 0) {
          return isMatch(path, filter);
        }
        return true;
      }

      if (obfuscateOutput) {
        build.initialOptions.write = false;
        return build.onEnd(async ({ outputFiles, errors }) => {
          if (!errors.length && outputFiles?.length) {
            for (const output of outputFiles) {
              if (!shouldObfuscate(output.path)) return;

              const obfuscatedCode = JavaScriptObfuscator.obfuscate(
                output.text,
                obfuscateOptions
              ).getObfuscatedCode();

              await promises.writeFile(output.path, obfuscatedCode);
            }
          }
        });
      }

      build.onLoad(
        {
          filter: /\.([cm]?[jt]sx?)$/i,
        },
        async (args) => {
          if (!shouldObfuscate(args.path)) return;

          // Use file extension as loader
          const extension = args.path
            .split('.')
            .pop()
            ?.match(/([jt]sx?)$/i);
          if (!extension) {
            throw new Error(`Could not determine loader for ${args.path}`);
          }
          const loader = extension[1]?.toLowerCase() as Loader;

          const toInject: string[] = [];
          if (options.inject) {
            for (const path of Object.keys(options.inject)) {
              if (isMatch(args.path, path) && options.inject[path]) {
                toInject.push(
                  typeof options.inject[path] === 'string'
                    ? options.inject[path]
                    : options.inject[path].join('\n')
                );
              }
            }
          }

          // If it's a TypeScript file, transpile it to JavaScript using esbuild
          const result = await transform(await promises.readFile(args.path, 'utf8'), {
            loader,
            banner: toInject.join('\n'),
            sourcemap: false,
          });

          const obfuscatedCode = JavaScriptObfuscator.obfuscate(
            result.code,
            options
          ).getObfuscatedCode();

          return {
            contents: obfuscatedCode,
            loader,
          };
        }
      );
    },
  };
}

function isMatch(path: string, pattern: string | string[]) {
  const normalizedPath = isAbsolute(path) ? relative(process.cwd(), path) : path;
  return globIsMatch(normalizedPath, pattern, { basename: true });
}
