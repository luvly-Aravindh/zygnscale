import { useState, useCallback } from "react";
import { submitLead } from "../lib/leadApi";
import { buildBookingUrl, SOURCE, CONSENT_VERSION } from "../lib/booking";

const ArrowIcon = () => (
  <svg aria-hidden="true" className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
    <path d="M4 12h15m-6-6 6 6-6 6" />
  </svg>
);
const CheckIcon = () => (
  <svg aria-hidden="true" className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const COUNTRY_CODES = [
  ["+91", "India +91"], ["+971", "UAE +971"], ["+65", "SG +65"],
  ["+61", "AU +61"], ["+44", "UK +44"], ["+1", "US/CA +1"],
];
const ROLES = ["Founder / Owner", "Partner / Director", "Operations / Project Lead", "Team Member"];
const CHALLENGES = [
  "Sales follow-ups & lead visibility", "BOQs, scope changes & costing",
  "Project planning, site updates & delays", "Purchases & vendor coordination",
  "Modular production & cut lists", "Billing, costs & collections",
  "Management reporting & AI insights", "The whole workflow needs connecting",
];

const nameLetters = /[A-Za-z\u00C0-\uFFFF]/;
const firmLetters = /[A-Za-z0-9\u00C0-\uFFFF]/;
const placeholder = /^(test|testing|asdf|qwerty|dummy|sample|fake|admin|user|xxx|abc|demo|none|null)([\s._\-]*\d*)?$/i;

const EMPTY = {
  full_name: "", email: "", country_code: "+91", phone: "",
  firm_name: "", employee_count: "", role: "", challenge: "",
  consent: false, website: "",
};

function validateField(id, v) {
  const value = String(v[id] ?? "").trim();
  if (id === "full_name") {
    if (value.length < 2 || !nameLetters.test(value) || /\d/.test(value)) return "Enter your real full name.";
    if (placeholder.test(value) || /^(test|testing|dummy|fake|sample)\b/i.test(value)) return "Use your real name, not a test entry.";
  } else if (id === "email") {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    if (/^(test|testing|dummy|fake|sample)\d*@/i.test(value) || /@(example\.(com|org|net)|test\.com|mailinator\.com|invalid)$/i.test(value)) return "Use an email address where Zygn can reach you.";
  } else if (id === "phone") {
    const digits = value.replace(/\D/g, ""), code = v.country_code;
    if (/[^\d\s().-]/.test(value)) return "Enter your mobile number without a country code or letters.";
    if (code === "+91" && !/^[6-9]\d{9}$/.test(digits)) return "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.";
    if (code !== "+91" && (digits.length < 7 || digits.length > 12 || digits.length + code.replace(/\D/g, "").length > 15)) return "Enter a valid mobile number without its country code.";
    if (/^(\d)\1+$/.test(digits) || ["1234567890", "0123456789", "9876543210", "9876543211", "12345678"].includes(digits)) return "Use your real mobile number, not a placeholder.";
  } else if (id === "firm_name") {
    if (value.length < 2 || !firmLetters.test(value) || placeholder.test(value)) return "Enter your actual firm name.";
  } else if (id === "employee_count") {
    if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 100000) return "Enter a whole number of employees from 1 to 100,000.";
  } else if (id === "consent") {
    if (!v.consent) return "Please agree to sharing your details for scheduling and consultation contact.";
  } else if (id === "role" || id === "challenge") {
    if (!value) return "Please choose an option.";
  }
  return "";
}

const STEP_ONE = ["full_name", "email", "phone"];
const STEP_TWO = ["firm_name", "employee_count", "role", "challenge", "consent"];

