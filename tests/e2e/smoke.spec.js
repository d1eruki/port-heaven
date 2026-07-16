import { expect, test } from "@playwright/test";

const ANALYTICS_CONSENT_STORAGE_KEY = "analytics-consent";
const ANALYTICS_TEST_BYPASS_KEY = "test-analytics-consent";
const METRIKA_SCRIPT_URL = "https://mc.yandex.ru/metrika/tag.js";

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

const readRootLayoutWidths = (page) =>
  page.evaluate(() => {
    const roots = [
      document.querySelector("#app"),
      document.querySelector("main"),
      ...document.querySelectorAll("[data-section]"),
    ].filter(Boolean);

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.clientWidth,
      elements: roots.map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          label: element.id || element.tagName.toLowerCase(),
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      }),
    };
  });

const expectRootLayoutFitsViewport = async (page) => {
  const layout = await readRootLayoutWidths(page);

  expect(layout.documentWidth).toBe(layout.viewportWidth);
  for (const element of layout.elements) {
    expect(element.left, `${element.label} left edge`).toBeGreaterThanOrEqual(-1);
    expect(element.right, `${element.label} right edge`).toBeLessThanOrEqual(
      layout.viewportWidth + 1,
    );
    expect(element.width, `${element.label} width`).toBeLessThanOrEqual(layout.viewportWidth + 1);
  }
};

const setEffectsMode = async (page, mode) => {
  await page.addInitScript((effectsMode) => {
    localStorage.setItem("effects-mode", effectsMode);
  }, mode);
};

const expectVideoEffectsMode = async (page, effectsOn) => {
  const video = page.locator("video");
  const attributeAssertion = effectsOn ? expect(video) : expect(video).not;

  await attributeAssertion.toHaveAttribute("autoplay", "");
  await attributeAssertion.toHaveAttribute("loop", "");
  await expect(video).toHaveAttribute("controls", "");

  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      video.evaluate((element) => ({
        hasSource: Boolean(element.currentSrc),
        paused: element.paused,
      })),
    )
    .toEqual({ hasSource: true, paused: !effectsOn });
};

const openAnalyticsConsent = async (page) => {
  await page.goto("/");
  await page.evaluate(
    ({ bypassKey, storageKey }) => {
      sessionStorage.setItem(bypassKey, "true");
      localStorage.removeItem(storageKey);
    },
    {
      bypassKey: ANALYTICS_TEST_BYPASS_KEY,
      storageKey: ANALYTICS_CONSENT_STORAGE_KEY,
    },
  );
  await page.reload();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ bypassKey, storageKey }) => {
      if (sessionStorage.getItem(bypassKey) !== "true") {
        localStorage.setItem(storageKey, "declined");
      }
    },
    {
      bypassKey: ANALYTICS_TEST_BYPASS_KEY,
      storageKey: ANALYTICS_CONSENT_STORAGE_KEY,
    },
  );

  await page.route(METRIKA_SCRIPT_URL, (route) =>
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

test("analytics starts only after consent and restores the accepted choice", async ({ page }) => {
  let scriptRequests = 0;
  page.on("request", (request) => {
    if (request.url() === METRIKA_SCRIPT_URL) scriptRequests += 1;
  });

  await openAnalyticsConsent(page);

  const notification = page.locator('[aria-labelledby="analytics-notification-title"]');
  await expect(notification).toBeVisible();
  expect(scriptRequests).toBe(0);

  await page.getByRole("button", { name: "разрешить аналитику" }).click();

  await expect(notification).toBeHidden();
  await expect.poll(() => scriptRequests).toBe(1);
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), ANALYTICS_CONSENT_STORAGE_KEY))
    .toBe("accepted");

  await page.reload();

  await expect(notification).toBeHidden();
  await expect.poll(() => scriptRequests).toBe(2);
});

test("declining analytics persists without loading Metrica", async ({ page }) => {
  let scriptRequests = 0;
  page.on("request", (request) => {
    if (request.url() === METRIKA_SCRIPT_URL) scriptRequests += 1;
  });

  await openAnalyticsConsent(page);

  const notification = page.locator('[aria-labelledby="analytics-notification-title"]');
  await expect(notification).toBeVisible();

  await page.getByRole("button", { name: "не разрешать" }).click();

  await expect(notification).toBeHidden();
  expect(scriptRequests).toBe(0);
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), ANALYTICS_CONSENT_STORAGE_KEY))
    .toBe("declined");

  await page.reload();

  await expect(notification).toBeHidden();
  expect(scriptRequests).toBe(0);
});

