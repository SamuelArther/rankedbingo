"use strict";

// Skipped questions stay null in answers, so scoring simply ignores them.
const state = { step: -1, answers: [], skipped: new Set() };
const app = document.getElementById("app");

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

function render() {
  parseRoute();
  renderNav();
  setBackground(null);
  app.replaceChildren();
  if (route.page === "branches") renderBranches();
  else if (route.page === "branch") renderBranch();
  else if (route.page === "types") renderTypes();
  else if (route.page === "training") renderTraining();
  else if (state.step < 0) renderIntro();
  else if (state.step < QUESTIONS.length) renderQuestion();
  else renderResults();
  const titles = { branches: "Branches", types: "Service types", training: "Boot camp & training" };
  const pageTitle = route.page === "branch" ? BRANCHES[route.branch].name : titles[route.page];
  document.title = pageTitle ? `${pageTitle} · Ranked Bingo` : "Ranked Bingo";
  window.scrollTo({ top: 0 });
}

window.addEventListener("hashchange", render);

function renderIntro() {
  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, "Ranked Bingo"),
    el("h1", {}, "Which military branch fits you?"),
    el("p", { class: "muted" },
      `${QUESTIONS.length} questions about how you like to live, work, train and think. No single answer decides anything: each one shifts a set of traits, and you're matched to the branch whose overall profile is closest to yours. Then a few questions pick your top jobs, enlisted or officer, and Active Duty, the Reserve or the National Guard.`),
    el("div", { class: "chips branch-strip" },
      ORDER.map((b) => el("span", { class: "chip" },
        el("span", { class: "dot", style: `background:${BRANCHES[b].color}` }), BRANCHES[b].name))),
    el("button", { class: "primary", onclick: () => { state.step = 0; render(); } }, "Start the quiz"),
  ));
}

function renderQuestion() {
  const i = state.step;
  const q = QUESTIONS[i];
  const chosen = state.answers[i];
  const skipped = state.skipped.has(i);

  const options = q.options.map((o, idx) => el("button", {
    class: "option" + (chosen === idx ? " selected" : ""),
    "aria-pressed": String(chosen === idx),
    onclick: () => choose(idx),
  }, el("span", { class: "key" }, String((idx + 1) % 10)),
    el("span", {}, o.t, DEBUG ? el("span", { class: "debug" }, describeEffects(o)) : null)));

  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "progress-row" },
      el("span", {}, `Question ${i + 1} / ${QUESTIONS.length}`),
      el("span", {}, q.topic)),
    el("div", { class: "progress" }, el("div", { style: `width:${(i / QUESTIONS.length) * 100}%` })),
    el("h2", {}, q.q),
    DEBUG ? el("div", { class: "debug debug-live" }, "Live: " +
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

// Add ?debug to the URL to see what every answer scores, for playtesting.
const DEBUG = new URLSearchParams(location.search).has("debug");

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
  render();
  autoAdvance();
}

function skip() {
  state.answers[state.step] = null;
  state.skipped.add(state.step);
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
  render();
}

function back() {
  clearTimeout(advanceTimer);
  state.step -= 1;
  render();
}

const MIN_ANSWERS = 10;

