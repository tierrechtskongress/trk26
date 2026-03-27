import { expect, test } from "@playwright/test";

import {
  anchorIds,
  createPageIssueCollector,
  expectNoRuntimeErrors,
  gotoAndWaitForPage,
  localizedPages
} from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} internal links`, () => {
    test(`sticky jump nav lands on visible sections for ${localizedPage.path}`, async ({ page }) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, localizedPage.path);

      for (const anchorId of anchorIds) {
        const hash = `#${anchorId}`;
        const link = page.locator(`.site-sticky-nav .hero-jumpnav a[href="${hash}"]`);
        const target = page.locator(hash);

        await expect(link).toBeVisible();
        await expect(target).toBeVisible();

        await link.click();

        await page.waitForFunction((expectedHash) => window.location.hash === expectedHash, hash);
        await page.waitForTimeout(550);

        const metrics = await page.evaluate((selector) => {
          const stickyNav = document.querySelector(".site-sticky-nav");
          const targetElement = document.querySelector(selector);

          if (!stickyNav || !targetElement) {
            return null;
          }

          const stickyRect = stickyNav.getBoundingClientRect();
          const targetRect = targetElement.getBoundingClientRect();

          return {
            stickyBottom: stickyRect.bottom,
            targetTop: targetRect.top,
            targetBottom: targetRect.bottom,
            viewportHeight: window.innerHeight
          };
        }, hash);

        expect(metrics, `Expected target metrics for ${hash}.`).not.toBeNull();
        expect(
          metrics!.targetTop,
          `Expected ${hash} to sit below the sticky nav after jumping.`
        ).toBeGreaterThanOrEqual(metrics!.stickyBottom - 8);
        expect(metrics!.targetTop, `Expected ${hash} to be visible after jumping.`).toBeLessThan(
          metrics!.viewportHeight
        );
        expect(metrics!.targetBottom, `Expected ${hash} to have visible content after jumping.`).toBeGreaterThan(
          metrics!.stickyBottom
        );

        await expect(link).toHaveClass(/is-active/);
      }

      expectNoRuntimeErrors(collector);
    });
  });
}
