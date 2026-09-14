import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const src = path.join(root, "src");
const publicDir = path.join(root, "public");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await mkdir(path.join(dist, "assets"), { recursive: true });

await cp(publicDir, path.join(dist, "assets"), { recursive: true });

const html = await readFile(path.join(src, "index.html"), "utf8");
await writeFile(path.join(dist, "index.html"), html.replaceAll("%BUILD_YEAR%", String(new Date().getFullYear())));

await cp(path.join(src, "styles.css"), path.join(dist, "styles.css"));
await cp(path.join(src, "app.js"), path.join(dist, "app.js"));

console.log("Build pronto em dist/");
