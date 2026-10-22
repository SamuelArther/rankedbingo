"use strict";

// Results extras: result history across retakes, the "first 4 years"
// timeline, display settings (text size, reduced motion) and the QR code
// drawn on share cards.

// ---------------------------------------------------------------------------
// Result history: each finished quiz's branch scores, newest last.

const HISTORY_KEY = "rankedbingo.history.v1";
const HISTORY_MAX = 30;

function recordHistory(qs, answers, mode, r) {
  const history = loadJson(HISTORY_KEY, []);
  history.push({
    t: Date.now(),
    mode,
    code: encodeAnswers(qs, answers),
    pct: Object.fromEntries(r.ranked.map((x) => [x.id, x.pct])),
  });
  saveJson(HISTORY_KEY, history.slice(-HISTORY_MAX));
}

// Line chart of every branch's match across attempts.
function historyChart(history) {
  const W = 360, H = 190, L = 30, R = 8, TOP = 10, B = 24;
  const x = (i) => L + (history.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (history.length - 1));
  const y = (pct) => TOP + ((100 - pct) * (H - TOP - B)) / 100;
  const svg = (tag, attrs) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  };
  const chart = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "history-chart", role: "img",
    "aria-label": T("Your match with each branch across your last {count} results", { count: history.length }) });
  for (const pct of [0, 25, 50, 75, 100]) {
    chart.append(svg("line", { x1: L, x2: W - R, y1: y(pct), y2: y(pct), class: "history-grid" }));
    const label = svg("text", { x: L - 6, y: y(pct) + 4, class: "history-axis", "text-anchor": "end" });
    label.textContent = pct;
    chart.append(label);
  }
  history.forEach((h, i) => {
    const label = svg("text", { x: x(i), y: H - 8, class: "history-axis", "text-anchor": "middle" });
    label.textContent = i + 1;
    chart.append(label);
  });
  for (const b of ORDER) {
    const points = history.map((h, i) => `${x(i)},${y(h.pct[b] ?? 0)}`).join(" ");
    chart.append(svg("polyline", { points, fill: "none", stroke: BRANCHES[b].color, "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" }));
    history.forEach((h, i) => chart.append(svg("circle", { cx: x(i), cy: y(h.pct[b] ?? 0), r: 3.5, fill: BRANCHES[b].color })));
  }
  return chart;
}

function resultHistory() {
  const history = loadJson(HISTORY_KEY, []);
  if (history.length < 2) return null;
  const dateFmt = new Intl.DateTimeFormat(document.documentElement.lang || "en", { month: "short", day: "numeric" });
  const topOf = (h) => ORDER.reduce((best, b) => ((h.pct[b] ?? 0) > (h.pct[best] ?? 0) ? b : best), ORDER[0]);
  const recent = history.slice(-5).reverse();
  return [
    el("div", { class: "section-title" }, T("Your results over time")),
    el("div", { class: "history-box" },
      historyChart(history),
      el("div", { class: "chips history-legend" }, ORDER.map((b) =>
        el("span", { class: "chip" }, el("span", { class: "dot", style: `background:${BRANCHES[b].color}` }), BRANCHES[b].name)))),
    el("div", { class: "job-list", style: "margin-top:10px" }, recent.map((h) => {
      const top = topOf(h);
      return el("a", { class: "job-row", href: `#/r/${h.code}`, style: `--hero:${BRANCHES[top].color}` },
        el("span", { class: "job-row-text" },
          el("strong", {}, `${BRANCHES[top].name} · ${h.pct[top]}%`),
          el("span", { class: "muted" }, `${dateFmt.format(new Date(h.t))} · ${modeLabel(h.mode)}`)));
    })),
    el("p", { class: "muted", style: "font-size:13px" }, T("Saved in this browser only. Your last {count} results are kept.", { count: HISTORY_MAX })),
  ];
}

function modeLabel(mode) {
  return mode === "quick" ? T("Quick mode") : mode === "bingo" ? T("Bingo mode") : T("Full quiz");
}

// ---------------------------------------------------------------------------
// "Your first 4 years": what the path in a result usually looks like.

