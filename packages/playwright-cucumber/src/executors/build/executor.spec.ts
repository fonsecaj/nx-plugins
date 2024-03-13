import { BuildExecutorSchema } from './schema';
import executor from './executor';

const options: BuildExecutorSchema = {
  featuresDir: 'example/src/features',
  stepsDir: 'example/src/steps',
  testsDir: 'example/src/tests',
};

describe('Build Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {} as any);
    expect(output.success).toBe(true);
  });
});
