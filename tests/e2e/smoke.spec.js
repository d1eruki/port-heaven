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

const readHeroParallaxOffset = (page) =>
  page.locator("[data-hero-parallax]").evaluate((element) => {
    const imageBounds = element.getBoundingClientRect();
    const heroBounds = element.closest("#hero").getBoundingClientRect();

    return imageBounds.top - heroBounds.top;
  });

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

const readSectionVisualProgress = (section) =>
  section.evaluate((element) => {
    const distance = element.offsetHeight - window.innerHeight;
    return distance > 0 ? -element.getBoundingClientRect().top / distance : 0;
  });

const positionBeforeSecondProject = async (page) => {
  const metrics = await page.evaluate(() => {
    const project = document.querySelectorAll("[data-project-snap]")[1];
    if (!project) return null;

    const target = Math.round(project.getBoundingClientRect().top + window.scrollY);
    const start = target - 100;
    window.scrollTo(0, start);

    return { start, target };
  });

  expect(metrics).not.toBeNull();
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(metrics.start);

  return metrics;
};

const scrollAndWaitForScrollToSettle = async (page) => {
  let previousY;
  let settledY = 0;
  let stableSamples = 0;

  await page.evaluate(() => window.scrollBy(0, 20));
  await expect
    .poll(
      async () => {
        const currentY = await page.evaluate(() => Math.round(window.scrollY));
        stableSamples =
          previousY !== undefined && Math.abs(currentY - previousY) <= 1 ? stableSamples + 1 : 0;
        previousY = currentY;
        settledY = currentY;
        return stableSamples;
      },
      { intervals: [100], timeout: 5_000 },
    )
    .toBeGreaterThanOrEqual(4);

  return settledY;
};

