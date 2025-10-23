# Design Guidelines: Educational Gamification Platform (Ages 5-8)

## Core Principles
**Joyful & Encouraging** • **Clear & Simple** • **Playful & Safe** • **Achievement-Driven**

Inspired by Duolingo's gamification, Khan Academy Kids' interface, ABCmouse's progression, and Epic!'s card patterns.

## Typography

**Fonts** (Google): Fredoka (headers), Nunito (body/UI) • Weights: 400, 600, 700

**Scale**:
```
Hero: text-5xl md:text-6xl (48-60px)
Page Headers: text-3xl md:text-4xl (30-36px)
Sections: text-2xl md:text-3xl (24-30px)
Cards: text-xl md:text-2xl (20-24px)
Body: text-lg md:text-xl (18-20px)
Metadata: text-base (16px)
Labels: text-sm font-semibold uppercase (14px)
```
All text: `leading-relaxed` (1.625)

## Layout & Spacing

**Primitives**: 2, 4, 6, 8, 12, 16
- Micro: p-2, gap-2
- Standard: p-4/p-6, gap-4
- Section: p-8, py-12, gap-8
- Major: p-12, py-16, gap-12

**Containers**: 
- App: max-w-7xl mx-auto px-4
- Questions: max-w-4xl
- Modals: max-w-2xl to max-w-3xl
- Forms: max-w-2xl

**Grids**: Mobile `grid-cols-1 gap-4` → Tablet `md:grid-cols-2 gap-6` → Desktop `lg:grid-cols-3 xl:grid-cols-4 gap-6/gap-8`

## Navigation

**Top Bar** (fixed, shadow-xl, rounded-b-3xl):
- Height: h-20 (mobile), h-24 (desktop)
- Left: Avatar w-12 h-12 + level badge
- Center: Streak counter (fire emoji), level progress ring
- Right: Animated points (star, pulse), settings (w-10 h-10)

**Mobile Bottom Tabs** (fixed, h-20, rounded-t-3xl, shadow-2xl):
- 4 tabs: Home, Challenges, Rewards, Profile
- Icons: w-8 h-8, active scales to w-10 h-10
- Labels: text-xs, bold when active

**Desktop Sidebar**: w-64, fixed, full-height, persistent stats

## Core Components

### Dashboard

**Hero Stats**: rounded-3xl, p-8 md:p-12, shadow-2xl
- Total points: text-5xl, animated counter
- Progress bar: h-6, rounded-full, animated fill
- 3-col stats: streak, badges, challenges
- Recent badges: w-16 h-16, horizontal scroll

**Quick Actions**: md:grid-cols-2 lg:grid-cols-4, gap-6
- Cards: rounded-2xl, p-6, icon (text-6xl/w-16 h-16), text-xl title
- Hover: scale-105, shadow-xl

**Activity Feed**: Timeline, 5 recent items, rounded-xl, p-4

### Questions

**Card**: max-w-4xl, rounded-3xl, shadow-2xl, p-8 md:p-12
- Progress: "3 of 10" + h-3 bar
- Difficulty badge: ⭐ Easy, ⭐⭐ Medium, ⭐⭐⭐ Hard
- Question: text-2xl md:text-3xl, font-bold, mb-6
- Image: max-w-md, rounded-2xl, shadow-lg, centered, mb-8

**Answers**: grid-cols-1 md:grid-cols-2, gap-4
- Buttons: min-h-20, rounded-2xl, p-4, text-lg md:text-xl
- States: hover (shadow-lg, scale-102), selected (border-4, glow)

**Feedback**:
- ✓ Correct: Full-screen confetti, w-24 h-24 checkmark, "+50 XP" text-4xl, h-16 continue button
- ✗ Incorrect: Card shake, friendly message, retry button

### Challenges

**Discovery**: Sticky filter pills (rounded-full, px-6, py-2, horizontal scroll) + grid md:grid-cols-2 lg:grid-cols-3, gap-6

