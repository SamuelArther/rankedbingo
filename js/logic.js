"use strict";

// Scoring: traits, branches, tracks, components and jobs. Every scoring
// function takes the answers plus the question set they belong to, which
// defaults to the current quiz. Shared results bring their own set.

// The questions in the current quiz, drawn from POOL by pickQuestions().
let QUESTIONS = POOL.filter((q) => q.id <= 45);

function civilianCareers(job) {
  if (CIVILIAN_OVERRIDES[job.n]) return CIVILIAN_OVERRIDES[job.n];
  // Main tags first, then secondary tags, without repeats.
  const tags = Object.entries(job.i).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  return [...new Set(tags.flatMap((k, n) => CIVILIAN[k].slice(0, n === 0 ? 3 : 1)))].slice(0, 4);
}

function interestVector(answers, qs = QUESTIONS) {
  const v = {};
  answers.forEach((idx, i) => {
    if (idx == null) return;
    for (const [k, x] of Object.entries(qs[i].options[idx].i || {})) v[k] = (v[k] || 0) + x;
  });
  return v;
}

// Ranks a branch's jobs on the chosen track. A job scores the user's interest
// in its best-matching tag, plus half credit for the next one, a quarter for
// the one after, and so on (main tags count double). So a job is driven by
// the user's strongest matching interest, extra matching tags add a bonus,
// and on a tie the more focused job wins.
function topJobs(answers, branch, track, count = 3, qs = QUESTIONS) {
  const user = interestVector(answers, qs);
  return JOBS[branch]
    .filter((j) => j.tr === track)
    .map((j, order) => {
      const parts = Object.entries(j.i).map(([k, x]) => (user[k] || 0) * (x / 2)).sort((a, b) => b - a);
      const fit = parts.reduce((a, v, n) => a + v / 2 ** n, 0);
      const shared = Object.keys(j.i).filter((k) => user[k] > 0).sort((a, b) => user[b] * j.i[b] - user[a] * j.i[a]);
      return { ...j, fit, shared, order, tags: parts.length };
    })
    .sort((a, b) => b.fit - a.fit || a.tags - b.tags || a.order - b.order)
    .slice(0, count);
}

function interestNote(answers, branch, qs = QUESTIONS) {
  const notes = INTEREST_NOTES[branch];
  if (!notes) return null;
  const user = interestVector(answers, qs);
  const top = Object.keys(user).sort((a, b) => user[b] - user[a]).slice(0, 2);
  const hit = top.find((k) => notes[k]);
  return hit ? notes[hit] : null;
}

function joinWords(words) {
  return words.length < 2 ? words.join("") : words.slice(0, -1).join(", ") + " and " + words[words.length - 1];
}

const TRAIT_IDS = Object.keys(TRAITS);

// The user's profile is the average nudge per trait. Each answer counts
// relative to the other options in its question: what you picked minus the
// average of what you could have picked. That way a question whose options
// all lean one way (say, mostly toward tech) can't tilt everyone toward the
// same branch, and random clicking averages out to no lean at all. Traits
// answered more often count more, up to a cap, so one stray answer can't
// dominate.
function profile(answers, qs = QUESTIONS) {
  const sum = {}, n = {};
  answers.forEach((idx, i) => {
    if (idx == null) return;
    const opts = qs[i].options;
    for (const t of new Set(opts.flatMap((o) => Object.keys(o.w)))) {
      const mean = opts.reduce((a, o) => a + (o.w[t] || 0), 0) / opts.length;
      sum[t] = (sum[t] || 0) + (opts[idx].w[t] || 0) - mean;
      n[t] = (n[t] || 0) + 1;
    }
  });
  const out = {};
  for (const t of TRAIT_IDS) {
    // Relative answers average out smaller than the -2..+2 option scale, so
    // they're doubled (and capped) to read on the same scale as branches.
    if (n[t]) out[t] = { value: Math.max(-2, Math.min(2, (2 * sum[t]) / n[t])), weight: Math.min(n[t], 4) };
  }
  return out;
}

// How much the match leans on direction (cosine) versus closeness (distance).
let MATCH_BLEND = 0.75;

// Mostly cosine similarity between the user's leanings and the branch profile,
// over the traits the user actually answered. Comparing direction keeps
// middle-of-the-road profiles from winning by default. A share of plain
// closeness is blended in so branches that lean the same way but by different
// amounts (like the Army and the Marines) can still be told apart.
function match(user, branch) {
  let dot = 0, uu = 0, pp = 0, gap = 0, weight = 0;
  for (const [t, u] of Object.entries(user)) {
    const p = BRANCHES[branch].traits[t];
    dot += u.weight * u.value * p;
    uu += u.weight * u.value * u.value;
    pp += u.weight * p * p;
    gap += u.weight * Math.abs(u.value - p);
    weight += u.weight;
  }
  const cos = uu && pp ? dot / Math.sqrt(uu * pp) : 0;
  const close = weight ? 1 - gap / weight / 2 : 0;
  return MATCH_BLEND * cos + (1 - MATCH_BLEND) * close;
}

