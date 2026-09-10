# Activate the Zygn booking flow

Status: files prepared, not deployed; TidyCal account settings have not been changed.

## 1. Publish the two pages

Publish `index.html` as your landing page and `thank-you.html` as a separate HTTPS page. A proposed path, not a live deployment, is:

`https://YOUR-NETLIFY-SITE.netlify.app/thank-you.html`

The intended flow is:

Lead form -> TidyCal date/time selection -> booking confirmation -> your thank-you page.

Do not redirect merely on `select_date` or `select_time`. Those actions are not completed bookings.

## 2. What is already wired

Destination: `https://tidycal.com/marketingptgtech/30min-free-zygn-demo`

The form generates `?name=...&email=...`. TidyCal publicly documents name/email prefill. No undocumented native phone or `a1` parameter is assumed.

The phone is normalised to its international country-code form. Phone, employee count, firm, role and challenge travel in a URL fragment with a 30-minute timestamp. A fragment is not sent in the HTTP request to the remote server, but client-side scripts can read it. Do not let analytics tags collect contact details from URLs.

The additional `zygn_*` keys are part of this custom build, NOT native TidyCal parameters. They have no autofill effect without step 3.

Native prefill references:
- https://www.linkedin.com/posts/tidycal_we-just-released-another-round-of-tidycal-activity-7041800555756728320-g4Vf
- https://help.tidycal.com/article/141-embeding-tidycal-on-your-site

## 3. Activate phone and qualification-answer autofill

TidyCal defaults to name and email. Its custom intake questions collect additional information. In this booking type, open Advanced > Questions, enable questions to attendees, and create required Short text questions with these exact labels:

| Question | Value carried from this page |
| --- | --- |
| Mobile number | International phone number, including +91 or the selected code |
| Number of employees | Whole number |
| Firm name | Firm name |
| Your role | Selected role |
| Main challenge | Selected challenge |

Use Short text for the mobile question with this adapter; a specialised phone widget may split country and national number and needs separate live-DOM testing.

In TidyCal's Integrations > Analytics, connect your Google Tag Manager container. In that container, create a Custom HTML tag using the complete contents of `tidycal-prefill-gtm.html`. Fire it on DOM Ready, restricted to hostname `tidycal.com` and path `/marketingptgtech/30min-free-zygn-demo`. Test in Preview before publishing. Do not paste the tag into the landing page: it needs access to TidyCal's own rendered fields.

This is a custom DOM adapter, not a provider-guaranteed prefill API. It waits for labelled fields, fills only empty inputs, emits normal input/change events, respects later user edits and removes the fragment. Update its label mappings or explicit selectors if the booking form markup differs. Ad blockers, consent settings or provider script policy may prevent the tag from running; required visible questions remain the fallback, and users must be able to type their answers.

TidyCal documents GTM for Individual, Pro and Agency plans. Confirm your account plan before activating. The tag has not been installed in your account or verified on the live booking page.

Official references:
- https://help.tidycal.com/article/769-how-do-i-set-up-custom-intake-form-questions-pro-plan
- https://help.tidycal.com/article/140-integrations

## 4. Set the confirmed-booking redirect

In the booking type editor, open Advanced > Notifications. Enable “Redirect to custom page after booking,” paste the full deployed thank-you URL with template variables, and Save. TidyCal documents this for Individual, Pro and Agency plans and replaces variables after a booking is confirmed.

`redirect-url.txt` contains a proposed URL. Replace its base URL with your actual deployment before use. Keep the double-brace variables as written; TidyCal URL-encodes their values. Date, time and timezone must be included for the confirmation-details variant of this page. Empty meeting/reschedule variables simply hide those buttons.

Official reference:
https://help.tidycal.com/article/770-how-to-redirect-clients-to-a-custom-url-after-booking-pro-plan

The page immediately removes query parameters from the visible address and uses a no-referrer policy. Its rendered details are display-only, not server-side booking verification. Do not fire paid-ad conversions or grant access just because someone opens the page with invented query parameters. Use a real provider booking-complete signal for measurement. Configure host logging so contact query strings are not unnecessarily retained.

## 5. Verify the entire live journey

Use a team-approved test appointment and an inbox you control. Check the form on mobile and desktop; confirm that TidyCal shows the correct name, email, phone and employee count; finish the booking; inspect the saved answers and confirmation; verify the redirect's date, time and time zone; then reschedule or cancel the test appropriately. No live test appointment has been created by this build process.

The live booking page must preserve the fragment until the GTM adapter loads. Test that navigation and any redirects do so. If the provider strips fragments, work with TidyCal support or adapt the account-side integration rather than assuming the answers were saved.

## Optional: capture leads before scheduling

`ZYGN_CONFIG.leadEndpoint` is empty by default. To persist the full lead even if scheduling is abandoned, connect a trusted HTTPS backend before launch. The endpoint must validate all fields and consent, rate-limit, deduplicate `request_id`, retain only necessary data and return `{"success":true}` only after durable acceptance. The page waits for that acknowledgement before opening TidyCal. No backend, CRM integration or storage has been deployed.

Without a lead endpoint, full details are saved only through successfully completed TidyCal intake questions. Selecting a time without completing the booking does not save a confirmed appointment.
