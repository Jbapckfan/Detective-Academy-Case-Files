// Investigation Types
type InvestigationType = 'fingerprint' | 'timeline' | 'document' | 'evidence-match';

interface Investigation {
  id: string;
  type: InvestigationType;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  storyContext: string;
  data: any;
  solution: any;
}

export interface CrimeSceneData {
  caseId: number;
  sceneName: string;
  description: string;
  investigations: Investigation[];
  requiredInvestigations?: number;
}

export const crimeScenes: Record<number, CrimeSceneData> = {
  1: { // The Midnight Caller
    caseId: 1,
    sceneName: "Whispering Pines Library - After Hours",
    description: "The old library sits quiet and dark. Mrs. Maple's desk is covered in books and papers. A music box plays softly in the corner. Conduct a thorough investigation to uncover the mystery!",
    requiredInvestigations: 3,
    investigations: [
      {
        id: "fingerprint-1",
        type: "fingerprint",
        title: "Music Box Analysis",
        difficulty: "easy",
        storyContext: "Match the fingerprint found on the music box mechanism to one of the suspects.",
        data: {
          evidence: {
            id: "evidence",
            pattern: "whorl",
            suspectName: "Unknown",
            details: "Lifted from the music box winding mechanism. Shows clear whorl pattern."
          },
          suspects: [
            { id: "billy", pattern: "arch", suspectName: "Billy Thorn", details: "The quiet maintenance worker" },
            { id: "rose", pattern: "whorl", suspectName: "Ms. Rose", details: "The local baker" },
            { id: "pine", pattern: "loop", suspectName: "Mr. Pine", details: "The mail carrier" },
            { id: "maple", pattern: "loop", suspectName: "Mrs. Maple", details: "The librarian" }
          ]
        },
        solution: { correctId: "rose" }
      },
      {
        id: "timeline-1",
        type: "timeline",
        title: "Reconstruct the Evening",
        difficulty: "medium",
        storyContext: "Arrange these events in the correct chronological order based on witness statements and evidence.",
        data: {
          events: [
            { id: "e1", time: "8:30 PM", description: "Library officially closes, Mrs. Maple locks the front door", order: 0 },
            { id: "e2", time: "9:15 PM", description: "Ms. Rose enters through side door with cookies and library key", order: 1 },
            { id: "e3", time: "10:00 PM", description: "Mr. Pine arrives with his mailbag and helps set up the music box", order: 2 },
            { id: "e4", time: "11:30 PM", description: "Billy finishes wiring the music box to the phone system", order: 3 },
            { id: "e5", time: "11:45 PM", description: "All three conspirators leave through the back exit", order: 4 },
            { id: "e6", time: "12:00 AM", description: "First mysterious phone call is placed automatically", order: 5 }
          ]
        },
        solution: {}
      },
      {
        id: "document-1",
        type: "document",
        title: "Mrs. Maple's Letter",
        difficulty: "easy",
        storyContext: "Analyze Mrs. Maple's letter to Detective Sam to find important clues.",
        data: {
          title: "Letter to Detective Sam",
          content: `Dear Detective Sam,

By the time you read this, you'll have received my midnight calls. Please don't be frightened - this is all part of a treasure hunt I've designed just for you.

I've watched you grow up in Whispering Pines, always solving little mysteries with such care and kindness. Now I'm giving you one final case to solve.

My dear friends Ms. Rose, Mr. Pine, and Billy have helped me prepare a special gift for the children of our town. The midnight calls will lead you to the library, where you'll find rare storybooks - first editions that I've collected over fifty years.

These books are my legacy to the children. But I wanted YOU to find them, Sam, because you've always understood that the best mysteries are solved with heart, not just logic.

The music box will play our special lullaby at midnight for one week. Follow the clues with kindness, and you'll discover the truth.

With love and one last mystery,
Mrs. Maple

P.S. The cookies are from Ms. Rose's special recipe. She insisted.`,
          questions: [
            {
              question: "Who helped Mrs. Maple set up the treasure hunt?",
              options: [
                "Only Billy Thorn",
                "Ms. Rose, Mr. Pine, and Billy Thorn",
                "Just Detective Sam",
                "The children of Whispering Pines"
              ],
              correctAnswer: 1
            },
            {
              question: "What is the 'treasure' that Mrs. Maple left?",
              options: [
                "A music box",
                "Money for Detective Sam",
                "Rare storybooks for the town's children",
                "Her house and property"
              ],
              correctAnswer: 2
            },
            {
              question: "How long will the music box play at midnight?",
              options: [
                "Forever",
                "One night only",
                "One week",
                "One month"
              ],
              correctAnswer: 2
            }
          ]
        },
        solution: {}
      },
      {
        id: "evidence-match-1",
        type: "evidence-match",
        title: "Connect the Clues",
        difficulty: "easy",
        storyContext: "Match each piece of evidence to the person it belongs to.",
        data: {
          evidence: [
            { id: "ev1", name: "Cookie Crumbs", description: "Trail of snickerdoodle cookies" },
            { id: "ev2", name: "Mail Bag", description: "Canvas bag with US MAIL printed on it" },
            { id: "ev3", name: "Electrical Wire", description: "Professional wiring tools and equipment" },
            { id: "ev4", name: "Child's Drawing", description: "Crayon drawing of three smiling people" }
          ],
          targets: [
            { id: "rose", name: "Ms. Rose (Baker)", correctEvidenceIds: ["ev1"] },
            { id: "pine", name: "Mr. Pine (Mail Carrier)", correctEvidenceIds: ["ev2"] },
            { id: "billy", name: "Billy Thorn (Maintenance)", correctEvidenceIds: ["ev3"] },
            { id: "all", name: "All Three Friends", correctEvidenceIds: ["ev4"] }
          ]
        },
        solution: {}
      }
    ]
  },

  2: { // Blood on the Tracks
    caseId: 2,
    sceneName: "Luxury Train - Compartment 5C",
    description: "The victim's compartment shows signs of a carefully planned murder. Medical supplies, hidden passages, and incriminating documents tell a dark story of revenge.",
    requiredInvestigations: 3,
    investigations: [
      {
        id: "fingerprint-2",
        type: "fingerprint",
        title: "Surgical Glove Fragment",
        difficulty: "medium",
        storyContext: "Match the fingerprint from inside the torn surgical glove to identify the killer.",
        data: {
          evidence: {
            id: "evidence",
            pattern: "loop",
            suspectName: "Unknown",
            details: "Partial print found inside the latex glove caught in the secret passage hinge."
          },
          suspects: [
            { id: "chen", pattern: "loop", suspectName: "Dr. Sarah Chen", details: "Surgeon with hospital access" },
            { id: "graves", pattern: "whorl", suspectName: "Rebecca Graves", details: "The business partner" },
            { id: "porter", pattern: "arch", suspectName: "Train Porter", details: "Staff member on duty" },
            { id: "marcus", pattern: "whorl", suspectName: "Marcus Webb", details: "Investment banker" }
          ]
        },
        solution: { correctId: "chen" }
      },
      {
        id: "timeline-2",
        type: "timeline",
        title: "Night of the Murder",
        difficulty: "hard",
        storyContext: "Reconstruct the timeline of events based on witness statements and physical evidence.",
        data: {
          events: [
            { id: "e1", time: "10:30 PM", description: "Victor Stone retires to his compartment, locks door from inside", order: 0 },
            { id: "e2", time: "10:42 PM", description: "Dr. Chen enters secret passage from compartment 4A", order: 1 },
            { id: "e3", time: "10:47 PM", description: "Train stops at Chicago station for scheduled 15-minute stop", order: 2 },
            { id: "e4", time: "10:50 PM", description: "Dr. Chen administers sedative to Victor through the passage panel", order: 3 },
            { id: "e5", time: "10:52 PM", description: "Victor's pocket watch stops during the struggle", order: 4 },
            { id: "e6", time: "10:55 PM", description: "Dr. Chen escapes back through passage, closing panel", order: 5 },
            { id: "e7", time: "11:02 PM", description: "Train departs Chicago station", order: 6 }
          ]
        },
        solution: {}
      },
      {
        id: "document-2",
        type: "document",
        title: "Victor's Evidence File",
        difficulty: "medium",
        storyContext: "Analyze the documents from Victor Stone's briefcase to understand the motive.",
        data: {
          title: "Research Fraud Investigation - Dr. Sarah Chen",
          content: `CONFIDENTIAL MEMORANDUM
Medical Board Investigation Division

Subject: Dr. Sarah Chen, MD - Research Misconduct

Investigation Summary:
Dr. Chen's groundbreaking cancer research published in 2021-2022 has been found to contain fabricated data. Three independent labs failed to replicate her results.

Key Findings:
- 67% of patient data appears falsified
- Control group results were statistically impossible
- Research funding of $8.4 million obtained through fraudulent claims
- Multiple peer reviewers flagged concerns that were ignored

Evidence collected by Victor Stone (Medical Ethics Investigator):
- Original lab notebooks showing data manipulation
- Emails proving Dr. Chen knew results were fraudulent
- Financial records of embezzled research funds

Scheduled Medical Board Hearing: March 15th
Presenter: Victor Stone

Recommended Actions:
- Revocation of medical license
- Criminal fraud charges
- Repayment of all research funding
- Permanent ban from medical research

This evidence will destroy Dr. Chen's career and reputation.`,
          questions: [
            {
              question: "What was Dr. Chen's motive for killing Victor Stone?",
              options: [
                "He was blackmailing her for money",
                "He discovered her research fraud and was going to expose her",
                "They had a personal romantic dispute",
                "He stole her research data"
              ],
              correctAnswer: 1
            },
            {
              question: "How much research funding did Dr. Chen obtain fraudulently?",
              options: [
                "$2 million",
                "$5.7 million",
                "$8.4 million",
                "$12 million"
              ],
              correctAnswer: 2
            },
            {
              question: "What would happen to Dr. Chen if Victor presented this evidence?",
              options: [
                "She would receive a warning",
                "She would lose her medical license and face criminal charges",
                "She would be transferred to another hospital",
                "Nothing significant"
              ],
              correctAnswer: 1
            }
          ]
        },
        solution: {}
      },
      {
        id: "evidence-match-2",
        type: "evidence-match",
        title: "Connect the Evidence",
        difficulty: "medium",
        storyContext: "Match each piece of evidence to its significance in the case.",
        data: {
          evidence: [
            { id: "ev1", name: "Empty Sedative Vial", description: "Hospital-grade sedative" },
            { id: "ev2", name: "Secret Passage Blueprint", description: "Train compartment passage map" },
            { id: "ev3", name: "Torn Surgical Glove", description: "Medical latex with hospital logo" },
            { id: "ev4", name: "Stopped Pocket Watch", description: "Victor's watch stopped at 10:52 PM" }
          ],
          targets: [
            { id: "method", name: "Method of Murder", correctEvidenceIds: ["ev1"] },
            { id: "planning", name: "Premeditation Evidence", correctEvidenceIds: ["ev2"] },
            { id: "killer-id", name: "Killer's Identity", correctEvidenceIds: ["ev3"] },
            { id: "timing", name: "Time of Death", correctEvidenceIds: ["ev4"] }
          ]
        },
        solution: {}
      }
    ]
  },

  3: { // The Poisoned Pen
    caseId: 3,
    sceneName: "Ashwood Writers Retreat - Marcus Thorne's Study",
    description: "The smell of bitter almonds fills the air. A famous author lies dead, poisoned tea beside him. Decades-old betrayal and stolen literary dreams culminate in revenge.",
    requiredInvestigations: 3,
    investigations: [
      {
        id: "fingerprint-3",
        type: "fingerprint",
        title: "Teacup Analysis",
        difficulty: "easy",
        storyContext: "Match the fingerprints on the poisoned teacup handle to identify who served the fatal drink.",
        data: {
          evidence: {
            id: "evidence",
            pattern: "arch",
            suspectName: "Unknown",
            details: "Clear print on the teacup handle, indicating who last touched it before Marcus drank."
          },
          suspects: [
            { id: "hart", pattern: "arch", suspectName: "Imogen Hart", details: "Fellow author, Marcus's contemporary" },
            { id: "blackwood", pattern: "loop", suspectName: "Elena Blackwood", details: "Retreat hostess" },
            { id: "rivers", pattern: "whorl", suspectName: "Thomas Rivers", details: "Marcus's publisher" },
            { id: "crane", pattern: "loop", suspectName: "Victoria Crane", details: "Literary critic" }
          ]
        },
        solution: { correctId: "hart" }
      },
      {
        id: "timeline-3",
        type: "timeline",
        title: "The Path to Revenge",
        difficulty: "medium",
        storyContext: "Arrange these events to understand Imogen's decades-long journey to revenge.",
        data: {
          events: [
            { id: "e1", time: "1998", description: "Imogen writes 'Echoes of Tomorrow' - her masterpiece novel", order: 0 },
            { id: "e2", time: "1998", description: "Marcus steals Imogen's manuscript and publishes it as his own work", order: 1 },
            { id: "e3", time: "1999", description: "'Echoes of Tomorrow' becomes a bestseller, launching Marcus's career", order: 2 },
            { id: "e4", time: "2010", description: "Imogen discovers proof Marcus plagiarized her work", order: 3 },
            { id: "e5", time: "2023", description: "Imogen learns Marcus is writing 'Echoes of Vengeance' - eerily similar to her story", order: 4 },
            { id: "e6", time: "March 2024", description: "Imogen arrives at Ashwood Retreat two days before Marcus", order: 5 },
            { id: "e7", time: "March 14, 3:00 PM", description: "Imogen serves Marcus poisoned tea in his study", order: 6 }
          ]
        },
        solution: {}
      },
      {
        id: "document-3",
        type: "document",
        title: "Publishing Contract Analysis",
        difficulty: "hard",
        storyContext: "Examine the altered publishing contract to find proof of Marcus's plagiarism.",
        data: {
          title: "1998 Publishing Contract - 'Echoes of Tomorrow'",
          content: `PUBLISHING AGREEMENT

This contract made on June 15, 1998 between:

PUBLISHER: Meridian House Publishing, New York
AUTHOR: [WHITE-OUT VISIBLE] Marcus Thorne

WORK: "Echoes of Tomorrow" - A Novel

Terms:
- Author grants exclusive rights to publish the aforementioned work
- Advance payment: $50,000
- Royalties: 15% of net sales
- Publication date: Fall 1998

Author represents that the work is original and does not infringe on any existing copyrights.

[Under UV light examination, the following is visible beneath the white-out:]
Original text: "AUTHOR: Imogen Hart"

Additional notes found in margins:
- "I.H. - told you I'd make this work famous"
- Bank deposit slip showing Marcus received $50,000 advance
- Imogen's signature visible on carbon copy underneath Marcus's

This contract proves Marcus Thorne erased Imogen Hart's name and claimed her novel as his own work, stealing both credit and payment for her creative masterpiece.`,
          questions: [
            {
              question: "Who was the original author of 'Echoes of Tomorrow'?",
              options: [
                "Marcus Thorne",
                "Imogen Hart",
                "Elena Blackwood",
                "Meridian House Publishing"
              ],
              correctAnswer: 1
            },
            {
              question: "How did investigators discover the original author's name?",
              options: [
                "Marcus confessed",
                "Witnesses came forward",
                "UV light revealed whited-out text",
                "Computer records"
              ],
              correctAnswer: 2
            },
            {
              question: "What did Marcus receive for publishing Imogen's stolen work?",
              options: [
                "Only fame and recognition",
                "$50,000 advance plus 15% royalties",
                "A writing award",
                "Nothing - he did it for revenge"
              ],
              correctAnswer: 1
            }
          ]
        },
        solution: {}
      },
      {
        id: "evidence-match-3",
        type: "evidence-match",
        title: "Elements of the Crime",
        difficulty: "easy",
        storyContext: "Connect each piece of evidence to its role in solving the case.",
        data: {
          evidence: [
            { id: "ev1", name: "Cyanide Residue", description: "Bitter almond smell in teacup" },
            { id: "ev2", name: "Burned Manuscript Pages", description: "Imogen's original writing from 1998" },
            { id: "ev3", name: "Garden Shed Key", description: "Access to photography chemicals including cyanide" },
            { id: "ev4", name: "Guest Registry Entry", description: "Imogen's note: 'Justice delayed is justice denied'" }
          ],
          targets: [
            { id: "weapon", name: "Murder Weapon/Method", correctEvidenceIds: ["ev1"] },
            { id: "motive", name: "Motive for Murder", correctEvidenceIds: ["ev2"] },
            { id: "access", name: "Access to Poison", correctEvidenceIds: ["ev3"] },
            { id: "intent", name: "Premeditation", correctEvidenceIds: ["ev4"] }
          ]
        },
        solution: {}
      }
    ]
  },

  4: { // Ashes to Ashes
    caseId: 4,
    sceneName: "Meridian Tower - 22nd Floor Crime Scene",
    description: "Corporate conspiracy written in ash and destruction. A CEO lies dead, a building burned, and $847 million missing. Two executives tried to destroy the evidence... and failed.",
    requiredInvestigations: 4,
    investigations: [
      {
        id: "fingerprint-4",
        type: "fingerprint",
        title: "Fire Suppression Override",
        difficulty: "medium",
        storyContext: "Match the fingerprints on the fire suppression override panel.",
        data: {
          evidence: {
            id: "evidence",
            pattern: "whorl",
            suspectName: "Unknown",
            details: "Prints from the manual override switch that disabled the building's fire suppression system."
          },
          suspects: [
            { id: "koslow", pattern: "whorl", suspectName: "James Koslow", details: "Security Director" },
            { id: "hammond", pattern: "arch", suspectName: "CFO Robert Hammond", details: "Chief Financial Officer" },
            { id: "garcia", pattern: "loop", suspectName: "Maria Garcia", details: "IT Director" },
            { id: "security", pattern: "loop", suspectName: "Night Security Guard", details: "On-duty personnel" }
          ]
        },
        solution: { correctId: "koslow" }
      },
      {
        id: "timeline-4",
        type: "timeline",
        title: "Night of the Fire",
        difficulty: "hard",
        storyContext: "Reconstruct the timeline of the arson and murder using security logs and evidence.",
        data: {
          events: [
            { id: "e1", time: "2:30 AM", description: "CEO Richard Chen works late, reviews fraud evidence in his office", order: 0 },
            { id: "e2", time: "2:45 AM", description: "Koslow's security card accesses 22nd floor CEO suite", order: 1 },
            { id: "e3", time: "2:47 AM", description: "Koslow disables fire suppression system using manual override", order: 2 },
            { id: "e4", time: "2:55 AM", description: "Hammond enters building, meets Koslow on 22nd floor", order: 3 },
            { id: "e5", time: "3:05 AM", description: "CEO Chen is killed in his office", order: 4 },
            { id: "e6", time: "3:10 AM", description: "Koslow sets fires in basement, 15th, and 18th floors using accelerant", order: 5 },
            { id: "e7", time: "3:14 AM", description: "Koslow and Hammond exit through parking garage", order: 6 },
            { id: "e8", time: "3:15 AM", description: "Hammond leaves building - captured on street camera", order: 7 },
            { id: "e9", time: "3:27 AM", description: "First 911 call reporting the fire", order: 8 }
          ]
        },
        solution: {}
      },
      {
        id: "document-4",
        type: "document",
        title: "Financial Fraud Evidence",
        difficulty: "hard",
        storyContext: "Analyze the recovered financial records to understand the scope of the embezzlement.",
        data: {
          title: "Meridian Corp - Offshore Transfer Analysis",
          content: `CONFIDENTIAL - CEO EYES ONLY

FINANCIAL FRAUD INVESTIGATION
Prepared by: Richard Chen, CEO
Date: March 13, 2024

SUMMARY OF FINDINGS:

Over the past 18 months, CFO Robert Hammond and Security Director James Koslow have systematically embezzled $847 million from Meridian Corp through offshore shell companies.

TRANSACTION DETAILS:

Shell Company Network:
- Cayman Holdings LLC (Hammond controlled)
- Gibraltar Security Services (Koslow controlled)
- Phoenix Investment Group (jointly controlled)

Key Transactions:
Dec 2022: $145M transferred to Cayman Holdings
Mar 2023: $203M to Gibraltar Security
Aug 2023: $287M to Phoenix Investment
Feb 2024: $212M to Phoenix Investment

REVERSAL ATTEMPT:
On March 13, 2024 at 1:47 PM, Hammond attempted to reverse the February transaction and destroy digital records. This attempt was blocked by our backup systems.

EVIDENCE SECURED:
- Banking records from 8 offshore accounts
- Email communications between Hammond and Koslow
- Forged board approval documents
- Video confession recorded as insurance (stored in CEO safe)

ACTIONS PLANNED:
I am reporting this to the FBI tomorrow morning. If anything happens to me, Hammond and Koslow are responsible.

This USB drive contains all evidence.`,
          questions: [
            {
              question: "How much money did Hammond and Koslow embezzle in total?",
              options: [
                "$212 million",
                "$500 million",
                "$847 million",
                "$1.2 billion"
              ],
              correctAnswer: 2
            },
            {
              question: "What did Hammond try to do on March 13th?",
              options: [
                "Turn himself in to police",
                "Transfer more money offshore",
                "Reverse a transaction and destroy records",
                "Fire the CEO"
              ],
              correctAnswer: 2
            },
            {
              question: "Where did CEO Chen store his video confession?",
              options: [
                "Bank vault",
                "His home",
                "CEO office safe",
                "With his lawyer"
              ],
              correctAnswer: 2
            },
            {
              question: "When was Chen planning to report the fraud to the FBI?",
              options: [
                "Immediately that night",
                "The next morning",
                "Next week",
                "He never planned to report it"
              ],
              correctAnswer: 1
            }
          ]
        },
        solution: {}
      },
      {
        id: "evidence-match-4",
        type: "evidence-match",
        title: "Conspiracy Evidence",
        difficulty: "medium",
        storyContext: "Match each piece of evidence to prove the conspiracy between Hammond and Koslow.",
        data: {
          evidence: [
            { id: "ev1", name: "Accelerant Pattern", description: "Professional fire-starting pattern" },
            { id: "ev2", name: "Access Card Logs", description: "Koslow's movements through building" },
            { id: "ev3", name: "Street Camera Footage", description: "Hammond leaving at 3:15 AM" },
            { id: "ev4", name: "Building Blueprints", description: "Marked with red X's at fire locations" },
            { id: "ev5", name: "CEO's USB Drive", description: "Video confession and fraud evidence" }
          ],
          targets: [
            { id: "arson", name: "Proof of Arson", correctEvidenceIds: ["ev1"] },
            { id: "koslow", name: "Koslow's Involvement", correctEvidenceIds: ["ev2"] },
            { id: "hammond", name: "Hammond's Involvement", correctEvidenceIds: ["ev3"] },
            { id: "planning", name: "Premeditated Plan", correctEvidenceIds: ["ev4"] },
            { id: "motive", name: "Motive for Murder", correctEvidenceIds: ["ev5"] }
          ]
        },
        solution: {}
      }
    ]
  },

  5: { // The Double Cross
    caseId: 5,
    sceneName: "Prague Safe House - Scene of the Impossible",
    description: "An impossible murder in a sealed room. Three intelligence agents, one dead ambassador, and a conspiracy that spans nations. Trust no one.",
    requiredInvestigations: 4,
    investigations: [
      {
        id: "fingerprint-5",
        type: "fingerprint",
        title: "Ventilation Shaft Access",
        difficulty: "hard",
        storyContext: "Match the fingerprints found on the ventilation shaft grate to identify who entered through the 'impossible' route.",
        data: {
          evidence: {
            id: "evidence",
            pattern: "loop",
            suspectName: "Unknown",
            details: "Small, precise prints on the air vent grate. The person has slender fingers, consistent with surgical or technical training."
          },
          suspects: [
            { id: "khoury", pattern: "loop", suspectName: "Agent Layla Khoury (CIA)", details: "Field operative, weapons specialist" },
            { id: "webb", pattern: "arch", suspectName: "Agent David Webb (CIA)", details: "Intelligence analyst" },
            { id: "ashford", pattern: "whorl", suspectName: "Agent Ian Ashford (MI6)", details: "British intelligence officer" },
            { id: "petrov", pattern: "whorl", suspectName: "Ambassador Petrov", details: "The victim" }
          ]
        },
        solution: { correctId: "khoury" }
      },
      {
        id: "timeline-5",
        type: "timeline",
        title: "The Conspiracy Timeline",
        difficulty: "hard",
        storyContext: "Reconstruct how three intelligence agents planned and executed the impossible murder.",
        data: {
          events: [
            { id: "e1", time: "6 months ago", description: "Khoury's CIA-issued weapon reported 'missing' from her assignment", order: 0 },
            { id: "e2", time: "2 weeks ago", description: "Ashford creates fake dossier framing Webb as a double agent", order: 1 },
            { id: "e3", time: "2 weeks ago", description: "Webb and Petrov have heated confrontation at Prague cafe (photographed by CIA)", order: 2 },
            { id: "e4", time: "1 week ago", description: "Petrov discovers the illegal weapons sales conspiracy involving all three agents", order: 3 },
            { id: "e5", time: "March 14, 9:30 PM", description: "Petrov seals himself in safe house with evidence", order: 4 },
            { id: "e6", time: "March 14, 11:45 PM", description: "Khoury enters ventilation shaft from adjacent building", order: 5 },
            { id: "e7", time: "March 15, 12:03 AM", description: "Khoury shoots Petrov three times with subsonic rounds", order: 6 },
            { id: "e8", time: "12:15 AM", description: "Khoury exits through ventilation shaft", order: 7 },
            { id: "e9", time: "12:20 AM", description: "Ashford sends encrypted message from Petrov's phone to frame Webb", order: 8 }
          ]
        },
        solution: {}
      },
      {
        id: "document-5",
        type: "document",
        title: "Petrov's Conspiracy Notes",
        difficulty: "hard",
        storyContext: "Analyze Ambassador Petrov's secret notes documenting the tri-agency conspiracy.",
        data: {
          title: "CLASSIFIED - Illegal Arms Sales Investigation",
          content: `AMBASSADOR PETROV - PERSONAL NOTES
DO NOT TRUST OFFICIAL CHANNELS

CONSPIRACY DISCOVERED:

Three intelligence operatives are running an illegal weapons trafficking operation:

1. AGENT DAVID WEBB (CIA)
   - Point of contact with arms dealers
   - Handles money laundering through diplomatic channels
   - Using his analyst position to falsify intelligence reports

2. AGENT LAYLA KHOURY (CIA)
   - Weapons procurement and delivery
   - Reported weapon "missing" 6 months ago - actually sold to terrorists
   - Has killed before to protect the operation

3. AGENT IAN ASHFORD (MI6)
   - Provides intelligence and safe house blueprints
   - Creates false evidence to eliminate threats
   - Has already framed two whistleblowers

EVIDENCE I HAVE SECURED:
- Bank records: $47 million in illegal sales
- Communication intercepts proving conspiracy
- Delivery manifests showing weapons to terrorist organizations
- Video of Webb meeting with arms dealer in Damascus

THEY KNOW I KNOW:
Webb confronted me two weeks ago. Threatened my family.
Khoury has been surveilling my movements.
Ashford tried to discredit me with forged documents.

IF I DIE: All three are responsible. The evidence is in my safe.

They will try to make it look like an accident or frame someone else.
DO NOT TRUST OFFICIAL INVESTIGATION - THEY CONTROL IT.`,
          questions: [
            {
              question: "How many intelligence agents were involved in the conspiracy?",
              options: [
                "One agent working alone",
                "Two agents (CIA only)",
                "Three agents from CIA and MI6",
                "An entire agency was corrupt"
              ],
              correctAnswer: 2
            },
            {
              question: "What was the conspiracy about?",
              options: [
                "Espionage against their own countries",
                "Illegal weapons sales to terrorists",
                "Embezzling government funds",
                "Political assassination"
              ],
              correctAnswer: 1
            },
            {
              question: "How much money did the conspirators make from illegal arms sales?",
              options: [
                "$12 million",
                "$28 million",
                "$47 million",
                "$89 million"
              ],
              correctAnswer: 2
            },
            {
              question: "What did Petrov warn about the official investigation?",
              options: [
                "It would be thorough and fair",
                "Not to trust it because the conspirators control it",
                "It would be delayed",
                "It would be handled by the FBI"
              ],
              correctAnswer: 1
            }
          ]
        },
        solution: {}
      },
      {
        id: "evidence-match-5",
        type: "evidence-match",
        title: "The Triple Cross",
        difficulty: "hard",
        storyContext: "Match each piece of evidence to the specific agent involved in the conspiracy.",
        data: {
          evidence: [
            { id: "ev1", name: "CIA Subsonic Bullets", description: "From Khoury's 'missing' weapon" },
            { id: "ev2", name: "Fake Double Agent File", description: "Created to frame Webb" },
            { id: "ev3", name: "MI6 Safe House Blueprints", description: "Showing ventilation route" },
            { id: "ev4", name: "Manipulated Phone Message", description: "Timestamp altered after death" },
            { id: "ev5", name: "Torn Black Fabric", description: "In ventilation shaft" }
          ],
          targets: [
            { id: "khoury-1", name: "Khoury's Murder Weapon", correctEvidenceIds: ["ev1"] },
            { id: "ashford-1", name: "Ashford's Cover-Up Evidence", correctEvidenceIds: ["ev2"] },
            { id: "ashford-2", name: "Ashford's Planning", correctEvidenceIds: ["ev3"] },
            { id: "ashford-3", name: "Ashford's Frame Job", correctEvidenceIds: ["ev4"] },
            { id: "khoury-2", name: "Khoury's Entry Method", correctEvidenceIds: ["ev5"] }
          ]
        },
        solution: {}
      }
    ]
  }
};
