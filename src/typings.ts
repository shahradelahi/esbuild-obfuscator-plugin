import { type ObfuscatorOptions } from 'javascript-obfuscator';

export interface ObfuscatorPluginOptions extends ObfuscatorOptions {
  /** Whether to obfuscate output files. Defaults to `false`. */
  obfuscateOutput?: boolean;
  /** A glob pattern or function that returns a boolean indicating whether the file should be obfuscated. Default behavior is to obfuscate all files. */
  filter?: ((path: string) => boolean) | string[];
  /** Inject additional code into file when obfuscating. */
  inject?: { [path: string]: string[] | string };
}
