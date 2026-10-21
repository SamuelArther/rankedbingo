"""Collects every English string that can be translated into lang/en.json.

It reads the text passed to T() (and who()) in js/*.js, and the content
objects (questions, branches, jobs and so on) from the running page, with
headless Edge. Usage: python tools/extract_strings.py
"""
import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


def literals_in_calls(src, names=("T", "who")):
    """String literals inside T(...) and who(...) calls, including ternaries."""
    out = []
    for m in re.finditer(r"(?<![\w.$])(%s)\(" % "|".join(names), src):
        depth, i, start = 1, m.end(), m.end()
        while i < len(src) and depth:
            ch = src[i]
            if ch in "\"'`":
                end = i + 1
                while end < len(src) and src[end] != ch:
                    end += 2 if src[end] == "\\" else 1
                i = end
            elif ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            i += 1
        span = src[start:i - 1]
        # Literals in the call, but not inside a nested vars object's own T() (those are found separately).
        for lit in re.finditer(r'"((?:[^"\\]|\\.)*)"', span):
            text = json.loads('"' + lit.group(1) + '"')
            if re.search(r"[A-Za-z]", text):
                out.append(text)
    return out


CONTENT_JS = r"""
() => {
  const skip = new Set(["id", "code", "color", "icon", "tr", "source", "key", "src"]);
  const out = [];
  const walk = (obj) => {
    if (Array.isArray(obj)) { obj.forEach((v) => (typeof v === "string" ? out.push(v) : v && typeof v === "object" && walk(v))); return; }
    for (const [k, v] of Object.entries(obj)) {
      if (skip.has(k)) continue;
      if (typeof v === "string") out.push(v); else if (v && typeof v === "object") walk(v);
    }
  };
  [POOL, BINGO_POOL, BRANCHES, TRAITS, INTERESTS, COMPONENTS, TRACKS, JOBS, CIVILIAN, CIVILIAN_OVERRIDES,
   INTEREST_NOTES, DETAILS, COMPONENT_DETAILS, BOOTCAMP_SQUARES, BADGES].forEach(walk);
  out.push(...Object.values(TRAIT_SHORT), ...Object.values(TRACK_LABELS));
  return out;
}
"""


def main():
    strings = []
    for path in sorted((ROOT / "js").glob("*.js")):
        if path.name in ("i18n.js", "jobs-data.js", "info-data.js"):
            continue
        strings += literals_in_calls(path.read_text(encoding="utf-8"))
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page()
        page.goto((ROOT / "index.html").as_uri())
        strings += page.evaluate(CONTENT_JS)
        browser.close()
    # Keep human text only (skip bare numbers, times and codes), deduplicated.
    keep = sorted({s for s in strings if re.search(r"[A-Za-z]{2}", s)})
    (ROOT / "lang").mkdir(exist_ok=True)
    (ROOT / "lang" / "en.json").write_text(json.dumps(keep, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(s.split()) for s in keep)
    print(f"{len(keep)} strings, {words} words -> lang/en.json")


if __name__ == "__main__":
    main()