test("loads core portfolio sections without console errors", async ({ page }) => {
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const text = message.text();
    if (!isIgnoredConsoleError(text)) consoleErrors.push(text);
  });

  await page.goto("/");

  await expect(page.locator("main")).toHaveCount(1);
  const video = page.locator("video");
  await expect(video).not.toHaveAttribute("src", /.+/);
  await expect(video).toHaveAttribute("preload", "auto");

  await expect(page.locator('script[src^="script."]')).toHaveAttribute(
    "src",
    /^script\.[a-f0-9]+\.js$/,
  );
  await expect(page.locator('link[rel="stylesheet"][href^="style."]')).toHaveAttribute(
    "href",
    /^style\.[a-f0-9]+\.css$/,
  );
  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#design")).toBeVisible();
  await expect(page.locator("#creatives")).toBeVisible();
  await expect(page.locator("#pricing")).toBeVisible();
  await expect(page.locator("footer#footer")).toBeVisible();
  await expectRootLayoutFitsViewport(page);
  await expect(page.getByRole("heading", { name: /артем/i })).toBeVisible();
  await expect(
    page.locator("#about").getByRole("heading", { name: "Обо мне", level: 2 }),
  ).toHaveCount(1);
  await expect(
    page.locator("#design").getByRole("heading", { name: "Мобильный клиент Varwin", level: 3 }),
  ).toHaveCount(1);
  await expect(
    page.locator("#pricing").getByRole("heading", { name: "Цены", level: 2 }),
  ).toHaveCount(1);

  expect(consoleErrors).toEqual([]);
});

test("renders localized XRMS project statistics", async ({ page }) => {
  await page.goto("/");

  const statistics = page.locator("[data-project-statistics]");
  await expect(statistics.locator("li")).toHaveCount(3);
  await expect(statistics).toContainText(
    "Ускорено проектирование макетов за счёт использования готовых компонентов",
  );
  await expect(statistics).toContainText("Прототипы сократили количество правок");
  await expect(statistics).toContainText("Интерфейс стал визуально консистентным");
});

test("theme and locale controls update the page", async ({ page }) => {
  await page.goto("/");

  const root = page.locator("html");
  const heroImage = page.locator("#hero img");
  const defaultHeroImageSrc = await heroImage.getAttribute("src");

  await expect(root).toHaveAttribute("data-theme", "light");

  await heroImage.hover();
  await expect(heroImage).not.toHaveAttribute("src", defaultHeroImageSrc);

  await page.getByRole("button", { name: "темная тема" }).click();
  await expect(root).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "english" }).click();
  await expect(root).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle("port heaven space");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Design, interfaces, prototypes, motion, and other things I\smake\.$/,
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", "Preview");
  await expect(page.getByRole("heading", { name: /artem/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "русский" })).toBeVisible();
});

test("saved dark theme is synchronized before Vue mounts", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("theme", "dark");
  });
  await page.goto("/");

  const root = page.locator("html");
  const themeToggle = page.getByRole("button", { name: "светлая тема" });

  await expect(root).toHaveAttribute("data-theme", "dark");
  await expect(themeToggle).toBeVisible();

  await themeToggle.click();
  await expect(root).toHaveAttribute("data-theme", "light");
});

test("scroll to top returns from lower sections", async ({ page }) => {
  await page.goto("/");

  await page.locator("#footer").scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await page.locator("#scroll-to-top").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
});

