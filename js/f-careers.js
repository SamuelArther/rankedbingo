"use strict";

// Careers pages: job vs job comparison, a job-matching quiz, officer
// commissioning routes, the service academies, and typical duty stations for
// a job. Research data loads only when a page needs it:
//   js/f-careers-paths.js      officer routes per branch
//   js/f-careers-academies.js  service academy guide
//   js/f-careers-bases.js      career field -> typical installations

// ---------------------------------------------------------------------------
// Shared helpers.

const CAREERS_TRACKS = ["enlisted", "warrant", "officer"];

// Runs `fn` once the full job lists (and any extra scripts) have loaded, if
// the reader is still on `page`.
function careersWithJobs(page, srcs, fn) {
  const status = el("p", { class: "muted" }, T("Loading the job list..."));
  app.append(status);
  Promise.all([ensureJobsData(), ...srcs.map(loadScriptOnce)])
    .then(() => { if (route.page === page) { status.remove(); fn(); } })
    .catch(() => { status.textContent = T("Couldn't load this page. Check your connection and try again."); });
}

function careersFindJob(branch, id) {
  if (!ORDER.includes(branch) || !id) return null;
  return jobsFor(branch).find((j) => j.id === id) || null;
}

// "<branch>.<id>" as used in comparison links.
function careersJobKey(branch, job) {
  return `${branch}.${encodeURIComponent(job.id)}`;
}

function careersParseKey(key) {
  const [branch, ...rest] = decodeURIComponent(key || "").split(".");
  const job = careersFindJob(branch, rest.join("."));
  return job ? { branch, job } : null;
}

function careersCompareLink(a, b) {
  return `#/job-compare/${a ? careersJobKey(a.branch, a.job) : "-"}/${b ? careersJobKey(b.branch, b.job) : "-"}`;
}

function careersBasesLink(branch, job) {
  return `#/job-bases/${branch}/${encodeURIComponent(job.id)}`;
}

function careersBranchColor(branch) {
  return BRANCHES[branch] ? BRANCHES[branch].color : "var(--accent)";
}

// Civilian careers for a job, the same way the job page picks them.
function careersCivilian(job) {
  const override = CIVILIAN_OVERRIDES[job.titleEn || job.title];
  if (override) return override;
  const interest = jobInterest(job);
  return interest ? CIVILIAN[interest] : null;
}

// Pulls lengths like "20 weeks", "55 days" or "6 months" out of a training
// note. Boot camp parts are left out so the total is job training only.
function careersTrainingWeeks(text) {
  if (!text) return null;
  const re = /(\d+(?:\.\d+)?)(?:\s*(?:-|to)\s*(\d+(?:\.\d+)?))?[\s-]*(week|day|month|year)s?\b([^;,.]*)/gi;
  const perUnit = { week: 1, day: 1 / 7, month: 4.35, year: 52 };
  let total = 0, found = false, m;
  while ((m = re.exec(text))) {
    // Only look within the same clause, so "Basic Training; 16 weeks of AIT" counts the 16.
    const before = text.slice(Math.max(0, m.index - 30), m.index).split(/[;,.]/).pop();
    const context = `${before} ${m[4]}`;
    if (/basic (combat )?training|boot camp|recruit training|\bbct\b/i.test(context)) continue;
    const value = m[2] ? (Number(m[1]) + Number(m[2])) / 2 : Number(m[1]);
    total += value * perUnit[m[3].toLowerCase()];
    found = true;
  }
  return found && total > 0 ? Math.max(1, Math.round(total)) : null;
}

function careersJobRow(branch, job, extra) {
  return el("a", { class: "job-row", href: jobLink(branch, job), style: `--hero:${careersBranchColor(branch)}` },
    job.code ? el("span", { class: "job-code" }, job.code) : null,
    el("span", { class: "job-row-text" },
      el("strong", {}, job.title),
      el("span", { class: "muted" }, `${BRANCHES[branch].name} · ${trackLabel(job.track)} · ${job.category}`),
      extra || null));
}

let careersPickerCount = 0;

