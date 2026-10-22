"use strict";

// Quiz and explorer content. Logic lives in logic.js and app.js.

// Traits run from -2 to +2. Each has a phrase for each direction, used to
// explain results.
const TRAITS = {
  sea:       { pos: "lots of time at sea",              neg: "staying on dry land" },
  land:      { pos: "field work on land",               neg: "work away from the field" },
  air:       { pos: "aircraft and flying",              neg: "work away from aviation" },
  space:     { pos: "space and satellites",             neg: "work here on Earth rather than in space" },
  physical:  { pos: "hard physical challenges",         neg: "less physically demanding work" },
  tech:      { pos: "highly technical work",            neg: "hands-on, non-technical work" },
  tradition: { pos: "strict discipline and tradition",  neg: "a relaxed, professional culture" },
  travel:    { pos: "deploying far from home",          neg: "staying close to home" },
  homeland:  { pos: "home-front work like rescues, disaster response and policing", neg: "overseas military missions" },
  combat:    { pos: "front-line combat roles",          neg: "support and non-combat roles" },
  scale:     { pos: "a huge organization",              neg: "a small, tight-knit branch" },
  comfort:   { pos: "comfortable living conditions",    neg: "roughing it" },
};

// Branch profiles on the same -2..+2 scale. These are broad generalizations;
// every branch has a wide range of jobs.
const BRANCHES = {
  army: {
    name: "Army",
    color: "#8fa45a",
    tagline: "The biggest branch, with a job for almost everything.",
    about: "The Army handles land operations. Because it's so big, it has a huge range of jobs: infantry, armor, artillery, medicine, engineering, logistics, intelligence, cyber, and more helicopters than any other branch.",
    traits: { sea: -1, land: 2, air: 0, space: -1, physical: 1, tech: 1, tradition: 1, travel: 1, homeland: 1, combat: 2, scale: 2, comfort: 0 },
  },
  usmc: {
    name: "Marine Corps",
    color: "#d0453a",
    tagline: "A fast, tough expeditionary force.",
    about: "The Marines deploy quickly by sea and air, often from Navy ships. It's part of the Department of the Navy. It's known for the toughest boot camp, strong tradition, and an \"every Marine a rifleman\" mindset, no matter the job.",
    traits: { sea: 1, land: 2, air: 0, space: -2, physical: 2, tech: -1, tradition: 2, travel: 2, homeland: -1, combat: 2, scale: 0, comfort: -2 },
  },
  navy: {
    name: "Navy",
    color: "#4a7fd6",
    tagline: "Ships, submarines and carriers around the world.",
    about: "The Navy operates on, under and above the sea worldwide. It has lots of technical jobs, from nuclear power and engineering to aviation, plus long deployments and port visits in other countries.",
    traits: { sea: 2, land: -1, air: 1, space: -1, physical: 0, tech: 1, tradition: 1, travel: 2, homeland: -1, combat: 0, scale: 1, comfort: -1 },
  },
  af: {
    name: "Air Force",
    color: "#5fb8e8",
    tagline: "Aircraft, tech, and a good quality of life.",
    about: "The Air Force runs aircraft, airlift, refueling and a lot of the military's tech and cyber work. It's known for comfortable bases and many jobs that turn into civilian careers.",
    traits: { sea: -2, land: 0, air: 2, space: 1, physical: -1, tech: 2, tradition: -1, travel: 0, homeland: 0, combat: -1, scale: 1, comfort: 2 },
  },
  sf: {
    name: "Space Force",
    color: "#b9a6f0",
    tagline: "The newest and smallest branch, working in orbit.",
    about: "Created in 2019, the Space Force operates satellites, missile warning, GPS and space tracking. Its members are called Guardians. It's small and very tech focused, so most jobs involve screens and systems rather than field work.",
    traits: { sea: -2, land: -1, air: 0, space: 2, physical: -2, tech: 2, tradition: -1, travel: -1, homeland: 0, combat: -2, scale: -2, comfort: 2 },
  },
  cg: {
    name: "Coast Guard",
    color: "#3fd0c0",
    tagline: "Rescues and law enforcement on U.S. waters.",
    about: "In peacetime the Coast Guard is part of the Department of Homeland Security. It does search and rescue, stops drug smuggling, enforces maritime law and protects the environment, mostly close to U.S. coasts. It's small, and its missions happen at home.",
    traits: { sea: 2, land: -1, air: 0, space: -2, physical: 1, tech: 0, tradition: 0, travel: -2, homeland: 2, combat: -1, scale: -2, comfort: 0 },
  },
};

const ORDER = ["army", "usmc", "navy", "af", "sf", "cg"];

