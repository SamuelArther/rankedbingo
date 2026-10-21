"use strict";

// ASVAB practice: original practice questions in the style of each ASVAB
// section. Not official questions and not an official score. The ASVAB is
// given in English, so the questions stay in English in every language.

const ASVAB_SECTIONS = {
  AR: { name: "Arithmetic Reasoning", afqt: true },
  WK: { name: "Word Knowledge", afqt: true },
  PC: { name: "Paragraph Comprehension", afqt: true },
  MK: { name: "Mathematics Knowledge", afqt: true },
  GS: { name: "General Science", afqt: false },
  MC: { name: "Mechanical Comprehension", afqt: false },
  EI: { name: "Electronics Information", afqt: false },
  AS: { name: "Auto and Shop", afqt: false },
};

// Each question: section, prompt, choices (the first listed is correct; they
// are shuffled when shown) and a short explanation.
const ASVAB_BANK = [
  ["AR", "A recruit runs 3 miles in 27 minutes. At that pace, how many minutes does each mile take?", ["9", "8", "10", "12"], "27 ÷ 3 = 9 minutes per mile."],
  ["AR", "A box holds 24 meals. A unit needs 150 meals. How many boxes are needed to have enough?", ["7", "6", "8", "5"], "150 ÷ 24 = 6.25, so 6 boxes aren't enough; you need 7."],
  ["AR", "Fuel costs $3.50 a gallon. How much do 12 gallons cost?", ["$42", "$38", "$40", "$44"], "12 × $3.50 = $42."],
  ["AR", "A ship travels at 18 knots for 4 hours. How many nautical miles does it cover?", ["72", "62", "68", "76"], "Distance = speed × time = 18 × 4 = 72."],
  ["AR", "30% of a 40-person platoon is on leave. How many are NOT on leave?", ["28", "12", "26", "30"], "30% of 40 is 12 on leave, so 40 − 12 = 28 remain."],
  ["AR", "A 45-foot rope is cut into pieces 2.5 feet long. How many pieces are there?", ["18", "15", "16", "20"], "45 ÷ 2.5 = 18."],
  ["AR", "You save $25 a week. How many weeks until you have $400?", ["16", "14", "15", "18"], "400 ÷ 25 = 16 weeks."],
  ["AR", "A jacket costs $80 and is on sale for 25% off. What's the sale price?", ["$60", "$55", "$65", "$70"], "25% of $80 is $20 off, so $80 − $20 = $60."],
  ["WK", "Diligent most nearly means:", ["hard-working", "lazy", "careless", "quick"], "Someone diligent puts steady, careful effort into their work."],
  ["WK", "Abundant most nearly means:", ["plentiful", "rare", "empty", "tiny"], "Abundant means more than enough."],
  ["WK", "Candid most nearly means:", ["honest", "sweet", "hidden", "angry"], "A candid answer is frank and honest."],
  ["WK", "Hostile most nearly means:", ["unfriendly", "welcoming", "calm", "tired"], "Hostile means unfriendly or aggressive."],
  ["WK", "Prudent most nearly means:", ["sensible", "reckless", "loud", "proud"], "A prudent choice is careful and wise."],
  ["WK", "Rigid most nearly means:", ["stiff", "soft", "bright", "bendable"], "Rigid means not able to bend."],
  ["WK", "Concise most nearly means:", ["brief", "wordy", "confusing", "loud"], "Concise means saying a lot in few words."],
  ["WK", "Vigilant most nearly means:", ["watchful", "sleepy", "careless", "violent"], "A vigilant guard stays alert."],
  ["PC", "\"Before every run, the platoon spends ten minutes warming up. The sergeant says this lowers the chance of injury and helps everyone run better.\" Why does the platoon warm up?", ["To lower injury risk and run better", "To pass the time", "Because the run is short", "To skip the run"], "The passage gives both reasons directly."],
  ["PC", "\"Coast Guard small boat stations are often in coastal towns. Crews stay on duty overnight so they can respond to emergencies at any hour.\" Why do crews stay overnight?", ["To respond to emergencies at any hour", "Because they live at the station", "To clean the boats", "Because the towns are far away"], "The passage says it's so they can respond at any hour."],
  ["PC", "\"Satellites help with navigation, weather forecasts and communication. Without them, GPS on phones and in vehicles would stop working.\" What is the main idea?", ["Satellites support many everyday services", "Phones are expensive", "Weather is hard to predict", "Vehicles need paper maps"], "Every sentence is about what satellites make possible."],
  ["PC", "\"Many military jobs teach skills used in civilian careers. A mechanic can work on cars, and a medic can become an EMT.\" Which is the best title?", ["Military skills can lead to civilian jobs", "How to fix a car", "Why medics are busy", "The history of EMTs"], "The examples support the idea that skills carry over."],
  ["PC", "\"Hydration matters most in hot weather. Drinking water before you feel thirsty helps prevent heat injuries.\" When should you drink water?", ["Before you feel thirsty", "Only when you're thirsty", "Only after the run", "Never during training"], "The passage says to drink before you feel thirsty."],
  ["PC", "\"Boot camp is designed to be hard. Recruits learn discipline by following routines exactly, from making their beds to marching in step.\" How do recruits learn discipline?", ["By following routines exactly", "By skipping meals", "By choosing their own schedule", "By working alone"], "The passage names following routines exactly."],
  ["MK", "If 3x + 5 = 20, what is x?", ["5", "3", "15", "25/3"], "3x = 15, so x = 5."],
  ["MK", "What is the area of a rectangle 8 units long and 6 units wide?", ["48", "14", "28", "54"], "Area = length × width = 8 × 6 = 48."],
  ["MK", "What is 2 to the 5th power?", ["32", "10", "16", "25"], "2 × 2 × 2 × 2 × 2 = 32."],
  ["MK", "What is the square root of 81?", ["9", "8", "18", "40.5"], "9 × 9 = 81."],
  ["MK", "What is the perimeter of a square with sides of 7?", ["28", "14", "21", "49"], "4 × 7 = 28. (49 would be the area.)"],
  ["MK", "Which fraction equals 0.25?", ["1/4", "1/2", "2/5", "1/25"], "0.25 = 25/100 = 1/4."],
  ["MK", "If x = 4, what is x² − 2x?", ["8", "4", "12", "16"], "16 − 8 = 8."],
  ["MK", "The three angles of a triangle add up to:", ["180°", "90°", "270°", "360°"], "Every triangle's angles sum to 180°."],
  ["GS", "At sea level, water boils at:", ["100 °C", "0 °C", "50 °C", "212 °C"], "Water boils at 100 °C (212 °F) at sea level."],
  ["GS", "Which planet is closest to the Sun?", ["Mercury", "Venus", "Earth", "Mars"], "Mercury orbits closest to the Sun."],
  ["GS", "Plants take in which gas from the air to make food?", ["Carbon dioxide", "Oxygen", "Nitrogen", "Helium"], "Photosynthesis uses carbon dioxide and gives off oxygen."],
  ["GS", "The basic unit of all living things is the:", ["cell", "atom", "organ", "tissue"], "All living things are made of cells."],
  ["GS", "H₂O is the chemical formula for:", ["water", "salt", "hydrogen gas", "oxygen gas"], "Two hydrogen atoms and one oxygen atom make water."],
  ["GS", "According to Newton's second law, force equals:", ["mass × acceleration", "mass × speed", "weight ÷ time", "speed × time"], "F = m × a."],
  ["MC", "A lever helps you mainly by:", ["reducing the force you need", "making objects lighter", "removing friction", "storing electricity"], "A lever trades distance for less force."],
  ["MC", "Gear A turns clockwise and meshes with gear B. Which way does gear B turn?", ["Counterclockwise", "Clockwise", "It doesn't turn", "Back and forth"], "Meshed gears turn in opposite directions."],
  ["MC", "A single fixed pulley mainly changes the:", ["direction of the force", "weight of the load", "amount of force needed", "speed of light"], "One fixed pulley lets you pull down to lift up, with no force advantage."],
  ["MC", "A ramp is which kind of simple machine?", ["Inclined plane", "Lever", "Wheel and axle", "Pulley"], "A ramp is an inclined plane."],
  ["EI", "The unit of electrical resistance is the:", ["ohm", "volt", "amp", "watt"], "Resistance is measured in ohms (Ω)."],
  ["EI", "A material that lets electric current flow easily is a:", ["conductor", "insulator", "resistor", "battery"], "Metals like copper are good conductors."],
  ["EI", "A circuit has 2 amps of current and 6 ohms of resistance. What is the voltage?", ["12 volts", "3 volts", "8 volts", "4 volts"], "Ohm's law: V = I × R = 2 × 6 = 12 volts."],
  ["EI", "What does a fuse do?", ["Protects a circuit from too much current", "Stores energy", "Raises the voltage", "Measures resistance"], "A fuse melts and breaks the circuit when current gets too high."],
  ["AS", "Which tool is used to tighten a nut?", ["Wrench", "Hammer", "Chisel", "File"], "A wrench grips and turns nuts and bolts."],
  ["AS", "In a gasoline engine, spark plugs:", ["ignite the fuel and air mixture", "cool the engine", "filter the oil", "charge the battery"], "The spark lights the fuel-air mixture in the cylinder."],
  ["AS", "Which tool measures small lengths precisely?", ["Caliper", "Hammer", "Chisel", "Wrench"], "Calipers measure small distances accurately."],
  ["AS", "Engine coolant mainly:", ["keeps the engine from overheating", "makes the car faster", "cleans the windshield", "lubricates the tires"], "Coolant carries heat away from the engine."],
];

