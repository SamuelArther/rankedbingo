"use strict";

// Learn guides: branch head-to-head, benefits, enlistment contracts, MEPS day
// and a page for parents. The research lives in js/f-learn-data.js and loads
// only when one of these pages is opened.

const LEARN_DATA_SRC = "js/f-learn-data.js";

// Loads the guide data plus any extra promises, then draws the page.
function learnLoad(extras, draw) {
  const page = route.page;
  const status = el("p", { class: "muted" }, T("Loading..."));
  app.append(status);
  Promise.all([loadScriptOnce(LEARN_DATA_SRC), ...extras])
    .then(() => { if (route.page === page) { status.remove(); draw(window.F_LEARN); } })
    .catch(() => { status.textContent = T("Couldn't load this page. Check your connection and try again."); });
}

// ---------------------------------------------------------------------------
// Shared building blocks.

function learnDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(LANG === "en" ? "en-US" : LANG, { year: "numeric", month: "long", day: "numeric" });
}

function learnHeader(eyebrow, title, intro, checked) {
  return [
    el("div", { class: "eyebrow" }, eyebrow),
    el("h1", {}, title),
    el("p", { class: "muted" }, intro),
    checked ? el("p", { class: "learn-checked" }, T("Checked against official sources on {date}. Rules and amounts change, so confirm anything important with the source or a recruiter.", { date: learnDate(checked) })) : null,
  ];
}

function learnHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function learnSource(url, label) {
  if (!url) return null;
  return el("p", { class: "learn-src" }, T("Source:"), " ",
    el("a", { href: url, target: "_blank", rel: "noopener" }, label || learnHost(url), " ↗"));
}

function learnList(points, mark = "•") {
  return el("ul", { class: "list learn-points" }, points.map((p) =>
    el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, mark), el("span", {}, p))));
}

// "On this page" chips that scroll to each section (plain #anchors would
// collide with the hash router).
function learnToc(items) {
  return el("nav", { class: "learn-toc", "aria-label": T("On this page") },
    el("span", { class: "seg-label" }, T("On this page")),
    el("div", { class: "chips" }, items.map(([id, label]) => el("button", {
      type: "button", class: "chip chip-btn",
      onclick: () => {
        const target = document.getElementById(`learn-${id}`);
        if (!target) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        target.focus({ preventScroll: true });
      },
    }, label))));
}

// A guide section from the data file: { id, icon, title, intro, points, note, link, source }.
function learnSection(s, ...extra) {
  return el("section", { class: "card learn-sec fade-in", id: `learn-${s.id}`, tabindex: "-1", "aria-labelledby": `learn-${s.id}-h` },
    el("h2", { id: `learn-${s.id}-h` }, s.icon ? el("span", { class: "learn-icon", "aria-hidden": "true" }, s.icon) : null, s.title),
    s.intro ? el("p", {}, s.intro) : null,
    s.points ? learnList(s.points) : null,
    s.note ? el("div", { class: "note learn-note" }, s.note) : null,
    ...extra,
    s.link ? el("p", { class: "learn-more" }, el("a", { href: s.link[0] }, T(s.link[1]), " →")) : null,
    learnSource(s.source));
}

// A checklist whose ticks are remembered in this browser.
function learnChecklist(key, items, label) {
  const storeKey = `rankedbingo.learn.${key}`;
  const saved = loadJson(storeKey, []);
  const ticked = new Set(Array.isArray(saved) ? saved : []);
  const count = el("span", { class: "muted", "aria-live": "polite" });
  const update = () => { count.textContent = T("{n} of {total} done", { n: ticked.size, total: items.length }); };
  const list = el("ul", { class: "learn-check", "aria-label": label }, items.map((text, i) => {
    const id = `learn-${key}-${i}`;
    const box = el("input", { type: "checkbox", id, checked: ticked.has(i) });
    box.addEventListener("change", () => {
      if (box.checked) ticked.add(i); else ticked.delete(i);
      saveJson(storeKey, [...ticked]);
      update();
    });
    return el("li", {}, box, el("label", { for: id }, text));
  }));
  update();
  return el("div", { class: "learn-checklist" }, list, el("div", { class: "learn-check-foot" }, count,
    el("button", { type: "button", class: "learn-small", onclick: () => {
      ticked.clear();
      saveJson(storeKey, []);
      list.querySelectorAll("input").forEach((b) => { b.checked = false; });
      update();
    } }, T("Clear"))));
}

