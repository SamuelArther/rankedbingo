"use strict";

// Installation map: well-known U.S. military installations worldwide, one
// pin per site in its branch's color. Leaflet and the site list
// (js/bases-data.js, built by tools/build_bases.py) load only on this page.

const LEAFLET = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/";
const LEAFLET_JS_SRI = "sha512-puJW3E/qXDqYp9IfhAI54BJEaWIfloJ7JWs7OeD5i6ruC9JZL1gERT1wjtwXFlh7CjE7ZJ+/vcRZRkIYIb6p4g==";
const LEAFLET_CSS_SRI = "sha512-h9FcoyWjHcOcmEVkxOfTLnmZFWIH0iZhZT1H2TbOq55xssQGEJHEaIm+PgoUaZbRvQTNTluNOEfb1ZRy6D3BOw==";
// Standard OpenStreetMap tiles (free with credit; dark mode recolors them in CSS).
const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BASE_TYPES = {
  base: T("Base"), airfield: T("Airfield"), naval: T("Naval base"), training: T("Training area or range"), industrial: T("Depot or industrial site"),
  research: T("Test and research site"), office: T("Headquarters or offices"), space: T("Space or radar station"), center: T("Reserve or Guard center"),
};

// Defense Department-wide sites (the Pentagon and a few agencies) have no
// branch, so they get a neutral pin and are always shown.
const DOD_COLOR = "#9aa39a";

function siteBranch(site) {
  return site.b === "dod" ? { name: T("Defense Department"), color: DOD_COLOR } : BRANCHES[site.b];
}

let mapLoading = null;

function loadMapLibs() {
  if (window.L && window.BASES) return Promise.resolve();
  if (!mapLoading) {
    const css = el("link", { rel: "stylesheet", href: `${LEAFLET}leaflet.min.css`, integrity: LEAFLET_CSS_SRI, crossorigin: "anonymous" });
    document.head.append(css);
    const script = (src, sri) => new Promise((resolve, reject) => {
      const s = el("script", { src, ...(sri ? { integrity: sri, crossorigin: "anonymous" } : {}) });
      s.onload = resolve;
      s.onerror = () => reject(new Error(`load failed: ${src}`));
      document.head.append(s);
    });
    mapLoading = Promise.all([script(`${LEAFLET}leaflet.min.js`, LEAFLET_JS_SRI), script("js/bases-data.js")])
      .catch((e) => { mapLoading = null; throw e; });
  }
  return mapLoading;
}

function mapsLink(site) {
  return `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`;
}

function basePopup(site) {
  const info = siteBranch(site);
  return el("div", { class: "base-popup", style: `--hero:${info.color}` },
    el("div", { class: "job-path" }, site.b === "dod" ? info.name : [info.name, COMPONENTS[site.c].name].join(" · ")),
    el("strong", {}, site.n),
    el("div", { class: "muted" }, `${BASE_TYPES[site.t]} · ${site.loc}`),
    el("p", {}, site.d),
    el("a", { href: mapsLink(site), target: "_blank", rel: "noopener" }, T("Open in Google Maps ↗")));
}

function renderMap() {
  const holder = el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, T("Explore")),
    el("h1", {}, T("Installation map")),
    el("p", { class: "muted" }, T("U.S. military bases, airfields and training areas around the world. Tap a pin to see what it does.")));
  const status = el("p", { class: "muted" }, T("Loading the map..."));
  holder.append(status);
  app.append(holder);
  loadMapLibs()
    .then(() => { if (route.page === "map") { status.remove(); drawMap(holder); } })
    .catch(() => { status.textContent = T("Couldn't load the map. Check your connection and try again."); });
}

