"use strict";

// Skipped questions stay null in answers, so scoring simply ignores them.
// `orders` holds each question's option display order (options are shuffled
// unless the question is a scale).
const state = { step: -1, answers: [], skipped: new Set(), orders: [], mode: "full" };
const app = document.getElementById("app");

// Add ?debug to the URL to see what every answer scores, for playtesting, and
// ?seed=N to get the same question set and order every time.
const params = new URLSearchParams(location.search);
const DEBUG = params.has("debug");
const SEED = params.has("seed") ? Number(params.get("seed")) || 1 : null;
let rng = makeRng(SEED ?? Math.floor(Math.random() * 2 ** 31));

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "style") node.style.cssText = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c != null) node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

// ---------------------------------------------------------------------------
// Saving progress. Stored only in this browser, so "resume later" works after
// closing the tab, and a finished result can be compared with a friend's.

const SAVE_KEY = "rankedbingo.session.v1";

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      ids: QUESTIONS.map((q) => q.id), answers: state.answers, skipped: [...state.skipped],
      orders: state.orders, step: state.step, mode: state.mode,
    }));
  } catch { /* storage unavailable: progress just isn't kept */ }
}

function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    const qs = s.ids.map((id) => POOL.find((q) => q.id === id));
    if (qs.some((q) => !q) || s.orders.length !== qs.length) return null;
    return { ...s, qs };
  } catch {
    return null;
  }
}

function newQuiz(mode) {
  QUESTIONS = pickQuestions(mode, rng);
  state.orders = pickOrders(QUESTIONS, rng);
  state.mode = mode;
  state.answers = [];
  state.skipped = new Set();
  state.step = -1;
}

function startQuiz(mode) {
  if (mode !== state.mode || state.step !== -1) newQuiz(mode);
  state.step = 0;
  save();
  render();
}

// On load, pick up a saved quiz if there is one; otherwise draw a new one.
(function restore() {
  const saved = SEED == null && loadSaved();
  if (saved) {
    QUESTIONS = saved.qs;
    Object.assign(state, { answers: saved.answers, skipped: new Set(saved.skipped), orders: saved.orders, mode: saved.mode });
    // An unfinished quiz waits on the intro screen with a Continue button.
    state.step = saved.step >= QUESTIONS.length ? QUESTIONS.length : -1;
    state.resumeStep = saved.step >= 0 && saved.step < QUESTIONS.length ? saved.step : null;
  } else {
    newQuiz("full");
  }
})();

function myResultCode() {
  return state.step >= QUESTIONS.length ? encodeAnswers(QUESTIONS, state.answers) : null;
}

// ---------------------------------------------------------------------------

function render() {
  parseRoute();
  renderNav();
  setBackground(null);
  app.replaceChildren();
  if (route.page === "branches") renderBranches();
  else if (route.page === "branch") renderBranch();
  else if (route.page === "types") renderTypes();
  else if (route.page === "training") renderTraining();
  else if (route.page === "shared") renderShared();
  else if (route.page === "compare") renderCompare();
  else if (state.step < 0) renderIntro();
  else if (state.step < QUESTIONS.length) renderQuestion();
  else renderResults();
  const titles = { branches: "Branches", types: "Service types", training: "Boot camp & training", shared: "Shared result", compare: "Compare results" };
  const pageTitle = route.page === "branch" ? BRANCHES[route.branch].name : titles[route.page];
  document.title = pageTitle ? `${pageTitle} · Ranked Bingo` : "Ranked Bingo";
  window.scrollTo({ top: 0 });
}

window.addEventListener("hashchange", render);

function renderIntro() {
  const full = MODES.full, quick = MODES.quick;
  const total = (m) => m.trait + m.interest + m.role + m.service;
  const resumable = state.resumeStep != null;
  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, "Ranked Bingo"),
    el("h1", {}, "Which military branch fits you?"),
    el("p", { class: "muted" },
      `Questions about how you like to live, work, train and think, drawn from a pool of ${POOL.length}, so every quiz is a little different. No single answer decides anything: each one shifts a set of traits, and you're matched to the branch whose overall profile is closest to yours. Then a few questions pick your top jobs, enlisted or officer, and Active Duty, the Reserve or the National Guard.`),
    el("div", { class: "chips branch-strip" },
      ORDER.map((b) => el("span", { class: "chip" },
        el("span", { class: "dot", style: `background:${BRANCHES[b].color}` }), BRANCHES[b].name))),
    resumable
      ? el("div", { class: "note", style: "margin-bottom:14px" }, `You have a quiz in progress (question ${state.resumeStep + 1} of ${QUESTIONS.length}).`)
      : null,
    el("div", { class: "actions", style: "margin-top:0" },
      resumable
        ? el("button", { class: "primary", onclick: () => { state.step = state.resumeStep; state.resumeStep = null; render(); } }, "Continue")
        : null,
      el("button", { class: resumable ? "" : "primary", onclick: () => { if (resumable) newQuiz("full"); state.resumeStep = null; startQuiz("full"); } },
        resumable ? `Start over (${total(full)} questions)` : "Start the quiz"),
      el("button", { onclick: () => { if (resumable) newQuiz("quick"); state.resumeStep = null; startQuiz("quick"); } }, `Quick mode (${total(quick)} questions)`)),
    el("p", { class: "muted", style: "margin:12px 0 0; font-size:14px" },
      `The full quiz has ${total(full)} questions and takes about 8 minutes. Quick mode takes about 3 minutes but gives a rougher result.`),
  ));
}

function renderQuestion() {
  const i = state.step;
  const q = QUESTIONS[i];
  const chosen = state.answers[i];
  const skipped = state.skipped.has(i);
  const order = state.orders[i];

  const options = order.map((idx, pos) => {
    const o = q.options[idx];
    return el("button", {
      class: "option" + (chosen === idx ? " selected" : ""),
      "aria-pressed": String(chosen === idx),
      "data-i": idx,
      onclick: () => choose(idx),
    }, el("span", { class: "key" }, String((pos + 1) % 10)),
      el("span", {}, o.t, DEBUG ? el("span", { class: "debug" }, describeEffects(o)) : null));
  });

  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "progress-row" },
      el("span", {}, `Question ${i + 1} / ${QUESTIONS.length}`),
      el("span", {}, q.topic)),
    el("div", { class: "progress" }, el("div", { style: `width:${(i / QUESTIONS.length) * 100}%` })),
    el("h2", {}, q.q),
    DEBUG ? el("div", { class: "debug debug-live" }, `#${q.id} · Live: ` +
      score(state.answers).slice(0, 3).map((r) => `${BRANCHES[r.id].name} ${r.pct}%`).join(" · ")) : null,
    el("div", { class: "options", role: "group", "aria-label": q.q }, options),
    el("button", { class: "skip" + (skipped ? " selected" : ""), "aria-pressed": String(skipped), onclick: skip },
      "None of these fit me, skip"),
    el("div", { class: "nav" },
      el("button", { onclick: back }, i === 0 ? "Intro" : "Back"),
      el("button", { class: "primary", disabled: chosen == null && !skipped, onclick: next },
        i === QUESTIONS.length - 1 ? "See my results" : "Next")),
  ));
}

