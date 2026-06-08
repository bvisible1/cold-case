// supabase-client.js — frontend-direct Supabase capture (append-only).
//
// Writes completed calls + final runs straight from the browser using the
// PUBLIC anon key. RLS on the database allows INSERT only (no reads), so the
// anon key is safe to ship here. To read/parse the data, use the Supabase
// dashboard or a server-side service key — never the anon key.
//
// SETUP: create a Supabase project, run docs/supabase-schema.sql in its SQL
// editor, then paste the project URL + anon key below.
window.HEIST_DB = (() => {
  const CONFIG = {
    url: "",            // e.g. "https://abcdefgh.supabase.co"
    anonKey: "",        // the "anon public" key from Project Settings → API
    companyId: "dynatrace",
  };

  let client = null;
  function getClient() {
    if (client) return client;
    if (!CONFIG.url || !CONFIG.anonKey) {
      console.info("[HEIST_DB] Supabase not configured — capture disabled.");
      return null;
    }
    if (!window.supabase || !window.supabase.createClient) {
      console.warn("[HEIST_DB] supabase-js not loaded.");
      return null;
    }
    client = window.supabase.createClient(CONFIG.url, CONFIG.anonKey);
    return client;
  }

  // Save one finished conversation (cold call or discovery) with its transcript.
  async function saveCall({ playId, teamId, mode, personaId, personaName, personaTitle, transcript, score }) {
    const c = getClient();
    if (!c) return;
    try {
      const { error } = await c.from("calls").insert({
        play_id: playId || null,
        company_id: CONFIG.companyId,
        team_id: teamId || null,
        mode: mode || null,
        persona_id: personaId || null,
        persona_name: personaName || null,
        persona_title: personaTitle || null,
        score: score || null,
        transcript: transcript || [],
      });
      if (error) console.warn("[HEIST_DB] saveCall error", error);
    } catch (e) {
      console.warn("[HEIST_DB] saveCall failed", e);
    }
  }

  // Save the final playthrough summary (the Findings page snapshot).
  async function saveRun({ playId, teamId, account, dealTier, arrValue, totalPoints, ice, phases, summary }) {
    const c = getClient();
    if (!c) return;
    try {
      const { error } = await c.from("runs").insert({
        play_id: playId || null,
        company_id: CONFIG.companyId,
        team_id: teamId || null,
        scenario_account: account || null,
        deal_tier: dealTier || null,
        arr_value: arrValue ?? null,
        total_points: totalPoints ?? null,
        ice: ice || null,
        phases: phases || null,
        summary: summary || null,
      });
      if (error) console.warn("[HEIST_DB] saveRun error", error);
    } catch (e) {
      console.warn("[HEIST_DB] saveRun failed", e);
    }
  }

  return { saveCall, saveRun, _config: CONFIG };
})();
