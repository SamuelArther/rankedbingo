"use strict";

// Discharges guide: the types of military discharge, what usually leads to
// each, how they're decided, what they mean afterward and how upgrades work.
// The research lives in js/f-discharge-data.js and loads only when opened.

const DISCHARGE_DATA_SRC = "js/f-discharge-data.js";

// Which rung of the explorer is open (kept while the page is re-rendered).
let dischargePick = "honorable";

// ---------------------------------------------------------------------------
// Shared building blocks.

function dischargeDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(LANG === "en" ? "en-US" : LANG, { year: "numeric", month: "long", day: "numeric" });
}

function dischargeHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function dischargeSource(url, label) {
  if (!url) return null;
  return el("p", { class: "discharge-src" }, T("Source:"), " ",
    el("a", { href: url, target: "_blank", rel: "noopener" }, label || dischargeHost(url), " ↗"));
}

function dischargeSources(list) {
  return (list || []).map(([url, label]) => dischargeSource(url, label));
}

function dischargeReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function dischargeScrollTo(node) {
  node.scrollIntoView({ behavior: dischargeReduce() ? "auto" : "smooth", block: "start" });
}

// Turns "text with [[id|a term]]" into text nodes plus glossary buttons.
function dischargeText(str) {
  const out = [];
  const re = /\[\[([\w-]+)\|([^\]]+)\]\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(str.slice(last, m.index));
    out.push(dischargeTermButton(m[1], m[2]));
    last = re.lastIndex;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

function dischargeTermButton(id, words) {
  // A link (not a button) so long terms wrap with the sentence; the default
  // navigation is cancelled so the hash router doesn't re-render the page.
  const link = el("a", {
    href: "#/discharges", class: "discharge-term",
    title: T("See the definition"),
    onclick: (e) => { e.preventDefault(); dischargeOpenTerm(id, link); },
  }, words);
  return link;
}

// Opens a glossary entry, scrolls to it and offers a way back.
function dischargeOpenTerm(id, from) {
  const item = document.getElementById(`discharge-g-${id}`);
  if (!item) return;
  item.open = true;
  const back = item.querySelector(".discharge-back");
  if (back) {
    back.hidden = !from;
    back.onclick = () => {
      back.hidden = true;
      from.scrollIntoView({ behavior: dischargeReduce() ? "auto" : "smooth", block: "center" });
      from.focus({ preventScroll: true });
    };
  }
  item.classList.remove("discharge-flash");
  void item.offsetWidth;
  item.classList.add("discharge-flash");
  dischargeScrollTo(item);
  item.querySelector("summary").focus({ preventScroll: true });
}

function dischargeList(points, mark = "•") {
  return el("ul", { class: "list discharge-points" }, points.map((p) =>
    el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, mark), el("span", {}, dischargeText(p)))));
}

function dischargeSection(id, icon, title, ...children) {
  return el("section", { class: "card discharge-sec fade-in", id: `discharge-${id}`, tabindex: "-1", "aria-labelledby": `discharge-${id}-h` },
    el("h2", { id: `discharge-${id}-h` }, el("span", { class: "discharge-icon", "aria-hidden": "true" }, icon), title),
    ...children);
}

// "On this page" chips (plain #anchors would collide with the hash router).
function dischargeToc(items) {
  return el("nav", { class: "discharge-toc", "aria-label": T("On this page") },
    el("span", { class: "seg-label" }, T("On this page")),
    el("div", { class: "chips" }, items.map(([id, label]) => el("button", {
      type: "button", class: "chip chip-btn",
      onclick: () => {
        const target = document.getElementById(`discharge-${id}`);
        if (!target) return;
        dischargeScrollTo(target);
        target.focus({ preventScroll: true });
      },
    }, label))));
}

const DISCHARGE_MARKS = {
  yes: { icon: "✓", label: () => T("Yes") },
  case: { icon: "⚠️", label: () => T("Case by case") },
  no: { icon: "✗", label: () => T("No") },
};

function dischargeMark(value) {
  const m = DISCHARGE_MARKS[value];
  return el("span", { class: `discharge-mark ${value}` },
    el("span", { "aria-hidden": "true" }, m.icon),
    el("span", { class: "discharge-sr" }, m.label()));
}

// ---------------------------------------------------------------------------
// Sections.

