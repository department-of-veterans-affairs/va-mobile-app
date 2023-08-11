---
name: Common Component
about: Template for new common component for VA mobile app
title: Component:[Insert name of component here]
labels: component-documentation, ux
assignees:
---
<!-- Please fill out all of the relevant sections of this template. Please do not delete any areas of this template. It's ok if it's a draft, that's the point. This is just the first step in fleshing out documentation and the Component Committee will help. Any section that doesn't need to have info should be labeled as NA -->

# Common Component Ticket
<!-- Goal of these tickets: Add new common components to, or make updates for existing components in, the VA mobile app design system. Only a subset of these will be applicable for updating a component, mark other ones as NA -->

## Overview (header will not be published)
This text provides the overall purpose and function of the component.

## Examples

### Default
Embed Figma master component.
If available, add a link to Storybook.

### Variations
Embed Figma variations. Show any differences between Android and iOS.

## Usage

### When to use Component name
* **In this context**: Explain the scenario or user context where this component is, or could be, used.
* **In this task**: Explain the user task or tasks where this component is, or could be, used.

### When to consider something else
* **Not in this context**: Explain which scenarios or user context where this component is not, or should not, be used.
* **Not for these tasks**: Explain the user tasks where this component is not, or should not, be used.
* **Use this instead**: Explain when another component should be used instead.

### How this component works
Details the design decisions inherent to the component.

### Behavior
Describe the key interactions for this component.
* **Trigger**: What does the user do to start the interaction with this component.
* **Rules**: What rules govern how the component behaves. How does it work?
* **Feedback**: What the user sees, hears, and feels that help them understand the rules.
* **Loops and modes**: Meta rules that govern the interaction.

### Choosing between variations
Help the designer and developer understand when to choose between any variations of this component. Describe any differences between Android and iOS.

### Placement
Where the component appears visually, and if necessary to clarify, where it may appear in the source code. Can also comment on where the component is not to be placed.

### Design principles
* List of design or UX principles that this component is an example or or adheres to.

### Instances of this component in production
Images with captions that describe different instances of this component being used in production.

## Code usage
If available, add a link to Storybook.
If Storybook is not available, add properties / examples / source code / accessibility information from the current doc site.

## Content considerations
* Bulleted list of content related instructions to the designer.
* May be an include is shared with the Content style guide section.

## Accessibility considerations
* Bulleted list of a11y related instructions to the designer and developer.

## Related
* Links to related components.

----------

## Next Steps
<!-- Steps in process: cross-practice review with UX, QA and FE (loop as needed), add to documentation site, then hand off to Eng for implementation. -->

#### After filling out the ticket
- [ ] Tag Jen Ecker, Jon Bindbeutel, and Therese Dickson in a comment on this ticket, and one of them will be in touch to add you to an upcoming committee meeting to review.

#### After component committee review is finished
- [ ] PR submitted to add the component to the Design System section of the documentation site
- [ ] UX, QA, and FE reps on the component committee have socialized the new component with their respective teams
- [ ] Moved ticket to the 'Ready to hand off to Eng' column on the VA-Mobile-UX board