const ASVAB_MIX = { AR: 4, WK: 4, PC: 3, MK: 4, GS: 2, MC: 1, EI: 1, AS: 1 };

const asvab = { questions: [], answers: [], step: -1 };

function newAsvabTest() {
  const rng = makeRng(Date.now() >>> 0);
  const picked = [];
  for (const [sec, n] of Object.entries(ASVAB_MIX)) {
    picked.push(...shuffled(ASVAB_BANK.filter((q) => q[0] === sec), rng).slice(0, n));
  }
  asvab.questions = shuffled(picked, rng).map(([section, prompt, choices, why]) => ({
    section, prompt, why, correct: choices[0], choices: shuffled(choices, rng),
  }));
  asvab.answers = [];
  asvab.step = 0;
}

function renderAsvab() {
  const intro = () => app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, T("ASVAB practice")),
    el("h1", {}, T("Practice the ASVAB")),
    el("p", { class: "muted" }, T("20 practice questions in the style of the ASVAB's sections: math, word knowledge, reading, and a few technical ones. You'll get a score for each section and see the answers explained.")),
    el("div", { class: "note" }, T("These are original practice questions, not official ones, and the score is not your AFQT. The real AFQT compares you with a national group of test takers.")),
    LANG !== "en" ? el("p", { class: "muted", style: "font-size:14px" }, T("The ASVAB is given in English, so these practice questions are in English.")) : null,
    el("div", { class: "actions" },
      el("button", { class: "primary", onclick: () => { newAsvabTest(); render(); } }, T("Start practice")),
      el("a", { class: "button", href: "https://www.officialasvab.com/applicants/sample-questions/", target: "_blank", rel: "noopener" }, T("Official sample questions ↗")))));

  if (asvab.step < 0) { intro(); return; }

  if (asvab.step < asvab.questions.length) {
    const q = asvab.questions[asvab.step];
    app.append(el("div", { class: "card fade-in" },
      el("div", { class: "progress-row" },
        el("span", {}, T("Question {n} / {total}", { n: asvab.step + 1, total: asvab.questions.length })),
        el("span", {}, ASVAB_SECTIONS[q.section].name)),
      el("div", { class: "progress" }, el("div", { style: `width:${(asvab.step / asvab.questions.length) * 100}%` })),
      el("h2", { lang: "en" }, q.prompt),
      el("div", { class: "options", role: "group", "aria-label": q.prompt, lang: "en" }, q.choices.map((c, i) => el("button", {
        class: "option",
        onclick: () => { asvab.answers[asvab.step] = c; asvab.step += 1; render(); },
      }, el("span", { class: "key" }, "ABCD"[i]), el("span", {}, c)))),
      el("div", { class: "nav" },
        el("button", { onclick: () => { asvab.step = Math.max(-1, asvab.step - 1); render(); } }, T("Back")),
        el("button", { onclick: () => { asvab.step = -1; render(); } }, T("Quit")))));
    return;
  }

  // Results: per-section score, the AFQT sections together, and the review.
  const bySection = {};
  asvab.questions.forEach((q, i) => {
    const s = (bySection[q.section] ||= { right: 0, total: 0 });
    s.total += 1;
    if (asvab.answers[i] === q.correct) s.right += 1;
  });
  const afqt = Object.entries(bySection).filter(([k]) => ASVAB_SECTIONS[k].afqt).reduce((a, [, v]) => ({ right: a.right + v.right, total: a.total + v.total }), { right: 0, total: 0 });
  const right = asvab.questions.filter((q, i) => asvab.answers[i] === q.correct).length;
  const afqtPct = Math.round((afqt.right / afqt.total) * 100);
  const verdict = afqtPct >= 85 ? T("Strong. Keep it up and you'll have lots of job options.")
    : afqtPct >= 60 ? T("Solid. A little more practice on your weakest section will help.")
      : T("Keep practicing. Math and vocabulary improve fast with daily practice.");

  app.append(el("div", { class: "card fade-in" },
    el("div", { class: "eyebrow" }, T("ASVAB practice")),
    el("h1", {}, T("{right} of {total} right", { right, total: asvab.questions.length })),
    el("p", {}, el("strong", {}, T("AFQT sections: {pct}%", { pct: afqtPct })), " · ", verdict),
    el("p", { class: "muted", style: "font-size:13px" }, T("Practice score only: the AFQT uses Arithmetic Reasoning, Word Knowledge, Paragraph Comprehension and Mathematics Knowledge, scored against a national group.")),
    el("div", { class: "section-title" }, T("By section")),
    el("div", { class: "bars" }, Object.entries(bySection).map(([k, v]) => bar(ASVAB_SECTIONS[k].name, Math.round((v.right / v.total) * 100), ASVAB_SECTIONS[k].afqt ? "var(--accent)" : "var(--warn)"))),
    el("div", { class: "section-title" }, T("Review")),
    el("ol", { class: "steps compact", lang: "en" }, asvab.questions.map((q, i) => {
      const ok = asvab.answers[i] === q.correct;
      return el("li", {},
        el("strong", {}, q.prompt),
        el("p", { style: `margin:4px 0 0; color:${ok ? "var(--accent)" : "var(--danger)"}` }, ok ? `✓ ${q.correct}` : `✗ ${asvab.answers[i] || "—"} → ${q.correct}`),
        el("p", { class: "muted", style: "margin:2px 0 0; font-size:14px" }, q.why));
    })),
    el("div", { class: "actions" },
      el("button", { class: "primary", onclick: () => { newAsvabTest(); render(); } }, T("Try another set")),
      el("a", { class: "button", href: "https://www.officialasvab.com/applicants/sample-questions/", target: "_blank", rel: "noopener" }, T("Official sample questions ↗")),
      el("a", { class: "button", href: "#/join" }, T("Back to Join")))));
}
