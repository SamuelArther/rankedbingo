"use strict";

// Daily question: one trait question from the quiz pool per day, the same for
// everyone (picked from the date), plus which branches lean toward each
// answer and a local streak.

const DAILY_KEY = GAMES_KEY + "daily";

// Days since 1970-01-01 for a local YYYY-MM-DD key.
function dailyNumber(key) {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

// Trait questions only: they're the ones the branch profiles score. The pool
// is shuffled once per cycle so no question repeats until all have been used.
function dailyQuestion(key) {
  const pool = POOL.filter((q) => groupOf(q) === "trait" && !q.always);
  const day = dailyNumber(key);
  const cycle = Math.floor(day / pool.length);
  const order = shuffled(pool, makeRng(hashString(`daily-${cycle}`)));
  const q = order[day % pool.length];
  const display = q.fixed ? q.options.map((_, i) => i) : shuffled(q.options.map((_, i) => i), makeRng(hashString(`daily-${key}`)));
  return { q, display };
}

// How strongly each branch leans toward each option. Like the quiz, an
// option counts relative to the question's other options, then is matched
// against each branch's trait profile.
function dailyLeans(q) {
  const traits = [...new Set(q.options.flatMap((o) => Object.keys(o.w)))];
  const mean = Object.fromEntries(traits.map((t) => [t, q.options.reduce((a, o) => a + (o.w[t] || 0), 0) / q.options.length]));
  return q.options.map((o) => {
    const rel = Object.fromEntries(traits.map((t) => [t, (o.w[t] || 0) - mean[t]]));
    const branches = ORDER.map((b) => ({ id: b, v: traits.reduce((a, t) => a + rel[t] * BRANCHES[b].traits[t], 0) }))
      .sort((a, b) => b.v - a.v);
    const toward = Object.entries(rel).filter(([, v]) => Math.abs(v) >= 0.5).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).map(([t, v]) => phrase(t, v));
    return { branches, toward };
  });
}

function dailyStreak(days) {
  const start = days[gamesDayKey(0)] ? 0 : -1;
  let n = 0;
  while (days[gamesDayKey(start - n)]) n += 1;
  return n;
}

function renderGamesDaily() {
  const today = gamesDayKey(0);
  const data = loadJson(DAILY_KEY, { days: {}, best: 0 });
  data.days ||= {};
  const { q, display } = dailyQuestion(today);
  const leans = dailyLeans(q);
  const answered = data.days[today];
  const holder = el("div", { class: "fade-in" });

  const answer = (idx) => {
    data.days[today] = { q: q.id, a: idx };
    data.best = Math.max(data.best || 0, dailyStreak(data.days));
    // Keep the last 60 days.
    data.days = Object.fromEntries(Object.entries(data.days).sort().slice(-60));
    saveJson(DAILY_KEY, data);
    const streak = dailyStreak(data.days);
    if (streak >= 7) gamesAward("streak7");
    draw(idx);
    if (streak > 1) toast(T("🔥 {n}-day streak!", { n: streak }));
  };

  const draw = (chosen) => {
    const done = chosen != null;
    const streak = dailyStreak(data.days);
    holder.replaceChildren(
      dailyStreakCard(data, streak, done),
      el("div", { class: "card", style: "margin-top:16px" },
        el("div", { class: "progress-row" },
          el("span", {}, T("Daily question")),
          el("span", {}, new Date().toLocaleDateString(document.documentElement.lang || "en", { month: "short", day: "numeric" }))),
        el("div", { class: "eyebrow", style: "margin-top:6px" }, q.topic),
        el("h1", {}, q.q),
        el("div", { class: "options", role: "group", "aria-label": q.q }, display.map((idx, pos) => {
          const o = q.options[idx];
          const lean = leans[idx].branches.filter((b) => b.v > 0.5).slice(0, 3);
          // Once answered, the options become a plain list with the leans.
          return el(done ? "div" : "button", {
            class: "option games-daily-option" + (chosen === idx ? " selected" : ""),
            onclick: done ? null : () => answer(idx),
          }, el("span", { class: "key" }, chosen === idx ? "✓" : String(pos + 1)),
          chosen === idx ? el("span", { class: "games-sr" }, T("Your answer:")) : null,
          el("span", { class: "games-daily-option-text" }, o.t,
            done ? el("span", { class: "games-daily-lean" }, lean.length
              ? lean.map((b) => el("span", { class: "games-daily-lean-chip", style: `--hero:${BRANCHES[b.id].color}` }, gamesBranchDot(b.id), BRANCHES[b.id].name))
              : el("span", { class: "muted" }, T("No branch leans this way"))) : null));
        })),
        done ? dailyExplain(leans[chosen]) : el("p", { class: "muted", style: "margin:14px 0 0; font-size:14px" }, T("Everyone gets the same question today. Answer to see which branches lean your way.")),
      ),
      el("p", { class: "muted", style: "font-size:13px; margin-top:14px; text-align:center" }, T("Your streak is saved in this browser only.")));
  };
  draw(answered ? answered.a : null);
  app.append(holder);
}