function learnBranchName(b) {
  return el("span", { class: "learn-branch", style: `--hero:${BRANCHES[b].color}` },
    el("span", { class: "dot", style: `background:${BRANCHES[b].color}`, "aria-hidden": "true" }), BRANCHES[b].name);
}

// ---------------------------------------------------------------------------
// Head-to-head: any two branches side by side.

function learnH2hPair() {
  const [pa, pb] = route.parts || [];
  const a = ORDER.includes(pa) ? pa : "army";
  const fallback = a === "navy" ? "army" : "navy";
  const b = ORDER.includes(pb) && pb !== a ? pb : fallback;
  return [a, b];
}

function learnH2hGo(a, b) {
  location.hash = `#/head-to-head/${a}/${b}`;
}

function learnH2hPicker(a, b) {
  const select = (value, label, onPick) => {
    const s = el("select", { class: "text-input", "aria-label": label },
      ORDER.map((x) => el("option", { value: x }, BRANCHES[x].name)));
    s.value = value;
    s.addEventListener("change", () => onPick(s.value));
    return el("label", { class: "learn-pick" }, el("span", { class: "seg-label" }, label), s);
  };
  // Picking the branch already on the other side swaps the two.
  return el("div", { class: "learn-picker" },
    select(a, T("First branch"), (v) => learnH2hGo(v, v === b ? a : b)),
    el("button", { type: "button", class: "learn-swap", "aria-label": T("Swap the two branches"), onclick: () => learnH2hGo(b, a) }, "⇄"),
    select(b, T("Second branch"), (v) => learnH2hGo(v === a ? b : a, v)));
}

function learnFmt(n) {
  return n.toLocaleString("en-US");
}

// One row's cell content for branch `b`.
function learnH2hCells(b, D, maxActive) {
  const x = D.h2h.branches[b];
  const det = DETAILS[b];
  const jobs = jobsFor(b);
  const byTrack = { enlisted: 0, warrant: 0, officer: 0 };
  jobs.forEach((j) => { byTrack[j.track] = (byTrack[j.track] || 0) + 1; });
  const sites = (window.BASES || []).filter((s) => s.b === b).length;
  const fit = window.INFO && INFO.fitness[b];
  const approx = x.approx ? "~" : "";
  const size = [
    el("strong", {}, `${approx}${learnFmt(x.active)}`), " ", T("active duty"),
    el("div", { class: "learn-meter", "aria-hidden": "true" }, el("span", { style: `width:${Math.max(2, (x.active / maxActive) * 100)}%;background:${BRANCHES[b].color}` })),
    x.reserve ? el("div", { class: "muted" }, T("{n} Reserve", { n: approx + learnFmt(x.reserve) })) : null,
    x.guard ? el("div", { class: "muted" }, T("{n} National Guard", { n: learnFmt(x.guard) })) : null,
  ];
  const components = [
    el("ul", { class: "learn-comp" }, COMPONENT_ORDER.map((c) => {
      const has = x.components.includes(c);
      return el("li", { class: has ? "yes" : "no" },
        el("span", { "aria-hidden": "true" }, has ? "✓" : "–"),
        el("span", {}, COMPONENTS[c].name, has ? null : el("span", { class: "learn-sr" }, ` (${T("not offered")})`)));
    })),
    x.componentNote ? el("div", { class: "muted learn-fine" }, x.componentNote) : null,
  ];
  const jobParts = ["enlisted", "warrant", "officer"].filter((t) => byTrack[t]).map((t) => `${byTrack[t]} ${trackLabel(t).toLowerCase()}`);
  return {
    members: det.members,
    size,
    dept: det.dept,
    boot: [el("strong", {}, det.bootcamp.name), el("div", {}, det.bootcamp.length), el("div", { class: "muted" }, det.bootcamp.where)],
    tech: det.tech.name,
    jobs: jobs.length
      ? [el("strong", {}, String(jobs.length)), " ", T("jobs listed"), el("div", { class: "muted" }, jobParts.join(" · ")),
          el("a", { href: jobsLink(b) }, T("Browse jobs"), " →")]
      : T("Job list unavailable"),
    sites: [el("strong", {}, String(sites)), " ", T("sites on our map"), el("div", {}, el("a", { href: "#/map" }, T("Open the map"), " →"))],
    components,
    fitness: fit ? fit.test.split(". ")[0] : "—",
    enlist: x.enlist,
    deploy: x.deploy,
    officer: det.officer,
    suits: x.suits,
  };
}

