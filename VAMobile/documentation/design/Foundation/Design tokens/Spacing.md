---
title: Spacing
sidebar_position: 3
---

# Spacing

Spacing tokens are used to maintain a consistent rhythm when applied to margins, padding, and other dimensions.

Spacing units are are based on multiples of 8 on the website and 4 on the mobile app. The number 8 is easily broken down into smaller measurements before it approaches sub-pixel units. Additionally, many popular screen sizes are also divisible by 8. In the mobile app, smaller units are required in increments of 4. [Read more about the 8-point grid](https://spec.fm/specifics/8-pt-grid).

## Spacing tokens

The VA follows the USWDS spacing tokens and adds additional semantic tokens for the website. In the mobile app, React Native requires that spacing tokens are unitless, so a unique set of spacing tokens are used in the mobile app. A different naming convention is also used to avoid confusion with the web’s spacing tokens.

### Primitive
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-spacing--docs#primitive)
<iframe width="800" height="1200" alt="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=1606-1663&t=PljikYyjG5LVlwDo-4" allowfullscreen></iframe>

## How to use spacing tokens

Designers and engineers are encouraged to use spacing tokens to ensure consistent spacing between elements.

**Designers**

In Figma, spacing tokens can be applied to padding, margins, and gaps in Auto Layout. To apply spacing tokens:

1. Select the Auto Layout group where you’d like to apply spacing
2. In the Auto Layout panel, find the appropriate padding or gap field and click the hexagon icon
3. Apply the spacing token

**Engineers**

There are two ways for engineers to leverage spacing tokens:

* Use the tokens directly when setting spacing values (e.g. margin/padding) on Views and other stylized elements
* Use the [Spacer component](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/spacer--docs) to separate visually distinct components or elements at the same display level (e.g. within the same View)