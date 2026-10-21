"use strict";

// Scoring: traits, branches, tracks, components and jobs.

function civilianCareers(job) {
  if (CIVILIAN_OVERRIDES[job.n]) return CIVILIAN_OVERRIDES[job.n];
  // Main tags first, then secondary tags, without repeats.
  const tags = Object.entries(job.i).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  return [...new Set(tags.flatMap((k, n) => CIVILIAN[k].slice(0, n === 0 ? 3 : 1)))].slice(0, 4);
}

function interestVector(answers) {
  const v = {};
  answers.forEach((idx, i) => {
    if (idx == null) return;
    for (const [k, x] of Object.entries(QUESTIONS[i].options[idx].i || {})) v[k] = (v[k] || 0) + x;
  });
  return v;
}

// Ranks a branch's jobs on the chosen track. A job scores the user's interest
// in its best-matching tag, plus half credit for the next one, a quarter for
// the one after, and so on (main tags count double). So a job is driven by
// the user's strongest matching interest, extra matching tags add a bonus,
// and on a tie the more focused job wins.
function topJobs(answers, branch, track, count = 3) {
  const user = interestVector(answers);
  return JOBS[branch]
    .filter((j) => j.tr === track)
    .map((j, order) => {
      const parts = Object.entries(j.i).map(([k, x]) => (user[k] || 0) * (x / 2)).sort((a, b) => b - a);
      const fit = parts.reduce((a, v, n) => a + v / 2 ** n, 0);
      const shared = Object.keys(j.i).filter((k) => user[k]).sort((a, b) => user[b] * j.i[b] - user[a] * j.i[a]);
      return { ...j, fit, shared, order, tags: parts.length };
    })
    .sort((a, b) => b.fit - a.fit || a.tags - b.tags || a.order - b.order)
    .slice(0, count);
}

function interestNote(answers, branch) {
  const notes = INTEREST_NOTES[branch];
  if (!notes) return null;
  const user = interestVector(answers);
  const top = Object.keys(user).sort((a, b) => user[b] - user[a]).slice(0, 2);
  const hit = top.find((k) => notes[k]);
  return hit ? notes[hit] : null;
}

function joinWords(words) {
  return words.length < 2 ? words.join("") : words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
}

const TRAIT_IDS = Object.keys(TRAITS);

// The user's profile is the average nudge per trait. Traits answered more
// often count more, up to a cap, so one stray answer can't dominate.
function profile(answers) {
  const sum = {}, n = {};
  answers.forEach((idx, i) => {
    if (idx == null) return;
    for (const [t, v] of Object.entries(QUESTIONS[i].options[idx].w)) {
      sum[t] = (sum[t] || 0) + v;
      n[t] = (n[t] || 0) + 1;
    }
  });
  const out = {};
  for (const t of TRAIT_IDS) {
    if (n[t]) out[t] = { value: sum[t] / n[t], weight: Math.min(n[t], 4) };
  }
  return out;
}

// Cosine similarity between the user's leanings and the branch profile, over
// the traits the user actually answered. Comparing direction rather than
// distance keeps middle-of-the-road profiles from winning by default.
function match(user, branch) {
  let dot = 0, uu = 0, pp = 0;
  for (const [t, u] of Object.entries(user)) {
    const p = BRANCHES[branch].traits[t];
    dot += u.weight * u.value * p;
    uu += u.weight * u.value * u.value;
    pp += u.weight * p * p;
  }
  return uu && pp ? dot / Math.sqrt(uu * pp) : 0;
}

function score(answers) {
  const user = profile(answers);
  return ORDER
    .map((b) => ({ id: b, raw: match(user, b) }))
    .map((r) => ({ ...r, pct: Math.round(((r.raw + 1) / 2) * 100) }))
    .sort((a, b) => b.raw - a.raw || ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
}

// Scores a set of options (components or tracks) stored under `field` on each
// answer, as a share of the most each option could have earned.
function categoryScore(answers, field, ids) {
  const raw = Object.fromEntries(ids.map((k) => [k, 0]));
  const max = Object.fromEntries(ids.map((k) => [k, 0]));
  QUESTIONS.forEach((q, i) => {
    for (const k of ids) max[k] += Math.max(0, ...q.options.map((o) => (o[field] && o[field][k]) || 0));
    const picked = answers[i] == null ? {} : q.options[answers[i]][field] || {};
    for (const k of ids) raw[k] += picked[k] || 0;
  });
  return ids
    .map((k) => ({ id: k, pct: max[k] ? Math.round((raw[k] / max[k]) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct || ids.indexOf(a.id) - ids.indexOf(b.id));
}

function componentScore(answers) {
  return categoryScore(answers, "c", COMPONENT_ORDER);
}

function trackScore(answers) {
  return categoryScore(answers, "k", TRACK_ORDER);
}

// Turns a branch and component into a real service option. Only the Army and
// Air Force have a National Guard, and the Space Force has no separate
// Reserve or Guard, so those combinations come with a note instead.
function serviceOption(branch, component) {
  const name = BRANCHES[branch].name;
  if (component === "active") return { title: `Active Duty ${name}` };
  if (branch === "sf") {
    return {
      title: "Space Force (part-time)",
      note: "The Space Force has no separate Reserve or National Guard. A law passed in late 2023 lets it offer part-time service inside the Space Force itself, and it selected its first part-time Guardians (transferring from the Air Force Reserve) in 2026. Spots are limited, so ask a recruiter. The Air Force Reserve and Air National Guard are the closest part-time alternatives.",
    };
  }
  if (component === "reserve") return { title: `${name} Reserve` };
  if (branch === "army") return { title: "Army National Guard" };
  if (branch === "af") return { title: "Air National Guard" };
  return {
    title: `${name} Reserve`,
    note: `The ${name} doesn't have a National Guard, so its Reserve is the closest part-time option. If serving your own state matters most to you, look at the Army National Guard or Air National Guard too.`,
  };
}

function phrase(t, v) {
  return v > 0 ? TRAITS[t].pos : TRAITS[t].neg;
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

// Strong traits the user shares with the branch, strongest first.
function fits(user, branch) {
  const p = BRANCHES[branch].traits;
  return Object.entries(user)
    .filter(([t, u]) => Math.abs(u.value) >= 0.75 && Math.abs(p[t]) >= 1 && Math.sign(u.value) === Math.sign(p[t]))
    .sort((a, b) => b[1].weight * Math.abs(b[1].value) - a[1].weight * Math.abs(a[1].value))
    .map(([t, u]) => phrase(t, u.value));
}

// Places where the branch pulls the opposite way from the user.
function clashes(user, branch) {
  const p = BRANCHES[branch].traits;
  return Object.entries(user)
    .map(([t, u]) => ({ t, u, gap: Math.abs(u.value - p[t]) }))
    .filter(({ t, u, gap }) => gap >= 2 && Math.abs(p[t]) >= 1 && Math.abs(u.value) >= 0.5 && Math.sign(u.value) !== Math.sign(p[t]))
    .sort((a, b) => b.gap * b.u.weight - a.gap * a.u.weight)
    .map(({ t, u }) => `The ${BRANCHES[branch].name} leans toward ${phrase(t, BRANCHES[branch].traits[t])}, but you leaned toward ${phrase(t, u.value)}.`);
}
