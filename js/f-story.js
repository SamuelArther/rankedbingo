"use strict";

// Boot camp story mode: a short choose-your-path story through each branch's
// boot camp. Content lives in js/f-story-data.js (window.F_STORY), loaded only
// on this page. Progress is saved per branch in this browser.

const STORY_KEY = "rankedbingo.story.v1";
const STORY_STATS = [["d", () => T("Discipline")], ["t", () => T("Teamwork")], ["g", () => T("Grit")]];
const STORY_TYPE_MS = 16;
const STORY_TYPE_STEP = 2;

registerPage("story", {
  render: renderStory,
  title: () => T("Boot camp story"),
  hub: "fun",
  icon: "🥾",
  blurb: () => T("Choose your path through boot camp in any branch."),
});

// One timer for the typed-text effect; cleared whenever the view changes.
const storyTyping = { timer: 0, finish: null };

function storyReducedMotion() {
  return reducedMotion();
}

// Saved progress: { [branch]: { step, picks } }, checked against the content.
function storyLoad(b) {
  const all = loadJson(STORY_KEY, {});
  const raw = all && typeof all === "object" ? all[b] : null;
  const scenes = F_STORY[b].scenes;
  const picks = [];
  if (raw && Array.isArray(raw.picks)) {
    for (let i = 0; i < Math.min(raw.picks.length, scenes.length); i++) {
      const p = raw.picks[i];
      if (!Number.isInteger(p) || p < 0 || p >= scenes[i].choices.length) break;
      picks.push(p);
    }
  }
  let step = raw && Number.isInteger(raw.step) ? raw.step : 0;
  step = Math.max(0, Math.min(step, picks.length, scenes.length));
  return { step, picks };
}

function storySave(b, prog) {
  const all = loadJson(STORY_KEY, {});
  const next = all && typeof all === "object" && !Array.isArray(all) ? all : {};
  next[b] = { step: prog.step, picks: prog.picks };
  saveJson(STORY_KEY, next);
}

function storyClear(b) {
  const all = loadJson(STORY_KEY, {});
  if (all && typeof all === "object") {
    delete all[b];
    saveJson(STORY_KEY, all);
  }
}

// Stat totals from the picks, scaled 0-100 against the best possible total
// (50 is where everyone starts).
function storyStats(b, picks) {
  const scenes = F_STORY[b].scenes;
  const out = {};
  for (const [k] of STORY_STATS) {
    const best = scenes.reduce((sum, s) => sum + Math.max(0, ...s.choices.map((c) => c[k] || 0)), 0) || 1;
    const got = picks.reduce((sum, p, i) => sum + (scenes[i].choices[p][k] || 0), 0);
    out[k] = Math.max(0, Math.min(100, Math.round(50 + (50 * got) / best)));
  }
  return out;
}

function storyStatName(k) {
  return STORY_STATS.find(([key]) => key === k)[1]();
}

function renderStory() {
  withScripts(["js/f-story-data.js"], () => {
    const b = ORDER.includes(route.parts[0]) && window.F_STORY[route.parts[0]] ? route.parts[0] : null;
    if (b) storyPlay(b);
    else storyPicker();
  });
}

// ---------------------------------------------------------------------------
// Branch picker.

function storyStatusText(b) {
  const prog = storyLoad(b), total = F_STORY[b].scenes.length;
  if (prog.step >= total) return T("Finished");
  if (prog.picks.length === 0) return T("Not started");
  return T("Scene {n} of {total}", { n: prog.step + 1, total });
}

function storyPicker() {
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, T("Fun")),
    el("h1", {}, T("Boot camp story")),
    el("p", { class: "muted" }, T("Live through boot camp one scene at a time, from the first night to graduation. Your choices shape your Discipline, Teamwork and Grit, and the story follows the real order of each branch's training.")),
    el("div", { class: "grid story-picker" }, ORDER.map((b) => {
      const info = BRANCHES[b], data = F_STORY[b];
      return el("a", { class: "branch-card story-pick", href: `#/story/${b}`, style: `--hero:${info.color}` },
        el("span", { class: "story-pick-branch" }, info.name),
        el("strong", {}, data.camp),
        el("span", { class: "muted" }, T("{n} scenes · {leaders}", { n: data.scenes.length, leaders: data.leaders })),
        el("span", { class: "story-pick-status" }, storyStatusText(b)));
    })),
    el("p", { class: "muted story-small" }, T("A story based on real boot camp structure, simplified. Instructors yell and correct, but hitting or abusing recruits is against the rules in every branch.")),
    el("div", { class: "actions" },
      el("a", { class: "button", href: "#/training" }, T("Boot camp & training")),
      el("a", { class: "button", href: "#/fun" }, T("Back to Fun")))));
}

// ---------------------------------------------------------------------------
// Playing a branch's story.