const expectVideoEffectsMode = async (page, effectsOn) => {
  const video = page.locator("video");
  const attributeAssertion = effectsOn ? expect(video) : expect(video).not;

  await attributeAssertion.toHaveAttribute("autoplay", "");
  await attributeAssertion.toHaveAttribute("loop", "");
  await expect(video).toHaveAttribute("controls", "");

  await video.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    let documentTop = 0;
    let current = element;

    while (current) {
      documentTop += current.offsetTop;
      current = current.offsetParent;
    }

    const centeredTop = documentTop - (window.innerHeight - bounds.height) / 2;
    window.scrollTo(0, Math.max(0, centeredTop));
  });

  await expect
    .poll(() =>
      video.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      }),
    )
    .toBe(true);

  await expect(video).toHaveAttribute("src", /.+/);
  await expect.poll(() => video.evaluate((element) => Boolean(element.currentSrc))).toBe(true);
  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(!effectsOn);
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

  const hero = page.locator("#hero");

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await expect(page.locator("#footer")).toBeInViewport();

  await page.locator("#scroll-to-top").click();
  await expect(hero).toBeInViewport({ timeout: 10_000 });
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
    "обо мне",
    "коммерческие проекты",
    "макеты",
    "креативы",
    "цены",
    "связь",
  ];
  const englishSectionLabels = [
    "home",
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

test("project cards snap only in enhanced desktop mode", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile-safari", "Mobile WebKit has no mouse wheel API");

  await page.addInitScript(() => localStorage.removeItem("scroll-position"));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("effects-mode", "on"));
  await page.reload();

  const root = page.locator("html");
  await expect(root).toHaveClass(/(?:^|\s)effects(?:\s|$)/);

  const desktop = await positionBeforeSecondProject(page);
  const desktopY = await scrollAndWaitForScrollToSettle(page);
  expect(Math.abs(desktopY - desktop.target)).toBeLessThan(50);

  const projectPanel = page.locator("[data-project-panel]");
  await page.evaluate(() => {
    const projects = document.querySelector("#projects");
    window.scrollTo(0, projects.offsetTop + 400);
  });
  await expect
    .poll(() => projectPanel.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThan(10);

  const designSection = page.locator("#design");
  const designInner = page.locator("#design-inner");
  const designMetrics = await page.evaluate(() => {
    const design = document.querySelector("#design");
    const inner = document.querySelector("#design-inner");
    const distance = inner.scrollWidth - inner.parentElement.clientWidth;
    window.scrollTo(0, design.offsetTop);
    return {
      start: design.offsetTop,
      step: Math.min(400, distance / 4),
    };
  });
  await expect
    .poll(() => designSection.evaluate((element) => Math.abs(element.getBoundingClientRect().top)))
    .toBeLessThan(2);
  const initialDesignLeft = await designInner.evaluate(
    (element) => element.getBoundingClientRect().left,
  );
  await page.evaluate(({ start, step }) => window.scrollTo(0, start + step), designMetrics);
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)))
    .toBe(Math.round(designMetrics.start + designMetrics.step));
  await expect
    .poll(async () => {
      const currentLeft = await designInner.evaluate(
        (element) => element.getBoundingClientRect().left,
      );
      return initialDesignLeft - currentLeft;
    })
    .toBeGreaterThan(20);

  await page.evaluate(() => {
    const inner = document.querySelector("#design-inner");
    const design = document.querySelector("#design");
    const distance = inner.scrollWidth - inner.parentElement.clientWidth;
    window.scrollTo(0, design.offsetTop + distance);
  });
  await expect
    .poll(() =>
      designInner
        .locator("[data-design-name]")
        .last()
        .evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= window.innerWidth;
        }),
    )
    .toBe(true);

  const creativeHeading = page.locator("[data-creatives-heading-pin]");
  await page.evaluate(() => {
    const creatives = document.querySelector("#creatives");
    window.scrollTo(0, creatives.offsetTop + 400);
  });
  await expect
    .poll(() =>
      creativeHeading.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
      }),
    )
    .toBe(true);

  await page.evaluate(() => localStorage.setItem("effects-mode", "off"));
  await page.reload();
  await expect(root).toHaveClass(/no-effects/);

  const noEffects = await positionBeforeSecondProject(page);
  const noEffectsY = await scrollAndWaitForScrollToSettle(page);
  expect(noEffectsY).toBeGreaterThan(noEffects.start);
  expect(Math.abs(noEffectsY - noEffects.target)).toBeGreaterThan(60);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => localStorage.setItem("effects-mode", "on"));
  await page.reload();
  await expect(root).toHaveClass(/(?:^|\s)effects(?:\s|$)/);

  const mobile = await positionBeforeSecondProject(page);
  const mobileY = await scrollAndWaitForScrollToSettle(page);
  expect(mobileY).toBeGreaterThan(mobile.start);
  expect(Math.abs(mobileY - mobile.target)).toBeGreaterThan(60);
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
  await expect(page.locator(".design-active")).toHaveCount(0);
  await expect(page.locator("#about [data-about-feature]").nth(0)).toContainText("2+");
  await expect(page.locator("#about [data-about-feature]").nth(1)).toContainText("10+");
  await expect(page.locator("#about [data-about-feature]").nth(2)).toContainText("50/50");

  const heroOffset = await readHeroParallaxOffset(page);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(500);
  expect(await readHeroParallaxOffset(page)).toBeCloseTo(heroOffset, 0);

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

  const heroOffset = await readHeroParallaxOffset(page);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(500);
  expect(await readHeroParallaxOffset(page)).toBeCloseTo(heroOffset, 0);

  const designMetrics = await page.locator("#design-inner").evaluate((element) => {
    const section = element.closest("#design");
    const nextSection = section?.nextElementSibling;
    const viewport = element.closest("#design-viewport");
    const bounds = element.getBoundingClientRect();
    const viewportStyles = viewport ? getComputedStyle(viewport) : null;

    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      left: bounds.left,
      right: bounds.right,
      height: bounds.height,
      sectionBottom: section?.getBoundingClientRect().bottom,
      nextSectionTop: nextSection?.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
      viewportPaddingTop: viewportStyles ? parseFloat(viewportStyles.paddingTop) : 0,
      cards: Array.from(element.querySelectorAll("[data-design-name]")).map((card) => {
        const cardBounds = card.getBoundingClientRect();

        return {
          left: cardBounds.left,
          right: cardBounds.right,
          top: cardBounds.top,
          width: cardBounds.width,
          height: cardBounds.height,
        };
      }),
    };
  });
  expect(designMetrics.scrollWidth).toBeLessThanOrEqual(designMetrics.clientWidth + 1);
  expect(designMetrics.height).toBeGreaterThan(0);
  expect(designMetrics.nextSectionTop).toBeGreaterThanOrEqual(designMetrics.sectionBottom - 1);
  expect(designMetrics.cards.length).toBeGreaterThan(1);
  expect(new Set(designMetrics.cards.map((card) => card.left)).size).toBeGreaterThan(1);
  expect(new Set(designMetrics.cards.map((card) => card.top)).size).toBeGreaterThan(1);
  const rowTops = [...new Set(designMetrics.cards.map((card) => card.top))].sort(
    (first, second) => first - second,
  );
  expect(rowTops.length).toBeGreaterThan(2);
  expect(rowTops[2] - rowTops[0]).toBeCloseTo(
    designMetrics.viewportHeight - designMetrics.viewportPaddingTop,
    0,
  );
  expect(
    designMetrics.cards.every(
      (card) =>
        card.width > 0 &&
        card.height > 0 &&
        card.left >= designMetrics.left - 1 &&
        card.right <= designMetrics.right + 1,
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

  const heroOffset = await readHeroParallaxOffset(page);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => readHeroParallaxOffset(page)).toBeGreaterThan(heroOffset + 100);

  const designLayout = await page.locator("#design-inner").evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    const columnRights = new Map();

    for (const child of element.children) {
      const childBounds = child.getBoundingClientRect();
      columnRights.set(Math.round(childBounds.left), childBounds.right);
    }

    return {
      right: bounds.right,
      firstFourColumnRights: Array.from(columnRights.values()).slice(0, 4),
    };
  });

  expect(designLayout.firstFourColumnRights).toHaveLength(4);
  expect(designLayout.firstFourColumnRights.every((right) => right <= designLayout.right + 1)).toBe(
    true,
  );

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

  const heroOffset = await readHeroParallaxOffset(page);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(500);
  expect(await readHeroParallaxOffset(page)).toBeCloseTo(heroOffset, 0);
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

  const designSection = page.locator("#design");

  await designSection.evaluate((section) => {
    window.scrollTo(0, section.offsetTop + (section.offsetHeight - window.innerHeight) * 0.5);
  });
  await expect.poll(() => readSectionVisualProgress(designSection)).toBeCloseTo(0.5, 1);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: firstAction }).click(),
  ]);

  await expect(root).toHaveAttribute("data-effects-mode", firstMode);
  await expect(page.getByRole("button", { name: secondAction })).toBeVisible();
  await expect.poll(() => readSectionVisualProgress(designSection)).toBeCloseTo(0.5, 1);

  await Promise.all([
    page.waitForNavigation(),
    page.getByRole("button", { name: secondAction }).click(),
  ]);

  await expect(root).toHaveAttribute("data-effects-mode", secondMode);
  await expect(page.getByRole("button", { name: firstAction })).toBeVisible();
  await expect.poll(() => readSectionVisualProgress(designSection)).toBeCloseTo(0.5, 1);
});
