# Puzzle Redesign - Detailed Breakdown

## Visual Design System

### Color Palette
```
Background:
- bg-slate-900 (main background)
- bg-slate-800/90 (card background with transparency)
- bg-slate-950 (grid/dark areas)

Accent Colors:
- text-amber-400 (headers, labels)
- border-amber-900/30 (borders)
- bg-amber-900/20 (sections)
- text-amber-300 (secondary text)

Success States:
- green-400, green-500 (correct answers, success)
- border-green-700/40

Error States:
- red-400, red-500 (incorrect answers)
- border-red-700/40

Interactive:
- blue-900/30 (buttons, controls)
- purple-900/30 (special actions)
```

### Typography
```
Headers:
- UPPERCASE tracking-wide
- text-2xl sm:text-3xl font-bold

Body Text:
- text-slate-200 (primary)
- text-slate-300 (secondary)
- text-slate-400 (tertiary)

Story Text:
- italic leading-relaxed
- font-serif for evidence
```

### Spacing System
```
Container Padding: p-6 sm:p-8
Section Margins: mb-6
Border Radius: rounded-lg, rounded-xl, rounded-2xl
Gaps: gap-2, gap-3, gap-4
```

---

## Component-Specific Features

### 1. SequencePuzzle
**Unique Elements:**
- Evidence sequence display with question mark
- Pattern explanation after solving
- Multiple element types (numbers, colors, shapes, emojis)
- Animated entry for each sequence element

**Key Interactions:**
- Click choice to answer
- Immediate visual feedback (green/red glow)
- 3-second delay before completion with explanation

---

### 2. MirrorPuzzle
**Unique Elements:**
- Animated light beam paths with glow
- Interactive grid for mirror placement
- Glowing light source and target indicators
- Cyan reflective mirror visualization

**Key Interactions:**
- Click empty cells to place mirrors
- Click mirrors to rotate 45°
- Click X to remove mirrors
- Visual light path updates in real-time
- "TARGET LOCKED" when beam reaches target

---

### 3. GearPuzzle
**Unique Elements:**
- SVG-rendered gears with teeth
- Animated rotation when chain connected
- Dashed connection lines between gears
- Color-coded gears (orange start, green end)

**Key Interactions:**
- Click gears to toggle connections
- Turn crank button (disabled until chain complete)
- Gears rotate opposite directions when meshed
- Visual feedback for gear relationships

---

### 4. LogicPuzzle
**Unique Elements:**
- Case evidence in serif italic font
- Lettered answer badges (A, B, C, D)
- Separate Case Brief and Evidence sections
- Slide-right hover effect on answers

**Key Interactions:**
- Click answer to select
- Badge changes color on selection
- Check/cross indicator appears
- Explanation panel slides in on success

---

### 5. SpatialPuzzle
**Unique Elements:**
- Side-by-side comparison (Target vs Current)
- 3D cube representation with colored faces
- Rotation and flip controls grouped
- Green vs Amber section headers

**Key Interactions:**
- Rotate left/right buttons (90° increments)
- Flip horizontal button
- Real-time visual comparison
- "ORIENTATION MATCHED" indicator

---

## Animation Patterns

### Entry Animations
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
```

### Element Stagger
```jsx
transition={{ delay: index * 0.1 }}
```

### Success Animations
```jsx
animate={{
  scale: [1, 1.2, 1],
  boxShadow: [
    '0 0 20px rgba(74, 222, 128, 0.6)',
    '0 0 40px rgba(74, 222, 128, 1)',
    '0 0 20px rgba(74, 222, 128, 0.6)'
  ]
}}
transition={{ repeat: Infinity, duration: 1 }}
```

### Hint Expansion
```jsx
<AnimatePresence>
  {hints > 0 && (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
    />
  )}
