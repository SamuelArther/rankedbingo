"use strict";

// Morse code: a two-way translator with optional audio, a reference chart, a
// 60-second decoding game and a short history.

// International Morse Code (ITU-R M.1677-1): letters, digits and the
// punctuation in the ITU table.
const MORSE = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.", 0: "-----",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  ":": "---...", "=": "-...-", "+": ".-.-.", "-": "-....-", "\"": ".-..-.", "@": ".--.-.",
};
const MORSE_BACK = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
const MORSE_BEST_KEY = GAMES_KEY + "morse.best";
const MORSE_WPM_KEY = GAMES_KEY + "morse.wpm";

// Game words, easiest first. Short, common and mostly military flavored.
const MORSE_WORDS = [
  ["SOS", "GO", "AIR", "SEA", "SUB", "FLY", "RUN", "AIM", "MAP", "HAT", "OPS", "TEN", "SIX", "YES", "NO", "HI"],
  ["ARMY", "NAVY", "SHIP", "BASE", "FLAG", "CREW", "DUTY", "RANK", "BOOT", "TANK", "PORT", "WING", "STAR", "RUCK", "CHOW", "JEEP", "MESS"],
  ["RADIO", "ROGER", "MARINE", "GUARD", "SPACE", "ORBIT", "BRAVO", "CADET", "MEDIC", "SQUAD", "PILOT", "ANCHOR", "RESCUE", "SIGNAL", "COPY", "OVER"],
];

const MORSE_HISTORY = [
  { text: "In the late 1830s and 1840s, Samuel Morse and Alfred Vail worked out a code for the electric telegraph. The first official message, \"What hath God wrought,\" went over the new line between Washington, D.C., and Baltimore on May 24, 1844.", source: "https://en.wikipedia.org/wiki/What_hath_God_wrought" },
  { text: "The version used worldwide today, International Morse Code, grew out of Friedrich Gerke's 1848 changes and was standardized at a telegraph conference in Paris in 1865.", source: "https://en.wikipedia.org/wiki/Morse_code" },
  { text: "SOS (··· −−− ···) became the international distress signal under a radio treaty signed in Berlin in 1906 that took effect in 1908. It wasn't an abbreviation; \"save our souls\" came later.", source: "https://en.wikipedia.org/wiki/SOS" },
  { text: "Ships relied on Morse for distress calls until 1999, when the satellite-based Global Maritime Distress and Safety System (GMDSS) replaced it.", source: "https://en.wikipedia.org/wiki/Morse_code" },
  { text: "In 1966, Navy pilot Jeremiah Denton, a prisoner of war in North Vietnam, blinked T-O-R-T-U-R-E in Morse during a forced TV press conference. It was the first confirmation to U.S. Naval Intelligence that American POWs were being tortured.", source: "https://en.wikipedia.org/wiki/Jeremiah_Denton" },
  { text: "Navies still flash Morse with signal lamps when ships need to keep radio silent.", source: "https://en.wikipedia.org/wiki/Signal_lamp" },
];

// Text -> Morse. Letters are separated by spaces and words by " / ".
function morseEncode(text) {
  let skipped = 0;
  const words = text.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase()
    .replace(/[“”]/g, "\"").replace(/[‘’]/g, "'").trim().split(/\s+/).filter(Boolean);
  const out = words.map((w) => [...w].map((c) => {
    if (MORSE[c]) return MORSE[c];
    skipped += 1;
    return null;
  }).filter(Boolean).join(" ")).filter(Boolean);
  return { code: out.join(" / "), skipped };
}

// Morse -> text. Accepts . and - plus the dot and dash look-alikes people
// paste; letters split on spaces, words on "/" or "|".
function morseNormalize(code) {
  return code.replace(/[·•∙⋅]/g, ".").replace(/[−–—_]/g, "-").replace(/\|/g, "/");
}

function morseDecode(code) {
  return morseNormalize(code).trim().split(/\s*\/\s*|\s{3,}/).map((w) =>
    w.trim().split(/\s+/).filter(Boolean).map((l) => MORSE_BACK[l] || "#").join("")).filter(Boolean).join(" ");
}

