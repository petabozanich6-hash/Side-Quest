import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) =>
  c.json({ name: "Side Quest Learning API", runtime: "cloudflare-workers", ok: true })
);

app.get("/api/health", (c) => c.json({ status: "alive" }));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
