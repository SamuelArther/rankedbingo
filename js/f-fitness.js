"use strict";

// Fitness pages: a score calculator for each branch's current PT test, a PT
// tracker with charts (saved only in this browser), and an 8-week boot camp
// prep plan. Score tables and plan text live in js/f-fitness-data.js, which
// loads only when one of these pages is opened.

const FITNESS_DATA = ["js/f-fitness-data.js"];
const FITNESS_PROFILE_KEY = "rankedbingo.fitness.profile";
const FITNESS_LOG_KEY = "rankedbingo.fitness.log";
const FITNESS_PREP_KEY = "rankedbingo.fitness.prep";
const FITNESS_SVG_NS = "http://www.w3.org/2000/svg";

// ---------------------------------------------------------------------------
// Shared helpers.

// Branch, age and sex chosen on any fitness page, reused by the others.
function fitnessProfile() {
  const p = loadJson(FITNESS_PROFILE_KEY, {}) || {};
  return {
    branch: ORDER.includes(p.branch) ? p.branch : "army",
    age: Number.isInteger(p.age) && p.age >= 17 && p.age <= 99 ? p.age : 18,
    sex: p.sex === "female" ? "female" : "male",
  };
}

function fitnessSaveProfile(changes) {
  saveJson(FITNESS_PROFILE_KEY, { ...fitnessProfile(), ...changes });
}

// Reads a time typed as 13:45, 13.45 or 1345. A plain number up to 99 is
// read as seconds for holds (a 45-second plank) and as minutes otherwise.
function fitnessParseTime(text, plainSeconds) {
  const s = String(text || "").trim();
  let m = s.match(/^(\d{1,3})[:.](\d{2})$/);
  if (!m) {
    const digits = s.match(/^\d{3,5}$/) ? s : null;
    if (digits) m = [s, digits.slice(0, -2), digits.slice(-2)];
  }
  if (m) {
    const sec = Number(m[2]);
    return sec < 60 ? Number(m[1]) * 60 + sec : null;
  }
  if (!/^\d{1,2}$/.test(s)) return null;
  return plainSeconds ? Number(s) : Number(s) * 60;
}