function morseIsCode(s) {
  return /^[\s.\-·•∙⋅−–—_/|]*$/.test(s);
}

// Morse drawn as dots and dashes, grouped by letter.
function morseVisual(code, big = false) {
  const say = { ".": T("dot"), "-": T("dash") };
  return el("div", { class: "games-morse-visual" + (big ? " big" : ""), role: "img", "aria-label": code.split(" ").map((l) => [...l].map((c) => say[c]).join(" ")).join(", ") },
    code.split(" ").map((l) => el("span", { class: "games-morse-letter" },
      [...l].map((c) => el("span", { class: c === "." ? "games-morse-dit" : "games-morse-dah" })))));
}

// ---------------------------------------------------------------------------
// Audio: a 600 Hz tone, timed by the standard ratios (dot 1 unit, dash 3,
// gaps 1 / 3 / 7). One unit is 1.2 / WPM seconds (the PARIS standard).

const morseAudio = { ctx: null, osc: null, timers: [], lamps: [], onStop: null };

// Leaving the page stops any sound.
window.addEventListener("hashchange", () => morseStop());

function morseStop() {
  morseAudio.timers.forEach(clearTimeout);
  morseAudio.timers = [];
  if (morseAudio.osc) {
    try { morseAudio.osc.stop(); } catch { /* already stopped */ }
    morseAudio.osc = null;
  }
  morseAudio.lamps.forEach((l) => l.classList.remove("on"));
  const done = morseAudio.onStop;
  morseAudio.onStop = null;
  if (done) done();
}

function morsePlay(code, wpm, lamp, onStop) {
  morseStop();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) { toast(T("Sound isn't supported in this browser.")); return false; }
  const words = morseNormalize(code).trim().split(/\s*\/\s*/).map((w) => w.split(/\s+/).filter((l) => /^[.-]+$/.test(l))).filter((w) => w.length);
  if (!words.length) return false;
  morseAudio.ctx ||= new Ctx();
  const ctx = morseAudio.ctx;
  ctx.resume();
  const unit = 1.2 / wpm, ramp = 0.006, level = 0.2;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0, ctx.currentTime);
  osc.connect(gain).connect(ctx.destination);
  const start = ctx.currentTime + 0.08;
  let t = start;
  const lampOn = lamp && !gamesReducedMotion();
  words.forEach((w, wi) => {
    w.forEach((l, li) => {
      [...l].forEach((c, ci) => {
        const len = c === "." ? unit : unit * 3;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(level, t + ramp);
        gain.gain.setValueAtTime(level, t + len - ramp);
        gain.gain.linearRampToValueAtTime(0, t + len);
        if (lampOn) {
          const at = (t - ctx.currentTime) * 1000;
          morseAudio.timers.push(setTimeout(() => lamp.classList.add("on"), at), setTimeout(() => lamp.classList.remove("on"), at + len * 1000));
        }
        t += len;
        if (ci < l.length - 1) t += unit;
      });
      if (li < w.length - 1) t += unit * 3;
    });
    if (wi < words.length - 1) t += unit * 7;
  });
  osc.start(start);
  osc.stop(t + 0.05);
  morseAudio.osc = osc;
  if (lamp) morseAudio.lamps = [lamp];
  morseAudio.onStop = onStop;
  morseAudio.timers.push(setTimeout(() => { morseAudio.osc = null; morseStop(); }, (t - ctx.currentTime) * 1000 + 100));
  return true;
}

function morseWpm() {
  return Math.min(30, Math.max(5, Number(loadJson(MORSE_WPM_KEY, 15)) || 15));
}

function morseSpeedControl(onChange) {
  const label = el("label", { class: "seg-label", for: "games-morse-wpm" });
  const range = el("input", { type: "range", id: "games-morse-wpm", class: "games-morse-range", min: "5", max: "30", step: "1", value: String(morseWpm()) });
  const draw = () => { label.textContent = T("Sound speed: {wpm} words per minute", { wpm: range.value }); };
  range.addEventListener("input", () => { saveJson(MORSE_WPM_KEY, Number(range.value)); draw(); if (onChange) onChange(); });
  draw();
  return el("div", { class: "games-morse-speed" }, label, range);
}

