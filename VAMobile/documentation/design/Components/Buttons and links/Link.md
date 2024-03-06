---
title: Link
---

A link is a navigation element that can appear alone, inline (embedded), or in a group with other links. A link can trigger a download, but in general links go to internal or external pages when clicked.

## Examples

### Default
**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--default)  |   [Figma](https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=235-771&mode=design&t=CNVVTHmCkOFHUVbq-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/link--default&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

### Default (with icon)

**Open in**: [Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--default-with-icon)  |   [Figma](https://www.figma.com/file/Zzt8z60hCtdEzXx2GFWghH/%F0%9F%93%90-Component-Library?type=design&node-id=235-772&mode=design&t=CNVVTHmCkOFHUVbq-4)
<iframe width="620" height="" alt="Image of component in Storybook" src="https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/story/link--default-with-icon&full=1&shortcuts=false&singleStory=true" allowfullscreen></iframe>

### Additional variants
* [Attachment](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--attachment&viewMode=story)
* [Calendar](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--calendar&viewMode=story)
* [Directions](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--directions&viewMode=story)
* [External link](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--external-link&viewMode=story)
* [Phone](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone&viewMode=story)
* [Phone TTY](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone-tty&viewMode=story)
* [Text](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--text&viewMode=story)

## Usage

### When to use Links
* Refer to the [VA Design System for usage guidance](https://design.va.gov/components/link/#usage)

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
		* **Links open in the [browser app](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--external-link&viewMode=story)** if the user needs to sign in to access the content. Before leaving the app, always use a native alert to warn the user. Once confirmed, open the default browser app.
		* **Links launch another app** if the user is taking an action such as making a phone call, getting directions, or downloading a file. Before leaving the app, consider using a [confirmation message](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Patterns/confirmation-messages) (such as a native alert or action sheet) to warn the user.
			* [Attachment](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--attachment&viewMode=story): Display the attachment in the app with the ability to download to their device.
			* [Calendar](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--calendar&viewMode=story): Display the event information to allow the user to review and confirm before adding to their calendar. Once confirmed, add to the default calendar app.
			* [Directions](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--directions&viewMode=story): Display an Action Sheet to allow the user to select their preferred maps app (Apple Maps, Google Maps, etc.). Once selected, open the maps app with their destination.
			* [Phone](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone&viewMode=story): Display an Action Sheet to allow the user to confirm the phone call. Once confirmed, open the default phone app.
			* [Phone TTY](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--phone-tty&viewMode=story): Display an Action Sheet to allow user to confirm the TTY call. Once confirmed, open the default phone app.
			* [Text](https://department-of-veterans-affairs.github.io/va-mobile-library/iframe.html?args=&id=link--text&viewMode=story): Open the default messages app.

### Choosing between variations
* **Choosing between colors**
    * In most cases, use the **default (blue)** color.
    * If the default (blue) color will not work (i.e. insufficient color contrast), you may use the **base (gray)** link.

## Code usage
[Open Storybook](https://department-of-veterans-affairs.github.io/va-mobile-library/?path=/docs/link--docs)

## Content considerations
* Refer to the [VA Design System for content considerations](https://design.va.gov/components/link/#content-considerations)
* When linking Veterans to VA.gov, be sure to include VA.gov in the link text. For example, instead of saying “Learn more about benefits,” it’s better to say “Learn more about benefits on VA.gov”.

## Accessibility considerations
* Refer to the [VA Design System for accessibility considerations](https://design.va.gov/components/link/#accessibility-considerations)

## Related
* [Link - VA Design System](https://design.va.gov/components/link/)
* [Link - USWDS](https://designsystem.digital.gov/components/link/)

----------

## Differences with VADS
* The Base link style exists due to mobile app specific needs in dark mode. For example: The v3 Alert component has a colored background for each variation. While working on dark mode, the mobile app team found that the Default link style did not meet color contrast requirements and clashed with the background colors. For this reason, we created a new Base style that's similar to a USWDS Base style.
* In Storybook, variants are available for content-specific links (add to calendar, get directions, etc). These variants were created to include the onPress logic for app teams. This allows the component to always display a native confirmation message when needed.
* Currently, the Link component does not support inline links. In the future, a Paragraph component will be created for inline links to support proper text wrapping and accessibility in React Native.