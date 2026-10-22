"use strict";

// Military (24-hour) time: a short explainer, a converter and a 60-second
// game in both directions.

const TIME_BEST_KEY = GAMES_KEY + "time.best";
const TIME_ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TIME_TENS = ["", "", "twenty", "thirty", "forty", "fifty"];

function timeWords(n) {
  if (n < 20) return TIME_ONES[n];
  return TIME_TENS[Math.floor(n / 10)] + (n % 10 ? "-" + TIME_ONES[n % 10] : "");
}

// "0800" -> "zero eight hundred", "1745" -> "seventeen forty-five" (English).
function timeSpoken(h, m) {
  const hour = h === 0 ? "zero zero" : h < 10 ? `zero ${TIME_ONES[h]}` : timeWords(h);
  if (m === 0) return h === 0 ? "zero hundred" : `${hour} hundred`;
  return `${hour} ${m < 10 ? `zero ${TIME_ONES[m]}` : timeWords(m)}`;
}

function timeMilitary(h, m) {
  return String(h).padStart(2, "0") + String(m).padStart(2, "0");
}

function timeRegular(h, m) {
  const clock = `${h % 12 || 12}:${String(m).padStart(2, "0")}`;
  return h < 12 ? T("{time} AM", { time: clock }) : T("{time} PM", { time: clock });
}

function renderGamesTime() {
  const examples = [[8, 0], [17, 45], [12, 0], [0, 0], [13, 5], [21, 30]];
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "card" },
      el("div", { class: "eyebrow" }, T("Military time")),
      el("h1", {}, T("Read the clock like the military")),
      el("p", { class: "muted" }, T("The military uses the 24-hour clock so there's never any mix-up between morning and evening. Once it clicks, it's faster than AM and PM.")),
      el("ol", { class: "steps compact" },
        el("li", {}, T("Four digits, no colon. The first two are the hour (00 to 23), the last two are the minutes.")),
        el("li", {}, T("Before noon it's almost the same: 7:30 AM is 0730.")),
        el("li", {}, T("After noon, add 12 to the hour: 5:45 PM is 1745.")),
        el("li", {}, T("Going back, subtract 12 from any hour above 12: 2100 is 9:00 PM.")),
        el("li", {}, T("Midnight is 0000 and noon is 1200. No AM or PM needed."))),
      el("div", { class: "note", style: "margin-top:16px" },
        el("strong", {}, T("Common trap: ")), T("don't just drop the 1. 1745 is 5:45 PM, not 7:45 PM.")),
      el("div", { class: "section-title" }, T("How to say it")),
      el("div", { class: "games-time-say" }, examples.map(([h, m]) => el("div", { class: "games-time-say-row" },
        el("span", { class: "games-time-digits" }, timeMilitary(h, m)),
        el("span", { lang: "en" }, `“${timeSpoken(h, m)}”`),
        el("span", { class: "muted" }, timeRegular(h, m))))),
      el("p", { class: "muted", style: "font-size:14px; margin-top:12px" },
        T("Hours under 10 start with \"zero\" (some people say \"oh\"), and you'll sometimes hear \"hours\" on the end, as in \"seventeen hundred hours.\"")),
      timeConverter()),
    el("div", { class: "card", style: "margin-top:16px" },
      el("div", { class: "eyebrow" }, T("60-second challenge")),
      el("h2", { style: "margin-bottom:10px" }, T("Beat the clock")),
      timeGame())));
}

