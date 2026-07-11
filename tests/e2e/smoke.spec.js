import { expect, test } from "@playwright/test";

const isIgnoredConsoleError = (text) =>
  text.startsWith("Button failed to load, iconName = ") && text.includes("layoutTraits = ");

const mockWebGl = async (page, mode) => {
  await page.addInitScript((webGlMode) => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const debugInfo = {
      UNMASKED_RENDERER_WEBGL: 0x9246,
      UNMASKED_VENDOR_WEBGL: 0x9245,
    };

    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (!["webgl2", "webgl", "experimental-webgl"].includes(type)) {
        return originalGetContext.call(this, type, ...args);
      }

      if (webGlMode === "unavailable") return null;

      return {
        RENDERER: 0x1f01,
        VENDOR: 0x1f00,
        getExtension(name) {
          if (name === "WEBGL_debug_renderer_info") return debugInfo;
          if (name === "WEBGL_lose_context") return { loseContext() {} };
          return null;
        },
        getParameter(parameter) {
          if (parameter === debugInfo.UNMASKED_RENDERER_WEBGL) return "Test Hardware GPU";
          if (parameter === debugInfo.UNMASKED_VENDOR_WEBGL) return "Test Hardware Vendor";
          return "";
        },
      };
    };
  }, mode);
};

const readHeroParallaxStyles = (page) =>
  page.locator("#hero").evaluate((hero) =>
    Array.from(hero.querySelectorAll('[class*="scroll-speed-"]')).map((element) => ({
      offset: element.style.getPropertyValue("--parallax-offset"),
      scale: element.style.getPropertyValue("--parallax-scale"),
    })),
  );

const setEffectsMode = async (page, mode) => {
  await page.addInitScript((effectsMode) => {
    localStorage.setItem("effects-mode", effectsMode);
  }, mode);
};

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

  await page.getByRole("button", { name: "светлая тема" }).click();
  await expect(root).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "en" }).click();
  await expect(root).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: /artem/i })).toBeVisible();
});

test("saved light theme is synchronized before Vue mounts", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
  });
  await page.goto("/");

  const root = page.locator("html");
  const themeToggle = page.getByRole("button", { name: "темная тема" });

  await expect(root).toHaveAttribute("data-theme", "light");
  await expect(themeToggle).toBeVisible();

  await themeToggle.click();
  await expect(root).toHaveAttribute("data-theme", "dark");
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
  const expectedSections = [
    "hero",
    "description",
    "about",
    "projects",
    "design",
    "creatives",
    "footer",
  ];

  await expect(dots).toHaveCount(expectedSections.length);
  for (const section of expectedSections) {
    await expect(sectionNav.getByRole("button", { name: section })).toBeVisible();
  }
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
  await page.getByRole("button", { name: "светлая тема" }).click();
  await expect(root).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "en" }).click();
  await expect(root).toHaveAttribute("lang", "en");
});

test("reduced motion disables enhanced effects", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/reduced-motion/);
  await expect(page.locator("html")).toHaveClass(/no-effects/);
  await expect(page.locator("html")).not.toHaveClass(/use-custom-cursor/);
  await expect(page.locator(".app-cursor")).toHaveCount(0);
  await expect(page.locator(".counter.odometer")).toHaveCount(0);
  await expect(page.locator(".design-active")).toHaveCount(0);

  const counter = page.locator(".counter").first();
  await expect(counter).toHaveCSS("animation-name", "none");
  await expect(counter).toHaveCSS("transition-property", "none");
  await expect(counter).toHaveCSS("transition-duration", "0s");

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => readHeroParallaxStyles(page))
    .toEqual([
      { offset: "", scale: "" },
      { offset: "", scale: "" },
    ]);
});

