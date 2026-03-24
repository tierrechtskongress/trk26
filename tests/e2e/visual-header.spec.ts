import { expect, test } from "@playwright/test";

import {
  createPageIssueCollector,
  expectNoRuntimeErrors,
  getHeaderClip,
  gotoAndWaitForPage,
  localizedPages
} from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} header visuals`, () => {
    test(`matches the stable header snapshot for ${localizedPage.path}`, async ({ page }, testInfo) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, localizedPage.path);

      const clip = await getHeaderClip(page);
      const image = await page.screenshot({
        animations: "disabled",
        clip
      });

      expect(image).toMatchSnapshot(`${localizedPage.locale}-header-${testInfo.project.name}.png`, {
        maxDiffPixelRatio: 0.004,
        threshold: 0.22
      });
      expectNoRuntimeErrors(collector);
    });
  });
}