export default function ConsultationForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });

  const setField = useCallback((id, val) => {
    setValues((s) => ({ ...s, [id]: val }));
    setErrors((e) => (e[id] ? { ...e, [id]: validateField(id, { ...values, [id]: val }) } : e));
  }, [values]);

  const validateGroup = (ids, next) => {
    const nextErrors = {};
    let ok = true;
    ids.forEach((id) => {
      const msg = validateField(id, next);
      nextErrors[id] = msg;
      if (msg) ok = false;
    });
    setErrors((e) => ({ ...e, ...nextErrors }));
    return ok;
  };

  const goStep = (n) => { setStep(n); setStatus({ text: "", error: false }); };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;
    if (step === 1) { if (validateGroup(STEP_ONE, values)) goStep(2); return; }
    if (!validateGroup(STEP_ONE, values)) { goStep(1); return; }
    if (!validateGroup(STEP_TWO, values)) return;
    if (values.website) { setStatus({ text: "Please refresh the page and try again.", error: true }); return; }

    const requestId = window.crypto?.randomUUID ? window.crypto.randomUUID()
      : "zygn-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);

    const payload = {
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.country_code + values.phone.replace(/\D/g, ""),
      firm_name: values.firm_name.trim(),
      employee_count: Number(values.employee_count),
      role: values.role,
      challenge: values.challenge,
      consent: true,
      consent_version: CONSENT_VERSION,
      consent_at: new Date().toISOString(),
      source: SOURCE,
      request_id: requestId,
      page: window.location.origin + window.location.pathname,
      honeypot: "",
    };
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      if (params.has(k)) payload[k] = params.get(k).slice(0, 250);
    });

    setSending(true);
    try {
      const destination = buildBookingUrl(payload);
      setStatus({ text: "Saving your details before opening the calendar…", error: false });
      // Capture the lead in Getnos Desk first. Duplicate is treated as success.
      const result = await submitLead(payload);
      if (result && result.status !== "success" && !result.leadId && !result.duplicate) {
        throw new Error(result.message || "Details were not accepted.");
      }
      setStatus({ text: "Opening TidyCal. Choose a date and time, then confirm your booking.", error: false });
      window.location.assign(destination);
    } catch (err) {
      setStatus({ text: "We could not open the booking calendar. Please try again. No appointment has been confirmed.", error: true });
      setSending(false);
    }
  };

  const stepLabel = step === 1 ? "STEP 1 OF 2 · YOUR DETAILS" : "STEP 2 OF 2 · YOUR FIRM";
  const heading = step === 1 ? "Let’s Start With You." : "Tell Us About Your Firm.";
  const subtitle = step === 1
    ? "Tell us who to contact. All fields marked * are required."
    : "Then choose your demo time on TidyCal. All fields marked * are required.";
  const phoneHelp = values.country_code === "+91"
    ? "India +91 is selected. Enter your number without the country code."
    : "Enter the mobile number without its country code.";

  return (
    <section className="section mint" id="consultation">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Your firm. Your workflow. Your next step.</p>
          <h2>Claim Your <span className="highlight">FREE, No-Obligation<br /> 30-Minute Consultation.</span></h2>
          <p className="lede">Tell us where work gets stuck. Let’s explore what a connected setup could look like for your business.</p>
        </div>
        <div className="offer-shell">
          <div className="offer-copy">
            <p className="kicker">Make these 30 minutes count</p>
            <h3>Bring the question<br /> you keep asking your team.</h3>
            <div className="offer-benefit"><CheckIcon /><p><b>One project or process.</b> A typical job, cut list or business-reporting question is enough to start.</p></div>
            <div className="offer-benefit"><CheckIcon /><p><b>The person who owns it.</b> Include the relevant decision-maker when practical.</p></div>
            <div className="offer-benefit"><CheckIcon /><p><b>Your current tools.</b> Discuss what should connect, what could change and what needs to be confirmed.</p></div>
            <div className="offer-summary">
              <span>Duration <b>30 minutes</b></span>
              <span>Focus <b>Your firm’s workflow</b></span>
              <span>Consultation fee <b>FREE</b></span>
            </div>
            <p className="fine">For interior designers, design-build businesses, contractors and modular manufacturers. No payment details are required to request your consultation.</p>
          </div>

          <div className="form-card">
            <div id="form-container">
              <div aria-hidden="true" className="form-progress">
                <i className="active" />
                <i className={step === 2 ? "active" : ""} />
              </div>
              <p className="form-step-label">{stepLabel}</p>
              <h3>{heading}</h3>
              <p className="form-sub">{subtitle}</p>

              <form id="consultation-form" onSubmit={handleSubmit} noValidate>
                <div aria-hidden="true" className="hp">
                  <label htmlFor="website">Leave this empty</label>
                  <input autoComplete="off" id="website" name="website" tabIndex={-1} type="text"
                    value={values.website} onChange={(e) => setField("website", e.target.value)} />
                </div>

                {step === 1 && (
                  <div>
                    <div className="field">
                      <label htmlFor="full-name">Full name <span>*</span></label>
                      <input id="full-name" autoComplete="name" maxLength={100} placeholder="Your full name" type="text"
                        aria-invalid={Boolean(errors.full_name)}
                        value={values.full_name} onChange={(e) => setField("full_name", e.target.value)}
                        onBlur={() => setErrors((er) => ({ ...er, full_name: validateField("full_name", values) }))} />
                      <span className="field-error">{errors.full_name}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email address <span>*</span></label>
                      <input id="email" autoComplete="email" maxLength={150} placeholder="you@yourfirm.com" type="email"
                        aria-invalid={Boolean(errors.email)}
                        value={values.email} onChange={(e) => setField("email", e.target.value)}
                        onBlur={() => setErrors((er) => ({ ...er, email: validateField("email", values) }))} />
                      <span className="field-error">{errors.email}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Mobile number <span>*</span></label>
                      <div className="phone-fields">
                        <select aria-label="Country calling code" id="country-code"
                          value={values.country_code} onChange={(e) => setField("country_code", e.target.value)}>
                          {COUNTRY_CODES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                        </select>
                        <input id="phone" autoComplete="tel-national" inputMode="tel" maxLength={18} placeholder="Your mobile number" type="tel"
                          aria-invalid={Boolean(errors.phone)}
                          value={values.phone} onChange={(e) => setField("phone", e.target.value)}
                          onBlur={() => setErrors((er) => ({ ...er, phone: validateField("phone", values) }))} />
                      </div>
                      <p className="input-help">{phoneHelp}</p>
                      <span className="field-error">{errors.phone}</span>
                    </div>
                    <button className="button" type="submit">
                      <span>NEXT: ABOUT YOUR FIRM</span><ArrowIcon />
                    </button>
                    <p className="form-foot">
                      <svg aria-hidden="true" className="icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24"><rect height="11" rx="2" width="14" x="5" y="10" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></svg>
                      No payment details requested.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="field">
                      <label htmlFor="firm-name">Firm name <span>*</span></label>
                      <input id="firm-name" autoComplete="organization" maxLength={150} placeholder="Your interior firm" type="text"
                        aria-invalid={Boolean(errors.firm_name)}
                        value={values.firm_name} onChange={(e) => setField("firm_name", e.target.value)}
                        onBlur={() => setErrors((er) => ({ ...er, firm_name: validateField("firm_name", values) }))} />
                      <span className="field-error">{errors.firm_name}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="employee-count">Number of employees <span>*</span></label>
                      <input id="employee-count" inputMode="numeric" max={100000} min={1} placeholder="e.g. 12" step={1} type="number"
                        aria-invalid={Boolean(errors.employee_count)}
                        value={values.employee_count} onChange={(e) => setField("employee_count", e.target.value)}
                        onBlur={() => setErrors((er) => ({ ...er, employee_count: validateField("employee_count", values) }))} />
                      <p className="input-help">Include your core in-house team. Enter 1 if you work solo.</p>
                      <span className="field-error">{errors.employee_count}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="role">Your role <span>*</span></label>
                      <select id="role" aria-invalid={Boolean(errors.role)}
                        value={values.role} onChange={(e) => setField("role", e.target.value)}>
                        <option value="">Select your role</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <span className="field-error">{errors.role}</span>
                    </div>
                    <div className="field">
                      <label htmlFor="challenge">What creates the most chasing? <span>*</span></label>
                      <select id="challenge" aria-invalid={Boolean(errors.challenge)}
                        value={values.challenge} onChange={(e) => setField("challenge", e.target.value)}>
                        <option value="">Choose your main challenge</option>
                        {CHALLENGES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <span className="field-error">{errors.challenge}</span>
                    </div>
                    <div className="consent">
                      <input id="consent" type="checkbox" aria-invalid={Boolean(errors.consent)}
                        checked={values.consent} onChange={(e) => setField("consent", e.target.checked)} />
                      <span>I agree to share these details with TidyCal for scheduling and to be contacted by Zygn about this consultation. <a href="https://zygn.app/privacy-policy/" rel="noopener noreferrer" target="_blank">Privacy policy</a></span>
                    </div>
                    <span className="field-error">{errors.consent}</span>
                    <button className="button" type="submit" disabled={sending} aria-busy={sending}>
                      <span>CHOOSE MY DEMO TIME</span><ArrowIcon />
                    </button>
                    <button className="form-back" type="button" onClick={() => goStep(1)}>← Back to contact details</button>
                    <p className="form-foot">Next: choose a date and time on TidyCal. Your slot is reserved only after you confirm the booking.</p>
                  </div>
                )}

                <p aria-live="polite" className={"form-status" + (status.error ? " error" : "")} role="status">{status.text}</p>
              </form>
            </div>
          </div>
        </div>
        <div className="steps-strip">
          <p><b>1. Tell us about your firm.</b><span>Share your contact details, team size and main challenge.</span></p>
          <p><b>2. Choose and confirm your time.</b><span>Select a date and time in TidyCal, review your details and complete the booking.</span></p>
          <p><b>3. Get ready for the conversation.</b><span>Use the next-step checklist and your booking confirmation to prepare.</span></p>
        </div>
      </div>
    </section>
  );
}