test("section dot navigation targets the explicit section nav", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const sectionNav = page.locator("[data-section-nav]");
  const dots = sectionNav.locator("button.dot");
  const russianSectionLabels = [
    "главная",
    "дизайнер",
    "обо мне",
    "коммерческие проекты",
    "макеты",
    "креативы",
    "цены",
    "связь",
  ];
  const englishSectionLabels = [
    "home",
    "designer",
    "about me",
    "commercial projects",
    "layouts",
    "creatives",
    "pricing",
    "contact",
  ];

  await expect(page.getByRole("navigation", { name: "навигация по разделам" })).toBeVisible();
  await expect(dots).toHaveCount(russianSectionLabels.length);
  for (const label of russianSectionLabels) {
    await expect(sectionNav.getByRole("button", { name: label })).toBeVisible();
  }

  await page.getByRole("button", { name: "english" }).click();
  await expect(page.getByRole("navigation", { name: "section navigation" })).toBeVisible();
  for (const label of englishSectionLabels) {
    await expect(sectionNav.getByRole("button", { name: label })).toBeVisible();
  }

  await sectionNav.getByRole("button", { name: "commercial projects" }).click();

  await expect.poll(() => page.evaluate(() => location.hash)).toBe("#projects");
  await expect(sectionNav.getByRole("button", { name: "commercial projects" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);

  await sectionNav.getByRole("button", { name: "contact" }).click();
  await expect.poll(() => page.evaluate(() => location.hash)).toBe("#footer");
  await expect(sectionNav.getByRole("button", { name: "contact" })).toHaveAttribute(
    "aria-current",
    "true",
  );
});

test("mobile viewport keeps core controls working", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const hero = page.locator("#hero");
  const heroHeading = hero.getByRole("heading", { name: /артем/i });
  const root = page.locator("html");

  await expect(hero).toBeVisible();
  await expect(heroHeading).toBeVisible();
  await expect(hero.locator("img")).toBeVisible();
  await expectRootLayoutFitsViewport(page);

  await page.getByRole("button", { name: "темная тема" }).click();
  await expect(root).toHaveAttribute("data-theme", "dark");

  for (const sectionId of ["#projects", "#design", "#creatives", "#pricing", "#footer"]) {
    await page.locator(sectionId).scrollIntoViewIfNeeded();
    await expect(page.locator(sectionId)).toBeVisible();
  }

  await page.getByRole("button", { name: "светлая тема" }).click();
  await expect(root).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "english" }).click();
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

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => readHeroParallaxStyles(page)).toEqual([{ offset: "", scale: "" }]);

  await expectVideoEffectsMode(page, false);
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
  await expect.poll(() => readHeroParallaxStyles(page)).toEqual([{ offset: "", scale: "" }]);

  const designMetrics = await page.locator("#design-inner").evaluate((element) => {
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
  expect(designMetrics.height).toBeGreaterThan(0);
  expect(designMetrics.nextSectionTop).toBeGreaterThanOrEqual(designMetrics.sectionBottom - 1);
  expect(designMetrics.cards.length).toBeGreaterThan(1);
  expect(new Set(designMetrics.cards.map((card) => card.left)).size).toBeGreaterThan(1);
  expect(new Set(designMetrics.cards.map((card) => card.top)).size).toBeGreaterThan(1);
  expect(
    designMetrics.cards.every(
      (card) =>
        card.width > 0 &&
        card.height > 0 &&
        card.left >= 0 &&
        card.left + card.width <= designMetrics.clientWidth + 1,
    ),
  ).toBe(true);
  await expectVideoEffectsMode(page, false);
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
  await expect.poll(() => readHeroParallaxStyles(page)).not.toEqual([{ offset: "", scale: "" }]);

  await expectVideoEffectsMode(page, true);
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

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => readHeroParallaxStyles(page)).toEqual([{ offset: "", scale: "" }]);
  await expectVideoEffectsMode(page, false);
});

test("effects control persists explicit off and on modes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await mockWebGl(page, "hardware");
  await page.goto("/");

  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-effects-mode", "auto");
  const effectsInitiallyOn = await root.evaluate((element) =>
    element.classList.contains("effects"),
  );
  const firstAction = effectsInitiallyOn ? "выключить эффекты" : "включить эффекты";
  const secondAction = effectsInitiallyOn ? "включить эффекты" : "выключить эффекты";
  const firstMode = effectsInitiallyOn ? "off" : "on";
  const secondMode = effectsInitiallyOn ? "on" : "off";
  await expect(page.getByRole("button", { name: firstAction })).toBeVisible();

  await page.locator("#design").evaluate((section) => {
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * 0.5);
  });

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: firstAction }).click(),
  ]);

  await expect(root).toHaveAttribute("data-effects-mode", firstMode);
  await expect(page.getByRole("button", { name: secondAction })).toBeVisible();
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
    page.getByRole("button", { name: secondAction }).click(),
  ]);

  await expect(root).toHaveAttribute("data-effects-mode", secondMode);
  await expect(page.getByRole("button", { name: firstAction })).toBeVisible();
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
  await expectRootLayoutFitsViewport(page);

  await page.setViewportSize({ width: 1280, height: 800 });

  await expect
    .poll(() =>
      page.locator("#design").evaluate((element) => element.offsetHeight > window.innerHeight),
    )
    .toBe(true);
  await expect(page.locator("#design-inner")).toBeVisible();
  await expectRootLayoutFitsViewport(page);
});
