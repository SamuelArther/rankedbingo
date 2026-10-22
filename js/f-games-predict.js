"use strict";

// Guess your friend's branch. The predictor picks a branch and sends a link,
// #/predict/<sealed guess>?n=Friend&f=Predictor. The friend's browser keeps
// the sealed guess until they have a result, then reveals it and makes a
// reveal link, #/predict/<sealed guess>/<result code>?n=Friend&f=Predictor,
// that shows anyone whether the guess was right. A predictor can also paste
// a plain result link (#/r/...) to check it against a guess.

const PREDICT_PENDING_KEY = GAMES_KEY + "predict.pending";
const PREDICT_MINE_KEY = GAMES_KEY + "predict.mine";

// The guess is sealed as a random base-36 number whose remainder mod 6 is
// the branch, so the link doesn't spell it out. (Hidden, not secret.)
function predictSeal(branch) {
  const idx = ORDER.indexOf(branch);
  return ((Math.floor(Math.random() * 40000) + 1000) * ORDER.length + idx).toString(36);
}

function predictUnseal(code) {
  if (!/^[0-9a-z]{3,6}$/.test(code || "")) return null;
  return ORDER[parseInt(code, 36) % ORDER.length];
}

function predictLink(sealed, name, from, resultCode) {
  const q = new URLSearchParams();
  if (name) q.set("n", name);
  if (from) q.set("f", from);
  const query = q.toString();
  return `${siteUrl()}#/predict/${sealed}${resultCode ? "/" + resultCode : ""}${query ? "?" + query : ""}`;
}

// The current browser's finished result, if it has enough answers to count.
function predictMyResult() {
  const code = myResultCode();
  const data = code && decodeAnswers(code);
  if (!data || data.answers.filter((a) => a != null).length < minAnswers(data.qs)) return null;
  return { code, r: computeResult(data.qs, data.answers) };
}

function renderGamesPredict() {
  const [first, second] = route.parts;
  const name = cleanName(route.params.get("n"));
  const from = cleanName(route.params.get("f"));
  if (first && first !== "check" && predictUnseal(first)) {
    if (second) predictRevealPage(first, second, name, from);
    else predictReceived(first, name, from);
    return;
  }
  if (first && first !== "check") {
    app.append(el("div", { class: "note", style: "margin-bottom:14px" }, T("That prediction link doesn't work. Ask your friend to send it again.")));
  }
  const pending = loadJson(PREDICT_PENDING_KEY, []);
  app.append(el("div", { class: "fade-in" },
    pending.length ? predictAboutYou(pending) : null,
    predictMaker(),
    predictChecker()));
}

// ---------------------------------------------------------------------------
// The friend: received a sealed prediction.

function predictReceived(sealed, name, from) {
  const pending = loadJson(PREDICT_PENDING_KEY, []).filter((p) => p.g !== sealed);
  pending.unshift({ g: sealed, name, from, at: Date.now() });
  saveJson(PREDICT_PENDING_KEY, pending.slice(0, 10));
  const mine = predictMyResult();
  const who = from || T("A friend");
  app.append(el("div", { class: "card fade-in games-predict-received" },
    el("div", { class: "games-predict-envelope", "aria-hidden": "true" }, "✉️"),
    el("div", { class: "eyebrow" }, T("Sealed prediction")),
    el("h1", {}, from ? T("{name} made a prediction about you", { name: from }) : T("Someone made a prediction about you")),
    el("p", {}, T("{who} guessed which military branch this quiz will match you with. It stays sealed until you have a result, so no peeking and no pressure.", { who })),
    el("ol", { class: "steps compact" },
      el("li", {}, T("Take the quiz and answer honestly.")),
      el("li", {}, T("Come back here (Fun → Guess your friend's branch) and open the envelope.")),
      el("li", {}, T("Send the reveal link back so {who} finds out too.", { who }))),
    el("p", { class: "muted", style: "font-size:14px; margin-top:14px" }, T("The prediction is saved in this browser, so you can close this page.")),
    mine
      ? el("div", { class: "note", style: "margin-top:4px" }, T("You already have a saved result. Open the envelope now, or retake the quiz first."))
      : null,
    el("div", { class: "actions" },
      mine ? el("a", { class: "button primary", href: "#/predict/check" }, T("Open the envelope")) : null,
      el("a", { class: "button" + (mine ? "" : " primary"), href: "#/quiz" }, mine ? T("Retake the quiz") : T("Take the quiz")))));
}

