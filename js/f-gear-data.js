"use strict";

// Data for the gear, uniforms and traditions pages (js/f-gear.js).
// Checked October 2026 against official branch sites (.mil fact files and
// news releases) and, where noted, Wikipedia or defense press reporting.
// Status codes: service (in service), new (being built or delivered),
// dev (in development or testing), retiring (being phased out).

window.F_GEAR = {
  gear: {
    army: {
      source: [
        "https://www.army.mil/article/285100",
        "https://www.army.mil/article/285828",
        "https://www.army.mil/article/290052",
        "https://asc.army.mil/web/portfolio/",
      ],
      items: [
        { n: "M1A2 Abrams", k: "land", ic: "🛡️", st: "service", what: "The Army's main battle tank, built to lead attacks and take on enemy armor.", fact: "Its gas turbine engine works like a jet engine and can burn jet fuel, diesel or gasoline.", sn: "A lighter M1E3 version was shown as an early prototype in January 2026 and is being tested by units." },
        { n: "M2 Bradley", k: "land", ic: "🛡️", st: "service", what: "A tracked infantry fighting vehicle that carries soldiers into battle and backs them up with a 25mm cannon.", fact: "It's named after Gen. Omar Bradley, who led U.S. ground forces in Europe in World War II.", sn: "A replacement (XM30) is in development." },
        { n: "Stryker", k: "land", ic: "🚙", st: "service", what: "An eight-wheeled armored vehicle family that moves infantry fast on roads, with versions for medics, mortars and command.", fact: "It's named after two Medal of Honor recipients who shared the last name Stryker, one from World War II and one from Vietnam.", sn: "" },
        { n: "AMPV (Armored Multi-Purpose Vehicle)", k: "land", ic: "🛡️", st: "new", what: "A tracked armored vehicle that replaces the old M113 as an ambulance, command post and mortar carrier in armored brigades.", fact: "It comes in five versions built on one shared design, which makes repairs and spare parts simpler.", sn: "Being delivered to units." },
        { n: "JLTV (Joint Light Tactical Vehicle)", k: "land", ic: "🚙", st: "service", what: "A light armored truck built to replace the Humvee for patrols and moving small teams.", fact: "It's light enough to be lifted under a CH-47 Chinook helicopter but much better protected against roadside bombs than a Humvee.", sn: "The Army stopped buying new ones in 2025 as part of the Army Transformation Initiative." },
        { n: "AH-64E Apache", k: "air", ic: "🚁", st: "service", what: "The Army's attack helicopter, used to destroy tanks and protect troops on the ground.", fact: "The pilot sits in the back seat and the copilot-gunner sits in front.", sn: "AH-64E in service. The older AH-64D models are being retired." },
        { n: "UH-60 Black Hawk", k: "air", ic: "🚁", st: "service", what: "The Army's workhorse helicopter for moving troops, cargo and wounded soldiers.", fact: "Many Army helicopters are named after Native American nations and leaders; Black Hawk was a Sauk leader.", sn: "The MV-75 tiltrotor will start replacing some of them around 2030." },
        { n: "CH-47F Chinook", k: "air", ic: "🚁", st: "service", what: "A twin-rotor heavy-lift helicopter that carries troops, artillery and vehicles.", fact: "Its two rotors spin in opposite directions, so it doesn't need a tail rotor. The first Chinook flew in 1961.", sn: "" },
        { n: "MV-75", k: "air", ic: "✈️", st: "dev", what: "A tiltrotor aircraft that takes off like a helicopter and flies like a plane, chosen to replace many Black Hawks.", fact: "The \"75\" honors the Army's founding in 1775.", sn: "In development. The first test aircraft is due by the end of 2026, with the first unit equipped around 2030." },
        { n: "M142 HIMARS", k: "land", ic: "🚀", st: "service", what: "A truck-mounted rocket launcher that fires precise guided rockets and missiles from long range.", fact: "It's small enough to fly inside a C-130 cargo plane.", sn: "In service with the Army and Marine Corps." },
        { n: "Patriot", k: "land", ic: "📡", st: "service", what: "A ground-based air and missile defense system that shoots down incoming aircraft and missiles.", fact: "Its name is an acronym: Phased Array Tracking Radar to Intercept on Target.", sn: "" },
        { n: "M109A7 Paladin", k: "land", ic: "🛡️", st: "service", what: "A self-propelled howitzer: a big cannon on tracks that fires artillery shells many miles away.", fact: "The M109 family has served since the 1960s; the A7 version has a new chassis and electric systems.", sn: "" },
      ],
    },
    usmc: {
      source: [
        "https://www.marines.mil/News/",
        "https://www.navair.navy.mil/",
        "https://en.wikipedia.org/wiki/List_of_equipment_of_the_United_States_Marine_Corps",
      ],
      items: [
        { n: "ACV (Amphibious Combat Vehicle)", k: "land", ic: "🌊", st: "service", what: "An eight-wheeled armored vehicle that swims from Navy ships to the beach and keeps going on land.", fact: "The personnel version carries 13 Marines plus a crew of three.", sn: "In service, replacing the old tracked AAV." },
        { n: "JLTV (Joint Light Tactical Vehicle)", k: "land", ic: "🚙", st: "service", what: "A light armored truck that replaces many Humvees.", fact: "The Marines also use JLTVs as the base for remote-controlled missile launchers.", sn: "" },
        { n: "LAV-25", k: "land", ic: "🚙", st: "service", what: "An eight-wheeled light armored vehicle used for scouting, with a 25mm cannon.", fact: "It can swim across rivers and lakes after a little preparation.", sn: "A replacement (the Advanced Reconnaissance Vehicle) is in development." },
        { n: "NMESIS", k: "land", ic: "🚀", st: "new", what: "A remote-controlled launcher on a JLTV chassis that fires Naval Strike Missiles at enemy ships from land.", fact: "There's no one aboard: Marines drive and fire it from a separate vehicle.", sn: "Being fielded with the new Marine Littoral Regiments." },
        { n: "M142 HIMARS", k: "land", ic: "🚀", st: "service", what: "A truck-mounted rocket launcher for long-range precision fires.", fact: "Marines have practiced flying HIMARS onto islands by KC-130J, firing, then leaving quickly.", sn: "" },
        { n: "F-35B Lightning II", k: "air", ic: "✈️", st: "service", what: "A stealth fighter that can take off from short runways and land straight down like a helicopter.", fact: "A big lift fan behind the cockpit and a swiveling exhaust nozzle let it hover.", sn: "In service and still arriving. The Marines also fly the carrier version, the F-35C." },
        { n: "AV-8B Harrier and F/A-18 Hornet", k: "air", ic: "✈️", st: "retiring", what: "The older jets that the F-35 is replacing in Marine squadrons.", fact: "The Marines started flying Harrier jump jets in 1971, decades before the F-35B could hover.", sn: "Being retired as F-35s arrive." },
        { n: "MV-22B Osprey", k: "air", ic: "✈️", st: "service", what: "A tiltrotor aircraft that carries Marines farther and faster than a helicopter.", fact: "It flies about twice as fast as the CH-46 helicopter it replaced.", sn: "" },
        { n: "CH-53K King Stallion", k: "air", ic: "🚁", st: "new", what: "The Marines' heavy-lift helicopter for carrying vehicles, artillery and supplies.", fact: "It can carry nearly three times the external load of the CH-53E it replaces.", sn: "Being delivered, replacing the CH-53E." },
        { n: "AH-1Z Viper", k: "air", ic: "🚁", st: "service", what: "The Marines' attack helicopter, used to support troops on the ground.", fact: "It shares about 84% of its parts with the UH-1Y Venom, which makes maintenance at sea easier.", sn: "" },
        { n: "UH-1Y Venom", k: "air", ic: "🚁", st: "service", what: "A utility helicopter for moving small teams, command and medical evacuation.", fact: "It's the modern descendant of the Vietnam-era \"Huey\".", sn: "" },
        { n: "KC-130J Super Hercules", k: "air", ic: "✈️", st: "service", what: "A four-engine plane that refuels aircraft in the air and hauls cargo and troops.", fact: "It can refuel both jets and helicopters from hoses that trail from its wings.", sn: "" },
        { n: "MQ-9A Reaper", k: "air", ic: "🛩️", st: "service", what: "A large remotely piloted aircraft used to watch over wide areas for long periods.", fact: "Marine Reapers help find targets for ships and missiles far out at sea.", sn: "" },
      ],
    },
    navy: {
      source: [
        "https://www.navy.mil/Resources/Fact-Files/",
        "https://www.navy.mil/Press-Office/News-Stories/display-news/Article/4471026/",
        "https://news.usni.org/2025/11/25/navy-cancels-constellation-class-frigate-program-considering-new-small-surface-combatants",
        "https://news.usni.org/2026/02/11/navy-says-columbia-class-sub-construction-schedule-improving",
      ],
      items: [
        { n: "Ford-class aircraft carrier", k: "sea", ic: "🚢", st: "new", what: "The Navy's newest nuclear-powered aircraft carriers, each a floating airfield with more than 70 aircraft.", fact: "It launches jets with electromagnetic catapults instead of steam.", sn: "USS Gerald R. Ford is in service; John F. Kennedy, Enterprise and Doris Miller are being built." },
        { n: "Nimitz-class aircraft carrier", k: "sea", ic: "🚢", st: "service", what: "Ten nuclear-powered carriers that form most of today's carrier fleet.", fact: "Each carrier gets one nuclear refueling in the middle of a roughly 50-year life.", sn: "The oldest, USS Nimitz, is nearing retirement." },
        { n: "Arleigh Burke-class destroyer", k: "sea", ic: "🚢", st: "new", what: "Multi-mission warships that defend against aircraft, missiles, submarines and surface ships.", fact: "It's named after Adm. Arleigh Burke, nicknamed \"31-knot Burke\" for pushing his ships at top speed.", sn: "More than 70 in service; newer Flight III ships with a stronger radar are still being built." },
        { n: "Ticonderoga-class cruiser", k: "sea", ic: "🚢", st: "retiring", what: "Large missile warships that coordinate air defense for carrier groups.", fact: "They were the first ships built around the Aegis radar and combat system.", sn: "Being retired; only a few remain." },
        { n: "Constellation-class frigate", k: "sea", ic: "🚢", st: "dev", what: "A smaller warship meant to escort other ships and hunt submarines.", fact: "Its design is based on a European frigate already in service with France and Italy.", sn: "The Navy cut the program in November 2025; the first two ships are still being built." },
        { n: "Amphibious assault ship (America and Wasp classes)", k: "sea", ic: "🚢", st: "service", what: "Big-deck ships that carry Marines, their helicopters, Ospreys and F-35Bs.", fact: "They look like small aircraft carriers and are bigger than many countries' carriers.", sn: "In service; more America-class ships are being built." },
        { n: "Virginia-class attack submarine", k: "sea", ic: "🌊", st: "new", what: "Nuclear-powered submarines that hunt ships and subs, gather intelligence and launch missiles.", fact: "Instead of a classic periscope it uses camera masts, so the control room doesn't sit under the sail.", sn: "In service and still being built." },
        { n: "Ohio-class submarine", k: "sea", ic: "🌊", st: "service", what: "Ballistic-missile submarines that quietly patrol as part of U.S. nuclear deterrence; four carry cruise missiles instead.", fact: "Each boat has two full crews, Blue and Gold, that take turns so the sub can spend more time at sea.", sn: "In service until the Columbia class replaces them, starting in the 2030s." },
        { n: "Columbia-class submarine", k: "sea", ic: "🌊", st: "new", what: "The next ballistic-missile submarine, replacing the Ohio class.", fact: "Its nuclear reactor is designed to last the sub's whole life without refueling.", sn: "The first boat, District of Columbia, is being built; the Navy is aiming for delivery in 2028." },
        { n: "F/A-18E/F Super Hornet", k: "air", ic: "✈️", st: "service", what: "The Navy's main carrier fighter and attack jet.", fact: "The Blue Angels have flown Super Hornets since 2021.", sn: "Production of new ones is winding down." },
        { n: "F-35C Lightning II", k: "air", ic: "✈️", st: "new", what: "The carrier version of the F-35 stealth fighter.", fact: "It has the biggest wings of the three F-35 versions, with folding tips to save deck space.", sn: "In service and still being delivered." },
        { n: "E-2D Advanced Hawkeye", k: "air", ic: "📡", st: "service", what: "A carrier plane with a huge radar that spots threats far away and directs other aircraft.", fact: "Its 24-foot radar dome spins about six times a minute in flight.", sn: "" },
        { n: "MH-60R and MH-60S Seahawk", k: "air", ic: "🚁", st: "service", what: "Navy helicopters: the R model hunts submarines and the S model moves cargo, rescues people and hunts mines.", fact: "The MH-60R can lower a sonar into the sea on a cable to listen for submarines.", sn: "" },
        { n: "P-8A Poseidon", k: "air", ic: "✈️", st: "service", what: "A long-range patrol plane that tracks submarines and ships over the ocean.", fact: "It's built from a Boeing 737 airliner and drops sonar buoys and torpedoes.", sn: "" },
        { n: "MQ-25 Stingray", k: "air", ic: "🛩️", st: "dev", what: "An uncrewed tanker that will refuel jets from aircraft carriers.", fact: "It's the first drone designed to operate as part of a carrier air wing.", sn: "In testing. The first production model flew in April 2026; carrier service is planned around 2029." },
      ],
    },
    af: {
      source: [
        "https://www.af.mil/About-Us/Fact-Sheets/",
        "https://www.airforcetimes.com/news/your-military/2026/04/20/us-air-force-extends-a-10-warthog-through-2030/",
      ],
      items: [
        { n: "F-35A Lightning II", k: "air", ic: "✈️", st: "new", what: "A stealth multirole fighter that gathers and shares sensor data with other forces.", fact: "The A model is the only F-35 version with a built-in cannon.", sn: "In service and still being delivered." },
        { n: "F-22 Raptor", k: "air", ic: "✈️", st: "service", what: "A stealth fighter built to win control of the air.", fact: "It can cruise faster than sound without using afterburners (\"supercruise\"). Only 195 were built.", sn: "" },
        { n: "F-15EX Eagle II", k: "air", ic: "✈️", st: "new", what: "A modern version of the F-15 that carries a large load of missiles and bombs.", fact: "It can carry up to 12 air-to-air missiles.", sn: "Being delivered." },
        { n: "F-16 Fighting Falcon", k: "air", ic: "✈️", st: "service", what: "A nimble multirole fighter and the Air Force's most numerous fighter.", fact: "The Thunderbirds demonstration team flies F-16s. Pilots call it the \"Viper\".", sn: "" },
        { n: "A-10C Thunderbolt II", k: "air", ic: "✈️", st: "retiring", what: "A tough close air support jet that protects troops on the ground.", fact: "It was designed around its huge 30mm cannon; everyone calls it the Warthog.", sn: "Being reduced. In April 2026 the Air Force said it will keep a smaller A-10 fleet flying through 2030." },
        { n: "B-21 Raider", k: "air", ic: "✈️", st: "dev", what: "A new stealth bomber that will replace the B-1 and B-2.", fact: "It's named after the Doolittle Raiders of World War II.", sn: "In flight testing; the first operational B-21 is expected at Ellsworth AFB, South Dakota, in 2027." },
        { n: "B-52H Stratofortress", k: "air", ic: "✈️", st: "service", what: "A long-range heavy bomber that can carry many kinds of weapons.", fact: "The B-52 first flew in 1952, and with new engines it's planned to fly into the 2050s.", sn: "In service; an engine and radar upgrade is underway." },
        { n: "B-2 Spirit", k: "air", ic: "✈️", st: "service", what: "A stealth bomber that can fly across the world to strike heavily defended targets.", fact: "Only 21 were built, and most are named \"Spirit of\" a U.S. state.", sn: "In service until the B-21 takes over." },
        { n: "KC-46A Pegasus", k: "air", ic: "⛽", st: "new", what: "A tanker that refuels other aircraft in flight and can also carry cargo and patients.", fact: "The boom operator steers the refueling boom using 3D screens instead of looking out a window.", sn: "Being delivered." },
        { n: "KC-135 Stratotanker", k: "air", ic: "⛽", st: "service", what: "The Air Force's long-serving aerial refueling tanker.", fact: "Most were built in the late 1950s and early 1960s and are still flying today.", sn: "In service, slowly being replaced by the KC-46." },
        { n: "C-17 Globemaster III", k: "air", ic: "✈️", st: "service", what: "A big cargo jet that carries troops, tanks and supplies around the world.", fact: "It can land on short, rough runways and even back up on the ground using its engines.", sn: "" },
        { n: "C-130J Super Hercules", k: "air", ic: "✈️", st: "service", what: "A four-propeller cargo plane for shorter trips, airdrops and rough airstrips.", fact: "The C-130 family has been built since the 1950s, the longest continuous production run of any military aircraft.", sn: "" },
        { n: "MQ-9 Reaper", k: "air", ic: "🛩️", st: "service", what: "A remotely piloted aircraft for surveillance and precision strikes.", fact: "A pilot and a sensor operator fly it from a ground station that can be thousands of miles away.", sn: "" },
        { n: "T-7A Red Hawk", k: "air", ic: "✈️", st: "dev", what: "A new jet trainer for Air Force student pilots.", fact: "Its name and red tail honor the Tuskegee Airmen of World War II.", sn: "In testing and early production; it will replace the T-38, which entered service in 1961." },
        { n: "LGM-30G Minuteman III", k: "land", ic: "🚀", st: "service", what: "Intercontinental ballistic missiles kept in underground silos as part of U.S. nuclear deterrence.", fact: "Missileers stand alert in underground capsules around the clock.", sn: "In service until the LGM-35A Sentinel replaces it in the 2030s." },
      ],
    },
    sf: {
      source: [
        "https://www.spaceforce.mil/About-Us/Fact-Sheets/",
        "https://www.ssc.spaceforce.mil/",
        "https://breakingdefense.com/2025/06/first-next-gen-opir-missile-warning-launch-pushed-to-2026/",
        "https://federalnewsnetwork.com/defense-main/2026/09/sda-pushes-for-two-more-launches-by-end-of-year-aims-to-complete-tranche-1-by-2027/",
      ],
      items: [
        { n: "GPS III", k: "space", ic: "🛰️", st: "service", what: "The newest Global Positioning System satellites, which give position and time signals to the whole world.", fact: "The Space Force runs GPS from Schriever Space Force Base, Colorado, and anyone can use it for free.", sn: "The last GPS III satellites launched in 2025 and 2026; improved GPS IIIF satellites are being built." },
        { n: "SBIRS (Space Based Infrared System)", k: "space", ic: "🛰️", st: "service", what: "Satellites that spot the heat of missile launches to give early warning.", fact: "Its sensors can pick up other heat flashes too, like large fires and explosions.", sn: "" },
        { n: "Next-Gen OPIR", k: "space", ic: "🛰️", st: "dev", what: "The next missile-warning satellites, replacing SBIRS.", fact: "The plan has two satellites in high orbit over the equator and two in polar orbits.", sn: "In development; the first launch has slipped several times." },
        { n: "X-37B", k: "space", ic: "🚀", st: "service", what: "A small, reusable robotic spaceplane used to test new technology in orbit.", fact: "One mission stayed in orbit for 908 days before landing on a runway.", sn: "In service; its eighth mission launched in 2025." },
        { n: "WGS (Wideband Global SATCOM)", k: "space", ic: "🛰️", st: "service", what: "High-capacity communications satellites for U.S. forces and allies.", fact: "A single WGS satellite carries more data than the entire older satellite network it replaced.", sn: "In service, with more being built." },
        { n: "AEHF (Advanced Extremely High Frequency)", k: "space", ic: "🛰️", st: "service", what: "Protected, jam-resistant communications satellites for national leaders and forces.", fact: "Canada, the United Kingdom, the Netherlands and Australia also use the system.", sn: "" },
        { n: "MUOS (Mobile User Objective System)", k: "space", ic: "🛰️", st: "service", what: "Satellites that let troops talk and send data from handheld radios almost anywhere.", fact: "It works a lot like a cell phone network, but in space. The Navy built it and the Space Force now runs it.", sn: "" },
        { n: "GSSAP", k: "space", ic: "🛰️", st: "service", what: "Satellites that watch other objects in high orbit, like a neighborhood watch for space.", fact: "They fly near geosynchronous orbit, about 22,000 miles up.", sn: "" },
        { n: "Proliferated satellite layers (Space Development Agency)", k: "space", ic: "🛰️", st: "new", what: "Large groups of smaller satellites in low orbit that pass data and track missiles.", fact: "The first group (Tranche 1) is planned at 154 satellites, launched in batches of about 21.", sn: "Being launched since September 2025; about 63 were up by September 2026." },
        { n: "Space Fence", k: "ground", ic: "📡", st: "service", what: "A powerful ground radar that tracks satellites and space debris.", fact: "It sits on Kwajalein Atoll in the Marshall Islands, in the middle of the Pacific.", sn: "" },
        { n: "Missile warning radars", k: "ground", ic: "📡", st: "service", what: "Giant ground radars that detect missiles and track objects in space.", fact: "One sits at Pituffik Space Base in Greenland, the northernmost U.S. military base.", sn: "" },
        { n: "Satellite Control Network", k: "ground", ic: "📡", st: "service", what: "Antennas around the world that let operators command and check on military satellites.", fact: "Guardians \"fly\" satellites from operations floors on the ground, never in space.", sn: "" },
        { n: "Counter Communications System", k: "ground", ic: "📡", st: "service", what: "A ground system that can temporarily block an enemy's satellite communications.", fact: "It's designed to be reversible: it interrupts signals without damaging the satellite.", sn: "" },
        { n: "National Security Space Launch", k: "space", ic: "🚀", st: "service", what: "The program that buys rocket launches from companies to put military satellites in orbit.", fact: "The Space Force runs the launch ranges at Cape Canaveral, Florida, and Vandenberg, California.", sn: "Ongoing." },
      ],
    },
    cg: {
      source: [
        "https://www.dcms.uscg.mil/Our-Organization/Assistant-Commandant-for-Acquisitions-CG-9/Programs/",
        "https://www.news.uscg.mil/Press-Releases/Article/3755097/",
        "https://news.usni.org/2026/06/12/coast-guard-eastern-shipbuilding-terminate-offshore-patrol-cutter-contract-rick-scott-ends-promotion-holds",
        "https://news.usni.org/2025/06/05/ingalls-coast-guard-scrap-11th-national-security-cutter-over-contract-impasse-says-hii",
      ],
      items: [
        { n: "National Security Cutter (Legend class)", k: "sea", ic: "🚢", st: "service", what: "The Coast Guard's largest patrol cutters, 418 feet long, for long missions far offshore.", fact: "They launch small boats from a ramp in the stern and carry a helicopter.", sn: "10 in service. Plans for an 11th were canceled in 2025." },
        { n: "Offshore Patrol Cutter (Heritage class)", k: "sea", ic: "🚢", st: "new", what: "New 360-foot cutters for drug interdiction, fisheries patrols and rescue at sea.", fact: "They're named after famous cutters from Coast Guard history.", sn: "Being built; none in service yet. The first ship, Argus, launched in 2023 and is waiting to be finished." },
        { n: "Fast Response Cutter (Sentinel class)", k: "sea", ic: "🚤", st: "new", what: "154-foot patrol boats for search and rescue, law enforcement and port security near the coast.", fact: "Each one is named after an enlisted Coast Guard hero.", sn: "More than 60 delivered; the final ones are still arriving." },
        { n: "Medium endurance cutters", k: "sea", ic: "🚢", st: "retiring", what: "210-foot and 270-foot cutters that have patrolled for decades.", fact: "Some of the 210-foot cutters have been in service since the 1960s.", sn: "Being retired as Offshore Patrol Cutters arrive." },
        { n: "USCGC Polar Star", k: "sea", ic: "🧊", st: "service", what: "The nation's only heavy icebreaker, which clears a path to the U.S. base in Antarctica every year.", fact: "It was commissioned in 1976 and can break ice about 21 feet thick by backing up and ramming.", sn: "In service, with repairs to keep it going until new icebreakers arrive." },
        { n: "USCGC Healy", k: "sea", ic: "🧊", st: "service", what: "A medium icebreaker that supports science in the Arctic.", fact: "In 2015 it became the first U.S. surface ship to reach the North Pole alone.", sn: "" },
        { n: "USCGC Storis", k: "sea", ic: "🧊", st: "service", what: "A polar icebreaker bought from industry to boost the Coast Guard's presence in Alaska and the Arctic.", fact: "It was the first polar icebreaker added to the fleet in more than 25 years.", sn: "In service, homeported in Juneau, Alaska." },
        { n: "Polar and Arctic Security Cutters", k: "sea", ic: "🧊", st: "dev", what: "New heavy and medium icebreakers to replace and grow the aging icebreaker fleet.", fact: "Some of the new Arctic Security Cutters are being built in Finland, a leading icebreaker builder.", sn: "In development and early construction; the first heavy icebreaker is years late." },
        { n: "Small boats (47-foot Motor Lifeboat, Response Boat-Medium)", k: "sea", ic: "🚤", st: "service", what: "Fast boats at stations along the coasts for rescues and law enforcement.", fact: "The 47-foot Motor Lifeboat can roll all the way over in heavy surf and right itself.", sn: "" },
        { n: "Buoy tenders", k: "sea", ic: "🚢", st: "service", what: "Cutters that place and fix buoys and other aids to navigation that keep ships safe.", fact: "The Coast Guard looks after tens of thousands of buoys, lights and markers.", sn: "" },
        { n: "USCGC Eagle", k: "sea", ic: "⛵", st: "service", what: "A 295-foot tall ship used to train Coast Guard Academy cadets and officer candidates.", fact: "It was built in Germany in 1936 and taken by the U.S. after World War II.", sn: "" },
        { n: "MH-60T Jayhawk", k: "air", ic: "🚁", st: "service", what: "A medium-range rescue helicopter used for search and rescue and law enforcement.", fact: "Rescue swimmers drop from it into the water to save people.", sn: "In service; becoming the Coast Guard's only helicopter type." },
        { n: "MH-65 Dolphin", k: "air", ic: "🚁", st: "retiring", what: "A smaller rescue helicopter that can also fly from cutters.", fact: "Special crews use it with marksmen to stop drug-smuggling boats.", sn: "Being retired; several air stations have already switched to the MH-60T." },
        { n: "HC-130J Super Hercules", k: "air", ic: "✈️", st: "service", what: "A long-range search plane for rescues, drug patrols and moving cargo.", fact: "It can search huge areas of ocean and drop rescue gear to people in the water.", sn: "" },
        { n: "HC-27J Spartan and HC-144 Ocean Sentry", k: "air", ic: "✈️", st: "service", what: "Medium-range planes for searches and patrols along the coasts.", fact: "The Coast Guard's 14 HC-27Js came from the Air Force.", sn: "" },
      ],
    },
  },

  // Uniforms. Swatch colors are approximate, for illustration only.
  uniforms: {
    army: {
      source: ["https://www.army.mil/uniforms/", "https://armypubs.army.mil/"],
      items: [
        { n: "Army Combat Uniform (ACU)", kind: "Combat and utility", pattern: "OCP (Operational Camouflage Pattern)", sw: ["#a8996f", "#6f6b4a", "#4f4130", "#c8b993", "#86804f"], when: "Everyday duty, field training and most workplaces.", fact: "OCP replaced the gray-green digital pattern (UCP) in 2019. A lighter hot-weather version is also issued." },
        { n: "Army Green Service Uniform (AGSU)", kind: "Service", pattern: "Olive green coat with tan trousers", sw: ["#4d5338", "#a08e72"], when: "Office and business wear, official travel and many ceremonies.", fact: "It's modeled on the \"pinks and greens\" officers wore in World War II." },
        { n: "Army Blue Service Uniform", kind: "Dress", pattern: "Dark blue coat with light blue trousers", sw: ["#1c2741", "#7b93b5"], when: "Formal events, evening functions and ceremonies.", fact: "Blue has been part of Army dress uniforms since the Revolutionary War." },
        { n: "Army Physical Fitness Uniform (APFU)", kind: "PT", pattern: "Black and gold", sw: ["#141414", "#c9a23a"], when: "Physical training and fitness tests.", fact: "Black and gold are the Army's official colors." },
      ],
    },
    usmc: {
      source: ["https://www.marines.mil/", "https://www.marines.mil/News/Messages/"],
      items: [
        { n: "Marine Corps Combat Utility Uniform (MCCUU)", kind: "Combat and utility", pattern: "MARPAT woodland", sw: ["#59613d", "#3a4029", "#2a2219", "#7b7a53", "#1a1a14"], when: "Everyday work and field training; woodland is the standard in most places.", fact: "Look closely and you'll find tiny Eagle, Globe and Anchor emblems hidden in the pattern." },
        { n: "Marine Corps Combat Utility Uniform (MCCUU)", kind: "Combat and utility", pattern: "MARPAT desert", sw: ["#c2ab84", "#9b8361", "#6e5a42", "#d7c7a2"], when: "Hot, dry places and some deployments, as commanders direct.", fact: "Marines often call their utilities \"cammies\"." },
        { n: "Service uniform (Alpha, Bravo, Charlie)", kind: "Service", pattern: "Green coat and trousers, khaki shirt", sw: ["#4c5136", "#c8b88f"], when: "Office work, travel and many official events.", fact: "Alpha includes the green coat; Bravo and Charlie drop the coat for a long- or short-sleeve khaki shirt." },
        { n: "Dress Blues", kind: "Dress", pattern: "Dark blue coat, blue trousers with a red stripe, white cover", sw: ["#141a33", "#3d4f80", "#b11e2c", "#f2f2ee"], when: "Ceremonies, formal events and the Marine Corps Birthday Ball.", fact: "Noncommissioned officers and officers wear a red \"blood stripe\" on their trousers; tradition links it to the Battle of Chapultepec in 1847." },
        { n: "Physical training gear", kind: "PT", pattern: "Olive green shirt and shorts", sw: ["#3f4a2c", "#596540"], when: "Physical training and the Physical Fitness Test.", fact: "For the Combat Fitness Test, Marines wear boots and utility trousers." },
      ],
    },
    navy: {
      source: ["https://www.mynavyhr.navy.mil/References/US-Navy-Uniforms/", "https://www.mynavyhr.navy.mil/Portals/55/Messages/NAVADMIN/NAV2026/NAV26101.pdf"],
      items: [
        { n: "Navy Working Uniform Type III (NWU III)", kind: "Combat and utility", pattern: "AOR 2 woodland digital", sw: ["#5d6243", "#3d4330", "#7a6e4e", "#2c2a22"], when: "Daily work ashore and in many offices; since May 2026 it's also allowed in the Pentagon.", fact: "It replaced the blue-and-gray \"blueberries\" uniform, which was phased out in 2019." },
        { n: "Flame-resistant coveralls", kind: "Combat and utility", pattern: "Navy blue", sw: ["#1f2b44"], when: "Aboard ships and submarines underway.", fact: "Fire is one of the biggest dangers at sea, so shipboard work clothes are flame resistant." },
        { n: "Service uniform (khakis and the Navy Service Uniform)", kind: "Service", pattern: "Khaki for chiefs and officers; khaki shirt with black trousers for junior sailors", sw: ["#b49f73", "#1a1a1a"], when: "Office work, daily duty ashore and travel.", fact: "Becoming a chief petty officer means trading in your old uniform for khakis, like an officer." },
        { n: "Service Dress Blues and Whites", kind: "Dress", pattern: "Dark navy blue in cool months, white in warm months", sw: ["#141c33", "#f2f2ee"], when: "Ceremonies, inspections and formal events, changing with the season.", fact: "Junior enlisted sailors still wear the classic jumper-style uniform with a flap collar and neckerchief." },
        { n: "Physical Training Uniform (PTU)", kind: "PT", pattern: "Gold shirt, navy blue shorts", sw: ["#d5a933", "#1d2a4a"], when: "Physical training and the Physical Readiness Test.", fact: "The shirt and shorts have reflective NAVY lettering so sailors are visible on early runs." },
      ],
    },
    af: {
      source: ["https://www.af.mil/", "https://en.wikipedia.org/wiki/Uniforms_of_the_United_States_Air_Force"],
      items: [
        { n: "OCP uniform", kind: "Combat and utility", pattern: "OCP (Operational Camouflage Pattern)", sw: ["#a8996f", "#6f6b4a", "#4f4130", "#c8b993", "#86804f"], when: "Everyday duty for most Airmen, in offices and the field.", fact: "The Air Force switched from its own tiger-stripe digital uniform (ABU) to the Army's OCP pattern, finishing in 2021." },
        { n: "Blues (service uniform)", kind: "Service", pattern: "Light blue shirt, dark blue trousers or skirt", sw: ["#8da6c8", "#1d2d4f"], when: "Office jobs, official meetings and travel.", fact: "Blue uniforms helped set the new Air Force apart from the Army after it became its own branch in 1947." },
        { n: "Service Dress", kind: "Dress", pattern: "Dark blue coat with silver buttons", sw: ["#1a2847", "#b9bfc8"], when: "Ceremonies, formal events and official photos.", fact: "Airmen wear their badges and ribbons on the coat, telling their career at a glance." },
        { n: "Mess Dress", kind: "Dress", pattern: "Dark blue formal jacket with bow tie", sw: ["#141d33", "#e9e9e9"], when: "Formal evening events like a dining-in or the Air Force Ball.", fact: "It's the Air Force's version of a tuxedo." },
        { n: "Physical training gear (PTG)", kind: "PT", pattern: "Dark blue and gray with reflective trim", sw: ["#1e2b48", "#8a8f99"], when: "Physical training and the fitness assessment.", fact: "The reflective trim helps Airmen stay visible during early-morning runs." },
      ],
    },
    sf: {
      source: ["https://www.spaceforce.mil/News/Article-Display/Article/4299727/us-space-force-unveils-service-dress-uniform-implementation-plan/", "https://www.airforcetimes.com/news/your-military/2025/12/26/latest-class-of-guardians-first-to-don-new-dress-uniform-at-graduation/"],
      items: [
        { n: "OCP uniform", kind: "Combat and utility", pattern: "OCP (Operational Camouflage Pattern)", sw: ["#a8996f", "#6f6b4a", "#4f4130", "#c8b993", "#86804f"], when: "Everyday duty for most Guardians.", fact: "Guardians wear the same pattern as the Army and Air Force, but their name tapes are stitched in blue thread." },
        { n: "Space Force Service Dress", kind: "Service and dress", pattern: "Dark navy coat with an off-center row of buttons", sw: ["#1a2236", "#8c93a0"], when: "Office work, ceremonies and formal events.", fact: "It debuted at a basic training graduation in December 2025; Guardians are receiving it in phases through 2026." },
        { n: "Air Force-style blues (until the new uniform is issued)", kind: "Service", pattern: "Light blue shirt, dark blue trousers", sw: ["#8da6c8", "#1d2d4f"], when: "Used by Guardians who haven't received the new service dress yet.", fact: "The Space Force shares many support systems with the Air Force, its sister service in the Department of the Air Force." },
        { n: "Physical training gear", kind: "PT", pattern: "Dark blue and gray", sw: ["#1c2540", "#8a8f99"], when: "Physical training and fitness checks.", fact: "The Space Force has tried new ways to measure fitness, including wearable fitness trackers." },
      ],
    },
    cg: {
      source: ["https://www.uscg.mil/", "https://en.wikipedia.org/wiki/Uniforms_of_the_United_States_Coast_Guard"],
      items: [
        { n: "Operational Dress Uniform (ODU)", kind: "Combat and utility", pattern: "Solid dark blue", sw: ["#1d2840"], when: "Everyday work on cutters, at stations and in most offices.", fact: "Crews often wear it with a ball cap showing their unit or cutter's name." },
        { n: "Tropical Blue", kind: "Service", pattern: "Light blue short-sleeve shirt, dark blue trousers", sw: ["#9fb6d4", "#1d2a4a"], when: "Office work and daily business.", fact: "It's one of the most common uniforms you'll see at Coast Guard offices." },
        { n: "Service Dress Blue", kind: "Dress", pattern: "Blue coat with white shirt and tie", sw: ["#25355a", "#f2f2ee"], when: "Ceremonies, formal events and travel.", fact: "Coast Guard blue is its own shade, a little different from Navy and Air Force blue." },
        { n: "Physical training gear", kind: "PT", pattern: "Blue and gray with Coast Guard markings", sw: ["#1f3360", "#8a8f99"], when: "Physical training and fitness tests.", fact: "Coast Guard members also have to pass swim tests, since so much of the work is on the water." },
      ],
    },
  },

  // Birthdays (month is 1-12) and traditions.
  birthdays: [
    { b: "army", m: 6, d: 14, y: 1775, what: "The Continental Congress created the Continental Army.", source: "https://www.army.mil/birthday/" },
    { b: "navy", m: 10, d: 13, y: 1775, what: "The Continental Congress ordered the first ships for a Continental Navy.", source: "https://www.history.navy.mil/" },
    { b: "usmc", m: 11, d: 10, y: 1775, what: "The Continental Congress created two battalions of Continental Marines.", source: "https://www.usmcu.edu/" },
    { b: "cg", m: 8, d: 4, y: 1790, what: "Congress created the Revenue Cutter Service, the Coast Guard's oldest ancestor, at Alexander Hamilton's urging.", source: "https://www.history.uscg.mil/" },
    { b: "af", m: 9, d: 18, y: 1947, what: "The Air Force became a separate branch under the National Security Act of 1947.", source: "https://www.af.mil/" },
    { b: "sf", m: 12, d: 20, y: 2019, what: "The Space Force was created when the National Defense Authorization Act was signed.", source: "https://www.spaceforce.mil/" },
  ],

  // Holidays: fixed dates, or the nth weekday of a month (w: 0 Sunday ... 6 Saturday; nth -1 is the last one).
  holidays: [
    { n: "Armed Forces Day", ic: "🎖️", rule: { m: 5, w: 6, nth: 3 }, when: "Third Saturday in May", what: "Honors everyone serving in the military right now." },
    { n: "Memorial Day", ic: "🕯️", rule: { m: 5, w: 1, nth: -1 }, when: "Last Monday in May", what: "Honors those who died while serving." },
    { n: "Veterans Day", ic: "⭐", rule: { m: 11, d: 11 }, when: "November 11", what: "Honors everyone who has served." },
    { n: "Army–Navy Game", ic: "🏈", rule: { m: 12, w: 6, nth: 2 }, when: "Usually the second Saturday in December", what: "West Point and the Naval Academy's college football rivalry. The 2026 game is December 12 at MetLife Stadium, New Jersey." },
  ],

  traditions: {
    army: {
      source: "https://www.army.mil/",
      items: [
        ["Army Birthday Ball", "Soldiers celebrate June 14 with formal balls and cake cutting, often with the oldest and youngest soldier present."],
        ["\"Hooah!\"", "An all-purpose Army word for \"yes\", \"got it\" or \"let's go\"."],
        ["The Old Guard at the Tomb", "The Tomb of the Unknown Soldier at Arlington has been guarded every minute of every day since 1937; soldiers of the 3rd Infantry Regiment (The Old Guard) have done it since 1948."],
        ["Spur Ride", "Cavalry soldiers earn the right to wear spurs by passing a tough multi-day test."],
        ["\"The Army Goes Rolling Along\"", "The Army song, played at ceremonies while soldiers stand and sing."],
      ],
    },
    usmc: {
      source: "https://www.marines.mil/",
      items: [
        ["Birthday cake cutting", "On November 10, the first slice goes to the guest of honor, then the oldest Marine present passes a slice to the youngest, passing on experience to the next generation."],
        ["Lejeune's birthday message", "Every year Marines read a message from former Commandant Gen. John A. Lejeune, first published in 1921."],
        ["\"Semper Fi\"", "Short for Semper Fidelis, \"Always Faithful\", the Marine Corps motto."],
        ["\"Oorah!\"", "The Marine battle cry and all-purpose cheer."],
        ["The Marines' Hymn", "\"From the Halls of Montezuma...\" is often called the oldest official song in the U.S. military."],
      ],
    },
    navy: {
      source: "https://www.history.navy.mil/",
      items: [
        ["Chief pinning", "New chief petty officers are pinned with gold anchors in a ceremony each fall, often by family members, after weeks of tough training from other chiefs."],
        ["Crossing the Line", "Sailors crossing the equator for the first time go through a ceremony to turn from \"pollywogs\" into \"shellbacks\"."],
        ["\"Hooyah!\"", "The Navy's cheer, used a lot in Navy special warfare and boot camp."],
        ["\"Anchors Aweigh\"", "The Navy's song, first written for the Army–Navy football game in 1906."],
        ["Bill the Goat", "The Naval Academy mascot, a goat, has been part of Navy football since the 1890s."],
      ],
    },
    af: {
      source: "https://www.af.mil/",
      items: [
        ["Dining-in and dining-out", "Formal dinners full of toasts and rules; break one and you may be sent to drink from the \"grog bowl\". A dining-out includes spouses and guests."],
        ["Missing man formation", "At memorial flyovers, one jet pulls up and away from the formation to honor a fallen Airman."],
        ["Fini flight", "On a pilot's final flight with a unit, friends greet them with a water hose or champagne."],
        ["\"Aim High... Fly-Fight-Win\"", "The Air Force motto."],
        ["\"The U.S. Air Force\" song", "Better known as \"Off we go, into the wild blue yonder...\""],
      ],
    },
    sf: {
      source: "https://www.spaceforce.mil/",
      items: [
        ["Guardians", "Space Force members have been called Guardians since December 2020."],
        ["\"Semper Supra\"", "The motto means \"Always Above\". It's also the name of the official Space Force song, released in 2022."],
        ["The Delta", "The Delta symbol on the logo and seal comes from early Air Force space emblems."],
        ["Building new traditions", "As the newest branch, the Space Force is still creating its own customs, ceremonies and birthday celebrations."],
      ],
    },
    cg: {
      source: "https://www.history.uscg.mil/",
      items: [
        ["\"Semper Paratus\"", "The motto means \"Always Ready\", and it's also the name of the Coast Guard song."],
        ["Coast Guard Day", "August 4 is celebrated with cookouts and events; Grand Haven, Michigan, calls itself \"Coast Guard City, USA\" and holds a big festival."],
        ["The racing stripe", "The orange-red slanted stripe on cutters, boats and aircraft has marked the Coast Guard since 1967."],
        ["Eagle cruises", "Coast Guard Academy cadets spend part of a summer sailing the tall ship Eagle and learning seamanship."],
      ],
    },
  },
};