// Each option nudges one or more traits. Questions are deliberately indirect,
// so no single answer decides the result.
// The full question pool. Each quiz draws a balanced set from it (see
// pickQuestions in logic.js). Ids are permanent because share links store
// them; never reuse or renumber one. `fixed` keeps a scale's options in
// order instead of shuffling them. `always` questions are in every quiz
// because results depend on them (special ops interest, degree plans,
// full-time or part-time).
const POOL = [
  { id: 1, topic: "Environment", q: "Pick the view from your workplace window.", options: [
    { t: "Endless ocean in every direction", w: { sea: 2, land: -1 } },
    { t: "Forests, deserts or mountains", w: { land: 2, sea: -1 } },
    { t: "A flight line full of aircraft", w: { air: 2 } },
    { t: "No window, just a wall of screens tracking satellites", w: { space: 2, tech: 1, physical: -1 } },
  ] },
  { id: 2, topic: "Free time", q: "A free weekend. Which trip do you pick?", options: [
    { t: "Backpacking and sleeping on the ground", w: { physical: 1, comfort: -2, land: 1 } },
    { t: "Fishing or boating", w: { sea: 2 } },
    { t: "An air show or a space center", w: { air: 1, space: 1, tech: 1 } },
    { t: "A nice hotel with good Wi-Fi", w: { comfort: 2, physical: -1 } },
  ] },
  { id: 3, fixed: true, topic: "Sea time", q: "How do you feel about living on a ship for months?", options: [
    { t: "Sounds like an adventure", w: { sea: 2, travel: 1 } },
    { t: "Days or weeks on a boat, sure. Months is a lot", w: { sea: 1, travel: -1 } },
    { t: "I'd rather keep my feet on the ground", w: { sea: -1 } },
    { t: "I get seasick just thinking about it", w: { sea: -2 } },
  ] },
  { id: 4, fixed: true, topic: "Fitness", q: "A 12-mile hike carrying a heavy pack sounds...", options: [
    { t: "Like a good day", w: { physical: 2, land: 1 } },
    { t: "Tough, but I'd push through", w: { physical: 1 } },
    { t: "Like something I'd do only if I had to", w: { physical: -1 } },
    { t: "Like a hard pass", w: { physical: -2 } },
  ] },
  { id: 5, fixed: true, topic: "Combat", q: "How do you feel about possibly being in direct combat?", options: [
    { t: "It's a big part of why I'd join", w: { combat: 2 } },
    { t: "I'd accept it if it came to that", w: { combat: 1 } },
    { t: "I'd prefer a support or technical role", w: { combat: -1, tech: 1 } },
    { t: "I want to protect and help people, not fight", w: { combat: -2, homeland: 1 } },
  ] },
  { id: 6, fixed: true, topic: "Tech", q: "A friend's computer stops working. You...", options: [
    { t: "Open it up and fix it", w: { tech: 2 } },
    { t: "Look it up and probably figure it out", w: { tech: 1 } },
    { t: "Tell them to take it to a shop", w: { tech: -1 } },
    { t: "Would rather be outside than fixing anything", w: { tech: -2, land: 1 } },
  ] },
  { id: 7, fixed: true, topic: "Discipline", q: "Daily inspections, perfect uniforms, marching in step:", options: [
    { t: "Love it. Discipline makes me better", w: { tradition: 2 } },
    { t: "Fine with it", w: { tradition: 1 } },
    { t: "I'd put up with it", w: { tradition: -1 } },
    { t: "It would drive me up the wall", w: { tradition: -2 } },
  ] },
  { id: 8, fixed: true, topic: "Travel", q: "How often do you want to be away from home?", options: [
    { t: "As much as possible", w: { travel: 2 } },
    { t: "Some deployments are fine", w: { travel: 1 } },
    { t: "Rarely", w: { travel: -1, homeland: 1 } },
    { t: "I want to stay in the U.S.", w: { travel: -2, homeland: 2 } },
  ] },
  { id: 9, topic: "Purpose", q: "Which headline would make you proudest to be part of?", options: [
    { t: "\"Rescuers pull 40 people from hurricane floodwaters\"", w: { homeland: 2, sea: 1 } },
    { t: "\"Troops secure key city overseas\"", w: { combat: 2, land: 1, travel: 1 } },
    { t: "\"Carrier group arrives to calm tensions abroad\"", w: { sea: 2, travel: 2 } },
    { t: "\"New satellites keep GPS safe from jamming\"", w: { space: 2, tech: 2 } },
    { t: "\"Airlift gets supplies across the globe in 24 hours\"", w: { air: 2, travel: 1 } },
  ] },
  { id: 10, fixed: true, topic: "Size", q: "Big organization or small?", options: [
    { t: "The biggest, with the most options", w: { scale: 2 } },
    { t: "Big, but not giant", w: { scale: 1 } },
    { t: "Small, where I'd stand out", w: { scale: -2 } },
  ] },
  { id: 11, fixed: true, topic: "Options", q: "How do you feel about picking a job?", options: [
    { t: "Give me hundreds of choices, I want to explore", w: { scale: 2, comfort: 1 } },
    { t: "A solid list is fine", w: { scale: 1 } },
    { t: "I already know exactly what I want to do", w: { scale: -1 } },
    { t: "Doesn't matter, the mission and the people matter more", w: { tradition: 2, comfort: -1 } },
  ] },
  { id: 12, topic: "Boot camp", q: "Which boot camp would you choose?", options: [
    { t: "The longest and hardest one, no shortcuts", w: { physical: 2, tradition: 2, comfort: -2 } },
    { t: "Tough, but standard", w: { physical: 1, tradition: 1 } },
    { t: "Swimming, seamanship and survival training", w: { sea: 2, physical: 1 } },
    { t: "Shorter, then straight into technical school", w: { tech: 2, physical: -1, comfort: 1 } },
  ] },
  { id: 13, topic: "Team", q: "What's your ideal team?", options: [
    { t: "A big unit with hundreds of people", w: { scale: 2 } },
    { t: "A crew of a couple dozen", w: { scale: 0, sea: 1 } },
    { t: "A small team of specialists", w: { scale: -1, tech: 1 } },
    { t: "A four-person fire team, tight like family", w: { combat: 1, physical: 1 } },
  ] },
  { id: 14, topic: "Living", q: "Pick a place to live.", options: [
    { t: "A bunk on a ship with my crew", w: { sea: 2, comfort: -1 } },
    { t: "Out in the field sometimes, roughing it", w: { land: 2, comfort: -2 } },
    { t: "A nice dorm, a good gym and decent food", w: { comfort: 2 } },
    { t: "A small station in a coastal town", w: { homeland: 1, sea: 1, scale: -1 } },
  ] },
  { id: 15, topic: "Pace", q: "Pick a pace of life.", options: [
    { t: "Ready to deploy anywhere on short notice", w: { travel: 2, combat: 1 } },
    { t: "Long missions, then long breaks", w: { sea: 1, travel: 1 } },
    { t: "A steady, predictable schedule", w: { comfort: 1, travel: -1 } },
    { t: "On call for emergencies close to home", w: { homeland: 2, travel: -1 } },
  ] },
  { id: 16, topic: "Pressure", q: "A storm hits and a boat is sinking offshore. Where do you want to be?", options: [
    { t: "In the helicopter heading out to pull people out", w: { homeland: 2, sea: 1, air: 1 } },
    { t: "On a ship nearby, turning to help", w: { sea: 2 } },
    { t: "Coordinating everything from the operations center", w: { tech: 1, combat: -1 } },
    { t: "Honestly, I'd rather be the one storming a beach", w: { combat: 2, sea: 1, land: 1 } },
  ] },
  { id: 17, topic: "Future", q: "What do you want to do after you get out?", options: [
    { t: "A tech career: IT, cyber or engineering", w: { tech: 2 } },
    { t: "Police, firefighting or EMS", w: { homeland: 2, physical: 1 } },
    { t: "A skilled trade: mechanic, electrician, welder", w: { tech: 1, comfort: -1 } },
    { t: "Aviation: airline pilot or aircraft mechanic", w: { air: 2 } },
    { t: "Leading people and running things", w: { tradition: 1, combat: 1 } },
  ] },
  { id: 18, topic: "Games", q: "Which kind of game do you pick?", options: [
    { t: "Squad-based shooter", w: { combat: 1, land: 1 } },
    { t: "Flight sim", w: { air: 2 } },
    { t: "Strategy, building something huge", w: { scale: 1, tech: 1 } },
    { t: "Survival or exploration", w: { physical: 1, comfort: -1 } },
    { t: "Space sim", w: { space: 2 } },
  ] },
  { id: 19, topic: "Learning", q: "How do you learn best?", options: [
    { t: "Doing it physically, over and over", w: { physical: 1, tech: -1 } },
    { t: "A mix of classroom and hands-on", w: { tech: 1 } },
    { t: "Months of deep technical study", w: { tech: 2, comfort: 1 } },
    { t: "Figuring it out under pressure in the moment", w: { combat: 1, physical: 1 } },
  ] },
  { id: 20, topic: "Authority", q: "Someone in charge gives you an order you think is dumb. You...", options: [
    { t: "Do it. You trust the chain of command", w: { tradition: 2 } },
    { t: "Do it, then bring it up later", w: { tradition: 1 } },
    { t: "Ask why first", w: { tradition: -1, tech: 1 } },
    { t: "Find a smarter way to get it done", w: { tradition: -2 } },
  ] },
  { id: 21, fixed: true, topic: "Weather", q: "Several days outside in cold rain:", options: [
    { t: "Bring it on", w: { physical: 2, comfort: -2, land: 1 } },
    { t: "Fine for a day or two", w: { physical: 1, comfort: -1 } },
    { t: "I'd rather be inside", w: { comfort: 1, physical: -1 } },
    { t: "Give me a climate-controlled room, please", w: { comfort: 2, space: 1 } },
  ] },
  { id: 22, fixed: true, topic: "Aircraft", q: "How do you feel about aircraft?", options: [
    { t: "I want to fly them", w: { air: 2 } },
    { t: "I want to fix and maintain them", w: { air: 1, tech: 1 } },
    { t: "Cool, but not really my thing", w: { air: -1 } },
    { t: "I'd rather be on a boat", w: { sea: 1, air: -1 } },
  ] },
  { id: 23, fixed: true, topic: "Space", q: "How interested are you in space?", options: [
    { t: "Obsessed", w: { space: 2 } },
    { t: "Pretty interested", w: { space: 1 } },
    { t: "Meh", w: { space: -1 } },
    { t: "I'd rather have my boots in the dirt", w: { space: -2, land: 1 } },
  ] },
  { id: 24, fixed: true, topic: "Water", q: "Could you see yourself training to jump into rough water to save someone?", options: [
    { t: "Yes, I'd train for that", w: { sea: 2, physical: 1, homeland: 1 } },
    { t: "I can swim, but rough water? Not really", w: { sea: -1 } },
    { t: "I'm not a swimmer", w: { sea: -2 } },
  ] },
  { id: 25, topic: "Motivation", q: "What motivates you most?", options: [
    { t: "Testing myself against the hardest challenge", w: { physical: 2, tradition: 1 } },
    { t: "Protecting my community", w: { homeland: 2 } },
    { t: "Learning valuable skills", w: { tech: 1, comfort: 1 } },
    { t: "Seeing the world", w: { travel: 2 } },
    { t: "Being part of something brand new", w: { space: 1, scale: -2 } },
  ] },
  { id: 26, fixed: true, topic: "Identity", q: "How much does your unit's reputation matter to you?", options: [
    { t: "Everything. I want that title for life", w: { tradition: 2, combat: 1 } },
    { t: "It matters, but the job matters more", w: { tech: 1 } },
    { t: "I just want a good job and good people", w: { comfort: 1, tradition: -1 } },
  ] },
  { id: 27, fixed: true, topic: "Law", q: "Would you like a job enforcing laws, like boarding ships to search for drugs?", options: [
    { t: "Yes, that sounds awesome", w: { homeland: 2, sea: 1 } },
    { t: "Maybe", w: { homeland: 1 } },
    { t: "Not really", w: { homeland: -1 } },
  ] },
  { id: 28, fixed: true, topic: "Focus", q: "A 12-hour shift watching screens and tracking data sounds...", options: [
    { t: "Peaceful, honestly", w: { tech: 1, space: 1, physical: -1 } },
    { t: "Fine once in a while", w: {} },
    { t: "Like torture. Let me move around", w: { physical: 2, tech: -1 } },
  ] },
  { id: 29, fixed: true, topic: "Family", q: "How important is living near family?", options: [
    { t: "Very important", w: { travel: -2, homeland: 1 } },
    { t: "Somewhat", w: { travel: -1 } },
    { t: "Not very", w: { travel: 1 } },
    { t: "I want to move far away", w: { travel: 2 } },
  ] },
  // Job interest questions score interests (i), used to pick specific roles.
  { id: 30, topic: "Job interests", q: "Which of these would you most want to learn?", options: [
    { t: "Emergency medicine", w: { homeland: 1 }, i: { medical: 2 } },
    { t: "Construction and heavy equipment", w: {}, i: { build: 2 } },
    { t: "Fixing engines, aircraft and machines", w: { tech: 1 }, i: { mechanic: 2 } },
    { t: "Hacking and defending networks", w: { tech: 2 }, i: { cyber: 2 } },
    { t: "Flying or crewing aircraft", w: { air: 1 }, i: { aviation: 2 } },
  ] },
  { id: 31, topic: "Job interests", q: "Pick a civilian job to try for a day.", options: [
    { t: "Paramedic", w: {}, i: { medical: 2 } },
    { t: "Police officer", w: { homeland: 1 }, i: { law: 2 } },
    { t: "Electrician or builder", w: {}, i: { build: 2 } },
    { t: "Air traffic controller", w: {}, i: { comms: 1, aviation: 1 } },
    { t: "Detective or analyst", w: {}, i: { intel: 2 } },
    { t: "Firefighter", w: { homeland: 2, physical: 1 }, i: { medical: 1, elite: 1 } },
    { t: "Wildland firefighter or smokejumper", w: { physical: 2, comfort: -2, land: 1 }, i: { elite: 2 } },
    { t: "Power lineman, climbing towers in storms", w: { physical: 1, tech: 1 }, i: { build: 1, mechanic: 1 } },
    { t: "Offshore oil rig worker", w: { sea: 2, physical: 1, comfort: -1 }, i: { mechanic: 2 } },
    { t: "SWAT officer", w: { combat: 1, homeland: 1, physical: 1 }, i: { law: 2, weapons: 1 } },
  ] },
  { id: 32, topic: "Job interests", q: "Which would feel the most rewarding?", options: [
    { t: "Keeping a hurt person alive", w: {}, i: { medical: 2 } },
    { t: "Catching someone breaking the law", w: {}, i: { law: 2 } },
    { t: "Cracking a code nobody else could", w: { tech: 1 }, i: { intel: 1, cyber: 1 } },
    { t: "Getting supplies to people on time, every time", w: {}, i: { logistics: 2 } },
    { t: "Being first through the door", w: { combat: 1 }, i: { infantry: 2 } },
  ] },
  { id: 33, topic: "Job interests", q: "Pick a tool.", options: [
    { t: "A wrench", w: {}, i: { mechanic: 2 } },
    { t: "A rifle", w: { combat: 1 }, i: { infantry: 1, weapons: 1 } },
    { t: "A laptop", w: { tech: 1 }, i: { cyber: 2 } },
    { t: "A radio and a map", w: {}, i: { comms: 2 } },
    { t: "A medical kit", w: {}, i: { medical: 2 } },
  ] },
  { id: 34, topic: "Job interests", q: "Pick a mission for your team.", options: [
    { t: "Run the radar and radios that keep everyone connected", w: {}, i: { comms: 2 } },
    { t: "Move the heavy equipment and supplies", w: {}, i: { logistics: 2 } },
    { t: "Keep the weapon systems ready to go", w: {}, i: { weapons: 2 } },
    { t: "Gather intel on what's out there", w: {}, i: { intel: 2 } },
    { t: "Lead the patrol", w: { combat: 1 }, i: { infantry: 2 } },
  ] },
  { id: 35, always: true, fixed: true, topic: "Job interests", q: "Special operations selection, where most people wash out:", options: [
    { t: "That's my goal", w: { physical: 2 }, i: { elite: 4 } },
    { t: "Maybe someday", w: { physical: 1 }, i: { elite: 2 } },
    // An explicit no outweighs any special ops interest from other answers.
    { t: "No thanks", w: {}, i: { elite: -6 } },
  ] },
  // Role questions also score tracks (k): enlisted or officer.
  { id: 36, always: true, fixed: true, topic: "Role", q: "Do you plan to get a four-year college degree?", options: [
    { t: "I already have one", w: {}, k: { officer: 3 }, degree: true },
    { t: "Yes, before I join", w: {}, k: { officer: 2 } },
    { t: "Maybe, later or while I serve", w: {}, k: { enlisted: 1, officer: 1 } },
    { t: "No, I want to start right after high school", w: {}, k: { enlisted: 2 } },
  ] },
  { id: 37, topic: "Role", q: "In a group project, you're usually the one who...", options: [
    { t: "Plans it and hands out the tasks", w: {}, k: { officer: 2 } },
    { t: "Actually gets the work done", w: {}, k: { enlisted: 2 } },
    { t: "Becomes the expert on one part of it", w: { tech: 1 }, k: { enlisted: 1 } },
    { t: "Keeps everyone motivated and on track", w: {}, k: { officer: 1, enlisted: 1 } },
  ] },
  { id: 38, topic: "Role", q: "Would you rather...", options: [
    { t: "Master a specific skill and be the go-to person for it", w: {}, k: { enlisted: 2 } },
    { t: "Lead a team and be responsible for its results", w: {}, k: { officer: 2 } },
  ] },
  { id: 39, fixed: true, topic: "Role", q: "Your team messes up and you're the one who has to answer for it. How does that feel?", options: [
    { t: "That's part of leading. I'm in", w: {}, k: { officer: 2 } },
    { t: "Fair, if I was in charge", w: {}, k: { officer: 1, enlisted: 1 } },
    { t: "I'd rather just be responsible for my own work", w: {}, k: { enlisted: 2 } },
  ] },
  { id: 40, fixed: true, topic: "Role", q: "Planning meetings, briefings and paperwork:", options: [
    { t: "Fine with me. Someone has to run things", w: { comfort: 1 }, k: { officer: 2 } },
    { t: "Okay in small doses", w: {}, k: { officer: 1, enlisted: 1 } },
    { t: "I'd rather be out doing the actual job", w: { physical: 1 }, k: { enlisted: 2 } },
  ] },
  // Service type questions also score components (c): active duty, reserve, guard.
  { id: 41, always: true, fixed: true, topic: "Service type", q: "How big a part of your life do you want the military to be?", options: [
    { t: "All of it. It's my full-time job", w: {}, c: { active: 2 } },
    { t: "A serious part-time commitment", w: {}, c: { reserve: 1, guard: 1 } },
    { t: "A smaller part, next to a civilian career or school", w: {}, c: { reserve: 2, guard: 1 } },
  ] },
  { id: 42, topic: "Service type", q: "What are your school or work plans for the next few years?", options: [
    { t: "Military first. School can come later, or during", w: {}, c: { active: 2 } },
    { t: "Go to college full time", w: {}, c: { guard: 2, reserve: 2 } },
    { t: "I've already finished college and want to use my degree", w: {}, c: { active: 1, reserve: 1 }, degree: true },
    { t: "Keep or start a civilian job", w: {}, c: { reserve: 2, guard: 1 } },
  ] },
  { id: 43, fixed: true, topic: "Service type", q: "Floods, wildfires or storms hit your state. Would you want to be called up to help?", options: [
    { t: "Yes. Helping my own state matters a lot", w: { homeland: 1 }, c: { guard: 3 } },
    { t: "Sure, sometimes", w: {}, c: { guard: 1, reserve: 1 } },
    { t: "I'd rather focus on federal or overseas missions", w: { homeland: -1 }, c: { active: 1, reserve: 1 } },
  ] },
  { id: 44, fixed: true, topic: "Service type", q: "Moving to a new base every few years sounds...", options: [
    { t: "Exciting", w: { travel: 1 }, c: { active: 2 } },
    { t: "Like something I could handle", w: {}, c: { active: 1 } },
    { t: "Like a no. I'd rather keep living where I live", w: { travel: -1 }, c: { guard: 2, reserve: 2 } },
  ] },
  { id: 45, topic: "Service type", q: "Which benefit matters most to you?", options: [
    { t: "A steady full-time paycheck, housing and healthcare now", w: {}, c: { active: 2 } },
    { t: "Help paying for college while I live a normal life", w: {}, c: { guard: 2, reserve: 1 } },
    { t: "Extra income and experience on the side", w: {}, c: { reserve: 2, guard: 1 } },
  ] },
  // ---- Added pool questions (ids 46+). Trait questions first.
  { id: 46, topic: "Navigation", q: "Your phone dies on a road trip and there's no map. You...", options: [
    { t: "Navigate by the sun and landmarks", w: { land: 1, physical: 1, tech: -1 } },
    { t: "Head to the nearest town and ask", w: { comfort: 1 } },
    { t: "Pull out the paper map I always keep in the car", w: { tradition: 1 } },
    { t: "Rig something up to charge it", w: { tech: 2 } },
  ] },
  { id: 47, topic: "Food", q: "Pick a meal.", options: [
    { t: "A field ration, eaten cold on a hillside", w: { land: 1, comfort: -2 } },
    { t: "Whatever the ship's galley is serving tonight", w: { sea: 2 } },
    { t: "A real dining hall with lots of options", w: { comfort: 2 } },
    { t: "Doesn't matter, food is fuel", w: { physical: 1, comfort: -1 } },
  ] },
  { id: 48, topic: "Uniform", q: "How do you feel about wearing a uniform every day?", options: [
    { t: "Love it, one less decision", w: { tradition: 1 } },
    { t: "Love it if it looks razor sharp", w: { tradition: 2 } },
    { t: "Give me a flight suit", w: { air: 2 } },
    { t: "Give me coveralls I can get greasy", w: { tech: 1, comfort: -1 } },
  ] },
  { id: 49, topic: "Night watch", q: "It's 2 a.m. and you're on watch. Where are you?", options: [
    { t: "On a ship's bridge, watching the horizon", w: { sea: 2 } },
    { t: "In a fighting position with night vision", w: { land: 2, combat: 1, comfort: -2 } },
    { t: "In a control room with coffee and screens", w: { space: 1, tech: 1, comfort: 1 } },
    { t: "On a pier, checking boats coming in", w: { homeland: 2, sea: 1 } },
  ] },
  { id: 50, topic: "Heights", fixed: true, q: "How do you feel about jumping out of a plane?", options: [
    { t: "Sign me up for airborne school", w: { physical: 1, combat: 1, land: 1 } },
    { t: "I'd rather be the one flying the plane", w: { air: 2 } },
    { t: "Only if I really had to", w: { physical: -1 } },
    { t: "Absolutely not", w: { air: -1, physical: -1 } },
  ] },
  { id: 51, topic: "Sports", q: "Which sport fits you best?", options: [
    { t: "Football: contact and teamwork", w: { physical: 2, combat: 1 } },
    { t: "Swimming or water polo", w: { sea: 2, physical: 1 } },
    { t: "Chess or esports", w: { tech: 1, space: 1, physical: -1 } },
    { t: "Track or cross-country", w: { physical: 1, land: 1 } },
    { t: "Wrestling or MMA", w: { combat: 2, physical: 1 } },
  ] },
  { id: 52, topic: "Boss", q: "Your ideal boss is...", options: [
    { t: "Strict but fair, everything by the book", w: { tradition: 2 } },
    { t: "Laid-back, as long as the work gets done", w: { tradition: -2, comfort: 1 } },
    { t: "Someone who leads from the front and does it all with you", w: { physical: 1, combat: 1 } },
    { t: "A brilliant expert you can learn from", w: { tech: 2 } },
  ] },
  { id: 53, topic: "Sleep", fixed: true, q: "You get four hours of sleep before a long, hard day. You...", options: [
    { t: "Push through. Done it plenty of times", w: { physical: 2, comfort: -1 } },
    { t: "Survive on coffee", w: {} },
    { t: "Would be miserable", w: { comfort: 2, physical: -1 } },
  ] },
  { id: 54, topic: "Heat", q: "Working outside in 100°F desert heat:", options: [
    { t: "Bring it on", w: { land: 2, physical: 1, comfort: -1 } },
    { t: "I'd rather be out on the water", w: { sea: 1 } },
    { t: "Air conditioning, please", w: { comfort: 2 } },
    { t: "I'd rather be up in the air", w: { air: 1 } },
  ] },
  { id: 55, topic: "Dream trip", q: "Pick your dream trip.", options: [
    { t: "Backpacking through foreign countries", w: { travel: 2 } },
    { t: "A cruise that stops at different ports", w: { sea: 1, travel: 1 } },
    { t: "A road trip across the U.S.", w: { homeland: 1, travel: -1 } },
    { t: "A staycation at home", w: { travel: -2, comfort: 1 } },
  ] },
  { id: 56, topic: "Speed", q: "Pick the fastest thing you'd want to ride in.", options: [
    { t: "A fighter jet", w: { air: 2 } },
    { t: "A speedboat chasing smugglers", w: { sea: 1, homeland: 2 } },
    { t: "A tank at full throttle", w: { land: 2, combat: 1 } },
    { t: "A rocket", w: { space: 2 } },
  ] },
  { id: 57, topic: "Rules", q: "You see someone break a small rule. You...", options: [
    { t: "Report it. Rules are rules", w: { tradition: 2, homeland: 1 } },
    { t: "Tell them to knock it off", w: { tradition: 1 } },
    { t: "Mind your own business", w: { tradition: -1 } },
    { t: "It depends on whether it hurts anyone", w: { tradition: -1 } },
  ] },
  { id: 58, topic: "Hobbies", q: "Which hobby sounds best?", options: [
    { t: "Hunting or camping", w: { land: 2, physical: 1 } },
    { t: "Fishing or sailing", w: { sea: 2 } },
    { t: "Building drones or RC planes", w: { air: 1, tech: 1 } },
    { t: "Building PCs or coding", w: { tech: 2 } },
    { t: "Stargazing with a telescope", w: { space: 2 } },
  ] },
  { id: 59, topic: "Emergency", q: "In an emergency, you're the one who...", options: [
    { t: "Runs toward it", w: { combat: 1, physical: 1, homeland: 1 } },
    { t: "Takes charge and gives orders", w: { tradition: 1 } },
    { t: "Calls for help and coordinates", w: { tech: 1, comfort: 1 } },
    { t: "Takes care of the people who got hurt", w: { homeland: 1 } },
  ] },
  { id: 60, topic: "Movies", q: "Pick a movie vibe.", options: [
    { t: "Gritty war movie on the ground", w: { combat: 2, land: 1 } },
    { t: "Fighter pilots and dogfights", w: { air: 2 } },
    { t: "Rescue swimmers in a storm", w: { homeland: 2, sea: 1 } },
    { t: "Astronauts stranded in space", w: { space: 2, tech: 1 } },
    { t: "Warships on the high seas", w: { sea: 2 } },
  ] },
  { id: 61, topic: "Priorities", q: "What matters most in a job?", options: [
    { t: "Adventure and stories to tell", w: { travel: 1, physical: 1 } },
    { t: "Stability and benefits", w: { comfort: 1, travel: -1 } },
    { t: "Skills I can use later", w: { tech: 1 } },
    { t: "Pride and purpose", w: { tradition: 1, combat: 1 } },
  ] },
  { id: 62, topic: "Pond", q: "Big fish in a small pond, or small fish in a big pond?", options: [
    { t: "Big fish, small pond", w: { scale: -2 } },
    { t: "Small fish, big pond", w: { scale: 2 } },
    { t: "Somewhere in the middle", w: {} },
  ] },
  { id: 63, topic: "Hometown", q: "Where would you most want to live?", options: [
    { t: "Near the beach", w: { sea: 1, homeland: 1 } },
    { t: "Overseas: Japan, Germany or Italy", w: { travel: 2 } },
    { t: "Out west in the mountains or desert", w: { land: 1 } },
    { t: "Near a big tech hub", w: { tech: 1, comfort: 1 } },
    { t: "Wherever. I'll adapt", w: { travel: 1 } },
  ] },
  { id: 64, topic: "Dirt", fixed: true, q: "Getting muddy and dirty at work:", options: [
    { t: "Part of the fun", w: { land: 1, comfort: -2, physical: 1 } },
    { t: "Fine sometimes", w: { comfort: -1 } },
    { t: "I'd rather stay clean", w: { comfort: 2 } },
  ] },
  { id: 65, topic: "Vehicles", q: "Pick something to drive.", options: [
    { t: "A truck in a convoy", w: { land: 2 } },
    { t: "A small rescue boat", w: { sea: 1, homeland: 2 } },
    { t: "A tractor on an aircraft carrier's deck", w: { sea: 1, air: 1 } },
    { t: "A satellite, from a keyboard", w: { space: 2, tech: 1 } },
  ] },
  { id: 66, topic: "Future", q: "Where do you see yourself in 20 years?", options: [
    { t: "Retired from the military with a pension", w: { tradition: 1, scale: 1 } },
    { t: "Running my own business", w: { tradition: -1 } },
    { t: "A senior engineer or tech lead", w: { tech: 2 } },
    { t: "A police chief or fire chief", w: { homeland: 2 } },
  ] },
  { id: 67, topic: "People", fixed: true, q: "Do you like being around lots of people?", options: [
    { t: "Yes, the more the better", w: { scale: 2 } },
    { t: "A small group of close friends is best", w: { scale: -1 } },
    { t: "I mostly like being on my own", w: { scale: -2 } },
  ] },
  { id: 68, topic: "Risk", fixed: true, q: "How much danger is too much?", options: [
    { t: "Any. I want a safe job", w: { combat: -2, comfort: 1 } },
    { t: "Some risk is okay for the right reason", w: { homeland: 1 } },
    { t: "High risk, high reward", w: { combat: 2, physical: 1 } },
  ] },
  { id: 69, topic: "Gear", q: "Pick the gear you'd carry.", options: [
    { t: "Rifle, body armor and a 60-pound pack", w: { combat: 1, physical: 2, land: 1 } },
    { t: "Life jacket and a rescue line", w: { sea: 1, homeland: 1 } },
    { t: "Headset and flight helmet", w: { air: 2 } },
    { t: "Laptop and a secure phone", w: { tech: 2 } },
  ] },
  { id: 70, topic: "Instructors", fixed: true, q: "Drill instructors yelling in your face all day sounds...", options: [
    { t: "Motivating", w: { tradition: 2, physical: 1 } },
    { t: "Survivable", w: { tradition: 1 } },
    { t: "Awful", w: { tradition: -2 } },
  ] },
  { id: 71, topic: "Hurricane", q: "A hurricane is about to hit the coast. You want to be...", options: [
    { t: "Flying rescue helicopters", w: { homeland: 2, air: 1 } },
    { t: "Driving supply trucks into the disaster zone", w: { homeland: 1, land: 1 } },
    { t: "Tracking it with satellites", w: { space: 1, tech: 1 } },
    { t: "Far away on a deployment overseas", w: { travel: 2, homeland: -1 } },
  ] },
  { id: 72, topic: "Night ocean", fixed: true, q: "The open ocean at night, with no land in sight:", options: [
    { t: "Peaceful", w: { sea: 2 } },
    { t: "Cool for a little while", w: {} },
    { t: "Creepy", w: { sea: -2 } },
  ] },
  { id: 73, topic: "School", q: "Pick a class.", options: [
    { t: "Engineering or physics", w: { tech: 2, space: 1 } },
    { t: "Criminal justice", w: { homeland: 2 } },
    { t: "Weight training", w: { physical: 2 } },
    { t: "History", w: { tradition: 1 } },
    { t: "Auto shop", w: { tech: 1, comfort: -1 } },
  ] },
  { id: 74, topic: "Time", fixed: true, q: "How long would you want to serve?", options: [
    { t: "One enlistment, then on to the next thing", w: { tradition: -1 } },
    { t: "Not sure yet", w: {} },
    { t: "A full career", w: { tradition: 1, scale: 1 } },
  ] },
  { id: 75, topic: "Holidays", fixed: true, q: "Working some weekends and holidays:", options: [
    { t: "Fine if the mission needs it", w: { tradition: 1, homeland: 1 } },
    { t: "Okay when I'm deployed", w: { travel: 1 } },
    { t: "I'd rather not", w: { comfort: 2 } },
  ] },
  { id: 76, topic: "Superpower", q: "Pick a superpower.", options: [
    { t: "Super strength", w: { physical: 2 } },
    { t: "Flight", w: { air: 2 } },
    { t: "Breathing underwater", w: { sea: 2 } },
    { t: "Super intelligence", w: { tech: 2 } },
    { t: "Teleporting anywhere in the world", w: { travel: 2 } },
  ] },
  { id: 77, topic: "Group chat", q: "In your friends' group chat, you're...", options: [
    { t: "The one who plans everything", w: { tradition: 1 } },
    { t: "The one sending memes", w: { comfort: 1 } },
    { t: "The one who fixes everyone's tech", w: { tech: 2 } },
    { t: "The one who's always outside doing something", w: { physical: 1, land: 1 } },
  ] },
  { id: 78, topic: "Sunrise", q: "Pick a view at sunrise.", options: [
    { t: "The desert, from a guard tower", w: { land: 2, combat: 1 } },
    { t: "The ocean, from a ship's deck", w: { sea: 2, travel: 1 } },
    { t: "Clouds, from a cockpit", w: { air: 2 } },
    { t: "Earth, from a satellite feed", w: { space: 2 } },
    { t: "Your hometown harbor", w: { homeland: 2, sea: 1 } },
  ] },
  { id: 79, topic: "Challenge", q: "Pick a 24-hour challenge.", options: [
    { t: "A long hike with no sleep", w: { physical: 2, comfort: -2 } },
    { t: "A hackathon", w: { tech: 2 } },
    { t: "Swimming a mile in open water", w: { sea: 2, physical: 1 } },
    { t: "Learning to fly a small plane", w: { air: 2 } },
  ] },
  { id: 80, topic: "Breakdown", q: "Your car breaks down on a back road. You...", options: [
    { t: "Fix it yourself", w: { tech: 1, comfort: -1 } },
    { t: "Call roadside assistance", w: { comfort: 1 } },
    { t: "Walk to the nearest town", w: { physical: 1, land: 1 } },
  ] },
  { id: 81, topic: "Offline", fixed: true, q: "No Wi-Fi or signal for weeks at a time:", options: [
    { t: "No problem", w: { land: 1, comfort: -2, travel: 1 } },
    { t: "Annoying, but fine", w: { comfort: -1 } },
    { t: "Absolutely not", w: { comfort: 2, tech: 1 } },
  ] },
  { id: 82, topic: "Values", q: "Which matters more to you?", options: [
    { t: "Being the best", w: { tradition: 2, combat: 1 } },
    { t: "Helping people", w: { homeland: 2 } },
    { t: "Working with cool tech", w: { tech: 2 } },
    { t: "Seeing the world", w: { travel: 2 } },
  ] },
  { id: 83, topic: "Mascot", q: "Pick a team mascot.", options: [
    { t: "A bulldog", w: { tradition: 1, combat: 1, physical: 1 } },
    { t: "An eagle", w: { air: 1 } },
    { t: "A shark", w: { sea: 2 } },
    { t: "A wolf", w: { land: 1, scale: -1 } },
  ] },
  { id: 84, topic: "Grooming", fixed: true, q: "Strict rules about haircuts and grooming:", options: [
    { t: "Fine. High and tight forever", w: { tradition: 2 } },
    { t: "I'll follow them", w: { tradition: 1 } },
    { t: "I'd want more freedom", w: { tradition: -2, comfort: 1 } },
  ] },
  { id: 85, topic: "Boredom", q: "How do you deal with boredom?", options: [
    { t: "I can't sit still, so I go do something", w: { physical: 2 } },
    { t: "Read or learn something", w: { tech: 1 } },
    { t: "Video games", w: { comfort: 1, tech: 1 } },
    { t: "Find something to fix", w: { tech: 1, comfort: -1 } },
  ] },
  { id: 86, topic: "Duty station", q: "Pick a place to be stationed.", options: [
    { t: "Hawaii", w: { sea: 1, travel: 1 } },
    { t: "Alaska", w: { physical: 1, comfort: -1 } },
    { t: "Germany", w: { travel: 2 } },
    { t: "Colorado", w: { space: 1, land: 1 } },
    { t: "My home state", w: { homeland: 2, travel: -2 } },
  ] },
  { id: 87, topic: "Job title", q: "Pick a job title.", options: [
    { t: "Operator", w: { combat: 2, physical: 1 } },
    { t: "Technician", w: { tech: 2 } },
    { t: "Rescuer", w: { homeland: 2 } },
    { t: "Navigator", w: { sea: 1, air: 1 } },
  ] },
  { id: 88, topic: "Friends", q: "How would your friends describe you?", options: [
    { t: "Tough", w: { physical: 2 } },
    { t: "Smart", w: { tech: 2 } },
    { t: "Loyal", w: { tradition: 1 } },
    { t: "Adventurous", w: { travel: 2 } },
    { t: "Helpful", w: { homeland: 2 } },
  ] },
  { id: 100, topic: "One word", q: "Pick one word.", options: [
    { t: "Discipline", w: { tradition: 2 } },
    { t: "Freedom", w: { tradition: -1, travel: 1 } },
    { t: "Service", w: { homeland: 2 } },
    { t: "Innovation", w: { tech: 2, space: 1 } },
    { t: "Strength", w: { physical: 2 } },
  ] },
  { id: 101, topic: "Formality", fixed: true, q: "Salutes, ranks and formal ceremonies:", options: [
    { t: "Love the tradition", w: { tradition: 2 } },
    { t: "Fine with it", w: { tradition: 1 } },
    { t: "Not my thing", w: { tradition: -2 } },
  ] },
  // Added job interest questions.
  { id: 89, topic: "Job interests", q: "Which show would you binge?", options: [
    { t: "A hospital drama", w: {}, i: { medical: 2 } },
    { t: "A police bodycam series", w: {}, i: { law: 2 } },
    { t: "How things are built and engineered", w: {}, i: { mechanic: 1, build: 1 } },
    { t: "A hacker thriller", w: { tech: 1 }, i: { cyber: 2 } },
    { t: "A special forces selection show", w: { physical: 1 }, i: { elite: 2 } },
  ] },
  { id: 90, topic: "Job interests", q: "Pick a weekend project.", options: [
    { t: "Rebuild an engine", w: {}, i: { mechanic: 2 } },
    { t: "Build a deck or a shed", w: {}, i: { build: 2 } },
    { t: "Set up a home network or server", w: { tech: 1 }, i: { cyber: 2 } },
    { t: "Plan a big trip down to the minute", w: {}, i: { logistics: 2 } },
    { t: "Take a first aid and CPR class", w: {}, i: { medical: 2 } },
  ] },
  { id: 91, topic: "Job interests", q: "Pick your role in a team video game.", options: [
    { t: "Sniper", w: {}, i: { infantry: 1, weapons: 1 } },
    { t: "Medic", w: {}, i: { medical: 2 } },
    { t: "Engineer who builds defenses", w: {}, i: { build: 2 } },
    { t: "Pilot", w: { air: 1 }, i: { aviation: 2 } },
    { t: "Recon and radio", w: {}, i: { comms: 1, intel: 1 } },
  ] },
  { id: 92, topic: "Job interests", q: "What would you want to be really good at?", options: [
    { t: "Tactics and marksmanship", w: { combat: 1 }, i: { infantry: 1, weapons: 1 } },
    { t: "Saving lives", w: {}, i: { medical: 2 } },
    { t: "Flying", w: { air: 1 }, i: { aviation: 2 } },
    { t: "Investigating", w: {}, i: { intel: 1, law: 1 } },
    { t: "Keeping big operations running smoothly", w: {}, i: { logistics: 2 } },
  ] },
  { id: 93, topic: "Job interests", q: "Pick a gadget.", options: [
    { t: "Night vision goggles", w: {}, i: { infantry: 1, elite: 1 } },
    { t: "A drone", w: {}, i: { aviation: 1, intel: 1 } },
    { t: "An encrypted radio", w: {}, i: { comms: 2 } },
    { t: "A welding torch", w: {}, i: { build: 1, mechanic: 1 } },
    { t: "A police scanner", w: {}, i: { law: 2 } },
  ] },
  { id: 94, topic: "Job interests", q: "On a rainy day, which job would you hate the least?", options: [
    { t: "Directing traffic", w: {}, i: { law: 1 } },
    { t: "Fixing a broken generator", w: {}, i: { mechanic: 2 } },
    { t: "Running supply deliveries", w: {}, i: { logistics: 2 } },
    { t: "Watching radar indoors", w: {}, i: { comms: 2 } },
    { t: "Patching up injured people", w: {}, i: { medical: 2 } },
  ] },
  // Added role questions.
  { id: 95, topic: "Role", q: "When things go wrong, you'd rather...", options: [
    { t: "Make the call and own it", w: {}, k: { officer: 2 } },
    { t: "Fix the problem with my own hands", w: {}, k: { enlisted: 2 } },
    { t: "Advise whoever's in charge", w: {}, k: { officer: 1, enlisted: 1 } },
  ] },
  { id: 96, topic: "Role", fixed: true, q: "Public speaking and giving briefings:", options: [
    { t: "I like it", w: {}, k: { officer: 2 } },
    { t: "It's fine", w: {}, k: { officer: 1, enlisted: 1 } },
    { t: "I'd rather not", w: {}, k: { enlisted: 2 } },
  ] },
  { id: 97, topic: "Role", q: "Start working right away, or spend four more years in school first?", options: [
    { t: "Start right away", w: {}, k: { enlisted: 2 } },
    { t: "School first", w: {}, k: { officer: 2 } },
    { t: "Do school while I serve", w: {}, k: { enlisted: 1, officer: 1 } },
  ] },
  // Added service type questions.
  { id: 98, topic: "Service type", fixed: true, q: "Being away from your hometown friends most of the year:", options: [
    { t: "Fine. I'll make new friends", w: {}, c: { active: 2 } },
    { t: "Somewhere in between", w: {}, c: { reserve: 1, guard: 1 } },
    { t: "I'd rather keep my life at home", w: {}, c: { reserve: 2, guard: 2 } },
  ] },
  { id: 99, topic: "Service type", fixed: true, q: "Would you want a civilian career and a military one at the same time?", options: [
    { t: "Yes, both", w: {}, c: { reserve: 2, guard: 2 } },
    { t: "Maybe later", w: {}, c: { active: 1, reserve: 1 } },
    { t: "No, military only", w: {}, c: { active: 2 } },
  ] },
];

