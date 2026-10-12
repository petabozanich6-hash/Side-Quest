import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = mkdtempSync(path.join(tmpdir(), "sq-google-auth-"));
const outfile = path.join(outDir, "google-auth.test.mjs");

const bundled = spawnSync(
  "npx",
  ["esbuild", "worker/test/google-auth.test.ts", "--bundle", "--platform=node", "--format=esm", `--outfile=${outfile}`],
  { cwd: root, stdio: "inherit" }
);
if (bundled.status !== 0) process.exit(bundled.status ?? 1);

const tested = spawnSync(process.execPath, ["--test", outfile], { cwd: root, stdio: "inherit" });
rmSync(outDir, { recursive: true, force: true });
process.exit(tested.status ?? 1);
