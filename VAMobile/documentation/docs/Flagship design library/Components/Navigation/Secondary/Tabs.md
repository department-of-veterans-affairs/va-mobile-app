---
title: Tabs
---

Tabs organize related groups of content within the same hierarchy into parallel views that a user can easily navigate between.

## Examples

### Default
<iframe width="800" height="450" alt="Image of master component in Figma showing light and dark mode" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=8443-14100&mode=design&t=KnuQLCCqRJnHgKVJ-4" title="Image of master component in Figma showing light and dark mode" allowfullscreen></iframe>

### Variations
<iframe width="800" height="450" alt="Image of component examples in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=8443-14122&mode=design&t=KnuQLCCqRJnHgKVJ-4" allowfullscreen></iframe>

## Usage

### When to use Tabs
* To present 2-3 related views of content that are not of an identical type. The appearance of a tab view provides a strong visual indication of enclosure.

### When to consider something else
* If you are representing the same kind of content or providing closely related choices (use a [Segmented Control](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Components/Navigation/Secondary/SegmentedControl) instead).
- If you need to enable actions, such as adding, removing, or editing content.

### Placement
It appears below the top navigation bar, near the top of the screen.

### Instances of this component in production
- In Prescriptions to filter prescriptions by status. This is not an appropriate use of this component since it groups content that is similar. In this case, a Segmented Control component should be used instead.

## Content considerations
- Use 1 word only for each tab.
- Use sentence case.

## Accessibility considerations
* The screen reader should call out the state (selected vs unselected) of the tab and its place in the list
     - Ex. "Selected. All. Tab. 1 of 2"
* At larger text sizes, the tab text should scale and tabs should move to the next line if they don't fit.

## Related
- [Tabs - VA Design System](https://design.va.gov/components/tabs)
- [Tabs - Material Design](https://m3.material.io/components/tabs/overview)
- [Tabs - HIG](https://developer.apple.com/design/human-interface-guidelines/components/layout-and-organization/tab-views/)
- [Segmented Control](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Components/Navigation/Secondary/SegmentedControl)