function storyPlay(b) {
  const root = el("div", { class: "story", style: `--hero:${BRANCHES[b].color}` });
  app.append(root);
  const prog = storyLoad(b);
  storyDraw(root, b, prog, false);
}

function storyStopTyping() {
  clearInterval(storyTyping.timer);
  storyTyping.timer = 0;
  storyTyping.finish = null;
}

// Types `text` into `node` (hidden from screen readers, which get the full
// text from a sibling), then calls `done`. Instant with reduced motion.
function storyType(node, text, animate, done) {
  storyStopTyping();
  if (!animate || storyReducedMotion()) {
    node.textContent = text;
    done();
    return;
  }
  // The untyped rest stays in place but invisible, so the layout (and the
  // Skip button) doesn't move while typing.
  let i = 0;
  const shown = el("span", { class: "story-shown" });
  const rest = el("span", { class: "story-rest" }, text);
  node.replaceChildren(shown, rest);
  node.classList.add("typing");
  const finish = () => {
    storyStopTyping();
    node.textContent = text;
    node.classList.remove("typing");
    done();
  };
  storyTyping.finish = finish;
  storyTyping.timer = setInterval(() => {
    if (!node.isConnected) { storyStopTyping(); return; }
    i += STORY_TYPE_STEP;
    if (i >= text.length) { finish(); return; }
    shown.textContent = text.slice(0, i);
    rest.textContent = text.slice(i);
  }, STORY_TYPE_MS);
}

// A paragraph whose visible copy types out; screen readers read it whole.
function storyTypedPara(text, cls) {
  const typed = el("span", { class: "story-typed", "aria-hidden": "true" });
  const para = el("p", { class: cls }, el("span", { class: "story-sr" }, text), typed);
  return { para, typed };
}

function storyMeters(stats) {
  return el("div", { class: "story-meters" }, STORY_STATS.map(([k, name]) =>
    el("div", { class: "story-meter" },
      el("span", { class: "story-meter-k" }, name()),
      el("span", { class: "story-meter-v" }, String(stats[k])))));
}

function storyDeltas(choice) {
  const items = STORY_STATS.filter(([k]) => choice[k]).map(([k, name]) =>
    el("span", { class: "chip story-delta" + (choice[k] < 0 ? " down" : "") },
      `${choice[k] > 0 ? "+" : "−"}${Math.abs(choice[k])} ${name()}`));
  return items.length ? el("div", { class: "chips story-deltas" }, items) : null;
}

