import { expect, test } from "@playwright/test";

import {
  anchorIds,
  createPageIssueCollector,
  expectNoHorizontalOverflow,
  expectNoRuntimeErrors,
  gotoAndWaitForPage,
  localizedPages
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

      for (const anchorId of anchorIds) {
        await expect(page.locator(`#${anchorId}`), `Expected #${anchorId} to exist.`).toHaveCount(1);
        await expect(
          page.locator(`.site-sticky-nav .hero-jumpnav a[href="#${anchorId}"]`),
          `Expected jump nav link for #${anchorId}.`
        ).toHaveCount(1);
      }

      await expectNoHorizontalOverflow(page, testInfo);
      expectNoRuntimeErrors(collector);
    });
  });
}