function dailyExplain(lean) {
  const yes = lean.branches.filter((b) => b.v > 0.5);
  const no = lean.branches.filter((b) => b.v < -0.5).reverse();
  return el("div", { class: "games-daily-explain fade-in" },
    el("div", { class: "section-title" }, T("Your answer")),
    lean.toward.length ? el("p", {}, T("It leans toward {list}.", { list: joinWords(lean.toward) })) : null,
    yes.length ? el("div", { class: "games-daily-row" }, el("span", { class: "seg-label" }, T("Branches with you")),
      el("div", { class: "chips" }, yes.map((b) => el("span", { class: "chip" }, gamesBranchDot(b.id), BRANCHES[b.id].name)))) : null,
    no.length ? el("div", { class: "games-daily-row" }, el("span", { class: "seg-label" }, T("Leaning the other way")),
      el("div", { class: "chips" }, no.map((b) => el("span", { class: "chip" }, gamesBranchDot(b.id), BRANCHES[b.id].name)))) : null,
    el("p", { class: "muted", style: "font-size:14px; margin-top:12px" }, T("In the full quiz no single answer decides anything; each one nudges your traits and you're matched on the overall pattern.")),
    el("p", { class: "muted", style: "font-size:14px" }, dailyCountdown()),
    el("div", { class: "actions", style: "margin-top:12px" }, el("a", { class: "button primary", href: "#/quiz" }, T("Take the full quiz"))));
}

function dailyCountdown() {
  const now = new Date();
  const mins = Math.ceil((new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now) / 60000);
  return T("Next question in {h}h {m}m.", { h: Math.floor(mins / 60), m: mins % 60 });
}

function dailyStreakCard(data, streak, doneToday) {
  const best = Math.max(data.best || 0, streak);
  const fmt = (offset, opts) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset).toLocaleDateString(document.documentElement.lang || "en", opts);
  };
  const days = [];
  for (let off = -13; off <= 0; off++) {
    const hit = Boolean(data.days[gamesDayKey(off)]);
    days.push(el("li", {
      class: "games-daily-day" + (hit ? " hit" : "") + (off === 0 ? " today" : ""),
      "aria-label": `${fmt(off, { weekday: "long", month: "short", day: "numeric" })}: ${hit ? T("answered") : T("missed")}`,
    },
    el("span", { class: "games-daily-day-wd", "aria-hidden": "true" }, fmt(off, { weekday: "narrow" })),
    el("span", { class: "games-daily-day-mark", "aria-hidden": "true" }, hit ? "🔥" : ""),
    el("span", { class: "games-daily-day-num", "aria-hidden": "true" }, fmt(off, { day: "numeric" }))));
  }
  return el("div", { class: "card games-daily-streak" + (streak ? " lit" : "") },
    el("div", { class: "games-daily-streak-top" },
      el("div", { class: "games-daily-flame", "aria-hidden": "true" }, streak ? "🔥" : "🪵"),
      el("div", {},
        el("div", { class: "eyebrow" }, T("Daily streak")),
        el("div", { class: "games-daily-streak-num" }, streak === 1 ? T("1 day") : T("{n} days", { n: streak })),
        el("div", { class: "muted", style: "font-size:14px" },
          !doneToday && streak ? T("Answer today to keep it going.") : !streak ? T("Answer today to start a streak.") : T("Best: {n}", { n: best })))),
    el("ol", { class: "games-daily-strip", "aria-label": T("Last 14 days") }, days));
}
