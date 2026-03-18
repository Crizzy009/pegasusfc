function requireSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    const err = new Error("supabase_not_configured");
    err.statusCode = 500;
    throw err;
  }
  return { url, serviceKey };
}

async function supabaseRest(path, options) {
  const { url, serviceKey } = requireSupabase();
  const res = await fetch(`${url}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const text = await res.text().catch(() => "");
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(typeof json?.message === "string" ? json.message : "supabase_error");
    err.statusCode = res.status;
    throw err;
  }
  return json;
}

export async function listPlayers() {
  return supabaseRest("/players?select=id,data_json,created_at,updated_at&order=updated_at.desc", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
}

export async function insertPlayer(row) {
  return supabaseRest("/players", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify([row]),
  });
}

export async function updatePlayer(id, patch) {
  return supabaseRest(`/players?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
}

export async function deletePlayer(id) {
  return supabaseRest(`/players?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
}