function renderHeadToHead() {
  const extras = [
    window.INFO ? null : loadScriptOnce("js/info-data.js"),
    window.BASES ? null : loadScriptOnce("js/bases-data.js"),
    ensureJobsData(),
  ];
  learnLoad(extras, (D) => {
    const [a, b] = learnH2hPair();
    const maxActive = Math.max(...ORDER.map((x) => D.h2h.branches[x].active));
    const ca = learnH2hCells(a, D, maxActive);
    const cb = learnH2hCells(b, D, maxActive);
    const rows = [
      ["members", T("Members are called")],
      ["size", T("Size")],
      ["dept", T("Part of")],
      ["boot", T("Boot camp")],
      ["tech", T("Job training after")],
      ["jobs", T("Jobs")],
      ["sites", T("Installations")],
      ["components", T("Ways to serve")],
      ["fitness", T("Fitness test")],
      ["enlist", T("Typical first enlistment")],
      ["deploy", T("Deployment style")],
      ["officer", T("Officer routes")],
      ["suits", T("Who it suits")],
    ];
    const head = (x) => el("th", { scope: "col", style: `--hero:${BRANCHES[x].color}` }, learnBranchName(x));
    const table = el("div", { class: "learn-h2h-wrap" }, el("table", { class: "learn-h2h" },
      el("caption", { class: "learn-sr" }, T("{a} compared with {b}", { a: BRANCHES[a].name, b: BRANCHES[b].name })),
      el("thead", {}, el("tr", {}, el("td", { class: "learn-corner" }), head(a), head(b))),
      el("tbody", {}, rows.map(([key, label]) => el("tr", {},
        el("th", { scope: "row" }, label),
        el("td", { style: `--hero:${BRANCHES[a].color}` }, ca[key]),
        el("td", { style: `--hero:${BRANCHES[b].color}` }, cb[key]))))));

    const sources = [
      learnSource(D.h2h.sizeSource, T("Size: FY2026 defense bill end strengths (CRS)")),
      ...[a, b].map((x) => learnSource(D.h2h.branches[x].enlistSource, T("{branch} enlistment terms", { branch: BRANCHES[x].name }))),
      ...[a, b].map((x) => window.INFO && learnSource(INFO.fitness[x].source, T("{branch} fitness test", { branch: BRANCHES[x].name }))),
      ...[a, b].map((x) => learnSource(D.h2h.branches[x].componentSource, T("{branch} part-time service", { branch: BRANCHES[x].name }))),
    ];

    app.append(el("div", { class: "fade-in learn-page" },
      learnHeader(T("Learn"), T("Branch vs branch"), T("Pick any two branches and compare them side by side: size, boot camp, jobs, ways to serve, fitness tests, contracts and more."), D.checked),
      el("div", { class: "card learn-sec" },
        learnH2hPicker(a, b),
        el("div", { class: "learn-quick" }, el("span", { class: "seg-label" }, T("Popular match-ups")),
          el("div", { class: "chips" }, [["army", "usmc"], ["navy", "cg"], ["af", "sf"], ["army", "af"], ["navy", "usmc"]].map(([x, y]) =>
            el("a", { class: "chip chip-btn" + (x === a && y === b ? " active" : ""), href: `#/head-to-head/${x}/${y}`, "aria-current": x === a && y === b ? "page" : null },
              `${BRANCHES[x].name} vs ${BRANCHES[y].name}`))))),
      table,
      el("p", { class: "learn-fine muted" }, D.h2h.sizeNote, " ",
        T("Job counts come from this site's full job lists, and installation counts are the sites on this site's map (well-known bases plus many Reserve and Guard centers), not official totals.")),
      el("div", { class: "grid learn-duo" }, [a, b].map((x) => el("div", { class: "job", style: `--hero:${BRANCHES[x].color}` },
        el("div", { class: "job-path" }, BRANCHES[x].name),
        el("p", { style: "margin:0 0 8px" }, BRANCHES[x].tagline),
        el("a", { href: branchLink(x) }, T("Full {branch} profile", { branch: BRANCHES[x].name }), " →")))),
      el("div", { class: "learn-sources" }, el("div", { class: "section-title" }, T("Sources")), sources),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: "#/quiz" }, T("Take the quiz")),
        el("a", { class: "button", href: "#/learn" }, T("More guides")))));
  });
}

