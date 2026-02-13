---
title: Accessibility Guidance
---

This document is intended for anyone designing and/or building features that will ship into the VA Mobile App, most especially designers and developers.

The goal of this document is to establish and define the norms, and best practices that help to ensure accessible outcomes for new and existing app features.

This document is meant to be paired with the "Mobile Interface and Interaction Guidelines (MIIG)," and aims to make some of the core accessibility assumptions there clearly actionable. E.g. This document aims to focus on the steps you can take to help produce accessible outcomes.

That said, accessibility is less an end-state than it is a core part of our processes. We seek to center accessibility-first design and development practices in all phases of the application design and development lifecycle, from research and early user-testing, to design, to development, and QA.

## Standards

The official [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) and the in-process, yet nascent and not super official [MCAG](https://getevinced.github.io/mcag/) are core starting points when considering how best to enable accessible outcomes in the VA Mobile App. Existing VA usability standards should support these, and together form your North Star in determining how to achieve accessible outcomes.

* [VA Design System: Principles](https://design.va.gov/about/principles)  
* [VA Design System: Experience Standards](https://design.va.gov/about/experience-standards/)  
* [VA Mobile App Documentation](https://department-of-veterans-affairs.github.io/va-mobile-app/)

None of these documents are able to "solve" accessibility, and instead serve as a framework of suggestions and best practices and known standards for reaching or validating accessible outcomes. What follows are the steps we suggest you take when working on the mobile app.

### Research

Centering the voices and experiences of disabled Veterans and users is central to achieving accessible outcomes since they are the group who ultimately get to determine our success or failure. As such, we recommend including participants with cognitive and physical disabilities including those who rely on assistive technology like screen readers in your research. Including users with disabilities in research helps us see whether designs and functionality which should work for these users according to technical specs actually work well, fit users’ mental models, and meet their usability expectations. 

* Follow VA’s [Assistive technology checklist](https://depo-platform-documentation.scrollhelp.site/research-design/research-with-assistive-technology-users)  
* Use tools and platforms that are maximally accessible for participants when prototyping, testing, and conducting research whenever possible  
* Consider the user needs and journey of users with disabilities when designing research tasks and writing moderation guides  
* Use inclusive language when working with participants and learn the language of their assistive tech so you can provide clear instruction and also help with tech troubleshooting  
* If users with disabilities and/or assistive tech users are not able to be included in an initial round of research, consider follow on research either as fast follow accessibility targeted round or in a later stage of design/development

### Design

Designing screens and interactions for mobile apps is different than designing for mobile web in a variety of subtle ways; this means that WCAG doesn't always strictly hold true when working on a mobile app. That said, the core needs remain the same:

* Ensure that content is well organized, and clearly presented  
* Ensure that items can scale with device settings  
* Ensure that touch targets are of adequate size  
* Ensure that color contrast ratios are within expected bounds

Interactions should be clear, support user tasks, and align to known user intentions, e.g. be easy to place along a user journey map.

VA has adopted ["a single response"](https://design.va.gov/patterns/ask-users-for/a-single-response) pattern. Likewise, this should be followed on mobile.

#### Content

A large number of accessibility issues can be resolved or overcome with clear content design. Oftentimes, a design should start from the content, not leave it until the end. Let clear, [plain language content](https://design.va.gov/content-style-guide/plain-language/) shape the solution because the content is, often, what ought to be centered.

* [VA Design System: Link Text](https://design.va.gov/content-style-guide/links#link-text)

#### UI/UX

When designing or mocking up views of the app, it is important to understand the [core patterns](https://department-of-veterans-affairs.github.io/va-mobile-app/design/Intro) at play in the app. These patterns boil down to a few basic types:

* **Home Screen**, the front door of the application, where the user starts  
* **List View**, A collection of items/options  
* **Detail View**, Passive consumption of specific content  
* **Form/Input View**, Active data entry and submission  
* **Global Navigation**, The structural anchors (Tabs/Drawers)  
* **Modals and Overlays**, Interruptions, and temporary contexts, often for confirmation  
* **Alerts, Banners**, and other notifications to call extra attention to some content  
* **Search and Filter**, Querying, and dynamic results  
* **Empty/Error States**, Feedback when content is unavailable

### Development

To ensure accessible outcomes, developers should consider accessibility from the start – here are some suggestions for how to enable accessible outcomes.

#### Content

* Decorative Images: Code images identified by design as "decorative" to be hidden from screen readers so they do not add noise to the navigation flow.
* Logical Grouping: Ensure elements that form a single context (e.g., a button, its text, and its icon) are grouped so they are announced as a single unit rather than separate fragments.

Examples of logical groups: 

- [Example of a subset that does form a logical grouping](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/src/components/LargeNavButton.tsx)
- [Example of a subset that can't be one context because it is too much](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/src/screens/HealthScreen/Pharmacy/PrescriptionCommon/PrescriptionListItem.tsx&sa=D&source=docs&ust=1770922103364322&usg=AOvVaw3f5wXtVxvvH46gxw906GLz)

#### Touch Targets and Interaction

* Minimum Size: Ensure all `pressable` elements meet the minimum height of 44 points/pixels. Use `theme.dimensions.touchableMinHeight` defaults where possible. If a visual element is smaller, use padding to increase the hit area without altering the design.  
* Selectable Text: Use the `selectable` prop intentionally (e.g., mostly in Secure Messaging). While it allows copy/paste, it causes Voice Access and Voice Control to read the element as "pressable," which can confuse users since it suggests that the text is an interactive element.

#### Dynamic Type and Font Scaling

* Handle App State Changes: Users may change their font size settings while the app is in the background. Use `updateFontScale` to listen for app state changes (`active`/`inactive`) and update the font scale dynamically when the user returns to the app.  
* Scale Icons: Ensure icons scale relative to the font size to maintain layout consistency for low-vision users. Use the `useFontScale` hook or specific width/height logic as seen in `VAIcon`.

#### Focus Management

* Platform-Specific Focus: Managing accessibility focus differs between iOS and Android. Always use the helper function `setAccessibilityFocus` (from utils/accessibility) rather than native calls. This handles the `UIManager` events for Android and `AccessibilityInfo` for iOS automatically. **Whenever possible prioritize laying the page out the way you want it to work for accessibility so that you don’t have to jump through extra, unnecessary complexity.**

#### Developer Testing Tools

Before passing to QA, developers should perform a basic accessibility sweep using some combo of the following:

* **iOS:** Accessibility Inspector (Xcode), VoiceOver, and Voice Control.  
* **Android:** TalkBack and Voice Access.
* **Font Scaling:** Device-level font scaling options set to factory default, and 2x at least.
* **Visual Check:** Use the "Show Inspector" tool in the [React Native debug menu](https://reactnative.dev/docs/debugging) to validate touch target sizes.

The PR template defines core QA artifacts which touch on many high-level accessibility checks.

### QA

The goal of QA is to validate that the built feature meets accessibility acceptance criteria and to verify that the proper process was followed.

#### Process Verification

Before testing the software, verify the "how" of the development process. Document the following to the best of your ability:

* **Research:** Was research conducted with disabled Veterans?  
* **Documentation:** Is the feature clearly described and documented? Do you have the information/understanding necessary to test it including test users and acceptance criteria, journey maps, etc.?  
* **Design:** Did design artifacts include accessibility annotations?  
* **Development:** Did the developer or team engage with the AED team before filing their PR?

#### Testing Environment

* **Hardware:** Test on real devices (iOS and Android), not simulators or emulators, as they are not faithful environments for assistive technology.

#### Execution Steps

Perform the following tests on the feature's primary "happy path" or user journey:

* **Baseline**  
  * Run through the flow using factory default settings, or as close to them as you can comfortably use, in portrait orientation to establish a baseline.  
* **Landscape Orientation**  
  * Run through the flow using factory default settings, or as close to them as you can comfortably use, in landscape orientation.  
* **Font Scaling**  
  * Test the flow with text size increased to 2x
  * Test again with text size increased to 4x (or the device maximum).  
* **Screen Readers**  
  * Return text size to factory default.  
  * Test the flow using the native screen reader (VoiceOver for iOS, TalkBack for Android).  
  * *Tip:* You may toggle on the setting to show narration text on-screen for debugging.  
    * [A Deep dive into VoiceOver settings for iOS and iPadOS](https://www.applevis.com/guides/deep-dive-voiceover-settings-ios-ipados)  
    * [Learn about TalkBack settings](https://support.google.com/accessibility/android/answer/6006589?hl=en)  
    * [SCRCPY](https://scrcpy.org/) is a useful utility for making screen recording of an Android device that include device audio

This outlines the foundation of our accessibility QA process. Every PR must undergo these core steps. While we sometimes explore deeper paths, utilize different assistive technologies, or test various configurations/combinations, this guidance covers the essential, baseline accessibility review.

