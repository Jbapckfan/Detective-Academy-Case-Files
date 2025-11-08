import {
  SequencePuzzleData,
  MirrorPuzzleData,
  GearPuzzleData,
  LogicPuzzleData,
  SpatialPuzzleData,
  PuzzleType,
  Difficulty
} from '../types';

interface PuzzleData {
  type: PuzzleType;
  difficulty: Difficulty;
  storyContext: string;
  data: SequencePuzzleData | MirrorPuzzleData | GearPuzzleData | LogicPuzzleData | SpatialPuzzleData;
  optimalMoves: number;
  explanation: string;
}

export const casePuzzles: Record<number, PuzzleData[]> = {
  // Case 1: The Midnight Caller (Jr. Detective - Easy)
  1: [
    {
      type: 'sequence',
      difficulty: 'easy',
      storyContext: 'The cookie crumbs trail leads from the entrance, past shelf 3, 5, 8, 13... Which shelf is next?',
      data: {
        sequence: [3, 5, 8, 13, '?'],
        choices: [15, 18, 21, 24],
        correctAnswer: 21,
        patternType: 'mathematical'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation: 'Fibonacci sequence (each number is the sum of the previous two: 3+5=8, 5+8=13, 8+13=21). Ms. Rose left the trail leading to shelf 21 where Mrs. Maple\'s gift was hidden!'
    },
    {
      type: 'mirror',
      difficulty: 'easy',
      storyContext: 'The music box has a small mirror mechanism inside. Can you reflect the light from the lamp to reveal the hidden message?',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 2 },
        targets: [{ x: 4, y: 2 }, { x: 4, y: 4 }],
        obstacles: [{ position: { x: 2, y: 2 }, width: 1, height: 1 }],
        allowedMirrors: 2
      } as MirrorPuzzleData,
      optimalMoves: 2,
      explanation: 'By placing mirrors correctly, you reveal Mrs. Maple\'s signature on the hidden note inside the music box!'
    },
    {
      type: 'gear',
      difficulty: 'easy',
      storyContext: 'The music box mechanism has three gears that need to wind up. Turn the main gear exactly 4 times to play the full lullaby.',
      data: {
        gears: [
          { id: 'A', position: { x: 2, y: 2 }, size: 3, teeth: 8, locked: false, rotations: 0 },
          { id: 'B', position: { x: 4, y: 2 }, size: 2, teeth: 4, locked: false, rotations: 0 },
          { id: 'C', position: { x: 5, y: 3 }, size: 2, teeth: 4, locked: false, rotations: 0 }
        ],
        target: { gearId: 'A', targetRotations: 4 },
        constraints: []
      } as GearPuzzleData,
      optimalMoves: 4,
      explanation: 'The music box plays its complete melody when gear A rotates exactly 4 times, revealing the tune that Mrs. Maple used to sing to the children.'
    },
    {
      type: 'logic',
      difficulty: 'easy',
      storyContext: 'Three friends helped set up the surprise. The child\'s drawing shows them working together. Who planned this midnight mystery?',
      data: {
        story: 'Billy says: "I asked Ms. Rose and Mr. Pine to help me." Ms. Rose says: "I brought cookies and the library key." Mr. Pine says: "I left my mailbag by accident." The drawing shows all three smiling with hearts around them.',
        question: 'Who organized Mrs. Maple\'s surprise for the children?',
        options: [
          { id: 'A', text: 'Billy Maple', icon: '👨' },
          { id: 'B', text: 'Ms. Rose', icon: '👩‍🍳' },
          { id: 'C', text: 'Mr. Pine', icon: '📬' },
          { id: 'D', text: 'All three working together', icon: '🤝' }
        ],
        correctLogic: ['D'],
        requiresMultiStep: false,
        allowCustomAnswer: false
      } as LogicPuzzleData,
      optimalMoves: 1,
      explanation: 'All three friends worked together to help Billy fulfill his aunt\'s wish! Billy organized it, Ms. Rose provided access and cookies, and Mr. Pine helped with setup. The hearts in the drawing show their teamwork and friendship.'
    },
    {
      type: 'spatial',
      difficulty: 'easy',
      storyContext: 'The library key was hidden in Mr. Pine\'s mailbag. Rotate the bag to find the correct pocket where the key is stored.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'cube',
          faces: [
            { color: '#8B4513', pattern: 'zipper' },
            { color: '#8B4513', pattern: 'pocket' },
            { color: '#8B4513', pattern: 'straps' },
            { color: '#8B4513', pattern: 'pocket-with-key' },
            { color: '#8B4513' },
            { color: '#8B4513' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 0, rotY: 90, rotZ: 0 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 2,
      explanation: 'The library key was in the side pocket! Mr. Pine used it to help set up the music box for the midnight surprise.'
    }
  ],

  // Case 2: Blood on the Tracks (Detective - Medium)
  2: [
    {
      type: 'sequence',
      difficulty: 'medium',
      storyContext: 'The train compartments where poison could have been added follow a pattern: 2A, 3B, 5C, 8D, 13E... Which compartment is next?',
      data: {
        sequence: ['2A', '3B', '5C', '8D', '13E', '?'],
        choices: ['15F', '18F', '21F', '21G'],
        correctAnswer: '21F',
        patternType: 'compound'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation: 'Fibonacci numbers (2,3,5,8,13,21) combined with consecutive letters. Compartment 21F was Sarah Chen\'s room—the secret connecting door location!'
    },
    {
      type: 'mirror',
      difficulty: 'medium',
      storyContext: 'The pharmacy vial was dropped in the corridor. Use the mirrors to trace the light path and reveal where the person came from.',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 4 },
        targets: [{ x: 7, y: 1 }, { x: 5, y: 6 }],
        obstacles: [
          { position: { x: 3, y: 3 }, width: 2, height: 1 },
          { position: { x: 5, y: 2 }, width: 1, height: 1 }
        ],
        allowedMirrors: 3
      } as MirrorPuzzleData,
      optimalMoves: 3,
      explanation: 'The light path shows the killer came from compartment 5C (Sarah Chen\'s room) through the secret passage, dropped the vial in panic, and returned the same way!'
    },
    {
      type: 'gear',
      difficulty: 'medium',
      storyContext: 'The train\'s door locking mechanism shows someone manipulated it. The victim\'s compartment lock has interlocking gears. Which gear was forced?',
      data: {
        gears: [
          { id: 'Lock', position: { x: 2, y: 2 }, size: 3, teeth: 12, locked: false, rotations: 0 },
          { id: 'Bolt', position: { x: 5, y: 2 }, size: 2, teeth: 6, locked: false, rotations: 0 },
          { id: 'Handle', position: { x: 4, y: 4 }, size: 2, teeth: 8, locked: false, rotations: 0 }
        ],
        target: { gearId: 'Lock', targetRotations: 2 },
        constraints: [{ gearId: 'Bolt', maxRotations: 3 }]
      } as GearPuzzleData,
      optimalMoves: 3,
      explanation: 'The lock wasn\'t forced—the secret door bypassed it entirely! Sarah Chen never needed to pick the lock because she accessed through the hidden passage between compartments.'
    },
    {
      type: 'logic',
      difficulty: 'medium',
      storyContext: 'Five suspects, but only one had all three: access to poison, knowledge of the secret passage, and motive for both theft and murder.',
      data: {
        story: 'Helena Strand had poison access but no theft motive. Marcus Devereaux wanted the painting but claims no knowledge of poisons. Sarah Chen had art supplies (hiding poison), knew the train layout from research, and wanted revenge. Detective Cross had poison access but was dining publicly. Porter Webb delivered drinks but had no motive for stealing art.',
        question: 'Who killed Victor Castellane and stole the painting?',
        options: [
          { id: 'A', text: 'Helena Strand - Revenge for business betrayal', icon: '💼' },
          { id: 'B', text: 'Marcus Devereaux - Professional art thief', icon: '🎭' },
          { id: 'C', text: 'Sarah Chen - Revenge + theft opportunity', icon: '🎨' },
          { id: 'D', text: 'Thomas Webb - Access to victim\'s room', icon: '🔑' }
        ],
        correctLogic: ['C'],
        requiresMultiStep: true,
        allowCustomAnswer: false
      } as LogicPuzzleData,
      optimalMoves: 1,
      explanation: 'Sarah Chen is the only suspect with access to aconite (hidden in art supplies), knowledge of the secret passage (from Gothic architecture research), motive for murder (ruined reputation), AND motive for theft (working with Devereaux). The blue ink on threatening letters matches her artistic handwriting.'
    },
    {
      type: 'spatial',
      difficulty: 'medium',
      storyContext: 'The secret door is hidden behind the wardrobe. Rotate the compartment blueprint to find how the passage connects to the adjacent room.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'l-shape',
          faces: [
            { color: '#4a0e0e', pattern: 'wardrobe' },
            { color: '#4a0e0e', pattern: 'hidden-door' },
            { color: '#4a0e0e', pattern: 'wall' },
            { color: '#4a0e0e', pattern: 'passage' },
            { color: '#4a0e0e' },
            { color: '#4a0e0e' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 90, rotY: 45, rotZ: 0 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 3,
      explanation: 'The passage connects compartment 5C to 4A (victim\'s room) through a shared wall behind the wardrobes. Sarah Chen used this to poison Castellane and steal the painting without ever entering the corridor!'
    }
  ],

  // Case 3: The Poisoned Pen (Detective - Medium)
  3: [
    {
      type: 'sequence',
      difficulty: 'medium',
      storyContext: 'The coded bookmark contains numbers: 8, 1, 18, 20, 19... Decode them to reveal the killer\'s name.',
      data: {
        sequence: ['H', 'A', 'R', 'T', 'S', '?'],
        choices: ['R', 'V', 'E', 'M'],
        correctAnswer: 'R',
        patternType: 'mathematical'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation: 'Numbers correspond to alphabet positions: 8=H, 1=A, 18=R, 20=T, 19=S, 18=R, 5=E, 22=V, 5=E, 14=N, 7=G, 5=E. The message spells "HARTS REVENGE"—pointing directly to Imogen Hart!'
    },
    {
      type: 'mirror',
      difficulty: 'medium',
      storyContext: 'The burned notebook pages show partial text when held up to light at certain angles. Use mirrors to reconstruct the reflection.',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 3 },
        targets: [{ x: 6, y: 3 }, { x: 3, y: 6 }, { x: 6, y: 6 }],
        obstacles: [
          { position: { x: 2, y: 4 }, width: 1, height: 2 },
          { position: { x: 4, y: 1 }, width: 1, height: 1 }
        ],
        allowedMirrors: 4
      } as MirrorPuzzleData,
      optimalMoves: 4,
      explanation: 'The mirror reflection reveals the burned pages were from Imogen\'s original manuscript—the one Blackwood stole twenty years ago. The handwriting matches the hidden manuscript found behind the bookcase!'
    },
    {
      type: 'gear',
      difficulty: 'medium',
      storyContext: 'The library bookcase concealing the passage requires rotating hidden gears in sequence. Solve the mechanism to reveal the secret compartment.',
      data: {
        gears: [
          { id: 'Outer', position: { x: 2, y: 3 }, size: 4, teeth: 16, locked: false, rotations: 0 },
          { id: 'Middle', position: { x: 5, y: 3 }, size: 3, teeth: 12, locked: false, rotations: 0 },
          { id: 'Inner', position: { x: 6, y: 5 }, size: 2, teeth: 6, locked: false, rotations: 0 },
          { id: 'Release', position: { x: 4, y: 6 }, size: 1, teeth: 4, locked: false, rotations: 0 }
        ],
        target: { gearId: 'Release', targetRotations: 3 },
        constraints: [{ gearId: 'Outer', maxRotations: 2 }]
      } as GearPuzzleData,
      optimalMoves: 5,
      explanation: 'The bookcase mechanism reveals the hidden compartment where Blackwood kept Imogen\'s original manuscript—proof that "Cordelia Blackwood\'s" debut novel was actually written by Imogen Hart!'
    },
    {
      type: 'logic',
      difficulty: 'medium',
      storyContext: 'Five authors had motive and opportunity. But only one has evidence connecting them to ricin, the secret passage, AND the blue ink threatening letters.',
      data: {
        story: 'Jeremy Ashford has botany knowledge and argued with Blackwood, but no access to ricin or the manor layout. Natasha Volkov was near the kitchen and knows poisons from research, but her letters use black ink. Father Walsh had church connections to ricin but was at evening prayer during the poisoning. Imogen Hart wore the dark coat, used blue ink, researched Gothic manors (knows secret passages), and recently inherited money to purchase castor beans. Dr. Pierce left early but has an alibi.',
        question: 'Who poisoned Dame Cordelia Blackwood?',
        options: [
          { id: 'A', text: 'Jeremy Ashford - Plagiarism exposure', icon: '📚' },
          { id: 'B', text: 'Natasha Volkov - Ghostwriting scandal', icon: '🖋️' },
          { id: 'C', text: 'Father Walsh - Hidden past revelation', icon: '⛪' },
          { id: 'D', text: 'Imogen Hart - Stolen manuscript revenge', icon: '💔' }
        ],
        correctLogic: ['D'],
        requiresMultiStep: true,
        allowCustomAnswer: false
      } as LogicPuzzleData,
      optimalMoves: 1,
      explanation: 'Imogen Hart is the only suspect with ALL the evidence: blue ink matching the threatening letters, Gothic manor research giving her knowledge of secret passages, dark coat placing her near the kitchen, recent inheritance providing funds for castor beans (ricin source), and the hidden manuscript proving Blackwood stole her life\'s work twenty years ago. Motive + means + opportunity = killer.'
    },
    {
      type: 'spatial',
      difficulty: 'medium',
      storyContext: 'The hidden manuscript behind the bookcase can only be accessed by rotating the specific book that triggers the mechanism. Find the correct orientation.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'irregular',
          faces: [
            { color: '#2d1b3d', pattern: 'book-spines' },
            { color: '#2d1b3d', pattern: 'hidden-latch' },
            { color: '#2d1b3d', pattern: 'wall' },
            { color: '#2d1b3d', pattern: 'manuscript-compartment' },
            { color: '#2d1b3d', pattern: 'ornate-decoration' },
            { color: '#2d1b3d' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 45, rotY: 90, rotZ: 0 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 3,
      explanation: 'Rotating the book titled "The Garden of Good and Evil" at the correct angle reveals the hidden compartment containing Imogen Hart\'s original manuscript—written in her distinctive handwriting, proving Blackwood\'s first novel was stolen!'
    }
  ],

  // Case 4: Ashes to Ashes (Master Detective - Hard)
  4: [
    {
      type: 'sequence',
      difficulty: 'hard',
      storyContext: 'Offshore transfers show a pattern: $40M, $80M, $160M, $320M... The killer needed one more transfer. How much?',
      data: {
        sequence: [40, 80, 160, 320, '?'],
        choices: [480, 560, 640, 720],
        correctAnswer: 640,
        patternType: 'mathematical'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation: 'Each transfer doubles the previous amount (geometric sequence with ratio 2). Hammond planned a final $640M transfer but reversed the $40M transaction to avoid suspicion, leaving a digital trail that proved her guilt.'
    },
    {
      type: 'mirror',
      difficulty: 'hard',
      storyContext: 'Security camera across the street caught a reflection in the building\'s windows. Trace the light path to identify who left at 3:15 AM.',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 5 },
        targets: [{ x: 8, y: 2 }, { x: 6, y: 7 }, { x: 3, y: 8 }],
        obstacles: [
          { position: { x: 3, y: 3 }, width: 2, height: 2 },
          { position: { x: 6, y: 4 }, width: 1, height: 1 },
          { position: { x: 2, y: 6 }, width: 1, height: 2 }
        ],
        allowedMirrors: 5
      } as MirrorPuzzleData,
      optimalMoves: 5,
      explanation: 'The reflection analysis reveals Patricia Hammond\'s distinctive profile and build leaving the building at 3:15 AM—12 minutes before the fire started. Combined with Koslow leaving via service entrance at 3:20 AM, this timeline proves their coordination.'
    },
    {
      type: 'gear',
      difficulty: 'hard',
      storyContext: 'The fire suppression system has interlocking override mechanisms. Recreate how Koslow disabled it using his credentials at 2:47 AM.',
      data: {
        gears: [
          { id: 'Auth', position: { x: 2, y: 2 }, size: 4, teeth: 20, locked: false, rotations: 0 },
          { id: 'Floor15', position: { x: 6, y: 2 }, size: 3, teeth: 15, locked: false, rotations: 0 },
          { id: 'Floor18', position: { x: 6, y: 5 }, size: 3, teeth: 15, locked: false, rotations: 0 },
          { id: 'Floor22', position: { x: 3, y: 5 }, size: 3, teeth: 15, locked: false, rotations: 0 },
          { id: 'Master', position: { x: 4, y: 7 }, size: 2, teeth: 8, locked: false, rotations: 0 }
        ],
        target: { gearId: 'Master', targetRotations: 5 },
        constraints: [
          { gearId: 'Auth', maxRotations: 3 },
          { gearId: 'Floor15', mustNotRotate: false }
        ]
      } as GearPuzzleData,
      optimalMoves: 7,
      explanation: 'Koslow used his IT credentials to disable the fire suppression on all three floors simultaneously by manipulating the master override. This required specific technical knowledge only the IT Director possessed, proving his direct involvement in the arson conspiracy.'
    },
    {
      type: 'logic',
      difficulty: 'hard',
      storyContext: 'Six people involved in the fraud, one murdered, two conspirators. Who killed Martin Greer and orchestrated the arson?',
      data: {
        story: 'Evidence: (1) Ballistics match Hammond\'s registered 9mm. (2) Fire suppression disabled with Koslow\'s credentials at 2:47 AM. (3) External camera shows someone leaving at 3:15 AM. (4) Accelerant purchased with Hammond\'s signature. (5) Phone records show Hammond-Koslow calls spiked before fire, final call at 2:30 AM. (6) Greer\'s encrypted USB contained evidence Hammond was planning arson. (7) Reversed $40M offshore transfer created digital trail to Hammond. (8) Meridian and Chow created the Ponzi scheme but were already fleeing with money. (9) Chen had forensic fire training but no motive to kill Greer specifically.',
        question: 'Who murdered Greer and burned Meridian Tower?',
        options: [
          { id: 'A', text: 'Jonathan Meridian - Covering the Ponzi scheme', icon: '💰' },
          { id: 'B', text: 'Rebecca Chow - Destroying trading records', icon: '📊' },
          { id: 'C', text: 'Patricia Hammond + David Koslow - Eliminate witness and evidence', icon: '🔥' },
          { id: 'D', text: 'Marcus Chen - Professional arson expertise', icon: '🔍' }
        ],
        correctLogic: ['C'],
        requiresMultiStep: true,
        allowCustomAnswer: false
      } as LogicPuzzleData,
      optimalMoves: 1,
      explanation: 'Patricia Hammond murdered Martin Greer (ballistics match her gun) because he was cooperating with investigators and could testify about her bribery. She recruited David Koslow (threatened by Hammond about his embezzlement) to disable security and suppression systems. Timeline: Koslow disables systems at 2:47 AM using his credentials, Hammond shoots Greer at 2:45 AM, they plant accelerant, Hammond leaves at 3:15 AM (caught on external camera), Koslow leaves at 3:20 AM via service entrance, fire starts at 3:27 AM via timers. The reversed offshore transfer, phone records, accelerant purchase, and Greer\'s encrypted evidence all point to Hammond. Koslow is cooperating with prosecutors.'
    },
    {
      type: 'spatial',
      difficulty: 'hard',
      storyContext: 'The encrypted USB drive contains a 3D model of the building showing where accelerant was placed. Rotate to identify all three floors.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'irregular',
          faces: [
            { color: '#1a0f0a', pattern: 'floor-15-servers' },
            { color: '#ff4400', pattern: 'floor-15-accelerant' },
            { color: '#1a0f0a', pattern: 'floor-18-accounting' },
            { color: '#ff4400', pattern: 'floor-18-accelerant' },
            { color: '#1a0f0a', pattern: 'floor-22-executive' },
            { color: '#ff4400', pattern: 'floor-22-accelerant' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 120, rotY: 180, rotZ: 45 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 5,
      explanation: 'The 3D model from Greer\'s encrypted drive shows Hammond\'s plan: accelerant on floors 15 (destroying servers), 18 (destroying accounting records), and 22 (destroying executive files and eliminating Greer). This evidence, which Hammond didn\'t know existed, proves premeditation and conspiracy to commit arson and murder.'
    }
  ],

  // Case 5: The Double Cross (Master Detective - Hard)
  5: [
    {
      type: 'sequence',
      difficulty: 'hard',
      storyContext: 'Volkov\'s encrypted files contain timestamp codes: 23:00, 23:15, 23:32, 23:51, ?. When was the blackout?',
      data: {
        sequence: ['23:00', '23:15', '23:32', '23:51', '?'],
        choices: ['00:12', '00:15', '23:47', '00:10'],
        correctAnswer: '00:12',
        patternType: 'compound'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation: 'The intervals increase by Fibonacci minutes: +15, +17 (+15+2), +19 (+17+2), +21 (+19+2). The pattern predicts 00:12—but the surveillance actually cut at 23:47. This discrepancy proves someone manipulated the timestamp to create a false timeline!'
    },
    {
      type: 'mirror',
      difficulty: 'hard',
      storyContext: 'The Prague dead drop photograph shows two people meeting. Use mirrors to reveal the obscured face and the distinctive ring.',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 4 },
        targets: [{ x: 9, y: 1 }, { x: 7, y: 8 }, { x: 3, y: 7 }, { x: 9, y: 5 }],
        obstacles: [
          { position: { x: 3, y: 3 }, width: 2, height: 1 },
          { position: { x: 6, y: 2 }, width: 1, height: 2 },
          { position: { x: 5, y: 6 }, width: 1, height: 1 },
          { position: { x: 2, y: 5 }, width: 1, height: 1 }
        ],
        allowedMirrors: 6
      } as MirrorPuzzleData,
      optimalMoves: 6,
      explanation: 'The mirror enhancement reveals Marcus Webb meeting Thomas Ashford in Prague—two people who claimed never to have met. Webb\'s distinctive Masonic ring is clearly visible, proving they\'ve been conspiring together for years in the mole operation.'
    },
    {
      type: 'gear',
      difficulty: 'hard',
      storyContext: 'The safe house surveillance override requires three authorization codes entered simultaneously. Reconstruct the mechanism Khoury used.',
      data: {
        gears: [
          { id: 'Ashford', position: { x: 2, y: 2 }, size: 4, teeth: 24, locked: false, rotations: 0 },
          { id: 'Webb', position: { x: 6, y: 2 }, size: 4, teeth: 24, locked: false, rotations: 0 },
          { id: 'Khoury', position: { x: 4, y: 5 }, size: 3, teeth: 16, locked: false, rotations: 0 },
          { id: 'Override', position: { x: 4, y: 7 }, size: 2, teeth: 8, locked: false, rotations: 0 },
          { id: 'Camera1', position: { x: 1, y: 6 }, size: 1, teeth: 4, locked: false, rotations: 0 },
          { id: 'Camera2', position: { x: 7, y: 6 }, size: 1, teeth: 4, locked: false, rotations: 0 }
        ],
        target: { gearId: 'Override', targetRotations: 3 },
        constraints: [
          { gearId: 'Camera1', maxRotations: 1 },
          { gearId: 'Camera2', maxRotations: 1 }
        ]
      } as GearPuzzleData,
      optimalMoves: 8,
      explanation: 'Khoury used Ashford\'s override codes (provided by him as part of the conspiracy) to disable both cameras simultaneously for exactly 90 seconds. The gear mechanism shows this required high-level authorization codes that only three people possessed—proving Ashford\'s direct involvement as Webb\'s partner in the mole operation.'
    },
    {
      type: 'logic',
      difficulty: 'hard',
      storyContext: 'A dead double agent, a mole operation, stolen intelligence, and an impossible murder. Three people conspired—who are they?',
      data: {
        story: 'Evidence analysis: (1) Surveillance blackout used Ashford\'s override codes from internal terminal. (2) Succinylcholine traced to CIA medical facility—Webb had access. (3) Ventilation shaft accessible from adjacent building—only Khoury knew about it from designing security. (4) Swiss payment of $500K traced to shell company connected to Webb. (5) Prague photo shows Webb and Ashford meeting (Webb\'s Masonic ring visible). (6) Audio recordings prove Webb and Ashford met with Volkov multiple times while denying it. (7) Khoury\'s brother has Hezbollah connections (leverage for blackmail). (8) Entry log using Blackwell\'s stolen credentials was misdirection. (9) Sergeyev\'s entry was legitimate MI6 operation. (10) $40M in weapons sales through Webb\'s shell companies led to terrorist attacks.',
        question: 'Who conspired to murder Alexei Volkov and run the mole operation?',
        options: [
          { id: 'A', text: 'Webb (mole) + Ashford (cover) + Khoury (killer)', icon: '🕵️' },
          { id: 'B', text: 'Frost + Blackwell + Sergeyev', icon: '🎭' },
          { id: 'C', text: 'Webb alone - CIA operation gone wrong', icon: '🇺🇸' },
          { id: 'D', text: 'Sergeyev + Russian SVR assets', icon: '🇷🇺' }
        ],
        correctLogic: ['A'],
        requiresMultiStep: true,
        allowCustomAnswer: false
      } as LogicPuzzleData,
      optimalMoves: 1,
      explanation: 'Marcus Webb is the mole who ran the $40M rogue intelligence/weapons operation. Thomas Ashford discovered this 2 years ago and became his partner, providing internal cover. When Volkov threatened to expose them, they recruited Dr. Nadia Khoury by blackmailing her (brother\'s Hezbollah ties). Khoury executed the murder: used Ashford\'s override codes for the 90-second blackout, accessed safe house through ventilation shaft (which she knew about from designing security), injected Volkov with succinylcholine from CIA supplies Webb provided, stole phone/documents, escaped through shaft. Webb paid Khoury $500K. Prague photo and audio recordings prove Webb-Ashford conspiracy. The stolen credentials were misdirection. All three arrested; Khoury testifying against Webb and Ashford.'
    },
    {
      type: 'spatial',
      difficulty: 'hard',
      storyContext: 'The ventilation shaft blueprints show the hidden access point. Rotate the building schematic to trace Khoury\'s route from entry to murder.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'irregular',
          faces: [
            { color: '#0d1b2a', pattern: 'adjacent-building' },
            { color: '#0d1b2a', pattern: 'ventilation-shaft' },
            { color: '#0d1b2a', pattern: 'safe-house-ceiling' },
            { color: '#ff0000', pattern: 'drop-point-volkov' },
            { color: '#0d1b2a', pattern: 'escape-route' },
            { color: '#0d1b2a', pattern: 'shaft-entrance' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 135, rotY: 225, rotZ: 90 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 6,
      explanation: 'The 3D blueprint rotation reveals Khoury\'s route: entered adjacent building (no security), accessed ventilation shaft (which she designed and knew about), crawled through to safe house ceiling, dropped down during 90-second blackout (using Ashford\'s override codes), murdered Volkov with succinylcholine injection, took phone/documents, climbed back up, escaped through shaft to adjacent building. The "impossible" locked-room murder was never locked at all—the shaft was an unknown third entrance that only the security designer would know about. This technical knowledge proves Khoury was the killer.'
    }
  ]
};