function fitnessFormatTime(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function fitnessFormat(value, unit) {
  if (value == null) return "—";
  if (unit === "time") return fitnessFormatTime(value);
  if (unit === "whtr") return (value / 100).toFixed(2);
  if (unit === "lbs") return T("{n} lbs", { n: value });
  if (unit === "shuttles") return T("{n} shuttles", { n: value });
  return T("{n} reps", { n: value });
}

// Reads a typed result for a unit; null when it isn't a usable number.
function fitnessParseValue(text, unit, higher) {
  if (unit === "time") return fitnessParseTime(text, higher);
  const s = String(text || "").trim();
  if (!/^\d{1,4}$/.test(s)) return null;
  return Number(s);
}

// The age group label (like "17-21", "<25" or "62+") that covers `age`.
function fitnessAgeGroup(ages, age) {
  for (const g of ages) {
    let m = g.match(/^<(\d+)$/);
    if (m && age < Number(m[1])) return g;
    m = g.match(/^(\d+)-(\d+)$/);
    if (m && age >= Number(m[1]) && age <= Number(m[2])) return g;
    m = g.match(/^(\d+)\+$/);
    if (m && age >= Number(m[1])) return g;
  }
  return ages[0];
}

// A table column: a flat [result, points, ...] list, best result first.
function fitnessColumn(b, table, group, sexKey) {
  const t = F_FITNESS.tables[b][table];
  return Array.isArray(t) ? t : t[group][sexKey];
}

// Points for a result: those of the first listed result it meets, or null
// when it's below everything in the table.
function fitnessPoints(pairs, value, higher) {
  for (let i = 0; i < pairs.length; i += 2) {
    if (higher ? value >= pairs[i] : value <= pairs[i]) return pairs[i + 1];
  }
  return null;
}

// The easiest listed result worth at least `minPts` points.
function fitnessMinResult(pairs, minPts = 0) {
  let best = null;
  for (let i = 0; i < pairs.length; i += 2) if (pairs[i + 1] >= minPts) best = i;
  return best == null ? null : { result: pairs[best], points: pairs[best + 1] };
}

// Redraws the current fitness page in place, keeping the scroll position
// (the app's render() jumps back to the top).
function fitnessRedraw(draw) {
  if (!["pt-score", "pt-log", "prep"].includes(route.page)) return;
  const y = window.scrollY;
  app.replaceChildren();
  draw();
  window.scrollTo(0, y);
}

function fitnessBranchNav(current, href) {
  return el("nav", { class: "seg fit-branches", "aria-label": T("Branch") }, ORDER.map((b) => el("a", {
    class: "seg-item" + (b === current ? " active" : ""), href: href(b), "aria-current": b === current ? "page" : null,
  }, el("span", { class: "dot", style: `background:${BRANCHES[b].color}`, "aria-hidden": "true" }), " ", BRANCHES[b].name)));
}

function fitnessSources(list) {
  return el("ul", { class: "fit-sources" }, list.map((s) => {
    const url = typeof s === "string" ? s : s.url;
    const label = typeof s === "string" ? new URL(url).hostname.replace(/^www\./, "") : s.label;
    return el("li", {}, el("a", { href: url, target: "_blank", rel: "noopener" }, `${label} ↗`));
  }));
}

function fitnessField(labelText, control, hint) {
  return el("label", { class: "fit-field" }, el("span", { class: "fit-label" }, labelText), control, hint || null);
}

function fitnessAgeInput(value, onChange) {
  return el("input", {
    class: "text-input", type: "number", min: "17", max: "99", inputmode: "numeric", value: String(value),
    oninput: (e) => { const a = Number(e.target.value); if (Number.isInteger(a) && a >= 17 && a <= 99) onChange(a); },
  });
}

function fitnessSexSelect(value, onChange) {
  return el("select", { class: "text-input", onchange: (e) => onChange(e.target.value) },
    el("option", { value: "male", selected: value === "male" }, T("Male")),
    el("option", { value: "female", selected: value === "female" }, T("Female")));
}

// ---------------------------------------------------------------------------
// PT score calculator: #/pt-score/<branch>

const fitnessPtState = {};

function fitnessRenderPtScore() {
  withScripts(FITNESS_DATA, fitnessDrawPtScore);
}

function fitnessPtBranchState(b, test) {
  if (!fitnessPtState[b]) fitnessPtState[b] = { variant: test.variants ? test.variants[0].id : null, combatArms: false, inputs: {} };
  return fitnessPtState[b];
}

function fitnessPtVariant(test, st) {
  return test.variants ? test.variants.find((v) => v.id === st.variant) || test.variants[0] : {};
}

function fitnessPtComponents(test, variant) {
  return variant.components || test.components;
}

// Scores every event and applies the branch's pass rules.
function fitnessPtCompute(b, test, st, prof) {
  const variant = fitnessPtVariant(test, st);
  const comps = fitnessPtComponents(test, variant);
  const group = fitnessAgeGroup(test.ages, prof.age);
  const combatArms = b === "usmc" && variant.id === "pft" && st.combatArms;
  const sexKey = prof.sex === "female" && !variant.sexNeutral && !combatArms ? "f" : "m";
  const rows = comps.map((comp, i) => {
    const input = st.inputs[`${variant.id}.${i}`] || {};
    const opt = comp.options.find((o) => o.id === input.opt) || comp.options[0];
    const pairs = fitnessColumn(b, opt.table, group, sexKey);
    const value = opt.unit === "whtr" ? input.ratio ?? null : fitnessParseValue(input.raw, opt.unit, opt.higher);
    const raw = value == null ? null : fitnessPoints(pairs, value, opt.higher);
    const min = opt.noMinimum ? null : fitnessMinResult(pairs, test.scoring === "army" ? variant.perEvent : 0);
    let met = null;
    if (value != null) met = opt.noMinimum ? true : test.scoring === "army" ? (raw ?? 0) >= variant.perEvent : raw != null;
    return { comp, opt, pairs, value, points: value == null ? null : raw ?? 0, met, min, max: { result: pairs[0], points: pairs[1] } };
  });
  const complete = rows.every((r) => r.value != null);
  const total = rows.reduce((sum, r) => sum + (r.points || 0), 0);
  const allMet = rows.every((r) => r.met);
  const out = { group, sexKey, rows, complete, total, pass: null, category: null, need: null };
  if (test.scoring === "army") {
    out.need = variant.total;
    out.pass = allMet && total >= variant.total;
  } else if (test.scoring === "usmc") {
    out.need = combatArms ? variant.combatArms.total : variant.total;
    out.pass = allMet && total >= out.need;
    const cls = test.classes.find(([pts]) => total >= pts);
    out.category = out.pass && cls ? T(cls[1]) : null;
  } else if (test.scoring === "navy") {
    out.average = rows.length ? total / rows.length : 0;
    out.pass = allMet;
    const level = test.levels.find(([pts]) => out.average >= pts);
    out.category = out.pass && level ? level[1] : T("Failure");
  } else if (test.scoring === "af") {
    out.need = 75;
    out.pass = allMet && total >= 75;
    out.category = out.pass ? (total >= 90 ? T("Excellent") : T("Satisfactory")) : T("Unsatisfactory");
  } else if (test.scoring === "cg") {
    out.pass = allMet;
  }
  return out;
}

function fitnessPtCategoryFor(test, points) {
  if (points == null) return null;
  if (test.scoring === "navy") { const l = test.levels.find(([p]) => points >= p); return l ? l[1] : T("Failure"); }
  if (test.scoring === "cg") { const c = test.categories.find(([p]) => points >= p); return c ? c[1] : T("Below minimum"); }
  return null;
}

function fitnessDrawPtScore() {
  const prof = fitnessProfile();
  const b = ORDER.includes(route.parts[0]) ? route.parts[0] : prof.branch;
  if (b !== prof.branch) fitnessSaveProfile({ branch: b });
  const test = F_FITNESS.tests[b];
  const color = BRANCHES[b].color;

  app.append(el("div", { class: "fade-in fit-page" },
    el("div", { class: "eyebrow" }, T("Join")),
    el("h1", {}, T("PT score calculator")),
    el("p", { class: "muted" }, T("Enter your results to see points for each event, your total, and whether you'd pass each branch's current fitness test. It's an unofficial practice tool: official score sheets and calculators decide real scores.")),
    fitnessBranchNav(b, (x) => `#/pt-score/${x}`),
    test.scoring === "none" ? fitnessPtNoScoring(b, test, color) : fitnessPtCalculator(b, test, prof, color),
    el("div", { class: "actions" },
      el("a", { class: "button", href: "#/pt-log" }, T("Track your progress →")),
      el("a", { class: "button", href: "#/prep" }, T("8-week prep plan →")),
      el("a", { class: "button", href: "#/join" }, T("Back to Join")))));
}

function fitnessPtNoScoring(b, test, color) {
  return el("div", { class: "card fit-card", style: `--hero:${color}` },
    el("div", { class: "fit-branch-name" }, BRANCHES[b].name),
    el("h2", {}, test.test),
    el("p", {}, test.summary),
    el("div", { class: "section-title" }, T("Events")),
    el("ul", { class: "list" }, test.events.map((e) => el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, "•"), el("span", {}, e)))),
    el("div", { class: "note fit-note" }, el("strong", {}, T("Why there's no calculator here: ")), test.notes[0]),
    el("ul", { class: "list fit-notes" }, test.notes.slice(1).map((n) => el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, "•"), el("span", {}, n)))),
    el("div", { class: "actions" }, el("a", { class: "button primary", href: "#/pt-score/af" }, T("Practice with the Air Force calculator →"))),
    el("div", { class: "section-title" }, T("Sources")),
    fitnessSources(test.sources));
}

