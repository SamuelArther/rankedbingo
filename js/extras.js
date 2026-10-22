"use strict";

// Bingo mode, boot camp bingo, badges and the Fun page. Loaded before app.js;
// everything here runs only when called.

// ---------------------------------------------------------------------------
// Small helpers shared by the extras.

function loadJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

// A stable number from a string, used to seed card layouts.
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function toast(message) {
  let box = document.getElementById("toasts");
  if (!box) {
    box = el("div", { id: "toasts", "aria-live": "polite" });
    document.body.append(box);
  }
  const t = el("div", { class: "toast" }, message);
  box.append(t);
  setTimeout(() => t.classList.add("out"), 3200);
  setTimeout(() => t.remove(), 3800);
}

// The 12 ways to get bingo on a 5x5 card: rows, columns and diagonals.
const BINGO_LINES = [
  ...[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c)),
  ...[0, 1, 2, 3, 4].map((c) => [0, 1, 2, 3, 4].map((r) => r * 5 + c)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

function completedLines(marked) {
  return BINGO_LINES.filter((line) => line.every((i) => marked[i]));
}

// ---------------------------------------------------------------------------
// Badges. Earned badges and a few stats live in this browser only.

const BADGES = [
  { id: "recruit", icon: "🎖️", name: "Recruit", desc: "Finish your first quiz." },
  { id: "fullsend", icon: "💯", name: "Full send", desc: "Finish the full quiz." },
  { id: "quickdraw", icon: "⚡", name: "Quick draw", desc: "Finish quick mode." },
  { id: "veteran", icon: "🪖", name: "Veteran", desc: "Take the quiz three times." },
  { id: "hopper", icon: "🔀", name: "Branch hopper", desc: "Get three different top branches." },
  { id: "tie", icon: "🤝", name: "Tie breaker", desc: "Get a tie for your top branch." },
  { id: "undecided", icon: "🤷", name: "Undecided", desc: "Skip five questions in one quiz." },
  { id: "bingo", icon: "🎯", name: "Bingo!", desc: "Get a bingo in Bingo mode." },
  { id: "blackout", icon: "⬛", name: "Triple bingo", desc: "Get three or more bingos on one Bingo mode card." },
  { id: "explorer", icon: "🧭", name: "Explorer", desc: "Visit all six branch pages." },
  { id: "recruiter", icon: "📣", name: "Recruiter", desc: "Share your result." },
  { id: "squad", icon: "👥", name: "Squad goals", desc: "Compare results with a friend." },
  { id: "feedback", icon: "📬", name: "Mail call", desc: "Send feedback." },
  { id: "clockwork", icon: "🕐", name: "Clockwork", desc: "Score 20 in the military time challenge." },
  { id: "sparks", icon: "📡", name: "Sparks", desc: "Decode 10 words in the Morse challenge." },
  { id: "streak7", icon: "🔥", name: "On fire", desc: "Answer the daily question 7 days in a row." },
  { id: "psychic", icon: "🔮", name: "Called it", desc: "A prediction about a friend's branch comes true." },
  { id: "graduate", icon: "🎓", name: "Boot camp grad", desc: "Get a bingo in boot camp bingo." },
  { id: "phonetic", icon: "📻", name: "Phonetic pro", desc: "Score 20 in the phonetic alphabet challenge." },
];

const BADGE_KEY = "rankedbingo.badges.v1";
const STATS_KEY = "rankedbingo.stats.v1";

function earnedBadges() {
  return new Set(loadJson(BADGE_KEY, []));
}

function award(id) {
  const earned = earnedBadges();
  if (earned.has(id)) return;
  earned.add(id);
  saveJson(BADGE_KEY, [...earned]);
  const b = BADGES.find((x) => x.id === id);
  if (b) toast(`${b.icon} ${T("Badge unlocked: {name}", { name: b.name })}`);
}

// Called once when a quiz is finished.
function recordQuizDone(qs, answers, mode) {
  const stats = loadJson(STATS_KEY, { quizzes: 0, tops: [], visited: [] });
  stats.quizzes += 1;
  award("recruit");
  if (mode === "quick") award("quickdraw");
  if (mode === "full") award("fullsend");
  if (stats.quizzes >= 3) award("veteran");
  if (mode !== "bingo" && answers.filter((a) => a == null).length >= 5) award("undecided");
  if (mode === "bingo") {
    const { lines } = bingoLinesFor(answers);
    if (lines.length >= 1) award("bingo");
    if (lines.length >= 3) award("blackout");
  }
  if (answers.filter((a) => a != null).length >= minAnswers(qs)) {
    const r = computeResult(qs, answers);
    if (!stats.tops.includes(r.top.id)) stats.tops.push(r.top.id);
    if (stats.tops.length >= 3) award("hopper");
    if (r.tied.length > 1) award("tie");
    recordHistory(qs, answers, mode, r);
  }
  saveJson(STATS_KEY, stats);
}

function recordBranchVisit(branch) {
  const stats = loadJson(STATS_KEY, { quizzes: 0, tops: [], visited: [] });
  if (!stats.visited.includes(branch)) stats.visited.push(branch);
  saveJson(STATS_KEY, stats);
  if (ORDER.every((b) => stats.visited.includes(b))) award("explorer");
}

function badgeGrid() {
  const earned = earnedBadges();
  return el("div", { class: "badges" }, BADGES.map((b) => el("div", { class: "badge" + (earned.has(b.id) ? " earned" : ""), title: b.desc },
    el("span", { class: "badge-icon", "aria-hidden": "true" }, earned.has(b.id) ? b.icon : "🔒"),
    el("strong", {}, b.name),
    el("span", { class: "muted" }, b.desc))));
}

// ---------------------------------------------------------------------------
// Bingo mode: a 5x5 card of statements. Check every square that fits you,
// hit Done, and the checks are scored like quiz answers. Full rows, columns
// and diagonals light up as bingos (just for fun; they don't change the
// result).

// The 24 squares around the free center, as 25 cells.
function bingoCells(qs) {
  return [...qs.slice(0, 12), null, ...qs.slice(12, 24)];
}

function bingoLinesFor(answers) {
  // Answers can be shorter than the card (only tapped squares are set).
  const checked = Array.from({ length: 24 }, (_, k) => answers[k] === 0);
  const marked = [...checked.slice(0, 12), true, ...checked.slice(12)];
  return { marked, lines: completedLines(marked) };
}

const MIN_BINGO_CHECKS = 5;

function renderBingoPlay() {
  const cells = bingoCells(QUESTIONS);
  const checked = state.answers.filter((a) => a === 0).length;
  const { marked, lines } = bingoLinesFor(state.answers);
  const inLine = new Set(lines.flat());
  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, T("Bingo mode")),
    el("h2", { style: "margin-bottom:6px" }, T("Tap every square that fits you")),
    el("p", { class: "muted", style: "font-size:14px" }, T("Then hit Done to see your branch. Checked: {count}", { count: checked }) + (lines.length ? ` · ${T("BINGO ×{count}!", { count: lines.length })} 🎯` : "")),
    el("div", { class: "bingo-board play" }, cells.map((q, i) => {
      if (!q) return el("div", { class: "bingo-cell marked free" + (inLine.has(i) ? " line" : ""), style: "--c:var(--accent)" }, T("★ FREE"));
      const qi = i < 12 ? i : i - 1;
      return el("button", {
        class: "bingo-cell" + (marked[i] ? " marked" : "") + (inLine.has(i) ? " line" : ""),
        style: "--c:var(--accent)",
        "aria-pressed": String(marked[i]),
        onclick: () => {
          state.answers[qi] = state.answers[qi] === 0 ? null : 0;
          save();
          render();
        },
      }, q.q, DEBUG ? el("span", { class: "debug" }, describeEffects(q.options[0])) : null);
    })),
    el("div", { class: "nav" },
      el("button", { onclick: () => { state.step = -1; render(); } }, T("Back")),
      el("button", {
        class: "primary", disabled: checked < MIN_BINGO_CHECKS,
        onclick: () => {
          state.answers = QUESTIONS.map((_, i) => (state.answers[i] === 0 ? 0 : 1));
          state.step = QUESTIONS.length;
          recordQuizDone(QUESTIONS, state.answers, state.mode);
          save();
          showResults();
        },
      }, checked < MIN_BINGO_CHECKS ? T("Check at least {count}", { count: MIN_BINGO_CHECKS }) : T("Done"))),
  ));
}

