"use strict";
// Where people in each career field are commonly stationed (typical, not guaranteed). Rules are checked in order; first match wins.
window.F_CAREERS_BASES = {
 "checked": "October 2026",
 "army": [
  {
   "id": "special-forces",
   "label": "Special Forces",
   "test": "^(18[A-Z]|180A) ",
   "track": null,
   "note": "Green Berets serve in five active Special Forces groups, each with a home post, after training near Fort Bragg.",
   "bases": [
    {
     "n": "Fort Bragg",
     "why": "Home of Army Special Operations Command, 1st Special Forces Command and the 3rd Special Forces Group"
    },
    {
     "n": "Camp Mackall",
     "why": "Where the Special Forces Qualification Course is held, next to Fort Bragg"
    },
    {
     "n": "Fort Campbell",
     "why": "Home of the 5th Special Forces Group"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Home of the 1st Special Forces Group"
    },
    {
     "n": "Fort Carson",
     "why": "Home of the 10th Special Forces Group"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Home of the 7th Special Forces Group"
    },
    {
     "n": "Torii Station (U.S. Army Garrison Okinawa)",
     "why": "A 1st Special Forces Group battalion is based here in Okinawa"
    },
    {
     "n": "Panzer Kaserne (Böblingen)",
     "why": "A 10th Special Forces Group battalion is based here near Stuttgart"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Special_Forces",
    "https://en.wikipedia.org/wiki/1st_Special_Forces_Command_(Airborne)"
   ]
  },
  {
   "id": "psyop-ca",
   "label": "Psychological operations and civil affairs",
   "test": "^(37|38)[A-Z] ",
   "track": null,
   "note": "Active-duty psychological operations and civil affairs units are concentrated at Fort Bragg, with some soldiers on theater special operations staffs.",
   "bases": [
    {
     "n": "Fort Bragg",
     "why": "Home of the 4th and 8th Psychological Operations Groups and the 95th Civil Affairs Brigade"
    },
    {
     "n": "MacDill Air Force Base",
     "why": "U.S. Special Operations Command and Central Command headquarters"
    },
    {
     "n": "Patch Barracks",
     "why": "Special Operations Command Europe headquarters"
    },
    {
     "n": "Camp H.M. Smith",
     "why": "Special Operations Command Pacific headquarters"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/4th_Psychological_Operations_Group",
    "https://en.wikipedia.org/wiki/95th_Civil_Affairs_Brigade"
   ]
  },
  {
   "id": "infantry",
   "label": "Infantry",
   "test": "^11[A-Z] ",
   "track": null,
   "note": "Infantry soldiers serve in brigade combat teams, which are spread across the Army's big division posts.",
   "bases": [
    {
     "n": "Fort Bragg",
     "why": "Home of the 82nd Airborne Division and XVIII Airborne Corps"
    },
    {
     "n": "Fort Campbell",
     "why": "Home of the 101st Airborne Division (Air Assault)"
    },
    {
     "n": "Fort Drum",
     "why": "Home of the 10th Mountain Division"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Home of I Corps, the 7th Infantry Division and Stryker brigades"
    },
    {
     "n": "Fort Benning",
     "why": "Infantry school, Ranger school and the 75th Ranger Regiment headquarters"
    },
    {
     "n": "Fort Carson",
     "why": "Home of the 4th Infantry Division"
    },
    {
     "n": "Fort Wainwright",
     "why": "Home of an 11th Airborne Division brigade in Alaska"
    },
    {
     "n": "Joint Base Elmendorf-Richardson",
     "why": "Home of the 11th Airborne Division's paratrooper brigade"
    },
    {
     "n": "Caserma Del Din",
     "why": "Home of the 173rd Airborne Brigade in Vicenza, Italy"
    },
    {
     "n": "Fort Polk",
     "why": "Home of the Joint Readiness Training Center and its infantry units"
    },
    {
     "n": "Fort Hood",
     "why": "Home of the 1st Cavalry Division, whose armored brigades include infantry"
    },
    {
     "n": "Fort Stewart",
     "why": "Home of the 3rd Infantry Division"
    },
    {
     "n": "Schofield Barracks",
     "why": "Home of the 25th Infantry Division in Hawaii"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Divisions_of_the_United_States_Army",
    "https://home.army.mil/benning/"
   ]
  },
  {
   "id": "armor",
   "label": "Armor and cavalry",
   "test": "^19[A-Z] ",
   "track": null,
   "note": "Tank, Bradley and scout crews serve mostly with armored and cavalry units at large posts with big maneuver ranges.",
   "bases": [
    {
     "n": "Fort Hood",
     "why": "Home of III Corps and the 1st Cavalry Division"
    },
    {
     "n": "Fort Bliss",
     "why": "Home of the 1st Armored Division"
    },
    {
     "n": "Fort Stewart",
     "why": "Home of the 3rd Infantry Division"
    },
    {
     "n": "Fort Carson",
     "why": "Home of the 4th Infantry Division"
    },
    {
     "n": "Fort Riley",
     "why": "Home of the 1st Infantry Division"
    },
    {
     "n": "Fort Benning",
     "why": "Armor school and Maneuver Center of Excellence"
    },
    {
     "n": "Rose Barracks (Vilseck)",
     "why": "Home of the 2nd Cavalry Regiment in Germany"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Cavalry scouts serve in its Stryker brigades"
    },
    {
     "n": "Camp Humphreys (USAG Humphreys)",
     "why": "Rotational armored brigades and the 2nd Infantry Division in Korea"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Divisions_of_the_United_States_Army",
    "https://en.wikipedia.org/wiki/2nd_Cavalry_Regiment_(United_States)"
   ]
  },
  {
   "id": "field-artillery",
   "label": "Field artillery",
   "test": "^(13[A-Z]|131A) ",
   "track": null,
   "note": "Artillery soldiers train at Fort Sill and then join division and field artillery brigades at the big posts.",
   "bases": [
    {
     "n": "Fort Sill",
     "why": "Field Artillery School and the 75th Field Artillery Brigade"
    },
    {
     "n": "Fort Bragg",
     "why": "Home of the 18th Field Artillery Brigade and 82nd Airborne artillery"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Home of the 17th Field Artillery Brigade"
    },
    {
     "n": "Grafenwöhr Training Area (Tower Barracks)",
     "why": "Home of the 41st Field Artillery Brigade in Germany"
    },
    {
     "n": "Fort Hood",
     "why": "Division artillery of the 1st Cavalry Division"
    },
    {
     "n": "Fort Campbell",
     "why": "Division artillery of the 101st Airborne Division"
    },
    {
     "n": "Fort Carson",
     "why": "Division artillery of the 4th Infantry Division"
    },
    {
     "n": "Fort Bliss",
     "why": "Division artillery of the 1st Armored Division"
    },
    {
     "n": "Fort Stewart",
     "why": "Division artillery of the 3rd Infantry Division"
    },
    {
     "n": "Fort Riley",
     "why": "Division artillery of the 1st Infantry Division"
    }
   ],
   "sources": [
    "https://home.army.mil/sill/",
    "https://en.wikipedia.org/wiki/Divisions_of_the_United_States_Army"
   ]
  },
  {
   "id": "air-defense",
   "label": "Air and missile defense",
   "test": "^(14[A-Z]|140[A-Z]|94[ST]) ",
   "track": null,
   "note": "Patriot, Avenger and other air defense units sit at a handful of posts in the U.S. and at key spots in Europe and Asia.",
   "bases": [
    {
     "n": "Fort Bliss",
     "why": "Home of the 32nd Army Air and Missile Defense Command and the 11th ADA Brigade"
    },
    {
     "n": "Fort Sill",
     "why": "Air Defense Artillery School and the 31st ADA Brigade"
    },
    {
     "n": "Fort Bragg",
     "why": "Home of the 108th ADA Brigade"
    },
    {
     "n": "Fort Hood",
     "why": "Home of the 69th ADA Brigade"
    },
    {
     "n": "Sembach Kaserne",
     "why": "Home of the 10th Army Air and Missile Defense Command and 52nd ADA Brigade"
    },
    {
     "n": "Osan Air Base",
     "why": "Home of the 35th ADA Brigade in Korea"
    },
    {
     "n": "Kadena Air Base",
     "why": "A Patriot battalion (1-1 ADA) is based here in Okinawa"
    },
    {
     "n": "Fort Shafter",
     "why": "Home of the 94th Army Air and Missile Defense Command"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/32nd_Army_Air_and_Missile_Defense_Command",
    "https://en.wikipedia.org/wiki/10th_Army_Air_and_Missile_Defense_Command"
   ]
  },
  {
   "id": "aviation",
   "label": "Aviation",
   "test": "^(15[A-Z]|15[0-5][A-Z]|94[DR]|67J) ",
   "track": null,
   "note": "Pilots and aviation maintainers train at Fort Rucker, then join combat aviation brigades at the division posts.",
   "bases": [
    {
     "n": "Fort Rucker",
     "why": "Aviation Center of Excellence, where Army pilots and many maintainers train"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Combat Aviation Brigade and the 160th Special Operations Aviation Regiment"
    },
    {
     "n": "Fort Hood",
     "why": "1st Cavalry Division Combat Aviation Brigade"
    },
    {
     "n": "Fort Bragg",
     "why": "82nd Combat Aviation Brigade"
    },
    {
     "n": "Fort Drum",
     "why": "10th Mountain Division Combat Aviation Brigade"
    },
    {
     "n": "Fort Carson",
     "why": "4th Combat Aviation Brigade"
    },
    {
     "n": "Hunter Army Airfield",
     "why": "3rd Infantry Division Combat Aviation Brigade"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "16th Combat Aviation Brigade"
    },
    {
     "n": "Katterbach Kaserne (USAG Ansbach)",
     "why": "12th Combat Aviation Brigade in Germany"
    },
    {
     "n": "Camp Humphreys (USAG Humphreys)",
     "why": "2nd Combat Aviation Brigade in Korea"
    }
   ],
   "sources": [
    "https://home.army.mil/rucker/",
    "https://en.wikipedia.org/wiki/Combat_Aviation_Brigade"
   ]
  },
  {
   "id": "cbrn-eod",
   "label": "Chemical defense (CBRN) and bomb disposal (EOD)",
   "test": "^(74[A-Z]|740A|89[DE]) ",
   "track": null,
   "note": "CBRN and EOD soldiers train at specialist schools, then serve in CBRN and EOD units at a few big posts.",
   "bases": [
    {
     "n": "Fort Leonard Wood",
     "why": "CBRN School, where chemical defense soldiers train"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Naval School Explosive Ordnance Disposal, where all services' EOD techs train"
    },
    {
     "n": "Aberdeen Proving Ground",
     "why": "Home of the 20th CBRNE Command"
    },
    {
     "n": "Fort Campbell",
     "why": "Home of the 52nd Ordnance Group (EOD)"
    },
    {
     "n": "Fort Carson",
     "why": "Home of the 71st Ordnance Group (EOD)"
    },
    {
     "n": "Fort Hood",
     "why": "Home of the 48th Chemical Brigade"
    },
    {
     "n": "Fort Bragg",
     "why": "CBRN and EOD units supporting XVIII Airborne Corps"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "CBRN and EOD units supporting I Corps"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/20th_CBRNE_Command",
    "https://home.army.mil/wood/"
   ]
  },
  {
   "id": "medical",
   "label": "Medicine and health care",
   "test": "^(6[0-8][A-Z]|6[47]0A|7[0-3][A-Z]) ",
   "track": null,
   "note": "Army medical people work at Army medical centers and hospitals, which sit on the biggest posts, plus research labs.",
   "bases": [
    {
     "n": "Joint Base San Antonio",
     "why": "Brooke Army Medical Center and the Medical Center of Excellence at Fort Sam Houston"
    },
    {
     "n": "Naval Support Activity Bethesda",
     "why": "Walter Reed National Military Medical Center"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Madigan Army Medical Center"
    },
    {
     "n": "Fort Bragg",
     "why": "Womack Army Medical Center"
    },
    {
     "n": "Fort Hood",
     "why": "Carl R. Darnall Army Medical Center"
    },
    {
     "n": "Fort Bliss",
     "why": "William Beaumont Army Medical Center"
    },
    {
     "n": "Tripler Army Medical Center",
     "why": "The Army's main hospital in Hawaii"
    },
    {
     "n": "Landstuhl Regional Medical Center",
     "why": "The largest U.S. military hospital overseas, in Germany"
    },
    {
     "n": "Fort Detrick",
     "why": "Army medical research labs, including USAMRIID"
    },
    {
     "n": "Fort Campbell",
     "why": "Blanchfield Army Community Hospital"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Brooke_Army_Medical_Center",
    "https://en.wikipedia.org/wiki/Madigan_Army_Medical_Center"
   ]
  },
  {
   "id": "cyber-signal",
   "label": "Cyber, signal and IT",
   "test": "^(17[A-Z]|170[A-Z]|25[A-Z]|255[A-Z]|26[A-Z]|28A|280A|94[EFM]|30A) ",
   "track": null,
   "note": "Cyber and signal soldiers cluster at Fort Gordon and Fort Meade, and signal units also serve at every large post.",
   "bases": [
    {
     "n": "Fort Gordon",
     "why": "Army Cyber Command headquarters and the Cyber Center of Excellence"
    },
    {
     "n": "Fort Meade",
     "why": "U.S. Cyber Command and the National Security Agency"
    },
    {
     "n": "Fort Huachuca",
     "why": "Network Enterprise Technology Command headquarters"
    },
    {
     "n": "Fort Bragg",
     "why": "Signal and cyber units supporting XVIII Airborne Corps"
    },
    {
     "n": "Fort Hood",
     "why": "Signal units supporting III Corps"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Signal units supporting I Corps"
    },
    {
     "n": "Lucius D. Clay Kaserne (USAG Wiesbaden)",
     "why": "2nd Theater Signal Brigade and U.S. Army Europe and Africa headquarters"
    },
    {
     "n": "Camp Humphreys (USAG Humphreys)",
     "why": "1st Signal Brigade in Korea"
    },
    {
     "n": "Fort Shafter",
     "why": "311th Signal Command for the Pacific"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Army cyber and signals units working with NSA Texas"
    }
   ],
   "sources": [
    "https://www.arcyber.army.mil/",
    "https://home.army.mil/gordon/"
   ]
  },
  {
   "id": "intelligence",
   "label": "Military intelligence",
   "test": "^(34A|35[A-Z]|35[0-3][A-Z]) ",
   "track": null,
   "note": "Intelligence soldiers train at Fort Huachuca, then serve with combat units or at national intelligence centers.",
   "bases": [
    {
     "n": "Fort Huachuca",
     "why": "Intelligence Center of Excellence, where Army intel soldiers train"
    },
    {
     "n": "Fort Belvoir",
     "why": "Army Intelligence and Security Command headquarters"
    },
    {
     "n": "Fort Meade",
     "why": "National Security Agency and the 780th Military Intelligence Brigade"
    },
    {
     "n": "Fort Gordon",
     "why": "NSA Georgia and Army military intelligence units"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "NSA Texas and the 470th Military Intelligence Brigade"
    },
    {
     "n": "Field Station Kunia",
     "why": "NSA Hawaii and Army signals intelligence units"
    },
    {
     "n": "Fort Bragg",
     "why": "525th Theater Military Intelligence Brigade"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "201st Expeditionary Military Intelligence Brigade"
    },
    {
     "n": "Lucius D. Clay Kaserne (USAG Wiesbaden)",
     "why": "66th Military Intelligence Brigade in Germany"
    },
    {
     "n": "Presidio of Monterey",
     "why": "Defense Language Institute, where linguists learn their languages"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Intelligence_and_Security_Command",
    "https://home.army.mil/huachuca/"
   ]
  },
  {
   "id": "engineers",
   "label": "Engineers and construction",
   "test": "^(12[A-Z]|12[05][A-Z]) ",
   "track": null,
   "note": "Engineers train at Fort Leonard Wood and then serve in engineer brigades and battalions at the large posts.",
   "bases": [
    {
     "n": "Fort Leonard Wood",
     "why": "Engineer School, where Army engineers train"
    },
    {
     "n": "Fort Bragg",
     "why": "Home of the 20th Engineer Brigade"
    },
    {
     "n": "Fort Hood",
     "why": "Home of the 36th Engineer Brigade"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Home of the 555th Engineer Brigade"
    },
    {
     "n": "Fort Campbell",
     "why": "Engineer battalions of the 101st Airborne Division"
    },
    {
     "n": "Fort Drum",
     "why": "Engineer battalions of the 10th Mountain Division"
    },
    {
     "n": "Fort Belvoir",
     "why": "Home of the 249th Engineer Battalion (Prime Power)"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "Army engineer dive units are based at Fort Eustis"
    },
    {
     "n": "Fort Bliss",
     "why": "Engineer units of the 1st Armored Division"
    },
    {
     "n": "Fort Stewart",
     "why": "Engineer units of the 3rd Infantry Division"
    }
   ],
   "sources": [
    "https://home.army.mil/wood/",
    "https://en.wikipedia.org/wiki/United_States_Army_Corps_of_Engineers"
   ]
  },
  {
   "id": "maintenance",
   "label": "Mechanics and equipment maintenance",
   "test": "^(91[A-Z]|9[14]\\d[A-Z]|94[A-Z]|390A) ",
   "track": null,
   "note": "Mechanics and repairers go wherever the vehicles and weapons are, so they mostly serve at the big division posts.",
   "bases": [
    {
     "n": "Fort Hood",
     "why": "Large armored force with many maintenance units"
    },
    {
     "n": "Fort Bliss",
     "why": "1st Armored Division vehicles and air defense systems"
    },
    {
     "n": "Fort Stewart",
     "why": "3rd Infantry Division armored vehicles"
    },
    {
     "n": "Fort Carson",
     "why": "4th Infantry Division vehicles"
    },
    {
     "n": "Fort Riley",
     "why": "1st Infantry Division vehicles"
    },
    {
     "n": "Fort Bragg",
     "why": "XVIII Airborne Corps and 82nd Airborne equipment"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Airborne Division equipment"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Stryker vehicles and I Corps equipment"
    },
    {
     "n": "Fort Lee",
     "why": "Ordnance School, where many Army mechanics train"
    },
    {
     "n": "Redstone Arsenal",
     "why": "Army Materiel Command and missile and aviation maintenance training"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Ordnance_Corps",
    "https://en.wikipedia.org/wiki/Divisions_of_the_United_States_Army"
   ]
  },
  {
   "id": "transportation",
   "label": "Transportation and watercraft",
   "test": "^(88[A-Z]|88[0-2]A) ",
   "track": null,
   "note": "Truck, cargo and movement soldiers serve at big posts and ports; watercraft crews have only a few homes.",
   "bases": [
    {
     "n": "Fort Lee",
     "why": "Transportation School and the Army's sustainment training center"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "7th Transportation Brigade (Expeditionary), the Army's main watercraft unit"
    },
    {
     "n": "Military Ocean Terminal Sunny Point",
     "why": "Army-run ammunition port on the North Carolina coast"
    },
    {
     "n": "Scott Air Force Base",
     "why": "Army Transportation Command (formerly SDDC) headquarters"
    },
    {
     "n": "Fort Hood",
     "why": "Transportation units of the 13th Expeditionary Sustainment Command"
    },
    {
     "n": "Fort Bragg",
     "why": "Transportation units of the 1st Theater Sustainment Command"
    },
    {
     "n": "Fort Bliss",
     "why": "Transportation units supporting the 1st Armored Division"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Transportation units supporting I Corps"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/7th_Transportation_Brigade",
    "https://en.wikipedia.org/wiki/United_States_Army_Transportation_Command"
   ]
  },
  {
   "id": "logistics",
   "label": "Supply, fuel, food and ammunition",
   "test": "^(9[02][A-Z]|92[0-3][AB]|89[AB]|890A) ",
   "track": null,
   "note": "Supply and quartermaster soldiers train at Fort Lee and serve in sustainment units at every large post.",
   "bases": [
    {
     "n": "Fort Lee",
     "why": "Quartermaster School and Combined Arms Support Command"
    },
    {
     "n": "Fort Hood",
     "why": "13th Expeditionary Sustainment Command"
    },
    {
     "n": "Fort Bragg",
     "why": "1st Theater Sustainment Command and airborne parachute riggers"
    },
    {
     "n": "Fort Bliss",
     "why": "Sustainment units supporting the 1st Armored Division"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Division Sustainment Brigade"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Sustainment units supporting I Corps"
    },
    {
     "n": "Fort Stewart",
     "why": "Sustainment units supporting the 3rd Infantry Division"
    },
    {
     "n": "Panzer Kaserne (Kaiserslautern)",
     "why": "21st Theater Sustainment Command in Germany"
    },
    {
     "n": "Fort Shafter",
     "why": "8th Theater Sustainment Command in Hawaii"
    },
    {
     "n": "Rock Island Arsenal",
     "why": "Army Sustainment Command headquarters"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Combined_Arms_Support_Command",
    "https://en.wikipedia.org/wiki/21st_Theater_Sustainment_Command"
   ]
  },
  {
   "id": "military-police",
   "label": "Military police and investigations",
   "test": "^(31[A-Z]|311A) ",
   "track": null,
   "note": "MPs train at Fort Leonard Wood and serve in military police brigades and on post law enforcement everywhere.",
   "bases": [
    {
     "n": "Fort Leonard Wood",
     "why": "Military Police School, where MPs train"
    },
    {
     "n": "Fort Hood",
     "why": "Home of the 89th Military Police Brigade"
    },
    {
     "n": "Fort Bragg",
     "why": "Home of the 16th Military Police Brigade"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Home of the 42nd Military Police Brigade"
    },
    {
     "n": "Fort Leavenworth",
     "why": "Home of the 15th Military Police Brigade and the U.S. Disciplinary Barracks"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Army Criminal Investigation Division headquarters"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Military working dog training at Lackland"
    },
    {
     "n": "Fort Campbell",
     "why": "Military police units supporting the 101st Airborne Division"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Military_Police_Corps_(United_States)",
    "https://en.wikipedia.org/wiki/United_States_Army_Criminal_Investigation_Division"
   ]
  },
  {
   "id": "bands",
   "label": "Army bands",
   "test": "^(42[CRS]|420C) ",
   "track": null,
   "note": "Army musicians serve in a small number of bands, including the premier bands near Washington, D.C.",
   "bases": [
    {
     "n": "Joint Base Myer-Henderson Hall",
     "why": "The U.S. Army Band \"Pershing's Own\""
    },
    {
     "n": "Fort Meade",
     "why": "The U.S. Army Field Band"
    },
    {
     "n": "United States Military Academy West Point",
     "why": "The West Point Band"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "Naval School of Music, where Army musicians train"
    },
    {
     "n": "Fort Bragg",
     "why": "82nd Airborne and XVIII Airborne Corps bands"
    },
    {
     "n": "Fort Hood",
     "why": "III Corps and 1st Cavalry Division bands"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Airborne Division band"
    },
    {
     "n": "Fort Drum",
     "why": "10th Mountain Division band"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Band",
    "https://en.wikipedia.org/wiki/United_States_Army_Field_Band"
   ]
  },
  {
   "id": "admin",
   "label": "HR, finance, legal, public affairs and chaplains",
   "test": "^(27[A-Z]|270A|36[A-Z]|42[AB]|420[AT]|46[A-Z]|56[A-Z]|58A) ",
   "track": null,
   "note": "Support jobs exist at every post; the schools and the big headquarters are where most of these jobs are.",
   "bases": [
    {
     "n": "Fort Knox",
     "why": "Human Resources Command and Army Recruiting Command"
    },
    {
     "n": "Fort Jackson",
     "why": "Soldier Support Institute (HR and finance schools) and the Chaplain School"
    },
    {
     "n": "Fort Meade",
     "why": "Defense Information School for public affairs"
    },
    {
     "n": "The Pentagon",
     "why": "Army headquarters staff"
    },
    {
     "n": "Fort Belvoir",
     "why": "Many Army headquarters and agencies near Washington, D.C."
    },
    {
     "n": "Fort Bragg",
     "why": "XVIII Airborne Corps and its units"
    },
    {
     "n": "Fort Hood",
     "why": "III Corps and its units"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "I Corps and its units"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Airborne Division and its units"
    },
    {
     "n": "Fort Bliss",
     "why": "1st Armored Division and its units"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Human_Resources_Command",
    "https://home.army.mil/jackson/"
   ]
  },
  {
   "id": "staff-acquisition",
   "label": "Staff, acquisition, research and space",
   "test": "^(40A|48[A-Z]|49[A-Z]|50A|51[A-Z]|52B|57A|59A) ",
   "track": null,
   "note": "These mostly mid-career officer fields work at headquarters, labs and test centers rather than in field units.",
   "bases": [
    {
     "n": "The Pentagon",
     "why": "Army and Joint Staff headquarters"
    },
    {
     "n": "Fort Belvoir",
     "why": "Army acquisition and Defense agency headquarters"
    },
    {
     "n": "Redstone Arsenal",
     "why": "Army Materiel Command and Space and Missile Defense Command"
    },
    {
     "n": "Aberdeen Proving Ground",
     "why": "Army research, test and acquisition centers"
    },
    {
     "n": "Detroit Arsenal",
     "why": "Ground vehicle research and acquisition"
    },
    {
     "n": "Picatinny Arsenal",
     "why": "Weapons and ammunition research and acquisition"
    },
    {
     "n": "Fort Leavenworth",
     "why": "Combined Arms Center and the Command and General Staff College"
    },
    {
     "n": "Army Transformation and Training Command Headquarters",
     "why": "Army Transformation and Training Command headquarters in Texas"
    },
    {
     "n": "Fort Carson",
     "why": "1st Space Brigade"
    },
    {
     "n": "Peterson Space Force Base",
     "why": "Army space operations work with U.S. Space Command"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Army_Space_and_Missile_Defense_Command",
    "https://en.wikipedia.org/wiki/United_States_Army_Materiel_Command"
   ]
  },
  {
   "id": "default",
   "label": "Army",
   "test": ".",
   "track": null,
   "note": "These are the Army's biggest posts, where most soldiers in most jobs end up at some point.",
   "bases": [
    {
     "n": "Fort Bragg",
     "why": "XVIII Airborne Corps and the 82nd Airborne Division; the Army's largest post by population"
    },
    {
     "n": "Fort Hood",
     "why": "III Corps and the 1st Cavalry Division"
    },
    {
     "n": "Fort Campbell",
     "why": "101st Airborne Division (Air Assault)"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "I Corps and the 7th Infantry Division"
    },
    {
     "n": "Fort Bliss",
     "why": "1st Armored Division"
    },
    {
     "n": "Fort Carson",
     "why": "4th Infantry Division"
    },
    {
     "n": "Fort Stewart",
     "why": "3rd Infantry Division"
    },
    {
     "n": "Fort Riley",
     "why": "1st Infantry Division"
    },
    {
     "n": "Fort Drum",
     "why": "10th Mountain Division"
    },
    {
     "n": "Camp Humphreys (USAG Humphreys)",
     "why": "2nd Infantry Division and the largest U.S. Army garrison overseas"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Divisions_of_the_United_States_Army",
    "https://en.wikipedia.org/wiki/List_of_American_military_installations"
   ]
  }
 ],
 "usmc": [
  {
   "id": "infantry",
   "label": "Infantry and reconnaissance",
   "test": "^03\\d\\d ",
   "track": null,
   "note": "Marine infantry battalions belong to the three Marine divisions and the Marine Littoral Regiments.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Home of the 2nd Marine Division and II Marine Expeditionary Force"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Home of the 1st Marine Division and I Marine Expeditionary Force"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Home of the 7th Marine Regiment and the main live-fire training center"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Home of the 3rd Marine Littoral Regiment"
    },
    {
     "n": "Camp Schwab",
     "why": "Home of the 4th Marine Regiment and 3rd Reconnaissance Battalion in Okinawa"
    },
    {
     "n": "Camp Hansen",
     "why": "Home of the 12th Littoral Combat Team in Okinawa"
    },
    {
     "n": "Camp Courtney",
     "why": "Home of the 3rd Marine Division headquarters"
    },
    {
     "n": "Marine Corps Base Camp Blaz",
     "why": "New Marine base on Guam for units moving from Okinawa"
    },
    {
     "n": "Marine Rotational Force – Darwin (Robertson Barracks)",
     "why": "Marines rotate to Australia for about six months at a time"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/1st_Marine_Division",
    "https://en.wikipedia.org/wiki/2nd_Marine_Division",
    "https://en.wikipedia.org/wiki/3rd_Marine_Division"
   ]
  },
  {
   "id": "artillery",
   "label": "Field artillery",
   "test": "^08\\d\\d ",
   "track": null,
   "note": "Marine cannoneers train at Fort Sill and then join the artillery regiments of the Marine divisions.",
   "bases": [
    {
     "n": "Fort Sill",
     "why": "Marine artillery school detachment at the Army's Field Artillery School"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Home of the 10th Marine Regiment"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Home of the 11th Marine Regiment"
    },
    {
     "n": "Camp Hansen",
     "why": "12th Marine Littoral Regiment units in Okinawa"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Artillery units and large live-fire ranges"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/11th_Marine_Regiment",
    "https://en.wikipedia.org/wiki/12th_Marine_Littoral_Regiment"
   ]
  },
  {
   "id": "amphibious",
   "label": "Amphibious vehicles",
   "test": "^(18\\d\\d|214[13]) ",
   "track": null,
   "note": "Assault amphibian units are based on the two coasts next to the beaches they train on.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Home of the 3rd Assault Amphibian Battalion and the Assault Amphibian School"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Home of the 2nd Assault Amphibian Battalion"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/3rd_Assault_Amphibian_Battalion",
    "https://en.wikipedia.org/wiki/Amphibious_Combat_Vehicle"
   ]
  },
  {
   "id": "pilots",
   "label": "Pilots and flight officers",
   "test": "^75\\d\\d ",
   "track": null,
   "note": "Marine pilots and flight officers train at Navy air stations, then fly with squadrons at Marine air stations.",
   "bases": [
    {
     "n": "Naval Air Station Pensacola",
     "why": "Where Marine aviators and flight officers start flight training"
    },
    {
     "n": "Naval Air Station Whiting Field",
     "why": "Primary and helicopter flight training"
    },
    {
     "n": "Naval Air Station Corpus Christi",
     "why": "Primary and multi-engine flight training"
    },
    {
     "n": "Marine Corps Air Station Cherry Point",
     "why": "2nd Marine Aircraft Wing headquarters; F-35B and KC-130J squadrons"
    },
    {
     "n": "Marine Corps Air Station New River",
     "why": "MV-22 Osprey and CH-53 helicopter squadrons"
    },
    {
     "n": "Marine Corps Air Station Beaufort",
     "why": "F-35B training and fighter squadrons"
    },
    {
     "n": "Marine Corps Air Station Miramar",
     "why": "3rd Marine Aircraft Wing headquarters; jets, KC-130J and MV-22 squadrons"
    },
    {
     "n": "Marine Corps Air Station Yuma",
     "why": "F-35B squadrons and the weapons and tactics school"
    },
    {
     "n": "Marine Corps Air Station Iwakuni",
     "why": "F-35B and KC-130J squadrons in Japan"
    },
    {
     "n": "Marine Corps Air Station Futenma",
     "why": "MV-22 and helicopter squadrons in Okinawa"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/2nd_Marine_Aircraft_Wing",
    "https://en.wikipedia.org/wiki/3rd_Marine_Aircraft_Wing",
    "https://en.wikipedia.org/wiki/1st_Marine_Aircraft_Wing"
   ]
  },
  {
   "id": "aviation",
   "label": "Aviation maintenance, support and air control",
   "test": "^(59\\d\\d|6\\d{3}|7[0-4]\\d\\d) ",
   "track": null,
   "note": "Most Marine aviation jobs are at the Marine Corps air stations of the three aircraft wings, after school at Pensacola.",
   "bases": [
    {
     "n": "Marine Corps Air Station Cherry Point",
     "why": "2nd Marine Aircraft Wing headquarters and Fleet Readiness Center East"
    },
    {
     "n": "Marine Corps Air Station New River",
     "why": "MV-22 and CH-53 squadrons"
    },
    {
     "n": "Marine Corps Air Station Beaufort",
     "why": "F-35B and F/A-18 squadrons"
    },
    {
     "n": "Marine Corps Air Station Miramar",
     "why": "3rd Marine Aircraft Wing headquarters"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Helicopter and MV-22 squadrons at its air station"
    },
    {
     "n": "Marine Corps Air Station Yuma",
     "why": "F-35B squadrons, drone squadron and aviation weapons school"
    },
    {
     "n": "Marine Corps Air Station Iwakuni",
     "why": "Marine and Navy jet squadrons in Japan"
    },
    {
     "n": "Marine Corps Air Station Futenma",
     "why": "1st Marine Aircraft Wing squadrons in Okinawa"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "MV-22, CH-53 and drone squadrons at Kaneohe Bay"
    },
    {
     "n": "Naval Air Station Pensacola",
     "why": "Naval Air Technical Training Center, where many aviation Marines go to school"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/2nd_Marine_Aircraft_Wing",
    "https://en.wikipedia.org/wiki/3rd_Marine_Aircraft_Wing",
    "https://en.wikipedia.org/wiki/1st_Marine_Aircraft_Wing"
   ]
  },
  {
   "id": "cbrn",
   "label": "Chemical defense (CBRN)",
   "test": "^57\\d\\d ",
   "track": null,
   "note": "CBRN Marines serve in each major command and in a special response force near Washington, D.C.",
   "bases": [
    {
     "n": "Naval Support Facility Indian Head",
     "why": "Home of the Chemical Biological Incident Response Force"
    },
    {
     "n": "Fort Leonard Wood",
     "why": "Where Marine CBRN specialists train"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "CBRN units of II Marine Expeditionary Force"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "CBRN units of I Marine Expeditionary Force"
    },
    {
     "n": "Camp Courtney",
     "why": "CBRN units of III Marine Expeditionary Force in Okinawa"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Chemical_Biological_Incident_Response_Force"
   ]
  },
  {
   "id": "military-police",
   "label": "Military police and corrections",
   "test": "^58\\d\\d ",
   "track": null,
   "note": "Marine MPs train at Fort Leonard Wood and then guard bases and run brigs at the big installations.",
   "bases": [
    {
     "n": "Fort Leonard Wood",
     "why": "Where Marine MPs train"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Law enforcement and MP units of II MEF"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Law enforcement and MP units of I MEF"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Marine Corps criminal investigation and security units"
    },
    {
     "n": "Marine Corps Air Station Miramar",
     "why": "Naval Consolidated Brig Miramar"
    },
    {
     "n": "Camp Foster",
     "why": "Provost marshal and MP units in Okinawa"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Law enforcement for the Hawaii bases"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Law enforcement for the desert base"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Marine_Corps_Military_Police"
   ]
  },
  {
   "id": "intelligence",
   "label": "Intelligence and signals intelligence",
   "test": "^(02\\d\\d|26\\d\\d) ",
   "track": null,
   "note": "Marine intel and SIGINT Marines serve in the intelligence and radio battalions of each MEF and at national agencies.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "2nd Intelligence Battalion and 2nd Radio Battalion"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "1st Intelligence Battalion and 1st Radio Battalion"
    },
    {
     "n": "Camp Hansen",
     "why": "3rd Intelligence Battalion in Okinawa"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "3rd Radio Battalion"
    },
    {
     "n": "Fort Meade",
     "why": "National Security Agency and the Marine Cryptologic Support Battalion"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Marine Corps Intelligence Activity"
    },
    {
     "n": "Naval Air Station Oceana Dam Neck Annex",
     "why": "Navy and Marine Corps Intelligence Training Center"
    },
    {
     "n": "Goodfellow Air Force Base",
     "why": "Where many signals intelligence Marines train"
    },
    {
     "n": "Presidio of Monterey",
     "why": "Defense Language Institute for cryptologic linguists"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Marine_Corps_Intelligence",
    "https://en.wikipedia.org/wiki/Marine_Cryptologic_Support_Battalion"
   ]
  },
  {
   "id": "comms-cyber",
   "label": "Communications, electronics and cyber",
   "test": "^(06\\d\\d|17\\d\\d|28\\d\\d) ",
   "track": null,
   "note": "Communicators train at Twentynine Palms and serve in the communication battalions of each MEF; cyber Marines often go to Fort Meade.",
   "bases": [
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Marine Corps Communication-Electronics School"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "8th Communication Battalion and II MEF units"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "9th Communication Battalion and I MEF units"
    },
    {
     "n": "Camp Hansen",
     "why": "7th Communication Battalion in Okinawa"
    },
    {
     "n": "Fort Meade",
     "why": "Marine Corps Forces Cyberspace Command"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Marine Corps Systems Command and Marine Corps headquarters units"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Communication units supporting Marine Forces Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Marine_Corps_Forces_Cyberspace_Command",
    "https://en.wikipedia.org/wiki/Marine_Corps_Air_Ground_Combat_Center_Twentynine_Palms"
   ]
  },
  {
   "id": "engineers",
   "label": "Engineers and utilities",
   "test": "^(11\\d\\d|13\\d\\d) ",
   "track": null,
   "note": "Engineers train at Camp Lejeune and serve in the combat engineer and engineer support battalions of each MEF.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Marine Corps Engineer School and 8th Engineer Support Battalion"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "1st Combat Engineer Battalion and 7th Engineer Support Battalion"
    },
    {
     "n": "Camp Hansen",
     "why": "9th Engineer Support Battalion in Okinawa"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Engineer units supporting the desert training center"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Marine_Corps_Base_Camp_Lejeune",
    "https://en.wikipedia.org/wiki/9th_Engineer_Support_Battalion"
   ]
  },
  {
   "id": "logistics",
   "label": "Logistics, supply, motor transport and ordnance",
   "test": "^(04\\d\\d|21\\d\\d|23\\d\\d|30\\d\\d|31\\d\\d|35\\d\\d) ",
   "track": null,
   "note": "Logistics Marines serve in the Marine Logistics Groups at the big bases and at the logistics bases that store and fix gear.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "2nd Marine Logistics Group"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "1st Marine Logistics Group"
    },
    {
     "n": "Camp Kinser",
     "why": "3rd Marine Logistics Group units in Okinawa"
    },
    {
     "n": "Marine Corps Logistics Base Albany",
     "why": "Marine Corps Logistics Command headquarters"
    },
    {
     "n": "Marine Corps Logistics Base Barstow",
     "why": "Equipment repair and storage in California"
    },
    {
     "n": "Marine Corps Support Facility Blount Island",
     "why": "Maritime prepositioning ships' equipment"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Logistics units supporting desert training"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Combat Logistics Battalion 3"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Marine_Corps_Logistics_Command",
    "https://en.wikipedia.org/wiki/1st_Marine_Logistics_Group"
   ]
  },
  {
   "id": "music",
   "label": "Marine bands",
   "test": "^55\\d\\d ",
   "track": null,
   "note": "Marine musicians serve in a small number of field bands; the two premier bands are at Marine Barracks Washington.",
   "bases": [
    {
     "n": "Marine Corps Base Quantico",
     "why": "Quantico Marine Band"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "2nd Marine Division Band"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "1st Marine Division Band"
    },
    {
     "n": "Marine Corps Air Station Miramar",
     "why": "3rd Marine Aircraft Wing Band"
    },
    {
     "n": "Marine Corps Recruit Depot San Diego",
     "why": "Recruit depot band"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Marine Forces Pacific Band"
    },
    {
     "n": "Camp Courtney",
     "why": "III Marine Expeditionary Force Band in Okinawa"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Marine_Band",
    "https://en.wikipedia.org/wiki/United_States_Marine_Drum_and_Bugle_Corps"
   ]
  },
  {
   "id": "public-affairs",
   "label": "Public affairs and media",
   "test": "^45\\d\\d ",
   "track": null,
   "note": "Communication strategy Marines train at Fort Meade and work in public affairs offices at the major commands.",
   "bases": [
    {
     "n": "Fort Meade",
     "why": "Defense Information School"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "II MEF communication strategy offices"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "I MEF communication strategy offices"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Marine Corps headquarters units"
    },
    {
     "n": "Camp Foster",
     "why": "III MEF and Marine Corps Installations Pacific offices"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Marine Forces Pacific offices"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Defense_Information_School"
   ]
  },
  {
   "id": "default",
   "label": "Marine Corps",
   "test": ".",
   "track": null,
   "note": "These are the largest Marine Corps bases, where most Marines in most jobs serve.",
   "bases": [
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "II Marine Expeditionary Force, the largest Marine base on the East Coast"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "I Marine Expeditionary Force, the largest Marine base on the West Coast"
    },
    {
     "n": "Marine Corps Air Ground Combat Center Twentynine Palms",
     "why": "Home of the 7th Marine Regiment and major desert training"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Marine Corps schools, Combat Development Command and headquarters units"
    },
    {
     "n": "Marine Corps Base Hawaii",
     "why": "Home of the 3rd Marine Littoral Regiment and aviation units"
    },
    {
     "n": "Marine Corps Air Station Miramar",
     "why": "3rd Marine Aircraft Wing"
    },
    {
     "n": "Marine Corps Air Station Cherry Point",
     "why": "2nd Marine Aircraft Wing"
    },
    {
     "n": "Camp Foster",
     "why": "III Marine Expeditionary Force headquarters area in Okinawa"
    },
    {
     "n": "Marine Corps Air Station Iwakuni",
     "why": "Marine and Navy aviation in mainland Japan"
    },
    {
     "n": "Marine Corps Recruit Depot San Diego",
     "why": "West Coast boot camp and recruiting staff"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/List_of_United_States_Marine_Corps_installations"
   ]
  }
 ],
 "navy": [
  {
   "id": "special-warfare",
   "label": "SEALs and special boat crews",
   "test": "^(SO|SB|1130) ",
   "track": null,
   "note": "SEALs and SWCC crews serve on SEAL teams and special boat teams based in Coronado, Virginia Beach and a few other spots.",
   "bases": [
    {
     "n": "Naval Amphibious Base Coronado",
     "why": "West Coast SEAL teams, Special Boat Team 12 and SEAL training (BUD/S)"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "East Coast SEAL teams and Special Boat Team 20"
    },
    {
     "n": "Naval Research Laboratory – Stennis Space Center",
     "why": "Special Boat Team 22 (riverine SWCC) is based at Stennis Space Center"
    },
    {
     "n": "Camp Michael Monsoor",
     "why": "SEAL advanced training in the California mountains"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "SEAL Delivery Vehicle Team 1"
    },
    {
     "n": "Naval Base Guam",
     "why": "Naval Special Warfare Unit 1"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Naval_Special_Warfare_Command"
   ]
  },
  {
   "id": "eod-diving",
   "label": "Bomb disposal (EOD) and diving",
   "test": "^(EOD|ND|1140) ",
   "track": null,
   "note": "Navy EOD techs and divers train in Florida and serve in EOD and diving units near the big fleet bases.",
   "bases": [
    {
     "n": "Eglin Air Force Base",
     "why": "Naval School Explosive Ordnance Disposal"
    },
    {
     "n": "Naval Support Activity Panama City",
     "why": "Naval Diving and Salvage Training Center"
    },
    {
     "n": "Naval Amphibious Base Coronado",
     "why": "EOD Group 1 and West Coast EOD and diving units"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "EOD Group 2 and East Coast EOD and diving units"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Mobile Diving and Salvage Unit 1"
    },
    {
     "n": "Naval Station Rota",
     "why": "EOD units in Europe"
    },
    {
     "n": "Naval Base Guam",
     "why": "EOD units in the western Pacific"
    },
    {
     "n": "Naval Air Station Whidbey Island",
     "why": "EOD Mobile Unit 11"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Explosive_ordnance_disposal_(United_States_Navy)",
    "https://en.wikipedia.org/wiki/Center_for_Explosive_Ordnance_Disposal_%26_Diving"
   ]
  },
  {
   "id": "nuclear-submarine",
   "label": "Submarines and nuclear power",
   "test": "^(ETN|MMN|EMN|ETV|ITE|ITN|ITR|MMA|STS|MT|FT|1120) |naval reactors|nuclear power|nuclear surface",
   "track": null,
   "note": "Submariners and nukes train in South Carolina and New York, then serve on submarines or aircraft carriers at a few home ports.",
   "bases": [
    {
     "n": "Joint Base Charleston",
     "why": "Naval Nuclear Power Training Command (nuclear power school)"
    },
    {
     "n": "Naval Support Activity Saratoga Springs",
     "why": "Nuclear Power Training Unit Ballston Spa"
    },
    {
     "n": "Naval Submarine Base New London",
     "why": "Submarine school and East Coast attack submarines"
    },
    {
     "n": "Naval Submarine Base Kings Bay",
     "why": "East Coast ballistic missile submarines"
    },
    {
     "n": "Naval Base Kitsap–Bangor",
     "why": "West Coast ballistic and guided missile submarines"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Attack submarines and East Coast aircraft carriers"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pacific attack submarines"
    },
    {
     "n": "Naval Base Point Loma",
     "why": "San Diego attack submarines"
    },
    {
     "n": "Naval Base Guam",
     "why": "Forward-based attack submarines"
    },
    {
     "n": "Naval Base Kitsap – Bremerton",
     "why": "Aircraft carriers and Puget Sound Naval Shipyard"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Nuclear_Power_Training_Command",
    "https://en.wikipedia.org/wiki/Commander,_Submarine_Force_Atlantic"
   ]
  },
  {
   "id": "pilots",
   "label": "Naval aviators and flight officers",
   "test": "^(1310|1320|737X) ",
   "track": null,
   "note": "Pilots and flight officers train in Florida, Texas and Mississippi, then join squadrons at the master air stations.",
   "bases": [
    {
     "n": "Naval Air Station Pensacola",
     "why": "Where naval aviation training begins"
    },
    {
     "n": "Naval Air Station Whiting Field",
     "why": "Primary and helicopter flight training"
    },
    {
     "n": "Naval Air Station Corpus Christi",
     "why": "Primary and multi-engine flight training"
    },
    {
     "n": "Naval Air Station Kingsville",
     "why": "Jet flight training"
    },
    {
     "n": "Naval Air Station Meridian",
     "why": "Jet flight training"
    },
    {
     "n": "Naval Air Station Oceana",
     "why": "East Coast strike fighter squadrons"
    },
    {
     "n": "Naval Air Station Lemoore",
     "why": "West Coast strike fighter squadrons"
    },
    {
     "n": "Naval Air Station Whidbey Island",
     "why": "EA-18G Growler and P-8 Poseidon squadrons"
    },
    {
     "n": "Naval Air Station Jacksonville",
     "why": "P-8 Poseidon and helicopter squadrons"
    },
    {
     "n": "Naval Base Coronado",
     "why": "Helicopter squadrons and carriers at North Island"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Air_Training_Command",
    "https://en.wikipedia.org/wiki/Carrier_air_wing"
   ]
  },
  {
   "id": "aviation",
   "label": "Aviation ratings",
   "test": "aviation|aircrew|air traffic|aircraft handling|catapult",
   "track": null,
   "note": "Aviation sailors work at naval air stations and deploy with squadrons on aircraft carriers and other ships.",
   "bases": [
    {
     "n": "Naval Air Station Oceana",
     "why": "East Coast strike fighter squadrons"
    },
    {
     "n": "Naval Air Station Lemoore",
     "why": "West Coast strike fighter squadrons"
    },
    {
     "n": "Naval Air Station Whidbey Island",
     "why": "EA-18G Growler and P-8 Poseidon squadrons"
    },
    {
     "n": "Naval Air Station Jacksonville",
     "why": "P-8 Poseidon and helicopter squadrons"
    },
    {
     "n": "Naval Base Coronado",
     "why": "Helicopter squadrons and carriers at North Island"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "East Coast carriers, E-2D and helicopter squadrons"
    },
    {
     "n": "Naval Station Mayport",
     "why": "Helicopter squadrons and ships in Florida"
    },
    {
     "n": "Naval Air Station Pensacola",
     "why": "Naval Air Technical Training Center"
    },
    {
     "n": "Marine Corps Air Station Iwakuni",
     "why": "Carrier Air Wing 5 in Japan"
    },
    {
     "n": "Naval Air Station Patuxent River",
     "why": "Naval aircraft testing"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Carrier_air_wing",
    "https://en.wikipedia.org/wiki/Naval_Air_Technical_Training_Center"
   ]
  },
  {
   "id": "seabees",
   "label": "Seabees and civil engineers",
   "test": "^(BU|CE|CM|EA|EO|SW|UT|5100) ",
   "track": null,
   "note": "Seabees are home-ported with construction battalions in California and Mississippi and deploy around the world.",
   "bases": [
    {
     "n": "Naval Base Ventura County – Port Hueneme",
     "why": "Naval Construction Group 1 and West Coast Seabee battalions"
    },
    {
     "n": "Naval Construction Battalion Center Gulfport",
     "why": "Naval Construction Group 2 and East Coast Seabee battalions"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "Amphibious Construction Battalion 2"
    },
    {
     "n": "Naval Amphibious Base Coronado",
     "why": "Amphibious Construction Battalion 1"
    },
    {
     "n": "Naval Base Guam",
     "why": "Seabees deploy here for Pacific projects"
    },
    {
     "n": "Naval Station Rota",
     "why": "Seabees deploy here for Europe and Africa projects"
    },
    {
     "n": "Naval Support Activity Washington",
     "why": "Naval Facilities Engineering Systems Command headquarters"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Naval Facilities Engineering work in the Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Seabee",
    "https://en.wikipedia.org/wiki/Naval_Construction_Battalion_Center_(Gulfport,_Mississippi)"
   ]
  },
  {
   "id": "info-warfare",
   "label": "Cryptology, intelligence, cyber and IT",
   "test": "^(CTI|CTM|CTR|CTT|CWT|IS|IT|1810|1820|1830|1840|1880) ",
   "track": null,
   "note": "Information warfare sailors work at Navy Information Operations Commands next to NSA sites and on ships and fleet staffs.",
   "bases": [
    {
     "n": "Fort Meade",
     "why": "Fleet Cyber Command/10th Fleet and Navy Information Operations Command Maryland"
    },
    {
     "n": "Fort Gordon",
     "why": "Navy Information Operations Command Georgia"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Navy Information Operations Command Texas"
    },
    {
     "n": "Field Station Kunia",
     "why": "Navy Information Operations Command Hawaii"
    },
    {
     "n": "Naval Air Station Whidbey Island",
     "why": "Navy Information Operations Command Whidbey Island"
    },
    {
     "n": "Corry Station",
     "why": "Center for Information Warfare Training, where many of these sailors train"
    },
    {
     "n": "National Maritime Intelligence Center",
     "why": "Office of Naval Intelligence"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Fleet and ship assignments on the East Coast"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Fleet and ship assignments on the West Coast"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "7th Fleet staff and ships in Japan"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Tenth_Fleet",
    "https://en.wikipedia.org/wiki/Center_for_Information_Warfare_Training"
   ]
  },
  {
   "id": "medical",
   "label": "Medicine, corpsmen and health care",
   "test": "^(HM|2100|2200|2300|2900) ",
   "track": null,
   "note": "Navy medical people work at Navy hospitals and clinics, and corpsmen also serve with Marine units.",
   "bases": [
    {
     "n": "Naval Support Activity Bethesda",
     "why": "Walter Reed National Military Medical Center"
    },
    {
     "n": "Naval Medical Center Portsmouth",
     "why": "The Navy's oldest and one of its largest hospitals"
    },
    {
     "n": "Naval Medical Center San Diego (Balboa)",
     "why": "Largest Navy hospital on the West Coast"
    },
    {
     "n": "Marine Corps Base Camp Lejeune",
     "why": "Naval Medical Center Camp Lejeune and corpsmen with 2nd Marine Division"
    },
    {
     "n": "Marine Corps Base Camp Pendleton",
     "why": "Naval Hospital Camp Pendleton and corpsmen with 1st Marine Division"
    },
    {
     "n": "Naval Air Station Jacksonville",
     "why": "Naval Hospital Jacksonville"
    },
    {
     "n": "Naval Base Kitsap – Bremerton",
     "why": "Naval Hospital Bremerton"
    },
    {
     "n": "Camp Foster",
     "why": "U.S. Naval Hospital Okinawa"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "U.S. Naval Hospital Yokosuka"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Medical Education and Training Campus, where corpsmen train"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Medical_Center_Portsmouth",
    "https://en.wikipedia.org/wiki/Naval_Medical_Center_San_Diego"
   ]
  },
  {
   "id": "metoc",
   "label": "Weather and oceanography",
   "test": "^(AG|1800) ",
   "track": null,
   "note": "Navy weather and ocean experts work at oceanography centers and fleet weather centers near the big fleet bases.",
   "bases": [
    {
     "n": "Naval Research Laboratory – Stennis Space Center",
     "why": "Naval Meteorology and Oceanography Command at Stennis Space Center"
    },
    {
     "n": "Keesler Air Force Base",
     "why": "Where Navy aerographer's mates train"
    },
    {
     "n": "Naval Support Activity Monterey",
     "why": "Fleet Numerical Meteorology and Oceanography Center"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Fleet Weather Center Norfolk"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Fleet Weather Center San Diego"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pacific oceanography and weather units"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Meteorology_and_Oceanography_Command"
   ]
  },
  {
   "id": "engineering-duty",
   "label": "Engineering duty officers",
   "test": "^1440 ",
   "track": null,
   "note": "Engineering duty officers design, build and repair ships at shipyards and Naval Sea Systems Command sites.",
   "bases": [
    {
     "n": "Naval Support Activity Washington",
     "why": "Naval Sea Systems Command headquarters"
    },
    {
     "n": "Norfolk Naval Shipyard",
     "why": "Ship and carrier repair"
    },
    {
     "n": "Portsmouth Naval Shipyard",
     "why": "Submarine repair"
    },
    {
     "n": "Naval Base Kitsap – Bremerton",
     "why": "Puget Sound Naval Shipyard"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pearl Harbor Naval Shipyard"
    },
    {
     "n": "Naval Surface Warfare Center Carderock",
     "why": "Ship design research"
    },
    {
     "n": "Naval Support Facility Dahlgren",
     "why": "Surface warfare research and testing"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Southwest Regional Maintenance Center"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Sea_Systems_Command"
   ]
  },
  {
   "id": "surface",
   "label": "Surface ships (deck, engineering, weapons, electronics)",
   "test": "^(BM|QM|OS|STG|GM|FC|TM|MN|DC|EM|EN|GSE|GSM|HT|MM|MR|IC|ET|RW|1110) ",
   "track": null,
   "note": "Surface sailors are assigned to ships, so they live in the fleet home ports.",
   "bases": [
    {
     "n": "Naval Station Norfolk",
     "why": "World's largest naval base; East Coast carriers, destroyers and amphibious ships"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Home port of most West Coast surface ships"
    },
    {
     "n": "Naval Station Mayport",
     "why": "Destroyers and littoral combat ships in Florida"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "Amphibious ships and expeditionary units"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pacific destroyers and cruisers"
    },
    {
     "n": "Naval Station Everett",
     "why": "Destroyers in the Pacific Northwest"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "7th Fleet and the forward-deployed carrier in Japan"
    },
    {
     "n": "U.S. Fleet Activities Sasebo",
     "why": "Forward-deployed amphibious ships in Japan"
    },
    {
     "n": "Naval Station Rota",
     "why": "Forward-deployed destroyers in Spain"
    },
    {
     "n": "Naval Support Activity Bahrain",
     "why": "5th Fleet headquarters and ships in the Middle East"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Fleet_Forces_Command",
    "https://en.wikipedia.org/wiki/Naval_Station_Norfolk"
   ]
  },
  {
   "id": "master-at-arms",
   "label": "Master-at-arms (Navy police)",
   "test": "^MA ",
   "track": null,
   "note": "Masters-at-arms protect Navy bases and ships, with big security forces at submarine bases.",
   "bases": [
    {
     "n": "Joint Base San Antonio",
     "why": "Master-at-arms A school at Lackland"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Base and fleet security"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Base and fleet security"
    },
    {
     "n": "Naval Submarine Base Kings Bay",
     "why": "Security for ballistic missile submarines"
    },
    {
     "n": "Naval Base Kitsap–Bangor",
     "why": "Security for ballistic missile submarines"
    },
    {
     "n": "Naval Station Guantanamo Bay",
     "why": "Base and detention-related security"
    },
    {
     "n": "Naval Support Activity Bahrain",
     "why": "Security in the Middle East"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Master-at-arms_(United_States_Navy)"
   ]
  },
  {
   "id": "music-media",
   "label": "Music and public affairs",
   "test": "^(MC|MU|1650) ",
   "track": null,
   "note": "Navy musicians and media sailors serve with Navy bands and public affairs offices at the major fleet centers.",
   "bases": [
    {
     "n": "Naval Support Activity Washington",
     "why": "The U.S. Navy Band at the Washington Navy Yard"
    },
    {
     "n": "Fort Meade",
     "why": "Defense Information School for mass communication specialists"
    },
    {
     "n": "Joint Expeditionary Base Little Creek–Fort Story",
     "why": "Naval School of Music"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Fleet Forces Band and fleet public affairs"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Navy Band Southwest and fleet public affairs"
    },
    {
     "n": "Naval Station Great Lakes",
     "why": "Navy Band Great Lakes"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pacific Fleet Band"
    },
    {
     "n": "Naval Support Activity Naples",
     "why": "Navy band and public affairs in Europe"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "7th Fleet Band"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Navy_Band",
    "https://en.wikipedia.org/wiki/Defense_Information_School"
   ]
  },
  {
   "id": "supply",
   "label": "Supply, logistics and food service",
   "test": "^(LS|CS|RS|3100) ",
   "track": null,
   "note": "Supply sailors serve on ships and at supply centers, mostly in fleet home ports.",
   "bases": [
    {
     "n": "Naval Support Activity Mechanicsburg",
     "why": "Naval Supply Systems Command headquarters"
    },
    {
     "n": "Naval Station Norfolk",
     "why": "Fleet logistics center and East Coast ships"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Fleet logistics center and West Coast ships"
    },
    {
     "n": "Naval Air Station Jacksonville",
     "why": "Fleet logistics center Jacksonville"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Fleet logistics center Pearl Harbor"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "Fleet logistics center Yokosuka"
    },
    {
     "n": "Naval Base Kitsap – Bremerton",
     "why": "Fleet logistics center Puget Sound"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Naval_Supply_Systems_Command"
   ]
  },
  {
   "id": "default",
   "label": "Navy",
   "test": ".",
   "track": null,
   "note": "These are the Navy's largest bases and fleet concentration areas.",
   "bases": [
    {
     "n": "Naval Station Norfolk",
     "why": "World's largest naval base"
    },
    {
     "n": "Naval Base San Diego",
     "why": "Main West Coast home port"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "Pacific Fleet headquarters"
    },
    {
     "n": "Naval Air Station Jacksonville",
     "why": "Large air station and Navy region headquarters"
    },
    {
     "n": "Naval Station Mayport",
     "why": "Ships and helicopters in Florida"
    },
    {
     "n": "Naval Base Coronado",
     "why": "Carriers, helicopters and special warfare in San Diego"
    },
    {
     "n": "Naval Base Kitsap – Bremerton",
     "why": "Carriers and shipyard in Washington state"
    },
    {
     "n": "U.S. Fleet Activities Yokosuka",
     "why": "Largest Navy base overseas"
    },
    {
     "n": "Naval Station Great Lakes",
     "why": "Boot camp and many A schools"
    },
    {
     "n": "Naval Support Activity Washington",
     "why": "Navy headquarters commands in Washington, D.C."
    }
   ],
   "sources": [
    "https://www.cnic.navy.mil/",
    "https://en.wikipedia.org/wiki/Naval_Station_Norfolk"
   ]
  }
 ],
 "af": [
  {
   "id": "special-warfare",
   "label": "Special warfare",
   "test": "^(19Z|1Z|1T0)",
   "track": null,
   "note": "Special warfare airmen train in Texas and New Mexico, then join special tactics, rescue or air support units, often on Army posts.",
   "bases": [
    {
     "n": "Hurlburt Field",
     "why": "24th Special Operations Wing (special tactics)"
    },
    {
     "n": "Fort Bragg",
     "why": "Special tactics and Tactical Air Control Party squadrons at Pope Field"
    },
    {
     "n": "Moody Air Force Base",
     "why": "Rescue squadrons and the 93rd Air Ground Operations Wing"
    },
    {
     "n": "Davis-Monthan Air Force Base",
     "why": "Rescue squadrons with pararescuemen"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Rescue squadron and combat training"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "Pararescue and combat rescue officer school"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Special Warfare Training Wing at Lackland"
    },
    {
     "n": "Fairchild Air Force Base",
     "why": "SERE (survival) school"
    },
    {
     "n": "Fort Campbell",
     "why": "Air support operations squadron working with the 101st Airborne"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Air support operations squadron working with I Corps"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Special_Operations_Command",
    "https://en.wikipedia.org/wiki/24th_Special_Operations_Wing"
   ]
  },
  {
   "id": "civil-engineering",
   "label": "Civil engineering, fire and EOD",
   "test": "^(3E|32E)",
   "track": null,
   "note": "Every base has a civil engineer squadron; these are the training sites and the biggest or most specialized ones.",
   "bases": [
    {
     "n": "Sheppard Air Force Base",
     "why": "Technical school for many civil engineering trades"
    },
    {
     "n": "Goodfellow Air Force Base",
     "why": "Fire protection school"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Naval School Explosive Ordnance Disposal"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Air Force Civil Engineer Center headquarters"
    },
    {
     "n": "Tyndall Air Force Base",
     "why": "Silver Flag contingency engineering training"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "820th RED HORSE Squadron"
    },
    {
     "n": "Hurlburt Field",
     "why": "823rd RED HORSE Squadron"
    },
    {
     "n": "Andersen Air Force Base",
     "why": "554th RED HORSE Squadron on Guam"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Largest Air Force community in Europe"
    },
    {
     "n": "Kadena Air Base",
     "why": "Largest Air Force base in the Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Civil_Engineer_Center",
    "https://en.wikipedia.org/wiki/Rapid_Engineer_Deployable_Heavy_Operational_Repair_Squadron_Engineers"
   ]
  },
  {
   "id": "security",
   "label": "Security forces and investigations",
   "test": "^(3P0|31P|71S)",
   "track": null,
   "note": "Security forces guard every base, with especially large units protecting the missile fields and nuclear sites.",
   "bases": [
    {
     "n": "Francis E. Warren Air Force Base",
     "why": "Security for the 90th Missile Wing's ICBM fields"
    },
    {
     "n": "Malmstrom Air Force Base",
     "why": "Security for the 341st Missile Wing's ICBM fields"
    },
    {
     "n": "Minot Air Force Base",
     "why": "Security for ICBMs and B-52 bombers"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Security forces school at Lackland"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "Nuclear weapons storage security"
    },
    {
     "n": "Barksdale Air Force Base",
     "why": "Bomber base security and Global Strike Command"
    },
    {
     "n": "Marine Corps Base Quantico",
     "why": "Air Force Office of Special Investigations headquarters"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Large flying and training base"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Largest Air Force community in Europe"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Air_Force_Security_Forces",
    "https://en.wikipedia.org/wiki/Air_Force_Office_of_Special_Investigations"
   ]
  },
  {
   "id": "missiles-nuclear",
   "label": "ICBMs and nuclear weapons",
   "test": "^(13N|2M0|21M|2W2)",
   "track": null,
   "note": "Missile and nuclear airmen serve at the three ICBM wings, bomber bases and nuclear support centers.",
   "bases": [
    {
     "n": "Francis E. Warren Air Force Base",
     "why": "90th Missile Wing (ICBMs)"
    },
    {
     "n": "Malmstrom Air Force Base",
     "why": "341st Missile Wing (ICBMs)"
    },
    {
     "n": "Minot Air Force Base",
     "why": "91st Missile Wing (ICBMs) and B-52 bombers"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "ICBM crew and maintenance training and test launches"
    },
    {
     "n": "Barksdale Air Force Base",
     "why": "Air Force Global Strike Command headquarters"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "Air Force Nuclear Weapons Center"
    },
    {
     "n": "Whiteman Air Force Base",
     "why": "B-2 bomber base"
    },
    {
     "n": "Hill Air Force Base",
     "why": "ICBM and Sentinel program management"
    },
    {
     "n": "Offutt Air Force Base",
     "why": "U.S. Strategic Command headquarters"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Global_Strike_Command",
    "https://en.wikipedia.org/wiki/Twentieth_Air_Force"
   ]
  },
  {
   "id": "space",
   "label": "Space operations",
   "test": "^(13S|1C6)",
   "track": null,
   "note": "Space operations jobs are at Space Force bases, mostly in Colorado, California and Florida.",
   "bases": [
    {
     "n": "Peterson Space Force Base",
     "why": "Space Force operations headquarters and U.S. Space Command"
    },
    {
     "n": "Schriever Space Force Base",
     "why": "Satellite control and navigation units"
    },
    {
     "n": "Buckley Space Force Base",
     "why": "Missile warning satellites"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "West Coast launches and space training"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "East Coast launches"
    },
    {
     "n": "Cheyenne Mountain Space Force Station",
     "why": "Missile warning and space surveillance center"
    }
   ],
   "sources": [
    "https://www.spaceforce.mil/",
    "https://en.wikipedia.org/wiki/United_States_Space_Force_Combat_Forces_Command"
   ]
  },
  {
   "id": "medical",
   "label": "Medicine and health care",
   "test": "^(4[0-8][A-Z]|4[A-Z]\\d|13H|1H0)",
   "track": null,
   "note": "Air Force medical people work at base clinics and hospitals; these are the largest medical centers and training sites.",
   "bases": [
    {
     "n": "Joint Base San Antonio",
     "why": "Brooke Army Medical Center, Wilford Hall and the Medical Education and Training Campus"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "One of the largest Air Force medical centers and the School of Aerospace Medicine"
    },
    {
     "n": "Travis Air Force Base",
     "why": "David Grant USAF Medical Center"
    },
    {
     "n": "Keesler Air Force Base",
     "why": "Keesler Medical Center"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Mike O'Callaghan Military Medical Center"
    },
    {
     "n": "Joint Base Andrews",
     "why": "Malcolm Grow Medical Clinics and Surgery Center"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Eglin hospital"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "Langley hospital"
    },
    {
     "n": "RAF Lakenheath",
     "why": "48th Medical Group hospital in England"
    },
    {
     "n": "Landstuhl Regional Medical Center",
     "why": "Air Force medical staff work at this joint hospital in Germany"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Air_Force_Medical_Service",
    "https://en.wikipedia.org/wiki/Brooke_Army_Medical_Center"
   ]
  },
  {
   "id": "weather",
   "label": "Weather",
   "test": "^(1W0|15W)",
   "track": null,
   "note": "Weather airmen train at Keesler and work at weather squadrons, flying bases and Army posts.",
   "bases": [
    {
     "n": "Offutt Air Force Base",
     "why": "557th Weather Wing headquarters"
    },
    {
     "n": "Keesler Air Force Base",
     "why": "Weather school"
    },
    {
     "n": "Barksdale Air Force Base",
     "why": "26th Operational Weather Squadron"
    },
    {
     "n": "Davis-Monthan Air Force Base",
     "why": "25th Operational Weather Squadron"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "17th Operational Weather Squadron"
    },
    {
     "n": "Vogelweh Military Complex",
     "why": "21st Operational Weather Squadron in Germany"
    },
    {
     "n": "Fort Hood",
     "why": "Combat weather squadron supporting III Corps"
    },
    {
     "n": "Fort Bragg",
     "why": "Combat weather airmen supporting XVIII Airborne Corps"
    },
    {
     "n": "Joint Base Lewis-McChord",
     "why": "Weather squadron supporting I Corps"
    },
    {
     "n": "Hurlburt Field",
     "why": "Special operations weather"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/557th_Weather_Wing"
   ]
  },
  {
   "id": "isr-flying",
   "label": "Airborne ISR and battle management",
   "test": "^(11R|13B|1A3|1A8|1C5|1C3)",
   "track": null,
   "note": "Airborne spy, electronic warfare and command-and-control crews fly from a few specialized bases.",
   "bases": [
    {
     "n": "Offutt Air Force Base",
     "why": "55th Wing RC-135 reconnaissance aircraft"
    },
    {
     "n": "Beale Air Force Base",
     "why": "9th Reconnaissance Wing (U-2)"
    },
    {
     "n": "Tinker Air Force Base",
     "why": "552nd Air Control Wing (E-3 AWACS)"
    },
    {
     "n": "Davis-Monthan Air Force Base",
     "why": "Electronic attack (Compass Call) aircraft"
    },
    {
     "n": "Kadena Air Base",
     "why": "Reconnaissance and AWACS aircraft in the Pacific"
    },
    {
     "n": "RAF Mildenhall",
     "why": "Reconnaissance aircraft in Europe"
    },
    {
     "n": "Joint Base Elmendorf-Richardson",
     "why": "AWACS squadron in Alaska"
    },
    {
     "n": "Hill Air Force Base",
     "why": "Ground-based air control squadron"
    },
    {
     "n": "Osan Air Base",
     "why": "Air control and ISR units in Korea"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/55th_Wing",
    "https://en.wikipedia.org/wiki/9th_Reconnaissance_Wing"
   ]
  },
  {
   "id": "intelligence",
   "label": "Intelligence",
   "test": "^(1N|14N|14F)",
   "track": null,
   "note": "Intelligence airmen train at Goodfellow and serve at ISR wings, NSA sites and the national air intelligence center.",
   "bases": [
    {
     "n": "Goodfellow Air Force Base",
     "why": "Intelligence technical school"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Sixteenth Air Force headquarters and NSA Texas"
    },
    {
     "n": "Fort Meade",
     "why": "70th ISR Wing and the National Security Agency"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "480th ISR Wing and 363rd ISR Wing"
    },
    {
     "n": "Beale Air Force Base",
     "why": "Distributed Ground System and U-2 intelligence"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "National Air and Space Intelligence Center"
    },
    {
     "n": "Ramstein Air Base",
     "why": "ISR group in Europe"
    },
    {
     "n": "Osan Air Base",
     "why": "ISR group in Korea"
    },
    {
     "n": "Joint Base Pearl Harbor-Hickam",
     "why": "ISR group in the Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Sixteenth_Air_Force",
    "https://en.wikipedia.org/wiki/National_Air_and_Space_Intelligence_Center"
   ]
  },
  {
   "id": "cyber-comms",
   "label": "Cyber and communications",
   "test": "^(1B4|1D7|17[A-Z]|1C8)",
   "track": null,
   "note": "Cyber and communications airmen train at Keesler; every base has a comm squadron, and cyber units cluster in Texas and Maryland.",
   "bases": [
    {
     "n": "Keesler Air Force Base",
     "why": "Cyber and communications technical school"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Sixteenth Air Force and Air Forces Cyber headquarters"
    },
    {
     "n": "Fort Meade",
     "why": "U.S. Cyber Command and the National Security Agency"
    },
    {
     "n": "Scott Air Force Base",
     "why": "Air Force network and communications units"
    },
    {
     "n": "Hanscom Air Force Base",
     "why": "Command, control and communications programs"
    },
    {
     "n": "Robins Air Force Base",
     "why": "5th Combat Communications Group"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "Air Combat Command headquarters"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Communications for U.S. Air Forces in Europe"
    },
    {
     "n": "Osan Air Base",
     "why": "Communications in Korea"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Sixteenth_Air_Force",
    "https://en.wikipedia.org/wiki/Keesler_Air_Force_Base"
   ]
  },
  {
   "id": "rpa",
   "label": "Remotely piloted aircraft",
   "test": "^(11U|1U0|2A3X8)",
   "track": null,
   "note": "MQ-9 pilots, sensor operators and maintainers work at a handful of drone bases.",
   "bases": [
    {
     "n": "Creech Air Force Base",
     "why": "432nd Wing, the main MQ-9 Reaper base"
    },
    {
     "n": "Holloman Air Force Base",
     "why": "MQ-9 formal training unit"
    },
    {
     "n": "Shaw Air Force Base",
     "why": "25th Attack Group"
    },
    {
     "n": "Ellsworth Air Force Base",
     "why": "MQ-9 attack squadron"
    },
    {
     "n": "Whiteman Air Force Base",
     "why": "MQ-9 attack squadron"
    },
    {
     "n": "Cannon Air Force Base",
     "why": "Special operations MQ-9 squadrons"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/432nd_Wing",
    "https://en.wikipedia.org/wiki/General_Atomics_MQ-9_Reaper"
   ]
  },
  {
   "id": "sof-rescue-aviation",
   "label": "Special operations and rescue aircrew",
   "test": "^(11S|11H|1A1X3)",
   "track": null,
   "note": "Special operations and rescue aircrews fly from a few Air Force Special Operations Command and rescue bases.",
   "bases": [
    {
     "n": "Hurlburt Field",
     "why": "Air Force Special Operations Command headquarters"
    },
    {
     "n": "Cannon Air Force Base",
     "why": "27th Special Operations Wing"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "58th Special Operations Wing training"
    },
    {
     "n": "Moody Air Force Base",
     "why": "HC-130J and HH-60W rescue squadrons"
    },
    {
     "n": "Davis-Monthan Air Force Base",
     "why": "Rescue group"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Rescue squadron"
    },
    {
     "n": "Kadena Air Base",
     "why": "Special operations and rescue squadrons in the Pacific"
    },
    {
     "n": "RAF Mildenhall",
     "why": "352nd Special Operations Wing in Europe"
    },
    {
     "n": "Yokota Air Base",
     "why": "Special operations CV-22 squadron in Japan"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Special_Operations_Command"
   ]
  },
  {
   "id": "fighter-pilots",
   "label": "Fighter pilots",
   "test": "^11F",
   "track": null,
   "note": "Fighter pilots train at Luke and other training units, then fly from fighter bases at home and overseas.",
   "bases": [
    {
     "n": "Luke Air Force Base",
     "why": "F-35A and F-16 pilot training"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Weapons School and fighter testing and tactics"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "F-35A training and fighter testing"
    },
    {
     "n": "Hill Air Force Base",
     "why": "F-35A fighter wing"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "F-22 fighter wing"
    },
    {
     "n": "Seymour Johnson Air Force Base",
     "why": "F-15E Strike Eagle wing"
    },
    {
     "n": "Shaw Air Force Base",
     "why": "F-16 wing"
    },
    {
     "n": "RAF Lakenheath",
     "why": "F-35A and F-15E wing in England"
    },
    {
     "n": "Aviano Air Base",
     "why": "F-16 wing in Italy"
    },
    {
     "n": "Misawa Air Base",
     "why": "Fighter wing in Japan"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Combat_Command"
   ]
  },
  {
   "id": "bomber-pilots",
   "label": "Bomber pilots",
   "test": "^11B",
   "track": null,
   "note": "Bomber pilots fly from the five bomber bases of Air Force Global Strike Command.",
   "bases": [
    {
     "n": "Barksdale Air Force Base",
     "why": "B-52 wing and Global Strike Command headquarters"
    },
    {
     "n": "Minot Air Force Base",
     "why": "B-52 wing"
    },
    {
     "n": "Dyess Air Force Base",
     "why": "B-1 wing"
    },
    {
     "n": "Ellsworth Air Force Base",
     "why": "B-1 wing and first B-21 Raider base"
    },
    {
     "n": "Whiteman Air Force Base",
     "why": "B-2 wing"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Global_Strike_Command"
   ]
  },
  {
   "id": "mobility",
   "label": "Airlift and tanker aircrew",
   "test": "^(11M|1A1X2)",
   "track": null,
   "note": "Airlift and tanker crews fly from Air Mobility Command bases and overseas hubs.",
   "bases": [
    {
     "n": "Travis Air Force Base",
     "why": "C-17, C-5 and KC-46 base"
    },
    {
     "n": "Dover Air Force Base",
     "why": "C-17 and C-5 base"
    },
    {
     "n": "Joint Base Charleston",
     "why": "C-17 base"
    },
    {
     "n": "Joint Base McGuire-Dix-Lakehurst",
     "why": "KC-46 tanker and airlift base"
    },
    {
     "n": "McConnell Air Force Base",
     "why": "KC-46 tanker base"
    },
    {
     "n": "Fairchild Air Force Base",
     "why": "KC-135 tanker base"
    },
    {
     "n": "Little Rock Air Force Base",
     "why": "C-130J base and training"
    },
    {
     "n": "Altus Air Force Base",
     "why": "C-17 and KC-46 aircrew training"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Airlift hub in Europe"
    },
    {
     "n": "Yokota Air Base",
     "why": "Airlift hub in Japan"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Mobility_Command"
   ]
  },
  {
   "id": "airfield-ops",
   "label": "Air traffic control and airfield operations",
   "test": "^(1C1|1C7|13M|1C0|1P0)",
   "track": null,
   "note": "Air traffic controllers and airfield operations airmen work at every flying base; these are some of the largest.",
   "bases": [
    {
     "n": "Keesler Air Force Base",
     "why": "Air traffic control school"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Busy fighter and training airfield"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Busy test and training airfield"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Pilot instructor training at Randolph"
    },
    {
     "n": "Travis Air Force Base",
     "why": "Large airlift base"
    },
    {
     "n": "Dover Air Force Base",
     "why": "Large airlift base"
    },
    {
     "n": "Hill Air Force Base",
     "why": "Fighter wing and depot"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Main airlift hub in Europe"
    },
    {
     "n": "Kadena Air Base",
     "why": "Largest Air Force base in the Pacific"
    },
    {
     "n": "Osan Air Base",
     "why": "Main Air Force base in Korea"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Education_and_Training_Command"
   ]
  },
  {
   "id": "pilots-aircrew",
   "label": "Other pilots, combat systems officers and aircrew",
   "test": "^(11|12X|1A)",
   "track": null,
   "note": "Pilots and aircrew start at training bases, then go wherever their aircraft are flown.",
   "bases": [
    {
     "n": "Columbus Air Force Base",
     "why": "Undergraduate pilot training"
    },
    {
     "n": "Laughlin Air Force Base",
     "why": "Undergraduate pilot training"
    },
    {
     "n": "Vance Air Force Base",
     "why": "Undergraduate pilot training"
    },
    {
     "n": "Sheppard Air Force Base",
     "why": "Euro-NATO Joint Jet Pilot Training"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Pilot instructor training at Randolph"
    },
    {
     "n": "Naval Air Station Pensacola",
     "why": "Combat systems officer training"
    },
    {
     "n": "Edwards Air Force Base",
     "why": "Test Pilot School and flight testing"
    },
    {
     "n": "Joint Base Andrews",
     "why": "89th Airlift Wing executive and presidential airlift"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Weapons School"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Flight testing and training"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Education_and_Training_Command",
    "https://en.wikipedia.org/wiki/89th_Airlift_Wing"
   ]
  },
  {
   "id": "aircraft-maintenance",
   "label": "Aircraft maintenance and munitions",
   "test": "^(2A|21A|2R2|2P0|2W[01]|2T3X1)",
   "track": null,
   "note": "Maintainers go where the jets are; these are the depots, the tech school and some of the largest flying bases.",
   "bases": [
    {
     "n": "Hill Air Force Base",
     "why": "F-35A wing and Ogden Air Logistics Complex"
    },
    {
     "n": "Tinker Air Force Base",
     "why": "Oklahoma City Air Logistics Complex and E-3 and KC-135 units"
    },
    {
     "n": "Robins Air Force Base",
     "why": "Warner Robins Air Logistics Complex"
    },
    {
     "n": "Sheppard Air Force Base",
     "why": "Aircraft maintenance technical school"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "F-35A training and test aircraft"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "F-22 wing"
    },
    {
     "n": "Seymour Johnson Air Force Base",
     "why": "F-15E wing"
    },
    {
     "n": "Dover Air Force Base",
     "why": "C-5 and C-17 wing"
    },
    {
     "n": "Travis Air Force Base",
     "why": "C-5, C-17 and KC-46 wing"
    },
    {
     "n": "Kadena Air Base",
     "why": "Largest Air Force base in the Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Ogden_Air_Logistics_Complex",
    "https://en.wikipedia.org/wiki/Sheppard_Air_Force_Base"
   ]
  },
  {
   "id": "logistics",
   "label": "Logistics, fuels and transportation",
   "test": "^(2[FGST]|21R|38F|3F1)",
   "track": null,
   "note": "Logistics airmen work at every base, with the most at the airlift hubs and depots.",
   "bases": [
    {
     "n": "Scott Air Force Base",
     "why": "Air Mobility Command and U.S. Transportation Command headquarters"
    },
    {
     "n": "Travis Air Force Base",
     "why": "Major West Coast aerial port"
    },
    {
     "n": "Dover Air Force Base",
     "why": "Major East Coast aerial port"
    },
    {
     "n": "Joint Base Charleston",
     "why": "C-17 base and aerial port"
    },
    {
     "n": "Joint Base McGuire-Dix-Lakehurst",
     "why": "Tanker base and aerial port"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Main airlift hub in Europe"
    },
    {
     "n": "Hill Air Force Base",
     "why": "Ogden Air Logistics Complex"
    },
    {
     "n": "Tinker Air Force Base",
     "why": "Oklahoma City Air Logistics Complex"
    },
    {
     "n": "Robins Air Force Base",
     "why": "Warner Robins Air Logistics Complex"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Mobility_Command",
    "https://en.wikipedia.org/wiki/Ogden_Air_Logistics_Complex"
   ]
  },
  {
   "id": "science-acquisition",
   "label": "Science, engineering and acquisition",
   "test": "^(6[1-4]|6C0|9S|15A)",
   "track": null,
   "note": "Scientists, engineers and acquisition airmen work at research labs, test centers and program offices.",
   "bases": [
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "Air Force Research Laboratory and Life Cycle Management Center headquarters"
    },
    {
     "n": "Hanscom Air Force Base",
     "why": "Command, control and cyber acquisition"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Weapons research, testing and acquisition"
    },
    {
     "n": "Edwards Air Force Base",
     "why": "Air Force Test Center"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "Research labs for directed energy and space"
    },
    {
     "n": "Hill Air Force Base",
     "why": "Program offices and logistics complex"
    },
    {
     "n": "Robins Air Force Base",
     "why": "Program offices and logistics complex"
    },
    {
     "n": "Tinker Air Force Base",
     "why": "Program offices and logistics complex"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "Air Force Technical Applications Center (nuclear treaty monitoring)"
    },
    {
     "n": "Arnold Air Force Base",
     "why": "Arnold Engineering Development Complex wind tunnels"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Air_Force_Materiel_Command",
    "https://en.wikipedia.org/wiki/Air_Force_Technical_Applications_Center"
   ]
  },
  {
   "id": "bands-honor-guard",
   "label": "Bands and Honor Guard",
   "test": "^(35B|3N[12]|8G0)",
   "track": null,
   "note": "Air Force musicians and honor guard members serve with a small number of bands and the Honor Guard near Washington, D.C.",
   "bases": [
    {
     "n": "Joint Base Anacostia-Bolling",
     "why": "The U.S. Air Force Band and the U.S. Air Force Honor Guard"
    },
    {
     "n": "United States Air Force Academy",
     "why": "Air Force Academy Band"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "Heritage of America Band"
    },
    {
     "n": "Scott Air Force Base",
     "why": "Band of Mid-America"
    },
    {
     "n": "Travis Air Force Base",
     "why": "Band of the Golden West"
    },
    {
     "n": "Joint Base San Antonio",
     "why": "Band of the West"
    },
    {
     "n": "Offutt Air Force Base",
     "why": "Heartland of America Band"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "Band of Flight"
    },
    {
     "n": "Yokota Air Base",
     "why": "Band of the Pacific"
    },
    {
     "n": "Ramstein Air Base",
     "why": "U.S. Air Forces in Europe Band"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/List_of_United_States_Air_Force_bands"
   ]
  },
  {
   "id": "default",
   "label": "Air Force",
   "test": ".",
   "track": null,
   "note": "These are some of the Air Force's largest bases by number of airmen.",
   "bases": [
    {
     "n": "Joint Base San Antonio",
     "why": "Basic training and many tech schools, the largest Air Force community"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "Air Force Materiel Command and research labs"
    },
    {
     "n": "Eglin Air Force Base",
     "why": "Weapons testing and training"
    },
    {
     "n": "Nellis Air Force Base",
     "why": "Fighter training and the Weapons School"
    },
    {
     "n": "Hill Air Force Base",
     "why": "F-35A wing and depot"
    },
    {
     "n": "Tinker Air Force Base",
     "why": "Depot and AWACS"
    },
    {
     "n": "Joint Base Langley-Eustis",
     "why": "Air Combat Command headquarters"
    },
    {
     "n": "Travis Air Force Base",
     "why": "Airlift and tankers"
    },
    {
     "n": "Ramstein Air Base",
     "why": "Largest Air Force community in Europe"
    },
    {
     "n": "Kadena Air Base",
     "why": "Largest Air Force base in the Pacific"
    }
   ],
   "sources": [
    "https://www.af.mil/About-Us/Fact-Sheets/"
   ]
  }
 ],
 "sf": [
  {
   "id": "cyber",
   "label": "Cyber",
   "test": "^(17S|5C0)",
   "track": null,
   "note": "Space Force cyber Guardians defend the networks and ground stations that fly satellites, mostly in Colorado.",
   "bases": [
    {
     "n": "Schriever Space Force Base",
     "why": "Space Delta 6 (cyber and satellite control network)"
    },
    {
     "n": "Peterson Space Force Base",
     "why": "Space Force operations headquarters"
    },
    {
     "n": "Buckley Space Force Base",
     "why": "Missile warning ground systems"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "Launch range and training"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "East Coast launch range"
    },
    {
     "n": "Keesler Air Force Base",
     "why": "Cyber technical school"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Space_Delta_6"
   ]
  },
  {
   "id": "intelligence",
   "label": "Intelligence",
   "test": "^(14N|5I)",
   "track": null,
   "note": "Space intelligence Guardians train at Goodfellow and work at ISR and intelligence centers.",
   "bases": [
    {
     "n": "Goodfellow Air Force Base",
     "why": "Intelligence technical school"
    },
    {
     "n": "Peterson Space Force Base",
     "why": "Space Delta 7 (intelligence, surveillance and reconnaissance)"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "National Space Intelligence Center"
    },
    {
     "n": "Buckley Space Force Base",
     "why": "Aerospace Data Facility-Colorado"
    },
    {
     "n": "Schriever Space Force Base",
     "why": "Intelligence squadrons supporting space units"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Space_Delta_7",
    "https://en.wikipedia.org/wiki/National_Space_Intelligence_Center"
   ]
  },
  {
   "id": "engineering-acquisition",
   "label": "Engineering and acquisition",
   "test": "^(62|63)",
   "track": null,
   "note": "Engineers and acquisition officers build and buy satellites and launch systems at Space Systems Command sites and labs.",
   "bases": [
    {
     "n": "Los Angeles Air Force Base",
     "why": "Space Systems Command headquarters"
    },
    {
     "n": "Kirtland Air Force Base",
     "why": "Space Systems Command units and AFRL Space Vehicles"
    },
    {
     "n": "Peterson Space Force Base",
     "why": "Space Force operations headquarters"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "East Coast launch programs"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "West Coast launch programs"
    },
    {
     "n": "Wright-Patterson Air Force Base",
     "why": "Air Force Research Laboratory headquarters"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Space_Systems_Command"
   ]
  },
  {
   "id": "space-ops",
   "label": "Space operations",
   "test": "^(13|5S)",
   "track": null,
   "note": "Space operators run satellites, missile warning, space surveillance and launches, mostly in Colorado, California and Florida.",
   "bases": [
    {
     "n": "Peterson Space Force Base",
     "why": "Space Force operations headquarters, U.S. Space Command, Space Deltas 2 and 3"
    },
    {
     "n": "Schriever Space Force Base",
     "why": "GPS, satellite communications and orbital warfare deltas"
    },
    {
     "n": "Buckley Space Force Base",
     "why": "Space Delta 4 (missile warning)"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "West Coast launches and Space Training and Readiness Command units"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "Space Launch Delta 45"
    },
    {
     "n": "Cape Canaveral Space Force Station",
     "why": "East Coast launch pads"
    },
    {
     "n": "Cheyenne Mountain Space Force Station",
     "why": "Missile warning and space surveillance center"
    },
    {
     "n": "Clear Space Force Station",
     "why": "Missile warning radar in Alaska"
    },
    {
     "n": "Pituffik Space Base",
     "why": "Missile warning radar in Greenland"
    },
    {
     "n": "Cavalier Space Force Station",
     "why": "Missile warning radar in North Dakota"
    }
   ],
   "sources": [
    "https://www.spaceforce.mil/",
    "https://en.wikipedia.org/wiki/United_States_Space_Force_Combat_Forces_Command"
   ]
  },
  {
   "id": "default",
   "label": "Space Force",
   "test": ".",
   "track": null,
   "note": "These are the Space Force's main bases.",
   "bases": [
    {
     "n": "Peterson Space Force Base",
     "why": "Space Force operations headquarters and U.S. Space Command"
    },
    {
     "n": "Schriever Space Force Base",
     "why": "Satellite operations"
    },
    {
     "n": "Buckley Space Force Base",
     "why": "Missile warning"
    },
    {
     "n": "Vandenberg Space Force Base",
     "why": "West Coast launches and training"
    },
    {
     "n": "Patrick Space Force Base",
     "why": "East Coast launches"
    },
    {
     "n": "Los Angeles Air Force Base",
     "why": "Space Systems Command headquarters"
    }
   ],
   "sources": [
    "https://www.spaceforce.mil/"
   ]
  }
 ],
 "cg": [
  {
   "id": "aviation",
   "label": "Aviation",
   "test": "^(AET|AMT|AST|AVI) |aviation|aeronautical",
   "track": null,
   "note": "Coast Guard aviators and aircrew serve at air stations on every coast; flight training ends at Mobile.",
   "bases": [
    {
     "n": "Coast Guard Aviation Training Center Mobile",
     "why": "Aviation Training Center for Coast Guard pilots"
    },
    {
     "n": "Base Elizabeth City / Air Station Elizabeth City",
     "why": "HC-130J air station and the Aviation Technical Training Center"
    },
    {
     "n": "Air Station Clearwater",
     "why": "One of the largest Coast Guard air stations"
    },
    {
     "n": "Air Station Kodiak",
     "why": "Search and rescue across Alaska"
    },
    {
     "n": "Base Cape Cod / Air Station Cape Cod",
     "why": "Northeast search and rescue"
    },
    {
     "n": "Air Station Barbers Point",
     "why": "Search and rescue in Hawaii and the Pacific"
    },
    {
     "n": "Air Station Miami",
     "why": "Search and rescue and patrols in South Florida"
    },
    {
     "n": "Air Station San Diego (Sector San Diego)",
     "why": "Helicopter air station in Southern California"
    },
    {
     "n": "Air Station Sitka",
     "why": "Search and rescue in Southeast Alaska"
    },
    {
     "n": "Air Station Sacramento",
     "why": "HC-27J airplane air station"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Air_Stations"
   ]
  },
  {
   "id": "robotics",
   "label": "Robotics and drones",
   "test": "^(RMM|RMS) ",
   "track": null,
   "note": "This rating is new (2026), so assignments are still being set; drones fly from big cutters and specialized forces.",
   "bases": [
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Home of National Security Cutters that carry drones"
    },
    {
     "n": "Base Charleston",
     "why": "Home of National Security Cutters"
    },
    {
     "n": "Base Honolulu",
     "why": "Home of National Security Cutters"
    },
    {
     "n": "Base Portsmouth",
     "why": "Atlantic Area and Deployable Specialized Forces"
    }
   ],
   "sources": [
    "https://www.mycg.uscg.mil/News/Article/4355502/what-you-need-to-know-about-the-new-robotics-mission-specialist-rms-rating/"
   ]
  },
  {
   "id": "divers",
   "label": "Divers",
   "test": "^(DV|DIV) ",
   "track": null,
   "note": "Coast Guard divers train at the Navy dive school and serve in three regional dive lockers.",
   "bases": [
    {
     "n": "Naval Support Activity Panama City",
     "why": "Naval Diving and Salvage Training Center"
    },
    {
     "n": "Base Portsmouth",
     "why": "Regional Dive Locker East"
    },
    {
     "n": "Air Station San Diego (Sector San Diego)",
     "why": "Regional Dive Locker West in San Diego"
    },
    {
     "n": "Base Honolulu",
     "why": "Regional Dive Locker Pacific"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Center_for_Explosive_Ordnance_Disposal_%26_Diving"
   ]
  },
  {
   "id": "law-enforcement",
   "label": "Law enforcement and investigations",
   "test": "^(ME|MLES|IV|INV) ",
   "track": null,
   "note": "Maritime enforcement and investigators serve in deployable security teams, sector units and investigative offices in major ports.",
   "bases": [
    {
     "n": "Base Portsmouth",
     "why": "Maritime Security Response Team and Atlantic Area units"
    },
    {
     "n": "Base Miami Beach",
     "why": "Law enforcement detachments and drug interdiction"
    },
    {
     "n": "Air Station San Diego (Sector San Diego)",
     "why": "Pacific law enforcement detachments and security teams"
    },
    {
     "n": "Sector Key West",
     "why": "Drug and migrant interdiction"
    },
    {
     "n": "Base San Juan",
     "why": "Caribbean interdiction"
    },
    {
     "n": "Base Galveston",
     "why": "Maritime safety and security team"
    },
    {
     "n": "Sector New York (Fort Wadsworth)",
     "why": "Maritime safety and security team"
    },
    {
     "n": "Base Seattle",
     "why": "Maritime safety and security team"
    },
    {
     "n": "Base Los Angeles–Long Beach",
     "why": "Maritime safety and security team"
    },
    {
     "n": "Coast Guard Headquarters (Douglas A. Munro Building)",
     "why": "Coast Guard Investigative Service headquarters"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Maritime_Safety_and_Security_Team",
    "https://en.wikipedia.org/wiki/Coast_Guard_Investigative_Service"
   ]
  },
  {
   "id": "intelligence",
   "label": "Intelligence",
   "test": "^(IS|ISS) |intelligence",
   "track": null,
   "note": "Intelligence specialists work at headquarters, the national maritime intelligence center and the area commands.",
   "bases": [
    {
     "n": "Coast Guard Headquarters (Douglas A. Munro Building)",
     "why": "Coast Guard intelligence headquarters"
    },
    {
     "n": "National Maritime Intelligence Center",
     "why": "Coast Guard Intelligence Coordination Center"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Pacific Area and its intelligence fusion center"
    },
    {
     "n": "Base Portsmouth",
     "why": "Atlantic Area and its intelligence fusion center"
    },
    {
     "n": "Base Miami Beach",
     "why": "Intelligence for Caribbean operations"
    },
    {
     "n": "Base Honolulu",
     "why": "Intelligence for Pacific operations"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Coast_Guard_Intelligence"
   ]
  },
  {
   "id": "cyber-it",
   "label": "Cyber and IT",
   "test": "^(CMM|CMS|ISM|IT) |cyber",
   "track": null,
   "note": "Cyber and IT members support networks at headquarters, the operations systems center and large bases.",
   "bases": [
    {
     "n": "Coast Guard Headquarters (Douglas A. Munro Building)",
     "why": "Coast Guard Cyber Command and headquarters IT"
    },
    {
     "n": "Coast Guard Operations Systems Center",
     "why": "Runs many Coast Guard computer systems in West Virginia"
    },
    {
     "n": "Coast Guard Training Center Petaluma",
     "why": "IT A school"
    },
    {
     "n": "Base Portsmouth",
     "why": "Atlantic Area units"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Pacific Area units"
    },
    {
     "n": "Base Kodiak",
     "why": "Large Alaska base"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Training_Center_Petaluma"
   ]
  },
  {
   "id": "electronics",
   "label": "Electronics",
   "test": "^(ET|ELC) ",
   "track": null,
   "note": "Electronics technicians train at Petaluma and serve on cutters and at bases that maintain radios and radars.",
   "bases": [
    {
     "n": "Coast Guard Training Center Petaluma",
     "why": "ET A school"
    },
    {
     "n": "Base Portsmouth",
     "why": "Cutters and electronics support"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "National Security Cutters and electronics support"
    },
    {
     "n": "Base Charleston",
     "why": "National Security Cutters"
    },
    {
     "n": "Base Kodiak",
     "why": "Cutters and communications in Alaska"
    },
    {
     "n": "Base Honolulu",
     "why": "Cutters in the Pacific"
    },
    {
     "n": "Base Seattle",
     "why": "Icebreakers and cutters"
    },
    {
     "n": "Coast Guard Operations Systems Center",
     "why": "Systems support"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Training_Center_Petaluma"
   ]
  },
  {
   "id": "engineering",
   "label": "Engineering and maintenance",
   "test": "^(DC|EM|MK|ENG|MAT) |naval engineering",
   "track": null,
   "note": "Engineering ratings keep cutters and boats running, so they serve where the cutters are and at the Coast Guard Yard.",
   "bases": [
    {
     "n": "Coast Guard Training Center Yorktown",
     "why": "A schools for machinery, electrical and damage control"
    },
    {
     "n": "Coast Guard Yard",
     "why": "The Coast Guard's shipyard in Baltimore"
    },
    {
     "n": "Base Portsmouth",
     "why": "Medium endurance cutters"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "National Security Cutters"
    },
    {
     "n": "Base Charleston",
     "why": "National Security Cutters"
    },
    {
     "n": "Base Honolulu",
     "why": "National Security Cutters and patrol boats"
    },
    {
     "n": "Base Kodiak",
     "why": "Cutters in Alaska"
    },
    {
     "n": "Base Seattle",
     "why": "Polar icebreakers"
    },
    {
     "n": "Base Miami Beach",
     "why": "Fast response cutters"
    },
    {
     "n": "Base Ketchikan",
     "why": "Cutter support in Southeast Alaska"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Coast_Guard_Training_Center_Yorktown",
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Yard"
   ]
  },
  {
   "id": "marine-safety",
   "label": "Marine safety and environmental response",
   "test": "^(MST|MSSD|MSSE|MSSR) |marine safety|prevention",
   "track": null,
   "note": "Marine safety jobs are at sectors that oversee busy ports, shipping and oil and chemical traffic.",
   "bases": [
    {
     "n": "Sector New York (Fort Wadsworth)",
     "why": "Port of New York and New Jersey"
    },
    {
     "n": "Base New Orleans",
     "why": "Mississippi River and Gulf energy industry"
    },
    {
     "n": "Base Galveston",
     "why": "Houston ship channel and petrochemical ports"
    },
    {
     "n": "Base Los Angeles–Long Beach",
     "why": "Ports of Los Angeles and Long Beach"
    },
    {
     "n": "Sector Delaware Bay",
     "why": "Philadelphia and Delaware River ports"
    },
    {
     "n": "Sector San Francisco",
     "why": "San Francisco Bay ports"
    },
    {
     "n": "Base Seattle",
     "why": "Puget Sound ports"
    },
    {
     "n": "Sector Columbia River",
     "why": "Columbia River shipping"
    },
    {
     "n": "Sector Mobile",
     "why": "Gulf Coast ports"
    },
    {
     "n": "Sector Ohio Valley",
     "why": "Inland river shipping"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_sector"
   ]
  },
  {
   "id": "deck-afloat",
   "label": "Deck, weapons and cutters",
   "test": "^(BM|BOSN|GM|WEPS) |afloat",
   "track": null,
   "note": "Boatswain's mates, gunner's mates and cuttermen serve on cutters and at boat stations, mostly near the big cutter bases.",
   "bases": [
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "National Security Cutters"
    },
    {
     "n": "Base Charleston",
     "why": "National Security Cutters"
    },
    {
     "n": "Base Honolulu",
     "why": "National Security Cutters and patrol boats"
    },
    {
     "n": "Base Portsmouth",
     "why": "Medium endurance cutters"
    },
    {
     "n": "Base Kodiak",
     "why": "Cutters in Alaska"
    },
    {
     "n": "Base Miami Beach",
     "why": "Fast response cutters"
    },
    {
     "n": "Base Seattle",
     "why": "Polar icebreakers"
    },
    {
     "n": "Base Boston",
     "why": "Medium endurance cutters"
    },
    {
     "n": "Coast Guard Station Cape Disappointment (National Motor Lifeboat School)",
     "why": "National Motor Lifeboat School"
    },
    {
     "n": "Coast Guard Training Center Yorktown",
     "why": "Boatswain's mate A school"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/Legend-class_cutter",
    "https://en.wikipedia.org/wiki/Coast_Guard_Training_Center_Yorktown"
   ]
  },
  {
   "id": "operations",
   "label": "Operations and command centers",
   "test": "^(OS|OSS) |response",
   "track": null,
   "note": "Operations specialists and response officers run sector command centers and serve on cutters.",
   "bases": [
    {
     "n": "Base Portsmouth",
     "why": "Atlantic Area command center"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Pacific Area command center"
    },
    {
     "n": "Sector New York (Fort Wadsworth)",
     "why": "Sector command center"
    },
    {
     "n": "Sector San Francisco",
     "why": "Sector command center"
    },
    {
     "n": "Sector North Carolina",
     "why": "Sector command center"
    },
    {
     "n": "Sector Jacksonville",
     "why": "Sector command center"
    },
    {
     "n": "Sector St. Petersburg",
     "why": "Sector command center"
    },
    {
     "n": "Sector Key West",
     "why": "Sector command center"
    },
    {
     "n": "Base Boston",
     "why": "Sector Boston command center"
    },
    {
     "n": "Coast Guard Training Center Petaluma",
     "why": "Operations specialist A school"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Training_Center_Petaluma",
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_sector"
   ]
  },
  {
   "id": "medical",
   "label": "Medical and health care",
   "test": "^(HS|MED) |healthcare|medical",
   "track": null,
   "note": "Coast Guard health workers staff clinics at the larger bases and training centers.",
   "bases": [
    {
     "n": "Coast Guard Training Center Cape May",
     "why": "Clinic for recruit training"
    },
    {
     "n": "Base Elizabeth City / Air Station Elizabeth City",
     "why": "Large clinic for aviation units"
    },
    {
     "n": "Base Kodiak",
     "why": "Large clinic in Alaska"
    },
    {
     "n": "Base Portsmouth",
     "why": "Clinic for Atlantic Area units"
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Clinic for Pacific Area units"
    },
    {
     "n": "U.S. Coast Guard Academy",
     "why": "Academy clinic"
    },
    {
     "n": "Coast Guard Training Center Petaluma",
     "why": "Health services technician A school"
    },
    {
     "n": "Base Honolulu",
     "why": "Clinic for Pacific units"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Training_Center_Petaluma"
   ]
  },
  {
   "id": "music",
   "label": "Coast Guard Band",
   "test": "^MU ",
   "track": null,
   "note": "Coast Guard musicians serve in the single U.S. Coast Guard Band at the Academy.",
   "bases": [
    {
     "n": "U.S. Coast Guard Academy",
     "why": "Home of the U.S. Coast Guard Band"
    }
   ],
   "sources": [
    "https://en.wikipedia.org/wiki/United_States_Coast_Guard_Band"
   ]
  },
  {
   "id": "default",
   "label": "Coast Guard",
   "test": ".",
   "track": null,
   "note": "These are the Coast Guard's largest units and headquarters.",
   "bases": [
    {
     "n": "Coast Guard Headquarters (Douglas A. Munro Building)",
     "why": "Coast Guard headquarters in Washington, D.C."
    },
    {
     "n": "Base Alameda (Coast Guard Island)",
     "why": "Pacific Area headquarters"
    },
    {
     "n": "Base Portsmouth",
     "why": "Atlantic Area headquarters"
    },
    {
     "n": "Base Kodiak",
     "why": "Largest Coast Guard base"
    },
    {
     "n": "Base Elizabeth City / Air Station Elizabeth City",
     "why": "Aviation and logistics center"
    },
    {
     "n": "Base Miami Beach",
     "why": "Busy Southeast operations"
    },
    {
     "n": "Base Boston",
     "why": "Northeast operations"
    },
    {
     "n": "Base Seattle",
     "why": "Pacific Northwest operations and icebreakers"
    },
    {
     "n": "Base Honolulu",
     "why": "Pacific operations"
    },
    {
     "n": "Coast Guard Training Center Cape May",
     "why": "Boot camp"
    }
   ],
   "sources": [
    "https://www.uscg.mil/Units/"
   ]
  }
 ]
};