// A search box over every branch's jobs. `onPick(branch, job)` runs when a
// result is chosen.
function careersJobPicker(label, onPick, opts = {}) {
  const id = `careers-pick-${++careersPickerCount}`;
  let branchFilter = opts.branch && ORDER.includes(opts.branch) ? opts.branch : "all";
  const input = el("input", { id, class: "text-input", type: "search", autocomplete: "off", placeholder: T("Search by job title, code or field") });
  const results = el("div", { class: "careers-pick-results", "aria-live": "polite" });
  const branches = el("div", { class: "seg careers-pick-branches", role: "group", "aria-label": T("Branch") });

  const drawBranches = () => branches.replaceChildren(...["all", ...ORDER].map((b) => el("button", {
    type: "button", class: "seg-item" + (branchFilter === b ? " active" : ""), "aria-pressed": String(branchFilter === b),
    onclick: () => { branchFilter = b; drawBranches(); draw(); },
  }, b === "all" ? T("All") : BRANCHES[b].name)));

  const draw = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.replaceChildren(); return; }
    const words = q.split(/\s+/);
    const hits = [];
    for (const b of branchFilter === "all" ? ORDER : [branchFilter]) {
      for (const j of jobsFor(b)) {
        const hay = `${j.code || ""} ${j.title} ${j.titleEn || ""} ${j.category} ${BRANCHES[b].name}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) continue;
        const exact = (j.code || "").toLowerCase() === q || j.title.toLowerCase().startsWith(q);
        hits.push({ b, j, rank: exact ? 0 : 1 });
      }
    }
    hits.sort((x, y) => x.rank - y.rank);
    results.replaceChildren(el("div", { class: "job-list" },
      hits.length ? null : el("p", { class: "muted" }, T("No jobs match that search.")),
      ...hits.slice(0, 8).map(({ b, j }) => el("button", {
        type: "button", class: "job-row", style: `--hero:${careersBranchColor(b)}`, onclick: () => onPick(b, j),
      },
        j.code ? el("span", { class: "job-code" }, j.code) : null,
        el("span", { class: "job-row-text" }, el("strong", {}, j.title),
          el("span", { class: "muted" }, `${BRANCHES[b].name} · ${trackLabel(j.track)} · ${j.category}`)))),
      hits.length > 8 ? el("p", { class: "muted careers-small" }, T("Showing 8 of {count}. Type more to narrow it down.", { count: hits.length })) : null));
  };

  input.addEventListener("input", draw);
  drawBranches();
  return el("div", { class: "careers-picker" },
    el("label", { class: "seg-label", for: id }, label),
    branches,
    input,
    results);
}

// ---------------------------------------------------------------------------
// Job vs job: #/job-compare/<branch>.<id>/<branch>.<id>

function renderJobCompare() {
  careersWithJobs("job-compare", [], () => {
    const a = careersParseKey(route.parts[0]);
    const b = careersParseKey(route.parts[1]);
    const holder = el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Careers")),
      el("h1", {}, T("Job vs job")),
      el("p", { class: "muted" }, T("Pick any two jobs, from the same branch or different ones, and see them side by side.")));

    const slot = (side, picked, other) => {
      const go = (branch, job) => {
        const next = { branch, job };
        location.hash = side === "a" ? careersCompareLink(next, other) : careersCompareLink(other, next);
      };
      if (picked) {
        return el("div", { class: "careers-slot" },
          el("div", { class: "seg-label" }, side === "a" ? T("Job 1") : T("Job 2")),
          careersJobRow(picked.branch, picked.job),
          el("button", {
            type: "button", class: "careers-change",
            onclick: () => { location.hash = side === "a" ? careersCompareLink(null, other) : careersCompareLink(other, null); },
          }, T("Change")));
      }
      return el("div", { class: "careers-slot" },
        careersJobPicker(side === "a" ? T("Pick job 1") : T("Pick job 2"), go, { branch: other ? other.branch : null }));
    };

    holder.append(el("div", { class: "careers-slots" }, slot("a", a, b), slot("b", b, a)));
    if (a && b) holder.append(careersCompareTable(a, b));
    else holder.append(el("p", { class: "muted", style: "margin-top:16px" }, T("Search for a job above, or open any job page and use its compare link.")));
    holder.append(el("p", { class: "muted careers-small", style: "margin-top:18px" },
      T("Training lengths are read from each job's official listing and don't include boot camp. They change often, so confirm with a recruiter.")));
    app.append(holder);
  });
}

function careersCompareTable(a, b) {
  const row = (label, fn) => {
    const va = fn(a), vb = fn(b);
    if (va == null && vb == null) return null;
    return el("div", { class: "careers-cmp-row", role: "row" },
      el("div", { class: "careers-cmp-label", role: "rowheader" }, label),
      [a, b].map((side, i) => el("div", { class: "careers-cmp-cell", role: "cell", style: `--hero:${careersBranchColor(side.branch)}` },
        (i ? vb : va) ?? el("span", { class: "muted" }, T("Not listed")))));
  };
  const weeks = (s) => {
    const w = careersTrainingWeeks(s.job.training);
    return w ? T("About {n} weeks", { n: w }) : null;
  };
  const gettingThere = (s) => s.job.track === "enlisted"
    ? T("{bootcamp} ({length}), then job training.", { bootcamp: DETAILS[s.branch].bootcamp.name, length: DETAILS[s.branch].bootcamp.length.toLowerCase() })
    : s.job.track === "warrant" ? T("Usually selected from experienced enlisted members.") : T("Commission as an officer (academy, ROTC or officer candidate school).");
  const civ = (s) => { const c = careersCivilian(s.job); return c ? c.join(", ") : null; };
  const links = (s) => el("div", { class: "careers-cmp-links" },
    el("a", { href: jobLink(s.branch, s.job) }, T("Job page")),
    el("a", { href: careersBasesLink(s.branch, s.job) }, T("Where they're stationed")),
    s.job.source ? el("a", { href: s.job.source, target: "_blank", rel: "noopener" }, T("Official page ↗")) : null);

  return el("div", { class: "careers-cmp", role: "table", "aria-label": T("Job comparison") },
    el("div", { class: "careers-cmp-row careers-cmp-head", role: "row" },
      el("div", { class: "careers-cmp-label", role: "columnheader" }, T("Job")),
      [a, b].map((s) => el("div", { class: "careers-cmp-cell", role: "columnheader", style: `--hero:${careersBranchColor(s.branch)}` },
        el("div", { class: "job-path" }, BRANCHES[s.branch].name),
        el("strong", {}, s.job.title)))),
    row(T("Branch"), (s) => BRANCHES[s.branch].name),
    row(T("Role"), (s) => trackLabel(s.job.track)),
    row(T("Code"), (s) => s.job.code || null),
    row(T("Career field"), (s) => s.job.category),
    row(T("What you'd do"), (s) => s.job.description || null),
    row(T("Training"), (s) => s.job.training || null),
    row(T("Job training length"), weeks),
    row(T("Getting there"), gettingThere),
    row(T("Common civilian careers"), civ),
    row(T("Links"), links));
}

// ---------------------------------------------------------------------------
// Job quiz: rate a dozen kinds of work, get the five best-matching real jobs
// from one branch.

// Each interest: the question, a short reason label, and the pattern that
// marks a job as involving it (tested on field, title and description).
const CAREERS_QUIZ = [
  { id: "fix", q: "Fixing engines, machines and equipment", why: "fixing things",
    core: /\b(mechanic|repairer|maintenance technician|machinist|machinery technician)/i,
    re: /\b(mechanic|maint(ain|enance|ainer)|repair|machinist|machinery|propulsion|engines?\b|engineman|generator|hvac|refrigeration|power ?plant|weld|metals?\b|electrician|electrical|armament|damage control|hull)/i },
  { id: "build", q: "Building and construction: roads, buildings, power and plumbing", why: "building things",
    core: /\b(builder|construction|carpentry|engineer equipment|combat engineer|civil engineer)/i,
    re: /\b(construct|builder|seabee|carpent|plumb|utilit|steelwork|heavy equipment|engineer equipment|bridg|combat engineer|survey|water treatment|civil engineer|concrete|masonry|horizontal|vertical construction|pavements|structural|facilities)/i },
  { id: "computers", q: "Working with computers, networks and cybersecurity", why: "computers and cyber",
    core: /\b(cyber|network|information (technology|systems))/i,
    re: /\b(cyber|network|computer|information (technology|technician|systems?)|it specialist|software|data\b|database|programm|systems administrat|c5i)/i },
  { id: "science", q: "Science, engineering, space or nuclear power", why: "science and engineering",
    core: /\b(nuclear|space|engineer\b|meteorolog|scien)/i,
    re: /\b(scien|nuclear|reactor|space|satellite|orbital|astronaut|meteorolog|weather|metoc|oceanograph|chemi|cbrn|physic|research|engineering duty|developmental engineer|aeronautical|astronautical|electronics technician|electrical engineer|radar)/i },
  { id: "medical", q: "Caring for sick or injured people", why: "medicine and health",
    core: /\b(medic\b|corpsman|health services technician|nurse|physician|dentist|medical (service|technician|specialist))/i,
    re: /\b(medic(al|ine)?\b|health|nurs|dental|dentist|hospital|corpsman|pharma|surg|physician|clinic|patient|veterinar|therap|optometr|psycholog|biomedical|radiolog|respiratory|bioenvironmental|aeromedical|laboratory)/i },
  { id: "people", q: "Helping, teaching or organizing people", why: "working with people",
    core: /\b(human resources|personnel|chaplain|recruiter|counselor)/i,
    re: /\b(human resources?|personnel|admin|recruit(er|ing)|chaplain|religious|counsel|instructor|teach|education|community|career|equal opportunity|family|yeoman|talent acquisition|manpower)/i },
  { id: "media", q: "Music, photos, video, writing or design", why: "creative work",
    core: /\b(music|photo|public affairs|journalis|band\b)/i,
    re: /\b(music|band\b|photo|journalis|public affairs|media|broadcast|graphic|visual information|combat camera|video|multimedia|mass communication|illustrat)/i },
  { id: "law", q: "Police work, security and investigations", why: "law and security",
    core: /\b(police|security forces|master-at-arms|investigat|maritime enforcement|judge advocate)/i,
    re: /\b(police|security forces|security specialist|law enforcement|enforcement|master-at-arms|corrections|investigat|criminal|military working dog|k-?9|legal|paralegal|judge advocate|jag\b|lawyer|attorney|boarding|special investigations)/i },
  { id: "intel", q: "Solving puzzles: intelligence, codes and analysis", why: "intelligence and analysis",
    core: /\b(intelligence|cryptolog|linguist)/i,
    re: /\b(intel|cryptolog|crypto|signals|linguist|language|counterintel|geospatial|imagery|analyst|targeting|all.source|sigint|electronic warfare|electromagnetic warfare|reconnaissance)/i },
  { id: "combat", q: "Combat training: weapons, tactics and field exercises", why: "combat and field training",
    core: /\b(infantry|rifleman|special forces|seal\b|raider|pararescue|combat control|special warfare|special tactics)/i,
    re: /\b(infantry|rifle(man)?\b|armor\b|armor crew|cavalry|scout|artillery|fire support|fires\b|mortar|machine gun|anti-?tank|sniper|special forces|special warfare|special operations|special tactics|special reconnaissance|seal\b|raider|pararescue|combat control|tactical air control|swcc|explosive ordnance|eod\b|gunner|air defense|weapons|light armored|assault|ground forces)/i },
  { id: "vehicles", q: "Driving, flying or piloting aircraft and boats", why: "driving and flying",
    core: /\b(pilot\b|aviator|crew chief|aviation survival|rescue swimmer|motor transport operator|motor vehicle operator|boat operator|coxswain|watercraft)/i,
    re: /\b(pilot|aviator|flight officer|aircrew|aviation survival|rescue swimmer|crew chief|flight engineer|loadmaster|driver|motor transport|motor vehicle|vehicle operator|boat operator|watercraft|vessel|coxswain|navigator|air traffic|remotely piloted|unmanned|uas\b|rpa\b|sensor operator|aerial gunner|boatswain|astronaut)/i },
  { id: "sea", q: "Life on ships and the water", why: "ships and the sea",
    core: /\b(boatswain|surface warfare|cutter|deck|maritime enforcement|seaman|watercraft)/i,
    re: /\b(ships?\b|shipboard|boat|watercraft|vessel|deck\b|boatswain|seaman|marine safety|maritime|diver|diving|sonar|submarin|quartermaster|surface warfare|at sea|cutter|underwater|afloat|damage control|operations specialist|gunner's mate|harbor|port security)/i },
  { id: "logistics", q: "Keeping things running: supplies, transport, money and planning", why: "logistics and planning",
    core: /\b(logistic|supply|transportation|finance|fuel)/i,
    re: /\b(logistic|supply|transportation|fuel|petroleum|ammunition|munitions|cargo|warehouse|food|culinary|finance|financial|budget|acquisition|contract|storekeeper|distribution|movement|traffic management|aerial port|motor transport|comptroller)/i },
];

const CAREERS_QUIZ_ANSWERS = [
  { v: 2, label: "Sounds fun" },
  { v: 0.5, label: "It's OK" },
  { v: -1.5, label: "Not for me" },
];

// How strongly a job involves each interest (0 to 1). The career field and
// title count fully; a description mention counts half.
function careersJobInterests(job) {
  const field = `${job.categoryEn || job.category}`;
  const title = `${job.titleEn || job.title}`;
  const desc = job.description || "";
  const out = {};
  for (const it of CAREERS_QUIZ) {
    const w = it.re.test(field) ? 0.8 : 0;
    const t = it.re.test(title) ? 1 : 0;
    const d = it.re.test(desc) ? 0.35 : 0;
    const score = Math.min(1, Math.max(w, t, d) + (w && t ? 0.2 : 0));
    if (score) out[it.id] = score;
    if (score && it.core.test(title)) out[`${it.id}:core`] = 1;
  }
  return out;
}

// Ranks a branch's jobs for the answers. Returns the top `count` with the
// interests that drove each match, keeping at most three per career field so
// the list isn't five versions of one job.
function careersQuizMatches(branch, track, answers, count = 5) {
  const pool = jobsFor(branch).filter((j) => track === "any" ? true
    : track === "officer" ? j.track === "officer" || j.track === "warrant" : j.track === track);
  const scored = pool.map((job) => {
    const tags = careersJobInterests(job);
    let score = 0;
    const reasons = [];
    for (const [id, w] of Object.entries(tags)) {
      // Headline jobs for an interest (infantry for combat, medic for
      // medicine) get a boost when that interest is a favorite.
      if (id.endsWith(":core")) { const a = answers[id.slice(0, -5)] ?? 0; if (a > 1) score += 0.4 * a; continue; }
      const a = answers[id] ?? 0;
      // A dislike only counts fully when it's central to the job, so one
      // passing mention in a description doesn't sink an otherwise good fit.
      score += a < 0 && w < 0.5 ? a * w * 0.3 : a * w;
      if (a > 1 && w >= 0.5) reasons.push({ id, w });
    }
    // Jobs that matched nothing are weak picks; nudge them down.
    const count = Object.keys(tags).filter((k) => !k.endsWith(":core")).length;
    if (!count) score -= 0.5;
    score -= count * 0.05;
    reasons.sort((x, y) => y.w - x.w);
    return { job, score, reasons };
  }).sort((x, y) => y.score - x.score || x.job.title.localeCompare(y.job.title));

  const picked = [], perField = {};
  for (const s of scored) {
    const f = s.job.category;
    if ((perField[f] || 0) >= 3) continue;
    perField[f] = (perField[f] || 0) + 1;
    picked.push(s);
    if (picked.length === count) break;
  }
  return picked;
}

const careersQuizState = { branch: null, track: "enlisted", step: -1, answers: {} };

function renderJobQuiz() {
  careersWithJobs("job-quiz", [], () => {
    const holder = el("div", { class: "fade-in" });
    app.append(holder);
    careersQuizDraw(holder);
  });
}

function careersQuizDraw(holder) {
  const st = careersQuizState;
  if (st.step < 0 || !st.branch) holder.replaceChildren(careersQuizSetup(holder));
  else if (st.step < CAREERS_QUIZ.length) holder.replaceChildren(careersQuizQuestion(holder));
  else holder.replaceChildren(careersQuizResults(holder));
  const focus = holder.querySelector("[data-autofocus]");
  if (focus) focus.focus({ preventScroll: true });
}

function careersQuizSetup(holder) {
  const st = careersQuizState;
  const tracks = st.branch ? ["enlisted", "officer", "any"].filter((t) => t === "any"
    || jobsFor(st.branch).some((j) => (t === "officer" ? j.track !== "enlisted" : j.track === t))) : [];
  if (st.branch && !tracks.includes(st.track)) st.track = tracks[0];
  const trackNames = { enlisted: T("Enlisted"), officer: T("Officer or warrant"), any: T("Not sure, show both") };
  return el("div", {},
    el("div", { class: "eyebrow" }, T("Careers")),
    el("h1", {}, T("Job match quiz")),
    el("p", { class: "muted" }, T("Pick a branch, rate {count} kinds of work, and see five real jobs from that branch's list that fit what you enjoy.", { count: CAREERS_QUIZ.length })),
    el("div", { class: "seg-row" },
      el("div", { class: "seg-label", id: "careers-quiz-branch" }, T("Branch")),
      el("div", { class: "chips", role: "group", "aria-labelledby": "careers-quiz-branch" }, ORDER.map((b) => el("button", {
        type: "button", class: "chip-btn careers-branch-chip" + (st.branch === b ? " active" : ""), style: `--hero:${BRANCHES[b].color}`,
        "aria-pressed": String(st.branch === b), onclick: () => { st.branch = b; careersQuizDraw(holder); },
      }, el("span", { class: "careers-dot", "aria-hidden": "true" }), BRANCHES[b].name)))),
    st.branch ? el("div", { class: "seg-row" },
      el("div", { class: "seg-label", id: "careers-quiz-track" }, T("Role")),
      el("div", { class: "seg", role: "group", "aria-labelledby": "careers-quiz-track" }, tracks.map((t) => el("button", {
        type: "button", class: "seg-item" + (st.track === t ? " active" : ""), "aria-pressed": String(st.track === t),
        onclick: () => { st.track = t; careersQuizDraw(holder); },
      }, trackNames[t])))) : null,
    st.branch && st.track === "officer" ? el("p", { class: "muted careers-small", style: "margin-top:10px" },
      T("Officers need a bachelor's degree. Want to know how people become officers?"), " ",
      el("a", { href: "#/officer-paths" }, T("See officer paths"))) : null,
    el("div", { class: "actions" },
      el("button", {
        type: "button", class: "primary", disabled: !st.branch,
        onclick: () => { st.step = 0; st.answers = {}; careersQuizDraw(holder); },
      }, T("Start"))),
    el("p", { class: "muted careers-small", style: "margin-top:18px" }, T("Just for fun, and only a starting point. Jobs also depend on test scores, physical standards and what's open.")));
}

function careersQuizQuestion(holder) {
  const st = careersQuizState;
  const item = CAREERS_QUIZ[st.step];
  const pct = Math.round((st.step / CAREERS_QUIZ.length) * 100);
  const answer = (v) => { st.answers[item.id] = v; st.step++; careersQuizDraw(holder); };
  const qid = `careers-q-${item.id}`;
  return el("div", { class: "card" },
    el("div", { class: "progress-row" },
      el("span", {}, `${BRANCHES[st.branch].name} · ${T("Question {n} of {total}", { n: st.step + 1, total: CAREERS_QUIZ.length })}`),
      el("span", {}, `${pct}%`)),
    el("div", { class: "progress", role: "progressbar", "aria-label": T("Progress"), "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(pct) },
      el("div", { style: `width:${pct}%` })),
    el("p", { class: "muted", style: "margin:0 0 4px" }, T("How would you like this kind of work?")),
    el("h2", { id: qid, tabindex: "-1", "data-autofocus": "" }, T(item.q)),
    el("div", { class: "options", role: "group", "aria-labelledby": qid }, CAREERS_QUIZ_ANSWERS.map((a, i) => el("button", {
      type: "button", class: "option" + (st.answers[item.id] === a.v ? " selected" : ""), onclick: () => answer(a.v),
    }, el("span", { class: "key", "aria-hidden": "true" }, String(i + 1)), T(a.label)))),
    el("div", { class: "nav" },
      el("button", { type: "button", onclick: () => { st.step--; careersQuizDraw(holder); } }, T("← Back")),
      el("button", { type: "button", onclick: () => { delete st.answers[item.id]; st.step++; careersQuizDraw(holder); } }, T("Skip"))));
}

function careersQuizResults(holder) {
  const st = careersQuizState;
  const info = BRANCHES[st.branch];
  const top = careersQuizMatches(st.branch, st.track, st.answers);
  const liked = CAREERS_QUIZ.filter((it) => (st.answers[it.id] ?? 0) > 1);
  const whyText = (r) => r.reasons.length
    ? T("Why: you liked {list}.", { list: r.reasons.slice(0, 3).map((x) => T(CAREERS_QUIZ.find((it) => it.id === x.id).why)).join(", ") })
    : T("Why: a closer fit than most, though it didn't match your favorites directly.");
  return el("div", {},
    el("div", { class: "result-hero", style: `--hero:${info.color}` },
      el("div", { class: "pct" }, T("YOUR TOP 5 · {branch}", { branch: info.name.toUpperCase() })),
      el("h1", { style: "margin-top:8px" }, T("Jobs that fit what you enjoy"))),
    liked.length ? null : el("div", { class: "note" }, T("You didn't pick \"Sounds fun\" for anything, so these are loose matches. Try again and pick a few favorites.")),
    liked.length && top.length && top[0].score < 1.5 ? el("div", { class: "note" }, T("Few {branch} jobs match what you picked, so these are loose matches. Try another branch too.", { branch: info.name })) : null,
    st.branch === "usmc" && (st.answers.medical ?? 0) > 1 ? el("div", { class: "note", style: "margin-top:8px" }, T("The Marine Corps doesn't have its own medical jobs. Navy corpsmen, doctors and nurses serve with Marine units, so check the Navy too.")) : null,
    el("div", { class: "job-list", style: "margin-top:14px" }, top.map((r) =>
      careersJobRow(st.branch, r.job, el("span", { class: "careers-why" }, whyText(r))))),
    top.length >= 2 ? el("p", { style: "margin-top:14px" },
      el("a", { href: careersCompareLink({ branch: st.branch, job: top[0].job }, { branch: st.branch, job: top[1].job }) }, T("Compare your top two side by side →"))) : null,
    el("div", { class: "actions" },
      el("button", { type: "button", class: "primary", onclick: () => { st.step = -1; careersQuizDraw(holder); } }, T("Try another branch")),
      el("button", { type: "button", onclick: () => { st.step = 0; st.answers = {}; careersQuizDraw(holder); } }, T("Retake")),
      el("a", { class: "button", href: jobsLink(st.branch, st.track === "officer" ? "officer" : "enlisted") }, T("All {branch} jobs", { branch: info.name }))),
    el("p", { class: "muted careers-small", style: "margin-top:18px" }, T("Matches come from each job's career field and description in the official listings. Talk to a recruiter about what's open and what you qualify for.")));
}

// ---------------------------------------------------------------------------
// Officer paths: #/officer-paths/<branch>

const careersPathAnswers = { age: null, school: null, enlisted: null, college: null };

const CAREERS_PATH_QUESTIONS = [
  { id: "age", label: "How old are you?", options: [["teen", "17 or younger"], ["18-22", "18 to 22"], ["23-29", "23 to 29"], ["30+", "30 or older"]] },
  { id: "school", label: "Where are you in school?", options: [["hs", "In high school"], ["college", "In college"], ["degree", "Have a bachelor's degree"], ["pro", "Doctor, nurse, lawyer, chaplain or similar"], ["none", "Finished high school, no degree"]] },
  { id: "enlisted", label: "Are you already in the military?", options: [["no", "No"], ["yes", "Yes, enlisted"]] },
  { id: "college", label: "Do you want the full college experience?", options: [["yes", "Yes"], ["no", "Not really"], ["either", "Don't mind"]] },
];

// Scores each route for the answers; higher fits better. Returns sorted
// [{ id, score, why }].
function careersPathFit(ans) {
  const young = ans.age === "teen" || ans.age === "18-22";
  const fits = {
    academy: { score: 0, why: [] }, rotc: { score: 0, why: [] }, ocs: { score: 0, why: [] },
    direct: { score: 0, why: [] }, warrant: { score: 0, why: [] },
  };
  const add = (id, n, why) => { fits[id].score += n; if (why) fits[id].why.push(why); };
  if (ans.school === "hs") {
    add("academy", 3, T("You can apply while still in high school."));
    add("rotc", 3, T("You can apply for an ROTC scholarship in high school and join in college."));
    add("ocs", -3);
    add("direct", -3);
  }
  if (ans.school === "college") {
    add("rotc", 3, T("You can usually join ROTC while you're already in college."));
    add("ocs", 1, T("Once you graduate, OCS or OTS is the fastest route."));
    add("academy", young ? 1 : -3, young ? T("Some college students still apply, starting over as a first-year.") : null);
    add("direct", -2);
  }
  if (ans.school === "degree") {
    add("ocs", 4, T("With a degree, officer candidate school takes about 3 months or less."));
    add("academy", -4); add("rotc", -1, null);
    add("direct", -1);
  }
  if (ans.school === "pro") {
    add("direct", 5, T("Doctors, nurses, lawyers and chaplains usually commission directly in their field."));
    add("ocs", 1);
    add("academy", -4); add("rotc", -2);
  }
  if (ans.school === "none") {
    add("warrant", 2, T("Some warrant officer programs (like Army flight school) don't require a degree."));
    add("academy", young ? 2 : -3, young ? T("A service academy gives you a free degree and a commission.") : null);
    add("rotc", young ? 2 : 0, young ? T("ROTC lets you earn a degree and a commission together.") : null);
    add("ocs", -3);
  }
  if (ans.age === "23-29" || ans.age === "30+") {
    add("academy", -5, null);
    if (ans.age === "30+") { add("ocs", 0, T("Officer candidate age limits are often in the low-to-mid 30s, with waivers in some cases.")); add("rotc", -1); }
  }
  if (ans.enlisted === "yes") {
    add("warrant", 3, T("Most warrant officers are picked from experienced enlisted members."));
    add("ocs", 1, T("Each branch has programs that help enlisted members earn a degree and commission."));
  }
  if (ans.college === "yes") { add("academy", 2, T("You'd get four years of college with your classmates.")); add("rotc", 2, T("You'd have normal college life plus ROTC training.")); }
  if (ans.college === "no") { add("ocs", 1); add("warrant", 1); add("academy", -1); }
  return Object.entries(fits).map(([id, f]) => ({ id, score: f.score, why: f.why })).sort((a, b) => b.score - a.score);
}

function renderOfficerPaths() {
  withScripts(["js/f-careers-paths.js"], () => {
    const data = window.F_CAREERS_PATHS;
    const branch = ORDER.includes(route.parts[0]) ? route.parts[0] : "army";
    const routes = Object.fromEntries(data.routes.map((r) => [r.id, r]));
    const finder = el("div");
    const drawFinder = () => {
      const ans = careersPathAnswers;
      const done = CAREERS_PATH_QUESTIONS.every((q) => ans[q.id]);
      const qs = CAREERS_PATH_QUESTIONS.map((q) => el("div", { class: "seg-row" },
        el("div", { class: "seg-label", id: `careers-pq-${q.id}` }, T(q.label)),
        el("div", { class: "seg", role: "group", "aria-labelledby": `careers-pq-${q.id}` }, q.options.map(([v, label]) => el("button", {
          type: "button", class: "seg-item" + (ans[q.id] === v ? " active" : ""), "aria-pressed": String(ans[q.id] === v),
          onclick: () => { ans[q.id] = v; drawFinder(); },
        }, T(label))))));
      let out = null;
      if (done) {
        const ranked = careersPathFit(ans).filter((r) => r.score > 0 && routes[r.id]).slice(0, 3);
        const branchRoute = (id) => {
          const b = data.branches[branch];
          const key = id === "academy" ? "academy" : id;
          return b && b[key] ? b[key].name : null;
        };
        out = el("div", { class: "careers-fit", "aria-live": "polite" },
          el("div", { class: "section-title" }, T("Routes that fit you best")),
          ranked.length ? el("ol", { class: "careers-fit-list" }, ranked.map((r, i) => el("li", { class: i === 0 ? "careers-fit-top" : null },
            el("strong", {}, routes[r.id].name),
            branchRoute(r.id) ? el("div", { class: "careers-small" }, `${BRANCHES[branch].name}: ${branchRoute(r.id)}`) : null,
            r.why.length ? el("div", { class: "muted careers-small" }, r.why.join(" ")) : null,
            el("button", { type: "button", class: "careers-linkbtn careers-small", onclick: () => { const t = document.getElementById(`careers-route-${r.id}`); if (t) { t.open = true; t.scrollIntoView({ block: "start" }); t.querySelector("summary").focus({ preventScroll: true }); } } }, T("See details"))))
          ) : el("p", { class: "muted" }, T("None of the usual routes fits those answers well. A recruiter or officer recruiter can tell you about exceptions and waivers.")),
          el("p", { class: "muted careers-small" }, T("A rough guide only. Age limits, waivers and openings differ by branch and change often.")));
      }
      finder.replaceChildren(el("div", { class: "card careers-finder" },
        el("h2", { style: "margin-top:0" }, T("Which route fits you?")), ...qs, out));
    };
    drawFinder();

    const b = data.branches[branch];
    const branchTabs = el("div", { class: "seg", role: "group", "aria-label": T("Branch") }, ORDER.map((id) => el("a", {
      class: "seg-item" + (id === branch ? " active" : ""), href: `#/officer-paths/${id}`, "aria-current": id === branch ? "page" : null,
    }, BRANCHES[id].name)));
    const branchRows = ["academy", "rotc", "ocs", "direct", "warrant"].map((key) => b && b[key] ? el("div", { class: "careers-path-row", style: `--hero:${BRANCHES[branch].color}` },
      el("div", { class: "job-path" }, routes[key] ? routes[key].name : key),
      el("strong", {}, b[key].name),
      el("p", {}, b[key].text),
      b[key].url ? el("a", { href: b[key].url, target: "_blank", rel: "noopener", class: "careers-small" }, T("Official page ↗")) : null) : null);

    app.append(el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Learn")),
      el("h1", {}, T("How to become an officer")),
      el("p", { class: "muted" }, T("Officers lead units and need a bachelor's degree (warrant officers are the exception). There are four main ways in: a service academy, ROTC in college, officer candidate school after college, or a direct commission for professionals.")),
      finder,
      el("div", { class: "section-title" }, T("The routes")),
      el("div", { class: "careers-routes" }, data.routes.map((r) => el("details", { class: "careers-route", id: `careers-route-${r.id}` },
        el("summary", {}, el("strong", {}, r.name), el("span", { class: "muted" }, r.summary)),
        el("div", { class: "careers-route-body" },
          r.who ? el("p", {}, r.who) : null,
          careersFacts([[T("Requires"), r.requires], [T("Timeline"), r.timeline], [T("Service commitment"), r.commitment]]),
          el("div", { class: "two-col" },
            el("div", {}, el("div", { class: "section-title" }, T("Pros")), careersList(r.pros, "good", "+")),
            el("div", {}, el("div", { class: "section-title" }, T("Cons")), careersList(r.cons, "warn", "–"))),
          careersSources(r.sources))))),
      el("div", { class: "section-title" }, T("By branch")),
      branchTabs,
      el("div", { class: "careers-paths-branch" }, branchRows,
        b && b.after ? el("p", { class: "note", style: "margin-top:12px" }, el("strong", {}, T("After you commission: ")), b.after) : null,
        b ? careersSources(b.sources) : null),
      data.notes && data.notes.length ? [el("div", { class: "section-title" }, T("Good to know")),
        el("ul", { class: "careers-notes" }, data.notes.map((n) => el("li", {}, n.text, " ", n.source ? el("a", { href: n.source, target: "_blank", rel: "noopener", class: "careers-small" }, T("Source ↗")) : null)))] : null,
      el("div", { class: "actions" },
        el("a", { class: "button", href: "#/academies" }, T("Service academy guide")),
        el("a", { class: "button", href: "#/job-quiz" }, T("Job match quiz"))),
      el("p", { class: "muted careers-small", style: "margin-top:16px" }, T("Checked against official branch and academy sites in {date}. Requirements change, so confirm with an officer recruiter.", { date: data.checked }))));
  });
}