function renderResults() {
  const answered = state.answers.filter((a) => a != null).length;
  if (answered < MIN_ANSWERS) {
    app.append(el("div", { class: "card fade-in" },
      el("div", { class: "eyebrow" }, "Not enough intel"),
      el("h1", {}, "Answer a few more"),
      el("p", { class: "muted" },
        `You answered ${answered} of ${QUESTIONS.length} questions. Answer at least ${MIN_ANSWERS} so there's enough to match you on.`),
      el("div", { class: "actions" },
        el("button", { class: "primary", onclick: () => { state.step = state.skipped.size ? Math.min(...state.skipped) : 0; render(); } }, "Go back to skipped questions"),
        el("button", { onclick: restart }, "Start over")),
    ));
    return;
  }
  const ranked = score(state.answers);
  const user = profile(state.answers);
  const top = ranked[0];
  // Branches with the same rounded score are shown as a tie rather than
  // quietly picking one on decimals.
  const tied = ranked.filter((r) => r.pct === top.pct);
  const isTie = tied.length > 1;
  setBackground(top.id);
  const names = joinWords(tied.map((r) => BRANCHES[r.id].name));
  const info = BRANCHES[top.id];
  const components = componentScore(state.answers);
  const tracks = trackScore(state.answers);
  const track = TRACKS[tracks[0].id];
  const hasDegree = state.answers.some((idx, i) => idx != null && QUESTIONS[i].options[idx].degree);
  const options = tied.map((r) => serviceOption(r.id, components[0].id));
  const jobNotes = tied.map((r) => interestNote(state.answers, r.id)).filter(Boolean);
  const strongest = Object.entries(user)
    .filter(([, u]) => Math.abs(u.value) >= 1)
    .sort((a, b) => b[1].weight * Math.abs(b[1].value) - a[1].weight * Math.abs(a[1].value))
    .slice(0, 6);

  const why = tied.flatMap((r) => fits(user, r.id).slice(0, isTie ? 3 : 5)
    .map((w) => `You lean toward ${w}, and so does the ${BRANCHES[r.id].name}.`));
  const headsUp = tied.flatMap((r) => clashes(user, r.id).slice(0, isTie ? 2 : 3));

  const jobCards = tied.flatMap((r) => {
    const b = BRANCHES[r.id];
    return topJobs(state.answers, r.id, tracks[0].id, isTie ? 2 : 3).map((j, n) =>
      el("div", { class: "job", style: `--hero:${b.color}` },
        el("div", { class: "job-path" }, `#${n + 1} · ${b.name} · ${track.name}`),
        el("strong", { class: "job-name" }, j.n),
        el("p", { class: "muted", style: "margin:4px 0 0" }, j.d),
        j.shared.length ? el("p", { style: "margin:6px 0 0; font-size:14px" },
          `Fits your interest in ${joinWords(j.shared.slice(0, 2).map((k) => INTERESTS[k]))}.`) : null,
        el("p", { style: "margin:6px 0 0; font-size:14px" }, el("strong", {}, "After you get out: "), civilianCareers(j).join(", ")),
        el("a", { href: branchLink(r.id, tracks[0].id, components[0].id), style: "display:inline-block; margin-top:8px; font-size:14px" }, "See this path →")));
  });

  const bars = ranked.map((r) => {
    const fill = el("div", { style: `background:${BRANCHES[r.id].color}` });
    requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = r.pct + "%"; }));
    return el("div", { class: "bar-row" },
      el("span", {}, BRANCHES[r.id].name),
      el("div", { class: "bar", role: "img", "aria-label": `${BRANCHES[r.id].name} ${r.pct}%` }, fill),
      el("span", { class: "num" }, r.pct + "%"));
  });

  // Every other branch within 10 points of the top is shown as a close match;
  // otherwise just the runner-up.
  const rest = ranked.slice(tied.length);
  const closeOnes = rest.filter((r) => top.pct - r.pct <= 10);
  const others = closeOnes.length ? closeOnes : rest.slice(0, 1);
  const otherCards = others.map((r) => {
    const b = BRANCHES[r.id];
    const reasons = fits(user, r.id).slice(0, 2);
    return el("div", { class: "runner-up", style: `border-left:4px solid ${b.color}` },
      el("strong", {}, `${b.name} (${r.pct}%)`),
      el("p", { class: "muted", style: "margin:6px 0 0" }, b.tagline),
      reasons.length ? el("p", { style: "margin:8px 0 0; font-size:14px" },
        `Shares your lean toward ${reasons.join(" and ")}.`) : null,
      el("p", { style: "margin:8px 0 0; font-size:14px" },
        "Top role: ", el("strong", {}, topJobs(state.answers, r.id, tracks[0].id, 1)[0].n)));
  });

  app.append(el("div", { class: "card results fade-in" },
    el("div", { class: "eyebrow" }, isTie ? "It's a tie!" : "Your best match"),
    el("div", { class: "result-hero", style: `--hero:${info.color}` },
      el("h1", {}, names),
      el("div", { class: "pct" }, isTie ? `${top.pct}% MATCH EACH` : `${top.pct}% MATCH`),
      isTie
        ? el("p", { style: "margin-top:12px" }, "Your answers fit these branches equally well, so both are worth a serious look.")
        : el("p", { style: "margin-top:12px" }, info.tagline),
      el("p", { style: "margin:0" }, isTie ? "Best ways to serve: " : "Best way to serve: ",
        el("strong", {}, options.map((o) => `${o.title}, ${track.name}`).join(" or ")))),
    tied.map((r) => el("p", {}, isTie ? el("strong", {}, BRANCHES[r.id].name + ": ") : null, BRANCHES[r.id].about)),

    el("div", { class: "section-title" }, "Top roles for you"),
    el("div", { class: "jobs" }, jobCards),
    jobNotes.map((n) => el("div", { class: "note", style: "margin-top:12px" }, n)),
    el("p", { class: "muted", style: "margin:10px 0 0; font-size:13px" },
      "Job names are simplified. Every branch has many more jobs, and which ones you can get depends on test scores, physical standards and openings. Civilian careers are common paths, and some need extra licenses or school."),

    strongest.length ? [
      el("div", { class: "section-title" }, "Your profile"),
      el("div", { class: "chips" }, strongest.map(([t, u]) => el("span", { class: "chip" }, capitalize(phrase(t, u.value))))),
    ] : null,

    why.length ? [
      el("div", { class: "section-title" }, "Why you matched"),
      el("ul", { class: "list good" }, why.map((w) =>
        el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, w)))),
    ] : null,

    headsUp.length ? [
      el("div", { class: "section-title" }, "Heads up"),
      el("ul", { class: "list warn" }, headsUp.map((h) =>
        el("li", {}, el("span", { class: "mark" }, "!"), el("span", {}, h)))),
    ] : null,

    el("div", { class: "section-title" }, "All branches"),
    el("div", { class: "bars" }, bars),

    el("div", { class: "section-title" }, closeOnes.length ? "Also a close match" : "Runner-up"),
    closeOnes.length ? el("p", { class: "muted", style: "font-size:14px" },
      `${closeOnes.length === 1 ? "This branch is" : "These branches are"} within 10 points of your top match, so ${closeOnes.length === 1 ? "it's" : "they're"} worth a look too.`) : null,
    el("div", { style: "display:grid; gap:10px" }, otherCards),

    el("div", { class: "section-title" }, "Service type"),
    el("div", { class: "bars" }, components.map((r) => {
      const fill = el("div", { style: "background:var(--accent)" });
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = r.pct + "%"; }));
      return el("div", { class: "bar-row" },
        el("span", {}, COMPONENTS[r.id].name),
        el("div", { class: "bar", role: "img", "aria-label": `${COMPONENTS[r.id].name} ${r.pct}%` }, fill),
        el("span", { class: "num" }, r.pct + "%"));
    })),
    el("p", { style: "margin:14px 0 0" }, el("strong", {}, COMPONENTS[components[0].id].name + ": "), COMPONENTS[components[0].id].about),
    options.filter((o) => o.note).map((o) => el("div", { class: "note", style: "margin-top:12px" }, o.note)),

    el("div", { class: "section-title" }, "Enlisted or officer"),
    el("div", { class: "bars" }, tracks.map((r) => {
      const fill = el("div", { style: "background:var(--accent)" });
      requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = r.pct + "%"; }));
      return el("div", { class: "bar-row" },
        el("span", {}, TRACKS[r.id].name),
        el("div", { class: "bar", role: "img", "aria-label": `${TRACKS[r.id].name} ${r.pct}%` }, fill),
        el("span", { class: "num" }, r.pct + "%"));
    })),
    el("p", { style: "margin:14px 0 0" }, el("strong", {}, track.name + ": "), track.about),
    hasDegree && tracks[0].id === "enlisted"
      ? el("div", { class: "note", style: "margin-top:12px" }, "You said you already have a degree. Your answers lean enlisted, but with a degree you could also apply to become an officer through officer candidate or training school, so ask a recruiter about both.")
      : null,
    el("p", { class: "muted", style: "margin:8px 0 0; font-size:14px" },
      "Not set in stone: enlisted members can become officers later through commissioning programs, and NCOs lead plenty of people too."),

    el("div", { class: "actions" },
      el("button", { class: "primary", onclick: restart }, "Take it again"),
      el("button", { onclick: copyResult }, "Copy my result"),
      el("a", { class: "button", href: branchLink(top.id, tracks[0].id, components[0].id) }, `Explore the ${info.name}`)),
  ));
}