// Bingo mode squares. Each is a statement you check if it fits you; checking
// it counts as picking option 0. Like POOL, ids are permanent (share links).
const bingoSquare = (id, t, effects) => ({ id, bingo: true, topic: "Bingo", q: t, options: [{ t: "Fits me", w: {}, ...effects }, { t: "Doesn't fit", w: {} }] });

const BINGO_POOL = [
  // Traits.
  bingoSquare(201, "I love being on the water", { w: { sea: 2 } }),
  bingoSquare(202, "I get seasick", { w: { sea: -2 } }),
  bingoSquare(203, "Boats and ships are cool", { w: { sea: 2 } }),
  bingoSquare(204, "I'm a strong swimmer", { w: { sea: 1, physical: 1 } }),
  bingoSquare(205, "I'm into hunting, hiking or survival stuff", { w: { land: 2, physical: 1 } }),
  bingoSquare(206, "I'd rather be outdoors than inside", { w: { land: 1, physical: 1, comfort: -1 } }),
  bingoSquare(207, "I want to fly", { w: { air: 2 } }),
  bingoSquare(208, "Jets and planes are awesome", { w: { air: 2 } }),
  bingoSquare(209, "Space is the coolest thing ever", { w: { space: 2 } }),
  bingoSquare(210, "I work out almost every day", { w: { physical: 2 } }),
  bingoSquare(211, "I want the hardest challenge possible", { w: { physical: 2, tradition: 1 } }),
  bingoSquare(212, "I'd rather use my brain than my muscles", { w: { physical: -1, tech: 1 } }),
  bingoSquare(213, "I'm the one who fixes everyone's tech", { w: { tech: 2 } }),
  bingoSquare(214, "I love video games and screens", { w: { tech: 1, comfort: 1 } }),
  bingoSquare(215, "I like rules and structure", { w: { tradition: 2 } }),
  bingoSquare(216, "Uniforms and ceremonies are cool", { w: { tradition: 2 } }),
  bingoSquare(217, "Strict rules drive me nuts", { w: { tradition: -2 } }),
  bingoSquare(218, "I want to see the world", { w: { travel: 2 } }),
  bingoSquare(219, "I'd love to live overseas", { w: { travel: 2 } }),
  bingoSquare(220, "I want to stay near my family", { w: { travel: -2, homeland: 1 } }),
  bingoSquare(221, "I want to help people in disasters", { w: { homeland: 2 } }),
  bingoSquare(222, "I'd want to be on the front line", { w: { combat: 2 } }),
  bingoSquare(223, "I'd rather not be in combat", { w: { combat: -2 } }),
  bingoSquare(224, "I want lots of job options", { w: { scale: 2 } }),
  bingoSquare(225, "I like small, close teams", { w: { scale: -2 } }),
  bingoSquare(226, "I need my comfort: AC, Wi-Fi, a real bed", { w: { comfort: 2 } }),
  bingoSquare(227, "Camping in the rain sounds fun", { w: { comfort: -2, land: 1 } }),
  bingoSquare(228, "I hate being cold, wet or dirty", { w: { comfort: 2, land: -1 } }),
  bingoSquare(229, "I'd rather stay on dry land", { w: { sea: -2 } }),
  bingoSquare(230, "I'm not really an outdoors person", { w: { land: -2 } }),
  bingoSquare(231, "Flying makes me nervous", { w: { air: -2 } }),
  bingoSquare(232, "Space doesn't do much for me", { w: { space: -2 } }),
  bingoSquare(233, "I'm not big on working out", { w: { physical: -2 } }),
  bingoSquare(234, "I'm not a computer person", { w: { tech: -2 } }),
  bingoSquare(235, "I like a relaxed, chill vibe", { w: { tradition: -2, comfort: 1 } }),
  bingoSquare(236, "I'm a homebody", { w: { travel: -2 } }),
  bingoSquare(237, "I'd rather serve overseas than at home", { w: { homeland: -2, travel: 1 } }),
  bingoSquare(238, "I can sleep anywhere, anytime", { w: { comfort: -2, physical: 1 } }),
  bingoSquare(239, "I want to be part of something huge", { w: { scale: 2 } }),
  // Job interests.
  bingoSquare(240, "I'd want to save lives as a medic", { w: { homeland: 1 }, i: { medical: 2 } }),
  bingoSquare(241, "I like building things", { i: { build: 2 } }),
  bingoSquare(242, "I like working on engines and cars", { w: { tech: 1 }, i: { mechanic: 2 } }),
  bingoSquare(243, "I'm into hacking and cybersecurity", { w: { tech: 2 }, i: { cyber: 2 } }),
  bingoSquare(244, "I like solving mysteries", { i: { intel: 2 } }),
  bingoSquare(245, "I'd want to be a cop", { w: { homeland: 1 }, i: { law: 2 } }),
  bingoSquare(246, "Special forces is my dream", { w: { physical: 1 }, i: { elite: 2 } }),
  bingoSquare(247, "I'm a great planner and organizer", { i: { logistics: 2 } }),
  bingoSquare(248, "I like radios and gadgets", { i: { comms: 2 } }),
  bingoSquare(249, "I'd want to be in the infantry", { w: { combat: 1, land: 1 }, i: { infantry: 2 } }),
  bingoSquare(250, "I like weapons and shooting", { i: { weapons: 2 } }),
  bingoSquare(251, "I'd want to work on aircraft", { w: { air: 1 }, i: { aviation: 1, mechanic: 1 } }),
  // Enlisted or officer.
  bingoSquare(260, "I want to lead people", { k: { officer: 2 } }),
  bingoSquare(261, "I'd rather do the hands-on work", { k: { enlisted: 2 } }),
  bingoSquare(262, "I have or plan to get a 4-year degree", { k: { officer: 2 } }),
  bingoSquare(263, "I want to start right after high school", { k: { enlisted: 2 } }),
  // Service type.
  bingoSquare(270, "I want the military full-time", { c: { active: 2 } }),
  bingoSquare(271, "I want to keep my civilian job or school", { c: { reserve: 2, guard: 1 } }),
  bingoSquare(272, "I'd want to help my own state in emergencies", { w: { homeland: 1 }, c: { guard: 2 } }),
  bingoSquare(273, "I don't want to move every few years", { c: { guard: 1, reserve: 1 } }),
];

