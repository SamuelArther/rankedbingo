# Ranked Bingo

A quiz that matches you to the U.S. military branch that fits you best (Army, Marine Corps, Navy, Air Force, Space Force or Coast Guard), your top jobs in it, enlisted or officer, and Active Duty, the Reserve or the National Guard.

**Take it:** https://samuelarther.github.io/rankedbingo/

![Results](screenshots/3-results-desktop.png)

## How it works

- 45 questions, most of them indirect: weekend trips, game picks, how you handle an order you disagree with, boot camp style, what you want after you get out.
- Any question can be skipped with "None of these fit me". You need at least 10 answers to get a result.
- No answer points straight at a branch. Each one nudges up to three of 12 traits: sea, land, air, space, physical, tech, discipline, travel, home missions, combat, organization size and comfort.
- Each branch has a profile on the same traits. Your match is the cosine similarity between your leanings and each branch profile, so balanced profiles don't win by default.
- Results show your top branch, scores for all six, your trait profile, why you matched, where you don't fit, and any other branch within 10 points.
- Six job-interest questions (medicine, construction, machines, cyber, intel, law enforcement, aviation, special operations and more) pick your top 3 roles from about 100 jobs across the six branches, such as "Navy · Enlisted · Seabee: Builder". Each role lists civilian careers it can lead to, and close-match branches show their best role too.
- Five role questions score enlisted vs officer, and five service-type questions score Active Duty, Reserve and National Guard.
- The final pick is always a real option, like "Air National Guard, Enlisted". Only the Army and Air Force have a National Guard, and the Space Force has no separate Reserve, so those cases fall back to the closest option with a note.

## Explore

Besides the quiz, the site has:

- **Branches:** a page per branch covering what it does, what life is like, who it fits, and quick facts. A path picker (enlisted or officer, and Active Duty, Reserve or National Guard) explains that path step by step and lists example jobs with their training.
- **Service types:** Active Duty, Reserve and National Guard explained, plus a table of which branch has what.
- **Boot camp & training:** how enlistment works (recruiter, MEPS, boot camp, job training), then each branch's boot camp, job school and officer routes.

Training facts were checked against official branch recruiting and military sites in October 2026. They change over time, so confirm with a recruiter.

Add `?debug` to the URL to see what each answer scores while playtesting.

Everything runs in one offline HTML file (`index.html`) with no dependencies or tracking.

Just for fun. Not affiliated with or endorsed by the U.S. military or any branch. Talk to recruiters before deciding anything.
