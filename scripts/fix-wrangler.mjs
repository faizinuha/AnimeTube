/**
 * Postbuild script: fix generated wrangler.json
 *
 * @cloudflare/vite-plugin generates wrangler.json with fields that are
 * invalid for Cloudflare Pages deployment. This script removes them.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

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

const INVALID_DEV_FIELDS = ["enable_containers", "generate_types"];

function patchFile(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const config = JSON.parse(raw);
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
    if (Object.keys(config.dev).length === 0) {
      delete config.dev;
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(`[fix-wrangler] ✅ Patched: ${filePath}`);
  } else {
    console.log(`[fix-wrangler] No changes needed: ${filePath}`);
  }
}

// Try .cloudflare/ first (new plugin output), then dist/client/ (fallback)
const candidates = [
  resolve(process.cwd(), ".cloudflare/wrangler.json"),
  resolve(process.cwd(), "dist/client/wrangler.json"),
];

let found = false;
for (const p of candidates) {
  if (existsSync(p)) {
    patchFile(p);
    found = true;
  }
}

if (!found) {
  console.log("[fix-wrangler] No wrangler.json found — skipping.");
}
