import { promises as fs } from 'node:fs';
import esbuild from 'esbuild';
import { describe, expect, it } from 'vitest';

import ObfuscatorPlugin from '.';

describe('ObfuscatorPlugin', () => {
  it('should obfuscate source files', async () => {
    const inputPath = './test-temp-input.js';
    const outputPath = './test-temp-output.js';

    // Create temporary source file
    await fs.writeFile(inputPath, 'const hello = "world"; console.log(hello);');

    try {
      await esbuild.build({
        entryPoints: [inputPath],
        outfile: outputPath,
        bundle: true,
        plugins: [
          ObfuscatorPlugin({
            compact: true,
          }),
        ],
      });

      const outputCode = await fs.readFile(outputPath, 'utf8');
      expect(outputCode).not.toContain('const hello = "world"');
      expect(outputCode).toContain('_0x');
    } finally {
      // Clean up temporary files
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    }
  });
});