function fitnessPtCalculator(b, test, prof, color) {
  const st = fitnessPtBranchState(b, test);
  const variant = fitnessPtVariant(test, st);
  const comps = fitnessPtComponents(test, variant);
  const summary = el("div", { class: "fit-summary", "aria-live": "polite" });
  const hints = [];
  const outs = [];

  const update = () => {
    const res = fitnessPtCompute(b, test, st, fitnessProfile());
    res.rows.forEach((r, i) => {
      const parts = [];
      if (r.min) parts.push(T("Minimum ({pts} pts): {result}", { pts: r.min.points, result: fitnessFormat(r.min.result, r.opt.unit) }));
      else parts.push(T("No minimum"));
      parts.push(T("Max points ({pts}): {result}", { pts: r.max.points, result: fitnessFormat(r.max.result, r.opt.unit) }));
      hints[i].textContent = parts.join(" · ");
      outs[i].replaceChildren(...fitnessPtEventResult(test, r).filter(Boolean));
    });
    summary.replaceChildren(...fitnessPtSummary(b, test, res).filter(Boolean));
  };

  const ageGroupNote = el("span", { class: "fit-hint" });
  const setGroupNote = () => {
    ageGroupNote.textContent = T("Age group: {group}", { group: fitnessAgeGroup(test.ages, fitnessProfile().age) });
  };
  setGroupNote();
  const settings = [
    fitnessField(T("Age"), fitnessAgeInput(prof.age, (a) => { fitnessSaveProfile({ age: a }); setGroupNote(); update(); }), ageGroupNote),
    fitnessField(T("Sex"), fitnessSexSelect(prof.sex, (s) => { fitnessSaveProfile({ sex: s }); update(); })),
  ];

  const variantPicker = test.variants ? el("div", { class: "seg-row" },
    el("span", { class: "seg-label", id: "fit-variant-label" }, b === "army" ? T("Standard") : T("Test")),
    el("div", { class: "seg", role: "group", "aria-labelledby": "fit-variant-label" }, test.variants.map((v) => el("button", {
      type: "button", id: `fit-variant-${v.id}`, class: "seg-item" + (v.id === variant.id ? " active" : ""), "aria-pressed": String(v.id === variant.id),
      onclick: () => { st.variant = v.id; fitnessRedraw(fitnessDrawPtScore); document.getElementById(`fit-variant-${v.id}`)?.focus(); },
    }, T(v.name)))),
    el("p", { class: "muted fit-small" }, variant.desc)) : null;

  const combatArms = variant.combatArms ? el("label", { class: "fit-check-row" },
    el("input", { type: "checkbox", checked: st.combatArms, onchange: (e) => { st.combatArms = e.target.checked; update(); } }),
    el("span", {}, el("strong", {}, T("Combat arms MOS")), el("br"), el("span", { class: "muted fit-small" }, variant.combatArms.desc))) : null;

  const events = comps.map((comp, i) => {
    const key = `${variant.id}.${i}`;
    const input = (st.inputs[key] ||= {});
    const opt = comp.options.find((o) => o.id === input.opt) || comp.options[0];
    hints[i] = el("span", { class: "fit-hint" });
    outs[i] = el("div", { class: "fit-event-out" });
    const optionPicker = comp.options.length > 1 ? fitnessField(T("Event"), el("select", {
      class: "text-input",
      onchange: (e) => { input.opt = e.target.value; input.raw = ""; fitnessRedraw(fitnessDrawPtScore); document.getElementById(`fit-in-${i}`)?.focus(); },
    }, comp.options.map((o) => el("option", { value: o.id, selected: o.id === opt.id }, o.name)))) : null;
    let entry;
    if (opt.unit === "whtr") {
      const waist = el("input", { class: "text-input", type: "number", id: `fit-in-${i}`, min: "10", max: "90", step: "0.25", inputmode: "decimal", value: input.waist || "" });
      const height = el("input", { class: "text-input", type: "number", min: "48", max: "90", step: "0.25", inputmode: "decimal", value: input.height || "" });
      const calc = () => {
        input.waist = waist.value; input.height = height.value;
        const w = Number(waist.value), h = Number(height.value);
        input.ratio = w > 0 && h > 0 ? Math.round((w / h) * 100) : null;
        update();
      };
      waist.addEventListener("input", calc);
      height.addEventListener("input", calc);
      entry = el("div", { class: "fit-pair" }, fitnessField(T("Waist at the navel (inches)"), waist), fitnessField(T("Height (inches)"), height));
    } else {
      const isTime = opt.unit === "time";
      entry = fitnessField(isTime ? T("Time (minutes:seconds)") : opt.unit === "lbs" ? T("Weight (lbs)") : opt.unit === "shuttles" ? T("Shuttles") : T("Reps"),
        el("input", {
          class: "text-input", id: `fit-in-${i}`, type: "text", inputmode: isTime ? "decimal" : "numeric", autocomplete: "off",
          placeholder: isTime ? "13:45" : "0", value: input.raw || "",
          oninput: (e) => { input.raw = e.target.value; update(); },
        }));
    }
    return el("div", { class: "fit-event" },
      el("h3", { class: "fit-event-name" }, comp.name),
      el("p", { class: "muted fit-small" }, comp.desc),
      el("div", { class: "fit-event-inputs" }, optionPicker, entry),
      hints[i], outs[i]);
  });

  const card = el("div", { class: "card fit-card", style: `--hero:${color}` },
    el("div", { class: "fit-branch-name" }, BRANCHES[b].name),
    el("h2", {}, test.test),
    el("p", { class: "fit-small" }, test.summary),
    el("div", { class: "form-grid" }, settings),
    variantPicker, combatArms,
    el("div", { class: "fit-events" }, events),
    summary);

  const notes = el("div", { class: "card fit-card fit-notes-card" },
    el("div", { class: "section-title", style: "margin-top:0" }, T("Good to know")),
    el("ul", { class: "list" }, test.notes.map((n) => el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, "•"), el("span", {}, n)))),
    el("div", { class: "section-title" }, T("Sources")),
    fitnessSources(test.sources),
    el("p", { class: "muted fit-small" }, T("Checked against official sources in {date}. Standards change often, so confirm with a recruiter or your unit.", { date: F_FITNESS.asOf })),
    LANG !== "en" ? el("p", { class: "muted fit-small" }, T("Event names and test details are only available in English.")) : null);

  update();
  return [card, notes];
}