function describeEffects(o) {
  const fmt = (obj, label = (k) => k) => Object.entries(obj || {}).map(([k, v]) => `${label(k)} ${v > 0 ? "+" : ""}${v}`);
  const parts = [
    ...fmt(o.w),
    ...fmt(o.i, (k) => `job:${k}`),
    ...fmt(o.k),
    ...fmt(o.c),
  ];
  return parts.length ? parts.join(", ") : "no effect";
}

let advanceTimer = 0;

function choose(idx) {
  state.answers[state.step] = idx;
  state.skipped.delete(state.step);
  save();
  render();
  autoAdvance();
}

function skip() {
  state.answers[state.step] = null;
  state.skipped.add(state.step);
  save();
  render();
  autoAdvance();
}

// Moves on after a short beat so the selection is visible.
function autoAdvance() {
  clearTimeout(advanceTimer);
  const step = state.step;
  advanceTimer = setTimeout(() => { if (state.step === step) next(); }, 220);
}

function next() {
  if (state.answers[state.step] == null && !state.skipped.has(state.step)) return;
  state.step += 1;
  save();
  render();
}

function back() {
  clearTimeout(advanceTimer);
  state.step -= 1;
  save();
  render();
}

function minAnswers(qs) {
  return Math.min(10, Math.ceil(qs.length * 0.6));
}

function renderResults() {
  const answered = state.answers.filter((a) => a != null).length;
  if (answered < minAnswers(QUESTIONS)) {
    app.append(el("div", { class: "card fade-in" },
      el("div", { class: "eyebrow" }, "Not enough intel"),
      el("h1", {}, "Answer a few more"),
      el("p", { class: "muted" },
        `You answered ${answered} of ${QUESTIONS.length} questions. Answer at least ${minAnswers(QUESTIONS)} so there's enough to match you on.`),
      el("div", { class: "actions" },
        el("button", { class: "primary", onclick: () => { state.step = state.skipped.size ? Math.min(...state.skipped) : 0; render(); } }, "Go back to skipped questions"),
        el("button", { onclick: restart }, "Start over")),
    ));
    return;
  }
  app.append(resultView({ qs: QUESTIONS, answers: state.answers, mine: true, quick: state.mode === "quick" }));
}

// Everything computed for one result, mine or shared.
function computeResult(qs, answers) {
  const ranked = score(answers, qs);
  const top = ranked[0];
  const tied = ranked.filter((r) => r.pct === top.pct);
  const components = componentScore(answers, qs);
  const tracks = trackScore(answers, qs);
  return {
    qs, answers, ranked, top, tied, components, tracks,
    user: profile(answers, qs),
    track: TRACKS[tracks[0].id],
    options: tied.map((r) => serviceOption(r.id, components[0].id)),
    topJob: (branch, count = 1) => topJobs(answers, branch, tracks[0].id, count, qs),
    hasDegree: answers.some((idx, i) => idx != null && qs[i].options[idx].degree),
  };
}

function bar(label, pct, color) {
  const fill = el("div", { style: `background:${color}` });
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + "%"; }));
  return el("div", { class: "bar-row" },
    el("span", {}, label),
    el("div", { class: "bar", role: "img", "aria-label": `${label} ${pct}%` }, fill),
    el("span", { class: "num" }, pct + "%"));
}

