---
title: Menus
---

Menus provide temporary access to functionality that's directly related to the onscreen content.

## Examples

### Master component
<iframe width="800" height="450" title="Image of master component in Figma showing light and dark mode" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=16025-18269&mode=design&t=kmODZY3bkhNgpYY1-4" title="Image of master component in Figma showing light and dark mode" allowfullscreen></iframe>

### Examples
<iframe width="800" height="450" title="Image of component examples in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=16025-18268&mode=design&t=kmODZY3bkhNgpYY1-4" allowfullscreen></iframe>

## Usage

### When to use Menus
* To display a list of 2-7 choices on a temporary surface, such as a set of overflow actions.
* Use menus when there is a space constraint.

### When to consider something else
* If there are less than 2 actions available to the user, consider using a [Button](http://localhost:3000/va-mobile-app/design/Components/Buttons%20and%20links/Button).

### Behavior
* A menu appears when a user taps an interactive element such as an icon.

### Placement
* Menus typically appear below the element that generates them.
* Menus appear in front of all other permanent UI elements.

## Content considerations
The VA mobile app currently uses menus as a list of actions versus a list of options or navigation. As such, overflow menus are essentially buttons. Therefore, VA Design System can be referred to for content guidance.
In addition to [VA Design System's content considerations for buttons](https://design.va.gov/components/button/#content-considerations), the following guidelines are recommended:
* __Be concise__: While VA Design System recommends keeping button labels to 35 characters, for VA mobile app overflow menus, keep labels to 24 characters or less regardless of word count. Article words (a, an, the) can be omitted.
* __Prioritize menu items__: Put menu items used most at the start of the list.
* __Consider menu length__: Be careful not to put too many items in a menu.

## Accessibility considerations
* All list items should be coded as buttons and not as links.
* Users should be able to:
	* Navigate to, open, and close a menu and with assistive technology
	* Navigate between and select menu items with assistive technology
* For list items with text and icon, the accessibility label should be marked as decorative to avoid redundant verbalizations.

## Related
* [Menus - HIG](https://developer.apple.com/design/human-interface-guidelines/menus)
* [Menus - Material Design](https://m3.material.io/components/menus/overview)

## Code usage
Link to Storybook coming soon