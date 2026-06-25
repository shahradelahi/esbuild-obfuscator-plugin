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

  it('should obfuscate only filtered files matching glob patterns', async () => {
    const matchedInputPath = './test-matched.js';
    const plainInputPath = './test-plain.js';
    const matchedOutputPath = './test-matched-out.js';
    const plainOutputPath = './test-plain-out.js';

    await fs.writeFile(matchedInputPath, 'const matched = "obfuscate-me"; console.log(matched);');
    await fs.writeFile(
      plainInputPath,
      'const unmatched = "keep-me-plain"; console.log(unmatched);'
    );

    try {
      // Build matched file
      await esbuild.build({
        entryPoints: [matchedInputPath],
        outfile: matchedOutputPath,
        bundle: true,
        plugins: [
          ObfuscatorPlugin({
            compact: true,
            filter: ['**/*matched.js'],
          }),
        ],
      });

      // Build unmatched file
      await esbuild.build({
        entryPoints: [plainInputPath],
        outfile: plainOutputPath,
        bundle: true,
        plugins: [
          ObfuscatorPlugin({
            compact: true,
            filter: ['**/*matched.js'],
          }),
        ],
      });

      const matchedOutput = await fs.readFile(matchedOutputPath, 'utf8');
      const plainOutput = await fs.readFile(plainOutputPath, 'utf8');

      // The matched file should be obfuscated
      expect(matchedOutput).not.toContain('const matched = "obfuscate-me"');
      expect(matchedOutput).toContain('_0x');

      // The plain file should NOT be obfuscated
      expect(plainOutput).toContain('unmatched = "keep-me-plain"');
      expect(plainOutput).not.toContain('_0x');
    } finally {
      await fs.unlink(matchedInputPath).catch(() => {});
      await fs.unlink(plainInputPath).catch(() => {});
      await fs.unlink(matchedOutputPath).catch(() => {});
      await fs.unlink(plainOutputPath).catch(() => {});
    }
  });
});