// The full results card. `mine` adds the share and retake tools; `name` is
// set when viewing someone else's shared result.
function resultView({ qs, answers, mine = false, name = null, quick = false }) {
  const r = computeResult(qs, answers);
  const { ranked, top, tied, user, components, tracks, track, options } = r;
  const isTie = tied.length > 1;
  setBackground(top.id);
  const names = joinWords(tied.map((x) => BRANCHES[x.id].name));
  const info = BRANCHES[top.id];
  const you = mine ? "you" : (name || "they");
  const your = mine ? "your" : (name ? `${name}'s` : "their");
  const jobNotes = tied.map((x) => interestNote(answers, x.id, qs)).filter(Boolean);
  const strongest = Object.entries(user)
    .filter(([, u]) => Math.abs(u.value) >= 1)
    .sort((a, b) => b[1].weight * Math.abs(b[1].value) - a[1].weight * Math.abs(a[1].value))
    .slice(0, 6);

  const why = tied.flatMap((x) => fits(user, x.id).slice(0, isTie ? 3 : 5)
    .map((w) => `${capitalize(you)} lean${mine || !name ? "" : "s"} toward ${w}, and so does the ${BRANCHES[x.id].name}.`));
  const headsUp = tied.flatMap((x) => clashes(user, x.id).slice(0, isTie ? 2 : 3))
    .map((h) => mine ? h : h.replace(", but you leaned", `, but ${you} leaned`));

  const jobCards = tied.flatMap((x) => {
    const b = BRANCHES[x.id];
    return r.topJob(x.id, isTie ? 2 : 3).map((j, n) =>
      el("div", { class: "job", style: `--hero:${b.color}` },
        el("div", { class: "job-path" }, `#${n + 1} · ${b.name} · ${track.name}`),
        el("strong", { class: "job-name" }, j.n),
        el("p", { class: "muted", style: "margin:4px 0 0" }, j.d),
        j.shared.length ? el("p", { style: "margin:6px 0 0; font-size:14px" },
          `Fits ${your} interest in ${joinWords(j.shared.slice(0, 2).map((k) => INTERESTS[k]))}.`) : null,
        el("p", { style: "margin:6px 0 0; font-size:14px" }, el("strong", {}, "After getting out: "), civilianCareers(j).join(", ")),
        el("a", { href: branchLink(x.id, tracks[0].id, components[0].id), style: "display:inline-block; margin-top:8px; font-size:14px" }, "See this path →")));
  });

  // Every other branch within 10 points of the top is shown as a close match;
  // otherwise just the runner-up.
  const rest = ranked.slice(tied.length);
  const closeOnes = rest.filter((x) => top.pct - x.pct <= 10);
  const others = closeOnes.length ? closeOnes : rest.slice(0, 1);
  const otherCards = others.map((x) => {
    const b = BRANCHES[x.id];
    const reasons = fits(user, x.id).slice(0, 2);
    return el("div", { class: "runner-up", style: `border-left:4px solid ${b.color}` },
      el("strong", {}, `${b.name} (${x.pct}%)`),
      el("p", { class: "muted", style: "margin:6px 0 0" }, b.tagline),
      reasons.length ? el("p", { style: "margin:8px 0 0; font-size:14px" },
        `Shares ${your} lean toward ${reasons.join(" and ")}.`) : null,
      el("p", { style: "margin:8px 0 0; font-size:14px" },
        "Top role: ", el("strong", {}, r.topJob(x.id)[0].n)));
  });

  // "Why not ___?": every branch row opens to show what fits and what doesn't.
  const branchRows = ranked.map((x) => {
    const b = BRANCHES[x.id];
    const good = fits(user, x.id).slice(0, 3);
    const bad = clashes(user, x.id).slice(0, 3);
    return el("details", { class: "why-row" },
      el("summary", {}, bar(b.name, x.pct, b.color)),
      el("div", { class: "why-body" },
        good.length
          ? el("ul", { class: "list good" }, good.map((g) => el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, capitalize(g)))))
          : el("p", { class: "muted", style: "margin:0" }, `Not much in common with ${your} strongest leanings.`),
        bad.length
          ? el("ul", { class: "list warn", style: "margin-top:8px" }, bad.map((g) => el("li", {}, el("span", { class: "mark" }, "!"), el("span", {}, mine ? g : g.replace(", but you leaned", `, but ${you} leaned`)))))
          : null,
        el("a", { href: branchLink(x.id, tracks[0].id, components[0].id), style: "font-size:14px" }, `Explore the ${b.name} →`)));
  });

  return el("div", { class: "card results fade-in" },
    el("div", { class: "eyebrow" }, isTie ? "It's a tie!" : mine ? "Your best match" : `${name ? name + "'s" : "Their"} best match`),
    el("div", { class: "result-hero", style: `--hero:${info.color}` },
      el("h1", {}, names),
      el("div", { class: "pct" }, isTie ? `${top.pct}% MATCH EACH` : `${top.pct}% MATCH`),
      isTie
        ? el("p", { style: "margin-top:12px" }, "These branches fit equally well, so both are worth a serious look.")
        : el("p", { style: "margin-top:12px" }, info.tagline),
      el("p", { style: "margin:0" }, isTie ? "Best ways to serve: " : "Best way to serve: ",
        el("strong", {}, options.map((o) => `${o.title}, ${track.name}`).join(" or ")))),
    quick ? el("div", { class: "note", style: "margin-bottom:14px" }, "Quick mode result: fewer questions means a rougher estimate. Take the full quiz for a sharper one.") : null,
    tied.map((x) => el("p", {}, isTie ? el("strong", {}, BRANCHES[x.id].name + ": ") : null, BRANCHES[x.id].about)),

    el("div", { class: "section-title" }, mine ? "Top roles for you" : "Top roles"),
    el("div", { class: "jobs" }, jobCards),
    jobNotes.map((n) => el("div", { class: "note", style: "margin-top:12px" }, n)),
    el("p", { class: "muted", style: "margin:10px 0 0; font-size:13px" },
      "Job names are simplified. Every branch has many more jobs, and which ones you can get depends on test scores, physical standards and openings. Civilian careers are common paths, and some need extra licenses or school."),

    strongest.length ? [
      el("div", { class: "section-title" }, mine ? "Your profile" : "Profile"),
      el("div", { class: "chips" }, strongest.map(([t, u]) => el("span", { class: "chip" }, capitalize(phrase(t, u.value))))),
    ] : null,

    el("div", { class: "section-title" }, "Trait map"),
    radarSection(user, top.id),

    why.length ? [
      el("div", { class: "section-title" }, mine ? "Why you matched" : "Why it matched"),
      el("ul", { class: "list good" }, why.map((w) =>
        el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, w)))),
    ] : null,

    headsUp.length ? [
      el("div", { class: "section-title" }, "Heads up"),
      el("ul", { class: "list warn" }, headsUp.map((h) =>
        el("li", {}, el("span", { class: "mark" }, "!"), el("span", {}, h)))),
    ] : null,

    el("div", { class: "section-title" }, "All branches"),
    el("p", { class: "muted", style: "font-size:14px; margin-top:-4px" }, "Tap a branch to see why it ranked where it did."),
    el("div", { class: "bars" }, branchRows),

    el("div", { class: "section-title" }, closeOnes.length ? "Also a close match" : "Runner-up"),
    closeOnes.length ? el("p", { class: "muted", style: "font-size:14px" },
      `${closeOnes.length === 1 ? "This branch is" : "These branches are"} within 10 points of the top match, so ${closeOnes.length === 1 ? "it's" : "they're"} worth a look too.`) : null,
    el("div", { style: "display:grid; gap:10px" }, otherCards),

    el("div", { class: "section-title" }, "Service type"),
    el("div", { class: "bars" }, components.map((x) => bar(COMPONENTS[x.id].name, x.pct, "var(--accent)"))),
    el("p", { style: "margin:14px 0 0" }, el("strong", {}, COMPONENTS[components[0].id].name + ": "), COMPONENTS[components[0].id].about),
    options.filter((o) => o.note).map((o) => el("div", { class: "note", style: "margin-top:12px" }, o.note)),

    el("div", { class: "section-title" }, "Enlisted or officer"),
    el("div", { class: "bars" }, tracks.map((x) => bar(TRACKS[x.id].name, x.pct, "var(--accent)"))),
    el("p", { style: "margin:14px 0 0" }, el("strong", {}, track.name + ": "), track.about),
    r.hasDegree && tracks[0].id === "enlisted"
      ? el("div", { class: "note", style: "margin-top:12px" }, `${mine ? "You said you already have" : "They already have"} a degree. The answers lean enlisted, but with a degree there's also the option to become an officer through officer candidate or training school, so ask a recruiter about both.`)
      : null,
    el("p", { class: "muted", style: "margin:8px 0 0; font-size:14px" },
      "Not set in stone: enlisted members can become officers later through commissioning programs, and NCOs lead plenty of people too."),

    mine ? shareSection(r) : null,

    el("div", { class: "actions" },
      mine
        ? [el("button", { class: "primary", onclick: () => { newQuiz("full"); startQuiz("full"); } }, "Take it again"),
           el("button", { onclick: () => { newQuiz("quick"); startQuiz("quick"); } }, "Quick mode (15 questions)"),
           el("button", { onclick: (e) => copyResult(e, r) }, "Copy my result")]
        : el("a", { class: "button primary", href: "#/quiz" }, "Take the quiz yourself"),
      el("a", { class: "button", href: branchLink(top.id, tracks[0].id, components[0].id) }, `Explore the ${info.name}`)),
  );
}

// ---------------------------------------------------------------------------
// Trait radar: the user's 12 traits against a chosen branch's profile.

const TRAIT_SHORT = {
  sea: "Sea", land: "Land", air: "Air", space: "Space", physical: "Physical", tech: "Tech",
  tradition: "Discipline", travel: "Travel", homeland: "Home front", combat: "Combat", scale: "Big org", comfort: "Comfort",
};

function radarSection(user, initial) {
  const holder = el("div", { class: "radar-wrap" });
  const chips = el("div", { class: "chips", style: "justify-content:center" });
  const draw = (branch) => {
    holder.replaceChildren(radarSvg(user, branch));
    chips.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.b === branch));
  };
  ORDER.forEach((b) => chips.append(el("button", { class: "chip chip-btn", "data-b": b, onclick: () => draw(b) },
    el("span", { class: "dot", style: `background:${BRANCHES[b].color}` }), BRANCHES[b].name)));
  draw(initial);
  return el("div", {},
    el("p", { class: "muted", style: "font-size:14px; margin-top:-4px" }, "Green is you. Pick a branch to lay its profile over yours. The farther out, the stronger the lean. Untested traits sit in the middle."),
    holder, chips);
}

