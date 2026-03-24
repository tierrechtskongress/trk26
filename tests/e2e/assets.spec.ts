import { expect, test } from "@playwright/test";

import {
  assetResourceTypes,
  createPageIssueCollector,
  expectNoRuntimeErrors,
  getRootRelativeAssetUrls,
  gotoAndWaitForPage,
  localizedPages
} from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} asset integrity`, () => {
    test(`loads same-origin assets without failures on ${localizedPage.path}`, async ({ page, request }) => {
      const collector = createPageIssueCollector(page);
      const failedResponses: Array<{ status: number; type: string; url: string }> = [];
      const origin = new URL(test.info().project.use.baseURL as string).origin;

      page.on("response", (response) => {
        const requestInfo = response.request();
        const type = requestInfo.resourceType();

        if (!assetResourceTypes.has(type)) {
          return;
        }

        if (!response.url().startsWith(origin)) {
          return;
        }

        if (response.status() >= 400) {
          failedResponses.push({
            status: response.status(),
            type,
            url: response.url()
          });
        }
      });

      await gotoAndWaitForPage(page, localizedPage.path);

      const assetUrls = await getRootRelativeAssetUrls(page);
      expect(assetUrls.length, "Expected root-relative assets to be present in the rendered page.").toBeGreaterThan(0);

      const assetFailures: string[] = [];

      for (const assetUrl of assetUrls) {
        const response = await request.get(assetUrl);

        if (!response.ok()) {
          assetFailures.push(`${response.status()} ${assetUrl}`);
        }
      }

      expect(
        failedResponses,
        failedResponses.length > 0
          ? `Expected no same-origin asset request failures:\n${failedResponses
              .map((failure) => `${failure.status} ${failure.type} ${failure.url}`)
              .join("\n")}`
          : "Expected no same-origin asset request failures."
      ).toEqual([]);

      expect(
        assetFailures,
        assetFailures.length > 0
          ? `Expected all root-relative assets to return 2xx:\n${assetFailures.join("\n")}`
          : "Expected all root-relative assets to return 2xx."
      ).toEqual([]);

      expectNoRuntimeErrors(collector);
    });
  });
}