// Official recruiter locators, checked on each branch's site in October 2026.
// The Guard has its own recruiters; the Reserve uses each branch's locator.
const RECRUITERS = {
  army: "https://www.goarmy.com/locate-a-recruiter",
  usmc: "https://www.marines.com/contact-a-recruiter",
  navy: "https://www.navy.com/contact-us/find-a-recruiter",
  af: "https://www.airforce.com/find-a-recruiter",
  sf: "https://www.spaceforce.com/find-local-recruiter",
  cg: "https://www.gocoastguard.com/connect",
  armyGuard: "https://www.nationalguard.com/find-a-recruiter",
  airGuard: "https://www.airforce.com/ways-to-serve/air-national-guard",
};

function recruiterLink(branch, component) {
  if (component === "guard" && branch === "army") return RECRUITERS.armyGuard;
  if (component === "guard" && branch === "af") return RECRUITERS.airGuard;
  return RECRUITERS[branch];
}

// Every question and bingo square, for looking up ids in share links.
const ALL_QUESTIONS = [...POOL, ...BINGO_POOL];

const COMPONENTS = {
  active: {
    name: "Active Duty",
    about: "Full-time. The military is your job: you live on or near a base, get a full-time paycheck, housing and healthcare, and usually move to a new duty station every few years.",
  },
  reserve: {
    name: "Reserve",
    about: "Part-time and federal. You typically train one weekend a month and two weeks a year, keep a civilian job or go to school, and can be called up to support active-duty forces.",
  },
  guard: {
    name: "National Guard",
    about: "Part-time, with a state mission too. The usual schedule is the same as the Reserve, but your governor can call you up for disasters and emergencies in your state, and you can also be mobilized federally. Only the Army and Air Force have a National Guard.",
  },
};

