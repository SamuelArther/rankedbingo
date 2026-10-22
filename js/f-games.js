"use strict";

// Games on the Fun hub: military time trainer, Morse code, guess a friend's
// branch and the daily question. Each page's code loads only when it's
// opened (js/f-games-<page>.js); this file registers the pages and holds the
// helpers they share.

const GAMES_KEY = "rankedbingo.games.";

// Awards a badge only if it's defined in BADGES (extras.js).
function gamesAward(id) {
  if (BADGES.some((b) => b.id === id)) award(id);
}

// Local calendar date as YYYY-MM-DD, `offset` days from today.
function gamesDayKey(offset = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function gamesReducedMotion() {
  return reducedMotion();
}

// Copies text, falling back to selecting it in `input` if the clipboard
// isn't available (older browsers, file:// pages).
async function gamesCopy(text, input) {
  try {
    await navigator.clipboard.writeText(text);
    toast(T("Copied"));
  } catch {
    if (input) { input.focus(); input.select(); }
    toast(T("Couldn't copy. The link is selected, so copy it from there."));
  }
}

// A countdown that keeps going while `node` is on the page. `penalty(s)`
// takes seconds off. Calls onTick(secondsLeft, fraction) and onDone().
function gamesCountdown(node, seconds, onTick, onDone) {
  let end = performance.now() + seconds * 1000;
  let stopped = false;
  const timer = setInterval(() => {
    if (stopped) return;
    if (!node.isConnected) { stop(); return; }
    const left = Math.max(0, end - performance.now());
    onTick(Math.ceil(left / 1000), left / (seconds * 1000));
    if (left <= 0) { stop(); onDone(); }
  }, 100);
  function stop() { stopped = true; clearInterval(timer); }
  onTick(seconds, 1);
  return { stop, penalty: (s) => { end -= s * 1000; } };
}

// Timer bar plus a live score line for the 60-second games.
function gamesHud() {
  const fill = el("div", { class: "games-timer-fill" });
  const time = el("span", {}, "");
  const score = el("span", {}, "");
  const node = el("div", { class: "games-hud" },
    el("div", { class: "progress-row", style: "margin-bottom:8px" }, time, score),
    el("div", { class: "games-timer", "aria-hidden": "true" }, fill));
  return {
    node,
    tick: (s, frac) => {
      time.textContent = T("{seconds}s left", { seconds: s });
      fill.style.width = `${frac * 100}%`;
      node.classList.toggle("low", s <= 10);
    },
    setScore: (n) => { score.textContent = T("Score {score}", { score: n }); },
  };
}

// End-of-game panel. Saves a new best under `bestKey`.
function gamesOver({ score, bestKey, detail, onAgain, onBack }) {
  const best = loadJson(bestKey, 0);
  const isBest = score > best;
  if (isBest) saveJson(bestKey, score);
  return el("div", { class: "games-over fade-in" },
    el("div", { class: "games-over-score" }, String(score)),
    el("p", { class: "games-over-label" }, isBest && score > 0 ? T("New best! 🔥") : T("Best: {best}", { best: Math.max(best, score) })),
    detail ? el("p", { class: "muted" }, detail) : null,
    el("div", { class: "actions", style: "justify-content:center; margin-top:14px" },
      el("button", { class: "primary", onclick: onAgain }, T("Play again")),
      onBack ? el("button", { onclick: onBack }, T("Back")) : null));
}

function gamesBranchDot(b) {
  return el("span", { class: "dot", style: `background:${BRANCHES[b].color}` });
}

// Pages. Each loads its own script the first time it's opened.
registerPage("time", {
  render: () => withScripts(["js/f-games-time.js"], () => renderGamesTime()),
  title: () => T("Military time"),
  hub: "fun",
  icon: "🕐",
  blurb: () => T("Learn 24-hour time, then race the clock."),
});

registerPage("morse", {
  render: () => withScripts(["js/f-games-morse.js"], () => renderGamesMorse()),
  title: () => T("Morse code"),
  hub: "fun",
  icon: "📡",
  blurb: () => T("Translate, listen, and decode against the clock."),
});

registerPage("predict", {
  render: () => withScripts(["js/f-games-predict.js"], () => renderGamesPredict()),
  title: () => T("Guess your friend's branch"),
  hub: "fun",
  icon: "🔮",
  blurb: () => T("Seal a prediction, send it, and see if you called it."),
});

registerPage("daily", {
  render: () => withScripts(["js/f-games-daily.js"], () => renderGamesDaily()),
  title: () => T("Daily question"),
  hub: "fun",
  icon: "🔥",
  blurb: () => T("One question a day. See which branches agree and keep your streak."),
});