function radarSvg(user, branch) {
  const ns = "http://www.w3.org/2000/svg";
  const size = 340, c = size / 2, R = 118;
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "radar");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Your traits compared with the ${BRANCHES[branch].name}`);
  const add = (tag, attrs, text) => {
    const n = document.createElementNS(ns, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text != null) n.textContent = text;
    svg.append(n);
    return n;
  };
  const angle = (i) => (Math.PI * 2 * i) / TRAIT_IDS.length - Math.PI / 2;
  const point = (i, v) => {
    const r = ((v + 2) / 4) * R;
    return [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))];
  };
  for (const ring of [-2, -1, 0, 1, 2]) {
    add("polygon", { points: TRAIT_IDS.map((_, i) => point(i, ring).join(",")).join(" "), class: ring === 0 ? "radar-ring mid" : "radar-ring" });
  }
  TRAIT_IDS.forEach((t, i) => {
    const [x, y] = point(i, 2);
    add("line", { x1: c, y1: c, x2: x, y2: y, class: "radar-axis" });
    const [lx, ly] = point(i, 2.75);
    add("text", { x: lx, y: ly, class: "radar-label", "text-anchor": Math.abs(lx - c) < 8 ? "middle" : lx > c ? "start" : "end", "dominant-baseline": "middle" }, TRAIT_SHORT[t]);
  });
  const shape = (values, cls, color) => add("polygon", {
    points: TRAIT_IDS.map((t, i) => point(i, values[t]).join(",")).join(" "),
    class: cls, style: `--c:${color}`,
  });
  shape(BRANCHES[branch].traits, "radar-shape branch", BRANCHES[branch].color);
  shape(Object.fromEntries(TRAIT_IDS.map((t) => [t, user[t] ? user[t].value : 0])), "radar-shape you", "var(--accent)");
  return svg;
}

// ---------------------------------------------------------------------------
// Sharing: links, compare, image card.

function siteUrl() {
  return location.href.split("#")[0].split("?")[0].replace(/index.html$/, "");
}

function shareLink(code, name) {
  return `${siteUrl()}#/r/${code}${name ? "?n=" + encodeURIComponent(name) : ""}`;
}

// Phones and tablets get the system share sheet; desktops copy or download.
const CAN_SHARE = Boolean(navigator.share) && matchMedia("(pointer: coarse)").matches;

function cleanName(s) {
  return (s || "").replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 20);
}

function shareSection(r) {
  const code = encodeAnswers(r.qs, r.answers);
  let name = "";
  try { name = localStorage.getItem("rankedbingo.name") || ""; } catch { /* ignore */ }
  const nameInput = el("input", { class: "text-input", type: "text", maxlength: "20", placeholder: "Your name (optional)", value: name, "aria-label": "Your name (optional)" });
  const status = el("span", { class: "muted", style: "font-size:14px" });
  const getName = () => {
    const n = cleanName(nameInput.value);
    try { localStorage.setItem("rankedbingo.name", n); } catch { /* ignore */ }
    return n;
  };
  const flash = (msg) => { status.textContent = msg; setTimeout(() => { status.textContent = ""; }, 2500); };

  const friendInput = el("input", { class: "text-input", type: "text", placeholder: "Paste a friend's result link", "aria-label": "Friend's result link" });
  const compare = () => {
    const m = friendInput.value.match(/#\/r\/([0-9a-z-]+)(?:\?n=([^&\s]*))?/i);
    if (!m || !decodeAnswers(m[1])) { flash("That doesn't look like a Ranked Bingo result link."); return; }
    const me = getName();
    location.hash = `#/compare/${code}/${m[1]}?a=${encodeURIComponent(me || "You")}&b=${encodeURIComponent(m[2] ? decodeURIComponent(m[2]) : "Friend")}`;
  };

  // Live preview of the share card, in long (story) or square format.
  let format = "long";
  const preview = el("img", { class: "card-preview long", alt: "Your share card" });
  const formatButtons = el("div", { class: "seg" });
  let refreshTimer = 0;
  const refresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      const blob = await cardBlob(r, cleanName(nameInput.value), format);
      if (preview.src) URL.revokeObjectURL(preview.src);
      preview.src = URL.createObjectURL(blob);
      preview.className = "card-preview " + format;
    }, 150);
    formatButtons.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.f === format));
  };
  for (const [f, label] of [["long", "Long"], ["wide", "Wide"], ["square", "Square"]]) {
    formatButtons.append(el("button", { class: "seg-item", "data-f": f, onclick: () => { format = f; refresh(); } }, label));
  }
  nameInput.addEventListener("input", refresh);
  refresh();

  return el("div", { class: "share-box" },
    el("div", { class: "section-title", style: "margin-top:0" }, "Share your result"),
    nameInput,
    el("div", { class: "card-preview-wrap" }, preview),
    el("div", { class: "seg-row", style: "justify-items:center; margin-top:10px" }, formatButtons),
    el("div", { class: "actions", style: "margin-top:10px; justify-content:center" },
      el("button", { class: "primary", onclick: async () => {
        const link = shareLink(code, getName());
        if (CAN_SHARE) {
          try { await navigator.share({ title: "My Ranked Bingo result", url: link }); return; } catch { /* fall back to copying */ }
        }
        try { await navigator.clipboard.writeText(link); flash("Link copied!"); } catch { prompt("Copy this link:", link); }
      } }, "Share link"),
      el("button", { onclick: () => shareImage(r, getName(), format, false) }, "Download image"),
      CAN_SHARE && navigator.canShare ? el("button", { onclick: () => shareImage(r, getName(), format, true) }, "Share image") : null,
      status),
    el("div", { class: "section-title" }, "Compare with a friend"),
    el("p", { class: "muted", style: "font-size:14px; margin-top:-4px" }, "Send them your link. When they finish, paste their link here."),
    el("div", { class: "row" }, friendInput, el("button", { onclick: compare }, "Compare")));
}

async function copyResult(e, r) {
  const picks = r.tied.map((x) => `${serviceOption(x.id, r.components[0].id).title}, ${r.track.name} (top role: ${r.topJob(x.id)[0].n})`);
  const header = r.tied.length > 1 ? ["My Ranked Bingo result: a tie!", ...picks] : [`My Ranked Bingo result: ${picks[0]}`];
  const text = [...header, ...r.ranked.map((x) => `${BRANCHES[x.id].name}: ${x.pct}%`), shareLink(encodeAnswers(r.qs, r.answers))].join("\n");
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
  } catch {
    btn.textContent = "Couldn't copy";
  }
  setTimeout(() => { btn.textContent = "Copy my result"; }, 1500);
}

