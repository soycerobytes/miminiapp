import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { requireValue } from "./git-tree.mjs";

const pages = ["404.html", "en/index.html", "es/index.html", "index.html"];

async function walk(root, prefix = "") {
  const files = [];
  for (const entry of await readdir(join(root, prefix), {
    withFileTypes: true,
  })) {
    const path = prefix ? prefix + "/" + entry.name : entry.name;
    requireValue(
      !path.split("/").some((part) => part.startsWith(".")),
      "Unexpected output path.",
    );
    if (entry.isDirectory()) files.push(...(await walk(root, path)));
    else {
      requireValue(entry.isFile(), "Unsupported output file.");
      files.push(path);
    }
  }
  return files;
}

export async function verifyBuild(root, entries) {
  const expected = [
    ...pages,
    ...["es", "en"].flatMap((locale) =>
      entries.map(({ slug }) => `${locale}/apps/${slug}/index.html`),
    ),
  ].sort();
  const files = await walk(root);
  const html = files.filter((path) => path.endsWith(".html")).sort();
  requireValue(
    JSON.stringify(html) === JSON.stringify(expected),
    "Unexpected output pages.",
  );
  for (const locale of ["es", "en"]) {
    const home = await readFile(join(root, locale, "index.html"), "utf8");
    const linked = [
      ...new Set(
        [
          ...home.matchAll(
            new RegExp(`href="/${locale}/apps/([a-z0-9-]+)/"`, "g"),
          ),
        ].map((match) => match[1]),
      ),
    ].sort();
    requireValue(
      JSON.stringify(linked) ===
        JSON.stringify(entries.map(({ slug }) => slug)) &&
        /class="[^"]*\bempty-catalogue\b/.test(home) === (entries.length === 0),
      "The compiled catalogue differs from the approved selection.",
    );
  }
  for (const { assets } of entries)
    for (const path of assets)
      requireValue(
        files.includes(path.slice("public/".length)),
        "A selected asset is missing from the build.",
      );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const root = process.argv[2];
  const catalogue = process.argv[3];
  readFile(catalogue, "utf8")
    .then((text) => verifyBuild(root, JSON.parse(text).miniapps))
    .then(() => console.log("Production catalogue verified."))
    .catch(() => {
      console.error("Production output verification failed.");
      process.exitCode = 1;
    });
}
