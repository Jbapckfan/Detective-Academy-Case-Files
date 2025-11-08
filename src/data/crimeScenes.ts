export interface CrimeSceneClue {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position (0-100)
  y: number; // percentage position (0-100)
  size: number; // pixels
  foundMessage: string;
}

export interface CrimeSceneData {
  caseId: number;
  sceneName: string;
  description: string;
  clues: CrimeSceneClue[];
  requiredClues: number;
}

export const crimeScenes: Record<number, CrimeSceneData> = {
  1: { // The Midnight Caller
    caseId: 1,
    sceneName: "Whispering Pines Library - After Hours",
    description: "The old library sits quiet and dark. Mrs. Maple's desk is covered in books and papers. A music box plays softly in the corner. Look around carefully - there are clues hidden everywhere!",
    requiredClues: 4,
    clues: [
      {
        id: "music-box",
        name: "Music Box on Desk",
        description: "An old wooden music box sits on Mrs. Maple's desk, wired to an old rotary telephone. The mechanism is simple enough for a child to understand. It's playing the same lullaby from the phone calls!",
        x: 30,
        y: 45,
        size: 60,
        foundMessage: "The music box is connected to the phone system - this is how the calls were made!"
      },
      {
        id: "cookie-trail",
        name: "Cookie Crumbs",
        description: "A trail of fresh cookie crumbs leads from the entrance to the desk. They smell like Ms. Rose's famous snickerdoodles! Someone was here recently, and they brought snacks.",
        x: 50,
        y: 70,
        size: 50,
        foundMessage: "Ms. Rose was definitely here - these are her special recipe cookies!"
      },
      {
        id: "mailbag",
        name: "Mr. Pine's Mailbag",
        description: "A canvas mailbag with 'US MAIL' printed on the side sits forgotten near the children's section. Inside you find a library key and some undelivered letters. Mr. Pine must have left in a hurry!",
        x: 75,
        y: 35,
        size: 55,
        foundMessage: "Mr. Pine was here too! He had Ms. Rose's library key to help set things up."
      },
      {
        id: "drawing",
        name: "Child's Drawing in Book",
        description: "Hidden inside a copy of 'Cinderella,' you find a crayon drawing. It shows three smiling figures - Ms. Rose, Mr. Pine, and Billy - with hearts all around them. At the bottom it says 'For the kids ♥'",
        x: 15,
        y: 55,
        size: 50,
        foundMessage: "Billy drew this! They were all working together on something special for the children."
      },
      {
        id: "note",
        name: "Mrs. Maple's Note",
        description: "A handwritten note inside the music box reads: 'Dear Sam, Midnight is when magic happens. Thank you for always solving mysteries with your heart. These books are for the children to discover and dream. - Mrs. Maple'",
        x: 30,
        y: 25,
        size: 45,
        foundMessage: "Mrs. Maple planned this whole treasure hunt! She wanted Detective Sam to find her gift."
      },
      {
        id: "storybooks",
        name: "Rare Storybook Collection",
        description: "Behind Mrs. Maple's desk, you discover a carefully wrapped collection of rare children's storybooks - first editions of classic fairy tales, adventure stories, and fables. Each has a card: 'For the children of Whispering Pines'",
        x: 25,
        y: 65,
        size: 65,
        foundMessage: "This is the surprise! Mrs. Maple left these treasured books as a gift to the town's children."
      }
    ]
  },

  2: { // Blood on the Tracks
    caseId: 2,
    sceneName: "Luxury Train - Compartment 5C",
    description: "The victim's compartment is a scene of elegant chaos. A half-empty glass sits on the nightstand. Medical supplies are scattered across the floor. The door shows signs of forced entry... or does it?",
    requiredClues: 5,
    clues: [
      {
        id: "medicine-vial",
        name: "Empty Medicine Vial",
        description: "A small glass vial labeled 'Sedative - Hospital Use Only' lies under the bed. The pharmacy label shows it was dispensed to Dr. Sarah Chen three days ago. The seal has been broken and it's completely empty.",
        x: 45,
        y: 75,
        size: 45,
        foundMessage: "Dr. Chen had access to sedatives powerful enough to sedate someone quickly."
      },
      {
        id: "secret-passage",
        name: "Hidden Panel",
        description: "Behind a decorative wall panel, you discover a narrow passage between compartments. It's just wide enough for one person. The edges show fresh scratches - someone used this recently.",
        x: 15,
        y: 50,
        size: 70,
        foundMessage: "The killer used this secret passage! They didn't need to use the door at all."
      },
      {
        id: "train-schedule",
        name: "Altered Train Schedule",
        description: "A printed schedule sits on the desk with handwritten notes. Times have been circled and routes highlighted. One note reads: '10:47 PM - Chicago stop - 15 minutes.' The train stops here for exactly the window needed.",
        x: 60,
        y: 35,
        size: 55,
        foundMessage: "Someone planned this carefully, knowing exactly when the train would stop."
      },
      {
        id: "glove-fragment",
        name: "Torn Surgical Glove",
        description: "A piece of latex surgical glove is caught in the secret passage hinge. It's the same type used by medical professionals. There's a small embroidered mark - the hospital logo.",
        x: 20,
        y: 45,
        size: 40,
        foundMessage: "A medical professional used this passage - likely Dr. Chen!"
      },
      {
        id: "briefcase",
        name: "Victor's Locked Briefcase",
        description: "The victim's briefcase lies open, papers scattered. Financial documents show damaging evidence about Dr. Chen's research fraud. One memo is highlighted: 'Evidence to be presented at medical board - Dr. S. Chen.'",
        x: 75,
        y: 60,
        size: 65,
        foundMessage: "Victor Stone was going to expose Dr. Chen's fraud! That's a powerful motive for murder."
      },
      {
        id: "compartment-map",
        name: "Train Compartment Blueprint",
        description: "A folded blueprint of the train car shows all compartments. The secret passage between 5C and 4A is marked in red pencil. Someone studied this carefully before acting.",
        x: 50,
        y: 20,
        size: 50,
        foundMessage: "The killer pre-planned the route using this blueprint!"
      },
      {
        id: "timepiece",
        name: "Stopped Pocket Watch",
        description: "Victor's gold pocket watch stopped at exactly 10:52 PM - likely when he was attacked. The crystal is cracked, suggesting a struggle.",
        x: 70,
        y: 45,
        size: 45,
        foundMessage: "This gives us the precise time of death - 10:52 PM during the Chicago stop."
      }
    ]
  },

  3: { // The Poisoned Pen
    caseId: 3,
    sceneName: "Ashwood Writers Retreat - Marcus Thorne's Study",
    description: "The renowned author's study reeks of bitter almonds. A teacup sits beside his typewriter, manuscript pages scattered everywhere. Books line the walls. Something here tells the story of betrayal and revenge.",
    requiredClues: 5,
    clues: [
      {
        id: "tea-cup",
        name: "Poisoned Teacup",
        description: "A delicate china teacup with a few drops of tea remaining. The liquid has a suspicious oily residue and smells faintly of bitter almonds - cyanide. The cup is part of the house's serving set, accessible to all guests.",
        x: 40,
        y: 40,
        size: 50,
        foundMessage: "This is definitely cyanide poisoning. The poison was added to Marcus's tea."
      },
      {
        id: "manuscript",
        name: "Marcus's Latest Manuscript",
        description: "The manuscript for 'Echoes of Vengeance' sits by the typewriter. Chapter 3 is open - a scene about plagiarism and a writer's revenge. Red ink notes in the margin read: 'Too close to the truth - I.H.'",
        x: 45,
        y: 55,
        size: 60,
        foundMessage: "Imogen Hart left notes on the manuscript! She was here recently."
      },
      {
        id: "bookmark-cipher",
        name: "Cryptic Bookmark",
        description: "A leather bookmark fallen between books has letters embossed on it: H-A-R-T-S-R-E-V-E-N-G-E. It's not random - this is a message spelling 'HARTS REVENGE' when read correctly!",
        x: 75,
        y: 30,
        size: 45,
        foundMessage: "Imogen Hart left a bookmark message: 'HART'S REVENGE' - she's telling us her motive!"
      },
      {
        id: "burned-pages",
        name: "Partially Burned Papers",
        description: "In the fireplace, you find partially burned manuscript pages. The writing style is different from Marcus's published work - more emotional, more personal. The author's name was torn off, but one page says 'by I. Hart - 1998'",
        x: 20,
        y: 70,
        size: 70,
        foundMessage: "These are Imogen's original pages! Marcus stole her work decades ago."
      },
      {
        id: "publishing-contract",
        name: "Old Publishing Contract",
        description: "A yellowed contract from 1998 in Marcus's desk drawer. It's for 'Echoes of Tomorrow' (Marcus's breakout novel) but the original author line has been whited out. Under UV light, 'Imogen Hart' is faintly visible.",
        x: 85,
        y: 55,
        size: 55,
        foundMessage: "Proof! Marcus erased Imogen's name and published her novel as his own."
      },
      {
        id: "library-record",
        name: "Library Secret Compartment",
        description: "Behind a row of books, there's a hidden compartment containing a key and a note: 'Access to garden shed - cyanide storage for photography.' The note is signed by the retreat's groundskeeper.",
        x: 15,
        y: 35,
        size: 60,
        foundMessage: "Imogen knew about the cyanide in the photography shed! She had access."
      },
      {
        id: "guest-registry",
        name: "Guest Sign-In Log",
        description: "The retreat's guest log shows Imogen Hart arriving two days before Marcus. Her signature is shaky, angry. Below her name she wrote: 'Justice delayed is justice denied - but not today.'",
        x: 60,
        y: 70,
        size: 50,
        foundMessage: "Imogen planned this in advance. She came early to prepare her revenge."
      }
    ]
  },

  4: { // Ashes to Ashes
    caseId: 4,
    sceneName: "Meridian Tower - 22nd Floor Crime Scene",
    description: "The acrid smell of smoke still hangs in the air. Firefighters have cleared the scene, but evidence remains. This wasn't just a fire - this was arson covering up something far worse. Corporate conspiracy written in ash and destruction.",
    requiredClues: 6,
    clues: [
      {
        id: "accelerant",
        name: "Accelerant Pattern",
        description: "Burn patterns on the floor show a deliberate trail of industrial accelerant leading from the server room to the executive offices. The pattern is professional - someone knew exactly how fire spreads in an office building.",
        x: 50,
        y: 60,
        size: 65,
        foundMessage: "This fire was set deliberately using professional knowledge of fire dynamics."
      },
      {
        id: "offshore-docs",
        name: "Recovered Financial Records",
        description: "Water-damaged printouts from a hidden backup server show $847 million transferred through shell companies. One transaction was reversed hours before the fire - someone tried to hide the money trail.",
        x: 30,
        y: 45,
        size: 55,
        foundMessage: "Massive fraud! Hammond and Koslow were embezzling hundreds of millions."
      },
      {
        id: "suppression-log",
        name: "Fire Suppression Override",
        description: "The building's fire suppression system control panel shows a manual override at 2:47 AM using Security Director Koslow's credentials. The system was deliberately disabled from inside the building.",
        x: 70,
        y: 35,
        size: 60,
        foundMessage: "Koslow disabled the fire suppression system so the fire would spread!"
      },
      {
        id: "camera-footage",
        name: "Security Camera Backup",
        description: "Footage from a camera across the street shows someone leaving Meridian Tower at 3:15 AM - 12 minutes before the fire was reported. The figure matches CFO Hammond's build and distinctive walk.",
        x: 15,
        y: 55,
        size: 50,
        foundMessage: "Hammond left the building just before the fire started - he was there!"
      },
      {
        id: "ceo-evidence",
        name: "CEO's Hidden USB Drive",
        description: "In the CEO's melted safe, a heat-resistant USB drive survived. It contains proof of fraud and a video confession: 'If you're watching this, Hammond and Koslow have killed me. Here's everything.'",
        x: 45,
        y: 25,
        size: 70,
        foundMessage: "The CEO knew he was in danger and left evidence! This proves premeditated murder."
      },
      {
        id: "koslow-access",
        name: "Access Card Log",
        description: "Digital access logs show Koslow's security card was used to access the 22nd floor at 2:45 AM, then the basement at 3:10 AM (where the fire started), then the parking garage at 3:14 AM. He was setting the fire!",
        x: 85,
        y: 50,
        size: 55,
        foundMessage: "Koslow's movements match the arson pattern perfectly. He set the fire!"
      },
      {
        id: "blueprints",
        name: "Building Blueprints with Marks",
        description: "Architectural blueprints of Meridian Tower with red X marks on floors 15, 18, and 22 - exactly where accelerant was placed. The blueprint was in Hammond's office safe.",
        x: 60,
        y: 70,
        size: 60,
        foundMessage: "Hammond planned the exact locations for the fire. This was a conspiracy!"
      }
    ]
  },

  5: { // The Double Cross
    caseId: 5,
    sceneName: "Prague Safe House - Scene of the Impossible",
    description: "The room is hermetically sealed. Security footage shows no one entering or leaving. Yet Ambassador Petrov lies dead inside, three gunshot wounds. The walls whisper of betrayal, double agents, and an impossible murder.",
    requiredClues: 7,
    clues: [
      {
        id: "sealed-room",
        name: "Hermetic Seal Evidence",
        description: "The room's seals are intact - magnetic sensors, pressure monitors, even the air filtration system shows no breach. Every security measure confirms no one could have entered conventionally. Yet someone did.",
        x: 50,
        y: 30,
        size: 50,
        foundMessage: "The room was legitimately sealed. The killer used an unconventional entry method."
      },
      {
        id: "ventilation",
        name: "Ventilation Shaft Access",
        description: "The air shaft is just wide enough for a small person. Fresh scratches on the grate, a torn piece of black fabric, and disturbed dust show recent passage. The shaft connects to the building next door.",
        x: 20,
        y: 20,
        size: 60,
        foundMessage: "The killer entered through the ventilation system! This requires intimate knowledge of the safe house."
      },
      {
        id: "bullets",
        name: "Specialized Ammunition",
        description: "The bullets are custom-made subsonic rounds used exclusively by intelligence agencies. Ballistics show they came from a CIA-issued weapon - one reported missing 6 months ago from Agent Khoury's assignment.",
        x: 45,
        y: 55,
        size: 45,
        foundMessage: "These are CIA bullets from Khoury's missing weapon! She's directly involved."
      },
      {
        id: "encrypted-message",
        name: "Decoded Transmission",
        description: "An encrypted message on Petrov's phone, timestamp manipulated to look like it came after his death: 'Meet Webb at checkpoint. Bring the files.' The encryption key matches MI6's Ashford's signature pattern.",
        x: 65,
        y: 45,
        size: 55,
        foundMessage: "Ashford manipulated the timeline! He's involved in framing someone or covering tracks."
      },
      {
        id: "photograph",
        name: "Surveillance Photo",
        description: "A photo from Prague two weeks ago shows Agent Webb and Ambassador Petrov in a heated argument outside a cafe. Webb is pointing at Petrov threateningly. The photo was taken by... CIA surveillance.",
        x: 35,
        y: 70,
        size: 60,
        foundMessage: "Webb and Petrov had a confrontation. The CIA was surveilling their own agent!"
      },
      {
        id: "double-agent-file",
        name: "Classified Dossier",
        description: "A hidden file marked 'ULTRA TOP SECRET' identifies Webb as a double agent working for Russian intelligence since 2019. But the file is fake - forensic analysis shows it was created last week by... Ashford's computer.",
        x: 75,
        y: 60,
        size: 65,
        foundMessage: "Ashford created false evidence to frame Webb! This is a cover-up conspiracy."
      },
      {
        id: "safe-house-plans",
        name: "Architectural Blueprints",
        description: "Original safe house blueprints show the ventilation route. The plans are marked 'Restricted - MI6 Only' and have coffee stains from Ashford's favorite café. Someone with MI6 clearance planned this murder.",
        x: 85,
        y: 40,
        size: 50,
        foundMessage: "Only MI6 had these plans. Ashford provided them to the killer!"
      },
      {
        id: "conspiracy-evidence",
        name: "Tri-Agency Conspiracy Notes",
        description: "Hidden in Petrov's safe: notes detailing collusion between Webb (CIA), Ashford (MI6), and Khoury (CIA) to eliminate Petrov who discovered their illegal weapons sales to terrorist organizations. All three are conspirators!",
        x: 15,
        y: 65,
        size: 70,
        foundMessage: "The smoking gun! All three agents conspired to kill Petrov to hide their crimes."
      }
    ]
  }
};