// ---------------------------------------------------------------------------

function renderGamesMorse() {
  app.append(el("div", { class: "fade-in" },
    el("div", { class: "card" },
      el("div", { class: "eyebrow" }, T("Morse code")),
      el("h1", {}, T("Dots, dashes and a lot of history")),
      el("p", { class: "muted" }, T("Type a message to turn it into Morse, or paste dots and dashes to read them. Hit play to hear it.")),
      morseTranslator()),
    el("div", { class: "card", style: "margin-top:16px" },
      el("div", { class: "eyebrow" }, T("60-second challenge")),
      el("h2", { style: "margin-bottom:10px" }, T("Decode the word")),
      morseGame()),
    el("div", { class: "card", style: "margin-top:16px" },
      el("div", { class: "section-title", style: "margin-top:0" }, T("The alphabet")),
      morseChart(),
      el("div", { class: "section-title" }, T("A little history")),
      el("ul", { class: "list good", lang: "en" }, MORSE_HISTORY.map((h) => el("li", {},
        el("span", { class: "mark", "aria-hidden": "true" }, "▸"),
        el("span", {}, h.text, " ", el("a", { href: h.source, target: "_blank", rel: "noopener", class: "games-morse-src" }, T("Source ↗")))))),
      el("p", { class: "muted", style: "font-size:13px; margin-top:14px" }, T("Uses International Morse Code. Timing follows the standard: a dash is three dots long, with gaps of one dot between signals, three between letters and seven between words.")))));
}

function morseTranslator() {
  let mode = "text";
  const input = el("textarea", { class: "text-input games-morse-input", id: "games-morse-in", rows: "3", maxlength: "500", spellcheck: "false", autocomplete: "off" });
  const inLabel = el("label", { class: "seg-label", for: "games-morse-in" });
  const output = el("output", { class: "games-morse-output", for: "games-morse-in", "aria-live": "off" });
  const note = el("p", { class: "muted games-morse-note" });
  const lamp = el("span", { class: "games-morse-lamp", "aria-hidden": "true" });
  const playBtn = el("button", { class: "primary", onclick: () => togglePlay() });
  const segBtns = {};
  const setPlay = (playing) => { playBtn.textContent = playing ? T("■ Stop") : T("▶ Play sound"); };
  const codeNow = () => (mode === "text" ? morseEncode(input.value).code : morseNormalize(input.value));
  const togglePlay = () => {
    if (morseAudio.osc) { morseStop(); return; }
    if (morsePlay(codeNow(), morseWpm(), lamp, () => setPlay(false))) setPlay(true);
    else toast(T("Type something first."));
  };
  const draw = () => {
    inLabel.textContent = mode === "text" ? T("Your message") : T("Morse code (use . and -, spaces between letters, / between words)");
    input.placeholder = mode === "text" ? T("Type here, like: Hello") : ".... . .-.. .-.. ---";
    Object.entries(segBtns).forEach(([k, b]) => { b.classList.toggle("active", k === mode); b.setAttribute("aria-pressed", String(k === mode)); });
    if (mode === "text") {
      const { code, skipped } = morseEncode(input.value);
      output.textContent = code || "—";
      output.classList.add("games-mono");
      note.textContent = skipped === 1 ? T("1 character has no Morse code and was left out.") : skipped ? T("{n} characters have no Morse code and were left out.", { n: skipped }) : "";
    } else {
      const text = morseDecode(input.value);
      output.textContent = text || "—";
      output.classList.remove("games-mono");
      note.textContent = !morseIsCode(input.value) ? T("Only dots, dashes, spaces and / count here.") : text.includes("#") ? T("# marks a code that isn't a letter or number.") : "";
    }
  };
  const setMode = (m) => {
    if (m === mode) return;
    // Swap: the current result becomes the new input.
    const result = output.textContent === "—" ? "" : output.textContent;
    mode = m;
    input.value = result;
    morseStop();
    draw();
  };
  segBtns.text = el("button", { class: "seg-item", onclick: () => setMode("text") }, T("Text → Morse"));
  segBtns.code = el("button", { class: "seg-item", onclick: () => setMode("code") }, T("Morse → text"));
  input.addEventListener("input", draw);
  input.value = "SOS";
  setPlay(false);
  draw();
  return el("div", { class: "games-morse-translator" },
    el("div", { class: "seg", role: "group", "aria-label": T("Direction") }, segBtns.text, segBtns.code),
    el("div", { class: "field", style: "margin-top:14px" }, inLabel, input),
    el("div", { class: "games-morse-out-wrap" }, el("div", { class: "seg-label" }, T("Result")), output),
    note,
    el("div", { class: "games-morse-controls" }, playBtn, lamp,
      el("button", { onclick: () => gamesCopy(output.textContent === "—" ? "" : output.textContent) }, T("Copy"))),
    morseSpeedControl());
}