function renderShared() {
  const data = decodeAnswers(route.code);
  if (!data) {
    app.append(el("div", { class: "card fade-in" },
      el("div", { class: "eyebrow" }, "Shared result"),
      el("h1", {}, "That link doesn't work"),
      el("p", { class: "muted" }, "The result link is broken or incomplete. Ask your friend to send it again, or take the quiz yourself."),
      el("a", { class: "button primary", href: "#/quiz" }, "Take the quiz")));
    return;
  }
  const name = cleanName(route.name);
  const mine = myResultCode();
  app.append(
    el("div", { class: "note", style: "margin-bottom:14px" },
      `You're looking at ${name ? name + "'s" : "someone's"} result. `,
      mine && mine !== route.code
        ? el("a", { href: `#/compare/${mine}/${route.code}?a=You&b=${encodeURIComponent(name || "Friend")}` }, "Compare it with yours →")
        : el("a", { href: "#/quiz" }, "Take the quiz to compare →")),
    resultView({ qs: data.qs, answers: data.answers, name: name || null }),
  );
}

// "You match" but "Sam matches".
function verb(subject, base) {
  return subject === "You" ? base : base + (base.endsWith("h") ? "es" : "s");
}

function renderCompare() {
  const a = decodeAnswers(route.code), b = decodeAnswers(route.code2);
  if (!a || !b) {
    app.append(el("div", { class: "card fade-in" }, el("h1", {}, "Can't compare these"), el("p", { class: "muted" }, "One of the result links is broken."), el("a", { class: "button primary", href: "#/quiz" }, "Take the quiz")));
    return;
  }
  const names = [cleanName(route.nameA) || "Player 1", cleanName(route.nameB) || "Player 2"];
  const ra = computeResult(a.qs, a.answers), rb = computeResult(b.qs, b.answers);
  setBackground(ra.top.id === rb.top.id ? ra.top.id : null);
  const sameTop = ra.top.id === rb.top.id;

  // Traits both lean the same way on, and the biggest difference.
  const both = TRAIT_IDS.filter((t) => ra.user[t] && rb.user[t] && Math.abs(ra.user[t].value) >= 0.75 && Math.abs(rb.user[t].value) >= 0.75 && Math.sign(ra.user[t].value) === Math.sign(rb.user[t].value));
  const diffs = TRAIT_IDS.filter((t) => ra.user[t] && rb.user[t])
    .map((t) => ({ t, gap: Math.abs(ra.user[t].value - rb.user[t].value) }))
    .sort((x, y) => y.gap - x.gap);
  const biggest = diffs[0] && diffs[0].gap >= 1.5 ? diffs[0] : null;

  const side = (r, n, code) => el("div", { class: "job", style: `--hero:${BRANCHES[r.top.id].color}` },
    el("div", { class: "job-path" }, n),
    el("strong", { class: "job-name", style: "font-size:24px" }, joinWords(r.tied.map((x) => BRANCHES[x.id].name))),
    el("div", { class: "pct", style: `color:${BRANCHES[r.top.id].color}; font:700 14px var(--mono); margin-top:4px` }, `${r.top.pct}% MATCH`),
    el("p", { style: "margin:8px 0 0; font-size:14px" }, r.options.map((o) => `${o.title}, ${r.track.name}`).join(" or ")),
    el("p", { style: "margin:6px 0 0; font-size:14px" }, "Top role: ", el("strong", {}, r.topJob(r.top.id)[0].n)),
    el("a", { href: `#/r/${code}?n=${encodeURIComponent(n)}`, style: "font-size:14px; display:inline-block; margin-top:8px" }, "Full result →"));

  app.append(el("div", { class: "card results fade-in" },
    el("div", { class: "eyebrow" }, "Compare"),
    el("h1", {}, `${names[0]} vs ${names[1]}`),
    el("p", { style: "font-size:18px" }, sameTop
      ? `Same top branch: you're both ${BRANCHES[ra.top.id].name} material. 🤝`
      : `${names[0]} ${verb(names[0], "match")} the ${BRANCHES[ra.top.id].name}, and ${names[1]} ${verb(names[1], "match")} the ${BRANCHES[rb.top.id].name}.`),
    el("div", { class: "two-col compare" }, side(ra, names[0], route.code), side(rb, names[1], route.code2)),
    el("div", { class: "section-title" }, "All branches"),
    el("div", { class: "table-wrap" }, el("table", {},
      el("thead", {}, el("tr", {}, el("th", {}, "Branch"), el("th", {}, names[0]), el("th", {}, names[1]))),
      el("tbody", {}, ORDER.map((id) => {
        const pa = ra.ranked.find((x) => x.id === id).pct, pb = rb.ranked.find((x) => x.id === id).pct;
        return el("tr", {}, el("td", {}, BRANCHES[id].name),
          el("td", { class: pa >= pb ? "win" : "" }, pa + "%"), el("td", { class: pb >= pa ? "win" : "" }, pb + "%"));
      })))),
    both.length ? [
      el("div", { class: "section-title" }, "You both lean toward"),
      el("div", { class: "chips" }, both.map((t) => el("span", { class: "chip" }, capitalize(phrase(t, ra.user[t].value))))),
    ] : null,
    biggest ? [
      el("div", { class: "section-title" }, "Biggest difference"),
      el("p", {}, `${names[0]} ${verb(names[0], "lean")} toward ${phrase(biggest.t, ra.user[biggest.t].value)}, while ${names[1]} ${verb(names[1], "lean")} toward ${phrase(biggest.t, rb.user[biggest.t].value)}.`),
    ] : null,
    el("div", { class: "actions" }, el("a", { class: "button primary", href: "#/quiz" }, "Take the quiz")),
  ));
}

// Share cards come in three formats: "long" (1080x1920, phone story size),
// "wide" (1920x1080, desktop) and "square" (1080x1080 with rounded corners).
// All put the branch photo, cropped around the action, behind the branch
// name, a small branch-colored line, the six-branch graph and the reasons.
const CARD_FORMATS = {
  long: { w: 1080, h: 1920, radius: 0 },
  wide: { w: 1920, h: 1080, radius: 0 },
  square: { w: 1080, h: 1080, radius: 72 },
};

