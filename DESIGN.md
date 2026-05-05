# Design Brief

## Direction

BUZZY BITES — a warm, editorial restaurant discovery and reservation platform where ambience photography drives discovery and tables are booked with confidence.

## Tone

Refined editorial warmth meets hospitality luxury — sophisticated yet approachable, like a curated travel magazine for dining experiences.

## Differentiation

Ambience-first design where photography is the hero and the interface frames it with intentional surfaces and breathing space.

## Color Palette

| Token              | OKLCH         | Role                                |
| ------------------ | ------------- | ----------------------------------- |
| background         | 0.96 0.015 75 | Warm cream main surfaces            |
| foreground         | 0.2 0.03 50   | Deep warm text on light backgrounds |
| card               | 0.98 0.01 75  | Image-framing card containers       |
| primary            | 0.45 0.12 30  | Deep burgundy CTAs and actions      |
| primary-foreground | 0.96 0.01 30  | Light text on burgundy              |
| accent             | 0.5 0.1 160   | Muted sage for secondary highlights |
| muted              | 0.92 0.02 75  | Soft taupe section dividers         |
| destructive        | 0.5 0.2 25    | Warm coral for destructive actions  |
| border             | 0.88 0.025 75 | Subtle warm borders                 |

## Typography

- Display: Lora — warm serif for headings, restaurant names, section titles
- Body: Satoshi — refined sans-serif for descriptions, filters, form labels
- Scale: hero `text-7xl font-bold`, h2 `text-4xl font-bold`, label `text-sm uppercase`, body `text-base`

## Elevation & Depth

Soft shadow hierarchy: subtle `0 2px 8px` for card hover states, elevated `0 4px 16px` for modals and dropdowns. No harsh shadows — warmth through layering and image framing.

## Structural Zones

| Zone    | Background        | Border                  | Notes                            |
| ------- | ----------------- | ----------------------- | -------------------------------- |
| Header  | `bg-card`         | `border-b border-muted` | Soft card surface with top glow  |
| Content | `bg-background`   | —                       | Warm cream, card-grid dominant   |
| Section | `bg-muted/20`     | —                       | Alternating rhythm for rhythm    |
| Footer  | `bg-muted/30`     | `border-t border-muted` | Soft taupe baseline              |

## Spacing & Rhythm

Generous spacing (2rem section gaps, 1rem card padding) with warm overlays on images. Breathing room emphasizes editorial curation over density.

## Component Patterns

- Buttons: Burgundy primary (`bg-primary`), soft hover with shadow lift
- Cards: 12px border-radius, image-first with warm overlay gradient, `shadow-subtle` baseline
- Filters: Sage accent pill buttons, transparent background with sage border on active
- Badges: Cuisine/price in warm neutral with burgundy accent text

## Motion

- Entrance: `fade-in` 0.3s ease-out on page load, `slide-up` 0.3s for card stagger
- Hover: Subtle `shadow-elevated` lift on interactive cards, primary color shift on buttons
- Decorative: Smooth color transitions on filters, gentle scale on image hover

## Constraints

- No gradients on text — text only in solid OKLCH tokens
- Images always constrained to 16:9 aspect ratio with 12px corners
- All borders use `border-border` token, never raw greys
- Maximum two weights of Lora (bold for display, regular for accents)

## Signature Detail

Warm overlay gradients on restaurant card images: subtle burgundy-to-transparent 45° overlay that frames the image while keeping photography as the dominant visual element — a hospitality-luxury hallmark.
