import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { createPageIssueCollector, expectNoRuntimeErrors, gotoAndWaitForPage, localizedPages } from "./helpers";

for (const localizedPage of localizedPages) {
  test.describe(`${localizedPage.locale} accessibility`, () => {
    test(`passes automated WCAG checks on ${localizedPage.path}`, async ({ page }) => {
      const collector = createPageIssueCollector(page);

      await gotoAndWaitForPage(page, localizedPage.path);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "best-practice"])
        .disableRules(["color-contrast"])
        .analyze();

      expect(
        results.violations,
        results.violations.length > 0
          ? `Accessibility violations:\n${results.violations
              .map((v) => `[${v.impact}] ${v.id}: ${v.description}\n` + v.nodes.map((n) => `  → ${n.html}`).join("\n"))
              .join("\n\n")}`
          : "Expected no accessibility violations."
      ).toEqual([]);

      expectNoRuntimeErrors(collector);
    });
  });
}