async function renderCard(r, name, format, withPhoto) {
  const { w: W, h: H, radius } = CARD_FORMATS[format];
  const PAD = format === "long" ? 84 : 72;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const info = BRANCHES[r.top.id];
  const font = (size, weight = 700, mono = false) => `${weight} ${size}px ${mono ? "ui-monospace, Consolas, monospace" : "system-ui, -apple-system, Segoe UI, sans-serif"}`;
  const pill = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(w, h), h, h / 2);
    ctx.fill();
  };
  const wrap = (text, x, y, maxW, lineH) => {
    let line = "";
    for (const word of text.split(" ")) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, y); line = word; y += lineH; } else line = test;
    }
    ctx.fillText(line, x, y);
    return y;
  };

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, radius);
  ctx.clip();
  ctx.fillStyle = "#0b0f0c";
  ctx.fillRect(0, 0, W, H);

  if (withPhoto && BG_IMAGES[r.top.id]) {
    const img = new Image();
    img.src = BG_IMAGES[r.top.id];
    await img.decode();
    // Cover the card, centered on the photo's focus point.
    const [fx, fy] = BG_FOCUS[r.top.id];
    const scale = Math.max(W / img.width, H / img.height);
    const w = img.width * scale, h = img.height * scale;
    const anchorX = format === "wide" ? W * 0.68 : W / 2;
    const x = Math.min(0, Math.max(W - w, anchorX - fx * w));
    const y = Math.min(0, Math.max(H - h, H / 2 - fy * h));
    ctx.globalAlpha = 0.9;
    ctx.drawImage(img, x, y, w, h);
    ctx.globalAlpha = 1;
  }
  // Darker where the text sits, lighter where the photo should show: across
  // for the wide card (text on the left), down for the others.
  const g = format === "wide" ? ctx.createLinearGradient(0, 0, W, 0) : ctx.createLinearGradient(0, 0, 0, H);
  const textEnd = format === "long" ? 0.68 : format === "wide" ? 0.55 : 0.6;
  g.addColorStop(0, "rgba(11,15,12,0.82)");
  g.addColorStop(textEnd, "rgba(11,15,12,0.62)");
  g.addColorStop(Math.min(0.95, textEnd + 0.22), "rgba(11,15,12,0.2)");
  g.addColorStop(1, "rgba(11,15,12,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Branch name, as big as fits across the top.
  const title = r.tied.map((x) => BRANCHES[x.id].name).join(" & ");
  const textW = format === "wide" ? W * 0.6 - PAD : W - 2 * PAD;
  let size = format === "long" ? 260 : 230;
  ctx.font = font(size, 800);
  while (ctx.measureText(title).width > textW && size > 70) { size -= 4; ctx.font = font(size, 800); }
  ctx.fillStyle = "#f2f6ef";
  ctx.textBaseline = "alphabetic";
  const titleY = PAD + (format === "long" ? 60 : 0) + size * 0.78;
  ctx.fillText(title, PAD - size * 0.04, titleY);

  // Small rounded line in the branch color, with the match next to it.
  const lineY = titleY + 34;
  pill(PAD, lineY, 150, 14, info.color);
  ctx.fillStyle = info.color;
  ctx.font = font(format === "long" ? 32 : 28, 700, true);
  ctx.textBaseline = "middle";
  ctx.fillText(`${name ? name.toUpperCase() + " · " : ""}${r.top.pct}% MATCH${r.tied.length > 1 ? " EACH" : ""}`, PAD + 176, lineY + 8);

  const reasons = [...new Set(r.tied.flatMap((x) => fits(r.user, x.id)))].slice(0, 4).map(capitalize);
  reasons.push(`Top role: ${r.topJob(r.top.id)[0].n}`);

  const graph = (x0, y0, width, rowH, nameSize) => {
    ctx.textBaseline = "middle";
    r.ranked.forEach((x, i) => {
      const b = BRANCHES[x.id];
      const y = y0 + i * rowH;
      ctx.fillStyle = "#e3eadf";
      ctx.font = font(nameSize, 600);
      ctx.fillText(b.name, x0, y);
      const labelW = nameSize * 7.1;
      const barX = x0 + labelW, barW = width - labelW - nameSize * 3;
      pill(barX, y - 7, barW, 14, "rgba(255,255,255,0.12)");
      pill(barX, y - 7, (barW * x.pct) / 100, 14, b.color);
      ctx.fillStyle = "#b8c4b4";
      ctx.font = font(nameSize - 2, 700, true);
      ctx.fillText(`${x.pct}%`, barX + barW + 12, y);
    });
  };
  const why = (x0, y0, width, textSize, lineH) => {
    ctx.fillStyle = "#8d9a8a";
    ctx.font = font(textSize - 5, 700, true);
    ctx.textBaseline = "alphabetic";
    ctx.fillText("WHY", x0, y0);
    let y = y0 + lineH + 8;
    ctx.font = font(textSize, 600);
    for (const reason of reasons) {
      ctx.fillStyle = info.color;
      ctx.beginPath();
      ctx.arc(x0 + 6, y - textSize * 0.36, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e3eadf";
      y = wrap(reason, x0 + 22, y, width - 26, lineH - 12) + lineH;
    }
  };

  if (format === "long") {
    // Stacked: graph across the full width, then the reasons.
    const top = lineY + 100;
    graph(PAD, top, W - 2 * PAD, 66, 32);
    why(PAD, top + 6 * 66 + 50, W - 2 * PAD, 34, 56);
  } else {
    // Side by side, just under the name (on the left part of the wide card).
    const top = lineY + 70;
    const colW = (textW - 48) / 2;
    graph(PAD, top + 14, colW, 56, 24);
    why(PAD + colW + 48, top + 8, colW, 25, 46);
  }

  // Footer.
  ctx.fillStyle = info.color;
  ctx.font = font(format === "long" ? 24 : 20, 600);
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`© Ranked Bingo, ${new Date().getFullYear()}. All rights reserved.`, PAD, H - 48);
  ctx.fillStyle = "rgba(227,234,223,0.75)";
  ctx.textAlign = "right";
  ctx.fillText(siteUrl().replace(/^https?:\/\//, "").replace(/\/$/, ""), W - PAD, H - 48);
  ctx.textAlign = "left";
  ctx.restore();
  return canvas;
}

// Renders a card as a PNG blob. Opened from a local file the photo can't be
// exported, so it falls back to a card without it.
async function cardBlob(r, name, format) {
  const toBlob = (canvas) => new Promise((resolve, reject) => {
    try { canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("empty"))), "image/png"); } catch (err) { reject(err); }
  });
  try {
    return await toBlob(await renderCard(r, name, format, true));
  } catch {
    return toBlob(await renderCard(r, name, format, false));
  }
}

async function shareImage(r, name, format, useShareSheet) {
  const blob = await cardBlob(r, name, format);
  const file = new File([blob], `ranked-bingo-${format}.png`, { type: "image/png" });
  if (useShareSheet && CAN_SHARE && navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: "My Ranked Bingo result" }); return; } catch { /* fall back to download */ }
  }
  const a = el("a", { href: URL.createObjectURL(blob), download: `ranked-bingo-${format}.png` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

function restart() {
  newQuiz(state.mode);
  save();
  render();
}

document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (route.page !== "quiz") return;
  if (e.target.matches && e.target.matches("input, textarea")) return;
  if (state.step < 0 || state.step >= QUESTIONS.length) return;
  const n = e.key === "0" ? 10 : Number(e.key);
  const order = state.orders[state.step];
  if (n >= 1 && n <= order.length) choose(order[n - 1]);
  else if (e.key === "s") skip();
  else if (e.key === "ArrowLeft") { if (state.step > 0) back(); }
  else if (e.key === "ArrowRight" || e.key === "Enter") next();
});

// ---------------------------------------------------------------------------
// Explorer: branch pages, service types and training.

function setBackground(branch) {
  const bg = document.getElementById("bg");
  const src = branch && BG_IMAGES[branch];
  if (src) {
    bg.style.backgroundImage = `url("${src}")`;
    bg.style.backgroundPosition = BG_FOCUS[branch].map((v) => `${v * 100}%`).join(" ");
  }
  bg.classList.toggle("on", Boolean(src));
}

const route = { page: "quiz", branch: null, track: "enlisted", type: "active", code: null, code2: null, name: null, nameA: null, nameB: null };