function storyDraw(root, b, prog, animate) {
  storyStopTyping();
  const data = F_STORY[b], total = data.scenes.length;
  root.replaceChildren();
  if (prog.step >= total) {
    storyEnd(root, b, prog, animate);
    return;
  }
  const scene = data.scenes[prog.step];
  const picked = prog.picks[prog.step];
  const go = (next) => { storySave(b, next); storyDraw(root, b, next, true); };

  const heading = el("h1", { class: "story-title", tabindex: "-1" }, scene.title);
  const card = el("div", { class: "card story-card" + (picked == null ? " fade-in" : "") },
    el("div", { class: "progress-row" },
      el("span", {}, T("Scene {n} of {total}", { n: prog.step + 1, total })),
      el("span", { class: "story-week" }, scene.week)),
    el("div", { class: "progress", role: "progressbar", "aria-label": T("Story progress"), "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(prog.step) },
      el("div", { style: `width:${(prog.step / total) * 100}%` })),
    prog.step === 0 && picked == null ? el("p", { class: "story-intro muted" }, data.intro) : null,
    heading);
  root.append(
    el("div", { class: "story-top" },
      el("a", { class: "back-link", href: "#/story" }, T("← All branches")),
      el("span", { class: "story-branch" }, `${BRANCHES[b].name} · ${data.camp}`)),
    card);

  const scenePara = storyTypedPara(scene.text, "story-text");
  card.append(scenePara.para);

  const skip = el("button", { class: "story-skip", onclick: () => storyTyping.finish && storyTyping.finish() }, T("Skip typing"));
  const after = el("div", { class: "story-after", hidden: true });
  card.append(skip, after);
  scenePara.para.addEventListener("click", () => storyTyping.finish && storyTyping.finish());

  const showAfter = () => {
    skip.remove();
    after.hidden = false;
  };

  if (picked == null) {
    after.append(
      el("div", { class: "options story-options", role: "group", "aria-label": T("What do you do?") },
        scene.choices.map((c, i) => el("button", {
          class: "option",
          onclick: () => {
            const picks = prog.picks.slice(0, prog.step);
            picks[prog.step] = i;
            go({ step: prog.step, picks });
          },
        }, el("span", { class: "key", "aria-hidden": "true" }, "ABC"[i]), el("span", {}, c.label)))));
    storyType(scenePara.typed, scene.text, animate, showAfter);
    if (animate) heading.focus({ preventScroll: true });
  } else {
    // The choice was made: show the scene instantly, then type the outcome.
    scenePara.typed.textContent = scene.text;
    skip.remove();
    const choice = scene.choices[picked];
    const outHeading = el("h3", { class: "story-out-title", tabindex: "-1" }, T("What happened"));
    const outPara = storyTypedPara(choice.outcome, "story-out-text");
    const cont = el("div", { class: "story-after", hidden: true },
      storyDeltas(choice),
      el("div", { class: "nav story-nav" },
        el("button", { class: "primary", onclick: () => go({ step: prog.step + 1, picks: prog.picks }) },
          prog.step + 1 >= total ? T("See your results") : T("Continue"))));
    const outSkip = el("button", { class: "story-skip", onclick: () => storyTyping.finish && storyTyping.finish() }, T("Skip typing"));
    const out = el("div", { class: "story-outcome" },
      el("p", { class: "story-chose" }, el("span", { class: "muted" }, T("You chose: ")), choice.label),
      outHeading, outPara.para, outSkip, cont);
    outPara.para.addEventListener("click", () => storyTyping.finish && storyTyping.finish());
    card.append(out);
    after.remove();
    storyType(outPara.typed, choice.outcome, animate, () => { outSkip.remove(); cont.hidden = false; });
    if (animate) {
      outHeading.focus({ preventScroll: true });
      requestAnimationFrame(() => out.scrollIntoView({ block: "nearest" }));
    }
  }

  card.append(
    el("div", { class: "section-title story-stats-title" }, T("Your stats")),
    storyMeters(storyStats(b, prog.picks.slice(0, prog.step + (picked == null ? 0 : 1)))),
    el("div", { class: "story-foot" },
      el("button", { class: "story-restart", onclick: () => { storyClear(b); storyDraw(root, b, { step: 0, picks: [] }, true); } }, T("Start over"))));
  if (animate && picked == null) storyScrollTop(root);
}

// Brings the top of the story back into view when a new scene starts.
function storyScrollTop(root) {
  if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start" });
}

// Title for the end screen from the strongest stat.
function storyArchetype(stats) {
  const vals = STORY_STATS.map(([k]) => stats[k]);
  const top = Math.max(...vals);
  if (vals.filter((v) => v === top).length > 1) return T("The all-rounder");
  const k = STORY_STATS[vals.indexOf(top)][0];
  return k === "d" ? T("The squared-away one") : k === "t" ? T("The team player") : T("The one who never quits");
}

function storyEnd(root, b, prog, animate) {
  const data = F_STORY[b], info = BRANCHES[b];
  const stats = storyStats(b, prog.picks);
  if (animate) toast(T("Story complete: {branch}", { branch: info.name }));
  const heading = el("h1", { tabindex: "-1" }, T("You graduated!"));
  root.append(
    el("div", { class: "story-top" },
      el("a", { class: "back-link", href: "#/story" }, T("← All branches")),
      el("span", { class: "story-branch" }, `${info.name} · ${data.camp}`)),
    el("div", { class: "card story-card fade-in" },
      el("div", { class: "result-hero" },
        el("div", { class: "pct" }, `${info.name} · ${data.camp}`.toUpperCase()),
        heading,
        el("p", { class: "story-archetype" }, storyArchetype(stats))),
      el("div", { class: "section-title" }, T("Your stats")),
      el("div", { class: "bars" }, STORY_STATS.map(([k, name]) => bar(name(), stats[k], "var(--hero)"))),
      el("p", { class: "muted story-small" }, T("Everyone starts at 50. 100 means you made the strongest choice for that stat in every scene.")),
      el("div", { class: "section-title" }, T("Your choices")),
      el("ol", { class: "steps compact story-recap" }, data.scenes.map((s, i) => el("li", {},
        el("strong", {}, s.title),
        el("p", { class: "muted", style: "margin:2px 0 0" }, s.choices[prog.picks[i]].label)))),
      el("div", { class: "section-title" }, T("How it really works")),
      el("div", { class: "note story-facts" },
        el("ul", {}, data.facts.map((f) => el("li", {}, f))),
        el("p", { class: "story-small" }, T("Sources: "), data.source.map((u, i) => [
          i ? ", " : "",
          el("a", { href: u, target: "_blank", rel: "noopener" }, new URL(u).hostname.replace(/^www\./, "")),
        ]))),
      el("div", { class: "actions" },
        el("a", { class: "button primary", href: branchLink(b) }, T("{branch} page", { branch: info.name })),
        el("a", { class: "button", href: "#/training" }, T("Boot camp & training")),
        el("button", { onclick: () => { storyClear(b); storyDraw(root, b, { step: 0, picks: [] }, true); } }, T("Play again")),
        el("a", { class: "button", href: "#/story" }, T("Try another branch")))));
  if (animate) {
    heading.focus({ preventScroll: true });
    storyScrollTop(root);
  }
}
