/**
 * Sends one anonymous usage event from the site. No cookie is set and nothing
 * about the person is sent: see /telemetry. Does nothing on a local machine or
 * when the browser asks not to be tracked.
 */
export function track(kind: "view" | "copy" | "switch", data: { detail?: string; edition?: "react" | "flutter" } = {}) {
  if (typeof window === "undefined") return;
  const { hostname, pathname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1" || navigator.doNotTrack === "1") return;

  const component = pathname.match(/^\/components\/([a-z0-9-]+)\/?$/)?.[1];
  const body = JSON.stringify({ kind, source: "site", component, path: pathname, referrer: document.referrer, ...data });
  try {
    if (!navigator.sendBeacon?.("/api/t", body)) void fetch("/api/t", { method: "POST", body, keepalive: true });
  } catch {
    // never let counting break the page
  }
}

/** What a copied piece of text was, and which edition it belongs to. */
export function describeCopy(text: string): { detail: string; edition: "react" | "flutter" } {
  const first = text.trim().split("\n")[0].slice(0, 80);
  if (/^(flutter|dart) /.test(first)) return { detail: first, edition: "flutter" };
  if (/^(npm|npx|pnpm|yarn|bun) /.test(first)) return { detail: first, edition: "react" };
  const dart = /^import 'package:/m.test(text);
  return { detail: text.length < 120 ? "import line" : "source code", edition: dart ? "flutter" : "react" };
}
