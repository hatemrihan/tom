#!/usr/bin/env node
// tomm: copy a component's source into your project, so it is yours to change.
//   npx tomm-ui list
//   npx tomm-ui add hold-to-confirm music-toggle
//   npx tomm-ui add result-slip --dir src/ui --force
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
import readline from "node:readline";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const all = fs
  .readdirSync(src, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name)
  .sort();

const args = process.argv.slice(2);
const command = args[0];

const help = `tomm-ui: simple, direct React components

  npx tomm-ui list                     show every component
  npx tomm-ui add <name> [<name> …]    copy components into your project
      --dir <folder>                   where to put them (default: components/tomm, or src/components/tomm)
      --force                          replace files that already exist
      --yes                            install what they need without asking
      --no-install                     never install, only say what is needed
      --no-telemetry                   send no anonymous usage (or set TOMM_TELEMETRY=0)

  Or use them without copying:         npm i tomm-ui
                                       import { HoldToConfirm } from "tomm-ui"

  Previews and docs:                   https://tomm.one/components
`;

if (!command || command === "help" || command === "--help" || command === "-h") {
  console.log(help);
  process.exit(0);
}

if (command === "list") {
  console.log(all.join("\n"));
  process.exit(0);
}

if (command !== "add") {
  console.error(`Unknown command "${command}".\n\n${help}`);
  process.exit(1);
}

let dir;
let force = false;
let yes = false;
let noInstall = false;
let telemetry = process.env.TOMM_TELEMETRY !== "0" && process.env.DO_NOT_TRACK !== "1";
const names = [];
for (let i = 1; i < args.length; i++) {
  if (args[i] === "--force") force = true;
  else if (args[i] === "--yes" || args[i] === "-y") yes = true;
  else if (args[i] === "--no-install") noInstall = true;
  else if (args[i] === "--no-telemetry") telemetry = false;
  else if (args[i] === "--dir") dir = args[++i];
  else names.push(args[i]);
}
if (names.length === 0) {
  console.error("Say which component to add, for example: npx tomm-ui add hold-to-confirm\nRun `npx tomm-ui list` to see them all.");
  process.exit(1);
}
const unknown = names.filter((n) => !all.includes(n));
if (unknown.length > 0) {
  console.error(`No component called ${unknown.map((n) => `"${n}"`).join(", ")}. Run \`npx tomm-ui list\` to see them all.`);
  process.exit(1);
}

const cwd = process.cwd();
if (!dir) dir = fs.existsSync(path.join(cwd, "src")) && !fs.existsSync(path.join(cwd, "components")) ? "src/components/tomm" : "components/tomm";
const target = path.resolve(cwd, dir);

const packages = new Set(["motion", "clsx", "tailwind-merge"]);
const written = [];
const skipped = [];

function copy(relative) {
  const from = path.join(src, relative);
  const to = path.join(target, relative);
  const shown = path.relative(cwd, to);
  if (fs.existsSync(to) && !force) {
    // a shared helper that is already in place is not worth a line
    if (!relative.startsWith("_lib") && !skipped.includes(shown)) skipped.push(shown);
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  if (!written.includes(shown)) written.push(shown);
}

for (const name of names) {
  const relative = path.join(name, `${name}.tsx`);
  const code = fs.readFileSync(path.join(src, relative), "utf8");
  copy(relative);
  // shared helpers and extra packages this component imports
  for (const m of code.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (spec.startsWith("../_lib/")) copy(path.join("_lib", `${spec.slice("../_lib/".length)}.ts`));
    else if (!spec.startsWith(".") && spec !== "react" && !spec.startsWith("motion")) packages.add(spec);
  }
}

// only mention packages the project does not already list
let have = {};
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
  have = { ...pkg.dependencies, ...pkg.devDependencies };
} catch {}
const missing = [...packages].filter((p) => !have[p]);

// the project's own package manager, so the install lands in the right lockfile
const manager = fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))
  ? ["pnpm", "add"]
  : fs.existsSync(path.join(cwd, "yarn.lock"))
    ? ["yarn", "add"]
    : fs.existsSync(path.join(cwd, "bun.lock")) || fs.existsSync(path.join(cwd, "bun.lockb"))
      ? ["bun", "add"]
      : ["npm", "i"];
const installCommand = [...manager, ...missing].join(" ");

