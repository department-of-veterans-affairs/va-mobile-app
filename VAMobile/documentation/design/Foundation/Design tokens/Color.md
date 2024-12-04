---
title: Color
sidebar_position: 2
---

# Color

Our color palette is organized into semantic color tokens, which have specific meaning within the system, and primitive color tokens, which establish a subset of colors that the VA uses from the U.S. Web Design System.

To learn more about color tokens, see the [slides](https://docs.google.com/presentation/d/1grihSnsCPHBidOhe2T-sAC2HUo1_aU54XN8mqmyYySw/edit#slide=id.g26f52ea1451_0_0) from Sprint Demo on May 7, 2024.

## Primitive
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-colors--docs#primitive)
<iframe width="800" height="1200" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=570-942&t=Ko6aa9sM96UxylvN-4" allowfullscreen></iframe>

## Semantic
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-colors--docs#semantic)
<iframe width="800" height="3000" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/design/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens-Library---Design-System---VA-Mobile?node-id=1239-695&t=PljikYyjG5LVlwDo-4" allowfullscreen></iframe>

## Component
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/design-tokens-colors--docs#component)
<iframe width="800" height="450" title="Image of design tokens in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/rdLIEaC9rVwX70QbIGkMvG/%F0%9F%93%90-Design-Tokens?type=design&node-id=298-1044&mode=design&t=MjPMv5xnusbkvlb0-4" allowfullscreen></iframe>

## How to use color tokens

### Primitive
It’s not recommended to use primitive tokens in your designs. These tokens will not reflect any usage guidance at the semantic or component level. Primitive color tokens will also not support theming in light and dark mode.

### Semantic
If you’re looking to use a semantic token in your designs, you can find the appropriate token by understanding the [taxonomy](/va-mobile-app/design/Foundation/Design%20tokens/#taxonomy-and-typology). In the mobile app library, we currently use the following options to describe our tokens:

* System
    * **vads**: Used for tokens in the VA Design System
* Category
    * **color**: Used for color tokens
* Concept
    * **action**: Used for interactive elements
    * **feedback**: Used to inform users of important changes
* Property
    * **background**: Used for background elements
    * **border**: Used for borders, strokes, and dividers
    * **foreground**: Used for foreground elements such as text and icons
    * **surface**: Used for surface elements such as alerts, cards, and rows
* Variant
    * **default, inverse, secondary**: Used for any elements
    * **default, base, destructive**: Used for action-related elements
    * **info, success, warning, error**: Used for feedback-related elements
* State
    * **active**: Used for active or onPress states
* Mode
    * **on-light**: Used for light mode
    * **on-dark**: Used for dark mode

For example, let’s look at the Alert component. This component is placed on the background (**vads-color-background-default-on-light**) and is comprised of multiple tokens for the surface (**vads-color-feedback-surface-success-on-light**), border (**vads-color-feedback-border-success-on-light**), and foreground (**vads-color-foreground-default-on-light**).

![Image of the alert component with semantic tokens applied](/img/design-system/tokens-semantic-alert.png)

### Component
If you’re using a component from the design system, the appropriate component tokens are already applied.

If you’re looking to use a component token in your designs, you can find the appropriate token by looking for the component name in the token name. For example, in **vads-segmented-control-color-surface-selected-on-light**, the second piece of information tells us that this token is related to the Segmented Control component. After the component name, the token name follows the same naming conventions as semantic tokens.