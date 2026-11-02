import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
async function projectPages(directory) {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) pages.push(...await projectPages(absolute));
    else if (entry.isFile() && entry.name.endsWith(".html")) pages.push(relative(root, absolute));
  }
  return pages.sort();
}
const pages = ["index.html", "portfolio/minecraft.html", "portfolio/software.html", "portfolio/indie-game.html", "404.html", ...await projectPages(resolve(root, "projects"))];
const assetTypes = new Set([".css", ".js", ".svg", ".png"]);
const versions = new Map();

for (const page of pages) {
  const pagePath = resolve(root, page);
  const original = await readFile(pagePath, "utf8");
  const references = [...original.matchAll(/\b(?:src|href)=(["'])([^"']+)\1/g)];
  let updated = original;

  for (const match of references) {
    const reference = match[2];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) continue;
    const [withoutFragment, fragment] = reference.split("#");
    const [assetPath, query = ""] = withoutFragment.split("?");
    const extension = extname(assetPath).toLowerCase();
    if (!assetTypes.has(extension)) continue;

    const absoluteAsset = assetPath.startsWith("/") ? resolve(root, `.${decodeURIComponent(assetPath)}`) : resolve(dirname(pagePath), decodeURIComponent(assetPath));
    const relativeAsset = relative(root, absoluteAsset);
    if (relativeAsset === ".." || relativeAsset.startsWith(`..${sep}`)) throw new Error(`Asset outside this site: ${assetPath}`);

    if (!versions.has(absoluteAsset)) {
      const data = await readFile(absoluteAsset);
      const input = extension === ".css" || extension === ".js" ? data.toString("utf8").replaceAll("\r\n", "\n") : data;
      versions.set(absoluteAsset, createHash("sha256").update(input).digest("hex").slice(0, 12));
    }
    const params = new URLSearchParams(query.replaceAll("&amp;", "&"));
    params.set("v", versions.get(absoluteAsset));
    const versioned = `${assetPath}?${params.toString().replaceAll("&", "&amp;")}${fragment === undefined ? "" : `#${fragment}`}`;
    updated = updated.replaceAll(`${match[1]}${reference}${match[1]}`, `${match[1]}${versioned}${match[1]}`);
  }

  if (updated !== original) {
    await writeFile(pagePath, updated);
    console.log(`Updated ${page}`);
  }
}
console.log(`Versioned ${versions.size} assets across ${pages.length} pages.`);
