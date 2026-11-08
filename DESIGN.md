# DESIGN.md - Romantic 1:1 Birthday Interactive Experience

## Identity & Mood
- **Product**: Interactive 8-scene birthday gift web experience (`Her Special Day`)
- **Audience**: User's girlfriend (Mobile-first primary viewing experience, full Desktop responsiveness)
- **Visual Language**: Romantic Warm Burgundy & Rose-Gold Editorial Storytelling (1:1 faithful adaptation of reference video `v14044g50000d8lfhu7og65qnr839hf0.mp4`)
- **Dial**: `ENERGY 2 / RHYTHM 3 / MOTION 3`

## Color Palette (3 Core + 1 Accent)
- **Core 1 (Deep Burgundy Night)**: `#0d0609` (Primary background surface)
- **Core 2 (Warm Plum Surface)**: `#1c0e15` (Elevated card & letter surface)
- **Core 3 (Warm Ivory Text)**: `#f9eef2` (Primary readable text, 16.5:1 contrast against `#0d0609`) & `#dbc4cd` (Secondary soft rose-ivory text, 10.8:1 contrast against `#0d0609`)
- **Accent (Rose Gold / Blush)**: `#e87a9f` (Interactive CTA accent, active progress bar, gift ribbon highlight)

## Typography
- **Display / Headings**: `'Playfair Display'`, Georgia, serif (Used for romantic editorial headlines with deliberate italic emphasis matching reference video)
- **Body / Controls**: `'Plus Jakarta Sans'`, -apple-system, BlinkMacSystemFont, sans-serif (Clean legibility on mobile screens for UI buttons, timers, and letter paragraphs)

## Architectural Decisions & One-Line Reasons (R-31)
- **Color**: Deep burgundy (`#0d0609`) with warm plum (`#1c0e15`) and rose-gold (`#e87a9f`) reproduces the exact warm candlelit atmosphere of the reference video while maintaining >4.5:1 WCAG AA contrast.
- **Layout**: An 8-scene sequential state-machine layout guides the recipient step-by-step from anticipation (countdown) to unwrapping, reading, reminiscing, watching, and closing.
- **Typography**: Pairing high-contrast serif (`Playfair Display`) for emotional titles with `Plus Jakarta Sans` for body copy gives an authentic love-letter editorial feel without sacrificing mobile readability.
- **Spacing**: Fluid `clamp()` spacing and `100dvh` scene containers with safe-area padding ensure mobile viewports feel intimate and uncluttered without accidental clipping.
- **Cards**: Polaroid photo frames (`#ffffff` border frame with subtle rotation) and the single frosted letter container (`#1c0e15` with border) serve real skeuomorphic storytelling (physical photos and a letter box).
- **Illustrations & Motion**: Custom SVG gift box with animated lid opening, canvas starfield/heart-bokeh, and typewriter text reveal directly fulfill the 1:1 choreographed narrative of the reference video.
