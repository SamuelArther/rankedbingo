"use strict";

// Rank insignia and medal ribbon guides, each with a "guess it" game.
// Data (js/f-insignia-data.js) loads only when one of these pages opens.
// Insignia images are public-domain U.S. government designs from Wikimedia
// Commons; ribbons are drawn here as SVG stripes from their official patterns.

const INSIGNIA_DATA = ["js/f-insignia-data.js"];
const INSIGNIA_ROUND = 10;
const INSIGNIA_RANK_KINDS = [["e", "Enlisted"], ["w", "Warrant officers"], ["o", "Officers"]];
const INSIGNIA_RIBBON_GROUPS = [
  ["valor", "Valor and heroism"], ["merit", "Achievement and service"],
  ["conduct", "Good conduct"], ["service", "Service and campaign"],
];

function insigniaBranchName(b) {
  return b === "joint" ? T("Joint (all branches)") : b === "all" ? T("All branches") : BRANCHES[b].name;
}

function insigniaTabs(page, game) {
  return el("div", { class: "seg insignia-tabs", role: "navigation", "aria-label": T("Sections") },
    el("a", { class: "seg-item" + (game ? "" : " active"), href: `#/${page}`, "aria-current": game ? null : "page" }, T("Guide")),
    el("a", { class: "seg-item" + (game ? " active" : ""), href: `#/${page}/game`, "aria-current": game ? "page" : null }, T("Game")));
}

// ---------------------------------------------------------------------------
// Ranks.

function insigniaRankAlt(b, r) {
  return T("{branch} {title} ({grade}) insignia", { branch: BRANCHES[b].name, title: r.t, grade: r.g });
}

function insigniaRankTile(b, r, big) {
  return el("div", { class: "insignia-tile" + (big ? " big" : "") },
    r.i ? el("img", { src: `images/f-insignia/${r.i}`, alt: insigniaRankAlt(b, r), decoding: "async" })
      : el("span", { class: "insignia-none" }, T("No insignia")));
}

function insigniaRankGuide(b) {
  const info = F_INSIGNIA.ranks[b];
  const sections = INSIGNIA_RANK_KINDS.map(([k, label]) => {
    const rows = info.rows.filter((r) => r.k === k);
    if (!rows.length) return null;
    return [
      el("div", { class: "section-title" }, T(label)),
      el("ul", { class: "insignia-grid", lang: "en" }, rows.map((r) => el("li", { class: "insignia-card" },
        insigniaRankTile(b, r),
        el("div", { class: "insignia-grade mono" }, r.g),
        el("strong", {}, r.t),
        r.a ? el("span", { class: "muted" }, r.a) : null,
        r.n ? el("p", { class: "muted insignia-note" }, r.n) : null))),
    ];
  });
  return el("div", { style: `--hero:${BRANCHES[b].color}` },
    branchChips(b, (x) => `#/ranks/${x}`),
    el("h2", { class: "insignia-branch" }, T("{branch} ranks", { branch: BRANCHES[b].name })),
    sections,
    el("div", { class: "section-title" }, T("Good to know")),
    el("ul", { class: "insignia-notes", lang: "en" }, info.notes.map((n) => el("li", {}, n))),
    el("p", { class: "muted insignia-sources" }, T("Sources: "), info.sources.map((u, i) => [i ? ", " : "", el("a", { href: u, target: "_blank", rel: "noopener" }, new URL(u).hostname.replace(/^www\./, ""))])));
}

function insigniaRankQuestion(pool, rng) {
  const q = pool[Math.floor(rng() * pool.length)];
  const rows = F_INSIGNIA.ranks[q.b].rows;
  // Wrong answers: same branch, different insignia and title, nearest grades first.
  const level = (r) => "ewo".indexOf(r.k) * 20 + Number(r.g.slice(2));
  const others = shuffled(rows.filter((r) => r.i && r.i !== q.r.i && r.t !== q.r.t), rng)
    .sort((x, y) => Math.abs(level(x) - level(q.r)) - Math.abs(level(y) - level(q.r)));
  const picks = [];
  for (const r of others) if (picks.length < 3 && !picks.some((p) => p.t === r.t)) picks.push(r);
  return { b: q.b, r: q.r, choices: shuffled([q.r, ...picks], rng) };
}