function parseRoute() {
  const [path, query = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  route.page = parts[0] || "quiz";
  route.branch = ORDER.includes(parts[1]) ? parts[1] : null;
  route.track = TRACK_ORDER.includes(params.get("track")) ? params.get("track") : "enlisted";
  route.type = COMPONENT_ORDER.includes(params.get("type")) ? params.get("type") : "active";
  // Shared results: #/r/<code>?n=Name and #/compare/<code>/<code>?a=Name&b=Name.
  if (route.page === "r") {
    route.page = "shared";
    route.code = parts[1] || "";
    route.name = params.get("n");
  }
  if (route.page === "compare") {
    route.code = parts[1] || "";
    route.code2 = parts[2] || "";
    route.nameA = params.get("a");
    route.nameB = params.get("b");
  }
  if (route.page === "branch" && !route.branch) route.page = "branches";
  if (!["quiz", "branches", "branch", "types", "training", "shared", "compare"].includes(route.page)) route.page = "quiz";
}

function branchLink(branch, track = "enlisted", type = "active") {
  return `#/branch/${branch}?track=${track}&type=${type}`;
}

function renderNav() {
  const nav = document.getElementById("nav");
  const tabs = [["quiz", "Quiz"], ["branches", "Branches"], ["types", "Service types"], ["training", "Boot camp & training"]];
  const current = route.page === "branch" ? "branches" : route.page;
  nav.replaceChildren(
    el("a", { class: "brand", href: "#/quiz" }, "Ranked Bingo"),
    el("div", { class: "tabs" }, tabs.map(([id, label]) =>
      el("a", { class: "tab" + (current === id ? " active" : ""), href: `#/${id}`, "aria-current": current === id ? "page" : null }, label))),
  );
}

function renderBranches() {
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, "Explore"),
    el("h1", {}, "The six branches"),
    el("p", { class: "muted" }, "Pick a branch to see what it does, what life is like, the jobs it offers, and how boot camp and job training work."),
    el("div", { class: "grid" }, ORDER.map((b) => {
      const info = BRANCHES[b], d = DETAILS[b];
      return el("a", { class: "branch-card", href: branchLink(b), style: `--hero:${info.color}` },
        el("div", { class: "job-path" }, `${d.members} · since ${d.founded.split(" ")[0]}`),
        el("strong", { class: "job-name" }, info.name),
        el("p", { class: "muted", style: "margin:6px 0 0" }, info.tagline));
    })),
  ));
}

function segmented(label, items, current, makeHref) {
  return el("div", { class: "seg-row" },
    el("span", { class: "seg-label" }, label),
    el("div", { class: "seg", role: "group", "aria-label": label }, items.map(([id, text, disabled]) =>
      disabled
        ? el("span", { class: "seg-item disabled", title: disabled }, text)
        : el("a", { class: "seg-item" + (current === id ? " active" : ""), href: makeHref(id), "aria-current": current === id ? "true" : null }, text))));
}

function renderBranch() {
  const b = route.branch, info = BRANCHES[b], d = DETAILS[b];
  const hasGuard = b === "army" || b === "af";
  // A Guard link for a branch without a Guard shows its Reserve, with the note.
  const { track } = route;
  const type = route.type === "guard" && !hasGuard ? "reserve" : route.type;
  const option = serviceOption(b, route.type);
  const comp = COMPONENTS[type], compD = COMPONENT_DETAILS[type];
  const jobs = JOBS[b].filter((j) => j.tr === track);

  const steps = track === "enlisted"
    ? [
        ["Talk to a recruiter", "Ask questions, see which jobs are open, and start your paperwork."],
        ["MEPS", "At the Military Entrance Processing Station you get a medical exam, pick your job and swear in. You take the ASVAB test there or beforehand at a testing site."],
        [d.bootcamp.name, `${d.bootcamp.length} at ${d.bootcamp.where}.`],
        [d.tech.name, d.tech.text],
        [type === "active" ? "First duty station" : "Your home unit", type === "active" ? "You report to your first unit and start the job for real." : "You go home, return to work or school, and start drilling with your unit."],
      ]
    : [
        ["Earn a commission", d.officer],
        ["Officer training", "Your commissioning program teaches leadership, tactics and military basics. The format depends on the route: four years at an academy, ROTC classes during college, or a few months at officer candidate or training school."],
        ["Job training", "New officers go to a course for their field before leading people in it."],
        [type === "active" ? "First assignment" : "Your home unit", type === "active" ? "You take charge of your first team, section or platoon." : "You lead a part-time unit while keeping your civilian career."],
      ];

  app.append(el("div", { class: "fade-in" },
    el("a", { class: "back-link", href: "#/branches" }, "← All branches"),
    el("div", { class: "result-hero", style: `--hero:${info.color}; margin-top:12px` },
      el("h1", {}, info.name),
      el("div", { class: "pct" }, d.members.toUpperCase()),
      el("p", { style: "margin-top:12px" }, info.tagline)),

    el("div", { class: "facts" },
      [["Founded", d.founded], ["Part of", d.dept], ["Members", d.members], d.motto ? ["Motto", d.motto] : null].filter(Boolean)
        .map(([k, v]) => el("div", { class: "fact" }, el("span", { class: "fact-k" }, k), el("span", {}, v)))),

    el("div", { class: "section-title" }, "What it does"),
    el("p", {}, info.about),
    el("div", { class: "section-title" }, "What life is like"),
    el("p", {}, d.life),
    el("ul", { class: "list good" }, d.expect.map((x) => el("li", {}, el("span", { class: "mark" }, "•"), el("span", {}, x)))),
    el("div", { class: "two-col" },
      el("div", {}, el("div", { class: "section-title" }, "Good fit if"),
        el("ul", { class: "list good" }, d.fit.map((x) => el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, x))))),
      el("div", {}, el("div", { class: "section-title" }, "Maybe not if"),
        el("ul", { class: "list warn" }, d.notFit.map((x) => el("li", {}, el("span", { class: "mark" }, "!"), el("span", {}, x)))))),

    el("div", { class: "card", style: "margin-top:28px" },
      el("div", { class: "eyebrow" }, "Pick your path"),
      segmented("Role", TRACK_ORDER.map((t) => [t, TRACKS[t].name]), track, (t) => branchLink(b, t, type)),
      segmented("Service type", COMPONENT_ORDER.map((c) => [c, COMPONENTS[c].name,
        c === "guard" && !hasGuard ? `The ${info.name} doesn't have a National Guard` : null]), type, (c) => branchLink(b, track, c)),
      el("h2", { style: "margin-top:18px" }, `${option.title}, ${TRACKS[track].name}`),
      option.note ? el("div", { class: "note", style: "margin-bottom:14px" }, option.note) : null,
      el("p", {}, el("strong", {}, "Schedule: "), compD.schedule),
      el("ul", { class: "list good" }, compD.life
        .map((x) => (["af", "sf", "army"].includes(b) ? x.replace(", or aboard a ship in sea-going jobs", "") : x))
        .map((x) => el("li", {}, el("span", { class: "mark" }, "•"), el("span", {}, x)))),
      el("p", { style: "margin-top:12px" }, el("strong", {}, `${TRACKS[track].name}: `), TRACKS[track].about),

      el("div", { class: "section-title" }, "Your path, step by step"),
      el("ol", { class: "steps" }, steps.map(([t, x]) => el("li", {}, el("strong", {}, t), el("p", { class: "muted", style: "margin:2px 0 0" }, x)))),

      el("div", { class: "section-title" }, `${TRACKS[track].name} jobs (${jobs.length} examples)`),
      el("div", { class: "jobs" }, jobs.map((j) => el("details", { class: "job", style: `--hero:${info.color}` },
        el("summary", {}, el("strong", { class: "job-name" }, j.n)),
        el("p", { class: "muted", style: "margin:6px 0 0" }, j.d),
        el("p", { style: "margin:6px 0 0; font-size:14px" }, `Good for people into ${joinWords(Object.keys(j.i).map((k) => INTERESTS[k]))}.`),
        el("p", { style: "margin:6px 0 0; font-size:14px" }, el("strong", {}, "Civilian careers it can lead to: "), civilianCareers(j).join(", ")),
        el("p", { style: "margin:6px 0 0; font-size:14px" }, el("strong", {}, "Training: "),
          track === "enlisted"
            ? `${d.bootcamp.name}, then ${d.tech.name} for this job.`
            : "Commissioning program, then the officer course for this field.")))),
      el("p", { class: "muted", style: "margin:10px 0 0; font-size:13px" },
        "Job names are simplified examples. Every branch has many more jobs, and availability depends on test scores, standards and openings."),
    ),

    el("div", { class: "section-title" }, "Boot camp"),
    trainingCard(b),
    el("div", { class: "actions" },
      el("a", { class: "button primary", href: "#/quiz" }, "Take the quiz"),
      el("a", { class: "button", href: "#/training" }, "Compare all boot camps")),
  ));
}