function fitnessPtEventResult(test, r) {
  if (r.value == null) return [];
  const cat = fitnessPtCategoryFor(test, r.met === false ? null : r.points);
  const status = r.met ? el("span", { class: "fit-ok" }, "✓ ", T("Meets the minimum")) : el("span", { class: "fit-bad" }, "✗ ", T("Below the minimum"));
  return [
    el("strong", { class: "fit-points" }, T("{n} points", { n: r.points })),
    r.opt.unit === "whtr" ? el("span", { class: "muted" }, T("Ratio {r}", { r: fitnessFormat(r.value, "whtr") })) : null,
    cat ? el("span", { class: "muted" }, cat) : null,
    status,
  ];
}

function fitnessPtSummary(b, test, res) {
  const scored = res.rows.filter((r) => r.value != null).length;
  if (!scored) return [el("p", { class: "muted" }, T("Fill in your results to see your score."))];
  const totalLine = test.scoring === "navy"
    ? T("Average: {avg} points", { avg: Math.round(res.average * 10) / 10 })
    : test.scoring === "cg" ? T("Events scored: {n} of {total}", { n: scored, total: res.rows.length })
      : T("Total: {total} of {max} points", { total: Math.round(res.total * 10) / 10, max: test.scoring === "af" ? 100 : res.rows.length * 100 });
  let verdict;
  if (!res.complete) {
    verdict = el("p", { class: "muted" }, T("Fill in every event to see whether you'd pass."));
  } else {
    const why = [];
    const failed = res.rows.filter((r) => !r.met).map((r) => r.comp.name);
    if (failed.length) why.push(T("Below the minimum: {events}.", { events: failed.join(", ") }));
    if (res.need && res.total < res.need) why.push(T("The total needs to be at least {n}.", { n: res.need }));
    verdict = el("div", {},
      el("p", { class: "fit-verdict " + (res.pass ? "fit-ok" : "fit-bad") }, res.pass ? `✓ ${T("Pass")}` : `✗ ${T("Not passing yet")}`),
      why.length ? el("p", { class: "fit-small" }, why.join(" ")) : null);
  }
  return [
    el("div", { class: "result-hero fit-result" },
      el("div", { class: "pct" }, T("Your score")),
      el("div", { class: "fit-total" }, totalLine),
      res.category && res.complete ? el("div", { class: "fit-category" }, T("Category: {c}", { c: res.category })) : null,
      verdict),
    el("div", { class: "table-wrap" }, el("table", {},
      el("thead", {}, el("tr", {}, el("th", { scope: "col" }, T("Event")), el("th", { scope: "col" }, T("Result")), el("th", { scope: "col" }, T("Points")))),
      el("tbody", {}, res.rows.map((r) => el("tr", {},
        el("td", { class: "wrap" }, r.comp.options.length > 1 ? r.opt.name : r.comp.name),
        el("td", {}, r.value == null ? "—" : fitnessFormat(r.value, r.opt.unit)),
        el("td", { class: r.met === false ? "fit-bad" : "" }, r.points == null ? "—" : String(r.points))))))),
  ];
}

// ---------------------------------------------------------------------------
// PT tracker: #/pt-log

const fitnessPtLogUi = { event: "pushups", confirmClear: false, status: "" };

function fitnessRenderPtLog() {
  withScripts(FITNESS_DATA, fitnessDrawPtLog);
}

function fitnessLog() {
  const data = loadJson(FITNESS_LOG_KEY, null);
  const entries = data && Array.isArray(data.entries) ? data.entries.filter(fitnessValidEntry) : [];
  return { entries };
}

function fitnessSaveLog(log) {
  saveJson(FITNESS_LOG_KEY, { v: 1, entries: log.entries });
}

function fitnessValidEntry(e) {
  return e && typeof e === "object" && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !Number.isNaN(Date.parse(e.date))
    && F_FITNESS.log.events.some((x) => x.id === e.event) && Number.isFinite(e.value) && e.value >= 0 && e.value <= 100000;
}

function fitnessToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fitnessFormatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(LANG === "en" ? "en-US" : LANG, { month: "short", day: "numeric", year: "numeric" });
}