</AnimatePresence>
```

---

## Story Context Integration

Each puzzle reads from `/src/data/puzzles.ts`:

```typescript
const caseId = currentZone?.id || 1;
const casePuzzleData = casePuzzles[caseId]?.find(p => p.type === 'sequence');
const storyContext = casePuzzleData?.storyContext || 'Default text';
const explanation = casePuzzleData?.explanation || 'Default explanation';
```

### Example Story Contexts:

**Case 1 - Sequence:**
> "The cookie crumbs trail leads from the entrance, past shelf 3, 5, 8, 13... Which shelf is next?"

**Case 2 - Mirror:**
> "The pharmacy vial was dropped in the corridor. Use the mirrors to trace the light path and reveal where the person came from."

**Case 3 - Gear:**
> "The library bookcase concealing the passage requires rotating hidden gears in sequence. Solve the mechanism to reveal the secret compartment."

---

## Stats Bar Implementation

Common across all puzzles:

```jsx
<div className="flex flex-wrap gap-4 mt-4 text-sm">
  <div className="flex items-center gap-2 text-slate-300">
    <Clock className="w-4 h-4 text-amber-500" />
    <span className="font-mono">{formatTime(elapsedTime)}</span>
  </div>
  <div className="flex items-center gap-2 text-slate-300">
    <Target className="w-4 h-4 text-amber-500" />
    <span>Metric: {count}</span>
  </div>
  <div className="flex items-center gap-2 text-slate-300">
    <HelpCircle className="w-4 h-4 text-amber-500" />
    <span>Hints Used: {hints}</span>
  </div>
</div>
```

---

## Detective Theme Icons

- **Search** (SequencePuzzle) - Evidence analysis
- **Zap** (MirrorPuzzle) - Light/energy analysis
- **Settings** (GearPuzzle) - Mechanism analysis
- **Brain** (LogicPuzzle) - Deduction board
- **Box** (SpatialPuzzle) - Physical evidence

---

## Film Grain Effect

Applied to all puzzles:

```jsx
<div className="absolute inset-0 opacity-[0.15] pointer-events-none bg-[url('data:image/svg+xml;base64,...')]"></div>
```

This SVG creates a subtle noise texture that mimics film grain, enhancing the noir aesthetic.

---

## Button Styling Patterns

### Primary Actions (Verify/Submit):
```jsx
className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600
  hover:from-amber-500 hover:to-orange-500 text-white rounded-lg
  font-semibold transition-all flex items-center gap-2 shadow-lg
  border border-amber-500/30"
```

### Secondary Actions (Hints):
```jsx
className="flex items-center gap-2 px-4 py-2 bg-amber-900/30
  hover:bg-amber-900/50 text-amber-300 rounded-lg transition-all
  border border-amber-700/30 hover:border-amber-600/50"
```

### Control Buttons (Rotate, etc.):
```jsx
className="flex items-center gap-2 px-4 py-2 bg-blue-900/30
  hover:bg-blue-900/50 text-blue-300 rounded-lg transition-all
  border border-blue-700/30 hover:border-blue-600/50"
```

---

## Mobile Responsiveness

All puzzles use responsive utilities:

- Container: `p-4 sm:p-8`
- Headers: `text-2xl sm:text-3xl`
- Grid layouts: `grid-cols-2 md:grid-cols-4`
- Flex wrapping: `flex-wrap`
- Gap adjustments: `gap-2 sm:gap-4`

---

## Performance Considerations

1. **AnimatePresence** only on conditional elements
2. **Timer intervals** cleaned up on unmount
3. **Companion state updates** throttled to key moments
4. **SVG rendering** optimized with transforms
5. **Film grain** as base64 SVG to avoid network request

---

## Accessibility Features

1. Disabled states on buttons
2. Clear visual feedback for all interactions
3. Semantic HTML structure
4. Sufficient color contrast (WCAG AA)
5. Keyboard navigation support (built into button elements)
6. Screen reader friendly labels

---

## Future Enhancements

Potential additions for even better experience:

1. Sound effects using Web Audio API
2. Particle effects on success
3. Smoother 3D rotations for SpatialPuzzle
4. Animated tutorial overlays
5. Achievement badges display
6. Difficulty indicators
7. Best time/score tracking
8. Social sharing for puzzle completion
