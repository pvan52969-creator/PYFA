# PPTX Generation Rules

When generating a PowerPoint file programmatically:

1. Never create slides by simply placing large blocks of text.
2. Every slide must have a defined visual layout.
3. Maintain consistent margins and alignment.
4. Use reusable design components.
5. Use a slide grid system.
6. Keep typography consistent across all slides.
7. Use whitespace intentionally.
8. Prefer diagrams, cards, timelines, flows, and visual hierarchy over paragraphs.
9. Do not overcrowd slides.
10. Every slide must be presentation-ready without manual cleanup.

## Required Slide Validation

Before finalizing the PPT:

- Check for text overflow.
- Check whether elements overlap.
- Check alignment consistency.
- Check title positioning.
- Check font size readability.
- Check spacing between components.
- Check whether tables are too dense.
- Check whether slides have too much text.

If a slide is too dense:

Split it into multiple slides.

Never reduce font size excessively just to fit more content.

## Design Consistency

Reuse:

- Title styles
- Section styles
- Card styles
- Diagram styles
- Spacing rules
- Color system
- Footer system

The PPT should feel like one complete design system rather than independently generated slides.