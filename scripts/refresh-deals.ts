/**
 * scripts/refresh-deals.ts — Regenerate client/src/data/deals.json
 *
 * Run manually:
 *   pnpm run deals:refresh
 *
 * Run in CI (GitHub Actions, weekly cron):
 *   See .github/workflows/refresh-deals.yml
 *
 * When BUILT_IN_FORGE_API_KEY is set the LLM generates fresh deal content.
 * Without it the script writes the deterministic mock fallback (still useful
 * for resetting the file to a known-good state after hand-edits).
 */

import "dotenv/config";
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDeals } from "../server/deals.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../client/src/data/deals.json");

async function main() {
  console.log("🔄  Refreshing deals data…");

  const data = await generateDeals();

  writeFileSync(OUT_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");

  console.log(
    `✅  Wrote ${data.deals.length} deals to client/src/data/deals.json (source: ${data.source})`
  );
  console.log(`    updatedAt: ${data.updatedAt}`);
}

main().catch(err => {
  console.error("❌  refresh-deals failed:", err);
  process.exit(1);
});
