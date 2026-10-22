"use strict";

// Boot camp story mode content. One short choose-your-path story per branch,
// following the real order of that boot camp. Each scene has 2-3 choices;
// d / t / g are small changes to Discipline, Teamwork and Grit. The story
// always moves forward: choices change the outcome text, never the ending.
// Checked against the official sources listed per branch (October 2026).
// Details that vary by class or location are worded generally on purpose.

window.F_STORY = {
  army: {
    camp: "Basic Combat Training",
    where: "Fort Jackson, Fort Benning, Fort Leonard Wood or Fort Sill",
    leaders: "Drill Sergeants",
    intro: "You've sworn in at MEPS and you're on a bus to Basic Combat Training. About 10 weeks from now, if you meet the standard, you'll graduate as a Soldier.",
    source: [
      "https://www.goarmy.com/army-life/basic-training",
      "https://home.army.mil/jackson/",
      "https://www.army.mil/article/208465",
    ],
    scenes: [
      {
        week: "Reception",
        title: "Late-night arrival",
        text: "The bus pulls into the reception battalion after dark. Cadre call out instructions, collect your paperwork and give everyone a last chance to turn in anything not allowed. Then it's your turn for a short phone call home to say you made it.",
        choices: [
          { label: "Keep it short: you're safe, you'll write soon.", d: 1, outcome: "Thirty seconds and done. The cadre member nods and waves the next trainee up. Your family knows you arrived, and that's the point of the call." },
          { label: "Help the nervous trainee behind you remember his family's number.", t: 1, outcome: "He wrote it on his hand on the bus and it smeared. You help him piece it together from memory. He gets through, and he doesn't forget it." },
          { label: "Try to stretch the call for a few extra minutes.", d: -1, g: 1, outcome: "A cadre member reminds you there's a long line behind you. You wrap up quickly. Lesson one: the schedule isn't yours anymore." },
        ],
      },
      {
        week: "Reception",
        title: "Haircut, uniforms, shots",
        text: "Reception is a blur of lines: a haircut that takes under a minute, uniform and boot issue, shots, dental checks, ID cards and paperwork. Nobody is yelling much yet. It's mostly waiting and doing exactly what the sign says.",
        choices: [
          { label: "Label every item with your name, exactly how they showed you.", d: 1, outcome: "It's boring, but when someone's boots go missing later, yours are the ones nobody argues about." },
          { label: "Notice a trainee got the wrong boot size and tell him to speak up now.", t: 1, outcome: "He gets them swapped before leaving reception. Ten weeks in the wrong boots would have wrecked his feet." },
        ],
      },
      {
        week: "Week 1 (Yellow Phase)",
        title: "Meeting your Drill Sergeants",
        text: "The bus stops at your training company and the Drill Sergeants are waiting in their campaign hats. It's loud, fast and confusing on purpose: grab your bags, get in formation, move. They're addressed as \"Drill Sergeant,\" not \"sir\" or \"ma'am.\"",
        choices: [
          { label: "Answer loud and clear: \"Yes, Drill Sergeant!\"", d: 1, g: 1, outcome: "You don't stand out, which right now is a win. The Drill Sergeant moves on to someone who called him \"sir.\"" },
          { label: "Help the trainee next to you grab the bag he dropped.", t: 1, outcome: "A Drill Sergeant sees it and tells the whole platoon: \"That's what a battle buddy does.\" Then everyone gets moving again." },
          { label: "Freeze and wait to see what everyone else does.", g: -1, outcome: "A Drill Sergeant points you to your spot in formation. You'll learn the rhythm. Everyone freezes at least once." },
        ],
      },
      {
        week: "Week 1 (Yellow Phase)",
        title: "Battle buddies and a messy wall locker",
        text: "You're assigned a battle buddy: you go everywhere in pairs. On the first inspection, your wall locker is unlocked and your gear is out of place. A Drill Sergeant asks whose locker it is.",
        choices: [
          { label: "Own it right away and fix it.", d: 1, g: 1, outcome: "You get corrected (push-ups and a speech about security) and then it's over. Owning a mistake fast is something Drill Sergeants actually respect." },
          { label: "Say your buddy was supposed to remind you.", d: -1, t: -1, outcome: "The Drill Sergeant isn't impressed, and now you both get corrected. Your buddy is quiet the rest of the night. You apologize at lights out." },
          { label: "Own it, then set up a nightly locker check with your buddy.", d: 1, t: 1, outcome: "It never happens again, for either of you. Small systems beat good intentions." },
        ],
      },
      {
        week: "Weeks 1-2 (Yellow Phase)",
        title: "First fitness test",
        text: "Early on you take a diagnostic Army Fitness Test (AFT): deadlift, hand-release push-ups, sprint-drag-carry, plank and a 2-mile run. It shows where you're starting. You'll have to pass it to graduate.",
        choices: [
          { label: "Go all out on every event.", g: 2, outcome: "Your legs are jelly after the sprint-drag-carry, but you finish the run. Now you know your real starting point." },
          { label: "Pace yourself and save energy for the run.", d: 1, g: 1, outcome: "Your run time is solid. Your Drill Sergeant notes that your push-ups need work, and so do you." },
          { label: "Cheer on the trainees finishing the run behind you.", t: 1, g: 1, outcome: "You're winded but you shout anyway. One of them sprints the last 100 meters. Next week he cheers for you." },
        ],
      },
      {
        week: "Weeks 1-2 (Yellow Phase)",
        title: "The tower",
        text: "The tower is a tall obstacle course of cargo nets, ladders and rope crossings, ending with a rappel down a wall. Safety lines and harnesses are checked and double-checked. You hate heights.",
        choices: [
          { label: "Tell the Drill Sergeant you're nervous, then do it anyway.", g: 2, outcome: "He talks you through the first step off the edge. The rest is easier than you thought. Being scared and doing it anyway is the whole point." },
          { label: "Focus on the instructions and nothing else.", d: 2, outcome: "Brake hand, feet wide, lean back. You hit the ground clean. Your hands shake for a minute after, and that's fine." },
        ],
      },
      {
        week: "Weeks 3-4 (Red Phase)",
        title: "The gas chamber",
        text: "CBRN training: you put on your protective mask, check the seal and walk into a building filled with CS (tear) gas. Inside, you're told to lift the mask and say your name. It's harmless in the long run, but your eyes and nose burn hard for a few minutes.",
        choices: [
          { label: "Stay calm and follow the instructor's steps exactly.", d: 2, outcome: "You say your name, walk out in order and keep your hands away from your face. Ten minutes later it's just a story." },
          { label: "Guide the panicking trainee next to you toward the exit in order.", t: 2, outcome: "You keep a hand on his shoulder until you're outside. Running in a panic is how people get hurt. Walking out together is how they don't." },
        ],
      },
      {
        week: "Weeks 5-7 (White Phase)",
        title: "Rifle marksmanship",
        text: "White Phase is about your M4 carbine: taking it apart, zeroing it and learning to shoot accurately at targets out to 300 meters. You have to qualify to graduate. Your first groups are all over the paper.",
        choices: [
          { label: "Ask the range coach what you're doing wrong.", d: 1, g: 1, outcome: "Turns out you're jerking the trigger. A few dry-fire drills later, your groups shrink. Asking for help is a skill, too." },
          { label: "Spend free time doing dry-fire practice with your buddy.", t: 1, g: 1, outcome: "You coach each other on breathing and trigger squeeze. You both qualify the next day." },
          { label: "Just shoot more and hope it fixes itself.", g: 1, outcome: "You barely qualify. It counts, but you know a little coaching would have made it easier." },
        ],
      },
      {
        week: "Weeks 5-7 (White Phase)",
        title: "Your buddy's ankle",
        text: "During land navigation your battle buddy rolls his ankle. It's swelling. He begs you not to say anything because he's afraid he'll be held back.",
        choices: [
          { label: "Tell the Drill Sergeant so he can get it checked.", t: 1, d: 1, outcome: "He's mad for an hour. Then sick call says it's a sprain, he gets it wrapped and he trains on. Hiding injuries is how small ones become big ones." },
          { label: "Convince him to report it himself, and go with him.", t: 2, outcome: "He goes. It's a sprain, and he's back with the platoon in a few days. He tells you later he was glad you pushed." },
        ],
      },
      {
        week: "Weeks 8-10 (Blue Phase)",
        title: "The Forge",
        text: "Blue Phase ends with the Forge, a multi-day field exercise. At Fort Jackson it's described as about 45 miles over 81 hours, with missions mostly at night and very little sleep. You have to earn your way into it by meeting the standards first.",
        choices: [
          { label: "Take extra weight from a struggling squad member.", t: 2, g: 1, outcome: "Your shoulders are on fire, but your squad crosses every checkpoint together. That's what the Forge is testing." },
          { label: "Volunteer to lead your squad on the night mission.", d: 1, g: 1, outcome: "You mess up one turn on the map, own it, and fix it. The Drill Sergeant's only comment: \"Good recovery.\"" },
          { label: "Keep your head down and just keep walking.", g: 2, outcome: "You don't say much. You don't stop either. Some miles are just about putting one boot in front of the other." },
        ],
      },
      {
        week: "Week 10",
        title: "Family Day",
        text: "You passed the AFT, qualified with your rifle and finished the Forge. Family Day is your first real time with family in weeks, the day before graduation.",
        choices: [
          { label: "Introduce your battle buddy to your family.", t: 1, outcome: "His family couldn't make it. Yours adopts him for the afternoon. He gets more food than anyone." },
          { label: "Thank your Drill Sergeant before you leave.", d: 1, outcome: "He shakes your hand and says, \"Go be a good Soldier.\" Ten weeks ago you couldn't imagine him saying that." },
        ],
      },
      {
        week: "Week 10",
        title: "Graduation",
        text: "Your company marches onto the field in front of families. You're a Soldier now. Next stop: Advanced Individual Training (AIT) to learn your job.",
        choices: [
          { label: "Stand tall and soak it in.", d: 1, g: 1, outcome: "You think about that first night at reception. It feels like a different person got off that bus." },
          { label: "Find your battle buddy after the ceremony.", t: 1, outcome: "You're headed to different AIT schools. You trade addresses and promise to stay in touch." },
        ],
      },
    ],
    facts: [
      "Basic Combat Training is about 10 weeks, plus a few days at a reception battalion first.",
      "It's split into four phases: Yellow, Red, White and Blue. The final multi-day field exercise is called the Forge.",
      "You must pass the Army Fitness Test (AFT), which replaced the ACFT in 2025, and qualify with your rifle to graduate.",
      "Drill Sergeants can yell and correct you with extra exercise, but hitting, hazing or abusing trainees is against Army rules and is investigated.",
      "After graduation you go to AIT for your job. Some jobs, like infantry, combine basic and job training in one course (OSUT).",
    ],
  },

  usmc: {
    camp: "Recruit Training",
    where: "Marine Corps Recruit Depot Parris Island, S.C., or San Diego, Calif.",
    leaders: "Drill Instructors",
    intro: "You're on a bus to a Marine Corps Recruit Depot. Recruit training is 13 weeks long, the longest boot camp of any branch. You don't get called a Marine until you've earned it.",
    source: [
      "https://www.marines.com/become/recruit-training",
      "https://www.marines.com/become/requirements",
      "https://www.mcrdpi.marines.mil/",
      "https://www.mcrdsd.marines.mil/",
    ],
    scenes: [
      {
        week: "Receiving",
        title: "The yellow footprints",
        text: "It's late at night when the bus stops. A drill instructor steps on and tells you to get off and stand on the yellow footprints painted on the pavement. It's your first formation. Inside, you make a short, scripted phone call to tell your family you've arrived safely.",
        choices: [
          { label: "Read the script exactly as written.", d: 1, outcome: "\"I have arrived safely...\" Done. There's no room for chatting, and you didn't try to make one." },
          { label: "Lock your eyes forward on the footprints and don't move.", d: 1, g: 1, outcome: "Everyone around you is shaking. You are too. But your feet stay on the paint." },
          { label: "Whisper to the recruit next to you that you'll get through this.", t: 1, d: -1, outcome: "A drill instructor hears it and reminds you that you speak when spoken to. Still, the recruit next to you looks a little less scared." },
        ],
      },
      {
        week: "Receiving",
        title: "Haircuts, gear and a last chance",
        text: "Receiving takes a few days: haircuts, uniforms, medical checks and paperwork, on very little sleep. Recruits get a last chance to turn in anything they shouldn't have. Receiving ends with the Initial Strength Test: pull-ups or push-ups, a plank and a 1.5-mile run.",
        choices: [
          { label: "Push hard on the run, even though you're exhausted.", g: 2, outcome: "Your time isn't great, but it's above the minimum. You'll train up from here." },
          { label: "Help a recruit who doesn't understand the instructions.", t: 1, d: 1, outcome: "He's never done a dead-hang pull-up before. You show him the start position before his turn. He gets the minimum." },
        ],
      },
      {
        week: "Week 1 (Phase 1)",
        title: "Meeting your drill instructors",
        text: "Your platoon meets the team that will train you for the next three months: the Senior Drill Instructor and the drill instructors. They introduce themselves, recite the Drill Instructor's Creed and then the intensity goes way up. Recruits answer with \"Sir, yes, sir!\" or \"Ma'am, yes, ma'am!\"",
        choices: [
          { label: "Sound off as loud as you can.", d: 1, g: 1, outcome: "Your voice is gone by dinner. Every recruit's is. It's part of the deal." },
          { label: "Keep your eyes on your recruit to the front and copy his timing.", d: 1, t: 1, outcome: "You move when he moves. By the end of the day your squad is moving as one, mostly." },
        ],
      },
      {
        week: "Phase 1: Foundation",
        title: "Drill and a mistake",
        text: "Close-order drill, Marine Corps history, core values (Honor, Courage, Commitment) and a strict daily routine. During drill, you turn the wrong way and bump the recruit next to you. The drill instructor is in your face in a second.",
        choices: [
          { label: "Answer, correct it and do the corrective exercise without complaining.", d: 2, outcome: "Drill instructors can use short, supervised bursts of exercise (called incentive training) as correction. You do it, and get back in step." },
          { label: "Practice the movement with your squad during free time.", t: 1, d: 1, outcome: "Twenty minutes of facing movements during free time. The next day your squad gets it right while others don't." },
          { label: "Get frustrated and roll your eyes.", d: -1, g: 1, outcome: "The drill instructor sees it, and now you get extra correction. Mistakes are expected. Attitude makes them worse." },
        ],
      },
      {
        week: "Phase 2: Immersion",
        title: "Combat Water Survival",
        text: "Every recruit has to pass combat water survival: jumping into the deep end, swimming, treading water, and getting out of your gear in the water. You never learned to swim well.",
        choices: [
          { label: "Tell the instructor and ask for extra help.", g: 1, d: 1, outcome: "Instructors work with weak swimmers all the time. With some coaching you pass. If you hadn't, you'd have gotten another chance." },
          { label: "Fight through it with everything you've got.", g: 2, outcome: "Your form is ugly, but you stay calm and keep moving. You pass. You'll keep working on it." },
        ],
      },
      {
        week: "Phase 2: Immersion",
        title: "Martial arts and pugil sticks",
        text: "You start the Marine Corps Martial Arts Program and pugil stick bouts: padded sticks, helmets and a referee. Your opponent is bigger than you.",
        choices: [
          { label: "Stay aggressive and keep moving forward.", g: 2, outcome: "You lose the first bout and win the second. Everyone shakes hands after." },
          { label: "Use the technique you were taught, not just strength.", d: 2, outcome: "Footwork and timing. It works better than you expected." },
        ],
      },
      {
        week: "Phase 3: Transformation",
        title: "The rifle range",
        text: "Your platoon moves to the rifle range. First comes a week of learning positions and sight alignment (\"snapping in\") without live rounds, then a week of live fire and qualification. Every Marine is a rifleman.",
        choices: [
          { label: "Practice positions every chance you get, even when it hurts.", d: 1, g: 1, outcome: "The sitting position stops feeling like torture by day three. You qualify." },
          { label: "Coach the recruit next to you on his breathing.", t: 2, outcome: "He was on track to fail. On qualification day he passes by a few points and thanks you at chow." },
        ],
      },
      {
        week: "Phase 3: Transformation",
        title: "Field week and a struggling recruit",
        text: "Field training: hikes, patrolling, camouflage, setting up in the field. On a long hike, a recruit in your squad falls behind. His feet are bleeding through his socks and he hasn't told anyone.",
        choices: [
          { label: "Tell your squad leader so a corpsman can look at his feet.", t: 1, d: 1, outcome: "Navy corpsmen take care of Marines and recruits. He gets his feet treated and finishes the hike on time." },
          { label: "Stay next to him and keep him talking.", t: 2, outcome: "You talk about food for six miles straight. He finishes. Later you make sure he gets his feet checked." },
        ],
      },
      {
        week: "Phase 3 into Phase 4",
        title: "The Crucible",
        text: "The Crucible is a 54-hour field exercise with little food and little sleep: long marches and team problems named after Marines who earned the Medal of Honor. No one gets through it alone.",
        choices: [
          { label: "Share your food and water plan with your fireteam.", t: 2, outcome: "You keep each other fed and hydrated. Small things matter when everyone is exhausted." },
          { label: "Volunteer to lead a team problem.", d: 1, g: 1, outcome: "Your plan fails the first time. You change it and your team gets it on the second try. That counts." },
          { label: "Don't complain once, no matter what.", g: 2, outcome: "You're running on almost nothing, but you keep your mouth shut and your feet moving." },
        ],
      },
      {
        week: "End of the Crucible",
        title: "The Eagle, Globe and Anchor",
        text: "The Crucible ends with a final hike. At Parris Island it finishes at a replica of the Iwo Jima flag-raising memorial; at San Diego, recruits climb a steep hill called the Reaper. Your drill instructor hands you the Eagle, Globe and Anchor emblem and calls you a Marine for the first time.",
        choices: [
          { label: "Shake your drill instructor's hand and say thank you.", d: 1, outcome: "He grips your hand and says \"Welcome to the Marine Corps.\" Then the Warrior's Breakfast: all the food you can eat." },
          { label: "Find the recruit you helped on the hike.", t: 1, outcome: "You both have emblems in your hands. Neither of you says much. You don't have to." },
        ],
      },
      {
        week: "Phase 4: Transition",
        title: "Final tests",
        text: "The last weeks include final fitness and academic tests, uniform fittings and graduation preparation. You're a Marine now, and the drill instructors expect you to start acting like one.",
        choices: [
          { label: "Help a squadmate study for the final academic test.", t: 1, d: 1, outcome: "Rank structure, history, first aid. You quiz each other until lights out, and you both pass." },
          { label: "Push for a better score on your final fitness test.", g: 2, outcome: "You beat your first fitness test results by a lot. Thirteen weeks of work shows." },
        ],
      },
      {
        week: "Week 13",
        title: "Family Day and graduation",
        text: "Family Day starts with a motivational run, then you get liberty on base with your family. The next morning you march across the parade deck at graduation.",
        choices: [
          { label: "Stand perfectly still in formation. Your family can wait five more minutes.", d: 1, g: 1, outcome: "Then you're dismissed, and they can't stop hugging you." },
          { label: "Introduce your family to the Marines in your squad.", t: 1, outcome: "Your family keeps asking how you all got through it. Together, is the short answer." },
        ],
      },
    ],
    facts: [
      "Marine recruit training is 13 weeks, in four phases, at Parris Island, S.C., or San Diego, Calif. Both depots train men and women.",
      "Receiving ends with the Initial Strength Test (pull-ups or push-ups, a plank and a 1.5-mile run).",
      "The Crucible is a 54-hour final test. Recruits are first called Marines when they receive the Eagle, Globe and Anchor.",
      "Drill instructors yell and use supervised corrective exercise, but hitting, hazing or abusing recruits is prohibited and investigated.",
      "After boot camp, every Marine goes to the School of Infantry before job training.",
    ],
  },

  navy: {
    camp: "Recruit Training Command",
    where: "Great Lakes, Illinois (the Navy's only boot camp)",
    leaders: "Recruit Division Commanders (RDCs)",
    intro: "You're headed to Recruit Training Command at Great Lakes, Illinois, the Navy's only boot camp. In about 9 weeks you'll trade your RECRUIT ball cap for one that says NAVY.",
    source: [
      "https://www.bootcamp.navy.mil/",
      "https://www.navy.com/",
      "https://www.netc.navy.mil/",
      "https://en.wikipedia.org/wiki/Recruit_Training_Command,_Great_Lakes,_Illinois",
    ],
    scenes: [
      {
        week: "Arrival",
        title: "Night arrival at Great Lakes",
        text: "Most recruits arrive at night. You file into the in-processing building, get a quick briefing and turn in anything that isn't allowed. Then you make a short call home to say you arrived safely.",
        choices: [
          { label: "Read the call script and hang up on time.", d: 1, outcome: "Short and done. The petty officer running the line moves on. That's how most of the next nine weeks will go." },
          { label: "Help the recruit next to you who can't find his paperwork.", t: 1, outcome: "It was in his back pocket the whole time. He's so relieved he almost laughs, and then remembers not to." },
        ],
      },
      {
        week: "Processing days",
        title: "Processing days",
        text: "The first several days are processing: haircut, uniform issue, shots, medical and dental checks and paperwork. You get a ball cap that says RECRUIT. You'll wear it until you earn a better one.",
        choices: [
          { label: "Stencil and stow every piece of gear exactly as shown.", d: 2, outcome: "Your locker looks like the example. You'll be glad at your first inspection." },
          { label: "Learn the names of everyone in your division.", t: 1, outcome: "By day three you know all of them. It helps when your RDC asks who's missing." },
        ],
      },
      {
        week: "Week 1",
        title: "Meeting your RDCs",
        text: "Your division gets its Recruit Division Commanders (RDCs), experienced petty officers and chiefs. You address them by rank, like \"Petty Officer\" or \"Chief.\" Your barracks is called a \"ship,\" and your floor has to stay ready for inspection.",
        choices: [
          { label: "Answer with the right title every time.", d: 1, outcome: "You almost say \"sir\" once and catch yourself. Your RDC notices both the slip and the catch." },
          { label: "Volunteer for a job in the division.", d: 1, t: 1, outcome: "You end up in charge of keeping the laundry list straight. Not glamorous, but people depend on it." },
        ],
      },
      {
        week: "Early weeks",
        title: "First fitness check",
        text: "Physical training starts right away. An early fitness check (push-ups, a forearm plank and a 1.5-mile run) shows where everyone is. Recruits who keep falling short get extra training before they can move on.",
        choices: [
          { label: "Go all out on the run.", g: 2, outcome: "You finish strong and then lie on the grass for a bit. Worth it." },
          { label: "Run with a shipmate who's struggling to keep pace.", t: 2, outcome: "He finishes just under the time. He tells the whole division you dragged him there, even though he did it himself." },
        ],
      },
      {
        week: "Early weeks",
        title: "The folded-shirt inspection",
        text: "Everything in your locker has a specific fold and place. At inspection, your RDC finds your T-shirts folded wrong and tosses them on your rack.",
        choices: [
          { label: "Say \"Aye, Petty Officer,\" and refold them right then.", d: 2, outcome: "Instruction, correction, done. It's about details, and you're learning that details matter on a ship." },
          { label: "Ask the shipmate with perfect folds to show you after.", t: 1, d: 1, outcome: "She has a trick with a piece of cardboard. Half the division asks her for help after that." },
        ],
      },
      {
        week: "Weeks 1-7",
        title: "Swim qualification",
        text: "Every Sailor has to pass a swim qualification: jumping from a tower into the deep end, swimming, floating, and using your clothes as a flotation aid. Weak swimmers get extra instruction.",
        choices: [
          { label: "Admit you're a weak swimmer and take the extra lessons.", d: 1, g: 1, outcome: "It's humbling, and it works. You pass on your next try." },
          { label: "Stay calm and float when you get tired.", g: 2, outcome: "Panic is the enemy in the water. You keep calm, and you pass." },
        ],
      },
      {
        week: "Week 4",
        title: "Weapons safety",
        text: "You learn firearms safety and train with the M18 pistol. Most of it is about safe handling, following range commands and never pointing a weapon at anything you don't intend to shoot.",
        choices: [
          { label: "Follow every range command exactly.", d: 2, outcome: "The range instructors run a tight line. You never give them a reason to look twice at you." },
          { label: "Help your shipmate review the safety rules before the range.", t: 1, d: 1, outcome: "You quiz each other in line. Both of you get every question right." },
        ],
      },
      {
        week: "Week 6",
        title: "Firefighting and the confidence chamber",
        text: "On a ship there's no fire department to call, so every Sailor learns firefighting and damage control: hoses, breathing equipment, watertight doors, escaping smoke. You also go through the confidence chamber, where you briefly breathe tear gas to trust your gas mask.",
        choices: [
          { label: "Take the nozzle when your hose team needs someone up front.", g: 2, outcome: "It's heavier than it looks. Your team backs you up and you hit the target." },
          { label: "Keep your hose team communicating and in step.", t: 2, outcome: "\"Advancing!\" \"Backing!\" Your team moves as one. The instructor uses you as an example." },
        ],
      },
      {
        week: "Weeks 6-7",
        title: "A shipmate falling behind",
        text: "A shipmate is failing classroom tests and might be set back to a later division. He's embarrassed and won't ask for help.",
        choices: [
          { label: "Offer to study together during free time.", t: 2, outcome: "Flash cards in the evenings. He passes the next test. Shipmates look out for shipmates." },
          { label: "Let your RDC know he's struggling so he can get help.", d: 1, t: 1, outcome: "Your RDC sets him up with extra study. Speaking up wasn't snitching, it was getting him help." },
        ],
      },
      {
        week: "Final weeks",
        title: "Battle Stations 21",
        text: "Battle Stations 21 is a 12-hour overnight test aboard USS Trayer, a full-size destroyer simulator inside a building. You face flooding, fires, casualties and more, one scenario after another, with no sleep.",
        choices: [
          { label: "Lead your group through a flooding scenario.", d: 1, g: 1, outcome: "You call out what you see and the team patches the pipe. Your hands are freezing. You don't care." },
          { label: "Carry a \"casualty\" with your team, even though you're exhausted.", t: 2, g: 1, outcome: "Four of you, one stretcher, a lot of ladders. You make it." },
        ],
      },
      {
        week: "Final weeks",
        title: "The capping ceremony",
        text: "You made it through Battle Stations. At the capping ceremony, you take off your RECRUIT ball cap and put on one that says NAVY. You're a Sailor.",
        choices: [
          { label: "Stand at attention and let it sink in.", d: 1, outcome: "Your RDC tells your division they've earned it. You believe it." },
          { label: "Look for the shipmate you studied with.", t: 1, outcome: "He's grinning. He almost didn't make it here. Neither of you will forget that." },
        ],
      },
      {
        week: "Graduation",
        title: "Pass in Review",
        text: "Graduation is called Pass in Review. Your division marches past families in a huge drill hall. Next: \"A\" School for your rating (job), or straight to the fleet.",
        choices: [
          { label: "March perfectly. Your family is in the stands.", d: 1, g: 1, outcome: "You find them after. Your mom says she didn't recognize you at first." },
          { label: "Thank your RDCs before you leave.", t: 1, outcome: "One of them tells you, \"See you in the fleet, Sailor.\"" },
        ],
      },
    ],
    facts: [
      "Navy boot camp is about 9 weeks at Recruit Training Command, Great Lakes, Illinois, the Navy's only boot camp.",
      "Recruits are trained by Recruit Division Commanders (RDCs), experienced petty officers and chiefs.",
      "Every Sailor must pass a swim qualification and learns shipboard firefighting and damage control.",
      "Battle Stations 21 is the overnight final test aboard USS Trayer. Afterward recruits trade the RECRUIT cap for a NAVY cap.",
      "RDCs correct recruits firmly, but hitting, hazing or abusing recruits is against Navy rules.",
    ],
  },

  af: {
    camp: "Basic Military Training (BMT)",
    where: "Joint Base San Antonio-Lackland, Texas",
    leaders: "Military Training Instructors (MTIs)",
    intro: "You're flying into San Antonio for Air Force Basic Military Training at Joint Base San Antonio-Lackland. It's about 7.5 weeks, and since late 2025 it's been rebuilt around small teams, more PT and realistic airfield scenarios.",
    source: [
      "https://www.basictraining.af.mil/",
      "https://www.airforce.com/",
      "https://www.airandspaceforces.com/big-changes-air-force-basic-training-details/",
      "https://en.wikipedia.org/wiki/United_States_Air_Force_Basic_Military_Training",
    ],
    scenes: [
      {
        week: "Zero Week",
        title: "Arrival at Lackland",
        text: "The bus brings you to Lackland after dark. You're assigned to a squadron and a flight, get a bed and a locker, and turn in anything not allowed. You also get a short call home to say you arrived safely.",
        choices: [
          { label: "Keep the call quick and on script.", d: 1, outcome: "Your family knows you're safe. That's all the call is for." },
          { label: "Help the trainee in line behind you who's about to cry.", t: 1, outcome: "You tell him the first night is the worst one. You're mostly right." },
        ],
      },
      {
        week: "Zero Week",
        title: "Haircuts and uniforms",
        text: "Haircuts, uniform issue, shots, medical checks and paperwork. You wear civilian clothes until your uniforms are issued, and then you start learning how to wear them correctly.",
        choices: [
          { label: "Learn every uniform rule on day one.", d: 2, outcome: "You know where every patch and pocket item goes. Inspections get easier." },
          { label: "Share your packing tips with your flight.", t: 1, outcome: "A few trainees didn't bring the right stuff. You tell them what they'll need to ask for." },
        ],
      },
      {
        week: "Week 1",
        title: "Meeting your MTIs",
        text: "Your Military Training Instructors (MTIs) wear the wide-brimmed campaign hat. They teach you how to stand, march, report and answer. You answer with \"Sir\" or \"Ma'am.\"",
        choices: [
          { label: "Answer clearly and look straight ahead.", d: 1, g: 1, outcome: "Your MTI moves down the line. Not standing out is a good thing this week." },
          { label: "Quietly help a trainee fix his posture before the MTI reaches him.", t: 1, d: -1, outcome: "It works, but the MTI notices you moving in formation and corrects you. Good instinct, wrong moment." },
        ],
      },
      {
        week: "Week 1",
        title: "Your element",
        text: "Your flight is split into elements of 10 to 15 trainees, each with an element leader your MTIs choose. Your element will train, solve problems and compete together the whole time.",
        choices: [
          { label: "Back up your element leader, even when you'd do it differently.", t: 2, outcome: "She's nervous at first. With the element behind her, she gets better fast." },
          { label: "Offer ideas when your element is stuck.", t: 1, g: 1, outcome: "Your idea for the gear layout saves time. The element leader runs with it." },
        ],
      },
      {
        week: "Week 1-2",
        title: "Fitness test and harder PT",
        text: "You take an initial fitness assessment to see where you're starting. Morning PT is now 90 minutes, with sprints, shuttle runs and box jumps, plus a recovery period before lights out. The Air Force fitness test now uses a 2-mile run.",
        choices: [
          { label: "Push hard in every PT session.", g: 2, outcome: "You're sore everywhere. By week 4 the sprints feel different." },
          { label: "Take the evening recovery time seriously.", d: 1, g: 1, outcome: "Stretching and breathing exercises seem silly at first, then your legs stop aching as much." },
        ],
      },
      {
        week: "Week 2-3",
        title: "Locker left open",
        text: "You leave your locker unlocked while you go to the latrine. Your MTI finds it.",
        choices: [
          { label: "Own it immediately and lock it.", d: 2, outcome: "You get corrected and you never forget again. Securing your stuff is a real security habit, not just a BMT thing." },
          { label: "Own it and start a reminder system for your element.", d: 1, t: 1, outcome: "\"Lock check!\" becomes your element's thing before you leave the dorm. Nobody gets caught again." },
        ],
      },
      {
        week: "Weeks 2-4",
        title: "Core values in the classroom",
        text: "Classes cover Air Force history, the core values (Integrity first, Service before self, Excellence in all we do), first aid and what it means to be a Wingman: looking out for each other.",
        choices: [
          { label: "Check in on a trainee who's been really quiet.", t: 2, outcome: "He's homesick and hasn't told anyone. Talking helps. Being a Wingman is a real job here." },
          { label: "Study hard for the written test.", d: 2, outcome: "You know the material cold. You help others review the night before." },
        ],
      },
      {
        week: "Weeks 3-5",
        title: "The M4 weapons relay",
        text: "You learn weapons handling with M4 training carbines. In the weapons relay, your element races other elements: take the carbine apart, do a shuttle run, put it back together.",
        choices: [
          { label: "Practice disassembly until you can do it fast.", d: 1, g: 1, outcome: "Your hands remember the steps. You shave seconds off your time." },
          { label: "Coach the slowest member of your element.", t: 2, outcome: "He goes from last to the middle of the pack. Your element takes second place." },
        ],
      },
      {
        week: "Weeks 4-6",
        title: "Airfield problems",
        text: "Training builds toward deployed airbase scenarios: map reading on the training grounds, a simulated airfield with a radar outage, and reporting a small drone you spot overhead.",
        choices: [
          { label: "Take the map and lead the route.", d: 1, g: 1, outcome: "You take one wrong turn, catch it and correct. Your element arrives on time." },
          { label: "Keep the reports clear and calm.", t: 1, d: 1, outcome: "When the drone shows up, your report is the one the MTI reads out as an example." },
        ],
      },
      {
        week: "Week 5-6",
        title: "PACER FORGE",
        text: "PACER FORGE is BMT's final field exercise. It simulates operating from a makeshift airbase in a deployed environment, with scenarios testing everything you've learned. It replaced the old BEAST week in 2022.",
        choices: [
          { label: "Volunteer for the hardest task in your element.", g: 2, outcome: "You're filthy and exhausted. Your element finishes every scenario." },
          { label: "Make sure no one in your element gets left behind.", t: 2, outcome: "Constant headcounts and a lot of encouragement. Everyone finishes together." },
          { label: "Follow procedures exactly, even under pressure.", d: 2, outcome: "When things go sideways in the scenario, you fall back on training. It works." },
        ],
      },
      {
        week: "Final week",
        title: "Airman's Run and the coin",
        text: "On the last week, flights take part in the Airman's Run. Then comes the Airman's Coin ceremony, where your MTI hands you the coin that marks you becoming an Airman.",
        choices: [
          { label: "Run it in formation and sing every cadence.", t: 1, g: 1, outcome: "Families line the route and cheer. You can't stop smiling." },
          { label: "Thank your MTI when you get your coin.", d: 1, outcome: "Your MTI shakes your hand and says, \"Welcome to the Air Force, Airman.\"" },
        ],
      },
      {
        week: "Graduation",
        title: "Graduation parade",
        text: "Your flight marches in the graduation parade and takes the oath again in front of families. Next: tech school to learn your job (AFSC).",
        choices: [
          { label: "Find your element after the ceremony.", t: 1, outcome: "You take a photo together. Ten to 15 strangers became your first team." },
          { label: "Think about what's next at tech school.", d: 1, g: 1, outcome: "You've got a long road ahead to learn your job, and you're ready for it." },
        ],
      },
    ],
    facts: [
      "Air Force BMT is about 7.5 weeks at Joint Base San Antonio-Lackland, Texas.",
      "\"BMT 2.0\" started in October 2025: 90-minute PT, less drill time, flights split into elements of 10 to 15 trainees, and more airfield scenarios.",
      "PACER FORGE is the final field exercise. The Airman's Coin ceremony marks becoming an Airman.",
      "MTIs correct trainees firmly, but hitting, hazing or abusing trainees is against Air Force rules and is investigated.",
      "After BMT you go to tech school for your job. Many tech school credits count toward a Community College of the Air Force degree.",
    ],
  },

  sf: {
    camp: "Basic Military Training (Space Force)",
    where: "Joint Base San Antonio-Lackland, Texas",
    leaders: "Military Training Instructors (MTIs)",
    intro: "Space Force recruits go to the same Basic Military Training at Joint Base San Antonio-Lackland as Air Force trainees: about 7.5 weeks. Guardians train in Guardian flights led by Space Force MTIs, with extra Space Force classes on top.",
    source: [
      "https://www.spaceforce.com/training",
      "https://www.spaceforce.mil/About-Us/About-Space-Force/",
      "https://www.stripes.com/branches/space_force/2022-04-19/space-force-basic-training-guardians-air-force-5737607.html",
      "https://www.airandspaceforces.com/big-changes-air-force-basic-training-details/",
    ],
    scenes: [
      {
        week: "Zero Week",
        title: "Arrival at Lackland",
        text: "You arrive at Lackland with Air Force trainees, but you're assigned to a Guardian flight. You get a bed, a locker and a short call home to say you made it.",
        choices: [
          { label: "Keep the call short and on script.", d: 1, outcome: "Thirty seconds. Your family knows you're safe." },
          { label: "Introduce yourself to the other Guardian trainees.", t: 1, outcome: "There aren't many of you compared to the Air Force flights. You find out fast that you'll need each other." },
        ],
      },
      {
        week: "Zero Week",
        title: "Uniforms and haircuts",
        text: "Haircuts, uniform issue, shots and paperwork. Everything gets folded, labeled and stowed a specific way.",
        choices: [
          { label: "Get every detail right the first time.", d: 2, outcome: "Your locker is the one the MTI uses as an example. Mostly." },
          { label: "Help a flightmate who's falling behind on setup.", t: 1, outcome: "Two people folding is faster than one. You both make lights out on time." },
        ],
      },
      {
        week: "Week 1",
        title: "Meeting your Guardian MTIs",
        text: "Your MTIs are Space Force Guardians themselves. They teach you to stand, march and report, and they expect fast, clear answers: \"Sir\" or \"Ma'am.\"",
        choices: [
          { label: "Answer loud and clear every time.", d: 1, g: 1, outcome: "You stumble over a reporting statement once, fix it and keep going." },
          { label: "Watch how the sharpest trainee moves and copy it.", d: 1, t: 1, outcome: "By day three your flight is moving together. It's starting to click." },
        ],
      },
      {
        week: "Week 1",
        title: "Small teams",
        text: "Like Air Force flights, your flight is split into small elements with element leaders your MTIs choose. Your element will train and solve problems together the whole way.",
        choices: [
          { label: "Support your element leader.", t: 2, outcome: "Your element leader gets more confident every day, and your element gets faster." },
          { label: "Speak up when you see a better way.", t: 1, g: 1, outcome: "Your element tries your idea. It works. Next time, someone else has the idea." },
        ],
      },
      {
        week: "Week 1-2",
        title: "Fitness assessment",
        text: "You take an initial fitness assessment, then start long morning PT sessions: runs, sprints, shuttle runs and strength work.",
        choices: [
          { label: "Push your limits every session.", g: 2, outcome: "Your run time drops week after week." },
          { label: "Pace with a flightmate who's struggling.", t: 2, outcome: "He finishes the run with you. He'll do the same for someone else later." },
        ],
      },
      {
        week: "Weeks 2-3",
        title: "A gig at inspection",
        text: "At inspection your MTI finds your bed made wrong. It's a small thing, but small things matter here.",
        choices: [
          { label: "Fix it without excuses.", d: 2, outcome: "You get corrected and move on. No excuses means it's over faster." },
          { label: "Ask your element to check each other's beds before inspections.", d: 1, t: 1, outcome: "Your element has zero bed problems for the rest of BMT." },
        ],
      },
      {
        week: "Weeks 2-5",
        title: "Space Force classes",
        text: "On top of the BMT basics, Guardians get about 21 hours of Space Force classes: how the Space Force is organized, military doctrine, briefings from senior leaders and emotional intelligence. You also learn the Space Force core values: Character, Connection, Commitment and Courage.",
        choices: [
          { label: "Ask questions in every class.", d: 1, g: 1, outcome: "You learn how much everyday life depends on satellites, from GPS to weather forecasts." },
          { label: "Lead a study group for the test.", t: 2, outcome: "Your whole element passes the written test." },
        ],
      },
      {
        week: "Weeks 3-5",
        title: "Weapons training",
        text: "You learn safe weapons handling with M4 training carbines, including the weapons relay against other elements: disassemble, sprint, reassemble.",
        choices: [
          { label: "Practice until it's automatic.", d: 1, g: 1, outcome: "You can do it without thinking. That's the goal." },
          { label: "Coach a teammate who keeps dropping parts.", t: 2, outcome: "Slow is smooth, smooth is fast. He gets it." },
        ],
      },
      {
        week: "Weeks 4-6",
        title: "A flightmate wants to quit",
        text: "A flightmate tells you at night that she wants to quit. She's homesick and exhausted.",
        choices: [
          { label: "Listen, then encourage her to talk to your MTI or a chaplain.", t: 2, outcome: "She talks to the chaplain the next day. She doesn't quit. Getting help is a strength." },
          { label: "Remind her how far she's already come.", t: 1, g: 1, outcome: "She stays. A week later she's the one encouraging others." },
        ],
      },
      {
        week: "Week 5-6",
        title: "PACER FORGE",
        text: "Guardians do BMT's final field exercise too: PACER FORGE, which simulates deployed airbase operations with one scenario after another.",
        choices: [
          { label: "Take the toughest job in your element.", g: 2, outcome: "You're wrecked by the end, and proud of it." },
          { label: "Keep your element communicating.", t: 2, outcome: "Clear calls, constant headcounts. Your element finishes strong." },
          { label: "Stick to procedure when things get chaotic.", d: 2, outcome: "Training takes over when your brain is tired. That's why you trained." },
        ],
      },
      {
        week: "Final week",
        title: "The coin ceremony",
        text: "In the final week, the coin ceremony marks the end of being a trainee. You've earned the title Guardian.",
        choices: [
          { label: "Thank your MTI.", d: 1, outcome: "\"Welcome to the Space Force, Guardian.\"" },
          { label: "Celebrate with your element.", t: 1, outcome: "Seven and a half weeks ago you were strangers." },
        ],
      },
      {
        week: "Graduation",
        title: "Graduation",
        text: "Your flight graduates at Lackland, then you head to technical training for your job. For example, space systems operators train at Vandenberg Space Force Base, California.",
        choices: [
          { label: "Stand tall in formation.", d: 1, g: 1, outcome: "Your family spots you in the Guardian flight right away." },
          { label: "Swap contact info with your element.", t: 1, outcome: "You're headed to different tech schools, but the Space Force is small. You'll see each other again." },
        ],
      },
    ],
    facts: [
      "Guardians go through Basic Military Training at Joint Base San Antonio-Lackland, Texas, about 7.5 weeks, the same core training as Air Force trainees.",
      "Since 2022, Guardian recruits have trained in Guardian-only flights led by Space Force MTIs.",
      "Guardians get about 21 hours of extra Space Force classes, including Space Force structure and emotional intelligence.",
      "MTIs correct trainees firmly, but hitting, hazing or abusing trainees is against the rules and is investigated.",
      "After BMT, Guardians go to technical training, for example at Vandenberg Space Force Base.",
    ],
  },

  cg: {
    camp: "Recruit Training",
    where: "Training Center Cape May, New Jersey (the only Coast Guard boot camp)",
    leaders: "Company Commanders",
    intro: "You're headed to Training Center Cape May, New Jersey, the Coast Guard's only enlisted boot camp. It's about 8 weeks, and new companies start most weeks.",
    source: [
      "https://gocoastguard.com/get-started/basic-training",
      "https://www.forcecom.uscg.mil/Our-Organization/FORCECOM-UNITS/TraCen-Cape-May/",
      "https://www.sandboxx.us/blog/about-coast-guard-boot-camp/",
    ],
    scenes: [
      {
        week: "Week 1",
        title: "Arrival at Cape May",
        text: "You arrive at Training Center Cape May and in-processing starts right away: medical and dental checks, paperwork and turning in anything not allowed. Everything is new and everything happens fast.",
        choices: [
          { label: "Follow every instruction exactly.", d: 2, outcome: "You don't get singled out on day one. That's a quiet win." },
          { label: "Help the recruit next to you who's totally lost.", t: 1, outcome: "You point him to the right line twice. He'll return the favor later." },
        ],
      },
      {
        week: "Week 1",
        title: "Uniforms and the entrance fitness test",
        text: "You get your haircut and uniforms, then take the entrance fitness test. It matters: recruits need to meet the standard to keep training.",
        choices: [
          { label: "Give the run everything you have.", g: 2, outcome: "You pass with some room to spare. Training before you shipped paid off." },
          { label: "Encourage the recruits who are close to the line.", t: 1, g: 1, outcome: "You yell yourself hoarse. Two of them pass by seconds." },
        ],
      },
      {
        week: "Week 1",
        title: "Meeting your Company Commanders",
        text: "Your Company Commanders (CCs) take over your company. They're your instructors, leaders and coaches for the next eight weeks, and they're intense from minute one.",
        choices: [
          { label: "Answer fast and loud.", d: 1, g: 1, outcome: "Your CC moves on. You've learned the rhythm faster than most." },
          { label: "Pass along instructions to recruits who didn't hear.", t: 1, d: 1, outcome: "Your CC notices that you help the company stay together." },
        ],
      },
      {
        week: "Week 2",
        title: "The swim assessment",
        text: "The Coast Guard is a maritime service, so you have to show you can handle the water: jumping in from a platform, swimming a set distance and treading water.",
        choices: [
          { label: "Stay calm and pace yourself.", g: 1, d: 1, outcome: "Slow and steady. You pass without panicking." },
          { label: "Tell your CC you're a weak swimmer and get extra help.", d: 1, g: 1, outcome: "Instructors work with you until you're ready. You pass on the next try." },
        ],
      },
      {
        week: "Week 3",
        title: "Drill and seamanship",
        text: "Drill starts in earnest, and classes cover line types, knots and deck seamanship. Your knots keep falling apart.",
        choices: [
          { label: "Practice knots every night before lights out.", d: 1, g: 1, outcome: "By the end of the week you can tie a bowline with your eyes closed." },
          { label: "Pair up with a recruit who grew up on boats.", t: 2, outcome: "She shows you tricks her dad taught her. You help her with drill in return." },
        ],
      },
      {
        week: "Week 3-4",
        title: "Your mistake, your company's problem",
        text: "You forget part of your uniform for a formation. Your CC corrects the whole company for it.",
        choices: [
          { label: "Own it out loud and fix it.", d: 2, outcome: "Your company sees you take responsibility. Nobody holds it against you." },
          { label: "Apologize to your company and start a gear check.", d: 1, t: 1, outcome: "A one-minute gear check before formations. It never happens again to anyone." },
        ],
      },
      {
        week: "Week 4",
        title: "Midterm and fitness test",
        text: "Halfway through: a physical fitness test and a midterm exam on Coast Guard history, military rules and the core values (Honor, Respect, Devotion to Duty).",
        choices: [
          { label: "Study every free minute.", d: 2, outcome: "You score near the top of your company." },
          { label: "Run a study group in your berthing area.", t: 2, outcome: "Everyone in your group passes. The CCs notice." },
        ],
      },
      {
        week: "Midpoint",
        title: "Picking your first unit",
        text: "About halfway through, you rank the types and locations of units you'd like for your first assignment. Your orders come about a week later.",
        choices: [
          { label: "Ask for a small boat station, doing search and rescue.", g: 1, outcome: "You'd love to drive boats on rescue cases. You'll find out soon." },
          { label: "Ask for a cutter, to go to sea.", g: 1, d: 1, outcome: "Cutters can spend weeks or months at sea. Many new members start out on one." },
          { label: "Pick by location to stay near family.", t: 1, outcome: "No guarantees, but it's worth asking. The needs of the service come first." },
        ],
      },
      {
        week: "Weeks 4-6",
        title: "Firefighting and damage control",
        text: "On a cutter far from shore, the crew is the fire department. You train on firefighting, damage control and first aid.",
        choices: [
          { label: "Take the nozzle.", g: 2, outcome: "Heavy, hot and loud. You keep the hose steady and your team keeps you moving." },
          { label: "Keep your team talking.", t: 2, outcome: "Clear calls keep everyone safe. The instructor gives your team a nod." },
        ],
      },
      {
        week: "Week 6",
        title: "Firearms and pugil sticks",
        text: "You learn firearm safety and shooting, then face off in pugil stick bouts with padded sticks and helmets.",
        choices: [
          { label: "Focus on the fundamentals at the range.", d: 2, outcome: "Safe, steady and accurate. You meet the standard." },
          { label: "Go all in on the pugil sticks.", g: 2, outcome: "You win one, lose one and shake hands both times." },
        ],
      },
      {
        week: "Week 7",
        title: "Final exam, confidence course and orders",
        text: "The last big push: a final exam and a final confidence course. Then you get your orders: where you'll report after boot camp.",
        choices: [
          { label: "Help a struggling recruit get over the final obstacle.", t: 2, g: 1, outcome: "She makes it over with your hand on her boot. Your company finishes together." },
          { label: "Push for your best time on the course.", g: 2, outcome: "You set your best time of boot camp. Then you open your orders." },
        ],
      },
      {
        week: "Week 8",
        title: "Graduation",
        text: "Graduation is on a Friday morning. Families pack the ceremony, and then you leave for your first unit or \"A\" School.",
        choices: [
          { label: "Stand tall and listen to every word.", d: 1, g: 1, outcome: "Eight weeks ago you didn't know a bowline from a cleat hitch." },
          { label: "Thank your Company Commanders.", t: 1, outcome: "Your CC says, \"Semper Paratus. Go make us proud.\"" },
        ],
      },
    ],
    facts: [
      "Coast Guard recruit training is about 8 weeks at Training Center Cape May, New Jersey, the only Coast Guard boot camp.",
      "Recruits are led by Company Commanders (CCs) and take an entrance fitness test in week 1.",
      "Training includes swimming, seamanship, firefighting, damage control, first aid and firearms.",
      "There's no single named capstone event like the Crucible. The last weeks bring final tests, a confidence course and your first orders.",
      "Company Commanders are strict, but hitting, hazing or abusing recruits is against Coast Guard rules.",
    ],
  },
};
