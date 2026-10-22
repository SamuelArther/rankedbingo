"use strict";

// Research for the discharges guide. Checked against official sources on the
// date in `checked`; each block notes where its facts came from. English only
// for now. In text, [[id|words]] links the words to glossary entry `id`.

window.F_DISCHARGE = {
  checked: "2026-10-21",

  // ---------------------------------------------------------------------------
  // The big picture.
  bigPicture: {
    intro: "Everyone who leaves the military gets a \"discharge\" (or release), and most enlisted discharges come with a rating of how you served, called the [[characterization|characterization of service]]. Finish your contract with a good record and you get an honorable discharge. Lower ratings come from rule-breaking or poor performance, and the very lowest only from a criminal trial.",
    paths: [
      {
        id: "admin",
        icon: "🗂️",
        title: "Administrative discharges",
        text: "Decided through the chain of command, a lot like being let go from a job. Not a criminal punishment.",
        items: ["Honorable", "General (Under Honorable Conditions)", "Other Than Honorable (OTH)"],
      },
      {
        id: "punitive",
        icon: "⚖️",
        title: "Punitive discharges",
        text: "Only a [[court-martial|court-martial]] (a military criminal trial) can give these, as part of a sentence after a conviction.",
        items: ["Bad Conduct Discharge (BCD)", "Dishonorable Discharge", "Dismissal (the officer version)"],
      },
      {
        id: "other",
        icon: "🧾",
        title: "No rating at all",
        text: "Some separations are \"uncharacterized,\" mainly an [[els|entry-level separation]] in your first year.",
        items: ["Entry-level separation (uncharacterized)"],
      },
    ],
    source: "https://www.law.cornell.edu/uscode/text/10/819",
  },

  // ---------------------------------------------------------------------------
  // Glossary.
  glossary: [
    {
      id: "ucmj",
      term: "UCMJ (Uniform Code of Military Justice)",
      text: "The federal law that works as the military's criminal code. It applies to everyone in uniform, on or off duty. It covers normal crimes (like theft or assault) plus military-only offenses, like disobeying a lawful order or being absent without permission.",
      source: "https://www.law.cornell.edu/uscode/text/10/subtitle-A/part-II/chapter-47",
    },
    {
      id: "court-martial",
      term: "Court-martial",
      text: "A military criminal trial for breaking the [[ucmj|UCMJ]]. A military judge runs it, and there are prosecutors and defense lawyers. The accused gets a military defense lawyer for free and can also hire a civilian one. A panel of service members (the military's version of a jury) may decide the case, or the judge alone. There are three kinds, from smallest to most serious:",
      courts: [
        {
          name: "Summary court-martial",
          who: "One officer. Only for enlisted members, usually for minor offenses, and the accused can refuse it (the case may then go to a higher court-martial).",
          max: "Up to 1 month of confinement, plus things like losing rank or part of a month's pay.",
          discharge: "Can't give any discharge.",
        },
        {
          name: "Special court-martial",
          who: "A military judge and a panel of 4 members, or a judge alone. Often compared to a misdemeanor court.",
          max: "Up to 1 year of confinement and losing up to two-thirds of pay for a year (less when it's a judge alone).",
          discharge: "Can give a Bad Conduct Discharge to enlisted members (not when tried by a judge alone). Can't give a dishonorable discharge or dismissal.",
        },
        {
          name: "General court-martial",
          who: "A military judge and a panel of 8 members (12 in a death-penalty case), or a judge alone if the accused asks. Often compared to a felony court.",
          max: "Any punishment the law allows for the crime, including long prison terms and, for a few of the worst crimes, death.",
          discharge: "Can give a Bad Conduct or Dishonorable Discharge, or a Dismissal for officers.",
        },
      ],
      source: "https://www.law.cornell.edu/uscode/text/10/816",
      sources: [
        ["https://www.law.cornell.edu/uscode/text/10/816", "10 U.S.C. § 816 (types of courts-martial)"],
        ["https://www.law.cornell.edu/uscode/text/10/818", "10 U.S.C. § 818 (general)"],
        ["https://www.law.cornell.edu/uscode/text/10/819", "10 U.S.C. § 819 (special)"],
        ["https://www.law.cornell.edu/uscode/text/10/820", "10 U.S.C. § 820 (summary)"],
      ],
    },
    {
      id: "njp",
      term: "Article 15 / nonjudicial punishment (NJP)",
      also: "Called \"Article 15\" in the Army, Air Force and Space Force, \"captain's mast\" or \"mast\" in the Navy and Coast Guard, and \"office hours\" in the Marine Corps.",
      text: "A way for a commander to punish minor offenses without a trial. It is not a court-martial and not a criminal conviction. Punishments are limited: things like extra duty, being restricted to certain areas for a while, losing rank, or losing some pay. You can usually turn it down and demand a court-martial instead (except when you're attached to or aboard a ship). NJP by itself doesn't discharge you, but several of them can add up to a \"pattern of misconduct.\"",
      source: "https://www.law.cornell.edu/uscode/text/10/815",
    },
    {
      id: "admin-sep",
      term: "Administrative separation",
      text: "Being removed from the military through paperwork and the chain of command instead of a trial. Your commander starts it in writing, says why and what the worst possible characterization is, and you have the right to talk to a military lawyer for free and to send in your own statements. It ends in an honorable, general or OTH discharge (or an uncharacterized one in your first year).",
      source: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf",
    },
    {
      id: "board",
      term: "Separation board (administrative board)",
      text: "A hearing in front of at least three people, who decide whether you should be separated and, if so, how your service should be characterized. You can have a lawyer and present evidence and witnesses. Enlisted members have the right to a board if they could get an OTH, or if they have 6 or more years of total service. Officers go to a similar \"board of inquiry.\" You can choose to waive (give up) a board, but talk to a lawyer before you do.",
      source: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf",
    },
    {
      id: "basis",
      term: "Separation basis (\"chapter\")",
      text: "The official reason you're being separated, like \"completion of required active service,\" \"unsatisfactory performance\" or \"misconduct.\" Soldiers often call it by the chapter of the Army regulation it comes from, like \"chapter 13\" (unsatisfactory performance) or \"chapter 14\" (misconduct). Each reason limits which characterizations are allowed.",
      source: "https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615",
    },
    {
      id: "characterization",
      term: "Characterization of service",
      text: "The official rating of how you served, based mostly on your conduct and performance during that enlistment. In order from best to worst: Honorable, General (Under Honorable Conditions), Other Than Honorable, Bad Conduct, Dishonorable. It's printed on your DD-214 and decides a lot of what benefits you get.",
      source: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf",
    },
    {
      id: "punitive",
      term: "Punitive discharge",
      text: "A discharge given as punishment by a court-martial: a Bad Conduct Discharge, a Dishonorable Discharge, or an officer's Dismissal. Because it's part of a court-martial sentence, it comes with a criminal conviction.",
      source: "https://www.law.cornell.edu/uscode/text/10/819",
    },
    {
      id: "dd214",
      term: "DD-214",
      text: "Your \"Certificate of Release or Discharge from Active Duty,\" the most important paper you get when you leave. It lists your service dates, training and awards, plus your characterization of service, the reason you were separated, a separation code and your RE code. Employers, the VA and states ask for it to prove you served. Keep copies somewhere safe.",
      source: "https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615",
    },
    {
      id: "re-code",
      term: "RE code (reentry code)",
      text: "A code on your DD-214 that says whether you can join the military again. In the Army, for example, RE-1 means you're qualified to come back, RE-3 means you'd need a waiver, and RE-4 means you can't reenlist. The codes are tied to why you left, and each branch uses its own set.",
      source: "https://boards.law.af.mil/ARMY/BCMR/CY2013/20130002682.txt",
    },
    {
      id: "awol",
      term: "AWOL / UA (unauthorized absence)",
      text: "Being away from where you're supposed to be without permission, even briefly, like missing formation or not coming back from leave. The Army and Air Force say AWOL (absent without leave); the Navy and Marines say UA. It's an offense under Article 86 of the UCMJ.",
      source: "https://www.law.cornell.edu/uscode/text/10/886",
    },
    {
      id: "desertion",
      term: "Desertion",
      text: "Leaving (or staying away) with the intent never to come back, or to get out of dangerous duty or important service. It's more serious than AWOL because of that intent, and is punished under Article 85 of the UCMJ.",
      source: "https://www.law.cornell.edu/uscode/text/10/885",
    },
    {
      id: "els",
      term: "Entry-level status",
      text: "Your first 365 days of continuous active duty (it was 180 days until December 2022). Reserve and Guard members have slightly different rules tied to their training. If you're separated during this time, your service is usually \"uncharacterized\" instead of rated.",
      source: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf",
    },
    {
      id: "cod",
      term: "VA character of discharge review",
      text: "The VA's own review to decide whether someone with an OTH or a Bad Conduct Discharge from a special court-martial can get VA benefits. It only affects VA benefits; it doesn't change your military discharge.",
      source: "https://www.benefits.va.gov/benefits/character_of_discharge.asp",
    },
    {
      id: "drb",
      term: "Discharge Review Board (DRB)",
      text: "A board each branch runs to review discharges and change them if they were wrong or unfair. You must apply within 15 years, and it can't review a discharge from a general court-martial.",
      source: "https://www.law.cornell.edu/uscode/text/10/1553",
    },
    {
      id: "bcmr",
      term: "Board for Correction of Military (or Naval) Records",
      text: "Each branch's highest board for fixing errors or injustices in military records, including discharges. It's the next step after a DRB or when the 15 years have passed. For court-martial discharges it can only act for clemency (mercy).",
      source: "https://www.law.cornell.edu/uscode/text/10/1552",
    },
  ],

  // ---------------------------------------------------------------------------
  // The ladder, best to worst. `tone` picks the color: ok, mid, warn, bad.
  ladder: [
    {
      id: "honorable",
      name: "Honorable",
      tone: "ok",
      kind: "admin",
      summary: "The standard you're aiming for. Your conduct and performance generally met the standards expected, or were so good that anything lower would be clearly wrong.",
      decidedBy: "Usually automatic when you finish your service. For an early separation, the commander who approves it (the \"separation authority\") sets it.",
      reasons: [
        ["Finishing your contract", "You served your time and leave at the end of your enlistment or service obligation. In the Army, this is honorable unless you're still in entry-level status."],
        ["Retirement", "Leaving after a full career (usually 20 or more years)."],
        ["Medical separation or retirement", "A medical board finds an illness or injury keeps you from doing your job. Your characterization still comes from your record, so a good record means honorable."],
        ["Hardship or family reasons", "A family emergency that can't be fixed any other way, or becoming a parent in a situation that conflicts with duty. Usually honorable or general."],
        ["Failing body-fat standards (Army)", "Not meeting body composition standards after the Army's program. In the Army this is characterized as honorable."],
        ["Early release for school", "Some branches let you out a little early to start college. Characterized as honorable or general."],
      ],
      dd214: "\"Honorable\" in the character of service box. You also get a discharge certificate (DD Form 256).",
      sources: [
        ["https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf", "DoD Instruction 1332.14 (enlisted separations)"],
        ["https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615", "Army Regulation 635-200 (June 2025)"],
      ],
    },
    {
      id: "general",
      name: "General (Under Honorable Conditions)",
      short: "General",
      tone: "mid",
      kind: "admin",
      summary: "Your service was honest and faithful, but problems in your record pulled it below honorable. It's still \"under honorable conditions\" and keeps most benefits, but not the Post-9/11 GI Bill.",
      decidedBy: "The separation authority (a senior commander) during an [[admin-sep|administrative separation]]. You get written notice and can talk to a lawyer and send in statements.",
      reasons: [
        ["Unsatisfactory performance", "You kept failing to do your job to standard even after being formally counseled and given a chance to improve. Characterized as honorable or general."],
        ["Failing fitness tests (Army)", "In the Army, failing two record fitness tests in a row leads to separation for unsatisfactory performance."],
        ["A pattern of minor misconduct", "Lots of small problems, like being late, disrespect or minor rule-breaking, usually after [[njp|NJPs]] and counseling. Misconduct separations are normally OTH, but a general can be given when your overall record earns it."],
        ["Failing a drug or alcohol program", "Not completing a rehab program you were sent to. In the Army this is honorable or general."],
        ["Some convenience-of-the-government reasons", "For example certain conditions that aren't a disability but get in the way of duty. Honorable or general."],
      ],
      dd214: "\"Under Honorable Conditions (General)\" in the character of service box.",
      sources: [
        ["https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf", "DoD Instruction 1332.14"],
        ["https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615", "Army Regulation 635-200 (June 2025)"],
      ],
    },
    {
      id: "oth",
      name: "Other Than Honorable (OTH)",
      short: "OTH",
      tone: "warn",
      kind: "admin",
      summary: "The lowest administrative discharge. It's for serious misconduct or a pattern of it. It isn't a criminal conviction, but it costs most veterans benefits unless the VA decides otherwise.",
      decidedBy: "A senior commander, and only after you've been offered a [[board|separation board]] (unless you asked for a discharge to avoid a court-martial).",
      reasons: [
        ["Drug use or possession", "Using, having or selling illegal drugs, including a positive urine test. In the Army, commanders must start separation for illegal drug users and anyone caught dealing. This includes marijuana, even where it's legal for civilians."],
        ["Commission of a serious offense", "Doing something serious enough that a court-martial could have given a punitive discharge for it, even if it's handled administratively instead."],
        ["A pattern of misconduct", "Repeated trouble with military or civilian authorities, or conduct that hurts good order and discipline, after being counseled."],
        ["Some AWOL cases", "Someone who comes back after being [[awol|AWOL]] or a [[desertion|deserter]] can be separated for a serious offense."],
        ["Discharge in lieu of court-martial", "Facing charges that could bring a punitive discharge, a member can ask to be discharged instead of going to trial. These are normally OTH."],
        ["Civilian conviction", "Being convicted of a serious crime off base, for example one with 6 months or more of jail time."],
        ["Two alcohol-related incidents or a second DUI (Army)", "In the Army, a second DUI/DWI conviction, or two serious alcohol-related incidents within a year, means separation must be started."],
      ],
      dd214: "\"Under Other Than Honorable Conditions\" in the character of service box.",
      sources: [
        ["https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf", "DoD Instruction 1332.14"],
        ["https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615", "Army Regulation 635-200 (June 2025)"],
        ["https://www.law.cornell.edu/uscode/text/10/912a", "UCMJ Article 112a (drugs)"],
      ],
    },
    {
      id: "bcd",
      name: "Bad Conduct Discharge (BCD)",
      short: "BCD",
      tone: "bad",
      kind: "punitive",
      summary: "A punishment from a court-martial for enlisted members, after being convicted of a crime. It comes from a special or general court-martial.",
      decidedBy: "A [[court-martial|special or general court-martial]] as part of the sentence. Never a commander alone.",
      reasons: [
        ["Serious crimes at a special court-martial", "Offenses like theft, assault or drug crimes that are tried at a special court-martial (roughly a misdemeanor-level court)."],
        ["Crimes at a general court-martial", "A general court-martial can give a BCD instead of a dishonorable discharge for serious crimes."],
        ["Long or repeated absences", "Long AWOL periods or desertion can be tried at court-martial instead of handled administratively."],
      ],
      dd214: "\"Bad Conduct\" in the character of service box.",
      sources: [
        ["https://www.law.cornell.edu/uscode/text/10/819", "10 U.S.C. § 819 (special courts-martial)"],
        ["https://www.law.cornell.edu/uscode/text/10/818", "10 U.S.C. § 818 (general courts-martial)"],
      ],
    },
    {
      id: "dishonorable",
      name: "Dishonorable Discharge",
      short: "Dis­honorable",
      tone: "bad",
      kind: "punitive",
      summary: "The most severe discharge, for the most serious crimes. Only a general court-martial can give it. For officers, the equivalent is a Dismissal.",
      decidedBy: "Only a [[court-martial|general court-martial]], as part of the sentence.",
      reasons: [
        ["The most serious crimes", "Felony-level offenses such as violent crimes, sexual assault, major drug trafficking or serious crimes against the military, tried at a general court-martial."],
        ["Officers: Dismissal", "Commissioned officers can't get a BCD or a dishonorable discharge. A general court-martial can sentence them to a Dismissal instead, which is treated like a dishonorable discharge."],
      ],
      dd214: "\"Dishonorable\" in the character of service box.",
      sources: [
        ["https://www.law.cornell.edu/uscode/text/10/818", "10 U.S.C. § 818 (general courts-martial)"],
        ["https://www.law.cornell.edu/uscode/text/10/819", "10 U.S.C. § 819 (special can't dismiss or dishonorably discharge)"],
      ],
    },
  ],

  // Separations that sit outside the ladder.
  offLadder: [
    {
      id: "els",
      icon: "🌱",
      title: "Entry-level separation (uncharacterized)",
      text: "If you're separated during [[els|entry-level status]] (your first 365 days of continuous active duty), your service is usually \"uncharacterized\": not good, not bad, just not rated. It isn't a punishment. Common reasons are not being able to adapt to military life, not being able to meet training standards, minor discipline problems, or a medical issue that existed before you joined.",
      points: [
        "It shows as \"Uncharacterized\" on the DD-214.",
        "For military paperwork that requires an honorable or general characterization, it's treated as the one required, unless a rule says otherwise. Benefits outside the military, like the GI Bill, follow their own rules.",
        "Serious misconduct can still get an OTH even in your first year.",
        "Whether you can try to join again later depends on your RE code and the branch.",
      ],
      sources: [
        ["https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf", "DoD Instruction 1332.14"],
        ["https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615", "Army Regulation 635-200 (June 2025)"],
      ],
    },
    {
      id: "medical",
      icon: "🩺",
      title: "Medical separation and retirement",
      text: "This isn't a separate characterization. It's a reason for leaving, and your characterization is still based on your record like anyone else's. A medical board decides whether an illness or injury makes you unfit for your job, and the military gives it a disability rating.",
      points: [
        "Rated 30% or more (and permanent): medical retirement, with retired pay and military health care.",
        "Rated under 30% with less than 20 years: separation with a one-time severance payment.",
        "The VA rates you separately for VA disability pay, which can be different from the military's rating.",
        "Conditions caused by your own misconduct aren't covered.",
      ],
      sources: [
        ["https://www.law.cornell.edu/uscode/text/10/1201", "10 U.S.C. § 1201 (disability retirement)"],
        ["https://www.law.cornell.edu/uscode/text/10/1203", "10 U.S.C. § 1203 (disability separation)"],
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // What you keep. Values: yes, case (case by case), no.
  benefits: {
    cols: [
      ["honorable", "Hon.", "Honorable"],
      ["general", "Gen.", "General (Under Honorable Conditions)"],
      ["oth", "OTH", "Other Than Honorable"],
      ["bcd-s", "BCD-S", "Bad Conduct Discharge from a special court-martial"],
      ["bcd-g", "BCD-G", "Bad Conduct Discharge from a general court-martial"],
      ["dishonorable", "DD", "Dishonorable Discharge (or an officer's Dismissal)"],
    ],
    rows: [
      {
        label: "VA health care and disability pay",
        cells: ["yes", "yes", "case", "case", "no", "no"],
        note: "Honorable and general count as \"other than dishonorable,\" so they qualify. For OTH and a BCD from a special court-martial, the VA does a character of discharge review case by case. A discharge by a general court-martial is a bar written into law.",
        source: "https://www.law.cornell.edu/uscode/text/38/5303",
      },
      {
        label: "Post-9/11 GI Bill (college money)",
        cells: ["yes", "no", "no", "no", "no", "no"],
        note: "The law requires an honorable discharge. A general discharge doesn't qualify.",
        source: "https://www.law.cornell.edu/uscode/text/38/3311",
      },
      {
        label: "VA home loan",
        cells: ["yes", "yes", "case", "case", "no", "no"],
        note: "With an OTH or bad conduct discharge, the VA reviews your record to decide if you qualify.",
        source: "https://www.va.gov/housing-assistance/home-loans/eligibility/",
      },
      {
        label: "Veterans' preference for federal jobs",
        cells: ["yes", "yes", "no", "no", "no", "no"],
        note: "The law requires leaving \"under honorable conditions,\" which means honorable or general.",
        source: "https://www.law.cornell.edu/uscode/text/5/2108",
      },
      {
        label: "Gun rights under the federal dishonorable-discharge rule",
        cells: ["yes", "yes", "yes", "yes", "yes", "no"],
        note: "Federal law bans gun possession by anyone \"discharged under dishonorable conditions,\" which ATF defines as a dishonorable discharge or dismissal from a general court-martial (not a BCD). Other federal and state gun laws, like those about criminal convictions, can still apply.",
        source: "https://www.law.cornell.edu/cfr/text/27/478.11",
      },
    ],
    extraTitle: "Even with an OTH",
    extra: "Without any VA review, people with an OTH can still get some VA care: emergency mental health care in a crisis, care for conditions from military sexual trauma, care for a service-connected disability, Vet Center counseling, and ongoing mental health care if they served 100+ days and in a combat theater. The VA encourages everyone to apply, whatever their discharge.",
    extraSource: "https://www.va.gov/resources/what-benefits-can-i-get-if-i-have-an-other-than-honorable-discharge/",
    afterTitle: "Other things a discharge can affect",
    after: [
      "Rejoining: depends on your RE code and the branch's enlistment rules. Lower characterizations usually make it much harder or impossible.",
      "Civilian jobs: employers can ask to see your DD-214. A BCD or dishonorable discharge also means a court-martial conviction, which can show up like other criminal records.",
      "State benefits: each state sets its own rules for things like tuition help, property-tax breaks or veteran license plates, and many look at your characterization. Ask your state's veterans affairs office.",
      "An earlier, separate period of honorable service can sometimes still count for benefits, even if a later one ended badly.",
    ],
    afterSources: [
      ["https://download.militaryonesource.mil/seco/Media/Default/MyStep/Factsheets/SPE07_UHDischarge_.pdf", "Military OneSource: leaving with a discharge other than honorable"],
    ],
    codUpdate: "In 2024 the VA updated its character of discharge rules (effective June 25, 2024), adding a \"compelling circumstances\" exception, for example for mental health conditions, combat hardship or sexual abuse, and invited people who were denied before to reapply.",
    codSource: "https://www.benefits.va.gov/benefits/character_of_discharge.asp",
  },

  // ---------------------------------------------------------------------------
  // How it's decided.
  decide: {
    admin: {
      title: "Administrative separation",
      steps: [
        "Usually the problem is written down first, and for poor performance or minor misconduct you must be formally counseled and given a chance to fix it.",
        "Your commander notifies you in writing: the reason, the regulation, and the worst characterization you could get.",
        "You can see the documents, talk to a military defense lawyer for free, and send in statements.",
        "If an OTH is possible, or you have 6+ years of service, you can ask for a [[board|separation board]] hearing.",
        "A senior commander (the separation authority) makes the final call, and can also decide to keep you.",
      ],
      source: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/133214p.pdf",
    },
    court: {
      title: "Court-martial",
      steps: [
        "Charges are filed for a crime under the [[ucmj|UCMJ]], and a commander sends the case to a summary, special or general court-martial.",
        "You get a free military defense lawyer and can also hire a civilian one.",
        "A military judge or a panel of members decides guilty or not guilty, then the sentence.",
        "Only a conviction can lead to a [[punitive|punitive discharge]], and only special and general courts-martial can give one.",
        "Convictions are reviewed and can be appealed to military appeals courts.",
      ],
      source: "https://www.law.cornell.edu/uscode/text/10/816",
    },
    officers: "Officers can be separated administratively too (honorable, general or OTH), usually after a board of inquiry, or can resign. At court-martial, an officer's punitive discharge is a Dismissal, which only a general court-martial can give.",
    officerSource: "https://www.law.cornell.edu/uscode/text/10/1182",
  },

  // ---------------------------------------------------------------------------
  // Paperwork.
  records: {
    points: [
      "Box 24 shows your character of service (honorable, general, uncharacterized and so on).",
      "Nearby boxes show the rule you were separated under, a separation code, your [[re-code|RE code]] and the narrative reason (for example \"completion of required active service\").",
      "Some copies leave the discharge boxes off, so make sure you keep the full copy that includes them.",
      "Lost it? Veterans can request a copy of their records from the National Archives.",
    ],
    source: "https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615",
    archivesSource: "https://www.archives.gov/veterans/military-service-records",
  },

  // ---------------------------------------------------------------------------
  // Upgrades.
  upgrades: {
    intro: "A discharge isn't always final. Each branch has boards that can upgrade a characterization or change the reason, RE code or separation code. Military discharges are presumed correct, so it's on you to show an error or an injustice, but many people succeed, especially with good evidence and help.",
    boards: [
      {
        name: "Discharge Review Board (DRB)",
        points: [
          "Apply within 15 years of your discharge (DD Form 293).",
          "Can review administrative discharges and special court-martial discharges, but court-martial ones only for clemency.",
          "Can't review a discharge from a general court-martial.",
          "You can ask for a records review or a personal hearing.",
        ],
        source: "https://www.law.cornell.edu/uscode/text/10/1553",
      },
      {
        name: "Board for Correction of Military/Naval Records (BCMR/BCNR)",
        points: [
          "For cases over 15 years old, after a DRB says no, or for other record errors (DD Form 149).",
          "The deadline is 3 years after you discover the error, but boards often waive it \"in the interest of justice.\"",
          "Can act on any discharge, but on court-martial sentences only for clemency.",
          "Can also fix things like evaluations or turn a separation into a medical retirement.",
        ],
        source: "https://www.law.cornell.edu/uscode/text/10/1552",
      },
    ],
    memosIntro: "Since 2014, the Department of Defense has told these boards to give \"liberal consideration\" when mental health conditions or trauma may have played a part in the misconduct behind a discharge. Congress also wrote it into law for PTSD and traumatic brain injury.",
    memos: [
      ["Hagel memo", "September 3, 2014", "Defense Secretary Chuck Hagel: liberal consideration for veterans with PTSD, especially from eras before it was widely recognized.", "https://www.veterans.nd.gov/news/hagel-issues-guidance-veterans-discharge-upgrade-requests"],
      ["Kurta memo", "August 25, 2017", "Extended it to mental health conditions, traumatic brain injury (TBI), sexual assault and sexual harassment, with four questions boards ask, starting with whether a condition or experience may excuse or lessen the misconduct. Having a condition doesn't guarantee an upgrade by itself.", "https://prhome.defense.gov/Portals/52/Images/milrevbds/images/documents/Kurta%20Memo_Clarifying-Guidance_08.25.2017.pdf"],
      ["Wilkie memo", "July 25, 2018", "Under Secretary Robert Wilkie: guidance on equity, injustice and clemency, so boards can weigh things like how long ago it was, how serious the misconduct was, and what the person has done since.", "https://boards.law.af.mil/ARMY/BCMR/CY2024/AR20240011737_Redacted.pdf"],
    ],
    lawNote: "10 U.S.C. § 1553(d) requires DRBs to review cases involving PTSD or TBI tied to combat or military sexual trauma with liberal consideration.",
    lawSource: "https://www.law.cornell.edu/uscode/text/10/1553",
    tool: "The official DoD and VA discharge upgrade tool on VA.gov asks a few questions and tells you which board to apply to and how.",
    toolUrl: "https://www.va.gov/discharge-upgrade-instructions/",
    help: [
      "Veterans service organizations (VSOs) with VA-accredited representatives help with VA claims for free.",
      "Many law school veterans clinics and legal aid groups help with discharge upgrades at no cost.",
      "While still in uniform, your base legal assistance office and military defense counsel are free.",
      "The VA's character of discharge review is a separate track you can ask for at the same time.",
    ],
    helpSource: "https://www.va.gov/resources/va-accredited-representative-faqs/",
  },

  // ---------------------------------------------------------------------------
  // Keeping an honorable.
  tips: [
    ["Stay away from illegal drugs", "Including marijuana, even in states where it's legal for civilians: it's still a crime under the UCMJ, and random drug tests are part of military life. In the Army, drug use requires commanders to start separation."],
    ["Never drink and drive", "A DUI hurts your career fast; in the Army, a second one means separation must be started."],
    ["Show up, on time", "Missing formation or not returning from leave is AWOL. If something at home is falling apart, tell your chain of command, a chaplain or Military OneSource, because there are emergency leave and hardship options."],
    ["Keep up with fitness and weight standards", "Repeated test failures can lead to separation even if you're great at your job."],
    ["Treat small stuff seriously", "A pile of minor NJPs and counselings can add up to a \"pattern of misconduct.\""],
    ["Ask for help early", "Asking for help with drinking or drugs on your own (self-referral) is treated differently than getting caught: in the Army, self-referral by itself doesn't require separation proceedings. Chaplains and mental health care are there for you too."],
    ["Know your rights", "If you're facing NJP, a separation or a court-martial, talk to a military defense lawyer first. It's free and confidential."],
  ],
  tipSources: [
    ["https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1028615", "Army Regulation 635-200 (June 2025)"],
    ["https://www.law.cornell.edu/uscode/text/10/912a", "UCMJ Article 112a"],
  ],

  // Crisis line shown with the OTH care note.
  crisis: "Veterans Crisis Line: dial 988 then press 1, or text 838255.",
};
