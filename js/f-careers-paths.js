"use strict";
// Routes to becoming a U.S. military officer, by branch. Facts checked against official sources, October 2026.
window.F_CAREERS_PATHS = {
  "checked": "October 2026",
  "routes": [
    {
      "id": "academy",
      "name": "Service academy",
      "summary": "A free four-year college where you earn a bachelor's degree while training full time as a future officer. You graduate and commission on the same day.",
      "who": "High school students (or young enlisted members) with strong grades, fitness, and leadership who want the full military college experience.",
      "requires": ["Usually age 17 to 22 when you enter", "U.S. citizen, unmarried, no dependents", "Nomination from Congress or another source (not needed for the Coast Guard Academy)", "Medical exam and fitness test"],
      "timeline": "Apply in your junior-to-senior year of high school (deadlines are usually in the winter of senior year); commission about four years after you start.",
      "commitment": "Usually at least 5 years on active duty, inside an 8-year total obligation. Pilots owe more.",
      "pros": ["Tuition, room, and board are paid, plus a monthly stipend", "Very strong network and reputation", "Military training built into every day"],
      "cons": ["Very competitive admissions", "Strict lifestyle with little free time", "Longest standard commitment"],
      "sources": ["https://www.westpoint.edu/admissions/steps-admission/admissions-requirements", "https://www.usna.edu/Admissions/Apply/index.php", "https://www.usafa.edu/admissions/commitment/requirements/", "https://uscga.edu/admissions/admission-requirements/"]
    },
    {
      "id": "rotc",
      "name": "ROTC (Reserve Officers' Training Corps)",
      "summary": "You attend a regular college and take military classes, physical training, and summer training on the side. You commission when you graduate.",
      "who": "High school seniors and college students who want a normal college life plus a path to becoming an officer.",
      "requires": ["Enrolled at a college with an ROTC unit (or a nearby partner school)", "Meet fitness, medical, and academic standards", "Finish your bachelor's degree"],
      "timeline": "Apply for a four-year scholarship during junior or senior year of high school, or join once you are in college; commission at graduation, usually after 4 years.",
      "commitment": "Scholarship students usually owe about 4 years on active duty (5 for Navy option), inside an 8-year total. Joining a class without a scholarship does not obligate you at first.",
      "pros": ["Scholarships can cover full tuition plus a monthly stipend", "Choose your own college and major", "Try it before you commit"],
      "cons": ["Balancing military training with a full class load", "Scholarships are competitive", "Branch or job is not guaranteed"],
      "sources": ["https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc", "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Four-Year-National-Scholarship/", "https://www.afrotc.com/scholarships/high-school/requirements/"]
    },
    {
      "id": "ocs",
      "name": "Officer Candidate School (OCS) / Officer Training School (OTS)",
      "summary": "A short, intense course (about 8 to 13 weeks) that turns college graduates into officers. Each branch runs its own version.",
      "who": "College graduates, career changers, and enlisted members who already have (or are about to finish) a bachelor's degree.",
      "requires": ["Bachelor's degree by commissioning", "Pass an entrance test and a selection board", "Meet age, medical, and fitness standards"],
      "timeline": "Apply during senior year of college or after graduating; selection can take several months, then the course itself is about 2 to 3 months.",
      "commitment": "Usually about 3 to 4 years on active duty, longer for pilots and some specialties.",
      "pros": ["Fastest way to commission if you already have a degree", "Open to older applicants than academies or ROTC", "Lets you finish college on your own terms first"],
      "cons": ["No college paid for by the military", "Short but very demanding course", "Limited spots in some years and jobs"],
      "sources": ["https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/ocs", "https://www.navy.com/joining/ways-to-join/officer/officer-candidate-school", "https://www.airforce.com/training/military-training/ots", "https://www.gocoastguard.com/get-started/officer-applications/officer-candidate-school-ocs"]
    },
    {
      "id": "direct",
      "name": "Direct commission",
      "summary": "Professionals such as doctors, nurses, lawyers, chaplains, engineers, and cyber experts join directly as officers, sometimes above the entry rank, and take a short officer course.",
      "who": "People who already have a professional degree, license, or valuable technical experience.",
      "requires": ["Bachelor's degree, and usually a professional degree or license", "Relevant work experience for some fields", "Meet age, medical, and fitness standards"],
      "timeline": "Apply once you are qualified in your field; the process can take up to a year, then a 5- to 6-week officer course followed by job training.",
      "commitment": "Varies by field, often about 3 to 4 years on active duty; reserve options exist.",
      "pros": ["You may start at a higher rank", "Uses the skills you already have", "Short initial military training"],
      "cons": ["Only open to certain professions", "Fewer openings in some fields", "Must meet the same military standards as everyone else"],
      "sources": ["https://www.army.mil/dcp", "https://www.navy.com/joining/ways-to-join/officer/officer-development-school", "https://www.gocoastguard.com/get-started/officer-applications/direct-commission-officer-programs"]
    },
    {
      "id": "warrant",
      "name": "Warrant officer",
      "summary": "Warrant officers are technical experts who rank between enlisted members and commissioned officers. Most are picked from experienced enlisted members.",
      "who": "Enlisted members who are experts in their field, plus (in the Army) some aviation and cyber applicants with no prior service.",
      "requires": ["Usually several years of enlisted experience and a mid-level enlisted rank", "Strong record and recommendations", "No bachelor's degree is required in most cases"],
      "timeline": "Usually applied for after several years of enlisted service; the candidate course itself is about 5 to 16 weeks depending on the branch.",
      "commitment": "Varies by branch and job; Army technical warrant officers owe 6 years and Army aviators owe 10 years after flight school.",
      "pros": ["Stay hands-on in your specialty instead of becoming a general manager", "Big pay raise over enlisted ranks", "Highly respected experts"],
      "cons": ["Most branches require years of enlisted service first", "Fewer jobs available than for commissioned officers", "Space Force has no warrant officers"],
      "sources": ["https://www.goarmy.com/careers-and-jobs/find-your-path/warrant-officers", "https://www.mynavyhr.navy.mil/Career-Management/Community-Management/Officer/Active-OCM/LDO-CWO/Applicant-Information/", "https://www.af.mil/News/Article-Display/Article/3987738/first-air-force-warrant-officers-graduate-prepare-to-enter-force/"]
    }
  ],
  "branches": {
    "army": {
      "academy": {
        "name": "U.S. Military Academy (West Point)",
        "text": "Four-year college in West Point, New York. Applicants are usually 17 to 22 on July 1 of the year they enter and need a nomination. Graduates owe 5 years on active duty plus 3 in the reserves.",
        "url": "https://www.westpoint.edu/admissions/steps-admission/admissions-requirements"
      },
      "rotc": {
        "name": "Army ROTC",
        "text": "Offered at more than 1,000 colleges. Scholarships can cover full tuition plus money for books and living costs. A four-year scholarship usually means 4 years of full-time service and 4 more in the reserves, or 8 years part-time in the Guard or Reserve.",
        "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc"
      },
      "ocs": {
        "name": "Officer Candidate School (OCS)",
        "text": "A 12-week course at Fort Benning, Georgia. Applicants are usually 19 to 32, need a bachelor's degree by commissioning, and civilians do Basic Combat Training first. Graduates usually owe 3 years on active duty. The National Guard also runs its own state OCS programs.",
        "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/ocs"
      },
      "direct": {
        "name": "Direct commission",
        "text": "Open to medical professionals, lawyers (JAG), chaplains, and experts in fields like cyber, engineering, and intelligence. Most start with the 6-week Direct Commission Course at Fort Benning, then go to their job's officer course.",
        "url": "https://www.army.mil/dcp"
      },
      "warrant": {
        "name": "Warrant Officer Candidate School",
        "text": "A 5-week course at Fort Rucker, Alabama, followed by job training. Most applicants must be sergeants (E-5) or higher, but aviation and cyber warrant officers can join with no prior service, often called the High School to Flight School route. Aviators owe 10 years after flight school.",
        "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/warrant-officers"
      },
      "after": "New lieutenants go to the Basic Officer Leader Course (BOLC) for their branch, such as infantry, engineers, or signal, which lasts a few months depending on the job.",
      "sources": ["https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers", "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/ocs", "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc", "https://www.goarmy.com/careers-and-jobs/find-your-path/warrant-officers", "https://www.army.mil/dcp", "https://www.benning.army.mil/infantry/199th/DCC/", "https://www.westpoint.edu/admissions/steps-admission/admissions-requirements"]
    },
    "usmc": {
      "academy": {
        "name": "U.S. Naval Academy (Annapolis)",
        "text": "The Marine Corps does not have its own academy. Naval Academy midshipmen in Annapolis, Maryland, can choose to commission as Marine officers when they graduate.",
        "url": "https://www.usna.edu/Admissions/Apply/index.php"
      },
      "rotc": {
        "name": "NROTC (Marine option)",
        "text": "Navy ROTC students can choose the Marine option, attend OCS before senior year, and commission at graduation. Applicants must be at least 17 and under 27 by the end of the year they commission. Scholarship Marine-option students owe at least 4 years on active duty.",
        "url": "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Marine-Corps-Scholarships/"
      },
      "ocs": {
        "name": "Officer Candidates School (OCS), including PLC",
        "text": "Held at Quantico, Virginia. College graduates take the 10-week Officer Candidate Course; college students can join the Platoon Leaders Class (PLC) and train in summer sessions (two 6-week sessions, or one 10-week session) with no classes missed. Officers are usually 20 to 28 at commissioning, with waivers possible.",
        "url": "https://www.marines.com/become/marine-officer.html"
      },
      "direct": {
        "name": "Lawyers and other specialists",
        "text": "Marine lawyers become officers through OCS like everyone else, then go to law training after The Basic School. Doctors, nurses, and chaplains who serve with Marines are Navy officers, not Marines.",
        "url": "https://www.marines.com/become/marine-officer/requirements.html"
      },
      "warrant": {
        "name": "Enlisted to warrant officer",
        "text": "Open to enlisted Marines who are at least sergeants with at least 8 years of service. Selected Marines attend the Warrant Officer Basic Course at The Basic School in Quantico.",
        "url": "https://www.marines.mil/News/Messages/Messages-Display/Article/4418017/fiscal-year-2027-fy27-enlisted-to-warrant-officer-wo-reserve-selection-board/"
      },
      "after": "Every new Marine officer attends The Basic School (TBS) at Quantico for about six months, then goes to training for their job. Aviators owe about 8 years after earning their wings.",
      "sources": ["https://www.marines.com/become/marine-officer.html", "https://www.marines.com/become/marine-officer/requirements.html", "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Marine-Corps-Scholarships/", "https://www.mcrc.marines.mil/Portals/95/Officer%20Selection/Service%20Agreement%20-%20MCRC%20Forms/Service%20Agreement%20OCC%20SNA_11-22.pdf"]
    },
    "navy": {
      "academy": {
        "name": "U.S. Naval Academy (Annapolis)",
        "text": "Four-year college in Annapolis, Maryland. Applicants must be at least 17 and not past their 23rd birthday on July 1 of the year they enter, unmarried, and nominated. Graduates owe 5 years on active duty.",
        "url": "https://www.usna.edu/Admissions/Apply/index.php"
      },
      "rotc": {
        "name": "Naval ROTC (NROTC)",
        "text": "Offered at many colleges, with scholarships for high school seniors and college students. Navy-option scholarship students owe at least 5 years on active duty, inside an 8-year total.",
        "url": "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Four-Year-National-Scholarship/"
      },
      "ocs": {
        "name": "Officer Candidate School (OCS)",
        "text": "A 13-week course at Officer Training Command in Newport, Rhode Island, for people with a bachelor's degree. You must be at least 19; the upper age limit depends on the job, and waivers are possible.",
        "url": "https://www.navy.com/joining/ways-to-join/officer/officer-candidate-school"
      },
      "direct": {
        "name": "Direct commission (Officer Development School)",
        "text": "Doctors, nurses, dentists, lawyers (JAG), chaplains, engineers, and other professionals are commissioned first, then attend the 5-week Officer Development School (ODS) in Newport, Rhode Island.",
        "url": "https://www.navy.com/joining/ways-to-join/officer/officer-development-school"
      },
      "warrant": {
        "name": "Chief warrant officer programs",
        "text": "Most Navy warrant officers are senior enlisted Sailors (usually chief petty officers) chosen for their technical skill. A separate cyber warrant officer program selects Sailors from a cyber rating at a younger stage of their career.",
        "url": "https://www.mynavyhr.navy.mil/Career-Management/Community-Management/Officer/Active-OCM/LDO-CWO/Applicant-Information/"
      },
      "after": "New ensigns go to job training such as surface warfare school, flight school, nuclear power school, or submarine school. Pilots owe 8 years after earning their wings.",
      "sources": ["https://www.navy.com/joining/ways-to-join/officer", "https://www.navy.com/joining/ways-to-join/officer/officer-candidate-school", "https://www.navy.com/joining/ways-to-join/officer/officer-development-school", "https://www.usna.edu/Admissions/Apply/index.php", "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Four-Year-National-Scholarship/", "https://www.mynavyhr.navy.mil/Portals/55/Career/OCM/PA-106_OCS_Pilot_and_NFO_Mar-2025.pdf"]
    },
    "af": {
      "academy": {
        "name": "U.S. Air Force Academy",
        "text": "Four-year college in Colorado Springs, Colorado. Applicants must be at least 17 and not past their 23rd birthday on July 1 of the year they enter, and need a nomination. Graduates owe 5 years on active duty plus 3 in the reserves, and can commission into the Air Force or Space Force.",
        "url": "https://www.usafa.edu/admissions/commitment/requirements/"
      },
      "rotc": {
        "name": "Air Force ROTC",
        "text": "Offered at hundreds of colleges, with scholarships for high school and college students. Scholarship cadets owe at least 4 years on active duty in the Air Force or Space Force; pilots owe 10 years after flight school.",
        "url": "https://www.afrotc.com/scholarships/high-school/requirements/"
      },
      "ocs": {
        "name": "Officer Training School (OTS)",
        "text": "An 8.5-week course at Maxwell Air Force Base in Montgomery, Alabama, for college graduates. Applicants usually must commission by age 42, and pilot applicants must apply before age 33.",
        "url": "https://www.airforce.com/training/military-training/ots"
      },
      "direct": {
        "name": "Commissioned Officer Training (COT)",
        "text": "Doctors, nurses, other health professionals, lawyers, and chaplains are commissioned directly and attend a 5-week Commissioned Officer Training course at Maxwell.",
        "url": "https://www.airforce.com/training/military-training/ots"
      },
      "warrant": {
        "name": "Warrant Officer Training School",
        "text": "The Air Force brought back warrant officers in 2024 for cyber and IT jobs. Enlisted Airmen (staff sergeant and up) can apply, and the first class graduated in December 2024 from the 8-week school at Maxwell.",
        "url": "https://www.af.mil/News/Article-Display/Article/3987738/first-air-force-warrant-officers-graduate-prepare-to-enter-force/"
      },
      "after": "New second lieutenants go to initial skills training for their job, such as pilot training, cyber, or maintenance courses.",
      "sources": ["https://www.airforce.com/training/military-training/ots", "https://www.usafa.edu/admissions/commitment/requirements/", "https://www.usafa.edu/about/faqs/", "https://www.afrotc.com/scholarships/high-school/requirements/", "https://www.afaccessionscenter.af.mil/Portals/78/LOA/AD%20AF%20OTS%20PA%20COA%206DEC2024%20-%20Final.pdf", "https://www.af.mil/News/Article-Display/Article/3987738/first-air-force-warrant-officers-graduate-prepare-to-enter-force/"]
    },
    "sf": {
      "academy": {
        "name": "U.S. Air Force Academy",
        "text": "The Space Force has no academy of its own. Air Force Academy cadets can commission into the Space Force when they graduate.",
        "url": "https://www.spaceforce.com/how-to-join/officer"
      },
      "rotc": {
        "name": "Air Force ROTC",
        "text": "Air Force ROTC also produces Space Force officers. Scholarship cadets owe at least 4 years on active duty in either service.",
        "url": "https://www.afrotc.com/scholarships/high-school/requirements/"
      },
      "ocs": {
        "name": "Officer Training School (OTS)",
        "text": "College graduates attend the Air Force's 8.5-week OTS at Maxwell Air Force Base and can be assigned as Space Force officers.",
        "url": "https://www.airforce.com/training/military-training/ots"
      },
      "direct": {
        "name": "Direct commission",
        "text": "The Space Force has commissioned experienced civilian cyber professionals directly, sometimes above the entry rank, and they still attend OTS.",
        "url": "https://www.spaceforce.com/news-events/first-ussf-direct-commission-program-cyber-officer-graduates-from-ots"
      },
      "warrant": null,
      "after": "All new Space Force officers attend the Officer Training Course at Peterson Space Force Base, Colorado, in their first year, along with training for their job.",
      "sources": ["https://www.spaceforce.com/how-to-join/officer", "https://www.spaceforce.com/news-events/first-ussf-direct-commission-program-cyber-officer-graduates-from-ots", "https://www.spaceforce.mil/Portals/2/Documents/Transfer/USSF_INTERSERVICE_TRANSFER_IST_PROGRAM_FREQUENTLY_ASKED_QUESTIONS_FAQs.pdf", "https://www.vandenberg.spaceforce.mil/News/Article-Display/Article/4289702/space-forces-first-officer-training-course-graduates-at-peterson-sfb/"]
    },
    "cg": {
      "academy": {
        "name": "U.S. Coast Guard Academy",
        "text": "Four-year college in New London, Connecticut. Applicants are 17 to 22, and no congressional nomination is needed, unlike the other academies. Graduates owe at least 5 years of service.",
        "url": "https://uscga.edu/admissions/admission-requirements/"
      },
      "rotc": {
        "name": "College Student Pre-Commissioning Initiative (CSPI)",
        "text": "The Coast Guard has no ROTC; CSPI is its closest match. College students enlist, go to boot camp, and get paid while the Coast Guard covers tuition, books, and fees, then attend OCS after graduating and owe 3 years as an officer.",
        "url": "https://www.gocoastguard.com/get-started/officer-applications/college-student-pre-commissioning-initiative-cspi-scholarship"
      },
      "ocs": {
        "name": "Officer Candidate School (OCS)",
        "text": "A 12-week course at the Coast Guard Academy in New London, Connecticut, held three times a year. It is open to college graduates, prior-service members, and Coast Guard enlisted members, usually ages 21 to 41.",
        "url": "https://www.gocoastguard.com/get-started/officer-applications/officer-candidate-school-ocs"
      },
      "direct": {
        "name": "Direct Commission Officer programs",
        "text": "Programs cover aviators, cyber, engineers, intelligence, lawyers, health professionals, physician assistants, and more. Most attend a 5-week Direct Commission Officer course at the Coast Guard Academy.",
        "url": "https://www.gocoastguard.com/get-started/officer-applications/direct-commission-officer-programs"
      },
      "warrant": {
        "name": "Chief warrant officer appointment",
        "text": "Coast Guard warrant officers are almost always experienced enlisted members chosen by a yearly selection board.",
        "url": "https://www.dcms.uscg.mil/ppc/news/Article/3807164/alcgpsc-08224-py24-active-duty-chief-warrant-officer-cwo-appointment-board-resu/"
      },
      "after": "New ensigns usually go straight to their first unit, often a cutter, or to flight training or other job schools.",
      "sources": ["https://uscga.edu/admissions/admission-requirements/", "https://uscga.edu/careers/graduate-programs/", "https://www.gocoastguard.com/get-started/officer-applications/officer-candidate-school-ocs", "https://www.gocoastguard.com/get-started/officer-applications/college-student-pre-commissioning-initiative-cspi-scholarship", "https://www.gocoastguard.com/get-started/officer-applications/direct-commission-officer-programs"]
    }
  },
  "notes": [
    { "text": "Every commissioned officer needs a bachelor's degree by the time they commission. Most warrant officers do not.", "source": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers" },
    { "text": "Most new officers sign up for 8 years of total service; any time not spent on active duty is usually served in the reserves.", "source": "https://www.netc.navy.mil/Commands/Naval-Service-Training-Command/NROTC/Prospective-Midshipmen/Scholarship-and-Non-Scholarship-Options/Four-Year-National-Scholarship/" },
    { "text": "Pilots owe the longest commitments: 10 years after flight school in the Air Force and for Army aviation warrant officers, and 8 years after earning wings in the Navy and Marine Corps.", "source": "https://www.afrotc.com/career/pilot/" },
    { "text": "Enlisted members can become officers through programs like Army Green to Gold, Navy STA-21, Marine MECEP, Air Force SOAR and LEAD, and Coast Guard OCS.", "source": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/green-to-gold" },
    { "text": "In 2025 the Army went back to the names Fort Benning (home of OCS) and Fort Rucker (home of Warrant Officer Candidate School), so older guides may say Fort Moore or Fort Novosel.", "source": "https://www.goarmy.com/careers-and-jobs/find-your-path/warrant-officers" },
    { "text": "The Space Force has no warrant officer ranks, and the Coast Guard has no ROTC program.", "source": "https://www.spaceforce.mil/Portals/2/Documents/Transfer/USSF_INTERSERVICE_TRANSFER_IST_PROGRAM_FREQUENTLY_ASKED_QUESTIONS_FAQs.pdf" },
    { "text": "Joining ROTC classes without a scholarship usually does not obligate you to serve; signing a scholarship contract does.", "source": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc" }
  ]
};