function dischargeBigPicture(D) {
  const B = D.bigPicture;
  return dischargeSection("big", "🧭", T("The big picture"),
    el("p", {}, dischargeText(B.intro)),
    el("div", { class: "discharge-paths" }, B.paths.map((p) => el("div", { class: `discharge-path ${p.id}` },
      el("h3", {}, el("span", { "aria-hidden": "true" }, p.icon, " "), p.title),
      el("p", {}, dischargeText(p.text)),
      el("ul", { class: "discharge-path-list" }, p.items.map((x) => el("li", {}, x)))))),
    dischargeSource(B.source, T("10 U.S.C. § 819 (who can give which discharge)")));
}

function dischargeCourts(courts) {
  return el("div", { class: "discharge-courts" }, courts.map((c, i) => el("div", { class: "discharge-court" },
    el("div", { class: "discharge-court-step", "aria-hidden": "true" }, String(i + 1)),
    el("h4", {}, c.name),
    el("dl", {},
      el("dt", {}, T("Who's on it")), el("dd", {}, c.who),
      el("dt", {}, T("Most it can give")), el("dd", {}, c.max),
      el("dt", {}, T("Discharges")), el("dd", {}, c.discharge)))));
}

function dischargeGlossary(D) {
  const items = D.glossary.map((g) => el("details", { class: "discharge-gl", id: `discharge-g-${g.id}` },
    el("summary", {}, el("strong", {}, g.term)),
    el("div", { class: "discharge-gl-body" },
      el("p", {}, dischargeText(g.text)),
      g.also ? el("p", { class: "muted" }, g.also) : null,
      g.courts ? dischargeCourts(g.courts) : null,
      g.sources ? dischargeSources(g.sources) : dischargeSource(g.source),
      el("button", { type: "button", class: "discharge-back discharge-small", hidden: true }, "↩ ", T("Back to where you were")))));
  const toggle = el("button", { type: "button", class: "discharge-small", "aria-pressed": "false" }, T("Open all"));
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-pressed") !== "true";
    items.forEach((d) => { d.open = open; });
    toggle.setAttribute("aria-pressed", String(open));
    toggle.textContent = open ? T("Close all") : T("Open all");
  });
  return dischargeSection("words", "📖", T("What these words mean"),
    el("p", {}, T("New to all this? Start here. Tap a word to see what it means. Words with a dotted underline elsewhere on this page jump to these definitions.")),
    el("div", { class: "discharge-gl-bar" }, toggle),
    el("div", { class: "discharge-gl-list" }, items));
}

// What a rung keeps or loses, read from the benefits table.
function dischargeKeeps(D, rung) {
  const cols = rung.id === "bcd" ? ["bcd-s", "bcd-g"] : [rung.id];
  const idx = cols.map((c) => D.benefits.cols.findIndex(([id]) => id === c));
  const heads = cols.length > 1 ? D.benefits.cols.filter(([id]) => cols.includes(id)).map(([, short]) => short) : null;
  return el("ul", { class: "discharge-keeps" }, D.benefits.rows.map((r) => el("li", {},
    el("span", { class: "discharge-keeps-marks" }, idx.map((i, j) => el("span", { class: "discharge-keeps-cell" },
      dischargeMark(r.cells[i]),
      heads ? el("span", { class: "discharge-keeps-head" }, heads[j]) : null))),
    el("span", {}, r.label))));
}