function careersList(items, kind, mark) {
  if (!items || !items.length) return null;
  return el("ul", { class: `list ${kind}` }, items.map((t) => el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, mark), el("span", {}, t))));
}

// Label/value rows; a value can be a string or a list of strings.
function careersFacts(rows) {
  return el("dl", { class: "careers-facts" }, rows.filter(([, v]) => v && v.length).map(([k, v]) => [
    el("dt", {}, k),
    el("dd", {}, Array.isArray(v) ? el("ul", {}, v.map((x) => el("li", {}, x))) : v)]));
}

function careersSources(list) {
  const urls = (list || []).filter(Boolean);
  if (!urls.length) return null;
  return el("p", { class: "muted careers-small careers-sources" }, T("Sources:"), " ",
    urls.map((u, i) => [i ? ", " : "", el("a", { href: u, target: "_blank", rel: "noopener" }, careersHost(u))]));
}

function careersHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; }
}

// ---------------------------------------------------------------------------
// Service academies: #/academies/<id>

function renderAcademies() {
  withScripts(["js/f-careers-academies.js"], () => {
    const data = window.F_CAREERS_ACADEMIES;
    const list = data.academies;
    const current = list.find((a) => a.id === route.parts[0]) || list[0];
    const color = current.branches.length ? BRANCHES[current.branches[0]].color : "#9aa39a";

    const tabs = el("div", { class: "seg", role: "group", "aria-label": T("Academy") }, list.map((a) => el("a", {
      class: "seg-item" + (a === current ? " active" : ""), href: `#/academies/${a.id}`, "aria-current": a === current ? "page" : null,
    }, a.short)));

    const branchNames = current.branches.map((b) => BRANCHES[b].name).join(T(" or "));
    app.append(el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Learn")),
      el("h1", {}, T("Service academies")),
      el("p", { class: "muted" }, T("Five federal academies give a free four-year degree in exchange for serving as an officer after graduation. Getting in is competitive, and the process starts early in high school.")),
      el("div", { class: "section-title" }, T("The path in")),
      el("ol", { class: "careers-timeline" }, data.timeline.map((s) => el("li", {},
        el("div", { class: "job-path", style: "--hero:var(--accent)" }, s.when),
        el("strong", {}, s.title),
        el("p", {}, s.text)))),
      el("div", { class: "section-title" }, T("Each academy")),
      tabs,
      el("div", { class: "card careers-academy", style: `--hero:${color}; margin-top:12px` },
        el("div", { class: "result-hero", style: `--hero:${color}; margin-bottom:12px` },
          el("div", { class: "pct" }, current.branches.length ? branchNames.toUpperCase() : T("MERCHANT MARINE")),
          el("h2", { style: "margin:8px 0 4px" }, current.name),
          el("p", { class: "muted", style: "margin:0" }, [current.place.includes(current.short) ? null : current.short, current.place, current.founded ? T("founded {year}", { year: current.founded }) : null].filter(Boolean).join(" · "))),
        current.unique && current.unique.length ? careersList(current.unique, "good", "★") : null,
        careersFacts([
          [T("Commission"), current.commission],
          [T("Nomination"), current.nomination],
          [T("Who can apply"), current.eligibility],
          [T("Applying"), current.apply],
          [T("Summer program for juniors"), current.summer],
          [T("Fitness test"), current.fitness],
          [T("Medical exam"), current.medical],
          [T("First summer"), current.firstSummer],
          [T("Degree"), current.degree],
          [T("Cost"), current.cost],
          [T("Service after graduation"), current.obligation],
        ]),
        el("div", { class: "actions", style: "margin-top:14px" },
          current.url ? el("a", { class: "button primary", href: current.url, target: "_blank", rel: "noopener" }, T("Official admissions ↗")) : null),
        careersSources(current.sources)),
      data.notes && data.notes.length ? [el("div", { class: "section-title" }, T("Good to know")),
        el("ul", { class: "careers-notes" }, data.notes.map((n) => el("li", {}, n.text, " ", n.source ? el("a", { href: n.source, target: "_blank", rel: "noopener", class: "careers-small" }, T("Source ↗")) : null)))] : null,
      el("div", { class: "actions" },
        el("a", { class: "button", href: "#/officer-paths" }, T("Other ways to become an officer"))),
      el("p", { class: "muted careers-small", style: "margin-top:16px" }, T("Checked against each academy's official site in {date}. Deadlines change every year, so always confirm dates with admissions.", { date: data.checked }))));
  });
}