// Your filled card on the results page.
function bingoResultCard(qs, answers) {
  const cells = bingoCells(qs);
  const { marked, lines } = bingoLinesFor(answers);
  const inLine = new Set(lines.flat());
  return el("div", {},
    el("div", { class: "bingo-head", style: "--c:var(--accent)" }, lines.length ? `${T("BINGO ×{count}!", { count: lines.length })} 🎯` : T("{count} squares checked", { count: answers.filter((a) => a === 0).length })),
    el("div", { class: "bingo-board play" }, cells.map((q, i) => el("div", {
      class: "bingo-cell" + (marked[i] ? " marked" : "") + (inLine.has(i) ? " line" : "") + (q ? "" : " free"),
      style: "--c:var(--accent)",
    }, q ? q.q : T("★ FREE")))));
}

// ---------------------------------------------------------------------------
// Boot camp bingo: tap things that happened to you (or that you expect) at
// boot camp. Just for fun; saved in this browser.

const BOOTCAMP_SQUARES = [
  "Head shaved on day one", "Yelled at for something tiny", "Gas chamber training", "Fire watch at 3 a.m.",
  "Made your bed perfectly", "Failed an inspection", "Push-ups as punishment", "Ate a meal in five minutes",
  "Learned to march", "Sang cadence", "First time at the rifle range", "Swim test",
  "Got letters at mail call", "Phone taken away", "Lost track of what day it is", "Ruck march",
  "Shots line (lots of vaccines)", "Folded your clothes to the inch", "Someone got a nickname", "Ran in formation",
  "Learned your rank structure", "Woke up before 5 a.m.", "Field training exercise", "Graduation day",
];

