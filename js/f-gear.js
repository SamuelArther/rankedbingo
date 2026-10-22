"use strict";

// Gear group pages: vehicles, aircraft and ships (#/gear/<branch>), uniforms
// (#/uniforms/<branch>), birthdays and traditions (#/traditions) and the
// acronym decoder (#/acronyms). Research content loads on demand from
// js/f-gear-data.js and js/f-gear-acronyms.js and stays in English.

const GEAR_DATA_JS = "js/f-gear-data.js";
const GEAR_ACR_JS = "js/f-gear-acronyms.js";

const GEAR_STATUS = {
  service: () => T("In service"),
  new: () => T("Being built or delivered"),
  dev: () => T("In development or testing"),
  retiring: () => T("Being retired"),
};

const GEAR_KINDS = {
  land: () => T("Land"),
  air: () => T("Air"),
  sea: () => T("Sea"),
  space: () => T("Space"),
  ground: () => T("Ground systems"),
};

// Marks research text as English when the page is shown in another language.
function gearEn(attrs = {}) {
  return LANG === "en" ? attrs : { ...attrs, lang: "en" };
}

function gearHeader(eyebrow, title, blurb) {
  return el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, eyebrow),
    el("h1", {}, title),
    el("p", { class: "muted" }, blurb));
}

// Branch switcher shared by the gear and uniform pages.
function gearBranchNav(page, current) {
  return el("nav", { class: "seg gear-tabs", "aria-label": T("Choose a branch") },
    ORDER.map((b) => el("a", {
      class: `seg-item${b === current ? " active" : ""}`,
      href: `#/${page}/${b}`,
      "aria-current": b === current ? "page" : null,
    }, BRANCHES[b].name)));
}

function gearSources(urls) {
  const list = Array.isArray(urls) ? urls : [urls];
  return el("details", { class: "gear-sources" },
    el("summary", {}, T("Sources")),
    el("ul", {}, list.map((u) => el("li", {}, el("a", { href: u, target: "_blank", rel: "noopener" }, u.replace(/^https?:\/\/(www\.)?/, ""))))));
}

// Toggle buttons used as filters; `onPick` gets the chosen value.
function gearFilter(label, options, current, onPick) {
  return el("div", { class: "seg gear-filter", role: "group", "aria-label": label },
    options.map(([value, text]) => el("button", {
      type: "button",
      class: `seg-item${value === current ? " active" : ""}`,
      "aria-pressed": value === current ? "true" : "false",
      onclick: () => onPick(value),
    }, text)));
}

// ---------------------------------------------------------------------------
// Vehicles, aircraft and ships.

function renderGear() {
  const branch = route.branch || "army";
  app.append(gearHeader(T("Learn"), T("What each branch drives, flies and sails"),
    T("The main vehicles, aircraft, ships and space systems each branch uses today, with what they do and where they stand.")));
  withScripts([GEAR_DATA_JS], () => drawGear(branch));
}

function drawGear(branch) {
  const data = window.F_GEAR.gear[branch];
  const color = BRANCHES[branch].color;
  const kinds = Object.keys(GEAR_KINDS).filter((k) => data.items.some((it) => it.k === k));
  let kind = "all";
  const grid = el("div", { class: "gear-grid" });
  const filterHolder = el("div", {});

  const draw = () => {
    filterHolder.replaceChildren(gearFilter(T("Filter by type"),
      [["all", T("All")], ...kinds.map((k) => [k, GEAR_KINDS[k]()])], kind, (v) => { kind = v; draw(); }));
    grid.replaceChildren(...data.items.filter((it) => kind === "all" || it.k === kind).map((it) =>
      el("article", gearEn({ class: "gear-card", style: `--hero:${color}` }),
        el("div", { class: "gear-card-top" },
          el("span", { class: "gear-icon", "aria-hidden": "true" }, it.ic),
          el("div", { class: "gear-card-title" },
            el("div", { class: "job-path" }, GEAR_KINDS[it.k]()),
            el("h3", {}, it.n))),
        el("p", {}, it.what),
        el("p", { class: "gear-fact" }, el("strong", {}, T("Fun fact:")), " ", it.fact),
        el("div", { class: `gear-status gear-st-${it.st}` },
          el("span", { class: "gear-badge" }, el("span", { class: "gear-dot", "aria-hidden": "true" }), GEAR_STATUS[it.st]()),
          it.sn ? el("p", {}, it.sn) : null))));
  };
  draw();

  app.append(el("div", { class: "fade-in" },
    gearBranchNav("gear", branch),
    el("h2", { class: "gear-h2", style: `--hero:${color}` }, BRANCHES[branch].name),
    filterHolder,
    grid,
    el("p", { class: "muted gear-small" }, T("Status as of October 2026. Programs change often, so check the branch's official site for the latest.")),
    gearSources(data.source),
    el("div", { class: "actions" },
      el("a", { class: "button", href: `#/uniforms/${branch}` }, T("{branch} uniforms", { branch: BRANCHES[branch].name })),
      el("a", { class: "button", href: branchLink(branch) }, T("About the {branch}", { branch: BRANCHES[branch].name })))));
}

