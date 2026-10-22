"use strict";

// Research for the boot camp graduation guide. Checked against the official
// boot camp and installation pages on the date in `checked`; each block lists
// the pages its facts came from. Schedules change often (and by unit), so the
// page always tells readers to confirm with the official source. English only
// for now.

window.F_GRADUATION = {
  checked: "2026-10-21",

  // ---------------------------------------------------------------------------
  // Branch by branch.
  branches: [
    {
      id: "army",
      color: "army",
      name: "Army",
      event: "Family Day and graduation",
      where: "Basic Combat Training runs at Fort Jackson (South Carolina), Fort Benning (Georgia), Fort Leonard Wood (Missouri) and Fort Sill (Oklahoma). Each post, and even each battalion, sets its own times. The details below come from Fort Jackson's official pages.",
      facts: [
        ["When", "The last two days of training, back to back. At Fort Jackson, Family Day and graduation both start at 9 a.m. on Hilton Field (for example, a Wednesday Family Day and a Thursday graduation)."],
        ["Time together", "Most of Family Day and the rest of graduation day after the ceremony. New Soldiers stay in uniform both days and report back when their unit says."],
        ["Leaving post", "Family Day: usually an on-post pass for the afternoon, so the Soldier has to stay on Fort Jackson (guests can come and go). Graduation day: usually an off-post pass for the rest of the day, in uniform and within 25 miles of Fort Jackson. Fort Jackson says pass rules vary from battalion to battalion."],
        ["Watch online", "Fort Jackson livestreams its graduation ceremonies on the Fort Jackson Facebook page."],
        ["Guests", "Fort Jackson has no limit on guests. Every visitor 18 or older needs a visitor pass (apply online at pass.aie.army.mil) and a physical photo ID."],
        ["Afterward", "Next is Advanced Individual Training (AIT) for your job. At Fort Jackson, if AIT is east of the Mississippi, a parent, spouse, grandparent, adult sibling or legal guardian may drive the new Soldier there, reporting by 5 p.m. the day after graduation. Everyone else travels with the Army the day after graduation."],
      ],
      schedules: [
        {
          title: "Fort Jackson",
          days: [
            ["Family Day", ["9 a.m. ceremony on Hilton Field", "Afternoon together on post (on-post pass)", "Back to the company at the time the unit sets"]],
            ["Graduation day", ["Guests seated by 8:50 a.m.", "9 a.m. graduation on Hilton Field, also livestreamed", "Off-post pass for the rest of the day, or sign out to be driven to AIT"]],
            ["Day after", ["Soldiers not driven by family ship out to AIT"]],
          ],
        },
      ],
      notes: [
        "Infantry trainees at Fort Benning do One Station Unit Training (OSUT), about 18 weeks of basic and job training together. It ends with a \"Turning Blue\" ceremony (they earn the blue infantry cord), then Family Day, then graduation the next morning.",
        "At Fort Leonard Wood, most graduation guests don't need a pass unless they come on post before Family Day or after graduation, stay in an on-post hotel, fly into the post airfield, or aren't U.S. citizens. It doesn't accept non-REAL ID licenses without extra documents.",
      ],
      sources: [
        ["https://home.army.mil/jackson/units-tenants/193BDE/3rd-battalion-60th-infantry-regiment", "Fort Jackson: 3rd Battalion, 60th Infantry (family information)"],
        ["https://home.army.mil/jackson/my-fort/visitor-information/family-day-and-graduation-visitors-guide", "Fort Jackson: Family Day and graduation visitor's guide"],
        ["https://www.army.mil/article/291378/197th_infantry_brigade_ceremony_information", "Army.mil: 197th Infantry Brigade ceremony information (2026)"],
        ["https://home.army.mil/wood/my-fort/visitors-access", "Fort Leonard Wood: visitor access"],
      ],
    },
    {
      id: "usmc",
      color: "usmc",
      name: "Marine Corps",
      event: "Family Day and graduation",
      where: "Marine Corps Recruit Depot Parris Island (South Carolina) or San Diego (California).",
      facts: [
        ["The Emblem Ceremony", "The Crucible is a 54-hour final test. At Parris Island it ends with a 9-mile hike to the Iwo Jima monument by the parade deck, where recruits receive the Eagle, Globe and Anchor emblem and become Marines. It happens about two weeks before graduation, and families aren't there for it."],
        ["When", "Family Day is Thursday and graduation is Friday, the last two days of training. Parris Island is open to graduating Marines' families Wednesday through Friday, with a family orientation day on Wednesday."],
        ["Time together", "Family Day liberty: about 10 a.m. to 3 p.m. at Parris Island and 10:45 a.m. to 5:30 p.m. at San Diego. Then graduation the next morning."],
        ["Leaving base", "Family Day liberty is on base only. San Diego says it plainly: new Marines cannot leave the depot. At Parris Island, Marines are authorized up to 10 days of boot leave after Friday's graduation before reporting to infantry or combat training."],
        ["Watch online", "MCRD San Diego warns that any livestream advertised for its graduations is fraudulent; follow the depot's official social media instead. Parris Island posts graduation photos on its official Flickr page."],
        ["Guests", "Around week 9, every recruit gets a graduation packet with an invitation letter, and the recruit decides who to mail it to. The depot can't tell you whether one was mailed or send a new one."],
      ],
      schedules: [
        {
          title: "Parris Island",
          days: [
            ["Wednesday", ["Family check-in at the Douglas Visitors' Center", "Optional \"Marine Corps 101\" tour and a family orientation brief"]],
            ["Thursday (Family Day)", ["7 a.m. motivational run", "Sign in at the visitors' center before 9:50 a.m.", "9:30 a.m. Family Day ceremony", "10 a.m. to 3 p.m. liberty on base"]],
            ["Friday (graduation)", ["7:45 a.m. Morning Colors (optional)", "9 a.m. graduation on the Peatross Parade Deck", "Then liberty and boot leave begin"]],
          ],
        },
        {
          title: "San Diego",
          days: [
            ["Thursday (Family Day)", ["Gate 5 opens 6:30 a.m.", "8:30 a.m. motivational run", "9:30 a.m. welcome brief", "10:45 a.m. to 5:30 p.m. liberty on the depot"]],
            ["Friday (graduation)", ["7:30 a.m. Morning Colors (optional)", "Be seated by 9:45 a.m.", "10 a.m. graduation on Shepherd Field"]],
          ],
        },
      ],
      notes: [
        "After the Crucible, new Marines may make personal phone calls and use the internet during on-base liberty on the Sunday and Thursday before graduation (Parris Island FAQ).",
      ],
      sources: [
        ["https://www.mcrdpi.marines.mil/Visitors/Graduation/Morning-Colors-and-Graduation/", "MCRD Parris Island: Family Day and graduation"],
        ["https://www.mcrdpi.marines.mil/About/", "MCRD Parris Island: FAQs"],
        ["https://www.mcrdpi.marines.mil/Recruit-Training/Crucible/", "MCRD Parris Island: the Crucible"],
        ["https://www.mcrdpi.marines.mil/Visitors/Graduation/Graduation-Schedule/", "MCRD Parris Island: graduation schedule"],
        ["https://www.mcrdsd.marines.mil/Graduation/Graduation/Public-Event-Schedule/", "MCRD San Diego: graduation schedule"],
      ],
    },
    {
      id: "navy",
      color: "navy",
      name: "Navy",
      event: "Pass In Review",
      where: "Recruit Training Command (RTC), Great Lakes, Illinois, the Navy's only boot camp.",
      facts: [
        ["When", "One formal ceremony, Pass In Review, in RTC's ceremonial drill hall. On the current schedule graduations fall on Thursdays. The ceremony runs from 9 to 10:30 a.m."],
        ["Time together", "After the ceremony new Sailors meet their guests and can go on liberty. Recruits get their phones back the day before graduation."],
        ["Leaving base", "Yes, new Sailors can spend liberty off base with their family. How much time they get depends on where they go next: those with \"A\" School in Great Lakes check in right after graduation, and those training out of state fly out the day after. On liberty they stay in uniform, can't drink alcohol (at any age), use tobacco, get tattoos or piercings, or drive, and must be back by 9 p.m."],
        ["Watch online", "RTC livestreams Pass In Review at 9 a.m. Central on its official Facebook and YouTube pages."],
        ["Guests", "Each recruit may invite three or four guests, depending on class size (children 2 and under don't count). Guests submit their names through RTC's ticketing form by the Friday before graduation, and the recruit chooses who attends. Free tickets are picked up in person at the off-base Recruit Family Welcome Center, and no ticket means no base access."],
      ],
      schedules: [
        {
          title: "RTC Great Lakes",
          days: [
            ["Day before", ["Recruit Family Welcome Center open 10 a.m. to 7:30 p.m. for tickets"]],
            ["Graduation day", ["Welcome Center open 5:30 to 8 a.m.", "Base gate opens 6:30 a.m.; arrive at least 1.5 hours early", "Doors close at 9 a.m.; no entry after", "9 to 10:30 a.m. Pass In Review", "Liberty or transfer to \"A\" School afterward"]],
          ],
        },
      ],
      notes: [
        "Recruits who are held back (for a failed fitness test or swim qualification, for example) won't graduate on the original date. RTC says not to plan a trip until your recruit has called to say they'll graduate, and recommends refundable tickets.",
      ],
      sources: [
        ["https://www.bootcamp.navy.mil/Graduation/", "Navy RTC: graduation (tickets, schedule, liberty policy)"],
        ["https://www.bootcamp.navy.mil/FAQ/", "Navy RTC: FAQ"],
        ["https://www.bootcamp.navy.mil/Graduation/Training-Group-Graduation-Dates/", "Navy RTC: graduation dates"],
      ],
    },
    {
      id: "af",
      color: "af",
      name: "Air Force and Space Force",
      event: "BMT graduation week",
      where: "Basic Military Training (BMT) at Joint Base San Antonio-Lackland, Texas. Space Force trainees go through the same BMT and graduate as Guardians.",
      facts: [
        ["When", "BMT is 7.5 weeks, and graduation is almost always the 7th Thursday after arrival. Public events happen on Wednesday and Thursday of graduation week."],
        ["The big moments", "Wednesday starts with the Airman's Run (1.5 miles; families line the route and get their first look in 7.5 weeks), then the Coin and Retreat Ceremony, where trainees receive the Airman's coin or Guardian coin and officially become Airmen and Guardians. Thursday is the graduation parade."],
        ["Leaving base", "Yes. After the coin ceremony and after the parade, graduates get \"town pass\": off-base time within one hour of Lackland. Back by 8 p.m. Wednesday and 6 p.m. Thursday, because many ship out to technical training as early as 2 a.m. Friday. Town pass is earned (granted on merit) and can change for severe weather."],
        ["Watch online", "As of September 2026, BMT does not livestream. Recordings of the coin ceremony and the parade go up on YouTube within about a week."],
        ["Guests", "In week 1 each trainee can list up to six guests aged 18 or older for a background check. Names can't be added or changed later, and passes can't be transferred. Kids under 18 and people who already have a DoD ID don't need a pass."],
      ],
      schedules: [
        {
          title: "JBSA-Lackland",
          days: [
            ["Wednesday", ["7:30 a.m. Airman's Run", "Information briefing for families", "Coin and Retreat Ceremony, then \"tap out\" your Airman or Guardian", "Town pass until 8 p.m."]],
            ["Thursday", ["Graduation parade at the parade grounds", "Town pass until 6 p.m."]],
            ["Friday", ["Graduates leave for technical training"]],
          ],
        },
      ],
      notes: [
        "American Sign Language interpreters can be requested for the Wednesday and Thursday events at least two weeks ahead.",
        "Cards are fine as gifts, but graduates can't take big items, electronics or food back to the dorms. Mail those to their tech school instead.",
      ],
      sources: [
        ["https://www.basictraining.af.mil/Home/BMT-Graduation-Information/", "Air Force BMT: graduation information"],
        ["https://www.basictraining.af.mil/Home/BMT-Graduation-Information/Schedule-of-Events/", "Air Force BMT: schedule of events"],
        ["https://www.basictraining.af.mil/Home/BMT-Graduation-Information/Liberty/", "Air Force BMT: liberty and town pass"],
        ["https://www.basictraining.af.mil/About-Us/Frequently-Asked-Questions/", "Air Force BMT: FAQ (current as of Sept 2026)"],
      ],
    },
    {
      id: "cg",
      color: "cg",
      name: "Coast Guard",
      event: "Graduation",
      where: "Training Center Cape May, New Jersey, the Coast Guard's only boot camp.",
      facts: [
        ["When", "Usually Friday at 11 a.m., lasting about an hour (dates shift around some federal holidays). Indoors in the gym from October to about May 1, outdoors on the parade field from May to October."],
        ["Time together", "Families can join an optional Thursday dinner and Friday breakfast on base, but recruits aren't at either one. The first time you see your recruit is the ceremony."],
        ["Leaving base", "Yes. After the ceremony recruits are free to depart. Active-duty graduates then go to a five-day course (START) at Training Center Yorktown, Virginia, and may take local leave within 100 miles of Cape May from noon Friday until 8 p.m. Saturday, or stay on base."],
        ["Watch online", "Every recruit graduation is livestreamed on the official Training Center Cape May Facebook page from 11 a.m. The stream is free and never asks for personal information or a credit card."],
        ["Guests", "Capped at four guests per recruit. Invitations come from the recruit in the last few weeks of training, guest slots can't be traded between recruits, and the recruit confirms guests during graduation week."],
      ],
      schedules: [
        {
          title: "Training Center Cape May",
          days: [
            ["Thursday", ["6 p.m. family dinner on base ($15 adults, $10 under 12; register through your recruit's link; recruits don't attend)"]],
            ["Friday", ["8:15 a.m. main gate opens to graduation guests (not earlier)", "8:30 to 9:45 a.m. optional family breakfast ($10)", "11 a.m. to noon graduation", "Recruits free to depart"]],
          ],
        },
      ],
      notes: [
        "If no one can attend, the Coast Guard arranges the graduate's travel to their leave and first unit.",
      ],
      sources: [
        ["https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Visitor-Services/Graduation/", "TRACEN Cape May: graduation info"],
        ["https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Grad-Page/", "TRACEN Cape May: graduation livestream"],
        ["https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Training/RecruitTraining/", "TRACEN Cape May: recruit training FAQ"],
      ],
    },
  ],

  // Short answers for the at-a-glance table (same sources as above).
  glance: [
    { id: "army", days: "Family Day + graduation", out: "Family Day on post; usually off post (nearby) after graduation", watch: "Fort Jackson: Facebook live", guests: "No limit at Fort Jackson; adults need a pass" },
    { id: "usmc", days: "Family Day (Thu) + graduation (Fri)", out: "Family Day on base only; boot leave after graduation (Parris Island)", watch: "No official livestream at San Diego", guests: "The recruit mails the invitations" },
    { id: "navy", days: "Pass In Review", out: "Liberty off base after the ceremony", watch: "Facebook and YouTube live", guests: "3 or 4 per recruit" },
    { id: "af", days: "Wednesday + Thursday events", out: "Town pass both days, within 1 hour", watch: "Not live; on YouTube within a week", guests: "Up to 6 adults (kids don't need a pass)" },
    { id: "cg", days: "Graduation (Fri, 11 a.m.)", out: "Free to depart; local leave until Saturday night", watch: "Facebook live", guests: "4 per recruit" },
  ],

  // ---------------------------------------------------------------------------
  // What if nobody can come?
  nobody: {
    intro: "Lots of graduates have no one in the stands. Distance, plane tickets, hotels, work schedules, little kids at home, a short guest window: there are plenty of normal reasons. It doesn't change anything official. You march, you graduate, and your rank and records are exactly the same as everyone else's.",
    points: [
      "You almost certainly won't be the only one whose family couldn't make it.",
      "You're not stuck alone. Fort Jackson, for example, says Soldiers who don't have family attending may spend Family Day with a battle buddy.",
      "Other families often invite a graduate's classmates along for a meal or a photo. If one offers, it's fine to say yes (and fine to say no).",
      "These are the last days with the people you trained beside, and many graduates say that's what they remember most.",
      "Your travel to your next school or unit is handled by the military whether or not anyone comes. The Coast Guard, for example, says graduates with no guests still get their travel arranged.",
    ],
    streams: [
      ["army", "Fort Jackson livestreams graduation on its official Facebook page. Other Army posts set their own policies, so check the post's official pages."],
      ["usmc", "MCRD San Diego says any graduation livestream ad is fraudulent. Parris Island posts photos on its official Flickr page."],
      ["navy", "Pass In Review streams live on RTC's official Facebook and YouTube pages at 9 a.m. Central."],
      ["af", "Not livestreamed right now; the coin ceremony and parade are posted to YouTube within about a week."],
      ["cg", "Every graduation streams on the official Training Center Cape May Facebook page, free, starting at 11 a.m."],
    ],
    streamTip: "Official streams are free. Be careful with anything that asks for a payment or personal details to \"watch the graduation.\"",
    lettersIntro: "During training, mail is the main way to stay in touch, since phones are mostly put away. Letters mean a lot. Each boot camp has its own rules about what can be sent:",
    mail: [
      { id: "army", points: ["Letters are encouraged. Mail can take two weeks or more to arrive.", "Photos are fine, but nothing explicit or showing anything illegal. No oversized greeting cards.", "Only send packages with items your trainee asked for and had approved. Sending prohibited items can get your trainee in trouble."], source: "https://home.army.mil/jackson/units-tenants/193BDE/3rd-battalion-60th-infantry-regiment" },
      { id: "usmc", points: ["No phone calls, email, texts or internet for recruits: letters and postcards by U.S. mail.", "Use the address format on the depot's \"Contacting a recruit\" page, and don't mail prohibited items."], source: "https://www.mcrdpi.marines.mil/About/" },
      { id: "navy", points: ["Letters and small photographs only.", "No packages of clothes, toiletries or food, and nothing that's taken by mouth, like cough drops or flavor drops.", "A letter usually takes 5 to 10 business days, plus about a day to reach the recruit."], source: "https://www.bootcamp.navy.mil/FAQ/" },
      { id: "af", points: ["Letters, with photos if you like, as long as they're in good taste.", "Care packages aren't needed; packages are opened in front of an instructor and any food is thrown away. No electronics or cameras.", "No glitter, confetti or cards that make noise."], source: "https://www.basictraining.af.mil/About-Us/Frequently-Asked-Questions/" },
      { id: "cg", points: ["Mail is handed out daily starting Wednesday of week two.", "Letters and small pictures in good taste, plus up to two religious books or study materials.", "Care packages aren't needed; packages are opened in front of a company commander."], source: "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Training/RecruitTraining/" },
    ],
    family: [
      "Watch the livestream (or the recording) together, and send a message for your graduate to read when they get their phone back.",
      "Write during training. Recruits usually mail home their address early on.",
      "Plan a call or video chat for the first evening they have their phone.",
      "Celebrate when they come home on leave instead. A late celebration still counts.",
    ],
    emergency: "For a real family emergency (a death or serious illness), the boot camps all point to the American Red Cross, which passes urgent messages to service members.",
    emergencySource: "https://www.redcross.org/get-help/military-families/emergency-communication.html",
  },

  // ---------------------------------------------------------------------------
  // What if I don't want my family there?
  choice: {
    intro: "That's your call, and you don't owe anyone an explanation. Some people have complicated families, some just want a quiet day, and plenty of people join partly to start fresh. Here's how much control you actually have.",
    points: [
      ["You choose who's invited.", "Where there's a guest list, you make it. The Navy says only the recruit can change its graduation access list, and staff can't release who's on it. Air Force and Space Force trainees fill out their own guest list in week 1. Coast Guard invitations come from the recruit. Marine recruits decide who gets their graduation invitation packet."],
      ["Some ceremonies are open to anyone with a visitor pass.", "At Army posts like Fort Jackson there's no guest list, so the main thing you control is who you tell your graduation date and unit to."],
      ["You control your own letters and calls.", "You decide who gets your mailing address. Fort Jackson, for example, says it doesn't tell trainees who to call with their phone time."],
      ["Your information isn't handed out because someone is related to you.", "The federal Privacy Act generally bars agencies from releasing a person's records without their written consent. Air Force BMT says no one there may release information about a trainee without the trainee's written permission, and the Coast Guard and Navy boot camps say the same about recruits."],
    ],
    worried: "If you're worried someone might show up anyway, you can tell your instructors or a chaplain. That's what they're there for.",
    talkIntro: "If any of this is weighing on you, these are free and confidential:",
    talk: [
      { icon: "🕊️", name: "Chaplains", text: "Boot camps have chaplains you can ask to see. The Navy's boot camp says its chaplains offer confidential counseling and care to everyone, whatever their religion or none. What you tell a chaplain in counseling is privileged under military law (Military Rule of Evidence 503).", sources: [["https://www.bootcamp.navy.mil/Chaplain/", "Navy RTC: chaplains"], ["https://www.moody.af.mil/News/Article-Display/Article/668335/spiritual-doctors-support-airmen/", "Air Force: chaplains and privileged communication"]] },
      { icon: "💬", name: "Military and Family Life Counselors", text: "Free, confidential, non-medical counseling on or near bases for service members and families. It isn't reported to your command.", sources: [["https://www.militaryonesource.mil/benefits/military-family-life-counseling-program/", "Military OneSource: MFLC program"]] },
      { icon: "📞", name: "Military OneSource", text: "Free, confidential help by phone or chat, 24/7, for service members and their families.", sources: [["https://www.militaryonesource.mil/confidential-help/", "Military OneSource: confidential help"]] },
    ],
    privacySources: [
      ["https://www.justice.gov/opcl/privacy-act-1974", "Justice Department: the Privacy Act of 1974"],
      ["https://www.basictraining.af.mil/About-Us/Frequently-Asked-Questions/", "Air Force BMT: FAQ (trainee privacy)"],
      ["https://www.bootcamp.navy.mil/Graduation/", "Navy RTC: guest access list"],
      ["https://www.bootcamp.navy.mil/FAQ/", "Navy RTC: FAQ (Privacy Act)"],
      ["https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Training/RecruitTraining/", "TRACEN Cape May: FAQ (recruit privacy)"],
      ["https://www.mcrdpi.marines.mil/Visitors/Graduation/Morning-Colors-and-Graduation/", "MCRD Parris Island: graduation packets"],
    ],
  },

  // ---------------------------------------------------------------------------
  // For families attending.
  families: {
    bring: [
      "A physical, government-issued photo ID for every adult. Since May 7, 2025, most bases want a REAL ID-compliant license or a passport. (Fort Jackson doesn't currently require REAL ID for Family Day and graduation, but digital IDs aren't accepted there.)",
      "Your base pass or ticket, if the boot camp uses them: an Army visitor pass, Navy ticket or Air Force pass. These are tied to your name and can't be handed to someone else.",
      "If you're driving: license, registration and proof of insurance (or the rental agreement).",
      "Weather gear. Parris Island can be extremely hot and humid from April to September, and Fort Jackson warns that late-fall weather can swing from very cold to spring-like.",
      "Comfortable shoes. You'll walk from parking to most places.",
      "An official disability placard if you need close-in parking, and ask ahead about accessible seating. Air Force BMT, for example, has marked seating and a shuttle to the parade field.",
    ],
    dont: [
      "Weapons of any kind, alcohol, or drugs. Marijuana is illegal on federal bases even in states where it's legal, and vehicles are searched.",
      "Pets (trained service animals are allowed).",
      "Air horns and other noisemakers.",
      "Gifts the graduate can't carry. New graduates have to haul everything they own to their next school.",
    ],
    differs: [
      ["Signs and banners", "Not allowed at Fort Jackson or at Navy Pass In Review; welcome at Air Force BMT (bring your own way to hang them)."],
      ["Bags", "Navy: small bags only, no backpacks. Coast Guard: leave all bags in the car. Fort Jackson: bags are searched and there's a metal detector."],
      ["Getting in", "Navy: pick up your ticket off base first. Air Force: your pass comes from the trainee's guest list. Fort Jackson: apply for a visitor pass online. Coast Guard: don't arrive before 8:15 a.m."],
    ],
    early: [
      "Arrive early. Gates get backed up, security takes time, and seats fill fast. The Navy says arrive at least 1.5 hours before Pass In Review, and Parris Island suggests reaching the gate an hour before the ceremony.",
      "Follow the posted route. Fort Jackson asks visitors to follow the blue lines painted from the gates instead of GPS, so they don't end up in restricted areas.",
      "Confirm the date with your recruit. Training delays happen, and recruits are told to let families know if they won't graduate on time.",
      "Check the official page and social media the week of graduation. Times change and weather plans are posted there.",
    ],
    sources: [
      ["https://www.dhs.gov/real-id", "DHS: REAL ID (enforcement began May 7, 2025)"],
      ["https://home.army.mil/jackson/my-fort/visitor-information/family-day-and-graduation-visitors-guide", "Fort Jackson: visitor's guide"],
      ["https://www.bootcamp.navy.mil/Graduation/", "Navy RTC: graduation"],
      ["https://www.basictraining.af.mil/About-Us/Frequently-Asked-Questions/", "Air Force BMT: FAQ"],
      ["https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/Visitor-Services/Graduation/", "TRACEN Cape May: graduation info"],
      ["https://www.mcrdpi.marines.mil/About/", "MCRD Parris Island: FAQs"],
    ],
  },
};
