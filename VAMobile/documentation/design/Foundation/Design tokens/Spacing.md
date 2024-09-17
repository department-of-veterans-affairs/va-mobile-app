---
title: Spacing
sidebar_position: 3
---

# Spacing

Spacing units are based on multiples of 8 on the website and 4 on the mobile app to maintain a consistent rhythm when applied to margins, padding, and other dimensions.

**Why multiples of 8 and 4?**
The number 8 is easily broken down into smaller measurements before it approaches sub-pixel units. Additionally, many popular screen sizes are also divisible by 8. In the mobile app, smaller units are required in increments of 4. [Read more about the 8-point grid](https://spec.fm/specifics/8-pt-grid).

## Spacing tokens

The VA follows the USWDS spacing unit tokens and then adds additional semantic tokens for the website. In the mobile app, React Native requires that spacing tokens are unitless. A unique set of spacing tokens are used in the mobile app. A different naming convention is also used to avoid confusion with the web’s spacing tokens.

### Primitive
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-spacing--docs#primitive)
<iframe width="800" height="1200" alt="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=1606-1663&t=PljikYyjG5LVlwDo-4" allowfullscreen></iframe>

## How to use spacing tokens

**Designers**

In Figma, spacing tokens can be applied to padding, margins, and gaps in Auto Layout. To apply spacing tokens:

1. Select the Auto Layout group where you’d like to apply spacing
2. In the Auto Layout panel, find the appropriate padding or gap field and click the hexagon icon
3. Apply the spacing token

**Engineers**

Are there any instructions you'd like to provide here? VADS includes some technical guidance: https://design.va.gov/foundation/spacing-units

## How to use the Spacer component
The [Spacer component](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/spacer--docs) is a convenience component for handling spacing without managing margin/padding between elements. It’s recommended to use the Spacer component instead of spacing tokens when [DESCRIBE SITUATIONS?]. To use the Spacer component:

1. Are there any instructions we should describe here?