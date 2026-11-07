---
name: Cabrera Kapital
description: Intermediario de crédito en Canarias — banca contada desde dentro, en azul marino, marfil y oro.
colors:
  ledger-navy: "#0a2240"
  branch-blue: "#10325a"
  canarian-gold: "#d8a858"
  lit-gold: "#e8b868"
  gold-ink: "#835f21"
  ivory-paper: "#f7f3ea"
  parchment: "#eee7d8"
  surface-white: "#ffffff"
  ink: "#181818"
  slate-note: "#55606e"
  ledger-rule: "#ddd3bf"
  morning-sky: "#eaf2f9"
  night-bg: "#0c1727"
  night-surface: "#14253c"
  night-text: "#e8e3d8"
  on-deep-muted: "#c4cedb"
  on-deep-soft: "#9fb0c4"
  on-deep-faint: "#4a617f"
  deep-line: "#1d3558"
  deep-ring: "#6d86a6"
  gold-cream: "#f3e0b8"
  foot-text: "#c9c4b8"
  foot-muted: "#9a958a"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(40px, 5.6vw, 84px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(30px, 4vw, 52px)"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.18em"
rounded:
  sm: "8px"
  field: "12px"
  card: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(18px, 5vw, 72px)"
  section: "clamp(56px, 8vw, 104px)"
  grid-gap: "22px"
  card-pad: "28px"
components:
  button-primary:
    backgroundColor: "{colors.canarian-gold}"
    textColor: "{colors.ledger-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.lit-gold}"
    textColor: "{colors.ledger-navy}"
  button-solid:
    backgroundColor: "{colors.ledger-navy}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  button-outline:
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "46px"
  card:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  input:
    backgroundColor: "{colors.ivory-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 14px"
    height: "50px"
  pill:
    backgroundColor: "{colors.ledger-navy}"
    textColor: "{colors.ivory-paper}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  nav:
    backgroundColor: "{colors.ledger-navy}"
    textColor: "{colors.ivory-paper}"
---

# Design System: Cabrera Kapital

## Overview

**Creative North Star: "Banca por dentro"**

The site reads like a well-written report by someone who spent twenty years inside a bank and now sits on your side of the table. The type does the talking: a warm serif (Newsreader) carries every headline in medium weight with slightly tight tracking, and a calm humanist sans (Manrope) carries everything practical. Decoration is scarce and always earned. Three things recur: the gold archipelago silhouette next to the "Intermediario de crédito en Canarias" eyebrow, the La Laguna rooftops under the home sky, and the circular gold CK emblem.

The palette is three notes that belong together: ledger navy for authority, ivory paper for warmth, and gold for the few things that matter: the main action, figures and the brand mark. Light and dark themes are both first-class. Dark is not inverted; it is its own night palette, with ivory text on deep blue and gold that stays legible.

Everything is warm and calm. Pills and generous rounded corners, soft hairline borders, and shadows that appear only on hover. Nothing pushes, flashes or hurries, because many visitors are older and none should feel pressured. Real people and places only: no stock photography, no Teide, and no floating social buttons.

**Key Characteristics:**
- Serif headlines (Newsreader 500, −0.02em), sans body (Manrope 17px/1.6).
- Navy / ivory / gold, with gold reserved for action, figures and the brand.
- Pill buttons and 20px cards; flat at rest, lifted on hover.
- Light and dark themes defined token by token (`data-theme`).
- Motion is scroll-led on the home page and always disabled under `prefers-reduced-motion`.
- Only real imagery: the office, the partners, the city silhouette and the islands.

## Colors

Ledger navy, ivory paper and Canarian gold: a banking palette warmed by island light.

### Primary
- **Ledger Navy** (#0a2240): the brand's authority colour. Used for the navigation bar, headings on light backgrounds, solid buttons and pills, the final CTA band and the city silhouette. Branch Blue (#10325a) is its hover and second-depth step.

### Secondary
- **Canarian Gold** (#d8a858): the action and brand accent. Used for the primary "Pedir estudio gratuito" button, figures (20+ / 0 € / E593), the archipelago seal, the scroll-progress bar and every focus ring. Lit Gold (#e8b868) is its hover state and the active nav link. Gold Ink (#835f21) is the darkened gold for small text on light backgrounds (4.7:1 on parchment).

### Neutral
- **Ivory Paper** (#f7f3ea): page background, and text on navy.
- **Parchment** (#eee7d8): alternate section background (`.sec.alt`).
- **Surface White** (#ffffff): cards and logo plates.
- **Ink** (#181818): body text and the footer background.
- **Slate Note** (#55606e): secondary text, card descriptions and helper copy.
- **Ledger Rule** (#ddd3bf): hairline borders on cards and inputs.
- **Morning Sky** (#eaf2f9): the pale blue band behind the manifesto and editorial sections.
- **Night palette (dark theme):**
  - background: Night Bg (#0c1727), with #101e33 as the alternate;
  - surface: Night Surface (#14253c);
  - text: Night Text (#e8e3d8), with headings #f3ecdd;
  - gold text: #e0b56a.

### On Deep Navy
These sit on surfaces that stay dark in both themes (the CTA band, the services rows, the video card and the hero), so they do not change with `data-theme`.

- **On-Deep Muted** (#c4cedb): secondary text on navy, as in the CTA paragraph, the video card caption and the map card note.
- **On-Deep Soft** (#9fb0c4): quieter supporting text on navy, as in the services intro and the italic verbs.
- **On-Deep Faint** (#4a617f): the large inactive service words before they light up.
- **Deep Line** (#1d3558): dividers between rows on navy.
- **Deep Ring** (#6d86a6): thin outlines of numbered circles on navy.
- **Gold Cream** (#f3e0b8): the italic emphasis in the hero headline and claim ("para *pymes*", "por *dentro*").
- **Foot Text** (#c9c4b8) / **Foot Muted** (#9a958a): footer copy and the bottom line.

### Named Rules
**The Gold Is Earned Rule.** Gold marks only the main action, key figures, the brand mark and focus. If gold appears on something a visitor cannot act on or should not remember, remove it.

**The Two Themes Rule.** Every colour is set through a role variable (`--bg`, `--surface`, `--text`, `--heading`, `--accent-text`, `--solid`…). Components never hard-code a theme colour, so dark mode stays correct.

## Typography

**Display Font:** Newsreader (with Georgia, serif), a variable font with weight axis only, plus the italic.
**Body Font:** Manrope (with Helvetica Neue, Arial, sans-serif), a variable font with weight axis only.

**Character:** a literate, slightly bookish serif speaks for the firm. A clear, modern sans handles everything a person has to do. Italic serif is the single emphasis device ("para *pymes*", "por *dentro*"), always in the light gold tint on dark backgrounds.

### Hierarchy
- **Display** (500, clamp(40px, 5.6vw, 84px), 1.06): the home hero headline only. Mobile uses clamp(30px, 8.8vw, 40px).
- **Headline** (500, clamp(30px, 4vw, 52px), 1.06): section titles. The CTA uses up to 56px.
- **Title** (500, 26px): card headings.
- **Body** (400, 17px, 1.6): running text. Secondary paragraphs use 15px in Slate Note, at roughly 36–52ch.
- **Label** (700, 12px, 0.18em, uppercase): eyebrows above headings, in gold on dark and Gold Ink on light.
- **Figure** (Newsreader 500, up to 64px, gold): numbers that prove something (years, fees, registry).

### Named Rules
**The Serif Speaks, Sans Works Rule.** Headings, figures and the brand name are serif. Buttons, labels, forms and navigation are sans. Never set a button in serif or a section title in sans.

**The Balanced Line Rule.** Headings use `text-wrap: balance`. Never force breaks that leave a single orphan word.

## Layout

- **Container:** content sits in a centred container of at most 1440px, with a fluid side gutter of clamp(18px, 5vw, 72px).
- **Sections:** they stack vertically with clamp(56px, 8vw, 104px) of block padding and alternate between ivory and parchment. Section headers place the title on the left and a short muted note on the right, 40px above the content.
- **Grids:** 3- or 4-column card grids with 22px gaps, collapsing to one column on mobile.
- **Home page:** a pinned, scroll-driven sequence (hero → giant "CABRERA KAPITAL" wordmark → sky panel with the manifesto lighting word by word), then a pinned three-step story.
- **Breakpoints:**
  - ≤767px: mobile.
  - ≤1200px: hamburger menu.
  - ≥1200px, landscape: video card beside the hero.
  - ≥1700px: the city silhouette stops growing and is mirrored at the sides.
- **Short screens:** dedicated height-based rules at 960, 760 and 720px keep the hero from overlapping on laptops and short phones.

## Elevation & Depth

The system is flat at rest and depth appears on interaction. Surfaces separate through tonal steps (ivory → parchment → white) and 1px hairlines in Ledger Rule. Shadows use a theme-aware base colour (`--sh`: navy in light, black in dark). Atmospheric depth lives only in the home hero: layered sky gradient, sun glow and city silhouette.

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 18px 36px rgb(var(--sh) / 0.1)`): card hover, paired with `translateY(-5px)`.
- **Nav hairline** (`box-shadow: 0 1px 0 rgba(232, 184, 104, 0.25)`): a gold underline once the page scrolls, with a 10px backdrop blur.
- **Floating panel** (`box-shadow: 0 18px 40px -12px rgb(var(--sh) / 0.35)`): the cookie notice and floating cards.
- **Modal** (`box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55)`): the video dialog.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow at rest except floating layers (cookie notice, modal, video card). Shadows answer hover, elevation or focus.

## Shapes

Generously rounded and friendly, never sharp.
- **Buttons, pills and chips:** fully round (999px).
- **Cards:** softly rounded corners (20px).
- **Inputs:** gently rounded (12px).
- **Small brand tiles:** 8px.
- **Signature silhouettes:** the La Laguna rooftops (an SVG mirrored on wide screens) and the archipelago (an SVG in gold).
- **Focus ring:** a 3px gold outline at 3px offset with 6px rounding, on every interactive element.

## Components

### Buttons
Warm and calm: big enough to find, never shouting.
- **Shape:** fully rounded pill (999px), at least 46px tall, with 24px side padding and Manrope 700 at 15px.
- **Primary (gold):** Canarian Gold background with Ledger Navy text, used for "Pedir estudio gratuito" / "Estudio gratuito". Hover goes to Lit Gold over 0.3s.
- **Solid (navy):** Ledger Navy background with ivory text. In dark mode it inverts to ivory with navy text. Used for secondary confirmations, such as the cookie Accept/Reject buttons, which have equal weight by law.
- **Outline:** transparent, with a 1px ivory border at 45% and ivory text, used only on dark bands (CTA "Llamar"). Hover adds a 10% ivory wash. The `.line` class must always be combined with `.btn`.
- **Focus:** the global gold ring.

### Cards / Containers
- **Corner Style:** 20px.
- **Background:** Surface White (Night Surface in dark), with a 1px Ledger Rule border.
- **Shadow Strategy:** flat; on hover the card lifts 5px with the card-lift shadow.
- **Internal Padding:** 28px, with a 10px gap between the serif title and the muted 15px text.
- **Pill:** a navy pill (12px, bold) can sit at the foot of a card.

### Inputs / Fields
- **Style:** 50px tall, 12px radius, 1px Ledger Rule border, ivory field background (deep night in dark mode), inherited body font.
- **Focus:** the global gold focus ring. Segmented choices and option cards use a 2px gold outline on `:has(input:focus-visible)`.
- **Textarea:** 130px tall, vertical resize only.

### Navigation
- **Bar:** sticky navy bar with ivory links in Manrope 500 at 15px and 30px gaps.
- **Hover:** the link turns Lit Gold and the label "rolls" (a two-layer span generated at build time; the copy is `aria-hidden`).
- **Active link:** bold Lit Gold with a 2px gold underline.
- **On scroll:** the bar becomes translucent with a blur and a gold hairline.
- **Up to 1200px:** a hamburger opens a full menu that includes the theme toggle, the language flags and a labelled Instagram link.

### Hero Seal (signature)
The gold archipelago silhouette (SVG, up to 460px on desktop, 170px on mobile) sits inline beside the uppercase eyebrow "Intermediario de crédito en Canarias". It is the only place islands appear, and it stays aligned to the left of the eyebrow, never centred above it.

### Video Card (signature)
A vertical 9:16 poster card with a gold play disc and a title. On landscape desktop (≥1200px) it is a tall card to the right of the hero text; on mobile and tablet it is a compact row (52px thumbnail) below the CTA. Pressing it opens a native `<dialog>`, and the video is only fetched then.

### Review Card
A card with the stars, a 6-line clamp with "Leer más", and the reviewer's round avatar (the Google photo over their initial, as a fallback). All cards in the carousel share the height of the tallest collapsed card.

## Do's and Don'ts

### Do:
- **Do** set every colour through role variables so both themes stay correct.
- **Do** keep gold for the primary action, figures, the brand mark and focus.
- **Do** use Newsreader 500 with −0.02em tracking for headings and figures, and Manrope for everything interactive.
- **Do** use pill buttons at least 46px tall and 20px-radius cards with hairline borders.
- **Do** show only real photography: the office, Olegario, Alejandro and the team.
- **Do** make every animation start without waiting for JavaScript where it affects first paint, and switch all motion off under `prefers-reduced-motion`.
- **Do** keep text cursors and hover highlights off non-editable headline text.

### Don't:
- **Don't** use stock photography or generic finance imagery.
- **Don't** use the Teide or any volcano/mountain motif.
- **Don't** add floating social buttons. Instagram lives in the header, the menu and the footer.
- **Don't** centre the archipelago above the eyebrow; it stays inline.
- **Don't** introduce colours outside navy, ivory and gold. The only exception is WhatsApp green on its own button.
- **Don't** add resting shadows to cards or sections.
- **Don't** leave blank, empty-sky moments in the scroll sequence; one element should hand over to the next.
