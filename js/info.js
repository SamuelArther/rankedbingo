"use strict";

// Info pages: ranks and pay, joining requirements and fitness tests, plus the
// Fun-page extras built on the same research (history, famous people, bases,
// slang). The data (js/info-data.js) loads only when one of these is opened.

let infoLoading = null;

function withInfo(fn) {
  if (window.INFO) { fn(); return; }
  app.append(el("p", { class: "muted" }, T("Loading...")));
  if (!infoLoading) {
    infoLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "js/info-data.js";
      s.onload = resolve;
      s.onerror = () => { infoLoading = null; reject(new Error("load failed")); };
      document.head.append(s);
    });
  }
  const page = route.page;
  infoLoading.then(() => { if (route.page === page) render(); })
    .catch(() => { app.replaceChildren(el("p", { class: "muted" }, T("Couldn't load this page. Check your connection and try again."))); });
}

function branchChips(current, makeHref) {
  return el("div", { class: "chips", style: "margin:12px 0 4px" }, ORDER.map((b) => el("a", {
    class: "chip chip-btn" + (b === current ? " active" : ""), href: makeHref(b),
  }, el("span", { class: "dot", style: `background:${BRANCHES[b].color}` }), BRANCHES[b].name)));
}

const money = (n) => n == null ? "n/a" : "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------
// Ranks and pay.

function levelNote(grade) {
  const notes = INFO.levelNotes;
  if (notes[grade]) return notes[grade];
  if (grade.startsWith("W")) return notes["W-1 to W-5"];
  const n = Number(grade.slice(2));
  if (n <= 2) return notes["O-1/O-2"];
  if (n === 3) return notes["O-3"];
  if (n <= 6) return notes["O-4 to O-6"];
  return notes["O-7 to O-10"];
}

function rankRows(list) {
  return list.map((g) => el("tr", {},
    el("td", { class: "mono" }, g.grade),
    el("td", {}, g.titles.map((t, i) => [i ? el("br") : null, t.title, t.abbr ? el("span", { class: "muted" }, ` (${t.abbr})`) : null])),
  ));
}

