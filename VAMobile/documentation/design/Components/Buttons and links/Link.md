---
title: Link
draft: true
---

A link is a navigation element that can appear alone, inline (embedded), or in a group with other links. A link can trigger a download, but in general links go to internal or external pages when clicked.

## Examples

### Default

#### Default
Add Figma links and embed Storybook - standalone link in default (blue) color

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--primary)  |   [Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10569-16679&mode=design&t=Os8aP9kEAvkcrH1D-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--primary&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

#### Inline
EAdd Figma links and embed Storybook - inline link in default (blue) color

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--primary)  |   [Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10569-16679&mode=design&t=Os8aP9kEAvkcrH1D-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--primary&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

### Base

#### Default
Add Figma links and embed Storybook - standalone link in base (gray) color

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--primary)  |   [Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10569-16679&mode=design&t=Os8aP9kEAvkcrH1D-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--primary&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

#### Inline
Add Figma links and embed Storybook - inline link in base (gray) color

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--primary)  |   [Figma](https://www.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10569-16679&mode=design&t=Os8aP9kEAvkcrH1D-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/button--primary&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

## Usage

### When to use Links
* Reference the [VA Design System's usage guidelines for links](https://design.va.gov/components/link/#usage)

### When to consider something else
* **Use buttons for actions**. Use a [Button](https://design.va.gov/components/button) when you want to make a state change or submit a form. Example actions include, but are not limited to, “Add”, “Close”, “Cancel”, or “Save”. Buttons **do things**, links **go places**. Refer to guidance on [Links vs. buttons](https://design.va.gov/components/link/action#links-vs-buttons)
* **Use action links for calls-to-action**. On the website, when you want to draw attention to an important call-to-action (CTA) on the page, such as a link that launches a benefit application, use an [Action link](https://design.va.gov/components/link/action). Calls-to-action are not actions themselves (see the previous point). On the mobile app, use a Link or Button component instead.
* **Table of contents**. On the website, when you want to make a long page of content with two or more H2s easier to navigate, use an [On this page link](https://design.va.gov/components/on-this-page). On the mobile app, avoid long pages of content that might require a table of contents.
* **Triggering the generation of a PDF**. When using for a PDF, use only for linking directly to a PDF, not as a trigger for a process that generates a PDF. For [generating a PDF, use a button](https://design.va.gov/components/link/#links-vs-buttons).

### Behavior
* **On the website**
    * **Open VA.gov links in the same window except in certain instances**. VA.gov links should open in a new tab only if clicking the link will result in the user losing progress or data. Otherwise, links should open in the same window. See [linking to external sites](https://design.va.gov/content-style-guide/links/#linking-to-external-sites) in the content style guide for additional information.
    * **Use semantically appropriate encodings**. Encode email and phone links with mailto: and tel:, respectively.
* **On the mobile app**
	* **Links open in the app**
		* **Links open in a full panel** if the content is within the app.
		* **Links open in a webview** if the content is not within the app and the user does not need a separate sign in to access the content.
	* **Links open another app**
		* **Links open in the browser app** if the user needs to sign in to access the content. When leaving the app, always use a native alert to warn the user.
		* **Links launch another app** if the user is taking an action such as making a phone call, getting directions, or downloading a file. When leaving the app, always use a [confirmation message](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Patterns/confirmation-messages) (native alert or action sheet) to warn the user.

### Choosing between variations
* **Choosing between usage types**
    * Links may be used as **standalone components** or **inline links**.
    * If used as an inline link, select the “inline” variation to ensure the height of the link matches the height of the body copy.
* **Choosing between colors**
    * In most cases, use the **default (blue)** color.
    * If the default (blue) color will not work (i.e. insufficient color contrast), you may use the **base (gray)** link.

## Code usage
Add links to Storybook when available

[Open Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/button--base)

## Content considerations
* Reference the [VA Design System's content considerations for links](https://design.va.gov/components/link/#content-considerations)
* When linking Veterans to VA.gov, be sure to include VA.gov in the link text. For example, instead of saying “Learn more about benefits,” it’s better to say “Learn more about benefits on VA.gov”.

## Accessibility considerations
* Reference the [VA Design System's accessibility considerations for links](https://design.va.gov/components/link/#accessibility-considerations)

## Related
* [Link - VA Design System](https://design.va.gov/components/link/)
* [Link - USWDS](https://designsystem.digital.gov/components/link/)