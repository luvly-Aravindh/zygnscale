# Zygn — React + Vite + Tailwind

Landing page converted from the static Netlify build to a componentised React app.

## Run
```
npm install
npm run dev        # local dev
npm run build      # production build -> dist/
npm run preview    # serve the build
```

## Structure
- `src/sections/*` — one component per page section (UrgencyBand, Masthead, Hero,
  FinallyLetter, Blueprint, Platform, DiscoverAgenda, ConfidencePromise,
  ConsultationForm, Questions, FinalClose, SiteFooter, StickyBar).
- `src/lib/leadApi.js` — Getnos Desk lead submit (`submitLead`).
- `src/lib/booking.js` — TidyCal booking-URL builder (name/email query + handoff hash).
- `src/styles/zygn.css` — the original bespoke, responsive design (mobile/tablet/desktop
  breakpoints preserved 1:1). Tailwind is configured with the brand palette and its
  utilities are available; preflight is disabled so it doesn't clobber this layer.
- `public/` — `thank-you.html`, Netlify `_redirects`/`_headers`, and `integration/`
  (the account-side TidyCal GTM tag + redirect template).

## Lead flow
On submit the form validates, POSTs the lead to Getnos Desk
(`https://deskbackend.getnos.io/v1/lead`, `form:"contact"`, bearer key,
duplicate treated as success), then redirects to TidyCal with the booking handoff.

## API key
`src/lib/leadApi.js` reads `VITE_DESK_API_KEY` (see `.env.example`) and falls back to
the provided key. The key ships in the client bundle for any frontend Desk call, so
treat it as publishable and rotate it in Getnos Desk since it was shared in plaintext.

## TidyCal
Set the booking type's post-booking redirect to your deployed `/thank-you.html`
(template in `public/integration/redirect-url.txt`) and install the GTM prefill tag
(`public/integration/tidycal-prefill.js`) account-side. See `public/integration/TIDYCAL_SETUP.md`.