function drawMap(holder) {
  const shown = new Set(ORDER.includes(route.branch) ? [route.branch] : ORDER);
  let component = "all";
  const search = el("input", { class: "text-input", type: "search", placeholder: T("Search by name, state or country"), "aria-label": T("Search installations") });
  const count = el("p", { class: "muted", style: "font-size:14px; margin:8px 0" });
  const results = el("div", { class: "job-list" });
  const box = el("div", { class: "map-box" });

  const chips = el("div", { class: "chips", role: "group", "aria-label": T("Branches") });
  const drawChips = () => chips.replaceChildren(...ORDER.map((b) => el("button", {
    type: "button", class: "chip-btn map-chip" + (shown.has(b) ? " active" : ""), style: `--hero:${BRANCHES[b].color}`, "aria-pressed": String(shown.has(b)),
    onclick: () => { if (shown.has(b) && shown.size > 1) shown.delete(b); else shown.add(b); drawChips(); update(); },
  }, el("span", { class: "map-dot", "aria-hidden": "true" }), BRANCHES[b].name)));
  drawChips();

  const components = el("div", { class: "seg", role: "group", "aria-label": T("Service type") });
  const drawComponents = () => components.replaceChildren(...["all", ...COMPONENT_ORDER].map((c) => el("button", {
    type: "button", class: "seg-item" + (component === c ? " active" : ""), "aria-pressed": String(component === c),
    onclick: () => { component = c; drawComponents(); update(); },
  }, c === "all" ? T("All") : COMPONENTS[c].name)));
  drawComponents();

  holder.append(chips, components, el("div", { style: "margin-top:12px" }, search), count, box, results,
    el("p", { class: "muted", style: "font-size:13px; margin-top:16px" },
      T("U.S. sites come from the Defense Department's public list of installations (fiscal year 2024, with 2025 name changes). Overseas and Coast Guard sites were added from official base websites. Pins mark the main area of each site, not its exact boundary.")));

  const narrow = matchMedia("(max-width: 600px)").matches;
  const map = L.map(box, { preferCanvas: true, worldCopyJump: true, zoomControl: true }).setView([38, -97], narrow ? 3 : 4);
  L.tileLayer(TILES, { maxZoom: 18, attribution: TILE_CREDIT }).addTo(map);
  const markers = window.BASES.map((site) => {
    const color = siteBranch(site).color;
    const marker = L.circleMarker([site.lat, site.lng], { radius: 6, color: "#0b0f0c", weight: 1, fillColor: color, fillOpacity: 0.9 });
    marker.bindPopup(() => basePopup(site), { maxWidth: 280 });
    marker.bindTooltip(site.n, { direction: "top", offset: [0, -6] });
    return { site, marker, text: `${site.n} ${site.loc}`.toLowerCase() };
  });

  // Smaller pins when zoomed out, so crowded areas stay readable.
  const pinSize = () => (map.getZoom() < 5 ? 4 : map.getZoom() < 8 ? 6 : 8);
  map.on("zoomend", () => { const r = pinSize(); for (const m of markers) m.marker.setRadius(r); });
  for (const m of markers) m.marker.setRadius(pinSize());

  const focus = (m) => {
    map.flyTo([m.site.lat, m.site.lng], Math.max(map.getZoom(), 10), { duration: 0.8 });
    m.marker.openPopup();
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  function update() {
    const q = search.value.trim().toLowerCase();
    const visible = [];
    for (const m of markers) {
      const on = (shown.has(m.site.b) || m.site.b === "dod") && (component === "all" || m.site.c === component) && (!q || m.text.includes(q));
      if (on) { visible.push(m); if (!map.hasLayer(m.marker)) m.marker.addTo(map); }
      else if (map.hasLayer(m.marker)) m.marker.remove();
    }
    count.textContent = T("Showing {count} of {total} installations", { count: visible.length, total: markers.length });
    // A short list for searches, so the right pin can be picked without hunting.
    results.replaceChildren(...(q ? visible.slice(0, 12) : []).map((m) => el("button", {
      type: "button", class: "job-row", style: `--hero:${siteBranch(m.site).color}`, onclick: () => focus(m),
    }, el("span", { class: "job-row-text" }, el("strong", {}, m.site.n), el("span", { class: "muted" }, `${siteBranch(m.site).name} · ${m.site.loc}`)))));
  }
  search.addEventListener("input", update);
  update();
  // The container's size settles after layout; tell Leaflet once it has.
  requestAnimationFrame(() => map.invalidateSize());
}
