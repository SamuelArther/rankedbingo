"use strict";

// Full job lists: every enlisted, warrant and officer job per branch, with a
// page for each job. The data (js/jobs-data.js, built from official career
// sites) is large, so it's only loaded when one of these pages is opened.

// Turned on once js/jobs-data.js has the real lists.
const FULL_LIST_READY = true;

let jobsLoading = null;

function ensureJobsData() {
  if (window.FULL_JOBS) return Promise.resolve();
  if (!jobsLoading) {
    jobsLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "js/jobs-data.js";
      s.onload = resolve;
      s.onerror = () => { jobsLoading = null; reject(new Error("load failed")); };
      document.head.append(s);
    });
  }
  return jobsLoading;
}

// Renders `fn` once the job data is available, with a placeholder meanwhile.
function withJobs(fn) {
  if (window.FULL_JOBS) { fn(); return; }
  app.append(el("p", { class: "muted" }, "Loading the job list..."));
  ensureJobsData()
    .then(() => { if (route.page === "jobs" || route.page === "job") render(); })
    .catch(() => { app.replaceChildren(el("p", { class: "muted" }, "Couldn't load the job list. Check your connection and try again.")); });
}

const TRACK_LABELS = { enlisted: "Enlisted", warrant: "Warrant officer", officer: "Officer" };

function jobsFor(branch) {
  return (window.FULL_JOBS && window.FULL_JOBS[branch]) || [];
}

function jobsLink(branch, track = "enlisted") {
  return `#/jobs/${branch}?track=${track}`;
}

function jobLink(branch, job) {
  return `#/job/${branch}/${encodeURIComponent(job.id)}`;
}

// Common civilian careers for a full-list job, from its career field.
const CATEGORY_INTERESTS = [
  [/medic|health|nurs|dental|hospital|corps(man)?\b|pharm|surg|physician/i, "medical"],
  [/special (op|warfare|forces|tactics)|pararescue|seal|recon|raider|combat control|survival/i, "elite"],
  [/cyber|network|information tech|computer|it\b|data/i, "cyber"],
  [/intel|cryptolog|signals intel|linguist|counterintel/i, "intel"],
  [/aviat|aircraft|flight|pilot|air traffic|aircrew|avionic/i, "aviation"],
  [/infantry|combat arms|armor|cavalry|artillery|fires|rifle|machine gun|mortar/i, "infantry"],
  [/weapon|ordnance|munition|gunner|armament|explosive/i, "weapons"],
  [/police|security|law|enforcement|military police|master-at-arms|legal|jag|judge/i, "law"],
  [/engineer|construct|seabee|builder|civil|carpent|electric|plumb|utilit/i, "build"],
  [/mechanic|maintenance|machin|repair|vehicle|engine|nuclear|propulsion|hull/i, "mechanic"],
  [/logistic|supply|transport|fuel|food|culinary|finance|admin|human resource|personnel|acquisition/i, "logistics"],
  [/signal|communicat|radio|radar|operations specialist|space|satellite|electronic/i, "comms"],
];

function jobInterest(job) {
  const text = `${job.category} ${job.title}`;
  const hit = CATEGORY_INTERESTS.find(([re]) => re.test(text));
  return hit ? hit[1] : null;
}

function renderJobs() {
  withJobs(() => {
    const b = route.branch, info = BRANCHES[b];
    const all = jobsFor(b);
    const tracks = TRACK_ORDER_FULL.filter((t) => all.some((j) => j.track === t));
    const track = tracks.includes(route.jobTrack) ? route.jobTrack : tracks[0];
    const jobs = all.filter((j) => j.track === track);
    const search = el("input", { class: "text-input", type: "search", placeholder: `Search ${jobs.length} ${TRACK_LABELS[track].toLowerCase()} jobs (title, code or field)`, "aria-label": "Search jobs" });
    const list = el("div");

    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const shown = jobs.filter((j) => !q || `${j.code || ""} ${j.title} ${j.category} ${j.description}`.toLowerCase().includes(q));
      const groups = {};
      for (const j of shown) (groups[j.category || "Other"] ||= []).push(j);
      list.replaceChildren(
        shown.length ? null : el("p", { class: "muted" }, "No jobs match that search."),
        ...Object.keys(groups).sort().map((cat) => el("div", { class: "job-group" },
          el("div", { class: "section-title" }, `${cat} (${groups[cat].length})`),
          el("div", { class: "job-list" }, groups[cat].map((j) => el("a", { class: "job-row", href: jobLink(b, j), style: `--hero:${info.color}` },
            j.code ? el("span", { class: "job-code" }, j.code) : null,
            el("span", { class: "job-row-text" }, el("strong", {}, j.title), el("span", { class: "muted" }, j.description))))))));
    };
    search.addEventListener("input", draw);
    draw();

    app.append(el("div", { class: "fade-in" },
      el("a", { class: "back-link", href: branchLink(b) }, `← ${info.name}`),
      el("div", { class: "result-hero", style: `--hero:${info.color}; margin-top:12px` },
        el("h1", {}, `${info.name} jobs`),
        el("div", { class: "pct" }, `${all.length} JOBS`)),
      el("div", { class: "seg", role: "group", "aria-label": "Role" }, tracks.map((t) =>
        el("a", { class: "seg-item" + (t === track ? " active" : ""), href: jobsLink(b, t) }, `${TRACK_LABELS[t]} (${all.filter((j) => j.track === t).length})`))),
      el("div", { style: "margin:14px 0" }, search),
      list,
      el("p", { class: "muted", style: "font-size:13px; margin-top:20px" },
        `Built from the ${info.name}'s official career listings in October 2026. Jobs are added, renamed and retired over time, and openings depend on test scores, physical standards and needs, so confirm with a recruiter.`),
    ));
  });
}

