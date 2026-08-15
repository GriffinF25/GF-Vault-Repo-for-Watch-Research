// Upserts a weekly-research baselines sidecar (see
// gf-vault/agents/watch-market-research-agent.md's "Integration with Memory"
// section) into the live reference_baselines table. Run from Griffin's own
// machine — the Supabase CLI session and SUPABASE_SERVICE_ROLE_KEY live
// there, not in any cloud sandbox this workspace's routines run in.
//
// Usage:
//   deno run --allow-net --allow-read --allow-env sync-baselines.ts <path-to-baselines.json>
//
// Example:
//   deno run --allow-net --allow-read --allow-env sync-baselines.ts \
//     ../../reports/weekly-market-research-2026-08-17.baselines.json

import { createClient } from "npm:@supabase/supabase-js@^2.45.0";

const path = Deno.args[0];
if (!path) {
  console.error("Usage: sync-baselines.ts <path-to-baselines.json>");
  Deno.exit(1);
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!supabaseUrl || !serviceRoleKey) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the environment.");
  Deno.exit(1);
}

const rows = JSON.parse(await Deno.readTextFile(path));
if (!Array.isArray(rows) || rows.length === 0) {
  console.error(`${path} did not contain a non-empty array of baseline rows — nothing to sync.`);
  Deno.exit(1);
}

const client = createClient(supabaseUrl, serviceRoleKey);
const { error } = await client
  .from("reference_baselines")
  .upsert(rows, { onConflict: "normalized_reference" });

if (error) {
  console.error("Sync failed:", error);
  Deno.exit(1);
}

console.log(`Synced ${rows.length} baseline row(s) from ${path}`);