function score(answers, qs = QUESTIONS) {
  const user = profile(answers, qs);
  return ORDER
    .map((b) => ({ id: b, raw: match(user, b) }))
    .map((r) => ({ ...r, pct: Math.round(((r.raw + 1) / 2) * 100) }))
    .sort((a, b) => b.raw - a.raw || ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
}

// Scores a set of options (components or tracks) stored under `field` on each
// answer, as a share of the most each option could have earned.
function categoryScore(answers, field, ids, qs = QUESTIONS) {
  const raw = Object.fromEntries(ids.map((k) => [k, 0]));
  const max = Object.fromEntries(ids.map((k) => [k, 0]));
  qs.forEach((q, i) => {
    for (const k of ids) max[k] += Math.max(0, ...q.options.map((o) => (o[field] && o[field][k]) || 0));
    const picked = answers[i] == null ? {} : q.options[answers[i]][field] || {};
    for (const k of ids) raw[k] += picked[k] || 0;
  });
  return ids
    .map((k) => ({ id: k, pct: max[k] ? Math.round((raw[k] / max[k]) * 100) : 0 }))
    .sort((a, b) => b.pct - a.pct || ids.indexOf(a.id) - ids.indexOf(b.id));
}

function componentScore(answers, qs = QUESTIONS) {
  return categoryScore(answers, "c", COMPONENT_ORDER, qs);
}

function trackScore(answers, qs = QUESTIONS) {
  return categoryScore(answers, "k", TRACK_ORDER, qs);
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

// ---------------------------------------------------------------------------
// Question sets.

// Small seeded random generator (mulberry32), so ?seed=N reproduces a quiz.
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(list, rng) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function groupOf(q) {
  if (q.options.some((o) => o.i)) return "interest";
  if (q.options.some((o) => o.k)) return "role";
  if (q.options.some((o) => o.c)) return "service";
  return "trait";
}

function traitsOf(q) {
  return [...new Set(q.options.flatMap((o) => Object.keys(o.w)))];
}

const MODES = {
  full: { trait: 29, interest: 6, role: 5, service: 5 },
  quick: { trait: 8, interest: 3, role: 2, service: 2 },
};

// Draws a quiz from the pool. Trait questions are picked greedily so every
// trait gets covered evenly, with some randomness so retakes feel fresh.
// The rest come in groups: trait questions, then job interests, role and
// service type.
function interestsOf(q) {
  return [...new Set(q.options.flatMap((o) => Object.keys(o.i || {})))];
}

// Picks `count` questions from `pool`, starting with the `always` ones, then
// greedily preferring questions that cover what's been covered least (by
// the keys `keysOf` returns), with some randomness so retakes differ.
function pickCovering(pool, count, keysOf, rng) {
  const coverage = {};
  const picked = pool.filter((q) => q.always);
  const remaining = pool.filter((q) => !q.always);
  picked.forEach((q) => keysOf(q).forEach((k) => { coverage[k] = (coverage[k] || 0) + 1; }));
  while (picked.length < count && remaining.length) {
    let best = 0, bestScore = -Infinity;
    remaining.forEach((q, i) => {
      const value = keysOf(q).reduce((a, k) => a + 1 / (1 + (coverage[k] || 0)), 0) + rng() * 0.6;
      if (value > bestScore) { bestScore = value; best = i; }
    });
    const [q] = remaining.splice(best, 1);
    keysOf(q).forEach((k) => { coverage[k] = (coverage[k] || 0) + 1; });
    picked.push(q);
  }
  return shuffled(picked, rng);
}

function pickQuestions(mode, rng) {
  const counts = MODES[mode] || MODES.full;
  const byGroup = { trait: [], interest: [], role: [], service: [] };
  for (const q of POOL) byGroup[groupOf(q)].push(q);
  return [
    ...pickCovering(byGroup.trait, counts.trait, traitsOf, rng),
    ...pickCovering(byGroup.interest, counts.interest, interestsOf, rng),
    ...pickCovering(byGroup.role, counts.role, () => ["role"], rng),
    ...pickCovering(byGroup.service, counts.service, () => ["service"], rng),
  ];
}

// Display order of each question's options. Scales keep their order.
function pickOrders(qs, rng) {
  return qs.map((q) => {
    const order = q.options.map((_, i) => i);
    return q.fixed ? order : shuffled(order, rng);
  });
}

// ---------------------------------------------------------------------------
// Share codes: three characters per question, the id in base 36 (two chars)
// plus the chosen option in base 36, or "-" for a skipped question.

function encodeAnswers(qs, answers) {
  return qs.map((q, i) => q.id.toString(36).padStart(2, "0") + (answers[i] == null ? "-" : answers[i].toString(36))).join("");
}

// Returns { qs, answers } or null if the code is malformed or unknown.
function decodeAnswers(code) {
  if (!code || code.length % 3 !== 0 || code.length > 3 * 60) return null;
  const qs = [], answers = [];
  for (let i = 0; i < code.length; i += 3) {
    const q = POOL.find((x) => x.id === parseInt(code.slice(i, i + 2), 36));
    const a = code[i + 2];
    if (!q || qs.includes(q)) return null;
    const idx = a === "-" ? null : parseInt(a, 36);
    if (idx != null && !(idx >= 0 && idx < q.options.length)) return null;
    qs.push(q);
    answers.push(idx);
  }
  return qs.length ? { qs, answers } : null;
}

