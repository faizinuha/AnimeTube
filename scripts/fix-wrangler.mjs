/**
 * Postbuild script: fix dist/client/wrangler.json
 *
 * @cloudflare/vite-plugin generates wrangler.json with `triggers: {}`
 * which is invalid for Cloudflare Pages deployment (it expects
 * `triggers: { crons: [] }` or the field to be absent entirely).
 *
 * This script removes the invalid `triggers` field and any other
 * unknown top-level fields that cause Pages validation to fail.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const WRANGLER_PATH = resolve(process.cwd(), "dist/client/wrangler.json");

if (!existsSync(WRANGLER_PATH)) {
  console.log("[fix-wrangler] dist/client/wrangler.json not found — skipping.");
  process.exit(0);
}

const raw = readFileSync(WRANGLER_PATH, "utf-8");
const config = JSON.parse(raw);

// Fields that Cloudflare Pages validator rejects
const INVALID_TOP_LEVEL = [
  "triggers",
  "definedEnvironments",
  "ai_search_namespaces",
  "ai_search",
  "secrets_store_secrets",
  "artifacts",
  "unsafe_hello_world",
  "flagship",
  "worker_loaders",
  "ratelimits",
  "vpc_services",
  "vpc_networks",
  "python_modules",
];

// Fields that Cloudflare Pages validator rejects inside "dev"
const INVALID_DEV_FIELDS = ["enable_containers", "generate_types"];

let changed = false;

for (const field of INVALID_TOP_LEVEL) {
  if (field in config) {
    delete config[field];
    changed = true;
    console.log(`[fix-wrangler] Removed top-level field: ${field}`);
  }
}

if (config.dev && typeof config.dev === "object") {
  for (const field of INVALID_DEV_FIELDS) {
    if (field in config.dev) {
      delete config.dev[field];
      changed = true;
      console.log(`[fix-wrangler] Removed dev.${field}`);
    }
  }
  // Remove empty dev object
  if (Object.keys(config.dev).length === 0) {
    delete config.dev;
    changed = true;
  }
}

if (changed) {
  writeFileSync(WRANGLER_PATH, JSON.stringify(config, null, 2));
  console.log("[fix-wrangler] ✅ wrangler.json patched successfully.");
} else {
  console.log("[fix-wrangler] No changes needed.");
}
