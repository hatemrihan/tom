// Builds the npm package from the site's own component files, so the two never drift apart.
//   src/   the component source, as shown on the site (used by `npx tomm-ui add`)
//   dist/  compiled JavaScript, type definitions and the styles (used by `import { … } from "tomm-ui"`)
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const library = path.join(root, "components/library");
const src = path.join(here, "src");
const dist = path.join(here, "dist");

fs.rmSync(src, { recursive: true, force: true });
fs.rmSync(dist, { recursive: true, force: true });

// 1. Copy each component and the helpers they share.
const slugs = fs
  .readdirSync(library, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== "demos" && !d.name.startsWith("_"))
  .map((d) => d.name)
  .filter((slug) => fs.existsSync(path.join(library, slug, `${slug}.tsx`)))
  .sort();

fs.cpSync(path.join(library, "_lib"), path.join(src, "_lib"), { recursive: true });
for (const slug of slugs) {
  fs.mkdirSync(path.join(src, slug), { recursive: true });
  fs.copyFileSync(path.join(library, slug, `${slug}.tsx`), path.join(src, slug, `${slug}.tsx`));
}
fs.writeFileSync(
  path.join(src, "index.ts"),
  slugs.map((slug) => `export * from "./${slug}/${slug}";`).join("\n") + '\nexport { cn } from "./_lib/cn";\n',
);

// 2. Compile.
execFileSync(process.execPath, [path.join(root, "node_modules/typescript/bin/tsc"), "-p", path.join(here, "tsconfig.build.json")], { stdio: "inherit" });

// 3. Give relative imports their ".js" ending, so Node can load the files as they are (Next.js does this on the server).
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
for (const file of walk(dist)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const fixed = text.replace(/(from\s+|import\s+)(["'])(\.{1,2}\/[^"']+?)\2/g, (m, lead, q, spec) => (/\.(js|json)$/.test(spec) ? m : `${lead}${q}${spec}.js${q}`));
  if (fixed !== text) fs.writeFileSync(file, fixed);
}

// 4. Compile the stylesheet: only the classes the components use.
const require = createRequire(path.join(root, "package.json"));
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");
const cssFile = path.join(here, "styles.src.css");
const compiled = await postcss([tailwind({ base: here, optimize: { minify: true } })]).process(fs.readFileSync(cssFile, "utf8"), { from: cssFile });
const css = compiled.css.trim();
fs.writeFileSync(path.join(dist, "styles.css"), css + "\n");
fs.writeFileSync(path.join(dist, "_lib/css.js"), `export const css = ${JSON.stringify(css)};\n`);

// 5. Every component brings that stylesheet with it. On React 19 it is rendered as a hoisted,
//    de-duplicated <style> (so it is in the server's HTML); on React 18 it is added to <head> once.
fs.writeFileSync(
  path.join(dist, "_lib/styles.js"),
  `"use client";
import { createElement, Fragment, version } from "react";
import { css } from "./css.js";

const hoist = Number.parseInt(version, 10) >= 19;

function inject() {
  if (typeof document === "undefined" || document.querySelector("style[data-tomm-ui]")) return;
  const el = document.createElement("style");
  el.setAttribute("data-tomm-ui", "");
  el.textContent = css;
  document.head.appendChild(el);
}
if (!hoist) inject();

/** Wraps a component so its styles arrive with it. */
export function withStyles(Component, name) {
  function Styled(props) {
    return createElement(Fragment, null, hoist ? createElement("style", { href: "tomm-ui", precedence: "low" }, css) : null, createElement(Component, props));
  }
  Styled.displayName = name;
  return Styled;
}
`,
);

// 6. The entry point: components go out wrapped, everything else as it is.
const wrapped = ['"use client";', 'import { withStyles } from "./_lib/styles.js";'];
const entry = [];
for (const slug of slugs) {
  const mod = await import(pathToFileURL(path.join(dist, slug, `${slug}.js`)).href);
  const names = Object.keys(mod);
  const components = names.filter((n) => /^[A-Z]/.test(n) && typeof mod[n] === "function");
  const others = names.filter((n) => !components.includes(n));
  const id = "m_" + slug.replace(/-/g, "_");
  wrapped.push(`import * as ${id} from "./${slug}/${slug}.js";`);
  for (const n of components) wrapped.push(`export const ${n} = /*#__PURE__*/ withStyles(${id}.${n}, "${n}");`);
  if (components.length > 0) entry.push(`export { ${components.join(", ")} } from "./components.js";`);
  if (others.length > 0) entry.push(`export { ${others.join(", ")} } from "./${slug}/${slug}.js";`);
}
entry.push('export { cn } from "./_lib/cn.js";');
fs.writeFileSync(path.join(dist, "components.js"), wrapped.join("\n") + "\n");
fs.writeFileSync(path.join(dist, "index.js"), entry.join("\n") + "\n");

// 7. The package carries the same licence as the repository.
fs.copyFileSync(path.join(root, "LICENSE"), path.join(here, "LICENSE"));

console.log(`tomm-ui: ${slugs.length} components built, ${Math.round(css.length / 1024)} KB of styles`);