const COMPONENT_ORDER = ["active", "reserve", "guard"];

const TRACKS = {
  enlisted: {
    name: "Enlisted",
    about: "Most of the military. You join with a high school diploma, train for a specific job and do the hands-on work. As you get promoted you become a noncommissioned officer (NCO) and lead the people doing that work.",
  },
  officer: {
    name: "Officer",
    about: "Officers plan missions and lead units, and they're responsible for everyone under them. You usually need a four-year degree, and you commission through a service academy, ROTC in college, or officer candidate or training school after college.",
  },
};

const TRACK_ORDER = ["enlisted", "officer"];

const INTERESTS = {
  medical: "medicine",
  build: "building and construction",
  mechanic: "machines and engines",
  cyber: "cyber and networks",
  intel: "intelligence work",
  law: "law enforcement",
  aviation: "aviation",
  elite: "special operations",
  logistics: "logistics",
  comms: "communications and operations",
  weapons: "weapon systems",
  infantry: "front-line combat",
};

// Representative jobs per branch, using plain names rather than official
// codes. Each is tagged with the interests it fits (1 or 2).
const E = "enlisted", O = "officer";
const JOBS = {
  army: [
    { n: "Infantryman", tr: E, i: { infantry: 2, weapons: 1 }, d: "Patrols, raids and holding ground on foot. The core of the Army's fighting force." },
    { n: "Combat Medic", tr: E, i: { medical: 2 }, d: "Treats wounded soldiers in the field and runs aid stations." },
    { n: "Combat Engineer", tr: E, i: { build: 2, weapons: 1 }, d: "Builds bridges and obstacles, clears routes and handles explosives." },
    { n: "Helicopter Repairer", tr: E, i: { mechanic: 2, aviation: 1 }, d: "Keeps Black Hawks and other helicopters flying." },
    { n: "Cyber Operations Specialist", tr: E, i: { cyber: 2, intel: 1 }, d: "Defends Army networks and conducts cyber operations." },
    { n: "Intelligence Analyst", tr: E, i: { intel: 2 }, d: "Pieces together information about threats and briefs commanders." },
    { n: "Military Police", tr: E, i: { law: 2, weapons: 1 }, d: "Law enforcement and security on bases and in the field." },
    { n: "Motor Transport Operator", tr: E, i: { logistics: 2, mechanic: 1 }, d: "Drives heavy trucks that move troops, fuel and supplies." },
    { n: "Signal Support Specialist", tr: E, i: { comms: 2, cyber: 1 }, d: "Sets up and runs radios and communication networks." },
    { n: "Field Artillery Specialist", tr: E, i: { weapons: 2, infantry: 1 }, d: "Crews howitzers and rocket systems." },
    { n: "Special Forces (Green Beret)", tr: E, i: { elite: 2, infantry: 1 }, d: "Small elite teams for special missions and training partner forces. Very tough selection." },
    { n: "Infantry Officer", tr: O, i: { infantry: 2, weapons: 1 }, d: "Leads infantry platoons and companies." },
    { n: "Army Aviator", tr: O, i: { aviation: 2 }, d: "Flies helicopters like the Black Hawk and Apache. The Army also trains warrant officer pilots." },
    { n: "Army Nurse or Medical Officer", tr: O, i: { medical: 2 }, d: "Runs care in Army hospitals and field units." },
    { n: "Military Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads intelligence teams and advises commanders." },
    { n: "Engineer Officer", tr: O, i: { build: 2 }, d: "Leads engineer units that build, breach and clear." },
    { n: "Cyber Officer", tr: O, i: { cyber: 2 }, d: "Leads cyber operations teams." },
    { n: "Logistics Officer", tr: O, i: { logistics: 2 }, d: "Keeps units supplied, fueled and moving." },
    { n: "Military Police Officer", tr: O, i: { law: 2 }, d: "Leads military police units." },
    { n: "Special Forces Officer", tr: O, i: { elite: 2, infantry: 1 }, d: "Leads a Green Beret team." },
  ],
  usmc: [
    { n: "Rifleman", tr: E, i: { infantry: 2, weapons: 1 }, d: "The Marine infantryman: patrols, raids and amphibious assaults." },
    { n: "Combat Engineer", tr: E, i: { build: 2, weapons: 1 }, d: "Builds, breaches and clears routes for Marine units." },
    { n: "Aircraft Maintenance Marine", tr: E, i: { mechanic: 2, aviation: 1 }, d: "Keeps Marine jets, helicopters and Ospreys flying." },
    { n: "Field Radio Operator", tr: E, i: { comms: 2 }, d: "Keeps Marine units talking to each other." },
    { n: "Intelligence Specialist", tr: E, i: { intel: 2 }, d: "Analyzes threats and briefs Marine units." },
    { n: "Military Police", tr: E, i: { law: 2, weapons: 1 }, d: "Law enforcement and security for Marine bases and units." },
    { n: "Motor Vehicle Operator", tr: E, i: { logistics: 2, mechanic: 1 }, d: "Drives the trucks that move Marines and supplies." },
    { n: "Cyberspace Operations Marine", tr: E, i: { cyber: 2 }, d: "Defends Marine Corps networks." },
    { n: "Artillery Marine", tr: E, i: { weapons: 2 }, d: "Crews cannons and rocket systems." },
    { n: "Reconnaissance Marine", tr: E, i: { elite: 2, infantry: 1 }, d: "Small teams scouting ahead of the force. Some later try out for Marine Raiders." },
    { n: "Infantry Officer", tr: O, i: { infantry: 2, weapons: 1 }, d: "Leads Marine rifle platoons." },
    { n: "Marine Pilot", tr: O, i: { aviation: 2 }, d: "Flies jets, helicopters or Ospreys in support of Marines on the ground." },
    { n: "Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads intelligence teams." },
    { n: "Logistics Officer", tr: O, i: { logistics: 2 }, d: "Keeps Marine units supplied and moving." },
    { n: "Communications Officer", tr: O, i: { comms: 2, cyber: 1 }, d: "Runs a unit's communication networks." },
    { n: "Combat Engineer Officer", tr: O, i: { build: 2 }, d: "Leads combat engineer units." },
    { n: "Military Police Officer", tr: O, i: { law: 2 }, d: "Leads Marine military police." },
  ],
  navy: [
    { n: "Seabee: Builder", tr: E, i: { build: 2 }, d: "Navy construction crews that build bases, roads and bridges around the world." },
    { n: "Seabee: Equipment Operator", tr: E, i: { build: 1, logistics: 1, mechanic: 1 }, d: "Runs bulldozers, cranes and heavy equipment for Seabee projects." },
    { n: "Seabee: Construction Electrician", tr: E, i: { build: 2, mechanic: 1 }, d: "Wires and powers Seabee construction projects." },
    { n: "Hospital Corpsman", tr: E, i: { medical: 2 }, d: "Navy medic. Some serve with Marine units as their field medics." },
    { n: "Aviation Machinist's Mate", tr: E, i: { mechanic: 2, aviation: 1 }, d: "Maintains engines on Navy aircraft." },
    { n: "Nuclear Field Technician", tr: E, i: { mechanic: 2, intel: 1 }, d: "Runs the reactors on carriers and submarines. One of the hardest schools in the military." },
    { n: "Cryptologic Technician (Networks)", tr: E, i: { cyber: 2, intel: 1 }, d: "Cyber operations and network analysis." },
    { n: "Intelligence Specialist", tr: E, i: { intel: 2 }, d: "Analyzes intelligence for ships and aircraft squadrons." },
    { n: "Master-at-Arms", tr: E, i: { law: 2, weapons: 1 }, d: "Navy law enforcement and security." },
    { n: "Navy SEAL", tr: E, i: { elite: 2, infantry: 1 }, d: "Special operations on sea, air and land. Extremely tough selection." },
    { n: "Navy Diver", tr: E, i: { elite: 1, mechanic: 1, build: 1 }, d: "Underwater salvage, repair and construction." },
    { n: "Naval Aircrewman (Helicopter)", tr: E, i: { aviation: 2, medical: 1 }, d: "Helicopter crew, including Navy rescue swimmers." },
    { n: "Operations Specialist", tr: E, i: { comms: 2, intel: 1 }, d: "Runs radar and tracks what's around the ship." },
    { n: "Logistics Specialist", tr: E, i: { logistics: 2 }, d: "Manages supplies and parts for ships and squadrons." },
    { n: "Gunner's Mate", tr: E, i: { weapons: 2, mechanic: 1 }, d: "Maintains and operates shipboard weapons." },
    { n: "Naval Aviator", tr: O, i: { aviation: 2 }, d: "Flies jets or helicopters, including off aircraft carriers." },
    { n: "Surface Warfare Officer", tr: O, i: { comms: 1, weapons: 1, logistics: 1 }, d: "Drives and leads crews on Navy ships." },
    { n: "Submarine Officer", tr: O, i: { mechanic: 2, intel: 1 }, d: "Leads nuclear-powered submarine crews." },
    { n: "Navy Nurse or Doctor", tr: O, i: { medical: 2 }, d: "Medical care on ships, at Navy hospitals and with Marines." },
    { n: "Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads intelligence work for the fleet." },
    { n: "Civil Engineer Corps Officer", tr: O, i: { build: 2 }, d: "Leads Seabee units and Navy construction projects." },
    { n: "SEAL Officer", tr: O, i: { elite: 2, infantry: 1 }, d: "Leads a SEAL platoon." },
    { n: "Information Warfare Officer", tr: O, i: { cyber: 2, intel: 1 }, d: "Cyber, signals and electronic warfare." },
    { n: "Supply Corps Officer", tr: O, i: { logistics: 2 }, d: "Runs supply and logistics for ships and bases." },
  ],
  af: [
    { n: "Pararescue (PJ)", tr: E, i: { elite: 2, medical: 2 }, d: "Elite rescue specialists who reach and treat people anywhere. Very tough selection." },
    { n: "Combat Controller", tr: E, i: { elite: 2, comms: 1, aviation: 1 }, d: "Special operators who control air traffic and air strikes from the ground." },
    { n: "Aircraft Maintenance (Crew Chief)", tr: E, i: { mechanic: 2, aviation: 1 }, d: "Owns the upkeep of a specific aircraft." },
    { n: "Cyber Defense Operations", tr: E, i: { cyber: 2 }, d: "Defends Air Force networks and systems." },
    { n: "Intelligence Analyst", tr: E, i: { intel: 2 }, d: "Analyzes intelligence for aircrews and commanders." },
    { n: "Security Forces", tr: E, i: { law: 2, weapons: 1 }, d: "Air Force police and base defense." },
    { n: "Air Traffic Controller", tr: E, i: { comms: 2, aviation: 1 }, d: "Guides military aircraft in and out." },
    { n: "Loadmaster", tr: E, i: { aviation: 2, logistics: 1 }, d: "Aircrew who load cargo and troops on transport planes." },
    { n: "Aerospace Medical Technician", tr: E, i: { medical: 2 }, d: "Medical care in Air Force clinics and on medevac flights." },
    { n: "Aircraft Armament Systems", tr: E, i: { weapons: 2, mechanic: 1 }, d: "Loads and maintains aircraft weapons." },
    { n: "Civil Engineering", tr: E, i: { build: 2 }, d: "Builds, repairs and powers Air Force bases." },
    { n: "Logistics and Supply", tr: E, i: { logistics: 2 }, d: "Moves and manages parts, fuel and equipment." },
    { n: "Pilot", tr: O, i: { aviation: 2 }, d: "Flies fighters, bombers, tankers or transports." },
    { n: "Combat Systems Officer", tr: O, i: { aviation: 1, weapons: 1, comms: 1 }, d: "Navigation and weapons systems on aircraft." },
    { n: "Cyber Officer", tr: O, i: { cyber: 2 }, d: "Leads cyber operations." },
    { n: "Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads intelligence teams." },
    { n: "Nurse or Physician", tr: O, i: { medical: 2 }, d: "Medical care at Air Force hospitals and on medevac flights." },
    { n: "Special Tactics Officer", tr: O, i: { elite: 2, comms: 1 }, d: "Leads combat control and special tactics teams." },
    { n: "Civil Engineer Officer", tr: O, i: { build: 2 }, d: "Leads base construction and engineering." },
    { n: "Logistics Readiness Officer", tr: O, i: { logistics: 2 }, d: "Keeps the Air Force supplied and moving." },
    { n: "Security Forces Officer", tr: O, i: { law: 2 }, d: "Leads Air Force police and base defense." },
  ],
  sf: [
    { n: "Space Systems Operations", tr: E, i: { comms: 2, intel: 1 }, d: "Operates satellites, missile warning and space tracking systems." },
    { n: "Cyber Operations", tr: E, i: { cyber: 2 }, d: "Defends the networks that space systems depend on." },
    { n: "Intelligence", tr: E, i: { intel: 2 }, d: "Tracks threats to U.S. satellites." },
    { n: "Space Operations Officer", tr: O, i: { comms: 2, intel: 1 }, d: "Leads satellite, launch and space tracking crews." },
    { n: "Developmental Engineer", tr: O, i: { mechanic: 1, cyber: 1, build: 1 }, d: "Designs and tests new space systems." },
    { n: "Cyber Officer", tr: O, i: { cyber: 2 }, d: "Leads cyber defense of space systems." },
    { n: "Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads space intelligence teams." },
    { n: "Acquisition Officer", tr: O, i: { logistics: 2 }, d: "Manages the buying and building of satellites and systems." },
  ],
  cg: [
    { n: "Aviation Survival Technician", tr: E, i: { elite: 2, medical: 1, aviation: 1 }, d: "The Coast Guard rescue swimmer, who jumps from helicopters to save people." },
    { n: "Boatswain's Mate", tr: E, i: { law: 1, logistics: 1, comms: 1 }, d: "Drives small boats, leads deck crews and takes part in boardings." },
    { n: "Maritime Enforcement Specialist", tr: E, i: { law: 2, weapons: 1 }, d: "Coast Guard law enforcement and security." },
    { n: "Machinery Technician", tr: E, i: { mechanic: 2 }, d: "Keeps cutter and boat engines running." },
    { n: "Health Services Technician", tr: E, i: { medical: 2 }, d: "Medical care at Coast Guard clinics and on cutters." },
    { n: "Electronics Technician", tr: E, i: { cyber: 1, mechanic: 1, comms: 1 }, d: "Maintains radar, radios and navigation systems." },
    { n: "Operations Specialist", tr: E, i: { comms: 2 }, d: "Runs command centers that coordinate searches and rescues." },
    { n: "Aviation Maintenance Technician", tr: E, i: { mechanic: 2, aviation: 1 }, d: "Keeps Coast Guard helicopters and planes flying." },
    { n: "Intelligence Specialist", tr: E, i: { intel: 2 }, d: "Analyzes intelligence on smuggling and maritime threats." },
    { n: "Information Systems Technician", tr: E, i: { cyber: 2 }, d: "Runs Coast Guard networks and computer systems." },
    { n: "Damage Controlman", tr: E, i: { build: 1, mechanic: 1 }, d: "Firefighting, welding and damage repair aboard cutters." },
    { n: "Storekeeper", tr: E, i: { logistics: 2 }, d: "Manages supplies and finances for units." },
    { n: "Coast Guard Aviator", tr: O, i: { aviation: 2 }, d: "Flies rescue helicopters and patrol planes." },
    { n: "Cutter Officer", tr: O, i: { law: 1, comms: 1, logistics: 1 }, d: "Leads crews and operations on Coast Guard ships." },
    { n: "Response Officer", tr: O, i: { law: 2 }, d: "Leads law enforcement and search-and-rescue operations." },
    { n: "Engineering Officer", tr: O, i: { mechanic: 2, build: 1 }, d: "Leads engineering on cutters and shore units." },
    { n: "Intelligence Officer", tr: O, i: { intel: 2 }, d: "Leads Coast Guard intelligence work." },
    { n: "Cyber Officer", tr: O, i: { cyber: 2 }, d: "Leads Coast Guard cyber operations." },
  ],
};

