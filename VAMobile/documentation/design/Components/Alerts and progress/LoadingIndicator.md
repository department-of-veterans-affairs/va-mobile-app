---
title: Loading indicator
---

A loading indicator tells the user that the system is processing information, whether that is sending or receiving data. It provides reassurance to the user that the system is still working.

## Examples

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/loading-indicator)  |   [Figma](https://www.figma.com/design/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library---Design-System---VA-Mobile?node-id=4035-1007&t=nc28UCI1A10Cd4IH-4)
<iframe width="620" height="200" title="Component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?singleStory=true&id=loading-indicator--with-text&viewMode=story" allowfullscreen></iframe>

## Usage

[Refer to the VA Design System for usage guidance](https://design.va.gov/components/loading-indicator)

## Code usage
[Open Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/alert--docs)

## Content considerations
We follow a simple content pattern for loading indicators, which consists of the following elements in this order:
1. A present participle verb of the action that is happening
2. An object that is being acted upon
3. An elipsis

**Start each loading indicator with the present participle form (-ing) of the action that is happening.**
Consider what the system is actually doing. Remember that the loading indicator is supposed to inform the user what is happening while they’re waiting. The system isn’t always “loading” something. Sometimes its sending something. Other times its saving something.

**Follow the verb with the object that is being acted upon.**
For example, if the system is saving something, describe (in 1 or 2 words) what is being saved. If applicable, make the object personal to the user by using a possive pronoun (your) instead of an article (a, the).

**End each loading indicator with an ellipsis (3 periods).**
Do not use unnecessary words, such as please or wait.

Examples of loading indicators:
* Saving your draft...
* Loading your appointments...
* Submitting your file...

## Accessibility considerations
* Refer to the [VA Design System for accessibility considerations](https://design.va.gov/components/loading-indicator#accessibility-considerations)
* On the website, W3C WAI-ARIA aria-live="polite", aria-label and aria-valuetext are used to ensure screen reader users are also provided the same information. On the mobile app, use the equivalent accessibility hints and labels in React Native.

## Related
* [Loading indicator - VA Design System](https://design.va.gov/components/loading-indicator)
* [Progress indicator - HIG](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)
* [Progress indicator - Material Design](https://m3.material.io/components/progress-indicators)