// Pending predictions about this browser's user, with reveal buttons.
function predictAboutYou(pending) {
  const mine = predictMyResult();
  return el("div", { class: "card", style: "margin-bottom:16px" },
    el("div", { class: "eyebrow" }, T("Predictions about you")),
    el("h2", { style: "margin-bottom:12px" }, pending.length === 1 ? T("You have a sealed prediction") : T("You have {n} sealed predictions", { n: pending.length })),
    mine ? null : el("p", { class: "muted" }, T("Finish the quiz to open them. They'll wait here.")),
    el("div", { class: "games-predict-pending" }, pending.map((p) => {
      const slot = el("div", { class: "games-predict-slot" });
      const who = p.from || T("A friend");
      slot.append(
        el("div", { class: "games-predict-slot-head" }, el("span", { "aria-hidden": "true" }, "✉️"), el("strong", {}, T("From {name}", { name: who }))),
        mine
          ? el("button", { class: "primary", onclick: () => slot.replaceChildren(predictReveal({ guess: predictUnseal(p.g), r: mine.r, from: p.from, name: p.name, mine: true }), predictSendBack(p, mine.code)) }, T("Open the envelope"))
          : el("a", { class: "button primary", href: "#/quiz" }, T("Take the quiz")));
      return slot;
    })),
    el("div", { class: "actions", style: "margin-top:14px" },
      el("button", { onclick: () => { saveJson(PREDICT_PENDING_KEY, []); render(); } }, T("Clear these"))));
}

// After a reveal: the link to send back to the predictor.
function predictSendBack(p, code) {
  const link = predictLink(p.g, p.name, p.from, code);
  const input = el("input", { class: "text-input", type: "text", readonly: true, value: link, "aria-label": T("Reveal link") });
  const who = p.from || T("your friend");
  return el("div", { class: "share-box" },
    el("strong", {}, T("Send the reveal to {who}", { who })),
    el("p", { class: "muted", style: "margin:4px 0 10px; font-size:14px" }, T("This link shows the guess, your match and whether it was right.")),
    el("div", { class: "row" }, input, el("button", { onclick: () => predictShare(link, input, T("Did you call it? 🔮")) }, CAN_SHARE ? T("Share") : T("Copy"))),
    el("div", { class: "actions", style: "margin-top:12px" }, el("a", { class: "button", href: "#/result" }, T("See my full result"))));
}

async function predictShare(link, input, text) {
  if (CAN_SHARE) {
    try { await navigator.share({ text, url: link }); return; } catch { /* cancelled: fall back to copy */ }
  }
  gamesCopy(link, input);
}

// ---------------------------------------------------------------------------
// The reveal itself: guess versus match, behind a tap.

function predictReveal({ guess, r, from, name, mine }) {
  const top = r.tied.map((t) => t.id);
  const right = top.includes(guess);
  const rank = r.ranked.findIndex((x) => x.id === guess) + 1;
  const predictor = from || T("Your friend");
  const subject = mine ? T("You") : name || T("They");
  const tile = (label, ids) => el("div", { class: "games-predict-tile", style: `--hero:${BRANCHES[ids[0]].color}` },
    el("div", { class: "seg-label" }, label),
    el("div", { class: "games-predict-tile-name" }, ids.map((b) => BRANCHES[b].name).join(" / ")));
  const verdict = right
    ? el("div", { class: "games-predict-verdict right" },
      el("div", { class: "games-predict-verdict-icon", "aria-hidden": "true" }, "🎯"),
      el("strong", {}, T("Called it!")),
      el("p", {}, mine ? T("{who} knows you well.", { who: predictor }) : T("{who} guessed it right.", { who: predictor })))
    : el("div", { class: "games-predict-verdict wrong" },
      el("div", { class: "games-predict-verdict-icon", "aria-hidden": "true" }, rank === 2 ? "😬" : "🙃"),
      el("strong", {}, rank === 2 ? T("So close!") : T("Not this time")),
      el("p", {}, T("The {branch} came in #{rank} of 6.", { branch: BRANCHES[guess].name, rank })));
  const body = el("div", { class: "games-predict-reveal" },
    el("div", { class: "games-predict-tiles" },
      tile(T("{who} guessed", { who: predictor }), [guess]),
      tile(mine ? T("You matched") : T("{who} matched", { who: subject }), top)),
    verdict);
  if (right) gamesAward("psychic");
  if (right && !gamesReducedMotion()) body.append(predictBurst());
  return body;
}