// Civilian careers that military experience in each area commonly leads to.
// Some need extra licenses, certifications or school after service.
const CIVILIAN = {
  infantry: ["police officer", "federal law enforcement", "firefighter", "security contractor"],
  weapons: ["firearms instructor", "gunsmith", "range safety officer"],
  medical: ["EMT or paramedic", "ER technician", "nurse (with more school)", "physician assistant (with more school)"],
  build: ["construction", "electrician", "carpenter", "construction project manager"],
  mechanic: ["diesel or auto mechanic", "industrial maintenance tech", "power plant operator"],
  cyber: ["cybersecurity analyst", "network administrator", "penetration tester"],
  intel: ["intelligence analyst (government or contractor)", "data analyst", "federal agent"],
  law: ["police officer", "federal agent", "corrections officer", "private security"],
  aviation: ["airline or charter pilot", "aircraft mechanic", "flight operations"],
  elite: ["federal tactical teams", "security consulting", "wilderness EMT", "firefighter"],
  logistics: ["truck driver (CDL)", "supply chain manager", "warehouse operations manager"],
  comms: ["telecom technician", "radio and satellite technician", "emergency dispatcher"],
};

// Jobs whose civilian path is more specific than their interest tags.
const CIVILIAN_OVERRIDES = {
  "Nuclear Field Technician": ["nuclear power plant operator", "electrician", "power plant technician"],
  "Submarine Officer": ["nuclear power plant manager", "engineering manager"],
  "Air Traffic Controller": ["FAA air traffic controller", "airport operations"],
  "Helicopter Repairer": ["helicopter or aircraft mechanic (A&P license)", "aviation maintenance"],
  "Aircraft Maintenance Marine": ["aircraft mechanic (A&P license)", "aviation maintenance"],
  "Aviation Machinist's Mate": ["aircraft engine mechanic (A&P license)", "turbine technician"],
  "Aircraft Maintenance (Crew Chief)": ["aircraft mechanic (A&P license)", "aviation maintenance"],
  "Aviation Maintenance Technician": ["aircraft mechanic (A&P license)", "aviation maintenance"],
  "Motor Transport Operator": ["truck driver (CDL)", "logistics coordinator", "fleet manager"],
  "Motor Vehicle Operator": ["truck driver (CDL)", "logistics coordinator", "fleet manager"],
  "Seabee: Equipment Operator": ["heavy equipment operator", "crane operator", "construction"],
  "Seabee: Construction Electrician": ["electrician", "power lineman", "construction"],
  "Navy Diver": ["commercial diver", "underwater welder", "salvage diver"],
  "Damage Controlman": ["firefighter", "welder", "industrial safety"],
  "Aviation Survival Technician": ["rescue swimmer or lifeguard", "paramedic", "firefighter"],
  "Pararescue (PJ)": ["paramedic", "wilderness medicine", "federal rescue teams"],
  "Army Aviator": ["helicopter pilot (medevac, news, tours)", "airline pilot"],
  "Pilot": ["airline pilot", "corporate or charter pilot"],
  "Naval Aviator": ["airline pilot", "corporate or charter pilot"],
  "Marine Pilot": ["airline pilot", "corporate or charter pilot"],
  "Coast Guard Aviator": ["helicopter pilot (medevac, offshore)", "airline pilot"],
};

