import {
  SequencePuzzleData,
  MirrorPuzzleData,
  GearPuzzleData,
  LogicPuzzleData,
  SpatialPuzzleData,
  CasePuzzle
} from '../types';

export const casePuzzles: Record<number, CasePuzzle[]> = {
  // Case 1: The Midnight Caller (Jr. Detective - Easy)
  1: [
    {
      type: 'sequence',
      difficulty: 'easy',
      caseId: 1,
      sceneId: 'library-after-hours',
      storyContext:
        'Mrs. Maple left a penciled route on the library floor plan: 1, 3, 6, 10...? Each number marks a study lamp that flickers at midnight.',
      whyItMatters:
        'Mapping the next lamp pinpoints where the music-box phone line was spliced into the building wiring.',
      data: {
        sequence: [1, 3, 6, 10, '?'],
        choices: [12, 14, 15, 16],
        correctAnswer: 15,
        patternType: 'counting'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation:
        'The route follows triangular numbers (+2, +3, +4, +5). Lamp 15 sits above the service conduit where the friends hid the call trigger.',
      narratorHint: 'These lamps trace the same zig-zag path Billy used to test the phone line when Mrs. Maple moved out.',
      suspectReaction: 'Ms. Rose laughs softly: "We wanted Sam to see the stacks glow like a treasure map."'
    },
    {
      type: 'mirror',
      difficulty: 'easy',
      caseId: 1,
      sceneId: 'library-after-hours',
      storyContext:
        'The glass display case reflects a taped note on the circulation desk. Tilt the mirrors to bounce light past the dusty globe toward the “STAFF ONLY” alcove.',
      whyItMatters:
        'The reflected line reveals the aisle where the hidden storybook crate waits.',
      data: {
        mirrors: [],
        lightSource: { x: 0, y: 2 },
        targets: [{ x: 4, y: 2 }, { x: 4, y: 4 }],
        obstacles: [{ position: { x: 2, y: 2 }, width: 1, height: 1 }],
        allowedMirrors: 2
      } as MirrorPuzzleData,
      optimalMoves: 2,
      explanation:
        'Bouncing the beam around the globe lands on the “STAFF ONLY” alcove marker—the same aisle where the crate of children’s books is tucked behind shelf 21.',
      narratorHint: 'Mrs. Maple scribbled “let the light read with you” on the map; the mirrors make her rhyme literal.',
      suspectReaction: 'Mr. Pine grins: "Billy insisted the globe stay—we used it to hide the mirror tape."'
    },
    {
      type: 'gear',
      difficulty: 'easy',
      caseId: 1,
      sceneId: 'library-after-hours',
      storyContext:
        'The music box diagram shows Gear A (winder), Gear B (chime), and Gear C (phone trigger). The note says “four turns to ring the desk phone.”',
      whyItMatters:
        'Syncing the gears proves the midnight calls were deliberate, not paranormal.',
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
      explanation:
        'Four full turns of Gear A advance Gear C just enough to lift the phone receiver for a single ring—exactly how the calls were timed for Sam.',
      narratorHint: 'Listen closely—the lullaby chime and the phone click happen in rhythm when the teeth line up.',
      suspectReaction: 'Billy beams: "Aunt Maple wanted the ring to land right on the lullaby’s high note."'
    },
    {
      type: 'logic',
      difficulty: 'easy',
      caseId: 1,
      sceneId: 'library-after-hours',
      storyContext:
        'A doodled legend on the floor plan lists three icons: a cookie crumb trail, a mailbag sketch, and a heart drawn around three stick figures.',
      whyItMatters:
        'The legend explains who placed each clue in the stacks.',
      data: {
        story:
          'Billy says: "I left the heart by the picture book shelf." Ms. Rose says: "I sprinkled crumbs near the staff door so Sam would smell the bakery." Mr. Pine says: "The mailbag marker shows where I stashed the spare key."',
        question: 'Who organized Mrs. Maple’s midnight map through the library?',
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
      explanation:
        'The icons match each friend’s clue—crumbs (Rose), mailbag (Pine), heart drawing (Billy). The doodled legend was their group signature.',
      narratorHint: 'Every icon on the map pairs with the object you already found in that aisle.',
      suspectReaction: 'Mr. Pine blushes: "We made sure Sam would see all three of us in that heart."'
    },
    {
      type: 'spatial',
      difficulty: 'easy',
      caseId: 1,
      sceneId: 'library-after-hours',
      storyContext:
        'A cardboard diorama of the library shows a cube with faces labeled Front Desk, Storytime Nook, Stacks A, Stacks B, Stairwell, and “Gift Crate.” Rotate it to match Mrs. Maple’s note.',
      whyItMatters:
        'Orienting the diorama shows the precise shelf column hiding the storybook crate.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'cube',
          faces: [
            { color: '#8B4513', pattern: 'front-desk' },
            { color: '#6b4423', pattern: 'storytime-nook' },
            { color: '#5a3a1b', pattern: 'stacks-a' },
            { color: '#4a2f16', pattern: 'stacks-b' },
            { color: '#3c2511', pattern: 'stairwell' },
            { color: '#2f1c0d', pattern: 'gift-crate' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 0, rotY: 90, rotZ: 0 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 2,
      explanation:
        'With the “Gift Crate” face rotated toward Stacks B and the Front Desk forward, the crate lines up with shelf 21—the final stop on the lamp sequence.',
      narratorHint: 'The crate side should stare directly at the aisle where the lamp sequence ended.',
      suspectReaction: 'Ms. Rose nods: "We practiced with that cardboard cube before hiding the real box."'
    }
  ],

  // Case 2: Blood on the Tracks (Detective - Medium)
  2: [
    {
      type: 'sequence',
      difficulty: 'medium',
      caseId: 2,
      sceneId: 'luxury-train-compartment-5c',
      storyContext:
        'The dispatcher’s schedule shows siding stops at mileposts 2, 5, 9, 14...? Each stop lines up with a secret maintenance hatch on the carriage wall.',
      whyItMatters:
        'Predicting the next hatch reveals where the killer could slip between compartments unseen.',
      data: {
        sequence: [2, 5, 9, 14, '?'],
        choices: [18, 19, 20, 21],
        correctAnswer: 20,
        patternType: 'compound'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation:
        'The gaps grow by +3, +4, +5, so the next stop is milepost 20. That hatch aligns with compartment 5C—the poisoned room.',
      narratorHint: 'The porter’s log says “count the gaps” next to the dispatch times.',
      suspectReaction: 'Sarah Chen smirks: "Maintenance ladders beat the crowded corridor every time."'
    },
    {
      type: 'mirror',
      difficulty: 'medium',
      caseId: 2,
      sceneId: 'luxury-train-compartment-5c',
      storyContext:
        'Polished brass luggage racks act like mirrors. Angle portable mirrors to bounce the dining car light toward the panel seam behind the wardrobe.',
      whyItMatters:
        'The light trace exposes the hairline seam of the secret connecting door.',
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
      explanation:
        'The beam rides the brass rack and lands on the wardrobe seam—proof the killer used the maintenance hatch instead of the hallway.',
      narratorHint: 'Luggage brass and shaving mirrors bounce light better than velvet wallpaper.',
      suspectReaction: 'Detective Cross mutters: "So that’s how she slipped past the porter."'
    },
    {
      type: 'gear',
      difficulty: 'medium',
      caseId: 2,
      sceneId: 'luxury-train-compartment-5c',
      storyContext:
        'Compartment 5C’s locking diagram shows gears labeled Bolt, Latch, and Hidden Catch. Only one was forced before the poison was poured.',
      whyItMatters:
        'Recreating the gear turn proves the killer bypassed the main lock via the hidden catch.',
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
      explanation:
        'Engaging the hidden catch rotates the lock twice without tripping the bolt—matching the untouched corridor lock Sarah left behind.',
      narratorHint: 'The blueprint shows the hidden catch sits between Bolt and Handle rather than inside the corridor door.',
      suspectReaction: 'The porter sighs: "I never imagined passengers studied the maintenance diagrams."'
    },
    {
      type: 'logic',
      difficulty: 'medium',
      caseId: 2,
      sceneId: 'luxury-train-compartment-5c',
      storyContext:
        'Conductor notes list who stood where on the dining car floor plan when the nightcap was poured and when the train paused for track clearance.',
      whyItMatters:
        'Only one suspect had overlap with the kitchen, secret door knowledge, and motive for both poison and theft.',
      data: {
        story:
          'Helena Strand had poison access but never left the dining car. Marcus Devereaux wanted the painting but had no time alone with the glass. Sarah Chen carried “art solvents,” reviewed the train blueprint, and vanished when the track clearance delay began. Detective Cross sat with the conductor. Porter Webb carried the tray but lacked motive for the painting.',
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
      explanation:
        'Sarah matched all three: motive, poison access disguised as paint medium, and knowledge of the hidden door from the maintenance schematic.',
      narratorHint: 'Track the only person whose alibi depends on the avalanche delay.',
      suspectReaction: 'Sarah’s jaw sets: "You followed the schedule and the schematics—fine."'
    },
    {
      type: 'spatial',
      difficulty: 'medium',
      caseId: 2,
      sceneId: 'luxury-train-compartment-5c',
      storyContext:
        'A folded carriage blueprint shows cutaway faces: Dining Car, Corridor, 4A Wardrobe, 5C Wardrobe, and Service Hatch. Rotate to see how the passage aligns.',
      whyItMatters:
        'Orienting the blueprint shows the hatch linking 4A and 5C without corridor access.',
      data: {
        object: {
          type: '3d-shape',
          shape: 'l-shape',
          faces: [
            { color: '#4a0e0e', pattern: 'dining-car' },
            { color: '#4a0e0e', pattern: 'corridor' },
            { color: '#4a0e0e', pattern: '4a-wardrobe' },
            { color: '#4a0e0e', pattern: '5c-wardrobe' },
            { color: '#4a0e0e', pattern: 'service-hatch' },
            { color: '#4a0e0e' }
          ],
          symmetry: false
        },
        targetOrientation: { rotX: 90, rotY: 45, rotZ: 0 },
        allowedAxes: ['x', 'y', 'z']
      } as SpatialPuzzleData,
      optimalMoves: 3,
      explanation:
        'With the Service Hatch facing the wardrobes, the blueprint confirms the killer slid through the hidden panel between 4A and 5C.',
      narratorHint: 'Wardrobe-to-wardrobe alignment is the only orientation where the hatch connects both compartments.',
      suspectReaction: 'Marcus Devereaux whistles: "That panel was worth the forged ticket alone."'
    }
  ],

  // Case 3: The Poisoned Pen (Detective - Medium)
  3: [
    {
      type: 'sequence',
      difficulty: 'medium',
      caseId: 3,
      sceneId: 'ashwood-study',
      storyContext:
        'Botanical labels tucked in the victim’s journal list seed counts: 2 (wolfsbane), 3 (nightshade), 5 (hemlock), 8 (castor beans)... which packet did the killer empty next?',
      whyItMatters:
        'The progression matches how many ricin-rich seeds were missing from the study desk.',
      data: {
        sequence: [2, 3, 5, 8, '?'],
        choices: [10, 11, 13, 15],
        correctAnswer: 13,
        patternType: 'mathematical'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation:
        'The counts follow the Fibonacci pattern; 13 castor beans are missing—the exact dosage for ricin in the teapot.',
      narratorHint: 'Marcus Thorne annotated the packets with a spiral doodle—the same growth curve as Fibonacci plants.',
      suspectReaction: 'Imogen Hart whispers: "He kept those beans as trophies. Someone knew."'
    },
    {
      type: 'mirror',
      difficulty: 'medium',
      caseId: 3,
      sceneId: 'ashwood-study',
      storyContext:
        'Charred manuscript scraps reveal faint ink when angled toward the mantel mirror. Use mirrors to reflect candlelight past the velvet armchair.',
      whyItMatters:
        'Reveals the missing paragraph accusing the ghostwriter.',
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
      explanation:
        'The restored reflection shows the line “Blackwood stole my words”—linking the burned pages to Imogen Hart’s stolen manuscript.',
      narratorHint: 'Aim for the scorched corner; the ink there reacts strongest to angled light.',
      suspectReaction: 'Natasha Volkov gasps: "So she wrote that chapter first…"'
    },
    {
      type: 'gear',
      difficulty: 'medium',
      caseId: 3,
      sceneId: 'ashwood-study',
      storyContext:
        'The hidden bookcase mechanism notes: Outer Gear lifts the sconce, Middle Gear slides the shelf, Inner Gear releases the latch. Only a precise chain reveals the manuscript nook.',
      whyItMatters:
        'Opening the nook exposes the real author’s pages and motive.',
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
      explanation:
        'Two turns of the Outer Gear followed by cycling Middle and Inner frees the Release gear—opening the compartment with Imogen’s original manuscript.',
      narratorHint: 'The sconce only tilts after the second outer turn; start there before touching the smaller gears.',
      suspectReaction: 'Jeremy Ashford mutters: "So the rumor about a hidden draft was real."'
    },
    {
      type: 'logic',
      difficulty: 'medium',
      caseId: 3,
      sceneId: 'ashwood-study',
      storyContext:
        'Interview cards pinned to the manor’s corkboard list each author’s expertise: botany, Gothic architecture, ink style, and money problems.',
      whyItMatters:
        'Only one profile aligns with ricin knowledge, secret passages, and blue ink letters.',
      data: {
        story:
          'Jeremy Ashford critiques plants but has no access to castor beans. Natasha Volkov studies poisons but writes with black ink. Father Walsh knows manuscripts but stayed in the chapel. Imogen Hart wears the dark coat seen in the kitchen, buys exotic seeds after an inheritance, and maps secret passages for her Gothic research.',
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
      explanation:
        'Imogen alone links blue ink letters, botanical expertise for ricin, and floor-plan knowledge of the secret passage that kept her unseen.',
      narratorHint: 'Match the ink color to the burnt draft and the seed receipts in the study.',
      suspectReaction: 'Imogen steels herself: "Blackwood stole twenty years. I took one night back."'
    },
    {
      type: 'spatial',
      difficulty: 'medium',
      caseId: 3,
      sceneId: 'ashwood-study',
      storyContext:
        'A miniature of the study shows book spines, a hidden latch, wall panel, manuscript niche, and ornate carving. Rotate to match the servant’s whispered directions.',
      whyItMatters:
        'Proper orientation reveals which book spine triggered the compartment.',
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
      explanation:
        'Aligning the hidden latch behind the ornate carving points to the “Garden of Good and Evil” spine—pulling it opens the manuscript niche.',
      narratorHint: 'Keep the carving facing you while the latch sits on your left; that mirrors the servant’s description.',
      suspectReaction: 'Father Walsh crosses himself: "A confession hidden in oak and brass."'
    }
  ],

  // Case 4: Ashes to Ashes (Master Detective - Hard)
  4: [
    {
      type: 'sequence',
      difficulty: 'hard',
      caseId: 4,
      sceneId: 'meridian-tower-22nd-floor',
      storyContext:
        'The evacuation drill map notes server room checks at 4, 8, 16, 32...? These times mirror when sprinkler valves were manually tested.',
      whyItMatters:
        'Projecting the next test shows when the arsonist planned to mask the accelerant timers.',
      data: {
        sequence: [4, 8, 16, 32, '?'],
        choices: [48, 56, 60, 64],
        correctAnswer: 64,
        patternType: 'mathematical'
      } as SequencePuzzleData,
      optimalMoves: 1,
      explanation:
        'Each check doubles—the missing 64-minute mark matches the deleted badge swipe from Hammond’s account.',
      narratorHint: 'The drill sheet has a “×2” scribble in the margin next to every interval.',
      suspectReaction: 'Koslow sighs: "She insisted on testing all three floors at once—that’s when I knew."'
    },
    {
      type: 'mirror',
      difficulty: 'hard',
      caseId: 4,
      sceneId: 'meridian-tower-22nd-floor',
      storyContext:
        'Security glass across Meridian Tower reflects the lobby mural. Use mirrors to trace the figure leaving at 3:15 AM across the atrium floor grid.',
      whyItMatters:
        'The reflection pins Hammond’s escape route that cameras inside missed.',
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
      explanation:
        'The traced path lines up with the service elevator blind spot, matching Hammond’s silhouette at 3:15 AM.',
      narratorHint: 'Use the marble compass rose on the floor as your anchor; every reflection crosses it.',
      suspectReaction: 'Detective Chen notes: "She thought the lobby art was just decoration."'
    },
    {
      type: 'gear',
      difficulty: 'hard',
      caseId: 4,
      sceneId: 'meridian-tower-22nd-floor',
      storyContext:
        'The fire suppression override schematic shows gears labeled Auth, Floor15, Floor18, Floor22, and Master. A handwritten arrow marks “rotate together.”',
      whyItMatters:
        'Replicating the rotation proves Koslow disabled three floors in one sequence.',
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
      explanation:
        'Turning Auth three times while keeping each floor gear meshed drives the Master gear exactly five turns—the pattern logged at 2:47 AM.',
      narratorHint: 'The handwritten arrow sits between Auth and Master; keep them engaged before touching floor gears.',
      suspectReaction: 'Koslow gulps: "I only followed Hammond’s sticky note."'
    },
    {
      type: 'logic',
      difficulty: 'hard',
      caseId: 4,
      sceneId: 'meridian-tower-22nd-floor',
      storyContext:
        'Incident board cards list evidence: ballistics, valve overrides, camera reflections, accelerant receipts, and offshore transfers.',
      whyItMatters:
        'Only one pairing of suspects connects every card.',
      data: {
        story:
          'Ballistics match Hammond’s 9mm. Suppression overrides use Koslow’s credentials at 2:47 AM. Camera reflection shows someone leaving at 3:15 AM. Accelerant was bought with Hammond’s signature. Phone records spike between Hammond and Koslow before the fire. Meridian and Chow fled with funds but lacked presence. Chen knows fire science but had no motive against Greer.',
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
      explanation:
        'Hammond supplied gun, motive, and accelerant purchases; Koslow supplied access to disable suppression. Their calls and mirrored timelines lock them together.',
      narratorHint: 'Pair the override timestamp with the camera reflection—it links Hammond and Koslow, not the Ponzi architects.',
      suspectReaction: 'Hammond snaps: "Koslow was supposed to delete those logs."'
    },
    {
      type: 'spatial',
      difficulty: 'hard',
      caseId: 4,
      sceneId: 'meridian-tower-22nd-floor',
      storyContext:
        'Greer’s encrypted USB holds a 3D model of Meridian Tower. Faces are labeled floor-15-servers, floor-18-accounting, floor-22-executive, and accelerant swaths.',
      whyItMatters:
        'Orienting the model shows the accelerant trail across all three floors.',
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
      explanation:
        'The aligned model overlays accelerant paths that start at servers, run through accounting, and end at Greer’s executive office—matching Hammond’s purchase receipts.',
      narratorHint: 'Keep the accelerant faces stacked along one diagonal; that mirrors the security overlay.',
      suspectReaction: 'Detective Chen: "They meant to erase every trail—this model saved one."'
    }
  ]
};