// ---------------------------------------------------------------------------
// Uniforms.

// Camouflage gets blotches; other uniforms show their colors side by side.
function gearSwatchStyle(colors, camo) {
  if (colors.length === 1) return `background:${colors[0]}`;
  if (!camo) {
    const step = 100 / colors.length;
    return `background:linear-gradient(90deg, ${colors.map((c, i) => `${c} ${i * step}% ${(i + 1) * step}%`).join(", ")})`;
  }
  // One small tile of blotches, repeated across the swatch.
  const spots = [[12, 28, 14, 30], [58, 16, 18, 26], [32, 82, 20, 24], [84, 62, 12, 32], [4, 92, 10, 22], [70, 96, 16, 20], [96, 8, 11, 24], [46, 52, 9, 18]];
  const layers = colors.slice(1).flatMap((c, i) => [spots[(i * 2) % spots.length], spots[(i * 2 + 1) % spots.length]]
    .map(([x, y, rx, ry]) => `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, ${c} 0 94%, transparent 100%)`));
  return `background:${layers.join(", ")}, ${colors[0]}; background-size:96px 36px`;
}

function renderUniforms() {
  const branch = route.branch || "army";
  app.append(gearHeader(T("Learn"), T("Uniforms guide"),
    T("The main uniforms each branch wears, from everyday camouflage to formal dress, and when each one is worn.")));
  withScripts([GEAR_DATA_JS], () => drawUniforms(branch));
}

function drawUniforms(branch) {
  const data = window.F_GEAR.uniforms[branch];
  const color = BRANCHES[branch].color;
  app.append(el("div", { class: "fade-in" },
    gearBranchNav("uniforms", branch),
    el("h2", { class: "gear-h2", style: `--hero:${color}` }, BRANCHES[branch].name),
    el("div", { class: "gear-grid" }, data.items.map((u) => {
      const camo = u.kind === "Combat and utility" && u.sw.length > 2;
      return el("article", gearEn({ class: "gear-card", style: `--hero:${color}` }),
        el("div", { class: "job-path" }, u.kind),
        el("h3", {}, u.n),
        el("div", { class: "gear-swatch", "aria-hidden": "true", style: gearSwatchStyle(u.sw, camo) }),
        el("p", {}, el("strong", {}, T("Look:")), " ", u.pattern),
        el("p", {}, el("strong", {}, T("When it's worn:")), " ", u.when),
        el("p", { class: "gear-fact" }, el("strong", {}, T("Fun fact:")), " ", u.fact));
    })),
    el("p", { class: "muted gear-small" }, T("Color swatches are approximate. Rules on when to wear each uniform vary by unit and job.")),
    gearSources(data.source),
    el("div", { class: "actions" },
      el("a", { class: "button", href: `#/gear/${branch}` }, T("{branch} vehicles and aircraft", { branch: BRANCHES[branch].name })),
      el("a", { class: "button", href: branchLink(branch) }, T("About the {branch}", { branch: BRANCHES[branch].name })))));
}

// ---------------------------------------------------------------------------
// Birthdays and traditions.

let gearTimer = null;

function gearMidnight(y, m, d) {
  return new Date(y, m - 1, d);
}

// The nth weekday (0 Sunday) of a month; nth -1 means the last one.
function gearNthWeekday(y, m, w, nth) {
  if (nth > 0) {
    const first = new Date(y, m - 1, 1).getDay();
    return gearMidnight(y, m, 1 + ((w - first + 7) % 7) + (nth - 1) * 7);
  }
  const lastDay = new Date(y, m, 0);
  return gearMidnight(y, m, lastDay.getDate() - ((lastDay.getDay() - w + 7) % 7));
}

function gearRuleDate(rule, y) {
  return rule.d ? gearMidnight(y, rule.m, rule.d) : gearNthWeekday(y, rule.m, rule.w, rule.nth);
}

