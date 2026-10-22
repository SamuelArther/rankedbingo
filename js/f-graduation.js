"use strict";

// Boot camp graduation guide: what Family Day and graduation look like in each
// branch, what happens if nobody (or somebody you'd rather not) comes, and a
// checklist for families who attend. The research lives in
// js/f-graduation-data.js and loads only when the page is opened.

const GRAD_DATA_SRC = "js/f-graduation-data.js";
const GRAD_PACK_KEY = "rankedbingo.graduation.packed";

// Which branch tab is open (kept while the page is re-rendered).
let gradPick = "army";

// ---------------------------------------------------------------------------
// Shared building blocks.

function gradDate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(LANG === "en" ? "en-US" : LANG, { year: "numeric", month: "long", day: "numeric" });
}

function gradHost(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function gradSource(url, label) {
  if (!url) return null;
  return el("p", { class: "grad-src" }, T("Source:"), " ",
    el("a", { href: url, target: "_blank", rel: "noopener" }, label || gradHost(url), " ↗"));
}

function gradSources(list) {
  return (list || []).map(([url, label]) => gradSource(url, label));
}

function gradReduce() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function gradColor(id) {
  return (BRANCHES[id] && BRANCHES[id].color) || "var(--accent)";
}

function gradList(points, mark = "•") {
  return el("ul", { class: "list grad-points" }, points.map((p) =>
    el("li", {}, el("span", { class: "mark", "aria-hidden": "true" }, mark), el("span", {}, p))));
}

function gradSection(id, icon, title, ...children) {
  return el("section", { class: "card grad-sec fade-in", id: `grad-${id}`, tabindex: "-1", "aria-labelledby": `grad-${id}-h` },
    el("h2", { id: `grad-${id}-h` }, el("span", { class: "grad-icon", "aria-hidden": "true" }, icon), title),
    ...children);
}

// "On this page" chips (plain #anchors would collide with the hash router).
function gradToc(items) {
  return el("nav", { class: "grad-toc", "aria-label": T("On this page") },
    el("span", { class: "seg-label" }, T("On this page")),
    el("div", { class: "chips" }, items.map(([id, label]) => el("button", {
      type: "button", class: "chip chip-btn",
      onclick: () => {
        const target = document.getElementById(`grad-${id}`);
        if (!target) return;
        target.scrollIntoView({ behavior: gradReduce() ? "auto" : "smooth", block: "start" });
        target.focus({ preventScroll: true });
      },
    }, label))));
}

// ---------------------------------------------------------------------------
// Sections.

function gradSchedule(s) {
  return el("div", { class: "grad-sched" },
    el("h4", {}, s.title),
    el("ol", { class: "grad-days" }, s.days.map(([day, items]) => el("li", {},
      el("div", { class: "grad-day" }, day),
      el("ul", {}, items.map((x) => el("li", {}, x)))))));
}

function gradBranchPanel(b) {
  return [
    el("div", { class: "grad-panel-top" },
      el("h3", {}, b.name),
      el("span", { class: "grad-event" }, b.event)),
    el("p", { class: "grad-where" }, b.where),
    el("dl", { class: "grad-facts" }, b.facts.map(([k, v]) => el("div", {},
      el("dt", {}, k), el("dd", {}, v)))),
    el("h4", { class: "grad-sched-h" }, T("A typical graduation week")),
    el("div", { class: "grad-scheds" }, b.schedules.map(gradSchedule)),
    b.notes.length ? gradList(b.notes, "→") : null,
    el("p", { class: "grad-fine muted" }, T("Times are examples from the official pages and change often. Always check your graduate's welcome letter and the official page.")),
    ...gradSources(b.sources),
  ];
}

function gradBranches(D) {
  const panel = el("div", { class: "grad-panel", id: "grad-panel", "aria-live": "polite" });
  const buttons = D.branches.map((b) => el("button", {
    type: "button", class: "seg-item grad-tab", style: `--hero:${gradColor(b.color)}`, "aria-controls": "grad-panel",
    onclick: () => { gradPick = b.id; draw(); },
  }, b.name));

  function draw() {
    const b = D.branches.find((x) => x.id === gradPick) || D.branches[0];
    buttons.forEach((btn, i) => {
      const on = D.branches[i].id === b.id;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
    panel.style.setProperty("--hero", gradColor(b.color));
    panel.replaceChildren(...gradBranchPanel(b));
  }
  draw();

  return gradSection("branches", "🎓", T("What graduation looks like, branch by branch"),
    el("p", {}, T("Every boot camp ends with a graduation ceremony, and most add a family day or a few events around it. This is usually the first time families see their recruit in weeks.")),
    gradGlance(D),
    el("div", { class: "seg grad-tabs", role: "group", "aria-label": T("Choose a branch") }, buttons),
    panel);
}

function gradGlance(D) {
  const name = (id) => D.branches.find((b) => b.id === id).name;
  return el("div", { class: "grad-table-wrap", tabindex: "0", role: "region", "aria-label": T("Graduation at a glance") },
    el("table", { class: "grad-table" },
      el("caption", { class: "grad-sr" }, T("Graduation at a glance, by branch")),
      el("thead", {}, el("tr", {},
        el("th", { scope: "col" }, T("Branch")),
        el("th", { scope: "col" }, T("The big days")),
        el("th", { scope: "col" }, T("Off base with family?")),
        el("th", { scope: "col" }, T("Watch online")),
        el("th", { scope: "col" }, T("Guests")))),
      el("tbody", {}, D.glance.map((g) => el("tr", { style: `--hero:${gradColor(g.id)}` },
        el("th", { scope: "row" }, name(g.id)),
        el("td", {}, g.days), el("td", {}, g.out), el("td", {}, g.watch), el("td", {}, g.guests))))));
}

function gradNobody(D) {
  const N = D.nobody;
  const name = (id) => D.branches.find((b) => b.id === id).name;
  return gradSection("nobody", "🤝", T("What if nobody can come?"),
    el("p", {}, N.intro),
    gradList(N.points, "✓"),
    el("h3", {}, T("Watching from far away")),
    el("ul", { class: "grad-streams" }, N.streams.map(([id, text]) => el("li", { style: `--hero:${gradColor(id)}` },
      el("strong", {}, name(id)), el("span", {}, text)))),
    el("p", { class: "grad-fine" }, N.streamTip),
    el("h3", {}, T("Letters during training")),
    el("p", {}, N.lettersIntro),
    el("div", { class: "grad-mail" }, N.mail.map((m) => el("details", { class: "grad-mail-item", style: `--hero:${gradColor(m.id)}` },
      el("summary", {}, el("strong", {}, name(m.id))),
      el("div", { class: "grad-mail-body" }, gradList(m.points), gradSource(m.source))))),
    el("h3", {}, T("Ideas for family who can't travel")),
    gradList(N.family, "♥"),
    el("div", { class: "note grad-note" }, N.emergency, " ",
      el("a", { href: N.emergencySource, target: "_blank", rel: "noopener" }, T("Red Cross emergency messages"), " ↗")));
}

function gradChoice(D) {
  const C = D.choice;
  return gradSection("choice", "🔒", T("What if I don't want my family there?"),
    el("p", {}, C.intro),
    el("ul", { class: "grad-choice" }, C.points.map(([title, text]) => el("li", {},
      el("strong", {}, title), el("span", {}, text)))),
    ...gradSources(C.privacySources),
    el("p", { class: "grad-worried" }, C.worried),
    el("h3", {}, T("Confidential people to talk to")),
    el("p", {}, C.talkIntro),
    el("div", { class: "grad-talk" }, C.talk.map((t) => el("div", { class: "grad-talk-card" },
      el("h4", {}, el("span", { "aria-hidden": "true" }, t.icon, " "), t.name),
      el("p", {}, t.text),
      ...gradSources(t.sources)))));
}

// The "what to bring" list doubles as a checklist saved in this browser.
function gradChecklist(items) {
  const saved = loadJson(GRAD_PACK_KEY, []);
  const done = new Set(Array.isArray(saved) ? saved : []);
  const count = el("p", { class: "grad-count", "aria-live": "polite" });
  const update = () => { count.textContent = T("{n} of {total} packed", { n: done.size, total: items.length }); };
  const list = el("ul", { class: "grad-check" }, items.map((text, i) => {
    const id = `grad-pack-${i}`;
    const box = el("input", { type: "checkbox", id, checked: done.has(i) });
    box.addEventListener("change", () => {
      if (box.checked) done.add(i); else done.delete(i);
      saveJson(GRAD_PACK_KEY, [...done]);
      update();
    });
    return el("li", {}, box, el("label", { for: id }, text));
  }));
  // Drop indexes that no longer exist if the list changed.
  [...done].forEach((i) => { if (i >= items.length) done.delete(i); });
  update();
  return [list, count];
}

function gradFamilies(D) {
  const F = D.families;
  return gradSection("families", "🧳", T("For families attending"),
    el("p", {}, T("Graduation is a formal military ceremony on a working base, so there are more rules than at a school graduation. Here's what applies almost everywhere, and where the branches differ.")),
    el("h3", {}, T("What to bring")),
    gradChecklist(F.bring),
    el("h3", {}, T("What to leave at home")),
    gradList(F.dont, "✗"),
    el("h3", {}, T("Where the branches differ")),
    el("dl", { class: "grad-differs" }, F.differs.map(([k, v]) => el("div", {}, el("dt", {}, k), el("dd", {}, v)))),
    el("h3", {}, T("On the day")),
    gradList(F.early, "→"),
    el("p", { class: "grad-fine muted" }, T("For each branch's day-by-day schedule, see the branch tabs above.")),
    ...gradSources(F.sources));
}

// ---------------------------------------------------------------------------

function renderGraduation() {
  const first = route.parts && route.parts[0];
  withScripts([GRAD_DATA_SRC], () => {
    const D = window.F_GRADUATION;
    if (first && D.branches.some((b) => b.id === first)) gradPick = first;
    if (first === "sf") gradPick = "af";
    app.append(el("div", { class: "fade-in grad-page" },
      el("div", { class: "eyebrow" }, T("Learn")),
      el("h1", {}, T("Boot camp graduation & family day")),
      el("p", { class: "muted" }, T("What happens at the end of boot camp in each branch, how much time families get, and what to do if nobody comes or you'd rather keep it small.")),
      el("p", { class: "grad-checked" }, T("Checked against official sources on {date}. Schedules change often and vary by unit, so confirm with the official page before you travel.", { date: gradDate(D.checked) })),
      gradToc([["branches", T("By branch")], ["nobody", T("If nobody can come")], ["choice", T("Your choice")], ["families", T("For families")]]),
      gradBranches(D),
      gradNobody(D),
      gradChoice(D),
      gradFamilies(D),
      el("section", { class: "card grad-sec grad-more", "aria-labelledby": "grad-more-h" },
        el("h2", { id: "grad-more-h" }, el("span", { class: "grad-icon", "aria-hidden": "true" }, "🧭"), T("Keep reading")),
        el("div", { class: "actions" },
          el("a", { class: "button primary", href: "#/training" }, T("Training by branch")),
          el("a", { class: "button", href: "#/story" }, T("Boot camp story")),
          el("a", { class: "button", href: "#/parents" }, T("For parents and families")),
          el("a", { class: "button", href: "#/meps" }, T("MEPS, step by step")),
          el("a", { class: "button", href: "#/learn" }, T("More guides"))))));
  });
}

registerPage("graduation", {
  render: renderGraduation,
  title: () => T("Boot camp graduation & family day"),
  hub: "learn",
  icon: "🎓",
  blurb: () => T("Family day, graduation and liberty in each branch, plus what to do if nobody can come."),
});
