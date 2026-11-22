(function () {
  const orgs = window.ORGS || [];
  const types = window.ORG_TYPES || {};
  const $ = (id) => document.getElementById(id);
  const listEl = $("org-list"), filtersEl = $("org-filters"), countEl = $("org-count"),
        searchEl = $("org-search"), nopinEl = $("org-nopin");

  let activeType = "all", query = "";
  const markers = new Map();

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---- Map -------------------------------------------------------------
  const map = L.map("org-map", { scrollWheelZoom: false }).setView([12.6, 122.5], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const pin = L.divIcon({
    className: "org-pin",
    html: '<svg viewBox="0 0 24 32" width="26" height="34" aria-hidden="true"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 32 12 32s12-12 12-20.3C24 5.2 18.6 0 12 0z"/><circle cx="12" cy="11.5" r="4.5"/></svg>',
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30]
  });

  orgs.forEach((o) => {
    if (!o.coords) return;
    const m = L.marker(o.coords, { icon: pin, title: o.name, keyboard: true })
      .bindPopup(`<strong>${esc(o.name)}</strong><br>${esc(o.region)}<br><a href="#${esc(o.id)}" data-focus="${esc(o.id)}">See in list</a>${o.url ? ` · <a href="${esc(o.url)}" target="_blank" rel="noopener">Website ↗</a>` : ""}`);
    m.on("click", () => highlight(o.id, false));
    markers.set(o.id, m);
  });

  // ---- Filters ---------------------------------------------------------
  const typeKeys = Object.keys(types);
  filtersEl.innerHTML = [["all", "All"]].concat(typeKeys.map((k) => [k, types[k]]))
    .map(([k, label]) => `<button type="button" class="chip" data-type="${k}" aria-pressed="${k === "all"}">${esc(label)}</button>`).join("");

  filtersEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-type]");
    if (!b) return;
    activeType = b.dataset.type;
    filtersEl.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    render();
  });
  searchEl.addEventListener("input", () => { query = searchEl.value.trim().toLowerCase(); render(); });

  // ---- List ------------------------------------------------------------
  function matches(o) {
    if (activeType !== "all" && o.type !== activeType) return false;
    if (!query) return true;
    return [o.name, o.region, o.about, (o.offers || []).join(" "), types[o.type]].join(" ").toLowerCase().includes(query);
  }

  function card(o) {
    const locate = o.coords ? `<button type="button" class="org-locate" data-locate="${esc(o.id)}">Show on map</button>` : `<span class="org-nomap">No fixed location</span>`;
    const site = o.url ? `<a class="org-site" href="${esc(o.url)}" target="_blank" rel="noopener">Website ↗</a>` : "";
    return `<li class="org-card" id="${esc(o.id)}" data-type="${esc(o.type)}">
      <div class="org-top"><span class="org-type" data-type="${esc(o.type)}">${esc(types[o.type] || o.type)}</span></div>
      <h3>${esc(o.name)}</h3>
      <p class="org-region">${esc(o.region)}</p>
      <p>${esc(o.about)}</p>
      <ul class="org-tags">${(o.offers || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="org-actions">${locate}${site}</div>
    </li>`;
  }

  function render() {
    const shown = orgs.filter(matches);
    listEl.innerHTML = shown.length ? shown.map(card).join("") : '<li class="org-empty">Nothing matches. Try a different word or filter.</li>';
    countEl.textContent = `${shown.length} of ${orgs.length} organizations`;

    const group = [];
    markers.forEach((m, id) => {
      if (shown.some((o) => o.id === id)) { m.addTo(map); group.push(m.getLatLng()); } else { map.removeLayer(m); }
    });
    const unpinned = shown.filter((o) => !o.coords).length;
    nopinEl.textContent = unpinned ? `${unpinned} shown here have no fixed location (nationwide or online).` : "";
    if (group.length > 1) map.fitBounds(L.latLngBounds(group).pad(0.25), { maxZoom: 10 });
    else if (group.length === 1) map.setView(group[0], 10);
  }

  function highlight(id, scroll) {
    listEl.querySelectorAll(".org-card.is-active").forEach((c) => c.classList.remove("is-active"));
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-active");
    if (scroll) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
  }

  document.addEventListener("click", (e) => {
    const loc = e.target.closest("[data-locate]");
    if (loc) {
      const m = markers.get(loc.dataset.locate);
      if (m) { map.setView(m.getLatLng(), 13); m.openPopup(); highlight(loc.dataset.locate, false); $("org-map").scrollIntoView({ block: "nearest" }); }
    }
    const f = e.target.closest("[data-focus]");
    if (f) { e.preventDefault(); highlight(f.dataset.focus, true); }
  });

  render();

  // ---- Submit an organization ------------------------------------------
  const dialog = $("org-dialog"), form = $("org-form"), note = $("org-form-note"), select = $("org-type-select");
  select.innerHTML = '<option value="">Not sure</option>' + typeKeys.map((k) => `<option value="${esc(types[k])}">${esc(types[k])}</option>`).join("");

  $("org-submit-open").addEventListener("click", () => { note.textContent = ""; dialog.showModal(); });
  dialog.querySelector(".org-cancel").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Same Apps Script web app as the newsletter (const lives in js/main.js).
    const endpoint = typeof NEWSLETTER_ENDPOINT !== "undefined" ? NEWSLETTER_ENDPOINT : "";
    if (!endpoint) { note.textContent = "Submissions aren't open yet. Please check back soon."; return; }
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    note.textContent = "Sending…";
    try {
      const res = await fetch(endpoint, { method: "POST", body: new FormData(form) });
      const data = await res.json();
      if (data.result !== "success") throw new Error(data.error || "rejected");
      form.reset();
      note.textContent = "Thank you! We'll review it and add it to the directory.";
    } catch {
      note.textContent = "That didn't go through. Please try again in a bit.";
    } finally {
      button.disabled = false;
    }
  });
})();
