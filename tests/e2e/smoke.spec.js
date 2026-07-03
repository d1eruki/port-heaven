import { expect, test } from "@playwright/test";

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
    if (message.type() === "error") consoleErrors.push(message.text());
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
