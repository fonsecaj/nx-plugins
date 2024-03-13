import { PickleLoader } from "./pickle-loader";
import type { StepBody } from "./step";

export const When = (pattern: string | RegExp, body: StepBody) => {
  PickleLoader.steps.set(pattern, body);
};

export const Given = When;

export const Then = When;