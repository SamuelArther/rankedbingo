"use strict";

// Page registry for feature modules (js/f-*.js). A module calls registerPage
// with a route name and a render function; the router, page titles, nav
// highlighting and the Fun / Learn / Join hub lists all read from here.
//
//   registerPage("morse", {
//     render: renderMorse,            // appends the page to `app`
//     title: () => T("Morse code"),   // tab title
//     hub: "fun",                     // "fun" | "learn" | "join" | "map" | null: listed on that hub page
//     tab: "branches",                // optional: nav tab to highlight (defaults to the hub)
//     icon: "📡",                     // shown on the hub card
//     blurb: () => T("Translate and race the clock."),
//   });
//
// Inside render, `route.parts` holds the path segments after the page name
// and `route.params` the query string (URLSearchParams).

const PAGES = {};

function registerPage(name, opts) {
  PAGES[name] = opts;
}

// Cards linking to every registered page on a hub, in registration order.
function hubCards(hub) {
  const pages = Object.entries(PAGES).filter(([, p]) => p.hub === hub);
  if (!pages.length) return null;
  return el("div", { class: "grid hub-grid" }, pages.map(([name, p]) =>
    el("a", { class: "branch-card hub-card", href: `#/${name}` },
      el("span", { class: "hub-icon", "aria-hidden": "true" }, p.icon || "•"),
      el("strong", {}, p.title()),
      p.blurb ? el("span", { class: "muted" }, p.blurb()) : null)));
}

// Loads a script once (for large data files a page only needs when opened).
const scriptLoads = {};

function loadScriptOnce(src) {
  if (!scriptLoads[src]) {
    scriptLoads[src] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => { delete scriptLoads[src]; reject(new Error(`load failed: ${src}`)); };
      document.head.append(s);
    });
  }
  return scriptLoads[src];
}

// Renders `fn` once `srcs` have loaded, with a placeholder meanwhile.
function withScripts(srcs, fn) {
  const page = route.page;
  const status = el("p", { class: "muted" }, T("Loading..."));
  app.append(status);
  Promise.all(srcs.map(loadScriptOnce))
    .then(() => { if (route.page === page) { status.remove(); fn(); } })
    .catch(() => { status.textContent = T("Couldn't load this page. Check your connection and try again."); });
}
