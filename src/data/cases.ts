import { Tier } from '../types';

export interface Character {
  name: string;
  role: string;
  motive: string;
  suspicious: string[];
}

export interface Evidence {
  item: string;
  location: string;
  significance: string;
  puzzleType: 'sequence' | 'mirror' | 'gear' | 'logic' | 'spatial';
}

export interface DetectiveCase {
  id: number;
  title: string;
  hook: string;
  setting: string;
  story: string;
  characters: Character[];
  evidenceTrail: Evidence[];
  solution: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
  };
  tier: Tier;
}

export const cases: DetectiveCase[] = [
  {
    id: 1,
    title: "The Midnight Caller",
    hook: "Every night at midnight, the phone rings in Detective Sam's office. But when he answers, all he hears is a music box playing.",
    setting: "A cozy detective office in Whispering Pines, a small town where everyone knows everyone. The office has warm wooden furniture, a window overlooking Main Street, and an old rotary phone that won't stop ringing.",
    story: "Detective Sam has been getting mysterious phone calls every night for a week. Each time, the same music box tune plays, then the line goes dead. The townspeople are worried because the music is from an old lullaby that belonged to Mrs. Maple, the beloved librarian who retired last month. Three people had access to Mrs. Maple's belongings after she moved: her nephew Billy who helped pack, her friend Ms. Rose the baker who stored some boxes, and Mr. Pine the mailman who delivered her forwarding address. The mystery deepens when Sam discovers the calls are coming from inside the library—which has been closed since Mrs. Maple left. Someone wants to send a message, but why the midnight calls?\n\nDetective Sam decides to investigate the library after dark. With a flashlight in hand, he carefully examines the dusty shelves and discovers something surprising: Mrs. Maple's favorite music box sits on her old desk, wired to an old telephone. But who set this up, and why? The answer lies in following the clues: a trail of cookie crumbs, a misplaced mailbag, and a child's drawing hidden in a book.\n\nAs Sam pieces together the evidence, he realizes this isn't a scary mystery at all—it's a treasure hunt! Someone wanted to lead him to a special surprise that Mrs. Maple left behind for the children of Whispering Pines: a collection of rare storybooks she'd been saving as a gift. The midnight calls were invitations to discover her secret.",
    characters: [
      {
        name: "Billy Maple",
        role: "Mrs. Maple's nephew",
        motive: "Helped pack his aunt's belongings and knew about the music box",
        suspicious: ["nervous around Detective Sam", "seen near library at night"]
      },
      {
        name: "Ms. Rose",
        role: "Baker and Mrs. Maple's friend",
        motive: "Stored some of Mrs. Maple's boxes in her bakery",
        suspicious: ["makes cookies that match the crumbs", "has keys to the library"]
      },
      {
        name: "Mr. Pine",
        role: "Town mailman",
        motive: "Delivered Mrs. Maple's mail and has been to her new home",
        suspicious: ["left his mailbag in the library", "knows the library layout"]
      }
    ],
    evidenceTrail: [
      {
        item: "Cookie crumbs",
        location: "Trail from library entrance to the desk",
        significance: "Match Ms. Rose's special recipe—she was in the library recently",
        puzzleType: "sequence"
      },
      {
        item: "Music box mechanism",
        location: "On Mrs. Maple's old desk",
        significance: "Connected to the phone with simple wires that a child could manage",
        puzzleType: "gear"
      },
      {
        item: "Child's drawing",
        location: "Hidden in a fairy tale book",
        significance: "Shows Billy, Ms. Rose, and Mr. Pine working together with hearts drawn around them",
        puzzleType: "logic"
      },
      {
        item: "Library key",
        location: "Found in Mr. Pine's misplaced mailbag",
        significance: "Ms. Rose lent it to Mr. Pine to help set up the surprise",
        puzzleType: "spatial"
      },
      {
        item: "Handwritten note",
        location: "Inside the music box",
        significance: "Mrs. Maple's note explaining her gift and thanking her friends for helping",
        puzzleType: "sequence"
      }
    ],
    solution: "All three suspects were working together on a kind mission! Billy Maple asked Ms. Rose and Mr. Pine to help him fulfill his aunt's wish to leave a special gift for the town's children. They set up the music box to call Detective Sam at midnight because Mrs. Maple wrote in her note that 'midnight is when magic happens, and Sam always solves mysteries with his heart.' The cookie crumbs were from Ms. Rose bringing snacks while they worked. The mailbag was left behind by Mr. Pine in their rush to finish before midnight. Billy drew the picture showing their teamwork. It wasn't a crime—it was a celebration of community kindness!",
    theme: {
      primary: "#2d5a8f",
      secondary: "#5b8fc4",
      background: "linear-gradient(135deg, #1a3a5c 0%, #2d5a8f 100%)"
    },
    tier: "jr-detective"
  },
  {
    id: 2,
    title: "Blood on the Tracks",
    hook: "The midnight express to Ravencrest never reached its destination. One passenger lies dead in a locked compartment, and the killer is still aboard.",
    setting: "The Orient Star Express, a luxurious steam train cutting through a snowy mountain pass. Mahogany-paneled compartments, a dining car with crystal chandeliers, and narrow corridors where shadows linger. The train is stranded between stations after an avalanche blocks the tracks ahead.",
    story: "Victor Castellane, a wealthy art dealer, was found dead in his first-class compartment at 2 AM. The door was locked from the inside, the window secured. A crimson stain spreads across his white shirt—but it's not blood. It's wine from a shattered bottle of 1947 Château Margaux, worth more than most passengers earn in a year. The real cause of death? Poison in his evening nightcap.\n\nThe train's passenger manifest reveals an interesting cast: Castellane's bitter ex-partner, a mysterious art thief, a struggling artist he'd bankrupted, and a private investigator who'd been following him for weeks. Each had means, motive, and opportunity during the dinner service when the poison was administered. But the locked room presents a puzzle—how did the killer escape?\n\nAs the storm howls outside and the passengers grow restless, evidence emerges: a forged ticket, a secret passage between compartments, threatening letters hidden in luggage, and a valuable painting that's missing from Castellane's collection. The train's conductor insists everyone remained in the dining car during dinner except for brief bathroom visits. Yet someone had time to poison the nightcap that Castellane's porter delivered to his room at 10 PM. The truth lies in reconstructing the timeline and understanding the train's hidden architecture.",
    characters: [
      {
        name: "Helena Strand",
        role: "Castellane's former business partner",
        motive: "Castellane cheated her out of millions in their gallery partnership",
        suspicious: ["argued with victim at dinner", "has pharmacy background"]
      },
      {
        name: "Marcus 'The Phantom' Devereaux",
        role: "Renowned art thief",
        motive: "Castellane possessed evidence that could send him to prison",
        suspicious: ["traveling under false identity", "seen near victim's compartment"]
      },
      {
        name: "Sarah Chen",
        role: "Artist whose career Castellane destroyed",
        motive: "Castellane exposed her paintings as forgeries, ruining her reputation",
        suspicious: ["carrying suspicious chemicals for her art", "has master key to compartments"]
      },
      {
        name: "Detective Raymond Cross",
        role: "Private investigator",
        motive: "Was hired to investigate Castellane for fraud",
        suspicious: ["too knowledgeable about the crime", "access to poison through cases"]
      },
      {
        name: "Thomas Webb",
        role: "Train porter",
        motive: "Castellane threatened to have him fired over a minor mistake",
        suspicious: ["delivered the poisoned drink", "has keys to all compartments"]
      }
    ],
    evidenceTrail: [
      {
        item: "Poisoned nightcap glass",
        location: "Victim's compartment nightstand",
        significance: "Contains traces of aconite, a rare poison derived from wolfsbane",
        puzzleType: "logic"
      },
      {
        item: "Torn train ticket",
        location: "Dining car floor",
        significance: "Forged ticket stub proving someone wasn't supposed to be on this train",
        puzzleType: "sequence"
      },
      {
        item: "Secret connecting door",
        location: "Behind wardrobe in adjacent compartment",
        significance: "Allows movement between compartments without using the corridor",
        puzzleType: "spatial"
      },
      {
        item: "Threatening letters",
        location: "Hidden in victim's luggage",
        significance: "From multiple people, but one uses distinctive blue ink and artistic handwriting",
        puzzleType: "sequence"
      },
      {
        item: "Porter's delivery log",
        location: "Service compartment",
        significance: "Shows the nightcap was prepared in the kitchen, but log entries are inconsistent",
        puzzleType: "logic"
      },
      {
        item: "Missing painting",
        location: "Originally in victim's secure case, now gone",
        significance: "Worth $2 million, but thief left other valuables untouched",
        puzzleType: "gear"
      },
      {
        item: "Pharmacy vial",
        location: "Dropped in narrow corridor outside victim's compartment",
        significance: "Contains residue matching the poison, has partial label with artistic flourish",
        puzzleType: "mirror"
      }
    ],
    solution: "Sarah Chen is the killer. Despite appearing to be a struggling artist, she was actually working with Marcus Devereaux to steal Castellane's painting—but decided to murder him for revenge. She used her compartment's secret connecting door (which she discovered during boarding) to access Castellane's room while everyone was at dinner. She poisoned the nightcap before the porter collected it from the kitchen, using her 'art supplies' as cover for the aconite. The threatening letter in blue ink matched her artistic handwriting. She took the painting through the secret passage. The locked room was never a puzzle—she simply returned to her own compartment through the hidden door. Her mistake was dropping the pharmacy vial when she heard someone in the corridor. Devereaux's forged ticket connects him as her accomplice, but he didn't commit murder—he was the distraction during dinner.",
    theme: {
      primary: "#4a0e0e",
      secondary: "#7a1d1d",
      background: "linear-gradient(135deg, #2b0808 0%, #4a0e0e 100%)"
    },
    tier: "detective"
  },
  {
    id: 3,
    title: "The Poisoned Pen",
    hook: "At an exclusive writers' retreat, words are weapons—and someone just committed murder with more than metaphor.",
    setting: "Thornfield Manor, a Gothic estate in the English countryside converted into a writers' retreat. Stone towers, a library with secret passages, fog-shrouded gardens, and a study where a bestselling author now lies dead over her manuscript.",
    story: "Dame Cordelia Blackwood, three-time Edgar Award winner, collapsed at her desk at precisely 11:47 PM, moments after announcing she would reveal 'a truth that would destroy careers' in her morning keynote. The manuscript beside her body contained allegations of plagiarism, ghostwriting scandals, and literary fraud spanning decades. Her fountain pen—engraved with the words 'The pen is mightier'—lay on the floor, ink still wet. Cause of death: ricin poisoning, delivered through her evening tea.\n\nThe five other authors at the retreat all had reasons to fear Blackwood's revelations. Each received an invitation with a cryptic message referencing their work. As the local inspector questions the suspects, it becomes clear that Blackwood was playing a deadly game—she'd been blackmailing her fellow authors for years, gathering secrets like ammunition. But blackmailers make enemies, and someone decided to write the final chapter.\n\nThe manor's labyrinthine layout provided countless opportunities for poisoning the tea. The victim's room connects to the library via a hidden bookcase door. The kitchen staff noticed someone in a dark coat near the tea service at 11 PM. A distinctive bookmark was left in Blackwood's manuscript at the chapter about one particular author. And most curious of all: pages from several suspects' notebooks have been torn out and burned in the fireplace. The solution requires decoding literary references, understanding the manor's secret passages, and recognizing that not all metaphors are innocent.",
    characters: [
      {
        name: "Jeremy Ashford",
        role: "Literary critic turned novelist",
        motive: "Blackwood discovered he plagiarized his acclaimed debut from an unknown writer",
        suspicious: ["has botany knowledge including poisonous plants", "argued with victim publicly"]
      },
      {
        name: "Natasha Volkov",
        role: "Thriller writer",
        motive: "Used ghostwriters for her bestsellers; Blackwood had proof",
        suspicious: ["expert in poisons from research", "was near the kitchen at 11 PM"]
      },
      {
        name: "Father Benedict Walsh",
        role: "Historical fiction author and defrocked priest",
        motive: "Blackwood knew about his hidden past and was going to expose it",
        suspicious: ["had access to ricin through church connections", "very nervous during questioning"]
      },
      {
        name: "Imogen Hart",
        role: "Romance novelist and Blackwood's former protégé",
        motive: "Blackwood stole her early manuscript and published it as her own",
        suspicious: ["inherited a fortune recently", "wearing dark coat that night"]
      },
      {
        name: "Dr. Malcolm Pierce",
        role: "True crime writer and former forensic pathologist",
        motive: "Blackwood was going to reveal he fabricated evidence in cases he wrote about",
        suspicious: ["medical knowledge to acquire and use ricin", "left the dinner early"]
      }
    ],
    evidenceTrail: [
      {
        item: "Poisoned teacup",
        location: "On victim's desk",
        significance: "Contains traces of ricin in the Earl Grey blend served at 11 PM",
        puzzleType: "logic"
      },
      {
        item: "Coded bookmark",
        location: "In manuscript at chapter titled 'The Ghost Behind the Words'",
        significance: "Contains cipher pointing to one author's name when decoded",
        puzzleType: "sequence"
      },
      {
        item: "Hidden manuscript",
        location: "Behind secret bookcase in library",
        significance: "Original draft of Blackwood's first novel—in different handwriting",
        puzzleType: "spatial"
      },
      {
        item: "Burned notebook pages",
        location: "Fireplace in common room",
        significance: "Partially legible notes about confronting Blackwood, written in distinctive script",
        puzzleType: "mirror"
      },
      {
        item: "Tea service schedule",
        location: "Kitchen log",
        significance: "Shows tea was prepared by kitchen staff but picked up by someone else",
        puzzleType: "sequence"
      },
      {
        item: "Ricin vial",
        location: "Hidden in a hollowed-out book in the library",
        significance: "Book is titled 'The Garden of Good and Evil'—same as one author's dissertation",
        puzzleType: "gear"
      },
      {
        item: "Invitation letters",
        location: "Each author's room",
        significance: "All contain literary references; one references 'castor beans' metaphorically",
        puzzleType: "logic"
      }
    ],
    solution: "Imogen Hart is the murderer. Blackwood didn't just steal her manuscript—she stole her entire debut novel, the one that made Blackwood famous. Imogen has spent twenty years watching Blackwood build a career on her stolen work while she struggled in obscurity. The bookmark cipher spelled out 'HART'S REVENGE' when decoded. She used the secret library passage to access the tea service, having studied the manor's layout from Gothic romance research. The dark coat seen near the kitchen was hers. She prepared the ricin from castor beans weeks ago (her invitation referenced this as a clue she left deliberately—wanting to prove she was smarter than Blackwood). The burned pages were from her original manuscript, which she destroyed after poisoning Blackwood, believing they might connect her to the crime. Her fatal error: the hidden manuscript behind the bookcase contained her handwriting. She didn't know Blackwood kept the original as 'insurance.' The pen name 'Cordelia Blackwood' was meant to be shared—it was Imogen's idea—but Blackwood betrayed her and took everything.",
    theme: {
      primary: "#2d1b3d",
      secondary: "#4a2d5c",
      background: "linear-gradient(135deg, #1a0f26 0%, #2d1b3d 100%)"
    },
    tier: "detective"
  },
  {
    id: 4,
    title: "Ashes to Ashes",
    hook: "The Meridian Tower burned for three hours before collapsing. Twenty-three floors of financial records turned to ash. Arson investigators say it was deliberate. Forensic accountants say it was necessary—for someone.",
    setting: "New York City's financial district, where the skeletal remains of Meridian Tower still smolder. The headquarters of Meridian Capital Management, a hedge fund managing $4.7 billion in assets. Glass, steel, and secrets—now all melted together. The investigation spans boardrooms, offshore accounts, and a very convenient fire.",
    story: "The fire started simultaneously on three floors: the 15th (IT and servers), 18th (accounting), and 22nd (executive offices). Accelerant patterns suggest professional work. But this wasn't just arson—it was financial murder. The building's suppression system was disabled from the inside. The backup servers were physically destroyed before the fire started. And buried in the rubble of the 22nd floor: CFO Martin Greer's body, shot twice in the chest.\n\nMeridian Capital was one week away from a federal audit that would have exposed a Ponzi scheme orchestrated over eight years. The fund's returns were fabricated. Client money was being used to pay other clients—a classic fraud that required constant new investment to sustain. But someone got greedy. Recent offshore transfers totaling $847 million disappeared into shell companies in the Cayman Islands, Singapore, and Dubai. The SEC was closing in. Someone needed to destroy the evidence—and eliminate anyone who could testify.\n\nThe suspect list reads like a Who's Who of financial crime: the charismatic CEO who recruited wealthy clients, the head trader who forged the returns, the compliance officer who looked the other way, the IT director who had access to everything, and an external auditor who'd been taking bribes for years. Each moved money in the days before the fire. Each had the skills to plan a cover-up. And each had enough stolen wealth to disappear forever—if they weren't caught. The investigation requires untangling complex financial records, understanding offshore banking, and recognizing that the biggest clue isn't what burned, but what survived.",
    characters: [
      {
        name: "Jonathan Meridian",
        role: "CEO and founder of Meridian Capital",
        motive: "Orchestrated the Ponzi scheme; facing life in prison",
        suspicious: ["transferred $320M offshore days before fire", "traveled to Dubai suspiciously"]
      },
      {
        name: "Rebecca Chow",
        role: "Head Trader and Chief Investment Officer",
        motive: "Created the fraudulent trading records that hid the scheme",
        suspicious: ["forged documents for years", "recently purchased property in Singapore"]
      },
      {
        name: "David Koslow",
        role: "Director of IT and Security",
        motive: "Had technical skills to disable fire suppression and destroy servers",
        suspicious: ["disabled security cameras before fire", "unusual server access before incident"]
      },
      {
        name: "Patricia Hammond",
        role: "Chief Compliance Officer",
        motive: "Covered up irregularities; accepted bribes totaling $2.3M",
        suspicious: ["falsified compliance reports", "has ties to known arsonist"]
      },
      {
        name: "Marcus Chen",
        role: "External auditor from Whitestone Partners",
        motive: "Approved fraudulent audits for kickbacks; would lose everything if exposed",
        suspicious: ["forensic fire investigation training from past career", "moved $150M through shell companies"]
      },
      {
        name: "Martin Greer (deceased)",
        role: "Chief Financial Officer",
        motive: "Knew everything about the fraud; was cooperating with federal investigators",
        suspicious: ["had copies of unaltered records", "scheduled to testify"]
      }
    ],
    evidenceTrail: [
      {
        item: "Ballistics report",
        location: "Medical examiner's office",
        significance: "Greer was killed with a 9mm handgun; bullet matches gun registered to Patricia Hammond",
        puzzleType: "logic"
      },
      {
        item: "Offshore transfer records",
        location: "Recovered from backup cloud server no one knew existed",
        significance: "Shows $847M moved through shell companies; one transaction reversed hours before fire",
        puzzleType: "sequence"
      },
      {
        item: "Fire suppression override log",
        location: "Fire department investigation files",
        significance: "System disabled using Koslow's credentials from inside the building at 2:47 AM",
        puzzleType: "gear"
      },
      {
        item: "Security camera footage",
        location: "Building across the street",
        significance: "Shows someone leaving Meridian Tower at 3:15 AM, 12 minutes before fire started",
        puzzleType: "mirror"
      },
      {
        item: "Accelerant analysis",
        location: "Fire marshal's report",
        significance: "Commercial-grade accelerant used, purchased from supplier with records showing Hammond's signature",
        puzzleType: "logic"
      },
      {
        item: "Encrypted USB drive",
        location: "Found in Greer's home safe",
        significance: "Contains complete audit trail proving the fraud—and evidence Hammond was planning the fire",
        puzzleType: "sequence"
      },
      {
        item: "Phone records",
        location: "Federal warrant execution",
        significance: "Calls between Hammond and Koslow increased dramatically in weeks before fire; final call at 2:30 AM on fire night",
        puzzleType: "spatial"
      }
    ],
    solution: "Patricia Hammond murdered Martin Greer and orchestrated the arson with assistance from David Koslow. The fraud was Meridian's and Chow's creation, but Hammond discovered Greer was cooperating with investigators. She panicked and decided to destroy all evidence—and eliminate Greer, who could testify against her personally for accepting bribes. She recruited Koslow by threatening to expose his embezzlement of IT funds. Together they planned: Koslow disabled security and fire suppression using his credentials; Hammond shot Greer in his office at 2:45 AM using her registered firearm; they planted accelerant on three strategic floors; Hammond left at 3:15 AM (caught on external camera); Koslow set timers and left through service entrance at 3:20 AM; the building burned at 3:27 AM. The reversed offshore transaction was Hammond moving $40M back to avoid looking suspicious—but it created a digital trail. The encrypted drive Greer hid contained evidence Hammond was planning the fire, including messages where she researched arson techniques. The ballistics match was decisive. Hammond believed the fire would destroy everything, but Greer's paranoia—keeping backups at home—became his posthumous revenge. Koslow is cooperating; Hammond faces murder one, arson, and conspiracy charges.",
    theme: {
      primary: "#1a0f0a",
      secondary: "#3d1f0f",
      background: "linear-gradient(135deg, #0a0504 0%, #1a0f0a 100%)"
    },
    tier: "master-detective"
  },
  {
    id: 5,
    title: "The Double Cross",
    hook: "In the world of espionage, everyone lies. But when a double agent winds up dead in a safe house, even the lies start to contradict each other. MI6 wants answers. The CIA wants silence. And someone wants you dead for asking questions.",
    setting: "London and Prague, spanning safe houses, embassy back rooms, and dead drop locations. The investigation moves through layered identities, encrypted communications, and a world where trust is currency and betrayal is business. The late autumn rain never stops falling.",
    story: "Codename RAVEN—real name Alexei Volkov—was found dead in a Camden safe house, killed by a single injection of succinylcholine, a paralytic agent favored by professional assassins. Volkov was playing all sides: officially a Russian SVR officer, he was feeding intelligence to MI6 while simultaneously working for the CIA and possibly selling secrets to a fourth party unknown. His death came hours before a scheduled exchange of documents that would have exposed a mole inside Western intelligence—a mole at the highest levels.\n\nThe safe house was impenetrable. Entry required three separate security measures, all triggered properly by authorized credentials. The cameras showed Volkov entering alone at 11 PM. At 11:47 PM, the feed cut out for exactly 90 seconds—long enough for murder. When it resumed, Volkov was dead and the room was empty. No one entered or left during the blackout. His encrypted phone was missing. The documents he'd promised to deliver were gone. And the USB drive hidden in his apartment contained a list of names—all high-ranking intelligence officers, one of whom is the traitor.\n\nFive people had authorization for that safe house. Each is a veteran operative. Each has a cover story for the night Volkov died. Each has motive to keep their own secrets buried. And each has the skills to commit an impossible murder. The investigation reveals a conspiracy spanning three intelligence agencies, $40 million in redirected black ops funding, weapons shipments to terrorists, and a decade-long operation to manipulate intelligence that led to political assassinations across Europe. The question isn't just who killed Volkov—it's whether you can survive learning the answer.",
    characters: [
      {
        name: "Director Elizabeth Frost",
        role: "MI6 Section Chief, Russia Desk",
        motive: "Was Volkov's handler; if he exposed her negligence, her career ends",
        suspicious: ["authorized the safe house", "was in London the night of murder"]
      },
      {
        name: "James Blackwell",
        role: "MI6 Field Agent, Frost's protégé",
        motive: "Heavily in debt; evidence suggests he's been selling intelligence",
        suspicious: ["had safe house access codes", "met with Russian embassy contact days before murder"]
      },
      {
        name: "Marcus Webb",
        role: "CIA Station Chief, London",
        motive: "The mole operation was his; Volkov's evidence would destroy him",
        suspicious: ["expert in surveillance tech", "his name is on Volkov's list"]
      },
      {
        name: "Dr. Nadia Khoury",
        role: "MI6 Technical Officer, signals intelligence",
        motive: "Designed security systems; knows how to defeat them",
        suspicious: ["has access to all safe house schematics", "disappeared for 3 hours on murder night"]
      },
      {
        name: "Colonel Viktor Sergeyev",
        role: "Russian SVR, secretly cooperating with MI6",
        motive: "Was Volkov's superior; feared Volkov would expose his cooperation with West",
        suspicious: ["trained in assassination techniques", "entered UK under diplomatic cover the day before murder"]
      },
      {
        name: "Thomas Ashford",
        role: "MI6 Counter-intelligence Director",
        motive: "The mole investigation threatened to expose his own corruption",
        suspicious: ["has override access to all surveillance systems", "$12M in offshore accounts"]
      }
    ],
    evidenceTrail: [
      {
        item: "Surveillance blackout analysis",
        location: "Technical forensics report",
        significance: "90-second gap was triggered by override code known only to three people; traced to internal terminal",
        puzzleType: "gear"
      },
      {
        item: "Succinylcholine syringe",
        location: "Found in ventilation system above safe house",
        significance: "Pharmaceutical grade; supply traced to CIA medical facility in Prague",
        puzzleType: "logic"
      },
      {
        item: "Volkov's encrypted files",
        location: "Recovered from cloud backup he didn't tell anyone about",
        significance: "Contains audio recordings of meetings—proving someone lied about never meeting him",
        puzzleType: "sequence"
      },
      {
        item: "Safe house entry logs",
        location: "MI6 security database",
        significance: "Show someone used Blackwell's credentials to enter building 30 minutes before Volkov—but Blackwell was photographed at a restaurant across town",
        puzzleType: "spatial"
      },
      {
        item: "Financial transaction records",
        location: "GCHQ intercept of offshore banking data",
        significance: "Payment of $500K made from shell company to Swiss account two days before murder; account holder encrypted but partially traceable",
        puzzleType: "mirror"
      },
      {
        item: "Dead drop photograph",
        location: "Surveillance of Prague location",
        significance: "Shows two people meeting who claim to have never met; one is clearly visible, one's face obscured but wears distinctive ring",
        puzzleType: "sequence"
      },
      {
        item: "Ventilation shaft blueprints",
        location: "Building architect's files",
        significance: "Shows safe house has accessible shaft from adjacent building—unknown to most; Khoury designed the security and would know this",
        puzzleType: "spatial"
      },
      {
        item: "Diplomatic travel records",
        location: "Foreign Office database",
        significance: "Sergeyev entered UK using diplomatic credentials he shouldn't have—someone inside approved it",
        puzzleType: "logic"
      }
    ],
    solution: "The conspiracy runs deeper than a single killer. Marcus Webb is the mole—he's been running a rogue operation selling intelligence and weapons to terrorist organizations through shell companies, generating $40M over ten years. Thomas Ashford discovered this two years ago and became his partner, providing cover from internal investigations. When Volkov threatened to expose them, they planned his assassination together. Dr. Nadia Khoury is the actual killer—Webb recruited her by threatening to expose her brother's connections to Hezbollah unless she cooperated. She used her technical expertise to create the surveillance blackout using Ashford's override codes. She accessed the safe house through the ventilation shaft from the adjacent building (which she learned about when designing security), dropped through the ceiling during the blackout, injected Volkov with succinylcholine from CIA medical supplies Webb provided, took his phone and documents, and escaped back through the shaft. The staged entry log using Blackwell's stolen credentials was a misdirection. The Swiss payment was Webb paying Khoury. The Prague photograph shows Webb and Ashford meeting—Webb's distinctive Masonic ring visible. Sergeyev's suspicious entry was actually approved by Frost as part of a separate operation to flip him; he's innocent. Blackwell's Russian contact was investigating Webb independently—also innocent. The audio recordings prove Webb and Ashford met with Volkov multiple times while denying it. All three conspirators are arrested; Khoury agrees to testify against the others in exchange for reduced charges. The real horror: the intelligence they sold led to six political assassinations across Europe and two terrorist attacks. The body count is far higher than one dead spy.",
    theme: {
      primary: "#0d1b2a",
      secondary: "#1b263b",
      background: "linear-gradient(135deg, #020407 0%, #0d1b2a 100%)"
    },
    tier: "master-detective"
  }
];
