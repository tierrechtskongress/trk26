import { expect, test } from "@playwright/test";

import {
  auditExternalUrls,
  createPageIssueCollector,
  expectNoRuntimeErrors,
  getExternalHttpUrls,
  gotoAndWaitForPage,
  localizedPages
} from "./helpers";

test.describe("external link audit", () => {
  test("rendered external links respond without persistent hard failures", async ({ page, request }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "External link audit runs once per suite.");

    const collector = createPageIssueCollector(page);
    const externalUrls = new Set<string>();

    for (const localizedPage of localizedPages) {
      await gotoAndWaitForPage(page, localizedPage.path);

      for (const url of await getExternalHttpUrls(page)) {
        externalUrls.add(url);
      }
    }

    const urls = Array.from(externalUrls).sort();
    expect(urls.length, "Expected at least one rendered external link to audit.").toBeGreaterThan(0);

    const result = await auditExternalUrls(async (url) => {
      const response = await request.get(url, {
        failOnStatusCode: false,
        maxRedirects: 10,
        timeout: 15_000
      });

      return {
        ok: response.ok(),
        status: response.status(),
        statusText: response.statusText()
      };
    }, urls);

    if (result.transientFailures.length > 0) {
      await testInfo.attach("external-link-transient-failures.txt", {
        body: result.transientFailures.join("\n"),
        contentType: "text/plain"
      });
    }

    expect(
      result.hardFailures,
      result.hardFailures.length > 0
        ? `Expected external links to avoid persistent hard failures:\n${result.hardFailures.join("\n")}`
        : "Expected external links to avoid persistent hard failures."
    ).toEqual([]);

    expectNoRuntimeErrors(collector);
  });
});