function insigniaRankAnswer(r) {
  return `${r.t} (${r.g})`;
}

function insigniaRankGame() {
  const params = route.params;
  const branch = ORDER.includes(params.get("b")) ? params.get("b") : "all";
  const pool = [];
  for (const b of ORDER) {
    if (branch !== "all" && b !== branch) continue;
    const seen = new Set();
    for (const r of F_INSIGNIA.ranks[b].rows) if (r.i && !seen.has(r.i)) { seen.add(r.i); pool.push({ b, r }); }
  }
  return insigniaGame({
    key: "rankedbingo.insignia.ranks.best",
    intro: T("You'll see {n} rank insignia. Pick the rank each one shows.", { n: INSIGNIA_ROUND }),
    filter: el("div", { class: "seg-row" },
      el("span", { class: "seg-label", id: "insignia-filter" }, T("Branch")),
      el("div", { class: "seg", role: "group", "aria-labelledby": "insignia-filter" },
        [["all", T("All")], ...ORDER.map((b) => [b, BRANCHES[b].name])].map(([id, name]) =>
          el("a", { class: "seg-item" + (id === branch ? " active" : ""), href: id === "all" ? "#/ranks/game" : `#/ranks/game?b=${id}`, "aria-current": id === branch ? "true" : null }, name)))),
    makeQuestion: (rng) => insigniaRankQuestion(pool, rng),
    prompt: (q) => [
      el("p", { class: "insignia-q-branch", style: `--hero:${BRANCHES[q.b].color}` }, BRANCHES[q.b].name),
      el("div", { class: "insignia-q-art" }, insigniaRankTile(q.b, q.r, true)),
      el("h2", { class: "insignia-q" }, T("Which rank is this?"))],
    same: (a, q) => a === q.r,
    label: (c) => insigniaRankAnswer(c),
    reveal: (q) => T("It's {answer}.", { answer: `${BRANCHES[q.b].name} ${insigniaRankAnswer(q.r)}` }),
  });
}

function insigniaRenderRanks() {
  withScripts(INSIGNIA_DATA, () => {
    const game = route.parts[0] === "game";
    const b = ORDER.includes(route.parts[0]) ? route.parts[0] : "army";
    app.append(el("div", { class: "fade-in insignia-page" },
      el("div", { class: "eyebrow" }, T("Rank insignia")),
      el("h1", {}, game ? T("Guess the rank") : T("Rank insignia guide")),
      el("p", { class: "muted" }, game
        ? T("Test yourself on the rank insignia of all six branches.")
        : T("Every enlisted, warrant officer and officer rank in each branch, with its pay grade and the insignia it wears.")),
      insigniaTabs("ranks", game),
      LANG !== "en" ? el("p", { class: "muted", style: "font-size:13px" }, T("Rank titles and some details are only available in English.")) : null,
      game ? insigniaRankGame() : insigniaRankGuide(b),
      el("p", { class: "muted insignia-credit" }, T("Insignia images: U.S. government designs (public domain), via Wikimedia Commons. See pay for each grade on "), el("a", { href: `#/pay/${b}` }, T("Ranks & pay")), ".")));
  });
}

// ---------------------------------------------------------------------------
// Ribbons.

const INSIGNIA_SVG_NS = "http://www.w3.org/2000/svg";