// ---------------------------------------------------------------------------
// Benefits.

function learnGiTier(months, D) {
  const tier = D.giTiers.find(([min]) => months >= min);
  return tier ? tier[1] : 0;
}

function learnMoney(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}

function learnGiEstimator(D) {
  const range = el("input", { type: "range", id: "learn-gi-months", class: "learn-range", min: "0", max: "48", step: "1", value: "36" });
  const special = el("input", { type: "checkbox", id: "learn-gi-special" });
  const out = el("div", { class: "learn-gi-out", "aria-live": "polite" });
  const monthsLabel = el("span", { class: "learn-gi-months" });
  const r = D.giRates;
  const draw = () => {
    const months = Number(range.value);
    const pct = special.checked ? 100 : learnGiTier(months, D);
    monthsLabel.textContent = months >= 48 ? T("48+ months") : T("{n} months", { n: months });
    range.setAttribute("aria-valuetext", monthsLabel.textContent);
    if (!pct) {
      out.replaceChildren(
        el("div", { class: "learn-gi-pct" }, "0%"),
        el("p", { class: "muted" }, T("Not eligible yet: you need at least 90 days (about 3 months) of active duty after September 10, 2001.")));
      return;
    }
    const share = pct / 100;
    out.replaceChildren(
      el("div", { class: "learn-gi-pct" }, `${pct}%`, el("span", { class: "muted" }, " ", T("of the full benefit"))),
      learnList([
        T("{pct}% of in-state tuition and fees at public schools", { pct }),
        T("Up to {amount} a year at private schools", { amount: learnMoney(Math.round(r.privateCap * share * 100) / 100) }),
        T("{pct}% of the monthly housing allowance", { pct }),
        T("Up to {amount} a year for books and supplies", { amount: learnMoney(Math.round(r.books * share)) }),
      ], "✓"));
  };
  range.addEventListener("input", draw);
  special.addEventListener("change", draw);
  draw();
  const scale = el("ul", { class: "learn-tiers", "aria-label": T("Official tier table") }, D.giTiers.map(([min, pct], i) => {
    const prev = D.giTiers[i - 1];
    const span = prev ? T("{from} to {to} months", { from: min, to: prev[0] - 1 }) : T("{n}+ months", { n: min });
    return el("li", {}, el("span", {}, span), el("strong", {}, `${pct}%`));
  }));
  return el("div", { class: "learn-gi", id: "learn-gi" },
    el("h3", {}, T("GI Bill estimate")),
    el("label", { for: "learn-gi-months", class: "learn-gi-label" }, T("Total months of active duty: "), monthsLabel),
    range,
    el("div", { class: "learn-gi-check" }, special,
      el("label", { for: "learn-gi-special" }, T("I have a Purple Heart, or was discharged for a service-connected disability after 30+ days in a row"))),
    out,
    el("details", { class: "learn-tier-table" }, el("summary", {}, T("See the official tier table")), scale),
    el("p", { class: "learn-fine muted" }, T("Estimate only. Rates are for {period}. Guard and Reserve initial training doesn't count toward the months.", { period: r.period })),
    learnSource(D.giTierSource, T("VA: how your percentage is set")),
    learnSource(r.source, T("VA: current GI Bill rates")));
}