**Card**: rounded-3xl, shadow-lg, p-6
- Top: Emoji (text-6xl), category badge (rounded-full, px-3, py-1, text-xs)
- Title: text-xl, font-bold
- Metadata: difficulty (stars), duration (clock), XP (star, text-2xl)
- Progress: h-2 bar at bottom
- Completed: checkmark overlay (w-12 h-12, top-right)
- Button: full-width, h-12, rounded-xl

**Detail Modal**: max-w-3xl, rounded-3xl, p-8
- Hero emoji: text-7xl
- Title: text-3xl
- Requirements checklist
- "Accept" button: h-16, rounded-2xl, full-width

### Rewards

**Header**: Large card, available points (text-4xl, coin icon)

**Grid**: md:grid-cols-2 lg:grid-cols-3, gap-6

**Card**: rounded-3xl, shadow-lg
- Image: aspect-square, rounded-t-3xl OR emoji (text-6xl, h-48 centered)
- Body: p-4, title (text-lg bold), points (text-2xl, coin icon)
- Button: h-12, rounded-xl, full-width (opacity-50 if disabled)
- Affordable: border-4 glow

### Achievements

**Grid**: sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4, gap-6

**Badge**: aspect-square, rounded-3xl, p-6, centered column
- Icon: text-6xl
- Title: text-base, font-bold, mt-4
- Locked: grayscale, lock overlay (w-8 h-8)
- Unlocked: pulse hover, shimmer

**Detail**: Enlarged icon (text-8xl), description, unlock date, progress

### Profile

**Header**: Avatar w-32 h-32, level badge (w-12 h-12, bottom-right), username (text-3xl), title (text-lg)

**Stats Grid**: md:grid-cols-2 lg:grid-cols-4, gap-4
- Cards: rounded-2xl, p-6, icon (w-10 h-10), number (text-3xl), label (text-sm)

**Timeline**: Vertical list, 10 recent items

## Common Elements

**Buttons**:
```
Primary: h-14 px-8 rounded-xl text-lg font-semibold
Secondary: h-12 px-6 rounded-lg text-base
Small: h-10 px-4 rounded-lg text-sm
Icon: w-12 h-12 rounded-full
Hover: scale-105 shadow-lg duration-300
Disabled: opacity-50 cursor-not-allowed
```

**Progress Bars**: h-3 (subtle), h-4 (standard), h-6 (prominent) • rounded-full, animated

**Modals**: backdrop-blur-sm, max-w-2xl/3xl, rounded-3xl, p-8 md:p-12, shadow-2xl, close button (w-10 h-10, top-right)

**Celebrations**: Full-screen, confetti, trophy (w-32 h-32), "Amazing!" (text-4xl), points (text-3xl, counter), continue (h-16, rounded-2xl)

## Animations (duration-300)

**Micro**: Button hover (scale-105), card hover (shadow-lg), points (bounce+scale), badge unlock (pulse)

**Feedback**: Error (shake), success (bounce), loading (rotating gradient spinner)

**Transitions**: Page fade (duration-200)

## Images

**Questions**: max-w-md, aspect-video/square, rounded-2xl, shadow-lg, centered (alt text required)

**Rewards**: aspect-square, object-cover, rounded-t-3xl OR emoji fallback (text-6xl, h-48)

**Achievements**: SVG/emoji, w-16 h-16 (grid), w-24 h-24+ (detail), rarity via border

**Empty States**: Large icon (text-6xl), message (text-xl), CTA button

## Accessibility

**Touch Targets**: 44px min (WCAG), h-12 to h-16 preferred, gap-4 minimum spacing

**Visual**:
- Contrast: 4.5:1 (body), 3:1 (large text)
- Focus: ring-4 ring-offset-2
- Hierarchy: size/weight differences

**Feedback**: Loading (spinner + text), errors (friendly, constructive), success (visual + text)

## Responsive

**Mobile (<768px)**: Single column, bottom tabs, full-width modals (rounded-t-3xl), h-14 buttons, horizontal scroll filters

**Tablet (768-1024px)**: 2-col grids, side nav option, py-12, modal max-widths

**Desktop (>1024px)**: 3-4 col grids, persistent sidebar, hover states, max-widths, py-16 gap-8

**Strategy**: Mobile-first, progressive enhancement