function insigniaSvgEl(tag, attrs = {}, ...children) {
  const node = document.createElementNS(INSIGNIA_SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  node.append(...children);
  return node;
}

function insigniaStarPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.4 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

// A ribbon bar: 1 3/8 by 3/8 inch, drawn in 1/64-inch units.
function insigniaRibbonSvg(rb, label) {
  let x = 0;
  const parts = rb.st.map(([w, color]) => {
    const rect = insigniaSvgEl("rect", { x, y: 0, width: w, height: 24, fill: color });
    x += w;
    return rect;
  });
  const stars = (rb.stars || []).map(([cx, cy]) => insigniaSvgEl("polygon", { points: insigniaStarPoints(cx, cy, 3.4), fill: "#fff" }));
  const svg = insigniaSvgEl("svg", { class: "ribbon-svg", viewBox: "0 0 88 24", preserveAspectRatio: "none", role: "img", "aria-label": label },
    insigniaSvgEl("title", {}, label), ...parts, ...stars);
  return svg;
}

function insigniaRibbonGuide() {
  const cat = INSIGNIA_RIBBON_GROUPS.some(([id]) => id === route.params.get("c")) ? route.params.get("c") : null;
  const groups = INSIGNIA_RIBBON_GROUPS.filter(([id]) => !cat || id === cat);
  return el("div", {},
    el("div", { class: "chips", style: "margin:16px 0 4px", role: "group", "aria-label": T("Filter") },
      el("a", { class: "chip chip-btn" + (cat ? "" : " active"), href: "#/ribbons", "aria-current": cat ? null : "true" }, T("All")),
      INSIGNIA_RIBBON_GROUPS.map(([id, name]) => el("a", { class: "chip chip-btn" + (id === cat ? " active" : ""), href: `#/ribbons?c=${id}`, "aria-current": id === cat ? "true" : null }, T(name)))),
    groups.map(([id, name]) => [
      el("div", { class: "section-title" }, T(name)),
      el("ul", { class: "ribbon-list", lang: "en" }, F_INSIGNIA.ribbons.filter((r) => r.c === id).map((r) =>
        el("li", { class: "ribbon-row" },
          insigniaRibbonSvg(r, T("{name} ribbon", { name: r.n })),
          el("div", {},
            el("strong", {}, r.n),
            el("div", { class: "ribbon-branch" }, r.b.split(" ").map(insigniaBranchName).join(" · ")),
            el("p", { class: "ribbon-for" }, r.f),
            el("p", { class: "muted ribbon-prec" }, r.p, " ", el("a", { href: r.src, target: "_blank", rel: "noopener" }, T("Source ↗")))))))]),
    el("p", { class: "muted insignia-credit" }, T("Shown roughly in order of precedence (the order they're worn, highest first). Each branch publishes its own exact order, and some awards have devices like oak leaf clusters, stars or a \"V\" that aren't shown here.")),
    el("p", { class: "muted insignia-credit" }, T("Ribbons are drawn from their official stripe patterns, measured from public-domain drawings on Wikimedia Commons.")));
}

function insigniaRibbonGame() {
  const list = F_INSIGNIA.ribbons;
  return insigniaGame({
    key: "rankedbingo.insignia.ribbons.best",
    intro: T("You'll see {n} ribbons. Pick the award each one stands for.", { n: INSIGNIA_ROUND }),
    filter: null,
    makeQuestion: (rng) => {
      const answer = list[Math.floor(rng() * list.length)];
      // Mix in look-alikes from the same group so it isn't too easy.
      const near = shuffled(list.filter((r) => r !== answer && r.c === answer.c), rng).slice(0, 2);
      const rest = shuffled(list.filter((r) => r !== answer && !near.includes(r)), rng).slice(0, 3 - near.length);
      return { r: answer, choices: shuffled([answer, ...near, ...rest], rng) };
    },
    prompt: (q) => [
      el("div", { class: "insignia-q-art ribbon-q" }, insigniaRibbonSvg(q.r, T("Mystery ribbon"))),
      el("h2", { class: "insignia-q" }, T("Which award is this?"))],
    same: (a, q) => a === q.r,
    label: (c) => c.n,
    reveal: (q) => [T("It's the {name}.", { name: q.r.n }), " ", q.r.f],
  });
}

function insigniaRenderRibbons() {
  withScripts(INSIGNIA_DATA, () => {
    const game = route.parts[0] === "game";
    app.append(el("div", { class: "fade-in insignia-page" },
      el("div", { class: "eyebrow" }, T("Medals & ribbons")),
      el("h1", {}, game ? T("Guess the ribbon") : T("Medal and ribbon guide")),
      el("p", { class: "muted" }, game
        ? T("Each service member's ribbons tell a story. Can you read them?")
        : T("The most common U.S. military decorations and service ribbons: what each one is for and how it ranks.")),
      insigniaTabs("ribbons", game),
      LANG !== "en" ? el("p", { class: "muted", style: "font-size:13px" }, T("Award names and descriptions are only available in English.")) : null,
      game ? insigniaRibbonGame() : insigniaRibbonGuide()));
  });
}

// ---------------------------------------------------------------------------
// Shared multiple-choice game: a round of questions, score and a saved best.

function insigniaGame(opts) {
  const box = el("div", { class: "card insignia-game" });
  let best = loadJson(opts.key, 0);
  let rng, n, score, q, answered;
  // replaceChildren doesn't flatten arrays or skip nulls the way el() does.
  const fill = (node, ...kids) => node.replaceChildren(...kids.flat(Infinity).filter((k) => k != null));

  const intro = () => fill(box,
    opts.filter,
    el("p", { style: "margin-top:16px" }, opts.intro),
    el("p", { class: "muted" }, T("Best score: {best} / {total}", { best, total: INSIGNIA_ROUND })),
    el("div", { class: "actions" }, el("button", { class: "primary", onclick: start }, T("Start"))));

  const start = () => {
    rng = makeRng(Date.now() >>> 0);
    n = 0;
    score = 0;
    ask();
  };

  const ask = () => {
    q = opts.makeQuestion(rng);
    answered = false;
    const feedback = el("div", { class: "insignia-feedback", role: "status", "aria-live": "polite" });
    const next = el("button", { class: "primary", hidden: true, onclick: () => { n += 1; if (n < INSIGNIA_ROUND) ask(); else finish(); } },
      n + 1 < INSIGNIA_ROUND ? T("Next") : T("See score"));
    const buttons = q.choices.map((c, i) => el("button", {
      class: "option",
      onclick: () => {
        if (answered) return;
        answered = true;
        const ok = opts.same(c, q);
        if (ok) score += 1;
        buttons.forEach((btn, j) => {
          btn.disabled = true;
          if (opts.same(q.choices[j], q)) btn.classList.add("insignia-right");
          else if (j === i) btn.classList.add("insignia-wrong");
        });
        fill(feedback, el("strong", {}, ok ? T("Correct!") : T("Not quite.")), " ", opts.reveal(q));
        next.hidden = false;
        next.focus();
      },
    }, el("span", { class: "key" }, "ABCD"[i]), el("span", { lang: "en" }, opts.label(c))));
    fill(box,
      el("div", { class: "progress-row" },
        el("span", {}, T("Question {n} / {total}", { n: n + 1, total: INSIGNIA_ROUND })),
        el("span", {}, T("Score {score}", { score }))),
      el("div", { class: "progress" }, el("div", { style: `width:${(n / INSIGNIA_ROUND) * 100}%` })),
      opts.prompt(q),
      el("div", { class: "options", role: "group", "aria-label": T("Answers") }, buttons),
      feedback,
      el("div", { class: "actions", style: "margin-top:14px" }, next));
  };

  const finish = () => {
    const record = score > best;
    if (record) { best = score; saveJson(opts.key, best); }
    fill(box,
      el("div", { class: "result-hero" },
        el("h2", { style: "margin-bottom:6px" }, T("{score} of {total} right", { score, total: INSIGNIA_ROUND })),
        el("p", { class: "muted", style: "margin:0" }, record ? T("New best score!") : T("Best score: {best} / {total}", { best, total: INSIGNIA_ROUND }))),
      el("div", { class: "actions" },
        el("button", { class: "primary", onclick: start }, T("Play again")),
        el("button", { onclick: intro }, T("Back"))));
  };

  intro();
  return box;
}

registerPage("ranks", {
  render: insigniaRenderRanks,
  title: () => T("Rank insignia"),
  hub: "fun",
  icon: "🎖️",
  blurb: () => T("Every rank's insignia in all six branches, plus a guess-the-rank game."),
});

registerPage("ribbons", {
  render: insigniaRenderRibbons,
  title: () => T("Medals & ribbons"),
  hub: "fun",
  icon: "🏅",
  blurb: () => T("What the most common ribbons mean, and a guess-the-ribbon game."),
});
