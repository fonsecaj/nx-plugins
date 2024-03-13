/* eslint-disable @typescript-eslint/no-unused-vars */
import { globSync } from 'glob';
import { join } from 'path';
import { BuildExecutorSchema } from './schema';

import { ExecutorContext } from '@nx/devkit';
import { createGlobalSetupFile, createTestFiles } from './create-test-files';
import { parseGherkin } from './gherkin';


export default async function (options: BuildExecutorSchema, context: ExecutorContext) {
  const { sourceRoot, root } =
    context.projectsConfigurations.projects[context.projectName];

  const pwDir = join(root, sourceRoot);

  const { featuresDir, stepsDir, testsDir } = options;

  const featureFiles = globSync(join(featuresDir, '**/*.feature'));
  const stepFiles = globSync(join(stepsDir, '**/*.ts'));

  const gherkinDocuments = await Promise.all(featureFiles.map((file) => parseGherkin(file)));

  await createGlobalSetupFile(stepFiles, testsDir);
  await createTestFiles(gherkinDocuments, testsDir);

  return { success: true };
}