function renderBenefits() {
  learnLoad([], (D) => {
    const toc = D.benefits.map((s) => [s.id, s.title]).concat([["guard", T("Guard & Reserve")]]);
    app.append(el("div", { class: "fade-in learn-page" },
      learnHeader(T("Learn"), T("Benefits in plain English"), T("What you actually get for serving: pay, healthcare, college money, a home loan, retirement and more, without the jargon."), D.checked),
      learnToc(toc),
      D.benefits.map((s) => learnSection(s, s.id === "gibill" ? learnGiEstimator(D) : null)),
      learnSection({ id: "guard", icon: "🏘️", ...D.guardReserve }),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: "#/pay" }, T("Ranks & pay")),
        el("a", { class: "button", href: "#/contracts" }, T("Contracts explained")),
        el("a", { class: "button", href: "#/learn" }, T("More guides")))));
  });
}

// ---------------------------------------------------------------------------
// Enlistment contracts.

// Pick how many years you serve; the rest of the 8 is IRR.
function learnMsoBar() {
  let years = 4;
  const buttons = [];
  const bar = el("div", { class: "learn-mso", "aria-hidden": "true" });
  const text = el("p", { class: "learn-mso-text", "aria-live": "polite" });
  const draw = () => {
    buttons.forEach((b) => { const on = Number(b.dataset.y) === years; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); });
    bar.replaceChildren(...Array.from({ length: 8 }, (_, i) => el("span", { class: i < years ? "on" : "irr" }, String(i + 1))));
    text.replaceChildren(el("strong", {}, `${years}+${8 - years}`), ": ",
      T("{a} years serving, then {b} years in the Individual Ready Reserve.", { a: years, b: 8 - years }));
  };
  for (let y = 2; y <= 6; y++) {
    buttons.push(el("button", { type: "button", class: "seg-item", "data-y": String(y), onclick: () => { years = y; draw(); } },
      T("{n} years", { n: y })));
  }
  draw();
  return el("div", { class: "learn-mso-box" },
    el("div", { class: "seg-label", id: "learn-mso-label" }, T("Try it: years serving")),
    el("div", { class: "seg", role: "group", "aria-labelledby": "learn-mso-label" }, buttons),
    bar,
    el("div", { class: "learn-mso-key", "aria-hidden": "true" },
      el("span", {}, el("i", { class: "on" }), T("Serving")),
      el("span", {}, el("i", { class: "irr" }), T("Individual Ready Reserve"))),
    text);
}

function renderContracts() {
  learnLoad([], (D) => {
    const C = D.contracts;
    const sec = (id) => C.sections.find((s) => s.id === id);
    const terms = learnSection({ id: "terms", icon: "📝", title: T("Contract lengths by branch"), intro: T("How long your first stretch of service usually lasts. The 8-year total stays the same."), source: C.msoSource },
      el("dl", { class: "learn-rows" }, C.terms.map(([b, t]) => [el("dt", {}, learnBranchName(b)), el("dd", {}, t)])),
      el("p", { class: "muted learn-fine" }, C.reserveTerms));
    const guarantees = learnSection({ id: "jobs", icon: "🎯", title: T("Guaranteed jobs and options"), intro: T("What you can lock in before you ship depends on the branch:") },
      el("div", { class: "jobs" }, C.guarantees.map(([b, t]) => el("div", { class: "job", style: `--hero:${BRANCHES[b].color}` },
        el("div", { class: "job-path" }, BRANCHES[b].name), el("p", { style: "margin:0" }, t)))));
    const writing = learnSection({ id: "writing", icon: "✍️", title: T("Get it in writing"), intro: T("Before you sign, make sure each of these is in your contract or its annexes. Tick them off as you check.") },
      learnChecklist("writing", C.writing, T("Get it in writing checklist")),
      el("div", { class: "note learn-note" }, T("Read the enlistment contract (DD Form 4) and every annex before you sign, and keep copies of everything.")));
    app.append(el("div", { class: "fade-in learn-page" },
      learnHeader(T("Learn"), T("Enlistment contracts explained"), T("What you're actually signing: the 8-year obligation, contract lengths, bonuses, job guarantees, the Delayed Entry Program and how to back out."), D.checked),
      learnToc([["mso", T("8-year rule")], ["terms", T("Lengths")], ["bonus", T("Bonuses")], ["jobs", T("Job guarantees")], ["dep", "DEP"], ["writing", T("In writing")], ["cant", T("Can't promise")], ["backout", T("Backing out")]]),
      learnSection(C.mso, learnMsoBar()),
      terms,
      learnSection(sec("bonus")),
      guarantees,
      learnSection(sec("dep")),
      writing,
      learnSection(sec("cant")),
      learnSection(sec("backout"), el("p", { class: "learn-src" }, T("Law:"), " ",
        el("a", { href: "https://www.govinfo.gov/link/uscode/10/513", target: "_blank", rel: "noopener" }, "10 U.S.C. § 513 ↗"))),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: "#/meps" }, T("What happens at MEPS")),
        el("a", { class: "button", href: "#/benefits" }, T("Benefits")),
        el("a", { class: "button", href: "#/learn" }, T("More guides")))));
  });
}

