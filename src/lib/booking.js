// Builds the TidyCal booking URL: name/email as native query params, the extra
// answers as a short-lived URL fragment consumed by the account-side GTM tag
// (see /integration). Mirrors the original v7 handoff exactly.

export const BOOKING_URL =
  "https://tidycal.com/marketingptgtech/30min-free-zygn-demo";
export const SOURCE = "zygn-consultation-long-form-react";
export const CONSENT_VERSION = "zygn-consultation-tidycal-contact-v2";

export function buildBookingUrl(payload) {
  const url = new URL(BOOKING_URL);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "tidycal.com" ||
    url.pathname.replace(/\/$/, "") !== "/marketingptgtech/30min-free-zygn-demo"
  ) {
    throw new Error("Unexpected booking destination.");
  }
  url.searchParams.set("name", payload.full_name);
  url.searchParams.set("email", payload.email);

  const handoff = new URLSearchParams();
  handoff.set("zygn_handoff", "1");
  handoff.set("zygn_created_at", String(Date.now()));
  handoff.set("zygn_phone", payload.phone);
  handoff.set("zygn_employee_count", String(payload.employee_count));
  handoff.set("zygn_firm", payload.firm_name);
  handoff.set("zygn_role", payload.role);
  handoff.set("zygn_challenge", payload.challenge);
  url.hash = handoff.toString();
  return url.href;
}