// ---------------------------------------------------------------------------
// Typical duty stations for a job: #/job-bases/<branch>/<id>

function careersBaseRule(branch, job) {
  const rules = (window.F_CAREERS_BASES && window.F_CAREERS_BASES[branch]) || [];
  const text = `${job.code || ""} ${job.titleEn || job.title} ${job.categoryEn || job.category}`;
  return rules.find((r) => (!r.track || r.track === job.track) && new RegExp(r.test, "i").test(text)) || null;
}

function renderJobBases() {
  const branch = ORDER.includes(route.parts[0]) ? route.parts[0] : null;
  const id = decodeURIComponent(route.parts[1] || "");
  careersWithJobs("job-bases", ["js/f-careers-bases.js"], () => {
    const job = careersFindJob(branch, id);
    if (!job) {
      app.append(el("div", { class: "fade-in" },
        el("div", { class: "eyebrow" }, T("Careers")),
        el("h1", {}, T("Where would I be stationed?")),
        el("p", { class: "muted" }, T("Pick a job to see the bases where people in that career field commonly serve.")),
        careersJobPicker(T("Find a job"), (b, j) => { location.hash = careersBasesLink(b, j); }, { branch })));
      return;
    }
    const info = BRANCHES[branch];
    const rule = careersBaseRule(branch, job);
    const holder = el("div", { class: "fade-in" },
      el("a", { class: "back-link", href: jobLink(branch, job) }, T("← {job}", { job: job.title })),
      el("div", { class: "result-hero", style: `--hero:${info.color}; margin-top:12px` },
        el("div", { class: "pct" }, [info.name.toUpperCase(), trackLabel(job.track).toUpperCase(), job.code].filter(Boolean).join(" · ")),
        el("h1", { style: "margin-top:8px" }, T("Where you might be stationed")),
        el("p", { style: "margin:0" }, el("strong", {}, job.title)),
        rule ? el("p", { class: "muted", style: "margin:0" }, rule.id === "default" ? T("General {branch} locations", { branch: info.name }) : T("Career field: {field}", { field: rule.label })) : null),
      el("div", { class: "note" }, T("These are typical locations for this career field, not a promise. Where you go depends on openings, your rank, your unit and the needs of the service, and many people also serve overseas or at sea.")));
    app.append(holder);
    if (!rule) {
      holder.append(el("p", {}, T("We don't have location info for this job yet.")), el("a", { class: "button", href: `#/map/${branch}` }, T("See the installation map")));
      return;
    }
    if (rule.note) holder.append(el("p", { style: "margin-top:14px" }, rule.note));
    const status = el("p", { class: "muted" }, T("Loading the map..."));
    holder.append(status);
    loadMapLibs()
      .then(() => { if (route.page === "job-bases") { status.remove(); careersDrawBases(holder, branch, job, rule); } })
      .catch(() => { status.textContent = T("Couldn't load the map. Check your connection and try again."); careersDrawBases(holder, branch, job, rule, true); });
  });
}

