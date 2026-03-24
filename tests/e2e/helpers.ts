import { expect, Page, TestInfo } from "@playwright/test";

type PageIssueCollector = {
  consoleErrors: string[];
  pageErrors: string[];
};

export const localizedPages = [
  {
    locale: "de",
    path: "/",
    expectedTitle: "Tierrechtskongress Leipzig 2026 | Tierrechtskongress Leipzig"
  },
  {
    locale: "en",
    path: "/en/",
    expectedTitle: "Leipzig Animal Rights Congress 2026 | Leipzig Animal Rights Congress"
  }
] as const;

export const anchorIds = ["spenden", "programm", "rahmenprogramm", "fragen"] as const;
export const assetResourceTypes = new Set(["stylesheet", "script", "image", "font"]);

export function createPageIssueCollector(page: Page): PageIssueCollector {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }

    consoleErrors.push(message.text());
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  return { consoleErrors, pageErrors };
}

export async function gotoAndWaitForPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response, `Expected a navigation response for "${path}".`).not.toBeNull();
  expect(response?.ok(), `Expected "${path}" to load successfully.`).toBeTruthy();

  await page.waitForLoadState("networkidle");
  await page.locator(".site-sticky-nav").waitFor({ state: "visible" });
  await page.locator(".hero").waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  await page.evaluate(async () => {
    if ("fonts" in document) {
      const fonts = (document as Document & { fonts: FontFaceSet }).fonts;
      await fonts.load('700 1em "Cabin Local"');
      await fonts.load('800 1em "Cabin Local"');
      await fonts.ready;
    }

    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  });
}

export function expectNoRuntimeErrors(collector: PageIssueCollector) {
  expect(
    collector.consoleErrors,
    collector.consoleErrors.length > 0
      ? `Unexpected console errors:\n${collector.consoleErrors.join("\n")}`
      : "Expected no console errors."
  ).toEqual([]);

  expect(
    collector.pageErrors,
    collector.pageErrors.length > 0
      ? `Unexpected page errors:\n${collector.pageErrors.join("\n")}`
      : "Expected no page errors."
  ).toEqual([]);
}

export async function expectNoHorizontalOverflow(page: Page, testInfo: TestInfo) {
  const measurement = await page.evaluate(() => {
    const root = document.documentElement;
    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth
    };
  });

  expect(
    measurement.scrollWidth - measurement.clientWidth,
    `Expected no horizontal overflow in ${testInfo.project.name}.`
  ).toBeLessThanOrEqual(2);
}

export async function getRootRelativeAssetUrls(page: Page) {
  return page.evaluate(() => {
    const assetUrls = new Set<string>();

    const collect = (selector: string, attribute: "href" | "src") => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        const value = element.getAttribute(attribute);

        if (!value || !value.startsWith("/")) {
          return;
        }

        assetUrls.add(new URL(value, window.location.origin).toString());
      });
    };

    collect('link[rel="stylesheet"][href]', "href");
    collect("script[src]", "src");
    collect("img[src]", "src");

    return Array.from(assetUrls).sort();
  });
}

export async function getHeaderClip(page: Page) {
  const clip = await page.evaluate(() => {
    const nav = document.querySelector(".site-sticky-nav");
    const hero = document.querySelector(".hero");

    if (!nav || !hero) {
      return null;
    }

    const navRect = nav.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const left = Math.min(navRect.left, heroRect.left);
    const top = Math.min(navRect.top, heroRect.top);
    const right = Math.max(navRect.right, heroRect.right);
    const bottom = Math.max(navRect.bottom, heroRect.bottom);

    return {
      x: Math.max(0, Math.floor(left)),
      y: Math.max(0, Math.floor(top)),
      width: Math.ceil(right - left),
      height: Math.ceil(bottom - top)
    };
  });

  expect(clip, "Expected the sticky nav and hero header to be present.").not.toBeNull();
  return clip!;
}

export async function maskVolatileHeaderText(page: Page) {
  await page.addStyleTag({
    content: `
      .hero-copy h1,
      .hero-info-line .label,
      .hero-info-line .value,
      .hero-jumpnav .nav-label,
      .hero-jumpnav .nav-short,
      .language-switcher__link {
        color: transparent !important;
        text-shadow: none !important;
        -webkit-text-stroke: 0 transparent !important;
        text-decoration-color: transparent !important;
      }
    `
  });
}
