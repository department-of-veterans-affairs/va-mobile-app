---
title: Additional Guidance
---

# Beyond WCAG: Additional MCAG Guidance

Although MCAG is based on the success criteria outlined in [WCAG 2.2](https://www.w3.org/TR/WCAG22/), there are many of these guidelines that they have expanded upon to be more inclusive of native mobile apps. The list below includes much of this additional guidance that should be considered when working in the VA: Health and Benefits app.

:::note
MCAG rates each guideline as minor, moderate, severe, or critical. With minor being the least important and critical being the most important.
:::

## 1.1.1. Accessibility Enabled

Assistive technologies can reach, parse, and convey essential content and user-operable elements in the UI.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Assistive technologies can reach and programmatically read all essential content, except when:<br/><ul><li>The content has a nearby equivalent alternative that's accessible to assistive technologies.</li></ul> | **Critical** |
| Assistive technologies can reach and trigger every user-operable element, except when:<br/><ul><li>The element has a nearby equivalent alternative that's operable by assistive technologies.</li></ul>           | **Critical** |

## 1.3.1. Real-time Updates Modalities

Real-time updates including essential status or value changes are conveyed in various modalities so all users can perceive them.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Real-time updates have a visual indication on screen.                                                                                                  | **Critical**            |
| Real-time updates have auditory indications while using the app                                                                                        | **Moderate – Critical** |
| Real-time updates have tactile indications like haptics, unless the user has turned off haptics                                                        | **Moderate – Critical** |
| Time-sensitive real-time updates reflected in push notifications while not using the app, except when users have turned off notification from the app. | **Moderate – Critical** |

## 1.3.2. Perceivable Toasts (Snackbars)

Toast messages (snackbars) are implemented so assistive technologies announce their content and they stay visible for enough time so that all users can fully perceive them.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| The content of toast elements is announced by assistive technologies without the focus shifting to them.               | **Critical**  |
| The font size of toast messages should be at the size of the rest of the application’s body text.                      | **Serious**   |
| Each toast message should stay visible for at least 5 seconds plus one extra second for every 120 words (rounding up). | **Serious**   |

## 1.4.3. Discernible Focus Indication
Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Every interactive UI element and component has a discernible indicator when focused. | **Serious**  |
| Focus indication has a contrast of at least 3:1 with its background.                 | **Serious**  |

## 1.4.4. Distinguished by Color

Avoid relying only on colors to distinguish between elements' state and value or to convey essential information.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Elements distinction does not solely rely on color cues.                                                    | **Serious**  |
| Elements' states distinction does not solely rely on color cues                                             | **Serious**  |
| Conveying information, indicating an action, or prompting a response, are not communicated solely by color. | **Serious**  |

## 2.1.2. Simplified Gestures

User actions that require complex gestures, like path-based or multipoint gestures, have a single-pointer alternative.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| [Path-based gestures](https://getevinced.github.io/mcag/terminology#path-based-gestures) have a single-pointer alternative | **Critical**  |
| [Multipoint gestures](https://getevinced.github.io/mcag/terminology#multipoint-gestures) have a keyboard alternative       | **Critical**  |

## 2.2. External Devices Support

Smartphones are designed with various accessibility features to accommodate users with diverse needs and they often support connectivity with external assistive technology devices.

Some external assistive technology devices that can be connected to smartphones include:

* Braille Displays
* Switch Control Devices
* Eye-tracking Systems
* Augmentative and Alternative Communication (AAC) Devices
* Hearing Aid Compatibility
* Adaptive Keyboards and Input Devices

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| If a smartphone device supports the connection of an external assistive technology device, users can reach and operate controls and other interactive elements of the UI through the assistive technology. | **Critical**  |

## 2.5. Navigable

This guideline addresses the ability of users to quickly and intuitively navigate to any control area and content in the user interface with any user agent or assistive technology supported by the device.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Users can reach essential elements and content using the quick access features of screen readers'[ “Accessibility Navigation Menus”](https://getevinced.github.io/mcag/terminology#accessibility-navigation-menus-on-screen-readers) or similar technology. | **Serious**   |
| Users can navigate sequentially through the screen without getting trapped in navigation loops or dead ends with any user agent and input modality.                                                                                                         | **Critical**  |
| Screens and components do not require two-dimensional scrolling, except when:<br/><ul><li>Two-dimensional scrolling is essential for understanding the content or the application's functionality (e.g., maps, diagrams, large data tables, games)</li></ul>                     | **Serious**   |

## 3.1.1. Screen Titled

Ensure that the mobile application's pivotal screens or primary views, which convey essential information or denote significant content changes, have clear and descriptive textual identifier.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| The screen has a title that's announced by screen readers when the screen loads. | **Serious**  |
| The screen's title describes its context                                         | **Moderate** |
| Screen's title is unique                                                         | **Minor**    |

## 3.1.6. Section Headings

On screens containing different content sections, each section has a heading to organize the content.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| In a screen with a multiple content sections, each section has a heading, except when:<br/><ul><li>The section has another identifier that can be determined and announced programmatically **and**</li><li>Sections are distinguished from each other visually.</li></ul> | **Serious**  |

## 3.3.2. Scaled Text Legibility
When text is scaled to the maximum size allowed by the operating system, it is not clipped, obscured, overlapped, or covered by other texts or elements.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| Text lines do not exceed the viewport width, causing a two-dimensional scroll.                         | **Moderate – Serious** |
| Spaces between paragraphs (on subsequent paragraphs) should be at least two tines of the line spacing. | **Minor**              |

## 3.3.5. Text Lines Length
Text rows are adaptive to the viewport’s width and have a legible length.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| The length of text lines does not exceed the width of the screen borders. | **Serious** |
| Text line lengths do not exceed 70 characters per row, including spaces.  | **Minor**   |

## 3.5.2. Error Suggestion
In cases where user input results in an error and a correction can be made, the error message includes a suggestion for revision.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| When there is an option for it, error messages include suggestions for revision, except when:<br/><ul><li>The information may jeopardize the security or privacy of the user.</li></ul> | **Serious**  |

## 4.1.1. Text Scaling

All text sizes in the UI are updated and adjusted to the text size set by the user in the operating system’s settings.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| In the operating system settings (typically under accessibility), increase the font size to the maximum. The application's texts should resize proportionally according to the user's settings. | **Minor – Serious** |

## 4.1.2. Adaptive Display Modes

The UI and content are adaptive to the operating system’s color modes, such as dark and inverted color modes.

| **Test**                                                                                                                                                   | **Impact**                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| For each display mode supported by the operating system, the UI and its content, including UI elements, texts, and[ images of text](https://getevinced.github.io/mcag/terminology#images-of-text), are adaptive to display mode changes. | **Serious**  |
