"use strict";

// "Start here" roadmap: the whole site as an ordered checklist for someone
// thinking about the military, from the quiz to talking with recruiters.
// Checkmarks are saved in this browser; finishing the quiz checks itself.

const ROADMAP_KEY = "rankedbingo.roadmap.v1";

// The branch from the latest finished quiz, if any.
function roadmapTopBranch() {
  const history = loadJson(HISTORY_KEY, []);
  const last = history[history.length - 1];
  if (!last) return null;
  return ORDER.reduce((best, b) => ((last.pct[b] ?? 0) > (last.pct[best] ?? 0) ? b : best), ORDER[0]);
}

function roadmapPhases(top) {
  const branchHref = top ? branchLink(top) : "#/branches";
  const branchName = top ? BRANCHES[top].name : null;
  return [
    {
      title: T("Explore"),
      steps: [
        { id: "quiz", auto: () => loadJson(HISTORY_KEY, []).length > 0, title: T("Take the quiz"),
          why: T("See which branches fit how you like to live and work. Takes about 8 minutes."),
          links: [[T("Take the quiz"), "#/quiz"]] },
        { id: "branch", title: branchName ? T("Read about the {branch}", { branch: branchName }) : T("Read about your top branch"),
          why: T("What it does, daily life, who it fits, and how boot camp works."),
          links: [[T("Branch page"), branchHref], [T("Branch vs branch"), "#/head-to-head"]] },
        { id: "types", title: T("Pick full-time or part-time"),
          why: T("Active Duty is a full-time job. The Reserve and National Guard train part-time while you work or go to school."),
          links: [[T("Service types"), "#/types"]] },
        { id: "jobs", title: T("Find jobs you'd like"),
          why: T("Every branch has hundreds of jobs. Find a few that fit you before you talk to anyone."),
          links: [[T("Job quiz"), "#/job-quiz"], [T("Full job lists"), top ? jobsLink(top) : "#/branches"]] },
        { id: "officer", title: T("Enlisted or officer?"),
          why: T("Officers need a degree and lead; enlisted members do the hands-on work. There are several routes to each."),
          links: [[T("Officer paths"), "#/officer-paths"], [T("Service academies"), "#/academies"]] },
      ],
    },
    {
      title: T("Check"),
      steps: [
        { id: "eligible", title: T("Check if you can join"),
          why: T("Age, education, citizenship, health and test score rules, per branch."),
          links: [[T("Can I join?"), "#/join"]] },
        { id: "asvab", title: T("Practice the ASVAB"),
          why: T("Your score decides which jobs you can get. Practice until the math and vocabulary feel easy."),
          links: [[T("ASVAB practice"), "#/asvab"]] },
        { id: "fitness", title: T("Check your fitness"),
          why: T("Score yourself on your branch's real fitness test and see how far you are from passing."),
          links: [[T("PT score calculator"), "#/pt-score"]] },
      ],
    },
    {
      title: T("Prepare"),
      steps: [
        { id: "prep", title: T("Start a prep plan"),
          why: T("Eight weeks of running, push-ups and core work so boot camp isn't your first workout."),
          links: [[T("8-week prep plan"), "#/prep"], [T("PT tracker"), "#/pt-log"]] },
        { id: "bootcamp", title: T("Learn what boot camp is like"),
          why: T("Week by week, plus a choose-your-path story through your branch's boot camp."),
          links: [[T("Boot camp & training"), "#/training"], [T("Graduation & family day"), "#/graduation"], [T("Boot camp story"), "#/story"]] },
        { id: "family", title: T("Talk it over with your family"),
          why: T("A page written for parents answers the questions they usually ask."),
          links: [[T("For parents"), "#/parents"]] },
      ],
    },
    {
      title: T("Know your rights"),
      steps: [
        { id: "contracts", title: T("Understand the contract"),
          why: T("Every contract is 8 years total, bonuses can be taken back, and promises only count in writing."),
          links: [[T("Contracts"), "#/contracts"]] },
        { id: "benefits", title: T("Know your pay and benefits"),
          why: T("Pay, housing, healthcare, the GI Bill and retirement in plain English."),
          links: [[T("Benefits"), "#/benefits"], [T("Ranks & pay"), "#/pay"]] },
        { id: "discharges", title: T("Know how discharges work"),
          why: T("How you leave affects benefits for life. Learn what leads to each kind."),
          links: [[T("Discharges"), "#/discharges"]] },
      ],
    },
    {
      title: T("Take action"),
      steps: [
        { id: "recruiters", title: T("Talk to more than one recruiter"),
          why: T("Bring questions, compare offers between branches, and get everything in writing. Talking is free and doesn't commit you."),
          links: [[T("Your result and recruiter questions"), "#/result"], [T("Branch pages"), "#/branches"]] },
        { id: "meps", title: T("Know what happens at MEPS"),
          why: T("The day you take the medical exam, pick your job and take the oath."),
          links: [[T("MEPS walkthrough"), "#/meps"]] },
      ],
    },
  ];
}

function renderRoadmap() {
  const saved = loadJson(ROADMAP_KEY, {});
  const phases = roadmapPhases(roadmapTopBranch());
  const steps = phases.flatMap((p) => p.steps);
  const isDone = (s) => Boolean(saved[s.id] || (s.auto && s.auto()));
  const progress = el("div", { class: "progress roadmap-progress", role: "progressbar", "aria-label": T("Roadmap progress"), "aria-valuemin": "0", "aria-valuemax": String(steps.length) }, el("div"));
  const count = el("span", { class: "muted" });
  const updateProgress = () => {
    const done = steps.filter(isDone).length;
    progress.setAttribute("aria-valuenow", String(done));
    progress.firstChild.style.width = `${(done / steps.length) * 100}%`;
    count.textContent = T("{done} of {total} steps done", { done, total: steps.length });
  };

  let n = 0;
  const phaseBlocks = phases.map((phase) => el("section", { class: "roadmap-phase" },
    el("h2", { class: "section-title" }, phase.title),
    el("ol", { class: "roadmap-steps" }, phase.steps.map((step) => {
      n += 1;
      const box = el("input", { type: "checkbox", id: `roadmap-${step.id}`, checked: isDone(step), disabled: step.auto && step.auto() });
      const item = el("li", { class: "roadmap-step" + (isDone(step) ? " done" : "") },
        el("span", { class: "roadmap-num", "aria-hidden": "true" }, String(n)),
        el("div", { class: "roadmap-body" },
          el("label", { class: "roadmap-title", for: `roadmap-${step.id}` }, box, el("strong", {}, step.title)),
          el("p", { class: "muted" }, step.why),
          el("div", { class: "roadmap-links" }, step.links.map(([label, href]) => el("a", { class: "button", href }, `${label} →`)))));
      box.addEventListener("change", () => {
        saved[step.id] = box.checked;
        saveJson(ROADMAP_KEY, saved);
        item.classList.toggle("done", box.checked);
        updateProgress();
      });
      return item;
    }))));
  updateProgress();

  app.append(el("div", { class: "fade-in" },
    el("div", { class: "eyebrow" }, T("Start here")),
    el("h1", {}, T("Thinking about the military?")),
    el("p", { class: "muted" }, T("A step-by-step path through everything worth knowing before you sign anything. Go in order or jump around; check off steps as you go.")),
    el("div", { class: "roadmap-head" }, progress, count),
    phaseBlocks,
    el("p", { class: "muted", style: "font-size:13px; margin-top:20px" }, T("Your checkmarks are saved in this browser only.")),
  ));
}

registerPage("start", {
  render: renderRoadmap,
  title: () => T("Start here"),
  tab: "quiz",
  hub: null,
});