function restart() {
  state.step = -1;
  state.answers = [];
  state.skipped.clear();
  render();
}

async function copyResult(e) {
  const ranked = score(state.answers);
  const tied = ranked.filter((r) => r.pct === ranked[0].pct);
  const componentId = componentScore(state.answers)[0].id;
  const trackId = trackScore(state.answers)[0].id;
  const picks = tied.map((r) => {
    const job = topJobs(state.answers, r.id, trackId, 1)[0];
    return `${serviceOption(r.id, componentId).title}, ${TRACKS[trackId].name} (top role: ${job.n})`;
  });
  const header = tied.length > 1
    ? ["My Ranked Bingo result: a tie!", ...picks]
    : [`My Ranked Bingo result: ${picks[0]}`];
  const text = [...header, ...ranked.map((r) => `${BRANCHES[r.id].name}: ${r.pct}%`)].join("\n");
  const btn = e.currentTarget;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copied!";
  } catch {
    btn.textContent = "Couldn't copy";
  }
  setTimeout(() => { btn.textContent = "Copy my result"; }, 1500);
}

document.addEventListener("keydown", (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (route.page !== "quiz") return;
  if (state.step < 0 || state.step >= QUESTIONS.length) return;
  const n = e.key === "0" ? 10 : Number(e.key);
  if (n >= 1 && n <= QUESTIONS[state.step].options.length) choose(n - 1);
  else if (e.key === "s") skip();
  else if (e.key === "ArrowLeft") { if (state.step > 0) back(); }
  else if (e.key === "ArrowRight" || e.key === "Enter") next();
});