test("unavailable WebGL keeps Hero static and Design in its desktop grid", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWebGl(page, "unavailable");
  await page.goto("/");

  const root = page.locator("html");
  await expect(root).toHaveClass(/no-hw/);
  await expect(root).toHaveClass(/no-effects/);
  await expect(root).not.toHaveClass(/(?:^|\s)hw(?:\s|$)/);

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => readHeroParallaxStyles(page))
    .toEqual([
      { offset: "", scale: "" },
      { offset: "", scale: "" },
    ]);

  const designInner = page.locator("#design-inner");
  await expect(designInner).toHaveCSS("overflow-x", "hidden");

  const designMetrics = await designInner.evaluate((element) => {
    const section = element.closest("#design");
    const nextSection = section?.nextElementSibling;

    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      height: element.getBoundingClientRect().height,
      sectionBottom: section?.getBoundingClientRect().bottom,
      nextSectionTop: nextSection?.getBoundingClientRect().top,
      cards: Array.from(element.querySelectorAll("[data-design-name]")).map((card) => ({
        left: card.offsetLeft,
        top: card.offsetTop,
        width: card.clientWidth,
        height: card.clientHeight,
      })),
    };
  });
  expect(designMetrics.scrollWidth).toBeLessThanOrEqual(designMetrics.clientWidth + 1);
  expect(designMetrics.height).toBeGreaterThan(800);
  expect(designMetrics.nextSectionTop).toBeGreaterThanOrEqual(designMetrics.sectionBottom - 1);
  expect(designMetrics.cards.length).toBeGreaterThan(4);
  expect(new Set(designMetrics.cards.slice(0, 4).map((card) => card.left)).size).toBe(4);
  expect(designMetrics.cards[4].top).toBeGreaterThan(designMetrics.cards[0].top);
  expect(designMetrics.cards.every((card) => card.width === 320)).toBe(true);
  expect(designMetrics.cards.every((card) => card.height === 400)).toBe(true);
});

test("manual effects mode overrides browser capability detection", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWebGl(page, "unavailable");
  await setEffectsMode(page, "on");
  await page.goto("/");

  const root = page.locator("html");
  await expect(root).toHaveClass(/no-hw/);
  await expect(root).toHaveClass(/(?:^|\s)effects(?:\s|$)/);
  await expect(root).toHaveAttribute("data-effects-mode", "on");

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => readHeroParallaxStyles(page))
    .not.toEqual([
      { offset: "", scale: "" },
      { offset: "", scale: "" },
    ]);

  await expect(page.locator("#design-inner")).toHaveCSS("position", "sticky");
});

test("manual effects off overrides available hardware", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWebGl(page, "hardware");
  await setEffectsMode(page, "off");
  await page.goto("/");

  const root = page.locator("html");
  await expect(root).toHaveClass(/(?:^|\s)hw(?:\s|$)/);
  await expect(root).toHaveClass(/no-effects/);
  await expect(root).toHaveAttribute("data-effects-mode", "off");
  await expect(page.getByText(/Визуальные эффекты отключены/i)).toBeVisible();
  await expect(page.locator(".counter.odometer")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement, "::-webkit-scrollbar").display,
    ),
  ).not.toBe("none");

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect
    .poll(() => readHeroParallaxStyles(page))
    .toEqual([
      { offset: "", scale: "" },
      { offset: "", scale: "" },
    ]);
});

test("effects control persists explicit off and on modes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWebGl(page, "hardware");
  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-effects-mode", "auto");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement, "::-webkit-scrollbar").display,
    ),
  ).toBe("none");

  await page.locator("#design").evaluate((section) => {
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * 0.5);
  });

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: "эффекты: авто" }).click(),
  ]);

  await expect(page.locator("html")).toHaveClass(/no-effects/);
  await expect(page.locator("html")).toHaveAttribute("data-effects-mode", "off");
  await expect(page.getByRole("button", { name: "эффекты: выкл" })).toBeVisible();
  await expect
    .poll(() =>
      page.locator("#design").evaluate((section) => {
        const distance = section.offsetHeight - window.innerHeight;
        return distance > 0 ? (window.scrollY - section.offsetTop) / distance : 0;
      }),
    )
    .toBeCloseTo(0.5, 1);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: "эффекты: выкл" }).click(),
  ]);

  await expect(page.locator("html")).toHaveClass(/(?:^|\s)effects(?:\s|$)/);
  await expect(page.locator("html")).toHaveAttribute("data-effects-mode", "on");
  await expect(page.getByRole("button", { name: "эффекты: вкл" })).toBeVisible();
  await expect
    .poll(() =>
      page.locator("#design").evaluate((section) => {
        const distance = section.offsetHeight - window.innerHeight;
        return distance > 0 ? (window.scrollY - section.offsetTop) / distance : 0;
      }),
    )
    .toBeCloseTo(0.5, 1);
});

test("horizontal Design enhancement survives mobile to desktop resize", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockWebGl(page, "hardware");
  await page.goto("/");

  await expect(page.locator("html")).toHaveClass(/effects/);
  await expect(page.locator("#design-inner")).toHaveCSS("position", "relative");

  await page.setViewportSize({ width: 1280, height: 800 });

  await expect(page.locator("#design-inner")).toHaveCSS("position", "sticky");
  await expect(page.locator("#design-inner")).toHaveCSS("overflow-x", "visible");
  await expect
    .poll(() => page.locator("#design").evaluate((element) => element.style.height))
    .toMatch(/px$/);
});
