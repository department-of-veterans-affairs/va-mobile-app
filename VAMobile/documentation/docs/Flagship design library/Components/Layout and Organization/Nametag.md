---
title: Nametag
---

The Nametag provides an official identity to an authenticated user's experience and also allows honorably discharged Veterans to launch the Veteran status panel.

## Examples

### Default
<iframe width="100%" height="450" alt="Image of master component in Figma showing light and dark mode" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7819-12286&mode=design&t=XkYEw6lPmNkmrNt0-4" allowfullscreen></iframe>

### Variations
<iframe width="100%" height="450" alt="Image of component examples in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=7819-12292&mode=design&t=XkYEw6lPmNkmrNt0-4" allowfullscreen></iframe>


## Usage

### When to use Nametag
- The Nametag component only appears on Home and Profile screens.

### How this component works
- For **honorably discharged Veterans**, the nametag is an interactive / tappable element that includes a brief overview of a Veterans' information (legal name, branch of service badge, and branch of service) in addition to the "Proof of Veteran status" copy. When tapped, the nametag should launch the Veteran status panel.
	- Example: Kimberly Washington, [display: United States Army badge], United States Army, Proof of Veteran status
- For **dishonorably discharged Veterans**, the "Proof of Veteran status" copy should be hidden and the nametag should no longer be interactive / tappable.
	- Example: Kimberly Washington, [display: United States Army badge], United States Army
- If a Veteran has served in more than one branch, the most recent branch appears in the Nametag.

### Placement
- Component should appear near the top of the screen.

### Instances of this component in production
- On Home screen
- On Profile screen

## Accessibility considerations
- For **honorably discharged Veterans**, screen readers should announce the nametag component as a button and read out the content within the nametag including: first name, lastname, branch of service, and proof of Veteran status as a single announcement.
- For **dishonorably discharged Veterans**, screen readers should read out the content within the nametag component including: first name, last name, and branch of service in a single announcement.
	- The screen reader should **not** announce the nametag as a button and it should not be tappable.
- To avoid redundancy, the service badge should not be read aloud and is for decorative purposes only.
	

## Related
- [Nametag banner on VA.gov](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/my-va/2.0-redesign/frontend/documentation/nametag.md). The Nametag is present on My VA and profile to signify "this is my stuff." It does not appear on pages containing general VA info or on screens that have a general info state and an authenticated state. It serves as a way to differentiate between the two page types.