// colour only when a person is reading, and never when they have asked for none
const interactive = Boolean(process.stdout.isTTY && process.stdin.isTTY);
const colour = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (text) => (colour ? `\x1b[${code}m${text}\x1b[0m` : text);
const bold = paint(1);
const dim = paint(2);
const underline = paint(4);
const green = paint(32);
const yellow = paint(33);

let notice = "";
const added = names.filter((n) => written.some((f) => f.endsWith(`${n}.tsx`)));
const helpers = written.filter((f) => f.includes(`${path.sep}_lib${path.sep}`) || f.includes("/_lib/"));
const shownDir = dir.replace(/\/+$/, "");
const row = (mark, name, detail) => `  ${mark} ${name.padEnd(width)}   ${detail}`;
const width = Math.max(...added.map((n) => n.length), ...skipped.map((f) => path.basename(f, ".tsx").length), ...helpers.map((f) => path.basename(f, ".ts").length + 7), ...missing.map((m) => m.length), 9);

// Anonymous usage, described at tomm.one/telemetry. It starts now and is given a moment at the end;
// it can never slow the tool down by more than that or make it fail.
const sent = report(added);

const lines = [""];
if (added.length > 0) {
  lines.push(`  ${bold("▀█▀ █▀█ █▀▄▀█ █▀▄▀█")}`, `  ${bold(" █  █▄█ █ ▀ █ █ ▀ █")}   ${dim("simple and direct")}`, "");
}
for (const name of added) lines.push(row(green("✓"), name, dim(`${shownDir}/${name}/`)));
for (const file of helpers) lines.push(row(green("✓"), `${path.basename(file, ".ts")} helper`, dim(`${shownDir}/_lib/`)));
for (const file of skipped) lines.push(row(dim("·"), path.basename(file, ".tsx"), dim("already here, left alone (--force replaces it)")));
for (const name of missing) lines.push(row(yellow("○"), name, dim("not installed yet")));
console.log(lines.join("\n"));

function finish(installed) {
  if (added.length > 0) console.log(`\n  ${installed || missing.length === 0 ? "Done." : "Almost."} It's your code now.\n`);
  else console.log("");
  if (notice) console.log(dim(notice));
}

if (missing.length === 0 || noInstall) {
  if (missing.length > 0) console.log(`\n  Run  ${underline(installCommand)}`);
  finish(false);
} else if (!interactive && !yes) {
  // not a person at a keyboard: say what to run and leave
  console.log(`\n  Run  ${underline(installCommand)}`);
  finish(false);
} else {
  const go = yes ? true : await ask(`\n  Run  ${underline(installCommand)}  now? ${dim("(Y/n)")} `);
  if (!go) {
    finish(false);
  } else {
    console.log("");
    const result = spawnSync(manager[0], [...manager.slice(1), ...missing], { cwd, stdio: "inherit", shell: process.platform === "win32" });
    if (result.status === 0) {
      console.log(`\n  ${green("✓")} ${missing.join(", ")} installed`);
      finish(true);
    } else {
      console.log(`\n  That didn't go through. Run it yourself:  ${underline(installCommand)}`);
      finish(false);
      process.exitCode = 1;
    }
  }
}

await sent;

/** Tells tomm.one which components were added. No names, paths or code. */
async function report(components) {
  if (!telemetry || components.length === 0) return;
  try {
    const ci = Boolean(process.env.CI);
    let id;
    if (!ci) {
      const file = path.join(os.homedir(), ".config", "tomm", "id");
      try {
        id = fs.readFileSync(file, "utf8").trim();
      } catch {
        id = randomUUID();
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, id + "\n");
        // said once, the first time
        notice = "  tomm-ui shares anonymous usage: which component, tool version, OS.\n  No names, paths or code. Turn it off with TOMM_TELEMETRY=0.  tomm.one/telemetry\n";
      }
    }
    const version = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")).version;
    await fetch("https://tomm.one/api/t", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": `tomm-ui/${version}` },
      body: JSON.stringify({ kind: "cli_add", source: "npm", components, id, version, os: process.platform, runtime: `node ${process.versions.node.split(".")[0]}`, manager: manager[0], ci }),
      signal: AbortSignal.timeout(1500),
    });
  } catch {
    // offline, blocked or slow: not the person's problem
  }
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(!/^n/i.test(answer.trim()));
    });
  });
}
