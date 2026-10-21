# Branch Finder

A quiz that matches you to the U.S. military branch that fits you best (Army, Marine Corps, Navy, Air Force, Space Force or Coast Guard), and to Active Duty, the Reserve or the National Guard.

**Take it:** https://samuelarther.github.io/branch-quiz/

![Results](screenshots/3-results-desktop.png)

## How it works

- 30 questions, most of them indirect: weekend trips, game picks, how you handle an order you disagree with, boot camp style, what you want after you get out.
- No answer points straight at a branch. Each one nudges up to three of 12 traits: sea, land, air, space, physical, tech, discipline, travel, home missions, combat, organization size and comfort.
- Each branch has a profile on the same traits. Your match is the cosine similarity between your leanings and each branch profile, so balanced profiles don't win by default.
- Results show your top branch, scores for all six, your trait profile, why you matched, where you don't fit, and any other branch within 10 points.
- The last five questions score Active Duty, Reserve and National Guard separately. The result is always a real option: only the Army and Air Force have a National Guard, and the Space Force has no separate Reserve, so those cases fall back to the closest option with a note.

Everything runs in one offline HTML file (`index.html`) with no dependencies or tracking.

Just for fun. Not affiliated with or endorsed by the U.S. military or any branch. Talk to recruiters before deciding anything.
