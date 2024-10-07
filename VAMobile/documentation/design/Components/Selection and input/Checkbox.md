---
title: Checkbox
---

Snackbars provide feedback regarding API interactions at the bottom of the screen.

## Examples

### Default
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/snackbar--default)  |   [Figma](https://www.figma.com/design/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library---Design-System---VA-Mobile?node-id=263-702&t=1BgtKDvOeoxfzmzR-4)
<iframe width="620" height="120" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/snackbar--default&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

### Variations
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/snackbar--with-action)  |   [Figma](https://www.figma.com/design/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library---Design-System---VA-Mobile?node-id=263-702&t=1BgtKDvOeoxfzmzR-4)
<iframe width="620" height="120" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/snackbar--with-action&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

## Usage

### When to use Snackbar
* **If a user action that triggers an API call is successful or results in an error.** The snackbar may allow users to take an action on the feedback such as trying again or undoing the action. 

### How this component works
- The **icon** will be relevant to the state of the snackbar (success or error).
- The **text content** is a short description of the success or error action. It is used to inform the status of an action.
- The **left action button** is optional and should only be used when there is an additional action for the user to take on the snackbar. The left action button can be an "Undo" or "Try again" button. 
     - The undo button allows a user to reverse a successful action. When the action is successfully reversed, another snackbar will open informing the successful undo. The new snackbar will only have the dismiss button.
     - The try again button allows a user to initiate a failed action. This will prompt the system to redo the action and either produce a successful or unsuccessful snackbar.
- The **right action button** is a dismiss button that allows a user to manually close the snackbar.

### Behavior
- The current iteration of the snackbar will only be dismissible by the user selecting the “Dismiss” button, another snackbar opening, or the user navigating to a different screen. Additional iterations may incorporate a user-defined timebox on the snackbar.

### Placement
- The snackbar always appears at the bottom of the screen on top of the other content.

### Instances of this component in production
- Default snackbar displays in Messages when a draft is saved successfully.
- "Undo" snackbar appears in Messages when moving a message to a folder.
- "Try again" snackbar appears in Messages when a draft is not saved successfully.

## Code usage
[Open Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/snackbar--docs)

## Content considerations
- Body copy for a successful snackbar states the item and the action that was performed on the item. Examples: Draft saved, Appointment canceled
- Body copy for an unsuccessful snackbar uses the same copy as its successful version with the addition of the word `not`. Examples: Draft not saved, Appointment not canceled
- Use only 2-3 words for successful snackbars.
- Use only 3-4 words for unsuccessful snackbars.
- Use `Undo` or `Try again` for optional left action button. (We use `Try again` instead of `Retry` to align with VA.gov and to reduce cognitive load.)
- Use `Dismiss` for right action button.
- Don't use words like `successful` or `failed`
- Don't use any punctuation

## Accessibility considerations
- To ensure that the snackbar and its content is accessible to all users, the snackbar should not close on its own or after a certain amount of time. The snackbar can only be closed by the user selecting the “dismiss” button, another snackbar opening, or the user navigating to a different screen. 
- Screen readers should automatically announce when a snackbar opens and begin reading its content. The screen reader will announce the component as an Alert as soon as the action is completed. Each action will be announced as a button.
- If a screen has bottom navigation, the snackbar should open above the navigation.
- There should only ever be one snackbar on the screen. Opening a new snackbar will close the previous snackbar.

### Related
* [Snackbar - Material Design](https://m3.material.io/components/snackbar/overview)
