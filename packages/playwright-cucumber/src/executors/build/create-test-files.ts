/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as swc from '@swc/core';
import * as esbuild from 'esbuild';
import { writeFile, writeFileSync } from 'fs-extra';
import { join, relative } from 'path';

import type { GherkinDocumentWithPickles } from "./gherkin";

export async function createGlobalSetupFile(stepFiles: string[], testsDir: string): Promise<void> {
  const entrypointContent = `
    ${stepFiles.map(file => `import '${relative(testsDir, file)}';`).join('\n')}

    export default function () {}
  `;

  const stepsPath = join(testsDir, 'steps.js');

  const output = swc.transformSync(entrypointContent, {
    filename: stepsPath,
    sourceMaps: false,
    jsc: {
      target: 'es2022'
    },
  });

  writeFileSync(stepsPath, output!.code!);

  await esbuild.build({
    entryPoints: [stepsPath],
    outdir: testsDir,
    bundle: true,
    format: 'cjs',
    platform: 'node',
    sourcemap: false,
    minify: true,
    external: ['@playwright/test', 'playwright', '@nx-plugins/playwright-cucumber'],
    allowOverwrite: true,
  });
}

export async function createTestFiles(gherkinDocuments: GherkinDocumentWithPickles[], testsDir: string): Promise<void> {
  for (const gherkinDocument of gherkinDocuments) {
    const code = `
      import { test, expect } from '@playwright/test';
      import { PickleLoader } from '@nx-plugins/playwright-cucumber';

      import './steps';

      ${gherkinDocument.pickles.map(pickle => {
        return `
          test('${pickle.name}', async ({ page, context, request }) => {
            const pickle = ${JSON.stringify(pickle)};
            const loader = new PickleLoader({ page, context, request, expect, pickle });

            await loader.load();
          });
        `;
      }).join('')}
    `;

    const output = swc.transformSync(code, {
      filename: 'tests.js',
      sourceMaps: false,
      jsc: {
        target: 'es2022'
      },
    });


    const filePath = `${testsDir}/${gherkinDocument.uri!.split('/').pop()!.replace('.feature', '.spec.js')}`;

    await writeFile(filePath, output!.code!);
  }
}