// Minimum and max-points lines for an event, from the chosen branch's table.
function fitnessRefs(eventId, prof) {
  const ref = F_FITNESS.log.refs[prof.branch] && F_FITNESS.log.refs[prof.branch][eventId];
  if (!ref) return null;
  const test = F_FITNESS.tests[prof.branch];
  const group = fitnessAgeGroup(test.ages, prof.age);
  const pairs = fitnessColumn(prof.branch, ref.table, group, prof.sex === "female" ? "f" : "m");
  const minPts = test.scoring === "army" ? 60 : 0;
  return { note: ref.note, group, min: fitnessMinResult(pairs, minPts), max: { result: pairs[0], points: pairs[1] } };
}

function fitnessDrawPtLog() {
  const prof = fitnessProfile();
  const log = fitnessLog();
  const events = F_FITNESS.log.events;
  const ev = events.find((e) => e.id === fitnessPtLogUi.event) || events[0];

  const status = el("p", { class: "fit-status", role: "status" }, fitnessPtLogUi.status);
  fitnessPtLogUi.status = "";

  // Reference standards.
  const profileCard = el("div", { class: "card fit-card" },
    el("div", { class: "section-title", style: "margin-top:0" }, T("Compare with")),
    el("p", { class: "muted fit-small" }, T("Charts show the minimum and the max-points result for this branch, age and sex, where the branch tests that event.")),
    el("div", { class: "form-grid" },
      fitnessField(T("Branch"), el("select", { class: "text-input", onchange: (e) => { fitnessSaveProfile({ branch: e.target.value }); fitnessRedraw(fitnessDrawPtLog); } },
        ORDER.map((b) => el("option", { value: b, selected: b === prof.branch }, BRANCHES[b].name)))),
      fitnessField(T("Age"), fitnessAgeInput(prof.age, (a) => { fitnessSaveProfile({ age: a }); fitnessPtLogRedrawCharts(); })),
      fitnessField(T("Sex"), fitnessSexSelect(prof.sex, (s) => { fitnessSaveProfile({ sex: s }); fitnessRedraw(fitnessDrawPtLog); }))));

  // New entry form.
  const date = el("input", { class: "text-input", type: "date", value: fitnessToday(), max: fitnessToday(), required: true });
  const valueInput = el("input", {
    class: "text-input", type: "text", autocomplete: "off", required: true,
    inputmode: ev.unit === "time" ? "decimal" : "numeric", placeholder: ev.unit === "time" ? "13:45" : "0",
  });
  const eventSelect = el("select", {
    class: "text-input",
    onchange: (e) => { fitnessPtLogUi.event = e.target.value; fitnessRedraw(fitnessDrawPtLog); document.querySelector(".fit-log-form select")?.focus(); },
  }, events.map((e) => el("option", { value: e.id, selected: e.id === ev.id }, T(e.name))));
  const form = el("form", {
    class: "fit-log-form",
    onsubmit: (e) => {
      e.preventDefault();
      const value = fitnessParseValue(valueInput.value, ev.unit, ev.higher);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value)) { status.textContent = T("Pick a date."); return; }
      if (value == null) {
        status.textContent = ev.unit === "time" ? T("Enter the time as minutes:seconds, like 13:45.") : T("Enter a whole number.");
        valueInput.focus();
        return;
      }
      log.entries.push({ id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, date: date.value, event: ev.id, value });
      fitnessSaveLog(log);
      fitnessPtLogUi.status = T("Saved {event}: {value} on {date}.", { event: T(ev.name), value: fitnessFormat(value, ev.unit), date: fitnessFormatDate(date.value) });
      fitnessRedraw(fitnessDrawPtLog);
      document.querySelector(".fit-log-form input[type=text]")?.focus();
    },
  },
  el("div", { class: "form-grid" },
    fitnessField(T("Date"), date),
    fitnessField(T("Event"), eventSelect),
    fitnessField(ev.unit === "time" ? T("Time (minutes:seconds)") : T("Reps"), valueInput)),
  el("div", { class: "actions", style: "margin-top:14px" }, el("button", { class: "primary", type: "submit" }, T("Add result"))),
  status);

  const charts = el("div", { class: "fit-charts" });
  fitnessPtLogCharts(charts, log, prof);

  app.append(el("div", { class: "fade-in fit-page" },
    el("div", { class: "eyebrow" }, T("Join")),
    el("h1", {}, T("PT tracker")),
    el("p", { class: "muted" }, T("Log your workouts and test results to watch them improve. Everything stays in this browser on this device: export a file to back it up or move it.")),
    el("div", { class: "card fit-card" }, el("div", { class: "section-title", style: "margin-top:0" }, T("Add a result")), form),
    profileCard,
    charts,
    fitnessPtLogDataCard(log),
    el("div", { class: "actions" },
      el("a", { class: "button", href: "#/pt-score" }, T("PT score calculator →")),
      el("a", { class: "button", href: "#/prep" }, T("8-week prep plan →")))));
}

function fitnessPtLogRedrawCharts() {
  const box = document.querySelector(".fit-charts");
  if (box) fitnessPtLogCharts(box, fitnessLog(), fitnessProfile());
}