function firstYears(r) {
  const b = r.top.id, d = DETAILS[b], info = BRANCHES[b];
  const officer = r.tracks[0].id === "officer";
  const component = r.components[0].id;
  const job = r.topJob(b)[0];
  const steps = [
    officer
      ? [T("Now"), T("Look at the routes: a service academy, ROTC in college, or Officer Candidate School after a degree. Academies and ROTC scholarships have deadlines a year or more ahead.")]
      : [T("Now"), T("Talk to recruiters, take the ASVAB, then go to MEPS for your medical exam and to pick a job. Most people wait a few weeks to months in the Delayed Entry Program before they ship.")],
    officer
      ? [T("Becoming an officer"), d.officer]
      : [T("Boot camp"), T("{name}: {length}, at {where}.", { name: d.bootcamp.name, length: d.bootcamp.length.toLowerCase(), where: d.bootcamp.where })],
    [T("Job training"), officer
      ? T("Your first officer course teaches the job you're assigned, for example {job}.", { job: job.n })
      : T("{school} for your job, for example {job}. It can take a few weeks to over a year depending on the job.", { school: d.tech.name, job: job.n })],
    component === "active"
      ? [T("First duty station"), T("You move to a base for your first assignment, usually for 2 to 4 years. The {branch} has installations all over the U.S. and the world.", { branch: info.name })]
      : [T("Back home"), T("You go home and train one weekend a month and about two weeks a year with a unit near you, while you work or go to school.")],
    officer
      ? [T("Years 2 to 4"), T("Promotions come on a schedule: most officers make the second rank after about two years and the third after about four, if they meet standards.")]
      : [T("Years 1 to 4"), T("Promotions come with time in service and performance. Many people reach the fourth or fifth enlisted rank (E-4 or E-5) during their first enlistment.")],
    [T("After your first contract"), T("Reenlist, switch to the Guard or Reserve, or get out and use benefits like the GI Bill. Every contract adds up to 8 years total, counting any time in the Individual Ready Reserve.")],
  ];
  return [
    el("div", { class: "section-title" }, T("Your first 4 years")),
    el("p", { class: "muted", style: "font-size:14px; margin-top:-4px" }, T("A typical path for {option}. Exact timing depends on the job and the branch's needs.", { option: r.options[0].title })),
    el("ol", { class: "timeline", style: `--c:${info.color}` }, steps.map(([when, what]) =>
      el("li", {}, el("span", { class: "tl-date" }, when), el("span", {}, what)))),
    el("div", { class: "actions", style: "margin-top:0" },
      component === "active" ? el("a", { class: "button", href: `#/map/${b}` }, T("{branch} bases on the map", { branch: info.name })) : null,
      el("a", { class: "button", href: "#/training" }, T("Boot camp & training"))),
  ];
}

// ---------------------------------------------------------------------------
// Display settings: text size and reduced motion, applied before first paint
// by the script in index.html and changed from the ⚙️ menu in the nav.

const SETTINGS_KEY = "rankedbingo.settings.v1";
const TEXT_SIZES = ["normal", "large", "larger"];

function loadSettings() {
  return { text: "normal", motion: "auto", ...loadJson(SETTINGS_KEY, {}) };
}

function applySettings(s) {
  document.documentElement.dataset.text = s.text;
  document.documentElement.dataset.motion = s.motion;
}

// True when animations should be skipped (system setting or the site's own).
function reducedMotion() {
  return document.documentElement.dataset.motion === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function settingsPanel() {
  const s = loadSettings();
  const set = (key, value) => {
    s[key] = value;
    saveJson(SETTINGS_KEY, s);
    applySettings(s);
    panel.replaceWith(settingsPanel());
  };
  const labels = { normal: T("Normal"), large: T("Large"), larger: T("Larger") };
  const panel = el("div", { class: "settings-panel", role: "group", "aria-label": T("Display settings") },
    el("div", { class: "seg-label" }, T("Text size")),
    el("div", { class: "seg" }, TEXT_SIZES.map((t) => el("button", {
      type: "button", class: "seg-item" + (s.text === t ? " active" : ""), "aria-pressed": String(s.text === t), onclick: () => set("text", t),
    }, labels[t]))),
    el("div", { class: "seg-label", style: "margin-top:10px" }, T("Animations")),
    el("div", { class: "seg" }, [["auto", T("On")], ["reduce", T("Reduced")]].map(([m, label]) => el("button", {
      type: "button", class: "seg-item" + (s.motion === m ? " active" : ""), "aria-pressed": String(s.motion === m), onclick: () => set("motion", m),
    }, label))));
  return panel;
}

// ---------------------------------------------------------------------------
// QR code for share cards. The generator library loads in the background on
// results pages; cards drawn before it arrives just skip the code.

const QR_LIB = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
const QR_LIB_SRI = "sha512-ZDSPMa/JM1D+7kdg2x3BsruQ6T/JpJo3jWDWkCZsP+5yVyp1KfESqLI+7RqB5k24F7p2cV7i2YHh/890y6P6Sw==";
let qrLoading = null;

function loadQrLib() {
  if (window.qrcode) return Promise.resolve();
  if (!qrLoading) {
    qrLoading = new Promise((resolve, reject) => {
      const s = el("script", { src: QR_LIB, integrity: QR_LIB_SRI, crossorigin: "anonymous" });
      s.onload = resolve;
      s.onerror = () => { qrLoading = null; reject(new Error("QR library failed to load")); };
      document.head.append(s);
    });
  }
  return qrLoading;
}

// Draws a QR code for `text` with its top-left corner at (x, y), at most
// `size` wide, on a white rounded tile with a 4-module quiet zone. Modules are
// whole pixels so scanners read clean edges. Returns false if the library
// isn't loaded.
function drawQr(ctx, text, x, y, size) {
  if (!window.qrcode) return false;
  const qr = window.qrcode(0, "L");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const cell = Math.max(1, Math.floor(size / (n + 8)));
  const tile = cell * (n + 8);
  const left = Math.round(x + size - tile), top = Math.round(y + size - tile);
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(left, top, tile, tile, cell * 2);
  ctx.fill();
  ctx.fillStyle = "#000000";
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (qr.isDark(row, col)) ctx.fillRect(left + (col + 4) * cell, top + (row + 4) * cell, cell, cell);
    }
  }
  ctx.restore();
  return true;
}
