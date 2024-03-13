import { When } from "@nx-plugins/playwright-cucumber";

When(/I enter my credentials/, async ({ page }) => {
  await page.getByTestId('input').fill('John Doe');
});
