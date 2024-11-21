---
title: Typography
sidebar_position: 4
---

# Typography

Typographical selections intended to meet the highest standards of usability and accessibility, while setting a consistent look and feel in order to convey credibility.

## Typography tokens

Typography tokens define each property of a text style. They include font family, style, size, line height, and letter spacing. Math is used to calculate values for size and line height.

- The base font size is 16. Additional sizes are created using a scale of 1.125
- The default line height is set to 1.5x the font size. For headings, the line height is set to 1.2x. Line heights follow [accessibility best practices](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/QA/QualityAssuranceProcess/Accessibility/a11y-checklist-ux-designers) and should not be decreased without consulting an accessibility specialist.

### Primitive
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-typography--docs#primitive)
<iframe width="800" height="800" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=2318-2705&t=CwihCLOelO0fGAMq-4" allowfullscreen></iframe>

### Semantic
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-typography--docs#semantic)
<iframe width="800" height="1200" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=2321-2924&t=CwihCLOelO0fGAMq-4" allowfullscreen></iframe>

## Text styles

Text styles (also known as composite tokens) combine each individual typography token into a defined style. They include styles for headings, body copy, and more. All properties are set using typography tokens, except for paragraph spacing. In the mobile app, spacing tokens are used to define paragraph spacing in a text style. 

### Headings
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-typography--docs#headings)
<iframe width="800" height="800" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=2321-2925&t=CwihCLOelO0fGAMq-4" allowfullscreen></iframe>

### Body
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-typography--docs#body)
<iframe width="800" height="800" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=2321-2926&t=CwihCLOelO0fGAMq-4" allowfullscreen></iframe>

### Other
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-typography--docs#other)
<iframe width="800" height="500" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=2321-2927&t=CwihCLOelO0fGAMq-4" allowfullscreen></iframe>

## How to use typography tokens

Designers and engineers are encouraged to use typography tokens to ensure a consistent look and feel throughout the app. Multiple typography tokens are combined to create composite tokens (aka text styles). To use typography tokens and text styles in the app, we recommend a few different approaches:

- For Headings and Body copy, use the [Text component](/va-mobile-app/design/Components/Text/Text).
- For larger Display copy, use the [Text component](/va-mobile-app/design/Components/Text/Text).
- For smaller Navigation copy (such as the bottom tab bar), apply the Navigation text style directly to a text box.

**Coming soon**
- For bulleted/numbered lists, there will be a separate component in the future.
- For inline links and styling (bold, italics, etc.), there will be a separate component in the future.