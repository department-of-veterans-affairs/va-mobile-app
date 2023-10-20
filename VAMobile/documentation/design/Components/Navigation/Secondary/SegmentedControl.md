---
title: Segmented control
---

A segmented control is used to switch between related views of information within the same context.

## Examples

### Two segments
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--2-segments)	|	[Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7332-11330&mode=design&t=lRnzcV3CBx2yby7N-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/segmented-control--2-segments&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>


### Three segments
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--3-segments)	|	[Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7332-11330&mode=design&t=lRnzcV3CBx2yby7N-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/segmented-control--3-segments&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>


### Four segments
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--4-segments)	|	[Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7332-11330&mode=design&t=lRnzcV3CBx2yby7N-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/segmented-control--4-segments&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>


## Usage
A segmented control consists of a horizontal set of 2-4 segments, each of which functions as a button. One option is always selected. The component does not scroll horizontally.

### When to use Segmented control
- To represent the same kind of content, such as a list-view with different filters applied. 
- To provide closely related choices that affect an object, state, or view. For example, a segmented control can help people select options, switch between views, or sort elements.

### When to consider something else
- If you need to group content that is dissimilar (use Tabs instead).
- If you need to enable actions — such as adding, removing, or editing content.
- If it needs to be accompanied by any other controls or a title if used in the top navigation bar.

### Placement
- It appears in either the top navigation bar or below that navigation bar, near the top of the screen.
- It should not be used in the bottom toolbar because toolbar items act on the current screen — they don’t let people switch contexts.

### Instances of this component in production
- Claims uses an Active/Closed segmented control to filter claims by status.
- Appointments uses an Upcoming/Past segmented control to filter appointments by type.
- Claims also uses a segmented control to show the Status/Details of claims. This is not an appropriate use of this component since it groups content that is dissimilar. In this case, a Tabs component should be used instead.

## Code usage
[Open Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/segmented-control--2-segments)

## Content considerations
- **Keep labels to 1 word**: If you need 2 (or more) words, you're likely trying to include extraneous words or group together items that are not similar enough. You may need to consider using a different component. The label text must be short enough that it doesn't wrap in the component.
- **Consider if labels are used elsewhere on the screen**: You can help differentiate different sections beneath the segmented control by not reusing the same labels.

## Accessibility considerations
- Reference [Segmented Control / Tab - Native app accessibility checklist - MagentaA11y](https://www.magentaa11y.com/checklist-native/segmented-control/)
- **Font scaling**: This component will ignore a user's settings for font scaling so the text always remains the same size. This is consistent with Apple's segmented control component.
- **Name**: Purpose is clear and matches visible label
- **Role**: Identifies as a button in iOS and "double tap to activate" in Android
- **Group**: Visible label (if any) is grouped or associated with the button in a single swipe
- **State**: Expresses its state (selected/disabled/dimmed)

## Related
- [Tabs - VA Design System](https://design.va.gov/components/tabs)
- [Segmented control - HIG](https://developer.apple.com/design/human-interface-guidelines/components/selection-and-input/segmented-controls)
- [Segmented button - Material design](https://m3.material.io/components/segmented-buttons/overview)
- [Tabs – Material Design](https://m3.material.io/components/tabs/overview)