const BOOT_KEY = "rankedbingo.bootcamp.v1";

function renderBootcampBingo() {
  let saved = loadJson(BOOT_KEY, null);
  if (!saved || !Array.isArray(saved.order) || saved.order.length !== 24) {
    saved = { order: shuffled([...Array(24).keys()], makeRng(Date.now())), marked: [] };
    saveJson(BOOT_KEY, saved);
  }
  const wrap = el("div");
  const draw = () => {
    const cells = [...saved.order.slice(0, 12), "free", ...saved.order.slice(12)];
    const marked = cells.map((c, i) => c === "free" || saved.marked.includes(i));
    const lines = completedLines(marked);
    const inLine = new Set(lines.flat());
    if (lines.length) award("graduate");
    wrap.replaceChildren(
      el("div", { class: "bingo-head", style: "--c:var(--accent)" }, lines.length ? `${T("BINGO ×{count}!", { count: lines.length })} 🎓` : T("Tap what happened (or what you expect)")),
      el("div", { class: "bingo-board" }, cells.map((c, i) => el("button", {
        class: "bingo-cell" + (marked[i] ? " marked" : "") + (inLine.has(i) ? " line" : "") + (c === "free" ? " free" : ""),
        style: "--c:var(--accent)",
        "aria-pressed": String(marked[i]),
        disabled: c === "free",
        onclick: () => {
          saved.marked = saved.marked.includes(i) ? saved.marked.filter((x) => x !== i) : [...saved.marked, i];
          saveJson(BOOT_KEY, saved);
          draw();
        },
      }, c === "free" ? T("★ FREE") : BOOTCAMP_SQUARES[c]))),
      el("div", { class: "actions", style: "justify-content:center" },
        el("button", { onclick: () => { saved = { order: shuffled([...Array(24).keys()], makeRng(Date.now())), marked: [] }; saveJson(BOOT_KEY, saved); draw(); } }, T("New card"))),
    );
  };
  draw();
  return wrap;
}

// ---------------------------------------------------------------------------
// Phonetic alphabet game: see a letter, type its code word. 60 seconds.

const PHONETIC = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf", H: "Hotel", I: "India",
  J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu",
};
// Common alternate spellings that count as right.
const PHONETIC_ALT = { alpha: "A", juliet: "J", xray: "X" };