// ---------------------------------------------------------------------------
// Explorer: branch pages, service types and training.

function setBackground(branch) {
  const bg = document.getElementById("bg");
  const src = branch && BG_IMAGES[branch];
  if (src) bg.style.backgroundImage = `url("${src}")`;
  bg.classList.toggle("on", Boolean(src));
}

const route = { page: "quiz", branch: null, track: "enlisted", type: "active" };

function parseRoute() {
  const [path, query = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const parts = path.split("/").filter(Boolean);
  const params = new URLSearchParams(query);
  route.page = parts[0] || "quiz";
  route.branch = ORDER.includes(parts[1]) ? parts[1] : null;
  route.track = TRACK_ORDER.includes(params.get("track")) ? params.get("track") : "enlisted";
  route.type = COMPONENT_ORDER.includes(params.get("type")) ? params.get("type") : "active";
  if (route.page === "branch" && !route.branch) route.page = "branches";
  if (!["quiz", "branches", "branch", "types", "training"].includes(route.page)) route.page = "quiz";
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
window.branchQuiz = { DETAILS, route, QUESTIONS, BRANCHES, ORDER, TRAITS, profile, score, fits, clashes, componentScore, trackScore, serviceOption, topJobs, interestVector, JOBS, civilianCareers, CIVILIAN_OVERRIDES, state, render };

render();
