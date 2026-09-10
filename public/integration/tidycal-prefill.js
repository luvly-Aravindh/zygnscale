/* INSTALL IN TIDYCAL'S GOOGLE TAG MANAGER CONTAINER, NOT ON THE LANDING PAGE.
   Run as a Custom HTML tag on DOM Ready, exact booking path only.
   This adapter uses the DOM, not an official TidyCal custom-question-prefill API.
   Verify it against your live booking form after installing or changing questions.
   No network request, analytics event, booking confirmation or storage writes.
*/
(function () {
  'use strict';
  if (window.location.hostname !== 'tidycal.com' || window.location.pathname.replace(/\/$/, '') !== '/marketingptgtech/30min-free-zygn-demo') return;
  if (window.__zygnHandoffInstalled) return;
  var params = new URLSearchParams(window.location.hash.slice(1));
  if (params.get('zygn_handoff') !== '1') return;
  var timestamp = Number(params.get('zygn_created_at'));
  if (!timestamp || Math.abs(Date.now() - timestamp) > 30 * 60 * 1000) return;
  window.__zygnHandoffInstalled = true;
  var definitions = [
    {key:'zygn_phone', labels:['mobile number','phone number'], selector:'', max:20},
    {key:'zygn_employee_count', labels:['number of employees','no of employees','no. of employees'], selector:'', max:6},
    {key:'zygn_firm', labels:['firm name'], selector:'', max:150},
    {key:'zygn_role', labels:['your role'], selector:'', max:100},
    {key:'zygn_challenge', labels:['main challenge','what creates the most chasing?'], selector:'', max:250}
  ];
  // Configure exact CSS selectors above only if labels in your live form differ.
  var values = {};
  definitions.forEach(function (d) {
    var value = (params.get(d.key) || '').slice(0, d.max);
    if (d.key === 'zygn_phone' && !/^\+[1-9]\d{6,14}$/.test(value)) value = '';
    if (d.key === 'zygn_employee_count' && !/^[1-9]\d{0,5}$/.test(value)) value = '';
    values[d.key] = value;
  });
  // Drop the fragment promptly. Name/email native query parameters are left for
  // TidyCal to consume. Ensure unrelated GTM tags do not collect URL query PII.
  try {window.history.replaceState(null, '', window.location.pathname + window.location.search);} catch (e) {}
  var visited = new WeakSet(), touched = new WeakSet(), observedOnce = {};
  var pending = false, stopped = false;
  function normalise(t) {return String(t || '').replace(/[＊*]/g, '').replace(/\(required\)/ig, '').replace(/:\s*$/, '').replace(/\s+/g, ' ').trim().toLowerCase();}
  function labelFor(el) {
    var texts = [];
    if (el.labels) Array.prototype.forEach.call(el.labels, function (l) {texts.push(l.textContent);});
    if (el.getAttribute('aria-label')) texts.push(el.getAttribute('aria-label'));
    var ids = (el.getAttribute('aria-labelledby') || '').split(/\s+/);
    ids.forEach(function (id) {var l = document.getElementById(id); if (l) texts.push(l.textContent);});
    return texts.map(normalise);
  }
  function visible(el) {return !el.disabled && !el.readOnly && el.type !== 'hidden' && el.getClientRects().length > 0;}
  function match(def) {
    if (def.selector) {var exact = document.querySelector(def.selector); return exact && visible(exact) ? exact : null;}
    var fields = document.querySelectorAll('input:not([type=hidden]),textarea,select');
    for (var i=0; i<fields.length; i++) {
      var field = fields[i];
      if (visible(field) && labelFor(field).some(function (t) {return def.labels.indexOf(t) !== -1;})) return field;
    }
    return null;
  }
  function assign(el, value) {
    var proto, next = value;
    if (el.tagName === 'SELECT') {
      var options = Array.prototype.slice.call(el.options);
      var option = options.find(function (o) {return o.value === value || normalise(o.textContent) === normalise(value);});
      if (!option) return false;
      next = option.value; proto = HTMLSelectElement.prototype;
    } else if (el.tagName === 'TEXTAREA') proto = HTMLTextAreaElement.prototype;
    else proto = HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, next);
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change', {bubbles:true}));
    return true;
  }
  function run() {
    pending = false; if (stopped) return;
    definitions.forEach(function (d) {
      if (!values[d.key]) return;
      var el = match(d);
      if (!el || visited.has(el) || touched.has(el)) return;
      // Never replace typed information or the app's own filled answer.
      if (String(el.value || '').trim()) {visited.add(el); return;}
      if (assign(el, values[d.key])) {visited.add(el); observedOnce[d.key] = true;}
    });
  }
  document.addEventListener('input', function (event) {if (event.isTrusted && event.target) touched.add(event.target);}, true);
  function queue() {if (!pending && !stopped) {pending = true; setTimeout(run, 60);}}
  var observer = new MutationObserver(queue);
  observer.observe(document.documentElement, {childList:true,subtree:true,attributes:true,attributeFilter:['hidden','aria-hidden','class','style','disabled']});
  run();
  // Covers delayed rendering when a date/time is chosen. No polling loop.
  setTimeout(function () {stopped = true; observer.disconnect();}, 30 * 60 * 1000);
})();
