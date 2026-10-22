"use strict";

// Feedback page: a form in the site's own style that submits to a Google
// Form. Google doesn't allow reading the response (no CORS), so a sent
// request counts as delivered.

const FEEDBACK_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSeZ__DZs6frPObCE7RoH8gSR0Fz1T7C6vjp4hnfySHk-lHNjQ";
const FEEDBACK_FIELDS = {
  result: "entry.1633192845",
  fit: "entry.1684724995",
  wrong: "entry.759695839",
  bug: "entry.2031455249",
  add: "entry.103809440",
  lang: "entry.1420167772",
};

// The feedback page, optionally pre-filled with a result.
function feedbackLink(result = "") {
  return result ? `#/feedback?r=${encodeURIComponent(result)}` : "#/feedback";
}

function languageName() {
  return LANGUAGES.find(([code]) => code === LANG)[1];
}

function renderFeedback() {
  const result = el("input", { class: "text-input", type: "text", maxlength: "300", value: route.result || "", "aria-label": T("What did you get?") });
  let fit = "";
  const fitButtons = el("div", { class: "seg", role: "radiogroup", "aria-label": T("How well did your result fit you?") });
  const drawFit = () => fitButtons.replaceChildren(...["1", "2", "3", "4", "5"].map((n) =>
    el("button", { type: "button", class: "seg-item" + (fit === n ? " active" : ""), role: "radio", "aria-checked": String(fit === n), onclick: () => { fit = fit === n ? "" : n; drawFit(); } }, n)));
  drawFit();
  const area = (label) => el("textarea", { class: "text-input", rows: "3", maxlength: "2000", "aria-label": label });
  const wrong = area(T("Did anything feel wrong or confusing?"));
  const bug = area(T("Found a bug? What page and what device?"));
  const add = area(T("What should we add?"));
  const status = el("p", { class: "muted", role: "status" });
  const send = el("button", { class: "primary", type: "submit" }, T("Send feedback"));

  const submit = async (e) => {
    e.preventDefault();
    const values = { result: result.value.trim(), fit, wrong: wrong.value.trim(), bug: bug.value.trim(), add: add.value.trim() };
    if (!values.fit && !values.wrong && !values.bug && !values.add) {
      status.textContent = T("Answer at least one question first.");
      return;
    }
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...values, lang: languageName() })) {
      if (value && FEEDBACK_FIELDS[key]) body.append(FEEDBACK_FIELDS[key], value);
    }
    send.disabled = true;
    status.textContent = T("Sending...");
    try {
      await fetch(`${FEEDBACK_FORM}/formResponse`, { method: "POST", mode: "no-cors", body });
      form.replaceChildren(
        el("h1", {}, T("Thanks! 🙏")),
        el("p", {}, T("Your feedback was sent. It helps make Ranked Bingo better.")),
        el("div", { class: "actions" }, el("a", { class: "button primary", href: "#/quiz" }, T("Back to the quiz"))));
      award("feedback");
    } catch {
      send.disabled = false;
      status.textContent = T("Couldn't send it. Check your connection and try again.");
    }
  };

  const field = (label, input) => el("label", { class: "field" }, el("span", { class: "field-label" }, label), input);
  const form = el("form", { class: "card fade-in", onsubmit: submit },
    el("div", { class: "eyebrow" }, T("Feedback")),
    el("h1", {}, T("Tell us what you think")),
    el("p", { class: "muted" }, T("Every question is optional. Don't include your name, email or anything personal.")),
    field(T("What did you get?"), result),
    el("div", { class: "field" },
      el("span", { class: "field-label" }, T("How well did your result fit you?")),
      fitButtons,
      el("span", { class: "muted", style: "font-size:13px" }, T("1 = way off, 5 = nailed it"))),
    field(T("Did anything feel wrong or confusing?"), wrong),
    field(T("Found a bug? What page and what device?"), bug),
    field(T("What should we add?"), add),
    el("div", { class: "actions" }, send),
    status);
  app.append(form);
}
