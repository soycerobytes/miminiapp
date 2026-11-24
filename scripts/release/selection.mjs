import { requireValue, safePath } from "./git-tree.mjs";

export const selectionPath = ".release/catalogue.json";
export const registryPath = "src/miniapps/registry.ts";
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const appPath = /^src\/miniapps\/([^/]+)\//;
const order = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export function sortedSlugs(slugs) {
  requireValue(
    Array.isArray(slugs) &&
      slugs.length <= 64 &&
      slugs.every(
        (slug) =>
          typeof slug === "string" &&
          slug.length <= 64 &&
          slugPattern.test(slug),
      ) &&
      new Set(slugs).size === slugs.length,
    "Invalid miniapp selection.",
  );
  return [...slugs].sort(order);
}

export function catalogueBytes(entries) {
  requireValue(Array.isArray(entries), "Invalid catalogue.");
  const slugs = sortedSlugs(entries.map((entry) => entry?.slug));
  const owners = new Set();
  const catalogue = slugs.map((slug) => {
    const entry = entries.find((item) => item.slug === slug);
    requireValue(
      Array.isArray(entry.assets) &&
        entry.assets.every(
          (path) =>
            safePath(path) &&
            path.startsWith("public/") &&
            path.split("/").every((part) => !part.startsWith(".")) &&
            ![
              "public/_redirects",
              "public/_headers",
              "public/_routes.json",
              "public/_worker.js",
            ].some(
              (reserved) =>
                path.toLowerCase() === reserved ||
                path.toLowerCase().startsWith(reserved + "/"),
            ),
        ),
      "Invalid miniapp assets.",
    );
    for (const path of entry.assets) {
      requireValue(
        !owners.has(path.toLowerCase()),
        "Miniapp assets must have one owner.",
      );
      owners.add(path.toLowerCase());
    }
    return { slug, assets: [...entry.assets].sort(order) };
  });
  return Buffer.from(
    JSON.stringify({ schemaVersion: 1, miniapps: catalogue }, null, 2) + "\n",
  );
}

export function registryBytes(entries) {
  const imports = entries.map(
    ({ slug }, index) =>
      `import { metadata as app${index} } from './${slug}/metadata';`,
  );
  const registrations = entries.map(
    ({ slug }, index) =>
      `  { descriptor: app${index}, loadEntry: () => import('./${slug}/entry.astro') },`,
  );
  return Buffer.from(
    [
      "import { validateRegistry, type MiniappRegistration } from '../lib/miniapp-registry';",
      ...imports,
      "",
      ...entries.map(
        ({ slug }, index) =>
          `if (app${index}.slug !== '${slug}' || app${index}.status !== 'published') throw new Error('Invalid published miniapp descriptor.');`,
      ),
      "export const miniappRegistry = validateRegistry([",
      ...registrations,
      "] satisfies readonly MiniappRegistration[]);",
      "",
    ].join("\n"),
  );
}

export function readCatalogue(files) {
  const entry = files.get(selectionPath);
  requireValue(entry?.mode === "100644", "Missing release catalogue.");
  const catalogue = JSON.parse(entry.bytes).miniapps;
  requireValue(
    entry.bytes.equals(catalogueBytes(catalogue)),
    "Catalogue must be canonical.",
  );
  return catalogue;
}

export function verifyCatalogue(files) {
  const entries = readCatalogue(files);
  const registry = files.get(registryPath);
  requireValue(
    registry?.mode === "100644" &&
      registry.bytes.equals(registryBytes(entries)),
    "The registry differs from the catalogue.",
  );
  const slugs = new Set(entries.map(({ slug }) => slug));
  for (const path of files.keys()) {
    const slug = appPath.exec(path)?.[1];
    if (path.startsWith("src/miniapps/") && path !== registryPath)
      requireValue(
        slugs.has(slug),
        "Unselected miniapp source in the release.",
      );
  }
  for (const { slug, assets } of entries) {
    for (const path of [
      `src/miniapps/${slug}/metadata.ts`,
      `src/miniapps/${slug}/entry.astro`,
      ...assets,
    ])
      requireValue(
        files.get(path)?.mode === "100644",
        "A selected miniapp file is missing.",
      );
  }
  return entries;
}

export function fileOwner(path, entries) {
  return (
    appPath.exec(path)?.[1] ??
    entries.find(({ assets }) => assets.includes(path))?.slug
  );
}
