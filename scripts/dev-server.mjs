import { createServer } from "node:http";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const submissionsPath = path.join(root, "work", "local-submissions.json");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function saveLocalSubmission(payload) {
  await mkdir(path.dirname(submissionsPath), { recursive: true });
  let current = [];
  try {
    current = JSON.parse(await readFile(submissionsPath, "utf8"));
  } catch {
    current = [];
  }
  current.push({ ...payload, created_at: new Date().toISOString() });
  await writeFile(submissionsPath, JSON.stringify(current, null, 2));
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (url.pathname === "/api/candidaturas" && req.method === "POST") {
      const payload = JSON.parse(await readBody(req));
      await saveLocalSubmission(payload);
      res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true, local: true }));
      return;
    }

    const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(dist, safePath);
    try {
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch {
      filePath = path.join(dist, "index.html");
    }

    const ext = path.extname(filePath);
    const file = await readFile(filePath);
    res.writeHead(200, { "content-type": mimeTypes[ext] || "application/octet-stream" });
    res.end(file);
  } catch (error) {
    res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Erro no servidor local." }));
  }
});

server.listen(port, () => {
  console.log(`Preview local em http://localhost:${port}`);
});
