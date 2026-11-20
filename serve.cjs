/* Preview cục bộ, không dependency. Chạy: node serve.cjs */
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = __dirname;
const port = Number(process.env.PORT || 8080);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json; charset=utf-8", ".txt": "text/plain; charset=utf-8" };
const server = http.createServer(async (request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405, { Allow: "GET, HEAD" }); return response.end(); }
    try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const relative = pathname === "/" ? "dashboard.html" : pathname.slice(1);
        const target = path.resolve(root, relative);
        if (!target.startsWith(root + path.sep) || relative.split(/[\\/]/).some(part => part.startsWith(".")) || !types[path.extname(target)]) { response.writeHead(404); return response.end("Not found"); }
        const data = await fs.readFile(target);
        response.writeHead(200, { "Content-Type": types[path.extname(target)], "Cache-Control": "no-cache" });
        response.end(request.method === "HEAD" ? undefined : data);
    } catch { response.writeHead(404); response.end("Not found"); }
});
server.on("error", error => { console.error(`Không mở được preview: ${error.message}. Có thể đổi cổng bằng biến PORT.`); process.exitCode = 1; });
server.listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}/dashboard.html`));
