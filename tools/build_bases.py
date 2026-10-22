"""Builds js/bases-data.js for the installation map.

Inputs (in a research folder, default: the folder given as the first argument):
  sites.json      U.S. sites from the DoD/USDOT NTAD "Military Bases" layer
                  (FY2024), one centroid per site.
  out/part*.json  Per-site corrections keyed by NTAD OBJECTID: display name,
                  branch, component, type, description, fixed coordinates, skip.
  out/extra*.json Overseas and Coast Guard installations (not in NTAD).

Usage: python tools/build_bases.py <research folder>
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

STATES = {
    "al": "Alabama", "ak": "Alaska", "az": "Arizona", "ar": "Arkansas", "ca": "California", "co": "Colorado",
    "ct": "Connecticut", "de": "Delaware", "dc": "Washington, D.C.", "fl": "Florida", "ga": "Georgia", "hi": "Hawaii",
    "id": "Idaho", "il": "Illinois", "in": "Indiana", "ia": "Iowa", "ks": "Kansas", "ky": "Kentucky", "la": "Louisiana",
    "me": "Maine", "md": "Maryland", "ma": "Massachusetts", "mi": "Michigan", "mn": "Minnesota", "ms": "Mississippi",
    "mo": "Missouri", "mt": "Montana", "ne": "Nebraska", "nv": "Nevada", "nh": "New Hampshire", "nj": "New Jersey",
    "nm": "New Mexico", "ny": "New York", "nc": "North Carolina", "nd": "North Dakota", "oh": "Ohio", "ok": "Oklahoma",
    "or": "Oregon", "pa": "Pennsylvania", "ri": "Rhode Island", "sc": "South Carolina", "sd": "South Dakota",
    "tn": "Tennessee", "tx": "Texas", "ut": "Utah", "vt": "Vermont", "va": "Virginia", "wa": "Washington",
    "wv": "West Virginia", "wi": "Wisconsin", "wy": "Wyoming", "pr": "Puerto Rico", "gu": "Guam",
    "vi": "U.S. Virgin Islands", "as": "American Samoa", "mp": "Northern Mariana Islands",
}
BRANCH = {"usa": "army", "usar": "army", "armyNationalGuard": "army", "usn": "navy", "usnr": "navy",
          "usaf": "af", "afr": "af", "airNationalGuard": "af", "usmc": "usmc", "usmcr": "usmc"}
COMPONENT = {"usar": "reserve", "usnr": "reserve", "afr": "reserve", "usmcr": "reserve",
             "armyNationalGuard": "guard", "airNationalGuard": "guard"}
BRANCHES = {"army", "usmc", "navy", "af", "sf", "cg", "dod"}
# NTAD OBJECTIDs of Defense Department-wide sites that belong to no single
# branch: DARPA, the Mark Center, the Pentagon and the biometrics center.
DOD_WIDE = {557, 559, 560, 663}
COMPONENTS = {"active", "reserve", "guard"}
TYPES = {"base", "airfield", "naval", "training", "industrial", "research", "office", "space", "center"}


def norm(name):
    return re.sub(r"[^a-z0-9]", "", name.lower())


def is_same(extra, site):
    """True when an added entry repeats a site already on the map."""
    if norm(extra["name"]) == norm(site["n"]):
        return True
    near = abs(extra["lat"] - site["lat"]) < 0.01 and abs(extra["lng"] - site["lng"]) < 0.01
    return near and extra["branch"] == site["b"]


def main():
    src = Path(sys.argv[1])
    sites = json.loads((src / "sites.json").read_text(encoding="utf-8"))
    fixes = {}
    for part in sorted((src / "out").glob("part*.json")):
        fixes.update(json.loads(part.read_text(encoding="utf-8")))
    extra = []
    for path in sorted((src / "out").glob("extra*.json")):
        extra += json.loads(path.read_text(encoding="utf-8"))

    out, skipped, problems = [], 0, []
    for s in sites:
        fix = fixes.get(str(s["OBJECTID"]), {})
        if fix.get("skip") or (not fix and s["siteOperationalStatus"] in ("clsd", "excs")):
            skipped += 1
            continue
        comp = s["siteReportingComponent"]
        if comp not in BRANCH and "branch" not in fix:
            skipped += 1
            continue
        out.append({
            "n": fix.get("name") or s["siteName"].strip(),
            "b": "dod" if s["OBJECTID"] in DOD_WIDE else fix.get("branch") or BRANCH[comp],
            "c": fix.get("component") or COMPONENT.get(comp, "active"),
            "t": fix.get("type") or "base",
            "lat": round(fix.get("lat", s["lat"]), 4),
            "lng": round(fix.get("lng", s["lng"]), 4),
            "loc": STATES.get(s["stateNameCode"], s["stateNameCode"].upper()),
            "d": fix.get("desc", ""),
        })
    dupes = 0
    for e in extra:
        if any(is_same(e, o) for o in out):
            dupes += 1
            continue
        out.append({"n": e["name"], "b": e["branch"], "c": e.get("component", "active"), "t": e["type"],
                    "lat": round(e["lat"], 4), "lng": round(e["lng"], 4), "loc": e["country"], "d": e["desc"]})

    for site in out:
        if site["b"] not in BRANCHES or site["c"] not in COMPONENTS or site["t"] not in TYPES:
            problems.append(site["n"])
        if not (-90 <= site["lat"] <= 90 and -180 <= site["lng"] <= 180):
            problems.append(site["n"])
    if problems:
        raise SystemExit(f"bad entries: {problems[:10]}")
    out.sort(key=lambda x: x["n"])
    body = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    (ROOT / "js" / "bases-data.js").write_text(
        '"use strict";\n// Generated by tools/build_bases.py. Do not edit by hand.\n'
        f"window.BASES = {body};\n", encoding="utf-8")
    by_branch = {b: sum(1 for x in out if x["b"] == b) for b in sorted(BRANCHES)}
    print(f"{len(out)} installations ({skipped} skipped), {len(fixes)} with research, {len(extra)} extra ({dupes} duplicates dropped) | {by_branch}")
    print(f"missing descriptions: {sum(1 for x in out if not x['d'])}")


if __name__ == "__main__":
    main()