function fitnessPtLogCharts(box, log, prof) {
  const events = F_FITNESS.log.events.filter((e) => log.entries.some((x) => x.event === e.id));
  if (!events.length) {
    box.replaceChildren(el("div", { class: "card fit-card" }, el("p", { class: "muted", style: "margin:0" }, T("No results yet. Add one above and a chart will appear here."))));
    return;
  }
  box.replaceChildren(...events.map((ev) => {
    const entries = log.entries.filter((x) => x.event === ev.id).sort((a, b) => a.date.localeCompare(b.date) || 0);
    const refs = fitnessRefs(ev.id, prof);
    const best = entries.reduce((m, x) => (m == null || (ev.higher ? x.value > m : x.value < m) ? x.value : m), null);
    const latest = entries[entries.length - 1];
    return el("section", { class: "card fit-card fit-chart-card", "aria-labelledby": `fit-chart-${ev.id}` },
      el("h2", { class: "fit-chart-title", id: `fit-chart-${ev.id}` }, T(ev.name)),
      el("p", { class: "fit-small" },
        T("Latest: {value}", { value: fitnessFormat(latest.value, ev.unit) }), " · ", T("Best: {value}", { value: fitnessFormat(best, ev.unit) })),
      fitnessChart(ev, entries, refs),
      el("p", { class: "muted fit-small" }, ev.higher ? T("Higher on the chart is better.") : T("Faster times are higher on the chart.")),
      refs ? el("p", { class: "fit-small fit-legend" },
        el("span", { class: "fit-key min", "aria-hidden": "true" }), T("{branch} minimum: {value}", { branch: BRANCHES[prof.branch].name, value: refs.min ? fitnessFormat(refs.min.result, ev.unit) : "—" }),
        el("br"),
        el("span", { class: "fit-key max", "aria-hidden": "true" }), T("Max points: {value}", { value: fitnessFormat(refs.max.result, ev.unit) }),
        el("br"),
        el("span", { class: "muted" }, T("{note}, age group {group}", { note: refs.note, group: refs.group })))
        : el("p", { class: "muted fit-small" }, T("{branch} doesn't test this event.", { branch: BRANCHES[prof.branch].name })),
      el("details", { class: "fit-entries" },
        el("summary", {}, T("All entries ({n})", { n: entries.length })),
        el("ul", { class: "fit-entry-list" }, entries.slice().reverse().map((x) => el("li", {},
          el("span", {}, fitnessFormatDate(x.date)),
          el("strong", {}, fitnessFormat(x.value, ev.unit)),
          el("button", {
            type: "button", class: "fit-delete", "aria-label": T("Delete {value} from {date}", { value: fitnessFormat(x.value, ev.unit), date: fitnessFormatDate(x.date) }),
            onclick: () => {
              const all = fitnessLog();
              all.entries = all.entries.filter((y) => y.id !== x.id);
              fitnessSaveLog(all);
              fitnessPtLogUi.status = T("Entry deleted.");
              fitnessRedraw(fitnessDrawPtLog);
            },
          }, "✕"))))));
  }));
}

// A line chart of one event over time, with the branch's reference lines.
function fitnessChart(ev, entries, refs) {
  const W = 600, H = 240, L = 56, R = 14, TOP = 14, B = 34;
  const svg = (tag, attrs, ...kids) => {
    const n = document.createElementNS(FITNESS_SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
    kids.flat().forEach((k) => k != null && n.append(k.nodeType ? k : document.createTextNode(k)));
    return n;
  };
  const vals = entries.map((x) => x.value);
  const lines = refs ? [refs.min && refs.min.result, refs.max.result].filter((v) => v != null) : [];
  let lo = Math.min(...vals, ...lines), hi = Math.max(...vals, ...lines);
  if (lo === hi) { lo -= ev.unit === "time" ? 30 : 5; hi += ev.unit === "time" ? 30 : 5; }
  const pad = (hi - lo) * 0.1;
  lo = Math.max(0, lo - pad); hi += pad;
  // Better results sit higher: flip the scale for timed events where lower wins.
  const y = (v) => {
    const t = (v - lo) / (hi - lo);
    return TOP + (ev.higher ? 1 - t : t) * (H - TOP - B);
  };
  const days = entries.map((x) => Date.parse(x.date));
  const d0 = Math.min(...days), d1 = Math.max(...days);
  const x = (d) => (d1 === d0 ? (L + W - R) / 2 : L + ((d - d0) / (d1 - d0)) * (W - L - R));

  const ticks = [0, 1, 2, 3].map((i) => lo + ((hi - lo) * i) / 3);
  const tickLabel = (v) => (ev.unit === "time" ? fitnessFormatTime(Math.round(v)) : String(Math.round(v)));
  const pts = entries.map((e, i) => [x(days[i]), y(e.value)]);
  const summary = T("{event} chart: {n} results from {from} to {to}. Latest {value}.", {
    event: T(ev.name), n: entries.length, from: fitnessFormatDate(entries[0].date), to: fitnessFormatDate(entries[entries.length - 1].date),
    value: fitnessFormat(entries[entries.length - 1].value, ev.unit),
  });
  return svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "fit-chart", role: "img", "aria-label": summary },
    ticks.map((v) => svg("g", {},
      svg("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "fit-grid" }),
      svg("text", { x: L - 8, y: y(v) + 4, "text-anchor": "end", class: "fit-axis" }, tickLabel(v)))),
    refs && refs.min ? svg("line", { x1: L, x2: W - R, y1: y(refs.min.result), y2: y(refs.min.result), class: "fit-ref min" }) : null,
    refs ? svg("line", { x1: L, x2: W - R, y1: y(refs.max.result), y2: y(refs.max.result), class: "fit-ref max" }) : null,
    pts.length > 1 ? svg("polyline", { points: pts.map((p) => p.join(",")).join(" "), class: "fit-line" }) : null,
    pts.map((p, i) => svg("circle", { cx: p[0], cy: p[1], r: 5, class: "fit-dot" },
      svg("title", {}, `${fitnessFormatDate(entries[i].date)}: ${fitnessFormat(entries[i].value, ev.unit)}`))),
    svg("text", { x: entries.length > 1 ? L : (L + W - R) / 2, y: H - 10, "text-anchor": entries.length > 1 ? "start" : "middle", class: "fit-axis" }, fitnessFormatDate(entries[0].date)),
    entries.length > 1 ? svg("text", { x: W - R, y: H - 10, "text-anchor": "end", class: "fit-axis" }, fitnessFormatDate(entries[entries.length - 1].date)) : null);
}

