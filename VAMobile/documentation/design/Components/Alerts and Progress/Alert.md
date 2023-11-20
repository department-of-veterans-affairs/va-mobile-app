---
title: Alert
draft: true
---

Alerts are an in-content way to keep users informed of important and sometimes time-sensitive changes.

### Examples

#### Default
<iframe width="800" height="450" alt="Image of master component in Figma showing light and dark mode" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10341-3287&mode=design&t=itJXJkPhyWC7fqJm-4" allowfullscreen></iframe>

#### Variations
<iframe width="800" height="450" alt="Image of component examples in Figma" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com/file/QVLPB3eOunmKrgQOuOt0SU/%F0%9F%93%90-DesignLibrary2.0---VAMobile?type=design&node-id=10341-3309&mode=design&t=itJXJkPhyWC7fqJm-4" allowfullscreen></iframe>

### Usage

[Refer to the VA Design System for usage guidance](https://design.va.gov/components/alert)

#### When to use Alert
* **To notify users about the status of the system**
    * **System status messages**. An alert may be a notification that keeps people informed of the status of the system and may or may not require the user to respond. Such notifications may be errors, warnings, and general updates.
    * **In-application system status**. An exception to the above is providing information to the user, unprompted, about a problem with a particular application. These [system status messages](https://design.va.gov/content-style-guide/error-messages/system) typically use an error or warning variation and do not require user action.
    * **Access messages when a user tries to access an item that is not available to them**. [Access messages](https://design.va.gov/content-style-guide/error-messages/access) typically warn the user that something they tried to access is not working correctly or is temporarily unavailable. These often use the error or warning variations.
    * **Mobile app only: System maintenance**. On the website, most [system messages](https://design.va.gov/content-style-guide/error-messages/system) related to maintenance are handled by the [Banner - Maintenance](https://design.va.gov/components/banner/maintenance) component. On the mobile app, system maintenance messages use the Alert component.
* **To respond to a user’s action**
    * **Validation messages**. An alert may be a validation message that informs a user they just took an action that needs to be corrected or a confirmation that a task was completed successfully.
    * **User feedback**. Use Alert for [feedback messages](https://design.va.gov/content-style-guide/error-messages/feedback) that respond to an action a user has taken and to draw their attention to something that they need to correct or to confirm successful completion of a task. These messages use success and error variations.
    * **Immediate feedback to the user**. When your application is using Javascript to provide an immediate response to the user without a full page/screen load. For example, this may include alerts that appear with inline form validation.
* **Engagement messages that nudge the user to enter or update data**. [Engagement messages](https://design.va.gov/content-style-guide/error-messages/engagement) typically use the informational variation and ask the user to take an action.
* **Mobile app only: Unprompted and in-page alerts**. On the website, consider the [Alert - Expandable](https://design.va.gov/components/alert-expandable) component to draw attention to important information on the page that is not a response to user feedback. On the mobile app, use the expandable variation of the Alert component.

#### When to consider something else
On the mobile app, always consider a native component before using an in-content Alert.
* **Action Sheet**. When the user takes an action in which the system needs to **clarify their intent**, use an [action sheet](https://developer.apple.com/design/human-interface-guidelines/action-sheets) (for both iOS and Android) to **offer the user a choice in how to proceed**.
* **Alert/dialogue**. When the user chooses to do something that has **serious consequences**, use a native modal [alert](https://developer.apple.com/design/human-interface-guidelines/alerts) (for iOS) or [dialogue](https://m3.material.io/components/dialogs/overview) (for Android) to present the user with critical information related to that action.
* **Snackbar**. If a user action **triggers an API call that is successful or results in an error**, consider using a [Snackbar](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Alerts%20and%20Progress/Snackbar/) in addition to or instead of an Alert. The snackbar may allow users to take an action on the feedback such as trying again or undoing the action.

On the mobile app, do not use the Alert component for:
* **Sub-alerts on the page**. On the website, when your page has more than 1 alert and you are using the Standard and Slim alerts to create a hierarchy of alerts. It is also appropriate to convey multiple statuses using a combination of headers, text, and the Slim alert variation. An example of a sub-alert is the [Autosave alert](https://design.va.gov/components/form/autosave). On the mobile app, do not use sub-alerts.

On the website and mobile app, do not use the Alert component for:
* **Long forms**. On long forms, always include in-line validation in addition to any error messages that appear at the top of the form.
* **Destructive actions**. If an action will result in destroying a user’s work (for example, deleting an application) use a more intrusive pattern, such as a confirmation [modal](https://design.va.gov/components/modal) dialogue on the website or a native alert on the mobile app, to allow the user to confirm that this action is what they want.
* **Clarifying background information**. Use the [Additional info](https://design.va.gov/components/additional-info) component when clarifying outcomes for an input or a form question as well as providing background information. Keep in mind that Alert - Expandable should warrant an alert and be used sparingly. The value of any type of alert is diminished if the page is littered with alerts of equal weight.

#### Choosing between variations
* Use standard alerts for most use cases.
* Use expandable alerts when the information is not a response to user feedback.
* Use dismissible alerts when the content is informational and not specific to the user or their interaction. For example, displaying “what’s new” content in the app.

#### Placement
* Alerts always appear near the top of the screen

#### Content considerations
* The [VA Design System's content considerations for alerts](https://design.va.gov/components/alert#content-considerations) are appropriate for the mobile app with the following addition:
    * VA no longer says, “Please” in alerts when making a request of the user.
* The VA Design System also includes guidance on how to write error alerts. In particular, the section on [style and tone](https://design.va.gov/patterns/help-users-to/recover-from-errors#style-and-tone) provides help on how to write clear and conversational alerts.

##### Accessibility considerations
* Alerts should only be used when appropriate to do so. Do not use Alerts when a native alert would be best (i.e. native alert, dialogue, action sheet, snackbar, etc.).
* When using a screen reader, the Alert should announce itself as an alert with an indication of its role / importance (i.e. error, warning, informational, etc.).
* Alerts that have expanded / closed states must be announced by a screen reader.
* Do not automatically dismiss an Alert based on a timer or time limit.
* Use alternative text (alt text) for any icons that are not considered decorative.
* No buttons should be disabled within an Alert.
* Focusable elements within an Alert should include: heading, body copy, phone numbers, and buttons.
* [accessibilityLabel](https://reactnative.dev/docs/accessibility#accessibilitylabel) and [accessibilityLabelledBy](https://reactnative.dev/docs/accessibility#accessibilitylabelledby-android) should be used where appropriate.

### Code usage
Link to Storybook coming soon

### Related
* [Native alerts](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Patterns/confirmation-messages/)
* [Snackbar](https://department-of-veterans-affairs.github.io/va-mobile-app/docs/Flagship%20design%20library/Components/Alerts%20and%20Progress/Snackbar)