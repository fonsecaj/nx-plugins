import type { Pickle } from "@cucumber/messages";
import type { APIRequestContext, BrowserContext, Page } from "playwright";
import type { Expect } from "playwright/test";

import { StepMap } from "./step";

export interface PickleLoaderConfig {
  page: Page;
  context: BrowserContext;
  request: APIRequestContext;
  expect: Expect;
  pickle: Pickle;
}

export class PickleLoader {
  static readonly steps = new StepMap();

  public readonly pickle: Pickle;

  public readonly page: Page;

  public readonly context: BrowserContext;

  public readonly request: APIRequestContext;

  public readonly expect: Expect;

  constructor({ page, context, request, expect, pickle }: PickleLoaderConfig) {
    if (!pickle) throw new Error(`Pickle not found.`);

    this.pickle = pickle;
    this.page = page;
    this.context = context;
    this.request = request;
    this.expect = expect;
  }

  async load(): Promise<void> {
    for (const step of this.pickle.steps) {
      const stepText = step.text;

      const { args, step: stepBody } = PickleLoader.steps.get(stepText) ?? { args: [], step: undefined};

      if (!stepBody) throw new Error(`Step not found: ${stepText}`);

      await stepBody({ page: this.page, context: this.context, request: this.request, expect: this.expect }, ...args);
    }
  }
}