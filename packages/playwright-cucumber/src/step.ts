import type { PlaywrightTestArgs, expect } from "playwright/test";

export interface StepBody {
  (pw: PlaywrightTestArgs & { expect: typeof expect }, ...gherkinArgs: any[]): Promise<void> | void;
}

export interface StepDefinition {
  (stepPattern: string | RegExp, body: StepBody): void;
}

export class StepMap {
  private readonly map: Map<RegExp, StepBody>;

  constructor(entries?: readonly (readonly [RegExp, StepBody])[] | null) {
    this.map = new Map(entries);
  }

  set(stepPattern: RegExp | string, value: StepBody): this {
    this.map.set(new RegExp(stepPattern), value);

    return this;
  }

  get(stepText: string): { step: StepBody; args: string[] } | undefined {
    for (const [stepPattern, stepBody] of this.map.entries()) {
      const match = stepPattern.exec(stepText);

      if (match) {
        // match[0] is the entire match, the rest of the elements are the capture groups.
        const args = match.slice(1);

        return { step: stepBody, args };
      }
    }

    return undefined;
  }
}