function dischargeExplorer(D) {
  const ladder = D.ladder;
  const panel = el("div", { class: "discharge-panel", id: "discharge-panel", "aria-live": "polite" });
  const buttons = ladder.map((r, i) => el("button", {
    type: "button", class: `discharge-rung tone-${r.tone}`, "aria-controls": "discharge-panel",
    onclick: () => { dischargePick = r.id; draw(); },
  }, el("span", { class: "discharge-rung-n", "aria-hidden": "true" }, String(i + 1)), el("span", {}, r.short || r.name)));

  function draw() {
    const r = ladder.find((x) => x.id === dischargePick) || ladder[0];
    buttons.forEach((b, i) => {
      const on = ladder[i].id === r.id;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    panel.className = `discharge-panel tone-${r.tone}`;
    panel.replaceChildren(
      el("div", { class: "discharge-panel-top" },
        el("h3", {}, r.name),
        el("span", { class: `discharge-kind ${r.kind}` }, r.kind === "admin" ? T("Administrative") : T("Court-martial only"))),
      el("p", {}, r.summary),
      el("div", { class: "discharge-who" }, el("strong", {}, T("Who decides:")), " ", dischargeText(r.decidedBy)),
      el("h4", {}, T("What usually leads here")),
      el("ul", { class: "discharge-reasons" }, r.reasons.map(([title, text]) => el("li", {},
        el("strong", {}, title), el("span", {}, dischargeText(text))))),
      el("h4", {}, T("What it means afterward")),
      dischargeKeeps(D, r),
      el("p", { class: "discharge-fine muted" }, T("✓ yes · ⚠️ case by case · ✗ no. Details are in the benefits table below.")),
      el("p", { class: "discharge-dd" }, el("strong", {}, T("On your DD-214:")), " ", r.dd214),
      ...dischargeSources(r.sources));
  }
  draw();

  return dischargeSection("explorer", "🪜", T("Which discharge happens when?"),
    el("p", {}, T("Pick a discharge, from best to worst, to see what usually leads there, who decides, and what you keep or lose.")),
    el("div", { class: "discharge-scale" },
      el("div", { class: "discharge-scale-ends", "aria-hidden": "true" }, el("span", {}, T("Best")), el("span", {}, T("Worst"))),
      el("div", { class: "discharge-rungs", role: "group", "aria-label": T("Discharge types, best to worst") }, buttons)),
    panel);
}

function dischargeOffLadder(D) {
  return el("div", { class: "discharge-off" }, D.offLadder.map((o) =>
    el("section", { class: "card discharge-sec fade-in", id: `discharge-${o.id}-card`, "aria-labelledby": `discharge-${o.id}-card-h` },
      el("h2", { id: `discharge-${o.id}-card-h` }, el("span", { class: "discharge-icon", "aria-hidden": "true" }, o.icon), o.title),
      el("p", {}, dischargeText(o.text)),
      dischargeList(o.points),
      dischargeSources(o.sources))));
}

function dischargeBenefits(D) {
  const B = D.benefits;
  const table = el("div", { class: "discharge-table-wrap", tabindex: "0", role: "region", "aria-label": T("Benefits by discharge type") },
    el("table", { class: "discharge-table" },
      el("caption", { class: "discharge-sr" }, T("What each discharge keeps: yes, case by case, or no")),
      el("thead", {}, el("tr", {},
        el("th", { scope: "col" }, T("Benefit")),
        B.cols.map(([, short, full]) => el("th", { scope: "col" }, el("abbr", { title: full }, short))))),
      el("tbody", {}, B.rows.map((r) => el("tr", {},
        el("th", { scope: "row" }, r.label),
        r.cells.map((c) => el("td", {}, dischargeMark(c))))))));
  return dischargeSection("benefits", "🎖️", T("What you keep and what you lose"),
    el("p", {}, T("The characterization on your DD-214 decides a lot of what comes after. Here's how the big federal benefits line up.")),
    el("dl", { class: "discharge-key" }, B.cols.map(([, short, full]) => [el("dt", {}, short), el("dd", {}, full)])),
    table,
    el("ul", { class: "discharge-notes" }, B.rows.map((r) => el("li", {},
      el("strong", {}, r.label), " ", r.note, " ", el("a", { class: "discharge-src-inline", href: r.source, target: "_blank", rel: "noopener" }, dischargeHost(r.source), " ↗")))),
    el("div", { class: "note discharge-note" },
      el("strong", {}, B.extraTitle), ": ", B.extra, " ", D.crisis,
      dischargeSource(B.extraSource, T("VA: benefits with an OTH discharge"))),
    el("p", {}, B.codUpdate),
    dischargeSource(B.codSource, T("VA: character of discharge")),
    el("h3", {}, B.afterTitle),
    dischargeList(B.after),
    dischargeSources(B.afterSources));
}

function dischargeDecide(D) {
  const X = D.decide;
  const col = (c, cls) => el("div", { class: `discharge-track ${cls}` },
    el("h3", {}, c.title),
    el("ol", { class: "discharge-steps" }, c.steps.map((s) => el("li", {}, dischargeText(s)))),
    dischargeSource(c.source));
  return dischargeSection("decided", "🏛️", T("How it's decided"),
    el("p", {}, T("There are two very different roads out: paperwork through your chain of command, or a criminal trial.")),
    el("div", { class: "discharge-tracks" }, col(X.admin, "admin"), col(X.court, "punitive")),
    el("p", { class: "discharge-officers" }, el("strong", {}, T("Officers:")), " ", X.officers),
    dischargeSource(X.officerSource, T("10 U.S.C. § 1182 (officer boards of inquiry)")));
}

function dischargeRecords(D) {
  const R = D.records;
  return dischargeSection("paperwork", "📄", T("Your DD-214 and RE code"),
    el("p", {}, dischargeText(T("When you leave active duty you get a [[dd214|DD-214]]. It's the paper that proves your service, and it records how you left:"))),
    dischargeList(R.points),
    dischargeSource(R.source, T("Army Regulation 635-200 (June 2025)")),
    dischargeSource(R.archivesSource, T("National Archives: request military records")));
}

function dischargeUpgrades(D) {
  const U = D.upgrades;
  return dischargeSection("upgrades", "⬆️", T("Upgrades: a discharge can be changed"),
    el("p", {}, U.intro),
    el("div", { class: "discharge-boards" }, U.boards.map((b) => el("div", { class: "job discharge-board", style: "--hero:var(--accent)" },
      el("h3", {}, b.name),
      dischargeList(b.points, "→"),
      dischargeSource(b.source)))),
    el("h3", {}, T("Mental health, trauma and \"liberal consideration\"")),
    el("p", {}, U.memosIntro),
    el("ol", { class: "discharge-timeline" }, U.memos.map(([name, date, text, url]) => el("li", {},
      el("div", { class: "discharge-time" }, date),
      el("strong", {}, name),
      el("p", {}, text),
      dischargeSource(url)))),
    el("p", { class: "discharge-fine" }, U.lawNote),
    dischargeSource(U.lawSource),
    el("div", { class: "note discharge-note" },
      U.tool, " ",
      el("a", { href: U.toolUrl, target: "_blank", rel: "noopener" }, T("Open the VA.gov upgrade tool"), " ↗")),
    el("h3", {}, T("Free help")),
    dischargeList(U.help, "✓"),
    dischargeSource(U.helpSource, T("VA: accredited representatives")));
}

function dischargeTips(D) {
  return dischargeSection("tips", "🛡️", T("How to keep an honorable"),
    el("p", {}, T("Nothing here is meant to scare you. These are common ways people get into trouble, and they're all in your control.")),
    el("ul", { class: "discharge-tips" }, D.tips.map(([title, text]) => el("li", {},
      el("strong", {}, title), el("span", {}, text)))),
    dischargeSources(D.tipSources));
}

function dischargeDisclaimer() {
  return el("div", { class: "note discharge-disclaimer", role: "note" },
    el("strong", {}, T("General information, not legal advice.")), " ",
    T("Rules differ by branch (the Coast Guard has its own manual), and they change. If you or someone you love is facing a separation or wants an upgrade, talk to a military legal assistance office, a military defense lawyer, or a veterans service organization."));
}

// ---------------------------------------------------------------------------

function renderDischarges() {
  const first = route.parts && route.parts[0];
  const page = route.page;
  const status = el("p", { class: "muted" }, T("Loading..."));
  app.append(status);
  loadScriptOnce(DISCHARGE_DATA_SRC)
    .then(() => {
      if (route.page !== page) return;
      status.remove();
      const D = window.F_DISCHARGE;
      if (first && D.ladder.some((r) => r.id === first)) dischargePick = first;
      app.append(el("div", { class: "fade-in discharge-page" },
        el("div", { class: "eyebrow" }, T("Learn")),
        el("h1", {}, T("Military discharges explained")),
        el("p", { class: "muted" }, T("Every way out of the military, in plain English: what usually causes each kind of discharge, who decides, and what it means for the rest of your life.")),
        el("p", { class: "discharge-checked" }, T("Checked against official sources on {date}. Rules change, so confirm anything important with the source.", { date: dischargeDate(D.checked) })),
        dischargeDisclaimer(),
        dischargeToc([["big", T("Big picture")], ["words", T("Words")], ["explorer", T("Explorer")], ["benefits", T("Benefits")],
          ["decided", T("How it's decided")], ["paperwork", "DD-214"], ["upgrades", T("Upgrades")], ["tips", T("Tips")]]),
        dischargeBigPicture(D),
        dischargeGlossary(D),
        dischargeExplorer(D),
        dischargeOffLadder(D),
        dischargeBenefits(D),
        dischargeDecide(D),
        dischargeRecords(D),
        dischargeUpgrades(D),
        dischargeTips(D),
        dischargeDisclaimer(),
        el("div", { class: "actions" },
          el("a", { class: "button primary", href: "#/contracts" }, T("Contracts explained")),
          el("a", { class: "button", href: "#/benefits" }, T("Benefits")),
          el("a", { class: "button", href: "#/learn" }, T("More guides")))));
    })
    .catch(() => { status.textContent = T("Couldn't load this page. Check your connection and try again."); });
}

registerPage("discharges", {
  render: renderDischarges,
  title: () => T("Military discharges explained"),
  hub: "learn",
  icon: "📄",
  blurb: () => T("Honorable to dishonorable: what causes each, who decides and what it means."),
});
