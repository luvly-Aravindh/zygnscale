/* Getnos Desk — landing page lead submit.
   Call once per form submit. Each answer is its own JSON field.
   Extra / custom keys are saved too (firm_name, role, challenge, …).

   The API key ships in the client bundle for any frontend Desk call, so treat
   it as publishable. Set VITE_DESK_API_KEY in your environment to override the
   fallback below without editing code. Rotate the key in Getnos Desk if it has
   been exposed. */

const DESK_URL = "https://deskbackend.getnos.io/v1/lead";
const API_KEY =
  import.meta.env.VITE_DESK_API_KEY ||
  "lh_sYyoEuOOXhD_8rbSsrTVwvtht0OoKIxJxKKiIG4CeFE";

let submitting = false;

/**
 * @param {Record<string, unknown>} fields flat lead answers (any custom keys OK)
 * @returns {Promise<{status?: string, leadId?: string, duplicate?: boolean, skipped?: boolean, message?: string}>}
 */
export async function submitLead(fields) {
  if (submitting) return { duplicate: true, skipped: true };
  submitting = true;
  try {
    const res = await fetch(DESK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        form: "contact",
        honeypot: fields.honeypot || "",
        // Spread ALL form answers — known + custom fields become columns
        ...fields,
        // Email subject for this lead
        subject: "Zygn - Book Your Free Interior Business Demo",
      }),
      keepalive: true,
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Desk ignores identical payloads for ~15 min — treat as success
    if (data.duplicate) return data;

    if (!res.ok) {
      throw new Error(data.message || `Lead submit failed (${res.status})`);
    }

    return data; // { status: "success", leadId }
  } finally {
    submitting = false;
  }
}