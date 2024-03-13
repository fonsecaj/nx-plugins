import { Given, Then, When } from "@nx-plugins/playwright-cucumber";

Given("I am on the Github home page", async ({ page }) => {
  await page.goto('/');
});

When(/I go to the "([^"]+)" page/, async ({ page }, path: string) => {
  await page.goto(`${path}`);
});

Then(/I should read "([^"]+)" heading/, async ({ page, expect }, text: string) => {
  await expect(page.getByRole('heading', { name: text })).toBeVisible();
});