function trainingCard(b) {
  const info = BRANCHES[b], d = DETAILS[b], bc = d.bootcamp;
  return el("div", { class: "job", style: `--hero:${info.color}` },
    el("div", { class: "job-path" }, `${info.name} · ${bc.length}`),
    el("strong", { class: "job-name" }, bc.name),
    el("p", { class: "muted", style: "margin:4px 0 10px" }, `${bc.where}. Instructors: ${bc.leaders}.`),
    el("ol", { class: "steps compact" }, bc.phases.map(([t, x]) => el("li", {}, el("strong", {}, t), el("p", { class: "muted", style: "margin:2px 0 0" }, x)))),
    el("p", { style: "margin:10px 0 0" }, el("strong", {}, `After: ${d.tech.name}. `), d.tech.text),
    el("p", { style: "margin:8px 0 0" }, el("strong", {}, "Officers: "), d.officer));
}

function renderTypes() {
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, "Explore"),
    el("h1", {}, "Ways to serve"),
    el("p", { class: "muted" }, "Every branch has full-time and part-time options, and every job is either enlisted or officer."),
    el("div", { class: "section-title" }, "Service types"),
    el("div", { class: "jobs" }, COMPONENT_ORDER.map((c) => el("div", { class: "job", style: "--hero:var(--accent)" },
      el("strong", { class: "job-name" }, COMPONENTS[c].name),
      el("p", { style: "margin:6px 0 0" }, COMPONENTS[c].about),
      el("p", { style: "margin:8px 0 0" }, el("strong", {}, "Schedule: "), COMPONENT_DETAILS[c].schedule),
      el("ul", { class: "list good", style: "margin-top:8px" }, COMPONENT_DETAILS[c].life.map((x) => el("li", {}, el("span", { class: "mark" }, "•"), el("span", {}, x))))))),
    el("div", { class: "section-title" }, "Who has what"),
    el("div", { class: "table-wrap" }, el("table", {},
      el("thead", {}, el("tr", {}, el("th", {}, "Branch"), COMPONENT_ORDER.map((c) => el("th", {}, COMPONENTS[c].name)))),
      el("tbody", {}, ORDER.map((b) => el("tr", {},
        el("td", {}, el("a", { href: branchLink(b) }, BRANCHES[b].name)),
        COMPONENT_ORDER.map((c) => {
          const o = serviceOption(b, c);
          const exact = c === "active" || !o.note;
          return el("td", {}, exact ? el("a", { href: branchLink(b, "enlisted", c) }, o.title) : el("span", { class: "muted" }, b === "sf" ? "Part-time inside the Space Force" : "None (use the Reserve)"));
        })))))),
    el("div", { class: "section-title" }, "Enlisted or officer"),
    el("div", { class: "two-col" }, TRACK_ORDER.map((t) => el("div", { class: "job", style: "--hero:var(--accent)" },
      el("strong", { class: "job-name" }, TRACKS[t].name),
      el("p", { style: "margin:6px 0 0" }, TRACKS[t].about)))),
  ));
}

function renderTraining() {
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, "Explore"),
    el("h1", {}, "Boot camp & training"),
    el("p", { class: "muted" }, "How you get from civilian to trained service member, branch by branch. Checked against official branch recruiting sites in October 2026. Lengths and locations change, so confirm them with a recruiter."),
    el("div", { class: "section-title" }, "How it works everywhere"),
    el("ol", { class: "steps" }, [
      ["Recruiter", "You talk to a recruiter, check that you qualify, and start paperwork."],
      ["MEPS", "At the Military Entrance Processing Station you get a medical exam, pick or reserve your job and swear in. You take the ASVAB test there or beforehand at a testing site."],
      ["Ship to boot camp", "Haircuts, uniforms, shots and paperwork in the first days, then weeks of fitness, drill, discipline, weapons and military basics, led by instructors whose title depends on the branch."],
      ["Job training", "After boot camp you learn your actual job. The school's name and length depend on the branch and job: from a few weeks to more than a year."],
      ["Your first unit", "Active duty members report to a duty station. Reserve and Guard members return home and drill with their unit."],
    ].map(([t, x]) => el("li", {}, el("strong", {}, t), el("p", { class: "muted", style: "margin:2px 0 0" }, x)))),
    el("div", { class: "note", style: "margin-top:14px" }, "Tip: show up in shape. Practice running, push-ups, sit-ups or planks, and swimming before you ship."),
    el("div", { class: "section-title" }, "Branch by branch"),
    el("div", { class: "jobs" }, ORDER.map((b) => trainingCard(b))),
  ));
}
// Exposed for automated checks. QUESTIONS is a getter because each quiz
// draws a new set.
window.branchQuiz = {
  DETAILS, route, POOL, BRANCHES, ORDER, TRAITS, JOBS, CIVILIAN_OVERRIDES, state, render,
  profile, score, fits, clashes, componentScore, trackScore, serviceOption, topJobs, interestVector,
  civilianCareers, encodeAnswers, decodeAnswers, pickQuestions, makeRng, newQuiz, startQuiz,
  get QUESTIONS() { return QUESTIONS; },
};

render();
