import { expect, test } from "@playwright/test";

import {
  createPageIssueCollector,
  expectNoHorizontalOverflow,
  expectNoRuntimeErrors,
  gotoAndWaitForPage,
  localizedPages,
  navPages
} from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} smoke`, () => {
    test(`renders core page structure on ${localizedPage.path}`, async ({ page }, testInfo) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, localizedPage.path);

      await expect(page).toHaveTitle(localizedPage.expectedTitle);
      await expect(page.locator(".hero h1")).toBeVisible();
      await expect(page.locator(".hero img")).toBeVisible();
      await expect(page.locator(".site-sticky-nav .hero-jumpnav")).toBeVisible();
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator(".language-switcher")).toBeVisible();

      for (const path of navPages[localizedPage.locale]) {
        await expect(
          page.locator(`.site-sticky-nav .hero-jumpnav a[href="${path}"]`),
          `Expected nav link to ${path}.`
        ).toHaveCount(1);
      }

      await expectNoHorizontalOverflow(page, testInfo);
      expectNoRuntimeErrors(collector);
    });
  });
}