function renderJob() {
  withJobs(() => {
    const b = route.branch, info = BRANCHES[b];
    const job = jobsFor(b).find((j) => j.id === route.jobId);
    if (!job) {
      app.append(el("div", { class: "card" }, el("h1", {}, "Job not found"), el("a", { href: jobsLink(b) }, `See all ${info.name} jobs →`)));
      return;
    }
    const interest = jobInterest(job);
    const related = jobsFor(b).filter((j) => j.category === job.category && j.id !== job.id && j.track === job.track).slice(0, 6);
    app.append(el("div", { class: "fade-in" },
      el("a", { class: "back-link", href: jobsLink(b, job.track) }, `← All ${info.name} ${TRACK_LABELS[job.track].toLowerCase()} jobs`),
      el("div", { class: "result-hero", style: `--hero:${info.color}; margin-top:12px` },
        el("div", { class: "pct" }, [info.name.toUpperCase(), TRACK_LABELS[job.track].toUpperCase(), job.code].filter(Boolean).join(" · ")),
        el("h1", { style: "margin-top:8px" }, job.title),
        el("p", { class: "muted", style: "margin:0" }, job.category)),
      el("div", { class: "section-title" }, "What you'd do"),
      el("p", {}, job.description || "No description yet. See the official page for details."),
      job.unverified ? el("div", { class: "note" }, "We couldn't confirm this job on an official page, so check with a recruiter that it's still open.") : null,
      job.training ? [el("div", { class: "section-title" }, "Training"), el("p", {}, job.training)] : null,
      el("div", { class: "section-title" }, "Getting there"),
      el("p", {}, job.track === "enlisted"
        ? `${DETAILS[b].bootcamp.name} (${DETAILS[b].bootcamp.length.toLowerCase()}), then job training: ${DETAILS[b].tech.name}.`
        : job.track === "warrant"
          ? "Warrant officers are technical experts. Most are selected from experienced enlisted members; some programs (like Army aviation) take civilians directly."
          : DETAILS[b].officer),
      interest ? [el("div", { class: "section-title" }, "Common civilian careers"),
        el("p", {}, CIVILIAN[interest].join(", ") + "."),
        el("p", { class: "muted", style: "font-size:13px" }, "Based on the career field. Some need extra licenses or school.")] : null,
      related.length ? [el("div", { class: "section-title" }, `More in ${job.category}`),
        el("div", { class: "job-list" }, related.map((j) => el("a", { class: "job-row", href: jobLink(b, j), style: `--hero:${info.color}` },
          j.code ? el("span", { class: "job-code" }, j.code) : null,
          el("span", { class: "job-row-text" }, el("strong", {}, j.title)))))] : null,
      el("div", { class: "actions" },
        job.source ? el("a", { class: "button", href: job.source, target: "_blank", rel: "noopener" }, "Official page ↗") : null,
        el("a", { class: "button", href: branchLink(b, job.track === "enlisted" ? "enlisted" : "officer") }, `${info.name} overview`)),
      el("p", { class: "muted", style: "font-size:13px; margin-top:16px" }, "Descriptions are summaries in plain English. Check the official page and a recruiter for current details."),
    ));
  });
}

const TRACK_ORDER_FULL = ["enlisted", "warrant", "officer"];