// A one-off burst of emoji confetti.
function predictBurst() {
  const burst = el("div", { class: "games-predict-burst", "aria-hidden": "true" });
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    burst.append(el("span", { style: `--x:${Math.cos(a) * (70 + (i % 3) * 30)}px; --y:${Math.sin(a) * (50 + (i % 4) * 20)}px` }, ["🎯", "🔥", "⭐", "🎉"][i % 4]));
  }
  setTimeout(() => burst.remove(), 1400);
  return burst;
}

// Someone opened a reveal link: anyone can see the outcome.
function predictRevealPage(sealed, code, name, from) {
  const guess = predictUnseal(sealed);
  const data = decodeAnswers(code);
  if (!data || data.answers.filter((a) => a != null).length < minAnswers(data.qs)) {
    app.append(el("div", { class: "card fade-in" },
      el("div", { class: "eyebrow" }, T("Prediction check")),
      el("h1", {}, T("That link doesn't work")),
      el("p", { class: "muted" }, T("The reveal link is broken or incomplete. Ask your friend to send it again.")),
      el("a", { class: "button primary", href: "#/predict" }, T("Make a prediction"))));
    return;
  }
  const r = computeResult(data.qs, data.answers);
  const slot = el("div", { class: "games-predict-slot big" });
  const open = () => slot.replaceChildren(predictReveal({ guess, r, from, name, mine: false }));
  slot.append(
    el("div", { class: "games-predict-envelope", "aria-hidden": "true" }, "✉️"),
    el("button", { class: "primary", onclick: open }, T("Open the envelope")));
  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, T("Prediction check")),
    el("h1", {}, name ? T("Did {who} call {name}'s branch?", { who: from || T("they"), name }) : T("Did the prediction come true?")),
    el("p", { class: "muted" }, T("The quiz result is in. Open the envelope to compare it with the guess.")),
    slot,
    el("div", { class: "actions" },
      el("a", { class: "button", href: shareLink(code, name) }, name ? T("See {name}'s full result", { name }) : T("See the full result")),
      el("a", { class: "button", href: "#/predict" }, T("Make a prediction")))));
}

// ---------------------------------------------------------------------------
// The predictor: make a prediction, then check a result.

