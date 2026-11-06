import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";

const LIBRARY_DIR = path.join(process.cwd(), "components", "library");

export interface SourceFile {
  /** Path shown to users, e.g. "hold-to-confirm.tsx". */
  name: string;
  /** Where to put it in a project. */
  target: string;
  code: string;
  html: string;
}

const cache = new Map<string, Promise<SourceFile>>();

/**
 * Prepares a library file for display/copying: rewrites the internal
 * `../_lib/*` imports to the paths users will have after copying.
 */
function toPublicSource(relPath: string, raw: string) {
  return raw
    .replace(/from "\.\.\/_lib\/cn"/g, 'from "@/lib/utils"')
    .replace(/from "\.\.\/_lib\/noise"/g, 'from "@/lib/noise"')
    .replace(/from "\.\.\/([a-z-]+)\/\1"/g, 'from "@/components/tom/$1"');
}

function targetFor(relPath: string) {
  if (relPath.startsWith("_lib/")) return `lib/${path.basename(relPath)}`;
  if (relPath.startsWith("demos/")) return `app/example.tsx`;
  return `components/tom/${path.basename(relPath)}`;
}

export function loadSource(relPath: string): Promise<SourceFile> {
  const cached = cache.get(relPath);
  if (cached) return cached;

  const promise = (async () => {
    const abs = path.join(LIBRARY_DIR, relPath);
    if (!abs.startsWith(LIBRARY_DIR)) throw new Error("Invalid path");
    const raw = await readFile(abs, "utf8");
    const code = toPublicSource(relPath, raw).trimEnd() + "\n";
    const lang = relPath.endsWith(".ts") ? "ts" : "tsx";
    const html = await codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark-default" },
      defaultColor: false,
    });
    return { name: path.basename(relPath), target: targetFor(relPath), code, html };
  })();

  cache.set(relPath, promise);
  return promise;
}

export const CN_SOURCE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