// Pick any time and see it in military time.
function timeConverter() {
  const now = new Date();
  const input = el("input", { class: "text-input games-time-input", type: "time", id: "games-time-pick", value: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` });
  const out = el("div", { class: "games-time-convert-out" });
  const draw = () => {
    const [h, m] = (input.value || "00:00").split(":").map(Number);
    out.replaceChildren(
      el("span", { class: "games-time-digits big" }, timeMilitary(h, m)),
      el("span", { lang: "en" }, `“${timeSpoken(h, m)}”`));
  };
  input.addEventListener("input", draw);
  draw();
  return el("div", { class: "games-time-convert" },
    el("label", { class: "seg-label", for: "games-time-pick" }, T("Try any time")),
    el("div", { class: "games-time-convert-row" }, input, out));
}

function timeRandom() {
  const h = Math.floor(Math.random() * 24);
  const m = Math.random() < 0.7 ? Math.floor(Math.random() * 12) * 5 : Math.floor(Math.random() * 60);
  return [h, m];
}

// Three wrong answers built from the mistakes people actually make.
function timeDistractors(h, m) {
  const key = (x) => x[0] * 60 + x[1];
  const cands = [
    [(h + 12) % 24, m], // AM/PM mix-up
    [(h + 2) % 24, m], // "drop the 1" (1745 read as 7:45 PM)
    [(h + 22) % 24, m],
    [(h + 1) % 24, m],
    [(h + 23) % 24, m],
    [h, (m + 15) % 60],
    [h, (m + 30) % 60],
    [(h + 10) % 24, m],
  ];
  const swapped = Number(String(m).padStart(2, "0").split("").reverse().join(""));
  if (swapped < 60 && swapped !== m) cands.push([h, swapped]);
  const seen = new Set([key([h, m])]);
  const out = [];
  for (const c of shuffled(cands, Math.random)) {
    if (seen.has(key(c))) continue;
    seen.add(key(c));
    out.push(c);
    if (out.length === 3) break;
  }
  return out;
}

function timeGame() {
  const box = el("div", { class: "games-box" });
  const idle = () => {
    const best = loadJson(TIME_BEST_KEY, 0);
    box.replaceChildren(
      el("p", { class: "muted", style: "margin-top:0" }, T("You'll see a military time and pick the regular time, or the other way around. Right answers score a point; wrong ones cost 3 seconds. You can also press 1 to 4.")),
      el("p", {}, el("strong", {}, T("Best: {best}", { best }))),
      el("div", { class: "actions", style: "margin-top:8px" }, el("button", { class: "primary", onclick: play }, T("Start"))));
  };
  const play = () => {
    let score = 0, tries = 0, locked = false, over = false;
    const hud = gamesHud();
    const prompt = el("div", { class: "games-time-prompt" });
    const sub = el("div", { class: "games-time-prompt-sub" });
    const choices = el("div", { class: "games-choices", role: "group", "aria-label": T("Answers") });
    const feedback = el("div", { class: "games-feedback", role: "status" });
    let buttons = [];
    const round = () => {
      locked = false;
      const [h, m] = timeRandom();
      const toRegular = Math.random() < 0.5;
      const show = (x) => (toRegular ? timeRegular(x[0], x[1]) : timeMilitary(x[0], x[1]));
      prompt.textContent = toRegular ? timeMilitary(h, m) : timeRegular(h, m);
      prompt.classList.toggle("games-mono", toRegular);
      sub.textContent = toRegular ? T("What's that in regular time?") : T("What's that in military time?");
      const opts = shuffled([[h, m], ...timeDistractors(h, m)], Math.random);
      buttons = opts.map((x, i) => {
        const right = x[0] === h && x[1] === m;
        const b = el("button", { class: "option games-choice" + (toRegular ? "" : " games-mono"), "data-right": right ? "1" : null, onclick: () => pick(b, right) },
          el("span", { class: "key" }, String(i + 1)), el("span", {}, show(x)));
        return b;
      });
      choices.replaceChildren(...buttons);
    };
    const pick = (b, right) => {
      if (locked || over) return;
      locked = true;
      tries += 1;
      if (right) {
        score += 1;
        hud.setScore(score);
        b.classList.add("right");
        feedback.textContent = T("Correct!");
        setTimeout(() => { if (!over) round(); }, 280);
      } else {
        clock.penalty(3);
        b.classList.add("wrong");
        const good = buttons.find((x) => x.dataset.right);
        good.classList.add("right");
        feedback.textContent = T("Not quite: it was {answer}. −3 seconds.", { answer: good.lastChild.textContent });
        setTimeout(() => { if (!over) round(); }, 900);
      }
    };
    const onKey = (e) => {
      if (!box.isConnected || over) { document.removeEventListener("keydown", onKey); return; }
      const n = Number(e.key);
      if (n >= 1 && n <= buttons.length) buttons[n - 1].click();
    };
    document.addEventListener("keydown", onKey);
    box.replaceChildren(hud.node, prompt, sub, choices, feedback);
    hud.setScore(0);
    round();
    buttons[0].focus({ preventScroll: true });
    const clock = gamesCountdown(box, 60, hud.tick, () => {
      over = true;
      document.removeEventListener("keydown", onKey);
      box.replaceChildren(gamesOver({
        score, bestKey: TIME_BEST_KEY,
        detail: T("{right} right out of {tries} tries.", { right: score, tries }),
        onAgain: play, onBack: idle,
      }));
      if (score >= 20) gamesAward("clockwork");
    });
  };
  idle();
  return box;
}
