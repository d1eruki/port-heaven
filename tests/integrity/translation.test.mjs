import assert from "node:assert/strict";
import test from "node:test";
import { prepareTranslations, protectText } from "../../scripts/translate-locale.mjs";

test("translation preserves nested arrays, scalar types and removes deleted keys", async () => {
  const source = {
    projects: [{ text: ["Первый", "Второй"], enabled: true, count: 2, empty: [] }],
  };
  const result = await prepareTranslations({
    source,
    target: { removed: "obsolete", projects: [{ text: ["old", "old", "removed"] }] },
    translate: async (items) => {
      assert.deepEqual(
        items.map(({ key }) => key),
        ["projects.0.text.0", "projects.0.text.1"],
      );
      return { "projects.0.text.0": "first", "projects.0.text.1": "second" };
    },
  });

  assert.deepEqual(result.target, {
    projects: [{ text: ["first", "second"], enabled: true, count: 2, empty: [] }],
  });
});

test("matching source hashes reuse translations without an API call", async () => {
  const first = await prepareTranslations({
    source: { text: "Привет", list: ["Мир"] },
    translate: async () => ({ text: "hello", "list.0": "world" }),
  });
  const reused = await prepareTranslations({
    source: { text: "Привет", list: ["Мир"] },
    cached: first,
    translate: async () => assert.fail("unchanged copy must not call the API"),
  });

  assert.equal(reused.translatedCount, 0);
  assert.deepEqual(reused.target, first.target);

  const changed = await prepareTranslations({
    source: { text: "Привет", list: ["Изменено"] },
    cached: first,
    translate: async (items) => {
      assert.deepEqual(
        items.map(({ key }) => key),
        ["list.0"],
      );
      return { "list.0": "changed" };
    },
  });
  assert.deepEqual(changed.target, { text: "hello", list: ["changed"] });
});

test("checked-in translations can seed the cache and rule changes invalidate cached copy", async () => {
  const first = await prepareTranslations({
    source: { text: "Привет" },
    translate: async () => ({ text: "hello" }),
  });
  const reused = await prepareTranslations({
    source: { text: "Привет" },
    target: first.target,
    meta: { hashes: first.meta.hashes },
    translate: async () => assert.fail("matching checked-in hashes must be reused"),
  });
  assert.equal(reused.translatedCount, 0);

  const changedRules = await prepareTranslations({
    source: { text: "Привет" },
    cached: { ...first, meta: { ...first.meta, contextHash: "old-rules" } },
    translate: async () => ({ text: "updated" }),
  });
  assert.equal(changedRules.target.text, "updated");
});

test("special labels and non-Russian strings bypass translation", async () => {
  const source = {
    "lang-toggle": "english",
    brand: "Varwin XRMS",
    metric: "50/50",
    seo: { title: "пространство порт хэвен" },
  };
  const cached = await prepareTranslations({
    source,
    translate: async () => assert.fail("protected copy must not call the API"),
  });
  cached.target.seo.title = "port haven space";
  const result = await prepareTranslations({
    source,
    target: cached.target,
    meta: cached.meta,
    cached,
    translate: async () => assert.fail("protected copy must not call the API"),
  });
  assert.deepEqual(result.target, {
    "lang-toggle": "русский",
    brand: "Varwin XRMS",
    metric: "50/50",
    seo: { title: "port heaven space" },
  });
});

test("product names, URLs, variables, metrics and line breaks survive translation exactly", () => {
  const source = "Проект Varwin XRMS: {plan}, 50/50\nhttps://example.com/путь";
  const protectedText = protectText(source);
  const english = protectedText.value.replace("Проект", "project");
  assert.equal(protectedText.restore(english), source.replace("Проект", "project"));
  assert.throws(
    () => protectedText.restore(english.replace("__PH_0__", "")),
    /lost a protected token/,
  );
  assert.throws(() => protectedText.restore(`${english} __PH_0__`), /Invalid protected token/);
  assert.throws(() => protectedText.restore(`${english} __PH_99__`), /Invalid protected token/);
});

test("missing or invalid translations reject the update instead of publishing partial copy", async () => {
  await assert.rejects(
    prepareTranslations({
      source: { text: "Текст" },
      translate: async () => ({}),
    }),
    /text: Translation must contain/,
  );
  await assert.rejects(
    prepareTranslations({
      source: { text: "Текст" },
      translate: async () => {
        throw new Error("API unavailable");
      },
    }),
    /API unavailable/,
  );
});
