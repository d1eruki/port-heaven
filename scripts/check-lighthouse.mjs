import { createHash } from "node:crypto";
import { appendFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const profiles = ["mobile", "tablet", "desktop"];
export const runs = 3;
const categories = ["performance", "accessibility", "best-practices", "seo"];
const metrics = ["largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift"];

export async function discoverPages(directory) {
  const paths = [];
  async function walk(relative = "") {
    for (const entry of await readdir(resolve(directory, relative), { withFileTypes: true })) {
      const file = `${relative}${entry.name}`;
      if (entry.isDirectory()) await walk(`${file}/`);
      else if (entry.isFile() && file.endsWith(".html") && file !== "404.html") {
        const encoded = file.split("/").map(encodeURIComponent).join("/");
        paths.push(encoded.replace(/(^|\/)index\.html$/, "$1"));
      }
    }
  }
  await walk();
  if (!paths.length) throw new Error("В сборке не найдены HTML-страницы");
  return {
    include: paths.sort().map((path) => ({
      path: path || "./",
      id: `page-${createHash("sha256").update(path).digest("hex").slice(0, 16)}`,
    })),
  };
}

export function pageUrl(site, page) {
  const root = new URL(site);
  if (!/^https?:$/.test(root.protocol) || !root.pathname.endsWith("/")) {
    throw new Error("LIGHTHOUSE_SITE_URL должен быть HTTP(S)-адресом с завершающим / ");
  }
  const url = new URL(page, root);
  if (
    url.origin !== root.origin ||
    !url.pathname.startsWith(root.pathname) ||
    url.hash ||
    url.search
  ) {
    throw new Error("Страница должна находиться внутри опубликованного сайта");
  }
  return url.href;
}

export function profileConfig(profile, desktop, mobileUserAgent) {
  if (profile === "desktop") return desktop;
  if (profile === "mobile") return { extends: "lighthouse:default" };
  if (profile !== "tablet") throw new Error(`Неизвестный профиль: ${profile}`);
  // У Lighthouse нет отдельного планшетного профиля: мобильная модель CPU/сети,
  // планшетный экран и Android user agent без телефонного маркера Mobile.
  return {
    extends: "lighthouse:default",
    settings: {
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 768,
        height: 1024,
        deviceScaleFactor: 2,
        disabled: false,
      },
      emulatedUserAgent: mobileUserAgent.replace(" Mobile ", " "),
    },
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function number(value, digits = 0) {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}

export async function summarizeReports(directory, url) {
  const columns = [
    "Профиль",
    "Замеры",
    "Скорость: медиана (диапазон)",
    "Доступность",
    "Практики",
    "SEO",
    "LCP, с",
    "TBT, мс",
    "CLS",
  ];
  const lines = [
    `# Lighthouse: ${url}`,
    "",
    "Эмуляция Chrome: телефон 412×823, планшет 768×1024, компьютер 1350×940.",
    "Телефон и планшет используют мобильную модель CPU/сети Lighthouse; компьютер — стандартный desktop-профиль.",
    "Каждый профиль измеряется трижды, последовательно, в новом Chrome с холодным кешем и без сохранённого согласия на аналитику.",
    "",
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
  ];
  const failures = [];
  const metadata = [];
  for (const profile of profiles) {
    const reports = [];
    for (let run = 1; run <= runs; run++) {
      const name = `${profile}-${run}`;
      try {
        const report = JSON.parse(await readFile(resolve(directory, `${name}.json`), "utf8"));
        if (report.runtimeError) throw new Error(report.runtimeError.message);
        if (report.requestedUrl !== url || (report.finalDisplayedUrl || report.finalUrl) !== url) {
          throw new Error("Страница перенаправлена или отчёт относится к другому адресу");
        }
        if (
          categories.some((key) => !Number.isFinite(report.categories?.[key]?.score)) ||
          metrics.some((key) => !Number.isFinite(report.audits?.[key]?.numericValue))
        ) {
          throw new Error("Отчёт содержит неполные баллы или метрики");
        }
        reports.push(report);
      } catch (error) {
        failures.push(`${name}: ${error.message}`);
      }
    }
    const scores = (key) => reports.map((report) => report.categories[key].score * 100);
    const metric = (key) => median(reports.map((report) => report.audits[key].numericValue));
    const speed = scores("performance");
    const range = speed.length
      ? `${number(Math.min(...speed))}–${number(Math.max(...speed))}`
      : "—";
    const lcp = metric("largest-contentful-paint");
    const row = [
      profile,
      `${reports.length}/${runs}`,
      `${number(median(speed))} (${range})`,
      ...categories.slice(1).map((key) => number(median(scores(key)))),
      number(lcp === null ? null : lcp / 1000, 2),
      number(metric("total-blocking-time")),
      number(metric("cumulative-layout-shift"), 3),
    ];
    lines.push(`| ${row.join(" | ")} |`);
    for (const report of reports) {
      metadata.push(
        `${profile}: Lighthouse ${report.lighthouseVersion}; ${report.fetchTime}; ${report.environment?.hostUserAgent || report.userAgent}.`,
      );
    }
    const warnings = new Set(reports.flatMap((report) => report.runWarnings || []));
    for (const warning of warnings) metadata.push(`Предупреждение ${profile}: ${warning}`);
  }
  lines.push(
    "",
    ...metadata,
    "",
    "Медиана каждой метрики рассчитана отдельно. Низкие баллы не блокируют публикацию; неполный набор замеров означает сбой аудита.",
  );
  if (failures.length)
    lines.push("", "## Неудачные замеры", "", ...failures.map((failure) => `- ${failure}`));
  return { summary: `${lines.join("\n")}\n`, failed: failures.length > 0 };
}

async function collect(directory, url) {
  if (!process.env.LIGHTHOUSE_MODULES) throw new Error("Укажите LIGHTHOUSE_MODULES");
  const require = createRequire(resolve(process.env.LIGHTHOUSE_MODULES, "audit.cjs"));
  const load = (name) => import(pathToFileURL(require.resolve(name)).href);
  const [{ default: lighthouse }, chromeLauncher, { default: desktop }, { userAgents }] =
    await Promise.all([
      load("lighthouse"),
      load("chrome-launcher"),
      load("lighthouse/core/config/lr-desktop-config.js"),
      load("lighthouse/core/config/constants.js"),
    ]);
  for (const profile of profiles) {
    for (let run = 1; run <= runs; run++) {
      const name = `${profile}-${run}`;
      let chrome;
      try {
        console.info(`Lighthouse ${name}: ${url}`);
        const response = await fetch(url, {
          redirect: "manual",
          signal: AbortSignal.timeout(30_000),
        });
        await response.body?.cancel();
        if (!response.ok)
          throw new Error(`Страница недоступна или перенаправлена: HTTP ${response.status}`);
        chrome = await chromeLauncher.launch({
          chromePath: process.env.CHROME_PATH,
          chromeFlags: ["--headless", "--no-sandbox", "--disable-extensions"],
        });
        const result = await lighthouse(
          url,
          {
            port: chrome.port,
            output: ["html", "json"],
            logLevel: "error",
            onlyCategories: categories,
          },
          profileConfig(profile, desktop, userAgents.mobile),
        );
        if (!result) throw new Error("Lighthouse не вернул результат");
        await writeFile(resolve(directory, `${name}.html`), result.report[0]);
        await writeFile(resolve(directory, `${name}.json`), result.report[1]);
      } catch (error) {
        console.error(`${name}: ${error.message}`);
        await writeFile(resolve(directory, `${name}.error.txt`), error.stack || error.message);
      } finally {
        await chrome?.kill();
      }
    }
  }
}

async function main() {
  if (process.argv.includes("--list-pages")) {
    const matrix = JSON.stringify(await discoverPages(resolve("dist")));
    if (process.env.GITHUB_OUTPUT)
      await appendFile(process.env.GITHUB_OUTPUT, `matrix=${matrix}\n`);
    console.info(matrix);
    return;
  }
  const url = pageUrl(process.env.LIGHTHOUSE_SITE_URL, process.env.LIGHTHOUSE_PAGE_PATH || "./");
  if (!process.env.LIGHTHOUSE_REPORTS)
    throw new Error("Укажите LIGHTHOUSE_REPORTS для нового запуска");
  const directory = resolve(process.env.LIGHTHOUSE_REPORTS);
  if (!process.argv.includes("--summarize")) {
    // Не смешиваем свежие отчёты с оставшимися от предыдущего запуска.
    await mkdir(directory, { recursive: true });
    if ((await readdir(directory)).length) throw new Error("Каталог отчётов должен быть пустым");
    try {
      await collect(directory, url);
    } finally {
      await saveSummary(directory, url);
    }
  } else {
    await saveSummary(directory, url);
  }
}

async function saveSummary(directory, url) {
  const { summary, failed } = await summarizeReports(directory, url);
  await writeFile(resolve(directory, "summary.md"), summary);
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
  console.info(summary);
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