function fitnessPtLogDataCard(log) {
  const fileInput = el("input", {
    type: "file", accept: ".json,application/json", id: "fit-import", hidden: true,
    onchange: (e) => { const f = e.target.files[0]; if (f) fitnessPtLogImport(f); },
  });
  const clearArea = fitnessPtLogUi.confirmClear
    ? el("div", { class: "note fit-confirm", role: "group", "aria-labelledby": "fit-confirm-text" },
      el("p", { id: "fit-confirm-text" }, T("Delete all {n} logged results? This can't be undone. Export a backup first if you might want them.", { n: log.entries.length })),
      el("div", { class: "actions", style: "margin-top:0" },
        el("button", { type: "button", class: "fit-danger", id: "fit-confirm-yes", onclick: () => { saveJson(FITNESS_LOG_KEY, { v: 1, entries: [] }); fitnessPtLogUi.confirmClear = false; fitnessPtLogUi.status = T("All results deleted."); fitnessRedraw(fitnessDrawPtLog); } }, T("Delete everything")),
        el("button", { type: "button", onclick: () => { fitnessPtLogUi.confirmClear = false; fitnessRedraw(fitnessDrawPtLog); document.getElementById("fit-clear")?.focus(); } }, T("Cancel"))))
    : null;
  const card = el("div", { class: "card fit-card" },
    el("div", { class: "section-title", style: "margin-top:0" }, T("Your data")),
    el("p", { class: "muted fit-small" }, T("{n} results saved in this browser.", { n: log.entries.length })),
    el("div", { class: "actions", style: "margin-top:0" },
      el("button", { type: "button", onclick: () => fitnessPtLogExport(log), disabled: !log.entries.length }, T("Export (.json)")),
      el("button", { type: "button", onclick: () => fileInput.click() }, T("Import a file")),
      el("button", {
        type: "button", id: "fit-clear", class: "fit-danger", disabled: !log.entries.length,
        onclick: () => { fitnessPtLogUi.confirmClear = true; fitnessRedraw(fitnessDrawPtLog); document.getElementById("fit-confirm-yes")?.focus(); },
      }, T("Clear all data"))),
    fileInput, clearArea);
  return card;
}

function fitnessPtLogExport(log) {
  const body = JSON.stringify({ app: "Ranked Bingo PT tracker", v: 1, exported: new Date().toISOString(), entries: log.entries }, null, 2);
  const url = URL.createObjectURL(new Blob([body], { type: "application/json" }));
  const a = el("a", { href: url, download: `pt-log-${fitnessToday()}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fitnessPtLogImport(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let incoming = null;
    try {
      const data = JSON.parse(reader.result);
      incoming = Array.isArray(data) ? data : data && data.entries;
    } catch { incoming = null; }
    if (!Array.isArray(incoming)) {
      fitnessPtLogUi.status = T("That file isn't a PT tracker export.");
      fitnessRedraw(fitnessDrawPtLog);
      return;
    }
    const log = fitnessLog();
    const seen = new Set(log.entries.map((e) => `${e.date}|${e.event}|${e.value}`));
    let added = 0, skipped = 0;
    for (const e of incoming) {
      const entry = e && { id: String(e.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`).slice(0, 40), date: e.date, event: e.event, value: Number(e.value) };
      const k = entry && `${entry.date}|${entry.event}|${entry.value}`;
      if (!entry || !fitnessValidEntry(entry) || seen.has(k)) { skipped += 1; continue; }
      seen.add(k);
      log.entries.push(entry);
      added += 1;
    }
    fitnessSaveLog(log);
    fitnessPtLogUi.status = T("Imported {added} results ({skipped} skipped as duplicates or invalid).", { added, skipped });
    fitnessRedraw(fitnessDrawPtLog);
  };
  reader.onerror = () => { fitnessPtLogUi.status = T("Couldn't read that file."); fitnessRedraw(fitnessDrawPtLog); };
  reader.readAsText(file);
}

// ---------------------------------------------------------------------------
// Boot camp prep plan: #/prep/<branch>

const fitnessPrepUi = { confirmReset: false };

function fitnessRenderPrep() {
  withScripts(FITNESS_DATA, fitnessDrawPrep);
}

