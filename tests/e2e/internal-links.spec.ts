import { expect, test } from "@playwright/test";

import {
  createPageIssueCollector,
  expectNoRuntimeErrors,
  gotoAndWaitForPage,
  localizedPages,
  navPages
} from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} internal links`, () => {
    test(`main nav leads to every subpage from ${localizedPage.path}`, async ({ page }) => {
      const collector = createPageIssueCollector(page);

      for (const path of navPages[localizedPage.locale]) {
        await gotoAndWaitForPage(page, localizedPage.path);

        const link = page.locator(`.site-sticky-nav .hero-jumpnav a[href="${path}"]`);

        await expect(link).toBeVisible();
        await link.click();

        await page.waitForURL(`**${path}`);
        await expect(page.locator("main#main .page-shell")).toBeVisible();
        await expect(page.locator(".hero")).toBeVisible();
      }

      expectNoRuntimeErrors(collector);
    });

    test(`home button returns to ${localizedPage.path}`, async ({ page }) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, navPages[localizedPage.locale][0]);
      await page.locator(".site-sticky-nav .home-link").click();

      await expect.poll(() => new URL(page.url()).pathname).toBe(localizedPage.path);

      expectNoRuntimeErrors(collector);
    });
  });
}