// ---------------------------------------------------------------------------
// MEPS walkthrough.

let learnMepsStep = 0;

function learnMepsStepper(M) {
  const panel = el("div", { class: "learn-step-panel", "aria-live": "polite" });
  const dots = M.steps.map((s, i) => el("li", {}, el("button", {
    type: "button", class: "learn-step-dot", "aria-label": T("Step {n}: {title}", { n: i + 1, title: s.title }),
    onclick: () => { learnMepsStep = i; draw(); },
  }, String(i + 1))));
  const prev = el("button", { type: "button", onclick: () => { learnMepsStep = Math.max(0, learnMepsStep - 1); draw(); } }, "← ", T("Back"));
  const next = el("button", { type: "button", class: "primary", onclick: () => { learnMepsStep = Math.min(M.steps.length - 1, learnMepsStep + 1); draw(); } }, T("Next"), " →");
  function draw() {
    const i = learnMepsStep;
    const s = M.steps[i];
    dots.forEach((d, j) => {
      const b = d.firstChild;
      b.classList.toggle("done", j < i);
      b.classList.toggle("active", j === i);
      if (j === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    prev.disabled = i === 0;
    next.disabled = i === M.steps.length - 1;
    panel.replaceChildren(...[
      el("div", { class: "learn-step-time" }, T("Step {n} of {total}", { n: i + 1, total: M.steps.length }), " · ", s.time),
      el("h3", {}, s.title),
      el("p", {}, s.text),
      s.tips ? learnList(s.tips, "→") : null,
      s.link ? el("p", { class: "learn-more" }, el("a", { href: s.link[0] }, T(s.link[1]), " →")) : null,
    ].filter(Boolean));
  }
  draw();
  return el("div", { class: "learn-stepper" },
    el("ol", { class: "learn-step-dots", "aria-label": T("MEPS day steps") }, dots),
    panel,
    el("div", { class: "nav learn-step-nav" }, prev, next));
}

function renderMeps() {
  learnLoad([], (D) => {
    const M = D.meps;
    const block = (id, icon, title, items, mark) => learnSection({ id, icon, title }, learnList(items, mark));
    app.append(el("div", { class: "fade-in learn-page" },
      learnHeader(T("Learn"), T("MEPS, step by step"), T("The Military Entrance Processing Station (MEPS) is where you're checked out medically, pick your job and swear in. Every branch uses the same stations, spread across the country. Here's how the day usually goes."), D.checked),
      learnToc([["day", T("The day")], ["bring", T("What to bring")], ["dress", T("Dress code")], ["dont", T("Don'ts")], ["dq", T("Disqualifiers")]]),
      el("section", { class: "card learn-sec", id: "learn-day", tabindex: "-1", "aria-labelledby": "learn-day-h" },
        el("h2", { id: "learn-day-h" }, el("span", { class: "learn-icon", "aria-hidden": "true" }, "🕓"), T("MEPS day")),
        el("p", { class: "muted" }, T("Tap a step or use Next. Times are typical; your recruiter will give you your exact schedule.")),
        learnMepsStepper(M),
        el("details", { class: "learn-all" }, el("summary", {}, T("Show all steps as a list")),
          el("ol", { class: "steps compact" }, M.steps.map((s) => el("li", {}, el("strong", {}, s.title), el("p", { class: "muted", style: "margin:2px 0 0" }, s.text))))),
        learnSource(M.source, T("GoArmy: Processing & Screening (MEPS)")),
        learnSource(M.lodgingSource, T("USMEPCOM: applicant lodging fact sheet"))),
      learnSection({ id: "bring", icon: "🎒", title: T("What to bring") },
        learnChecklist("meps", M.bring, T("MEPS packing checklist")),
        el("div", { class: "section-title" }, T("Leave at home or take off")),
        learnList(M.leave, "✕")),
      block("dress", "👕", T("Dress code"), M.dress, "•"),
      block("dont", "⚠️", T("What not to do"), M.dont, "!"),
      learnSection({ id: "dq", icon: "🩺", title: T("Common disqualifiers"), intro: T("In general terms, these are the things most likely to stop or delay an enlistment:"), points: M.disqualify, note: M.disqualifyNote, source: "https://www.goarmy.com/how-to-join/requirements" }),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: "#/asvab" }, T("ASVAB practice")),
        el("a", { class: "button", href: "#/join" }, T("Can I join?")),
        el("a", { class: "button", href: "#/contracts" }, T("Contracts explained")))));
  });
}