function phoneticGame() {
  const box = el("div", { class: "phonetic" });
  let best = loadJson("rankedbingo.phonetic.best", 0);
  const idle = () => box.replaceChildren(
    el("p", { class: "muted", style: "margin-top:0" }, T("Type the code word for each letter (A is Alfa, B is Bravo...). You get 60 seconds. Best: {best}.", { best })),
    el("div", { class: "chips" }, Object.entries(PHONETIC).map(([l, w]) => el("span", { class: "chip" }, el("strong", {}, l), ` ${w}`))),
    el("div", { class: "actions", style: "justify-content:center" }, el("button", { class: "primary", onclick: play }, T("Start"))));
  const play = () => {
    let score = 0, letter = "", timeLeft = 60;
    const big = el("div", { class: "phonetic-letter" });
    const input = el("input", { class: "text-input", type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false", placeholder: T("Code word"), "aria-label": T("Code word") });
    const status = el("div", { class: "muted" });
    const nextLetter = () => {
      const letters = Object.keys(PHONETIC).filter((x) => x !== letter);
      letter = letters[Math.floor(Math.random() * letters.length)];
      big.textContent = letter;
      input.value = "";
    };
    const tick = () => { status.textContent = T("{seconds}s left · score {score}", { seconds: timeLeft, score }); };
    input.addEventListener("input", () => {
      const guess = input.value.toLowerCase().replace(/[^a-z]/g, "");
      const target = PHONETIC[letter].toLowerCase().replace(/[^a-z]/g, "");
      if (guess === target || PHONETIC_ALT[guess] === letter) { score += 1; tick(); nextLetter(); }
    });
    box.replaceChildren(big, input, status);
    nextLetter(); tick(); input.focus();
    const timer = setInterval(() => {
      timeLeft -= 1; tick();
      if (timeLeft > 0 && box.isConnected) return;
      clearInterval(timer);
      if (!box.isConnected) return;
      if (score > best) { best = score; saveJson("rankedbingo.phonetic.best", best); }
      if (score >= 20) award("phonetic");
      box.replaceChildren(el("div", { class: "bingo-head", style: "--c:var(--accent)" }, T("Time! You got {score}.", { score })), el("p", { class: "muted", style: "text-align:center" }, T("Best: {best}", { best })),
        el("div", { class: "actions", style: "justify-content:center" }, el("button", { class: "primary", onclick: play }, T("Play again")), el("button", { onclick: idle }, T("Back"))));
    }, 1000);
  };
  idle();
  return box;
}

// ---------------------------------------------------------------------------
// History, famous people, bases and slang, from the research data.

function historySection() {
  const holder = el("div");
  const draw = (b) => {
    holder.replaceChildren(
      el("div", { class: "chips", style: "margin-bottom:12px" }, ORDER.map((x) => el("button", { class: "chip chip-btn" + (x === b ? " active" : ""), onclick: () => draw(x) },
        el("span", { class: "dot", style: `background:${BRANCHES[x].color}` }), BRANCHES[x].name))),
      el("ol", { class: "timeline", style: `--c:${BRANCHES[b].color}` }, INFO.history[b].map((h) => el("li", {},
        el("span", { class: "tl-date" }, new Date(h.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })),
        el("span", {}, h.text)))));
  };
  draw("army");
  return holder;
}

function peopleSection() {
  return el("div", { class: "jobs" }, ORDER.map((b) => el("details", { class: "job", style: `--hero:${BRANCHES[b].color}` },
    el("summary", {}, el("strong", { class: "job-name" }, `${BRANCHES[b].name} (${INFO.people[b].length})`)),
    el("ul", { class: "list", style: "margin-top:8px" }, INFO.people[b].map((p) => el("li", {}, el("span", { class: "mark" }, "★"),
      el("span", {}, el("strong", {}, p.name), ` — ${p.famousFor}. `, el("span", { class: "muted" }, p.service))))))));
}

function basesSection() {
  return el("div", { class: "jobs" }, ORDER.map((b) => el("details", { class: "job", style: `--hero:${BRANCHES[b].color}` },
    el("summary", {}, el("strong", { class: "job-name" }, `${BRANCHES[b].name} (${INFO.bases[b].length})`)),
    el("ul", { class: "list", style: "margin-top:8px" }, INFO.bases[b].map((x) => el("li", {}, el("span", { class: "mark" }, "📍"),
      el("span", {}, el("strong", {}, x.name), `, ${x.place}. `, el("span", { class: "muted" }, x.knownFor), " ",
        el("a", { href: `https://www.openstreetmap.org/?mlat=${x.lat}&mlon=${x.lon}#map=10/${x.lat}/${x.lon}`, target: "_blank", rel: "noopener" }, T("Map ↗")))))))));
}

function slangSection() {
  const search = el("input", { class: "text-input", type: "search", placeholder: T("Search slang"), "aria-label": T("Search slang") });
  const list = el("dl", { class: "req" });
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    list.replaceChildren(...INFO.slang.filter((x) => !q || `${x.term} ${x.meaning}`.toLowerCase().includes(q)).flatMap((x) => [
      el("dt", {}, x.term, x.branch !== "all" && BRANCHES[x.branch] ? el("span", { class: "muted" }, ` · ${BRANCHES[x.branch].name}`) : null),
      el("dd", {}, x.meaning)]));
  };
  search.addEventListener("input", draw);
  draw();
  return el("div", {}, search, el("div", { style: "margin-top:12px" }, list));
}

function renderFun() {
  withInfo(() => {
    app.append(el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Fun")),
      el("h1", {}, T("Games and extras")),
      hubCards("fun"),
      el("div", { class: "section-title" }, T("Boot camp bingo")),
      renderBootcampBingo(),
      el("div", { class: "section-title" }, T("ASVAB practice")),
      el("a", { class: "button", href: "#/asvab" }, T("Practice the ASVAB →")),
      el("div", { class: "section-title" }, T("Phonetic alphabet challenge")),
      phoneticGame(),
      el("div", { class: "section-title" }, T("Military slang")),
      slangSection(),
      el("div", { class: "section-title" }, T("History timeline")),
      historySection(),
      el("div", { class: "section-title" }, T("Famous people who served")),
      peopleSection(),
      el("div", { class: "section-title" }, T("Where they're based")),
      basesSection(),
      el("div", { class: "section-title" }, T("Your badges")),
      el("p", { class: "muted", style: "font-size:14px; margin-top:-4px" }, T("Saved in this browser only.")),
      badgeGrid(),
      el("p", { class: "muted", style: "font-size:13px; margin-top:16px" }, T("History, bases and people were researched from official branch and history sites in October 2026.")),
    ));
  });
}
