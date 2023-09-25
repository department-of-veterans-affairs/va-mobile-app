---
title: Nametag
---

The Nametag provides an official identity to an authenticated user's experience.

## Examples

### Default
<iframe width="800" height="450" alt="Image of master component in Figma showing light and dark mode" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7819-12286&mode=design&t=XkYEw6lPmNkmrNt0-4" allowfullscreen></iframe>

### Variations
<iframe width="800" height="450" alt="Image of component examples in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7819-12292&mode=design&t=XkYEw6lPmNkmrNt0-4" allowfullscreen></iframe>


## Usage

### When to use Nametag
- The Nametag component only appears on Home and Profile screens.

### How this component works
- Associated data includes legal name, branch of service badge, and branch of service. For example: Kimberly Washington, [display: United States Army badge], United States Army
- If a Veteran has served in more than one branch, the most recent branch appears in the Nametag.

### Placement
- Component should appear near the top of the screen.

### Instances of this component in production
- On Home screen
- On Profile screen

## Accessibility considerations
- Screen readers should read the FirstName Lastname and Service type as a single announcement. In order avoid redundancy, service badge should not be read aloud.

## Related
- [Nametag banner on VA.gov](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/my-va/2.0-redesign/frontend/documentation/nametag.md). The Nametag is present on My VA and profile to signify "this is my stuff." It does not appear on pages containing general VA info or on screens that have a general info state and an authenticated state. It serves as a way to differentiate between the two page types.