// ---------------------------------------------------------------------------
// For parents and families.

function renderParents() {
  learnLoad([], (D) => {
    const qa = D.parents.map((item, i) => el("details", { class: "job learn-qa", style: "--hero:var(--accent)", open: i === 0 },
      el("summary", {}, el("strong", { class: "job-name" }, item.q)),
      el("div", { class: "learn-qa-body" },
        (item.a || []).map((p) => el("p", {}, p)),
        item.points ? learnList(item.points) : null,
        item.bootcamps ? el("dl", { class: "learn-rows" }, ORDER.map((b) => [
          el("dt", {}, learnBranchName(b)),
          el("dd", {}, `${DETAILS[b].bootcamp.length} · ${DETAILS[b].bootcamp.where}`)])) : null,
        item.link ? el("p", { class: "learn-more" }, el("a", { href: item.link[0] }, T(item.link[1]), " →")) : null,
        (item.sources || []).map(([url, label]) => learnSource(url, label)))));
    app.append(el("div", { class: "fade-in learn-page" },
      learnHeader(T("Learn"), T("For parents and families"), T("Calm, honest answers to the questions parents usually ask when someone they love is thinking about joining. No pressure either way: the goal is a good decision."), D.checked),
      el("div", { class: "jobs learn-qa-list" }, qa),
      el("div", { class: "note learn-note", style: "margin-top:16px" },
        T("Military OneSource is free and open 24/7 for service members and their families: call 800-342-9647 or visit militaryonesource.mil.")),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: "#/benefits" }, T("Benefits")),
        el("a", { class: "button", href: "#/meps" }, T("MEPS walkthrough")),
        el("a", { class: "button", href: "#/learn" }, T("More guides")))));
  });
}

// ---------------------------------------------------------------------------

registerPage("head-to-head", {
  render: renderHeadToHead,
  title: () => T("Branch vs branch"),
  hub: "learn",
  icon: "⚖️",
  blurb: () => T("Pick any two branches and compare them side by side."),
});

registerPage("benefits", {
  render: renderBenefits,
  title: () => T("Benefits in plain English"),
  hub: "learn",
  icon: "🎓",
  blurb: () => T("Pay, healthcare, the GI Bill, home loans, retirement and more."),
});

registerPage("contracts", {
  render: renderContracts,
  title: () => T("Enlistment contracts explained"),
  hub: "learn",
  icon: "📝",
  blurb: () => T("The 8-year obligation, bonuses, job guarantees and backing out of DEP."),
});

registerPage("meps", {
  render: renderMeps,
  title: () => T("MEPS, step by step"),
  hub: "learn",
  icon: "🏢",
  blurb: () => T("What happens on MEPS day, what to bring and what to avoid."),
});

registerPage("parents", {
  render: renderParents,
  title: () => T("For parents and families"),
  hub: "learn",
  icon: "👪",
  blurb: () => T("Honest answers to the questions parents usually ask."),
});