// Notes shown when a top interest has no matching job in a branch.
const INTEREST_NOTES = {
  usmc: { medical: "The Marines don't have their own medics. Navy Hospital Corpsmen serve with Marine units, so the Navy is the way to be a Marine unit's medic." },
  sf: { medical: "The Space Force doesn't have its own medical jobs. Air Force medical personnel take care of Guardians." },
};

// Facts and typical experience per branch. Training lengths and locations are
// typical and change over time, so the page tells readers to confirm them.
const DETAILS = {
  army: {
    members: "Soldiers", founded: "1775", dept: "Department of the Army (Department of Defense)", motto: "This We'll Defend",
    life: "Most Soldiers live on large posts in the U.S., and some are stationed overseas in places like Germany, Korea and Japan. Days usually start with early-morning PT (physical training), then work in your job. Field exercises mean days or weeks living out of tents and vehicles. How often you deploy depends a lot on your unit and job.",
    expect: ["Early-morning PT most days", "Field training: rucking, sleeping outside, living out of vehicles", "Moving to a new post every few years", "Huge variety of jobs, from infantry to cyber, medicine, aviation and logistics"],
    fit: ["You want lots of job options", "You like being outdoors and on land", "You want a big organization with room to move around"],
    notFit: ["You hate being outside in rough conditions", "You want to stay in one place your whole career"],
    bootcamp: {
      name: "Basic Combat Training (BCT)", length: "About 10 weeks",
      where: "Fort Jackson (South Carolina), Fort Benning (Georgia), Fort Leonard Wood (Missouri) or Fort Sill (Oklahoma)",
      leaders: "Drill sergeants",
      phases: [
        ["First weeks", "Drill sergeants, haircuts, uniforms, discipline, fitness and Army values."],
        ["Middle weeks", "Rifle marksmanship, combat skills, first aid and land navigation."],
        ["Final weeks", "Field exercises, then a multi-day final field test before graduation."],
      ],
    },
    tech: {
      name: "Advanced Individual Training (AIT)",
      text: "After basic you go to AIT to learn your job. It can take a few weeks or more than a year, depending on the job. Some jobs, like infantry, combine basic and job training into One Station Unit Training (OSUT) at a single base.",
    },
    officer: "West Point (the U.S. Military Academy), Army ROTC in college, or Officer Candidate School (OCS) after you have a degree. New officers then attend a Basic Officer Leader Course for their field.",
  },
  usmc: {
    members: "Marines", founded: "1775", dept: "Department of the Navy (Department of Defense)", motto: "Semper Fidelis (Always Faithful)",
    life: "Marines are organized to deploy fast, often aboard Navy ships. Expect a strong focus on fitness, discipline and appearance in every job. Units train hard and often, and many Marines deploy on ship-based or overseas rotations. The culture is famously proud and tight-knit.",
    expect: ["The toughest boot camp in the military", "Every Marine is trained as a rifleman first, whatever the job", "Strict standards for fitness, grooming and uniforms", "Deployments, including on Navy ships"],
    fit: ["You want the hardest challenge", "You love tradition and a strong identity", "You want to be part of an elite, fast-moving force"],
    notFit: ["You want a relaxed culture", "You want comfortable living conditions"],
    bootcamp: {
      name: "Recruit training", length: "About 13 weeks",
      where: "Marine Corps Recruit Depot Parris Island (South Carolina) or San Diego (California)",
      leaders: "Drill instructors",
      phases: [
        ["First phase", "Drill instructors, close-order drill, fitness, Marine Corps history and core values."],
        ["Second phase", "Rifle qualification and field skills."],
        ["Third phase", "The Crucible: a 54-hour test with little food and sleep. Finish it and you earn the Eagle, Globe and Anchor."],
      ],
    },
    tech: {
      name: "School of Infantry, then MOS school",
      text: "Every Marine goes to the School of Infantry after boot camp. Infantry Marines attend the Infantry Training Battalion. Everyone else attends Marine Combat Training and then goes to the school for their job (MOS).",
    },
    officer: "The Naval Academy, Navy ROTC (Marine option), or Officer Candidates School in Quantico, Virginia. Every new Marine officer then spends about six months at The Basic School before training for their job.",
  },
  navy: {
    members: "Sailors", founded: "1775", dept: "Department of the Navy (Department of Defense)", motto: null,
    life: "Sailors alternate between time in home port and deployments at sea that can last several months. Ship life means close quarters, watch schedules and a crew that becomes family. Port visits can take you around the world. Many jobs are highly technical, and not every Sailor serves on a ship: there are shore, aviation and Seabee units too.",
    expect: ["Deployments at sea that can last months", "Close quarters and shift work (\"watches\") aboard ships", "Port visits in other countries", "Very technical jobs, including nuclear power and aviation"],
    fit: ["You want to see the world", "You like the ocean and ships", "You want technical training that transfers to civilian jobs"],
    notFit: ["You get seasick easily", "You want to be home every night"],
    bootcamp: {
      name: "Recruit Training Command", length: "About 9 weeks",
      where: "Great Lakes, Illinois (the Navy's only boot camp)",
      leaders: "Recruit Division Commanders (RDCs)",
      phases: [
        ["First weeks", "Processing, uniforms, physical training and Navy customs."],
        ["Middle weeks", "Firefighting, damage control, seamanship, swim qualification and weapons safety."],
        ["Final test", "Battle Stations 21: an overnight series of shipboard emergencies on a simulated ship."],
      ],
    },
    tech: {
      name: "\"A\" School",
      text: "Most Sailors go to an \"A\" School after boot camp to learn their rating (job). Advanced ratings, like the nuclear field, add more schools and long training pipelines. Some Sailors go straight to the fleet and learn on the job.",
    },
    officer: "The Naval Academy in Annapolis, Navy ROTC in college, or Officer Candidate School in Newport, Rhode Island.",
  },
  af: {
    members: "Airmen", founded: "1947", dept: "Department of the Air Force (Department of Defense)", motto: "Aim High... Fly-Fight-Win",
    life: "Most Airmen work regular shifts on well-equipped bases, many with good housing, gyms and dining. Lots of jobs are technical, from aircraft maintenance to cyber. Deployments happen, but many jobs deploy less often or for shorter periods than ground forces.",
    expect: ["Generally comfortable bases and quality of life", "Lots of technical training", "College credit through the Community College of the Air Force", "Fewer field-style deployments for many jobs"],
    fit: ["You like tech and aircraft", "You want a professional, relaxed-feeling culture", "You want skills that turn into a civilian career"],
    notFit: ["You want to be on the front line", "You want the most intense physical challenge"],
    bootcamp: {
      name: "Basic Military Training (BMT)", length: "About 7.5 weeks",
      where: "Joint Base San Antonio-Lackland, Texas",
      leaders: "Military Training Instructors (MTIs)",
      phases: [
        ["First week", "Processing, uniforms, learning to march and the basics of military life."],
        ["Middle weeks", "Fitness, drill, inspections, weapons training and Air Force core values."],
        ["PACER FORGE", "A field training exercise that simulates deployed operations. It replaced the old BEAST week in 2022."],
      ],
    },
    tech: {
      name: "Technical training (tech school)",
      text: "After BMT you go to tech school to learn your job (AFSC). It can take a few weeks or more than a year, and much of it counts as credit toward a Community College of the Air Force degree.",
    },
    officer: "The Air Force Academy in Colorado Springs, Air Force ROTC in college, or Officer Training School at Maxwell Air Force Base, Alabama.",
  },
  sf: {
    members: "Guardians", founded: "2019", dept: "Department of the Air Force (Department of Defense)", motto: "Semper Supra (Always Above)",
    life: "Guardians mostly work in operations centers running satellites, missile warning, space tracking, cyber and intelligence. Many work rotating shifts on watch. The branch is small and new, so people often get noticed and help shape how things are done.",
    expect: ["Mostly indoor, screen-based work", "Shift work in operations centers", "A small, tech-focused branch still building its culture", "Fewer jobs to choose from than larger branches"],
    fit: ["You love space and technology", "You want a small branch where you stand out", "You prefer brain work to field work"],
    notFit: ["You want combat or field work", "You want lots of job variety"],
    bootcamp: {
      name: "Basic Military Training (Space Force)", length: "About 7.5 weeks",
      where: "Joint Base San Antonio-Lackland, Texas, alongside Air Force trainees",
      leaders: "Military Training Instructors (MTIs)",
      phases: [
        ["First weeks", "The same core as Air Force BMT: processing, drill, fitness and inspections."],
        ["Middle weeks", "Weapons training, plus Space Force-specific classes on space history and the Guardian identity."],
        ["Final weeks", "A field training exercise, then graduation as a Guardian."],
      ],
    },
    tech: {
      name: "Technical training",
      text: "After BMT, Guardians go to technical training for their job. For example, space systems operators train at Vandenberg Space Force Base in California.",
    },
    officer: "The Air Force Academy, Air Force ROTC in college, or Officer Training School.",
  },
  cg: {
    members: "Coast Guardsmen", founded: "1790 (as the Revenue Cutter Service)", dept: "Department of Homeland Security (can operate under the Navy in wartime)", motto: "Semper Paratus (Always Ready)",
    life: "Coast Guard members work at stations, on cutters (ships) and at air stations, mostly in U.S. waters. Small boat stations sit in coastal towns, and duty often means being on call for search and rescue. Cutters patrol for weeks or months at a time, enforcing laws and stopping smuggling.",
    expect: ["Missions at home: rescues, law enforcement, environmental protection", "Small units where everyone knows each other", "Being on call for emergencies", "Fewer people, so promotions and jobs can be competitive"],
    fit: ["You want to save lives", "You want to stay closer to home", "You like boats, water and law enforcement"],
    notFit: ["You want overseas combat missions", "You want a huge organization with tons of options"],
    bootcamp: {
      name: "Recruit training", length: "About 8 weeks",
      where: "Training Center Cape May, New Jersey (the only Coast Guard boot camp)",
      leaders: "Company Commanders",
      phases: [
        ["First weeks", "Processing, uniforms and the basics of military life."],
        ["Middle weeks", "Seamanship, firefighting, swim tests, weapons training and Coast Guard history."],
        ["Final weeks", "Drill, inspections and finding out your first unit assignment."],
      ],
    },
    tech: {
      name: "\"A\" School",
      text: "Most members report to a unit first, learn on the job, and request \"A\" School later to learn their rating. Some go to \"A\" School right after boot camp.",
    },
    officer: "The Coast Guard Academy in New London, Connecticut, Officer Candidate School (also in New London), or the College Student Pre-Commissioning Initiative scholarship.",
  },
};

