import { expect, test } from "@playwright/test";

const isIgnoredConsoleError = (text) =>
  text.startsWith("Button failed to load, iconName = ") && text.includes("layoutTraits = ");

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/metrika/tag.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.ym = window.ym || function () {};",
    }),
  );
  await page.route("https://mc.yandex.ru/**", (route) =>
    route.fulfill({
      status: 204,
      body: "",
    }),
  );
});

test("loads core portfolio sections without console errors", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const text = message.text();
    if (!isIgnoredConsoleError(text)) consoleErrors.push(text);
  });

  await page.goto("/");

  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#design")).toBeVisible();
  await expect(page.locator("#creatives")).toBeVisible();
  await expect(page.locator("#footer")).toBeVisible();
  await expect(page.getByRole("heading", { name: /артем/i })).toBeVisible();

  expect(consoleErrors).toEqual([]);
});

test("theme and locale controls update the page", async ({ page }) => {
  await page.goto("/");

  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-theme", "dark");

  await page.locator("#theme-toggle").click();
  await expect(root).toHaveAttribute("data-theme", "light");

  await page.locator("#lang-toggle").click();
  await expect(root).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: /artem/i })).toBeVisible();
});

test("scroll to top returns from lower sections", async ({ page }) => {
  await page.goto("/");

  await page.locator("#footer").scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await page.locator("#scroll-to-top").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
});

test("section dot navigation targets the explicit section nav", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const sectionNav = page.locator("[data-section-nav]");
  const dots = sectionNav.locator("button.dot");

  await expect(dots).toHaveCount(6);
  await sectionNav.getByRole("button", { name: "projects" }).click();

  await expect.poll(() => page.evaluate(() => location.hash)).toBe("#projects");
  await expect(sectionNav.getByRole("button", { name: "projects" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("mobile viewport keeps core controls working", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator("#hero")).toBeVisible();

  for (const sectionId of ["#projects", "#design", "#creatives", "#footer"]) {
    await page.locator(sectionId).scrollIntoViewIfNeeded();
    await expect(page.locator(sectionId)).toBeVisible();
  }

  const root = page.locator("html");
  await page.locator("#theme-toggle").click();
  await expect(root).toHaveAttribute("data-theme", "light");

  await page.locator("#lang-toggle").click();
  await expect(root).toHaveAttribute("lang", "en");
});

test("reduced motion uses no-hardware fallback instead of custom cursor", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/no-hw/);
  await expect(page.locator("html")).not.toHaveClass(/use-custom-cursor/);
  await expect(page.locator(".app-cursor")).toHaveCount(0);
});