function predictMaker() {
  let pick = null;
  const lastName = (() => { try { return localStorage.getItem("rankedbingo.name") || ""; } catch { return ""; } })();
  const friend = el("input", { class: "text-input", type: "text", id: "games-predict-friend", maxlength: "20", autocomplete: "off", placeholder: T("Optional") });
  const me = el("input", { class: "text-input", type: "text", id: "games-predict-me", maxlength: "20", autocomplete: "off", value: lastName, placeholder: T("Optional") });
  const out = el("div", {});
  const seal = el("button", { class: "primary", disabled: true, onclick: () => make() }, T("Seal it and get the link"));
  const picks = el("div", { class: "games-predict-picks", role: "group", "aria-label": T("Your guess") }, ORDER.map((b) =>
    el("button", { class: "games-predict-pick", style: `--hero:${BRANCHES[b].color}`, "aria-pressed": "false", "data-b": b, onclick: (e) => choose(b, e.currentTarget) },
      gamesBranchDot(b), el("span", {}, BRANCHES[b].name))));
  const choose = (b, btn) => {
    pick = b;
    picks.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
    seal.disabled = false;
  };
  const make = () => {
    const name = cleanName(friend.value), from = cleanName(me.value);
    const sealed = predictSeal(pick);
    const mine = loadJson(PREDICT_MINE_KEY, []);
    mine.unshift({ g: sealed, name, at: Date.now() });
    saveJson(PREDICT_MINE_KEY, mine.slice(0, 20));
    const link = predictLink(sealed, name, from);
    const input = el("input", { class: "text-input", type: "text", readonly: true, value: link, "aria-label": T("Prediction link") });
    out.replaceChildren(el("div", { class: "share-box fade-in" },
      el("strong", {}, T("Sealed! 🔮 Send this to {name}", { name: name || T("your friend") })),
      el("p", { class: "muted", style: "margin:4px 0 10px; font-size:14px" }, T("The link hides your guess. When they finish the quiz they can open it and send you the reveal.")),
      el("div", { class: "row" }, input, el("button", { onclick: () => predictShare(link, input, T("I predicted which military branch you'll get. Take the quiz and find out if I'm right 🔮")) }, CAN_SHARE ? T("Share") : T("Copy")))));
    out.querySelector("button").focus();
  };
  return el("div", { class: "card" },
    el("div", { class: "eyebrow" }, T("Guess your friend's branch")),
    el("h1", {}, T("Think you know them?")),
    el("p", { class: "muted" }, T("Pick the branch you think the quiz will match your friend with. You'll get a link that hides your guess. They take the quiz, open the envelope, and you both find out if you called it.")),
    el("div", { class: "seg-label", style: "margin:18px 0 8px" }, T("Your guess")),
    picks,
    el("div", { class: "games-predict-names" },
      el("div", { class: "field" }, el("label", { class: "seg-label", for: "games-predict-friend" }, T("Friend's name")), friend),
      el("div", { class: "field" }, el("label", { class: "seg-label", for: "games-predict-me" }, T("Your name")), me)),
    el("div", { class: "actions", style: "margin-top:18px" }, seal),
    out);
}

function predictChecker() {
  const mine = loadJson(PREDICT_MINE_KEY, []);
  const select = el("select", { class: "text-input", id: "games-predict-guess" },
    mine.map((p, i) => el("option", { value: `m${i}` }, `${p.name || T("Friend")}: ${BRANCHES[predictUnseal(p.g)].name}`)),
    ORDER.map((b) => el("option", { value: b }, mine.length ? T("Other: {branch}", { branch: BRANCHES[b].name }) : BRANCHES[b].name)));
  const paste = el("input", { class: "text-input", type: "url", id: "games-predict-paste", placeholder: T("Paste their result link"), autocomplete: "off" });
  const out = el("div", { class: "games-predict-check-out" });
  const check = () => {
    const m = paste.value.match(/#\/(?:r|predict\/[0-9a-z]+)\/([0-9a-z-]+)/i) || paste.value.trim().match(/^([0-9a-z-]{6,})$/i);
    const data = m && decodeAnswers(m[1]);
    if (!data || data.answers.filter((a) => a != null).length < minAnswers(data.qs)) {
      out.replaceChildren(el("p", { class: "games-predict-error" }, T("That doesn't look like a result link. It should look like …#/r/ followed by letters and numbers.")));
      return;
    }
    const v = select.value;
    const saved = v.startsWith("m") ? mine[Number(v.slice(1))] : null;
    const guess = saved ? predictUnseal(saved.g) : v;
    const n = paste.value.match(/[?&]n=([^&#]*)/);
    let name = (saved && saved.name) || "";
    try { name = name || cleanName(n ? decodeURIComponent(n[1].replace(/\+/g, " ")) : ""); } catch { /* bad escape: no name */ }
    out.replaceChildren(predictReveal({ guess, r: computeResult(data.qs, data.answers), from: T("You"), name: name || null, mine: false }));
  };
  return el("div", { class: "card", style: "margin-top:16px" },
    el("div", { class: "eyebrow" }, T("Already have their result?")),
    el("h2", { style: "margin-bottom:10px" }, T("Check a result link")),
    el("p", { class: "muted" }, T("If your friend sent you their result link instead, paste it here to check it against your guess.")),
    el("div", { class: "field" }, el("label", { class: "seg-label", for: "games-predict-guess" }, T("Your guess")), select),
    el("div", { class: "field", style: "margin-top:12px" }, el("label", { class: "seg-label", for: "games-predict-paste" }, T("Their result link")), paste),
    el("div", { class: "actions", style: "margin-top:14px" }, el("button", { class: "primary", onclick: check }, T("Check it"))),
    out);
}
