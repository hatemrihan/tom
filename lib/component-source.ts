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
 * Prepares a library file for display. A usage example imports from the
 * published package; a component file is shown exactly as `npx tomm-ui add`
 * copies it, at the path it lands on.
 */
function toPublicSource(relPath: string, raw: string) {
  if (!relPath.startsWith("demos/")) return raw;
  return raw.replace(/from "\.\.\/([a-z-]+)\/\1"/g, 'from "tomm-ui"');
}

function targetFor(relPath: string) {
  if (relPath.startsWith("demos/")) return `app/example.tsx`;
  return `components/tomm/${relPath}`;
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

/** Highlights a short snippet for the docs. */
export function highlight(code: string, lang: "tsx" | "css" | "dart" | "bash") {
  return codeToHtml(code, { lang, themes: { light: "github-light", dark: "github-dark-default" }, defaultColor: false });
}

export const CN_SOURCE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const FLUTTER_DIR = path.join(process.cwd(), "flutter", "tom_components", "lib", "src");

/** Prepares a Dart file from the Flutter package for display and copying. */
export function loadFlutterSource(file: string): Promise<SourceFile> {
  const key = `flutter:${file}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const abs = path.join(FLUTTER_DIR, file);
    if (!abs.startsWith(FLUTTER_DIR)) throw new Error("Invalid path");
    const code = (await readFile(abs, "utf8")).trimEnd() + "\n";
    const html = await codeToHtml(code, { lang: "dart", themes: { light: "github-light", dark: "github-dark-default" }, defaultColor: false });
    return { name: file, target: `lib/tomm/${file}`, code, html };
  })();

  cache.set(key, promise);
  return promise;
}