// A typical day for many active-duty members, by branch. Times are
// approximate and vary a lot by job, unit and deployment.
DETAILS.army.day = [["5:30", "Wake up"], ["6:30", "PT (physical training) with your unit"], ["7:45", "Shower and breakfast"], ["9:00", "Formation, then work in your job: the motor pool, clinic, office, range or field"], ["12:00", "Lunch"], ["13:00", "More job work and training"], ["17:00", "Final formation, then free time: gym, dinner, online classes"]];
DETAILS.usmc.day = [["5:00", "Reveille"], ["6:00", "PT, often a hard group workout or run"], ["7:15", "Chow"], ["8:00", "Formation, uniform and gear checks, then work in your MOS"], ["11:30", "Chow"], ["12:30", "Training: weapons, tactics, classes or field work"], ["16:30", "Secured for the day, unless you have duty"]];
DETAILS.navy.day = [["6:00", "Reveille (at sea, the day runs on watches)"], ["6:30", "Breakfast on the mess deck"], ["7:30", "Quarters: muster with your division and get the plan"], ["8:00", "Work in your rating: maintenance, operations or watchstanding"], ["11:30", "Lunch"], ["13:00", "Drills (fire, flooding, man overboard) and more work"], ["16:00", "In port, most people head home unless it's their duty day; at sea, watches continue around the clock"]];
DETAILS.af.day = [["6:30", "PT on your own or with your unit"], ["7:30", "Start your shift: days, swings or mids depending on the job"], ["11:30", "Lunch at the dining facility"], ["12:30", "Back to work: aircraft, networks, clinic, security and more"], ["16:30", "Off: gym, base amenities, or classes toward your Community College of the Air Force degree"]];
DETAILS.sf.day = [["Shift start", "Crew briefing: status of the satellites, systems and any threats"], ["On shift", "Run satellite contacts, watch missile warning or space tracking, and log everything"], ["Mid-shift", "Training, checklists and exercises with the crew"], ["Shift end", "Hand over to the next crew"], ["Days off", "Rotating schedules often mean several days off between shift blocks"]];
DETAILS.cg.day = [["Duty day", "At a small boat station you might be on duty for 24 hours, sleeping at the station"], ["8:00", "Morning brief, then boat checks and maintenance"], ["10:00", "Training underway: boat handling, towing, rescue drills"], ["Anytime", "A search-and-rescue call can come in at any hour"], ["Off duty", "After a duty day you usually go home; on a cutter you'd stand watches on patrols lasting weeks"]];

// Longer descriptions for the service type pages.
const COMPONENT_DETAILS = {
  active: {
    schedule: "Full-time, every day, like any job, plus deployments and field training.",
    life: ["You live on or near a base, or aboard a ship in sea-going jobs", "Full-time pay, plus housing, food allowance and healthcare", "You move to a new duty station every few years", "How often you deploy depends on your job and unit"],
    // First line for branches without ships.
    lifeLand: "You live on or near a base",
  },
  reserve: {
    schedule: "Usually one weekend a month and about two weeks of training a year.",
    life: ["You keep your civilian job or go to school", "You attend the same boot camp and job training as active duty", "Part-time pay and some benefits", "You can be called to active duty to support the force"],
  },
  guard: {
    schedule: "Usually one weekend a month and about two weeks of training a year, like the Reserve.",
    life: ["Your unit is in your state and answers to your governor", "You can be called up for disasters and emergencies in your state", "You can also be mobilized for federal missions and deployments", "Many states offer tuition help for Guard members"],
  },
};

// Photos behind results and on share cards, several per branch. `focus` is
// where the action is (fractions of width and height), so crops center on it.
const BG_PHOTOS = {
  army: [
    { src: "images/army.jpg", focus: [0.63, 0.5] },   // lead soldier and convoy in the snow
    { src: "images/army2.jpg", focus: [0.45, 0.45] }, // howitzer crew firing
    { src: "images/army3.jpg", focus: [0.35, 0.4] },  // soldier aiming from a fighting position
    { src: "images/army4.jpg", focus: [0.38, 0.5] },  // Ranger on the rope course
  ],
  usmc: [
    { src: "images/usmc.jpg", focus: [0.5, 0.45] },   // Marines advancing toward the blast
    { src: "images/usmc2.jpg", focus: [0.35, 0.5] },  // clay target shooting off a ship
    { src: "images/usmc3.jpg", focus: [0.6, 0.5] },   // CH-53 refueling in flight with a sling load
    { src: "images/usmc4.jpg", focus: [0.45, 0.5] },  // team moving with night vision
  ],
  navy: [
    { src: "images/navy.jpg", focus: [0.4, 0.5] },    // sailors hauling the line
    { src: "images/navy2.jpg", focus: [0.6, 0.35] },  // close-in weapon system firing at dusk
    { src: "images/navy3.jpg", focus: [0.55, 0.45] }, // sailor on a machine gun
    { src: "images/navy4.jpg", focus: [0.55, 0.6] },  // sailors manning the rails
  ],
  af: [
    { src: "images/af.jpg", focus: [0.7, 0.4] },     // jet on afterburner
    { src: "images/af2.jpg", focus: [0.47, 0.42] },  // T-38s in formation
    { src: "images/af3.jpg", focus: [0.5, 0.55] },   // T-38 close up
    { src: "images/af4.jpg", focus: [0.5, 0.5] },    // F-15EX formation
  ],
  sf: [
    { src: "images/sf.jpg", focus: [0.55, 0.4] },    // two Guardians
    { src: "images/sf2.jpg", focus: [0.6, 0.45] },   // satellite dishes
  ],
  cg: [
    { src: "images/cg.jpg", focus: [0.57, 0.58] },   // response boat
    { src: "images/cg2.jpg", focus: [0.35, 0.5] },   // deck crew hauling a line
    { src: "images/cg3.jpg", focus: [0.45, 0.55] },  // gun crew firing at sea
    { src: "images/cg4.jpg", focus: [0.55, 0.55] },  // cutter's deck gun firing
  ],
};

// Picks a branch's photo; the same seed (like a result's share code) always
// gets the same one.
function photoFor(branch, seed = "") {
  const list = BG_PHOTOS[branch];
  if (!list) return null;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}
