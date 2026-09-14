const requiredFields = ["full_name", "whatsapp", "city", "experience_status", "start_availability", "motivation"];
const defaultSupabaseUrl = "https://pyseksiidxtcurbxnaqp.supabase.co";
const defaultSupabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5c2Vrc2lpZHh0Y3VyYnhuYXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjQxMjgsImV4cCI6MjEwNTAwMDEyOH0.CxO0DQRkYhXLgHmmvVHHiBD0UrLc04j8gIU3XM24Kzc";

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body);
  return body;
}

function sanitizeText(value, maxLength = 800) {
  return String(value || "").trim().slice(0, maxLength);
}

function buildPayload(body) {
  return {
    full_name: sanitizeText(body.full_name, 160),
    whatsapp: sanitizeText(body.whatsapp, 40),
    email: sanitizeText(body.email, 180) || null,
    city: sanitizeText(body.city, 120),
    age: body.age ? Number(body.age) : null,
    experience_status: sanitizeText(body.experience_status, 120),
    start_availability: sanitizeText(body.start_availability, 120),
    motivation: sanitizeText(body.motivation, 1200),
    consent: Boolean(body.consent),
    source: "landing-page"
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const body = normalizeBody(req.body);

    if (body.company_website) {
      return res.status(200).json({ ok: true });
    }

    const payload = buildPayload(body);
    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length || !payload.consent) {
      return res.status(400).json({ error: "Preencha os campos obrigatórios." });
    }

    const supabaseUrl = process.env.SUPABASE_URL || defaultSupabaseUrl;
    const supabaseKey = process.env.SUPABASE_API_KEY || defaultSupabaseApiKey;
    const table = process.env.SUPABASE_CANDIDATES_TABLE || "candidates";

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: "Supabase ainda não foi configurado." });
    }

    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        authorization: `Bearer ${supabaseKey}`,
        "content-type": "application/json",
        prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({ error: "Não foi possível salvar a candidatura.", details });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao processar a candidatura." });
  }
}