function fitnessDrawPrep() {
  const prof = fitnessProfile();
  const b = ORDER.includes(route.parts[0]) ? route.parts[0] : prof.branch;
  if (b !== prof.branch) fitnessSaveProfile({ branch: b });
  const plan = F_FITNESS.prep;
  const notes = plan.branches[b];
  const saved = loadJson(FITNESS_PREP_KEY, {}) || {};
  const done = saved.done && typeof saved.done === "object" ? saved.done : {};
  const total = plan.weeks.reduce((n, w) => n + w.sessions.length, 0);
  const count = () => plan.weeks.reduce((n, w, wi) => n + w.sessions.filter((s, si) => done[`${wi + 1}-${si + 1}`]).length, 0);

  const progressText = el("span", {});
  const bar = el("div", { style: "width:0%" });
  const progress = el("div", { class: "progress fit-progress", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-label": T("Sessions done") }, bar);
  const refresh = () => {
    const n = count();
    progressText.textContent = T("{n} of {total} sessions done", { n, total });
    bar.style.width = `${(n / total) * 100}%`;
    progress.setAttribute("aria-valuenow", String(n));
  };
  refresh();

  const firstOpen = plan.weeks.findIndex((w, wi) => w.sessions.some((s, si) => !done[`${wi + 1}-${si + 1}`]));
  const weeks = plan.weeks.map((w, wi) => {
    const wDone = w.sessions.filter((s, si) => done[`${wi + 1}-${si + 1}`]).length;
    const wCount = el("span", { class: "fit-week-count" }, T("{n}/{total}", { n: wDone, total: w.sessions.length }));
    return el("details", { class: "job fit-week", style: "--hero:var(--accent)", open: wi === (firstOpen < 0 ? 0 : firstOpen) },
      el("summary", {}, el("strong", { class: "job-name" }, w.title), wCount),
      el("div", { class: "fit-sessions" }, w.sessions.map((s, si) => {
        const key = `${wi + 1}-${si + 1}`;
        const id = `fit-s-${key}`;
        return el("div", { class: "fit-session" },
          el("label", { class: "fit-check-row", for: id },
            el("input", {
              type: "checkbox", id, checked: !!done[key],
              onchange: (e) => {
                if (e.target.checked) done[key] = true; else delete done[key];
                saveJson(FITNESS_PREP_KEY, { done });
                wCount.textContent = T("{n}/{total}", { n: w.sessions.filter((x, xi) => done[`${wi + 1}-${xi + 1}`]).length, total: w.sessions.length });
                refresh();
              },
            }),
            el("strong", {}, T("Session {n}: {title}", { n: si + 1, title: s.title }))),
          el("ul", { class: "fit-items" }, s.items.map((it) => el("li", {}, it))));
      })));
  });

  const resetArea = fitnessPrepUi.confirmReset
    ? el("div", { class: "note fit-confirm", role: "group", "aria-labelledby": "fit-reset-text" },
      el("p", { id: "fit-reset-text" }, T("Uncheck every session and start over?")),
      el("div", { class: "actions", style: "margin-top:0" },
        el("button", { type: "button", class: "fit-danger", id: "fit-reset-yes", onclick: () => { saveJson(FITNESS_PREP_KEY, { done: {} }); fitnessPrepUi.confirmReset = false; fitnessRedraw(fitnessDrawPrep); } }, T("Reset progress")),
        el("button", { type: "button", onclick: () => { fitnessPrepUi.confirmReset = false; fitnessRedraw(fitnessDrawPrep); document.getElementById("fit-reset")?.focus(); } }, T("Cancel"))))
    : null;

  app.append(el("div", { class: "fade-in fit-page" },
    el("div", { class: "eyebrow" }, T("Join")),
    el("h1", {}, T("Boot camp prep plan")),
    el("p", { class: "muted" }, T("An 8-week plan that builds running, push-ups, pull-ups, core strength and mobility from an easy start. Check off sessions as you go; your progress is saved in this browser.")),
    el("div", { class: "note fit-safety" },
      el("strong", {}, T("Before you start")),
      el("ul", { class: "fit-items" }, plan.safety.map((s) => el("li", {}, s)))),
    fitnessBranchNav(b, (x) => `#/prep/${x}`),
    el("div", { class: "card fit-card", style: `--hero:${BRANCHES[b].color}` },
      el("div", { class: "fit-branch-name" }, BRANCHES[b].name),
      el("h2", {}, T("What {camp} checks", { camp: notes.title })),
      el("ul", { class: "list" }, notes.points.map((p) => el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, "•"), el("span", {}, p)))),
      el("div", { class: "actions", style: "margin-top:14px" },
        F_FITNESS.tests[b].scoring !== "none" ? el("a", { class: "button", href: `#/pt-score/${b}` }, T("Score the {branch} test →", { branch: BRANCHES[b].name })) : null),
      el("div", { class: "section-title" }, T("Sources")),
      fitnessSources(notes.sources)),
    el("div", { class: "card fit-card" },
      el("div", { class: "progress-row" }, progressText),
      progress,
      el("div", { class: "section-title", style: "margin-top:0" }, T("How to use the plan")),
      el("ul", { class: "fit-items" }, plan.howTo.map((h) => el("li", {}, h))),
      el("div", { class: "actions" },
        el("a", { class: "button", href: "#/pt-log" }, T("Log your results →")),
        el("button", { type: "button", id: "fit-reset", disabled: !count(), onclick: () => { fitnessPrepUi.confirmReset = true; fitnessRedraw(fitnessDrawPrep); document.getElementById("fit-reset-yes")?.focus(); } }, T("Reset progress"))),
      resetArea),
    el("div", { class: "jobs fit-weeks" }, weeks),
    LANG !== "en" ? el("p", { class: "muted fit-small", style: "margin-top:16px" }, T("The plan and boot camp details are only available in English.")) : null));
}

// ---------------------------------------------------------------------------

registerPage("pt-score", {
  render: fitnessRenderPtScore,
  title: () => T("PT score calculator"),
  hub: "join",
  icon: "⏱️",
  blurb: () => T("Score each branch's current fitness test, event by event."),
});

registerPage("pt-log", {
  render: fitnessRenderPtLog,
  title: () => T("PT tracker"),
  hub: "join",
  icon: "📈",
  blurb: () => T("Log push-ups, planks and run times, and chart your progress."),
});

registerPage("prep", {
  render: fitnessRenderPrep,
  title: () => T("Boot camp prep plan"),
  hub: "join",
  icon: "🗓️",
  blurb: () => T("An 8-week plan to get ready, plus what each boot camp tests."),
});