function renderPay() {
  withInfo(() => {
    const b = ORDER.includes(route.branch) ? route.branch : "army";
    const info = BRANCHES[b];
    const ranks = INFO.ranks[b];
    const pay = INFO.pay;

    // Pay calculator: any grade in this branch, any years of service.
    const grades = [...ranks.enlisted, ...(ranks.warrant || []), ...ranks.officer].map((g) => g.grade);
    const gradeSelect = el("select", { class: "text-input", "aria-label": T("Pay grade") }, grades.map((g) => {
      const titles = [...ranks.enlisted, ...(ranks.warrant || []), ...ranks.officer].find((x) => x.grade === g).titles;
      return el("option", { value: g }, `${g} · ${titles[0].title}`);
    }));
    gradeSelect.value = "E-4";
    const yosSelect = el("select", { class: "text-input", "aria-label": T("Years of service") }, pay.yos.map((y, i) =>
      el("option", { value: i }, y === "<2" ? T("Less than 2 years") : T("Over {years} years", { years: y }))));
    yosSelect.value = "1";
    const out = el("div", { class: "pay-out" });
    const calc = () => {
      const row = pay.table[gradeSelect.value];
      const monthly = row ? row[Number(yosSelect.value)] : null;
      const parts = monthly == null
        ? [el("p", { class: "muted" }, T("No basic pay at that grade with that little time in service (people don't normally reach it that early)."))]
        : [el("div", { class: "pay-big" }, money(monthly), el("span", { class: "muted" }, T(" / month"))),
           el("p", { class: "muted", style: "margin:4px 0 0" }, T("{amount} a year in basic pay, before taxes.", { amount: money(monthly * 12) })),
           gradeSelect.value === "E-1" && yosSelect.value === "0" ? el("p", { class: "muted", style: "font-size:13px" }, T("With less than 4 months of service, E-1 basic pay is {amount} a month.", { amount: money(pay.e1Under4Months) })) : null];
      out.replaceChildren(...parts.filter(Boolean));
    };
    gradeSelect.addEventListener("change", calc);
    yosSelect.addEventListener("change", calc);
    calc();

    app.append(el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Ranks & pay")),
      el("h1", {}, T("Ranks and pay")),
      el("p", { class: "muted" }, T("Every rank in each branch, and what the military pays in {year}. Basic pay is the same in every branch: it depends only on pay grade and years of service.", { year: pay.year })),
      LANG !== "en" ? el("p", { class: "muted", style: "font-size:13px" }, T("Rank titles and some details are only available in English.")) : null,
      branchChips(b, (x) => `#/pay/${x}`),

      el("div", { class: "card", style: "margin-top:16px" },
        el("div", { class: "eyebrow" }, T("Pay calculator")),
        el("div", { class: "two-col", style: "gap:10px; margin-top:10px" },
          el("label", { class: "field" }, el("span", { class: "seg-label" }, T("Pay grade")), gradeSelect),
          el("label", { class: "field" }, el("span", { class: "seg-label" }, T("Years of service")), yosSelect)),
        out,
        el("div", { class: "section-title" }, T("On top of basic pay")),
        el("ul", { class: "list good" },
          el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, el("strong", {}, T("Housing (BAH): ")), pay.allowances.BAH.summary, " ",
            el("a", { href: pay.allowances.BAH.calculatorUrl, target: "_blank", rel: "noopener" }, T("Look up BAH ↗")))),
          el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, el("strong", {}, T("Food (BAS): ")), pay.allowances.BAS.summary,
            " " + T("In {year} it's {enlisted} a month for enlisted members and {officer} for officers.", { year: pay.year, enlisted: money(pay.allowances.BAS.rates2026.enlisted), officer: money(pay.allowances.BAS.rates2026.officer) }))),
          el("li", {}, el("span", { class: "mark" }, "+"), el("span", {}, T("Free healthcare, plus special pays and bonuses for some jobs and assignments.")))),
        el("p", { class: "muted", style: "font-size:13px" }, T("{year} rates (a {raise}% raise), effective {date}, from DFAS. Reserve and Guard members are paid per drill instead.", { year: pay.year, raise: pay.raisePercent, date: pay.effective }))),

      el("div", { class: "section-title" }, T("{branch} enlisted ranks", { branch: info.name })),
      el("div", { class: "table-wrap" }, el("table", { class: "rank-table" }, el("tbody", {}, rankRows(ranks.enlisted)))),
      ranks.enlistedNote ? el("p", { class: "muted", style: "font-size:13px" }, ranks.enlistedNote) : null,
      (ranks.warrant || []).length ? [
        el("div", { class: "section-title" }, T("{branch} warrant officer ranks", { branch: info.name })),
        el("div", { class: "table-wrap" }, el("table", { class: "rank-table" }, el("tbody", {}, rankRows(ranks.warrant)))),
      ] : null,
      ranks.warrantNote ? el("p", { class: "muted", style: "font-size:13px" }, ranks.warrantNote) : null,
      el("div", { class: "section-title" }, T("{branch} officer ranks", { branch: info.name })),
      el("div", { class: "table-wrap" }, el("table", { class: "rank-table" }, el("tbody", {}, rankRows(ranks.officer)))),

      el("div", { class: "section-title" }, T("What each level does")),
      el("div", { class: "jobs" }, Object.entries(INFO.levelNotes).map(([k, v]) => el("div", { class: "job", style: `--hero:${info.color}` },
        el("div", { class: "job-path" }, k), el("p", { style: "margin:4px 0 0" }, v)))),
    ));
  });
}

// ---------------------------------------------------------------------------
// Joining: eligibility checker, requirements and fitness tests.

// Highest enlistment age per branch, read from the research text.
function maxAge(b) {
  const text = INFO.eligibility[b].ageEnlisted;
  const range = text.match(/17\s*[-–]\s*(\d+)/);
  if (range) return Number(range[1]);
  const birthday = text.match(/(\d+)(st|nd|rd|th) birthday/);
  return birthday ? Number(birthday[1]) - 1 : null;
}