function careersDrawBases(holder, branch, job, rule, noMap) {
  const byName = new Map((window.BASES || []).map((s) => [s.n, s]));
  const sites = rule.bases.map((x) => ({ ...x, site: byName.get(x.n) || null }));
  const box = noMap ? null : el("div", { class: "map-box careers-map", role: "region", "aria-label": T("Map of these locations") });
  const list = el("div", { class: "job-list" });
  holder.append(...[box, list].filter(Boolean));

  let map = null;
  const markers = new Map();
  if (box && window.L) {
    map = L.map(box, { preferCanvas: true, worldCopyJump: true, scrollWheelZoom: false });
    L.tileLayer(TILES, { maxZoom: 18, attribution: TILE_CREDIT }).addTo(map);
    const pts = [];
    for (const s of sites) {
      if (!s.site) continue;
      const color = siteBranch(s.site).color;
      const m = L.circleMarker([s.site.lat, s.site.lng], { radius: 8, color: "#0b0f0c", weight: 1, fillColor: color, fillOpacity: 0.9 });
      m.bindPopup(() => basePopup(s.site), { maxWidth: 280 });
      m.bindTooltip(s.site.n, { direction: "top", offset: [0, -6] });
      m.addTo(map);
      markers.set(s.n, m);
      pts.push([s.site.lat, s.site.lng]);
    }
    if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: 7 });
    else map.setView([38, -97], 3);
    requestAnimationFrame(() => {
      map.invalidateSize();
      if (pts.length) map.fitBounds(pts, { padding: [30, 30], maxZoom: 7 });
    });
  }

  list.replaceChildren(...sites.map((s) => {
    const color = s.site ? siteBranch(s.site).color : BRANCHES[branch].color;
    const body = [el("strong", {}, s.n),
      el("span", { class: "muted" }, s.site ? `${siteBranch(s.site).name} · ${s.site.loc}` : ""),
      s.why ? el("span", { class: "careers-why" }, s.why) : null];
    const marker = markers.get(s.n);
    if (!marker) return el("div", { class: "job-row", style: `--hero:${color}` }, el("span", { class: "job-row-text" }, body));
    return el("button", {
      type: "button", class: "job-row", style: `--hero:${color}`, title: T("Show {base} on the map", { base: s.n }),
      onclick: () => {
        map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 8), { duration: 0.8 });
        marker.openPopup();
        box.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      },
    }, el("span", { class: "job-row-text" }, body));
  }));

  holder.append(el("div", {},
    job.training ? [el("div", { class: "section-title" }, T("Where you'd train first")), el("p", {}, job.training)] : null,
    el("div", { class: "actions" },
      el("a", { class: "button", href: jobLink(branch, job) }, T("Back to the job")),
      el("a", { class: "button", href: `#/map/${branch}` }, T("Full installation map")),
      el("a", { class: "button", href: careersCompareLink({ branch, job }, null) }, T("Compare with another job"))),
    careersSources(rule.sources),
    el("p", { class: "muted careers-small" }, T("Unit locations checked against official branch and installation sites in {date}. Units move and new ones stand up, so ask a recruiter about current assignments.", { date: window.F_CAREERS_BASES.checked }))));
}

// ---------------------------------------------------------------------------

registerPage("job-compare", {
  tab: "branches",
  render: renderJobCompare, title: () => T("Job vs job"), hub: null, icon: "⚖️",
  blurb: () => T("Compare any two military jobs side by side."),
});
registerPage("job-quiz", {
  render: renderJobQuiz, title: () => T("Job match quiz"), hub: "fun", icon: "🧭",
  blurb: () => T("Rate kinds of work and get five real jobs that fit you."),
});
registerPage("officer-paths", {
  render: renderOfficerPaths, title: () => T("How to become an officer"), hub: "learn", icon: "🎖️",
  blurb: () => T("Academy, ROTC, OCS or direct commission: which route fits you."),
});
registerPage("academies", {
  render: renderAcademies, title: () => T("Service academies"), hub: "learn", icon: "🏛️",
  blurb: () => T("West Point, Annapolis and the rest: how to get in and what you owe."),
});
registerPage("job-bases", {
  tab: "branches",
  render: renderJobBases, title: () => T("Where jobs are stationed"), hub: null, icon: "📍",
  blurb: () => T("Typical bases for a military job."),
});
