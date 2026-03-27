import { expect, test } from "@playwright/test";

import { createPageIssueCollector, expectNoRuntimeErrors, gotoAndWaitForPage, localizedPages } from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} production smoke`, () => {
    test(`renders core structure on ${localizedPage.path}`, async ({ page }) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, localizedPage.path, {
        retries: 5,
        retryDelayMs: 3_000
      });

      await expect(page).toHaveTitle(localizedPage.expectedTitle);
      await expect(page.locator(".hero")).toBeVisible();
      await expect(page.locator(".site-sticky-nav")).toBeVisible();
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator(".language-switcher")).toBeVisible();

      expectNoRuntimeErrors(collector);
    });
  });
}