// Next date (today counts) for a yearly rule.
function gearNext(rule, now) {
  const today = gearMidnight(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const d = gearRuleDate(rule, now.getFullYear());
  return d >= today ? d : gearRuleDate(rule, now.getFullYear() + 1);
}

function gearIsToday(date, now) {
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function gearDateText(date, withYear) {
  const opts = withYear ? { month: "long", day: "numeric", year: "numeric" } : { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  try { return date.toLocaleDateString(LANG === "en" ? "en-US" : LANG, opts); } catch { return date.toDateString(); }
}

function gearCountdown(target, now) {
  if (gearIsToday(target, now)) return T("Today!");
  const ms = target - now;
  const s = Math.floor(ms / 1000);
  const two = (n) => String(n).padStart(2, "0");
  return T("{d} days {h}:{m}:{s}", { d: Math.floor(s / 86400), h: two(Math.floor(s / 3600) % 24), m: two(Math.floor(s / 60) % 60), s: two(s % 60) });
}

function renderTraditions() {
  clearInterval(gearTimer);
  app.append(gearHeader(T("Fun"), T("Birthdays and traditions"),
    T("Every branch celebrates its birthday, and each one has traditions that go back generations. Here's when the next party is.")));
  withScripts([GEAR_DATA_JS], drawTraditions);
}

function drawTraditions() {
  const data = window.F_GEAR;
  const now = new Date();
  const ticks = [];
  const tick = (node, target) => { ticks.push([node, target]); node.textContent = gearCountdown(target, now); return node; };

  const birthdays = data.birthdays.map((b) => ({ ...b, next: gearNext({ m: b.m, d: b.d }, now) })).sort((a, b) => a.next - b.next);
  const holidays = data.holidays.map((h) => ({ ...h, next: gearNext(h.rule, now) })).sort((a, b) => a.next - b.next);

  const bdayRow = (b) => {
    const today = gearIsToday(b.next, now);
    const age = b.next.getFullYear() - b.y;
    return el("li", { class: `gear-bday${today ? " today" : ""}`, style: `--hero:${BRANCHES[b.b].color}` },
      el("div", { class: "gear-bday-main" },
        el("strong", { class: "gear-bday-name" }, BRANCHES[b.b].name),
        el("span", { class: "muted" }, gearDateText(gearMidnight(b.y, b.m, b.d), true)),
        el("p", gearEn(), b.what)),
      el("div", { class: "gear-bday-count" },
        el("span", { class: "gear-turns" }, today ? T("Happy birthday! {n} years today 🎉", { n: age }) : T("Turns {n}", { n: age })),
        today ? null : tick(el("span", { class: "gear-clock" }), b.next)));
  };

  app.append(el("div", { class: "fade-in" },
    el("div", { class: "section-title" }, T("Branch birthdays")),
    el("ol", { class: "gear-bdays" }, birthdays.map(bdayRow)),
    el("p", { class: "muted gear-small" }, T("Countdowns run to midnight in your time zone. The National Guard also celebrates December 13, 1636.")),
    el("div", { class: "section-title" }, T("Holidays and big days")),
    el("div", { class: "gear-grid" }, holidays.map((h) => el("article", { class: "gear-card gear-holiday" },
      el("div", { class: "gear-card-top" },
        el("span", { class: "gear-icon", "aria-hidden": "true" }, h.ic),
        el("div", { class: "gear-card-title" },
          el("div", { class: "job-path gear-neutral" }, h.when),
          el("h3", {}, h.n))),
      el("p", gearEn(), h.what),
      el("p", { class: "gear-next" }, el("strong", {}, T("Next:")), " ", gearDateText(h.next, false)),
      tick(el("p", { class: "gear-clock" }), h.next)))),
    el("div", { class: "section-title" }, T("Traditions by branch")),
    el("div", { class: "gear-grid" }, ORDER.map((b) => {
      const t = data.traditions[b];
      return el("article", gearEn({ class: "gear-card", style: `--hero:${BRANCHES[b].color}` }),
        el("h3", {}, BRANCHES[b].name),
        el("ul", { class: "gear-trad" }, t.items.map(([name, text]) => el("li", {}, el("strong", {}, name), " ", text))));
    })),
    gearSources([...data.birthdays.map((b) => b.source), "https://www.usna.edu/PAO/events/2026/12/Army-Navy_Football_Game.php", "https://www.va.gov/opa/vetsday/"])));

  const holder = app.lastElementChild;
  gearTimer = setInterval(() => {
    if (!holder.isConnected) { clearInterval(gearTimer); return; }
    const t = new Date();
    for (const [node, target] of ticks) node.textContent = gearCountdown(target, t);
  }, 1000);
}

// ---------------------------------------------------------------------------
// Acronym decoder.

const gearAcr = { index: null, query: "", branch: "all", text: "" };

// Mixed-case words and phrases (like "Hooah") match in any case; acronyms
// and short codes (like "PT" or "Sgt") must match exactly.
function gearAcrLoose(term) {
  return /[a-z]/.test(term) && (term.length > 4 || term.includes(" "));
}

function gearAcrNorm(text) {
  return text.toLowerCase().replace(/\s+/g, " ");
}

function gearAcrIndex() {
  if (gearAcr.index) return gearAcr.index;
  const exact = new Map();
  const loose = new Map();
  for (const entry of window.F_GEAR_ACR) {
    if (gearAcrLoose(entry[0])) loose.set(gearAcrNorm(entry[0]), entry);
    else exact.set(entry[0], entry);
  }
  const esc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+");
  const keys = window.F_GEAR_ACR.map((e) => e[0]).sort((a, b) => b.length - a.length).map(esc);
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${keys.join("|")})(s)?(?![\\p{L}\\p{N}])`, "giu");
  gearAcr.index = { exact, loose, re };
  return gearAcr.index;
}

function gearAcrLookup(word) {
  const { exact, loose } = gearAcrIndex();
  return exact.get(word) || loose.get(gearAcrNorm(word)) || null;
}

function gearAcrBranches(code) {
  if (code === "all") return T("All branches");
  return code.split(" ").map((b) => BRANCHES[b].name).join(", ");
}

// Splits text into plain strings and recognized entries.
function gearAcrScan(text) {
  const { re } = gearAcrIndex();
  const parts = [];
  let last = 0;
  re.lastIndex = 0;
  for (const m of text.matchAll(re)) {
    // Only a lowercase "s" counts as a plural ("NCOs"), so "POS" isn't read as "PO".
    const entry = m[2] === "S" ? null : gearAcrLookup(m[1]);
    if (!entry) continue;
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push({ word: m[0], entry });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderAcronyms() {
  app.append(gearHeader(T("Learn"), T("Acronym decoder"),
    T("The military runs on acronyms. Paste a message, an orders packet or a recruiter's email to decode it, or search the glossary.")));
  withScripts([GEAR_ACR_JS], drawAcronyms);
}

function drawAcronyms() {
  const sample = "After MEPS I ship to BCT, then AIT. My recruiter says to max the AFT, keep my LES and DD-214 safe, and that BAH depends on where I PCS. Hooah!";
  const input = el("textarea", { id: "gear-acr-text", class: "text-input gear-acr-input", rows: "5", maxlength: "20000", placeholder: T("Paste text here...") });
  input.value = gearAcr.text;
  const out = el("div", { class: "gear-acr-out", lang: "en" });
  const def = el("div", { class: "gear-acr-def", role: "status", "aria-live": "polite" });
  const found = el("div", {});

  const showDef = (entry) => {
    const [term, meaning, branches, note] = entry;
    def.replaceChildren(el("div", { class: "gear-acr-def-in", lang: "en" },
      el("strong", { class: "gear-acr-term" }, term), " ", meaning,
      note ? el("div", { class: "muted gear-small" }, note) : null,
      el("div", { class: "muted gear-small" }, gearAcrBranches(branches))));
  };

  const decode = () => {
    gearAcr.text = input.value;
    def.replaceChildren();
    if (!input.value.trim()) {
      out.replaceChildren(el("span", { class: "muted" }, T("Your decoded text will appear here.")));
      found.replaceChildren();
      return;
    }
    const parts = gearAcrScan(input.value);
    const seen = new Map();
    out.replaceChildren(...parts.map((p) => {
      if (typeof p === "string") return p;
      seen.set(p.entry[0], p.entry);
      return el("button", { type: "button", class: "gear-hit", title: p.entry[1], onclick: () => showDef(p.entry) }, p.word);
    }));
    found.replaceChildren(
      el("div", { class: "section-title" }, T("Found {n}", { n: seen.size })),
      seen.size ? el("dl", { class: "gear-acr-found", lang: "en" }, [...seen.values()].map(([term, meaning]) =>
        el("div", {}, el("dt", {}, term), el("dd", {}, meaning)))) : el("p", { class: "muted" }, T("No acronyms recognized yet.")));
  };

  let timer = null;
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(decode, 200); });

  // Glossary.
  const search = el("input", { id: "gear-acr-search", class: "text-input", type: "search", placeholder: T("Search acronyms or meanings"), autocomplete: "off" });
  search.value = gearAcr.query;
  const count = el("p", { class: "muted gear-small", "aria-live": "polite" });
  const list = el("div", { class: "gear-acr-list", lang: "en" });
  const filterHolder = el("div", {});
  const all = [...window.F_GEAR_ACR].sort((a, b) => a[0].localeCompare(b[0], "en", { sensitivity: "base" }));

  const drawList = () => {
    filterHolder.replaceChildren(gearFilter(T("Filter by branch"),
      [["all", T("All")], ...ORDER.map((b) => [b, BRANCHES[b].name])], gearAcr.branch, (v) => { gearAcr.branch = v; drawList(); }));
    const q = gearAcr.query.trim().toLowerCase();
    const rank = (e) => (e[0].toLowerCase() === q ? 0 : e[0].toLowerCase().startsWith(q) ? 1 : 2);
    const rows = all
      .filter((e) => gearAcr.branch === "all" || e[2] === "all" || e[2].split(" ").includes(gearAcr.branch))
      .filter((e) => !q || e[0].toLowerCase().includes(q) || e[1].toLowerCase().includes(q) || (e[3] || "").toLowerCase().includes(q))
      .sort((a, b) => (q ? rank(a) - rank(b) : 0));
    count.textContent = T("Showing {n} of {total}", { n: rows.length, total: all.length });
    list.replaceChildren(...rows.map(([term, meaning, branches, note]) => el("div", { class: "gear-acr-row" },
      el("strong", { class: "gear-acr-term" }, term),
      el("div", {},
        el("div", {}, meaning),
        note ? el("div", { class: "muted gear-small" }, note) : null,
        el("div", { class: "gear-acr-tags" }, branches === "all"
          ? el("span", { class: "gear-tag" }, gearAcrBranches("all"))
          : branches.split(" ").map((b) => el("span", { class: "gear-tag" },
            el("span", { class: "dot", style: `background:${BRANCHES[b].color}`, "aria-hidden": "true" }), BRANCHES[b].name)))))));
  };
  search.addEventListener("input", () => { gearAcr.query = search.value; drawList(); });

  app.append(el("div", { class: "fade-in" },
    el("section", { class: "card gear-acr-card", "aria-labelledby": "gear-acr-decode-h" },
      el("h2", { id: "gear-acr-decode-h" }, T("Decode text")),
      el("label", { for: "gear-acr-text", class: "seg-label" }, T("Text to decode")),
      input,
      el("div", { class: "actions gear-acr-actions" },
        el("button", { type: "button", onclick: () => { input.value = sample; decode(); } }, T("Try an example")),
        el("button", { type: "button", onclick: () => { input.value = ""; decode(); input.focus(); } }, T("Clear"))),
      el("p", { class: "muted gear-small" }, T("Tap or hover a highlighted word to see what it means.")),
      out,
      def,
      found),
    el("section", { "aria-labelledby": "gear-acr-list-h" },
      el("h2", { id: "gear-acr-list-h", class: "gear-h2-plain" }, T("Glossary")),
      el("label", { for: "gear-acr-search", class: "seg-label" }, T("Search the glossary")),
      search,
      filterHolder,
      count,
      list,
      el("p", { class: "muted gear-small" }, T("Some acronyms mean different things in different branches or units. When in doubt, ask.")),
      gearSources(window.F_GEAR_ACR_SOURCE))));
  decode();
  drawList();
}

registerPage("gear", {
  render: renderGear,
  title: () => T("Vehicles, aircraft and ships"),
  hub: "learn",
  icon: "🚁",
  blurb: () => T("What each branch drives, flies and sails."),
});

registerPage("uniforms", {
  render: renderUniforms,
  title: () => T("Uniforms guide"),
  hub: "learn",
  icon: "🪖",
  blurb: () => T("Camouflage, dress uniforms and PT gear, branch by branch."),
});

registerPage("traditions", {
  render: renderTraditions,
  title: () => T("Birthdays and traditions"),
  hub: "fun",
  icon: "🎂",
  blurb: () => T("Countdowns to every branch birthday, plus the traditions behind them."),
});

registerPage("acronyms", {
  render: renderAcronyms,
  title: () => T("Acronym decoder"),
  hub: "learn",
  icon: "🔤",
  blurb: () => T("Paste military jargon and see what it means."),
});
