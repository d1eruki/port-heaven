import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { discoverPages, pageUrl, profiles, runs, summarizeReports } from "./check-lighthouse.mjs";

const site = "https://example.com/port-heaven/";

async function temporaryDirectory(t) {
  const directory = await mkdtemp(join(tmpdir(), "port-heaven-lighthouse-test-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test("discovers all HTML pages, including nested pages, without escaping the Pages base", async (t) => {
  const directory = await temporaryDirectory(t);
  const files = [
    "index.html",
    "about/index.html",
    "about.html",
    "a-b/index.html",
    "a/b/index.html",
    "работы/index.html",
    "404.html",
    "assets/app.js",
  ];
  for (const file of files) {
    const target = join(directory, file);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, "");
  }
  const { include } = await discoverPages(directory);
  assert.deepEqual(
    include.map(({ path }) => path),
    ["./", "%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B/", "a-b/", "a/b/", "about.html", "about/"],
  );
  assert.equal(new Set(include.map(({ id }) => id)).size, include.length);
  assert.equal(pageUrl(site, "./"), site);
  assert.equal(pageUrl(site, "about/"), `${site}about/`);
  assert.equal(pageUrl(site, "about.html"), `${site}about.html`);
  assert.throws(() => pageUrl(site, "/about/"));
  assert.throws(() => pageUrl(site, "../"));
  assert.throws(() => pageUrl(site, "https://other.example/"));
});

test("an empty build fails instead of silently auditing zero pages", async (t) => {
  const directory = await temporaryDirectory(t);
  await assert.rejects(discoverPages(directory), /не найдены/);
});

async function reportsFixture(t) {
  const directory = await temporaryDirectory(t);
  const reports = new Map();
  const scores = [0.1, 0.9, 0.5];
  for (const profile of profiles) {
    for (let run = 1; run <= runs; run++) {
      const report = {
        requestedUrl: site,
        finalDisplayedUrl: site,
        categories: Object.fromEntries(
          ["performance", "accessibility", "best-practices", "seo"].map((key) => [
            key,
            { score: scores[run - 1] },
          ]),
        ),
        audits: {
          "largest-contentful-paint": { numericValue: [3000, 1000, 2000][run - 1] },
          "total-blocking-time": { numericValue: 100 },
          "cumulative-layout-shift": { numericValue: 0.01 },
        },
      };
      const file = join(directory, `${profile}-${run}.json`);
      await writeFile(file, JSON.stringify(report));
      reports.set(`${profile}-${run}`, { file, report });
    }
  }
  return { directory, reports };
}

test("summarizes three runs per device using independent medians", async (t) => {
  const { directory } = await reportsFixture(t);
  const { summary, failed } = await summarizeReports(directory, site);
  assert.equal(failed, false);
  for (const profile of ["mobile", "tablet", "desktop"]) {
    assert.ok(
      summary.includes(`| ${profile} | 3/3 | 50 (10–90) | 50 | 50 | 50 | 2.00 | 100 | 0.010 |`),
    );
  }
});

test("missing runs, redirects, runtime errors and incomplete metrics fail the audit", async (t) => {
  const { directory, reports } = await reportsFixture(t);
  await rm(reports.get("mobile-1").file);
  const redirect = reports.get("tablet-1");
  redirect.report.finalDisplayedUrl = "https://example.com/login/";
  await writeFile(redirect.file, JSON.stringify(redirect.report));
  const runtime = reports.get("desktop-1");
  runtime.report.runtimeError = { message: "Chrome crashed" };
  await writeFile(runtime.file, JSON.stringify(runtime.report));
  const incomplete = reports.get("desktop-2");
  delete incomplete.report.audits["largest-contentful-paint"];
  await writeFile(incomplete.file, JSON.stringify(incomplete.report));
  const { summary, failed } = await summarizeReports(directory, site);
  assert.equal(failed, true);
  assert.match(summary, /mobile \| 2\/3/);
  assert.match(summary, /tablet \| 2\/3/);
  assert.match(summary, /desktop \| 1\/3/);
  assert.match(summary, /Chrome crashed/);
  assert.match(summary, /перенаправлена/);
  assert.match(summary, /неполные баллы или метрики/);
});