function toSeconds(s) {
  const m = String(s || "").match(/(\d+):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function firstNumber(s, re) {
  const m = String(s || "").match(re);
  return m ? Number(m[1]) : null;
}

// Compares the user's numbers with one fitness event's minimum.
function checkEvent(event, sex, me) {
  const min = event.min && event.min[sex];
  if (!min || /not published/i.test(min)) return { status: "na", note: T("Minimum not published") };
  const name = event.name.toLowerCase();
  if (/pull-up/.test(name)) {
    const pulls = firstNumber(min, /(\d+)\s*pull/), pushes = firstNumber(min, /(\d+)\s*push/);
    if (me.pullups == null && me.pushups == null) return { status: "skip" };
    const ok = (me.pullups != null && pulls != null && me.pullups >= pulls) || (me.pushups != null && pushes != null && me.pushups >= pushes);
    return { status: ok ? "pass" : "fail", note: min };
  }
  if (/push-up/.test(name)) {
    const need = firstNumber(min, /(\d+)/);
    if (me.pushups == null || need == null) return { status: "skip" };
    return { status: me.pushups >= need ? "pass" : "fail", note: min };
  }
  if (/plank/.test(name)) {
    const need = toSeconds(min);
    if (me.plank == null || need == null) return { status: "skip" };
    return { status: me.plank >= need ? "pass" : "fail", note: min };
  }
  if (/deadlift/.test(name)) {
    const need = firstNumber(min, /(\d+)\s*lb/);
    if (me.deadlift == null || need == null) return { status: "skip" };
    return { status: me.deadlift >= need ? "pass" : "fail", note: min };
  }
  const dist = /1\.5-mile/.test(name) ? "1.5" : /2-mile/.test(name) ? "2" : /3-mile/.test(name) ? "3" : null;
  if (dist) {
    const need = toSeconds(min);
    if (me.run == null || need == null) return { status: "skip" };
    if (me.runDist !== dist) return { status: "na", note: T("Uses a {miles}-mile run", { miles: dist }) };
    return { status: me.run <= need ? "pass" : "fail", note: min };
  }
  return { status: "skip" };
}

function renderJoin() {
  withInfo(() => {
    const E = INFO.eligibility;

    // Eligibility checker.
    const age = el("input", { class: "text-input", type: "number", min: "10", max: "80", placeholder: T("Age"), "aria-label": T("Age") });
    const edu = el("select", { class: "text-input", "aria-label": T("Education") },
      el("option", { value: "diploma" }, T("High school diploma (or will have one)")),
      el("option", { value: "ged" }, T("GED or other credential")),
      el("option", { value: "none" }, T("Neither yet")));
    const afqt = el("input", { class: "text-input", type: "number", min: "1", max: "99", placeholder: T("AFQT score, if you have one (1-99)"), "aria-label": T("AFQT score, if you have one (1-99)") });
    const cit = el("select", { class: "text-input", "aria-label": T("Citizenship") },
      el("option", { value: "citizen" }, T("U.S. citizen")),
      el("option", { value: "greencard" }, T("Green card holder")),
      el("option", { value: "other" }, T("Neither")));
    const verdicts = el("div", { class: "jobs" });
    const check = () => {
      const a = Number(age.value);
      verdicts.replaceChildren(...ORDER.map((b) => {
        const notes = [];
        let status = "ok";
        const worst = (s) => { if (s === "no" || (s === "maybe" && status === "ok")) status = s; };
        const max = maxAge(b);
        if (!age.value) { worst("maybe"); notes.push(T("Enter your age.")); }
        else if (a < 17) { worst("no"); notes.push(T("Too young to enlist yet: the minimum is 17 (with a parent's consent).")); }
        else if (max && a > max) { worst("no"); notes.push(T("Over the enlistment age limit ({max}). Some programs and officer paths differ, so ask a recruiter.", { max })); }
        else if (a === 17) notes.push(T("At 17 you need a parent's or guardian's consent."));
        if (cit.value === "other") { worst("no"); notes.push(T("You must be a U.S. citizen or green card holder to enlist.")); }
        if (b === "sf" && cit.value === "greencard") { worst("maybe"); notes.push(T("Green card rules for the Space Force aren't published. Ask a recruiter.")); }
        if (edu.value === "none") { worst("maybe"); notes.push(T("Almost everyone needs a diploma or a GED. Recruiters can explain your options.")); }
        const need = E[b].asvab[edu.value === "ged" ? "ged" : "diploma"];
        if (afqt.value) {
          if (need != null && Number(afqt.value) < need) {
            worst("no");
            notes.push(T(edu.value === "ged" ? "AFQT {score} is under the {need} minimum for GED holders. You can retake the ASVAB." : "AFQT {score} is under the {need} minimum. You can retake the ASVAB.", { score: afqt.value, need }));
          } else if (need == null) { worst("maybe"); notes.push(T("The minimum AFQT isn't published for this branch.")); }
        } else if (need != null) notes.push(T(edu.value === "ged" ? "You'll need an AFQT of at least {need} with a GED." : "You'll need an AFQT of at least {need}.", { need }));
        const label = { ok: T("Looks eligible"), maybe: T("Check with a recruiter"), no: T("Not eligible right now") }[status];
        return el("div", { class: "job verdict " + status, style: `--hero:${BRANCHES[b].color}` },
          el("div", { class: "job-path" }, BRANCHES[b].name),
          el("strong", { class: "job-name" }, label),
          el("ul", { class: "list", style: "margin-top:6px; font-size:14px" }, notes.map((n) => el("li", {}, el("span", { class: "mark" }, "•"), el("span", {}, n)))));
      }));
    };
    [age, edu, afqt, cit].forEach((x) => x.addEventListener("input", check));
    check();

    // Fitness self-check.
    const sex = el("select", { class: "text-input", "aria-label": T("Standards") }, el("option", { value: "male" }, T("Male standards")), el("option", { value: "female" }, T("Female standards")));
    const num = (ph) => el("input", { class: "text-input", type: "number", min: "0", placeholder: ph, "aria-label": ph });
    const pushups = num(T("Push-ups")), pullups = num(T("Pull-ups")), deadlift = num(T("Deadlift (lbs)"));
    const plank = el("input", { class: "text-input", type: "text", placeholder: T("Plank (m:ss)"), "aria-label": T("Plank (m:ss)") });
    const runDist = el("select", { class: "text-input", "aria-label": T("Run distance") }, ["1.5", "2", "3"].map((d) => el("option", { value: d }, T("{miles}-mile run", { miles: d }))));
    const run = el("input", { class: "text-input", type: "text", placeholder: T("Run time (mm:ss)"), "aria-label": T("Run time (mm:ss)") });
    const fitOut = el("div", { class: "jobs" });
    const fitCheck = () => {
      const val = (x) => (x.value === "" ? null : Number(x.value));
      const me = { pushups: val(pushups), pullups: val(pullups), deadlift: val(deadlift), plank: toSeconds(plank.value), run: toSeconds(run.value), runDist: runDist.value };
      fitOut.replaceChildren(...ORDER.map((b) => {
        const f = INFO.fitness[b];
        const rows = f.events.map((e) => ({ e, r: checkEvent(e, sex.value, me) })).filter(({ r }) => r.status !== "skip");
        return el("div", { class: "job", style: `--hero:${BRANCHES[b].color}` },
          el("div", { class: "job-path" }, BRANCHES[b].name),
          el("strong", {}, f.test),
          rows.length
            ? el("ul", { class: "list", style: "margin-top:6px; font-size:14px" }, rows.map(({ e, r }) => el("li", {},
                el("span", { class: "mark", style: `color:${r.status === "pass" ? "var(--accent)" : r.status === "fail" ? "var(--danger)" : "var(--muted)"}` }, r.status === "pass" ? "✓" : r.status === "fail" ? "✗" : "–"),
                el("span", {}, `${e.name}: `, el("span", { class: "muted" }, r.status === "na" ? r.note : T("minimum {value}", { value: r.note }))))))
            : el("p", { class: "muted", style: "margin:6px 0 0; font-size:14px" }, T("Enter numbers above to compare.")));
      }));
    };
    [sex, pushups, pullups, deadlift, plank, runDist, run].forEach((x) => x.addEventListener("input", fitCheck));
    fitCheck();

    app.append(el("div", { class: "fade-in" },
      el("div", { class: "eyebrow" }, T("Join")),
      el("h1", {}, T("Can I join?")),
      el("p", { class: "muted" }, T("A quick check against each branch's basic enlistment rules, and how your fitness compares with each branch's test. This isn't an official decision: recruiters and MEPS make the real call, and many issues can be waived.")),
      el("div", { class: "actions", style: "margin-top:0" }, el("a", { class: "button primary", href: "#/asvab" }, T("Practice the ASVAB →"))),
      el("div", { class: "card", style: "margin-top:16px" },
        el("div", { class: "eyebrow" }, T("Eligibility check")),
        el("div", { class: "form-grid" }, age, edu, afqt, cit),
        el("div", { style: "margin-top:14px" }, verdicts)),

      el("div", { class: "section-title" }, T("Requirements by branch")),
      el("div", { class: "jobs" }, ORDER.map((b) => {
        const e = E[b];
        return el("details", { class: "job", style: `--hero:${BRANCHES[b].color}` },
          el("summary", {}, el("strong", { class: "job-name" }, BRANCHES[b].name)),
          el("dl", { class: "req" },
            [[T("Age"), e.ageEnlisted], [T("Officers"), e.ageOfficer], [T("Education"), e.education],
             ["ASVAB (AFQT)", T("Diploma: {diploma} · GED: {ged}", { diploma: e.asvab.diploma ?? T("not published"), ged: e.asvab.ged ?? T("not published") })],
             [T("Citizenship"), e.citizenship], [T("Tattoos"), e.tattoos], [T("Dependents"), e.dependents], [T("Medical"), e.medical]]
              .filter(([, v]) => v).map(([k, v]) => [el("dt", {}, k), el("dd", {}, v)])),
          (e.prepPrograms || []).length ? [el("strong", { style: "font-size:14px" }, T("Programs that help you qualify")),
            el("ul", { class: "list", style: "font-size:14px; margin-top:6px" }, e.prepPrograms.map((p) => el("li", {}, el("span", { class: "mark" }, "•"), el("span", {}, p))))] : null,
          e.source ? el("a", { href: e.source, target: "_blank", rel: "noopener", style: "font-size:14px" }, T("Official source ↗")) : null);
      })),

      el("div", { class: "section-title" }, T("Fitness tests")),
      el("div", { class: "card" },
        el("div", { class: "eyebrow" }, T("Check your numbers")),
        el("p", { class: "muted", style: "font-size:14px" }, T("Enter what you can do now. It's a rough comparison with each branch's minimum for the youngest age group: event rules (time limits, hand-release push-ups and so on) differ, so train past the minimum.")),
        el("div", { class: "form-grid" }, sex, pushups, pullups, plank, runDist, run, deadlift),
        el("div", { style: "margin-top:14px" }, fitOut)),
      el("div", { class: "jobs", style: "margin-top:14px" }, ORDER.map((b) => {
        const f = INFO.fitness[b];
        return el("details", { class: "job", style: `--hero:${BRANCHES[b].color}` },
          el("summary", {}, el("strong", { class: "job-name" }, `${BRANCHES[b].name}: ${f.test}`)),
          el("p", { class: "muted", style: "font-size:14px" }, f.notes),
          el("div", { class: "table-wrap" }, el("table", {},
            el("thead", {}, el("tr", {}, el("th", {}, T("Event")), el("th", {}, T("Male min")), el("th", {}, T("Female min")))),
            el("tbody", {}, f.events.map((e) => el("tr", {}, el("td", { class: "wrap" }, el("strong", {}, e.name), el("br"), el("span", { class: "muted" }, e.desc)),
              el("td", { class: "wrap" }, e.min ? e.min.male : ""), el("td", { class: "wrap" }, e.min ? e.min.female : "")))))),
          f.entry ? el("p", { style: "font-size:14px" }, el("strong", {}, T("Before or at boot camp: ")), f.entry) : null,
          f.source ? el("a", { href: f.source, target: "_blank", rel: "noopener", style: "font-size:14px" }, T("Official source ↗")) : null);
      })),
      el("p", { class: "muted", style: "font-size:13px; margin-top:16px" }, T("Checked against official sources in October 2026. Standards change often, so confirm with a recruiter.")),
      LANG !== "en" ? el("p", { class: "muted", style: "font-size:13px" }, T("Requirement details and fitness standards are only available in English.")) : null,
    ));
  });
}

// ---------------------------------------------------------------------------
// Questions to ask a recruiter, built from a result.

function recruiterQuestions(r) {
  const b = r.top.id, name = BRANCHES[b].name;
  const job = r.topJob(b)[0];
  const comp = r.components[0].id;
  const qs = [
    T("Is {job} open right now, and what ASVAB line scores does it need?", { job: job.n }),
    T("How long is training for {job}, and where would I go?", { job: job.n }),
    T("Are there enlistment bonuses or special pay for {job} right now?", { job: job.n }),
    T("What does a normal week look like in that job in the {branch}?", { branch: name }),
    T("Can I get my job guaranteed in my contract before I ship?"),
  ];
  if (comp === "guard") qs.push(T("Does my state offer tuition help for Guard members, and how often does my unit deploy?"));
  if (comp === "reserve") qs.push(T("Where is the nearest unit with that job, and how often does it mobilize?"));
  if (comp === "active") qs.push(T("How much say do I get in my first duty station?"));
  if (r.tracks[0].id === "officer") qs.push(T("Which route to a commission fits me best: ROTC, officer candidate school, or an academy?"));
  if (r.hasDegree && r.tracks[0].id === "enlisted") qs.push(T("With my degree, should I go officer instead, or enlist at a higher rank?"));
  if (interestVector(r.answers, r.qs).elite > 0) qs.push(T("What does the special operations selection pipeline look like, and how do I prepare for it?"));
  qs.push(T("What are the fitness standards I need to meet before I ship?"));
  qs.push(T("What's the length of the contract, including time in the Reserve after active duty?"));
  return qs;
}
