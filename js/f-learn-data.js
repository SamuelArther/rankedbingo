"use strict";

// Research for the Learn guides (head-to-head, benefits, contracts, MEPS,
// parents). Checked against official sources on the date in `checked`; each
// block notes where its facts came from. English only for now.

window.F_LEARN = {
  checked: "2026-10-21",

  // ---------------------------------------------------------------------------
  // Head-to-head extras. Boot camp, officer routes and fitness tests come from
  // DETAILS (data.js) and INFO (info-data.js); these fill in the rest.
  h2h: {
    sizeSource: "https://www.everycrsreport.com/reports/IN12651.html",
    sizeNote: "Authorized strength for September 30, 2026, from the FY2026 National Defense Authorization Act (Congressional Research Service summaries). The Coast Guard isn't in the defense bill, so its numbers are approximate.",
    branches: {
      army: {
        active: 454000, reserve: 172000, guard: 328000,
        components: ["active", "reserve", "guard"],
        enlist: "2 to 6 years, for active duty, the Army Reserve or the Army National Guard.",
        enlistSource: "https://www.goarmy.com/army-life/intro-to-army-life/time-commitment",
        deploy: "Whole units deploy or rotate overseas (for example to Europe, Korea or the Middle East), often for several months at a time. How often depends a lot on your job and unit.",
        suits: "People who want the widest choice of jobs and don't mind living in the field.",
      },
      usmc: {
        active: 172300, reserve: 33600, guard: null,
        components: ["active", "reserve"],
        enlist: "Usually 4 years. Some programs are 5, and shorter terms exist for a few programs.",
        enlistSource: "https://boards.law.af.mil/NAVY/BCNR/CY2026/NR20260005315_Redacted.pdf",
        deploy: "Units rotate overseas (Japan is a common one) and deploy aboard Navy amphibious ships, ready to respond fast to a crisis.",
        suits: "People who want the hardest challenge and a tight, tradition-heavy culture.",
      },
      navy: {
        active: 344600, reserve: 57500, guard: null,
        components: ["active", "reserve"],
        enlist: "Usually 4 years. Some programs, like the nuclear field, add an extension that makes it 6.",
        enlistSource: "https://boards.law.af.mil/NAVY/BCNR/CY2025/NR20250005765_Redacted.pdf",
        deploy: "Ships, submarines and squadrons deploy for months at a time on a planned cycle, with port visits abroad. Between deployments you train from your home port.",
        suits: "People who want to see the world from the sea and learn technical skills.",
      },
      af: {
        active: 321500, reserve: 67500, guard: 106300,
        components: ["active", "reserve", "guard"],
        enlist: "Usually 4 or 6 years, depending on the job.",
        enlistSource: "https://www.airforce.com/ways-to-serve",
        deploy: "Many Airmen deploy as individuals or small teams for a few months, often to established bases. Some jobs rarely deploy; others, like aircrew and security forces, go more often.",
        suits: "People who want technical training, aircraft or cyber work, and a good quality of life.",
      },
      sf: {
        active: 10400, reserve: null, guard: null,
        components: ["active"],
        componentNote: "The Space Force has no Reserve or Guard. A 2023 law lets Guardians move between full-time and part-time work, and the first part-time Guardians (former Air Force Reservists) started in July 2026.",
        componentSource: "https://www.spaceforce.mil/News/Article-Display/Article/4466904/space-force-selects-first-air-force-reservists-to-transfer-into-part-time-work/",
        enlist: "4 or 6 years. A 2026 pilot (July 1 to November 30) offers a limited number of 8-year contracts with a $25,000 bonus.",
        enlistSource: "https://www.airandspaceforces.com/space-force-25k-bonus-8-year-enlistments/",
        deploy: "Most Guardians do their mission from bases at home, running satellites and sensors remotely. Relatively few deploy, and usually in small numbers.",
        suits: "Tech- and space-minded people who'd rather work in an operations center than in the field.",
      },
      cg: {
        active: 40600, reserve: 7700, guard: null, approx: true,
        components: ["active", "reserve"],
        enlist: "Usually 4 years (enlistment bonuses require at least 4).",
        enlistSource: "https://media.defense.gov/2022/Aug/25/2003064647/-1/-1/0/CG_7220C.PDF",
        deploy: "Mostly at home: cutters patrol for weeks or months, and small boat and air stations answer calls in their area. A few units work overseas.",
        suits: "People who want to save lives and enforce the law on the water, closer to home.",
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Benefits.
  giTiers: [
    // [minimum months of active duty, percent]
    [36, 100], [30, 90], [24, 80], [18, 70], [6, 60], [3, 50],
  ],
  giTierSource: "https://www.va.gov/resources/how-we-determine-your-percentage-of-post-911-gi-bill-benefits/",
  giRates: {
    period: "August 1, 2026 to July 31, 2027",
    privateCap: 30908.34,
    books: 1000,
    onlineHousingCap: 1198,
    source: "https://www.va.gov/education/benefit-rates/post-9-11-gi-bill-rates/",
  },
  benefits: [
    {
      id: "pay", icon: "💵", title: "Pay and allowances",
      intro: "Military pay is the same in every branch for the same pay grade and years of service. Your paycheck has a few parts:",
      points: [
        "Basic pay: set by your pay grade (rank) and years of service, and taxed like a normal paycheck.",
        "Housing allowance (BAH): if you don't live in free base housing or barracks, you get money for rent based on where you're stationed, your pay grade and whether you have dependents. It isn't taxed.",
        "Food allowance (BAS): a monthly amount for meals. It isn't taxed either.",
        "Special pays and bonuses for certain jobs, skills, places and contracts.",
      ],
      link: ["#/pay", "See the ranks and pay table"],
      source: "https://militarypay.defense.gov/",
    },
    {
      id: "health", icon: "🩺", title: "Healthcare (TRICARE)",
      intro: "Active duty members must enroll in a TRICARE Prime plan and get their medical and dental care through the military health system, with no premiums or bills for covered care.",
      points: [
        "Families can enroll in TRICARE Prime with you or use TRICARE Select, among other options. Dependent adult children can buy TRICARE Young Adult.",
        "Active duty dental care happens at military dental clinics. Families can buy the TRICARE Dental Program.",
        "Guard and Reserve members get full TRICARE coverage while on orders for more than 30 days. The rest of the time they can buy TRICARE Reserve Select, a low-cost plan with monthly premiums.",
      ],
      source: "https://tricare.mil/Plans/Eligibility/ADSMandFamilies",
    },
    {
      id: "gibill", icon: "🎓", title: "Post-9/11 GI Bill",
      intro: "Money for college or job training, earned by serving on active duty. At the 100% level it covers:",
      points: [
        "Full in-state tuition and fees at public schools. At private or foreign schools it pays up to a yearly cap ($30,908.34 for August 2026 to July 2027).",
        "A monthly housing allowance based on the housing allowance for an E-5 with dependents where your school is (more than half-time students only; online-only students get a smaller amount).",
        "Up to $1,000 a year for books and supplies.",
        "Up to 36 months of benefits, about four nine-month school years. If your service ended on or after January 1, 2013, they never expire.",
        "You can start using it while still serving, once you have 90 days in.",
      ],
      note: "Less than 36 months of service gets a percentage of the full benefit. Try the estimate below.",
      source: "https://www.va.gov/education/about-gi-bill-benefits/post-9-11/",
    },
    {
      id: "transfer", icon: "👪", title: "Giving the GI Bill to family",
      intro: "You can transfer some or all of your 36 months to a spouse or children, but only while you're still serving:",
      points: [
        "You need at least 6 years of service and must agree to serve 4 more.",
        "You have to be on active duty or in the Selected Reserve when you ask, and the Defense Department approves it.",
        "Children can start using it after you've served 10 years, once they have a high school diploma or are 18, and before they turn 26.",
        "Spouses have no age limit.",
      ],
      source: "https://www.va.gov/education/transfer-post-9-11-gi-bill-benefits/",
    },
    {
      id: "ta", icon: "📚", title: "Tuition Assistance while serving",
      intro: "Separate from the GI Bill, each branch pays for college classes you take in your off-duty time while you're serving.",
      points: [
        "Typically up to $250 per semester hour, with a yearly cap set by each branch. The Air Force, for example, pays up to $4,500 per fiscal year.",
        "Using Tuition Assistance doesn't use up your GI Bill.",
        "Each branch has its own rules on approval, how many credits you can take a year, and what happens if you fail or drop a class.",
      ],
      source: "https://myairforcebenefits.us.af.mil/Benefit-Library/Federal-Benefits/Military-Tuition-Assistance-%28MilTA%29?serv=26",
    },
    {
      id: "home", icon: "🏠", title: "VA home loan",
      intro: "The VA backs home loans from private lenders, which usually means:",
      points: [
        "No down payment, as long as the price isn't above the appraised value.",
        "No private mortgage insurance.",
        "A one-time VA funding fee instead (some people, such as many with service-connected disabilities, don't pay it).",
        "Service members qualify after 90 continuous days of active duty. Veterans generally need 24 continuous months, or the full period they were called up for (at least 90 days).",
        "Guard and Reserve members qualify after 6 creditable years, or 90 days of non-training active duty.",
      ],
      source: "https://www.va.gov/housing-assistance/home-loans/eligibility/",
    },
    {
      id: "retire", icon: "📈", title: "Retirement (Blended Retirement System)",
      intro: "Everyone who joined after January 2018 is in the Blended Retirement System. It has two parts: a savings account you keep even if you leave early, and a pension if you stay 20 years.",
      points: [
        "Thrift Savings Plan (TSP): after 60 days of service the military puts 1% of your basic pay into your account, even if you put in nothing. That 1% is yours after 2 years.",
        "From the start of your third year, the military also matches what you put in, up to 4% more. Put in 5% and the military adds 5%.",
        "Those automatic and matching contributions continue through 26 years of service.",
        "Pension: serve 20 years and you get a monthly payment for life of 2% × your years of service × the average of your highest 36 months of basic pay. 20 years = 40%.",
        "Continuation pay: a one-time bonus between 7 and 12 years of service if you agree to serve longer.",
        "At retirement you can take part of the pension as a lump sum in exchange for smaller payments until age 67.",
      ],
      source: "https://www.militaryonesource.mil/resources/millife-guides/blended-retirement-system/",
    },
    {
      id: "life", icon: "🛡️", title: "Life insurance (SGLI)",
      intro: "Servicemembers' Group Life Insurance signs you up automatically through your branch.",
      points: [
        "Up to $500,000 of coverage, in $50,000 steps. You can choose less or decline it.",
        "It costs 5 cents per $1,000 of coverage a month: $25 a month for the full $500,000, plus $1 for traumatic injury protection (TSGLI).",
        "Guard and Reserve members are covered if they're assigned to a unit and scheduled for at least 12 drill periods a year.",
      ],
      source: "https://www.va.gov/life-insurance/options-eligibility/sgli/",
    },
    {
      id: "leave", icon: "🏖️", title: "Leave (paid vacation)",
      intro: "You earn 2.5 days of paid leave every month: 30 days a year.",
      points: [
        "When you can take it depends on your unit's schedule, and boot camp and deployments limit it.",
        "Unused leave carries over to the next year, up to a limit.",
        "Weekends and federal holidays are usually off when you're not on duty or in the field.",
      ],
      source: "https://www.gocoastguard.com/faq",
    },
    {
      id: "shop", icon: "🛒", title: "Commissary and exchange",
      intro: "On-base stores help your paycheck go further.",
      points: [
        "Commissaries are grocery stores that sell at cost plus a 5% surcharge. The Defense Commissary Agency estimates savings of 25% or more compared with regular stores.",
        "Exchanges are on-base department stores, gas stations and food courts, with no sales tax.",
        "Active duty, Guard and Reserve members and their families with military ID can shop at both.",
      ],
      source: "https://myairforcebenefits.us.af.mil/Benefit-Library/Federal-Benefits/Defense-Commissary-Agency-(DeCA)?serv=25",
    },
  ],
  guardReserve: {
    title: "Guard and Reserve: what's different",
    points: [
      "Pay: you're paid for each drill period and for annual training, not a full-time salary, unless you're activated.",
      "Healthcare: full TRICARE only while on orders for more than 30 days; otherwise you can buy TRICARE Reserve Select.",
      "GI Bill: drill weekends don't count toward the Post-9/11 GI Bill, and neither does Guard or Reserve initial training. Active duty orders (like deployments) do. A 6-year Selected Reserve contract can qualify you for the Montgomery GI Bill-Selected Reserve, and many states offer their own tuition help for Guard members.",
      "Retirement: you earn points for drills and active duty, and 20 qualifying years (at least 50 points each) earn a pension that usually starts at age 60.",
      "Home loan: 6 creditable years, or 90 days of non-training active duty.",
      "Life insurance, Tuition Assistance and commissary shopping work much like they do for active duty.",
    ],
    source: "https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/",
  },

  // ---------------------------------------------------------------------------
  // Contracts.
  contracts: {
    msoSource: "https://www.goarmy.com/army-life/intro-to-army-life/time-commitment",
    terms: [
      ["army", "2 to 6 years (active, Reserve or Guard)."],
      ["usmc", "Usually 4 years; some programs 5."],
      ["navy", "Usually 4 years; some programs, like the nuclear field, add an extension to 6."],
      ["af", "Usually 4 or 6 years."],
      ["sf", "4 or 6 years; a 2026 pilot offers some 8-year contracts with a bonus."],
      ["cg", "Usually 4 years."],
    ],
    reserveTerms: "Guard and Reserve contracts also add up to 8 years. A common split is 6 years of drilling plus 2 in the IRR, which also qualifies you for the Montgomery GI Bill-Selected Reserve, but other splits exist.",
    guarantees: [
      ["army", "Your job (MOS) is written into the contract. Options can add things like a first duty station, Airborne training, a bonus or student loan repayment."],
      ["usmc", "Contracts often guarantee a program or occupational field (a group of related jobs) rather than one exact job, and the specific MOS is assigned during training. Ask exactly what yours guarantees."],
      ["navy", "You can enlist with a guaranteed rating (job) and \"A\" School, or enlist without one and pick a rating later from what's open."],
      ["af", "You can lock in a guaranteed job before you ship. If you enlist without one, your job is assigned later from the preferences you list. Air Force enlistment bonuses are earned after training and need a 6-year contract."],
      ["sf", "Guardians enlist for a specific career field. It's a small branch with few openings, so ask how firm your job is before you sign."],
      ["cg", "Most recruits go to a unit after boot camp and apply for \"A\" School (job training) later. Some contracts guarantee an \"A\" School, often with a bonus."],
    ],
    mso: {
      id: "mso", icon: "🗓️", title: "The 8-year rule",
      intro: "Everyone who enlists for the first time signs up for 8 years in total. This is called the Military Service Obligation (MSO). Your contract sets how much of that you spend serving (full-time on active duty, or drilling part-time in the Guard or Reserve). The rest is spent in the Individual Ready Reserve (IRR).",
      points: [
        "A \"4+4\" contract means 4 years of active duty, then 4 years in the IRR.",
        "In the IRR you don't train, drill or get paid. You keep your contact information up to date and can be called back only in a rare, extreme emergency.",
        "Time in the Delayed Entry Program counts toward the 8 years, but not toward pay or time in service.",
      ],
      source: "https://www.goarmy.com/army-life/intro-to-army-life/time-commitment",
    },
    sections: [
      {
        id: "bonus", icon: "💰", title: "Enlistment bonuses",
        intro: "Bonuses help fill hard-to-fill jobs, reward longer contracts, or get people to ship quickly. Amounts change often, sometimes month to month.",
        points: [
          "The bonus amount and its conditions are written in a bonus annex or addendum to your contract. If it isn't there, you won't get it.",
          "Most enlistment bonuses are paid after you finish training, such as job school. Some are paid all at once, others in installments.",
          "Bonuses count as taxable income (except when earned in a combat zone).",
          "Recoupment: if you don't finish the service you agreed to, for example if you're discharged early for misconduct or for failing to meet standards, you can be required to pay back the part you didn't earn.",
        ],
        source: "https://www.govinfo.gov/link/uscode/37/373",
      },
      {
        id: "dep", icon: "⏳", title: "The Delayed Entry Program",
        intro: "Most recruits don't ship the day they enlist. They join the Delayed Entry Program (the Army calls it the Future Soldier Program; Marines in it are called poolees) and ship later, up to 365 days after enlisting.",
        points: [
          "While you wait you're in the inactive reserve: unpaid, with no duties except staying ready.",
          "Recruiters usually hold meetings and workouts to get you ready for boot camp. Going to them helps.",
          "Many high school seniors enlist during the school year and ship after graduation.",
          "On ship day you return to MEPS for a quick check, swear in again, and travel to boot camp.",
        ],
        source: "https://www.govinfo.gov/link/uscode/10/513",
      },
      {
        id: "cant", icon: "🚫", title: "What a recruiter can't promise",
        intro: "Recruiters can be a big help, but only what's in your signed contract counts. Be careful with promises like these:",
        points: [
          "A specific base, or that you'll never be sent overseas (unless a duty station option is written into your contract).",
          "That you'll never deploy or never see combat.",
          "That you can easily switch jobs later.",
          "That a medical or legal waiver will definitely be approved.",
          "How fast you'll be promoted.",
          "That you can just quit if you don't like it. After you ship, leaving early is hard and can follow you for years.",
        ],
        note: "If anyone suggests leaving a medical issue or past trouble off your forms, don't. Hiding it can get you discharged later for fraudulent enlistment.",
      },
      {
        id: "backout", icon: "↩️", title: "Changing your mind before you ship",
        intro: "Until you ship, you can still back out. It happens, and there's a routine process for it.",
        points: [
          "Tell your recruiter, and also send a written request for separation from the Delayed Entry Program to the recruiting command above them.",
          "A DEP separation is an entry-level separation, not a bad discharge.",
          "People who leave DEP are separated with no penalty, and Army rules bar recruiters from pressuring them or blocking a separation request. No one has been forced onto active duty from DEP in decades.",
          "You give up anything tied to the contract, like a reserved job, ship date or bonus.",
          "Once you ship and swear in on active duty, it's a different story: getting out early is much harder.",
        ],
        source: "https://en.wikipedia.org/wiki/Delayed_Entry_Program",
      },
    ],
    writing: [
      "Your job, rating or program, and whether it's guaranteed",
      "Contract length: years serving, and years in the IRR",
      "Your ship date",
      "Any bonus: the amount, when it's paid and the conditions",
      "Your starting rank (some people start higher thanks to college credits or JROTC)",
      "Student loan repayment or a college fund, if offered",
      "Special training you were promised, like Airborne or a specific school",
      "A first duty station option, if offered",
    ],
  },

  // ---------------------------------------------------------------------------
  // MEPS day. Official sources: the Army's MEPS page and USMEPCOM's applicant
  // lodging rules (mepcom.army.mil).
  meps: {
    source: "https://www.goarmy.com/how-to-join/steps/processing-station.html",
    lodgingSource: "https://www.mepcom.army.mil/Portals/112/Recruiter-to-Applicant-Pre-Arrival-Fact-Sheet.pdf",
    steps: [
      {
        time: "Night before", title: "Hotel check-in",
        text: "If you live far from the MEPS, you stay the night at a hotel the government pays for, with dinner, breakfast and a shuttle to the MEPS. You usually share a room with another applicant of the same gender.",
        tips: ["Bring photo ID: you need it to check in and out.", "Extras like pay-per-view or room damage are on you, and unpaid charges can hold up processing.", "Behave: the hotel can send disruptive guests home.", "Shower and get to bed early."],
      },
      {
        time: "Very early", title: "Wake-up and briefing",
        text: "Expect a wake-up call well before sunrise, breakfast, and a shuttle to the MEPS. Inside, you go through a security check and get a briefing on the day's schedule.",
        tips: ["It's a long day with lots of waiting. Stay patient and polite."],
      },
      {
        time: "Morning", title: "Paperwork and medical history",
        text: "You check in, show your documents and fill out forms, including a detailed medical history questionnaire.",
        tips: ["Answer every question honestly. Hiding medical history can delay you, get you disqualified, or lead to fraudulent enlistment charges later."],
      },
      {
        time: "If needed", title: "ASVAB",
        text: "If you haven't already taken the ASVAB at school or a testing site, you take it here on a computer. Your scores decide which jobs you qualify for.",
        tips: ["Practice first: the ASVAB practice page on this site is a good start."],
        link: ["#/asvab", "Try ASVAB practice"],
      },
      {
        time: "Most of the day", title: "Medical exam",
        text: "The exam covers your height, weight and waist-to-height ratio, hearing, vision, blood and urine tests, and a drug and alcohol test. Women take a pregnancy test in a private room with a female attendant. You also do simple movements that check your balance and joints, and talk with a doctor.",
        tips: ["Bring glasses or contacts with the case and prescription.", "Bring any medical records your recruiter asked for.", "A MEPS physical is good for 2 years."],
      },
      {
        time: "Afternoon", title: "Background interview and fingerprints",
        text: "You're fingerprinted for a background check and go through a pre-enlistment interview about things like past drug use and any legal trouble.",
        tips: ["Tell the truth here too. Many issues can be waived; lying can't be."],
      },
      {
        time: "Afternoon", title: "Picking your job",
        text: "You meet with your branch's counselor to choose a job and ship date from what's open and what your ASVAB scores and medical results qualify you for. Then you sign your contract.",
        tips: ["Read the contract and every annex before you sign. Anything you were promised should be in writing.", "You don't have to take the first job offered if you'd rather wait for a better fit."],
        link: ["#/contracts", "Read: contracts explained"],
      },
      {
        time: "End of the day", title: "Oath of Enlistment",
        text: "A commissioned officer leads you in the Oath of Enlistment and signs your contract. Family and guests can usually watch and take photos.",
        tips: ["Most people enter the Delayed Entry Program here and swear in again on their ship day."],
      },
      {
        time: "After MEPS", title: "Delayed Entry and ship day",
        text: "Most new recruits go home in the Delayed Entry Program (the Army calls it the Future Soldier Program) and train with their recruiter until they ship, up to a year later. On ship day you come back to MEPS for a shorter check and a second oath, then travel to boot camp.",
        tips: ["Use the wait to get in shape and keep out of trouble.", "Report any new medical issue or legal trouble to your recruiter."],
      },
    ],
    bring: ["Driver's license or other photo ID", "Social Security card", "Birth certificate", "Medical records your recruiter asks for", "Glasses or contacts, with the case and prescription", "Anything else your recruiter tells you to bring"],
    leave: ["Valuables and lots of cash", "Weapons of any kind", "Piercings (take them all out)", "Hats"],
    dress: ["Comfortable, presentable clothes", "Clean underwear (you'll be in it for part of the exam)", "No offensive words or pictures on clothing", "Real shoes: the lodging rules don't allow sandals or shower shoes"],
    dont: ["Don't use drugs or drink before MEPS: you'll be tested.", "Don't hide medical history or past legal trouble.", "Don't skip your shower the night before.", "Don't show up without your documents."],
    disqualify: ["Illegal drug use or a positive drug test", "Alcohol dependence", "Not meeting the body composition (waist-to-height) standard", "Certain medical conditions and contagious diseases", "Some criminal history"],
    disqualifyNote: "Many conditions can be waived case by case, and some people can join a prep course to meet body standards. Waivers aren't guaranteed and depend on each branch's needs.",
  },

  // ---------------------------------------------------------------------------
  // Parents and families.
  parents: [
    {
      q: "Is it safe? Will they be deployed?",
      a: [
        "Military service has real risks, and it would be dishonest to say otherwise. But the risk varies a lot by branch and job. Many service members work in logistics, medicine, maintenance, IT or administration and never see combat, while infantry and some special jobs face much more danger.",
        "Most units deploy at some point. How often, for how long and where depends on the branch, the job and world events. Training accidents are a risk too, which is why safety rules are taken seriously.",
        "Ask the recruiter what deployments usually look like for the exact job your child is considering.",
      ],
      link: ["#/head-to-head", "Compare branches side by side"],
    },
    {
      q: "What is boot camp like?",
      a: [
        "Boot camp lasts about 7.5 to 13 weeks, depending on the branch. It's stressful on purpose: early mornings, loud instructors, little free time, and lots of physical training, drill, classes and teamwork.",
        "It's also closely supervised, with medical staff on hand and strict rules on how instructors treat recruits. Almost everyone is homesick at first, and that's normal.",
      ],
      bootcamps: true,
      link: ["#/training", "Boot camp & training by branch"],
    },
    {
      q: "How can we stay in touch during boot camp?",
      a: [
        "Phones are collected when recruits arrive (the Navy, for example, gives them back the day before graduation), so letters are the main way to stay in touch. Recruits usually mail home their address within the first week or two.",
        "Write often: letters mean a lot. Keep them upbeat, and check the boot camp's rules before sending packages.",
        "In a real emergency, like a death or serious illness in the family, contact the American Red Cross, which relays emergency messages to service members.",
        "Families are welcome at graduation. Each boot camp posts its graduation schedule and visitor rules online.",
      ],
      link: ["#/graduation", "Graduation & family day, branch by branch"],
      sources: [["https://www.bootcamp.navy.mil/FAQ/", "Navy boot camp FAQ"], ["https://www.redcross.org/get-help/military-families/emergency-communication.html", "Red Cross emergency messages"]],
    },
    {
      q: "Will it help pay for college?",
      a: [
        "Yes, it's one of the biggest benefits. Tuition Assistance pays for classes while serving, and the Post-9/11 GI Bill can cover public in-state tuition, housing and books after 36 months of active duty (less service gets a percentage).",
        "After 6 years of service, members can transfer GI Bill months to a spouse or children if they agree to serve 4 more.",
        "Many states give Guard members their own tuition help. Future officers can get college paid for up front through ROTC scholarships or the service academies.",
      ],
      link: ["#/benefits", "Benefits in plain English"],
    },
    {
      q: "How long is the commitment?",
      a: [
        "Every first enlistment is an 8-year commitment in total. Usually 2 to 6 of those years are spent serving (full-time, or part-time in the Guard or Reserve), and the rest in the Individual Ready Reserve, with no training or pay but a rare chance of being called back.",
      ],
      link: ["#/contracts", "Enlistment contracts explained"],
    },
    {
      q: "How should we talk to a recruiter together?",
      points: [
        "Go together. Recruiters are used to meeting parents, and a 17-year-old needs a parent's or guardian's written consent to enlist.",
        "Bring questions: the job, contract length, ship date, bonuses, what training looks like, and how often that job deploys.",
        "Talk to more than one branch. Each recruiter represents only their own.",
        "Ask to see the actual contract and annexes, not just a summary, and take time to think before signing.",
      ],
    },
    {
      q: "What should we watch out for?",
      points: [
        "Pressure to sign right away. A good decision can wait a few days.",
        "Promises that aren't in the written contract.",
        "Being told to leave a medical condition or past trouble off the forms. Honesty protects your child.",
        "Bonus conditions: when it's paid, and that it can be taken back if the contract isn't finished.",
        "Picking a job only for the bonus. Liking the work matters more over 4 to 6 years.",
      ],
    },
    {
      q: "Are there part-time options?",
      a: [
        "Yes. The Army and Air National Guard, and the Reserves of the Army, Marine Corps, Navy, Air Force and Coast Guard, serve part-time: usually one weekend a month and about two weeks a year. Members go through the same boot camp and job training, then return home to school or a civilian job. The Space Force is just starting part-time service.",
        "Part-time members can still be called up for deployments, and Guard members can also be called up by their governor for disasters in their state.",
      ],
      link: ["#/types", "Active, Reserve and Guard explained"],
    },
    {
      q: "What if they change their mind?",
      a: [
        "Before shipping to boot camp, they can ask in writing to leave the Delayed Entry Program. It's an entry-level separation, not a bad discharge. After shipping, leaving early is much harder.",
      ],
      link: ["#/contracts", "How backing out works"],
    },
    {
      q: "Where can our family get support?",
      points: [
        "Military OneSource: free, confidential help 24/7 at 800-342-9647 or militaryonesource.mil, for service members and their families (check the site for who's eligible). It covers counseling, money questions, moving and deployment.",
        "Once your child joins a unit, it will have a family readiness program (the name varies by branch) that shares news and support.",
        "Online parent groups can be comforting, but trust the official boot camp and branch pages for rules and dates.",
      ],
      sources: [["https://www.militaryonesource.mil/", "Military OneSource"]],
    },
  ],
};