function morseChart() {
  return el("div", { class: "games-morse-chart", lang: "en" }, [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"].map((k) => [k, MORSE[k]]).map(([k, v]) =>
    el("div", { class: "games-morse-chart-cell" }, el("strong", {}, k), morseVisual(v))));
}

function morseGame() {
  const box = el("div", { class: "games-box" });
  const idle = () => {
    const best = loadJson(MORSE_BEST_KEY, 0);
    box.replaceChildren(
      el("p", { class: "muted", style: "margin-top:0" }, T("A word appears in dots and dashes. Type what it says; it checks as you type. Words get longer as your score climbs. Stuck? Skip it, play the sound, or peek at the chart below.")),
      el("p", {}, el("strong", {}, T("Best: {best}", { best }))),
      el("div", { class: "actions", style: "margin-top:8px" }, el("button", { class: "primary", onclick: play }, T("Start"))));
  };
  const play = () => {
    let score = 0, word = "", over = false, skips = 0;
    const hud = gamesHud();
    const prompt = el("div", { class: "games-morse-prompt" });
    const lamp = el("span", { class: "games-morse-lamp", "aria-hidden": "true" });
    const input = el("input", { class: "text-input games-morse-guess", type: "text", id: "games-morse-guess", autocomplete: "off", autocapitalize: "characters", spellcheck: "false", "aria-label": T("Your answer"), placeholder: T("Type the word") });
    const feedback = el("div", { class: "games-feedback", role: "status" });
    const listenBtn = el("button", { onclick: () => morsePlay(wordCode(), morseWpm(), lamp) }, T("▶ Listen"));
    const wordCode = () => [...word].map((c) => MORSE[c]).join(" ");
    const next = () => {
      const tier = MORSE_WORDS[score < 4 ? 0 : score < 9 ? 1 : 2];
      let w;
      do { w = tier[Math.floor(Math.random() * tier.length)]; } while (w === word);
      word = w;
      prompt.replaceChildren(morseVisual(wordCode(), true));
      input.value = "";
    };
    input.addEventListener("input", () => {
      if (over) return;
      if (input.value.toUpperCase().replace(/[^A-Z0-9]/g, "") === word) {
        score += 1;
        hud.setScore(score);
        feedback.textContent = T("Correct! It was {word}.", { word });
        prompt.classList.remove("flash");
        void prompt.offsetWidth;
        prompt.classList.add("flash");
        morseStop();
        next();
      }
    });
    const skip = el("button", { onclick: () => { skips += 1; feedback.textContent = T("Skipped: it was {word}.", { word }); morseStop(); next(); input.focus(); } }, T("Skip"));
    box.replaceChildren(hud.node, prompt, input, el("div", { class: "games-morse-controls" }, listenBtn, lamp, skip), feedback);
    hud.setScore(0);
    next();
    input.focus({ preventScroll: true });
    gamesCountdown(box, 60, hud.tick, () => {
      over = true;
      morseStop();
      box.replaceChildren(gamesOver({
        score, bestKey: MORSE_BEST_KEY,
        detail: skips ? T("{skips} skipped.", { skips }) : null,
        onAgain: play, onBack: idle,
      }));
      if (score >= 10) gamesAward("sparks");
    });
  };
  idle();
  return box;
}
